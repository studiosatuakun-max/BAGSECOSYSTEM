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
  if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}B`;
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
    <div
      className="rounded-2xl border p-3.5 text-sm"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        minWidth: 180,
      }}
    >
      <p className="font-700 mb-2" style={{ fontWeight: 700, color: 'var(--foreground)' }}>
        {label} 2026
      </p>
      {payload.map((entry) => (
        <div
          key={`tooltip-row-${entry.name}`}
          className="flex items-center justify-between gap-4 mb-1"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>
              {entry.name}
            </span>
          </div>
          <span style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: '0.75rem' }}>
            {formatIDR(entry.value)}
          </span>
        </div>
      ))}
      {roiEntry && (
        <div
          className="mt-2 pt-2 border-t flex items-center justify-between"
          style={{ borderColor: 'var(--border)' }}
        >
          <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>ROI</span>
          <span
            className="font-700 tabular-nums"
            style={{
              fontWeight: 700,
              color: roiEntry.roi >= 160 ? '#16A34A' : '#D97706',
              fontSize: '0.875rem',
            }}
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
    <div
      className="rounded-2xl border p-6 h-full"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2
            className="text-base"
            style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '1rem' }}
          >
            Campaign Performance ROI
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Monthly ad spend vs revenue conversions · Jan–Jul 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-600"
            style={{
              backgroundColor: '#DCFCE7',
              color: '#166534',
              fontWeight: 600,
            }}
          >
            <TrendingUp size={12} />
            Avg ROI 159%
          </div>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
            aria-label="Chart info"
          >
            <Info size={14} />
          </button>
        </div>
      </div>

      {/* ROI pill row */}
      <div className="flex items-center gap-2 flex-wrap mb-5 mt-3">
        {roiData.map((d) => (
          <span
            key={`roi-pill-${d.month}`}
            className="px-2 py-0.5 rounded-full text-xs tabular-nums transition-colors"
            style={{
              backgroundColor: d.roi >= 170 ? '#DCFCE7' : d.roi >= 150 ? '#FEF9C3' : '#FEE2E2',
              color: d.roi >= 170 ? '#166534' : d.roi >= 150 ? '#854D0E' : '#991B1B',
              fontWeight: 600,
              cursor: 'default',
            }}
          >
            {d.month}: {d.roi}%
          </span>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={roiData}
          barCategoryGap="28%"
          barGap={4}
          onMouseLeave={() => setActiveBar(null)}
        >
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity={1} />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.85} />
            </linearGradient>
            <linearGradient id="convGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EA580C" stopOpacity={1} />
              <stop offset="100%" stopColor="#C2410C" stopOpacity={0.85} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${(v / 1000000).toFixed(0)}Jt`}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4, radius: 6 }} />
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{ fontSize: '0.75rem', paddingTop: '12px', color: 'var(--muted-foreground)' }}
          />
          <Bar
            dataKey="spend"
            name="Ad Spend"
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
            name="Conversions"
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
            stroke="var(--muted-foreground)"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{
              value: 'Target',
              position: 'insideTopRight',
              fontSize: 10,
              fill: 'var(--muted-foreground)',
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}