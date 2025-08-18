import React from 'react';
import { ActivityMediaDTO } from '@/types/activity';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ActivityMediaPreviewProps {
  media: ActivityMediaDTO[];
  onRemove: (id: number) => void;
}

export const ActivityMediaPreview: React.FC<ActivityMediaPreviewProps> = ({ 
  media, 
  onRemove 
}) => {
  if (media.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Existing Media</h4>
      <div className="flex flex-wrap gap-3">
        {media.map(item => (
          <div key={item.id} className="relative group">
            {item.isVideo ? (
              <video 
                src={item.filePath} 
                className="w-24 h-24 object-cover rounded-lg"
              />
            ) : (
              <img 
                src={item.filePath} 
                alt={`Activity media ${item.id}`}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(item.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};