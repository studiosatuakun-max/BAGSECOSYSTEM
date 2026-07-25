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

const consumptionData = [
  { name: 'Mon', consumption: 4500 },
  { name: 'Tue', consumption: 4800 },
  { name: 'Wed', consumption: 4100 },
  { name: 'Thu', consumption: 5200 },
  { name: 'Fri', consumption: 5000 },
];

const initialOrders = [
  { id: 'PO-B2B-8991', date: 'Jul 24, 2026', stat: 'Delivered' },
  { id: 'PO-B2B-8992', date: 'Jul 28, 2026', stat: 'Scheduled' },
  { id: 'PO-B2B-8993', date: 'Aug 02, 2026', stat: 'Processing' },
];

export default function SkidPortalDashboardPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', date: '', stat: 'Processing' });

  const handleOpenModal = (mode: 'create' | 'edit', order: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && order) {
      setFormData(order);
    } else {
      setFormData({ id: `PO-B2B-${Math.floor(9000 + Math.random() * 999)}`, date: '', stat: 'Processing' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.date) return alert('Delivery Date is required');
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
            <span className="font-extrabold text-sm text-slate-900 leading-tight">SkidPortal B2B</span>
            <span className="text-[10px] text-slate-500 font-medium">Industrial Client Portal</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <InboxWidget variant="header" />
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Client Access (PT Indofood)
          </div>
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-900">09:03:16</span>
            <span className="text-[10px] text-slate-500 font-medium">Live Telemetry</span>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 pb-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          
          {/* Key Metrics - Row 1 */}
          <div className="col-span-1 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0ms' }}>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="FireIcon" size={16} /> Current Consumption
            </span>
            <div className="mt-4 text-4xl font-extrabold text-indigo-900">145 <span className="text-lg">kg/h</span></div>
            <span className="text-xs text-indigo-700 font-semibold mt-2">Normal Range</span>
          </div>

          <div className="col-span-1 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '80ms' }}>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="CubeIcon" size={16} /> Tubeskid Level
            </span>
            <div className="mt-4 text-4xl font-extrabold text-emerald-900">85%</div>
            <span className="text-xs text-emerald-700 font-semibold mt-2">Est. empty in 4 days</span>
          </div>

          <div className="col-span-1 bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '160ms' }}>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="ArrowsRightLeftIcon" size={16} /> Inlet Pressure
            </span>
            <div className="mt-4 text-4xl font-extrabold text-amber-900">4.8 <span className="text-lg">Bar</span></div>
            <span className="text-xs text-amber-700 font-semibold mt-2">Nominal (Limit: 5.0)</span>
          </div>

          <div className="col-span-1 bg-sky-50 p-6 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '240ms' }}>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="DocumentCheckIcon" size={16} /> Latest Invoice
            </span>
            <div className="mt-4 text-4xl font-extrabold text-sky-900">Rp 45M</div>
            <span className="text-xs text-sky-700 font-semibold mt-2">Due on Aug 10, 2026</span>
          </div>

          {/* Charts Row - Row 2 */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: '320ms' }}>
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Gas Consumption (kg) - This Week</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Bar dataKey="consumption" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Consumption (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Delivery Status Table (CRUD) */}
          <div className="col-span-1 lg:col-span-2 bg-slate-100/50 p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Deliveries</h2>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">Automated Order</span>
              </div>
              <button 
                onClick={() => handleOpenModal('create')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Icon name="PlusIcon" size={14} variant="outline" />
                New Order
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 uppercase">
                  <tr>
                    <th className="py-2 font-bold">PO Number</th>
                    <th className="py-2 font-bold">Delivery Date</th>
                    <th className="py-2 font-bold text-right">Status</th>
                    <th className="py-2 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-100 transition-colors group">
                      <td className="py-2 font-bold text-slate-900">{row.id}</td>
                      <td className="py-2 text-slate-600 font-medium">{row.date}</td>
                      <td className="py-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          row.stat === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          row.stat === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
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
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500 text-sm font-medium">
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
          <span className="font-medium tracking-wide">Baskara Client Portal v2.4.1</span>
          <span>B2B Industrial Interface · Rev. 2026-07</span>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {modalMode === 'create' ? 'Create Order' : 'Edit Order'}
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
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Delivery Date</label>
                  <input 
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    placeholder="e.g. Aug 10, 2026"
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
                    <option value="Processing">Processing</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Delivered">Delivered</option>
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
                {modalMode === 'create' ? 'Create Order' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
  {/* Enterprise Dispatch Inbox Widget */}
</div>
  );
}