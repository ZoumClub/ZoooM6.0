import { supabase } from '../../config/supabase';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './constants';
import { createProfile, getProfile } from './utils';
import type { AuthResult, Profile } from './types';

export async function isAdminEmail(email: string): Promise<boolean> {
  return email === ADMIN_EMAIL;
}

export async function getAdminProfile(userId: string): Promise<Profile | null> {
  const profile = await getProfile(userId);
  if (!profile || profile.role !== 'admin') return null;
  return profile;
}

export async function createAdminAccount(): Promise<AuthResult> {
  // Create admin user if doesn't exist
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    options: {
      data: { role: 'admin' }
    }
  });

  if (signUpError) throw signUpError;
  if (!user) throw new Error('Failed to create admin user');

  // Create admin profile
  const profile = await createProfile(user.id, ADMIN_EMAIL, 'admin');

  // Sign in with the newly created account
  const { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (error) throw error;

  return {
    user: data.user,
    profile,
    session: data.session,
  };
}