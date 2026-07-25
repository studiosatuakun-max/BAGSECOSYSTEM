'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RouteStop {
  id: string; name: string; address: string; eta: string; cylinders: number; status: string;
}

const initialStops: RouteStop[] = [
  { id: 'STOP-01', name: 'Harrington Industrial', address: '14 Forge Road, NW Industrial Park', eta: '09:20', cylinders: 3, status: 'Next Stop' },
  { id: 'STOP-02', name: 'Castlewood Depot', address: '88 Riverside Ave', eta: '10:05', cylinders: 2, status: 'Pending' },
  { id: 'STOP-03', name: 'Meridian Restaurant', address: '22 High Street', eta: '10:45', cylinders: 1, status: 'Pending' },
  { id: 'STOP-04', name: 'Oakfield Catering', address: '5 Market Square', eta: '11:30', cylinders: 2, status: 'Pending' },
];

export default function RouteMapPage() {
  const [stops] = useState<RouteStop[]>(initialStops);
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <div className="relative flex flex-col h-screen bg-[#FAFAFA] overflow-hidden">

      {/* Map area */}
      <div className="absolute inset-0 z-0 bg-gray-50">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--sky-500)" />
              <stop offset="100%" stopColor="var(--sky-400)" />
            </linearGradient>
          </defs>
          <path d="M100,150 C200,250 50,400 200,550 S300,700 250,850" fill="none" stroke="url(#routeGrad)" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 8" />

          {[{x: 100, y: 150}, {x: 145, y: 300}, {x: 200, y: 550}, {x: 260, y: 760}].map((pos, i) => (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r="18" fill="var(--sky-500)" opacity="0.12" className={i === 0 ? "animate-pulse" : ""} />
              <circle cx={pos.x} cy={pos.y} r="7" fill={i === 0 ? 'var(--sky-500)' : 'white'} stroke={i === 0 ? 'transparent' : 'var(--sky-500)'} strokeWidth="2.5" />
            </g>
          ))}
        </svg>
      </div>

      {/* Top App Bar */}
      <div
        className="absolute top-0 left-0 right-0 z-20"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}
      >
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </Link>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-gray-200 text-gray-900">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            <span className="text-xs font-bold tabular-nums">11:30 ETA</span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="bg-white rounded-t-3xl shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.15)] border-t border-gray-200 pt-3 px-2 pb-5">
          <div className="flex justify-center mb-5">
            <div className="w-12 h-1.5 rounded-full bg-gray-200" />
          </div>

          <div className="px-5 mb-5">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight tabular-nums">{stops.length} Stops</h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">Est. Total: 2h 30min · 8 cylinders</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--sky-50)] text-[var(--sky-600)] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
              </div>
            </div>
          </div>

          <div className="max-h-[260px] overflow-y-auto px-4 pb-2 space-y-2">
            {stops.map((stop, i) => (
              <div key={stop.id} className="bg-white rounded-2xl border border-gray-100 flex items-center gap-3 p-3 shadow-sm">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold tabular-nums ${
                  stop.status === 'Next Stop'
                    ? 'bg-[var(--sky-500)] text-white shadow-md'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate tracking-tight mb-0.5">{stop.name}</div>
                  <div className="text-xs text-gray-500 tabular-nums">{stop.cylinders} cyl · {stop.eta}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider uppercase ${
                  stop.status === 'Next Stop' 
                    ? 'bg-[var(--sky-100)] text-[var(--sky-600)]' 
                    : 'bg-gray-100 text-gray-500'
                }`}>{stop.status}</span>
              </div>
            ))}
          </div>

          <div className="px-5 mt-5">
            <button
              onClick={() => setIsNavigating(true)}
              className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isNavigating
                  ? 'bg-gray-200 text-gray-400 cursor-wait'
                  : 'bg-[var(--sky-500)] text-white shadow-md hover:brightness-105 active:scale-[0.98]'
              }`}
            >
              {isNavigating ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                  Navigating...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/></svg>
                  Start Navigation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
