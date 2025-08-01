import React, { useRef, useState } from "react";

interface PhotoUploaderProps {
  onPhotosChange: (photos: File[]) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onPhotosChange }) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const updated = [...photos, ...newFiles];
    setPhotos(updated);
    onPhotosChange(updated);

    // Reset input value so selecting same file again works
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    onPhotosChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {photos.map((file, index) => (
          <div key={index} className="relative w-32 h-32 border rounded overflow-hidden">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-200"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Photo
      </button>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default PhotoUploader;
