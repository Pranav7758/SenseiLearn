import { useEffect, useRef } from 'react';
import { useUserStore } from '@/lib/stores/useUserStore';
import { useAppStore } from '@/lib/stores/useAppStore';
import { achievements, AchievementStats } from '@/data/achievements';

export function useAchievementChecker() {
  const { 
    xp, 
    level, 
    streak, 
    totalQuizzes, 
    perfectQuizzes, 
    speedAnswers,
    characterProgress,
    grammarProgress,
    unlockedAchievements, 
    unlockAchievement,
    addXp,
  } = useUserStore();
  
  const { addNotification } = useAppStore();
  const checkedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const hiraganaProgress = Object.values(characterProgress)
      .filter(p => p.type === 'hiragana' && p.mastered)
      .length;
    
    const katakanaProgress = Object.values(characterProgress)
      .filter(p => p.type === 'katakana' && p.mastered)
      .length;
    
    const kanjiProgress = Object.values(characterProgress)
      .filter(p => p.type === 'kanji' && p.mastered)
      .length;

    const grammarProgressCount = Object.values(grammarProgress)
      .filter(p => p.mastered)
      .length;

    const stats: AchievementStats = {
      totalQuizzes,
      hiraganaProgress,
      katakanaProgress,
      kanjiProgress,
      grammarProgress: grammarProgressCount,
      streak,
      totalXp: xp,
      level,
      perfectQuizzes,
      speedAnswers,
    };

    achievements.forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return;
      if (checkedRef.current.has(achievement.id)) return;

      if (achievement.condition(stats)) {
        unlockAchievement(achievement.id);
        addXp(achievement.xpReward);
        
        addNotification({
          type: 'achievement',
          title: `Achievement Unlocked: ${achievement.title}`,
          message: `${achievement.icon} ${achievement.description} (+${achievement.xpReward} XP)`,
          duration: 5000,
        });

        checkedRef.current.add(achievement.id);
      }
    });
  }, [
    xp, 
    level, 
    streak, 
    totalQuizzes, 
    perfectQuizzes, 
    speedAnswers, 
    characterProgress, 
    grammarProgress, 
    unlockedAchievements
  ]);

  return null;
}
