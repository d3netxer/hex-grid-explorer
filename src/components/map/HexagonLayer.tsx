
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { HexagonData, MetricKey } from '@/types/hex';
import { useHexagonLayer } from '@/hooks/useHexagonLayer';
import HexagonInteractions from './HexagonInteractions';
import { fitMapToHexagons } from '@/utils/mapBounds';

interface HexagonLayerProps {
  map: mapboxgl.Map | null;
  selectedMetric: MetricKey;
  filterValue: [number, number] | null;
  onHexagonSelect: (hexagon: HexagonData) => void;
  onLayerReady: () => void;
}

const HexagonLayer: React.FC<HexagonLayerProps> = ({
  map,
  selectedMetric,
  filterValue,
  onHexagonSelect,
  onLayerReady
}) => {
  // Use our custom hook to handle hexagon layer management
  const { updateHexagonLayer } = useHexagonLayer({
    map,
    selectedMetric,
    filterValue,
    onHexagonSelect,
    onLayerReady
  });

  // Initial fit to hexagons
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    
    console.log("Map is loaded, fitting to hexagons");
    // Wait a bit for hexagons to be loaded before fitting
    const timer = setTimeout(() => {
      fitMapToHexagons(map);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [map]);

  // Force update when selectedMetric changes
  useEffect(() => {
    if (map && map.isStyleLoaded()) {
      console.log("Metric changed, refreshing hexagon layer");
      updateHexagonLayer();
    }
  }, [selectedMetric, map, updateHexagonLayer]);

  return (
    <>
      {map && (
        <HexagonInteractions
          map={map}
          selectedMetric={selectedMetric}
          onHexagonSelect={onHexagonSelect}
        />
      )}
    </>
  );
};

export default HexagonLayer;
