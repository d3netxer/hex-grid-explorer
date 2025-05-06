import * as h3 from 'h3-js';
import { GeoJSON } from 'geojson';
import { HexagonData, MetricKey, MetricConfig, ColorStop } from '@/types/hex';

// Sample hexagon data (this would normally come from an API or file)
export const hexData: HexagonData[] = [
  {
    GRID_ID: "852c900bfffffff",
    ZONE_CODE: 1,
    distance_to_storage: 8,
    distance_to_power_lines: 8,
    distance_to_master_gas_system: 271,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 8,
    geothermal_favorability: 0,
    distance_to_hot_springs: 974,
    distance_to_desal_plants: 190,
    distance_to_CCGT: 365,
    distance_to_renewable_plant: 126,
    distance_to_waste_heat: 109,
    direct_normal_irradiation_kWh_m2: 1911,
    PVOUT_kWh_kWp: 1779,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c900dfffffff",
    ZONE_CODE: 2,
    distance_to_storage: 3,
    distance_to_power_lines: 55,
    distance_to_master_gas_system: 332,
    mean_temperature_Aug_2023: 39,
    dew_point_humidity: 9,
    geothermal_favorability: 1,
    distance_to_hot_springs: 978,
    distance_to_desal_plants: 245,
    distance_to_CCGT: 413,
    distance_to_renewable_plant: 146,
    distance_to_waste_heat: 133,
    direct_normal_irradiation_kWh_m2: 1939,
    PVOUT_kWh_kWp: 1791,
    in_protected_area: 1
  },
  {
    GRID_ID: "852c900efffffff",
    ZONE_CODE: 3,
    distance_to_storage: 12,
    distance_to_power_lines: 23,
    distance_to_master_gas_system: 298,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 7,
    geothermal_favorability: 0,
    distance_to_hot_springs: 884,
    distance_to_desal_plants: 135,
    distance_to_CCGT: 284,
    distance_to_renewable_plant: 29,
    distance_to_waste_heat: 67,
    direct_normal_irradiation_kWh_m2: 1895,
    PVOUT_kWh_kWp: 1774,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c900c7ffffff",
    ZONE_CODE: 4,
    distance_to_storage: 5,
    distance_to_power_lines: 34,
    distance_to_master_gas_system: 271,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 8,
    geothermal_favorability: 0,
    distance_to_hot_springs: 974,
    distance_to_desal_plants: 190,
    distance_to_CCGT: 365,
    distance_to_renewable_plant: 126,
    distance_to_waste_heat: 109,
    direct_normal_irradiation_kWh_m2: 1911,
    PVOUT_kWh_kWp: 1779,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c9008bffffff",
    ZONE_CODE: 5,
    distance_to_storage: 9,
    distance_to_power_lines: 55,
    distance_to_master_gas_system: 332,
    mean_temperature_Aug_2023: 39,
    dew_point_humidity: 9,
    geothermal_favorability: 1,
    distance_to_hot_springs: 978,
    distance_to_desal_plants: 245,
    distance_to_CCGT: 413,
    distance_to_renewable_plant: 146,
    distance_to_waste_heat: 133,
    direct_normal_irradiation_kWh_m2: 1939,
    PVOUT_kWh_kWp: 1791,
    in_protected_area: 1
  },
  {
    GRID_ID: "852c900a3ffffff",
    ZONE_CODE: 6,
    distance_to_storage: 1,
    distance_to_power_lines: 23,
    distance_to_master_gas_system: 298,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 7,
    geothermal_favorability: 0,
    distance_to_hot_springs: 884,
    distance_to_desal_plants: 135,
    distance_to_CCGT: 284,
    distance_to_renewable_plant: 29,
    distance_to_waste_heat: 67,
    direct_normal_irradiation_kWh_m2: 1895,
    PVOUT_kWh_kWp: 1774,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c90097ffffff",
    ZONE_CODE: 7,
    distance_to_storage: 7,
    distance_to_power_lines: 34,
    distance_to_master_gas_system: 271,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 8,
    geothermal_favorability: 0,
    distance_to_hot_springs: 974,
    distance_to_desal_plants: 190,
    distance_to_CCGT: 365,
    distance_to_renewable_plant: 126,
    distance_to_waste_heat: 109,
    direct_normal_irradiation_kWh_m2: 1911,
    PVOUT_kWh_kWp: 1779,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c900f3ffffff",
    ZONE_CODE: 8,
    distance_to_storage: 2,
    distance_to_power_lines: 55,
    distance_to_master_gas_system: 332,
    mean_temperature_Aug_2023: 39,
    dew_point_humidity: 9,
    geothermal_favorability: 1,
    distance_to_hot_springs: 978,
    distance_to_desal_plants: 245,
    distance_to_CCGT: 413,
    distance_to_renewable_plant: 146,
    distance_to_waste_heat: 133,
    direct_normal_irradiation_kWh_m2: 1939,
    PVOUT_kWh_kWp: 1791,
    in_protected_area: 1
  },
  {
    GRID_ID: "852c900d3ffffff",
    ZONE_CODE: 9,
    distance_to_storage: 6,
    distance_to_power_lines: 23,
    distance_to_master_gas_system: 298,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 7,
    geothermal_favorability: 0,
    distance_to_hot_springs: 884,
    distance_to_desal_plants: 135,
    distance_to_CCGT: 284,
    distance_to_renewable_plant: 29,
    distance_to_waste_heat: 67,
    direct_normal_irradiation_kWh_m2: 1895,
    PVOUT_kWh_kWp: 1774,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c900c3ffffff",
    ZONE_CODE: 10,
    distance_to_storage: 10,
    distance_to_power_lines: 34,
    distance_to_master_gas_system: 271,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 8,
    geothermal_favorability: 0,
    distance_to_hot_springs: 974,
    distance_to_desal_plants: 190,
    distance_to_CCGT: 365,
    distance_to_renewable_plant: 126,
    distance_to_waste_heat: 109,
    direct_normal_irradiation_kWh_m2: 1911,
    PVOUT_kWh_kWp: 1779,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c90083ffffff",
    ZONE_CODE: 11,
    distance_to_storage: 4,
    distance_to_power_lines: 55,
    distance_to_master_gas_system: 332,
    mean_temperature_Aug_2023: 39,
    dew_point_humidity: 9,
    geothermal_favorability: 1,
    distance_to_hot_springs: 978,
    distance_to_desal_plants: 245,
    distance_to_CCGT: 413,
    distance_to_renewable_plant: 146,
    distance_to_waste_heat: 133,
    direct_normal_irradiation_kWh_m2: 1939,
    PVOUT_kWh_kWp: 1791,
    in_protected_area: 1
  },
  {
    GRID_ID: "852c900a7ffffff",
    ZONE_CODE: 12,
    distance_to_storage: 11,
    distance_to_power_lines: 23,
    distance_to_master_gas_system: 298,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 7,
    geothermal_favorability: 0,
    distance_to_hot_springs: 884,
    distance_to_desal_plants: 135,
    distance_to_CCGT: 284,
    distance_to_renewable_plant: 29,
    distance_to_waste_heat: 67,
    direct_normal_irradiation_kWh_m2: 1895,
    PVOUT_kWh_kWp: 1774,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c90093ffffff",
    ZONE_CODE: 13,
    distance_to_storage: 13,
    distance_to_power_lines: 34,
    distance_to_master_gas_system: 271,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 8,
    geothermal_favorability: 0,
    distance_to_hot_springs: 974,
    distance_to_desal_plants: 190,
    distance_to_CCGT: 365,
    distance_to_renewable_plant: 126,
    distance_to_waste_heat: 109,
    direct_normal_irradiation_kWh_m2: 1911,
    PVOUT_kWh_kWp: 1779,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c900f7ffffff",
    ZONE_CODE: 14,
    distance_to_storage: 14,
    distance_to_power_lines: 55,
    distance_to_master_gas_system: 332,
    mean_temperature_Aug_2023: 39,
    dew_point_humidity: 9,
    geothermal_favorability: 1,
    distance_to_hot_springs: 978,
    distance_to_desal_plants: 245,
    distance_to_CCGT: 413,
    distance_to_renewable_plant: 146,
    distance_to_waste_heat: 133,
    direct_normal_irradiation_kWh_m2: 1939,
    PVOUT_kWh_kWp: 1791,
    in_protected_area: 1
  },
  {
    GRID_ID: "852c900d7ffffff",
    ZONE_CODE: 15,
    distance_to_storage: 15,
    distance_to_power_lines: 23,
    distance_to_master_gas_system: 298,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 7,
    geothermal_favorability: 0,
    distance_to_hot_springs: 884,
    distance_to_desal_plants: 135,
    distance_to_CCGT: 284,
    distance_to_renewable_plant: 29,
    distance_to_waste_heat: 67,
    direct_normal_irradiation_kWh_m2: 1895,
    PVOUT_kWh_kWp: 1774,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c900cfffffff",
    ZONE_CODE: 16,
    distance_to_storage: 16,
    distance_to_power_lines: 34,
    distance_to_master_gas_system: 271,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 8,
    geothermal_favorability: 0,
    distance_to_hot_springs: 974,
    distance_to_desal_plants: 190,
    distance_to_CCGT: 365,
    distance_to_renewable_plant: 126,
    distance_to_waste_heat: 109,
    direct_normal_irradiation_kWh_m2: 1911,
    PVOUT_kWh_kWp: 1779,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c9008fffffff",
    ZONE_CODE: 17,
    distance_to_storage: 17,
    distance_to_power_lines: 55,
    distance_to_master_gas_system: 332,
    mean_temperature_Aug_2023: 39,
    dew_point_humidity: 9,
    geothermal_favorability: 1,
    distance_to_hot_springs: 978,
    distance_to_desal_plants: 245,
    distance_to_CCGT: 413,
    distance_to_renewable_plant: 146,
    distance_to_waste_heat: 133,
    direct_normal_irradiation_kWh_m2: 1939,
    PVOUT_kWh_kWp: 1791,
    in_protected_area: 1
  },
  {
    GRID_ID: "852c900affffffff",
    ZONE_CODE: 18,
    distance_to_storage: 18,
    distance_to_power_lines: 23,
    distance_to_master_gas_system: 298,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 7,
    geothermal_favorability: 0,
    distance_to_hot_springs: 884,
    distance_to_desal_plants: 135,
    distance_to_CCGT: 284,
    distance_to_renewable_plant: 29,
    distance_to_waste_heat: 67,
    direct_normal_irradiation_kWh_m2: 1895,
    PVOUT_kWh_kWp: 1774,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c9009fffffff",
    ZONE_CODE: 19,
    distance_to_storage: 19,
    distance_to_power_lines: 34,
    distance_to_master_gas_system: 271,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 8,
    geothermal_favorability: 0,
    distance_to_hot_springs: 974,
    distance_to_desal_plants: 190,
    distance_to_CCGT: 365,
    distance_to_renewable_plant: 126,
    distance_to_waste_heat: 109,
    direct_normal_irradiation_kWh_m2: 1911,
    PVOUT_kWh_kWp: 1779,
    in_protected_area: 0
  },
  {
    GRID_ID: "852c900fbffffff",
    ZONE_CODE: 20,
    distance_to_storage: 20,
    distance_to_power_lines: 55,
    distance_to_master_gas_system: 332,
    mean_temperature_Aug_2023: 39,
    dew_point_humidity: 9,
    geothermal_favorability: 1,
    distance_to_hot_springs: 978,
    distance_to_desal_plants: 245,
    distance_to_CCGT: 413,
    distance_to_renewable_plant: 146,
    distance_to_waste_heat: 133,
    direct_normal_irradiation_kWh_m2: 1939,
    PVOUT_kWh_kWp: 1791,
    in_protected_area: 1
  },
  {
    GRID_ID: "852c900dbffffff",
    ZONE_CODE: 21,
    distance_to_storage: 21,
    distance_to_power_lines: 23,
    distance_to_master_gas_system: 298,
    mean_temperature_Aug_2023: 38,
    dew_point_humidity: 7,
    geothermal_favorability: 0,
    distance_to_hot_springs: 884,
    distance_to_desal_plants: 135,
    distance_to_CCGT: 284,
    distance_to_renewable_plant: 29,
    distance_to_waste_heat: 67,
    direct_normal_irradiation_kWh_m2: 1895,
    PVOUT_kWh_kWp: 1774,
    in_protected_area: 0
  }
];

