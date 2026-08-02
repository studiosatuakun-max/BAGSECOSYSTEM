'use client';

import React from 'react';
import { Gift, Star } from 'lucide-react';

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
    <div className="rounded-3xl bg-gradient-to-br from-purple-900 via-purple-950 to-slate-950 p-6 text-white shadow-xl flex flex-col justify-between h-full relative overflow-hidden border border-purple-800/60 group hover:border-purple-500 transition-all duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/15 rounded-full blur-2xl group-hover:bg-purple-500/25 transition-all duration-500 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-fuchsia-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full min-h-0">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-purple-800/60">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300 font-bold">
            <Gift size={20} />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight">
              Work Anniversaries &amp; ATEX SIO Loyalty
            </h3>
            <p className="text-xs text-purple-300 font-medium">
              Q3 2026 Milestones · Penghargaan pengabdian armada &amp; Mother Station
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
          {upcomingAnniversaries.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/60 hover:border-amber-500/40 transition-all group/item"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-purple-800/50 border border-purple-700/50 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-purple-300 group-hover/item:text-amber-300 transition-colors">
                    {a.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate group-hover/item:text-amber-300 transition-colors">
                    {a.name}
                  </p>
                  <p className="text-[11px] text-purple-300/80 font-medium truncate">
                    {a.role} · <span className="text-purple-200 font-semibold">{a.date}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-full">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-extrabold text-amber-300 tabular-nums">
                  {a.years} Tahun
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}