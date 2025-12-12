import { useState, useCallback, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useUserStore } from '@/lib/stores/useUserStore';

interface Sentence {
  japanese: string[];
  english: string;
  romaji: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const sentences: Sentence[] = [
  { japanese: ['わたし', 'は', '学生', 'です'], english: 'I am a student', romaji: 'watashi wa gakusei desu', difficulty: 'easy' },
  { japanese: ['これ', 'は', '本', 'です'], english: 'This is a book', romaji: 'kore wa hon desu', difficulty: 'easy' },
  { japanese: ['今日', 'は', '暑い', 'です'], english: 'Today is hot', romaji: 'kyou wa atsui desu', difficulty: 'easy' },
  { japanese: ['おなか', 'が', '空いた'], english: 'I am hungry', romaji: 'onaka ga suita', difficulty: 'easy' },
  { japanese: ['日本語', 'を', '勉強', 'して', 'います'], english: 'I am studying Japanese', romaji: 'nihongo wo benkyou shite imasu', difficulty: 'medium' },
  { japanese: ['明日', '東京', 'に', '行きます'], english: 'I will go to Tokyo tomorrow', romaji: 'ashita toukyou ni ikimasu', difficulty: 'medium' },
  { japanese: ['毎日', '朝ごはん', 'を', '食べます'], english: 'I eat breakfast every day', romaji: 'mainichi asagohan wo tabemasu', difficulty: 'medium' },
  { japanese: ['この', '映画', 'は', 'おもしろい', 'です'], english: 'This movie is interesting', romaji: 'kono eiga wa omoshiroi desu', difficulty: 'medium' },
  { japanese: ['日本', 'の', '文化', 'に', '興味', 'が', 'あります'], english: 'I am interested in Japanese culture', romaji: 'nihon no bunka ni kyoumi ga arimasu', difficulty: 'hard' },
  { japanese: ['先週', '友達', 'と', '映画', 'を', '見ました'], english: 'I watched a movie with friends last week', romaji: 'senshuu tomodachi to eiga wo mimashita', difficulty: 'hard' },
  { japanese: ['彼女', 'は', 'とても', '優しい', '人', 'です'], english: 'She is a very kind person', romaji: 'kanojo wa totemo yasashii hito desu', difficulty: 'hard' },
  { japanese: ['もう', '一度', '説明', 'して', 'ください'], english: 'Please explain once more', romaji: 'mou ichido setsumei shite kudasai', difficulty: 'hard' },
];

export function SentenceScrambleGame() {
  const { setScreen, addNotification } = useAppStore();
  const { addXp } = useUserStore();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds] = useState(8);
  const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  const getFilteredSentences = useCallback(() => {
    if (difficulty === 'mixed') return sentences;
    return sentences.filter(s => s.difficulty === difficulty);
  }, [difficulty]);

