import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore } from '@/lib/stores/useAppStore';
import { supabase, isCloudEnabled } from '@/lib/supabase';

export function AuthModal() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setUser, setUserAndResetProgress, loadFromCloud, syncToCloud, mergeCloudData } = useUserStore();
  const { showAuthModal, setShowAuthModal, addNotification } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!isCloudEnabled || !supabase) {
      setError('Cloud sync is not configured. Please set up Supabase environment variables.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setUser(data.user.id, email, username || email.split('@')[0]);
          await syncToCloud();
          addNotification({
            type: 'success',
            title: 'Welcome!',
            message: 'Your account has been created and progress saved to cloud',
          });
          setShowAuthModal(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const displayName = data.user.user_metadata?.username || email.split('@')[0];
          setUser(data.user.id, email, displayName);
          const loaded = await loadFromCloud();
          if (loaded) {
            await syncToCloud();
            addNotification({
              type: 'success',
              title: 'Welcome back!',
              message: 'Your progress has been synced with the cloud',
            });
          } else {
            await syncToCloud();
            addNotification({
              type: 'success',
              title: 'Welcome!',
              message: `Logged in as ${displayName}. Your progress will sync to the cloud.`,
            });
          }
          setShowAuthModal(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!showAuthModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAuthModal(false)}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 w-full max-w-md border border-white/10 shadow-2xl"
        >
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-all text-2xl"
          >
            ×
          </button>

          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🎌</span>
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-white/60">
              {mode === 'login' 
                ? 'Sign in to sync your progress' 
                : 'Start your Japanese learning journey'}
            </p>
          </div>

          <div className="flex mb-6 bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                mode === 'login' ? 'bg-white text-gray-900' : 'text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                mode === 'register' ? 'bg-white text-gray-900' : 'text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-white/70 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a display name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-white/70 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 text-white rounded-xl font-bold text-lg transition-all"
            >
              {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            By continuing, you agree to our Terms of Service
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
