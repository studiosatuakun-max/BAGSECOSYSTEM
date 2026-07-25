'use client';

import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';

interface TaxItem {
  id: string;
  label: string;
  value: number;
  status: string;
  color: string;
}

interface TaxComplianceChartProps {
  overall: number;
  data: TaxItem[];
}

export default function TaxComplianceChart({ overall, data }: TaxComplianceChartProps) {
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
    fill:
      item.value === 100
        ? 'var(--positive)'
        : item.value >= 90
        ? 'var(--primary)'
        : item.value >= 75
        ? 'var(--warning)'
        : 'var(--accent)',
  }));

  return (
    <div className="relative w-[160px] h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="90%"
          barSize={8}
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={4}
            background={{ fill: 'var(--secondary)' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-800 tabular-nums text-foreground">{overall}%</span>
        <span className="text-[10px] text-muted-foreground font-500">Overall</span>
      </div>
    </div>
  );
}