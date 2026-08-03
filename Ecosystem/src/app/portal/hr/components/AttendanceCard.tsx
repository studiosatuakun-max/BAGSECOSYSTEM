'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { UserCheck, Clock, ShieldCheck } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

const attendanceTrend = [
  { day: 'Mon', present: 395, absent: 5, leave: 12 },
  { day: 'Tue', present: 402, absent: 3, leave: 7 },
  { day: 'Wed', present: 398, absent: 6, leave: 8 },
  { day: 'Thu', present: 405, absent: 2, leave: 5 },
  { day: 'Fri', present: 397, absent: 7, leave: 8 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl px-3.5 py-2.5 text-xs min-w-[150px]">
        <p className="font-extrabold text-slate-900 dark:text-white mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
          Shift {label} Telemetry
        </p>
        {payload.map((p) => (
          <div key={`tip-${p.name}`} className="flex justify-between items-center my-1 font-medium text-slate-600 dark:text-slate-400">
            <span>{p.name}:</span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">{p.value} org</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AttendanceCard() {
  const [presentCount, setPresentCount] = useState(397);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const handleWristbandScanned = () => {
      setPresentCount(prev => prev + 1);
    };
    socket.on('wristband_scanned', handleWristbandScanned);
    return () => {
      socket.off('wristband_scanned', handleWristbandScanned);
    };
  }, [socket]);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col justify-between h-full transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
              <UserCheck size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Shift Attendance Telemetry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Mother Station &amp; Skid Drivers
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 tabular-nums">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>96.4% Live</span>
            </span>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Today&apos;s Shift Rate
            </p>
          </div>
        </div>

        {/* 3 Pill Stats */}
        <div className="grid grid-cols-3 gap-2.5 text-xs mb-5">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3 text-center transition-all hover:scale-[1.02]">
            <p className="text-xl font-black tabular-nums text-emerald-700 dark:text-emerald-400">
              {presentCount}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-300 font-extrabold uppercase mt-0.5">Present / On Shift</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3 text-center transition-all hover:scale-[1.02]">
            <p className="text-xl font-black tabular-nums text-amber-700 dark:text-amber-400">8</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-300 font-extrabold uppercase mt-0.5">On Leave / Off</p>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-3 text-center transition-all hover:scale-[1.02]">
            <p className="text-xl font-black tabular-nums text-rose-700 dark:text-rose-400">7</p>
            <p className="text-[10px] text-rose-600 dark:text-rose-300 font-extrabold uppercase mt-0.5">Sick / Medical</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-40 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceTrend} barGap={4}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#cbd5e1', opacity: 0.15, radius: 6 }} />
              <Bar dataKey="present" radius={[6, 6, 0, 0]} name="Present">
                {attendanceTrend.map((entry) => (
                  <Cell
                    key={`att-${entry.day}`}
                    fill={entry.day === 'Fri' ? '#10B981' : '#6366F1'}
                    opacity={entry.day === 'Fri' ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span className="flex items-center gap-1.5">
          <Clock size={13} className="text-purple-600 dark:text-purple-400" />
          <span>Shift 1 &amp; 2 Handoff Logged</span>
        </span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
          <ShieldCheck size={13} />
          <span>SIO ATEX Valid</span>
        </span>
      </div>
    </div>
  );
}