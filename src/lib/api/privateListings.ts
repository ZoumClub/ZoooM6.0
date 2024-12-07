import { supabase } from '../../config/supabase';
import type { PrivateCarListing } from '../../types/privateListings';
import { handleError } from '../utils/errorHandling';

export async function fetchPrivateListings() {
  try {
    const { data, error } = await supabase
      .from('private_listings')
      .select(`
        *,
        brand:brands (
          id,
          name,
          logo_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleError(error, 'Failed to fetch listings');
  }
}

export async function getPrivateListing(id: string) {
  try {
    const { data, error } = await supabase
      .from('private_listings')
      .select(`
        *,
        brand:brands (
          id,
          name,
          logo_url
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Listing not found');
    
    return data;
  } catch (error) {
    throw handleError(error, 'Failed to fetch listing');
  }
}

export async function updateListingStatus(id: string, status: 'approved' | 'rejected') {
  try {
    // Use the RPC function to handle the transaction
    const { data, error } = await supabase
      .rpc('process_private_listing', {
        p_listing_id: id,
        p_status: status
      });

    if (error) throw error;
    if (!data?.success) throw new Error('Failed to process listing');

    return data;
  } catch (error) {
    throw handleError(error, `Failed to ${status} listing`);
  }
}