'use client';

import React, { useState } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import WorkforceChart from './components/WorkforceChart';
import AttendanceCard from './components/AttendanceCard';
import LeaveRequestsList from './components/LeaveRequestsList';
import AnniversaryBanner from './components/AnniversaryBanner';
import OnboardingCTA from './components/OnboardingCTA';

const initialEmployees = [
  { id: 'EMP-001', name: 'Rizal Firmansyah', role: 'PRMS Mother Station Engineer', dept: 'Engineering & SCADA', stat: 'Active', sio: 'SIO-ATEX-2025-089', expiry: 'Aug 2027' },
  { id: 'EMP-002', name: 'Dian Prasetyo', role: 'Senior Skid Fleet Driver', dept: 'Skid Fleet & Drivers', stat: 'Active', sio: 'SIO-ATEX-2024-112', expiry: 'Dec 2026' },
  { id: 'EMP-003', name: 'Siti Aminah', role: 'Corporate Treasury Lead', dept: 'Finance & Treasury', stat: 'Active', sio: 'N/A (Office)', expiry: 'N/A' },
  { id: 'EMP-004', name: 'Bagus Setiawan', role: 'SCADA & IoT System Lead', dept: 'Engineering & SCADA', stat: 'Active', sio: 'SIO-MIGAS-2025-014', expiry: 'Oct 2027' },
  { id: 'EMP-005', name: 'Ahmad Fauzi', role: 'Heavy Skid Driver (Tube Trailer)', dept: 'Skid Fleet & Drivers', stat: 'Active', sio: 'SIO-ATEX-2026-003', expiry: 'Jan 2028' },
  { id: 'EMP-006', name: 'Dewi Rahayu', role: 'QHSE & MIGAS Compliance Lead', dept: 'QHSE Compliance', stat: 'Active', sio: 'SIO-HSE-2023-441', expiry: 'Nov 2026' },
];

