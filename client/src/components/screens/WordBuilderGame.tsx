import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useUserStore } from '@/lib/stores/useUserStore';
import { hiragana } from '@/data/hiragana';

interface Word {
  japanese: string;
  romaji: string;
  meaning: string;
  characters: string[];
}

const vocabularyWords: Word[] = [
  { japanese: 'さくら', romaji: 'sakura', meaning: 'cherry blossom', characters: ['さ', 'く', 'ら'] },
  { japanese: 'ねこ', romaji: 'neko', meaning: 'cat', characters: ['ね', 'こ'] },
  { japanese: 'いぬ', romaji: 'inu', meaning: 'dog', characters: ['い', 'ぬ'] },
  { japanese: 'みず', romaji: 'mizu', meaning: 'water', characters: ['み', 'ず'] },
  { japanese: 'そら', romaji: 'sora', meaning: 'sky', characters: ['そ', 'ら'] },
  { japanese: 'はな', romaji: 'hana', meaning: 'flower', characters: ['は', 'な'] },
  { japanese: 'やま', romaji: 'yama', meaning: 'mountain', characters: ['や', 'ま'] },
  { japanese: 'うみ', romaji: 'umi', meaning: 'sea', characters: ['う', 'み'] },
  { japanese: 'ほし', romaji: 'hoshi', meaning: 'star', characters: ['ほ', 'し'] },
  { japanese: 'つき', romaji: 'tsuki', meaning: 'moon', characters: ['つ', 'き'] },
  { japanese: 'あめ', romaji: 'ame', meaning: 'rain', characters: ['あ', 'め'] },
  { japanese: 'かぜ', romaji: 'kaze', meaning: 'wind', characters: ['か', 'ぜ'] },
  { japanese: 'ひ', romaji: 'hi', meaning: 'fire/sun', characters: ['ひ'] },
  { japanese: 'くも', romaji: 'kumo', meaning: 'cloud', characters: ['く', 'も'] },
  { japanese: 'とり', romaji: 'tori', meaning: 'bird', characters: ['と', 'り'] },
  { japanese: 'さかな', romaji: 'sakana', meaning: 'fish', characters: ['さ', 'か', 'な'] },
  { japanese: 'きれい', romaji: 'kirei', meaning: 'beautiful', characters: ['き', 'れ', 'い'] },
  { japanese: 'おおきい', romaji: 'ookii', meaning: 'big', characters: ['お', 'お', 'き', 'い'] },
  { japanese: 'ちいさい', romaji: 'chiisai', meaning: 'small', characters: ['ち', 'い', 'さ', 'い'] },
  { japanese: 'たかい', romaji: 'takai', meaning: 'tall/expensive', characters: ['た', 'か', 'い'] },
];

