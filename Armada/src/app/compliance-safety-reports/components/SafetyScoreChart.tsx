'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { complianceScoreTrend } from '@/data/mockData';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const score = payload[0].value;
  return (
    <div className="bg-card border border-border rounded-xl shadow-card-hover px-4 py-3 text-sm">
      <p className="font-600 text-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2 text-xs">
        <span className={`font-700 tabular-nums text-base ${score >= 90 ? 'text-green-600' : score >= 85 ? 'text-primary' : 'text-amber-600'}`}>
          {score}%
        </span>
        <span className="text-muted-foreground">fleet safety score</span>
      </div>
    </div>
  );
}

export default function SafetyScoreChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={complianceScoreTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[80, 100]}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={90} stroke="#16A34A" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: '90% target', position: 'insideTopRight', fontSize: 10, fill: '#16A34A' }} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--card)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}