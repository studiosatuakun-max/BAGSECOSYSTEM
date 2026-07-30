'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type TimeRange = '1M' | 'Q3' | 'YTD' | '1Y';

const revenueDatasets: Record<TimeRange, Array<{ period: string; actual: number; target: number; lastYear: number }>> = {
  '1M': [
    { period: 'Week 1', actual: 1.1, target: 1.2, lastYear: 0.9 },
    { period: 'Week 2', actual: 1.35, target: 1.25, lastYear: 1.05 },
    { period: 'Week 3', actual: 1.42, target: 1.3, lastYear: 1.15 },
    { period: 'Week 4', actual: 1.68, target: 1.35, lastYear: 1.2 },
  ],
  'Q3': [
    { period: 'Jul', actual: 5.55, target: 5.1, lastYear: 4.3 },
    { period: 'Aug (Est)', actual: 5.8, target: 5.4, lastYear: 4.6 },
    { period: 'Sep (Est)', actual: 6.2, target: 5.7, lastYear: 4.9 },
  ],
  'YTD': [
    { period: 'Jan', actual: 4.8, target: 4.5, lastYear: 3.9 },
    { period: 'Feb', actual: 4.9, target: 4.6, lastYear: 4.0 },
    { period: 'Mar', actual: 5.2, target: 4.8, lastYear: 4.2 },
    { period: 'Apr', actual: 5.1, target: 4.9, lastYear: 4.1 },
    { period: 'May', actual: 5.4, target: 5.0, lastYear: 4.3 },
    { period: 'Jun', actual: 5.6, target: 5.1, lastYear: 4.4 },
    { period: 'Jul', actual: 5.55, target: 5.1, lastYear: 4.3 },
  ],
  '1Y': [
    { period: 'Q3 25', actual: 13.5, target: 13.0, lastYear: 11.2 },
    { period: 'Q4 25', actual: 14.8, target: 14.0, lastYear: 12.5 },
    { period: 'Q1 26', actual: 14.9, target: 13.9, lastYear: 12.1 },
    { period: 'Q2 26', actual: 16.1, target: 15.0, lastYear: 12.8 },
  ],
};

const sectorDistribution = [
  { name: 'Manufaktur & Otomotif', value: 40, color: '#4f46e5', volume: '18,080 MMBTU', region: 'Karawang & Cikarang' },
  { name: 'F&B & Farmasi', value: 35, color: '#06b6d4', volume: '15,820 MMBTU', region: 'SIER Surabaya & Pasuruan' },
  { name: 'Petrokimia & Kimia', value: 15, color: '#10b981', volume: '6,780 MMBTU', region: 'JIIPE Gresik' },
  { name: 'Keramik & Kertas', value: 10, color: '#f59e0b', volume: '4,520 MMBTU', region: 'Ngoro Industrial Park' },
];

export default function IndustrialChartsClient() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Area Chart */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
              <span>Analisa Komparasi Revenue vs Target KPI</span>
              <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 whitespace-nowrap shrink-0">
                Triliun Rupiah (IDR)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Perbandingan performa aktual terhadap target Direksi dan pencapaian tahun lalu.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto shrink-0">
            {(['1M', 'Q3', 'YTD', '1Y'] as TimeRange[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeRange(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                  timeRange === tab
                    ? 'bg-indigo-600 text-white shadow-sm scale-[1.02]'
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
            <AreaChart data={revenueDatasets[timeRange]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `Rp${val}T`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '12px 16px'
                }}
                formatter={(value: number, name: string) => [
                  `Rp ${value.toFixed(2)} Triliun`,
                  name === 'actual' ? 'Realisasi Aktual' : name === 'target' ? 'Target KPI' : 'Tahun Lalu (YoY)'
                ]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
              <Area type="monotone" dataKey="actual" name="Realisasi Aktual" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="target" name="Target KPI" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorTarget)" />
              <Area type="monotone" dataKey="lastYear" name="Tahun Lalu (YoY)" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Pie Chart */}
      <div className="col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Komposisi Sektor &amp; Kawasan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Distribusi kuota suplai B2B Jawa Timur &amp; Jakarta.
          </p>
        </div>

        <div className="h-44 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorDistribution}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={5}
                dataKey="value"
              >
                {sectorDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                formatter={(val: number, name: string, props: any) => [`${val}% (${props.payload.volume})`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {sectorDistribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-slate-700 dark:text-slate-300 truncate" title={item.name}>{item.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono">
                <span className="text-slate-400 text-[10px]">{item.region.split(' ')[0]}</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
