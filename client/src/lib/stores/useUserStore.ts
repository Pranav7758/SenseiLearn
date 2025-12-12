import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLevelFromXp, getXpForNextLevel, getXpProgress } from '@/data/achievements';
import { saveProgressToCloud, loadProgressFromCloud, mapCloudDataToState } from '@/lib/cloudSync';

const userSyncState: Map<string, {
  timeout: ReturnType<typeof setTimeout> | null;
  saveChain: Promise<void>;
}> = new Map();

const getSyncState = (userId: string) => {
  if (!userSyncState.has(userId)) {
    userSyncState.set(userId, {
      timeout: null,
      saveChain: Promise.resolve(),
    });
  }
  return userSyncState.get(userId)!;
};

const sanitizeStateForCloud = (state: any) => ({
  xp: state.xp,
  level: state.level,
  streak: state.streak,
  lastActiveDate: state.lastActiveDate,
  username: state.username,
  characterProgress: state.characterProgress,
  grammarProgress: state.grammarProgress,
  unlockedAchievements: state.unlockedAchievements,
  dailyChallengeCompleted: state.dailyChallengeCompleted,
  dailyChallengeDate: state.dailyChallengeDate,
  totalQuizzes: state.totalQuizzes,
  perfectQuizzes: state.perfectQuizzes,
  speedAnswers: state.speedAnswers,
  settings: state.settings,
});

const enqueueSave = (userId: string, stateData: any): void => {
  const syncState = getSyncState(userId);
  syncState.saveChain = syncState.saveChain
    .then(async () => {
      await saveProgressToCloud(userId, stateData);
    })
    .catch((err) => console.error('Cloud sync error:', err));
};

const debouncedCloudSync = (userId: string, getState: () => any) => {
  const syncState = getSyncState(userId);
  
  if (syncState.timeout) {
    clearTimeout(syncState.timeout);
  }
  
  const stateSnapshot = sanitizeStateForCloud(getState());
  
  syncState.timeout = setTimeout(() => {
    enqueueSave(userId, stateSnapshot);
    syncState.timeout = null;
  }, 1000);
};

const clearUserSyncState = (userId: string) => {
  const syncState = userSyncState.get(userId);
  if (syncState?.timeout) {
    clearTimeout(syncState.timeout);
  }
  userSyncState.delete(userId);
};

const flushPendingSync = async (userId: string, getState: () => any): Promise<void> => {
  const syncState = getSyncState(userId);
  
  if (syncState.timeout) {
    clearTimeout(syncState.timeout);
    syncState.timeout = null;
  }
  
  const stateData = sanitizeStateForCloud(getState());
  enqueueSave(userId, stateData);
  
  await getSyncState(userId).saveChain;
  
  clearUserSyncState(userId);
};

export interface UserSettings {
  quizInterval: number;
  soundEnabled: boolean;
  showRomaji: boolean;
  theme: 'light' | 'dark';
}

export interface CharacterProgress {
  character: string;
  type: 'hiragana' | 'katakana' | 'kanji';
  timesSeen: number;
  timesCorrect: number;
  accuracy: number;
  mastered: boolean;
  isWeak: boolean;
  lastPracticed: string;
}

export interface GrammarTopicProgress {
  topicId: string;
  timesPracticed: number;
  timesCorrect: number;
  accuracy: number;
  mastered: boolean;
  lastPracticed: string;
}

export interface UserState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  username: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  settings: UserSettings;
  characterProgress: Record<string, CharacterProgress>;
  grammarProgress: Record<string, GrammarTopicProgress>;
  unlockedAchievements: string[];
  dailyChallengeCompleted: boolean;
  dailyChallengeDate: string | null;
  totalQuizzes: number;
  perfectQuizzes: number;
  speedAnswers: number;
  
  setUser: (userId: string, email: string, username: string) => void;
  setUserAndResetProgress: (userId: string, email: string, username: string) => void;
  logout: () => Promise<void>;
  addXp: (amount: number) => void;
  updateStreak: () => void;
  updateCharacterProgress: (character: string, type: 'hiragana' | 'katakana' | 'kanji', correct: boolean) => void;
  updateGrammarProgress: (topicId: string, correct: boolean) => void;
  markCharacterWeak: (character: string, type: 'hiragana' | 'katakana' | 'kanji', isWeak: boolean) => void;
  markCharacterMastered: (character: string, type: 'hiragana' | 'katakana' | 'kanji') => void;
  unlockAchievement: (achievementId: string) => void;
  completeDailyChallenge: (xpEarned: number) => void;
  incrementQuizCount: (perfect: boolean) => void;
  incrementSpeedAnswers: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setUsername: (username: string) => void;
  getXpProgress: () => number;
  getXpForNextLevel: () => number;
  getMasteredCount: (type: 'hiragana' | 'katakana' | 'kanji') => number;
  getWeakCharacters: (type: 'hiragana' | 'katakana' | 'kanji') => CharacterProgress[];
  syncToCloud: () => Promise<boolean>;
  loadFromCloud: () => Promise<boolean>;
  mergeCloudData: (cloudData: Partial<UserState>) => void;
}

