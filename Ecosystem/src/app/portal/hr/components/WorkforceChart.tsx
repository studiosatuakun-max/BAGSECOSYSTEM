'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Users, TrendingUp } from 'lucide-react';

const departmentStats = [
  { department: 'Skid Fleet & Drivers (ATEX)', headcount: 148, performanceAvg: '94.1', color: '#8B5CF6' },
  { department: 'Mother Station Operations', headcount: 124, performanceAvg: '92.4', color: '#6366F1' },
  { department: 'Horeca & Industrial Sales (AE)', headcount: 46, performanceAvg: '88.5', color: '#EC4899' },
  { department: 'Engineering & PRMS SCADA', headcount: 38, performanceAvg: '91.2', color: '#06B6D4' },
  { department: 'Corporate Finance & HR', headcount: 32, performanceAvg: '89.0', color: '#10B981' },
  { department: 'QHSE & MIGAS Compliance', headcount: 24, performanceAvg: '95.0', color: '#F59E0B' },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof departmentStats[0] }[] }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl px-4 py-3 text-xs min-w-[180px]">
        <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
          <p className="font-extrabold text-slate-900 dark:text-white">{d.department}</p>
        </div>
        <div className="flex justify-between items-center my-1 text-slate-600 dark:text-slate-400 font-medium">
          <span>Headcount Crew:</span>
          <span className="font-bold text-slate-900 dark:text-white tabular-nums">{d.headcount} org</span>
        </div>
        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
          <span>Avg KPI Score:</span>
          <span className="font-black text-purple-600 dark:text-purple-400 tabular-nums">{d.performanceAvg}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function WorkforceChart() {
  const totalEmployees = departmentStats.reduce((acc, curr) => acc + curr.headcount, 0);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col justify-between h-full transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              CNG Workforce &amp; Crew Distribution
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {totalEmployees} Staff &amp; Crew
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Sebaran personel operasional Mother Station, pengemudi Skid ATEX, dan tim korporat · Q3 2026
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
          <TrendingUp size={12} className="text-purple-600 dark:text-purple-400" />
          <span>Avg KPI: 91.7</span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-center flex-1 my-2">
        <div className="w-full xl:w-64 h-64 shrink-0 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="35%"
              outerRadius="95%"
              barSize={10}
              data={departmentStats}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="headcount"
                background={{ fill: 'rgba(148, 163, 184, 0.15)' }}
                cornerRadius={10}
              >
                {departmentStats.map((entry, index) => (
                  <Cell key={`cell-dept-${index}`} fill={entry.color} />
                ))}
              </RadialBar>
              <Tooltip content={<CustomTooltip />} cursor={false} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <Users size={20} className="text-purple-600 dark:text-purple-400 mb-1" />
            <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
              {totalEmployees}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">
              Pegawai
            </span>
          </div>
        </div>

        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {departmentStats.map((dept) => (
            <div
              key={`dept-row-${dept.department}`}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: dept.color }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {dept.department}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {dept.headcount} personel aktif
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-black tabular-nums text-purple-600 dark:text-purple-400">
                  {dept.performanceAvg}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">KPI Score</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}