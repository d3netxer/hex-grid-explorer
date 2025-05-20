
import React from 'react';
import { HexagonData } from '@/types/hex';

interface HexMapInfoPanelProps {
  selectedHexagon: HexagonData | null;
}

const HexMapInfoPanel: React.FC<HexMapInfoPanelProps> = ({ selectedHexagon }) => {
  if (!selectedHexagon) return null;

  return (
    <div className="mt-4 p-3 bg-secondary/50 rounded-md">
      <h3 className="text-sm font-bold mb-1">Selected Hexagon</h3>
      <p className="text-xs">ID: {selectedHexagon.GRID_ID}</p>
      <div className="mt-1">
        <p className="text-xs">
          <strong>Electric Suitability:</strong> {selectedHexagon.LDAC_suitability_elec.toFixed(1)}
        </p>
        <p className="text-xs">
          <strong>Gas Suitability:</strong> {selectedHexagon.LDAC_suitability_gas.toFixed(1)}
        </p>
        <p className="text-xs">
          <strong>Combined Suitability:</strong> {selectedHexagon.LDAC_combined.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default HexMapInfoPanel;
