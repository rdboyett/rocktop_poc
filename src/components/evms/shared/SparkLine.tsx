import * as React from 'react';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

interface SparkLineProps {
  data: number[];
  width?: number;
  height?: number;
}

export default function SparkLine({ data, width = 100, height = 30 }: SparkLineProps) {
  const trend = data[data.length - 1] - data[0];
  const color = trend >= 0 ? '#22c55e' : '#ef4444';

  return (
    <SparkLineChart
      data={data}
      width={width}
      height={height}
      colors={[color]}
      showHighlight
      showTooltip
    />
  );
}
