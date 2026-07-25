'use client';
import React, { useState, useEffect } from 'react';
import { Gauge, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import dynamic from 'next/dynamic';

const PressureSparkline = dynamic(
  () => import('./PressureSparkline'),
  { ssr: false, loading: () => <div className="w-full h-20 animate-pulse bg-slate-100 rounded-lg" /> }
);

// 20 pressure readings
const PRESSURE_HISTORY = [
  { id: 'ps-0', t: '06:13', v: 4.80 },
  { id: 'ps-1', t: '06:13', v: 4.85 },
  { id: 'ps-2', t: '06:14', v: 4.77 },
  { id: 'ps-3', t: '06:14', v: 4.88 },
  { id: 'ps-4', t: '06:15', v: 4.92 },
  { id: 'ps-5', t: '06:15', v: 4.86 },
  { id: 'ps-6', t: '06:16', v: 4.76 },
  { id: 'ps-7', t: '06:16', v: 4.89 },
  { id: 'ps-8', t: '06:17', v: 4.95 },
  { id: 'ps-9', t: '06:17', v: 4.87 },
  { id: 'ps-10', t: '06:18', v: 4.84 },
  { id: 'ps-11', t: '06:18', v: 4.78 },
  { id: 'ps-12', t: '06:19', v: 4.86 },
  { id: 'ps-13', t: '06:19', v: 4.91 },
  { id: 'ps-14', t: '06:20', v: 4.89 },
  { id: 'ps-15', t: '06:20', v: 4.90 },
  { id: 'ps-16', t: '06:21', v: 4.87 },
  { id: 'ps-17', t: '06:21', v: 4.84 },
  { id: 'ps-18', t: '06:22', v: 4.86 },
  { id: 'ps-19', t: '06:23', v: 4.88 },
];

const PRESSURE_MIN = 3.5;
const PRESSURE_MAX_SAFE = 5.5;
const PRESSURE_HIGH_WARN = 5.2;

export default function PressureDetailCard() {
  const [current, setCurrent] = useState(4.88);
  const [prev, setPrev] = useState(4.86);

  useEffect(() => {
    // Backend integration point: replace with OPC-UA pressure transmitter subscription
    const interval = setInterval(() => {
      setCurrent(p => {
        setPrev(p);
        return parseFloat((4.8 + ((Date.now() / 8000) % 0.2))?.toFixed(2));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const trend = current > prev ? 'up' : current < prev ? 'down' : 'flat';
  const isNormal = current < PRESSURE_HIGH_WARN;
  const pctOfMax = Math.min(((current - PRESSURE_MIN) / (PRESSURE_MAX_SAFE - PRESSURE_MIN)) * 100, 100);

  return (
    <div className="card-elevated h-full flex flex-col gap-3 p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Gauge size={18} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-700 text-foreground leading-tight">Pressure Transmitter</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">PT-101 · Outlet Header</p>
          </div>
        </div>
        <span className={`text-xs font-700 px-2 py-0.5 rounded-full border ${
          isNormal
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          {isNormal ? 'Nominal' : 'High'}
        </span>
      </div>
      {/* Big value */}
      <div className="flex items-end gap-2">
        <span className="tabular-nums font-800 leading-none text-blue-600" style={{ fontSize: '2.5rem' }}>
          {current?.toFixed(2)}
        </span>
        <div className="flex flex-col gap-0.5 pb-1">
          <span className="text-sm font-700 text-slate-500">Bar</span>
          <div className="flex items-center gap-0.5">
            {trend === 'up' && <TrendingUp size={12} className="text-primary" />}
            {trend === 'down' && <TrendingDown size={12} className="text-rose-500" />}
            {trend === 'flat' && <Minus size={12} className="text-muted-foreground" />}
            <span className={`text-xs font-600 ${
              trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-rose-500' : 'text-muted-foreground'
            }`}>
              {trend === 'flat' ? 'Stable' : trend === 'up' ? '+0.02' : '-0.02'}
            </span>
          </div>
        </div>
      </div>
      {/* Gauge bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">{PRESSURE_MIN} Bar</span>
          <span className="text-amber-500 font-700">⚠ {PRESSURE_HIGH_WARN}</span>
          <span className="text-muted-foreground font-medium">{PRESSURE_MAX_SAFE} Bar</span>
        </div>
        <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 bg-blue-400"
            style={{ width: `${pctOfMax}%` }}
          />
          {/* High warn marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400"
            style={{ left: `${((PRESSURE_HIGH_WARN - PRESSURE_MIN) / (PRESSURE_MAX_SAFE - PRESSURE_MIN)) * 100}%` }}
          />
        </div>
      </div>
      {/* Sparkline */}
      <div className="flex-1 min-h-0">
        <PressureSparkline data={PRESSURE_HISTORY} />
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="text-center">
          <div className="text-xs text-muted-foreground font-medium">Min</div>
          <div className="tabular-nums text-xs font-700 text-foreground">4.76</div>
        </div>
        <div className="text-center border-x border-border">
          <div className="text-xs text-muted-foreground font-medium">Avg</div>
          <div className="tabular-nums text-xs font-700 text-foreground">4.86</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground font-medium">Max</div>
          <div className="tabular-nums text-xs font-700 text-foreground">4.95</div>
        </div>
      </div>
      {/* Footer */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">Range: 0–10 Bar</span>
        <span className="text-xs text-blue-500 font-600">4–20mA Output</span>
      </div>
    </div>
  );
}