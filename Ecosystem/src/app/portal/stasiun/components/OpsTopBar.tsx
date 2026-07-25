'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, Clock } from 'lucide-react';
import PortalHeader from '@/components/PortalHeader';

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
      setTick(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PortalHeader
      title="Stasiun CNG"
      subtitle="Mother Station · Bay 1 Active"
      roleBadge="ATEX Safe Zone"
      roleColor="emerald"
      showInbox={true}
      rightCustom={
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-full px-2.5 py-1">
            <Wifi size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-muted-foreground shrink-0" />
            <div className="flex flex-col items-end leading-none font-mono">
              <span className="tabular-nums text-xs font-bold text-foreground tracking-wider">
                {timeStr}
              </span>
              <span className="text-[9px] text-muted-foreground font-medium hidden lg:block">
                {dateStr}
              </span>
            </div>
          </div>
        </div>
      }
    />
  );
}