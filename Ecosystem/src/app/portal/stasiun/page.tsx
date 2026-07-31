import { getMasterFuelingRecords } from './_integration/actions';
import MasterFuelingTableCard from './components/MasterFuelingTableCard';
import TelemetryChartCard from './components/TelemetryChartCard';
import LelAlertCard from './components/LelAlertCard';
import GroundingInterlockCard from './components/GroundingInterlockCard';
import PressureDetailCard from './components/PressureDetailCard';
import FlowRateGaugeCard from './components/FlowRateGaugeCard';
import UHFCylinderRfidLogCard from './components/UHFCylinderRfidLogCard';
import OpsTopBar from './components/OpsTopBar';
import Footer from '@/components/Footer';
import { MasterFuelingRecord } from './_integration/types';

export default async function OpsHsseDashboard() {
  let records: MasterFuelingRecord[] = [];
  try {
    const result = await getMasterFuelingRecords();
    records = (result.data ?? []) as unknown as MasterFuelingRecord[];
  } catch {
    records = [];
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <OpsTopBar />

      <main className="max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1">
        {/* EXECUTIVE HERO BANNER */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-xs font-bold text-emerald-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mother Station Filling Shed &middot; ATEX Zone 1 Safe Area</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Mother Station Production &amp; Quality Control Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Real-time SCADA telemetry monitoring for 3-stage CNG compressors, Coriolis mass flow rate (<code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300">kg/h</code>), ATEX Zone 1 gas leakage detection (LEL), electrostatic grounding interlocks, and 12Kg CNG / Cradle Tube-Skid NFC filling logs.
            </p>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '0ms' }}>
            <TelemetryChartCard />
          </div>

          <div className="col-span-1 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '150ms' }}>
            <LelAlertCard />
          </div>

          <div className="col-span-1 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '300ms' }}>
            <GroundingInterlockCard />
          </div>

          <div className="col-span-1 md:col-span-4 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '450ms' }}>
            <MasterFuelingTableCard initialRecords={records} />
          </div>

          <div className="col-span-1 md:col-span-2 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '600ms' }}>
            <UHFCylinderRfidLogCard />
          </div>

          <div className="col-span-1 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '750ms' }}>
            <PressureDetailCard />
          </div>

          <div className="col-span-1 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '900ms' }}>
            <FlowRateGaugeCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
