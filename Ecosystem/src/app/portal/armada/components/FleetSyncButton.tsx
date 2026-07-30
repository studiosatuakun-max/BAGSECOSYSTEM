'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function FleetSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [done, setDone] = useState(false);

  const handle = () => {
    setIsSyncing(true);
    setDone(false);
    setTimeout(() => {
      setIsSyncing(false);
      setDone(true);
      setTimeout(() => setDone(false), 4000);
    }, 1500);
  };

  return (
    <button
      onClick={handle}
      disabled={isSyncing || done}
      className={`px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap z-10 self-stretch sm:self-auto justify-center disabled:cursor-not-allowed ${
        done
          ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-950/50'
          : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white shadow-cyan-500/30'
      }`}
    >
      {isSyncing ? (
        <>
          <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
          <span>Syncing Telemetry...</span>
        </>
      ) : done ? (
        <>
          <Icon name="CheckCircleIcon" size={18} />
          <span>Fleets Synchronized</span>
        </>
      ) : (
        <>
          <Icon name="BoltIcon" size={18} />
          <span>Sync Fleet Telemetry</span>
        </>
      )}
    </button>
  );
}
