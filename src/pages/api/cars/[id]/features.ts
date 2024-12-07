import { NextApiHandler } from 'next';
import { supabase } from '@/lib/supabase';
import { DEFAULT_FEATURES } from '@/lib/constants';

const handler: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('car_features')
          .select('*')
          .eq('car_id', id)
          .order('name');

        if (error) throw error;

        // If no features exist, return default features
        if (!data || data.length === 0) {
          return res.status(200).json(
            DEFAULT_FEATURES.map(name => ({
              car_id: id,
              name,
              available: true
            }))
          );
        }

        return res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching car features:', error);
        return res.status(500).json({ error: 'Failed to fetch car features' });
      }

    case 'POST':
      try {
        const { features } = req.body;
        
        // First delete existing features
        await supabase
          .from('car_features')
          .delete()
          .eq('car_id', id);

        // Then insert new features
        const { data, error } = await supabase
          .from('car_features')
          .insert(
            features.map((name: string) => ({
              car_id: id,
              name,
              available: true
            }))
          )
          .select();

        if (error) throw error;
        return res.status(200).json(data);
      } catch (error) {
        console.error('Error updating car features:', error);
        return res.status(500).json({ error: 'Failed to update car features' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;