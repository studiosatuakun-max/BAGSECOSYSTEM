'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

type TrainingRecord = {
  id: string;
  training_name: string;
  training_type: string;
  training_date: string;
  expiry_date?: string;
  status: string;
  employees?: {
    full_name: string;
    role_title: string;
    department: string;
  };
};

export default function TrainingSafetyMatrix({ trainings }: { trainings: TrainingRecord[] }) {
  const today = new Date();

  const getExpiryStatus = (expiryDateStr?: string) => {
    if (!expiryDateStr) return { label: 'No Expiry', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
    
    const expiryDate = new Date(expiryDateStr);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Expired', color: 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' };
    }
    if (diffDays <= 30) {
      return { label: 'Critical (< 30d)', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    }
    if (diffDays <= 60) {
      return { label: 'Warning (< 60d)', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    }
    return { label: 'Valid', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  return (
    <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full group hover:border-fuchsia-500/30 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Icon name="ShieldCheckIcon" className="text-fuchsia-400" />
            Safety Training Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ATEX & MIGAS Refresher Tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
           <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold bg-white/5 border border-white/5 px-2 py-1 rounded-md">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Critical
           </span>
           <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold bg-white/5 border border-white/5 px-2 py-1 rounded-md">
             <span className="w-2 h-2 rounded-full bg-yellow-500" /> Warning
           </span>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[260px] rounded-2xl border border-white/5 bg-black/40">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider font-extrabold sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="px-4 py-3 border-b border-white/5">Personnel</th>
              <th className="px-4 py-3 border-b border-white/5">Training Type</th>
              <th className="px-4 py-3 border-b border-white/5">Certification</th>
              <th className="px-4 py-3 border-b border-white/5 text-right">Expiry Date</th>
              <th className="px-4 py-3 border-b border-white/5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {trainings.length > 0 ? (
              trainings.map((training) => {
                const statusInfo = getExpiryStatus(training.expiry_date);
                return (
                  <tr
                    key={training.id}
                    className="hover:bg-white/[0.04] transition-colors group/row"
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-white group-hover/row:text-fuchsia-300 transition-colors">
                        {training.employees?.full_name || 'Unknown'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {training.employees?.department || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
                        {training.training_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs font-medium">
                      {training.training_name}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-slate-400">
                      {training.expiry_date ? (
                        new Date(training.expiry_date).toLocaleDateString('id-ID', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })
                      ) : (
                        <span className="text-slate-600">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-black border ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  No safety training data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
