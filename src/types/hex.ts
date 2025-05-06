
export interface HexagonData {
  GRID_ID: string;
  ZONE_CODE: number;
  distance_to_storage: number;
  distance_to_power_lines: number;
  distance_to_master_gas_system: number;
  mean_temperature_Aug_2023: number;
  dew_point_humidity: number;
  geothermal_favorability: number;
  distance_to_hot_springs: number;
  distance_to_desal_plants: number;
  distance_to_CCGT: number;
  distance_to_renewable_plant: number;
  distance_to_waste_heat: number;
  direct_normal_irradiation_kWh_m2: number;
  PVOUT_kWh_kWp: number;
  in_protected_area: number;
}

export type MetricKey = keyof Omit<HexagonData, 'GRID_ID'>;

export interface ColorStop {
  value: number;
  color: string;
}

export interface MetricConfig {
  name: string;
  key: MetricKey;
  description: string;
  unit: string;
  colorScale: ColorStop[];
  format: (value: number) => string;
}
