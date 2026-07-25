import React from 'react';
import { Bell, Flame } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

export default function DashboardHeader() {
  return (
    <header className="pt-6 pb-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AppLogo size={36} />
          <span className="font-extrabold text-lg text-foreground tracking-tight">
            HorecaGas
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Backend: fetch unread notification count */}
          <button
            aria-label="Notifications"
            className="relative p-2.5 rounded-2xl bg-card border border-border card-shadow hover:bg-muted transition-all duration-150 active:scale-95"
          >
            <Bell size={20} className="text-foreground" strokeWidth={1.8} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-card" />
          </button>
        </div>
      </div>
      {/* Greeting Row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-0.5">
            Good morning 👋
          </p>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Budi Santoso
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Warung Makan Barokah · Bandung
          </p>
        </div>

        {/* Loyalty Points Badge */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 bg-accent border border-lime-200 rounded-2xl px-3 py-2 card-shadow">
            <Flame size={16} className="text-accent-foreground" strokeWidth={2} />
            <div className="text-right">
              <p className="text-xs text-accent-foreground font-semibold leading-none tabular-nums">
                450 pts
              </p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                Loyalty
              </p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground pr-1">
            ≈ Rp 45.000 reward
          </p>
        </div>
      </div>
      {/* Quick Stats Strip */}
      <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { id: 'stat-orders', label: 'Orders Jul', value: '8', unit: 'cylinders' },
          { id: 'stat-next', label: 'Next Delivery', value: 'Today', unit: '14:00–16:00' },
          { id: 'stat-last', label: 'Last Verified', value: '2 days', unit: 'ago' },
        ]?.map((stat) => (
          <div
            key={stat?.id}
            className="flex-shrink-0 bg-card border border-border rounded-2xl px-3 py-2 card-shadow"
          >
            <p className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
              {stat?.label}
            </p>
            <p className="text-sm font-bold text-foreground tabular-nums leading-tight">
              {stat?.value}
            </p>
            <p className="text-[10px] text-muted-foreground whitespace-nowrap">
              {stat?.unit}
            </p>
          </div>
        ))}
      </div>
    </header>
  );
}