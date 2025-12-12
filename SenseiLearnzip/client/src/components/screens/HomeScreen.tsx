import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore } from '@/lib/stores/useAppStore';
import { motion } from 'framer-motion';
import { hiragana } from '@/data/hiragana';
import { katakana } from '@/data/katakana';
import { allKanji } from '@/data/kanji';

interface GameCardProps {
  title: string;
  titleJp: string;
  description: string;
  icon: string;
  gradient: string;
  borderColor: string;
  glowColor: string;
  progress?: number;
  total?: number;
  onClick: () => void;
  delay?: number;
}

function GameCard({ title, titleJp, description, icon, gradient, borderColor, glowColor, progress, total, onClick, delay = 0 }: GameCardProps) {
  const progressPercent = progress !== undefined && total !== undefined ? (progress / total) * 100 : 0;
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100, damping: 15 }}
      onClick={onClick}
      className={`card-shine relative overflow-hidden rounded-2xl p-6 text-left ${gradient} border ${borderColor} backdrop-blur-sm group hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-300 ease-out`}
      style={{ boxShadow: `0 8px 32px ${glowColor}` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-2xl transform -translate-x-8 translate-y-8" />
      
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/60 animate-pulse" />
      
      <div className="absolute top-2 left-2 text-white/10 text-xs font-japanese">道</div>
      
      <div className="relative z-10">
        <span className="text-5xl mb-4 block filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300 origin-left">
          {icon}
        </span>
        <h3 className="text-2xl font-black text-white mb-0.5 tracking-wide">{title}</h3>
        <p className="text-sm text-white/50 mb-2 font-medium">{titleJp}</p>
        <p className="text-sm text-white/70">{description}</p>
        
        {progress !== undefined && total !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/60 mb-1.5">
              <span className="font-medium">修行</span>
              <span className="font-bold text-white">{progress} / {total}</span>
            </div>
            <div className="h-2.5 bg-black/30 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                className="h-full bg-gradient-to-r from-white/90 to-white/70 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, delay: delay + 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
              </motion.div>
            </div>
            <div className="text-right text-xs text-white/40 mt-1">{Math.round(progressPercent)}% 完了</div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white">→</span>
      </div>
    </motion.button>
  );
}

interface StatCardProps {
  value: string | number;
  label: string;
  icon: string;
  borderColor: string;
  glowColor: string;
  delay: number;
}

function StatCard({ value, label, icon, borderColor, glowColor, delay }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring" }}
      className={`card-shine bg-[#16161d] backdrop-blur-md rounded-2xl p-5 text-center relative overflow-hidden group border-2 ${borderColor} hover:scale-105 hover:-translate-y-1 transition-transform duration-300`}
      style={{ boxShadow: `0 0 20px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
      <div className="absolute -top-4 -right-4 text-6xl text-white/[0.03] font-japanese select-none">武</div>
      <motion.span 
        className="text-3xl block mb-2 relative z-10"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 3, delay }}
      >
        {icon}
      </motion.span>
      <p className="text-3xl font-black text-white relative z-10">{value}</p>
      <p className="text-xs text-white/50 font-medium tracking-wider uppercase mt-1 relative z-10">{label}</p>
    </motion.div>
  );
}

function FloatingKanji() {
  const kanjiList = ['道', '心', '力', '光', '夢', '愛', '勝', '武', '志', '魂'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {kanjiList.map((kanji, i) => (
        <motion.div
          key={i}
          className="absolute text-white/[0.02] font-japanese select-none"
          style={{
            fontSize: `${60 + Math.random() * 80}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        >
          {kanji}
        </motion.div>
      ))}
    </div>
  );
}

