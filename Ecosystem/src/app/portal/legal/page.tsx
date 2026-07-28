'use client';

import React, { useState, useMemo } from 'react';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import LegalComplianceTableCard from './components/LegalComplianceTableCard';
import { toast } from 'sonner';

// Import our 5 new B2B Legal, MIGAS & SLA bento components
import ContractStatusChart from './components/ContractStatusChart';
import MigasPermitsCard from './components/MigasPermitsCard';
import HseComplianceScoreCard from './components/HseComplianceScoreCard';
import SlaBreachRadarCard from './components/SlaBreachRadarCard';
import LegalCounselAdviceCard from './components/LegalCounselAdviceCard';

interface LegalContract {
  id: string;
  party: string;
  type: 'Custody Transfer SLA' | 'MIGAS Government Permit' | 'Vendor Supply Agreement' | 'QHSE Safety Audit Cert';
  val: string;
  expiry: string;
  stat: 'Active' | 'Expiring Soon' | 'Under Legal Review' | 'Expired';
  counsel: string;
}

const initialContracts: LegalContract[] = [
  {
    id: 'LEG-CNG-2026-001',
    party: 'PT Unilever Indonesia Tbk (Cikarang Factory)',
    type: 'Custody Transfer SLA',
    val: 'Rp 14.500.000.000 / thn',
    expiry: 'Aug 15, 2028 · Valid',
    stat: 'Active',
    counsel: 'Dr. Hendra Gunawan, SH (Lead Legal)',
  },
  {
    id: 'LEG-CNG-2026-002',
    party: 'Kementerian ESDM — Direktorat Jenderal Migas',
    type: 'MIGAS Government Permit',
    val: 'Izin Usaha Niaga Bumi',
    expiry: 'Dec 31, 2028 · Valid',
    stat: 'Active',
    counsel: 'Anita Rahmawati, SH, LLM (Compliance)',
  },
  {
    id: 'LEG-CNG-2026-003',
    party: 'PT Pertamina Gas Negara Tbk (PGN Transmission)',
    type: 'Vendor Supply Agreement',
    val: '50.000 Sm³ / hari Quota',
    expiry: 'Sep 10, 2026 · < 45 Days',
    stat: 'Expiring Soon',
    counsel: 'Dr. Hendra Gunawan, SH (Lead Legal)',
  },
  {
    id: 'LEG-CNG-2026-004',
    party: 'PT SUCOFINDO — Metrologi & ATEX Inspectorate',
    type: 'QHSE Safety Audit Cert',
    val: '250 Bar Manifold Calibration',
    expiry: 'Oct 30, 2026 · Valid',
    stat: 'Active',
    counsel: 'Bambang Soemantri, SH (HSE Counsel)',
  },
  {
    id: 'LEG-CNG-2026-005',
    party: 'PT Indofood CBP Sukses Makmur Tbk',
    type: 'Custody Transfer SLA',
    val: 'Rp 18.200.000.000 / thn',
    expiry: 'Aug 01, 2026 · Adendum Price',
    stat: 'Under Legal Review',
    counsel: 'Anita Rahmawati, SH, LLM (Compliance)',
  },
];