// Convert H3 hex IDs to GeoJSON polygons for mapping
export const getHexPolygons = (): GeoJSON.FeatureCollection => {
  const features = hexData.map(hex => {
    const center = h3.cellToLatLng(hex.GRID_ID);
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
  });

  return {
    type: 'FeatureCollection',
    features
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
  if (hexData.length === 0) return [0, 1];
  
  const values = hexData.map(hex => hex[metric]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return [min, max];
};

// Configuration for each metric
export const metricConfigs: Record<MetricKey, MetricConfig> = {
  ZONE_CODE: {
    name: 'Zone Code',
    key: 'ZONE_CODE',
    description: 'The code identifying the zone',
    unit: 'ID',
    colorScale: [
      { value: 1, color: '#0d47a1' },
      { value: 21, color: '#2196f3' }
    ],
    format: (value) => value.toString()
  },
  distance_to_storage: {
    name: 'Distance to Storage',
    key: 'distance_to_storage',
    description: 'Distance to nearest storage facility',
    unit: 'km',
    colorScale: [
      { value: 0, color: '#4caf50' },
      { value: 12, color: '#f44336' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_power_lines: {
    name: 'Distance to Power Lines',
    key: 'distance_to_power_lines',
    description: 'Distance to nearest power lines',
    unit: 'km',
    colorScale: [
      { value: 0, color: '#4caf50' },
      { value: 55, color: '#f44336' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_master_gas_system: {
    name: 'Distance to Gas System',
    key: 'distance_to_master_gas_system',
    description: 'Distance to nearest master gas system',
    unit: 'km',
    colorScale: [
      { value: 190, color: '#4caf50' },
      { value: 332, color: '#f44336' }
    ],
    format: (value) => `${value} km`
  },
  mean_temperature_Aug_2023: {
    name: 'Mean Temperature (Aug 2023)',
    key: 'mean_temperature_Aug_2023',
    description: 'Average temperature recorded in August 2023',
    unit: '°C',
    colorScale: [
      { value: 38, color: '#90caf9' },
      { value: 39, color: '#f44336' }
    ],
    format: (value) => `${value}°C`
  },
  dew_point_humidity: {
    name: 'Dew Point Humidity',
    key: 'dew_point_humidity',
    description: 'Dew point humidity measurement',
    unit: '%',
    colorScale: [
      { value: 7, color: '#b2ebf2' },
      { value: 9, color: '#00796b' }
    ],
    format: (value) => `${value}%`
  },
  geothermal_favorability: {
    name: 'Geothermal Favorability',
    key: 'geothermal_favorability',
    description: 'Rating of geothermal favorability',
    unit: 'score',
    colorScale: [
      { value: 0, color: '#ffebee' },
      { value: 1, color: '#c62828' }
    ],
    format: (value) => value.toString()
  },
  distance_to_hot_springs: {
    name: 'Distance to Hot Springs',
    key: 'distance_to_hot_springs',
    description: 'Distance to nearest hot springs',
    unit: 'km',
    colorScale: [
      { value: 884, color: '#4caf50' },
      { value: 978, color: '#f44336' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_desal_plants: {
    name: 'Distance to Desalination Plants',
    key: 'distance_to_desal_plants',
    description: 'Distance to nearest desalination plants',
    unit: 'km',
    colorScale: [
      { value: 135, color: '#4caf50' },
      { value: 245, color: '#f44336' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_CCGT: {
    name: 'Distance to CCGT',
    key: 'distance_to_CCGT',
    description: 'Distance to nearest combined cycle gas turbine',
    unit: 'km',
    colorScale: [
      { value: 284, color: '#4caf50' },
      { value: 413, color: '#f44336' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_renewable_plant: {
    name: 'Distance to Renewable Plant',
    key: 'distance_to_renewable_plant',
    description: 'Distance to nearest renewable energy plant',
    unit: 'km',
    colorScale: [
      { value: 29, color: '#4caf50' },
      { value: 146, color: '#f44336' }
    ],
    format: (value) => `${value} km`
  },
  distance_to_waste_heat: {
    name: 'Distance to Waste Heat',
    key: 'distance_to_waste_heat',
    description: 'Distance to nearest waste heat source',
    unit: 'km',
    colorScale: [
      { value: 67, color: '#4caf50' },
      { value: 133, color: '#f44336' }
    ],
    format: (value) => `${value} km`
  },
  direct_normal_irradiation_kWh_m2: {
    name: 'Direct Normal Irradiation',
    key: 'direct_normal_irradiation_kWh_m2',
    description: 'Direct normal irradiation measurement',
    unit: 'kWh/m²',
    colorScale: [
      { value: 1895, color: '#ffeb3b' },
      { value: 1939, color: '#ff9800' }
    ],
    format: (value) => `${value} kWh/m²`
  },
  PVOUT_kWh_kWp: {
    name: 'PVOUT',
    key: 'PVOUT_kWh_kWp',
    description: 'Photovoltaic power output',
    unit: 'kWh/kWp',
    colorScale: [
      { value: 1774, color: '#ffeb3b' },
      { value: 1791, color: '#ff9800' }
    ],
    format: (value) => `${value} kWh/kWp`
  },
  in_protected_area: {
    name: 'Protected Area',
    key: 'in_protected_area',
    description: 'Whether the area is protected (1) or not (0)',
    unit: '',
    colorScale: [
      { value: 0, color: '#4caf50' },
      { value: 1, color: '#f44336' }
    ],
    format: (value) => value === 0 ? 'No' : 'Yes'
  }
};
