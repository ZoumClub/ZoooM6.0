export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          role: 'admin' | 'user';
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
      };
      cars: {
        Row: {
          id: string;
          brand_id: string;
          make: string;
          model: string;
          year: number;
          price: number;
          image: string;
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
          video_url?: string;
        };
      };
    };
    Functions: {
      process_private_listing: {
        Args: {
          p_listing_id: string;
          p_status: 'approved' | 'rejected';
        };
        Returns: {
          success: boolean;
          listing_id: string;
          car_id?: string;
          status: 'approved' | 'rejected';
        };
      };
    };
  };
}