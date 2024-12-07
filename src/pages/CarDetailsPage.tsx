import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, Play } from 'lucide-react';
import { getCar } from '../lib/cars';
import { CarOverview } from '../components/car/CarOverview';
import { CarSummary } from '../components/car/CarSummary';
import { CarFeatures } from '../components/car/CarFeatures';
import { ImageCarousel } from '../components/common/ImageCarousel';
import type { Car } from '../config/supabase';

export function CarDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    loadCar(id);
  }, [id, navigate]);

  async function loadCar(carId: string) {
    try {
      setIsLoading(true);
      const data = await getCar(carId);
      setCar(data);
    } catch (err) {
      console.error('Error loading car:', err);
      setError('Failed to load car details');
    } finally {
      setIsLoading(false);
    }
  }

  const getVideoEmbedUrl = (url: string) => {
    // Handle YouTube URLs
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
    }

    // Handle Vimeo URLs
    const vimeoMatch = url.match(/vimeo\.com\/(?:.*#|.*)\/?([\d]+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    // For direct video URLs (e.g., from Supabase storage)
    return url;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Car not found'}
        </h2>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800"
        >
          Return to home
        </button>
      </div>
    );
  }

  const allImages = [car.image, ...(car.images?.map(img => img.image_url) || [])];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Car Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {car.year} {car.make} {car.model}
          </h1>
          <div className="mt-2 flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              car.condition === 'new' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {car.condition.charAt(0).toUpperCase() + car.condition.slice(1)}
            </span>
            {car.is_sold && (
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                Sold
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Image */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-[400px]">
              <ImageCarousel 
                images={allImages}
                alt={`${car.make} ${car.model}`}
                className="h-full"
              />
              
              {car.is_sold && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-red-600 text-white px-16 py-6 rounded-full transform -rotate-45 font-bold text-5xl shadow-2xl border-4 border-white">
                    SOLD
                  </div>
                </div>
              )}
            </div>

            {/* Video Section */}
            {car.video_url && (
              <div className="mt-4 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Watch Video Tour
                </h3>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {isVideoPlaying ? (
                    <video
                      src={car.video_url}
                      controls
                      autoPlay
                      className="absolute inset-0 w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div 
                      className="absolute inset-0 bg-cover bg-center cursor-pointer group"
                      style={{ backgroundImage: `url(${car.image})` }}
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
              </div>
            )}
          </div>

          {/* Price and Action */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  £{car.price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  £{car.savings.toLocaleString()}
                </p>
              </div>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                car.is_sold
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={car.is_sold}
            >
              {car.is_sold ? 'Sold Out' : 'Get Best Deal'}
            </button>

            {!car.is_sold && (
              <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                <ThumbsUp className="h-5 w-5" />
                <span>Best price guaranteed</span>
              </div>
            )}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="space-y-8">
          <CarOverview
            mileage={car.mileage || 'N/A'}
            fuelType={car.fuel_type || 'N/A'}
            transmission={car.transmission || 'N/A'}
            autonomy={car.autonomy || 'N/A'}
            seats={car.seats || 5}
          />

          <CarSummary
            bodyType={car.body_type || 'N/A'}
            exteriorColor={car.exterior_color || 'N/A'}
            numberOfOwners={car.number_of_owners || 1}
            numberOfKeys={car.number_of_keys || 'N/A'}
            interiorColor={car.interior_color || 'N/A'}
            condition={car.condition.toUpperCase()}
          />

          <CarFeatures 
            features={car.features?.map(f => ({
              name: f.name,
              available: f.available
            })) || []}
          />
        </div>
      </div>
    </div>
  );
}