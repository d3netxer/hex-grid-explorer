import { useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { HexagonData, MetricKey } from '@/types/hex';
import { getHexPolygons, metricConfigs } from '@/utils/hexUtils';
import { toast } from "sonner";

interface UseHexagonLayerProps {
  map: mapboxgl.Map | null;
  selectedMetric: MetricKey;
  filterValue: [number, number] | null;
  onHexagonSelect: (hexagon: HexagonData) => void;
  onLayerReady: () => void;
}

export const useHexagonLayer = ({
  map,
  selectedMetric,
  filterValue,
  onHexagonSelect,
  onLayerReady
}: UseHexagonLayerProps) => {
  // Function to update the hexagon layer
  const updateHexagonLayer = useCallback(() => {
    if (!map) return;
    
    console.log("Adding hexagon data to map");
    const hexPolygons = getHexPolygons();
    console.log("GeoJSON created with", hexPolygons.features.length, "features");
    
    // Debug selected metric values
    console.log(`Current metric: ${selectedMetric}`);
    if (hexPolygons.features.length > 0) {
      console.log("Sample hexagon properties:", hexPolygons.features[0].properties);
      
      // Debug specific hexagon values for the current metric
      const metricValues = hexPolygons.features.map(f => f.properties[selectedMetric]);
      const nonZeroValues = metricValues.filter(v => v > 0);
      
      console.log(`Metric value stats for ${selectedMetric}:`, {
        count: metricValues.length,
        nonZeroCount: nonZeroValues.length,
        min: Math.min(...nonZeroValues),
        max: Math.max(...nonZeroValues),
        exampleValues: nonZeroValues.slice(0, 5)
      });
    }
    
    try {
      // Add source if it doesn't exist
      if (!map.getSource('hexagons')) {
        console.log("Adding new hexagon source to map");
        map.addSource('hexagons', {
          type: 'geojson',
          data: hexPolygons
        });
      } else {
        // Otherwise update the existing source
        console.log("Updating existing hexagon source");
        (map.getSource('hexagons') as mapboxgl.GeoJSONSource).setData(hexPolygons);
      }

      // Add hexagon layer if it doesn't exist
      if (!map.getLayer('hexagon-fill')) {
        console.log("Adding hexagon layers");
        map.addLayer({
          id: 'hexagon-fill',
          type: 'fill',
          source: 'hexagons',
          paint: {
            'fill-opacity': 0.7
          }
        });

        // Add hexagon outline layer
        map.addLayer({
          id: 'hexagon-outline',
          type: 'line',
          source: 'hexagons',
          paint: {
            'line-color': '#ffffff',
            'line-width': 1,
            'line-opacity': 0.5
          }
        });
      }

      updateHexagonColors();
      onLayerReady();
    } catch (error) {
      console.error("Error adding hexagon data to map:", error);
      toast.error("Error rendering hexagons on map");
      
      // Try again after a delay
      const timer = setTimeout(() => {
        updateHexagonLayer();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [map, selectedMetric, onLayerReady]);

  // Helper function to update hexagon colors based on metric and filter
  const updateHexagonColors = useCallback(() => {
    if (!map) return;
    
    if (!map.isStyleLoaded()) {
      console.log("Map style not fully loaded, can't update hexagon colors yet");
      return;
    }

    try {
      const config = metricConfigs[selectedMetric];
      console.log(`Updating colors for ${selectedMetric} with config:`, config);
      
      // Create a clear step expression for mapbox
      const colorSteps: (string | number)[] = [];
      
      // Add each stop from the config's color scale
      config.colorScale.forEach(stop => {
        if (stop.value === 0) {
          // Handle the transparent/zero case
          colorSteps.push(0);
          colorSteps.push('rgba(0,0,0,0)');
        } else {
          colorSteps.push(stop.value);
          colorSteps.push(stop.color);
        }
      });
      
      console.log("Color steps for mapbox expression:", colorSteps);
      
      // Build the proper step expression for mapbox
      const colorExpression: mapboxgl.Expression = [
        'step',
        ['get', selectedMetric],
        'rgba(0,0,0,0)', // Default transparent for zero values
        ...colorSteps.slice(2) // Skip the first pair as it's already the default
      ];

      // Update fill color based on selected metric
      if (map.getLayer('hexagon-fill')) {
        map.setPaintProperty('hexagon-fill', 'fill-color', colorExpression);

        // Apply filter if one is set
        if (filterValue) {
          map.setFilter('hexagon-fill', [
            'all',
            ['>=', selectedMetric, filterValue[0]],
            ['<=', selectedMetric, filterValue[1]]
          ]);
          map.setFilter('hexagon-outline', [
            'all',
            ['>=', selectedMetric, filterValue[0]],
            ['<=', selectedMetric, filterValue[1]]
          ]);
        } else {
          map.setFilter('hexagon-fill', null);
          map.setFilter('hexagon-outline', null);
        }
      }
    } catch (error) {
      console.error("Error updating hexagon colors:", error);
    }
  }, [map, filterValue, selectedMetric]);

  // Add hexagon data to the map
  useEffect(() => {
    if (!map) {
      console.log("Map not ready yet, waiting...");
      return;
    }
    
    if (!map.isStyleLoaded()) {
      console.log("Map style not fully loaded, waiting...");
      // Try again in a short while
      const timer = setTimeout(() => {
        updateHexagonLayer();
      }, 500);
      return () => clearTimeout(timer);
    }

    updateHexagonLayer();
  }, [map, selectedMetric, updateHexagonLayer]);

  // Update hexagon colors when metric or filter changes
  useEffect(() => {
    if (map && map.isStyleLoaded() && map.getLayer('hexagon-fill')) {
      updateHexagonColors();
    }
  }, [filterValue, selectedMetric, map, updateHexagonColors]);

  return {
    updateHexagonLayer,
    updateHexagonColors
  };
};