export default function HRDashboardPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', name: '', role: '', dept: 'Skid Fleet & Drivers', stat: 'Active', sio: 'SIO-ATEX-2026-100', expiry: 'Jul 2028' });
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const handleOpenModal = (mode: 'create' | 'edit', emp: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && emp) {
      setFormData(emp);
    } else {
      setFormData({ id: `EMP-00${Math.floor(7 + Math.random() * 90)}`, name: '', role: 'Skid Driver ATEX', dept: 'Skid Fleet & Drivers', stat: 'Active', sio: 'SIO-ATEX-2026-200', expiry: 'Aug 2028' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.name || !formData.role) return alert('Nama Personel dan Jabatan wajib diisi!');
    if (modalMode === 'create') {
      setEmployees([formData, ...employees]);
    } else {
      setEmployees(employees.map(e => e.id === formData.id ? formData : e));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data personel ${name} dari direktori PT Baskara Asri Ghas?`)) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleTriggerAudit = () => {
    setIsAuditing(true);
    setAuditSuccess(false);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditSuccess(true);
      setTimeout(() => setAuditSuccess(false), 4000);
    }, 1500);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.sio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      {/* Top Header */}
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
              QHSE &amp; SIO Synced
            </span>
          </div>
        }
      />

      {/* Gold Benchmark Spacing: pt-10 pb-12 space-y-8 */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full">
        {/* EXECUTIVE HR & ATEX CERTIFICATION HERO BANNER (Standardized with Stasiun) */}
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
              Pusat kendali 412 personel operasional dan staf korporat, pemantauan masa berlaku lisensi SIO ATEX pengemudi Skid Tank, manajemen rotasi shift 24 jam Mother Station, serta otomatisasi klaim BPJS &amp; tunjangan bahaya gas.
            </p>
          </div>

          <button
            onClick={handleTriggerAudit}
            disabled={isAuditing || auditSuccess}
            className={`px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap z-10 self-stretch sm:self-auto justify-center disabled:cursor-not-allowed ${
              auditSuccess
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-950/50'
                : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-purple-500/30'
            }`}
          >
            {isAuditing ? (
              <>
                <Icon name="ArrowPathIcon" size={18} className="animate-spin text-white" />
                <span>Auditing SIO Licenses...</span>
              </>
            ) : auditSuccess ? (
              <>
                <Icon name="CheckCircleIcon" size={18} className="text-white" />
                <span>100% SIO Validated</span>
              </>
            ) : (
              <>
                <Icon name="ShieldCheckIcon" size={18} />
                <span>Audit ATEX &amp; SIO Compliance</span>
              </>
            )}
          </button>
        </div>

        {/* ROW 1: EXECUTIVE HERO METRICS (4 CARDS) WITH FROSTED GLASSMORPHISM & ACCENT GLOWS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Card 1: Total Headcount */}
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
                412 <span className="text-sm font-bold text-purple-400 uppercase">Personel</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Pegawai Tetap &amp; Kontrak</span>
              <span className="text-emerald-400 font-bold">100% Onboarded</span>
            </div>
          </div>

          {/* Card 2: Shift Attendance Rate */}
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
              <span>397 Present · 8 Cuti</span>
              <span className="text-indigo-300 font-bold">Mother Station Valid</span>
            </div>
          </div>

          {/* Card 3: Active ATEX SIO Drivers */}
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
                148 <span className="text-sm font-bold text-fuchsia-400 uppercase">Drivers</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-fuchsia-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Prime Mover &amp; Skid Fleet</span>
              <span className="text-emerald-400 font-bold">100% Valid License</span>
            </div>
          </div>

          {/* Card 4: Monthly Payroll & Benefits */}
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

        {/* ROW 2: WORKFORCE ANALYTICS BENTO GRID (2 COLS CHART + 1 COL ATTENDANCE) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WorkforceChart />
          </div>
          <div className="lg:col-span-1">
            <AttendanceCard />
          </div>
        </div>

        {/* ROW 3: MILESTONES & ONBOARDING BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LeaveRequestsList />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6 justify-between">
            <AnniversaryBanner />
            <OnboardingCTA />
          </div>
        </div>

        {/* ROW 4: MASTER EMPLOYEE & SIO ATEX DIRECTORY (CRUD) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl overflow-hidden transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Master Employee &amp; SIO ATEX Certification Directory
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {filteredEmployees.length} Records Shown
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Kelola data kepegawaian, penugasan divisi operasional Mother Station, dan verifikasi masa berlaku sertifikat SIO ATEX MIGAS untuk pengemudi armada.
              </p>
            </div>

            {/* Toolbar Filter & Add Button */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="All">Semua Divisi ({employees.length})</option>
                <option value="Skid Fleet & Drivers">Skid Fleet &amp; Drivers</option>
                <option value="Engineering & SCADA">Engineering &amp; SCADA</option>
                <option value="QHSE Compliance">QHSE Compliance</option>
                <option value="Finance & Treasury">Finance &amp; Treasury</option>
              </select>

              <input
                type="text"
                placeholder="Cari nama atau nomor SIO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[200px]"
              />

              <button
                onClick={() => handleOpenModal('create')}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 shrink-0"
              >
                <Icon name="PlusIcon" size={15} />
                <span>Add Employee &amp; SIO</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Employee Name &amp; ID</th>
                  <th className="py-3 px-4">Role &amp; Position</th>
                  <th className="py-3 px-4">Department / Unit</th>
                  <th className="py-3 px-4">SIO ATEX / MIGAS No.</th>
                  <th className="py-3 px-4 text-center">SIO Expiry Date</th>
                  <th className="py-3 px-4 text-center">Employment Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {filteredEmployees.map((row) => (
                  <tr key={row.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors group">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400 font-black text-xs">
                          {row.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {row.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {row.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {row.role}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-[11px] whitespace-nowrap shrink-0">
                        {row.dept}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {row.sio}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        row.expiry.includes('2026') ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {row.expiry}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border whitespace-nowrap shrink-0 align-middle ${
                        row.stat === 'Active' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                        row.stat === 'Probation' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                        'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.stat === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span>{row.stat}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal('edit', row)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          title="Edit Employee & SIO"
                        >
                          <Icon name="PencilSquareIcon" size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id, row.name)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Employee"
                        >
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                      Tidak ada data personel atau sertifikat SIO yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {modalMode === 'create' ? 'Add New Employee &amp; SIO Record' : 'Edit Personnel Record'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Atur informasi kepegawaian dan nomor lisensi resmi ATEX / MIGAS.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Icon name="XMarkIcon" size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Employee Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-slate-400"
                  placeholder="e.g. Hendra Supriyadi"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-slate-400"
                    placeholder="e.g. Skid Fleet Driver"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <select
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Skid Fleet & Drivers">Skid Fleet &amp; Drivers</option>
                    <option value="Engineering & SCADA">Engineering &amp; SCADA</option>
                    <option value="QHSE Compliance">QHSE Compliance</option>
                    <option value="Finance & Treasury">Finance &amp; Treasury</option>
                    <option value="Horeca & Industrial Sales">Horeca &amp; Industrial Sales</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    SIO ATEX License No.
                  </label>
                  <input
                    type="text"
                    value={formData.sio}
                    onChange={(e) => setFormData({ ...formData, sio: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-purple-600 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="SIO-ATEX-2026-099"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    SIO Expiry Date
                  </label>
                  <input
                    type="text"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Aug 2028"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Employment Status
                </label>
                <select
                  value={formData.stat}
                  onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Active">Active (Tetap / SIO Valid)</option>
                  <option value="Probation">Probation (Masa Percobaan)</option>
                  <option value="Onboarding">Onboarding (Orientasi ATEX)</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95"
              >
                {modalMode === 'create' ? 'Save Employee & SIO' : 'Update Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}