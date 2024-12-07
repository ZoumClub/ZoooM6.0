import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { CarList } from '@/components/admin/CarList';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Car } from '@/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/admin/login');
    }
  };

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
      toast.success('Car deleted successfully');
      router.reload();
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Failed to delete car');
    }
  };

  const handleToggleSold = async (car: Car) => {
    try {
      const { error } = await supabase
        .from('cars')
        .update({ is_sold: !car.is_sold })
        .eq('id', car.id);

      if (error) throw error;
      toast.success(`Car marked as ${!car.is_sold ? 'sold' : 'available'}`);
      router.reload();
    } catch (error) {
      console.error('Error updating car:', error);
      toast.error('Failed to update car status');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CarList
            onDelete={handleDelete}
            onToggleSold={handleToggleSold}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </Layout>
  );
}