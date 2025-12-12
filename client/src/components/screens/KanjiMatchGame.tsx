import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useUserStore } from '@/lib/stores/useUserStore';
import { hiragana } from '@/data/hiragana';
import type { KanaCharacter } from '@/data/hiragana';

interface Card {
  id: string;
  character: KanaCharacter;
  type: 'character' | 'romaji';
  isFlipped: boolean;
  isMatched: boolean;
}

export function KanjiMatchGame() {
  const { setScreen, addNotification } = useAppStore();
  const { addXp, updateCharacterProgress } = useUserStore();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'complete'>('menu');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gridSize, setGridSize] = useState<4 | 6 | 8>(4);
  const [isChecking, setIsChecking] = useState(false);

  const initializeGame = useCallback(() => {
    const pairCount = (gridSize * gridSize) / 2;
    const shuffled = [...hiragana].sort(() => Math.random() - 0.5).slice(0, pairCount);
    
    const gameCards: Card[] = [];
    shuffled.forEach((char, index) => {
      gameCards.push({
        id: `char-${index}`,
        character: char,
        type: 'character',
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: `romaji-${index}`,
        character: char,
        type: 'romaji',
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setGameState('playing');
  }, [gridSize]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (matches === cards.length / 2 && matches > 0) {
      setGameState('complete');
      
      const baseXp = gridSize * 5;
      const timeBonus = Math.max(0, 60 - timer) * 2;
      const moveBonus = Math.max(0, 20 - moves) * 3;
      const totalXp = baseXp + timeBonus + moveBonus;
      
      addXp(totalXp);
      addNotification({
        type: 'achievement',
        title: 'Memory Master!',
        message: `Completed in ${moves} moves! +${totalXp} XP`,
      });
    }
  }, [matches, cards.length, gridSize, timer, moves, addXp, addNotification]);

  const handleCardClick = useCallback((cardId: string) => {
    if (isChecking) return;
    if (flippedCards.includes(cardId)) return;
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves(m => m + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && 
          firstCard.character.character === secondCard.character.character &&
          firstCard.type !== secondCard.type) {
        updateCharacterProgress(firstCard.character.character, 'hiragana', true);
        
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          ));
          setMatches(m => m + 1);
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        if (firstCard) {
          updateCharacterProgress(firstCard.character.character, 'hiragana', false);
        }
        
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [cards, flippedCards, isChecking, updateCharacterProgress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'menu') {
    return (
      <div className="h-screen h-[100dvh] pt-16 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-purple-900/50 to-violet-900/50 rounded-3xl p-8 border border-purple-500/30"
        >
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">🎴</span>
            <h1 className="text-3xl font-bold text-white">Kanji Match</h1>
            <p className="text-white/60">漢字マッチ</p>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-white/80 text-sm block mb-2">Grid Size</label>
              <div className="grid grid-cols-3 gap-2">
                {([4, 6, 8] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setGridSize(size)}
                    className={`py-3 rounded-lg font-medium transition-all ${
                      gridSize === size
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={initializeGame}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl font-bold text-lg transition-all"
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
          <span className="text-6xl mb-4 block">🏆</span>
          <h1 className="text-3xl font-bold text-white mb-2">Congratulations!</h1>
          
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-white">{moves}</p>
              <p className="text-white/60 text-sm">Moves</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-purple-400">{formatTime(timer)}</p>
              <p className="text-white/60 text-sm">Time</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={initializeGame}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-xl font-bold transition-all"
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
      <div className="flex flex-col flex-1 min-h-0 w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <button
            onClick={() => setScreen('games')}
            className="text-white/60 hover:text-white transition-all"
          >
            ← Exit
          </button>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-white">{moves}</p>
              <p className="text-xs text-white/60">Moves</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-purple-400">{formatTime(timer)}</p>
              <p className="text-xs text-white/60">Time</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-green-400">{matches}/{cards.length / 2}</p>
              <p className="text-xs text-white/60">Matched</p>
            </div>
          </div>
        </div>

        <div 
          className="grid gap-2 md:gap-3 flex-1 min-h-0 max-w-2xl mx-auto w-full"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridAutoRows: '1fr',
          }}
        >
          <AnimatePresence>
            {cards.map(card => {
              const isFlipped = flippedCards.includes(card.id) || card.isMatched;
              return (
                <motion.button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square rounded-xl transition-all ${
                    card.isMatched 
                      ? 'bg-green-500/30 border-green-500/50' 
                      : 'bg-white/10 hover:bg-white/20 border-white/20'
                  } border`}
                  whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                  whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {isFlipped ? (
                      <motion.div
                        key="front"
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: 90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <span className={`${gridSize === 8 ? 'text-lg' : gridSize === 6 ? 'text-xl' : 'text-2xl'} font-bold text-white`}>
                          {card.type === 'character' ? card.character.character : card.character.romaji}
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ rotateY: -90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <span className={`${gridSize === 8 ? 'text-lg' : gridSize === 6 ? 'text-xl' : 'text-2xl'} text-white/30`}>?</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
