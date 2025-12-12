import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useQuizStore, generateKanaQuestions, generateKanjiQuestions, generateGrammarQuestions } from '@/lib/stores/useQuizStore';
import { hiragana } from '@/data/hiragana';
import { katakana } from '@/data/katakana';
import { allKanji } from '@/data/kanji';
import { grammarTopics } from '@/data/grammar';

export function DailyChallengeScreen() {
  const [isStarting, setIsStarting] = useState(false);
  
  const { dailyChallengeCompleted, dailyChallengeDate, streak, settings } = useUserStore();
  const { setScreen } = useAppStore();
  const { startQuiz } = useQuizStore();

  const today = new Date().toISOString().split('T')[0];
  const isCompleted = dailyChallengeDate === today && dailyChallengeCompleted;

  const handleStartChallenge = () => {
    setIsStarting(true);

    const hiraganaQuestions = generateKanaQuestions(hiragana, 5, 'recognition');
    const katakanaQuestions = generateKanaQuestions(katakana, 5, 'recognition');
    const kanjiQuestions = generateKanjiQuestions(allKanji, 5, 'meaning');
    
    const allGrammarQuestions = grammarTopics.flatMap((t) => t.questions);
    const grammarQuestions = generateGrammarQuestions(allGrammarQuestions, 5);

    const allQuestions = [
      ...hiraganaQuestions.map((q) => ({ ...q, type: 'recognition' as const })),
      ...katakanaQuestions.map((q) => ({ ...q, type: 'recognition' as const })),
      ...kanjiQuestions,
      ...grammarQuestions,
    ].sort(() => Math.random() - 0.5);

    startQuiz('daily', allQuestions, settings.quizInterval);
    setScreen('quiz');
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-md rounded-3xl p-8 border border-orange-500/30 text-center"
        >
          <motion.div
            animate={{ 
              rotate: isCompleted ? 0 : [0, -10, 10, -10, 10, 0],
              scale: isCompleted ? 1 : [1, 1.1, 1],
            }}
            transition={{ 
              duration: 0.5,
              repeat: isCompleted ? 0 : Infinity,
              repeatDelay: 3,
            }}
            className="text-8xl mb-6"
          >
            {isCompleted ? '✅' : '📅'}
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-2">
            {isCompleted ? 'Challenge Complete!' : 'Daily Challenge'}
          </h1>
          <p className="text-xl text-white/80 mb-2">今日の挑戦</p>
          <p className="text-white/60 mb-6">
            {isCompleted 
              ? 'Great job! Come back tomorrow for another challenge.'
              : '20 mixed questions across all topics'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold text-orange-400">🔥 {streak}</p>
              <p className="text-xs text-white/60">Current Streak</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold text-yellow-400">1.5x</p>
              <p className="text-xs text-white/60">XP Multiplier</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold text-white">20</p>
              <p className="text-xs text-white/60">Questions</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <p className="text-sm text-white/80 mb-2">Topics included:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-pink-500/30 rounded-full text-sm text-pink-300">Hiragana</span>
              <span className="px-3 py-1 bg-blue-500/30 rounded-full text-sm text-blue-300">Katakana</span>
              <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm text-purple-300">Kanji</span>
              <span className="px-3 py-1 bg-green-500/30 rounded-full text-sm text-green-300">Grammar</span>
            </div>
          </div>

          {!isCompleted ? (
            <button
              onClick={handleStartChallenge}
              disabled={isStarting}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg transition-all"
            >
              {isStarting ? 'Loading...' : 'Start Challenge'}
            </button>
          ) : (
            <button
              onClick={() => setScreen('home')}
              className="w-full py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-lg transition-all"
            >
              Return Home
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
