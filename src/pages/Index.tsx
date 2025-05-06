
import React, { useState, useEffect } from 'react';
import HexMap from '@/components/HexMap';
import MapTokenSetup from '@/components/MapTokenSetup';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  
  // Try to load token from local storage on initial render
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  // Save token to local storage when it changes
  const handleTokenSubmit = (token: string) => {
    localStorage.setItem('mapbox-token', token);
    setMapboxToken(token);
  };

  return (
    <>
      <Toaster />
      <div className="h-screen w-screen overflow-hidden bg-background">
        {mapboxToken ? (
          <HexMap mapboxToken={mapboxToken} />
        ) : (
          <MapTokenSetup onTokenSubmit={handleTokenSubmit} />
        )}
      </div>
    </>
  );
};

export default Index;
