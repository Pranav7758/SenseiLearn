import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useQuizStore, generateKanaQuestions } from '@/lib/stores/useQuizStore';
import { hiragana, allHiragana } from '@/data/hiragana';
import { katakana, allKatakana } from '@/data/katakana';
import { allKanji } from '@/data/kanji';
import { grammarTopics } from '@/data/grammar';
import { getCoachAdvice, sendChatMessage, type CoachAdvice } from '@/lib/gemini';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'grammar';
  icon: string;
  action: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function CoachScreen() {
  const [coachMessage, setCoachMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [aiAdvice, setAiAdvice] = useState<CoachAdvice | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const hasFetched = useRef(false);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    xp, 
    level, 
    streak, 
    getMasteredCount, 
    getWeakCharacters, 
    characterProgress,
    grammarProgress,
    settings,
  } = useUserStore();
  const { setScreen, startLearnMode } = useAppStore();
  const { startQuiz } = useQuizStore();

  const hiraganaProgress = getMasteredCount('hiragana');
  const katakanaProgress = getMasteredCount('katakana');
  const kanjiProgress = getMasteredCount('kanji');
  const weakHiragana = getWeakCharacters('hiragana');
  const weakKatakana = getWeakCharacters('katakana');
  const weakKanji = getWeakCharacters('kanji');

  const grammarMastered = useMemo(() => {
    return Object.values(grammarProgress).filter((p) => p.mastered).length;
  }, [grammarProgress]);

  const allWeakCharacters = useMemo(() => {
    return [...weakHiragana, ...weakKatakana, ...weakKanji].map((c) => c.character);
  }, [weakHiragana, weakKatakana, weakKanji]);

  const recentAccuracy = useMemo(() => {
    const allProgress = Object.values(characterProgress);
    if (allProgress.length === 0) return 0;
    return Math.round(allProgress.reduce((acc, p) => acc + p.accuracy, 0) / allProgress.length);
  }, [characterProgress]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAiAdvice = async () => {
      setIsLoadingAi(true);
      try {
        const advice = await getCoachAdvice({
          level,
          xp,
          streak,
          hiraganaProgress,
          katakanaProgress,
          kanjiProgress,
          grammarProgress: grammarMastered,
          weakCharacters: allWeakCharacters.slice(0, 10),
          recentAccuracy,
        });
        setAiAdvice(advice);
        
        const message = advice.greeting + ' ' + advice.analysis;
        setIsTyping(true);
        let index = 0;
        
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        
        typingIntervalRef.current = setInterval(() => {
          if (index <= message.length) {
            setCoachMessage(message.slice(0, index));
            index++;
          } else {
            setIsTyping(false);
            if (typingIntervalRef.current) {
              clearInterval(typingIntervalRef.current);
            }
          }
        }, 25);
      } catch (error) {
        console.error('Failed to get AI advice:', error);
        setCoachMessage("Welcome back! Let's continue your Japanese learning journey!");
        setIsTyping(false);
      } finally {
        setIsLoadingAi(false);
      }
    };

    fetchAiAdvice();

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim() || isSendingChat) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsSendingChat(true);

    try {
      const response = await sendChatMessage(userMessage, {
        level,
        hiraganaProgress,
        katakanaProgress,
        kanjiProgress,
      });
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble responding right now. Please try again!" 
      }]);
    } finally {
      setIsSendingChat(false);
    }
  }, [chatInput, isSendingChat, level, hiraganaProgress, katakanaProgress, kanjiProgress]);

  const recommendations = useMemo((): Recommendation[] => {
    const recs: Recommendation[] = [];

    if (weakHiragana.length >= 4) {
      recs.push({
        id: 'weak-hiragana',
        title: 'Hiragana Weak Character Practice',
        description: `Focus on ${weakHiragana.length} characters you find challenging`,
        type: 'hiragana',
        icon: '🎯',
        action: () => {
          const weakChars = allHiragana.filter((c) => 
            weakHiragana.some((w) => w.character === c.character)
          );
          const questions = generateKanaQuestions(weakChars, 10, 'recognition');
          startQuiz('hiragana', questions, settings.quizInterval);
          setScreen('quiz');
        },
      });
    }

    if (hiraganaProgress < 46) {
      recs.push({
        id: 'continue-hiragana',
        title: 'Continue Hiragana',
        description: `Learn more characters (${hiraganaProgress}/${hiragana.length} mastered)`,
        type: 'hiragana',
        icon: 'あ',
        action: () => startLearnMode('hiragana'),
      });
    }

    if (hiraganaProgress >= 20 && katakanaProgress < 46) {
      recs.push({
        id: 'learn-katakana',
        title: 'Learn Katakana',
        description: `Expand your knowledge (${katakanaProgress}/${katakana.length} mastered)`,
        type: 'katakana',
        icon: 'ア',
        action: () => startLearnMode('katakana'),
      });
    }

    if (hiraganaProgress >= 30 || katakanaProgress >= 30) {
      recs.push({
        id: 'quick-quiz',
        title: '10-Question Speed Drill',
        description: `Quick practice at ${settings.quizInterval}s per question`,
        type: hiraganaProgress > katakanaProgress ? 'hiragana' : 'katakana',
        icon: '⚡',
        action: () => {
          const chars = hiraganaProgress > katakanaProgress ? hiragana : katakana;
          const type = hiraganaProgress > katakanaProgress ? 'hiragana' : 'katakana';
          const questions = generateKanaQuestions(chars, 10, 'recognition');
          startQuiz(type, questions, settings.quizInterval);
          setScreen('quiz');
        },
      });
    }

    if ((hiraganaProgress >= 30 && katakanaProgress >= 30) || kanjiProgress > 0) {
      recs.push({
        id: 'learn-kanji',
        title: 'Study Kanji',
        description: `Learn Chinese characters (${kanjiProgress}/${allKanji.length} mastered)`,
        type: 'kanji',
        icon: '漢',
        action: () => startLearnMode('kanji'),
      });
    }

    if (grammarMastered < grammarTopics.length) {
      recs.push({
        id: 'practice-grammar',
        title: 'Grammar Practice',
        description: `Learn sentence structure (${grammarMastered}/${grammarTopics.length} topics)`,
        type: 'grammar',
        icon: '📖',
        action: () => setScreen('grammar'),
      });
    }

    return recs.slice(0, 4);
  }, [hiraganaProgress, katakanaProgress, kanjiProgress, grammarMastered, weakHiragana, settings.quizInterval]);

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'hiragana': return 'from-pink-500 to-rose-600';
      case 'katakana': return 'from-blue-500 to-indigo-600';
      case 'kanji': return 'from-purple-500 to-violet-600';
      case 'grammar': return 'from-emerald-500 to-teal-600';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Sensei Coach</h1>
          <p className="text-white/60">先生 - Your AI-powered learning advisor</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl p-8 mb-8 border border-cyan-500/30"
        >
          <div className="flex items-start space-x-4">
            <motion.div 
              animate={{ 
                rotate: [0, -5, 5, -5, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3 
              }}
              className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
            >
              👨‍🏫
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-white">Sensei Says:</h3>
                {isLoadingAi && (
                  <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full">
                    AI analyzing...
                  </span>
                )}
              </div>
              <p className="text-white/90 text-lg">
                {coachMessage}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>
          </div>
        </motion.div>

        {aiAdvice && !isLoadingAi && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 mb-8 border border-yellow-500/20"
          >
            <h3 className="text-lg font-medium text-yellow-400 mb-3">📌 AI Recommendations</h3>
            <ul className="space-y-2">
              {aiAdvice.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-400">•</span>
                  <span className="text-white/80">{rec}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-white/60 italic">"{aiAdvice.motivationalQuote}"</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <p className="text-3xl font-bold text-pink-400">{hiraganaProgress}</p>
              <p className="text-sm text-white/60">Hiragana Mastered</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <p className="text-3xl font-bold text-blue-400">{katakanaProgress}</p>
              <p className="text-sm text-white/60">Katakana Mastered</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <p className="text-3xl font-bold text-purple-400">{kanjiProgress}</p>
              <p className="text-sm text-white/60">Kanji Learned</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <p className="text-3xl font-bold text-green-400">{grammarMastered}</p>
              <p className="text-sm text-white/60">Grammar Topics</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <motion.button
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={rec.action}
                className={`p-6 rounded-xl text-left transition-all bg-gradient-to-br ${getTypeColor(rec.type)} hover:scale-[1.02]`}
              >
                <div className="flex items-start space-x-4">
                  <span className="text-4xl">{rec.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{rec.title}</h3>
                    <p className="text-sm text-white/80">{rec.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-6 border border-cyan-500/20"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>💬</span> Ask Sensei
          </h2>
          <p className="text-white/60 text-sm mb-4">
            Have questions about Japanese? Ask me anything about characters, words, grammar, or learning tips!
          </p>
          
          <div className="bg-black/30 rounded-xl p-4 mb-4 max-h-64 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <div className="text-center text-white/40 py-8">
                <p>Start a conversation with Sensei!</p>
                <p className="text-sm mt-2">Try: "How do I say hello in Japanese?"</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-cyan-500/30 text-white'
                          : 'bg-white/10 text-white/90'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <span className="text-xs text-cyan-400 block mb-1">Sensei</span>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isSendingChat && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-2xl px-4 py-2">
                      <span className="text-xs text-cyan-400 block mb-1">Sensei</span>
                      <p className="text-sm text-white/60 animate-pulse">Thinking...</p>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about Japanese..."
              disabled={isSendingChat}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSendingChat || !chatInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all"
            >
              Send
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-bold text-white mb-4">Learning Tips</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-xl">💡</span>
              <p className="text-white/80">Practice a little every day - consistency beats intensity!</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">✍️</span>
              <p className="text-white/80">Use the drawing practice to reinforce muscle memory for each character.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">🎯</span>
              <p className="text-white/80">Focus on weak characters - they need extra attention to stick!</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">📅</span>
              <p className="text-white/80">Complete the Daily Challenge for bonus XP and to maintain your streak!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
