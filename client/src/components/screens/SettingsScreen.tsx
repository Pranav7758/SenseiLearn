import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore } from '@/lib/stores/useAppStore';
import { useAudio } from '@/lib/stores/useAudio';

export function SettingsScreen() {
  const { 
    settings, 
    updateSettings, 
    isAuthenticated, 
    email, 
    username, 
    logout,
    setUsername 
  } = useUserStore();
  const { setShowAuthModal } = useAppStore();
  const { isMuted, toggleMute } = useAudio();

  const quizIntervalOptions = [0.5, 1, 2, 3, 5];

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      localStorage.removeItem('sensei-learn-user');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-white/60">設定 - Customize your experience</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-medium text-white mb-4">Quiz Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Quiz Timer Interval
                </label>
                <div className="flex flex-wrap gap-2">
                  {quizIntervalOptions.map((interval) => (
                    <button
                      key={interval}
                      onClick={() => updateSettings({ quizInterval: interval })}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        settings.quizInterval === interval
                          ? 'bg-white text-gray-900'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {interval}s
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/50 mt-2">
                  Time allowed per question in timed quizzes
                </p>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <div>
                  <p className="text-white font-medium">Show Romaji Hints</p>
                  <p className="text-sm text-white/60">Display romaji under characters</p>
                </div>
                <button
                  onClick={() => updateSettings({ showRomaji: !settings.showRomaji })}
                  className={`w-14 h-8 rounded-full transition-all ${
                    settings.showRomaji ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <div 
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      settings.showRomaji ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-medium text-white mb-4">Audio & Display</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-white font-medium">Sound Effects</p>
                  <p className="text-sm text-white/60">Play sounds for correct/incorrect answers</p>
                </div>
                <button
                  onClick={() => {
                    toggleMute();
                    updateSettings({ soundEnabled: isMuted });
                  }}
                  className={`w-14 h-8 rounded-full transition-all ${
                    !isMuted ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <div 
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      !isMuted ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <div>
                  <p className="text-white font-medium">Dark Theme</p>
                  <p className="text-sm text-white/60">Use dark mode (always on)</p>
                </div>
                <button
                  disabled
                  className="w-14 h-8 rounded-full bg-green-500 cursor-not-allowed"
                >
                  <div className="w-6 h-6 bg-white rounded-full shadow-md transform translate-x-7" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-medium text-white mb-4">Account</h3>
            
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{username}</p>
                    <p className="text-sm text-white/60">{email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                    placeholder="Your display name"
                  />
                </div>

                <button
                  onClick={logout}
                  className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-white/70 mb-4">
                  Create an account to save your progress in the cloud and sync across devices
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all"
                >
                  Sign In / Sign Up
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-red-500/10 rounded-2xl p-6 border border-red-500/30"
          >
            <h3 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h3>
            
            <div>
              <p className="text-white/70 mb-4">
                Reset all your progress, including XP, levels, and character mastery. This action cannot be undone.
              </p>
              <button
                onClick={handleResetProgress}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all"
              >
                Reset All Progress
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
