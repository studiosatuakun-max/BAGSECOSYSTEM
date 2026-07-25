'use client';

import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from 'recharts';

interface DriverKPIChartProps {
  score: number;
}

export default function DriverKPIChart({ score }: DriverKPIChartProps) {
  const data = [
    { name: 'bg', value: 100, fill: 'var(--muted)' },
    { name: 'score', value: score, fill: 'var(--primary)' },
  ];

  const color = score >= 90 ? '#16A34A' : score >= 75 ? 'var(--primary)' : '#D97706';

  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={140} height={140}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          data={data}
          barSize={12}
        >
          <RadialBar dataKey="value" background={false} cornerRadius={6} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-700 tabular-nums" style={{ color }}>{score}%</span>
        <span className="text-[10px] font-500 text-muted-foreground mt-0.5">Avg KPI</span>
      </div>
    </div>
  );
}