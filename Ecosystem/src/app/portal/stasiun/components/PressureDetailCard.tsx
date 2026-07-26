'use client';

import React, { useState, useEffect } from 'react';
import { Gauge, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import dynamic from 'next/dynamic';

const PressureSparkline = dynamic(
  () => import('./PressureSparkline'),
  { ssr: false, loading: () => <div className="w-full h-20 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" /> }
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
    const interval = setInterval(() => {
      setCurrent((p) => {
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
    <div className="h-full flex flex-col justify-between gap-5 p-6 rounded-3xl border transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-blue-500/50">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
            <Gauge size={20} className="text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">3-Stage Pressure Transmitter</h2>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">PT-101 · Outlet Header Line</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full border whitespace-nowrap shrink-0 align-middle shadow-2xs ${
            isNormal
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isNormal ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
          <span>{isNormal ? 'Nominal OK' : 'High Warn'}</span>
        </span>
      </div>

      {/* Big value */}
      <div className="flex items-end justify-between bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
        <div className="flex items-baseline gap-2">
          <span className="tabular-nums font-black leading-none text-4xl text-blue-600 dark:text-blue-400">
            {current?.toFixed(2)}
          </span>
          <span className="text-xl font-extrabold text-blue-500">Bar</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] uppercase font-extrabold text-slate-400">Variance Trend</span>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {trend === 'up' && <TrendingUp size={13} className="text-emerald-500" />}
            {trend === 'down' && <TrendingDown size={13} className="text-rose-500" />}
            {trend === 'flat' && <Minus size={13} className="text-slate-400" />}
            <span
              className={`text-xs font-bold ${
                trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : trend === 'down' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
              }`}
            >
              {trend === 'flat' ? 'Stable' : trend === 'up' ? '+0.02 Bar' : '-0.02 Bar'}
            </span>
          </div>
        </div>
      </div>

      {/* Gauge bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <span>{PRESSURE_MIN} Bar</span>
          <span className="text-amber-600 dark:text-amber-400">⚠ {PRESSURE_HIGH_WARN} Bar</span>
          <span>{PRESSURE_MAX_SAFE} Bar</span>
        </div>
        <div className="relative h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-700">
          <div
            className="h-full rounded-full transition-all duration-700 bg-blue-500 dark:bg-blue-400"
            style={{ width: `${pctOfMax}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
            style={{ left: `${((PRESSURE_HIGH_WARN - PRESSURE_MIN) / (PRESSURE_MAX_SAFE - PRESSURE_MIN)) * 100}%` }}
          />
        </div>
      </div>

      {/* Sparkline */}
      <div className="flex-1 min-h-[85px]">
        <PressureSparkline data={PRESSURE_HISTORY} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 py-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="text-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Min</div>
          <div className="tabular-nums text-xs font-black text-slate-900 dark:text-white mt-0.5">4.76 Bar</div>
        </div>
        <div className="text-center border-x border-slate-200 dark:border-slate-700">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Avg</div>
          <div className="tabular-nums text-xs font-black text-slate-900 dark:text-white mt-0.5">4.86 Bar</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Max</div>
          <div className="tabular-nums text-xs font-black text-slate-900 dark:text-white mt-0.5">4.95 Bar</div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>Range: 0–10 Bar ATEX</span>
        <span className="text-blue-500 dark:text-blue-400 font-extrabold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>4–20mA HART Output</span>
        </span>
      </div>
    </div>
  );
}