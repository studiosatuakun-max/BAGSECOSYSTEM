'use client';
import React from 'react';
import { BarChart2, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const weekData = [
  { day: 'Mon', consumption: 142 },
  { day: 'Tue', consumption: 158 },
  { day: 'Wed', consumption: 135 },
  { day: 'Thu', consumption: 171 },
  { day: 'Fri', consumption: 163 },
  { day: 'Sat', consumption: 89 },
  { day: 'Sun', consumption: 74 },
];

const today = new Date().getDay(); // 0=Sun, 1=Mon...
const dayIndex = today === 0 ? 6 : today - 1; // map to Mon=0 index

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-elevated text-xs">
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="text-blue-700 font-bold mt-0.5">{payload[0].value} kg</p>
      </div>
    );
  }
  return null;
}

export default function ConsumptionTrendCard() {
  const total = weekData.reduce((s, d) => s + d.consumption, 0);
  const avg = Math.round(total / weekData.length);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50">
            <BarChart2 size={17} className="text-blue-800" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Consumption Trend</h3>
            <p className="text-xs text-slate-500 mt-0.5">Daily gas usage · Last 7 days</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1">
          <TrendingDown size={11} className="text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">−8% vs last week</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-slate-500">Weekly Total</p>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">{total} <span className="text-xs font-normal text-slate-500">kg</span></p>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div>
          <p className="text-xs text-slate-500">Daily Avg</p>
          <p className="text-xl font-extrabold text-slate-900 tabular-nums">{avg} <span className="text-xs font-normal text-slate-500">kg/day</span></p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex-1 min-h-0" style={{ height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekData} barSize={22} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'var(--font-plus-jakarta-sans)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#cbd5e1', fontFamily: 'var(--font-plus-jakarta-sans)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', radius: 6 }} />
            <Bar dataKey="consumption" radius={[6, 6, 0, 0]}>
              {weekData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === dayIndex ? '#1e3a8a' : '#bfdbfe'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
