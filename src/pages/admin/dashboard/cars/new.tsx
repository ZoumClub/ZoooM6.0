import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CarForm } from '@/components/admin/CarForm';
import { supabase } from '@/lib/supabase';
import type { Brand, Dealer } from '@/lib/supabase';

interface NewCarPageProps {
  brands: Brand[];
  dealers: Dealer[];
}

export default function NewCarPage({ brands, dealers }: NewCarPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Car</h1>
        <CarForm 
          brands={brands}
          dealers={dealers}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
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