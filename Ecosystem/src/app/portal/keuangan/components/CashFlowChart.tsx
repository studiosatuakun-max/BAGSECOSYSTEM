'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data12m = [
  { month: 'Agu', pendapatan: 820, pengeluaran: 310, mmbtu: 14200 },
  { month: 'Sep', pendapatan: 950, pengeluaran: 345, mmbtu: 15800 },
  { month: 'Okt', pendapatan: 870, pengeluaran: 390, mmbtu: 14900 },
  { month: 'Nov', pendapatan: 1040, pengeluaran: 360, mmbtu: 16500 },
  { month: 'Des', pendapatan: 1280, pengeluaran: 420, mmbtu: 18200 },
  { month: 'Jan', pendapatan: 760, pengeluaran: 380, mmbtu: 13500 },
  { month: 'Feb', pendapatan: 890, pengeluaran: 310, mmbtu: 15100 },
  { month: 'Mar', pendapatan: 1120, pengeluaran: 350, mmbtu: 17200 },
  { month: 'Apr', pendapatan: 980, pengeluaran: 410, mmbtu: 16100 },
  { month: 'Mei', pendapatan: 1150, pengeluaran: 395, mmbtu: 17800 },
  { month: 'Jun', pendapatan: 1050, pengeluaran: 430, mmbtu: 16900 },
  { month: 'Jul', pendapatan: 1248, pengeluaran: 450, mmbtu: 19450 },
];

const data6m = data12m.slice(6);
const dataYtd = data12m.slice(5);
const dataQ3 = data12m.slice(9);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; payload: any }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const net = (payload[0]?.value || 0) - (payload[1]?.value || 0);
  const mmbtu = payload[0]?.payload?.mmbtu || 0;

  return (
    <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-xs text-white min-w-[200px] space-y-2.5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-extrabold text-amber-400 uppercase tracking-wider">{label} 2026</span>
        <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full">
          {mmbtu.toLocaleString('id-ID')} MMBTU
        </span>
      </div>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={`tip-${entry.name}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-300 font-semibold">{entry.name}</span>
            </div>
            <span className="font-black tabular-nums text-white">
              Rp {entry.value.toLocaleString('id-ID')} Jt
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800 pt-2 flex items-center justify-between font-black">
        <span className="text-slate-400">Net Cash Flow</span>
        <span className={net >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
          {net >= 0 ? '+' : ''}Rp {net.toLocaleString('id-ID')} Jt
        </span>
      </div>
    </div>
  );
}

interface CashFlowChartProps {
  period: string;
}

export default function CashFlowChart({ period }: CashFlowChartProps) {
  const data = period === '6m' ? data6m : period === 'ytd' ? dataYtd : period === 'q3' ? dataQ3 : data12m;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#334155" strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `Rp ${v}`}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
        <Area
          type="monotone"
          dataKey="pendapatan"
          name="Pendapatan CNG"
          stroke="#10b981"
          strokeWidth={3}
          fill="url(#gradRevenue)"
          activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="pengeluaran"
          name="Biaya Ops Mother Station"
          stroke="#f59e0b"
          strokeWidth={3}
          fill="url(#gradExpense)"
          activeDot={{ r: 6, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}