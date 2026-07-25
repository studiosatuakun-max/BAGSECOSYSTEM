'use client';

import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';

// --- MOCK TENANT REGISTRY DATA ---
const initialTenants = [
  { id: 'TNT-IND-001', name: 'PT Indofood CBP Sukses Makmur', type: 'Industrial (B2B)', portalUrl: '/portal/skid', securityProtocol: '2FA Enforced + IP Whitelist', webhook: 'https://api.indofood.com/v1/bags-cng', rateLimit: '10k Req/min', status: 'Active SSL', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' },
  { id: 'TNT-IND-002', name: 'PT Unilever Indonesia Tbk', type: 'Industrial (B2B)', portalUrl: '/portal/skid', securityProtocol: '2FA Enforced + mTLS 1.3', webhook: 'https://telemetry.unilever.co.id/cng', rateLimit: '25k Req/min', status: 'Active SSL', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' },
  { id: 'TNT-HOR-101', name: 'Hotel Mulia Senayan Jakarta', type: 'Horeca (B2C)', portalUrl: '/portal/pelanggan', securityProtocol: 'Standard JWT + OTP', webhook: 'https://sys.hotelmulia.com/webhook', rateLimit: '5k Req/min', status: 'Active SSL', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' },
  { id: 'TNT-HOR-102', name: 'KFC Kemang Food Group', type: 'Horeca (B2C)', portalUrl: '/portal/pelanggan', securityProtocol: 'Standard JWT + OTP', webhook: 'https://api.fastfoodid.com/cng-sync', rateLimit: '5k Req/min', status: 'Rate Limiting', statusColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-800' },
  { id: 'TNT-IND-005', name: 'PT Astra Honda Motor Karawang', type: 'Industrial (B2B)', portalUrl: '/portal/skid', securityProtocol: '2FA Enforced + IP Whitelist', webhook: 'https://iot.astra-honda.com/bags', rateLimit: '15k Req/min', status: 'Session Locked', statusColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-300 dark:border-rose-800' },
];

export default function TenantRegistryPage() {
  const [tenants, setTenants] = useState(initialTenants);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'Industrial (B2B)',
    portalUrl: '/portal/skid',
    securityProtocol: '2FA Enforced + IP Whitelist',
    webhook: 'https://api.clientdomain.com/v1/webhook',
    rateLimit: '10k Req/min',
    status: 'Active SSL',
    statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
  });

  const filteredTenants = useMemo(() => {
    return tenants.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.webhook.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedTypeFilter === 'ALL' || t.type.includes(selectedTypeFilter);
      return matchSearch && matchType;
    });
  }, [tenants, searchQuery, selectedTypeFilter]);

  const handleOpenModal = (mode: 'create' | 'edit', tenantItem: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && tenantItem) {
      setFormData(tenantItem);
    } else {
      const randomNum = Math.floor(110 + Math.random() * 890);
      setFormData({
        id: `TNT-IND-${randomNum}`,
        name: '',
        type: 'Industrial (B2B)',
        portalUrl: '/portal/skid',
        securityProtocol: '2FA Enforced + IP Whitelist',
        webhook: 'https://api.clientdomain.com/v1/webhook',
        rateLimit: '10k Req/min',
        status: 'Active SSL',
        statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!formData.name.trim()) {
      alert('Tenant name is required');
      return;
    }
    if (modalMode === 'create') {
      setTenants([formData, ...tenants]);
    } else {
      setTenants(tenants.map((t) => (t.id === formData.id ? formData : t)));
    }
    setIsModalOpen(false);
  };

  const handleQuickAction = (id: string, actionName: string) => {
    alert(`Super Admin Root Trigger: ${actionName} executed successfully for Tenant ${id}!`);
    if (actionName === 'Lock Session') {
      setTenants(
        tenants.map((t) =>
          t.id === id
            ? { ...t, status: 'Session Locked', statusColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-300 dark:border-rose-800' }
            : t
        )
      );
    } else if (actionName === 'Reset 2FA' || actionName === 'Unlock Tenant') {
      setTenants(
        tenants.map((t) =>
          t.id === id
            ? { ...t, status: 'Active SSL', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' }
            : t
        )
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER BANNER WITH EXECUTIVE BREATHING ROOM */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-indigo-300 whitespace-nowrap shrink-0 align-middle">
            <Icon name="ShieldCheckIcon" size={14} className="text-emerald-400" />
            <span>Super Admin Tenant Control Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Global Tenant & SSO Security Registry
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed font-medium">
            Super Admin oversight of digital portal credentials for B2B Industrial (<code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300">/portal/skid</code>) and B2C Horeca (<code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300">/portal/pelanggan</code>) accounts. Managing SSL, 2FA, and API rate limits.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal('create')}
          className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap"
        >
          <Icon name="KeyIcon" size={18} />
          <span>Register New Tenant Access</span>
        </button>
      </div>

      {/* TENANT KPI METRICS (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Tenants</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">142 <span className="text-xs font-semibold text-indigo-500">Active</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Icon name="BuildingOfficeIcon" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">2FA Enforcement</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">100% <span className="text-xs font-semibold text-slate-400">Policy</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Icon name="ShieldCheckIcon" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Webhook Success Rate</span>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">99.99% <span className="text-xs font-semibold text-slate-400">Uptime</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Icon name="GlobeAltIcon" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security Lockdowns</span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">1 <span className="text-xs font-semibold text-slate-400">Suspended</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Icon name="LockClosedIcon" size={24} />
          </div>
        </div>
      </div>

      {/* DIRECTORY TABLE SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
        
        {/* Table Header Controls */}
        <div className="p-6 sm:p-7 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Icon name="UserGroupIcon" size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span>Tenant Security & API Access Directory</span>
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Active portal tenant accounts, security encryption protocols, and webhook endpoints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Type Filter */}
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Portal Tenants</option>
              <option value="Industrial">B2B Industrial (/portal/skid)</option>
              <option value="Horeca">B2C Horeca (/portal/pelanggan)</option>
            </select>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tenant name, ID, webhook..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/50 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">TENANT ID & CLIENT NAME</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">PORTAL TYPE</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">SECURITY PROTOCOL</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">WEBHOOK ENDPOINT & RATE LIMIT</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">SSL STATUS</th>
                <th className="py-3.5 px-6 text-right whitespace-nowrap shrink-0 align-middle">SECURITY ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {filteredTenants.length > 0 ? (
                filteredTenants.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    
                    {/* ID & Name */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">{item.name}</span>
                        <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{item.id}</span>
                      </div>
                    </td>

                    {/* Portal Type */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${
                        item.type.includes('Industrial') 
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      } whitespace-nowrap shrink-0 align-middle`}>
                        <Icon name={item.type.includes('Industrial') ? 'BuildingOfficeIcon' : 'FireIcon'} size={14} />
                        <span>{item.type}</span>
                      </span>
                    </td>

                    {/* Security Protocol */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <Icon name="ShieldCheckIcon" size={16} className="text-emerald-500 shrink-0" />
                        <span>{item.securityProtocol}</span>
                      </div>
                    </td>

                    {/* Webhook & Rate Limit */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 font-bold truncate max-w-xs">{item.webhook}</span>
                        <span className="text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mt-0.5">{item.rateLimit}</span>
                      </div>
                    </td>

                    {/* Slim 1-Line Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${item.statusColor} whitespace-nowrap shrink-0 align-middle shadow-2xs`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* Security Quick Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap shrink-0 align-middle">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleQuickAction(item.id, 'Reset 2FA')}
                          title="Reset 2FA Tokens"
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 whitespace-nowrap shrink-0"
                        >
                          <Icon name="ArrowPathIcon" size={13} />
                          <span>Reset 2FA</span>
                        </button>
                        <button
                          onClick={() => handleQuickAction(item.id, item.status === 'Session Locked' ? 'Unlock Tenant' : 'Lock Session')}
                          title={item.status === 'Session Locked' ? 'Unlock Tenant Access' : 'Lock Tenant Session'}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                            item.status === 'Session Locked'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          <Icon name={item.status === 'Session Locked' ? 'LockOpenIcon' : 'LockClosedIcon'} size={13} />
                          <span>{item.status === 'Session Locked' ? 'Unlock' : 'Lock'}</span>
                        </button>
                        <button
                          onClick={() => handleOpenModal('edit', item)}
                          title="Edit Security Settings"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all"
                        >
                          <Icon name="PencilSquareIcon" size={15} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                    No tenant portal accounts found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500 gap-2">
          <div>
            Showing <span className="font-extrabold text-slate-900 dark:text-white">{filteredTenants.length}</span> of <span className="font-extrabold">{tenants.length}</span> registered digital tenants.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Active SSL Certificate</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Rate Limiting Active</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Session Locked</span>
          </div>
        </div>

      </div>

      {/* --- ADVANCED LUXURY TENANT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold">
                  <Icon name={modalMode === 'create' ? 'KeyIcon' : 'PencilSquareIcon'} size={20} className="text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight">
                    {modalMode === 'create' ? 'Register Tenant Portal Access' : 'Modify Tenant Security Profile'}
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    Assign digital API & SSO credentials for active clients.
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors p-1">
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Client Organization Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., PT Wings Surya Surabaya..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Tenant Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const t = e.target.value;
                      setFormData({ ...formData, type: t, portalUrl: t.includes('Industrial') ? '/portal/skid' : '/portal/pelanggan' });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Industrial (B2B)">Industrial (B2B)</option>
                    <option value="Horeca (B2C)">Horeca (B2C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    SSL Security Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      const val = e.target.value;
                      let color = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
                      if (val === 'Rate Limiting') color = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-800';
                      if (val === 'Session Locked') color = 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-300 dark:border-rose-800';
                      setFormData({ ...formData, status: val, statusColor: color });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Active SSL">Active SSL</option>
                    <option value="Rate Limiting">Rate Limiting</option>
                    <option value="Session Locked">Session Locked</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Security Encryption Protocol
                  </label>
                  <input
                    type="text"
                    value={formData.securityProtocol}
                    onChange={(e) => setFormData({ ...formData, securityProtocol: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    API Rate Limit
                  </label>
                  <input
                    type="text"
                    value={formData.rateLimit}
                    onChange={(e) => setFormData({ ...formData, rateLimit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Telemetry Webhook URL
                </label>
                <input
                  type="text"
                  value={formData.webhook}
                  onChange={(e) => setFormData({ ...formData, webhook: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Icon name="CheckCircleIcon" size={16} />
                <span>{modalMode === 'create' ? 'Register Tenant' : 'Save Security Profile'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
