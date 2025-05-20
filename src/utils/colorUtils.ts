
import { ColorStop } from '@/types/hex';

// Get color for a specific value based on the color scale
export const getColorForValue = (value: number, colorScale: ColorStop[]): string => {
  // Special handling for zero or null values to ensure transparency
  if (value === 0 || value === null || value === undefined) {
    // Find the transparent color stop or use default transparent
    const transparentStop = colorScale.find(stop => stop.color === 'transparent');
    return transparentStop ? transparentStop.color : 'transparent';
  }
  
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
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};
