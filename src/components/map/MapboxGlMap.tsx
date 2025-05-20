
import React, { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { HexagonData, MetricKey } from '@/types/hex';
import MapInit from './MapInit';
import HexagonLayer from './HexagonLayer';
import FitToDataButton from './FitToDataButton';
import { fitMapToHexagons } from '@/utils/mapBounds';

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

  // Use the utility function to fit map to hexagons
  const handleFitToData = useCallback(() => {
    fitMapToHexagons(map);
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
      
      <FitToDataButton onClick={handleFitToData} />
    </>
  );
};

export default MapboxGlMap;
