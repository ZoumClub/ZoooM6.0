import { z } from 'zod';

const phoneRegex = /^\+?[\d\s-()]{10,}$/;

export const privateListingSchema = z.object({
  brand_id: z.string().uuid('Invalid brand selected'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number()
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 1, 'Invalid year'),
  price: z.number().positive('Price must be greater than 0'),
  image: z.string().url('Please upload at least one image'),
  video_url: z.string().url('Invalid video URL').optional().nullable(),
  condition: z.literal('used'),
  mileage: z.string().min(1, 'Mileage is required'),
  fuel_type: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  body_type: z.string().min(1, 'Body type is required'),
  exterior_color: z.string().min(1, 'Exterior color is required'),
  interior_color: z.string().min(1, 'Interior color is required'),
  number_of_owners: z.number().positive('Number of owners must be greater than 0'),
  client_name: z.string().min(2, 'Name must be at least 2 characters'),
  client_phone: z.string().regex(phoneRegex, 'Invalid phone number format. Please include country code.'),
  client_city: z.string().min(2, 'City must be at least 2 characters')
});