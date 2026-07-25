'use client';

import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const distanceData = [
  { time: '06:00', distance: 120 },
  { time: '09:00', distance: 340 },
  { time: '12:00', distance: 650 },
  { time: '15:00', distance: 890 },
  { time: '18:00', distance: 1120 },
  { time: '21:00', distance: 1450 },
];

const initialVehicles = [
  { id: 'V-01', plat: 'B 1234 GAH', driver: 'Dian Prasetyo', stat: 'Moving (60 km/h)' },
  { id: 'V-02', plat: 'B 5678 TX', driver: 'Budi Santoso', stat: 'Moving (45 km/h)' },
  { id: 'V-03', plat: 'B 9101 BRS', driver: 'Andi Wijaya', stat: 'Idle (12m)' },
  { id: 'V-04', plat: 'B 1122 PO', driver: 'Joko Anwar', stat: 'Maintenance' },
];

export default function ArmadaDashboardPage() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ id: '', plat: '', driver: '', stat: 'Idle (0m)' });

  const handleOpenModal = (mode: 'create' | 'edit', vehicle: any = null) => {
    setModalMode(mode);
    if (mode === 'edit' && vehicle) {
      setFormData(vehicle);
    } else {
      setFormData({ id: `V-0${Math.floor(5 + Math.random() * 9)}`, plat: '', driver: '', stat: 'Idle (0m)' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.plat || !formData.driver) return alert('Plate Number and Driver are required');
    if (modalMode === 'create') {
      setVehicles([formData, ...vehicles]);
    } else {
      setVehicles(vehicles.map(v => v.id === formData.id ? formData : v));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle record?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Top Header */}
      <PortalHeader
        title="FleetTrack Admin"
        subtitle="Armada Control System"
        roleBadge="Fleet Manager"
        roleColor="blue"
        showInbox={true}
        rightCustom={
          <div className="hidden sm:flex flex-col text-right justify-center font-mono leading-tight">
            <span className="text-xs font-bold text-foreground">09:03:16</span>
            <span className="text-[10px] text-muted-foreground font-medium">GPS Live tracking</span>
          </div>
        }
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 pb-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          
          {/* Key Metrics - Row 1 */}
          <div className="col-span-1 bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0ms' }}>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="TruckIcon" size={16} /> Active Vehicles
            </span>
            <div className="mt-4 text-4xl font-extrabold text-blue-900">124</div>
            <span className="text-xs text-blue-700 font-semibold mt-2">Dari total 130 armada</span>
          </div>

          <div className="col-span-1 bg-sky-50 p-6 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '80ms' }}>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="MapIcon" size={16} /> Total Distance (Today)
            </span>
            <div className="mt-4 text-4xl font-extrabold text-sky-900">1,450 km</div>
            <span className="text-xs text-sky-700 font-semibold mt-2">Across 18 milk-run routes</span>
          </div>

          <div className="col-span-1 bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '160ms' }}>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="WrenchScrewdriverIcon" size={16} /> In Maintenance
            </span>
            <div className="mt-4 text-4xl font-extrabold text-amber-900">6</div>
            <span className="text-xs text-amber-700 font-semibold mt-2">Routine checkups</span>
          </div>

          <div className="col-span-1 bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '240ms' }}>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
              <Icon name="ExclamationTriangleIcon" size={16} /> Critical Alerts
            </span>
            <div className="mt-4 text-4xl font-extrabold text-rose-900">2</div>
            <span className="text-xs text-rose-700 font-semibold mt-2">1 Speeding, 1 Idle &gt; 30m</span>
          </div>

          {/* Charts Row - Row 2 */}
          <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: '320ms' }}>
            <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Fleet Distance Tracking (Today)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={distanceData}>
                  <defs>
                    <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="distance" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorDist)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active GPS Vehicles Table (CRUD) */}
          <div className="col-span-1 lg:col-span-2 bg-slate-100/50 p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Live GPS Tracking</h2>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">Updated 10s ago</span>
              </div>
              <button 
                onClick={() => handleOpenModal('create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Icon name="PlusIcon" size={14} variant="outline" />
                Add Vehicle
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 uppercase">
                  <tr>
                    <th className="py-2 font-bold">Plat Number</th>
                    <th className="py-2 font-bold">Driver</th>
                    <th className="py-2 font-bold text-right">Status</th>
                    <th className="py-2 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {vehicles.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-100 transition-colors group">
                      <td className="py-2 font-bold text-slate-900">{row.plat}</td>
                      <td className="py-2 text-slate-600 font-medium">{row.driver}</td>
                      <td className="py-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          row.stat.includes('Moving') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          row.stat.includes('Idle') ? 'bg-amber-50 text-amber-700 border-amber-200' :
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
                  {vehicles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500 text-sm font-medium">
                        No vehicles found.
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
          <span className="font-medium tracking-wide">FleetTrack System v2.4.1</span>
          <span>Logistics & GPS Analytics · Rev. 2026-07</span>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                {modalMode === 'create' ? 'Add Vehicle' : 'Edit Vehicle'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700 transition-colors">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Plat Number</label>
                <input 
                  type="text" 
                  value={formData.plat}
                  onChange={(e) => setFormData({...formData, plat: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="e.g. B 1234 GAH"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Driver Name</label>
                <input 
                  type="text"
                  value={formData.driver}
                  onChange={(e) => setFormData({...formData, driver: e.target.value})}
                  placeholder="e.g. Dian Prasetyo"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Status</label>
                <select 
                  value={formData.stat}
                  onChange={(e) => setFormData({...formData, stat: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Idle (0m)">Idle (0m)</option>
                  <option value="Idle (12m)">Idle (12m)</option>
                  <option value="Moving (45 km/h)">Moving (45 km/h)</option>
                  <option value="Moving (60 km/h)">Moving (60 km/h)</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Offline">Offline</option>
                </select>
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {modalMode === 'create' ? 'Add Vehicle' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
  <Footer />
    </div>
  );
}