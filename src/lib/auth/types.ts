export interface Profile {
  id: string;
  username: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface AuthResult {
  user: any;
  profile: Profile;
  session: any;
}

export interface AuthError extends Error {
  code?: string;
  details?: string;
}