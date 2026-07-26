'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, Clock } from 'lucide-react';
import PortalHeader from '@/components/PortalHeader';
import Icon from '@/components/ui/AppIcon';

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
    const interval = setInterval(() => {
      const now = new Date();
      setTimeStr(formatTime(now));
      setDateStr(formatDate(now));
      setTick((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PortalHeader
      title="Stasiun CNG"
      subtitle="Mother Station Production & Compression · Bay 1 Active"
      roleBadge="ATEX Zone 1 Safe Area"
      roleColor="emerald"
      showInbox={true}
      rightCustom={
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1 whitespace-nowrap shrink-0 align-middle shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Wifi size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300">SCADA Online</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0">
            <Clock size={14} className="text-slate-500 dark:text-slate-400 shrink-0" />
            <div className="flex flex-col items-end leading-none font-mono">
              <span className="tabular-nums text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                {timeStr}
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold hidden lg:block mt-0.5">
                {dateStr}
              </span>
            </div>
          </div>
        </div>
      }
    />
  );
}