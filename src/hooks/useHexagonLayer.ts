
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
            'fill-opacity': 0.8,
            'fill-color': '#000000'  // Default color to ensure the layer is visible
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
      // Try again after short delay
      const timer = setTimeout(() => {
        updateHexagonColors();
      }, 200);
      return () => clearTimeout(timer);
    }

    try {
      console.log("Updating hexagon colors for metric:", selectedMetric);
      const config = metricConfigs[selectedMetric];
      
      // Build the step expression properly with correct typing
      const stepArgs: any[] = ['step', ['get', selectedMetric]];
      
      // Add default color
      stepArgs.push(config.colorScale[0].color);
      
      // Add color stops (value, color pairs)
      config.colorScale.forEach((stop, index) => {
        if (index > 0) { // Skip the first one as it's already the default
          stepArgs.push(stop.value, stop.color);
        }
      });
      
      // Create the complete color expression
      const colorExpression = [
        'case',
        ['==', ['get', selectedMetric], 0], 'rgba(0,0,0,0)',
        stepArgs
      ];
      
      console.log("Color expression:", JSON.stringify(colorExpression));
      
      // Check if the hexagon-fill layer exists
      if (!map.getLayer('hexagon-fill')) {
        console.error("hexagon-fill layer doesn't exist yet");
        return;
      }

      // Apply expression for colors
      map.setPaintProperty('hexagon-fill', 'fill-color', colorExpression as any);
      
      console.log("Updated hexagon colors with expression");

      // Apply filter if one is set
      if (filterValue) {
        map.setFilter('hexagon-fill', [
          'all',
          ['>=', ['get', selectedMetric], filterValue[0]],
          ['<=', ['get', selectedMetric], filterValue[1]]
        ]);
        map.setFilter('hexagon-outline', [
          'all',
          ['>=', ['get', selectedMetric], filterValue[0]],
          ['<=', ['get', selectedMetric], filterValue[1]]
        ]);
      } else {
        map.setFilter('hexagon-fill', null);
        map.setFilter('hexagon-outline', null);
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
    if (map && map.isStyleLoaded()) {
      console.log("Metric or filter changed, updating colors");
      updateHexagonColors();
    }
  }, [filterValue, selectedMetric, map, updateHexagonColors]);

  return {
    updateHexagonLayer,
    updateHexagonColors
  };
};
