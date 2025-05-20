
import React, { useState, useEffect } from 'react';
import { MetricKey, HexagonData } from '@/types/hex';
import { loadHexagonDataFromCSV } from '@/utils/hexUtils';
import { toast } from "sonner";
import HexLegend from './HexLegend';
import MapboxGlMap from './map/MapboxGlMap';
import HexMapControls from './map/HexMapControls';
import HexMapInfoPanel from './map/HexMapInfoPanel';
import LoadingOverlay from './map/LoadingOverlay';

interface HexMapProps {
  mapboxToken: string;
}

const HexMap: React.FC<HexMapProps> = ({ mapboxToken }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('LDAC_suitability_elec');
  const [selectedHexagon, setSelectedHexagon] = useState<HexagonData | null>(null);
  const [filterValue, setFilterValue] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Load CSV data
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const data = await loadHexagonDataFromCSV();
        console.log("Data loaded in HexMap component:", data.length, "records");
        if (data.length > 0) {
          console.log("Sample data for metrics:", {
            elec: data[0].LDAC_suitability_elec,
            gas: data[0].LDAC_suitability_gas,
            combined: data[0].LDAC_combined
          });
        }
        setDataLoaded(true);
        toast.success(`Loaded ${data.length} hexagon data records`);
      } catch (error) {
        console.error("Failed to load hexagon data:", error);
        toast.error("Error loading hexagon data. Using sample data instead.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle metric selection change
  const handleMetricChange = (value: MetricKey) => {
    console.log(`Changing metric to: ${value}`);
    setSelectedMetric(value);
    setFilterValue(null); // Reset filter when changing metrics
  };

  // Handle filter change
  const handleFilterChange = (value: [number, number]) => {
    setFilterValue(value);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterValue(null);
  };

  // Handle hexagon selection
  const handleHexagonSelect = (hexagon: HexagonData) => {
    setSelectedHexagon(hexagon);
  };

  return (
    <div className="relative h-full w-full">
      {/* Map component */}
      <MapboxGlMap 
        mapboxToken={mapboxToken}
        selectedMetric={selectedMetric}
        filterValue={filterValue}
        onHexagonSelect={handleHexagonSelect}
        mapLoaded={mapLoaded}
        setMapLoaded={setMapLoaded}
      />

      {/* Loading indicator */}
      <LoadingOverlay isLoading={dataLoading} />

      {/* Controls panel */}
      <HexMapControls
        selectedMetric={selectedMetric}
        onMetricChange={handleMetricChange}
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        resetFilters={resetFilters}
      />

      {/* Selected hexagon info (added to controls panel) */}
      {selectedHexagon && (
        <div className="absolute top-[240px] left-4 z-10 w-72">
          <HexMapInfoPanel selectedHexagon={selectedHexagon} />
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-opacity-90 animate-fade-in">
        <HexLegend 
          metric={selectedMetric} 
          min={0} 
          max={5} 
        />
      </div>
    </div>
  );
};

export default HexMap;
