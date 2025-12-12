import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useUserStore } from '@/lib/stores/useUserStore';

interface MiniGame {
  id: string;
  title: string;
  titleJp: string;
  description: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  screen: 'ninja-kana' | 'kanji-match' | 'word-builder' | 'character-catch' | 'listening-challenge' | 'sentence-scramble' | 'boss-battle' | 'vocabulary-race';
  unlockRequirement?: string;
  isLocked?: boolean;
  isNew?: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Boss';
  xpReward: number;
}

export function MiniGamesScreen() {
  const { setScreen } = useAppStore();
  const { getMasteredCount, level } = useUserStore();
  
  const hiraganaProgress = getMasteredCount('hiragana');
  const katakanaProgress = getMasteredCount('katakana');

  const miniGames: MiniGame[] = [
    {
      id: 'ninja-kana',
      title: 'Ninja Kana',
      titleJp: '忍者かな',
      description: 'Type romaji before falling characters hit the bottom! Build combos for bonus XP.',
      icon: '🥷',
      bgColor: 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]',
      borderColor: 'border-red-500/50',
      screen: 'ninja-kana',
      difficulty: 'Easy',
      xpReward: 15,
    },
    {
      id: 'kanji-match',
      title: 'Kanji Match',
      titleJp: '漢字マッチ',
      description: 'Flip cards to match kanji with their meanings. Train your memory!',
      icon: '🎴',
      bgColor: 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]',
      borderColor: 'border-purple-500/50',
      screen: 'kanji-match',
      unlockRequirement: 'Master 10 Hiragana',
      isLocked: hiraganaProgress < 10,
      difficulty: 'Medium',
      xpReward: 20,
    },
    {
      id: 'word-builder',
      title: 'Word Builder',
      titleJp: '言葉ビルダー',
      description: 'Build Japanese words by selecting the correct kana in order.',
      icon: '🧱',
      bgColor: 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]',
      borderColor: 'border-emerald-500/50',
      screen: 'word-builder',
      unlockRequirement: 'Master 20 Hiragana',
      isLocked: hiraganaProgress < 20,
      difficulty: 'Medium',
      xpReward: 25,
    },
    {
      id: 'character-catch',
      title: 'Character Catch',
      titleJp: 'キャラキャッチ',
      description: 'Tap the correct characters as they float across the screen!',
      icon: '🎯',
      bgColor: 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]',
      borderColor: 'border-cyan-500/50',
      screen: 'character-catch',
      unlockRequirement: 'Master 15 characters',
      isLocked: (hiraganaProgress + katakanaProgress) < 15,
      difficulty: 'Easy',
      xpReward: 15,
    },
    {
      id: 'listening-challenge',
      title: 'Listening Challenge',
      titleJp: '聞き取りチャレンジ',
      description: 'Listen to Japanese audio and select the correct written form!',
      icon: '🎧',
      bgColor: 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]',
      borderColor: 'border-teal-500/50',
      screen: 'listening-challenge',
      isNew: true,
      difficulty: 'Medium',
      xpReward: 25,
    },
    {
      id: 'sentence-scramble',
      title: 'Sentence Scramble',
      titleJp: '文章パズル',
      description: 'Unscramble Japanese sentences by dragging words in order!',
      icon: '📝',
      bgColor: 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]',
      borderColor: 'border-amber-500/50',
      screen: 'sentence-scramble',
      unlockRequirement: 'Master 15 Hiragana',
      isLocked: hiraganaProgress < 15,
      isNew: true,
      difficulty: 'Hard',
      xpReward: 30,
    },
    {
      id: 'boss-battle',
      title: 'Boss Battles',
      titleJp: 'ボス戦',
      description: 'Face off against AI Masters in timed quiz battles! Defeat them to earn rewards.',
      icon: '⚔️',
      bgColor: 'bg-gradient-to-br from-[#2d1b1b] to-[#1a1a2e]',
      borderColor: 'border-rose-500/50',
      screen: 'boss-battle',
      isNew: true,
      difficulty: 'Boss',
      xpReward: 50,
    },
    {
      id: 'vocabulary-race',
      title: 'Vocabulary Race',
      titleJp: '単語レース',
      description: 'Learn new words in a racing game! Speed up with correct answers.',
      icon: '🏃',
      bgColor: 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]',
      borderColor: 'border-green-500/50',
      screen: 'vocabulary-race',
      isNew: true,
      difficulty: 'Easy',
      xpReward: 20,
    },
  ];

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hard':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Boss':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f] pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header - RPG Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 blur-lg" />
            <h1 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent tracking-wider">
              ⚔️ MINI GAMES ⚔️
            </h1>
          </div>
          <p className="text-amber-400/60 mt-3 text-lg tracking-widest">
            ミニゲーム — Train your skills, earn rewards
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <span className="text-amber-500/50">⛩️</span>
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4 mb-8 flex-wrap"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-lg border border-amber-500/20">
            <span className="text-amber-400">🎮</span>
            <span className="text-white/80 text-sm">8 Games Available</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-lg border border-green-500/20">
            <span className="text-green-400">✓</span>
            <span className="text-white/80 text-sm">{miniGames.filter(g => !g.isLocked).length} Unlocked</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-lg border border-purple-500/20">
            <span className="text-purple-400">⚡</span>
            <span className="text-white/80 text-sm">Level {level}</span>
          </div>
        </motion.div>

        {/* Games Grid - RPG Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {miniGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => !game.isLocked && setScreen(game.screen)}
                disabled={game.isLocked}
                className={`w-full text-left transition-all duration-300 ${
                  game.isLocked 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-[1.02] hover:-translate-y-1'
                }`}
              >
                <div className={`relative ${game.bgColor} rounded-xl border-2 ${game.borderColor} overflow-hidden shadow-lg`}>
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/30" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/30" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/30" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/30" />
                  
                  {/* NEW Badge */}
                  {game.isNew && !game.isLocked && (
                    <div className="absolute top-3 right-3 z-10">
                      <motion.span 
                        className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold rounded shadow-lg shadow-amber-500/30"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        NEW!
                      </motion.span>
                    </div>
                  )}

                  {/* Locked Overlay */}
                  {game.isLocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                      <div className="text-center">
                        <motion.span 
                          className="text-5xl block mb-2"
                          animate={{ rotateY: [0, 360] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        >
                          🔒
                        </motion.span>
                        <p className="text-white/70 text-sm px-4">{game.unlockRequirement}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-5 relative">
                    <div className="flex items-start gap-4">
                      {/* Icon Container */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                        <span className="text-4xl">{game.icon}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-white">{game.title}</h3>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getDifficultyStyle(game.difficulty)}`}>
                            {game.difficulty}
                          </span>
                        </div>
                        <p className="text-amber-400/70 text-xs font-medium">{game.titleJp}</p>
                        <p className="text-white/60 text-sm mt-2 leading-relaxed line-clamp-2">{game.description}</p>
                        
                        {/* XP Reward */}
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-yellow-400 text-xs">⭐</span>
                          <span className="text-white/50 text-xs">+{game.xpReward} XP per round</span>
                        </div>
                      </div>
                    </div>

                    {/* Play Arrow */}
                    {!game.isLocked && (
                      <motion.div 
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                          <span className="text-amber-400">▶</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Tips Section - RPG Scroll Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 blur-sm rounded-xl" />
          <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-xl border border-amber-500/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 px-6 py-3 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📜</span>
                <h3 className="text-lg font-bold text-amber-400 tracking-wide">SENSEI'S TIPS</h3>
                <span className="text-amber-400/50 text-sm">— 先生のアドバイス</span>
              </div>
            </div>
            
            {/* Tips Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <span className="text-2xl">🥷</span>
                <div>
                  <p className="text-white/80 text-sm font-medium">Start with Ninja Kana</p>
                  <p className="text-white/50 text-xs">Build speed and accuracy with basic characters</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <span className="text-2xl">⚔️</span>
                <div>
                  <p className="text-white/80 text-sm font-medium">Challenge the Boss</p>
                  <p className="text-white/50 text-xs">Earn massive XP by defeating AI Masters</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <span className="text-2xl">🎧</span>
                <div>
                  <p className="text-white/80 text-sm font-medium">Train Your Ears</p>
                  <p className="text-white/50 text-xs">Listening Challenge improves pronunciation</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                <span className="text-2xl">📝</span>
                <div>
                  <p className="text-white/80 text-sm font-medium">Master Grammar</p>
                  <p className="text-white/50 text-xs">Sentence Scramble teaches word order</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative Bottom */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-4 text-amber-500/30">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-amber-500/30" />
            <span>頑張って</span>
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-amber-500/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
