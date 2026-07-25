'use client';

import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const revenueData = [
  { name: 'Week 1', revenue: 120 },
  { name: 'Week 2', revenue: 150 },
  { name: 'Week 3', revenue: 180 },
  { name: 'Week 4', revenue: 210 },
];

const initialClients = [
  { id: 'C-01', name: 'PT Indofood CBP', stat: 'Active', rev: 'Rp 1.2B' },
  { id: 'C-02', name: 'PT Mayora Indah', stat: 'Active', rev: 'Rp 950M' },
  { id: 'C-03', name: 'PT Unilever Indo', stat: 'Renewal', rev: 'Rp 820M' },
  { id: 'C-04', name: 'PT Toyota Motor', stat: 'Active', rev: 'Rp 710M' },
  { id: 'C-05', name: 'PT Gajah Tunggal', stat: 'Active', rev: 'Rp 520M' },
];

export default function DireksiB2BPage() {
  const [clients, setClients] = useState(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', name: '', stat: 'Active', rev: '' });

  const handleOpenModal = (mode: 'create' | 'edit', client: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && client) {
      setFormData(client);
    } else {
      setFormData({ id: `C-0${Math.floor(6 + Math.random() * 9)}`, name: '', stat: 'Active', rev: 'Rp ' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.name || !formData.rev) return alert('Name and Revenue are required');
    if (modalMode === 'create') {
      setClients([formData, ...clients]);
    } else {
      setClients(clients.map(c => c.id === formData.id ? formData : c));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client record?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Top Header */}
      <PortalHeader
        title="Industrial Dashboard"
        subtitle="Enterprise B2B Monitor"
        roleBadge="B2B Director Access"
        roleColor="indigo"
        showInbox={true}
        rightCustom={
          <div className="hidden sm:flex flex-col text-right justify-center font-mono leading-tight">
            <span className="text-xs font-bold text-foreground">09:03:16</span>
            <span className="text-[10px] text-muted-foreground font-medium">Live Data</span>
          </div>
        }
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 pb-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          
          {/* Key Metrics - Row 1 */}
          <div className="col-span-1 lg:col-span-2 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0ms' }}>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                <Icon name="BanknotesIcon" size={16} /> Total Revenue (MTD)
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">Nominal</span>
            </div>
            <div className="mt-4 text-4xl font-extrabold text-indigo-900">Rp 4.2B</div>
            <div className="w-full h-1 bg-indigo-200 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-indigo-600 w-[85%] rounded-full" />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-indigo-600 font-semibold">↑ +12.5% vs Last Month</span>
              <span className="text-xs text-indigo-600 font-bold">Target: Rp 5B</span>
            </div>
          </div>

          <div className="col-span-1 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '80ms' }}>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="DocumentTextIcon" size={16} /> Active Contracts
            </span>
            <div className="mt-4 text-4xl font-extrabold text-emerald-900">24</div>
            <span className="text-xs text-emerald-700 font-semibold mt-2">Custody Transfer Agreements</span>
          </div>

          <div className="col-span-1 bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '160ms' }}>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="FireIcon" size={16} /> Volume Delivered
            </span>
            <div className="mt-4 text-4xl font-extrabold text-amber-900">12.7K <span className="text-lg">MMBTU</span></div>
            <span className="text-xs text-amber-700 font-semibold mt-2">↑ +5.2% from last month</span>
          </div>

          {/* Charts Row - Row 2 */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: '240ms' }}>
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Revenue Trend (July)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `Rp${val}M`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 Enterprise Clients (CRUD) */}
          <div className="col-span-1 lg:col-span-2 bg-slate-100/50 p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: '320ms' }}>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Enterprise Clients</h2>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">MTD</span>
              </div>
              <button 
                onClick={() => handleOpenModal('create')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Icon name="PlusIcon" size={14} variant="outline" />
                Add Client
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 uppercase">
                  <tr>
                    <th className="py-2 font-bold">Client Name</th>
                    <th className="py-2 font-bold text-right">Revenue</th>
                    <th className="py-2 font-bold text-right">Status</th>
                    <th className="py-2 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {clients.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-100 transition-colors group">
                      <td className="py-2 font-bold text-slate-900">{row.name}</td>
                      <td className="py-2 font-bold text-indigo-600 text-right">{row.rev}</td>
                      <td className="py-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${row.stat === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
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
                  {clients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500 text-sm font-medium">
                        No clients found.
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
          <span className="font-medium tracking-wide">Baskara Executive Engine v2.4.1</span>
          <span>B2B Industrial Analytics · Rev. 2026-07</span>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {modalMode === 'create' ? 'Add Client' : 'Edit Client'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Client Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  placeholder="e.g. PT Maju Jaya"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Revenue</label>
                  <input 
                    type="text"
                    value={formData.rev}
                    onChange={(e) => setFormData({...formData, rev: e.target.value})}
                    placeholder="e.g. Rp 500M"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Status</label>
                  <select 
                    value={formData.stat}
                    onChange={(e) => setFormData({...formData, stat: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Renewal">Renewal</option>
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
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {modalMode === 'create' ? 'Save Client' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
  <Footer />
    </div>
  );
}
