'use client';

import InboxWidget from '@/app/components/InboxWidget';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const salesData = [
  { name: 'Week 1', sales: 420 },
  { name: 'Week 2', sales: 480 },
  { name: 'Week 3', sales: 550 },
  { name: 'Week 4', sales: 610 },
];

const cylinderData = [
  { name: 'Deposited (Clients)', value: 8500 },
  { name: 'In Depot (Ready)', value: 2100 },
  { name: 'Maintenance', value: 400 },
];
const COLORS = ['#d97706', '#fbbf24', '#fcd34d'];

const initialOrders = [
  { id: 'O-01', name: 'Warung Bu Kris', val: 'Rp 1.85M' },
  { id: 'O-02', name: 'Sederhana Minang', val: 'Rp 2.77M' },
  { id: 'O-03', name: 'Kopi Kenangan', val: 'Rp 1.48M' },
  { id: 'O-04', name: 'Solaria Resto', val: 'Rp 2.22M' },
  { id: 'O-05', name: 'RM Ampera', val: 'Rp 1.11M' },
];

export default function DireksiB2CPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', name: '', val: '' });

  const handleOpenModal = (mode: 'create' | 'edit', order: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && order) {
      setFormData(order);
    } else {
      setFormData({ id: `O-0${Math.floor(6 + Math.random() * 9)}`, name: '', val: 'Rp ' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.name || !formData.val) return alert('Name and Value are required');
    if (modalMode === 'create') {
      setOrders([formData, ...orders]);
    } else {
      setOrders(orders.map(o => o.id === formData.id ? formData : o));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(o => o.id !== id));
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
            <span className="font-extrabold text-sm text-slate-900 leading-tight">Horeca Dashboard</span>
            <span className="text-[10px] text-slate-500 font-medium">Retail B2C Monitor</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            B2C Director Access
          </div>
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-900">09:03:16</span>
            <span className="text-[10px] text-slate-500 font-medium">Live Data</span>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 pb-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          
          {/* Key Metrics - Row 1 */}
          <div className="col-span-1 lg:col-span-2 bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0ms' }}>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
                <Icon name="BanknotesIcon" size={16} /> Total Sales (MTD)
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">Nominal</span>
            </div>
            <div className="mt-4 text-4xl font-extrabold text-amber-900">Rp 845M</div>
            <div className="w-full h-1 bg-amber-200 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-amber-500 w-[75%] rounded-full" />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-amber-600 font-semibold">↑ +8.3% vs Last Month</span>
              <span className="text-xs text-amber-600 font-bold">Target: Rp 1B</span>
            </div>
          </div>

          <div className="col-span-1 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '80ms' }}>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="ArchiveBoxIcon" size={16} /> Cylinders in Circulation
            </span>
            <div className="mt-4 text-4xl font-extrabold text-emerald-900">11,000</div>
            <span className="text-xs text-emerald-700 font-semibold mt-2">12Kg LPG Units</span>
          </div>

          <div className="col-span-1 bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '160ms' }}>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="TruckIcon" size={16} /> Milk-Run Routes
            </span>
            <div className="mt-4 text-4xl font-extrabold text-blue-900">18</div>
            <span className="text-xs text-blue-700 font-semibold mt-2">Covering 450+ restaurants</span>
          </div>

          {/* Charts Row - Row 2 */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: '240ms' }}>
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Retail Sales Trend (July)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `Rp${val}M`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={3} dot={{ r: 4, fill: '#d97706', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cylinder Status Donut */}
          <div className="col-span-1 bg-slate-100/50 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col animate-fade-in" style={{ animationDelay: '320ms' }}>
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Cylinder Status</h2>
            <div className="flex-1 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={cylinderData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {cylinderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-slate-900">11k</span>
                <span className="text-[9px] uppercase font-bold text-slate-500">Total</span>
              </div>
            </div>
          </div>

          {/* Recent High Value Orders (CRUD) */}
          <div className="col-span-1 bg-slate-100/50 p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">High-Value Orders</h2>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">Live</span>
              </div>
              <button 
                onClick={() => handleOpenModal('create')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Icon name="PlusIcon" size={14} variant="outline" />
                Add Order
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 uppercase">
                  <tr>
                    <th className="py-2 font-bold">Restaurant Name</th>
                    <th className="py-2 font-bold text-right">Value</th>
                    <th className="py-2 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-100 transition-colors group">
                      <td className="py-2 font-bold text-slate-900">{row.name}</td>
                      <td className="py-2 font-bold text-amber-600 text-right">{row.val}</td>
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
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-500 text-sm font-medium">
                        No orders found.
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
          <span>B2C Retail Analytics · Rev. 2026-07</span>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {modalMode === 'create' ? 'Add Order' : 'Edit Order'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Restaurant Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
                  placeholder="e.g. Warung Bu Kris"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Value</label>
                <input 
                  type="text"
                  value={formData.val}
                  onChange={(e) => setFormData({...formData, val: e.target.value})}
                  placeholder="e.g. Rp 1.85M"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
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
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {modalMode === 'create' ? 'Save Order' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
  {/* Enterprise Dispatch Inbox Widget */}
  <InboxWidget />
</div>
  );
}
