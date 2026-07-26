'use client';

import React, { useState } from 'react';
import OpsTopBar from './components/OpsTopBar';
import Footer from '@/components/Footer';
import TelemetryChartCard from './components/TelemetryChartCard';
import LelAlertCard from './components/LelAlertCard';
import GroundingInterlockCard from './components/GroundingInterlockCard';
import CylinderNfcLogCard from './components/CylinderNfcLogCard';
import PressureDetailCard from './components/PressureDetailCard';
import FlowRateGaugeCard from './components/FlowRateGaugeCard';
import Icon from '@/components/ui/AppIcon';

interface InspectionLog {
  id: string;
  shift: string;
  operator: string;
  compressorPressure: string;
  lelCalibration: string;
  earthResistance: string;
  notes: string;
  timestamp: string;
}

export default function OpsHsseDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentLogs, setRecentLogs] = useState<InspectionLog[]>([
    {
      id: 'LOG-ATEX-001',
      shift: 'Shift 1 (06:00 - 14:00)',
      operator: 'Dian Prasetyo (SIO ATEX)',
      compressorPressure: '4.88 Bar (Nominal)',
      lelCalibration: 'Verified 0% (Catalytic Bead)',
      earthResistance: '4.7 Ω (Safe ≤ 10Ω)',
      notes: 'All 3-stage compressor valves lubricated. Tube-Skid Bay 1 grounding interlock functioning nominally.',
      timestamp: 'Today, 06:15 AM',
    },
  ]);

  const [formData, setFormData] = useState({
    shift: 'Shift 1 (06:00 - 14:00)',
    operator: 'Dian Prasetyo (SIO ATEX)',
    compressorPressure: '4.88 Bar',
    lelCalibration: 'Verified Safe (0% LEL)',
    earthResistance: '4.7 Ω',
    notes: 'No abnormal vibration detected on Stage 2 cylinder. Nitrogen blanket seal normal.',
  });

  const handleSaveLog = () => {
    if (!formData.operator.trim()) {
      alert('Operator name is required');
      return;
    }
    const newLog: InspectionLog = {
      id: `LOG-ATEX-${Math.floor(100 + Math.random() * 900)}`,
      shift: formData.shift,
      operator: formData.operator,
      compressorPressure: formData.compressorPressure,
      lelCalibration: formData.lelCalibration,
      earthResistance: formData.earthResistance,
      notes: formData.notes,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    setRecentLogs([newLog, ...recentLogs]);
    setIsModalOpen(false);
    alert('ATEX Safety & Quality Control Inspection Log successfully committed to SCADA Mother Station database!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Bar Navigation */}
      <OpsTopBar />

      {/* Main Content Area with Luxury Executive Breathing Room */}
      <main className="max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 pb-12 space-y-8 flex-1">
        
        {/* EXECUTIVE HERO BANNER */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-3xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-xs font-bold text-emerald-300 whitespace-nowrap shrink-0 align-middle shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mother Station Filling Shed · ATEX Zone 1 Safe Area</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Mother Station Production & Quality Control Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Real-time SCADA telemetry monitoring for 3-stage CNG compressors, Coriolis mass flow rate (<code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300">kg/h</code>), ATEX Zone 1 gas leakage detection (LEL), electrostatic grounding interlocks, and 12Kg CNG / Cradle Tube-Skid NFC filling logs.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap z-10 self-stretch sm:self-auto justify-center"
          >
            <Icon name="ClipboardDocumentCheckIcon" size={18} />
            <span>Log ATEX Safety Inspection</span>
          </button>
        </div>

        {/* RECENT ATEX INSPECTIONS BANNER (IF ANY) */}
        {recentLogs.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Icon name="ShieldCheckIcon" size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Latest Safety Audit:</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{recentLogs[0].id}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({recentLogs[0].timestamp})</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5 line-clamp-1">
                  <strong>{recentLogs[0].operator}</strong> — {recentLogs[0].notes}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono whitespace-nowrap">
                PT-101: {recentLogs[0].compressorPressure}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono whitespace-nowrap">
                SGM: {recentLogs[0].earthResistance}
              </span>
            </div>
          </div>
        )}

        {/*
          BENTO GRID PLAN (6 CARDS):
          grid-cols-4
          Row 1: TelemetryChart (span-2) | LEL Alert (span-1) | Grounding Interlock (span-1)
          Row 2: Cylinder NFC Log (span-2) | Pressure Detail (span-1) | Flow Rate Gauge (span-1)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Row 1 */}
          {/* Hero: Telemetry Chart — spans 2 columns */}
          <div className="col-span-1 md:col-span-2 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '0ms' }}>
            <TelemetryChartCard />
          </div>

          {/* LEL Alert Card */}
          <div className="col-span-1 md:col-span-1 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '150ms' }}>
            <LelAlertCard />
          </div>

          {/* Grounding Interlock Card */}
          <div className="col-span-1 md:col-span-1 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '300ms' }}>
            <GroundingInterlockCard />
          </div>

          {/* Row 2 */}
          {/* Cylinder NFC Log — spans 2 columns */}
          <div className="col-span-1 md:col-span-2 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '450ms' }}>
            <CylinderNfcLogCard />
          </div>

          {/* Pressure Detail Card */}
          <div className="col-span-1 md:col-span-1 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '600ms' }}>
            <PressureDetailCard />
          </div>

          {/* Flow Rate Gauge Card */}
          <div className="col-span-1 md:col-span-1 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '750ms' }}>
            <FlowRateGaugeCard />
          </div>

        </div>

      </main>

      {/* --- ATEX QUALITY CONTROL & SAFETY INSPECTION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 text-white flex items-center justify-between border-b border-emerald-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Icon name="ClipboardDocumentCheckIcon" size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight">
                    ATEX Quality Control & Safety Inspection Log
                  </h3>
                  <p className="text-[11px] text-emerald-300">
                    Record physical verification for CNG compressors & filling shed interlocks.
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors p-1">
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300 max-h-[75vh] overflow-y-auto scrollbar-thin">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Operational Shift <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Shift 1 (06:00 - 14:00)">Shift 1 (06:00 - 14:00)</option>
                    <option value="Shift 2 (14:00 - 22:00)">Shift 2 (14:00 - 22:00)</option>
                    <option value="Shift 3 (22:00 - 06:00)">Shift 3 (22:00 - 06:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Inspector Name & Certification <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    placeholder="e.g., Dian Prasetyo (SIO ATEX)..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Compressor PT-101
                  </label>
                  <input
                    type="text"
                    value={formData.compressorPressure}
                    onChange={(e) => setFormData({ ...formData, compressorPressure: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    LEL GD-201 Status
                  </label>
                  <input
                    type="text"
                    value={formData.lelCalibration}
                    onChange={(e) => setFormData({ ...formData, lelCalibration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Grounding Earth Pit
                  </label>
                  <input
                    type="text"
                    value={formData.earthResistance}
                    onChange={(e) => setFormData({ ...formData, earthResistance: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Inspection Notes & Quality Verification
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Record valve lubrication, nitrogen blanket seal, or tube-skid manifold check..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
                <Icon name="ShieldCheckIcon" size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  <strong>MIGAS ATEX Compliance Notice:</strong> By submitting this inspection log, the certified SIO ATEX operator confirms that the Mother Station filling shed complies with IEC 60079 safety standards and CNG cylinder pressure tolerances.
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLog}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Icon name="CheckCircleIcon" size={16} />
                <span>Commit Audit to SCADA</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}