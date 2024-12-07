import { supabase } from '../../config/supabase';
import type { AuthResult, AuthError, Profile } from './types';

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) throw signInError;

    // Get or create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        username: email,
        role: 'admin'
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return {
      user: data.user,
      profile: profile as Profile,
      session: data.session
    };

  } catch (error) {
    console.error('Auth error:', error);
    const authError = new Error('Authentication failed. Please check your credentials and try again.') as AuthError;
    authError.code = (error as any)?.code;
    authError.details = (error as any)?.details;
    throw authError;
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { user, profile };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getSession() {
  return supabase.auth.getSession();
}