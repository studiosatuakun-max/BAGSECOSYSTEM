'use client';

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data12m = [
  { month: 'Agu', pendapatan: 820, pengeluaran: 310 },
  { month: 'Sep', pendapatan: 950, pengeluaran: 345 },
  { month: 'Okt', pendapatan: 870, pengeluaran: 390 },
  { month: 'Nov', pendapatan: 1040, pengeluaran: 360 },
  { month: 'Des', pendapatan: 1280, pengeluaran: 420 },
  { month: 'Jan', pendapatan: 760, pengeluaran: 380 },
  { month: 'Feb', pendapatan: 890, pengeluaran: 310 },
  { month: 'Mar', pendapatan: 1120, pengeluaran: 350 },
  { month: 'Apr', pendapatan: 980, pengeluaran: 410 },
  { month: 'Mei', pendapatan: 1150, pengeluaran: 395 },
  { month: 'Jun', pendapatan: 1050, pengeluaran: 430 },
  { month: 'Jul', pendapatan: 1248, pengeluaran: 450 },
];

const data6m = data12m.slice(6);

const dataYtd = data12m.slice(5);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const net = (payload[0]?.value || 0) - (payload[1]?.value || 0);
  return (
    <div className="bg-card border border-border rounded-xl p-3 card-shadow-md text-sm min-w-[160px]">
      <p className="font-700 text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={`tip-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground font-500 text-xs">{entry.name}</span>
          </div>
          <span className="font-700 tabular-nums text-foreground text-xs">
            Rp {entry.value.toLocaleString('id-ID')} Jt
          </span>
        </div>
      ))}
      <div className="border-t border-border mt-2 pt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-500">Net</span>
        <span className={`text-xs font-700 tabular-nums ${net >= 0 ? 'text-positive' : 'text-negative'}`}>
          Rp {net.toLocaleString('id-ID')} Jt
        </span>
      </div>
    </div>
  );
}

interface CashFlowChartProps {
  period: string;
}

export default function CashFlowChart({ period }: CashFlowChartProps) {
  const data = period === '6m' ? data6m : period === 'ytd' ? dataYtd : data12m;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.12} />
            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          dy={6}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
          width={38}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1.5 }} />
        <Line
          type="monotone"
          dataKey="pendapatan"
          name="Pendapatan"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: 'var(--primary)', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--card)' }}
        />
        <Line
          type="monotone"
          dataKey="pengeluaran"
          name="Pengeluaran"
          stroke="var(--accent)"
          strokeWidth={2.5}
          strokeDasharray="5 3"
          dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: 'var(--accent)', strokeWidth: 2, stroke: 'var(--card)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}