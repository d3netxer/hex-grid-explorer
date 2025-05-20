import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { GeoJSON } from 'geojson';
import { HexagonData, MetricKey } from '@/types/hex';
import { getHexPolygons, getColorForValue, metricConfigs } from '@/utils/hexUtils';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Set Mapbox access token
  mapboxgl.accessToken = mapboxToken;

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log("Initializing map");
    
    // Initialize the map with default coordinates (will be updated when data loads)
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.0, 40.7], // Default coordinates (will be updated)
      zoom: 9,
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Wait for map to load
    map.current.on('load', () => {
      console.log("Map loaded");
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        console.log("Removing map");
        map.current.remove();
        map.current = null;
      }
    };
  }, [setMapLoaded]);

  // Add hexagon data to the map
  useEffect(() => {
    if (!mapLoaded || !map.current) {
      console.log("Map not ready yet, waiting...");
      return;
    }
    
    if (!map.current.isStyleLoaded()) {
      console.log("Map style not fully loaded, waiting...");
      // Try again in a short while
      const timer = setTimeout(() => {
        updateHexagonLayer();
      }, 500);
      return () => clearTimeout(timer);
    }

    updateHexagonLayer();
    
  }, [mapLoaded, selectedMetric]);

  // Function to update the hexagon layer
  const updateHexagonLayer = () => {
    if (!map.current || !mapLoaded) return;
    
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
      if (!map.current.getSource('hexagons')) {
        console.log("Adding new hexagon source to map");
        map.current.addSource('hexagons', {
          type: 'geojson',
          data: hexPolygons
        });
      } else {
        // Otherwise update the existing source
        console.log("Updating existing hexagon source");
        (map.current.getSource('hexagons') as mapboxgl.GeoJSONSource).setData(hexPolygons);
      }

      // Add hexagon layer if it doesn't exist
      if (!map.current.getLayer('hexagon-fill')) {
        console.log("Adding hexagon layers");
        map.current.addLayer({
          id: 'hexagon-fill',
          type: 'fill',
          source: 'hexagons',
          paint: {
            'fill-opacity': 0.7
          }
        });

        // Add hexagon outline layer
        map.current.addLayer({
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
        map.current.on('click', 'hexagon-fill', (e) => {
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
              .addTo(map.current!);
          }
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'hexagon-fill', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mouseleave', 'hexagon-fill', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      }

      updateHexagonColors();
      
      // Automatically fit to hexagons after loading
      if (hexPolygons.features.length > 0) {
        fitMapToHexagons();
      }
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

  // Update hexagon colors when metric or filter changes
  const updateHexagonColors = () => {
    if (!map.current || !mapLoaded) return;
    
    if (!map.current.isStyleLoaded()) {
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
      if (map.current.getLayer('hexagon-fill')) {
        map.current.setPaintProperty('hexagon-fill', 'fill-color', colorExpression);

        // Apply filter if one is set
        if (filterValue) {
          map.current.setFilter('hexagon-fill', [
            'all',
            ['>=', selectedMetric, filterValue[0]],
            ['<=', selectedMetric, filterValue[1]]
          ]);
          map.current.setFilter('hexagon-outline', [
            'all',
            ['>=', selectedMetric, filterValue[0]],
            ['<=', selectedMetric, filterValue[1]]
          ]);
        } else {
          map.current.setFilter('hexagon-fill', null);
          map.current.setFilter('hexagon-outline', null);
        }
      }
    } catch (error) {
      console.error("Error updating hexagon colors:", error);
    }
  };

  // Update colors when filter changes
  useEffect(() => {
    updateHexagonColors();
  }, [filterValue]);

  // Helper function to fit the map to the hexagon bounds
  const fitMapToHexagons = () => {
    if (!map.current) return;
    
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
        map.current.fitBounds(bounds, {
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

  return (
    <>
      <div ref={mapContainer} className="map-container h-full" style={{position: 'absolute', top: 0, bottom: 0, width: '100%'}} />
      <Button 
        variant="outline" 
        size="sm"
        onClick={fitMapToHexagons}
        className="absolute right-4 top-4 z-20 flex items-center gap-1"
      >
        <Navigation className="h-4 w-4" />
        <span>Fit to Data</span>
      </Button>
    </>
  );
};

export default MapboxGlMap;
