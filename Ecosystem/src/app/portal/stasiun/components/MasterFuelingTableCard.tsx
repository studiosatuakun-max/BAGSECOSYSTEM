'use client';

import React, { useState } from 'react';
import { MOCK_MASTER_FUELING_RECORDS } from '../data/mockStasiunData';
import { MasterFuelingRecord } from '../_integration/types';
import Icon from '@/components/ui/AppIcon';
import { ClipboardCheck, PlayCircle, Plus, Search, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import Form101Modal from './Form101Modal';

export default function MasterFuelingTableCard() {
  const [records, setRecords] = useState<MasterFuelingRecord[]>(MOCK_MASTER_FUELING_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredRecords = records.filter(record => 
    record.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.tube_trailer_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl flex flex-col h-full relative overflow-hidden group">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ClipboardCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">Master Fueling Log (Form 101)</h2>
              <p className="text-sm text-slate-400 mt-0.5">Real-time Tubeskid charging records & ATEX Inspections</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by customer or tube..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] whitespace-nowrap shrink-0"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Record</span>
            </button>
          </div>
        </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/60 bg-slate-900/40 relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
              <th className="p-4 font-medium">Q.No</th>
              <th className="p-4 font-medium">Customer & Unit</th>
              <th className="p-4 font-medium">Time</th>
              <th className="p-4 font-medium">Pressure (Bar)</th>
              <th className="p-4 font-medium">Volume (Nm³)</th>
              <th className="p-4 font-medium">ATEX Insp.</th>
              <th className="p-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredRecords.map((record) => {
              const isOverpressure = record.pressure_full_bar > 250;
              const hasPreFill = record.inspections?.find(i => i.type === 'PRE_FILL');
              const hasPostFill = record.inspections?.find(i => i.type === 'POST_FILL');
              const atexPass = hasPreFill && hasPostFill && hasPreFill.grounding_cable_tyre_stopper;
              
              return (
                <tr key={record.id} className="hover:bg-slate-800/30 transition-colors group/row">
                  <td className="p-4">
                    <span className="text-sm font-semibold text-slate-300">#{record.queue_no.toString().padStart(3, '0')}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white text-sm">{record.customer_name}</div>
                    <div className="text-xs text-indigo-400 mt-0.5">{record.tube_trailer_no} • {record.lwc} LWC</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <PlayCircle size={14} className="text-emerald-400" />
                      <span>{record.start_time}</span>
                      <span className="text-slate-600">-</span>
                      <span>{record.finish_time || '...'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Initial: <span className="text-slate-300">{record.pressure_initial_bar}</span></span>
                        <span className="text-sm font-medium text-white flex items-center gap-1">
                          Full: <span className={isOverpressure ? 'text-rose-400' : 'text-emerald-400'}>{record.pressure_full_bar}</span>
                          {isOverpressure && <AlertTriangle size={14} className="text-rose-500" />}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-white">{record.volume_delivery_nm3.toLocaleString('en-US')} <span className="text-xs text-slate-500 font-normal">Nm³</span></div>
                    <div className="text-xs text-slate-400">{record.volume_delivery_kg.toLocaleString('en-US')} kg</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1.5">
                      {hasPreFill ? (
                        hasPreFill.grounding_cable_tyre_stopper ? (
                          <div className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0 align-middle">PRE Pass</div>
                        ) : (
                          <div className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 whitespace-nowrap shrink-0 align-middle">PRE Fail</div>
                        )
                      ) : (
                        <div className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20 whitespace-nowrap shrink-0 align-middle">No PRE</div>
                      )}
                      
                      {hasPostFill ? (
                        <div className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0 align-middle">POST Pass</div>
                      ) : (
                        <div className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20 whitespace-nowrap shrink-0 align-middle">No POST</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 align-middle border ${
                      record.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {record.status === 'Completed' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {record.status}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
      {/* Form 101 Modal */}
      <Form101Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          console.log('Saved Form 101 Data:', data);
        }}
      />
    </>
  );
}
