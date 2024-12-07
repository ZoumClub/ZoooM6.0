import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { AdminNav } from '@/components/admin/AdminNav';
import { CarList } from '@/components/admin/CarList';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Car, Profile } from '@/lib/supabase';

interface CarsPageProps {
  profile: Profile;
  cars: Car[];
}

export default function CarsPage({ profile, cars: initialCars }: CarsPageProps) {
  const router = useRouter();
  const [cars, setCars] = useState(initialCars);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCars(cars.filter(car => car.id !== id));
      toast.success('Car deleted successfully');
    } catch (err) {
      console.error('Error deleting car:', err);
      toast.error('Failed to delete car');
    }
  };

  const handleToggleSold = async (car: Car) => {
    try {
      const { data: updatedCar, error } = await supabase
        .from('cars')
        .update({ is_sold: !car.is_sold })
        .eq('id', car.id)
        .select()
        .single();

      if (error) throw error;

      setCars(cars.map(c => c.id === car.id ? updatedCar : c));
      toast.success(`Car marked as ${updatedCar.is_sold ? 'sold' : 'available'}`);
    } catch (err) {
      console.error('Error updating car:', err);
      toast.error('Failed to update car status');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminNav onLogout={handleLogout} />
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
          <CarList
            cars={cars}
            onDelete={handleDelete}
            onToggleSold={handleToggleSold}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  const [{ data: profile }, { data: cars }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single(),
    supabase
      .from('cars')
      .select(`
        *,
        brand:brands (
          id,
          name,
          logo_url
        )
      `)
      .order('created_at', { ascending: false })
  ]);

  if (!profile || profile.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      profile,
      cars: cars || [],
    },
  };
};