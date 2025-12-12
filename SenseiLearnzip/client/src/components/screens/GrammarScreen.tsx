import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useQuizStore, generateGrammarQuestions } from '@/lib/stores/useQuizStore';
import { grammarTopics } from '@/data/grammar';

export function GrammarScreen() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const { grammarProgress, settings } = useUserStore();
  const { setScreen } = useAppStore();
  const { startQuiz } = useQuizStore();

  const getTopicStatus = (topicId: string) => {
    const progress = grammarProgress[topicId];
    if (!progress) return 'unseen';
    if (progress.mastered) return 'mastered';
    return 'in-progress';
  };

  const handleStartQuiz = (topicId: string) => {
    const topic = grammarTopics.find((t) => t.id === topicId);
    if (!topic) return;
    const questions = generateGrammarQuestions(topic.questions, topic.questions.length);
    startQuiz('grammar', questions, settings.quizInterval + 2);
    setScreen('quiz');
  };

  const topic = grammarTopics.find((t) => t.id === selectedTopic);

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Grammar Lessons</h1>
          <p className="text-white/60">文法 - Learn Japanese sentence structure</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedTopic ? (
            <motion.div
              key="topics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {grammarTopics.map((topic, index) => {
                const status = getTopicStatus(topic.id);
                const progress = grammarProgress[topic.id];
                return (
                  <motion.button
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`p-6 rounded-xl text-left transition-all border ${
                      status === 'mastered' 
                        ? 'bg-green-500/20 border-green-500/40 hover:border-green-500/60' 
                        : status === 'in-progress'
                          ? 'bg-blue-500/20 border-blue-500/40 hover:border-blue-500/60'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                        <p className="text-2xl text-white/80">{topic.titleJp}</p>
                      </div>
                      {status === 'mastered' && (
                        <span className="text-2xl">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-white/60 line-clamp-2">{topic.explanation}</p>
                    {progress && (
                      <div className="mt-3 flex items-center space-x-2">
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${progress.accuracy}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/60">{progress.accuracy}%</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setSelectedTopic(null)}
                className="mb-6 text-white/60 hover:text-white transition-all flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to topics</span>
              </button>

              {topic && (
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-1">{topic.title}</h2>
                    <p className="text-3xl text-white/80 mb-4">{topic.titleJp}</p>
                    <p className="text-white/70">{topic.explanation}</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-4">Examples</h3>
                    <div className="space-y-4">
                      {topic.examples.map((example, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/5 rounded-xl p-4"
                        >
                          <p className="text-xl text-white mb-1">{example.japanese}</p>
                          <p className="text-sm text-white/60 mb-1">{example.romaji}</p>
                          <p className="text-sm text-white/80">{example.english}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(topic.id)}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-lg transition-all"
                  >
                    Practice Quiz ({topic.questions.length} questions)
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
