import React from 'react';
import { workAnniversaries } from '@/lib/mockData';
import { Gift, Star } from 'lucide-react';

export default function AnniversaryBanner() {
  const upcoming = workAnniversaries?.sort((a, b) => a?.daysUntil - b?.daysUntil);

  return (
    <div className="card-elevated rounded-2xl p-4 mb-6 border-l-4 border-l-primary">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          <Gift size={16} className="text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-600 text-foreground">Upcoming Work Anniversaries</h3>
          <p className="text-[10px] text-muted-foreground">Next 12 months · {upcoming?.length} milestones</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {upcoming?.map((a) => (
          <div
            key={`anni-${a?.id}`}
            className="flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-2 hover:bg-secondary transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-700 text-primary">
                {a?.name?.split(' ')?.map((n) => n?.[0])?.join('')?.slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="text-xs font-600 text-foreground leading-none">{a?.name}</p>
              <p className="text-[10px] text-muted-foreground">{a?.date} · {a?.years} yrs</p>
            </div>
            <div className="flex items-center gap-0.5 ml-1">
              <Star size={10} className="text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-600 text-amber-600">{a?.years}yr</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}