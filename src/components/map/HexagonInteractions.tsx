
import { useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { HexagonData, MetricKey } from '@/types/hex';
import { createHexagonPopup } from './HexagonPopup';

interface HexagonInteractionsProps {
  map: mapboxgl.Map | null;
  selectedMetric: MetricKey;
  onHexagonSelect: (hexagon: HexagonData) => void;
}

const HexagonInteractions: React.FC<HexagonInteractionsProps> = ({
  map,
  selectedMetric,
  onHexagonSelect
}) => {
  // Set up hexagon interactions
  const setupInteractions = useCallback(() => {
    if (!map) return;
    
    // Make sure map is loaded and hexagon-fill layer exists
    if (!map.isStyleLoaded() || !map.getLayer('hexagon-fill')) {
      console.log("Map or hexagon layer not ready for interactions");
      return;
    }

    // Add click interaction
    const handleClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const props = feature.properties as HexagonData;
        onHexagonSelect(props);
        
        console.log("Clicked hexagon:", {
          id: props.GRID_ID,
          electric: props.LDAC_suitability_elec,
          gas: props.LDAC_suitability_gas,
          combined: props.LDAC_combined,
          selectedMetric: selectedMetric,
          metricValue: props[selectedMetric]
        });

        // Create popup
        createHexagonPopup({
          feature: feature,
          lngLat: e.lngLat,
          map,
          selectedMetric
        });
      }
    };

    // Change cursor on hover
    const handleMouseEnter = () => {
      if (map) map.getCanvas().style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
      if (map) map.getCanvas().style.cursor = '';
    };

    // Add event listeners
    map.on('click', 'hexagon-fill', handleClick);
    map.on('mouseenter', 'hexagon-fill', handleMouseEnter);
    map.on('mouseleave', 'hexagon-fill', handleMouseLeave);

    // Return cleanup function that will be used in the useEffect
    return () => {
      map.off('click', 'hexagon-fill', handleClick);
      map.off('mouseenter', 'hexagon-fill', handleMouseEnter);
      map.off('mouseleave', 'hexagon-fill', handleMouseLeave);
    };
  }, [map, selectedMetric, onHexagonSelect]);

  // Set up interactions when component mounts or dependencies change
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    
    // Delay setting up interactions to ensure the layer is loaded
    const timer = setTimeout(() => {
      if (map && map.getLayer('hexagon-fill')) {
        const cleanup = setupInteractions();
        return () => {
          if (cleanup) cleanup();
        };
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [map, setupInteractions]);

  return null; // This is a non-visual component
};

export default HexagonInteractions;
