
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
        <div className="flex flex-col gap-1">
          {config.colorScale.map((stop, index) => (
            index > 0 && (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded" 
                  style={{ backgroundColor: stop.color }}
                />
                <span className="text-xs">
                  {index === 1 ? '≤ 1' : index === config.colorScale.length - 1 ? '≤ 5' : `≤ ${stop.value}`}
                </span>
              </div>
            )
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{config.unit}</p>
      </CardContent>
    </Card>
  );
};

export default HexLegend;
