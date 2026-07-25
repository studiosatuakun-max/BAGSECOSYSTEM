'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

interface DataPoint {
  day: string;
  consumption: number;
  date: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-card-md px-3 py-2.5">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      <p className="text-sm font-bold text-accent font-tabular">{payload[0].value} m³</p>
    </div>
  );
}

export default function ConsumptionBarChartInner({ data }: { data: DataPoint[] }) {
  const maxVal = Math.max(...data.map((d) => d.consumption));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-plus-jakarta-sans)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-plus-jakarta-sans)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.5, radius: 6 }} />
        <Bar dataKey="consumption" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`bar-${index}`}
              fill={entry.consumption === maxVal ? 'var(--primary)' : 'var(--accent)'}
              opacity={entry.consumption === maxVal ? 1 : 0.65}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}