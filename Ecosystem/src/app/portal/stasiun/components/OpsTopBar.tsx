'use client';
import React, { useState, useEffect } from 'react';
import { Activity, Shield, Wifi, AlertTriangle, Clock } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatDate(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function OpsTopBar() {
  const [timeStr, setTimeStr] = useState('06:23:12');
  const [dateStr, setDateStr] = useState('Sunday, 20 Jul 2026');
  const [tick, setTick] = useState(false);

  useEffect(() => {
    // Backend integration point: replace with WebSocket system time sync
    const interval = setInterval(() => {
      const now = new Date();
      setTimeStr(formatTime(now));
      setDateStr(formatDate(now));
      setTick(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors mr-1"
            >
              ← Back
            </Link>
            <div className="flex items-center gap-2 shrink-0">
              <AppLogo size={36} />
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-sm font-700 text-foreground tracking-tight">
                  Baskara Asri Ghas
                </span>
                <span className="text-xs text-muted-foreground font-medium tracking-wide">
                  Ops Monitor
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-border mx-1" />

            {/* Screen title */}
            <div className="hidden md:flex flex-col leading-none">
              <span className="text-base font-semibold text-foreground">
                HSSE Operations Dashboard
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Mother Station · Bay 1 Active
              </span>
            </div>
          </div>

          {/* Center: Status badges */}
          <div className="hidden lg:flex items-center gap-2">
            {/* ATEX Safe Zone */}
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-primary pulse-safe inline-block" />
              <Shield size={12} className="text-emerald-600" />
              <span className="text-xs font-600 text-emerald-700 tracking-wide">ATEX Safe Zone</span>
            </div>

            {/* System Online */}
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
              <Wifi size={12} className="text-emerald-600" />
              <span className="text-xs font-600 text-emerald-700">System Online</span>
            </div>

            {/* Active Alerts count */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
              <AlertTriangle size={12} className="text-amber-500" />
              <span className="text-xs font-600 text-amber-700">1 Advisory</span>
            </div>

            {/* Client Portal link */}
            <Link
              href="/client-portal"
              className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors"
            >
              <span className="text-xs font-600 text-blue-700">Client Portal →</span>
            </Link>
          </div>

          {/* Right: Live clock */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Activity indicator */}
            <div className="hidden sm:flex items-center gap-1.5">
              <Activity size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Live</span>
              <span className={`w-1.5 h-1.5 rounded-full bg-primary transition-opacity duration-500 ${tick ? 'opacity-100' : 'opacity-30'}`} />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-border" />

            {/* Clock */}
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-muted-foreground shrink-0" />
              <div className="flex flex-col items-end leading-none">
                <span className="tabular-nums text-sm font-700 text-foreground tracking-wider font-mono">
                  {timeStr}
                </span>
                <span className="text-xs text-muted-foreground font-medium hidden sm:block">
                  {dateStr}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}