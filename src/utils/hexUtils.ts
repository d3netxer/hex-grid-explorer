
import * as h3 from 'h3-js';
import { HexagonData, MetricKey, MetricConfig } from '../types/hex';

export const hexData: HexagonData[] = [
  { GRID_ID: '852c900bfffffff', ZONE_CODE: 1, distance_to_storage: 8, distance_to_power_lines: 8, distance_to_master_gas_system: 271, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 974, distance_to_desal_plants: 190, distance_to_CCGT: 365, distance_to_renewable_plant: 126, distance_to_waste_heat: 109, direct_normal_irradiation_kWh_m2: 1911, PVOUT_kWh_kWp: 1779, in_protected_area: 0 },
  { GRID_ID: '852c901bfffffff', ZONE_CODE: 2, distance_to_storage: 12, distance_to_power_lines: 16, distance_to_master_gas_system: 290, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 978, distance_to_desal_plants: 209, distance_to_CCGT: 383, distance_to_renewable_plant: 136, distance_to_waste_heat: 105, direct_normal_irradiation_kWh_m2: 1895, PVOUT_kWh_kWp: 1774, in_protected_area: 0 },
  { GRID_ID: '852c9043fffffff', ZONE_CODE: 3, distance_to_storage: 0, distance_to_power_lines: 18, distance_to_master_gas_system: 262, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 945, distance_to_desal_plants: 186, distance_to_CCGT: 353, distance_to_renewable_plant: 92, distance_to_waste_heat: 83, direct_normal_irradiation_kWh_m2: 1924, PVOUT_kWh_kWp: 1786, in_protected_area: 0 },
  { GRID_ID: '852c9047fffffff', ZONE_CODE: 4, distance_to_storage: 0, distance_to_power_lines: 12, distance_to_master_gas_system: 258, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 960, distance_to_desal_plants: 179, distance_to_CCGT: 351, distance_to_renewable_plant: 109, distance_to_waste_heat: 100, direct_normal_irradiation_kWh_m2: 1921, PVOUT_kWh_kWp: 1783, in_protected_area: 0 },
  { GRID_ID: '852c904bfffffff', ZONE_CODE: 5, distance_to_storage: 0, distance_to_power_lines: 34, distance_to_master_gas_system: 247, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 929, distance_to_desal_plants: 178, distance_to_CCGT: 340, distance_to_renewable_plant: 74, distance_to_waste_heat: 76, direct_normal_irradiation_kWh_m2: 1928, PVOUT_kWh_kWp: 1789, in_protected_area: 0 },
  { GRID_ID: '852c904ffffffff', ZONE_CODE: 6, distance_to_storage: 0, distance_to_power_lines: 27, distance_to_master_gas_system: 247, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 942, distance_to_desal_plants: 170, distance_to_CCGT: 337, distance_to_renewable_plant: 91, distance_to_waste_heat: 91, direct_normal_irradiation_kWh_m2: 1926, PVOUT_kWh_kWp: 1788, in_protected_area: 0 },
  { GRID_ID: '852c9053fffffff', ZONE_CODE: 7, distance_to_storage: 0, distance_to_power_lines: 22, distance_to_master_gas_system: 282, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 947, distance_to_desal_plants: 205, distance_to_CCGT: 371, distance_to_renewable_plant: 104, distance_to_waste_heat: 76, direct_normal_irradiation_kWh_m2: 1908, PVOUT_kWh_kWp: 1781, in_protected_area: 0 },
  { GRID_ID: '852c9057fffffff', ZONE_CODE: 8, distance_to_storage: 0, distance_to_power_lines: 7, distance_to_master_gas_system: 276, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 959, distance_to_desal_plants: 195, distance_to_CCGT: 365, distance_to_renewable_plant: 114, distance_to_waste_heat: 92, direct_normal_irradiation_kWh_m2: 1910, PVOUT_kWh_kWp: 1779, in_protected_area: 0 },
  { GRID_ID: '852c905bfffffff', ZONE_CODE: 9, distance_to_storage: 0, distance_to_power_lines: 31, distance_to_master_gas_system: 269, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 931, distance_to_desal_plants: 195, distance_to_CCGT: 356, distance_to_renewable_plant: 83, distance_to_waste_heat: 67, direct_normal_irradiation_kWh_m2: 1927, PVOUT_kWh_kWp: 1789, in_protected_area: 0 },
  { GRID_ID: '852c9063fffffff', ZONE_CODE: 10, distance_to_storage: 4, distance_to_power_lines: 41, distance_to_master_gas_system: 237, mean_temperature_Aug_2023: 38, dew_point_humidity: 9, geothermal_favorability: 0, distance_to_hot_springs: 973, distance_to_desal_plants: 155, distance_to_CCGT: 333, distance_to_renewable_plant: 121, distance_to_waste_heat: 128, direct_normal_irradiation_kWh_m2: 1921, PVOUT_kWh_kWp: 1782, in_protected_area: 0 },
  { GRID_ID: '852c906bfffffff', ZONE_CODE: 11, distance_to_storage: 0, distance_to_power_lines: 43, distance_to_master_gas_system: 220, mean_temperature_Aug_2023: 38, dew_point_humidity: 9, geothermal_favorability: 0, distance_to_hot_springs: 958, distance_to_desal_plants: 149, distance_to_CCGT: 323, distance_to_renewable_plant: 107, distance_to_waste_heat: 119, direct_normal_irradiation_kWh_m2: 1925, PVOUT_kWh_kWp: 1784, in_protected_area: 0 },
  { GRID_ID: '852c906ffffffff', ZONE_CODE: 12, distance_to_storage: 3, distance_to_power_lines: 55, distance_to_master_gas_system: 223, mean_temperature_Aug_2023: 38, dew_point_humidity: 9, geothermal_favorability: 0, distance_to_hot_springs: 971, distance_to_desal_plants: 140, distance_to_CCGT: 319, distance_to_renewable_plant: 127, distance_to_waste_heat: 133, direct_normal_irradiation_kWh_m2: 1921, PVOUT_kWh_kWp: 1781, in_protected_area: 0 },
  { GRID_ID: '852c9073fffffff', ZONE_CODE: 13, distance_to_storage: 7, distance_to_power_lines: 23, distance_to_master_gas_system: 256, mean_temperature_Aug_2023: 38, dew_point_humidity: 9, geothermal_favorability: 0, distance_to_hot_springs: 973, distance_to_desal_plants: 174, distance_to_CCGT: 350, distance_to_renewable_plant: 127, distance_to_waste_heat: 116, direct_normal_irradiation_kWh_m2: 1918, PVOUT_kWh_kWp: 1782, in_protected_area: 0 },
  { GRID_ID: '852c907bfffffff', ZONE_CODE: 14, distance_to_storage: 0, distance_to_power_lines: 29, distance_to_master_gas_system: 241, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 957, distance_to_desal_plants: 163, distance_to_CCGT: 336, distance_to_renewable_plant: 106, distance_to_waste_heat: 109, direct_normal_irradiation_kWh_m2: 1923, PVOUT_kWh_kWp: 1784, in_protected_area: 0 },
  { GRID_ID: '852c90c3fffffff', ZONE_CODE: 15, distance_to_storage: 5, distance_to_power_lines: 37, distance_to_master_gas_system: 316, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 963, distance_to_desal_plants: 229, distance_to_CCGT: 397, distance_to_renewable_plant: 138, distance_to_waste_heat: 85, direct_normal_irradiation_kWh_m2: 1919, PVOUT_kWh_kWp: 1785, in_protected_area: 0 },
  { GRID_ID: '852c90cbfffffff', ZONE_CODE: 16, distance_to_storage: 0, distance_to_power_lines: 34, distance_to_master_gas_system: 299, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 947, distance_to_desal_plants: 220, distance_to_CCGT: 384, distance_to_renewable_plant: 113, distance_to_waste_heat: 71, direct_normal_irradiation_kWh_m2: 1917, PVOUT_kWh_kWp: 1784, in_protected_area: 0 },
  { GRID_ID: '852c90cffffffff', ZONE_CODE: 17, distance_to_storage: 4, distance_to_power_lines: 19, distance_to_master_gas_system: 295, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 962, distance_to_desal_plants: 210, distance_to_CCGT: 380, distance_to_renewable_plant: 124, distance_to_waste_heat: 88, direct_normal_irradiation_kWh_m2: 1907, PVOUT_kWh_kWp: 1779, in_protected_area: 0 },
  { GRID_ID: '852c90d3fffffff', ZONE_CODE: 18, distance_to_storage: 6, distance_to_power_lines: 53, distance_to_master_gas_system: 332, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 967, distance_to_desal_plants: 245, distance_to_CCGT: 413, distance_to_renewable_plant: 146, distance_to_waste_heat: 88, direct_normal_irradiation_kWh_m2: 1923, PVOUT_kWh_kWp: 1788, in_protected_area: 0 },
  { GRID_ID: '852c90dbfffffff', ZONE_CODE: 19, distance_to_storage: 0, distance_to_power_lines: 49, distance_to_master_gas_system: 317, mean_temperature_Aug_2023: 38, dew_point_humidity: 7, geothermal_favorability: 0, distance_to_hot_springs: 950, distance_to_desal_plants: 236, distance_to_CCGT: 400, distance_to_renewable_plant: 127, distance_to_waste_heat: 72, direct_normal_irradiation_kWh_m2: 1924, PVOUT_kWh_kWp: 1787, in_protected_area: 0 },
  { GRID_ID: '852c9203fffffff', ZONE_CODE: 20, distance_to_storage: 0, distance_to_power_lines: 22, distance_to_master_gas_system: 202, mean_temperature_Aug_2023: 38, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 884, distance_to_desal_plants: 147, distance_to_CCGT: 289, distance_to_renewable_plant: 29, distance_to_waste_heat: 94, direct_normal_irradiation_kWh_m2: 1939, PVOUT_kWh_kWp: 1791, in_protected_area: 0 },
  { GRID_ID: '852c9207fffffff', ZONE_CODE: 21, distance_to_storage: 0, distance_to_power_lines: 38, distance_to_master_gas_system: 193, mean_temperature_Aug_2023: 39, dew_point_humidity: 8, geothermal_favorability: 0, distance_to_hot_springs: 897, distance_to_desal_plants: 135, distance_to_CCGT: 284, distance_to_renewable_plant: 50, distance_to_waste_heat: 105, direct_normal_irradiation_kWh_m2: 1935, PVOUT_kWh_kWp: 1789, in_protected_area: 0 }
];

