
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { HexagonData, MetricKey } from '@/types/hex';
import { metricConfigs } from '@/utils/hexUtils';

interface HexagonPopupProps {
  feature: mapboxgl.MapboxGeoJSONFeature;
  lngLat: mapboxgl.LngLat;
  map: mapboxgl.Map;
  selectedMetric: MetricKey;
}

export const createHexagonPopup = (props: HexagonPopupProps) => {
  const { feature, lngLat, map, selectedMetric } = props;
  const hexagonData = feature.properties as HexagonData;

  // Create popup HTML content
  const popupContent = `
    <div>
      <h3 class="text-lg font-bold">Hexagon Data</h3>
      <p class="text-sm">${hexagonData.GRID_ID}</p>
      <div class="mt-2">
        <strong>${metricConfigs[selectedMetric].name}:</strong> 
        ${metricConfigs[selectedMetric].format(hexagonData[selectedMetric])}
      </div>
    </div>
  `;

  // Create and add popup
  new mapboxgl.Popup()
    .setLngLat(lngLat)
    .setHTML(popupContent)
    .addTo(map);
};

export default createHexagonPopup;