export function WordBuilderGame() {
  const { setScreen, addNotification } = useAppStore();
  const { addXp } = useUserStore();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'complete'>('menu');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [availableChars, setAvailableChars] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [totalWords, setTotalWords] = useState(10);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  const getRandomCharacters = useCallback((correctChars: string[], count: number) => {
    const allChars = hiragana.map(h => h.character);
    const extraChars: string[] = [];
    
    while (extraChars.length < count) {
      const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
      if (!correctChars.includes(randomChar) && !extraChars.includes(randomChar)) {
        extraChars.push(randomChar);
      }
    }
    
    return [...correctChars, ...extraChars].sort(() => Math.random() - 0.5);
  }, []);

  const loadNextWord = useCallback(() => {
    const availableWords = vocabularyWords.filter(w => !usedWords.has(w.japanese));
    
    if (availableWords.length === 0 || wordsCompleted >= totalWords) {
      setGameState('complete');
      const xpEarned = score + streak * 5;
      addXp(xpEarned);
      addNotification({
        type: 'achievement',
        title: 'Word Master!',
        message: `Completed ${wordsCompleted} words! +${xpEarned} XP`,
      });
      return;
    }

    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(word);
    setSelectedChars([]);
    setShowHint(false);
    setAvailableChars(getRandomCharacters(word.characters, Math.min(word.characters.length + 3, 8)));
    setUsedWords(prev => new Set(Array.from(prev).concat([word.japanese])));
  }, [usedWords, wordsCompleted, totalWords, getRandomCharacters, score, streak, addXp, addNotification]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setWordsCompleted(0);
    setUsedWords(new Set());
    setCurrentWord(null);
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && !currentWord) {
      loadNextWord();
    }
  }, [gameState, currentWord, loadNextWord]);

  const handleCharSelect = useCallback((char: string, index: number) => {
    if (!currentWord) return;
    
    const expectedChar = currentWord.characters[selectedChars.length];
    
    if (char === expectedChar) {
      const newSelected = [...selectedChars, char];
      setSelectedChars(newSelected);
      
      if (newSelected.length === currentWord.characters.length) {
        const points = 10 + streak * 2;
        setScore(s => s + points);
        setStreak(s => s + 1);
        setWordsCompleted(w => w + 1);
        
        setTimeout(() => {
          loadNextWord();
        }, 800);
      }
    } else {
      setStreak(0);
      setSelectedChars([]);
      addNotification({
        type: 'error',
        title: 'Wrong character!',
        message: 'Try again from the beginning',
      });
    }
  }, [currentWord, selectedChars, streak, loadNextWord, addNotification]);

  if (gameState === 'menu') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-3xl p-8 border border-emerald-500/30"
        >
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">🧱</span>
            <h1 className="text-3xl font-bold text-white">Word Builder</h1>
            <p className="text-white/60">言葉ビルダー</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <h3 className="text-white font-medium mb-2">How to Play:</h3>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• See the meaning of a Japanese word</li>
              <li>• Select the correct hiragana in order</li>
              <li>• Build combos for bonus points!</li>
            </ul>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-white/80 text-sm block mb-2">Number of Words</label>
              <div className="grid grid-cols-3 gap-2">
                {([5, 10, 15] as const).map(num => (
                  <button
                    key={num}
                    onClick={() => setTotalWords(num)}
                    className={`py-2 rounded-lg font-medium transition-all ${
                      totalWords === num
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-lg transition-all"
            >
              Start Game
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

  if (gameState === 'complete') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-3xl p-8 border border-green-500/30 text-center"
        >
          <span className="text-6xl mb-4 block">🎉</span>
          <h1 className="text-3xl font-bold text-white mb-2">Excellent!</h1>
          
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">{score}</p>
              <p className="text-white/60 text-sm">Score</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-emerald-400">{wordsCompleted}</p>
              <p className="text-white/60 text-sm">Words Built</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold transition-all"
            >
              Play Again
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
            onClick={() => setScreen('games')}
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
              <p className="text-xl md:text-2xl font-bold text-emerald-400">{streak}x</p>
              <p className="text-xs text-white/60">Streak</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-blue-400">{wordsCompleted}/{totalWords}</p>
              <p className="text-xs text-white/60">Progress</p>
            </div>
          </div>
        </div>

        {currentWord && (
          <motion.div
            key={currentWord.japanese}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col flex-1 min-h-0 gap-4 md:gap-6"
          >
            <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20 flex-shrink-0">
              <p className="text-white/60 text-sm mb-2">Build this word:</p>
              <p className="text-3xl md:text-4xl font-bold text-white mb-2">{currentWord.meaning}</p>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-all"
              >
                {showHint ? `Hint: ${currentWord.romaji}` : 'Show hint'}
              </button>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10 min-h-[80px] flex items-center justify-center gap-2 md:gap-3 flex-shrink-0">
              <AnimatePresence mode="popLayout">
                {selectedChars.map((char, i) => (
                  <motion.div
                    key={`${char}-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center"
                  >
                    <span className="text-2xl md:text-3xl font-bold text-white">{char}</span>
                  </motion.div>
                ))}
                {Array.from({ length: currentWord.characters.length - selectedChars.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-12 h-12 md:w-14 md:h-14 border-2 border-dashed border-white/30 rounded-xl"
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto w-full flex-shrink-0">
              {availableChars.map((char, index) => {
                const isUsed = selectedChars.filter(c => c === char).length >= 
                              currentWord.characters.filter(c => c === char).length;
                return (
                  <motion.button
                    key={`${char}-${index}`}
                    onClick={() => !isUsed && handleCharSelect(char, index)}
                    disabled={isUsed}
                    className={`aspect-square rounded-xl text-2xl md:text-3xl font-bold transition-all ${
                      isUsed
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
                    }`}
                    whileTap={{ scale: isUsed ? 1 : 0.95 }}
                  >
                    {char}
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedChars([])}
              className="w-full max-w-md mx-auto py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex-shrink-0"
            >
              Clear Selection
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
