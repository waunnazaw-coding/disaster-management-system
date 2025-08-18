import React from 'react';
import { Button } from '@/components/ui/button';
import { FilePlus2, X } from 'lucide-react';

interface FileUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  files, 
  setFiles, 
  maxFiles = 5, 
  maxSize = 5 * 1024 * 1024 // 5MB default
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files);
    
    // Validate file count
    if (files.length + newFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }
    
    // Validate file sizes
    const oversizedFiles = newFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed the maximum size of ${maxSize / (1024 * 1024)}MB`);
      return;
    }
    
    setFiles([...files, ...newFiles]);
    e.target.value = ''; // Reset input
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        {files.map((file, index) => (
          <div key={index} className="relative group">
            <div className="bg-gray-100 rounded-lg p-2 w-24 h-24 flex items-center justify-center">
              {file.type.startsWith('image/') ? (
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={file.name} 
                  className="max-h-20 max-w-20 object-contain"
                />
              ) : file.type.startsWith('video/') ? (
                <video 
                  src={URL.createObjectURL(file)} 
                  className="max-h-20 max-w-20"
                />
              ) : (
                <div className="text-center">
                  <FilePlus2 className="h-8 w-8 text-gray-400 mx-auto" />
                  <span className="text-xs text-gray-500 truncate block mt-1">
                    {file.name}
                  </span>
                </div>
              )}
            </div>
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeFile(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {files.length < maxFiles && (
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <FilePlus2 className="h-8 w-8 text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Add file</span>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              multiple
              accept="image/*,video/*"
            />
          </label>
        )}
      </div>
      
      <p className="text-xs text-gray-500">
        Upload images or videos (max {maxFiles} files, {maxSize / (1024 * 1024)}MB each)
      </p>
    </div>
  );
};