  const loadNextSentence = useCallback(() => {
    const filtered = getFilteredSentences();
    const sentence = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentSentence(sentence);
    setScrambledWords([...sentence.japanese].sort(() => Math.random() - 0.5));
    setShowResult(false);
    setTimeLeft(difficulty === 'easy' ? 45 : difficulty === 'hard' ? 20 : 30);
    setTimerActive(true);
  }, [getFilteredSentences, difficulty]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setCurrentRound(0);
    setCorrectAnswers(0);
    loadNextSentence();
  }, [loadNextSentence]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0 || showResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          checkAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, showResult]);

  const checkAnswer = useCallback(() => {
    if (!currentSentence || showResult) return;
    
    setTimerActive(false);
    setShowResult(true);
    
    const correct = scrambledWords.join('') === currentSentence.japanese.join('');
    setIsCorrect(correct);
    
    if (correct) {
      const timeBonus = Math.floor(timeLeft / 2);
      const difficultyMultiplier = 
        currentSentence.difficulty === 'easy' ? 1 :
        currentSentence.difficulty === 'medium' ? 1.5 : 2;
      const points = Math.floor((20 + timeBonus) * difficultyMultiplier);
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentRound < totalRounds - 1) {
        setCurrentRound(prev => prev + 1);
        loadNextSentence();
      } else {
        endGame();
      }
    }, 2000);
  }, [currentSentence, scrambledWords, showResult, timeLeft, currentRound, totalRounds, loadNextSentence]);

  const endGame = useCallback(() => {
    setGameState('gameover');
    const xpEarned = score + correctAnswers * 5;
    if (xpEarned > 0) {
      addXp(xpEarned);
      addNotification({
        type: 'success',
        title: 'Game Complete!',
        message: `You earned ${xpEarned} XP! ${correctAnswers}/${totalRounds} correct!`,
      });
    }
  }, [score, correctAnswers, totalRounds, addXp, addNotification]);

  if (gameState === 'menu') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-3xl p-8 border border-amber-500/30"
        >
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">📝</span>
            <h1 className="text-3xl font-bold text-white">Sentence Scramble</h1>
            <p className="text-white/60">文章パズル</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <p className="text-white/80 text-sm text-center">
              Drag and drop words to form correct Japanese sentences. 
              Learn proper sentence structure while having fun!
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-white/80 text-sm block mb-2">Difficulty</label>
              <div className="grid grid-cols-2 gap-2">
                {(['easy', 'medium', 'hard', 'mixed'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-lg font-medium transition-all capitalize ${
                      difficulty === diff
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg transition-all"
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

  if (gameState === 'gameover') {
    const percentage = Math.round((correctAnswers / totalRounds) * 100);
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-8 border border-white/20 text-center"
        >
          <span className="text-6xl mb-4 block">
            {percentage >= 80 ? '🏆' : percentage >= 50 ? '⭐' : '📝'}
          </span>
          <h1 className="text-3xl font-bold text-white mb-2">Game Complete!</h1>
          
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">{score}</p>
              <p className="text-white/60 text-sm">Final Score</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-amber-400">{correctAnswers}/{totalRounds}</p>
              <p className="text-white/60 text-sm">Correct</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all"
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

  return (
    <div className="fixed inset-0 pt-16 pb-20 px-4 md:px-8 lg:px-12 flex flex-col overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 w-full max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <button
            onClick={() => setGameState('menu')}
            className="text-white/60 hover:text-white transition-all"
          >
            ← Exit
          </button>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-white">{score}</p>
              <p className="text-xs text-white/60">Score</p>
            </div>
            <div className={`text-center px-3 py-1 rounded-lg ${timeLeft <= 10 ? 'bg-red-500/30' : 'bg-white/10'}`}>
              <p className={`text-xl md:text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-full h-2 mb-6 flex-shrink-0">
          <motion.div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}
          />
        </div>

        <motion.div
          key={currentRound}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col flex-1 min-h-0 gap-4 md:gap-6"
        >
          <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl p-6 border border-amber-500/20 flex-shrink-0">
            <p className="text-white/60 text-sm mb-2">Round {currentRound + 1} of {totalRounds}</p>
            <p className="text-white text-lg md:text-xl font-medium">{currentSentence?.english}</p>
            <p className="text-white/40 text-sm mt-1">{currentSentence?.romaji}</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 md:p-6 min-h-[100px] border-2 border-dashed border-white/20 flex-shrink-0">
            <p className="text-white/40 text-sm mb-3">Arrange the words:</p>
            <Reorder.Group
              axis="x"
              values={scrambledWords}
              onReorder={setScrambledWords}
              className="flex flex-wrap gap-2 md:gap-3"
            >
              {scrambledWords.map((word) => (
                <Reorder.Item
                  key={word}
                  value={word}
                  className={`px-4 py-2 rounded-xl text-lg font-medium cursor-grab active:cursor-grabbing transition-all ${
                    showResult
                      ? isCorrect
                        ? 'bg-green-500/30 text-green-300 border border-green-500'
                        : 'bg-red-500/30 text-red-300 border border-red-500'
                      : 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 text-white hover:from-amber-500/40 hover:to-orange-500/40 border border-amber-500/30'
                  }`}
                  whileDrag={{ scale: 1.1, zIndex: 10 }}
                >
                  {word}
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          {showResult && !isCorrect && currentSentence && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500/10 rounded-xl p-4 border border-green-500/30 flex-shrink-0"
            >
              <p className="text-green-400 text-sm">Correct answer:</p>
              <p className="text-white text-lg">{currentSentence.japanese.join(' ')}</p>
            </motion.div>
          )}

          {!showResult && (
            <button
              onClick={checkAnswer}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg transition-all flex-shrink-0"
            >
              Check Answer
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
