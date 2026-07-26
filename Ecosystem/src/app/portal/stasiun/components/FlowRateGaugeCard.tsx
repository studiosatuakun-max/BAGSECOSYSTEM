'use client';

import React, { useState, useEffect } from 'react';
import { Waves, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import dynamic from 'next/dynamic';

const FlowRadialChart = dynamic(
  () => import('./FlowRadialChart'),
  { ssr: false, loading: () => <div className="w-full h-28 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" /> }
);

const FLOW_SETPOINT = 150;
const FLOW_MAX = 200;
const FLOW_MIN_SAFE = 100;

const FLOW_HISTORY = [
  { id: 'fl-0', t: '06:13', v: 142 },
  { id: 'fl-1', t: '06:13', v: 144 },
  { id: 'fl-2', t: '06:14', v: 141 },
  { id: 'fl-3', t: '06:14', v: 146 },
  { id: 'fl-4', t: '06:15', v: 148 },
  { id: 'fl-5', t: '06:15', v: 145 },
  { id: 'fl-6', t: '06:16', v: 140 },
  { id: 'fl-7', t: '06:16', v: 147 },
  { id: 'fl-8', t: '06:17', v: 150 },
  { id: 'fl-9', t: '06:17', v: 146 },
  { id: 'fl-10', t: '06:18', v: 144 },
  { id: 'fl-11', t: '06:18', v: 141 },
  { id: 'fl-12', t: '06:19', v: 145 },
  { id: 'fl-13', t: '06:19', v: 149 },
  { id: 'fl-14', t: '06:20', v: 147 },
  { id: 'fl-15', t: '06:20', v: 148 },
  { id: 'fl-16', t: '06:21', v: 145 },
  { id: 'fl-17', t: '06:21', v: 144 },
  { id: 'fl-18', t: '06:22', v: 146 },
  { id: 'fl-19', t: '06:23', v: 147 },
];

export default function FlowRateGaugeCard() {
  const [current, setCurrent] = useState(147);
  const [prev, setPrev] = useState(146);
  const [totalToday, setTotalToday] = useState(1842.6);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((p) => {
        setPrev(p);
        const newVal = parseFloat((142 + ((Date.now() / 7000) % 10))?.toFixed(1));
        setTotalToday((t) => parseFloat((t + newVal / 720)?.toFixed(1)));
        return newVal;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const trend = current > prev ? 'up' : current < prev ? 'down' : 'flat';
  const isNormal = current >= FLOW_MIN_SAFE && current <= FLOW_MAX;
  const pctOfSetpoint = Math.min((current / FLOW_SETPOINT) * 100, 100);
  const deviation = parseFloat((current - FLOW_SETPOINT)?.toFixed(1));

  return (
    <div className="h-full flex flex-col justify-between gap-5 p-6 rounded-3xl border transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-emerald-500/50">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
            <Waves size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">Coriolis Mass Flow Meter</h2>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">MFM-301 · Outlet Discharge Line</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full border whitespace-nowrap shrink-0 align-middle shadow-2xs ${
            isNormal
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isNormal ? 'bg-emerald-500' : 'bg-rose-600 animate-ping'}`} />
          <span>{isNormal ? 'Normal OK' : 'Fault Alert'}</span>
        </span>
      </div>

      {/* Big value */}
      <div className="flex items-end justify-between bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
        <div className="flex items-baseline gap-2">
          <span className="tabular-nums font-black leading-none text-4xl text-emerald-600 dark:text-emerald-400">
            {current}
          </span>
          <span className="text-xl font-extrabold text-emerald-500">kg/h</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] uppercase font-extrabold text-slate-400">vs Setpoint</span>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {trend === 'up' && <TrendingUp size={13} className="text-emerald-500" />}
            {trend === 'down' && <TrendingDown size={13} className="text-rose-500" />}
            {trend === 'flat' && <Minus size={13} className="text-slate-400" />}
            <span
              className={`text-xs font-bold ${
                trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : trend === 'down' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
              }`}
            >
              {deviation >= 0 ? `+${deviation} kg/h` : `${deviation} kg/h`}
            </span>
          </div>
        </div>
      </div>

      {/* Radial chart */}
      <div className="flex-1 min-h-0 flex items-center justify-center py-1">
        <FlowRadialChart current={current} max={FLOW_MAX} setpoint={FLOW_SETPOINT} />
      </div>

      {/* Setpoint info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>Setpoint Target</span>
          <span className="text-slate-900 dark:text-white font-mono">{FLOW_SETPOINT} kg/h</span>
        </div>
        <div className="relative h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-700">
          <div
            className="h-full rounded-full transition-all duration-700 bg-emerald-500 dark:bg-emerald-400"
            style={{ width: `${pctOfSetpoint}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
            style={{ left: `${(FLOW_SETPOINT / FLOW_MAX) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>0 kg/h</span>
          <span>{FLOW_MAX} kg/h max capacity</span>
        </div>
      </div>

      {/* Today total */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={15} className="text-emerald-500" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Total Flow Today:</span>
        </div>
        <span className="tabular-nums text-sm font-black text-slate-900 dark:text-white font-mono">{totalToday?.toFixed(1)} kg CNG</span>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>Density: 0.717 kg/m³</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>4-Wire MODBUS RTD</span>
        </span>
      </div>
    </div>
  );
}