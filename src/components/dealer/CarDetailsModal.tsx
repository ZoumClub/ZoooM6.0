import { X, Play } from 'lucide-react';
import { useState } from 'react';
import { ImageCarousel } from '../common/ImageCarousel';
import type { PrivateListing } from '@/lib/supabase';

interface CarDetailsModalProps {
  listing: PrivateListing;
  onClose: () => void;
}

export function CarDetailsModal({ listing, onClose }: CarDetailsModalProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {listing.year} {listing.make} {listing.model}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Images and Video Section */}
          <div className="space-y-6">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <ImageCarousel
                images={[listing.image]}
                alt={`${listing.make} ${listing.model}`}
                className="h-full"
              />
            </div>

            {listing.video_url && (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {isVideoPlaying ? (
                  <video
                    src={listing.video_url}
                    controls
                    autoPlay
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div 
                    className="absolute inset-0 bg-cover bg-center cursor-pointer group"
                    style={{ backgroundImage: `url(${listing.image})` }}
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-blue-600 ml-1" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Technical Specifications
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mileage</span>
                  <span className="font-medium text-gray-900">{listing.mileage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fuel Type</span>
                  <span className="font-medium text-gray-900">{listing.fuel_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transmission</span>
                  <span className="font-medium text-gray-900">{listing.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Body Type</span>
                  <span className="font-medium text-gray-900">{listing.body_type}</span>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Exterior Color</span>
                  <span className="font-medium text-gray-900">{listing.exterior_color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interior Color</span>
                  <span className="font-medium text-gray-900">{listing.interior_color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Previous Owners</span>
                  <span className="font-medium text-gray-900">{listing.number_of_owners}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Condition</span>
                  <span className="font-medium text-gray-900">{listing.condition.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}