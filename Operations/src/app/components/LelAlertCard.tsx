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
  if (lel >= LEL_ALARM_THRESHOLD) return { label: 'ALARM', color: 'bg-rose-600', bg: 'bg-rose-50', border: 'border-rose-300', textColor: 'text-rose-700' };
  if (lel >= LEL_DANGER_THRESHOLD) return { label: 'DANGER', color: 'bg-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', textColor: 'text-rose-600' };
  if (lel >= LEL_WARNING_THRESHOLD) return { label: 'WARNING', color: 'bg-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', textColor: 'text-amber-600' };
  return { label: 'SAFE', color: 'bg-primary', bg: 'bg-emerald-50', border: 'border-emerald-200', textColor: 'text-emerald-700' };
}

function getBarColor(lel: number): string {
  if (lel >= LEL_ALARM_THRESHOLD) return 'bg-rose-600';
  if (lel >= LEL_DANGER_THRESHOLD) return 'bg-rose-500';
  if (lel >= LEL_WARNING_THRESHOLD) return 'bg-amber-500';
  return 'bg-primary';
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
    // Backend integration point: replace with WebSocket gas detector event stream
    const interval = setInterval(() => {
      const variation = [-1, 0, 0, 1, 0, -1, 0, 1, 2, -1];
      const idx = Math.floor(Date.now() / 5000) % variation.length;
      const newLel = Math.max(0, Math.min(50, lel + variation[idx]));
      if (newLel !== prevLel.current) {
        setLel(newLel);
        const now = new Date();
        const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        setReadings(prev => [
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
    <div className={`h-full flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300 ${isSafe ? 'card-alert' : 'card-alert'}`}
      style={{
        background: isSafe
          ? 'linear-gradient(135deg, #fff7f8 0%, #fffbfb 100%)'
          : 'linear-gradient(135deg, #fff1f2 0%, #fff5f5 100%)',
        borderColor: isSafe ? '#fecdd3' : '#fca5a5',
        boxShadow: isSafe
          ? '0 1px 3px rgba(244,63,94,0.07), 0 1px 2px rgba(244,63,94,0.04)'
          : '0 2px 8px rgba(244,63,94,0.12), 0 1px 3px rgba(244,63,94,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
            <Wind size={18} className="text-rose-500" />
          </div>
          <div>
            <h2 className="text-sm font-700 text-foreground leading-tight">Gas Detector LEL</h2>
            <p className="text-xs text-rose-400 font-medium mt-0.5">GD-201 · Bay 1 Zone</p>
          </div>
        </div>
        <span className={`flex items-center gap-1 text-xs font-700 px-2.5 py-1 rounded-full border ${status.bg} ${status.border} ${status.textColor}`}>
          {!isSafe && <AlertTriangle size={10} className="animate-pulse" />}
          {status.label}
        </span>
      </div>

      {/* Big LEL reading */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="tabular-nums font-800 leading-none" style={{ fontSize: '3rem', color: isSafe ? '#f43f5e' : '#e11d48' }}>
              {lel}
            </span>
            <span className="text-lg font-700 text-rose-400">%</span>
            <span className="text-sm font-600 text-muted-foreground ml-1">LEL</span>
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Danger threshold: <span className="font-700 text-rose-500">{LEL_DANGER_THRESHOLD}% LEL</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground font-medium">Sensor</div>
          <div className="text-xs font-700 text-foreground">Catalytic Bead</div>
          <div className="text-xs text-muted-foreground font-medium mt-0.5">CH₄ · Natural Gas</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">0%</span>
          <span className="text-amber-500 font-700">⚠ {LEL_WARNING_THRESHOLD}%</span>
          <span className="text-rose-500 font-700">🔴 {LEL_DANGER_THRESHOLD}%</span>
          <span className="text-muted-foreground font-medium">{LEL_MAX_DISPLAY}%</span>
        </div>
        <div className="relative lel-track">
          {/* Fill */}
          <div
            className={`lel-fill ${getBarColor(lel)}`}
            style={{ width: `${fillPct}%` }}
          />
          {/* Warning marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 rounded-full"
            style={{ left: `${warningMarkerPct}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>
          {/* Danger marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 rounded-full"
            style={{ left: `${dangerMarkerPct}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </div>
        </div>
      </div>

      {/* Recent readings */}
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <Info size={11} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-600 tracking-wide">Recent Readings</span>
        </div>
        <div className="space-y-1.5">
          {readings.map((r, idx) => (
            <div key={r.id} className="flex items-center justify-between">
              <span className="tabular-nums text-xs text-muted-foreground font-medium font-mono">{r.time}</span>
              <div className="flex items-center gap-1.5">
                <span className={`tabular-nums text-xs font-700 ${r.value >= LEL_WARNING_THRESHOLD ? 'text-rose-500' : 'text-emerald-600'}`}>
                  {r.value}% LEL
                </span>
                {idx === 0 && (
                  <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-medium">latest</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">IEC 60079 · ATEX Cat. 1G</span>
        <button className="flex items-center gap-0.5 text-xs text-rose-500 font-600 hover:text-rose-600 transition-colors">
          View Log <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}