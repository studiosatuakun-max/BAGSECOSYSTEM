'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Truck, CheckCircle2, XCircle, Clock, Shield } from 'lucide-react';

type ConnectionStatus = 'connected' | 'disconnected' | 'standby';

interface TruckSession {
  id: string;
  plateNumber: string;
  driverName: string;
  bayNumber: string;
  connectedAt: string;
  resistanceOhm: number;
  status: ConnectionStatus;
}

const MOCK_SESSION: TruckSession = {
  id: 'truck-bay1-session-001',
  plateNumber: 'B 3847 GAH',
  driverName: 'Rizal Firmansyah',
  bayNumber: 'Bay 1 Filling Shed',
  connectedAt: '06:18:44',
  resistanceOhm: 4.7,
  status: 'connected',
};

export default function GroundingInterlockCard() {
  const [session, setSession] = useState<TruckSession>(MOCK_SESSION);
  const [elapsed, setElapsed] = useState('04:28');
  const [resistance, setResistance] = useState(4.7);
  const [pulseTick, setPulseTick] = useState(false);

  useEffect(() => {
    const connectedSince = new Date('2026-07-20T06:18:44');
    const interval = setInterval(() => {
      const now = new Date('2026-07-20T06:23:12');
      const diffMs = now.getTime() - connectedSince.getTime() + (Date.now() % 60000);
      const mins = Math.floor(diffMs / 60000);
      const secs = Math.floor((diffMs % 60000) / 1000);
      setElapsed(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
      const ohm = parseFloat((4.7 + ((Date.now() / 3000) % 0.6)).toFixed(1));
      setResistance(ohm);
      setPulseTick((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isConnected = session.status === 'connected';
  const isResistanceSafe = resistance < 10;

  return (
    <div className="h-full flex flex-col justify-between gap-5 p-6 rounded-3xl border transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-emerald-500/50">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
            <Zap size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">Static Grounding Monitor</h2>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">SGM-101 · Interlock Active</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full border whitespace-nowrap shrink-0 align-middle shadow-2xs ${
            isConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
          }`}
        >
          {isConnected ? <CheckCircle2 size={13} className="text-emerald-500" /> : <XCircle size={13} className="text-rose-500" />}
          <span>{isConnected ? 'GROUNDED OK' : 'OPEN CIRCUIT'}</span>
        </span>
      </div>

      {/* Connection status visual */}
      <div className="flex items-center justify-center py-2 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/80">
        <div className="relative flex items-center gap-5">
          {/* Ground symbol */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
              <Shield size={18} className="text-slate-600 dark:text-slate-300" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Earth Pit</span>
          </div>

          {/* Connection line */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex items-center">
              <div className={`h-1 w-14 rounded-full transition-colors duration-500 ${isConnected ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
              {isConnected && (
                <span className={`absolute left-1/2 -translate-x-1/2 -top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-500/50 transition-opacity duration-500 ${pulseTick ? 'opacity-100 scale-125' : 'opacity-40 scale-100'}`} />
              )}
            </div>
            <span className={`text-xs font-black font-mono ${isConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {resistance.toFixed(1)} Ω
            </span>
          </div>

          {/* Truck */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-colors duration-500 shadow-sm ${
                isConnected
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-600 dark:text-emerald-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <Truck size={18} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Skid Truck</span>
          </div>
        </div>
      </div>

      {/* Truck details */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">Vehicle Plate</span>
          <span className="font-extrabold text-slate-900 dark:text-white tabular-nums font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{session.plateNumber}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">ATEX Driver</span>
          <span className="font-extrabold text-slate-900 dark:text-white">{session.driverName}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">Assigned Bay</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0 align-middle">
            {session.bayNumber}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">Connected At</span>
          <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums font-mono">{session.connectedAt}</span>
        </div>
      </div>

      {/* Elapsed + resistance status */}
      <div className="flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Clock size={14} className="text-indigo-500" />
          <span>Duration:</span>
          <span className="tabular-nums font-black text-slate-900 dark:text-white font-mono">{elapsed}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full inline-block ${isResistanceSafe ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}`} />
          <span className={isResistanceSafe ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-amber-600 dark:text-amber-400 font-extrabold'}>
            {isResistanceSafe ? 'Safe ≤ 10Ω' : 'Check Resistance'}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>API RP 2003 Compliant</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Interlock Engaged</span>
        </span>
      </div>
    </div>
  );
}