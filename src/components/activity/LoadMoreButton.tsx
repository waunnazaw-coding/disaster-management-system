// src/components/activity/LoadMoreButton.tsx
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ 
  onClick, 
  isLoading,
  hasMore
}) => {
  if (!hasMore) return null;
  
  return (
    <div className="text-center mt-8">
      <Button 
        onClick={onClick} 
        disabled={isLoading}
        className="min-w-[150px]"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        {isLoading ? 'Loading...' : 'Load More'}
      </Button>
    </div>
  );
};