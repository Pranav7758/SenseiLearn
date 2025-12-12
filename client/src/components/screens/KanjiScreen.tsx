import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useQuizStore, generateKanjiQuestions } from '@/lib/stores/useQuizStore';
import { allKanji } from '@/data/kanji';

export function KanjiScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'learn' | 'quiz'>('overview');
  const [quizType, setQuizType] = useState<'meaning' | 'reading'>('meaning');
  
  const { characterProgress, getMasteredCount, settings } = useUserStore();
  const { startLearnMode, setScreen } = useAppStore();
  const { startQuiz } = useQuizStore();

  const masteredCount = getMasteredCount('kanji');

  const getCharacterStatus = (character: string) => {
    const key = `kanji-${character}`;
    const progress = characterProgress[key];
    if (!progress) return 'unseen';
    if (progress.mastered) return 'mastered';
    if (progress.isWeak) return 'weak';
    return 'seen';
  };

  const handleStartQuiz = () => {
    const questions = generateKanjiQuestions(allKanji, 10, quizType);
    startQuiz('kanji', questions, settings.quizInterval);
    setScreen('quiz');
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Kanji Trainer</h1>
              <p className="text-white/60">漢字</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{masteredCount} / {allKanji.length}</p>
              <p className="text-sm text-white/60">Characters Mastered</p>
            </div>
          </div>

          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(masteredCount / allKanji.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        <div className="flex space-x-2 mb-6">
          {(['overview', 'learn', 'quiz'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-gray-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {allKanji.map((kanji) => {
                const status = getCharacterStatus(kanji.character);
                return (
                  <motion.div
                    key={kanji.character}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      status === 'mastered' ? 'bg-green-500/20 border-green-500/40' :
                      status === 'weak' ? 'bg-red-500/20 border-red-500/40' :
                      status === 'seen' ? 'bg-blue-500/20 border-blue-500/40' :
                      'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <p className="text-4xl text-center text-white mb-2">{kanji.character}</p>
                    <p className="text-sm text-center text-white/70 truncate">{kanji.meaning}</p>
                    <div className="mt-2 flex justify-center space-x-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        status === 'mastered' ? 'bg-green-500/30 text-green-300' :
                        status === 'weak' ? 'bg-red-500/30 text-red-300' :
                        status === 'seen' ? 'bg-blue-500/30 text-blue-300' :
                        'bg-white/10 text-white/50'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <span className="text-6xl mb-6 block">📝</span>
                <h2 className="text-2xl font-bold text-white mb-4">Learn Kanji</h2>
                <p className="text-white/70 mb-8">
                  Study each kanji with readings, meanings, examples, and practice writing
                </p>
                <button
                  onClick={() => startLearnMode('kanji')}
                  className="px-8 py-4 rounded-xl text-lg font-bold text-white transition-all bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                >
                  Start Learning
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">Quiz Type</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setQuizType('meaning')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      quizType === 'meaning'
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Meaning Quiz
                  </button>
                  <button
                    onClick={() => setQuizType('reading')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      quizType === 'reading'
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Reading Quiz
                  </button>
                </div>
              </div>

              <button
                onClick={handleStartQuiz}
                className="w-full py-4 rounded-xl text-lg font-bold text-white transition-all bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
              >
                Start Quiz ({settings.quizInterval}s per question)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
