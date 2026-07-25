'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ─── Inline SVG glyphs (light theme colors via currentColor) ─── */
const FlameGlyph = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2c1.6 4 3.6 4.4 4.8 6A6 6 0 0 1 18 12a6 6 0 0 1-12 0c0-.4 0-.8.1-1.2a2.5 2.5 0 1 0 4-2.4C11.4 7.5 12 2 12 2z"/>
  </svg>
);

const ShieldGlyph = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3l8 3v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RouteGlyph = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="6" cy="6" r="2" fill="currentColor" />
    <circle cx="18" cy="18" r="2" fill="currentColor" />
    <path d="M6 8v3a4 4 0 0 0 4 4h4a4 4 0 0 1 0 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CylinderGlyph = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 32 48" fill="none" className={className}>
    <rect x="6" y="6" width="20" height="36" rx="6" fill="currentColor" opacity="0.85" />
    <rect x="6" y="6" width="20" height="6" rx="3" fill="currentColor" />
    <rect x="6" y="36" width="20" height="6" rx="3" fill="currentColor" opacity="0.55" />
    <line x1="16" y1="14" x2="16" y2="34" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
  </svg>
);

const ScanGlyph = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7V2h5M17 2h5v5M22 17v5h-5M7 22H2v-5"/><rect x="7" y="7" width="10" height="10" rx="2"/>
  </svg>
);

export default function DriverDashboardPage() {
  const [isSafeZone, setIsSafeZone] = useState(true);

  const cylindersLoaded = 7;
  const stopsRemaining = 4;
  const shiftDuration = '03:42';
  const checklistCompleted: number = 3;
  const checklistTotal: number = 4;
  const checklistPct = Math.round((checklistCompleted / checklistTotal) * 100);
  const shiftPct = 42;
  const isReadyToStart: boolean = checklistCompleted === checklistTotal;

  return (
    <div className="relative flex flex-col h-full bg-[#FAFAFA] overflow-hidden">
      
      {/* Top App Bar */}
      <div
        className="flex items-center justify-between px-4 pb-4 bg-white border-b border-gray-200 relative z-10 flex-shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-[12px] bg-white border border-slate-200 flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden p-1.5">
            <img src="/assets/images/icon.png" alt="BaGS Logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[17px] font-bold text-gray-900 tracking-[-0.02em] leading-none">GasDrive</h1>
            <p className="text-[10px] font-bold text-[var(--sky-600)] tracking-[0.14em] uppercase mt-1.5">Driver Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            <div className="w-7 h-7 rounded-full bg-[var(--sky-500)] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">M</div>
            <span className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">Marcus O.</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-36 relative z-10 pt-4 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Zone Banner */}
        <button onClick={() => setIsSafeZone(!isSafeZone)}
          className={`group flex items-center gap-3 px-4 h-12 w-full rounded-2xl text-left transition-all border shadow-sm mb-4 ${
            isSafeZone
              ? 'bg-[var(--sky-50)] border-[var(--sky-200)]'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="relative flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${isSafeZone ? 'bg-[var(--sky-500)]' : 'bg-red-500'}`} />
            <div className={`absolute inset-0 w-2 h-2 rounded-full ${isSafeZone ? 'bg-[var(--sky-500)]' : 'bg-red-500'} animate-ping opacity-60`} />
          </div>
          <span className={`flex-1 min-w-0 text-sm font-semibold tracking-tight truncate ${isSafeZone ? 'text-[var(--sky-600)]' : 'text-red-600'}`}>
            {isSafeZone ? 'Zone: Loading Bay — Depot A' : 'Zone: Hazardous (Scanner Disabled)'}
          </span>
          <span className="text-[9px] font-bold tracking-[0.15em] px-2 py-0.5 rounded-md border bg-white border-gray-200 flex-shrink-0">DEMO</span>
        </button>

        <div className="space-y-4">
          
          {/* Shift Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-sm font-bold text-gray-900">Shift Elapsed</span>
              <span className="flex-shrink-0 px-2 py-1 text-[10px] font-bold rounded-md bg-gray-100 text-gray-600 tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--sky-500)]" />
                TODAY
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <div className="text-4xl font-bold text-gray-900 leading-[1] tracking-[-0.04em] tabular-nums">
                {shiftDuration}
              </div>
              <div className="text-xs font-semibold text-[var(--sky-600)] mb-1 whitespace-nowrap">on track</div>
            </div>

            {/* Progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-500 font-medium">Shift progress</span>
                <span className="font-bold text-gray-900 tabular-nums">{shiftPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-[var(--sky-500)] rounded-full" style={{ width: `${shiftPct}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--sky-50)] text-[var(--sky-600)] border border-[var(--sky-100)]">
                <CylinderGlyph className="w-3.5 h-5 text-[var(--sky-500)]" />
                <span className="text-sm font-bold tabular-nums">{cylindersLoaded}</span>
                <span className="text-[11px] font-medium">Loaded</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">ready for route</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                  <RouteGlyph className="w-4 h-4 text-orange-500 flex-shrink-0" />
                </div>
                <span className="text-xs font-bold text-gray-900">Stops</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <div className="text-3xl font-bold text-gray-900 leading-none tracking-[-0.04em] tabular-nums">{stopsRemaining}</div>
                <div className="text-[11px] font-semibold text-gray-500">left</div>
              </div>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i < stopsRemaining ? 'bg-orange-500' : 'bg-gray-100'}`} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-[var(--sky-50)] rounded-lg flex items-center justify-center">
                  <ShieldGlyph className="w-4 h-4 text-[var(--sky-500)] flex-shrink-0" />
                </div>
                <span className="text-xs font-bold text-gray-900">Checklist</span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <div className="text-3xl font-bold text-gray-900 leading-none tracking-[-0.04em] tabular-nums">
                  {checklistCompleted}
                </div>
                <div className="text-sm font-bold text-gray-400 tabular-nums">/{checklistTotal}</div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden mt-3">
                <div className="h-full bg-[var(--sky-500)] rounded-full" style={{ width: `${checklistPct}%` }} />
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="space-y-3">
            <Link href="/portal/pwa/dashboard/scan"
              className={`bg-white rounded-3xl border border-gray-200 p-4 shadow-sm flex items-center gap-4 hover:bg-gray-50 transition-colors ${!isSafeZone ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="w-12 h-12 rounded-[14px] bg-[var(--sky-500)] flex items-center justify-center flex-shrink-0 shadow-sm text-white">
                <ScanGlyph className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 mb-0.5">Scan Cylinder</div>
                <div className="text-xs text-gray-500 font-medium">{isSafeZone ? 'Tap to register via NFC' : 'Requires Safe Zone'}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </Link>
          </div>

          {/* Start Route Button */}
          <div className="pt-2">
            <Link href="/portal/pwa/dashboard/route"
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all duration-150 ${
                isReadyToStart
                  ? 'bg-[var(--sky-500)] text-white active:scale-[0.98] shadow-md hover:brightness-105'
                  : 'bg-gray-200 text-gray-500 pointer-events-none'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/></svg>
              <span>Start Route</span>
              <span className="text-xs font-semibold opacity-80 tabular-nums">· 4 stops</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
