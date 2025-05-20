
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { metricConfigs } from '@/utils/metricConfig';
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
        <div className="flex flex-col gap-1">
          {config.colorScale.map((stop, index) => {
            // Skip transparent value in legend visual representation
            if (stop.color === 'transparent') return null;
            
            return (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded" 
                  style={{ backgroundColor: stop.color }}
                />
                <span className="text-xs">
                  {stop.value === 0.5 ? '< 1' : 
                   stop.value === 5 ? '≥ 5' : 
                   `≥ ${stop.value}`}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{config.unit}</p>
        <p className="text-xs text-muted-foreground">Transparent = No data (0)</p>
      </CardContent>
    </Card>
  );
};

export default HexLegend;
