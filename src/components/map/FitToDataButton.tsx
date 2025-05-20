
import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';

interface FitToDataButtonProps {
  onClick: () => void;
}

const FitToDataButton: React.FC<FitToDataButtonProps> = ({ onClick }) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={onClick}
      className="absolute right-4 top-4 z-20 flex items-center gap-1"
    >
      <Navigation className="h-4 w-4" />
      <span>Fit to Data</span>
    </Button>
  );
};

export default FitToDataButton;
