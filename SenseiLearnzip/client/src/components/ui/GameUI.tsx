import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore, Screen } from '@/lib/stores/useAppStore';
import { getXpProgress, getXpForNextLevel } from '@/data/achievements';
import { motion, AnimatePresence } from 'framer-motion';

const mainNavItems = [
  { id: 'home', label: 'Dojo', icon: '⛩️' },
  { id: 'hiragana', label: 'Hiragana', icon: 'あ' },
  { id: 'katakana', label: 'Katakana', icon: 'ア' },
  { id: 'kanji', label: 'Kanji', icon: '漢' },
] as const;

const moreNavItems = [
  { id: 'grammar', label: 'Grammar', icon: '📜' },
  { id: 'daily', label: 'Quest', icon: '⚔️' },
  { id: 'games', label: 'Games', icon: '🎮' },
  { id: 'progress', label: 'Stats', icon: '📊' },
  { id: 'coach', label: 'Sensei', icon: '🥷' },
  { id: 'settings', label: 'Config', icon: '⚙️' },
] as const;

export function Navbar() {
  const { xp, level, streak, username, isAuthenticated } = useUserStore();
  const { setScreen, setShowAuthModal } = useAppStore();
  const xpProgress = getXpProgress(xp, level);
  const nextLevelXp = getXpForNextLevel(level);

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="bg-black/60 backdrop-blur-xl border-b border-amber-500/20 shadow-[0_4px_30px_rgba(255,165,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => setScreen('home')}
            >
              <div className="relative">
                <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,165,0,0.5)]">⛩️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider">
                  <span className="text-amber-400 drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]">SENSEI</span>
                  <span className="text-white/90">LEARN</span>
                </h1>
                <div className="text-[8px] text-amber-500/60 tracking-[0.2em] -mt-1">日本語の道場</div>
              </div>
            </motion.div>

            <div className="flex items-center space-x-3">
              <motion.div 
                className="flex items-center space-x-4 bg-gradient-to-r from-black/60 to-black/40 rounded-full px-4 py-2 border border-amber-500/20"
                whileHover={{ borderColor: 'rgba(251, 191, 36, 0.4)' }}
              >
                <div className="flex items-center space-x-2">
                  <motion.span 
                    className="text-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    🔥
                  </motion.span>
                  <div className="text-center">
                    <span className="text-amber-400 font-bold">{streak}</span>
                    <span className="text-white/40 text-xs block -mt-1">streak</span>
                  </div>
                </div>
                
                <div className="w-px h-6 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
                
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 flex items-center justify-center text-sm font-black text-white shadow-[0_0_15px_rgba(251,146,60,0.5)]"
                      animate={{ boxShadow: ['0 0 15px rgba(251,146,60,0.5)', '0 0 25px rgba(251,146,60,0.7)', '0 0 15px rgba(251,146,60,0.5)'] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {level}
                    </motion.div>
                    <div className="absolute -bottom-0.5 -right-0.5 bg-black rounded-full p-0.5">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                        <span className="text-[6px]">★</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-amber-400 text-xs font-bold">
                      {xp.toLocaleString()} <span className="text-amber-500/60 text-[10px]">XP</span>
                    </span>
                    <div className="w-16 h-1.5 bg-black/50 rounded-full overflow-hidden border border-amber-500/20">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-[9px] text-white/40">{Math.round(xpProgress * nextLevelXp)}/{nextLevelXp} to Lv{level + 1}</span>
                  </div>
                </div>
              </motion.div>

              {isAuthenticated ? (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-800/50 hover:to-pink-800/50 rounded-full px-3 py-1.5 border border-purple-500/30 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-sm">
                    {username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="text-white text-sm font-medium hidden md:block">{username}</span>
                </motion.button>
              ) : (
                <motion.button 
                  onClick={() => setShowAuthModal(true)}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold border border-purple-400/30 shadow-lg transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <span>⚡</span>
                    Sign In
                  </span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function BottomNavbar() {
  const { setScreen, currentScreen } = useAppStore();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {moreMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 left-0 right-0 z-40"
          >
            <div className="bg-black/95 backdrop-blur-xl border-t border-amber-500/20 p-4 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="text-center mb-3">
                <span className="text-amber-400 text-sm font-medium">More Training Areas</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {moreNavItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setScreen(item.id as Screen);
                      setMoreMenuOpen(false);
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center p-3 rounded-xl ${
                      currentScreen === item.id 
                        ? 'bg-amber-500/20 border border-amber-500/30' 
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className={`text-xs ${currentScreen === item.id ? 'text-amber-400' : 'text-white/60'}`}>
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-black/90 backdrop-blur-xl border-t border-amber-500/20 safe-area-pb">
          <div className="flex justify-around py-2 max-w-lg mx-auto">
            {mainNavItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  setScreen(item.id as Screen);
                  setMoreMenuOpen(false);
                }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center p-2 rounded-xl min-w-[60px] relative ${
                  currentScreen === item.id ? 'text-amber-400' : 'text-white/50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] mt-0.5">{item.label}</span>
                {currentScreen === item.id && (
                  <motion.div 
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-0.5 w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  />
                )}
              </motion.button>
            ))}
            <motion.button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center p-2 rounded-xl min-w-[60px] relative ${
                moreMenuOpen || moreNavItems.some(i => i.id === currentScreen)
                  ? 'text-amber-400' 
                  : 'text-white/50'
              }`}
            >
              <span className="text-xl">{moreMenuOpen ? '✕' : '☰'}</span>
              <span className="text-[10px] mt-0.5">More</span>
              {moreNavItems.some(i => i.id === currentScreen) && !moreMenuOpen && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-0.5 w-8 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}

interface NotificationToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'achievement';
  title: string;
  message?: string;
  onClose: () => void;
}

export function NotificationToast({ id, type, title, message, onClose }: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const configs = {
    success: { 
      bg: 'from-emerald-600 to-green-700', 
      border: 'border-emerald-400/50',
      icon: '✓',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]'
    },
    error: { 
      bg: 'from-red-600 to-rose-700', 
      border: 'border-red-400/50',
      icon: '✕',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]'
    },
    info: { 
      bg: 'from-blue-600 to-indigo-700', 
      border: 'border-blue-400/50',
      icon: 'ℹ',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]'
    },
    achievement: { 
      bg: 'from-amber-500 to-orange-600', 
      border: 'border-amber-400/50',
      icon: '🏆',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.4)]'
    },
  };

  const config = configs[type];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 300, opacity: 0, scale: 0.8 }}
      className={`bg-gradient-to-r ${config.bg} rounded-xl ${config.glow} p-4 min-w-[320px] flex items-start space-x-3 border ${config.border} backdrop-blur-sm`}
    >
      <motion.div 
        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl"
        animate={{ rotate: type === 'achievement' ? [0, -10, 10, 0] : 0 }}
        transition={{ repeat: type === 'achievement' ? Infinity : 0, duration: 0.5 }}
      >
        {config.icon}
      </motion.div>
      <div className="flex-1">
        <h4 className="text-white font-bold text-lg">{title}</h4>
        {message && <p className="text-white/80 text-sm">{message}</p>}
      </div>
      <button onClick={onClose} className="text-white/60 hover:text-white text-xl">
        ✕
      </button>
    </motion.div>
  );
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useAppStore();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3">
      <AnimatePresence>
        {notifications.map((notif) => (
          <NotificationToast
            key={notif.id}
            {...notif}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function LoadingOverlay() {
  const { isLoading } = useAppStore();

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center"
    >
      <motion.div 
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 flex flex-col items-center border border-amber-500/30 shadow-[0_0_50px_rgba(251,191,36,0.2)]"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <div className="relative">
          <motion.div 
            className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">⛩️</span>
          </div>
        </div>
        <p className="text-amber-400 mt-6 font-medium tracking-wider">LOADING...</p>
        <p className="text-white/40 text-sm mt-1">準備中</p>
      </motion.div>
    </motion.div>
  );
}
