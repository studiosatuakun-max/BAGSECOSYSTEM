'use client';

import { useState } from 'react';

interface Cylinder {
  id: string; gasType: string; weight: string; status: string; scannedAt: string;
}

const initialCylinders: Cylinder[] = [
  { id: 'CYL-4821', gasType: 'LPG', weight: '47.5 kg', status: 'Loaded', scannedAt: '07:52' },
  { id: 'CYL-3304', gasType: 'Propane', weight: '22.0 kg', status: 'Loaded', scannedAt: '07:55' },
  { id: 'CYL-7719', gasType: 'Butane', weight: '15.0 kg', status: 'Loaded', scannedAt: '07:58' },
  { id: 'CYL-2201', gasType: 'LPG', weight: '47.5 kg', status: 'Loaded', scannedAt: '08:01' },
];

const gasColors: Record<string, { text: string; bg: string; chipText: string; chipBg: string }> = {
  LPG:      { text: '#059669', bg: '#ECFDF5', chipText: '#059669', chipBg: '#D1FAE5' },
  Propane:  { text: '#D97706', bg: '#FEF3C7', chipText: '#D97706', chipBg: '#FDE68A' },
  Butane:   { text: '#7C3AED', bg: '#F5F3FF', chipText: '#7C3AED', chipBg: '#EDE9FE' },
};

export default function CylinderScanPage() {
  const isSafeZone = true;
  const [isScanning, setIsScanning] = useState(false);
  const [cylinders, setCylinders] = useState<Cylinder[]>(initialCylinders);

  const simulateScan = async () => {
    if (!isSafeZone || isScanning) return;
    setIsScanning(true);
    await new Promise(r => setTimeout(r, 1200));
    const gasTypes = ['LPG', 'Propane', 'Butane'];
    const weights = ['47.5 kg', '22.0 kg', '15.0 kg'];
    const idx = cylinders.length % 3;
    setCylinders(prev => [
      { id: `CYL-${8000 + prev.length * 111}`, gasType: gasTypes[idx], weight: weights[idx], status: 'Loaded', scannedAt: '08:15' },
      ...prev,
    ]);
    setIsScanning(false);
  };

  return (
    <div className="relative flex flex-col h-full bg-[#FAFAFA] overflow-hidden">
      
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pb-4 bg-white border-b border-gray-200 relative z-10 flex-shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}
      >
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Cylinder Scan</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">NFC · Tap to register load</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-[var(--sky-50)] border border-[var(--sky-100)]">
          <span className="text-xs font-bold text-[var(--sky-600)] tabular-nums">{cylinders.length} Scanned</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-36 relative z-10 pt-4 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

        {/* Scanner */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm mb-6 flex flex-col items-center relative overflow-hidden">

          <button onClick={simulateScan} disabled={!isSafeZone || isScanning}
            className="relative w-32 h-32 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
          >
            {isSafeZone && !isScanning && (
              <div className="absolute inset-0 rounded-full border-2 border-[var(--sky-200)] animate-ping" />
            )}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all z-10 shadow-md ${
              isScanning
                ? 'bg-orange-500 text-white'
                : isSafeZone
                  ? 'bg-[var(--sky-500)] text-white shadow-lg'
                  : 'bg-gray-200 text-gray-400'
            }`}>
              {isScanning ? (
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 7V2h5M17 2h5v5M22 17v5h-5M7 22H2v-5"/><rect x="7" y="7" width="10" height="10" rx="2"/>
                </svg>
              )}
            </div>
          </button>

          <div className="mt-6 flex flex-col items-center text-center">
            <span className="text-sm font-bold text-gray-900">
              {isScanning ? 'Reading NFC tag...' : isSafeZone ? 'Tap Cylinder to Scan' : 'Scanner Disabled'}
            </span>
            <span className={`text-xs mt-1.5 font-medium ${isSafeZone ? 'text-gray-500' : 'text-red-500'}`}>
              {isSafeZone ? 'Hold device within 5cm of the tag' : 'Move to a loading zone to enable scanner'}
            </span>
          </div>
        </div>

        <div className="text-sm font-bold text-gray-900 mb-3 px-1">Scan History</div>

        <div className="space-y-3">
          {cylinders.map((cyl, i) => {
            const color = gasColors[cyl.gasType] || gasColors.LPG;
            return (
              <div key={`${cyl.id}-${i}`}
                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: color.bg }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="2" width="12" height="20" rx="3"/><path d="M12 6v4M10 22h4"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-gray-900 tabular-nums tracking-tight">{cyl.id}</span>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-xs text-gray-500 font-medium">{cyl.gasType}</span>
                  </div>
                  <div className="text-xs text-gray-500 tabular-nums">
                    {cyl.weight} · {cyl.scannedAt}
                  </div>
                </div>
                <div 
                  className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: color.chipBg, color: color.chipText }}
                >
                  {cyl.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