function SakuraPetals() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,182,193,0.6) 0%, rgba(255,105,180,0.3) 100%)',
            left: `${Math.random() * 100}%`,
            top: '-20px',
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 360],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function FloatingLanterns() {
  const lanterns = [
    { left: '5%', delay: 0 },
    { left: '15%', delay: 2 },
    { left: '85%', delay: 1 },
    { left: '92%', delay: 3 },
  ];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {lanterns.map((lantern, i) => (
        <motion.div
          key={i}
          className="absolute top-20"
          style={{ left: lantern.left }}
          animate={{
            y: [0, -10, 0],
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: lantern.delay,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <div className="w-1 h-8 bg-gradient-to-b from-amber-900/40 to-transparent mx-auto" />
            <motion.div 
              className="w-8 h-12 rounded-lg relative"
              style={{
                background: 'linear-gradient(180deg, rgba(255,100,50,0.3) 0%, rgba(255,150,50,0.5) 50%, rgba(255,100,50,0.3) 100%)',
                boxShadow: '0 0 20px rgba(255,150,50,0.4), inset 0 0 10px rgba(255,200,100,0.3)',
              }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255,150,50,0.4), inset 0 0 10px rgba(255,200,100,0.3)',
                  '0 0 30px rgba(255,150,50,0.6), inset 0 0 15px rgba(255,200,100,0.5)',
                  '0 0 20px rgba(255,150,50,0.4), inset 0 0 10px rgba(255,200,100,0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: lantern.delay * 0.5 }}
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-red-900/60 rounded-t-lg" />
              <div className="absolute inset-x-0 bottom-0 h-2 bg-red-900/60 rounded-b-lg" />
              <div className="absolute inset-0 flex items-center justify-center text-amber-200/60 text-xs font-japanese">福</div>
            </motion.div>
            <div className="w-2 h-3 bg-amber-600/30 mx-auto rounded-b" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AnimeSparkles() {
  const sparklePositions = [
    { left: '10%', top: '20%', delay: 0, size: 'w-2 h-2' },
    { left: '25%', top: '15%', delay: 0.5, size: 'w-3 h-3' },
    { left: '70%', top: '25%', delay: 1, size: 'w-2 h-2' },
    { left: '85%', top: '10%', delay: 1.5, size: 'w-2 h-2' },
    { left: '45%', top: '8%', delay: 2, size: 'w-3 h-3' },
    { left: '60%', top: '35%', delay: 2.5, size: 'w-2 h-2' },
    { left: '30%', top: '40%', delay: 3, size: 'w-2 h-2' },
    { left: '80%', top: '45%', delay: 3.5, size: 'w-3 h-3' },
  ];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparklePositions.map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos.size}`}
          style={{ left: pos.left, top: pos.top }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: pos.delay,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path 
              d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" 
              fill="rgba(255,215,0,0.6)"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function DragonDecoration() {
  return (
    <div className="fixed top-32 right-8 pointer-events-none z-0 hidden lg:block">
      <motion.div
        className="text-6xl opacity-10"
        animate={{
          scale: [1, 1.05, 1],
          filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🐉
      </motion.div>
    </div>
  );
}

export function HomeScreen() {
  const { xp, level, streak, getMasteredCount, dailyChallengeDate } = useUserStore();
  const { setScreen, startLearnMode } = useAppStore();

  const today = new Date().toISOString().split('T')[0];
  const isDailyChallengeAvailable = dailyChallengeDate !== today;

  const hiraganaProgress = getMasteredCount('hiragana');
  const katakanaProgress = getMasteredCount('katakana');
  const kanjiProgress = getMasteredCount('kanji');
  const totalKanaMastery = Math.round(((hiraganaProgress + katakanaProgress) / 92) * 100);

  return (
    <div className="min-h-screen pt-20 pb-28 lg:pb-8 px-4 relative">
      <FloatingKanji />
      <SakuraPetals />
      <FloatingLanterns />
      <AnimeSparkles />
      <DragonDecoration />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-block mb-4 relative"
          >
            <span className="text-6xl filter drop-shadow-[0_0_20px_rgba(255,200,100,0.5)]">⛩️</span>
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-amber-500/20 text-2xl">〈</div>
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-amber-500/20 text-2xl">〉</div>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 drop-shadow-[0_0_30px_rgba(251,146,60,0.4)]">
              Welcome, Warrior
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-md mx-auto">
            Your journey to mastering Japanese begins here
          </p>
          <motion.p 
            className="text-base text-amber-500/80 mt-2 font-japanese tracking-wider"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            日本語の道を歩め
          </motion.p>
          <div className="flex justify-center gap-4 mt-3 text-white/20 text-sm">
            <span>━━━</span>
            <span className="text-amber-500/40">✦</span>
            <span>━━━</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard 
            value={xp.toLocaleString()}
            label="Total XP"
            icon="⚡"
            borderColor="border-orange-500/50"
            glowColor="rgba(249, 115, 22, 0.15)"
            delay={0.1}
          />
          <StatCard 
            value={`Lv ${level}`}
            label="Rank"
            icon="🏅"
            borderColor="border-purple-500/50"
            glowColor="rgba(168, 85, 247, 0.15)"
            delay={0.15}
          />
          <StatCard 
            value={`${streak}`}
            label="Day Streak"
            icon="🔥"
            borderColor="border-orange-600/50"
            glowColor="rgba(234, 88, 12, 0.15)"
            delay={0.2}
          />
          <StatCard 
            value={`${totalKanaMastery}%`}
            label="Kana Power"
            icon="💪"
            borderColor="border-teal-500/50"
            glowColor="rgba(20, 184, 166, 0.15)"
            delay={0.25}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-5"
        >
          <h2 className="text-xl font-bold text-white/80 flex items-center gap-3">
            <span className="text-amber-500/30">【</span>
            <span className="text-amber-400">⚔️</span>
            <span>Choose Your Training</span>
            <span className="text-white/30 font-japanese text-sm ml-2">修行を選べ</span>
            <span className="text-amber-500/30">】</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <GameCard
            title="Hiragana"
            titleJp="ひらがな"
            description="Master the foundation of Japanese writing"
            icon="あ"
            gradient="bg-gradient-to-br from-pink-600/80 to-rose-800/80"
            borderColor="border-pink-400/30"
            glowColor="rgba(236, 72, 153, 0.2)"
            progress={hiraganaProgress}
            total={hiragana.length}
            onClick={() => setScreen('hiragana')}
            delay={0.35}
          />
          <GameCard
            title="Katakana"
            titleJp="カタカナ"
            description="Unlock foreign words & tech terms"
            icon="ア"
            gradient="bg-gradient-to-br from-blue-600/80 to-indigo-800/80"
            borderColor="border-blue-400/30"
            glowColor="rgba(59, 130, 246, 0.2)"
            progress={katakanaProgress}
            total={katakana.length}
            onClick={() => setScreen('katakana')}
            delay={0.4}
          />
          <GameCard
            title="Kanji"
            titleJp="漢字"
            description="Conquer the ancient characters"
            icon="漢"
            gradient="bg-gradient-to-br from-purple-600/80 to-violet-800/80"
            borderColor="border-purple-400/30"
            glowColor="rgba(139, 92, 246, 0.2)"
            progress={kanjiProgress}
            total={allKanji.length}
            onClick={() => setScreen('kanji')}
            delay={0.45}
          />
          <GameCard
            title="Grammar"
            titleJp="文法"
            description="Learn sentence patterns & structure"
            icon="📜"
            gradient="bg-gradient-to-br from-emerald-600/80 to-teal-800/80"
            borderColor="border-emerald-400/30"
            glowColor="rgba(16, 185, 129, 0.2)"
            onClick={() => setScreen('grammar')}
            delay={0.5}
          />
          <GameCard
            title="Daily Quest"
            titleJp="今日の挑戦"
            description={isDailyChallengeAvailable ? "Complete for bonus XP rewards!" : "Quest completed! Return tomorrow"}
            icon={isDailyChallengeAvailable ? "⚔️" : "✅"}
            gradient={isDailyChallengeAvailable 
              ? "bg-gradient-to-br from-amber-600/80 to-orange-800/80" 
              : "bg-gradient-to-br from-gray-600/80 to-gray-800/80"
            }
            borderColor={isDailyChallengeAvailable ? "border-amber-400/30" : "border-gray-400/30"}
            glowColor={isDailyChallengeAvailable ? "rgba(245, 158, 11, 0.2)" : "rgba(107, 114, 128, 0.1)"}
            onClick={() => isDailyChallengeAvailable && setScreen('daily')}
            delay={0.55}
          />
          <GameCard
            title="Sensei AI"
            titleJp="先生"
            description="Get personalized training advice"
            icon="🥷"
            gradient="bg-gradient-to-br from-cyan-600/80 to-blue-800/80"
            borderColor="border-cyan-400/30"
            glowColor="rgba(6, 182, 212, 0.2)"
            onClick={() => setScreen('coach')}
            delay={0.6}
          />
          <GameCard
            title="Mini Games"
            titleJp="ミニゲーム"
            description="Fun arcade-style games to practice!"
            icon="🎮"
            gradient="bg-gradient-to-br from-red-600/80 to-orange-800/80"
            borderColor="border-red-400/30"
            glowColor="rgba(239, 68, 68, 0.2)"
            onClick={() => setScreen('games')}
            delay={0.65}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md rounded-2xl p-6 border border-amber-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 text-8xl text-white/[0.02] font-japanese select-none">稽古</div>
          <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
            <span>⚡</span> Quick Training
            <span className="text-white/30 font-japanese text-sm ml-2">早稽古</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
            {[
              { label: 'Train Hiragana', labelJp: 'ひらがな', mode: 'hiragana' as const, icon: 'あ', color: 'from-pink-600/30 to-pink-800/30', border: 'border-pink-500/30' },
              { label: 'Train Katakana', labelJp: 'カタカナ', mode: 'katakana' as const, icon: 'ア', color: 'from-blue-600/30 to-blue-800/30', border: 'border-blue-500/30' },
              { label: 'Train Kanji', labelJp: '漢字', mode: 'kanji' as const, icon: '字', color: 'from-purple-600/30 to-purple-800/30', border: 'border-purple-500/30' },
              { label: 'View Stats', labelJp: '統計', mode: null, icon: '📊', color: 'from-green-600/30 to-green-800/30', border: 'border-green-500/30' },
            ].map((item, i) => (
              <motion.button 
                key={item.label}
                onClick={() => item.mode ? startLearnMode(item.mode) : setScreen('progress')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className={`card-shine bg-gradient-to-br ${item.color} hover:brightness-125 border ${item.border} rounded-xl p-4 text-center transition-all group hover:scale-[1.03] hover:-translate-y-1 duration-300`}
              >
                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="text-white text-sm font-medium block">{item.label}</span>
                <span className="text-white/40 text-xs font-japanese">{item.labelJp}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-4 text-white/20">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/30" />
            <span className="font-japanese text-amber-500/40 text-sm">一期一会</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/30" />
          </div>
          <p className="text-white/30 text-xs mt-2">Every moment is a once-in-a-lifetime encounter</p>
        </motion.div>
      </div>
    </div>
  );
}
