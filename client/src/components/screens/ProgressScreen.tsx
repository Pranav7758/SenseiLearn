import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/stores/useUserStore';
import { hiragana } from '@/data/hiragana';
import { katakana } from '@/data/katakana';
import { allKanji } from '@/data/kanji';
import { grammarTopics } from '@/data/grammar';
import { achievements } from '@/data/achievements';
import { getXpProgress, getXpForNextLevel } from '@/data/achievements';

export function ProgressScreen() {
  const {
    xp,
    level,
    streak,
    getMasteredCount,
    getWeakCharacters,
    characterProgress,
    grammarProgress,
    unlockedAchievements,
    totalQuizzes,
    perfectQuizzes,
  } = useUserStore();

  const hiraganaProgress = getMasteredCount('hiragana');
  const katakanaProgress = getMasteredCount('katakana');
  const kanjiProgress = getMasteredCount('kanji');

  const grammarMastered = useMemo(() => {
    return Object.values(grammarProgress).filter((p) => p.mastered).length;
  }, [grammarProgress]);

  const weakHiragana = getWeakCharacters('hiragana');
  const weakKatakana = getWeakCharacters('katakana');
  const weakKanji = getWeakCharacters('kanji');
  const allWeak = [...weakHiragana, ...weakKatakana, ...weakKanji];

  const xpProgressValue = getXpProgress(xp, level);
  const nextLevelXp = getXpForNextLevel(level);

  const stats = useMemo(() => {
    const allProgress = Object.values(characterProgress);
    const totalSeen = allProgress.filter((p) => p.timesSeen > 0).length;
    const totalMastered = allProgress.filter((p) => p.mastered).length;
    const avgAccuracy = allProgress.length > 0
      ? Math.round(allProgress.reduce((acc, p) => acc + p.accuracy, 0) / allProgress.length)
      : 0;
    return { totalSeen, totalMastered, avgAccuracy };
  }, [characterProgress]);

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Your Progress</h1>
          <p className="text-white/60">進捗状況 - Track your learning journey</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/20"
          >
            <p className="text-3xl font-bold text-yellow-400">{xp.toLocaleString()}</p>
            <p className="text-sm text-white/60">Total XP</p>
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-400 rounded-full"
                animate={{ width: `${xpProgressValue * 100}%` }}
              />
            </div>
            <p className="text-xs text-white/40 mt-1">{nextLevelXp - xp} XP to Level {level + 1}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/20"
          >
            <p className="text-3xl font-bold text-purple-400">Lv {level}</p>
            <p className="text-sm text-white/60">Current Level</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/20"
          >
            <p className="text-3xl font-bold text-orange-400">🔥 {streak}</p>
            <p className="text-sm text-white/60">Day Streak</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-4 border border-green-500/20"
          >
            <p className="text-3xl font-bold text-green-400">{totalQuizzes}</p>
            <p className="text-sm text-white/60">Quizzes Taken</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-medium text-white mb-4">Script Progress</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">Hiragana</span>
                  <span className="text-pink-400">{hiraganaProgress} / {hiragana.length}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                    animate={{ width: `${(hiraganaProgress / hiragana.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">Katakana</span>
                  <span className="text-blue-400">{katakanaProgress} / {katakana.length}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    animate={{ width: `${(katakanaProgress / katakana.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">Kanji</span>
                  <span className="text-purple-400">{kanjiProgress} / {allKanji.length}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
                    animate={{ width: `${(kanjiProgress / allKanji.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">Grammar</span>
                  <span className="text-emerald-400">{grammarMastered} / {grammarTopics.length}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    animate={{ width: `${(grammarMastered / grammarTopics.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-medium text-white mb-4">Statistics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{stats.totalSeen}</p>
                <p className="text-xs text-white/60">Characters Seen</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{stats.totalMastered}</p>
                <p className="text-xs text-white/60">Mastered</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{stats.avgAccuracy}%</p>
                <p className="text-xs text-white/60">Avg. Accuracy</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">{perfectQuizzes}</p>
                <p className="text-xs text-white/60">Perfect Quizzes</p>
              </div>
            </div>
          </motion.div>
        </div>

        {allWeak.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-red-500/10 rounded-2xl p-6 border border-red-500/30 mb-8"
          >
            <h3 className="text-lg font-medium text-red-400 mb-4">Characters to Practice</h3>
            <div className="flex flex-wrap gap-2">
              {allWeak.slice(0, 20).map((char) => (
                <div
                  key={`${char.type}-${char.character}`}
                  className="w-12 h-12 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center"
                >
                  <span className="text-lg text-white">{char.character}</span>
                </div>
              ))}
              {allWeak.length > 20 && (
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-sm text-white/60">+{allWeak.length - 20}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-medium text-white mb-4">
            Achievements ({unlockedAchievements.length} / {achievements.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-yellow-500/20 border-yellow-500/40'
                      : 'bg-white/5 border-white/10 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2 text-center">
                    {isUnlocked ? achievement.icon : '🔒'}
                  </div>
                  <p className="text-sm font-medium text-white text-center">{achievement.title}</p>
                  <p className="text-xs text-white/60 text-center">{achievement.titleJp}</p>
                  <p className="text-xs text-white/40 text-center mt-1">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
