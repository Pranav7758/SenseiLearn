import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useUserStore } from '@/lib/stores/useUserStore';

interface VocabWord {
  japanese: string;
  romaji: string;
  english: string;
  category: string;
}

const vocabulary: VocabWord[] = [
  { japanese: '犬', romaji: 'inu', english: 'dog', category: 'animals' },
  { japanese: '猫', romaji: 'neko', english: 'cat', category: 'animals' },
  { japanese: '鳥', romaji: 'tori', english: 'bird', category: 'animals' },
  { japanese: '魚', romaji: 'sakana', english: 'fish', category: 'animals' },
  { japanese: '水', romaji: 'mizu', english: 'water', category: 'nature' },
  { japanese: '火', romaji: 'hi', english: 'fire', category: 'nature' },
  { japanese: '山', romaji: 'yama', english: 'mountain', category: 'nature' },
  { japanese: '川', romaji: 'kawa', english: 'river', category: 'nature' },
  { japanese: '空', romaji: 'sora', english: 'sky', category: 'nature' },
  { japanese: '本', romaji: 'hon', english: 'book', category: 'objects' },
  { japanese: '車', romaji: 'kuruma', english: 'car', category: 'objects' },
  { japanese: '電車', romaji: 'densha', english: 'train', category: 'objects' },
  { japanese: '食べる', romaji: 'taberu', english: 'to eat', category: 'verbs' },
  { japanese: '飲む', romaji: 'nomu', english: 'to drink', category: 'verbs' },
  { japanese: '行く', romaji: 'iku', english: 'to go', category: 'verbs' },
  { japanese: '来る', romaji: 'kuru', english: 'to come', category: 'verbs' },
  { japanese: '見る', romaji: 'miru', english: 'to see', category: 'verbs' },
  { japanese: '聞く', romaji: 'kiku', english: 'to hear/ask', category: 'verbs' },
  { japanese: '大きい', romaji: 'ookii', english: 'big', category: 'adjectives' },
  { japanese: '小さい', romaji: 'chiisai', english: 'small', category: 'adjectives' },
  { japanese: '新しい', romaji: 'atarashii', english: 'new', category: 'adjectives' },
  { japanese: '古い', romaji: 'furui', english: 'old', category: 'adjectives' },
  { japanese: '今日', romaji: 'kyou', english: 'today', category: 'time' },
  { japanese: '明日', romaji: 'ashita', english: 'tomorrow', category: 'time' },
  { japanese: '昨日', romaji: 'kinou', english: 'yesterday', category: 'time' },
];

