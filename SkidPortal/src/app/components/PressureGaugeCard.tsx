'use client';

import React, { useEffect, useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import { Activity, Thermometer, Gauge } from 'lucide-react';

const CURRENT_PRESSURE = 45;
const MIN_PRESSURE = 20;
const MAX_PRESSURE = 80;
const NOMINAL_THRESHOLD = 30;

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
    <svg viewBox="0 0 240 200" className="w-full max-w-[280px] mx-auto gauge-shadow" aria-label={`Pressure gauge showing ${value} Bar`}>
      <defs>
        <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--success)" stopOpacity="0.3" />
          <stop offset="60%" stopColor="var(--warning)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--danger)" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="gaugeFill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background track */}
      <path
        d={arcPath(startAngle, endAngle, r)}
        fill="none"
        stroke="var(--border)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Color zones */}
      <path
        d={arcPath(startAngle, nominalAngle, r)}
        fill="none"
        stroke="var(--danger)"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.25"
      />
      <path
        d={arcPath(nominalAngle, endAngle, r)}
        fill="none"
        stroke="var(--success)"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.20"
      />

      {/* Value arc */}
      <path
        d={arcPath(startAngle, valueAngle, r)}
        fill="none"
        stroke="url(#gaugeFill)"
        strokeWidth="10"
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Tick marks */}
      {ticks.map((i) => {
        const tickAngle = startAngle + (i / 8) * totalAngle;
        const innerR = r - 14;
        const outerR = r - 6;
        const tx1 = cx + outerR * Math.cos(toRad(tickAngle));
        const ty1 = cy + outerR * Math.sin(toRad(tickAngle));
        const tx2 = cx + innerR * Math.cos(toRad(tickAngle));
        const ty2 = cy + innerR * Math.sin(toRad(tickAngle));
        return (
          <line
            key={`tick-${i}`}
            x1={tx1} y1={ty1} x2={tx2} y2={ty2}
            stroke="var(--muted-foreground)"
            strokeWidth={i % 4 === 0 ? 2 : 1}
            opacity="0.4"
          />
        );
      })}

      {/* Min threshold marker */}
      <circle
        cx={cx + r * Math.cos(toRad(minAngle))}
        cy={cy + r * Math.sin(toRad(minAngle))}
        r={5}
        fill="var(--danger)"
        opacity="0.9"
      />

      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={needleX} y2={needleY}
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={7} fill="var(--primary)" />
      <circle cx={cx} cy={cy} r={3} fill="var(--primary-foreground)" />

      {/* Center value */}
      <text x={cx} y={cy + 30} textAnchor="middle" fill="var(--foreground)" fontSize="22" fontWeight="700" fontFamily="var(--font-plus-jakarta-sans)">
        {value}
      </text>
      <text x={cx} y={cy + 46} textAnchor="middle" fill="var(--muted-foreground)" fontSize="11" fontFamily="var(--font-plus-jakarta-sans)">
        Bar
      </text>

      {/* Min label */}
      <text x={cx - r + 4} y={cy + 28} textAnchor="middle" fill="var(--danger)" fontSize="9" fontFamily="var(--font-plus-jakarta-sans)" fontWeight="600">
        MIN
      </text>
      <text x={cx - r + 4} y={cy + 38} textAnchor="middle" fill="var(--danger)" fontSize="9" fontFamily="var(--font-plus-jakarta-sans)">
        {min}
      </text>

      {/* Max label */}
      <text x={cx + r - 4} y={cy + 28} textAnchor="middle" fill="var(--muted-foreground)" fontSize="9" fontFamily="var(--font-plus-jakarta-sans)" fontWeight="600">
        MAX
      </text>
      <text x={cx + r - 4} y={cy + 38} textAnchor="middle" fill="var(--muted-foreground)" fontSize="9" fontFamily="var(--font-plus-jakarta-sans)">
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
    <div className="bg-card border border-border rounded-2xl shadow-card p-6 card-hover fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Gauge size={16} className="text-primary" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Real-time Skid Tank Pressure</p>
          </div>
          <h2 className="text-lg font-bold text-foreground mt-2">Tank SKD-JKT-04</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Kawasan Industri MM2100, Bekasi</p>
        </div>
        <StatusBadge variant={pressureStatus} label={pressureStatus === 'nominal' ? 'Status: Nominal' : pressureStatus === 'warning' ? 'Status: Warning' : 'Status: Critical'} />
      </div>

      {/* Gauge */}
      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <PressureGaugeSVG value={animatedPressure} min={MIN_PRESSURE} max={MAX_PRESSURE} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
        {[
          { label: 'Current', value: `${CURRENT_PRESSURE} Bar`, icon: Activity, color: 'text-accent' },
          { label: 'Min Threshold', value: `${MIN_PRESSURE} Bar`, icon: Thermometer, color: 'text-danger' },
          { label: 'Max Capacity', value: `${MAX_PRESSURE} Bar`, icon: Gauge, color: 'text-muted-foreground' },
        ].map((stat) => (
          <div key={`stat-${stat.label}`} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <stat.icon size={12} className={stat.color} />
              <span className="text-[11px] text-muted-foreground font-medium">{stat.label}</span>
            </div>
            <p className={`text-sm font-bold font-tabular ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Last updated */}
      <p className="text-[11px] text-muted-foreground/60 text-center mt-3">
        Last updated: 20 Jul 2026, 06:51 WIB · Auto-refresh every 60s
      </p>
    </div>
  );
}