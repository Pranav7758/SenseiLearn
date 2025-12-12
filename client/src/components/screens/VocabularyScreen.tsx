import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useUserStore } from '@/lib/stores/useUserStore';
import { 
  allVocabulary, 
  getVocabularyByLevel, 
  getVocabularyCount, 
  getCategories,
  type JLPTLevel,
  type VocabularyWord 
} from '@/data/vocabulary';

type ViewMode = 'overview' | 'list' | 'flashcard' | 'quiz';

const JLPT_LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

const levelColors: Record<JLPTLevel, { bg: string; border: string; text: string }> = {
  N5: { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/50', text: 'text-emerald-400' },
  N4: { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/50', text: 'text-blue-400' },
  N3: { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/50', text: 'text-purple-400' },
  N2: { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/50', text: 'text-amber-400' },
  N1: { bg: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-500/50', text: 'text-rose-400' },
};

export function VocabularyScreen() {
  const { setScreen } = useAppStore();
  const { vocabularyProgress, updateVocabularyProgress, addXp } = useUserStore();
  
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizWord, setQuizWord] = useState<VocabularyWord | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);

  const words = useMemo(() => {
    const levelWords = getVocabularyByLevel(selectedLevel);
    if (selectedCategory) {
      return levelWords.filter(w => w.category === selectedCategory);
    }
    return levelWords;
  }, [selectedLevel, selectedCategory]);

  const categories = useMemo(() => getCategories(selectedLevel), [selectedLevel]);

  useEffect(() => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
  }, [selectedLevel, selectedCategory]);

  const getProgressForLevel = (level: JLPTLevel) => {
    const levelWords = getVocabularyByLevel(level);
    const mastered = levelWords.filter(w => 
      vocabularyProgress[w.id]?.mastered
    ).length;
    return { mastered, total: levelWords.length };
  };

  const getMasteredInCategory = (category: string) => {
    const categoryWords = words.filter(w => w.category === category);
    return categoryWords.filter(w => vocabularyProgress[w.id]?.mastered).length;
  };

  const startFlashcards = () => {
    if (words.length === 0) return;
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setViewMode('flashcard');
  };

  const nextCard = () => {
    if (currentCardIndex < words.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const markCardKnown = (known: boolean) => {
    const word = words[currentCardIndex];
    if (!word) return;
    updateVocabularyProgress(word.id, selectedLevel, known);
    if (known) {
      addXp(5);
    }
    nextCard();
  };

  const startQuiz = () => {
    if (words.length < 4) return;
    generateQuizQuestion();
    setViewMode('quiz');
  };

  const generateQuizQuestion = () => {
    if (words.length < 4) return;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setQuizWord(randomWord);
    
    const wrongAnswers = words
      .filter(w => w.id !== randomWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meaning);
    
    const options = [...wrongAnswers, randomWord.meaning].sort(() => Math.random() - 0.5);
    setQuizOptions(options);
    setQuizAnswered(false);
    setQuizCorrect(false);
  };

  const handleQuizAnswer = (answer: string) => {
    if (quizAnswered || !quizWord) return;
    
    const correct = answer === quizWord.meaning;
    setQuizAnswered(true);
    setQuizCorrect(correct);
    updateVocabularyProgress(quizWord.id, selectedLevel, correct);
    
    if (correct) {
      addXp(10);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-2 mb-6">
        {JLPT_LEVELS.map(level => {
          const progress = getProgressForLevel(level);
          const percentage = progress.total > 0 ? Math.round((progress.mastered / progress.total) * 100) : 0;
          const colors = levelColors[level];
          
          return (
            <motion.button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`p-3 rounded-xl border ${colors.border} bg-gradient-to-br ${colors.bg} ${
                selectedLevel === level ? 'ring-2 ring-white/30' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`text-lg font-bold ${colors.text}`}>{level}</div>
              <div className="text-xs text-gray-400">{progress.mastered}/{progress.total}</div>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-1">
                <div 
                  className={`h-full rounded-full ${colors.text.replace('text', 'bg')}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="bg-[#1a1a2e]/80 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${levelColors[selectedLevel].text}`}>
            {selectedLevel} Vocabulary
          </h3>
          <span className="text-sm text-gray-400">
            {getProgressForLevel(selectedLevel).mastered} / {getProgressForLevel(selectedLevel).total} mastered
          </span>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              !selectedCategory ? 'bg-amber-500 text-black' : 'bg-gray-700 text-gray-300'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                selectedCategory === cat ? 'bg-amber-500 text-black' : 'bg-gray-700 text-gray-300'
              }`}
            >
              {cat} ({getMasteredInCategory(cat)})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.button
            onClick={() => setViewMode('list')}
            className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl">📚</span>
            <div className="text-sm font-medium text-blue-400 mt-1">Browse</div>
            <div className="text-xs text-gray-500">{words.length} words</div>
          </motion.button>

          <motion.button
            onClick={startFlashcards}
            disabled={words.length === 0}
            className={`p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl ${
              words.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            whileHover={words.length > 0 ? { scale: 1.02 } : {}}
            whileTap={words.length > 0 ? { scale: 0.98 } : {}}
          >
            <span className="text-2xl">🃏</span>
            <div className="text-sm font-medium text-purple-400 mt-1">Flashcards</div>
            <div className="text-xs text-gray-500">{words.length === 0 ? 'No words' : 'Memorize'}</div>
          </motion.button>

          <motion.button
            onClick={startQuiz}
            disabled={words.length < 4}
            className={`p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl ${
              words.length < 4 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            whileHover={words.length >= 4 ? { scale: 1.02 } : {}}
            whileTap={words.length >= 4 ? { scale: 0.98 } : {}}
          >
            <span className="text-2xl">🎯</span>
            <div className="text-sm font-medium text-emerald-400 mt-1">Quiz</div>
            <div className="text-xs text-gray-500">{words.length < 4 ? 'Need 4+ words' : 'Test yourself'}</div>
          </motion.button>
        </div>
      </div>

      <div className="bg-[#1a1a2e]/80 rounded-2xl p-4 border border-white/10">
        <h3 className="text-lg font-bold text-amber-400 mb-3">💡 Learning Tips</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            Use flashcards daily to build long-term memory
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            Focus on one category at a time for deeper learning
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">•</span>
            Take the quiz after reviewing to test retention
          </li>
        </ul>
      </div>
    </div>
  );

  const renderList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewMode('overview')}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <span>←</span> Back
        </button>
        <h3 className={`text-lg font-bold ${levelColors[selectedLevel].text}`}>
          {selectedLevel} {selectedCategory ? `- ${selectedCategory}` : ''} ({words.length} words)
        </h3>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        {words.map((word, index) => {
          const progress = vocabularyProgress[word.id];
          const isMastered = progress?.mastered;
          
          return (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`p-3 rounded-xl border ${
                isMastered 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-[#1a1a2e]/80 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white">{word.word}</span>
                  <span className="text-gray-400">{word.reading}</span>
                  <span className="text-xs text-gray-500">({word.romaji})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">{word.meaning}</span>
                  {isMastered && <span className="text-emerald-400">✓</span>}
                </div>
              </div>
              {word.example && (
                <div className="mt-2 text-xs text-gray-500">
                  例: {word.example.japanese} - {word.example.english}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderFlashcard = () => {
    const currentWord = words[currentCardIndex];
    if (!currentWord) return null;

    const progress = vocabularyProgress[currentWord.id];
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex items-center justify-between w-full mb-4">
          <button
            onClick={() => setViewMode('overview')}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <span>←</span> Back
          </button>
          <span className="text-gray-400">
            {currentCardIndex + 1} / {words.length}
          </span>
        </div>

        <motion.div
          key={currentCardIndex}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: showAnswer ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => setShowAnswer(!showAnswer)}
          className={`w-full max-w-md h-64 cursor-pointer perspective-1000`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div 
            className={`absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center border-2 ${levelColors[selectedLevel].border} bg-gradient-to-br ${levelColors[selectedLevel].bg} backface-hidden`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-5xl font-bold text-white mb-2">{currentWord.word}</span>
            <span className="text-xl text-gray-400">{currentWord.reading}</span>
            <span className="text-sm text-gray-500 mt-2">Tap to reveal</span>
          </div>

          <div 
            className={`absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center border-2 ${levelColors[selectedLevel].border} bg-gradient-to-br ${levelColors[selectedLevel].bg}`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-3xl font-bold text-white mb-2">{currentWord.meaning}</span>
            <span className="text-lg text-gray-400">{currentWord.romaji}</span>
            <span className={`text-xs px-2 py-1 rounded-full mt-3 ${
              currentWord.partOfSpeech === 'verb' ? 'bg-blue-500/20 text-blue-400' :
              currentWord.partOfSpeech === 'noun' ? 'bg-purple-500/20 text-purple-400' :
              currentWord.partOfSpeech === 'adjective' ? 'bg-amber-500/20 text-amber-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {currentWord.partOfSpeech}
            </span>
          </div>
        </motion.div>

        <div className="flex gap-4 mt-6">
          <motion.button
            onClick={() => markCardKnown(false)}
            className="px-6 py-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ❌ Don't Know
          </motion.button>
          <motion.button
            onClick={() => markCardKnown(true)}
            className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✓ Got It!
          </motion.button>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
          >
            ← Prev
          </button>
          <button
            onClick={nextCard}
            disabled={currentCardIndex === words.length - 1}
            className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    if (!quizWord) return null;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex items-center justify-between w-full mb-4">
          <button
            onClick={() => setViewMode('overview')}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <span>←</span> Back
          </button>
        </div>

        <div className={`w-full max-w-md p-8 rounded-2xl border-2 ${levelColors[selectedLevel].border} bg-gradient-to-br ${levelColors[selectedLevel].bg}`}>
          <div className="text-center mb-6">
            <span className="text-4xl font-bold text-white">{quizWord.word}</span>
            <div className="text-lg text-gray-400 mt-2">{quizWord.reading}</div>
            <div className="text-sm text-gray-500">({quizWord.romaji})</div>
          </div>

          <div className="text-center text-gray-300 mb-6">
            What does this word mean?
          </div>

          <div className="grid grid-cols-2 gap-3">
            {quizOptions.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleQuizAnswer(option)}
                disabled={quizAnswered}
                className={`p-4 rounded-xl border text-sm ${
                  quizAnswered
                    ? option === quizWord.meaning
                      ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300'
                      : option === quizOptions.find(o => o !== quizWord.meaning && quizAnswered)
                        ? 'bg-rose-500/30 border-rose-500 text-rose-300'
                        : 'bg-gray-700/50 border-gray-600 text-gray-400'
                    : 'bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50'
                }`}
                whileHover={!quizAnswered ? { scale: 1.02 } : {}}
                whileTap={!quizAnswered ? { scale: 0.98 } : {}}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {quizAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <div className={`text-xl font-bold ${quizCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {quizCorrect ? '🎉 Correct! +10 XP' : '❌ Incorrect'}
              </div>
              <motion.button
                onClick={generateQuizQuestion}
                className="mt-4 px-6 py-2 bg-amber-500 text-black rounded-xl font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next Question
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 pt-20 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              📖 Vocabulary <span className="text-amber-400">単語</span>
            </h1>
            <p className="text-gray-400 text-sm">Master JLPT vocabulary from N5 to N1</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'overview' && renderOverview()}
          {viewMode === 'list' && renderList()}
          {viewMode === 'flashcard' && renderFlashcard()}
          {viewMode === 'quiz' && renderQuiz()}
        </AnimatePresence>
      </div>
    </div>
  );
}
