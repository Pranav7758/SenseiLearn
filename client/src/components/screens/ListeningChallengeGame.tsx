import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useUserStore } from '@/lib/stores/useUserStore';
import { hiragana } from '@/data/hiragana';
import { katakana } from '@/data/katakana';
import type { KanaCharacter } from '@/data/hiragana';

interface Question {
  character: KanaCharacter;
  options: string[];
  correctAnswer: string;
}

const japaneseWords = [
  { word: 'こんにちは', romaji: 'konnichiwa', meaning: 'Hello' },
  { word: 'ありがとう', romaji: 'arigatou', meaning: 'Thank you' },
  { word: 'さようなら', romaji: 'sayounara', meaning: 'Goodbye' },
  { word: 'おはよう', romaji: 'ohayou', meaning: 'Good morning' },
  { word: 'すみません', romaji: 'sumimasen', meaning: 'Excuse me' },
  { word: 'はい', romaji: 'hai', meaning: 'Yes' },
  { word: 'いいえ', romaji: 'iie', meaning: 'No' },
  { word: 'おねがい', romaji: 'onegai', meaning: 'Please' },
  { word: 'たべる', romaji: 'taberu', meaning: 'To eat' },
  { word: 'のむ', romaji: 'nomu', meaning: 'To drink' },
  { word: 'みる', romaji: 'miru', meaning: 'To see' },
  { word: 'いく', romaji: 'iku', meaning: 'To go' },
];

