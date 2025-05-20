
import { HexagonData } from '@/types/hex';

// Sample data as a fallback
export const sampleHexData: HexagonData[] = [
  { GRID_ID: "852c9043fffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, LDAC_combined: 4.6 },
  { GRID_ID: "852c9047fffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, LDAC_combined: 4.6 },
  { GRID_ID: "852c904bfffffff", LDAC_suitability_elec: 4.2, LDAC_suitability_gas: 0, LDAC_combined: 4.2 },
  { GRID_ID: "852c904ffffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, LDAC_combined: 4.6 },
  { GRID_ID: "852c9053fffffff", LDAC_suitability_elec: 4.6, LDAC_suitability_gas: 0, LDAC_combined: 4.6 },
  { GRID_ID: "855215d3fffffff", LDAC_suitability_elec: 2.6, LDAC_suitability_gas: 2.2, LDAC_combined: 4.8 },
  { GRID_ID: "855215dbfffffff", LDAC_suitability_elec: 2.2, LDAC_suitability_gas: 1.8, LDAC_combined: 4.0 },
  { GRID_ID: "855221a7fffffff", LDAC_suitability_elec: 2, LDAC_suitability_gas: 0, LDAC_combined: 2.0 }
];

// This will store loaded data
export let hexData: HexagonData[] = [];

/**
 * Function to load hexagon data from CSV
 */
export const loadHexagonDataFromCSV = async (): Promise<HexagonData[]> => {
  try {
    console.log("Attempting to load CSV from /data/hexagon_data.csv");
    // Fetch the CSV file from public folder
    const response = await fetch('/data/hexagon_data.csv');
    
    if (!response.ok) {
      console.error(`Failed to load CSV: ${response.status} ${response.statusText}`);
      console.log("Using sample data as fallback");
      hexData = sampleHexData;
      return sampleHexData;
    }
    
    const csvText = await response.text();
    console.log("CSV loaded successfully, first 100 chars:", csvText.substring(0, 100));
    const parsedData = parseCSV(csvText);
    
    // Store the data in the module-level variable
    hexData = parsedData;
    console.log(`Loaded ${parsedData.length} hexagon records with combined LDAC values`);
    
    // Log the first record to verify structure
    if (parsedData.length > 0) {
      console.log("Sample record:", JSON.stringify(parsedData[0]));
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error loading hexagon data from CSV:', error);
    // Return sample data as fallback
    console.log("Using sample data as fallback due to error");
    hexData = sampleHexData;
    return sampleHexData;
  }
};

/**
 * Helper function to parse CSV text into HexagonData objects
 */
export const parseCSV = (csvText: string): HexagonData[] => {
  const lines = csvText.split('\n');
  if (lines.length < 2) {
    console.error("CSV file appears to be empty or invalid");
    return sampleHexData;
  }
  
  const headers = lines[0].split(',').map(header => header.trim());
  console.log("CSV headers:", headers);
  
  // Find column indices for our data
  const gridIdIndex = headers.findIndex(h => h.toLowerCase() === 'grid_id');
  const elecIndex = headers.findIndex(h => h.toLowerCase() === 'ldac_suitability_elec');
  const gasIndex = headers.findIndex(h => h.toLowerCase() === 'ldac_suitability_gas');
  const combinedIndex = headers.findIndex(h => 
    h.toLowerCase() === 'ldac_combined' || h.toLowerCase() === 'ldac combined'
  );
  
  console.log("Column indices:", { 
    gridIdIndex, 
    elecIndex, 
    gasIndex, 
    combinedIndex, 
    headers: headers.join(', ') 
  });
  
  const dataRows = lines.slice(1).filter(line => line.trim() !== '');
  console.log(`Found ${dataRows.length} data rows in CSV`);
  
  return dataRows.map((line, index) => {
    const values = line.split(',').map(value => value.trim());
    const data: any = {};
    
    // Get GRID_ID
    if (gridIdIndex >= 0 && gridIdIndex < values.length) {
      data['GRID_ID'] = values[gridIdIndex];
    } else {
      console.warn(`Missing GRID_ID in row ${index + 2}`);
      data['GRID_ID'] = `unknown-${index}`;
    }
    
    // Get electric suitability
    if (elecIndex >= 0 && elecIndex < values.length) {
      data['LDAC_suitability_elec'] = parseFloat(values[elecIndex]) || 0;
    } else {
      data['LDAC_suitability_elec'] = 0;
    }
    
    // Get gas suitability
    if (gasIndex >= 0 && gasIndex < values.length) {
      data['LDAC_suitability_gas'] = parseFloat(values[gasIndex]) || 0;
    } else {
      data['LDAC_suitability_gas'] = 0;
    }
    
    // Get combined value - either from the CSV or calculate it
    if (combinedIndex >= 0 && combinedIndex < values.length) {
      data['LDAC_combined'] = parseFloat(values[combinedIndex]) || 0;
      console.log(`Row ${index}: Combined from CSV = ${data['LDAC_combined']}`);
    } else {
      // Calculate combined if not in CSV
      data['LDAC_combined'] = Number(
        (data['LDAC_suitability_elec'] + data['LDAC_suitability_gas']).toFixed(1)
      );
      console.log(`Row ${index}: Calculated combined = ${data['LDAC_combined']}`);
    }
    
    return data as HexagonData;
  });
};

// Find min/max values for a specific metric in the dataset
export const findMinMaxValues = (metric: string): [number, number] => {
  // Use the loaded data if available, otherwise use sample data
  const dataToUse = hexData.length > 0 ? hexData : sampleHexData;
  
  if (dataToUse.length === 0) return [0, 5];
  
  const values = dataToUse.map(hex => hex[metric as keyof HexagonData] as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return [min, max];
};
