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
  getColorForValue,
  metricConfigs,
  findMinMaxValues,
  loadHexagonDataFromCSV
} from '@/utils/hexUtils';
import { MetricKey, HexagonData } from '@/types/hex';
import { Map, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";

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
    
    // Initialize the map with coordinates optimized for hexagon data
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.5, 40], // Adjusted to view sample data
      zoom: 7, // Increased zoom level
      pitch: 0, // Flat view for better hexagon visibility
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

    console.log("Adding hexagon data to map");
    const hexPolygons = getHexPolygons();
    console.log("GeoJSON created with", hexPolygons.features.length, "features");
    
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
          setSelectedHexagon(feature.properties as HexagonData);

          // Create a popup
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div>
                <h3 class="text-lg font-bold">Hexagon Data</h3>
                <p class="text-sm">${feature.properties.GRID_ID}</p>
                <div class="mt-2">
                  <strong>${metricConfigs[selectedMetric].name}:</strong> 
                  ${metricConfigs[selectedMetric].format(feature.properties[selectedMetric])}
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
  }, [mapLoaded, selectedMetric, dataLoaded]);

  // Update hexagon colors when metric or filter changes
  const updateHexagonColors = () => {
    if (!map.current || !mapLoaded) return;

    const config = metricConfigs[selectedMetric];
    const [min, max] = findMinMaxValues(selectedMetric);
    
    // Create a color expression for the fill color
    const colorStops = config.colorScale.flatMap(stop => [stop.value, stop.color]);
    const colorExpression: mapboxgl.Expression = [
      'interpolate',
      ['linear'],
      ['get', selectedMetric],
      ...colorStops
    ];

    // Update fill color based on selected metric
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
  };

  // Handle metric selection change
  const handleMetricChange = (value: string) => {
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

  return (
    <div className="relative h-full w-full">
      {/* Map container */}
      <div ref={mapContainer} className="map-container h-full" style={{position: 'absolute', top: 0, bottom: 0, width: '100%'}} />

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
                  onValueChange={handleMetricChange}
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
                <Label>Filter Range {filterValue ? `(${filterValue[0]} - ${filterValue[1]})` : ''}</Label>
                <Slider
                  defaultValue={[min, max]}
                  min={min}
                  max={max}
                  step={step}
                  value={filterValue || [min, max]}
                  onValueChange={handleFilterChange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{min}</span>
                  <span className="text-xs text-muted-foreground">{max}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
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
                      <strong>Electric Suitability:</strong> {selectedHexagon.LDAC_suitability_elec}
                    </p>
                    <p className="text-xs">
                      <strong>Gas Suitability:</strong> {selectedHexagon.LDAC_suitability_gas}
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
        <Card className="bg-card/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-3">
            <h3 className="text-sm font-medium mb-2">{metricConfigs[selectedMetric].name}</h3>
            <div className="flex items-center gap-1">
              <div 
                className="h-4 w-24 rounded" 
                style={{
                  background: `linear-gradient(to right, ${metricConfigs[selectedMetric].colorScale[0].color}, ${metricConfigs[selectedMetric].colorScale[1].color})`
                }}
              />
              <span className="text-xs ml-1 w-8">{min}</span>
              <span className="text-xs flex-1 text-right w-8">{max}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{metricConfigs[selectedMetric].unit}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HexMap;
