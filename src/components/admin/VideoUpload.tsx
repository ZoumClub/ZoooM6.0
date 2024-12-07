import { useState } from 'react';
import { Upload, X, Video } from 'lucide-react';
import { uploadCarVideo } from '../../lib/storage';

interface VideoUploadProps {
  onVideoUploaded: (url: string) => void;
  className?: string;
  existingVideo?: string;
  onVideoRemoved?: () => void;
}

export function VideoUpload({ 
  onVideoUploaded, 
  className = '',
  existingVideo,
  onVideoRemoved
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(existingVideo || null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      const url = await uploadCarVideo(file);
      setVideoUrl(url);
      onVideoUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeVideo = () => {
    setVideoUrl(null);
    onVideoRemoved?.();
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block">
        <span className="sr-only">Choose car video</span>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="video-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload a video</span>
                <input
                  id="video-upload"
                  name="video-upload"
                  type="file"
                  className="sr-only"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">MP4, WebM up to 100MB</p>
          </div>
        </div>
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {videoUrl && (
        <div className="mt-4">
          <div className="relative group">
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Video className="h-6 w-6 text-gray-500" />
              <span className="text-sm text-gray-700 truncate flex-1">
                Video uploaded successfully
              </span>
              <button
                onClick={removeVideo}
                className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Remove video"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}