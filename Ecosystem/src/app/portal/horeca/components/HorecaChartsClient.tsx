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
    { period: 'Week 1', actual: 680, target: 700, lastYear: 550 },
    { period: 'Week 2', actual: 790, target: 750, lastYear: 620 },
    { period: 'Week 3', actual: 850, target: 800, lastYear: 690 },
    { period: 'Week 4', actual: 930, target: 850, lastYear: 740 },
  ],
  'Q3': [
    { period: 'Jul', actual: 3250, target: 3100, lastYear: 2600 },
    { period: 'Aug (Est)', actual: 3450, target: 3200, lastYear: 2750 },
    { period: 'Sep (Est)', actual: 3680, target: 3400, lastYear: 2900 },
  ],
  'YTD': [
    { period: 'Jan', actual: 2800, target: 2700, lastYear: 2300 },
    { period: 'Feb', actual: 2950, target: 2800, lastYear: 2400 },
    { period: 'Mar', actual: 3100, target: 2900, lastYear: 2500 },
    { period: 'Apr', actual: 3050, target: 2950, lastYear: 2450 },
    { period: 'May', actual: 3200, target: 3000, lastYear: 2550 },
    { period: 'Jun', actual: 3350, target: 3100, lastYear: 2650 },
    { period: 'Jul', actual: 3250, target: 3100, lastYear: 2600 },
  ],
  '1Y': [
    { period: 'Q3 25', actual: 8900, target: 8500, lastYear: 7200 },
    { period: 'Q4 25', actual: 9500, target: 9000, lastYear: 7800 },
    { period: 'Q1 26', actual: 9200, target: 8800, lastYear: 7500 },
    { period: 'Q2 26', actual: 9850, target: 9200, lastYear: 8100 },
  ],
};

const sectorDistribution = [
  { name: 'Restoran & Franchise', value: 40, color: '#f59e0b', volume: '185,000 Sm³', zone: 'Surabaya Pusat (Rute 01-04)' },
  { name: 'Hotel & Fine Dining', value: 35, color: '#10b981', volume: '162,000 Sm³', zone: 'Surabaya Barat & Darmo' },
  { name: 'Kafe & Bakery Chain', value: 15, color: '#3b82f6', volume: '69,500 Sm³', zone: 'Sidoarjo Hub & Malang' },
  { name: 'Komersial & Laundry', value: 10, color: '#8b5cf6', volume: '46,200 Sm³', zone: 'Gresik Kota & Sekitar' },
];

export default function HorecaChartsClient() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Area Chart */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
              <span>Analisa Komparasi Revenue CNG Komersial vs Target</span>
              <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 whitespace-nowrap shrink-0">
                Juta Rupiah (IDR)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Perbandingan performa penjualan gas CNG Horeca aktual terhadap target Direksi dan pencapaian tahun lalu.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto shrink-0">
            {(['1M', 'Q3', 'YTD', '1Y'] as TimeRange[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeRange(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                  timeRange === tab
                    ? 'bg-amber-600 text-white shadow-sm scale-[1.02]'
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
            <AreaChart data={revenueDatasets[timeRange]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActualHoreca" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorTargetHoreca" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickFormatter={(val) => `Rp${val}M`} />
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
                  `Rp ${value.toLocaleString()} Juta`,
                  name === 'actual' ? 'Realisasi Aktual CNG' : name === 'target' ? 'Target KPI' : 'Tahun Lalu (YoY)'
                ]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
              <Area type="monotone" dataKey="actual" name="Realisasi Aktual CNG" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorActualHoreca)" />
              <Area type="monotone" dataKey="target" name="Target KPI" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorTargetHoreca)" />
              <Area type="monotone" dataKey="lastYear" name="Tahun Lalu (YoY)" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Pie Chart */}
      <div className="col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Konsumsi Sektor &amp; Rute Milk-Run
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Distribusi kuota suplai CNG Cradle Racks &amp; Micro-bulk.
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
                <span className="text-slate-400 text-[10px]">{item.zone.split(' ')[0]}</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
