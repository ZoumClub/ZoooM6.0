import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Store, PlusCircle, ShoppingBag, ClipboardList, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import type { Car } from '@/lib/supabase';

export default function DealerDashboard() {
  const router = useRouter();
  const [dealerName, setDealerName] = useState('');
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const dealerId = localStorage.getItem('dealer_id');
    const name = localStorage.getItem('dealer_name');

    if (!dealerId) {
      router.replace('/dealer');
      return;
    }

    setDealerName(name || '');
    loadDealerCars(dealerId);
  }, [router]);

  const loadDealerCars = async (dealerId: string) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          brand:brands (
            id,
            name,
            logo_url
          )
        `)
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error loading cars:', error);
      toast.error('Failed to load cars');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dealer_id');
    localStorage.removeItem('dealer_name');
    router.replace('/dealer');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {dealerName}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/dealer/sell-car')}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <PlusCircle className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Sell Car</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                List a new car for sale
              </p>
            </button>

            <button
              onClick={() => router.push('/dealer/bids')}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <ShoppingBag className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Bid on Cars</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                View and place bids on available cars
              </p>
            </button>

            <button
              onClick={() => router.push('/dealer/inventory')}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <ClipboardList className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Manage your car inventory
              </p>
            </button>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Listings</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Car
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Listed Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cars.map((car) => (
                      <tr key={car.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                src={car.image}
                                alt={`${car.make} ${car.model}`}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {car.year} {car.make} {car.model}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">£{car.price.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            car.is_sold
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {car.is_sold ? 'Sold' : 'Available'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(car.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {cars.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No cars listed yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}