const defaultSettings: UserSettings = {
  quizInterval: 3,
  soundEnabled: true,
  showRomaji: true,
  theme: 'dark',
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userId: null,
      email: null,
      username: 'Guest',
      avatarUrl: null,
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null,
      settings: defaultSettings,
      characterProgress: {},
      grammarProgress: {},
      unlockedAchievements: [],
      dailyChallengeCompleted: false,
      dailyChallengeDate: null,
      totalQuizzes: 0,
      perfectQuizzes: 0,
      speedAnswers: 0,

      setUser: (userId, email, username) => set({
        isAuthenticated: true,
        userId,
        email,
        username,
      }),

      setUserAndResetProgress: (userId, email, username) => set({
        isAuthenticated: true,
        userId,
        email,
        username,
        xp: 0,
        level: 1,
        streak: 0,
        lastActiveDate: null,
        characterProgress: {},
        grammarProgress: {},
        unlockedAchievements: [],
        dailyChallengeCompleted: false,
        dailyChallengeDate: null,
        totalQuizzes: 0,
        perfectQuizzes: 0,
        speedAnswers: 0,
      }),

      logout: async () => {
        const state = get();
        if (state.userId) {
          await flushPendingSync(state.userId, get);
        }
        set({
          isAuthenticated: false,
          userId: null,
          email: null,
          username: 'Guest',
          avatarUrl: null,
        });
      },

      addXp: (amount) => {
        set((state) => {
          const newXp = state.xp + amount;
          const newLevel = getLevelFromXp(newXp);
          return {
            xp: newXp,
            level: newLevel,
          };
        });
        const state = get();
        if (state.userId) {
          debouncedCloudSync(state.userId, get);
        }
      },

      updateStreak: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          
          if (state.lastActiveDate === today) {
            return state;
          }
          
          if (state.lastActiveDate === yesterday) {
            return {
              streak: state.streak + 1,
              lastActiveDate: today,
            };
          }
          
          return {
            streak: 1,
            lastActiveDate: today,
          };
        });
        const state = get();
        if (state.userId) {
          debouncedCloudSync(state.userId, get);
        }
      },

      updateCharacterProgress: (character, type, correct) => {
        set((state) => {
          const key = `${type}-${character}`;
          const existing = state.characterProgress[key] || {
            character,
            type,
            timesSeen: 0,
            timesCorrect: 0,
            accuracy: 0,
            mastered: false,
            isWeak: false,
            lastPracticed: new Date().toISOString(),
          };

          const timesSeen = existing.timesSeen + 1;
          const timesCorrect = existing.timesCorrect + (correct ? 1 : 0);
          const accuracy = Math.round((timesCorrect / timesSeen) * 100);
          const mastered = timesSeen >= 5 && accuracy >= 80;
          const isWeak = timesSeen >= 3 && accuracy < 50;

          return {
            characterProgress: {
              ...state.characterProgress,
              [key]: {
                ...existing,
                timesSeen,
                timesCorrect,
                accuracy,
                mastered,
                isWeak: isWeak || existing.isWeak,
                lastPracticed: new Date().toISOString(),
              },
            },
          };
        });
        const state = get();
        if (state.userId) {
          debouncedCloudSync(state.userId, get);
        }
      },

      updateGrammarProgress: (topicId, correct) => {
        set((state) => {
          const existing = state.grammarProgress[topicId] || {
            topicId,
            timesPracticed: 0,
            timesCorrect: 0,
            accuracy: 0,
            mastered: false,
            lastPracticed: new Date().toISOString(),
          };

          const timesPracticed = existing.timesPracticed + 1;
          const timesCorrect = existing.timesCorrect + (correct ? 1 : 0);
          const accuracy = Math.round((timesCorrect / timesPracticed) * 100);
          const mastered = timesPracticed >= 3 && accuracy >= 70;

          return {
            grammarProgress: {
              ...state.grammarProgress,
              [topicId]: {
                ...existing,
                timesPracticed,
                timesCorrect,
                accuracy,
                mastered,
                lastPracticed: new Date().toISOString(),
              },
            },
          };
        });
        const state = get();
        if (state.userId) {
          debouncedCloudSync(state.userId, get);
        }
      },

      markCharacterWeak: (character, type, isWeak) => set((state) => {
        const key = `${type}-${character}`;
        const existing = state.characterProgress[key];
        if (!existing) return state;

        return {
          characterProgress: {
            ...state.characterProgress,
            [key]: {
              ...existing,
              isWeak,
            },
          },
        };
      }),

      markCharacterMastered: (character, type) => set((state) => {
        const key = `${type}-${character}`;
        const existing = state.characterProgress[key] || {
          character,
          type,
          timesSeen: 5,
          timesCorrect: 5,
          accuracy: 100,
          mastered: false,
          isWeak: false,
          lastPracticed: new Date().toISOString(),
        };

        return {
          characterProgress: {
            ...state.characterProgress,
            [key]: {
              ...existing,
              mastered: true,
              isWeak: false,
            },
          },
        };
      }),

      unlockAchievement: (achievementId) => {
        const currentState = get();
        if (currentState.unlockedAchievements.includes(achievementId)) {
          return;
        }
        set((state) => ({
          unlockedAchievements: [...state.unlockedAchievements, achievementId],
        }));
        const state = get();
        if (state.userId) {
          debouncedCloudSync(state.userId, get);
        }
      },

      completeDailyChallenge: (xpEarned) => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          return {
            dailyChallengeCompleted: true,
            dailyChallengeDate: today,
            xp: state.xp + xpEarned,
            level: getLevelFromXp(state.xp + xpEarned),
          };
        });
        const state = get();
        if (state.userId) {
          debouncedCloudSync(state.userId, get);
        }
      },

      incrementQuizCount: (perfect) => {
        set((state) => ({
          totalQuizzes: state.totalQuizzes + 1,
          perfectQuizzes: state.perfectQuizzes + (perfect ? 1 : 0),
        }));
        const state = get();
        if (state.userId) {
          debouncedCloudSync(state.userId, get);
        }
      },

      incrementSpeedAnswers: () => set((state) => ({
        speedAnswers: state.speedAnswers + 1,
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),

      setUsername: (username) => set({ username }),

      getXpProgress: () => {
        const state = get();
        return getXpProgress(state.xp, state.level);
      },

      getXpForNextLevel: () => {
        const state = get();
        return getXpForNextLevel(state.level);
      },

      getMasteredCount: (type) => {
        const state = get();
        return Object.values(state.characterProgress)
          .filter((p) => p.type === type && p.mastered)
          .length;
      },

      getWeakCharacters: (type) => {
        const state = get();
        return Object.values(state.characterProgress)
          .filter((p) => p.type === type && p.isWeak);
      },

      syncToCloud: async () => {
        const state = get();
        if (!state.userId) return false;
        return saveProgressToCloud(state.userId, state);
      },

      loadFromCloud: async () => {
        const state = get();
        if (!state.userId) return false;
        const cloudData = await loadProgressFromCloud(state.userId);
        if (cloudData) {
          const mappedData = mapCloudDataToState(cloudData);
          get().mergeCloudData(mappedData);
          return true;
        }
        return false;
      },

      mergeCloudData: (cloudData) => {
        set((state) => {
          const mergedProgress = { ...state.characterProgress };
          if (cloudData.characterProgress) {
            Object.entries(cloudData.characterProgress).forEach(([key, value]) => {
              const existing = mergedProgress[key];
              if (!existing || (value as any).timesSeen > existing.timesSeen) {
                mergedProgress[key] = value as any;
              }
            });
          }

          const mergedGrammar = { ...state.grammarProgress };
          if (cloudData.grammarProgress) {
            Object.entries(cloudData.grammarProgress).forEach(([key, value]) => {
              const existing = mergedGrammar[key];
              if (!existing || (value as any).timesPracticed > existing.timesPracticed) {
                mergedGrammar[key] = value as any;
              }
            });
          }

          const mergedAchievements = Array.from(new Set([
            ...state.unlockedAchievements,
            ...(cloudData.unlockedAchievements || []),
          ]));

          return {
            xp: Math.max(state.xp, cloudData.xp || 0),
            level: Math.max(state.level, cloudData.level || 1),
            streak: Math.max(state.streak, cloudData.streak || 0),
            characterProgress: mergedProgress,
            grammarProgress: mergedGrammar,
            unlockedAchievements: mergedAchievements,
            totalQuizzes: Math.max(state.totalQuizzes, cloudData.totalQuizzes || 0),
            perfectQuizzes: Math.max(state.perfectQuizzes, cloudData.perfectQuizzes || 0),
            speedAnswers: Math.max(state.speedAnswers, cloudData.speedAnswers || 0),
          };
        });
      },
    }),
    {
      name: 'sensei-learn-user',
    }
  )
);
