import { supabase } from '../config/supabase';
import type { Car, Profile } from '../config/supabase';
import type { Brand } from '../hooks/useBrands';

export async function getBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
  return data as Brand[];
}

export async function getCars() {
  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brand:brands (
        id,
        name,
        logo_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
  return data as Car[];
}

export async function getNewCars() {
  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brand:brands (
        id,
        name,
        logo_url
      )
    `)
    .eq('condition', 'new')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching new cars:', error);
    throw error;
  }
  return data as Car[];
}

export async function getUsedCars() {
  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brand:brands (
        id,
        name,
        logo_url
      )
    `)
    .eq('condition', 'used')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching used cars:', error);
    throw error;
  }
  return data as Car[];
}

export async function getCarsByBrand(brandName: string) {
  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('name', brandName)
    .single();

  if (!brand) {
    throw new Error('Brand not found');
  }

  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      brand:brands (
        id,
        name,
        logo_url
      )
    `)
    .eq('brand_id', brand.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cars by brand:', error);
    throw error;
  }
  return data as Car[];
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
  return data as Profile;
}