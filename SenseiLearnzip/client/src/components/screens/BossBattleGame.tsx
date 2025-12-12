import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useUserStore } from '@/lib/stores/useUserStore';
import { hiragana } from '@/data/hiragana';
import { katakana } from '@/data/katakana';
import { allKanji } from '@/data/kanji';
import type { KanaCharacter } from '@/data/hiragana';

interface Boss {
  name: string;
  nameJp: string;
  emoji: string;
  maxHp: number;
  difficulty: 'novice' | 'warrior' | 'master';
  reward: number;
}

interface Question {
  character: string;
  romaji: string;
  options: string[];
  type: 'hiragana' | 'katakana' | 'kanji';
}

const bosses: Boss[] = [
  { name: 'Kana Apprentice', nameJp: '仮名見習い', emoji: '🥋', maxHp: 100, difficulty: 'novice', reward: 50 },
  { name: 'Syllable Samurai', nameJp: '音節侍', emoji: '⚔️', maxHp: 150, difficulty: 'warrior', reward: 100 },
  { name: 'Kanji Master', nameJp: '漢字の達人', emoji: '👹', maxHp: 200, difficulty: 'master', reward: 200 },
];

export function BossBattleGame() {
  const { setScreen, addNotification } = useAppStore();
  const { addXp, level } = useUserStore();
  
  const [gameState, setGameState] = useState<'menu' | 'battle' | 'victory' | 'defeat'>('menu');
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [bossHp, setBossHp] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [combo, setCombo] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [bossAttacking, setBossAttacking] = useState(false);
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateQuestion = useCallback((): Question => {
    const types: ('hiragana' | 'katakana' | 'kanji')[] = 
      selectedBoss?.difficulty === 'novice' ? ['hiragana'] :
      selectedBoss?.difficulty === 'warrior' ? ['hiragana', 'katakana'] :
      ['hiragana', 'katakana', 'kanji'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    
    if (type === 'kanji') {
      const validKanji = allKanji.filter(k => 
        (k.kunyomi && k.kunyomi.length > 0 && k.kunyomi[0]) || 
        (k.onyomi && k.onyomi.length > 0 && k.onyomi[0])
      ).slice(0, 20);
      
      if (validKanji.length < 4) {
        const chars = hiragana;
        const char = chars[Math.floor(Math.random() * chars.length)];
        const wrongOptions = chars
          .filter(c => c.romaji !== char.romaji)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(c => c.romaji);
        const options = [...wrongOptions, char.romaji].sort(() => Math.random() - 0.5);
        return { character: char.character, romaji: char.romaji, options, type: 'hiragana' };
      }
      
      const char = validKanji[Math.floor(Math.random() * validKanji.length)];
      const reading = char.kunyomi[0] || char.onyomi[0];
      const wrongOptions = validKanji
        .filter(k => k.character !== char.character)
        .map(k => k.kunyomi[0] || k.onyomi[0])
        .filter((r, i, arr) => r && arr.indexOf(r) === i && r !== reading)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      while (wrongOptions.length < 3) {
        const fallbackChars = hiragana.sort(() => Math.random() - 0.5);
        for (const fc of fallbackChars) {
          if (!wrongOptions.includes(fc.romaji) && fc.romaji !== reading) {
            wrongOptions.push(fc.romaji);
            if (wrongOptions.length >= 3) break;
          }
        }
      }
      
      const options = [...wrongOptions, reading].sort(() => Math.random() - 0.5);
      return { character: char.character, romaji: reading, options, type: 'kanji' };
    }
    
    const chars = type === 'hiragana' ? hiragana : katakana;
    const char = chars[Math.floor(Math.random() * chars.length)];
    const wrongOptions = chars
      .filter(c => c.romaji !== char.romaji)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.romaji);
    const options = [...wrongOptions, char.romaji].sort(() => Math.random() - 0.5);
    
    return { character: char.character, romaji: char.romaji, options, type };
  }, [selectedBoss]);

  const nextQuestion = useCallback(() => {
    const question = generateQuestion();
    setCurrentQuestion(question);
    setShowResult(false);
    setLastResult(null);
    setTimeLeft(selectedBoss?.difficulty === 'master' ? 8 : selectedBoss?.difficulty === 'warrior' ? 10 : 12);
  }, [generateQuestion, selectedBoss]);

  const startBattle = useCallback((boss: Boss) => {
    setSelectedBoss(boss);
    setBossHp(boss.maxHp);
    setPlayerHp(100);
    setCombo(0);
    setTotalDamageDealt(0);
    setGameState('battle');
    setTimeout(() => {
      const question = generateQuestion();
      setCurrentQuestion(question);
      setTimeLeft(boss.difficulty === 'master' ? 8 : boss.difficulty === 'warrior' ? 10 : 12);
    }, 500);
  }, [generateQuestion]);

  useEffect(() => {
    if (gameState !== 'battle' || showResult || !currentQuestion) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, showResult, currentQuestion]);

  const handleTimeout = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowResult(true);
    setLastResult('wrong');
    setCombo(0);
    
    const bossDamage = selectedBoss?.difficulty === 'master' ? 25 : selectedBoss?.difficulty === 'warrior' ? 20 : 15;
    setBossAttacking(true);
    
    setTimeout(() => {
      setBossAttacking(false);
      setPlayerHp(prev => {
        const newHp = Math.max(0, prev - bossDamage);
        if (newHp <= 0) {
          setTimeout(() => setGameState('defeat'), 500);
        }
        return newHp;
      });
    }, 500);
    
    setTimeout(() => {
      if (playerHp - bossDamage > 0) nextQuestion();
    }, 1500);
  }, [selectedBoss, nextQuestion, playerHp]);

  const handleAnswer = useCallback((answer: string) => {
    if (showResult || !currentQuestion) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    setShowResult(true);
    
    const isCorrect = answer === currentQuestion.romaji;
    setLastResult(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      const baseDamage = 15;
      const comboBonus = Math.min(newCombo * 3, 30);
      const timeBonus = Math.floor(timeLeft * 1.5);
      const totalDamage = baseDamage + comboBonus + timeBonus;
      
      setPlayerAttacking(true);
      setTimeout(() => setPlayerAttacking(false), 300);
      
      setBossHp(prev => {
        const newHp = Math.max(0, prev - totalDamage);
        setTotalDamageDealt(d => d + totalDamage);
        if (newHp <= 0) {
          setTimeout(() => setGameState('victory'), 500);
        }
        return newHp;
      });
    } else {
      setCombo(0);
      const bossDamage = selectedBoss?.difficulty === 'master' ? 25 : selectedBoss?.difficulty === 'warrior' ? 20 : 15;
      
      setBossAttacking(true);
      setTimeout(() => {
        setBossAttacking(false);
        setPlayerHp(prev => {
          const newHp = Math.max(0, prev - bossDamage);
          if (newHp <= 0) {
            setTimeout(() => setGameState('defeat'), 500);
          }
          return newHp;
        });
      }, 500);
    }
    
    setTimeout(() => {
      if (bossHp > 0 && playerHp > 0) nextQuestion();
    }, 1500);
  }, [showResult, currentQuestion, combo, timeLeft, selectedBoss, bossHp, playerHp, nextQuestion]);

  const handleVictory = useCallback(() => {
    if (!selectedBoss) return;
    const xpEarned = selectedBoss.reward + Math.floor(totalDamageDealt / 5);
    addXp(xpEarned);
    addNotification({
      type: 'achievement',
      title: 'Victory!',
      message: `You defeated ${selectedBoss.name}! Earned ${xpEarned} XP!`,
    });
    setGameState('menu');
  }, [selectedBoss, totalDamageDealt, addXp, addNotification]);

  if (gameState === 'menu') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 overflow-hidden">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <span className="text-6xl mb-4 block">⚔️</span>
            <h1 className="text-3xl font-bold text-white">Boss Battle</h1>
            <p className="text-white/60">ボス戦 - Knowledge Showdown</p>
          </motion.div>

          <div className="space-y-4">
            {bosses.map((boss, index) => {
              const isLocked = 
                (boss.difficulty === 'warrior' && level < 3) ||
                (boss.difficulty === 'master' && level < 5);
              
              return (
                <motion.div
                  key={boss.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => !isLocked && startBattle(boss)}
                    disabled={isLocked}
                    className={`w-full p-6 rounded-2xl text-left transition-all ${
                      isLocked
                        ? 'bg-white/5 opacity-50 cursor-not-allowed'
                        : 'bg-gradient-to-br from-red-900/30 to-orange-900/30 hover:from-red-900/50 hover:to-orange-900/50 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{boss.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-white">{boss.name}</h3>
                          {isLocked && <span className="text-xl">🔒</span>}
                        </div>
                        <p className="text-white/60 text-sm">{boss.nameJp}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-red-400 text-sm">❤️ {boss.maxHp} HP</span>
                          <span className="text-yellow-400 text-sm">⭐ {boss.reward} XP</span>
                        </div>
                        {isLocked && (
                          <p className="text-white/40 text-xs mt-1">
                            Requires Level {boss.difficulty === 'warrior' ? 3 : 5}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={() => setScreen('games')}
            className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'victory') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-3xl p-8 border border-yellow-500/30 text-center"
        >
          <motion.span 
            className="text-8xl mb-4 block"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            🏆
          </motion.span>
          <h1 className="text-3xl font-bold text-white mb-2">Victory!</h1>
          <p className="text-white/60 mb-6">You defeated {selectedBoss?.name}!</p>
          
          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <p className="text-2xl font-bold text-yellow-400">+{selectedBoss?.reward} XP</p>
            <p className="text-white/60 text-sm">Total Damage: {totalDamageDealt}</p>
          </div>

          <button
            onClick={handleVictory}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all"
          >
            Claim Rewards
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'defeat') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-8 border border-white/20 text-center"
        >
          <span className="text-6xl mb-4 block">💀</span>
          <h1 className="text-3xl font-bold text-white mb-2">Defeated...</h1>
          <p className="text-white/60 mb-6">The {selectedBoss?.name} was too strong!</p>
          
          <div className="space-y-3">
            <button
              onClick={() => selectedBoss && startBattle(selectedBoss)}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
            >
              Choose Another Boss
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pt-16 pb-20 px-4 md:px-8 lg:px-12 flex flex-col overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <motion.div 
            className={`flex items-center gap-2 ${bossAttacking ? 'animate-pulse' : ''}`}
            animate={bossAttacking ? { x: [0, 50, 0] } : {}}
          >
            <span className="text-3xl md:text-4xl">{selectedBoss?.emoji}</span>
            <div>
              <p className="text-white font-bold text-sm">{selectedBoss?.name}</p>
              <div className="w-28 md:w-32 h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600"
                  animate={{ width: `${(bossHp / (selectedBoss?.maxHp || 1)) * 100}%` }}
                />
              </div>
              <p className="text-white/60 text-xs">{bossHp}/{selectedBoss?.maxHp}</p>
            </div>
          </motion.div>
          
          <div className="text-center">
            <p className="text-orange-400 font-bold text-lg md:text-xl">{combo}x Combo</p>
          </div>
          
          <motion.div 
            className={`flex items-center gap-2 ${playerAttacking ? 'animate-pulse' : ''}`}
            animate={playerAttacking ? { x: [0, -30, 0] } : {}}
          >
            <div className="text-right">
              <p className="text-white font-bold text-sm">You</p>
              <div className="w-24 md:w-28 h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                  animate={{ width: `${playerHp}%` }}
                />
              </div>
              <p className="text-white/60 text-xs">{playerHp}/100</p>
            </div>
            <span className="text-3xl md:text-4xl">🥷</span>
          </motion.div>
        </div>

        <div className="text-center mb-4 flex-shrink-0">
          <div className={`inline-block px-4 py-2 rounded-lg ${timeLeft <= 3 ? 'bg-red-500/30' : 'bg-white/10'}`}>
            <span className={`text-2xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.character}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-3xl p-6 md:p-8 border border-red-500/20 mb-6 flex-shrink-0"
            >
              <p className="text-white/60 text-center mb-2">What is the reading?</p>
              <p className="text-6xl md:text-7xl text-center text-white font-bold mb-4">{currentQuestion.character}</p>
              <p className="text-white/40 text-center text-sm uppercase">{currentQuestion.type}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-3 md:gap-4 flex-shrink-0">
          {currentQuestion?.options.map((option, index) => {
            const isSelected = showResult && option === currentQuestion.romaji;
            const isWrong = showResult && lastResult === 'wrong' && option !== currentQuestion.romaji;
            
            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-4 md:p-5 rounded-xl text-lg md:text-xl font-bold transition-all ${
                  showResult && isSelected
                    ? 'bg-green-500/30 border-2 border-green-500 text-green-300'
                    : showResult && lastResult === 'wrong' && option === currentQuestion.romaji
                    ? 'bg-green-500/30 border-2 border-green-500 text-green-300'
                    : 'bg-white/10 border-2 border-transparent hover:bg-white/20 text-white'
                }`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={() => setGameState('menu')}
          className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex-shrink-0"
        >
          Retreat
        </button>
      </div>
    </div>
  );
}
