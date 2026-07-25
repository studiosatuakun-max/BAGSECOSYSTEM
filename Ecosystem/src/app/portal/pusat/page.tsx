'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const initialLogs = [
  { id: 'L-01', action: 'Updated Gas Rate', user: 'Admin SA', time: '10m ago' },
  { id: 'L-02', action: 'Added New Client', user: 'Admin SA', time: '1h ago' },
  { id: 'L-03', action: 'Modified Role', user: 'Bagus S.', time: '3h ago' },
  { id: 'L-04', action: 'System Backup', user: 'System', time: '5h ago' },
  { id: 'L-05', action: 'Deleted Contract', user: 'Legal Dept', time: '6h ago' },
];

export default function PusatDashboardOverview() {
  const [logs, setLogs] = useState(initialLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', action: '', user: '', time: 'Just now' });

  const handleOpenModal = (mode: 'create' | 'edit', log: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && log) {
      setFormData(log);
    } else {
      setFormData({ id: `L-0${Math.floor(6 + Math.random() * 9)}`, action: '', user: 'Admin SA', time: 'Just now' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.action || !formData.user) return alert('Action and User are required');
    if (modalMode === 'create') {
      setLogs([formData, ...logs]);
    } else {
      setLogs(logs.map(l => l.id === formData.id ? formData : l));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this log entry?')) {
      setLogs(logs.filter(l => l.id !== id));
    }
  };

  const stats = [
    { label: 'Total Clients', value: '1,248', icon: 'UserGroupIcon', color: 'text-indigo', bg: 'bg-indigo-light', border: 'border-indigo/20' },
    { label: 'Active Personnel', value: '412', icon: 'UsersIcon', color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    { label: 'Gas Price (MMBTU)', value: '$12.40', icon: 'BanknotesIcon', color: 'text-green-ops', bg: 'bg-green-ops-light', border: 'border-green-ops/20' },
    { label: 'System Logs', value: '8.4M', icon: 'ServerStackIcon', color: 'text-amber-dark', bg: 'bg-amber-light', border: 'border-amber-dark/20' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 pb-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          
          {/* Key Metrics - Row 1 */}
          <div className="col-span-1 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0ms' }}>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="UserGroupIcon" size={16} /> Total Clients
            </span>
            <div className="mt-4 text-4xl font-extrabold text-indigo-900">1,248</div>
            <span className="text-xs text-indigo-700 font-semibold mt-2">B2B & B2C Combined</span>
          </div>

          <div className="col-span-1 bg-cyan-50 p-6 rounded-2xl border border-cyan-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '80ms' }}>
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="UsersIcon" size={16} /> Active Personnel
            </span>
            <div className="mt-4 text-4xl font-extrabold text-cyan-900">412</div>
            <span className="text-xs text-cyan-700 font-semibold mt-2">Drivers, Operators, Staff</span>
          </div>

          <div className="col-span-1 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '160ms' }}>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="BanknotesIcon" size={16} /> Global Gas Price
            </span>
            <div className="mt-4 text-4xl font-extrabold text-emerald-900">$12.40</div>
            <span className="text-xs text-emerald-700 font-semibold mt-2">Per MMBTU</span>
          </div>

          <div className="col-span-1 bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '240ms' }}>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="ServerStackIcon" size={16} /> System Logs
            </span>
            <div className="mt-4 text-4xl font-extrabold text-amber-900">8.4M</div>
            <span className="text-xs text-amber-700 font-semibold mt-2">Logs Processed Today</span>
          </div>

          {/* Row 2 */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col animate-fade-in" style={{ animationDelay: '320ms' }}>
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">System Activity & Propagation</h2>
            <div className="flex-1 rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-end gap-2 h-48">
              <div className="flex items-end justify-between h-full w-full gap-2 px-2">
                {[40, 70, 45, 90, 65, 30, 85, 60, 50, 75, 55, 80].map((height, i) => (
                  <div key={i} className="w-full bg-slate-200 rounded-t-md relative group hover:bg-slate-300 transition-colors" style={{ height: '100%' }}>
                    <div 
                      className="absolute bottom-0 w-full bg-slate-800 rounded-t-md transition-all duration-500 group-hover:bg-slate-900" 
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mt-2 border-t border-slate-200 pt-2 px-1 tracking-wider">
                <span>Jan</span>
                <span>Apr</span>
                <span>Jul</span>
                <span>Oct</span>
                <span>Dec</span>
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2 bg-slate-100/50 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Global Audit Log</h2>
              <button 
                onClick={() => handleOpenModal('create')}
                className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Icon name="PlusIcon" size={14} variant="outline" />
                Add Log
              </button>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto pr-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 group">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-800 mt-1.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{log.action}</span>
                      <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{log.user} &middot; {log.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal('edit', log)} className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Icon name="PencilSquareIcon" size={14} variant="outline" />
                    </button>
                    <button onClick={() => handleDelete(log.id)} className="text-slate-400 hover:text-rose-600 transition-colors">
                      <Icon name="TrashIcon" size={14} variant="outline" />
                    </button>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="py-6 text-center text-slate-500 text-sm font-medium">
                  No logs available.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer attribution */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium tracking-wide">Baskara System Core v2.4.1</span>
          <span>Global Root Access · Rev. 2026-07</span>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {modalMode === 'create' ? 'Create Log Entry' : 'Edit Log Entry'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Action</label>
                <input 
                  type="text" 
                  value={formData.action}
                  onChange={(e) => setFormData({...formData, action: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow"
                  placeholder="e.g. Updated Server Config"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">User / System</label>
                  <input 
                    type="text"
                    value={formData.user}
                    onChange={(e) => setFormData({...formData, user: e.target.value})}
                    placeholder="e.g. Admin SA"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Time</label>
                  <input 
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    placeholder="e.g. 10m ago"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {modalMode === 'create' ? 'Save Log' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
