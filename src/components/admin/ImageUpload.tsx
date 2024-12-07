import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadCarImage, uploadMultipleCarImages } from '../../lib/storage';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  onImagesUploaded?: (urls: string[]) => void;
  multiple?: boolean;
  className?: string;
  existingImages?: string[];
  onImageRemoved?: (url: string) => void;
}

export function ImageUpload({ 
  onImageUploaded, 
  onImagesUploaded,
  multiple = false,
  className = '',
  existingImages = [],
  onImageRemoved
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>(existingImages);

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      setIsUploading(true);
      setError(null);

      // Validate all files
      files.forEach(validateFile);

      if (multiple) {
        const urls = await uploadMultipleCarImages(files);
        setPreviewImages(prev => [...prev, ...urls]);
        onImagesUploaded?.(urls);
      } else {
        const url = await uploadCarImage(files[0]);
        setPreviewImages([url]);
        onImageUploaded(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (urlToRemove: string) => {
    setPreviewImages(prev => prev.filter(url => url !== urlToRemove));
    onImageRemoved?.(urlToRemove);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block">
        <span className="sr-only">Choose car images</span>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload images</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  multiple={multiple}
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
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

      {previewImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewImages.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                onClick={() => removeImage(url)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}