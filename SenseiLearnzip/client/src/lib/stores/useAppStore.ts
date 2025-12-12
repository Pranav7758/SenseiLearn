import { create } from 'zustand';

export type Screen = 
  | 'home'
  | 'hiragana'
  | 'katakana'
  | 'kanji'
  | 'grammar'
  | 'daily'
  | 'progress'
  | 'settings'
  | 'coach'
  | 'learn'
  | 'quiz'
  | 'games'
  | 'ninja-kana'
  | 'kanji-match'
  | 'word-builder'
  | 'character-catch'
  | 'listening-challenge'
  | 'sentence-scramble'
  | 'boss-battle'
  | 'vocabulary-race'
  | 'login'
  | 'register';

export type LearnMode = 'hiragana' | 'katakana' | 'kanji' | null;

export type ParticleEffectType = 'success' | 'error' | 'xp' | null;

export interface AppState {
  currentScreen: Screen;
  previousScreen: Screen;
  learnMode: LearnMode;
  learnIndex: number;
  showAuthModal: boolean;
  isLoading: boolean;
  notifications: Notification[];
  activeParticleEffect: ParticleEffectType;
  
  setScreen: (screen: Screen) => void;
  goBack: () => void;
  startLearnMode: (mode: LearnMode, startIndex?: number) => void;
  setLearnIndex: (index: number) => void;
  endLearnMode: () => void;
  setShowAuthModal: (show: boolean) => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  triggerParticleEffect: (type: ParticleEffectType) => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'achievement';
  title: string;
  message?: string;
  duration?: number;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentScreen: 'home',
  previousScreen: 'home',
  learnMode: null,
  learnIndex: 0,
  showAuthModal: false,
  isLoading: false,
  notifications: [],
  activeParticleEffect: null,

  setScreen: (screen) => set((state) => ({
    previousScreen: state.currentScreen,
    currentScreen: screen,
  })),

  goBack: () => set((state) => ({
    currentScreen: state.previousScreen,
    previousScreen: 'home',
  })),

  startLearnMode: (mode, startIndex = 0) => set({
    learnMode: mode,
    learnIndex: startIndex,
    currentScreen: 'learn',
  }),

  setLearnIndex: (index) => set({ learnIndex: index }),

  endLearnMode: () => set((state) => ({
    learnMode: null,
    learnIndex: 0,
    currentScreen: state.previousScreen || 'home',
  })),

  setShowAuthModal: (show) => set({ showAuthModal: show }),

  setLoading: (loading) => set({ isLoading: loading }),

  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      { ...notification, id: `notif-${Date.now()}` },
    ],
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),

  triggerParticleEffect: (type) => {
    set({ activeParticleEffect: type });
    if (type) {
      setTimeout(() => {
        set({ activeParticleEffect: null });
      }, 1500);
    }
  },
}));