export function ListeningChallengeGame() {
  const { setScreen, addNotification } = useAppStore();
  const { addXp } = useUserStore();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [kanaType, setKanaType] = useState<'hiragana' | 'katakana' | 'words'>('hiragana');
  
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getCharacters = useCallback(() => {
    if (kanaType === 'hiragana') return hiragana;
    if (kanaType === 'katakana') return katakana;
    return hiragana;
  }, [kanaType]);

  const generateQuestions = useCallback(() => {
    const newQuestions: Question[] = [];
    
    if (kanaType === 'words') {
      for (let i = 0; i < totalQuestions; i++) {
        const correctWord = japaneseWords[Math.floor(Math.random() * japaneseWords.length)];
        const wrongOptions = japaneseWords
          .filter(w => w.word !== correctWord.word)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(w => w.word);
        
        const options = [...wrongOptions, correctWord.word].sort(() => Math.random() - 0.5);
        
        newQuestions.push({
          character: { character: correctWord.word, romaji: correctWord.romaji } as KanaCharacter,
          options,
          correctAnswer: correctWord.word,
        });
      }
    } else {
      const chars = getCharacters();
      for (let i = 0; i < totalQuestions; i++) {
        const correctChar = chars[Math.floor(Math.random() * chars.length)];
        const wrongOptions = chars
          .filter(c => c.character !== correctChar.character)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(c => c.character);
        
        const options = [...wrongOptions, correctChar.character].sort(() => Math.random() - 0.5);
        
        newQuestions.push({
          character: correctChar,
          options,
          correctAnswer: correctChar.character,
        });
      }
    }
    
    setQuestions(newQuestions);
  }, [getCharacters, totalQuestions, kanaType]);

  const speakCharacter = useCallback((text: string, isWord: boolean = false) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = isWord || kanaType === 'words' ? text.replace(/[a-zA-Z]/g, '') : text;
      const japaneseText = kanaType === 'words' 
        ? questions[currentQuestion]?.character.character || text
        : questions[currentQuestion]?.character.character || text;
      const utterance = new SpeechSynthesisUtterance(japaneseText);
      utterance.lang = 'ja-JP';
      utterance.rate = difficulty === 'easy' ? 0.7 : difficulty === 'normal' ? 0.85 : 1;
      speechRef.current = utterance;
      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [difficulty, kanaType, questions, currentQuestion]);

  const startGame = useCallback(() => {
    generateQuestions();
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [generateQuestions]);

  useEffect(() => {
    if (gameState === 'playing' && questions.length > 0 && !showResult) {
      const timer = setTimeout(() => {
        speakCharacter(questions[currentQuestion].character.character, true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentQuestion, questions, showResult, speakCharacter]);

  const handleAnswer = useCallback((answer: string) => {
    if (showResult || !questions[currentQuestion]) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      const basePoints = difficulty === 'easy' ? 10 : difficulty === 'normal' ? 15 : 20;
      const streakBonus = streak * 2;
      setScore(prev => prev + basePoints + streakBonus);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(max => Math.max(max, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
    
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        endGame();
      }
    }, 1500);
  }, [showResult, questions, currentQuestion, difficulty, streak, totalQuestions]);

  const endGame = useCallback(() => {
    setGameState('gameover');
    const xpEarned = Math.floor(score / 5) + maxStreak * 3;
    if (xpEarned > 0) {
      addXp(xpEarned);
      addNotification({
        type: 'success',
        title: 'Challenge Complete!',
        message: `You earned ${xpEarned} XP! Score: ${score}, Best Streak: ${maxStreak}`,
      });
    }
  }, [score, maxStreak, addXp, addNotification]);

  if (gameState === 'menu') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-teal-900/50 to-cyan-900/50 rounded-3xl p-8 border border-teal-500/30"
        >
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">🎧</span>
            <h1 className="text-3xl font-bold text-white">Listening Challenge</h1>
            <p className="text-white/60">聞き取りチャレンジ</p>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-white/80 text-sm block mb-2">Content Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['hiragana', 'katakana', 'words'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setKanaType(type)}
                    className={`py-2 rounded-lg font-medium transition-all capitalize ${
                      kanaType === type
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white/80 text-sm block mb-2">Speed</label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'normal', 'hard'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-lg font-medium transition-all capitalize ${
                      difficulty === diff
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {diff === 'easy' ? 'Slow' : diff === 'normal' ? 'Normal' : 'Fast'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl font-bold text-lg transition-all"
            >
              Start Challenge
            </button>
            <button
              onClick={() => setScreen('games')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
            >
              Back to Games
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-8 border border-white/20 text-center"
        >
          <span className="text-6xl mb-4 block">🎧</span>
          <h1 className="text-3xl font-bold text-white mb-2">Challenge Complete!</h1>
          
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">{score}</p>
              <p className="text-white/60 text-sm">Final Score</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-teal-400">{maxStreak}</p>
              <p className="text-white/60 text-sm">Best Streak</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl font-bold transition-all"
            >
              Play Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
            >
              Change Settings
            </button>
            <button
              onClick={() => setScreen('games')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
            >
              Back to Games
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="fixed inset-0 pt-16 pb-20 px-4 md:px-8 lg:px-12 flex flex-col overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 w-full max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              setGameState('menu');
            }}
            className="text-white/60 hover:text-white transition-all"
          >
            ← Exit
          </button>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-white">{score}</p>
              <p className="text-xs text-white/60">Score</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-teal-400">{streak}🔥</p>
              <p className="text-xs text-white/60">Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-full h-2 mb-6 flex-shrink-0">
          <motion.div
            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 rounded-3xl p-6 md:p-8 border border-teal-500/20 mb-6 flex-shrink-0"
        >
          <p className="text-white/60 text-center mb-4">
            Question {currentQuestion + 1} of {totalQuestions}
          </p>
          
          <div className="text-center mb-6">
            <p className="text-white/80 mb-4">Listen and select the correct character</p>
            <button
              onClick={() => question && speakCharacter(question.character.romaji)}
              disabled={isPlaying}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mx-auto transition-all ${
                isPlaying ? 'scale-110 animate-pulse' : 'hover:scale-105'
              }`}
            >
              <span className="text-4xl">{isPlaying ? '🔊' : '🔈'}</span>
            </button>
            <p className="text-white/40 text-sm mt-2">Tap to replay</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 flex-shrink-0">
          <AnimatePresence mode="wait">
            {question?.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;
              
              return (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`p-5 md:p-6 rounded-2xl text-3xl md:text-4xl font-bold transition-all ${
                    showCorrect
                      ? 'bg-green-500/30 border-2 border-green-500 text-green-300'
                      : showWrong
                      ? 'bg-red-500/30 border-2 border-red-500 text-red-300'
                      : 'bg-white/10 border-2 border-transparent hover:bg-white/20 text-white'
                  }`}
                >
                  {option}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
