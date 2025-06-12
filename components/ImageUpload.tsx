
import React, { useState, useCallback } from 'react';

interface ImageUploadProps {
  onImageChange: (file: File, dataUrl: string) => void;
  currentImageUrl: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange, currentImageUrl }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        setError('Invalid file type. Please upload a JPG, PNG, WEBP or GIF image.');
        event.target.value = ''; // Reset file input
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File is too large. Maximum size is 5MB.');
        event.target.value = ''; // Reset file input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(file, reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read file.');
      }
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  return (
    <div className="space-y-4">
      <label htmlFor="image-upload" className="block text-sm font-medium text-slate-700">
        Upload Lesson Image (Max 5MB, JPG/PNG/WEBP/GIF)
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="block w-full text-sm text-slate-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {currentImageUrl && (
        <div className="mt-4 border border-slate-300 rounded-lg p-2">
          <p className="text-sm font-medium text-slate-700 mb-2">Preview:</p>
          <img src={currentImageUrl} alt="Uploaded preview" className="max-w-xs max-h-64 rounded-md object-contain mx-auto" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
