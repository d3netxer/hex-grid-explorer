
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  getHexPolygons, 
  metricConfigs,
  findMinMaxValues,
  loadHexagonDataFromCSV,
  getColorForValue
} from '@/utils/hexUtils';
import { MetricKey, HexagonData } from '@/types/hex';
import { Map, Navigation } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import HexLegend from './HexLegend';

interface HexMapProps {
  mapboxToken: string;
}

const HexMap: React.FC<HexMapProps> = ({ mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('LDAC_suitability_elec');
  const [selectedHexagon, setSelectedHexagon] = useState<HexagonData | null>(null);
  const [filterValue, setFilterValue] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Set Mapbox access token
  mapboxgl.accessToken = mapboxToken;

  // Load CSV data
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const data = await loadHexagonDataFromCSV();
        console.log("Data loaded in HexMap component:", data.length, "records");
        if (data.length > 0) {
          console.log("Sample data for metrics:", {
            elec: data[0].LDAC_suitability_elec,
            gas: data[0].LDAC_suitability_gas,
            combined: data[0].LDAC_combined
          });
        }
        setDataLoaded(true);
        toast.success(`Loaded ${data.length} hexagon data records`);
      } catch (error) {
        console.error("Failed to load hexagon data:", error);
        toast.error("Error loading hexagon data. Using sample data instead.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

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
  }, []);

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
    
  }, [mapLoaded, selectedMetric, dataLoaded]);

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
            setSelectedHexagon(props);
            
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

  // Handle metric selection change
  const handleMetricChange = (value: string) => {
    console.log(`Changing metric to: ${value}`);
    setSelectedMetric(value as MetricKey);
    setFilterValue(null); // Reset filter when changing metrics
    updateHexagonColors();
  };

  // Handle filter change
  const handleFilterChange = (value: number[]) => {
    setFilterValue(value as [number, number]);
    updateHexagonColors();
  };

  // Reset filters
  const resetFilters = () => {
    setFilterValue(null);
    if (map.current) {
      map.current.setFilter('hexagon-fill', null);
      map.current.setFilter('hexagon-outline', null);
    }
  };

  useEffect(() => {
    updateHexagonColors();
  }, [filterValue]);

  // Get the range for the current metric filter slider
  const getFilterRange = () => {
    const [min, max] = findMinMaxValues(selectedMetric);
    return {
      min, 
      max,
      step: Math.max(0.1, Math.round((max - min) / 100 * 10) / 10) // Reasonable step size with decimal precision
    };
  };

  const { min, max, step } = getFilterRange();

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

  // Add button to fit map to hexagons
  const fitToDataButton = (
    <Button 
      variant="outline" 
      size="sm"
      onClick={fitMapToHexagons}
      className="absolute right-4 top-4 z-20 flex items-center gap-1"
    >
      <Navigation className="h-4 w-4" />
      <span>Fit to Data</span>
    </Button>
  );

  return (
    <div className="relative h-full w-full">
      {/* Map container */}
      <div ref={mapContainer} className="map-container h-full" style={{position: 'absolute', top: 0, bottom: 0, width: '100%'}} />

      {/* Fit to data button */}
      {fitToDataButton}

      {/* Loading indicator */}
      {dataLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            <span>Loading hexagon data...</span>
          </div>
        </div>
      )}

      {/* Controls panel */}
      <div className="absolute top-4 left-4 z-10 w-72 bg-opacity-90 animate-fade-in">
        <Card className="bg-card/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Map className="h-5 w-5" />
              <h2 className="text-lg font-bold">LDAC Suitability Explorer</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="metric-select">Select Metric</Label>
                <Select 
                  value={selectedMetric} 
                  onValueChange={(value) => {
                    console.log(`Changing metric to: ${value}`);
                    setSelectedMetric(value as MetricKey);
                    setFilterValue(null); // Reset filter when changing metrics
                    updateHexagonColors();
                  }}
                >
                  <SelectTrigger id="metric-select" className="w-full">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(metricConfigs).map((key) => (
                      <SelectItem key={key} value={key}>
                        {metricConfigs[key as MetricKey].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {metricConfigs[selectedMetric].description}
                </p>
              </div>

              <div>
                <Label>Filter Range {filterValue ? `(${filterValue[0].toFixed(1)} - ${filterValue[1].toFixed(1)})` : ''}</Label>
                <Slider
                  defaultValue={[0, 5]}
                  min={0}
                  max={5}
                  step={0.1}
                  value={filterValue || [0, 5]}
                  onValueChange={(value) => {
                    setFilterValue(value as [number, number]);
                    updateHexagonColors();
                  }}
                  className="mt-2"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">0</span>
                  <span className="text-xs text-muted-foreground">5</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setFilterValue(null);
                    if (map.current) {
                      map.current.setFilter('hexagon-fill', null);
                      map.current.setFilter('hexagon-outline', null);
                    }
                  }}
                  className="w-full mt-2"
                >
                  Reset Filters
                </Button>
              </div>

              {selectedHexagon && (
                <div className="mt-4 p-3 bg-secondary/50 rounded-md">
                  <h3 className="text-sm font-bold mb-1">Selected Hexagon</h3>
                  <p className="text-xs">ID: {selectedHexagon.GRID_ID}</p>
                  <div className="mt-1">
                    <p className="text-xs">
                      <strong>Electric Suitability:</strong> {selectedHexagon.LDAC_suitability_elec.toFixed(1)}
                    </p>
                    <p className="text-xs">
                      <strong>Gas Suitability:</strong> {selectedHexagon.LDAC_suitability_gas.toFixed(1)}
                    </p>
                    <p className="text-xs">
                      <strong>Combined Suitability:</strong> {selectedHexagon.LDAC_combined.toFixed(1)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-opacity-90 animate-fade-in">
        <HexLegend 
          metric={selectedMetric} 
          min={0} 
          max={5} 
        />
      </div>
    </div>
  );
};

export default HexMap;
