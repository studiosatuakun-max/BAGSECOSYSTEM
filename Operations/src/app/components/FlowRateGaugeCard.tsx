'use client';
import React, { useState, useEffect } from 'react';
import { Waves, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import dynamic from 'next/dynamic';

const FlowRadialChart = dynamic(
  () => import('./FlowRadialChart'),
  { ssr: false, loading: () => <div className="w-full h-28 animate-pulse bg-slate-100 rounded-xl" /> }
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
    // Backend integration point: replace with Coriolis MFM MODBUS/OPC-UA subscription
    const interval = setInterval(() => {
      setCurrent(p => {
        setPrev(p);
        const newVal = parseFloat((142 + ((Date.now() / 7000) % 10))?.toFixed(1));
        setTotalToday(t => parseFloat((t + newVal / 720)?.toFixed(1)));
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
    <div className="card-elevated h-full flex flex-col gap-3 p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <Waves size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-700 text-foreground leading-tight">Coriolis Mass Flow</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">MFM-301 · Outlet Line</p>
          </div>
        </div>
        <span className={`text-xs font-700 px-2 py-0.5 rounded-full border ${
          isNormal
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :'bg-rose-50 border-rose-200 text-rose-600'
        }`}>
          {isNormal ? 'Normal' : 'Fault'}
        </span>
      </div>
      {/* Big value */}
      <div className="flex items-end gap-2">
        <span className="tabular-nums font-800 leading-none gradient-emerald-text" style={{ fontSize: '2.5rem' }}>
          {current}
        </span>
        <div className="flex flex-col gap-0.5 pb-1">
          <span className="text-sm font-700 text-slate-500">kg/h</span>
          <div className="flex items-center gap-0.5">
            {trend === 'up' && <TrendingUp size={12} className="text-primary" />}
            {trend === 'down' && <TrendingDown size={12} className="text-rose-500" />}
            {trend === 'flat' && <Minus size={12} className="text-muted-foreground" />}
            <span className={`text-xs font-600 ${
              trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-rose-500' : 'text-muted-foreground'
            }`}>
              {deviation >= 0 ? `+${deviation}` : deviation} vs SP
            </span>
          </div>
        </div>
      </div>
      {/* Radial chart */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <FlowRadialChart current={current} max={FLOW_MAX} setpoint={FLOW_SETPOINT} />
      </div>
      {/* Setpoint info */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Setpoint</span>
          <span className="font-700 text-foreground tabular-nums">{FLOW_SETPOINT} kg/h</span>
        </div>
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 bg-primary"
            style={{ width: `${pctOfSetpoint}%` }}
          />
          {/* Setpoint marker at 75% of max */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400"
            style={{ left: `${(FLOW_SETPOINT / FLOW_MAX) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">0 kg/h</span>
          <span className="text-muted-foreground font-medium">{FLOW_MAX} kg/h max</span>
        </div>
      </div>
      {/* Today total */}
      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BarChart3 size={13} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Total Today</span>
        </div>
        <span className="tabular-nums text-xs font-800 text-foreground">{totalToday?.toFixed(1)} kg</span>
      </div>
      {/* Footer */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">Density: 0.717 kg/m³</span>
        <span className="text-xs text-primary font-600">4-Wire RTD</span>
      </div>
    </div>
  );
}