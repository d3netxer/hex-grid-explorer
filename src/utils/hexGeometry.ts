
import * as h3 from 'h3-js';
import { GeoJSON } from 'geojson';
import { HexagonData } from '@/types/hex';
import { hexData, sampleHexData } from './hexData';

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
