'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

const contractData = [
  { name: 'Active MIGAS & Custody SLAs', value: 85, color: '#4f46e5', desc: 'Kontrak aktif suplai gas MMBTU & B2B Industri' },
  { name: 'Under Legal & QHSE Review', value: 12, color: '#06b6d4', desc: 'Proses adendum harga gas & verifikasi alat ukur' },
  { name: 'Expiring Soon (< 30 Days)', value: 8, color: '#f59e0b', desc: 'Perpanjangan izin niaga migas & kalibrasi skid' },
  { name: 'Expired / Archived', value: 3, color: '#f43f5e', desc: 'Kontrak vendor armada lama yang telah diganti' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-slate-700/80 shadow-2xl text-xs space-y-1">
        <div className="flex items-center gap-2 font-black">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span>{data.name}</span>
        </div>
        <p className="text-slate-300 font-extrabold text-sm tracking-tight">{data.value} Contracts</p>
        <p className="text-[10px] text-slate-400 font-medium max-w-[200px] leading-normal">{data.desc}</p>
      </div>
    );
  }
  return null;
};

export default function ContractStatusChartInner() {
  const totalContracts = contractData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full h-full flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Donut Chart */}
      <div className="relative w-full sm:w-1/2 h-[220px] flex items-center justify-center shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={contractData}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={6}
              dataKey="value"
              stroke="none"
            >
              {contractData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{totalContracts}</span>
          <span className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">Total SLAs</span>
        </div>
      </div>

      {/* Legend & Breakdown Table */}
      <div className="w-full sm:w-1/2 space-y-2.5">
        {contractData.map((item, idx) => {
          const percentage = ((item.value / totalContracts) * 100).toFixed(1);
          return (
            <div
              key={`leg-${idx}`}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs transition-all hover:border-indigo-500/40 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-3 h-3 rounded-md shrink-0 shadow-2xs" style={{ backgroundColor: item.color }} />
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 dark:text-white truncate text-[11px]" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{percentage}% of Portfolio</p>
                </div>
              </div>
              <span className="font-black text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs tabular-nums shrink-0 ml-2">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
