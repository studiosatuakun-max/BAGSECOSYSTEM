'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AtexInspectionLog {
  id: string;
  shift: string;
  operator: string;
  compressorPressure: string;
  lelCalibration: string;
  earthResistance: string;
  notes: string;
  timestamp: string;
}

interface Form101ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: AtexInspectionLog) => void;
}

export default function Form101ClientModal({ isOpen, onClose, onSave }: Form101ClientModalProps) {
  const [formData, setFormData] = useState({
    shift: 'Shift 1 (06:00 - 14:00)',
    operator: '',
    compressorPressure: '4.88 Bar',
    lelCalibration: 'Verified Safe (0% LEL)',
    earthResistance: '4.7 Ω',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.operator.trim()) {
      alert('Operator name is required');
      return;
    }
    const newLog: AtexInspectionLog = {
      id: `LOG-ATEX-${Math.floor(100 + Math.random() * 900)}`,
      shift: formData.shift,
      operator: formData.operator,
      compressorPressure: formData.compressorPressure,
      lelCalibration: formData.lelCalibration,
      earthResistance: formData.earthResistance,
      notes: formData.notes,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    onSave(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 text-white flex items-center justify-between border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Icon name="ClipboardDocumentCheckIcon" size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white tracking-tight">
                ATEX Quality Control &amp; Safety Inspection Log
              </h3>
              <p className="text-[11px] text-emerald-300">
                Record physical verification for CNG compressors &amp; filling shed interlocks.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

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
                Inspector Name &amp; Certification <span className="text-rose-500">*</span>
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
              Inspection Notes &amp; Quality Verification
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

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Icon name="CheckCircleIcon" size={16} />
            <span>Commit Audit to SCADA</span>
          </button>
        </div>
      </div>
    </div>
  );
}
