
import { useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { HexagonData, MetricKey } from '@/types/hex';
import { getColorForValue, metricConfigs } from '@/utils/hexUtils';
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
    if (!map || !map.getLayer('hexagon-fill')) return;

    // Add click interaction
    map.on('click', 'hexagon-fill', (e) => {
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
    });

    // Change cursor on hover
    map.on('mouseenter', 'hexagon-fill', () => {
      if (map) map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'hexagon-fill', () => {
      if (map) map.getCanvas().style.cursor = '';
    });
  }, [map, selectedMetric, onHexagonSelect]);

  // Clean up interactions when component unmounts or map changes
  useEffect(() => {
    if (!map) return;
    
    return () => {
      if (map) {
        map.off('click', 'hexagon-fill');
        map.off('mouseenter', 'hexagon-fill');
        map.off('mouseleave', 'hexagon-fill');
      }
    };
  }, [map]);

  return null; // This is a non-visual component
};

export default HexagonInteractions;
