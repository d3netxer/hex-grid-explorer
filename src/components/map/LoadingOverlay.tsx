
import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  message = "Loading hexagon data..." 
}) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
