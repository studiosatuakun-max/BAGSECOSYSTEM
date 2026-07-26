'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';

// Recharts isolated in client-only dynamic import to prevent SSR issues
const TelemetryLineCharts = dynamic(
  () => import('./TelemetryLineCharts'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return (
    <div className="w-full h-48 animate-pulse bg-slate-800/50 rounded-2xl border border-slate-700/50" />
  );
}

// Mock telemetry datasets for time tabs
const BASE_TIME = new Date('2026-07-20T06:13:12');

function generateTelemetryData(baseFlow: number, basePressure: number, varianceMult: number) {
  const data = [];
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
      flow: parseFloat((baseFlow + flowVariances[i] * varianceMult).toFixed(1)),
      pressure: parseFloat((basePressure + pressureVariances[i] * varianceMult).toFixed(2)),
    });
  }
  return data;
}

const dataMap = {
  'Real-time': generateTelemetryData(142, 4.8, 1),
  '1H Avg': generateTelemetryData(148, 4.9, 0.8),
  'Shift 1': generateTelemetryData(152, 4.85, 1.2),
  '24H Trend': generateTelemetryData(145, 4.88, 0.5),
};

export default function TelemetryChartCard() {
  const [activeTab, setActiveTab] = useState<'Real-time' | '1H Avg' | 'Shift 1' | '24H Trend'>('Real-time');
  const [lastFlow, setLastFlow] = useState(147);
  const [lastPressure, setLastPressure] = useState(4.88);
  const [flowTrend, setFlowTrend] = useState<'up' | 'down' | 'flat'>('up');
  const [pressureTrend, setPressureTrend] = useState<'up' | 'down' | 'flat'>('up');
  const [refreshAnim, setRefreshAnim] = useState(false);
  const [updatedAt, setUpdatedAt] = useState('06:23:12');

  const chartData = useMemo(() => dataMap[activeTab], [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab !== 'Real-time') return;
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
      setUpdatedAt(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`);
      setTimeout(() => setRefreshAnim(false), 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [lastFlow, lastPressure, activeTab]);

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
    if (trend === 'up') return <TrendingUp size={14} className="text-emerald-400" />;
    if (trend === 'down') return <TrendingDown size={14} className="text-rose-400" />;
    return <Minus size={14} className="text-slate-400" />;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-6 sm:p-7 rounded-3xl border border-slate-800/80 shadow-xl relative overflow-hidden flex flex-col justify-between h-full group hover:border-emerald-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/40 transition-all duration-300">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-500" />
      
      {/* Card Header & Time Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <Activity size={20} className={refreshAnim ? 'animate-spin text-cyan-400' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-tight">Mother Station Telemetry Feed</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap shrink-0 align-middle shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>OPC-UA LIVE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Bay 1 Filling Shed · High Pressure Header vs Mass Flow Rate
            </p>
          </div>
        </div>

        {/* Time Tabs */}
        <div className="inline-flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
          {(['Real-time', '1H Avg', 'Shift 1', '24H Trend'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Hero KPI Numbers Bar */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-6 z-10">
        <div className="flex flex-col border-r border-slate-800 pr-4">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Coriolis Mass Flow</span>
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
              {activeTab === 'Real-time' ? lastFlow : activeTab === '1H Avg' ? 148.2 : activeTab === 'Shift 1' ? 152.4 : 145.0}
            </span>
            <span className="text-xs font-bold text-emerald-400">kg/h</span>
            <div className="flex items-center gap-0.5 ml-auto text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/60">
              <TrendIcon trend={flowTrend} />
              <span>{flowTrend === 'up' ? '+3.2%' : flowTrend === 'down' ? '-1.1%' : 'Stable'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col pl-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Compressor Outlet Pressure</span>
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
              {activeTab === 'Real-time' ? lastPressure : activeTab === '1H Avg' ? 4.90 : activeTab === 'Shift 1' ? 4.85 : 4.88}
            </span>
            <span className="text-xs font-bold text-blue-400">Bar</span>
            <div className="flex items-center gap-0.5 ml-auto text-xs font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-lg border border-blue-800/60">
              <TrendIcon trend={pressureTrend} />
              <span>Nominal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full min-h-[190px] z-10">
        <TelemetryLineCharts data={chartData} />
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-400 z-10">
        <div className="flex items-center gap-2">
          <Icon name="ArrowPathIcon" size={13} className="text-emerald-400 animate-spin" />
          <span>Last SCADA Sync: <strong className="text-white font-mono">{updatedAt}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> ATEX Zone 1 Certified</span>
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">● 0% Loss Tolerance</span>
        </div>
      </div>

    </div>
  );
}