
import React, { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { HexagonData, MetricKey } from '@/types/hex';
import { getHexPolygons } from '@/utils/hexUtils';
import MapInit from './MapInit';
import HexagonLayer from './HexagonLayer';
import FitToDataButton from './FitToDataButton';

interface MapboxGlMapProps {
  mapboxToken: string;
  selectedMetric: MetricKey;
  filterValue: [number, number] | null;
  onHexagonSelect: (hexagon: HexagonData) => void;
  mapLoaded: boolean;
  setMapLoaded: (loaded: boolean) => void;
}

const MapboxGlMap: React.FC<MapboxGlMapProps> = ({
  mapboxToken,
  selectedMetric,
  filterValue,
  onHexagonSelect,
  mapLoaded,
  setMapLoaded
}) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  // Handle map initialization
  const handleMapInit = useCallback((mapInstance: mapboxgl.Map) => {
    setMap(mapInstance);
    setMapLoaded(true);
  }, [setMapLoaded]);
  
  // Handle layer initialization
  const handleLayerReady = useCallback(() => {
    console.log("Hexagon layer is ready");
  }, []);

  // Helper function to fit the map to the hexagon bounds
  const fitMapToHexagons = useCallback(() => {
    if (!map) return;
    
    try {
      const hexPolygons = getHexPolygons();
      if (hexPolygons.features.length === 0) {
        console.log("No hexagon features to fit map to");
        return;
      }
      
      console.log("Fitting map to hexagons...");
      
      // Calculate bounds from all hexagon features
      const bounds = new mapboxgl.LngLatBounds();
      
      hexPolygons.features.forEach(feature => {
        if (feature.geometry.type === 'Polygon') {
          const polygonCoords = feature.geometry.coordinates;
          if (polygonCoords && polygonCoords[0]) {
            polygonCoords[0].forEach((coord) => {
              bounds.extend(coord as mapboxgl.LngLatLike);
            });
          }
        }
      });
      
      if (!bounds.isEmpty()) {
        // Fit map to these bounds with some padding
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 12,
          duration: 1000
        });
        
        console.log("Map fitted to hexagon bounds");
      }
    } catch (error) {
      console.error("Error fitting map to hexagons:", error);
    }
  }, [map]);

  return (
    <>
      <MapInit 
        mapboxToken={mapboxToken}
        onMapLoad={handleMapInit}
      />
      
      {map && mapLoaded && (
        <HexagonLayer
          map={map}
          selectedMetric={selectedMetric}
          filterValue={filterValue}
          onHexagonSelect={onHexagonSelect}
          onLayerReady={handleLayerReady}
        />
      )}
      
      <FitToDataButton onClick={fitMapToHexagons} />
    </>
  );
};

export default MapboxGlMap;
