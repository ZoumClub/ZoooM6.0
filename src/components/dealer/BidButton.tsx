import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { PoundSterling } from 'lucide-react';

interface BidButtonProps {
  listingId: string;
  currentBid?: number;
  onBidPlaced: () => void;
}

export function BidButton({ listingId, currentBid, onBidPlaced }: BidButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dealerId = localStorage.getItem('dealer_id');
      if (!dealerId) throw new Error('Please log in again');

      const amount = parseFloat(bidAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid bid amount');
      }

      if (currentBid && amount <= currentBid) {
        throw new Error('Bid must be higher than current highest bid');
      }

      const { data, error } = await supabase.rpc('place_dealer_bid', {
        p_dealer_id: dealerId,
        p_listing_id: listingId,
        p_amount: amount
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.message);

      toast.success('Bid placed successfully');
      setShowBidForm(false);
      setBidAmount('');
      onBidPlaced();
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {currentBid ? (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            Current highest bid: £{currentBid.toLocaleString()}
          </div>
          <button
            onClick={() => setShowBidForm(true)}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <PoundSterling className="h-4 w-4" />
            Place Higher Bid
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowBidForm(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PoundSterling className="h-4 w-4" />
          Place First Bid
        </button>
      )}

      {showBidForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Place Your Bid</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bid Amount (£)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  required
                  min={currentBid ? currentBid + 1 : 1}
                  step="0.01"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBidForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Placing Bid...' : 'Confirm Bid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}