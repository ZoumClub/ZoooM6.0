import { NextApiHandler } from 'next';
import { supabase } from '@/lib/supabase';
import { DEFAULT_FEATURES } from '@/lib/constants';

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { carId, features } = req.body;

        if (!carId || !features) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Delete existing features
        const { error: deleteError } = await supabase
          .from('car_features')
          .delete()
          .eq('car_id', carId);

        if (deleteError) throw deleteError;

        // Insert new features
        const { data, error: insertError } = await supabase
          .from('car_features')
          .insert(
            features.map((name: string) => ({
              car_id: carId,
              name,
              available: true
            }))
          )
          .select();

        if (insertError) throw insertError;

        return res.status(200).json(data);
      } catch (error) {
        console.error('Error managing car features:', error);
        return res.status(500).json({ error: 'Failed to manage car features' });
      }

    case 'GET':
      try {
        const { data, error } = await supabase
          .from('car_features')
          .select('*')
          .order('name');

        if (error) throw error;

        return res.status(200).json(data || []);
      } catch (error) {
        console.error('Error fetching car features:', error);
        return res.status(500).json({ error: 'Failed to fetch car features' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;