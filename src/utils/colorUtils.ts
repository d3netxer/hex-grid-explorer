
import { ColorStop } from '@/types/hex';

// Get color for a specific value based on the color scale
export const getColorForValue = (value: number, colorScale: ColorStop[]): string => {
  // Special handling for zero values to ensure transparency
  if (value === 0 || value === null || value === undefined) {
    return 'transparent';
  }
  
  // Return early if there aren't enough color stops
  if (colorScale.length < 2) {
    return colorScale[0]?.color || '#000000';
  }
  
  // Sort color stops by value (low to high)
  const sortedStops = [...colorScale].filter(stop => stop.color !== 'transparent')
    .sort((a, b) => a.value - b.value);
  
  // If value is less than the first stop
  if (value <= sortedStops[0].value) {
    return sortedStops[0].color;
  }
  
  // If value is greater than the last stop
  if (value >= sortedStops[sortedStops.length - 1].value) {
    return sortedStops[sortedStops.length - 1].color;
  }
  
  // Find the color stops between which the value falls
  for (let i = 0; i < sortedStops.length - 1; i++) {
    const currentStop = sortedStops[i];
    const nextStop = sortedStops[i + 1];
    
    if (value >= currentStop.value && value <= nextStop.value) {
      // For exact matches, just return the color
      if (value === currentStop.value) return currentStop.color;
      if (value === nextStop.value) return nextStop.color;
      
      // Calculate interpolation factor
      const range = nextStop.value - currentStop.value;
      const factor = range !== 0 ? (value - currentStop.value) / range : 0;
      
      // Parse colors - handle both hex and rgba
      if (currentStop.color.startsWith('#') && nextStop.color.startsWith('#')) {
        // Interpolate hex colors
        const fromRGB = hexToRgb(currentStop.color);
        const toRGB = hexToRgb(nextStop.color);
        
        const r = Math.round(fromRGB.r + factor * (toRGB.r - fromRGB.r));
        const g = Math.round(fromRGB.g + factor * (toRGB.g - fromRGB.g));
        const b = Math.round(fromRGB.b + factor * (toRGB.b - fromRGB.b));
        
        return rgbToHex(r, g, b);
      } else {
        // Just return the current stop color for other formats
        return currentStop.color;
      }
    }
  }
  
  // Default fallback
  return sortedStops[0].color;
};

// Helper function to convert hex to RGB
export const hexToRgb = (hex: string) => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Handle shorthand hex (#rgb)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Helper function to convert RGB to hex
export const rgbToHex = (r: number, g: number, b: number) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};
