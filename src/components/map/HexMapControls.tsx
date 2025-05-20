
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Map } from 'lucide-react';
import { MetricKey } from '@/types/hex';
import { metricConfigs, findMinMaxValues } from '@/utils/hexUtils';

interface HexMapControlsProps {
  selectedMetric: MetricKey;
  onMetricChange: (value: MetricKey) => void;
  filterValue: [number, number] | null;
  onFilterChange: (value: [number, number]) => void;
  resetFilters: () => void;
}

const HexMapControls: React.FC<HexMapControlsProps> = ({
  selectedMetric,
  onMetricChange,
  filterValue,
  onFilterChange,
  resetFilters
}) => {
  return (
    <div className="absolute top-4 left-4 z-10 w-72 bg-opacity-90 animate-fade-in">
      <Card className="bg-card/90 backdrop-blur-sm border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Map className="h-5 w-5" />
            <h2 className="text-lg font-bold">LDAC Suitability Explorer</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="metric-select">Select Metric</Label>
              <Select 
                value={selectedMetric} 
                onValueChange={(value) => onMetricChange(value as MetricKey)}
              >
                <SelectTrigger id="metric-select" className="w-full">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(metricConfigs).map((key) => (
                    <SelectItem key={key} value={key}>
                      {metricConfigs[key as MetricKey].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {metricConfigs[selectedMetric].description}
              </p>
            </div>

            <div>
              <Label>
                Filter Range {filterValue ? `(${filterValue[0].toFixed(1)} - ${filterValue[1].toFixed(1)})` : ''}
              </Label>
              <Slider
                defaultValue={[0, 5]}
                min={0}
                max={5}
                step={0.1}
                value={filterValue || [0, 5]}
                onValueChange={(value) => onFilterChange(value as [number, number])}
                className="mt-2"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">0</span>
                <span className="text-xs text-muted-foreground">5</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
                className="w-full mt-2"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HexMapControls;
