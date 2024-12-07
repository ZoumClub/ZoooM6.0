import { NextApiHandler } from 'next';
import { supabase } from '@/lib/supabase';

const DEFAULT_FEATURES = [
  'Speed Regulator',
  'Air Condition',
  'Reversing Camera',
  'Reversing Radar',
  'GPS Navigation',
  'Park Assist',
  'Start and Stop',
  'Airbag',
  'ABS',
  'Computer',
  'Rims',
  'Electric mirrors',
  'Electric windows',
  'Bluetooth'
];

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
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

    // Insert features
    const { error: insertError } = await supabase
      .from('car_features')
      .insert(featuresData);

    if (insertError) throw insertError;

    return res.status(200).json({
      success: true,
      message: `Features initialized for ${cars.length} cars`
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