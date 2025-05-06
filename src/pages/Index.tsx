
import React from 'react';
import HexMap from '@/components/HexMap';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  // Use the provided Mapbox token
  const mapboxToken = 'pk.eyJ1IjoidGdlcnRpbiIsImEiOiJYTW5sTVhRIn0.X4B5APkxkWVaiSg3KqMCaQ';

  return (
    <>
      <Toaster />
      <div className="h-screen w-screen overflow-hidden bg-background">
        <HexMap mapboxToken={mapboxToken} />
      </div>
    </>
  );
};

export default Index;
