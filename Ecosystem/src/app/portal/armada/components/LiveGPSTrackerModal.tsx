'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Navigation2, Activity, Clock, ShieldCheck, Radio } from 'lucide-react';

interface LiveGPSTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  truckData: any; // { plat: string, driver: string, type: 'CNF' | 'Horeca' }
}

export default function LiveGPSTrackerModal({ isOpen, onClose, truckData }: LiveGPSTrackerModalProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500); // Simulate connecting to IoT Gateway
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start bg-gradient-to-b from-slate-900/90 to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 drop-shadow-md">
              <Navigation2 className="text-cyan-400" />
              Live Fleet Telemetry
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm font-bold backdrop-blur">
                {truckData?.plat || 'L 9123 GAH'}
              </div>
              <div className="px-3 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-lg text-sm backdrop-blur">
                Driver: {truckData?.driver || 'Dian Prasetyo'}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-full text-slate-300 transition-colors pointer-events-auto backdrop-blur">
            <X size={20} />
          </button>
        </div>

        {/* MAP SIMULATION BACKGROUND */}
        <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
          {/* Simulated Grid / Map Texture */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Radio size={48} className="text-cyan-500/50 animate-ping mb-4" />
              <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase">Connecting to Teltonika GPS Gateway...</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Radar Sweeper */}
              <div className="absolute w-96 h-96 rounded-full border border-cyan-500/20" />
              <div className="absolute w-64 h-64 rounded-full border border-cyan-500/20" />
              <div className="absolute w-32 h-32 rounded-full border border-cyan-500/30 bg-cyan-500/5 animate-pulse" />
              
              {/* Truck Map Pin */}
              <div className="absolute z-10 flex flex-col items-center transform -translate-y-12 translate-x-16">
                <div className="bg-slate-900 border border-cyan-500 p-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-white whitespace-nowrap">{truckData?.plat || 'L 9123 GAH'}</span>
                  <span className="text-[10px] text-cyan-400 font-mono border-l border-slate-700 pl-2">65 km/h</span>
                </div>
                <MapPin className="text-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" size={32} fill="rgba(6,182,212,0.2)" />
              </div>
            </div>
          )}
        </div>

        {/* Telemetry Footer Overlays */}
        {!loading && (
          <div className="absolute bottom-6 left-6 right-6 z-20 grid grid-cols-3 gap-4">
            
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-xl">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Activity size={14} /> GPS Location</div>
              <div className="font-mono text-cyan-400 text-lg">LAT: -7.2504, LNG: 112.7688</div>
              <div className="text-sm text-slate-300 mt-1">Tol Surabaya - Gempol KM 12</div>
            </div>
            
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-xl">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Clock size={14} /> Journey Time</div>
              <div className="font-mono text-white text-xl">01h 24m 15s</div>
              <div className="text-sm text-emerald-400 mt-1 font-medium">ETA to Client: 14 mins</div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-xl">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><ShieldCheck size={14} /> Security Status</div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/30">Engine ON</div>
                <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/30">Doors LOCKED</div>
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">Last Sync: 2 secs ago</div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
