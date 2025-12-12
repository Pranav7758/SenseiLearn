export interface Achievement {
  id: string;
  title: string;
  titleJp: string;
  description: string;
  icon: string;
  condition: (stats: AchievementStats) => boolean;
  xpReward: number;
}

export interface AchievementStats {
  totalQuizzes: number;
  hiraganaProgress: number;
  katakanaProgress: number;
  kanjiProgress: number;
  grammarProgress: number;
  streak: number;
  totalXp: number;
  level: number;
  perfectQuizzes: number;
  speedAnswers: number;
}

export const achievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    titleJp: '第一歩',
    description: 'Complete your first quiz',
    icon: '👣',
    condition: (stats) => stats.totalQuizzes >= 1,
    xpReward: 50,
  },
  {
    id: 'kana-rookie',
    title: 'Kana Rookie',
    titleJp: 'かな初心者',
    description: 'Master 10 Hiragana characters',
    icon: '📚',
    condition: (stats) => stats.hiraganaProgress >= 10,
    xpReward: 100,
  },
  {
    id: 'hiragana-half',
    title: 'Hiragana Half',
    titleJp: 'ひらがな半分',
    description: 'Master 23 Hiragana characters',
    icon: '📖',
    condition: (stats) => stats.hiraganaProgress >= 23,
    xpReward: 200,
  },
  {
    id: 'hiragana-master',
    title: 'Hiragana Master',
    titleJp: 'ひらがなマスター',
    description: 'Master all 46 basic Hiragana characters',
    icon: '🎌',
    condition: (stats) => stats.hiraganaProgress >= 46,
    xpReward: 500,
  },
  {
    id: 'katakana-start',
    title: 'Katakana Start',
    titleJp: 'カタカナ開始',
    description: 'Master 10 Katakana characters',
    icon: '✨',
    condition: (stats) => stats.katakanaProgress >= 10,
    xpReward: 100,
  },
  {
    id: 'katakana-master',
    title: 'Katakana Master',
    titleJp: 'カタカナマスター',
    description: 'Master all 46 basic Katakana characters',
    icon: '🏆',
    condition: (stats) => stats.katakanaProgress >= 46,
    xpReward: 500,
  },
  {
    id: 'kanji-beginner',
    title: 'Kanji Beginner',
    titleJp: '漢字初心者',
    description: 'Learn 10 Kanji characters',
    icon: '🉐',
    condition: (stats) => stats.kanjiProgress >= 10,
    xpReward: 150,
  },
  {
    id: 'kanji-student',
    title: 'Kanji Student',
    titleJp: '漢字学生',
    description: 'Learn 20 Kanji characters',
    icon: '📝',
    condition: (stats) => stats.kanjiProgress >= 20,
    xpReward: 300,
  },
  {
    id: 'grammar-starter',
    title: 'Grammar Starter',
    titleJp: '文法入門',
    description: 'Complete 3 grammar topics',
    icon: '📐',
    condition: (stats) => stats.grammarProgress >= 3,
    xpReward: 150,
  },
  {
    id: 'three-day-streak',
    title: 'Three Day Streak',
    titleJp: '3日連続',
    description: 'Practice for 3 days in a row',
    icon: '🔥',
    condition: (stats) => stats.streak >= 3,
    xpReward: 100,
  },
  {
    id: 'seven-day-streak',
    title: 'Week Warrior',
    titleJp: '一週間戦士',
    description: 'Practice for 7 days in a row',
    icon: '💪',
    condition: (stats) => stats.streak >= 7,
    xpReward: 300,
  },
  {
    id: 'thirty-day-streak',
    title: 'Monthly Master',
    titleJp: '月間マスター',
    description: 'Practice for 30 days in a row',
    icon: '🌟',
    condition: (stats) => stats.streak >= 30,
    xpReward: 1000,
  },
  {
    id: 'perfect-quiz',
    title: 'Perfect Score',
    titleJp: '満点',
    description: 'Get 100% on a quiz',
    icon: '💯',
    condition: (stats) => stats.perfectQuizzes >= 1,
    xpReward: 100,
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    titleJp: 'スピードデーモン',
    description: 'Answer 10 questions correctly with 2 second timer or less',
    icon: '⚡',
    condition: (stats) => stats.speedAnswers >= 10,
    xpReward: 200,
  },
  {
    id: 'level-5',
    title: 'Rising Star',
    titleJp: '新星',
    description: 'Reach Level 5',
    icon: '⭐',
    condition: (stats) => stats.level >= 5,
    xpReward: 200,
  },
  {
    id: 'level-10',
    title: 'Dedicated Learner',
    titleJp: '熱心な学習者',
    description: 'Reach Level 10',
    icon: '🌙',
    condition: (stats) => stats.level >= 10,
    xpReward: 500,
  },
  {
    id: 'xp-1000',
    title: 'XP Collector',
    titleJp: 'XPコレクター',
    description: 'Earn 1000 XP total',
    icon: '💎',
    condition: (stats) => stats.totalXp >= 1000,
    xpReward: 100,
  },
  {
    id: 'xp-5000',
    title: 'XP Hunter',
    titleJp: 'XPハンター',
    description: 'Earn 5000 XP total',
    icon: '💠',
    condition: (stats) => stats.totalXp >= 5000,
    xpReward: 300,
  },
];

export const xpThresholds = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  850,    // Level 5
  1300,   // Level 6
  1900,   // Level 7
  2650,   // Level 8
  3550,   // Level 9
  4600,   // Level 10
  5800,   // Level 11
  7150,   // Level 12
  8650,   // Level 13
  10300,  // Level 14
  12100,  // Level 15
  14050,  // Level 16
  16150,  // Level 17
  18400,  // Level 18
  20800,  // Level 19
  23350,  // Level 20
];

export function getLevelFromXp(xp: number): number {
  for (let i = xpThresholds.length - 1; i >= 0; i--) {
    if (xp >= xpThresholds[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= xpThresholds.length) {
    return xpThresholds[xpThresholds.length - 1] + (currentLevel - xpThresholds.length + 1) * 3000;
  }
  return xpThresholds[currentLevel];
}

export function getXpProgress(xp: number, level: number): number {
  const currentLevelXp = xpThresholds[level - 1] || 0;
  const nextLevelXp = getXpForNextLevel(level);
  const progress = (xp - currentLevelXp) / (nextLevelXp - currentLevelXp);
  return Math.min(1, Math.max(0, progress));
}
