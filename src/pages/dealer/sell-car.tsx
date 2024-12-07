import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { CarForm } from '@/components/admin/CarForm';
import { supabase } from '@/lib/supabase';
import type { Brand, Dealer } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface SellCarPageProps {
  brands: Brand[];
  dealers: Dealer[];
}

export default function SellCarPage({ brands, dealers }: SellCarPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const dealerId = localStorage.getItem('dealer_id');
    if (!dealerId) {
      router.replace('/dealer');
    }
  }, [router]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">List a Car for Sale</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>

        <CarForm 
          brands={brands}
          dealers={dealers}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          defaultDealerId={localStorage.getItem('dealer_id') || undefined}
        />
      </div>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const [{ data: brands }, { data: dealers }] = await Promise.all([
    supabase
      .from('brands')
      .select('*')
      .order('name'),
    supabase
      .from('dealers')
      .select('*')
      .order('name')
  ]);

  return {
    props: {
      brands: brands || [],
      dealers: dealers || [],
    },
  };
};