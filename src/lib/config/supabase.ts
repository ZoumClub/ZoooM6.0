import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  role: 'admin' | 'user';
  created_at: string;
};

export type CarFeature = {
  id: string;
  car_id: string;
  name: string;
  available: boolean;
  created_at: string;
};

export type Car = {
  id: string;
  brand_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  images?: CarImage[];
  video_url?: string;
  savings: number;
  condition: 'new' | 'used';
  is_sold: boolean;
  created_at: string;
  updated_at: string;
  mileage?: string;
  fuel_type?: string;
  transmission?: string;
  autonomy?: string;
  seats?: number;
  body_type?: string;
  exterior_color?: string;
  interior_color?: string;
  number_of_owners?: number;
  number_of_keys?: string;
  features?: CarFeature[];
  brand?: {
    id: string;
    name: string;
    logo_url: string;
  };
};

export type CarImage = {
  id: string;
  car_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
};