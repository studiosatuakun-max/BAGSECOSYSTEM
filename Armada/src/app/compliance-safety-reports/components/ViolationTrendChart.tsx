'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { violationsByWeek } from '@/data/mockData';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const total = payload.reduce((sum, p) => sum + p.value, 0);
  return (
    <div className="bg-card border border-border rounded-xl shadow-card-hover px-4 py-3 text-sm">
      <p className="font-600 text-foreground mb-2">{label} — {total} total violations</p>
      {payload.map((entry) => (
        <div key={`vtip-${entry.name}`} className="flex items-center gap-2 text-xs mb-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-600 text-foreground tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ViolationTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={violationsByWeek} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
        <Bar dataKey="geofence" name="Geofence Breach" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
        <Bar dataKey="sop" name="SOP Violation" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
        <Bar dataKey="speeding" name="Speeding" stackId="a" fill="#EAB308" radius={[0, 0, 0, 0]} />
        <Bar dataKey="unauthorized" name="Unauthorized Stop" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}