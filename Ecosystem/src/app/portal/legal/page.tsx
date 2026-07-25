'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const contractData = [
  { name: 'Active', value: 85 },
  { name: 'Expiring Soon', value: 12 },
  { name: 'Expired', value: 3 },
];
const COLORS = ['#4f46e5', '#f59e0b', '#ef4444']; // Indigo, Amber, Red

const initialContracts = [
  { id: 'C-2026-001', party: 'PT Unilever Indo', type: 'Custody Transfer', date: 'Aug 05, 2026', stat: 'Expiring Soon' },
  { id: 'C-2026-002', party: 'Hino Motors', type: 'Vendor Agreement', date: 'Aug 12, 2026', stat: 'Expiring Soon' },
  { id: 'C-2026-003', party: 'Stasiun Mother Bay 1', type: 'HSE Audit Cert', date: 'Jul 20, 2026', stat: 'Expired' },
  { id: 'C-2026-004', party: 'PT Gudang Garam', type: 'Custody Transfer', date: 'Sep 01, 2026', stat: 'Active' },
];

export default function LegalDashboardPage() {
  const [contracts, setContracts] = useState(initialContracts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', party: '', type: 'Custody Transfer', date: '', stat: 'Active' });

  const handleOpenModal = (mode: 'create' | 'edit', contract: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && contract) {
      setFormData(contract);
    } else {
      setFormData({ id: `C-2026-${Math.floor(100 + Math.random() * 900)}`, party: '', type: 'Custody Transfer', date: '', stat: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.party || !formData.date) return alert('Party and Expiry Date are required');
    if (modalMode === 'create') {
      setContracts([formData, ...contracts]);
    } else {
      setContracts(contracts.map(c => c.id === formData.id ? formData : c));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this contract record?')) {
      setContracts(contracts.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <Icon name="ArrowLeftIcon" size={18} variant="outline" />
            <span className="font-semibold text-sm">Back</span>
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-slate-900 leading-tight">Legal & Compliance</span>
            <span className="text-[10px] text-slate-500 font-medium">Contracts & HSE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Legal Director Access
          </div>
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-900">09:03:16</span>
            <span className="text-[10px] text-slate-500 font-medium">Compliance Feed</span>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 pb-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          
          {/* Key Metrics - Row 1 */}
          <div className="col-span-1 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0ms' }}>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="DocumentTextIcon" size={16} /> Active Contracts
            </span>
            <div className="mt-4 text-4xl font-extrabold text-indigo-900">85</div>
            <span className="text-xs text-indigo-700 font-semibold mt-2">B2B & Vendor Agreements</span>
          </div>

          <div className="col-span-1 bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '80ms' }}>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="ExclamationTriangleIcon" size={16} /> Expiring Soon
            </span>
            <div className="mt-4 text-4xl font-extrabold text-rose-900">12</div>
            <span className="text-xs text-rose-700 font-semibold mt-2">Action Required &lt; 30 days</span>
          </div>

          <div className="col-span-1 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '160ms' }}>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="ShieldCheckIcon" size={16} /> HSE Audits
            </span>
            <div className="mt-4 text-4xl font-extrabold text-emerald-900">100%</div>
            <span className="text-xs text-emerald-700 font-semibold mt-2">All stations compliant</span>
          </div>

          <div className="col-span-1 bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '240ms' }}>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="ScaleIcon" size={16} /> Pending Reviews
            </span>
            <div className="mt-4 text-4xl font-extrabold text-amber-900">4</div>
            <span className="text-xs text-amber-700 font-semibold mt-2">Legal drafting stage</span>
          </div>

          {/* Contract Status Donut */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col animate-fade-in" style={{ animationDelay: '320ms' }}>
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Contract Status Breakdown</h2>
            <div className="flex-1 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={contractData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {contractData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900">100</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Total</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {contractData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs text-slate-600 font-medium">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Renewal Table (CRUD) */}
          <div className="col-span-1 lg:col-span-2 bg-slate-100/50 p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Urgent Renewals</h2>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">Action Needed</span>
              </div>
              <button 
                onClick={() => handleOpenModal('create')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Icon name="PlusIcon" size={14} variant="outline" />
                Add Contract
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 uppercase">
                  <tr>
                    <th className="py-2 font-bold">Party Name</th>
                    <th className="py-2 font-bold">Contract Type</th>
                    <th className="py-2 font-bold">Expiry Date</th>
                    <th className="py-2 font-bold text-right">Status</th>
                    <th className="py-2 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {contracts.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-100 transition-colors group">
                      <td className="py-2 font-bold text-slate-900">{row.party}</td>
                      <td className="py-2 text-slate-600 font-medium">{row.type}</td>
                      <td className="py-2 text-slate-500">{row.date}</td>
                      <td className="py-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          row.stat === 'Active' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          row.stat === 'Expiring Soon' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
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
                  {contracts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500 text-sm font-medium">
                        No contracts found.
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
          <span className="font-medium tracking-wide">Legal & Compliance System v2.4.1</span>
          <span>Enterprise Risk Management · Rev. 2026-07</span>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {modalMode === 'create' ? 'Add New Contract' : 'Edit Contract'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Party / Vendor Name</label>
                <input 
                  type="text" 
                  value={formData.party}
                  onChange={(e) => setFormData({...formData, party: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  placeholder="e.g. PT Maju Jaya"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Contract Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Custody Transfer">Custody Transfer</option>
                  <option value="Vendor Agreement">Vendor Agreement</option>
                  <option value="HSE Audit Cert">HSE Audit Cert</option>
                  <option value="NDA">NDA</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Expiry Date</label>
                  <input 
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    placeholder="e.g. Aug 12, 2026"
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
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
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
                {modalMode === 'create' ? 'Save Contract' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
