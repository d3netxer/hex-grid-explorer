
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
    
    // Initialize the map centered on Saudi Arabia
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [45.079162, 23.885942], // Saudi Arabia coordinates
      zoom: 4.5,
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
      console.log("Map loaded, adding WMS layer");
      
      // Add KAPSARC WMS layer
      mapInstance.addSource('kapsarc-gas', {
        type: 'raster',
        tiles: [
          'https://webgis.kapsarc.org/server/rest/services/Master_Gas_KSA/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&f=image&format=png24&transparent=true'
        ],
        tileSize: 256,
        attribution: 'KAPSARC Gas Infrastructure'
      });

      mapInstance.addLayer({
        id: 'kapsarc-gas-layer',
        type: 'raster',
        source: 'kapsarc-gas',
        paint: {
          'raster-opacity': 0.7
        }
      });

      console.log("WMS layer added");
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
