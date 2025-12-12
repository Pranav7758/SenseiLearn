import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables not set - cloud sync disabled');
}

export const supabase: SupabaseClient | null = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isCloudEnabled = isSupabaseConfigured;

export type UserProfile = {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  xp: number;
  level: number;
  streak: number;
  last_active_date: string;
  settings: UserSettings;
  created_at: string;
  updated_at: string;
};

export type UserSettings = {
  quiz_interval: number;
  sound_enabled: boolean;
  show_romaji: boolean;
  theme: 'light' | 'dark';
};

export type CharacterProgress = {
  id: string;
  user_id: string;
  character: string;
  type: 'hiragana' | 'katakana' | 'kanji';
  times_seen: number;
  times_correct: number;
  accuracy: number;
  mastered: boolean;
  is_weak: boolean;
  last_practiced: string;
};

export type GrammarProgress = {
  id: string;
  user_id: string;
  topic_id: string;
  times_practiced: number;
  times_correct: number;
  accuracy: number;
  mastered: boolean;
  last_practiced: string;
};

export type Achievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
};

export type DailyChallenge = {
  id: string;
  user_id: string;
  date: string;
  completed: boolean;
  score: number;
  xp_earned: number;
};
