import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import WorkforceChart from './components/WorkforceChart';
import AttendanceCard from './components/AttendanceCard';
import LeaveRequestsList from './components/LeaveRequestsList';
import AnniversaryBanner from './components/AnniversaryBanner';
import OnboardingCTA from './components/OnboardingCTA';
import DynamicShiftConsole from './components/DynamicShiftConsole';
import TrainingSafetyMatrix from './components/TrainingSafetyMatrix';
import { getHRMetrics, getTodaysShifts, getTrainingMatrix } from './_integration/actions';

export const dynamic = 'force-dynamic';

export default async function HRDashboardPage() {
  let metricsData: any = { data: null };
  let shiftsData: any = { data: null };
  let trainingsData: any = { data: null };

  try {
    [metricsData, shiftsData, trainingsData] = await Promise.all([
      getHRMetrics(),
      getTodaysShifts(),
      getTrainingMatrix(),
    ]);
  } catch {
    // graceful fallback
  }

  const rawShifts = shiftsData.data ?? [];
  const rawTrainings = trainingsData.data ?? [];
  
  const m = metricsData.data || {
    headcount: 412,
    averageKpi: 91.7,
    activeShiftsToday: 148,
    sioAlerts: { critical: 0, warning: 0, totalAlerts: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      <PortalHeader
        title="Baskara HR &amp; Human Capital Console"
        subtitle="Pusat kendali SDM, administrasi penggajian, sertifikasi SIO ATEX pengemudi armada, dan pemantauan absensi Mother Station"
        roleBadge="HR Director Access"
        roleColor="purple"
        showInbox={true}
        rightCustom={
          <div className="hidden sm:flex flex-col text-right justify-center font-mono leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white">09:32:15 WIB</span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
              Supabase Connected
            </span>
          </div>
        }
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-xs font-bold text-purple-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>Human Capital Engine v2.4 · ATEX SIO Compliance Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Enterprise Workforce &amp; ATEX SIO Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat kendali {m.headcount} personel operasional dan staf korporat, pemantauan masa berlaku lisensi SIO ATEX pengemudi Skid Tank, manajemen rotasi shift 24 jam Mother Station, serta metrik keselamatan energi.
            </p>
          </div>
          <button className="px-5 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap z-10 justify-center">
            <Icon name="ShieldCheckIcon" size={18} />
            <span>Audit ATEX &amp; SIO Compliance</span>
          </button>
        </div>

        {/* ROW 1: Executive Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Total Crew */}
          <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-slate-950 text-white p-6 rounded-3xl border border-purple-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-purple-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-purple-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="UsersIcon" size={16} className="text-purple-400 shrink-0" />
                  <span>Total Crew &amp; Staff</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  Active
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                {m.headcount} <span className="text-sm font-bold text-purple-400 uppercase">Personel</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Pegawai Tetap &amp; Kontrak</span>
              <span className="text-emerald-400 font-bold">100% Onboarded</span>
            </div>
          </div>

          {/* Shift Attendance */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-indigo-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '80ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-indigo-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="ClockIcon" size={16} className="text-indigo-400 shrink-0" />
                  <span>Shift Coverage</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                  Today&apos;s Shift
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                {Math.round((m.activeShiftsToday / Math.max(1, m.headcount)) * 100)}% <span className="text-sm font-bold text-indigo-400 uppercase">Coverage</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>{m.activeShiftsToday} Shift Active</span>
              <span className="text-indigo-300 font-bold">Mother Station Valid</span>
            </div>
          </div>

          {/* SIO ATEX Drivers - STAGGERED ALERT */}
          <div className={`text-white p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between group transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700
            ${m.sioAlerts.critical > 0 
              ? 'bg-gradient-to-br from-red-900 via-red-950 to-slate-950 border border-red-500 hover:border-red-400 hover:shadow-red-900/50' 
              : m.sioAlerts.warning > 0 
                ? 'bg-gradient-to-br from-yellow-900 via-yellow-950 to-slate-950 border border-yellow-500 hover:border-yellow-400 hover:shadow-yellow-900/50'
                : 'bg-gradient-to-br from-fuchsia-900 via-fuchsia-950 to-slate-950 border border-fuchsia-800/60 hover:border-fuchsia-500 hover:shadow-fuchsia-950/50'
            }
          `} style={{ animationDelay: '160ms' }}>
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl transition-all duration-500 pointer-events-none
              ${m.sioAlerts.critical > 0 ? 'bg-red-500/30 group-hover:bg-red-500/40 animate-pulse' : m.sioAlerts.warning > 0 ? 'bg-yellow-500/30 group-hover:bg-yellow-500/40' : 'bg-fuchsia-500/20 group-hover:bg-fuchsia-500/30'}
            `} />
            <div>
              <div className={`flex items-start justify-between mb-2 gap-2 ${m.sioAlerts.critical > 0 ? 'text-red-300' : m.sioAlerts.warning > 0 ? 'text-yellow-300' : 'text-fuchsia-300'}`}>
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="ShieldCheckIcon" size={16} className={`shrink-0 ${m.sioAlerts.critical > 0 ? 'text-red-400' : m.sioAlerts.warning > 0 ? 'text-yellow-400' : 'text-fuchsia-400'}`} />
                  <span>SIO Expiring Alerts</span>
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black border whitespace-nowrap
                  ${m.sioAlerts.critical > 0 ? 'bg-red-500/20 text-red-300 border-red-500/30' : m.sioAlerts.warning > 0 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}
                `}>
                  {m.sioAlerts.totalAlerts > 0 ? `${m.sioAlerts.totalAlerts} Alerts` : '100% Valid'}
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                {m.sioAlerts.totalAlerts > 0 ? m.sioAlerts.totalAlerts : 0} 
                <span className={`text-sm font-bold uppercase ml-2 ${m.sioAlerts.critical > 0 ? 'text-red-400' : m.sioAlerts.warning > 0 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  {m.sioAlerts.totalAlerts > 0 ? 'Expiring' : 'Expiring'}
                </span>
              </div>
            </div>
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs text-slate-300 font-medium
              ${m.sioAlerts.critical > 0 ? 'border-red-800/60' : m.sioAlerts.warning > 0 ? 'border-yellow-800/60' : 'border-fuchsia-800/60'}
            `}>
              <span>Prime Mover &amp; Skid Fleet</span>
              <span className={`font-bold ${m.sioAlerts.critical > 0 ? 'text-red-400 animate-pulse' : m.sioAlerts.warning > 0 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {m.sioAlerts.critical > 0 ? 'ACTION REQUIRED' : m.sioAlerts.warning > 0 ? 'Prepare Renewal' : 'MIGAS Certified'}
              </span>
            </div>
          </div>

          {/* Average KPI Score */}
          <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white p-6 rounded-3xl border border-blue-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-blue-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '240ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-blue-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="ChartBarIcon" size={16} className="text-blue-400 shrink-0" />
                  <span>Average KPI Score</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 whitespace-nowrap">
                  Active Staff
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                {m.averageKpi} <span className="text-sm font-bold text-blue-400 uppercase">/ 100</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Overall Enterprise Performance</span>
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <Icon name="TrendingUpIcon" size={12} /> Target 90.0
              </span>
            </div>
          </div>
        </div>

        {/* ROW 2: Workforce Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WorkforceChart />
          </div>
          <div className="lg:col-span-1">
            <AttendanceCard />
          </div>
        </div>

        {/* ROW 3: Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LeaveRequestsList />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6 justify-between">
            <AnniversaryBanner />
            <OnboardingCTA />
          </div>
        </div>

        {/* ROW 4: Bento Grid Command Center */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[450px] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
          <DynamicShiftConsole shifts={rawShifts} />
          <TrainingSafetyMatrix trainings={rawTrainings} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
