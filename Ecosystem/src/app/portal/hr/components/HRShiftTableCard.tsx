'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_HR_SHIFTS, MOCK_HR_TRAININGS } from '../data/mockHRData';
import Icon from '@/components/ui/AppIcon';
import { Search, Plus, CalendarClock, UserCheck, CalendarDays, CheckCircle2, Clock, AlertTriangle, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { useSocket } from '@/hooks/useSocket';

export default function HRShiftTableCard() {
  const [activeTab, setActiveTab] = useState<'Shifts' | 'Trainings'>('Shifts');
  const [searchTerm, setSearchTerm] = useState('');
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleWristbandScanned = (data: any) => {
      toast.success('Live ATEX Zone Clearance', {
        description: `Operator (ID: ...${data.epc.substring(data.epc.length - 4)}) entered restricted area.`,
        icon: '👷‍♂️',
      });
    };

    socket.on('wristband_scanned', handleWristbandScanned);

    return () => {
      socket.off('wristband_scanned', handleWristbandScanned);
    };
  }, [socket]);

  const filteredShifts = MOCK_HR_SHIFTS.filter(shift => 
    shift.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shift.role_assigned.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredTrainings = MOCK_HR_TRAININGS.filter(trn => 
    trn.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trn.training_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl flex flex-col h-full relative overflow-hidden group">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
            <UserCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">HR Shift & Certification</h2>
            <p className="text-sm text-slate-400 mt-0.5">Dynamic Scheduling & ATEX Safety Certifications</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search employee or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(217,70,239,0.3)] whitespace-nowrap shrink-0">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Record</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-700/50 pb-2 relative z-10">
        <button 
          onClick={() => setActiveTab('Shifts')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'Shifts' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Dynamic Shifts
        </button>
        <button 
          onClick={() => setActiveTab('Trainings')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'Trainings' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Safety Training (ATEX/HSE)
        </button>
      </div>

      {/* Tables */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/60 bg-slate-900/40 relative z-10">
        {activeTab === 'Shifts' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
                <th className="p-4 font-medium whitespace-nowrap">Employee</th>
                <th className="p-4 font-medium whitespace-nowrap">Date & Shift Type</th>
                <th className="p-4 font-medium whitespace-nowrap">Role Assigned</th>
                <th className="p-4 font-medium whitespace-nowrap">Workload Note</th>
                <th className="p-4 font-medium text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredShifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <UserCheck size={14} className="text-fuchsia-400" /> {shift.employee_id}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                      <CalendarDays size={12} className="text-slate-400" /> {shift.shift_date}
                    </div>
                    <div className="text-xs font-bold mt-1 text-fuchsia-300">
                      {shift.shift_type}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] border border-slate-700">
                      {shift.role_assigned}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap text-xs text-slate-400 max-w-[200px] truncate" title={shift.estimated_workload_note}>
                    {shift.estimated_workload_note || '-'}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    {shift.is_dynamic_change ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertTriangle size={10} /> Dynamic Change
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={10} /> Scheduled
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
                <th className="p-4 font-medium whitespace-nowrap">Employee</th>
                <th className="p-4 font-medium whitespace-nowrap">Training / Cert</th>
                <th className="p-4 font-medium whitespace-nowrap">Date</th>
                <th className="p-4 font-medium text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredTrainings.map((trn) => (
                <tr key={trn.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-white text-sm">{trn.employee_id}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-fuchsia-400" /> {trn.training_name}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-slate-300">
                    <CalendarClock size={12} className="inline mr-1 text-slate-500" />
                    {trn.training_date}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      trn.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      trn.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {trn.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {trn.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
