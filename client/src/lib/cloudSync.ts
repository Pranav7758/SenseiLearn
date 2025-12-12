import { supabase, isCloudEnabled } from './supabase';
import type { UserState } from './stores/useUserStore';

export interface CloudUserData {
  id?: string;
  user_id: string;
  xp: number;
  level: number;
  streak: number;
  last_active_date: string | null;
  username: string;
  character_progress: Record<string, any>;
  grammar_progress: Record<string, any>;
  unlocked_achievements: string[];
  daily_challenge_completed: boolean;
  daily_challenge_date: string | null;
  total_quizzes: number;
  perfect_quizzes: number;
  speed_answers: number;
  settings: Record<string, any>;
  updated_at?: string;
}

export async function saveProgressToCloud(userId: string, state: Partial<UserState>): Promise<boolean> {
  if (!isCloudEnabled || !supabase) {
    console.log('Cloud sync disabled - running in offline mode');
    return false;
  }

  try {
    const cloudData: Omit<CloudUserData, 'id' | 'updated_at'> = {
      user_id: userId,
      xp: state.xp || 0,
      level: state.level || 1,
      streak: state.streak || 0,
      last_active_date: state.lastActiveDate || null,
      username: state.username || 'Guest',
      character_progress: state.characterProgress || {},
      grammar_progress: state.grammarProgress || {},
      unlocked_achievements: state.unlockedAchievements || [],
      daily_challenge_completed: state.dailyChallengeCompleted || false,
      daily_challenge_date: state.dailyChallengeDate || null,
      total_quizzes: state.totalQuizzes || 0,
      perfect_quizzes: state.perfectQuizzes || 0,
      speed_answers: state.speedAnswers || 0,
      settings: state.settings || {},
    };

    const { error } = await supabase
      .from('user_progress')
      .upsert(cloudData, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Error saving progress:', error);
      return false;
    }

    console.log('Progress saved to cloud');
    return true;
  } catch (error) {
    console.error('Failed to save progress:', error);
    return false;
  }
}

export async function loadProgressFromCloud(userId: string): Promise<CloudUserData | null> {
  if (!isCloudEnabled || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error loading progress:', error);
      return null;
    }

    return data as CloudUserData;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
}

export function mapCloudDataToState(cloudData: CloudUserData): Partial<UserState> {
  return {
    xp: cloudData.xp,
    level: cloudData.level,
    streak: cloudData.streak,
    lastActiveDate: cloudData.last_active_date,
    username: cloudData.username,
    characterProgress: cloudData.character_progress,
    grammarProgress: cloudData.grammar_progress,
    unlockedAchievements: cloudData.unlocked_achievements,
    dailyChallengeCompleted: cloudData.daily_challenge_completed,
    dailyChallengeDate: cloudData.daily_challenge_date,
    totalQuizzes: cloudData.total_quizzes,
    perfectQuizzes: cloudData.perfect_quizzes,
    speedAnswers: cloudData.speed_answers,
    settings: cloudData.settings as any,
  };
}

export async function saveAchievementToCloud(userId: string, achievementId: string): Promise<boolean> {
  if (!isCloudEnabled || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString(),
      });

    if (error && error.code !== '23505') {
      console.error('Error saving achievement:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to save achievement:', error);
    return false;
  }
}

export async function getLeaderboard(limit: number = 10): Promise<Array<{
  username: string;
  xp: number;
  level: number;
  streak: number;
}>> {
  if (!isCloudEnabled || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('username, xp, level, streak')
      .order('xp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}
