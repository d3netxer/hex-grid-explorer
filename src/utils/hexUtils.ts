import * as h3 from 'h3-js';
import { GeoJSON } from 'geojson';
import { HexagonData, MetricKey, MetricConfig, ColorStop } from '@/types/hex';

// Sample data as a fallback
export const sampleHexData: HexagonData[] = [
  { GRID_ID: "852c9043fffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, LDAC_combined: 4.6 },
  { GRID_ID: "852c9047fffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, LDAC_combined: 4.6 },
  { GRID_ID: "852c904bfffffff", LDAC_suitability_elec: 4.2, LDAC_suitability_gas: 0, LDAC_combined: 4.2 },
  { GRID_ID: "852c904ffffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, LDAC_combined: 4.6 },
  { GRID_ID: "852c9053fffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, LDAC_combined: 4.6 },
  { GRID_ID: "855215d3fffffff", LDAC_suitability_elec: 2.6, LDAC_suitability_gas: 2.2, LDAC_combined: 4.8 },
  { GRID_ID: "855215dbfffffff", LDAC_suitability_elec: 2.2, LDAC_suitability_gas: 1.8, LDAC_combined: 4.0 },
  { GRID_ID: "855221a7fffffff", LDAC_suitability_elec: 2, LDAC_suitability_gas: 0, LDAC_combined: 2.0 }
];

// This will store loaded data
export let hexData: HexagonData[] = [];

/**
 * Function to load hexagon data from CSV
 */
export const loadHexagonDataFromCSV = async (): Promise<HexagonData[]> => {
  try {
    console.log("Attempting to load CSV from /data/hexagon_data.csv");
    // Fetch the CSV file from public folder
    const response = await fetch('/data/hexagon_data.csv');
    
    if (!response.ok) {
      console.error(`Failed to load CSV: ${response.status} ${response.statusText}`);
      console.log("Using sample data as fallback");
      hexData = sampleHexData;
      return sampleHexData;
    }
    
    const csvText = await response.text();
    console.log("CSV loaded successfully, first 100 chars:", csvText.substring(0, 100));
    const parsedData = parseCSV(csvText);
    
    // Store the data in the module-level variable
    hexData = parsedData;
    console.log(`Loaded ${parsedData.length} hexagon records with combined LDAC values`);
    
    // Log the first record to verify structure
    if (parsedData.length > 0) {
      console.log("Sample record:", JSON.stringify(parsedData[0]));
    }
    
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
  if (lines.length < 2) {
    console.error("CSV file appears to be empty or invalid");
    return sampleHexData;
  }
  
  const headers = lines[0].split(',').map(header => header.trim());
  console.log("CSV headers:", headers);
  
  // Find column indices for our data
  const gridIdIndex = headers.findIndex(h => h.toLowerCase() === 'grid_id');
  const elecIndex = headers.findIndex(h => h.toLowerCase() === 'ldac_suitability_elec');
  const gasIndex = headers.findIndex(h => h.toLowerCase() === 'ldac_suitability_gas');
  const combinedIndex = headers.findIndex(h => 
    h.toLowerCase() === 'ldac_combined' || h.toLowerCase() === 'ldac combined'
  );
  
  console.log("Column indices:", { 
    gridIdIndex, 
    elecIndex, 
    gasIndex, 
    combinedIndex, 
    headers: headers.join(', ') 
  });
  
  const dataRows = lines.slice(1).filter(line => line.trim() !== '');
  console.log(`Found ${dataRows.length} data rows in CSV`);
  
  return dataRows.map((line, index) => {
    const values = line.split(',').map(value => value.trim());
    const data: any = {};
    
    // Get GRID_ID
    if (gridIdIndex >= 0 && gridIdIndex < values.length) {
      data['GRID_ID'] = values[gridIdIndex];
    } else {
      console.warn(`Missing GRID_ID in row ${index + 2}`);
      data['GRID_ID'] = `unknown-${index}`;
    }
    
    // Get electric suitability
    if (elecIndex >= 0 && elecIndex < values.length) {
      data['LDAC_suitability_elec'] = parseFloat(values[elecIndex]) || 0;
    } else {
      data['LDAC_suitability_elec'] = 0;
    }
    
    // Get gas suitability
    if (gasIndex >= 0 && gasIndex < values.length) {
      data['LDAC_suitability_gas'] = parseFloat(values[gasIndex]) || 0;
    } else {
      data['LDAC_suitability_gas'] = 0;
    }
    
    // Get combined value - either from the CSV or calculate it
    if (combinedIndex >= 0 && combinedIndex < values.length) {
      data['LDAC_combined'] = parseFloat(values[combinedIndex]) || 0;
      console.log(`Row ${index}: Combined from CSV = ${data['LDAC_combined']}`);
    } else {
      // Calculate combined if not in CSV
      data['LDAC_combined'] = Number(
        (data['LDAC_suitability_elec'] + data['LDAC_suitability_gas']).toFixed(1)
      );
      console.log(`Row ${index}: Calculated combined = ${data['LDAC_combined']}`);
    }
    
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
      // Validate H3 index before attempting to get boundary
      if (!h3.isValidCell(hex.GRID_ID)) {
        console.error(`Invalid H3 index: ${hex.GRID_ID}`);
        return null;
      }
      
      const boundary = h3.cellToBoundary(hex.GRID_ID);
      
      // H3 returns [lat, lng] but GeoJSON expects [lng, lat]
      const coordinates = boundary.map(point => [point[1], point[0]]);
      
      const feature: GeoJSON.Feature = {
        type: 'Feature',
        properties: { ...hex },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
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
  // Special handling for zero or null values to ensure transparency
  if (value === 0 || value === null || value === undefined) {
    // Find the transparent color stop or use default transparent
    const transparentStop = colorScale.find(stop => stop.color === 'transparent');
    return transparentStop ? transparentStop.color : 'transparent';
  }
  
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
  
  if (dataToUse.length === 0) return [0, 5];
  
  const values = dataToUse.map(hex => hex[metric]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return [min, max];
};

// Update the metric configurations for better visual representation
export const metricConfigs: Record<MetricKey, MetricConfig> = {
  LDAC_suitability_elec: {
    name: 'LDAC Suitability (Electric)',
    key: 'LDAC_suitability_elec',
    description: 'Suitability score for electric liquid desiccant air conditioning',
    unit: 'score',
    colorScale: [
      { value: 0, color: 'transparent' },
      { value: 0.5, color: '#edf8e9' },
      { value: 1, color: '#c7e9c0' },
      { value: 2, color: '#a1d99b' },
      { value: 3, color: '#74c476' },
      { value: 4, color: '#31a354' },
      { value: 5, color: '#006d2c' }
    ],
    format: (value) => value.toFixed(1)
  },
  LDAC_suitability_gas: {
    name: 'LDAC Suitability (Gas)',
    key: 'LDAC_suitability_gas',
    description: 'Suitability score for gas-powered liquid desiccant air conditioning',
    unit: 'score',
    colorScale: [
      { value: 0, color: 'transparent' },
      { value: 0.5, color: '#edf8e9' },
      { value: 1, color: '#c7e9c0' },
      { value: 2, color: '#a1d99b' },
      { value: 3, color: '#74c476' },
      { value: 4, color: '#31a354' },
      { value: 5, color: '#006d2c' }
    ],
    format: (value) => value.toFixed(1)
  },
  LDAC_combined: {
    name: 'LDAC Combined Suitability',
    key: 'LDAC_combined',
    description: 'Combined suitability score of electric and gas LDAC systems',
    unit: 'score',
    colorScale: [
      { value: 0, color: 'transparent' },
      { value: 0.5, color: '#edf8e9' },
      { value: 1, color: '#c7e9c0' },
      { value: 2, color: '#a1d99b' },
      { value: 3, color: '#74c476' },
      { value: 4, color: '#31a354' },
      { value: 5, color: '#006d2c' }
    ],
    format: (value) => value.toFixed(1)
  }
};
