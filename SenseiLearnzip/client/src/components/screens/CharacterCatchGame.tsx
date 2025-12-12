import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useUserStore } from '@/lib/stores/useUserStore';
import { hiragana } from '@/data/hiragana';
import { katakana } from '@/data/katakana';
import type { KanaCharacter } from '@/data/hiragana';

interface FloatingChar {
  id: string;
  character: KanaCharacter;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isTarget: boolean;
}

export function CharacterCatchGame() {
  const { setScreen, addNotification } = useAppStore();
  const { addXp, updateCharacterProgress } = useUserStore();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'complete'>('menu');
  const [floatingChars, setFloatingChars] = useState<FloatingChar[]>([]);
  const [targetChar, setTargetChar] = useState<KanaCharacter | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [kanaType, setKanaType] = useState<'hiragana' | 'katakana' | 'both'>('hiragana');
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [targetsHit, setTargetsHit] = useState(0);
  const [wrongHits, setWrongHits] = useState(0);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const getCharacters = useCallback(() => {
    if (kanaType === 'hiragana') return hiragana;
    if (kanaType === 'katakana') return katakana;
    return [...hiragana, ...katakana];
  }, [kanaType]);

  const getCharCount = useCallback(() => {
    switch (difficulty) {
      case 'easy': return 6;
      case 'normal': return 10;
      case 'hard': return 15;
    }
  }, [difficulty]);

  const initializeChars = useCallback(() => {
    const chars = getCharacters();
    const count = getCharCount();
    const shuffled = chars.sort(() => Math.random() - 0.5).slice(0, count);
    const target = shuffled[Math.floor(Math.random() * shuffled.length)];
    
    const floaters: FloatingChar[] = shuffled.map((char, i) => ({
      id: `char-${i}-${Date.now()}`,
      character: char,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      isTarget: char.character === target.character,
    }));

    setFloatingChars(floaters);
    setTargetChar(target);
  }, [getCharacters, getCharCount]);

  const selectNewTarget = useCallback(() => {
    const chars = getCharacters();
    const newTarget = chars[Math.floor(Math.random() * chars.length)];
    
    setFloatingChars(prev => prev.map(char => ({
      ...char,
      isTarget: char.character.character === newTarget.character,
    })));
    setTargetChar(newTarget);
  }, [getCharacters]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setCombo(0);
    setMaxCombo(0);
    setTargetsHit(0);
    setWrongHits(0);
    initializeChars();
  }, [initializeChars]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameState('complete');
          const xpEarned = Math.floor(score / 5) + maxCombo * 3;
          addXp(xpEarned);
          addNotification({
            type: 'achievement',
            title: 'Time\'s Up!',
            message: `Score: ${score}, Max Combo: ${maxCombo}x! +${xpEarned} XP`,
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, score, maxCombo, addXp, addNotification]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const speed = difficulty === 'easy' ? 0.5 : difficulty === 'normal' ? 1 : 1.5;

    const animate = () => {
      setFloatingChars(prev => prev.map(char => {
        let newX = char.x + char.vx * speed;
        let newY = char.y + char.vy * speed;
        let newVx = char.vx;
        let newVy = char.vy;

        if (newX < 5 || newX > 95) {
          newVx = -newVx;
          newX = Math.max(5, Math.min(95, newX));
        }
        if (newY < 5 || newY > 85) {
          newVy = -newVy;
          newY = Math.max(5, Math.min(85, newY));
        }

        return { ...char, x: newX, y: newY, vx: newVx, vy: newVy };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, difficulty]);

  const handleCharClick = useCallback((char: FloatingChar) => {
    if (char.isTarget) {
      updateCharacterProgress(
        char.character.character,
        kanaType === 'katakana' ? 'katakana' : 'hiragana',
        true
      );
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      
      const points = 10 + newCombo * 2;
      setScore(s => s + points);
      setTargetsHit(t => t + 1);
      
      selectNewTarget();
    } else {
      updateCharacterProgress(
        char.character.character,
        kanaType === 'katakana' ? 'katakana' : 'hiragana',
        false
      );
      setCombo(0);
      setWrongHits(w => w + 1);
    }
  }, [combo, targetChar, kanaType, selectNewTarget, updateCharacterProgress]);

  if (gameState === 'menu') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-3xl p-8 border border-cyan-500/30"
        >
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">🎯</span>
            <h1 className="text-3xl font-bold text-white">Character Catch</h1>
            <p className="text-white/60">キャラキャッチ</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <h3 className="text-white font-medium mb-2">How to Play:</h3>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Tap characters that match the target</li>
              <li>• Build combos for bonus points</li>
              <li>• Don't tap wrong characters!</li>
            </ul>
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
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all"
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
    const accuracy = targetsHit + wrongHits > 0 
      ? Math.round((targetsHit / (targetsHit + wrongHits)) * 100) 
      : 0;

    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-3xl p-8 border border-cyan-500/30 text-center"
        >
          <span className="text-6xl mb-4 block">🏆</span>
          <h1 className="text-3xl font-bold text-white mb-2">Time's Up!</h1>
          
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">{score}</p>
              <p className="text-white/60 text-sm">Score</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-cyan-400">{maxCombo}x</p>
              <p className="text-white/60 text-sm">Max Combo</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-400">{targetsHit}</p>
              <p className="text-white/60 text-sm">Caught</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-blue-400">{accuracy}%</p>
              <p className="text-white/60 text-sm">Accuracy</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all"
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
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-blue-900/20 to-gray-900" />
      
      <div className="relative z-10 flex flex-col flex-1 min-h-0 w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <button
            onClick={() => {
              setGameState('complete');
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
              <p className="text-xl md:text-2xl font-bold text-cyan-400">{combo}x</p>
              <p className="text-xs text-white/60">Combo</p>
            </div>
            <div className="text-center px-3 py-1 bg-red-500/30 rounded-lg">
              <p className="text-xl md:text-2xl font-bold text-white">{timeLeft}s</p>
            </div>
          </div>
        </div>

        {targetChar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 bg-white/10 rounded-xl py-3 px-6 inline-block mx-auto flex-shrink-0"
          >
            <p className="text-white/60 text-sm">Catch:</p>
            <p className="text-4xl md:text-5xl font-bold text-white">{targetChar.character}</p>
            <p className="text-white/60 text-sm">{targetChar.romaji}</p>
          </motion.div>
        )}

        <div 
          ref={gameAreaRef}
          className="relative bg-gradient-to-b from-blue-900/10 to-purple-900/10 rounded-2xl border border-white/10 overflow-hidden flex-1 min-h-0"
        >
          <AnimatePresence>
            {floatingChars.map(char => (
              <motion.button
                key={char.id}
                onClick={() => handleCharClick(char)}
                className={`absolute w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all ${
                  char.isTarget 
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                style={{
                  left: `${char.x}%`,
                  top: `${char.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl md:text-3xl font-bold text-white">{char.character.character}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
