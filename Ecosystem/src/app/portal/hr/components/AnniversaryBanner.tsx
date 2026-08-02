'use client';

import React from 'react';
import { Gift, Star, Award } from 'lucide-react';

const upcomingAnniversaries = [
  {
    id: 'ann-01',
    name: 'Dian Prasetyo',
    role: 'Senior Skid Driver (ATEX SIO)',
    date: '12 Aug 2026',
    years: 5,
    milestone: 'Gold Loyalty Badge',
  },
  {
    id: 'ann-02',
    name: 'Ir. Agus Wibowo',
    role: 'Mother Station Plant Manager',
    date: '19 Aug 2026',
    years: 8,
    milestone: 'Diamond Leadership',
  },
  {
    id: 'ann-03',
    name: 'Dewi Rahayu',
    role: 'Head of HR & QHSE Compliance',
    date: '05 Sep 2026',
    years: 4,
    milestone: 'Silver Dedication',
  },
  {
    id: 'ann-04',
    name: 'Rizal Firmansyah',
    role: 'Skid Fleet Driver',
    date: '15 Sep 2026',
    years: 2,
    milestone: 'Bronze Milestone',
  },
  {
    id: 'ann-05',
    name: 'Siti Aminah',
    role: 'HSE Coordinator',
    date: '22 Sep 2026',
    years: 6,
    milestone: 'Gold Loyalty Badge',
  },
  {
    id: 'ann-06',
    name: 'Joko Widodo',
    role: 'Senior Maintenance Engineer',
    date: '01 Oct 2026',
    years: 10,
    milestone: 'Platinum Leadership',
  },
  {
    id: 'ann-07',
    name: 'Bagus Setiawan',
    role: 'Fleet Dispatcher',
    date: '12 Oct 2026',
    years: 3,
    milestone: 'Silver Dedication',
  }
];

export default function AnniversaryBanner() {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 font-bold">
          <Gift size={18} />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
            Work Anniversaries &amp; ATEX SIO Loyalty
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Q3 2026 Milestones · Penghargaan pengabdian armada &amp; Mother Station
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[180px] pr-1">
        {upcomingAnniversaries.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-black text-purple-600 dark:text-purple-400">
                  {a.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {a.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  {a.role} · <span className="text-slate-700 dark:text-slate-300 font-semibold">{a.date}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 px-2.5 py-1 rounded-full">
              <Star size={11} className="text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 tabular-nums">
                {a.years} Tahun
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}