'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type ShiftRecord = {
  id: string;
  shift_type: string;
  role_assigned?: string;
  attendance_in?: string;
  attendance_out?: string;
  attendance_status?: string;
  employees?: {
    full_name: string;
    role_title: string;
    department: string;
  };
};

export default function DynamicShiftConsole({ shifts }: { shifts: ShiftRecord[] }) {
  const [activeTab, setActiveTab] = useState('All');

  const shiftTypes = ['All', 'Pagi', 'Siang', 'Malam', 'Fleksibel'];

  const filteredShifts = shifts.filter(
    (s) => activeTab === 'All' || s.shift_type === activeTab
  );

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Late':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Absent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'On_Leave':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'; // Scheduled
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full group hover:border-indigo-500/30 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Icon name="ClockIcon" className="text-indigo-400" />
            Dynamic Shift Console
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Mother Station & Fleet Attendance
          </p>
        </div>
        
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
          {shiftTypes.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-2xl border border-white/5 bg-black/20">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider font-extrabold sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="px-4 py-3 border-b border-white/5">Personnel</th>
              <th className="px-4 py-3 border-b border-white/5">Shift</th>
              <th className="px-4 py-3 border-b border-white/5">Role</th>
              <th className="px-4 py-3 border-b border-white/5 text-center">Status</th>
              <th className="px-4 py-3 border-b border-white/5 text-right">Time In</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredShifts.length > 0 ? (
              filteredShifts.map((shift) => (
                <tr
                  key={shift.id}
                  className="hover:bg-white/[0.02] transition-colors group/row"
                >
                  <td className="px-4 py-3">
                    <div className="font-bold text-white group-hover/row:text-indigo-300 transition-colors">
                      {shift.employees?.full_name || 'Unknown'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {shift.employees?.department || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {shift.shift_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-xs">
                    {shift.role_assigned || shift.employees?.role_title || '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-black border ${getStatusColor(
                        shift.attendance_status
                      )}`}
                    >
                      {shift.attendance_status || 'Scheduled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-400">
                    {shift.attendance_in ? (
                      shift.attendance_in.substring(0, 5)
                    ) : (
                      <span className="text-slate-600">--:--</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No shift data available for this selection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
