import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { HexagonData, MetricKey } from '@/types/hex';
import { getHexPolygons, getColorForValue, metricConfigs } from '@/utils/hexUtils';
import { toast } from "sonner";

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
  }, [map, selectedMetric]);

  // Update hexagon colors when metric or filter changes
  useEffect(() => {
    updateHexagonColors();
  }, [filterValue, selectedMetric]);

  // Function to update the hexagon layer
  const updateHexagonLayer = () => {
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
              metricValue: props[selectedMetric],
              color: getColorForValue(props[selectedMetric], metricConfigs[selectedMetric].colorScale)
            });

            // Create a popup
            new mapboxgl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`
                <div>
                  <h3 class="text-lg font-bold">Hexagon Data</h3>
                  <p class="text-sm">${props.GRID_ID}</p>
                  <div class="mt-2">
                    <strong>${metricConfigs[selectedMetric].name}:</strong> 
                    ${metricConfigs[selectedMetric].format(props[selectedMetric])}
                  </div>
                </div>
              `)
              .addTo(map);
          }
        });

        // Change cursor on hover
        map.on('mouseenter', 'hexagon-fill', () => {
          if (map) map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'hexagon-fill', () => {
          if (map) map.getCanvas().style.cursor = '';
        });
      }

      updateHexagonColors();
      fitMapToHexagons();
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
  };

  // Helper function to update hexagon colors based on metric and filter
  const updateHexagonColors = () => {
    if (!map) return;
    
    if (!map.isStyleLoaded()) {
      console.log("Map style not fully loaded, can't update hexagon colors yet");
      return;
    }

    try {
      const config = metricConfigs[selectedMetric];
      console.log(`Updating colors for ${selectedMetric} with config:`, config);
      
      // Create expressions for Mapbox to handle coloring
      // First, collect all stops from the color scale
      const colorStops: any[] = [];
      
      // Special handling for transparent (value 0)
      colorStops.push(0, 'rgba(0,0,0,0)'); // Transparent for zero values
      
      // Add remaining color stops
      config.colorScale.forEach(stop => {
        if (stop.value > 0) { // Skip the transparent stop we already added
          colorStops.push(stop.value, stop.color);
        }
      });
      
      console.log("Color stops for mapbox expression:", colorStops);
      
      const colorExpression: mapboxgl.Expression = [
        'step',
        ['get', selectedMetric],
        'rgba(0,0,0,0)', // Default color for value 0
        ...colorStops.slice(2) // Skip the first stop as it's handled in the default
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
  };

  // Helper function to fit the map to the hexagon bounds
  const fitMapToHexagons = () => {
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
        // Type check to ensure we're using Polygon type features
        if (feature.geometry.type === 'Polygon') {
          // Now TypeScript knows this is a Polygon geometry
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
      } else {
        console.log("Could not calculate bounds - no valid coordinates");
      }
    } catch (error) {
      console.error("Error fitting map to hexagons:", error);
    }
  };

  return null; // This is a non-visual component that manipulates the map
};

export default HexagonLayer;
