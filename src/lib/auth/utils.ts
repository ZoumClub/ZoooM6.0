import { supabase } from '../../config/supabase';
import type { Profile } from './types';

export async function confirmUser(userId: string): Promise<void> {
  const { error } = await supabase.rpc('confirm_user', { user_id: userId });
  if (error) throw error;
}

export async function createProfile(userId: string, email: string, role: 'admin' | 'user'): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      username: email,
      role,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data as Profile;
}