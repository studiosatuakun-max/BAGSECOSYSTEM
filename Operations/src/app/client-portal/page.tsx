import React from 'react';
import ClientPortalHeader from './components/ClientPortalHeader';
import SkidTankPressureCard from './components/SkidTankPressureCard';
import ConsumptionTrendCard from './components/ConsumptionTrendCard';
import LatestInvoiceCard from './components/LatestInvoiceCard';
import EmergencyRefillCard from './components/EmergencyRefillCard';

export default function ClientPortalDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <ClientPortalHeader />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 pb-10">
        {/*
          Bento Grid:
          Row 1: SkidTankPressure (span-3) | EmergencyRefill (span-1)
          Row 2: ConsumptionTrend (span-2) | LatestInvoice (span-2)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">

          {/* Wide Main Card: Real-time Skid Tank Pressure */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 animate-fade-in" style={{ animationDelay: '0ms' }}>
            <SkidTankPressureCard />
          </div>

          {/* Action Card: Emergency Refill Request */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 animate-fade-in" style={{ animationDelay: '80ms' }}>
            <EmergencyRefillCard />
          </div>

          {/* Small Card: Consumption Trend */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 animate-fade-in" style={{ animationDelay: '160ms' }}>
            <ConsumptionTrendCard />
          </div>

          {/* Small Card: Latest Invoice */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 animate-fade-in" style={{ animationDelay: '240ms' }}>
            <LatestInvoiceCard />
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium tracking-wide">PT Baskara Asri Ghas — Client Portal v1.0</span>
          <span>Secure Connection · Data refreshed every 30s</span>
        </div>
      </main>
    </div>
  );
}
