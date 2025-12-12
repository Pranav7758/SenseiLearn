import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore } from '@/lib/stores/useAppStore';
import { hiragana, allHiragana } from '@/data/hiragana';
import { katakana, allKatakana } from '@/data/katakana';
import { allKanji } from '@/data/kanji';

export function LearnScreen() {
  const { learnMode, learnIndex, setLearnIndex, endLearnMode, addNotification } = useAppStore();
  const { markCharacterMastered, addXp, characterProgress, settings } = useUserStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const characters = learnMode === 'hiragana' ? hiragana : 
                     learnMode === 'katakana' ? katakana : 
                     allKanji;
  const currentChar = characters[learnIndex];
  const isKanji = learnMode === 'kanji';

  useEffect(() => {
    clearCanvas();
  }, [learnIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '200px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if ('character' in currentChar) {
      ctx.fillText(currentChar.character, canvas.width / 2, canvas.height / 2);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPosition(e);
    setLastPos(pos);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    setLastPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMastered = () => {
    if (!learnMode) return;
    const char = 'character' in currentChar ? currentChar.character : '';
    markCharacterMastered(char, learnMode as 'hiragana' | 'katakana' | 'kanji');
    addXp(10);
    addNotification({
      type: 'success',
      title: 'Character Mastered!',
      message: `+10 XP for mastering ${char}`,
    });
    handleNext();
  };

  const handleNext = () => {
    if (learnIndex < characters.length - 1) {
      setLearnIndex(learnIndex + 1);
    } else {
      addNotification({
        type: 'achievement',
        title: 'Session Complete!',
        message: 'You\'ve reviewed all characters',
      });
      endLearnMode();
    }
  };

  const handlePrevious = () => {
    if (learnIndex > 0) {
      setLearnIndex(learnIndex - 1);
    }
  };

  if (!currentChar || !learnMode) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-white">No character to learn</p>
      </div>
    );
  }

  const progressKey = `${learnMode}-${'character' in currentChar ? currentChar.character : ''}`;
  const charProgress = characterProgress[progressKey];

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={endLearnMode}
            className="text-white/60 hover:text-white transition-all flex items-center space-x-2"
          >
            <span>←</span>
            <span>Exit</span>
          </button>
          <div className="text-center">
            <p className="text-white/60 text-sm">
              {learnIndex + 1} / {characters.length}
            </p>
          </div>
          <div className="w-16" />
        </div>

        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
            animate={{ width: `${((learnIndex + 1) / characters.length) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            key={learnIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
          >
            <div className="text-center mb-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={learnIndex}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-9xl font-bold text-white mb-4"
                >
                  {'character' in currentChar ? currentChar.character : ''}
                </motion.p>
              </AnimatePresence>

              {!isKanji && 'romaji' in currentChar && settings.showRomaji && (
                <p className="text-3xl text-white/70">{currentChar.romaji}</p>
              )}

              {isKanji && 'meaning' in currentChar && (
                <div className="space-y-2 mt-4">
                  <p className="text-2xl text-white">{currentChar.meaning}</p>
                  <div className="flex justify-center space-x-4 text-sm">
                    {'onyomi' in currentChar && currentChar.onyomi.length > 0 && (
                      <div className="bg-blue-500/20 px-3 py-1 rounded-lg">
                        <span className="text-blue-400">On: </span>
                        <span className="text-white">{currentChar.onyomi.join(', ')}</span>
                      </div>
                    )}
                    {'kunyomi' in currentChar && currentChar.kunyomi.length > 0 && (
                      <div className="bg-pink-500/20 px-3 py-1 rounded-lg">
                        <span className="text-pink-400">Kun: </span>
                        <span className="text-white">{currentChar.kunyomi.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isKanji && 'examples' in currentChar && currentChar.examples.length > 0 && (
              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-white/60 mb-2">Examples:</p>
                <div className="space-y-2">
                  {currentChar.examples.map((ex, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3">
                      <p className="text-white text-lg">{ex.word}</p>
                      <p className="text-white/60 text-sm">{ex.reading} - {ex.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {charProgress && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Accuracy</span>
                  <span className={`font-medium ${
                    charProgress.accuracy >= 80 ? 'text-green-400' :
                    charProgress.accuracy >= 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {charProgress.accuracy}%
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/60">Times seen</span>
                  <span className="text-white">{charProgress.timesSeen}</span>
                </div>
              </div>
            )}
          </motion.div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Practice Drawing</h3>
              <button
                onClick={clearCanvas}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all"
              >
                Clear
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width={350}
              height={350}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full aspect-square rounded-xl cursor-crosshair touch-none"
              style={{ backgroundColor: '#1a1a2e' }}
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={handlePrevious}
            disabled={learnIndex === 0}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition-all"
          >
            ← Previous
          </button>
          <button
            onClick={handleMastered}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all"
          >
            ✓ Mark as Mastered (+10 XP)
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
