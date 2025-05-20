
import { MetricKey, MetricConfig } from '@/types/hex';

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
