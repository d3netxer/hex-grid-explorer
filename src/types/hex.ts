
export interface HexagonData {
  GRID_ID: string;
  LDAC_suitability_elec: number;
  LDAC_suitability_gas: number;
  heating_demand: number; // Added new metric
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
