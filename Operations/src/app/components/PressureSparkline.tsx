'use client';
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

interface DataPoint {
  id: string;
  t: string;
  v: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-card px-2 py-1.5">
      <span className="text-xs font-700 text-blue-600 tabular-nums">{payload[0].value.toFixed(2)} Bar</span>
    </div>
  );
}

export default function PressureSparkline({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id="pressureSparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke="#60a5fa"
          strokeWidth={1.5}
          fill="url(#pressureSparkGrad)"
          dot={false}
          activeDot={{ r: 3, fill: '#60a5fa', strokeWidth: 1.5, stroke: '#fff' }}
        />
        <Tooltip content={<CustomTooltip />} />
      </AreaChart>
    </ResponsiveContainer>
  );
}