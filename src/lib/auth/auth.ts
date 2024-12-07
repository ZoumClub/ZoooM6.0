import { supabase } from '../config/supabase';
import { isAdminEmail, getAdminProfile } from './admin';
import type { Profile } from './types';

export async function signIn(email: string, password: string) {
  try {
    // Verify if this is an admin email
    if (!await isAdminEmail(email)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Attempt to sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;
    if (!data.user) throw new Error('No user data returned');

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      // If profile doesn't exist, create it
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username: email,
          role: 'admin',
        })
        .select()
        .single();

      if (createError) throw createError;
      
      return {
        user: data.user,
        profile: newProfile as Profile,
        session: data.session,
      };
    }

    // Verify admin role
    if (profile.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    return {
      user: data.user,
      profile: profile as Profile,
      session: data.session,
    };
  } catch (error) {
    console.error('Auth error:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile: profile as Profile | null };
}

export function getSession() {
  return supabase.auth.getSession();
}