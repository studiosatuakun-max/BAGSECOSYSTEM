'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ConsumptionBarChart = dynamic(
  () => import('./ConsumptionBarChartInner'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[160px] w-full animate-pulse bg-muted rounded-xl" />
    ),
  }
);

const consumptionData = [
  { day: 'Mon 14', consumption: 312, date: '14 Jul' },
  { day: 'Tue 15', consumption: 287, date: '15 Jul' },
  { day: 'Wed 16', consumption: 334, date: '16 Jul' },
  { day: 'Thu 17', consumption: 298, date: '17 Jul' },
  { day: 'Fri 18', consumption: 356, date: '18 Jul' },
  { day: 'Sat 19', consumption: 241, date: '19 Jul' },
  { day: 'Sun 20', consumption: 189, date: '20 Jul' },
];

const totalWeek = consumptionData?.reduce((a, b) => a + b?.consumption, 0);
const avgDay = Math.round(totalWeek / consumptionData?.length);
const todayVsYesterday = consumptionData?.[6]?.consumption - consumptionData?.[5]?.consumption;

export { consumptionData };

export default function ConsumptionTrendCard() {
  const isDown = todayVsYesterday < 0;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-card p-5 card-hover fade-in h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Consumption Trend</p>
          <h3 className="text-base font-bold text-foreground">7-Day Gas Usage</h3>
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isDown ? 'bg-success-bg text-success-foreground' : 'bg-warning-bg text-warning-foreground'}`}>
          {isDown ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
          {Math.abs(todayVsYesterday)} m³ today
        </div>
      </div>
      <div className="flex-1">
        <ConsumptionBarChart data={consumptionData} />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
        <div>
          <p className="text-[11px] text-muted-foreground font-medium mb-0.5">Weekly Total</p>
          <p className="text-base font-bold text-foreground font-tabular">{totalWeek?.toLocaleString('id-ID')} m³</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-medium mb-0.5">Daily Average</p>
          <p className="text-base font-bold text-foreground font-tabular">{avgDay} m³/day</p>
        </div>
      </div>
    </div>
  );
}