'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import { attendanceTrend } from '@/lib/mockData';
import { UserCheck } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-elevated px-3 py-2 text-xs">
        <p className="font-600 text-foreground mb-1">{label}</p>
        {payload.map((p) => (
          <p key={`tip-${p.name}`} className="text-muted-foreground">{p.name}: <span className="font-600 text-foreground">{p.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AttendanceCard() {
  return (
    <div className="card-elevated rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
            <UserCheck size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-600 text-foreground">Attendance Overview</h3>
            <p className="text-[10px] text-muted-foreground">This week</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-700 tabular-nums text-emerald-600">90.0%</p>
          <p className="text-[10px] text-muted-foreground">rate today</p>
        </div>
      </div>

      <div className="flex gap-3 text-xs">
        <div className="flex-1 bg-emerald-50 rounded-xl p-3 text-center">
          <p className="text-lg font-700 tabular-nums text-emerald-700">181</p>
          <p className="text-[10px] text-emerald-600 font-500">Present</p>
        </div>
        <div className="flex-1 bg-rose-50 rounded-xl p-3 text-center">
          <p className="text-lg font-700 tabular-nums text-rose-700">10</p>
          <p className="text-[10px] text-rose-600 font-500">Absent</p>
        </div>
        <div className="flex-1 bg-amber-50 rounded-xl p-3 text-center">
          <p className="text-lg font-700 tabular-nums text-amber-700">10</p>
          <p className="text-[10px] text-amber-600 font-500">On Leave</p>
        </div>
      </div>

      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={attendanceTrend} barGap={2}>
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="present" radius={[3, 3, 0, 0]} name="Present">
              {attendanceTrend.map((entry) => (
                <Cell
                  key={`att-${entry.day}`}
                  fill={entry.day === 'Today' ? 'var(--primary)' : 'var(--accent)'}
                  opacity={entry.day === 'Today' ? 1 : 0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}