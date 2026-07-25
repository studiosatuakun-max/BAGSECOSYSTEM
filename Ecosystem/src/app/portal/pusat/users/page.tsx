'use client';

import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  division: string;
  status: string;
  statusColor: string;
  pin: string | null;
};

const initialUsers: UserData[] = [
  { id: 'USR-CORE-001', name: 'Bagus Supriyanto', email: 'bagus@baskaraghas.com', role: 'Super Admin Core', division: 'Pusat (Root)', status: 'Active SSO', statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-800', pin: '839210' },
  { id: 'USR-FIN-002', name: 'Rini Andini, S.E.', email: 'rini@baskaraghas.com', role: 'Finance Vice President', division: 'Keuangan', status: 'Active SSO', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800', pin: '442190' },
  { id: 'USR-STA-003', name: 'Budi Santoso, T.T.', email: 'budi.s@baskaraghas.com', role: 'Mother Station Chief Eng', division: 'Stasiun', status: 'Active SSO', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800', pin: '551029' },
  { id: 'USR-ARM-004', name: 'Agus Purnomo (Skid #04)', email: 'agus.driver@baskaraghas.com', role: 'Prime Mover Driver ATEX', division: 'Armada', status: 'Suspended', statusColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-300 dark:border-rose-800', pin: null },
  { id: 'USR-MKT-005', name: 'Hendra Wijaya', email: 'hendra@baskaraghas.com', role: 'Senior Commercial AE', division: 'Pemasaran', status: 'Active SSO', statusColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800', pin: null },
  { id: 'USR-ARM-006', name: 'Suryadi (Skid #09)', email: 'suryadi.driver@baskaraghas.com', role: 'Prime Mover Driver ATEX', division: 'Armada', status: 'Active SSO', statusColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800', pin: '912044' },
];

export default function EnterpriseRbacUsersPage() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivFilter, setSelectedDivFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<UserData>({
    id: '',
    name: '',
    email: '@baskaraghas.com',
    role: 'Station Operator ATEX',
    division: 'Stasiun',
    status: 'Active SSO',
    statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    pin: '102934',
  });

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiv = selectedDivFilter === 'ALL' || u.division.includes(selectedDivFilter);
      return matchSearch && matchDiv;
    });
  }, [users, searchQuery, selectedDivFilter]);

  const generatePin = (id: string, name: string) => {
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    setUsers(users.map((u) => (u.id === id ? { ...u, pin: newPin, status: 'Active SSO', statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' } : u)));
    alert(`Super Admin Root: Generated new 6-digit access PIN (${newPin}) for personnel ${name}. Syncing with PWA Mobile Driver and Station terminals!`);
  };

  const handleOpenModal = (mode: 'create' | 'edit', userItem: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && userItem) {
      setFormData(userItem);
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900);
      setFormData({
        id: `USR-ENT-${randomNum}`,
        name: '',
        email: '@baskaraghas.com',
        role: 'Station Operator ATEX',
        division: 'Stasiun',
        status: 'Active SSO',
        statusColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        pin: Math.floor(100000 + Math.random() * 900000).toString(),
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Name and Email are required');
      return;
    }
    if (modalMode === 'create') {
      setUsers([formData, ...users]);
    } else {
      setUsers(users.map((u) => (u.id === formData.id ? formData : u)));
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'Suspended' ? 'Active SSO' : 'Suspended';
          const newColor = newStatus === 'Suspended' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-300 dark:border-rose-800' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          return { ...u, status: newStatus, statusColor: newColor };
        }
        return u;
      })
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER BANNER WITH EXECUTIVE BREATHING ROOM */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-purple-300 whitespace-nowrap shrink-0 align-middle">
            <Icon name="KeyIcon" size={14} className="text-emerald-400" />
            <span>Centralized Identity Provider & RBAC Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Enterprise RBAC & Driver PIN Matrix
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed font-medium">
            Centralized Single Sign-On (SSO) identity management, Role-Based Access Control (RBAC) permissions across all 9 portals, and secure 6-digit access PIN generators for Skid drivers (<code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300">/portal/armada</code>) and Mother Station technicians.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal('create')}
          className="px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap"
        >
          <Icon name="UserPlusIcon" size={18} />
          <span>Assign RBAC Personnel</span>
        </button>
      </div>

      {/* ENTERPRISE RBAC KPI METRICS (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enterprise Users</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">412 <span className="text-xs font-semibold text-indigo-500">Personnel</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Icon name="UsersIcon" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Super Admin Root Roles</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">3 <span className="text-xs font-semibold text-slate-400">Identities</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Icon name="ShieldCheckIcon" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Driver PINs</span>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">184 <span className="text-xs font-semibold text-slate-400">Skid Drivers</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Icon name="KeyIcon" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SSO Security Status</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">100% <span className="text-xs font-semibold text-slate-400">MFA Protected</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Icon name="LockClosedIcon" size={24} />
          </div>
        </div>
      </div>

      {/* RBAC DIRECTORY TABLE SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
        
        {/* Table Header Controls */}
        <div className="p-6 sm:p-7 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Icon name="UsersIcon" size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span>Enterprise RBAC Identity & Access Matrix</span>
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Active staff credentials, assigned division portals, and 6-digit terminal PIN status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Division Filter */}
            <select
              value={selectedDivFilter}
              onChange={(e) => setSelectedDivFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Divisions (9 Portals)</option>
              <option value="Pusat">Modul Pusat (Root)</option>
              <option value="Stasiun">Modul Stasiun</option>
              <option value="Armada">Modul Armada</option>
              <option value="Keuangan">Modul Keuangan</option>
              <option value="Pemasaran">Modul Pemasaran</option>
            </select>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, role, ID..."
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
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">USER ID & PERSONNEL NAME</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">SSO EMAIL & CREDENTIALS</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">ASSIGNED DIVISION PORTAL</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">RBAC ROLE TITLE</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">DRIVER ACCESS PIN (6-DIGIT)</th>
                <th className="py-3.5 px-6 whitespace-nowrap shrink-0 align-middle">SSO STATUS</th>
                <th className="py-3.5 px-6 text-right whitespace-nowrap shrink-0 align-middle">SECURITY ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    
                    {/* ID & Name */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">{item.name}</span>
                        <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{item.id}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {item.email}
                    </td>

                    {/* Division */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${
                        item.division.includes('Pusat') 
                          ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : item.division.includes('Stasiun')
                          ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                          : item.division.includes('Armada')
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      } whitespace-nowrap shrink-0 align-middle`}>
                        <Icon name="BriefcaseIcon" size={14} />
                        <span>{item.division}</span>
                      </span>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle font-bold text-slate-900 dark:text-white">
                      {item.role}
                    </td>

                    {/* Driver PIN Status */}
                    <td className="py-4 px-6 whitespace-nowrap shrink-0 align-middle">
                      {item.pin ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                            {item.pin}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">● Active</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium text-xs italic">Not Required (Web SSO)</span>
                      )}
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

                    {/* Quick Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap shrink-0 align-middle">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          onClick={() => generatePin(item.id, item.name)}
                          title="Generate New 6-Digit PIN"
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 whitespace-nowrap shrink-0"
                        >
                          <Icon name="ArrowPathIcon" size={13} />
                          <span>Rotate PIN</span>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          title={item.status === 'Suspended' ? 'Activate SSO Access' : 'Suspend SSO Access'}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                            item.status === 'Suspended'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          <Icon name={item.status === 'Suspended' ? 'CheckCircleIcon' : 'NoSymbolIcon'} size={13} />
                          <span>{item.status === 'Suspended' ? 'Activate' : 'Suspend'}</span>
                        </button>
                        <button
                          onClick={() => handleOpenModal('edit', item)}
                          title="Edit RBAC Profile"
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
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                    No enterprise personnel found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-500 gap-2">
          <div>
            Showing <span className="font-extrabold text-slate-900 dark:text-white">{filteredUsers.length}</span> of <span className="font-extrabold">{users.length}</span> enterprise identity accounts.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Active SSO / MFA</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Super Admin Root</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Account Suspended</span>
          </div>
        </div>

      </div>

      {/* --- ADVANCED LUXURY RBAC USER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold">
                  <Icon name={modalMode === 'create' ? 'UserPlusIcon' : 'PencilSquareIcon'} size={20} className="text-purple-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight">
                    {modalMode === 'create' ? 'Assign New Enterprise Personnel' : 'Modify Personnel RBAC Matrix'}
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    Set SSO login credentials and portal division access.
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
                  Personnel Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Wahyu Santoso, S.T...."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Corporate SSO Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., wahyu@baskaraghas.com..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Assigned Division
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Pusat (Root)">Modul Pusat (Root Authority)</option>
                    <option value="Stasiun">Modul Stasiun</option>
                    <option value="Armada">Modul Armada</option>
                    <option value="Keuangan">Modul Keuangan</option>
                    <option value="Pemasaran">Modul Pemasaran</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    SSO Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      const val = e.target.value;
                      const color = val === 'Suspended' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-300 dark:border-rose-800' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
                      setFormData({ ...formData, status: val, statusColor: color });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Active SSO">Active SSO / MFA</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    RBAC Role Title
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Driver PIN (6-Digit)
                  </label>
                  <input
                    type="text"
                    value={formData.pin || ''}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value || null })}
                    placeholder="Leave empty if web only..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
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
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Icon name="CheckCircleIcon" size={16} />
                <span>{modalMode === 'create' ? 'Deploy RBAC Account' : 'Save Access Profile'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