// Calculate hexagon centers for map display
export function getHexCenters(): { id: string; center: [number, number] }[] {
  return hexData.map(hex => {
    const [lat, lng] = h3.h3ToGeo(hex.GRID_ID);
    return { id: hex.GRID_ID, center: [lng, lat] };
  });
}

// Get GeoJSON polygons for each hexagon
export function getHexPolygons(): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = hexData.map(hex => {
    const hexBoundary = h3.h3ToGeoBoundary(hex.GRID_ID, true);
    return {
      type: 'Feature',
      properties: { ...hex },
      geometry: {
        type: 'Polygon',
        coordinates: [hexBoundary]
      }
    };
  });

  return {
    type: 'FeatureCollection',
    features
  };
}

// Find the min and max values for any given metric in the dataset
export function findMinMaxValues(key: MetricKey): [number, number] {
  const values = hexData.map(hex => hex[key]);
  return [Math.min(...values), Math.max(...values)];
}

// Get color for a value based on a color scale
export function getColorForValue(value: number, colorStops: { value: number; color: string }[]): string {
  // Sort stops by value to ensure correct interpolation
  const stops = [...colorStops].sort((a, b) => a.value - b.value);
  
  // If value is less than first stop, return first color
  if (value <= stops[0].value) return stops[0].color;
  
  // If value is greater than last stop, return last color
  if (value >= stops[stops.length - 1].value) return stops[stops.length - 1].color;
  
  // Find the two stops that the value is between
  for (let i = 0; i < stops.length - 1; i++) {
    const curr = stops[i];
    const next = stops[i + 1];
    
    if (value >= curr.value && value <= next.value) {
      // Calculate interpolation factor (0 to 1)
      const factor = (value - curr.value) / (next.value - curr.value);
      
      // Parse colors to RGB components
      const currRgb = hexToRgb(curr.color);
      const nextRgb = hexToRgb(next.color);
      
      // Interpolate RGB components
      const r = Math.round(currRgb.r + factor * (nextRgb.r - currRgb.r));
      const g = Math.round(currRgb.g + factor * (nextRgb.g - currRgb.g));
      const b = Math.round(currRgb.b + factor * (nextRgb.b - currRgb.b));
      
      // Convert back to hex
      return rgbToHex(r, g, b);
    }
  }
  
  // Fallback to last color
  return stops[stops.length - 1].color;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// Metric configuration for all available metrics
export const metricConfigs: Record<MetricKey, MetricConfig> = {
  ZONE_CODE: {
    name: 'Zone Code',
    key: 'ZONE_CODE',
    description: 'Numeric zone classification',
    unit: '',
    colorScale: [
      { value: 1, color: '#3B82F6' },
      { value: 21, color: '#EC4899' }
    ],
    format: (value) => `${value}`
  },
  distance_to_storage: {
    name: 'Distance to Storage',
    key: 'distance_to_storage',
    description: 'Distance to nearest storage facility',
    unit: 'km',
    colorScale: [
      { value: 0, color: '#10B981' },
      { value: 12, color: '#FACC15' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_power_lines: {
    name: 'Distance to Power Lines',
    key: 'distance_to_power_lines',
    description: 'Distance to nearest power transmission lines',
    unit: 'km',
    colorScale: [
      { value: 0, color: '#10B981' },
      { value: 55, color: '#EF4444' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_master_gas_system: {
    name: 'Distance to Gas System',
    key: 'distance_to_master_gas_system',
    description: 'Distance to master gas system',
    unit: 'km',
    colorScale: [
      { value: 190, color: '#10B981' },
      { value: 330, color: '#EF4444' }
    ],
    format: (value) => `${value} km`
  },
  mean_temperature_Aug_2023: {
    name: 'Temperature (Aug 2023)',
    key: 'mean_temperature_Aug_2023',
    description: 'Mean temperature in August 2023',
    unit: '°C',
    colorScale: [
      { value: 38, color: '#3B82F6' },
      { value: 39, color: '#EF4444' }
    ],
    format: (value) => `${value}°C`
  },
  dew_point_humidity: {
    name: 'Dew Point Humidity',
    key: 'dew_point_humidity',
    description: 'Dew point humidity measurement',
    unit: '',
    colorScale: [
      { value: 7, color: '#10B981' },
      { value: 9, color: '#3B82F6' }
    ],
    format: (value) => `${value}`
  },
  geothermal_favorability: {
    name: 'Geothermal Favorability',
    key: 'geothermal_favorability',
    description: 'Geothermal resource potential',
    unit: '',
    colorScale: [
      { value: 0, color: '#EF4444' },
      { value: 1, color: '#10B981' }
    ],
    format: (value) => `${value}`
  },
  distance_to_hot_springs: {
    name: 'Distance to Hot Springs',
    key: 'distance_to_hot_springs',
    description: 'Distance to nearest hot springs',
    unit: 'km',
    colorScale: [
      { value: 880, color: '#10B981' },
      { value: 980, color: '#EF4444' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_desal_plants: {
    name: 'Distance to Desalination Plants',
    key: 'distance_to_desal_plants',
    description: 'Distance to nearest desalination facilities',
    unit: 'km',
    colorScale: [
      { value: 130, color: '#10B981' },
      { value: 250, color: '#EF4444' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_CCGT: {
    name: 'Distance to CCGT',
    key: 'distance_to_CCGT',
    description: 'Distance to nearest combined cycle gas turbine',
    unit: 'km',
    colorScale: [
      { value: 280, color: '#10B981' },
      { value: 420, color: '#EF4444' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_renewable_plant: {
    name: 'Distance to Renewable Plant',
    key: 'distance_to_renewable_plant',
    description: 'Distance to nearest renewable energy facility',
    unit: 'km',
    colorScale: [
      { value: 29, color: '#10B981' },
      { value: 146, color: '#EF4444' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_waste_heat: {
    name: 'Distance to Waste Heat',
    key: 'distance_to_waste_heat',
    description: 'Distance to nearest waste heat source',
    unit: 'km',
    colorScale: [
      { value: 65, color: '#10B981' },
      { value: 135, color: '#EF4444' }
    ],
    format: (value) => `${value} km`
  },
  direct_normal_irradiation_kWh_m2: {
    name: 'Direct Normal Irradiation',
    key: 'direct_normal_irradiation_kWh_m2',
    description: 'Direct normal irradiation',
    unit: 'kWh/m²',
    colorScale: [
      { value: 1890, color: '#3B82F6' },
      { value: 1940, color: '#FACC15' }
    ],
    format: (value) => `${value} kWh/m²`
  },
  PVOUT_kWh_kWp: {
    name: 'PV Output',
    key: 'PVOUT_kWh_kWp',
    description: 'Photovoltaic power output potential',
    unit: 'kWh/kWp',
    colorScale: [
      { value: 1770, color: '#3B82F6' },
      { value: 1790, color: '#FACC15' }
    ],
    format: (value) => `${value} kWh/kWp`
  },
  in_protected_area: {
    name: 'Protected Area Status',
    key: 'in_protected_area',
    description: 'Whether the hexagon is in a protected area (0=No, 1=Yes)',
    unit: '',
    colorScale: [
      { value: 0, color: '#10B981' },
      { value: 1, color: '#EF4444' }
    ],
    format: (value) => value === 0 ? 'No' : 'Yes'
  }
};
