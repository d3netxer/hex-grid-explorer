
import { useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface WfsInteractionsProps {
  map: mapboxgl.Map | null;
}

const WfsInteractions: React.FC<WfsInteractionsProps> = ({ map }) => {
  
  const createWfsPopup = useCallback((feature: mapboxgl.MapboxGeoJSONFeature, lngLat: mapboxgl.LngLat) => {
    const properties = feature.properties || {};
    
    // Create popup content based on available properties
    let popupContent = '<div class="p-3">';
    popupContent += '<h3 class="text-lg font-bold mb-2 text-orange-600">Gas Infrastructure</h3>';
    
    // Display relevant properties
    Object.entries(properties).forEach(([key, value]) => {
      if (value && key !== 'OBJECTID' && key !== 'Shape' && key !== 'GlobalID') {
        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        popupContent += `<div class="mb-1"><strong>${displayKey}:</strong> ${value}</div>`;
      }
    });
    
    popupContent += '</div>';
    
    new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: '300px'
    })
      .setLngLat(lngLat)
      .setHTML(popupContent)
      .addTo(map!);
  }, [map]);

  const setupWfsInteractions = useCallback(() => {
    if (!map) return;
    
    const layerIds = ['gas-pipelines', 'gas-facilities', 'gas-areas'];
    const eventHandlers: Array<{ layerId: string; clickHandler: any; mouseEnterHandler: any; mouseLeaveHandler: any }> = [];
    
    layerIds.forEach(layerId => {
      // Only add interactions if layer exists
      if (map.getLayer(layerId)) {
        // Create handler functions
        const handleClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            createWfsPopup(feature, e.lngLat);
          }
        };

        const handleMouseEnter = () => {
          map.getCanvas().style.cursor = 'pointer';
        };

        const handleMouseLeave = () => {
          map.getCanvas().style.cursor = '';
        };

        // Store handlers for cleanup
        eventHandlers.push({
          layerId,
          clickHandler: handleClick,
          mouseEnterHandler: handleMouseEnter,
          mouseLeaveHandler: handleMouseLeave
        });

        // Add event listeners
        map.on('click', layerId, handleClick);
        map.on('mouseenter', layerId, handleMouseEnter);
        map.on('mouseleave', layerId, handleMouseLeave);
      }
    });

    // Return cleanup function
    return () => {
      eventHandlers.forEach(({ layerId, clickHandler, mouseEnterHandler, mouseLeaveHandler }) => {
        if (map.getLayer(layerId)) {
          map.off('click', layerId, clickHandler);
          map.off('mouseenter', layerId, mouseEnterHandler);
          map.off('mouseleave', layerId, mouseLeaveHandler);
        }
      });
    };
  }, [map, createWfsPopup]);

  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    
    // Wait for WFS layers to be loaded
    const timer = setTimeout(() => {
      const cleanup = setupWfsInteractions();
      return cleanup;
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [map, setupWfsInteractions]);

  return null;
};

export default WfsInteractions;
