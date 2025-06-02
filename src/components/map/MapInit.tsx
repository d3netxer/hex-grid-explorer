
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapInitProps {
  mapboxToken: string;
  onMapLoad: (map: mapboxgl.Map) => void;
}

const MapInit: React.FC<MapInitProps> = ({ mapboxToken, onMapLoad }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapContainer.current) return;

    console.log("Initializing map");
    
    // Set Mapbox access token
    mapboxgl.accessToken = mapboxToken;
    
    // Initialize the map centered on Saudi Arabia
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [45.079162, 23.885942], // Saudi Arabia coordinates
      zoom: 4.5,
      pitch: 0,
    });

    // Add navigation controls
    mapInstance.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Wait for map to load
    mapInstance.on('load', () => {
      console.log("Map loaded, adding WMS and WFS layers");
      
      // Add KAPSARC WMS layer
      mapInstance.addSource('kapsarc-gas', {
        type: 'raster',
        tiles: [
          'https://webgis.kapsarc.org/server/rest/services/Master_Gas_KSA/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&f=image&format=png24&transparent=true'
        ],
        tileSize: 256,
        attribution: 'KAPSARC Gas Infrastructure'
      });

      mapInstance.addLayer({
        id: 'kapsarc-gas-layer',
        type: 'raster',
        source: 'kapsarc-gas',
        paint: {
          'raster-opacity': 0.7
        }
      });

      // Add WFS data source for gas infrastructure features
      const loadWFSData = async () => {
        try {
          console.log("Loading WFS gas infrastructure data");
          
          // Request GeoJSON from WFS service
          const wfsUrl = 'https://webgis.kapsarc.org/server/services/Hosted/MasterGasSystem_WFS/MapServer/WFSServer?service=WFS&version=1.1.0&request=GetFeature&typeName=MasterGasSystem_WFS:Gas_Infrastructure&outputFormat=application/json&srsName=EPSG:4326';
          
          const response = await fetch(wfsUrl);
          const geoJsonData = await response.json();
          
          console.log("WFS data loaded:", geoJsonData);
          
          // Add WFS source
          mapInstance.addSource('gas-infrastructure', {
            type: 'geojson',
            data: geoJsonData
          });

          // Add pipelines layer (lines)
          mapInstance.addLayer({
            id: 'gas-pipelines',
            type: 'line',
            source: 'gas-infrastructure',
            filter: ['==', '$type', 'LineString'],
            paint: {
              'line-color': '#ff6b35',
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4, 1,
                10, 3,
                15, 5
              ],
              'line-opacity': 0.8
            }
          });

          // Add facilities layer (points)
          mapInstance.addLayer({
            id: 'gas-facilities',
            type: 'circle',
            source: 'gas-infrastructure',
            filter: ['==', '$type', 'Point'],
            paint: {
              'circle-color': '#ff6b35',
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4, 2,
                10, 6,
                15, 10
              ],
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 1,
              'circle-opacity': 0.9
            }
          });

          // Add areas layer (polygons)
          mapInstance.addLayer({
            id: 'gas-areas',
            type: 'fill',
            source: 'gas-infrastructure',
            filter: ['==', '$type', 'Polygon'],
            paint: {
              'fill-color': '#ff6b35',
              'fill-opacity': 0.3,
              'fill-outline-color': '#ff6b35'
            }
          });

          console.log("WFS layers added successfully");
          
        } catch (error) {
          console.error("Error loading WFS data:", error);
          // Fallback: try alternative endpoint or show error message
        }
      };

      // Load WFS data
      loadWFSData();

      console.log("WMS layer added");
      onMapLoad(mapInstance);
    });

    return () => {
      console.log("Removing map");
      mapInstance.remove();
    };
  }, [mapboxToken, onMapLoad]);

  return (
    <div 
      ref={mapContainer} 
      className="map-container h-full" 
      style={{position: 'absolute', top: 0, bottom: 0, width: '100%'}} 
    />
  );
};

export default MapInit;
