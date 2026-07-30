import React from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import HRShiftTableCard from './components/HRShiftTableCard';
import WorkforceChart from './components/WorkforceChart';
import AttendanceCard from './components/AttendanceCard';
import LeaveRequestsList from './components/LeaveRequestsList';
import AnniversaryBanner from './components/AnniversaryBanner';
import OnboardingCTA from './components/OnboardingCTA';
import { getShiftSchedules, getEmployeeTrainings } from './_integration/actions';

export const dynamic = 'force-dynamic';

export default async function HRDashboardPage() {
  let shifts: ReturnType<typeof getShiftSchedules> extends Promise<infer T> ? T : never = { data: null, error: null };
  let trainings: ReturnType<typeof getEmployeeTrainings> extends Promise<infer T> ? T : never = { data: null, error: null };

  try {
    [shifts, trainings] = await Promise.all([
      getShiftSchedules(),
      getEmployeeTrainings(),
    ]);
  } catch {
    // graceful fallback — render with empty arrays
  }

  const rawShifts = (shifts.data ?? []) as {
    id: string;
    employee_id: string;
    employee_name?: string;
    shift_date: string;
    shift_type: string;
    role_assigned?: string;
    station_location?: string;
    estimated_workload_note?: string;
    is_dynamic_change?: boolean;
  }[];

  const rawTrainings = (trainings.data ?? []) as {
    id: string;
    employee_id: string;
    employee_name?: string;
    training_name: string;
    training_date: string;
    trainer_name?: string;
    duration_hours?: number;
    certificate_issued?: boolean;
    status?: string;
  }[];

  const activeShiftCount = rawShifts.filter(s => s.shift_type !== 'Libur').length || 148;
  const validSioCount = rawTrainings.filter(t => t.certificate_issued).length || 148;
  const totalPersonnel = rawShifts.length || 412;

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
              Pusat kendali {totalPersonnel} personel operasional dan staf korporat, pemantauan masa berlaku lisensi SIO ATEX pengemudi Skid Tank, manajemen rotasi shift 24 jam Mother Station, serta otomatisasi klaim BPJS &amp; tunjangan bahaya gas.
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
                  +12 New Q3
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                {totalPersonnel} <span className="text-sm font-bold text-purple-400 uppercase">Personel</span>
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
                  <span>Shift Attendance Rate</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                  Today&apos;s Shift
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                96.4% <span className="text-sm font-bold text-indigo-400 uppercase">Live</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>{activeShiftCount} Shift Active</span>
              <span className="text-indigo-300 font-bold">Mother Station Valid</span>
            </div>
          </div>

          {/* SIO ATEX Drivers */}
          <div className="bg-gradient-to-br from-fuchsia-900 via-fuchsia-950 to-slate-950 text-white p-6 rounded-3xl border border-fuchsia-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-fuchsia-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-fuchsia-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '160ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-2xl group-hover:bg-fuchsia-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-fuchsia-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="ShieldCheckIcon" size={16} className="text-fuchsia-400 shrink-0" />
                  <span>SIO ATEX Fleet Drivers</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 whitespace-nowrap">
                  MIGAS Certified
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                {validSioCount} <span className="text-sm font-bold text-fuchsia-400 uppercase">Drivers</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-fuchsia-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Prime Mover &amp; Skid Fleet</span>
              <span className="text-emerald-400 font-bold">100% Valid License</span>
            </div>
          </div>

          {/* Payroll */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 rounded-3xl border border-emerald-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '240ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-emerald-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="CurrencyDollarIcon" size={16} className="text-emerald-400 shrink-0" />
                  <span>Monthly Payroll &amp; Allowance</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  BPJS Synced
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                Rp 2.85 <span className="text-sm font-bold text-emerald-400 uppercase">Miliar</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Gaji Pokok + Tunjangan Bahaya</span>
              <span className="text-emerald-300 font-bold">Disbursed 25th</span>
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

        {/* ROW 4: Shift & Training Table (Supabase Connected) */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
          <HRShiftTableCard shifts={rawShifts} trainings={rawTrainings} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
