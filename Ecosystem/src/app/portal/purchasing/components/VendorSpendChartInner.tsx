'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

interface SpendPoint {
  month: string;
  rawGas: number;
  spareParts: number;
  total: number;
  variance: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill?: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const rawGasVal = payload.find((p) => p.name === 'rawGas')?.value || 0;
  const partsVal = payload.find((p) => p.name === 'spareParts')?.value || 0;
  const totalVal = rawGasVal + partsVal;

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl px-3.5 py-2.5 text-xs">
      <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 mb-1.5">{label} 2026 Spend Breakdown</p>
      <div className="space-y-1 font-bold">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Raw Gas Supply (PGN):</span>
          </span>
          <span className="font-black text-slate-900 dark:text-white tabular-nums">Rp {rawGasVal.toLocaleString('id-ID')} Juta</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span>Skid Tubes &amp; ATEX Parts:</span>
          </span>
          <span className="font-black text-slate-900 dark:text-white tabular-nums">Rp {partsVal.toLocaleString('id-ID')} Juta</span>
        </div>
        <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 font-black text-indigo-600 dark:text-indigo-400">
          <span>Total Procurement:</span>
          <span className="tabular-nums">Rp {(totalVal / 1000).toFixed(2)} Miliar</span>
        </div>
      </div>
    </div>
  );
}

export default function VendorSpendChartInner({ data }: { data: SpendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} barCategoryGap="22%">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `Rp${v / 1000}M`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.5 }} />
        <Bar dataKey="rawGas" name="rawGas" stackId="spend" fill="#10b981" radius={[0, 0, 0, 0]} barSize={26}>
          {data.map((_, index) => (
            <Cell key={`cell-raw-${index}`} fill="#10b981" opacity={0.9} />
          ))}
        </Bar>
        <Bar dataKey="spareParts" name="spareParts" stackId="spend" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={26}>
          {data.map((_, index) => (
            <Cell key={`cell-parts-${index}`} fill="#0d9488" opacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
