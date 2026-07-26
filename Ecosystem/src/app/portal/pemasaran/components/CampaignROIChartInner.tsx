'use client';
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

// Backend integration point: GET /api/campaigns/roi-monthly
const roiData = [
  { month: 'Jan', spend: 48000000, conversions: 112000000, roi: 133 },
  { month: 'Feb', spend: 52000000, conversions: 128000000, roi: 146 },
  { month: 'Mar', spend: 61000000, conversions: 165000000, roi: 171 },
  { month: 'Apr', spend: 55000000, conversions: 130000000, roi: 136 },
  { month: 'May', spend: 70000000, conversions: 195000000, roi: 179 },
  { month: 'Jun', spend: 66000000, conversions: 172000000, roi: 161 },
  { month: 'Jul', spend: 74000000, conversions: 214000000, roi: 189 },
];

function formatIDR(value: number) {
  if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`;
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(0)}Jt`;
  return `Rp ${value.toLocaleString('id-ID')}`;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const roiEntry = roiData.find((d) => d.month === label);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs shadow-2xl min-w-[190px]">
      <p className="font-extrabold text-slate-900 dark:text-white mb-2 pb-1 border-b border-slate-100 dark:border-slate-800">
        {label} 2026 Pipeline
      </p>
      {payload.map((entry) => (
        <div
          key={`tooltip-row-${entry.name}`}
          className="flex items-center justify-between gap-4 mb-1.5 font-medium"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-600 dark:text-slate-400">
              {entry.name}
            </span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">
            {formatIDR(entry.value)}
          </span>
        </div>
      ))}
      {roiEntry && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">Net ROI</span>
          <span
            className={`font-black text-sm tabular-nums ${
              roiEntry.roi >= 160 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {roiEntry.roi}%
          </span>
        </div>
      )}
    </div>
  );
}

export default function CampaignROIChartInner() {
  const [activeBar, setActiveBar] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col justify-between h-full transition-all duration-300">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              B2B Marketing ROI &amp; Conversion Value
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Investasi akuisisi prospek CNG vs Nilai Kontrak SLA bulanan · Jan–Jul 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <TrendingUp size={12} />
              <span>Avg ROI 159%</span>
            </div>
          </div>
        </div>

        {/* ROI pill row */}
        <div className="flex items-center gap-1.5 flex-wrap mb-6 mt-4">
          {roiData.map((d) => {
            const isHigh = d.roi >= 170;
            const isMed = d.roi >= 150 && d.roi < 170;
            return (
              <span
                key={`roi-pill-${d.month}`}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tabular-nums border transition-colors ${
                  isHigh
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : isMed
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                }`}
              >
                {d.month}: {d.roi}%
              </span>
            );
          })}
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={roiData}
              barCategoryGap="25%"
              barGap={4}
              onMouseLeave={() => setActiveBar(null)}
            >
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity={1} />
                  <stop offset="100%" stopColor="#BE185D" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="convGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#6D28D9" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000000).toFixed(0)}Jt`}
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#cbd5e1', opacity: 0.15, radius: 6 }} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '0.75rem', paddingTop: '16px', fontWeight: 600 }}
              />
              <Bar
                dataKey="spend"
                name="CNG Ad Spend"
                fill="url(#spendGradient)"
                radius={[6, 6, 0, 0]}
                onMouseEnter={(_, index) => setActiveBar(`spend-${index}`)}
              >
                {roiData.map((entry, index) => (
                  <Cell
                    key={`spend-cell-${entry.month}`}
                    opacity={activeBar && activeBar !== `spend-${index}` ? 0.55 : 1}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="conversions"
                name="SLA Contract Value"
                fill="url(#convGradient)"
                radius={[6, 6, 0, 0]}
                onMouseEnter={(_, index) => setActiveBar(`conv-${index}`)}
              >
                {roiData.map((entry, index) => (
                  <Cell
                    key={`conv-cell-${entry.month}`}
                    opacity={activeBar && activeBar !== `conv-${index}` ? 0.55 : 1}
                  />
                ))}
              </Bar>
              <ReferenceLine
                y={100000000}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{
                  value: 'Target SLA',
                  position: 'insideTopRight',
                  fontSize: 10,
                  fill: '#64748b',
                  fontWeight: 600,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}