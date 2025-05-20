
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
  const metricValue = hexagonData[selectedMetric];

  // Create popup HTML content
  const popupContent = `
    <div class="p-3">
      <h3 class="text-lg font-bold mb-1">Hexagon ${hexagonData.GRID_ID}</h3>
      <div class="mt-2 flex flex-col gap-1">
        <div><strong>${metricConfigs[selectedMetric].name}:</strong> 
          ${metricConfigs[selectedMetric].format(metricValue)}
        </div>
        <div class="text-xs text-muted-foreground">(${metricConfigs[selectedMetric].unit})</div>
      </div>
    </div>
  `;

  // Create and add popup
  new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true,
    maxWidth: '300px'
  })
    .setLngLat(lngLat)
    .setHTML(popupContent)
    .addTo(map);
};

export default createHexagonPopup;
