
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapInitProps {
  mapboxToken: string;
  onMapLoad: (map: mapboxgl.Map) => void;
}

const MapInit: React.FC<MapInitProps> = ({ mapboxToken, onMapLoad }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapContainer.current) return;

    console.log("Initializing map");
    
    // Set Mapbox access token
    mapboxgl.accessToken = mapboxToken;
    
    // Initialize the map with default coordinates
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.0, 40.7], // Default coordinates (will be updated)
      zoom: 9,
      pitch: 0,
    });

    // Add navigation controls
    mapInstance.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Wait for map to load
    mapInstance.on('load', () => {
      console.log("Map loaded");
      onMapLoad(mapInstance);
    });

    return () => {
      console.log("Removing map");
      mapInstance.remove();
    };
  }, [mapboxToken, onMapLoad]);

  return (
    <div 
      ref={mapContainer} 
      className="map-container h-full" 
      style={{position: 'absolute', top: 0, bottom: 0, width: '100%'}} 
    />
  );
};

export default MapInit;
