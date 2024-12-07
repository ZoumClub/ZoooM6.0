import { NextApiHandler } from 'next';
import { supabase } from '@/lib/supabase';
import { DEFAULT_FEATURES } from '@/lib/constants';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // First, clear existing features
    const { error: deleteError } = await supabase
      .from('car_features')
      .delete()
      .neq('car_id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) throw deleteError;

    // Get all cars
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('id');

    if (carsError) throw carsError;

    // Prepare features data for all cars
    const featuresData = cars.flatMap(car =>
      DEFAULT_FEATURES.map(feature => ({
        car_id: car.id,
        name: feature,
        available: true
      }))
    );

    // Insert features in batches of 1000 to avoid request size limits
    const batchSize = 1000;
    for (let i = 0; i < featuresData.length; i += batchSize) {
      const batch = featuresData.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('car_features')
        .insert(batch);

      if (insertError) throw insertError;
    }

    return res.status(200).json({
      success: true,
      message: `Features initialized for ${cars.length} cars`,
      totalFeatures: featuresData.length
    });
  } catch (error) {
    console.error('Error initializing features:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to initialize features'
    });
  }
};

export default handler;