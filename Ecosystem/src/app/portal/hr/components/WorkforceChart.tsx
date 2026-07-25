'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, Cell,  } from 'recharts';
import { departmentStats } from '@/lib/mockData';

const COLORS = ['#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#3730A3', '#4338CA', '#5B21B6'];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof departmentStats[0] }[] }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-xl shadow-elevated px-4 py-3 text-xs">
        <p className="font-600 text-foreground mb-1">{d.department}</p>
        <p className="text-muted-foreground">Headcount: <span className="font-600 text-foreground tabular-nums">{d.headcount}</span></p>
        <p className="text-muted-foreground">Avg Performance: <span className="font-600 text-foreground tabular-nums">{d.performanceAvg}</span></p>
      </div>
    );
  }
  return null;
};

export default function WorkforceChart() {
  return (
    <div className="card-elevated rounded-2xl p-6 h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-600 text-foreground">Workforce Distribution</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Headcount &amp; performance average by department</p>
        </div>
        <span className="text-[10px] font-500 text-muted-foreground bg-muted rounded-lg px-2 py-1">Jul 2026</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="w-full lg:w-64 h-64 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="25%"
              outerRadius="90%"
              data={departmentStats}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="headcount"
                background={{ fill: 'var(--muted)' }}
                cornerRadius={4}
              >
                {departmentStats.map((entry, index) => (
                  <Cell key={`cell-dept-${entry.department}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </RadialBar>
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
          {departmentStats.map((dept, index) => (
            <div key={`dept-row-${dept.department}`} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-muted/60 transition-colors">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-500 text-foreground truncate">{dept.department}</p>
                <p className="text-[10px] text-muted-foreground">{dept.headcount} employees</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-700 tabular-nums text-foreground">{dept.performanceAvg}</p>
                <p className="text-[10px] text-muted-foreground">avg score</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}