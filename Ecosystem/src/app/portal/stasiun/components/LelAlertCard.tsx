'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wind, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const LEL_CURRENT = 5;
const LEL_WARNING_THRESHOLD = 10;
const LEL_DANGER_THRESHOLD = 20;
const LEL_ALARM_THRESHOLD = 40;
const LEL_MAX_DISPLAY = 50;

function getLelStatus(lel: number): { label: string; color: string; bg: string; border: string; textColor: string } {
  if (lel >= LEL_ALARM_THRESHOLD) return { label: 'ALARM', color: 'bg-rose-600', bg: 'bg-rose-100 dark:bg-rose-950/80', border: 'border-rose-300 dark:border-rose-800', textColor: 'text-rose-700 dark:text-rose-300' };
  if (lel >= LEL_DANGER_THRESHOLD) return { label: 'DANGER', color: 'bg-rose-500', bg: 'bg-rose-100 dark:bg-rose-950/60', border: 'border-rose-300 dark:border-rose-800', textColor: 'text-rose-600 dark:text-rose-400' };
  if (lel >= LEL_WARNING_THRESHOLD) return { label: 'WARNING', color: 'bg-amber-500', bg: 'bg-amber-100 dark:bg-amber-950/60', border: 'border-amber-300 dark:border-amber-800', textColor: 'text-amber-700 dark:text-amber-300' };
  return { label: 'SAFE', color: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/50', border: 'border-emerald-200 dark:border-emerald-800', textColor: 'text-emerald-700 dark:text-emerald-300' };
}

function getBarColor(lel: number): string {
  if (lel >= LEL_ALARM_THRESHOLD) return 'bg-rose-600';
  if (lel >= LEL_DANGER_THRESHOLD) return 'bg-rose-500';
  if (lel >= LEL_WARNING_THRESHOLD) return 'bg-amber-500';
  return 'bg-emerald-500';
}

export default function LelAlertCard() {
  const [lel, setLel] = useState(LEL_CURRENT);
  const [readings, setReadings] = useState<{ id: string; value: number; time: string }[]>([
    { id: 'lel-r-1', value: 5, time: '06:23:12' },
    { id: 'lel-r-2', value: 4, time: '06:22:42' },
    { id: 'lel-r-3', value: 5, time: '06:22:12' },
  ]);
  const prevLel = useRef(LEL_CURRENT);
  const toastShown = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const variation = [-1, 0, 0, 1, 0, -1, 0, 1, 2, -1];
      const idx = Math.floor(Date.now() / 5000) % variation.length;
      const newLel = Math.max(0, Math.min(50, lel + variation[idx]));
      if (newLel !== prevLel.current) {
        setLel(newLel);
        const now = new Date();
        const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        setReadings((prev) => [
          { id: `lel-r-${Date.now()}`, value: newLel, time: ts },
          ...prev.slice(0, 2),
        ]);
        if (newLel >= LEL_WARNING_THRESHOLD && !toastShown.current) {
          toast.warning(`Gas Detector: LEL reached ${newLel}% — approaching warning threshold`, {
            icon: '⚠️',
            duration: 5000,
          });
          toastShown.current = true;
        } else if (newLel < LEL_WARNING_THRESHOLD) {
          toastShown.current = false;
        }
        prevLel.current = newLel;
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [lel]);

  const status = getLelStatus(lel);
  const fillPct = Math.min((lel / LEL_MAX_DISPLAY) * 100, 100);
  const dangerMarkerPct = (LEL_DANGER_THRESHOLD / LEL_MAX_DISPLAY) * 100;
  const warningMarkerPct = (LEL_WARNING_THRESHOLD / LEL_MAX_DISPLAY) * 100;
  const isSafe = lel < LEL_WARNING_THRESHOLD;

  return (
    <div
      className={`h-full flex flex-col justify-between gap-5 p-6 rounded-3xl border transition-all duration-300 bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl ${
        isSafe
          ? 'border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50'
          : 'border-rose-300 dark:border-rose-900/80 hover:border-rose-500 shadow-rose-500/10'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
            isSafe ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400' : 'bg-rose-600 text-white border-rose-500 animate-bounce'
          }`}>
            <Wind size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">GD-201 LEL Detector</h2>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-0.5">Bay 1 Filling Shed</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full border ${status.bg} ${status.border} ${status.textColor} whitespace-nowrap shrink-0 align-middle shadow-2xs`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isSafe ? 'bg-emerald-500' : 'bg-rose-600 animate-ping'}`} />
          <span>{status.label}</span>
        </span>
      </div>

      {/* Big LEL reading */}
      <div className="flex items-end justify-between bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="tabular-nums font-black leading-none text-4xl text-rose-600 dark:text-rose-400">
              {lel}
            </span>
            <span className="text-xl font-extrabold text-rose-500">%</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">LEL CH₄</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1.5">
            Limit: <strong className="text-rose-600 dark:text-rose-400">{LEL_DANGER_THRESHOLD}% LEL</strong>
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-extrabold text-slate-400">Sensor Type</div>
          <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">Catalytic Bead</div>
          <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">ATEX Cat. 1G</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <span>0%</span>
          <span className="text-amber-600 dark:text-amber-400">⚠ {LEL_WARNING_THRESHOLD}%</span>
          <span className="text-rose-600 dark:text-rose-400">🔴 {LEL_DANGER_THRESHOLD}%</span>
          <span>{LEL_MAX_DISPLAY}%</span>
        </div>
        <div className="relative h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/80 dark:border-slate-700">
          <div
            className={`h-full transition-all duration-500 rounded-full ${getBarColor(lel)}`}
            style={{ width: `${fillPct}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
            style={{ left: `${warningMarkerPct}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-600 z-10"
            style={{ left: `${dangerMarkerPct}%` }}
          />
        </div>
      </div>

      {/* Recent readings */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
          <span className="flex items-center gap-1.5">
            <Info size={13} className="text-indigo-500" />
            <span>Recent Telemetry</span>
          </span>
          <span className="text-[10px] font-mono uppercase">Interval 5s</span>
        </div>
        <div className="space-y-1.5">
          {readings.map((r, idx) => (
            <div key={r.id} className="flex items-center justify-between text-xs font-semibold">
              <span className="tabular-nums text-slate-500 dark:text-slate-400 font-mono">{r.time}</span>
              <div className="flex items-center gap-2">
                <span className={`tabular-nums font-bold ${r.value >= LEL_WARNING_THRESHOLD ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-slate-700 dark:text-slate-200'}`}>
                  {r.value}% LEL
                </span>
                {idx === 0 && (
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md font-bold border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                    live
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>IEC 60079 Certified</span>
        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <span>GD-201 Active</span>
          <ChevronRight size={12} />
        </span>
      </div>
    </div>
  );
}