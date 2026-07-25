'use client';

import { useState } from 'react';

interface Stop {
  id: string; name: string; address: string; eta: string; cylinders: number; status: string; label: string; isFavorite: boolean;
}

const initialStops: Stop[] = [
  { id: 'STOP-01', name: 'Harrington Industrial', address: '14 Forge Road, NW Industrial', eta: '09:20', cylinders: 3, status: 'Next Stop', label: 'STOP 1', isFavorite: true },
  { id: 'STOP-02', name: 'Castlewood Depot', address: '88 Riverside Ave', eta: '10:05', cylinders: 2, status: 'Pending', label: 'STOP 2', isFavorite: false },
  { id: 'STOP-03', name: 'Meridian Restaurant', address: '22 High Street', eta: '10:45', cylinders: 1, status: 'Pending', label: 'STOP 3', isFavorite: false },
  { id: 'STOP-04', name: 'Oakfield Catering', address: '5 Market Square', eta: '11:30', cylinders: 2, status: 'Pending', label: 'STOP 4', isFavorite: true },
];

export default function DeliveryStopsPage() {
  const [stops, setStops] = useState<Stop[]>(initialStops);
  const toggleFavorite = (i: number) => setStops(prev => prev.map((s, idx) => idx === i ? { ...s, isFavorite: !s.isFavorite } : s));

  const featured = stops[0];
  const remaining = stops.slice(1);

  return (
    <div className="relative flex flex-col h-full bg-[#FAFAFA] overflow-hidden">
      
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pb-4 bg-white border-b border-gray-200 relative z-10 flex-shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}
      >
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Delivery Stops</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Today · {stops.length} stops scheduled</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-36 relative z-10 pt-4 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="space-y-4">

          {/* Featured Stop */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-[var(--sky-50)] text-[var(--sky-600)] uppercase tracking-wider">{featured.status}</span>
                <button onClick={() => toggleFavorite(0)} className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={featured.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={featured.isFavorite ? "text-orange-500" : ""}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
              </div>

              <div>
                <div className="text-lg font-bold text-gray-900 tracking-tight leading-tight">{featured.name}</div>
                <div className="text-sm text-gray-500 mt-1.5 font-medium">{featured.address}</div>

                <div className="flex items-center gap-4 mt-5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">ETA</span>
                    <span className="text-xl font-bold text-gray-900 tabular-nums tracking-tight">{featured.eta}</span>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Load</span>
                    <span className="text-xl font-bold text-gray-900 tabular-nums tracking-tight">{featured.cylinders} cyl</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm font-bold text-gray-900 pt-2 px-1">Upcoming</div>

          {/* Grid Cards */}
          <div className="grid grid-cols-2 gap-3">
            {remaining.map((stop, index) => (
              <div key={stop.id}
                className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm flex flex-col justify-between min-h-[160px]"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stop.label}</span>
                  <button onClick={() => toggleFavorite(index + 1)} className="text-gray-400 hover:text-orange-500 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={stop.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={stop.isFavorite ? "text-orange-500" : ""}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </button>
                </div>

                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900 tracking-tight leading-snug mb-1 line-clamp-2">{stop.name}</div>
                  <div className="text-xs text-gray-500 truncate">{stop.address}</div>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div className="text-lg font-bold text-gray-900 tabular-nums tracking-tight leading-none">{stop.eta}</div>
                  <div className="text-xs text-gray-500 font-semibold tabular-nums">{stop.cylinders} cyl</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