export default function LegalDashboardPage() {
  
  
  

  // Modal State
  
  
  

  const handleOpenModal = (mode: 'create' | 'edit', contract?: LegalContract) => {
    setModalMode(mode);
    if (mode === 'edit' && contract) {
      setFormData(contract);
    } else {
      setFormData({
        id: `LEG-CNG-2026-00${Math.floor(6 + Math.random() * 90)}`,
        party: 'PT Indah Kiat Pulp & Paper Tbk',
        type: 'Custody Transfer SLA',
        val: 'Rp 22.500.000.000 / thn',
        expiry: 'Dec 15, 2028 · Valid',
        stat: 'Active',
        counsel: 'Dr. Hendra Gunawan, SH (Lead Legal)',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.party || !formData.expiry) {
      toast.error('Gagal Menyimpan', { description: 'Nama Pihak / Mitra dan Tanggal Kadaluwarsa wajib diisi.' });
      return;
    }
    if (modalMode === 'create') {
      setContracts([formData, ...contracts]);
      toast.success('Kontrak Hukum Ditambahkan', {
        description: `${formData.id} bersama ${formData.party} berhasil didaftarkan ke arsip Legal & MIGAS.`,
      });
    } else {
      setContracts(contracts.map((c) => (c.id === formData.id ? formData : c)));
      toast.success('Kontrak Diperbarui', {
        description: `Perubahan status dan spesifikasi hukum untuk ${formData.id} berhasil disimpan.`,
      });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan kontrak hukum atau SLA ini dari sistem compliance?')) {
      setContracts(contracts.filter((c) => c.id !== id));
      toast.info('Kontrak Dihapus', { description: `Nomor arsip ${id} telah dihapus dari log Legal & Compliance.` });
    }
  };

  const handleSyncMigas = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Menghubungkan ke Portal ESDM Ditjen Migas & Sistem Metrologi Nasional...',
        success: 'Sertifikasi Izin Usaha Niaga Gas Bumi, kalibrasi Skid Tank, dan masa aktif SLA terverifikasi 100%!',
        error: 'Gagal menyinkronkan data dengan portal ESDM.',
      }
    );
  };

  // Filtered Contracts
  

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Top Header */}
      <PortalHeader
        title="Legal & Compliance"
        subtitle="Contracts, SLAs, MIGAS Compliance & Permits"
        roleBadge="Legal Counsel Access"
        roleColor="indigo"
        showInbox={true}
        rightCustom={
          <div className="hidden sm:flex flex-col text-right justify-center font-mono leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white">MIGAS PORTAL OK</span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              18 Permits Active
            </span>
          </div>
        }
      />

      {/* Gold Benchmark Spacing & Width matching /portal/purchasing & /portal/hr */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1 w-full">
        {/* EXECUTIVE ACRYLIC HERO BANNER */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-xs font-bold text-indigo-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>MIGAS NIAGA BUMI COMPLIANT · ATEX ZONE 1 CERTIFIED · ZERO SLA BREACH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              Enterprise Legal, SLAs &amp; MIGAS Compliance Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Pusat manajemen kontrak suplai gas B2B Custody Transfer, perlindungan perizinan Izin Usaha Niaga Gas Bumi (ESDM Migas), kalibrasi metrologi legal Skid Manifold 250 Bar, serta pemantauan SLA dan audit HSE secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 z-10 self-stretch sm:self-auto justify-center">
            <button
              onClick={handleSyncMigas}
              className="px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2.5 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Icon name="ArrowPathIcon" size={18} className="animate-spin-hover text-white" />
              <span>Sync MIGAS &amp; ESDM Portal</span>
            </button>
            <button
              onClick={() => handleOpenModal('create')}
              className="px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Icon name="PlusIcon" size={18} className="text-indigo-300" />
              <span>New Contract / SLA</span>
            </button>
          </div>
        </div>

        {/* ROW 1: EXECUTIVE HERO METRICS (4 CARDS) WITH DEEP DARK ACRYLIC GRADIENTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Card 1: Active B2B Contracts & SLAs */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-indigo-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-indigo-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="DocumentTextIcon" size={16} className="text-indigo-400 shrink-0" />
                  <span>Active Contracts</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                  100% Enforced
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                85 <span className="text-sm font-bold text-indigo-400 uppercase">SLAs</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>B2B Industrial Client Agreements</span>
              <span className="text-indigo-400 font-bold">Verified</span>
            </div>
          </div>

          {/* Card 2: MIGAS & Gov Permits Valid */}
          <div className="bg-gradient-to-br from-purple-900 via-purple-950 to-slate-950 text-white p-6 rounded-3xl border border-purple-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-purple-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '80ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-purple-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="ShieldCheckIcon" size={16} className="text-purple-400 shrink-0" />
                  <span>Gov Permits Valid</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 whitespace-nowrap">
                  MIGAS &amp; Metrology
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                18 <span className="text-sm font-bold text-purple-400 uppercase">Permits</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Izin Niaga · ATEX · Kalibrasi Skid</span>
              <span className="text-purple-300 font-bold">100% Valid</span>
            </div>
          </div>

          {/* Card 3: QHSE Safety Audit Compliance */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 rounded-3xl border border-emerald-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '160ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-emerald-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="CheckBadgeIcon" size={16} className="text-emerald-400 shrink-0" />
                  <span>QHSE Safety Audit</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  Grade A+ Score
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                100% <span className="text-sm font-bold text-emerald-400 uppercase">Passed</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Mother Station &amp; Skid Manifolds</span>
              <span className="text-emerald-300 font-bold">Zero LTI</span>
            </div>
          </div>

          {/* Card 4: Urgent Renewals (< 30 Days) */}
          <div className="bg-gradient-to-br from-rose-900 via-rose-950 to-slate-950 text-white p-6 rounded-3xl border border-rose-800/60 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-rose-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-950/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '240ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/30 transition-all duration-500 pointer-events-none" />
            <div>
              <div className="flex items-start justify-between text-rose-300 mb-2 gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 mr-1 leading-tight">
                  <Icon name="ExclamationTriangleIcon" size={16} className="text-rose-400 shrink-0" />
                  <span>Urgent Expiry</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap animate-pulse">
                  Action Required
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums my-1">
                4 <span className="text-sm font-bold text-rose-400 uppercase">SLAs</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-800/60 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Renewal in drafting stage</span>
              <span className="text-rose-300 font-bold">&lt; 30 Days Alert</span>
            </div>
          </div>
        </div>

        {/* ROW 2: ASYMMETRIC 2:1 BENTO GRID (Breathing Room Matching Purchasing) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <ContractStatusChart />
          </div>
          <div className="col-span-1 lg:col-span-1">
            <MigasPermitsCard />
          </div>
        </div>

        {/* ROW 3: DETAIL CARDS BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <HseComplianceScoreCard />
          </div>
          <div className="col-span-1">
            <SlaBreachRadarCard />
          </div>
          <div className="col-span-1">
            <LegalCounselAdviceCard />
          </div>
        </div>

                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
          <LegalComplianceTableCard />
        </div>

      </main>

      <Footer />
    </div>
  );
}
