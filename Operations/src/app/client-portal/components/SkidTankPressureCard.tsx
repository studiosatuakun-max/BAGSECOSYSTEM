'use client';
import React, { useState, useEffect } from 'react';
import { Gauge, CheckCircle2, TrendingUp, Thermometer, Droplets } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const MIN_THRESHOLD = 20;
const MAX_PRESSURE = 80;
const NOMINAL_PRESSURE = 45;

export default function SkidTankPressureCard() {
  const [pressure, setPressure] = useState(NOMINAL_PRESSURE);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight pressure fluctuation
      setPressure(prev => {
        const delta = (Math.random() - 0.5) * 1.5;
        return Math.round((prev + delta) * 10) / 10;
      });
      setTick(p => p + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const percentage = Math.min(100, Math.max(0, (pressure / MAX_PRESSURE) * 100));
  const thresholdPct = (MIN_THRESHOLD / MAX_PRESSURE) * 100;
  const isNominal = pressure >= MIN_THRESHOLD;

  const gaugeData = [{ value: percentage, fill: isNominal ? '#1e3a8a' : '#ef4444' }];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
            <Gauge size={20} className="text-blue-800" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Real-time Skid Tank Pressure</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tank ID: SKD-MBI-001 · Bay 3 · LPG Grade</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shrink-0 ${
          isNominal
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :'bg-red-50 border-red-200 text-red-700'
        }`}>
          <CheckCircle2 size={12} />
          Status: {isNominal ? 'Nominal' : 'Low Pressure'}
        </div>
      </div>
      {/* Main content: Gauge + Metrics */}
      <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">

        {/* Radial Gauge */}
        <div className="relative flex items-center justify-center shrink-0" style={{ width: 200, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="90%"
              startAngle={220}
              endAngle={-40}
              data={gaugeData}
              barSize={16}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              {/* Background track */}
              <RadialBar
                background={{ fill: '#f1f5f9' }}
                dataKey="value"
                cornerRadius={8}
                angleAxisId={0}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold text-blue-900 tabular-nums leading-none">
              {pressure?.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-slate-500 mt-0.5">Bar</span>
            <span className="text-xs text-slate-400 mt-1">Current</span>
          </div>
        </div>

        {/* Right: Metrics & threshold info */}
        <div className="flex-1 w-full flex flex-col gap-4">

          {/* Pressure bar visual */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Pressure Level</span>
              <span className="text-xs text-slate-500 tabular-nums">{pressure?.toFixed(1)} / {MAX_PRESSURE} Bar</span>
            </div>
            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
              {/* Threshold marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                style={{ left: `${thresholdPct}%` }}
              />
              {/* Fill */}
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${percentage}%`,
                  background: isNominal
                    ? 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)'
                    : 'linear-gradient(90deg, #dc2626 0%, #f87171 100%)',
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-slate-400">0 Bar</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-amber-400" />
                <span className="text-xs text-amber-600 font-medium">Min. threshold: {MIN_THRESHOLD} Bar</span>
              </div>
              <span className="text-xs text-slate-400">{MAX_PRESSURE} Bar</span>
            </div>
          </div>

          {/* Metric tiles */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp size={12} className="text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">Min. Threshold</span>
              </div>
              <span className="text-lg font-bold text-blue-900 tabular-nums">{MIN_THRESHOLD} <span className="text-xs font-normal">Bar</span></span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Thermometer size={12} className="text-slate-500" />
                <span className="text-xs text-slate-500 font-medium">Temperature</span>
              </div>
              <span className="text-lg font-bold text-slate-800 tabular-nums">28.4 <span className="text-xs font-normal">°C</span></span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Droplets size={12} className="text-slate-500" />
                <span className="text-xs text-slate-500 font-medium">Fill Level</span>
              </div>
              <span className="text-lg font-bold text-slate-800 tabular-nums">73 <span className="text-xs font-normal">%</span></span>
            </div>
          </div>

          {/* Last updated */}
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block transition-opacity duration-500 ${tick % 2 === 0 ? 'opacity-100' : 'opacity-40'}`} />
            Live · Updated just now
          </p>
        </div>
      </div>
    </div>
  );
}
