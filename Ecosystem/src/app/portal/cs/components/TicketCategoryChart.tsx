'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Ticket, ShieldAlert } from 'lucide-react';

const categoryData = [
  { category: 'Skid Delivery & Milk-Run Delay', count: 18, avgSla: '12m', color: '#F59E0B' },
  { category: 'Custody Transfer & Metering', count: 12, avgSla: '45m', color: '#3B82F6' },
  { category: 'PRMS Pressure Drop Alarm', count: 8, avgSla: '5m', color: '#EF4444' },
  { category: 'SIO ATEX Driver Route Query', count: 7, avgSla: '15m', color: '#10B981' },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof categoryData[0] }[] }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl px-4 py-3 text-xs min-w-[180px]">
        <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
          <p className="font-extrabold text-slate-900 dark:text-white">{d.category}</p>
        </div>
        <div className="flex justify-between items-center my-1 text-slate-600 dark:text-slate-400 font-medium">
          <span>Active Tickets:</span>
          <span className="font-bold text-slate-900 dark:text-white tabular-nums">{d.count} tiket</span>
        </div>
        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
          <span>Avg SLA Response:</span>
          <span className="font-black text-amber-600 dark:text-amber-400 tabular-nums">{d.avgSla}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function TicketCategoryChart() {
  const totalTickets = categoryData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col justify-between h-full transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              CNG Issue Category &amp; SLA Telemetry
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {totalTickets} Live Tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Klasifikasi kendala pengiriman Skid Tank, alarm tekanan PRMS, dan verifikasi meter bongkar muat · Q3 2026
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
          <ShieldAlert size={12} className="text-amber-600 dark:text-amber-400" />
          <span>SLA Compliance: 98.2%</span>
        </div>
      </div>

      <div className="h-56 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }} barGap={4}>
            <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              width={160}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#cbd5e1', opacity: 0.1, radius: 8 }} />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
              {categoryData.map((entry, index) => (
                <Cell key={`cs-cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
        {categoryData.map((item) => (
          <div key={item.category} className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-black tabular-nums text-slate-900 dark:text-white">{item.count} Tiket</span>
            </div>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase truncate">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
