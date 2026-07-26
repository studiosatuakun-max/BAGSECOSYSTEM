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
  const mmbtu = Math.round(payload[0].value * 0.0357 * 10) / 10;
  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl px-3.5 py-2.5">
      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{payload[0].value.toLocaleString('id-ID')} Sm³</p>
      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">≈ {mmbtu} MMBTU Equivalent</p>
    </div>
  );
}

export default function ConsumptionBarChartInner({ data }: { data: DataPoint[] }) {
  const maxVal = Math.max(...data.map((d) => d.consumption));

  return (
    <ResponsiveContainer width="100%" height={170}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.5 }} />
        <Bar dataKey="consumption" radius={[6, 6, 0, 0]} barSize={24}>
          {data.map((entry, index) => (
            <Cell
              key={`bar-${index}`}
              fill={entry.consumption === maxVal ? '#6366f1' : '#3b82f6'}
              opacity={entry.consumption === maxVal ? 1 : 0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}