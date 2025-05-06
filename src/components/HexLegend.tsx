
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { metricConfigs } from '@/utils/hexUtils';
import { MetricKey } from '@/types/hex';

interface HexLegendProps {
  metric: MetricKey;
  min: number;
  max: number;
}

const HexLegend: React.FC<HexLegendProps> = ({ metric, min, max }) => {
  const config = metricConfigs[metric];

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border/50">
      <CardContent className="p-3">
        <h3 className="text-sm font-medium mb-2">{config.name}</h3>
        <div className="flex items-center gap-1">
          <div 
            className="h-4 w-24 rounded" 
            style={{
              background: `linear-gradient(to right, ${config.colorScale[0].color}, ${config.colorScale[1].color})`
            }}
          />
          <span className="text-xs ml-1">{min}</span>
          <span className="text-xs flex-1 text-right">{max}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{config.unit}</p>
      </CardContent>
    </Card>
  );
};

export default HexLegend;
