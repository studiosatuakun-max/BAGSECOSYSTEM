'use client';

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

const leadsData = [
  { name: 'Week 1', leads: 45, conversion: 12 },
  { name: 'Week 2', leads: 52, conversion: 18 },
  { name: 'Week 3', leads: 38, conversion: 15 },
  { name: 'Week 4', leads: 65, conversion: 22 },
];

const initialCampaigns = [
  { id: 'CMP-01', name: 'B2B Q3 Retargeting', plat: 'LinkedIn', stat: 'Running' },
  { id: 'CMP-02', name: 'Horeca Promo Merdeka', plat: 'Instagram', stat: 'Running' },
  { id: 'CMP-03', name: 'SME Awareness Push', plat: 'Google Ads', stat: 'Paused' },
  { id: 'CMP-04', name: 'Milk-Run Expansion', plat: 'Email', stat: 'Draft' },
];

export default function MarketingDashboardPage() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', name: '', plat: 'LinkedIn', stat: 'Draft' });

  const handleOpenModal = (mode: 'create' | 'edit', campaign: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && campaign) {
      setFormData(campaign);
    } else {
      setFormData({ id: `CMP-0${Math.floor(5 + Math.random() * 9)}`, name: '', plat: 'LinkedIn', stat: 'Draft' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.name) return alert('Campaign Name is required');
    if (modalMode === 'create') {
      setCampaigns([formData, ...campaigns]);
    } else {
      setCampaigns(campaigns.map(c => c.id === formData.id ? formData : c));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
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
            <span className="font-extrabold text-sm text-slate-900 leading-tight">Baskara Marketing</span>
            <span className="text-[10px] text-slate-500 font-medium">Sales & Leads Center</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-bold border border-pink-200">
            <div className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" />
            CMO Access
          </div>
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs font-bold text-slate-900">09:03:16</span>
            <span className="text-[10px] text-slate-500 font-medium">Live Metrics</span>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 pb-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          
          {/* Key Metrics - Row 1 */}
          <div className="col-span-1 bg-pink-50 p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0ms' }}>
            <span className="text-xs font-bold text-pink-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="MegaphoneIcon" size={16} /> Total Leads (MTD)
            </span>
            <div className="mt-4 text-4xl font-extrabold text-pink-900">200</div>
            <span className="text-xs text-pink-700 font-semibold mt-2">↑ +15% vs Last Month</span>
          </div>

          <div className="col-span-1 bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '80ms' }}>
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="CursorArrowRaysIcon" size={16} /> Conversion Rate
            </span>
            <div className="mt-4 text-4xl font-extrabold text-purple-900">33.5%</div>
            <span className="text-xs text-purple-700 font-semibold mt-2">67 Deals Closed</span>
          </div>

          <div className="col-span-1 bg-violet-50 p-6 rounded-2xl border border-violet-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '160ms' }}>
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="GlobeAltIcon" size={16} /> Campaign Reach
            </span>
            <div className="mt-4 text-4xl font-extrabold text-violet-900">1.2M</div>
            <span className="text-xs text-violet-700 font-semibold mt-2">Across Social & Ads</span>
          </div>

          <div className="col-span-1 bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '240ms' }}>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="CurrencyDollarIcon" size={16} /> CAC (Cost Per Acq.)
            </span>
            <div className="mt-4 text-4xl font-extrabold text-rose-900">Rp 120k</div>
            <span className="text-xs text-rose-700 font-semibold mt-2">↓ -5% (Improved Efficiency)</span>
          </div>

          {/* Charts Row - Row 2 */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: '320ms' }}>
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Leads vs Conversion (July)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} name="Total Leads" />
                  <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} name="Converted" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Campaign Pipeline Table (CRUD) */}
          <div className="col-span-1 lg:col-span-2 bg-slate-100/50 p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active Campaigns</h2>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">B2B & B2C</span>
              </div>
              <button 
                onClick={() => handleOpenModal('create')}
                className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Icon name="PlusIcon" size={14} variant="outline" />
                Add Campaign
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 uppercase">
                  <tr>
                    <th className="py-2 font-bold">Campaign Name</th>
                    <th className="py-2 font-bold">Platform</th>
                    <th className="py-2 font-bold text-right">Status</th>
                    <th className="py-2 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {campaigns.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-100 transition-colors group">
                      <td className="py-2 font-bold text-slate-900">{row.name}</td>
                      <td className="py-2 text-slate-600 font-medium">{row.plat}</td>
                      <td className="py-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          row.stat === 'Running' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                          row.stat === 'Paused' ? 'bg-slate-200 text-slate-700 border-slate-300' :
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
                  {campaigns.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500 text-sm font-medium">
                        No campaigns found.
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
          <span className="font-medium tracking-wide">Baskara Marketing Engine v2.4.1</span>
          <span>Growth & Leads Analytics · Rev. 2026-07</span>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {modalMode === 'create' ? 'Create Campaign' : 'Edit Campaign'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Campaign Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                  placeholder="e.g. Q4 Flash Sale"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Platform</label>
                  <select 
                    value={formData.plat}
                    onChange={(e) => setFormData({...formData, plat: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Email">Email</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Status</label>
                  <select 
                    value={formData.stat}
                    onChange={(e) => setFormData({...formData, stat: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Running">Running</option>
                    <option value="Paused">Paused</option>
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
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {modalMode === 'create' ? 'Create Campaign' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}