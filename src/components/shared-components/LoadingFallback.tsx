import React from 'react';
import { Loader2 } from 'lucide-react'; // Shadcn UI icon


const LoadingFallback: React.FC = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <Loader2 className="mr-2 h-8 w-8 animate-spin" />
    <span>Loading...</span>
  </div>
);

export default LoadingFallback;
