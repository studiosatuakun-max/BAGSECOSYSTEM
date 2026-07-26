'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Thermometer, Gauge } from 'lucide-react';

const CURRENT_PRESSURE = 240;
const MIN_PRESSURE = 180;
const MAX_PRESSURE = 250;
const NOMINAL_THRESHOLD = 200;

function PressureGaugeSVG({ value, min, max }: { value: number; min: number; max: number }) {
  const cx = 120;
  const cy = 120;
  const r = 88;
  const startAngle = -220;
  const endAngle = 40;
  const totalAngle = endAngle - startAngle;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcPath = (fromDeg: number, toDeg: number, radius: number) => {
    const x1 = cx + radius * Math.cos(toRad(fromDeg));
    const y1 = cy + radius * Math.sin(toRad(fromDeg));
    const x2 = cx + radius * Math.cos(toRad(toDeg));
    const y2 = cy + radius * Math.sin(toRad(toDeg));
    const large = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  const valueAngle = startAngle + ((value - min) / (max - min)) * totalAngle;
  const minAngle = startAngle + ((min - min) / (max - min)) * totalAngle;
  const nominalAngle = startAngle + ((NOMINAL_THRESHOLD - min) / (max - min)) * totalAngle;

  const needleX = cx + (r - 24) * Math.cos(toRad(valueAngle));
  const needleY = cy + (r - 24) * Math.sin(toRad(valueAngle));

  const ticks = Array.from({ length: 9 }, (_, i) => i);

  return (
    <svg viewBox="0 0 240 200" className="w-full max-w-[280px] mx-auto drop-shadow-md" aria-label={`Pressure gauge showing ${value} Bar`}>
      <defs>
        <linearGradient id="gaugeFillCNG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="30%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <filter id="glowCNG">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background track */}
      <path
        d={arcPath(startAngle, endAngle, r)}
        fill="none"
        stroke="#cbd5e1"
        className="dark:stroke-slate-800"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Color zones */}
      <path
        d={arcPath(startAngle, nominalAngle, r)}
        fill="none"
        stroke="#ef4444"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.25"
      />
      <path
        d={arcPath(nominalAngle, endAngle, r)}
        fill="none"
        stroke="#10b981"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* Value arc */}
      <path
        d={arcPath(startAngle, valueAngle, r)}
        fill="none"
        stroke="url(#gaugeFillCNG)"
        strokeWidth="12"
        strokeLinecap="round"
        filter="url(#glowCNG)"
      />

      {/* Tick marks */}
      {ticks.map((i) => {
        const tickAngle = startAngle + (i / 8) * totalAngle;
        const innerR = r - 15;
        const outerR = r - 6;
        const tx1 = cx + outerR * Math.cos(toRad(tickAngle));
        const ty1 = cy + outerR * Math.sin(toRad(tickAngle));
        const tx2 = cx + innerR * Math.cos(toRad(tickAngle));
        const ty2 = cy + innerR * Math.sin(toRad(tickAngle));
        return (
          <line
            key={`tick-${i}`}
            x1={tx1} y1={ty1} x2={tx2} y2={ty2}
            stroke="#94a3b8"
            strokeWidth={i % 4 === 0 ? 2.5 : 1}
            opacity="0.6"
          />
        );
      })}

      {/* Min threshold marker */}
      <circle
        cx={cx + r * Math.cos(toRad(minAngle))}
        cy={cy + r * Math.sin(toRad(minAngle))}
        r={5}
        fill="#ef4444"
        opacity="0.9"
      />

      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={needleX} y2={needleY}
        stroke="#6366f1"
        className="dark:stroke-indigo-400"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={8} fill="#6366f1" className="dark:fill-indigo-400" />
      <circle cx={cx} cy={cy} r={3} fill="#ffffff" />

      {/* Center value */}
      <text x={cx} y={cy + 30} textAnchor="middle" fill="currentColor" className="text-slate-900 dark:text-white" fontSize="24" fontWeight="800">
        {value}
      </text>
      <text x={cx} y={cy + 46} textAnchor="middle" fill="#64748b" className="dark:fill-slate-400" fontSize="11" fontWeight="700">
        Bar (Nominal)
      </text>

      {/* Min label */}
      <text x={cx - r + 4} y={cy + 28} textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="700">
        MIN
      </text>
      <text x={cx - r + 4} y={cy + 38} textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="700">
        {min}
      </text>

      {/* Max label */}
      <text x={cx + r - 4} y={cy + 28} textAnchor="middle" fill="#64748b" className="dark:fill-slate-400" fontSize="9" fontWeight="700">
        MAX
      </text>
      <text x={cx + r - 4} y={cy + 38} textAnchor="middle" fill="#64748b" className="dark:fill-slate-400" fontSize="9" fontWeight="700">
        {max}
      </text>
    </svg>
  );
}

export default function PressureGaugeCard() {
  const [animatedPressure, setAnimatedPressure] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPressure(CURRENT_PRESSURE), 300);
    return () => clearTimeout(timer);
  }, []);

  const pressureStatus = CURRENT_PRESSURE < MIN_PRESSURE ? 'critical' : CURRENT_PRESSURE < NOMINAL_THRESHOLD ? 'warning' : 'nominal';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-indigo-500/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              <Gauge size={16} />
            </div>
            <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Real-time Tube Manifold
            </p>
          </div>
          <h2 className="text-sm font-black text-slate-900 dark:text-white mt-1">Skid Header SKD-JKT-04</h2>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">PT Krakatau Baja Smelter · Cilegon</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
          Nominal 240 Bar
        </span>
      </div>

      {/* Gauge */}
      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <PressureGaugeSVG value={animatedPressure} min={MIN_PRESSURE} max={MAX_PRESSURE} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl text-center border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-1 mb-1 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
            <Activity size={12} />
            <span>Current</span>
          </div>
          <p className="text-xs font-black text-slate-900 dark:text-white tabular-nums">{CURRENT_PRESSURE} Bar</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl text-center border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-1 mb-1 text-rose-600 dark:text-rose-400 font-bold text-[10px]">
            <Thermometer size={12} />
            <span>Min Refill</span>
          </div>
          <p className="text-xs font-black text-rose-600 dark:text-rose-400 tabular-nums">{MIN_PRESSURE} Bar</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl text-center border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-1 mb-1 text-slate-500 dark:text-slate-400 font-bold text-[10px]">
            <Gauge size={12} />
            <span>Max Rating</span>
          </div>
          <p className="text-xs font-black text-slate-700 dark:text-slate-300 tabular-nums">{MAX_PRESSURE} Bar</p>
        </div>
      </div>

      {/* Last updated */}
      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-3 font-medium">
        Telemetry synced with Mother Station SCADA · Auto-refresh 30s
      </p>
    </div>
  );
}