import { useState } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { useQuery, useQueryClient } from 'react-query';
import { fetchPrivateListings, updateListingStatus } from '../../lib/api/privateListings';
import { ListingModal } from '../../components/private-listings/ListingModal';
import { ListingStatus } from '../../components/private-listings/ListingStatus';
import type { PrivateCarListing } from '../../types/privateListings';
import { toast } from 'react-hot-toast';
import { AppError } from '../../lib/utils/errorHandling';

export function PrivateListings() {
  const queryClient = useQueryClient();
  const [selectedListing, setSelectedListing] = useState<PrivateCarListing | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: listings, isLoading, error } = useQuery(
    'privateListings',
    fetchPrivateListings,
    {
      retry: 2,
      onError: (error) => {
        console.error('Failed to fetch listings:', error);
        toast.error(error instanceof AppError ? error.message : 'Failed to load listings');
      }
    }
  );

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    if (!id || isUpdating) return;

    try {
      setIsUpdating(true);
      await updateListingStatus(id, status);
      
      // Invalidate queries
      await Promise.all([
        queryClient.invalidateQueries('privateListings'),
        queryClient.invalidateQueries('cars')
      ]);

      toast.success(
        status === 'approved'
          ? 'Listing approved and published successfully'
          : 'Listing rejected successfully'
      );
      
      setSelectedListing(null);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error instanceof AppError ? error.message : 'Failed to update listing status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">Failed to load listings</p>
        <button
          onClick={() => queryClient.invalidateQueries('privateListings')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Private Car Listings</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listings?.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{listing.client_name}</div>
                    <div className="text-sm text-gray-500">{listing.client_phone}</div>
                    <div className="text-sm text-gray-500">{listing.client_city}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {listing.year} {listing.make} {listing.model}
                    </div>
                    <div className="text-sm text-gray-500">
                      {listing.mileage} • {listing.fuel_type} • {listing.transmission}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      £{listing.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ListingStatus status={listing.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedListing(listing)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {listing.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(listing.id!, 'approved')}
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50"
                            title="Approve and publish listing"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(listing.id!, 'rejected')}
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                            title="Reject listing"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!listings?.length && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No private listings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onApprove={
            selectedListing.status === 'pending'
              ? () => handleStatusUpdate(selectedListing.id!, 'approved')
              : undefined
          }
          onReject={
            selectedListing.status === 'pending'
              ? () => handleStatusUpdate(selectedListing.id!, 'rejected')
              : undefined
          }
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}