export function VocabularyRaceGame() {
  const { setScreen, addNotification } = useAppStore();
  const { addXp } = useUserStore();
  
  const [gameState, setGameState] = useState<'menu' | 'countdown' | 'playing' | 'gameover'>('menu');
  const [wordsLearned, setWordsLearned] = useState(0);
  const [totalWords] = useState(10);
  const [currentWord, setCurrentWord] = useState<VocabWord | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [racePosition, setRacePosition] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [learnedWords, setLearnedWords] = useState<VocabWord[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getFilteredVocabulary = useCallback(() => {
    if (category === 'all') return vocabulary;
    return vocabulary.filter(v => v.category === category);
  }, [category]);

  const generateQuestion = useCallback(() => {
    const filtered = getFilteredVocabulary();
    const word = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentWord(word);
    
    const wrongOptions = filtered
      .filter(v => v.english !== word.english)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.english);
    
    setOptions([...wrongOptions, word.english].sort(() => Math.random() - 0.5));
    setShowResult(false);
  }, [getFilteredVocabulary]);

  const startGame = useCallback(() => {
    setGameState('countdown');
    setCountdown(3);
    setWordsLearned(0);
    setRacePosition(0);
    setStreak(0);
    setLearnedWords([]);
    setTimeLeft(difficulty === 'easy' ? 90 : difficulty === 'normal' ? 60 : 45);
  }, [difficulty]);

  useEffect(() => {
    if (gameState !== 'countdown') return;
    
    if (countdown <= 0) {
      setGameState('playing');
      generateQuestion();
      return;
    }
    
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [gameState, countdown, generateQuestion]);

  useEffect(() => {
    if (gameState !== 'playing' || showResult) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, showResult]);

  const handleAnswer = useCallback((answer: string) => {
    if (showResult || !currentWord) return;
    
    setShowResult(true);
    const isCorrect = answer === currentWord.english;
    setLastCorrect(isCorrect);
    
    if (isCorrect) {
      setStreak(prev => prev + 1);
      setWordsLearned(prev => prev + 1);
      setRacePosition(prev => Math.min(100, prev + (100 / totalWords)));
      setLearnedWords(prev => [...prev, currentWord]);
      
      if (wordsLearned + 1 >= totalWords) {
        setTimeout(() => endGame(), 500);
        return;
      }
    } else {
      setStreak(0);
      setRacePosition(prev => Math.max(0, prev - 5));
    }
    
    setTimeout(() => {
      generateQuestion();
    }, 1000);
  }, [showResult, currentWord, wordsLearned, totalWords, generateQuestion]);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('gameover');
    
    const timeBonus = Math.floor(timeLeft * 0.5);
    const streakBonus = streak * 2;
    const xpEarned = wordsLearned * 10 + timeBonus + streakBonus;
    
    if (xpEarned > 0) {
      addXp(xpEarned);
      addNotification({
        type: 'success',
        title: 'Race Complete!',
        message: `Learned ${wordsLearned} words! Earned ${xpEarned} XP!`,
      });
    }
  }, [timeLeft, streak, wordsLearned, addXp, addNotification]);

  const categories = ['all', ...Array.from(new Set(vocabulary.map(v => v.category)))];

  if (gameState === 'menu') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-3xl p-8 border border-green-500/30"
        >
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">🏃</span>
            <h1 className="text-3xl font-bold text-white">Vocabulary Race</h1>
            <p className="text-white/60">単語レース</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <p className="text-white/80 text-sm text-center">
              Learn {totalWords} new words as fast as you can! Correct answers speed you up, 
              wrong answers slow you down.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-white/80 text-sm block mb-2">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.slice(0, 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-2 rounded-lg font-medium transition-all capitalize text-sm ${
                      category === cat
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white/80 text-sm block mb-2">Time Limit</label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'normal', 'hard'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-lg font-medium transition-all ${
                      difficulty === diff
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {diff === 'easy' ? '90s' : diff === 'normal' ? '60s' : '45s'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all"
            >
              Start Race
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

  if (gameState === 'countdown') {
    return (
      <div className="h-screen h-[100dvh] flex items-center justify-center overflow-hidden">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="text-center"
        >
          <span className="text-9xl font-bold text-white">
            {countdown === 0 ? 'GO!' : countdown}
          </span>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'gameover') {
    const completed = wordsLearned >= totalWords;
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-8 border border-white/20 text-center"
        >
          <span className="text-6xl mb-4 block">{completed ? '🏆' : '🏁'}</span>
          <h1 className="text-3xl font-bold text-white mb-2">
            {completed ? 'Race Complete!' : 'Time Up!'}
          </h1>
          
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">{wordsLearned}</p>
              <p className="text-white/60 text-sm">Words Learned</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-400">{Math.floor(timeLeft)}s</p>
              <p className="text-white/60 text-sm">Time Left</p>
            </div>
          </div>

          {learnedWords.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 mb-6 max-h-40 overflow-y-auto">
              <p className="text-white/60 text-sm mb-2">Words you learned:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {learnedWords.map((word, i) => (
                  <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    {word.japanese}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all"
            >
              Race Again
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

  return (
    <div className="fixed inset-0 pt-16 pb-20 px-4 md:px-8 lg:px-12 flex flex-col overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 w-full max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <button
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              setGameState('menu');
            }}
            className="text-white/60 hover:text-white transition-all"
          >
            ← Exit
          </button>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-lg ${timeLeft <= 10 ? 'bg-red-500/30' : 'bg-white/10'}`}>
              <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="text-center">
              <span className="text-green-400 font-bold">{streak}🔥</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex-shrink-0">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>Start</span>
            <span>{wordsLearned}/{totalWords} words</span>
            <span>Finish</span>
          </div>
          <div className="relative h-8 bg-white/10 rounded-full overflow-hidden">
            <div className="absolute inset-0 flex items-center px-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex-1 border-r border-white/10 h-full" />
              ))}
            </div>
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-emerald-500"
              animate={{ width: `${racePosition}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 text-2xl"
              animate={{ left: `calc(${racePosition}% - 16px)` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              🏃
            </motion.div>
          </div>
        </div>

        {currentWord && (
          <motion.div
            key={currentWord.japanese}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-3xl p-6 md:p-8 border border-green-500/20 mb-6 flex-shrink-0"
          >
            <p className="text-white/60 text-center mb-2 capitalize">{currentWord.category}</p>
            <p className="text-5xl md:text-6xl text-center text-white font-bold mb-2">{currentWord.japanese}</p>
            <p className="text-white/60 text-center">{currentWord.romaji}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3 md:gap-4 flex-shrink-0">
          {options.map((option, index) => {
            const isCorrect = showResult && option === currentWord?.english;
            const isWrong = showResult && !lastCorrect && option === currentWord?.english;
            
            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-xl font-medium transition-all ${
                  showResult && isCorrect
                    ? 'bg-green-500/30 border-2 border-green-500 text-green-300'
                    : showResult && option !== currentWord?.english && !lastCorrect
                    ? 'bg-red-500/30 border-2 border-red-500 text-red-300'
                    : 'bg-white/10 border-2 border-transparent hover:bg-white/20 text-white'
                }`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
