'use client';

import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';

const fleetDatasets: Record<string, { period: string; gasVolume: number; mileageKm: number; activeSkids: number }[]> = {
  Today: [
    { period: '06:00', gasVolume: 1250, mileageKm: 320, activeSkids: 28 },
    { period: '09:00', gasVolume: 3400, mileageKm: 850, activeSkids: 45 },
    { period: '12:00', gasVolume: 5100, mileageKm: 1240, activeSkids: 52 },
    { period: '15:00', gasVolume: 6800, mileageKm: 1680, activeSkids: 58 },
    { period: '18:00', gasVolume: 7900, mileageKm: 1950, activeSkids: 60 },
    { period: '21:00', gasVolume: 8450, mileageKm: 2120, activeSkids: 62 },
  ],
  '7D': [
    { period: 'Sen', gasVolume: 52400, mileageKm: 14200, activeSkids: 58 },
    { period: 'Sel', gasVolume: 58100, mileageKm: 15400, activeSkids: 62 },
    { period: 'Rab', gasVolume: 55300, mileageKm: 14800, activeSkids: 60 },
    { period: 'Kam', gasVolume: 61200, mileageKm: 16200, activeSkids: 64 },
    { period: 'Jum', gasVolume: 59800, mileageKm: 15900, activeSkids: 63 },
    { period: 'Sab', gasVolume: 48500, mileageKm: 13100, activeSkids: 52 },
    { period: 'Min', gasVolume: 42000, mileageKm: 11500, activeSkids: 46 },
  ],
  '1M': [
    { period: 'M1', gasVolume: 224000, mileageKm: 61000, activeSkids: 58 },
    { period: 'M2', gasVolume: 238000, mileageKm: 64500, activeSkids: 62 },
    { period: 'M3', gasVolume: 245000, mileageKm: 66200, activeSkids: 64 },
    { period: 'M4', gasVolume: 252000, mileageKm: 68000, activeSkids: 65 },
  ],
  Q3: [
    { period: 'Jul', gasVolume: 980000, mileageKm: 265000, activeSkids: 62 },
    { period: 'Ags', gasVolume: 1040000, mileageKm: 282000, activeSkids: 65 },
    { period: 'Sep', gasVolume: 1120000, mileageKm: 305000, activeSkids: 68 },
  ],
};

const routeZoneDistribution = [
  { name: 'Surabaya Industrial Estate (SIER)', volume: '3,850 MMBTU', value: 45, color: '#0284c7' },
  { name: 'Gresik Petrochemical Route', volume: '2,120 MMBTU', value: 25, color: '#3b82f6' },
  { name: 'Sidoarjo Commercial Hub', volume: '1,530 MMBTU', value: 18, color: '#6366f1' },
  { name: 'Mojokerto - Pasuruan Zone', volume: '950 MMBTU', value: 12, color: '#06b6d4' },
];

export default function FleetChartsClient() {
  const [timeRange, setTimeRange] = useState<'Today' | '7D' | '1M' | 'Q3'>('7D');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Area Chart */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                CNG Logistics &amp; Tube-Skid Dispatch Telemetry
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Perbandingan volume gas terkirim (MMBTU) vs total jarak tempuh armada milk-run (km).
            </p>
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700 self-start sm:self-auto">
            {(['Today', '7D', '1M', 'Q3'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeRange(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                  timeRange === tab
                    ? 'bg-cyan-600 text-white shadow-sm scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fleetDatasets[timeRange]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#06b6d4', fontWeight: 600 }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#3b82f6', fontWeight: 600 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', color: '#fff', fontSize: '12px', padding: '12px 16px' }}
                formatter={(value: number) => [`${Number(value).toLocaleString()}`, '']}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
              <Area yAxisId="left" type="monotone" dataKey="gasVolume" name="Volume Gas (MMBTU)" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorGas)" />
              <Area yAxisId="right" type="monotone" dataKey="mileageKm" name="Jarak Tempuh (km)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorKm)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right: Pie Chart */}
      <div className="col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg flex flex-col justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Distribusi Rute &amp; Kawasan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Alokasi sirkulasi Tube-Skid berdasarkan zona logistik.
          </p>
        </div>
        <div className="h-44 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={routeZoneDistribution}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={5}
                dataKey="value"
              >
                {routeZoneDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                formatter={(val: number, name: string) => [`${val}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {routeZoneDistribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-slate-700 dark:text-slate-300 truncate" title={item.name}>{item.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono">
                <span className="text-slate-400 text-[10px]">{item.volume.split(' ')[0]} MMBTU</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
