
import * as h3 from 'h3-js';
import { GeoJSON } from 'geojson';
import { HexagonData, MetricKey, MetricConfig, ColorStop } from '@/types/hex';

// Sample data as a fallback
export const sampleHexData: HexagonData[] = [
  { GRID_ID: "852c9043fffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, heating_demand: 120 },
  { GRID_ID: "852c9047fffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, heating_demand: 135 },
  { GRID_ID: "852c904bfffffff", LDAC_suitability_elec: 4.2, LDAC_suitability_gas: 0, heating_demand: 145 },
  { GRID_ID: "852c904ffffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, heating_demand: 160 },
  { GRID_ID: "852c9053fffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, heating_demand: 110 },
  { GRID_ID: "855215d3fffffff", LDAC_suitability_elec: 2.6, LDAC_suitability_gas: 2.2, heating_demand: 180 },
  { GRID_ID: "855215dbfffffff", LDAC_suitability_elec: 2.2, LDAC_suitability_gas: 1.8, heating_demand: 190 },
  { GRID_ID: "855221a7fffffff", LDAC_suitability_elec: 2, LDAC_suitability_gas: 0, heating_demand: 175 }
];

// This will store loaded data
export let hexData: HexagonData[] = [];

/**
 * Function to load hexagon data from CSV
 */
export const loadHexagonDataFromCSV = async (): Promise<HexagonData[]> => {
  try {
    console.log("Attempting to load CSV from /data/hexagon_data.csv");
    // Fetch the CSV file - update path to use public folder
    const response = await fetch('/data/hexagon_data.csv');
    
    if (!response.ok) {
      console.error(`Failed to load CSV: ${response.status} ${response.statusText}`);
      console.log("Using sample data as fallback");
      hexData = sampleHexData;
      return sampleHexData;
    }
    
    const csvText = await response.text();
    console.log("CSV loaded successfully, parsing data...");
    const parsedData = parseCSV(csvText);
    
    // Store the data in the module-level variable
    hexData = parsedData;
    console.log(`Loaded ${parsedData.length} hexagon records`);
    return parsedData;
  } catch (error) {
    console.error('Error loading hexagon data from CSV:', error);
    // Return sample data as fallback
    console.log("Using sample data as fallback due to error");
    hexData = sampleHexData;
    return sampleHexData;
  }
};

/**
 * Helper function to parse CSV text into HexagonData objects
 */
export const parseCSV = (csvText: string): HexagonData[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).filter(line => line.trim() !== '').map(line => {
    const values = line.split(',');
    const data: any = {};
    
    headers.forEach((header, index) => {
      if (header === 'grid_id') {
        data['GRID_ID'] = values[index];
      } else if (header === 'LDAC_suitability_elec') {
        data['LDAC_suitability_elec'] = parseFloat(values[index]);
      } else if (header === 'LDAC_suitability_gas') {
        data['LDAC_suitability_gas'] = parseFloat(values[index]);
      } else if (header === 'heating_demand') {
        data['heating_demand'] = parseFloat(values[index]);
      } else {
        data[header] = values[index];
      }
    });
    
    return data as HexagonData;
  });
};

// Convert H3 hex IDs to GeoJSON polygons for mapping
export const getHexPolygons = (): GeoJSON.FeatureCollection => {
  // If hexData is empty, we might not have loaded it yet
  const dataToUse = hexData.length > 0 ? hexData : sampleHexData;
  
  console.log(`Creating GeoJSON from ${dataToUse.length} hexagons`);
  
  const features = dataToUse.map(hex => {
    try {
      const boundary = h3.cellToBoundary(hex.GRID_ID);
      
      const feature: GeoJSON.Feature = {
        type: 'Feature',
        properties: { ...hex },
        geometry: {
          type: 'Polygon',
          coordinates: [boundary.map(coord => [coord[1], coord[0]])]
        }
      };
      
      return feature;
    } catch (error) {
      console.error(`Error creating polygon for hex ${hex.GRID_ID}:`, error);
      return null;
    }
  }).filter(feature => feature !== null);

  console.log(`Created ${features.length} valid GeoJSON features`);
  
  return {
    type: 'FeatureCollection',
    features: features as GeoJSON.Feature[]
  };
};

// Get color for a specific value based on the color scale
export const getColorForValue = (value: number, colorScale: ColorStop[]): string => {
  if (colorScale.length < 2) return colorScale[0]?.color || '#000000';
  
  const sortedStops = [...colorScale].sort((a, b) => a.value - b.value);
  
  // If value is less than the first stop
  if (value <= sortedStops[0].value) return sortedStops[0].color;
  
  // If value is greater than the last stop
  if (value >= sortedStops[sortedStops.length - 1].value) return sortedStops[sortedStops.length - 1].color;
  
  // Find the stops between which the value falls
  for (let i = 0; i < sortedStops.length - 1; i++) {
    const currentStop = sortedStops[i];
    const nextStop = sortedStops[i + 1];
    
    if (value >= currentStop.value && value <= nextStop.value) {
      // Calculate interpolation factor
      const range = nextStop.value - currentStop.value;
      const factor = range !== 0 ? (value - currentStop.value) / range : 0;
      
      // Parse colors from hex to RGB
      const fromRGB = hexToRgb(currentStop.color);
      const toRGB = hexToRgb(nextStop.color);
      
      // Interpolate RGB values
      const r = Math.round(fromRGB.r + factor * (toRGB.r - fromRGB.r));
      const g = Math.round(fromRGB.g + factor * (toRGB.g - fromRGB.g));
      const b = Math.round(fromRGB.b + factor * (toRGB.b - fromRGB.b));
      
      // Convert back to hex
      return rgbToHex(r, g, b);
    }
  }
  
  // Default fallback
  return '#000000';
};

// Helper functions for color conversion
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Find min/max values for a specific metric in the dataset
export const findMinMaxValues = (metric: MetricKey): [number, number] => {
  // Use the loaded data if available, otherwise use sample data
  const dataToUse = hexData.length > 0 ? hexData : sampleHexData;
  
  if (dataToUse.length === 0) return [0, 1];
  
  const values = dataToUse.map(hex => hex[metric]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return [min, max];
};

// Configuration for each metric
export const metricConfigs: Record<MetricKey, MetricConfig> = {
  LDAC_suitability_elec: {
    name: 'LDAC Suitability (Electric)',
    key: 'LDAC_suitability_elec',
    description: 'Suitability score for electric liquid desiccant air conditioning',
    unit: 'score',
    colorScale: [
      { value: 0, color: '#f5f5f5' },
      { value: 5, color: '#7E69AB' }
    ],
    format: (value) => value.toString()
  },
  LDAC_suitability_gas: {
    name: 'LDAC Suitability (Gas)',
    key: 'LDAC_suitability_gas',
    description: 'Suitability score for gas-powered liquid desiccant air conditioning',
    unit: 'score',
    colorScale: [
      { value: 0, color: '#f5f5f5' },
      { value: 2.2, color: '#9b87f5' }
    ],
    format: (value) => value.toString()
  },
  heating_demand: {
    name: 'Heating Demand',
    key: 'heating_demand',
    description: 'Annual heating demand intensity for the area',
    unit: 'kWh/m²',
    colorScale: [
      { value: 100, color: '#f5f5f5' },
      { value: 200, color: '#F97316' }
    ],
    format: (value) => `${value} kWh/m²`
  }
};
