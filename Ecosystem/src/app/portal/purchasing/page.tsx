'use client';

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

const spendData = [
  { name: 'Week 1', spend: 450 },
  { name: 'Week 2', spend: 320 },
  { name: 'Week 3', spend: 680 },
  { name: 'Week 4', spend: 510 },
];

const initialPOs = [
  { id: 'PO-2026-0081', vendor: 'Krakatau Steel', amt: 'Rp 450M', stat: 'Approved' },
  { id: 'PO-2026-0082', vendor: 'Pertamina Patra', amt: 'Rp 820M', stat: 'Fulfilled' },
  { id: 'PO-2026-0083', vendor: 'Cylinder Supplier A', amt: 'Rp 120M', stat: 'Pending' },
  { id: 'PO-2026-0084', vendor: 'Hino Motors', amt: 'Rp 950M', stat: 'Approved' },
];

export default function PurchasingDashboardPage() {
  const [pos, setPos] = useState(initialPOs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', vendor: '', amt: '', stat: 'Pending' });

  const handleOpenModal = (mode: 'create' | 'edit', po: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && po) {
      setFormData(po);
    } else {
      setFormData({ id: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`, vendor: '', amt: 'Rp ', stat: 'Pending' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.vendor || !formData.amt) return alert('Vendor and Amount are required');
    if (modalMode === 'create') {
      setPos([formData, ...pos]);
    } else {
      setPos(pos.map(p => p.id === formData.id ? formData : p));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this Purchase Order?')) {
      setPos(pos.filter(p => p.id !== id));
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
            <span className="font-extrabold text-sm text-slate-900 leading-tight">Procurement</span>
            <span className="text-[10px] text-slate-500 font-medium">Supply Chain & Purchasing</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Purchasing Manager
          </div>
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-900">09:03:16</span>
            <span className="text-[10px] text-slate-500 font-medium">Live Dashboard</span>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 pb-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          
          {/* Key Metrics - Row 1 */}
          <div className="col-span-1 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0ms' }}>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="BanknotesIcon" size={16} /> Total Spend (MTD)
            </span>
            <div className="mt-4 text-4xl font-extrabold text-emerald-900">Rp 1.9B</div>
            <span className="text-xs text-emerald-700 font-semibold mt-2">↓ -4% vs Last Month</span>
          </div>

          <div className="col-span-1 bg-teal-50 p-6 rounded-2xl border border-teal-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '80ms' }}>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="DocumentTextIcon" size={16} /> Open POs
            </span>
            <div className="mt-4 text-4xl font-extrabold text-teal-900">34</div>
            <span className="text-xs text-teal-700 font-semibold mt-2">Pending Vendor Fulfillment</span>
          </div>

          <div className="col-span-1 bg-cyan-50 p-6 rounded-2xl border border-cyan-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '160ms' }}>
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="UsersIcon" size={16} /> Active Vendors
            </span>
            <div className="mt-4 text-4xl font-extrabold text-cyan-900">128</div>
            <span className="text-xs text-cyan-700 font-semibold mt-2">Approved Suppliers</span>
          </div>

          <div className="col-span-1 bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '240ms' }}>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="ClockIcon" size={16} /> Avg Lead Time
            </span>
            <div className="mt-4 text-4xl font-extrabold text-amber-900">14 Days</div>
            <span className="text-xs text-amber-700 font-semibold mt-2">From PO to Delivery</span>
          </div>

          {/* Charts Row - Row 2 */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: '320ms' }}>
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Spend Trend (July)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `Rp${val}M`} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Bar dataKey="spend" fill="#10b981" radius={[4, 4, 0, 0]} name="Spend (Rp M)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PO Table (CRUD) */}
          <div className="col-span-1 lg:col-span-2 bg-slate-100/50 p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Purchase Orders</h2>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">Active</span>
              </div>
              <button 
                onClick={() => handleOpenModal('create')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Icon name="PlusIcon" size={14} variant="outline" />
                New PO
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 uppercase">
                  <tr>
                    <th className="py-2 font-bold">PO Number</th>
                    <th className="py-2 font-bold">Vendor</th>
                    <th className="py-2 font-bold text-right">Amount</th>
                    <th className="py-2 font-bold text-right">Status</th>
                    <th className="py-2 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pos.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-100 transition-colors group">
                      <td className="py-2 font-bold text-slate-900">{row.id}</td>
                      <td className="py-2 text-slate-600 font-medium">{row.vendor}</td>
                      <td className="py-2 font-bold text-emerald-600 text-right">{row.amt}</td>
                      <td className="py-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          row.stat === 'Approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          row.stat === 'Fulfilled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
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
                  {pos.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500 text-sm font-medium">
                        No purchase orders found.
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
          <span className="font-medium tracking-wide">Procurement System v2.4.1</span>
          <span>Supply Chain Analytics · Rev. 2026-07</span>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {modalMode === 'create' ? 'Create Purchase Order' : 'Edit PO'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">PO Number</label>
                <input 
                  type="text" 
                  value={formData.id} 
                  disabled 
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Vendor Name</label>
                <input 
                  type="text" 
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                  placeholder="e.g. Krakatau Steel"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Amount</label>
                  <input 
                    type="text"
                    value={formData.amt}
                    onChange={(e) => setFormData({...formData, amt: e.target.value})}
                    placeholder="Rp ..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Status</label>
                  <select 
                    value={formData.stat}
                    onChange={(e) => setFormData({...formData, stat: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Fulfilled">Fulfilled</option>
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {modalMode === 'create' ? 'Create PO' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
