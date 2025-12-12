import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useQuizStore, generateKanaQuestions } from '@/lib/stores/useQuizStore';
import { hiragana, hiraganaDakuten, hiraganaRows } from '@/data/hiragana';
import { katakana, katakanaDakuten, katakanaRows } from '@/data/katakana';
import type { KanaCharacter } from '@/data/hiragana';

interface KanaScreenProps {
  type: 'hiragana' | 'katakana';
}

export function KanaScreen({ type }: KanaScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'learn' | 'quiz'>('overview');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [quizMode, setQuizMode] = useState<'recognition' | 'typing'>('recognition');
  
  const { characterProgress, getMasteredCount, getWeakCharacters, settings } = useUserStore();
  const { startLearnMode, setScreen } = useAppStore();
  const { startQuiz } = useQuizStore();

  const characters = type === 'hiragana' ? hiragana : katakana;
  const dakutenChars = type === 'hiragana' ? hiraganaDakuten : katakanaDakuten;
  const allChars = [...characters, ...dakutenChars];
  const rows = type === 'hiragana' ? hiraganaRows : katakanaRows;

  const masteredCount = getMasteredCount(type);
  const weakChars = getWeakCharacters(type);
  const totalChars = characters.length;

  // Find the first non-mastered character index to continue learning from (includes dakuten)
  const getFirstNonMasteredIndex = () => {
    // Use base characters only since that's what LearnScreen uses for this type
    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      const key = `${type}-${char.character}`;
      const progress = characterProgress[key];
      if (!progress || !progress.mastered) {
        return i;
      }
    }
    return 0; // All mastered, start from beginning for review
  };

  const getCharacterStatus = (char: KanaCharacter) => {
    const key = `${type}-${char.character}`;
    const progress = characterProgress[key];
    if (!progress) return 'unseen';
    if (progress.mastered) return 'mastered';
    if (progress.isWeak) return 'weak';
    return 'seen';
  };

  const charactersByRow = useMemo(() => {
    const grouped: Record<string, KanaCharacter[]> = {};
    characters.forEach((char) => {
      if (!grouped[char.row]) grouped[char.row] = [];
      grouped[char.row].push(char);
    });
    return grouped;
  }, [characters]);

  const handleStartQuiz = () => {
    let quizChars = allChars;
    if (selectedRows.length > 0) {
      quizChars = allChars.filter((c) => selectedRows.includes(c.row));
    }
    if (quizChars.length < 4) {
      alert('Please select at least one row with 4+ characters');
      return;
    }
    const questions = generateKanaQuestions(quizChars, 10, quizMode);
    startQuiz(type, questions, settings.quizInterval);
    setScreen('quiz');
  };

  const handleFocusWeak = () => {
    if (weakChars.length < 4) {
      alert('You need at least 4 weak characters to start a focused quiz');
      return;
    }
    const weakKanaChars = allChars.filter((c) => 
      weakChars.some((w) => w.character === c.character)
    );
    const questions = generateKanaQuestions(weakKanaChars, 10, 'recognition');
    startQuiz(type, questions, settings.quizInterval);
    setScreen('quiz');
  };

  const title = type === 'hiragana' ? 'Hiragana' : 'Katakana';
  const titleJp = type === 'hiragana' ? 'ひらがな' : 'カタカナ';

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
              <h1 className="text-3xl font-bold text-white">{title} Trainer</h1>
              <p className="text-white/60">{titleJp}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{masteredCount} / {totalChars}</p>
              <p className="text-sm text-white/60">Characters Mastered</p>
            </div>
          </div>

          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${
                type === 'hiragana' 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${(masteredCount / totalChars) * 100}%` }}
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
              className="space-y-6"
            >
              {Object.entries(charactersByRow).map(([row, chars]) => (
                <div key={row} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-3 capitalize">{row}</h3>
                  <div className="flex flex-wrap gap-2">
                    {chars.map((char) => {
                      const status = getCharacterStatus(char);
                      return (
                        <div
                          key={char.character}
                          className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all ${
                            status === 'mastered' ? 'bg-green-500/30 border-green-500/50' :
                            status === 'weak' ? 'bg-red-500/30 border-red-500/50' :
                            status === 'seen' ? 'bg-blue-500/30 border-blue-500/50' :
                            'bg-white/10 border-white/20'
                          } border`}
                        >
                          <span className="text-xl text-white">{char.character}</span>
                          {settings.showRomaji && (
                            <span className="text-xs text-white/60">{char.romaji}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {weakChars.length > 0 && (
                <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-red-400">Weak Characters</h3>
                    <button
                      onClick={handleFocusWeak}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      Focus Practice
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {weakChars.map((char) => (
                      <div
                        key={char.character}
                        className="w-12 h-12 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center"
                      >
                        <span className="text-lg text-white">{char.character}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <h2 className="text-2xl font-bold text-white mb-4">Learn Mode</h2>
                <p className="text-white/70 mb-8">
                  Study each character with stroke order, readings, and practice drawing
                </p>
                <button
                  onClick={() => startLearnMode(type, getFirstNonMasteredIndex())}
                  className={`px-8 py-4 rounded-xl text-lg font-bold text-white transition-all ${
                    type === 'hiragana'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                  }`}
                >
                  {masteredCount > 0 ? 'Continue Learning' : 'Start Learning'}
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
                <h3 className="text-lg font-medium text-white mb-4">Quiz Mode</h3>
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setQuizMode('recognition')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      quizMode === 'recognition'
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Recognition (Multiple Choice)
                  </button>
                  <button
                    onClick={() => setQuizMode('typing')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      quizMode === 'typing'
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Typing (Input Answer)
                  </button>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">Select Rows (optional)</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.from(rows).map((row) => (
                    <button
                      key={row}
                      onClick={() => {
                        setSelectedRows((prev) =>
                          prev.includes(row)
                            ? prev.filter((r) => r !== row)
                            : [...prev, row]
                        );
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                        selectedRows.includes(row)
                          ? 'bg-white text-gray-900'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {row}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-white/60">
                  {selectedRows.length === 0 
                    ? 'All rows selected' 
                    : `${selectedRows.length} row(s) selected`}
                </p>
              </div>

              <button
                onClick={handleStartQuiz}
                className={`w-full py-4 rounded-xl text-lg font-bold text-white transition-all ${
                  type === 'hiragana'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                }`}
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
