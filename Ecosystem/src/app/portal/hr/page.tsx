'use client';

import InboxWidget from '@/app/components/InboxWidget';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const attendanceData = [
  { name: 'Mon', present: 390, absent: 22 },
  { name: 'Tue', present: 400, absent: 12 },
  { name: 'Wed', present: 395, absent: 17 },
  { name: 'Thu', present: 410, absent: 2 },
  { name: 'Fri', present: 380, absent: 32 },
];

const initialEmployees = [
  { id: 'EMP-01', name: 'Rizal Firmansyah', dept: 'Operations', stat: 'Active' },
  { id: 'EMP-02', name: 'Dian Prasetyo', dept: 'Fleet / Driver', stat: 'Active' },
  { id: 'EMP-03', name: 'Siti Aminah', dept: 'Finance', stat: 'Probation' },
  { id: 'EMP-04', name: 'Bagus Setiawan', dept: 'IT', stat: 'Onboarding' },
];

export default function HRDashboardPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', name: '', dept: '', stat: 'Active' });

  const handleOpenModal = (mode: 'create' | 'edit', emp: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && emp) {
      setFormData(emp);
    } else {
      setFormData({ id: `EMP-0${Math.floor(5 + Math.random() * 9)}`, name: '', dept: '', stat: 'Onboarding' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.name || !formData.dept) return alert('Name and Department are required');
    if (modalMode === 'create') {
      setEmployees([formData, ...employees]);
    } else {
      setEmployees(employees.map(e => e.id === formData.id ? formData : e));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this employee record?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <Icon name="ArrowLeftIcon" size={18} variant="outline" />
            <span className="font-semibold text-sm">Back</span>
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-slate-900 leading-tight">Baskara HR</span>
            <span className="text-[10px] text-slate-500 font-medium">Human Capital Center</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <InboxWidget variant="header" />
          <div className="flex items-center gap-2 bg-fuchsia-50 text-fuchsia-700 px-3 py-1 rounded-full text-xs font-bold border border-fuchsia-200">
            <div className="w-2 h-2 rounded-full bg-fuchsia-600 animate-pulse" />
            HR Director
          </div>
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-900">09:03:16</span>
            <span className="text-[10px] text-slate-500 font-medium">Live System</span>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 pb-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          
          {/* Key Metrics - Row 1 */}
          <div className="col-span-1 bg-fuchsia-50 p-6 rounded-2xl border border-fuchsia-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0ms' }}>
            <span className="text-xs font-bold text-fuchsia-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="UsersIcon" size={16} /> Total Headcount
            </span>
            <div className="mt-4 text-4xl font-extrabold text-fuchsia-900">412</div>
            <span className="text-xs text-fuchsia-700 font-semibold mt-2">Pegawai Tetap & Kontrak</span>
          </div>

          <div className="col-span-1 bg-cyan-50 p-6 rounded-2xl border border-cyan-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '80ms' }}>
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="CheckBadgeIcon" size={16} /> Kehadiran Hari Ini
            </span>
            <div className="mt-4 text-4xl font-extrabold text-cyan-900">95.4%</div>
            <span className="text-xs text-cyan-700 font-semibold mt-2">12 Izin, 4 Sakit, 2 Alpha</span>
          </div>

          <div className="col-span-1 bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '160ms' }}>
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="BriefcaseIcon" size={16} /> Open Vacancies
            </span>
            <div className="mt-4 text-4xl font-extrabold text-orange-900">8</div>
            <span className="text-xs text-orange-700 font-semibold mt-2">Tingkat Interview: 24 Kandidat</span>
          </div>

          <div className="col-span-1 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '240ms' }}>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="DocumentCheckIcon" size={16} /> Payroll Status
            </span>
            <div className="mt-4 text-4xl font-extrabold text-indigo-900">Ready</div>
            <span className="text-xs text-indigo-700 font-semibold mt-2">Cut-off 25 Juli 2026</span>
          </div>

          {/* Charts Row - Row 2 */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: '320ms' }}>
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Attendance Rate (This Week)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Bar dataKey="present" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Hadir" />
                  <Bar dataKey="absent" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Tidak Hadir" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Staff List Table (CRUD) */}
          <div className="col-span-1 lg:col-span-2 bg-slate-100/50 p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Employee Roster</h2>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">July 2026</span>
              </div>
              <button 
                onClick={() => handleOpenModal('create')}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Icon name="PlusIcon" size={14} variant="outline" />
                Add Employee
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 uppercase">
                  <tr>
                    <th className="py-2 font-bold">Employee Name</th>
                    <th className="py-2 font-bold">Department</th>
                    <th className="py-2 font-bold text-right">Status</th>
                    <th className="py-2 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {employees.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-100 transition-colors group">
                      <td className="py-2 font-bold text-slate-900">{row.name}</td>
                      <td className="py-2 text-slate-600 font-medium">{row.dept}</td>
                      <td className="py-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          row.stat === 'Active' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                          row.stat === 'Probation' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-slate-200 text-slate-700 border-slate-300'
                        }`}>
                          {row.stat}
                        </span>
                      </td>
                      <td className="py-2 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal('edit', row)} className="text-slate-500 hover:text-blue-600 transition-colors">
                          <Icon name="PencilSquareIcon" size={16} variant="outline" />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="text-slate-500 hover:text-rose-600 transition-colors">
                          <Icon name="TrashIcon" size={16} variant="outline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500 text-sm font-medium">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer attribution */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium tracking-wide">Baskara HR System v2.4.1</span>
          <span>Human Capital Analytics · Rev. 2026-07</span>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {modalMode === 'create' ? 'Add Employee' : 'Edit Employee'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Employee Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-shadow"
                  placeholder="e.g. John Doe"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Department</label>
                  <select 
                    value={formData.dept}
                    onChange={(e) => setFormData({...formData, dept: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                    <option value="IT">IT</option>
                    <option value="Fleet / Driver">Fleet / Driver</option>
                    <option value="Legal">Legal</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Status</label>
                  <select 
                    value={formData.stat}
                    onChange={(e) => setFormData({...formData, stat: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Probation">Probation</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Terminated">Terminated</option>
                  </select>
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
                className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {modalMode === 'create' ? 'Add Employee' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
  {/* Enterprise Dispatch Inbox Widget */}
</div>
  );
}