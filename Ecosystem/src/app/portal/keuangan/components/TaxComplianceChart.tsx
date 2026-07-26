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
  hex: string;
}

interface TaxComplianceChartProps {
  overall: number;
  data: TaxItem[];
}

export default function TaxComplianceChart({ overall, data }: TaxComplianceChartProps) {
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
    fill: item.hex || '#10b981',
  }));

  return (
    <div className="relative w-[180px] h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="35%"
          outerRadius="95%"
          barSize={9}
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            background={{ fill: '#334155', opacity: 0.2 }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-black tabular-nums text-slate-900 dark:text-white tracking-tight">{overall}%</span>
        <span className="text-[10px] text-amber-500 dark:text-amber-400 font-extrabold uppercase tracking-widest">MIGAS Tax</span>
      </div>
    </div>
  );
}