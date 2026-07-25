'use client';
import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';


// Recharts isolated in client-only dynamic import to prevent SSR issues
const TelemetryLineCharts = dynamic(
  () => import('./TelemetryLineCharts'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return (
    <div className="w-full h-48 animate-pulse bg-slate-100 rounded-xl" />
  );
}

// Mock telemetry data — 20 ticks at ~30s intervals ending at 06:23:12
const BASE_TIME = new Date('2026-07-20T06:13:12');

function generateTelemetryData() {
  const data = [];
  const flowBase = 142;
  const pressureBase = 4.8;
  const flowVariances = [0, 2, -1, 4, 6, 3, -2, 5, 8, 4, 2, -1, 3, 7, 5, 6, 4, 2, 3, 5];
  const pressureVariances = [0, 0.05, -0.03, 0.08, 0.12, 0.06, -0.04, 0.09, 0.15, 0.07, 0.04, -0.02, 0.06, 0.11, 0.09, 0.10, 0.07, 0.04, 0.06, 0.08];
  for (let i = 0; i < 20; i++) {
    const t = new Date(BASE_TIME.getTime() + i * 30000);
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');
    const ss = String(t.getSeconds()).padStart(2, '0');
    data.push({
      id: `tick-${i}`,
      time: `${hh}:${mm}:${ss}`,
      shortTime: `${hh}:${mm}`,
      flow: parseFloat((flowBase + flowVariances[i]).toFixed(1)),
      pressure: parseFloat((pressureBase + pressureVariances[i]).toFixed(2)),
    });
  }
  return data;
}

const telemetryData = generateTelemetryData();

export default function TelemetryChartCard() {
  const [lastFlow, setLastFlow] = useState(147);
  const [lastPressure, setLastPressure] = useState(4.88);
  const [flowTrend, setFlowTrend] = useState<'up' | 'down' | 'flat'>('up');
  const [pressureTrend, setPressureTrend] = useState<'up' | 'down' | 'flat'>('up');
  const [refreshAnim, setRefreshAnim] = useState(false);
  const [updatedAt, setUpdatedAt] = useState('06:23:12');

  useEffect(() => {
    // Backend integration point: replace with WebSocket subscription to SCADA/OPC-UA telemetry feed
    const interval = setInterval(() => {
      const prevFlow = lastFlow;
      const newFlow = parseFloat((142 + (Math.floor(Date.now() / 1000) % 12)).toFixed(1));
      const prevPressure = lastPressure;
      const newPressure = parseFloat((4.8 + ((Date.now() / 10000) % 0.2)).toFixed(2));
      setLastFlow(newFlow);
      setLastPressure(newPressure);
      setFlowTrend(newFlow > prevFlow ? 'up' : newFlow < prevFlow ? 'down' : 'flat');
      setPressureTrend(newPressure > prevPressure ? 'up' : newPressure < prevPressure ? 'down' : 'flat');
      setRefreshAnim(true);
      const now = new Date();
      setUpdatedAt(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`);
      setTimeout(() => setRefreshAnim(false), 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [lastFlow, lastPressure]);

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
    if (trend === 'up') return <TrendingUp size={14} className="text-primary" />;
    if (trend === 'down') return <TrendingDown size={14} className="text-rose-500" />;
    return <Minus size={14} className="text-muted-foreground" />;
  };

  return (
    <div className="card-elevated h-full p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <Activity size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-700 text-foreground leading-tight">Mother Station Telemetry</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">Coriolis Mass Flow · Pressure Transmitter</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className={`transition-transform duration-300 ${refreshAnim ? 'rotate-180' : ''}`}>
            <RefreshCw size={13} className="text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums font-medium">
            {updatedAt}
          </span>
          <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
            <span className="text-xs font-600 text-emerald-700">Live</span>
          </span>
        </div>
      </div>

      {/* Current values row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Coriolis Flow */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-600 text-muted-foreground tracking-wide uppercase">Mass Flow</span>
            <TrendIcon trend={flowTrend} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-hero-value gradient-emerald-text tabular-nums">{lastFlow}</span>
            <span className="text-sm font-600 text-slate-500">kg/h</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs text-muted-foreground">Coriolis MFM</span>
            <span className="text-xs text-emerald-600 font-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Normal</span>
          </div>
        </div>

        {/* Pressure */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-600 text-muted-foreground tracking-wide uppercase">Pressure</span>
            <TrendIcon trend={pressureTrend} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-hero-value gradient-emerald-text tabular-nums">{lastPressure.toFixed(2)}</span>
            <span className="text-sm font-600 text-slate-500">Bar</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs text-muted-foreground">PT-101</span>
            <span className="text-xs text-emerald-600 font-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Nominal</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <TelemetryLineCharts data={telemetryData} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-primary inline-block" />
            <span className="text-xs text-muted-foreground font-medium">Flow (kg/h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-blue-400 inline-block" />
            <span className="text-xs text-muted-foreground font-medium">Pressure (Bar)</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">Last 10 min · 30s interval</span>
      </div>
    </div>
  );
}