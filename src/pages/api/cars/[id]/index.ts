import { NextApiHandler } from 'next';
import { supabase } from '@/lib/supabase';

const handler: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // First get the car data
        const { data: car, error: carError } = await supabase
          .from('cars')
          .select(`
            *,
            brand:brands (
              id,
              name,
              logo_url
            )
          `)
          .eq('id', id)
          .single();

        if (carError) throw carError;
        if (!car) return res.status(404).json({ error: 'Car not found' });

        // Then get the features separately
        const { data: features, error: featuresError } = await supabase
          .from('car_features')
          .select('*')
          .eq('car_id', id)
          .order('name');

        if (featuresError) throw featuresError;

        // Combine the data
        return res.status(200).json({
          ...car,
          features: features || []
        });
      } catch (error) {
        console.error('Error fetching car:', error);
        return res.status(500).json({ error: 'Failed to fetch car' });
      }

    case 'PUT':
      try {
        const { features, ...carData } = req.body;
        
        // Update car data
        const { data: updatedCar, error: carError } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', id)
          .select()
          .single();

        if (carError) throw carError;

        // Update features if provided
        if (features && features.length > 0) {
          // First delete existing features
          await supabase
            .from('car_features')
            .delete()
            .eq('car_id', id);

          // Then insert new features
          const { error: featuresError } = await supabase
            .from('car_features')
            .insert(
              features.map((name: string) => ({
                car_id: id,
                name,
                available: true
              }))
            );

          if (featuresError) throw featuresError;
        }

        // Get updated features
        const { data: updatedFeatures } = await supabase
          .from('car_features')
          .select('*')
          .eq('car_id', id)
          .order('name');

        return res.status(200).json({
          ...updatedCar,
          features: updatedFeatures || []
        });
      } catch (error) {
        console.error('Error updating car:', error);
        return res.status(500).json({ error: 'Failed to update car' });
      }

    case 'DELETE':
      try {
        // Delete car (features will be cascade deleted)
        const { error } = await supabase
          .from('cars')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return res.status(200).json({ message: 'Car deleted successfully' });
      } catch (error) {
        console.error('Error deleting car:', error);
        return res.status(500).json({ error: 'Failed to delete car' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;