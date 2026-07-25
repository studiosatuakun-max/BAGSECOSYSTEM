import InboxWidget from '@/app/components/InboxWidget';
import React from 'react';
import OpsTopBar from './components/OpsTopBar';
import TelemetryChartCard from './components/TelemetryChartCard';
import LelAlertCard from './components/LelAlertCard';
import GroundingInterlockCard from './components/GroundingInterlockCard';
import CylinderNfcLogCard from './components/CylinderNfcLogCard';
import PressureDetailCard from './components/PressureDetailCard';
import FlowRateGaugeCard from './components/FlowRateGaugeCard';

export default function OpsHsseDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Bar */}
      <OpsTopBar />

      {/* Main Bento Grid */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 pb-8">
        {/*
          Bento Grid Plan (7 cards):
          grid-cols-4
          Row 1: TelemetryChart (span-2) | LEL Alert (span-1) | Grounding Interlock (span-1)
          Row 2: Cylinder NFC Log (span-2) | Pressure Detail (span-1) | Flow Rate Gauge (span-1)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 xl:gap-5">

          {/* Row 1 */}
          {/* Hero: Telemetry Chart — spans 2 columns */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 animate-fade-in" style={{ animationDelay: '0ms' }}>
            <TelemetryChartCard />
          </div>

          {/* LEL Alert Card */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1 animate-fade-in" style={{ animationDelay: '80ms' }}>
            <LelAlertCard />
          </div>

          {/* Grounding Interlock Card */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1 animate-fade-in" style={{ animationDelay: '160ms' }}>
            <GroundingInterlockCard />
          </div>

          {/* Row 2 */}
          {/* Cylinder NFC Log — spans 2 columns */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 animate-fade-in" style={{ animationDelay: '240ms' }}>
            <CylinderNfcLogCard />
          </div>

          {/* Pressure Detail Card */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1 animate-fade-in" style={{ animationDelay: '320ms' }}>
            <PressureDetailCard />
          </div>

          {/* Flow Rate Gauge Card */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <FlowRateGaugeCard />
          </div>

        </div>

        {/* Footer attribution */}
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium tracking-wide">BaskGhasOps Control System v2.4.1</span>
          <span>ATEX Zone 1 Compliant · IEC 60079 · Rev. 2026-07</span>
        </div>
      </main>
  {/* Enterprise Dispatch Inbox Widget */}
  <InboxWidget />
</div>
  );
}