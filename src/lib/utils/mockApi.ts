import { SignJWT } from 'jose';
import type { Car } from '../config/supabase';

const SECRET_KEY = new TextEncoder().encode('your-secret-key');

const MOCK_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

const mockCars: Car[] = [
  // ... your mock cars data
];

class MockApi {
  private cars: Car[] = [...mockCars];

  // Rest of the class implementation remains the same
}

export const mockApi = new MockApi();