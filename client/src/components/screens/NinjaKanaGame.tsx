import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useUserStore } from '@/lib/stores/useUserStore';
import { hiragana } from '@/data/hiragana';
import { katakana } from '@/data/katakana';
import type { KanaCharacter } from '@/data/hiragana';

interface FallingCharacter {
  id: string;
  character: KanaCharacter;
  x: number;
  y: number;
  speed: number;
}

export function NinjaKanaGame() {
  const { setScreen, addNotification } = useAppStore();
  const { addXp, updateCharacterProgress } = useUserStore();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [fallingChars, setFallingChars] = useState<FallingCharacter[]>([]);
  const [input, setInput] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [kanaType, setKanaType] = useState<'hiragana' | 'katakana' | 'both'>('hiragana');
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCharacters = useCallback(() => {
    if (kanaType === 'hiragana') return hiragana;
    if (kanaType === 'katakana') return katakana;
    return [...hiragana, ...katakana];
  }, [kanaType]);

  const getSpeed = useCallback(() => {
    switch (difficulty) {
      case 'easy': return { min: 0.3, max: 0.6 };
      case 'normal': return { min: 0.5, max: 1 };
      case 'hard': return { min: 0.8, max: 1.5 };
    }
  }, [difficulty]);

  const getSpawnRate = useCallback(() => {
    switch (difficulty) {
      case 'easy': return 3000;
      case 'normal': return 2000;
      case 'hard': return 1200;
    }
  }, [difficulty]);

  const spawnCharacter = useCallback(() => {
    const chars = getCharacters();
    const speeds = getSpeed();
    const char = chars[Math.floor(Math.random() * chars.length)];
    
    const newChar: FallingCharacter = {
      id: `${Date.now()}-${Math.random()}`,
      character: char,
      x: Math.random() * 80 + 10,
      y: 0,
      speed: Math.random() * (speeds.max - speeds.min) + speeds.min,
    };
    
    setFallingChars(prev => [...prev, newChar]);
  }, [getCharacters, getSpeed]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setFallingChars([]);
    setInput('');
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const endGameRef = useRef<() => void>(() => {});
  
  endGameRef.current = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    gameLoopRef.current = null;
    spawnRef.current = null;
    
    setGameState('gameover');
    setFallingChars([]);
    
    const xpEarned = Math.floor(score / 10) + maxCombo * 2;
    if (xpEarned > 0) {
      addXp(xpEarned);
      addNotification({
        type: 'success',
        title: 'Game Over!',
        message: `You earned ${xpEarned} XP! Score: ${score}, Max Combo: ${maxCombo}`,
      });
    }
  };
  
  const endGame = useCallback(() => {
    endGameRef.current();
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let isGameActive = true;
    
    gameLoopRef.current = setInterval(() => {
      if (!isGameActive) return;
      
      setFallingChars(prev => {
        const updated = prev.map(char => ({
          ...char,
          y: char.y + char.speed,
        }));
        
        const fallen = updated.filter(char => char.y >= 95);
        const remaining = updated.filter(char => char.y < 95);
        
        if (fallen.length > 0) {
          fallen.forEach(char => {
            updateCharacterProgress(char.character.character, 
              char.character.row.includes('katakana') ? 'katakana' : 'hiragana', 
              false
            );
          });
          setLives(l => {
            const newLives = l - fallen.length;
            if (newLives <= 0 && isGameActive) {
              isGameActive = false;
              setTimeout(() => endGame(), 0);
            }
            return Math.max(0, newLives);
          });
          setCombo(0);
        }
        
        return remaining;
      });
    }, 50);

    spawnRef.current = setInterval(spawnCharacter, getSpawnRate());

    return () => {
      isGameActive = false;
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [gameState, spawnCharacter, getSpawnRate, endGame, updateCharacterProgress]);

  const handleInput = useCallback((value: string) => {
    setInput(value);
    
    const matchIndex = fallingChars.findIndex(
      char => char.character.romaji.toLowerCase() === value.toLowerCase()
    );
    
    if (matchIndex !== -1) {
      const matched = fallingChars[matchIndex];
      
      updateCharacterProgress(
        matched.character.character,
        matched.character.row.includes('katakana') ? 'katakana' : 'hiragana',
        true
      );
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      
      const points = 10 + (newCombo * 2);
      setScore(prev => prev + points);
      
      setFallingChars(prev => prev.filter((_, i) => i !== matchIndex));
      setInput('');
    }
  }, [fallingChars, combo, updateCharacterProgress]);

  if (gameState === 'menu') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-red-900/50 to-orange-900/50 rounded-3xl p-8 border border-red-500/30"
        >
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">🥷</span>
            <h1 className="text-3xl font-bold text-white">Ninja Kana</h1>
            <p className="text-white/60">忍者かな</p>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-white/80 text-sm block mb-2">Kana Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['hiragana', 'katakana', 'both'] as const).map(type => (
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
              <label className="text-white/80 text-sm block mb-2">Difficulty</label>
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
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg transition-all"
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
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl p-8 border border-white/20 text-center"
        >
          <span className="text-6xl mb-4 block">🎮</span>
          <h1 className="text-3xl font-bold text-white mb-2">Game Over!</h1>
          
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">{score}</p>
              <p className="text-white/60 text-sm">Final Score</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-orange-400">{maxCombo}x</p>
              <p className="text-white/60 text-sm">Max Combo</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all"
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
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
      
      <div className="relative z-10 flex flex-col flex-1 min-h-0 w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <button
            onClick={() => {
              endGame();
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
              <p className="text-xl md:text-2xl font-bold text-orange-400">{combo}x</p>
              <p className="text-xs text-white/60">Combo</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`text-lg md:text-xl ${i < lives ? 'opacity-100' : 'opacity-30'}`}>
                  ❤️
                </span>
              ))}
            </div>
          </div>
        </div>

        <div 
          className="relative bg-gradient-to-b from-blue-900/20 to-purple-900/20 rounded-2xl border border-white/10 overflow-hidden flex-1 min-h-0"
        >
          <AnimatePresence>
            {fallingChars.map(char => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.1 } }}
                className="absolute"
                style={{
                  left: `${char.x}%`,
                  top: `${char.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <span className="text-2xl md:text-3xl text-white font-bold">{char.character.character}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
        </div>

        <div className="mt-3 flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Type romaji here..."
            className="w-full max-w-xl mx-auto block bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-center text-lg placeholder-white/40 focus:outline-none focus:border-orange-500/50"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  );
}
