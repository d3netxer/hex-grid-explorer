
import mapboxgl from 'mapbox-gl';
import { getHexPolygons } from './hexUtils';

export const fitMapToHexagons = (map: mapboxgl.Map | null) => {
  if (!map) return;
  
  try {
    const hexPolygons = getHexPolygons();
    if (hexPolygons.features.length === 0) {
      console.log("No hexagon features to fit map to");
      return;
    }
    
    console.log("Fitting map to hexagons...");
    
    // Calculate bounds from all hexagon features
    const bounds = new mapboxgl.LngLatBounds();
    
    hexPolygons.features.forEach(feature => {
      // Type check to ensure we're using Polygon type features
      if (feature.geometry.type === 'Polygon') {
        // Now TypeScript knows this is a Polygon geometry
        const polygonCoords = feature.geometry.coordinates;
        if (polygonCoords && polygonCoords[0]) {
          polygonCoords[0].forEach((coord) => {
            bounds.extend(coord as mapboxgl.LngLatLike);
          });
        }
      }
    });
    
    if (!bounds.isEmpty()) {
      // Fit map to these bounds with some padding
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12,
        duration: 1000
      });
      
      console.log("Map fitted to hexagon bounds");
    } else {
      console.log("Could not calculate bounds - no valid coordinates");
    }
  } catch (error) {
    console.error("Error fitting map to hexagons:", error);
  }
};
