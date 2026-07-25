'use client';
import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,  } from 'recharts';

interface TelemetryPoint {
  id: string;
  time: string;
  shortTime: string;
  flow: number;
  pressure: number;
}

interface Props {
  data: TelemetryPoint[];
}

interface CustomTooltipPayload {
  name: string;
  value: number;
  color: string;
  unit?: string;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      className="bg-white border border-border rounded-xl shadow-elevated px-3 py-2.5 min-w-[140px]"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
    >
      <p className="text-xs font-700 text-foreground mb-2 tabular-nums">{label}</p>
      {payload.map((entry) => (
        <div key={`tt-${entry.name}`} className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-muted-foreground font-medium">{entry.name}</span>
          </div>
          <span className="text-xs font-700 text-foreground tabular-nums">
            {typeof entry.value === 'number' && entry.name === 'Pressure'
              ? entry.value.toFixed(2)
              : entry.value}
            <span className="text-muted-foreground font-normal ml-0.5">
              {entry.name === 'Flow' ? ' kg/h' : ' Bar'}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TelemetryLineCharts({ data }: Props) {
  // Show every 4th tick label to avoid crowding
  const tickIndices = new Set([0, 4, 8, 12, 16, 19]);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.18} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="shortTime"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-plus-jakarta-sans)' }}
          tickLine={false}
          axisLine={false}
          interval={3}
        />
        <YAxis
          yAxisId="flow"
          orientation="left"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-plus-jakarta-sans)' }}
          tickLine={false}
          axisLine={false}
          domain={[130, 165]}
          tickFormatter={(v: number) => `${v}`}
          width={36}
        />
        <YAxis
          yAxisId="pressure"
          orientation="right"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-plus-jakarta-sans)' }}
          tickLine={false}
          axisLine={false}
          domain={[4.5, 5.2]}
          tickFormatter={(v: number) => v.toFixed(1)}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          yAxisId="flow"
          type="monotone"
          dataKey="flow"
          name="Flow"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#flowGradient)"
          dot={false}
          activeDot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }}
        />
        <Line
          yAxisId="pressure"
          type="monotone"
          dataKey="pressure"
          name="Pressure"
          stroke="#60a5fa"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#60a5fa', strokeWidth: 2, stroke: '#fff' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}