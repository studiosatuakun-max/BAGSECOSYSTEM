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
  bayNumber: 'Bay 1',
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
    // Backend integration point: replace with WebSocket grounding interlock controller feed
    const connectedSince = new Date('2026-07-20T06:18:44');
    const interval = setInterval(() => {
      const now = new Date('2026-07-20T06:23:12');
      const diffMs = now.getTime() - connectedSince.getTime() + (Date.now() % 60000);
      const mins = Math.floor(diffMs / 60000);
      const secs = Math.floor((diffMs % 60000) / 1000);
      setElapsed(`${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`);
      // Slight resistance fluctuation
      const ohm = parseFloat((4.7 + ((Date.now() / 3000) % 0.6)).toFixed(1));
      setResistance(ohm);
      setPulseTick(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isConnected = session.status === 'connected';
  const isResistanceSafe = resistance < 10;

  return (
    <div className="card-safe h-full flex flex-col gap-4 p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
            <Zap size={18} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-sm font-700 text-foreground leading-tight">Static Grounding Monitor</h2>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">SGM-101 · Interlock Active</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-700 px-2.5 py-1 rounded-full border ${
          isConnected
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :'bg-rose-50 border-rose-200 text-rose-600'
        }`}>
          {isConnected
            ? <CheckCircle2 size={11} className="text-emerald-600" />
            : <XCircle size={11} className="text-rose-500" />
          }
          {isConnected ? 'GROUNDED' : 'OPEN'}
        </span>
      </div>

      {/* Connection status visual */}
      <div className="flex items-center justify-center py-3">
        <div className="relative flex items-center gap-3">
          {/* Ground symbol */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Shield size={16} className="text-slate-500" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Earth</span>
          </div>

          {/* Connection line */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex items-center">
              <div className={`h-0.5 w-10 rounded-full transition-colors duration-500 ${isConnected ? 'bg-primary' : 'bg-slate-300'}`} />
              {isConnected && (
                <span className={`absolute left-1/2 -translate-x-1/2 -top-2 w-2 h-2 rounded-full bg-primary transition-opacity duration-500 ${pulseTick ? 'opacity-100' : 'opacity-30'}`} />
              )}
            </div>
            <span className={`text-xs font-700 ${isConnected ? 'text-emerald-600' : 'text-slate-400'}`}>
              {resistance.toFixed(1)} Ω
            </span>
          </div>

          {/* Truck */}
          <div className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-colors duration-500 ${
              isConnected
                ? 'bg-emerald-50 border-emerald-300' :'bg-slate-50 border-slate-200'
            }`}>
              <Truck size={18} className={isConnected ? 'text-emerald-600' : 'text-slate-400'} />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Truck</span>
          </div>
        </div>
      </div>

      {/* Truck details */}
      <div className="bg-white/70 rounded-xl border border-emerald-100 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Plate No.</span>
          <span className="text-xs font-700 text-foreground tabular-nums font-mono">{session.plateNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Driver</span>
          <span className="text-xs font-700 text-foreground">{session.driverName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Loading Bay</span>
          <span className="text-xs font-600 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {session.bayNumber}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Connected At</span>
          <span className="text-xs font-700 text-foreground tabular-nums font-mono">{session.connectedAt}</span>
        </div>
      </div>

      {/* Elapsed + resistance status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Session</span>
          <span className="tabular-nums text-xs font-700 text-foreground font-mono">{elapsed}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full inline-block ${isResistanceSafe ? 'bg-primary pulse-safe' : 'bg-amber-500 pulse-alert'}`} />
          <span className={`text-xs font-700 ${isResistanceSafe ? 'text-emerald-600' : 'text-amber-600'}`}>
            {isResistanceSafe ? 'Safe ≤ 10Ω' : 'Check Resistance'}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">API RP 2003 Compliant</span>
        <span className="text-xs text-emerald-600 font-700">Interlock Engaged</span>
      </div>
    </div>
  );
}