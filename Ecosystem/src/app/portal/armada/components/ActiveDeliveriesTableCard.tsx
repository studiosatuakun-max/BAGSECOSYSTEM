'use client';

import React, { useState } from 'react';
import { MOCK_SURAT_JALAN_CNF, MOCK_DO_HORECA } from '../data/mockArmadaData';
import { SuratJalanCNF, DeliveryOrderHoreca } from '../_integration/types';
import Icon from '@/components/ui/AppIcon';
import { Truck, Search, Plus, MapPin, Clock, FileCheck, CheckCircle2, AlertTriangle, ArrowRight, Package } from 'lucide-react';
import DispatchFleetModal from './DispatchFleetModal';
import LiveGPSTrackerModal from './LiveGPSTrackerModal';

export default function ActiveDeliveriesTableCard() {
  const [activeTab, setActiveTab] = useState<'CNF' | 'Horeca'>('CNF');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isGPSModalOpen, setIsGPSModalOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<any>(null);

  const openGPS = (plat: string, driver: string, type: 'CNF'|'Horeca') => {
    setSelectedTruck({ plat, driver, type });
    setIsGPSModalOpen(true);
  };

  const filteredCNF = MOCK_SURAT_JALAN_CNF.filter(sj => 
    sj.no_pengiriman.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sj.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredHoreca = MOCK_DO_HORECA.filter(do_ => 
    do_.no_do.toLowerCase().includes(searchTerm.toLowerCase()) ||
    do_.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl flex flex-col h-full relative overflow-hidden group">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Truck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Fleet & Logistics Control</h2>
            <p className="text-sm text-slate-400 mt-0.5">Live tracking for Surat Jalan CNF (Tubeskid) & DO Horeca (Cylinders)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search ID or Destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
          <button onClick={() => setIsDispatchModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-nowrap shrink-0">
            <Plus size={18} />
            <span className="hidden sm:inline">Dispatch New</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-700/50 pb-2 relative z-10">
        <button 
          onClick={() => setActiveTab('CNF')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'CNF' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Industri (Tubeskid CNF)
        </button>
        <button 
          onClick={() => setActiveTab('Horeca')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'Horeca' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          HORECA 12kg (Retail DO)
        </button>
      </div>

      {/* Tables */}
      <div className="overflow-x-auto overflow-y-auto h-[350px] custom-scrollbar rounded-xl border border-slate-800/60 bg-slate-900/40 relative z-10">
        {activeTab === 'CNF' ? (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/50 shadow-sm">
                <th className="p-4 font-medium">Surat Jalan</th>
                <th className="p-4 font-medium">Destination</th>
                <th className="p-4 font-medium">Fleet Unit</th>
                <th className="p-4 font-medium">Status & Time</th>
                <th className="p-4 font-medium">Validation</th>
                <th className="p-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredCNF.map((sj) => (
                <tr key={sj.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-white text-sm">{sj.no_pengiriman}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {new Date(sj.depart_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-cyan-300 font-medium capitalize">{sj.customer_id.replace('cust-', '')}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 max-w-[200px] truncate">
                      <MapPin size={10} className="shrink-0" /> {sj.customer_address}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-white">{sj.no_gtm}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{sj.no_head} • {sj.driver_id}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                    {sj.status === 'Dispatched' && <span>En Route to Client</span>}
                    {sj.status === 'Discharging' && <span>Discharging @ {new Date(sj.prs_start_time!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                    {sj.status === 'Returning' && <span>Returning to MS</span>}
                    <button onClick={() => openGPS(sj.no_head, sj.driver_id, 'CNF')} className="ml-2 px-2 py-0.5 bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 rounded text-xs border border-slate-700 transition-colors">
                      <MapPin size={10} className="inline mr-1"/> GPS
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <div title="PPC" className={`w-5 h-5 flex items-center justify-center rounded-full border ${sj.signed_by_ppc ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><FileCheck size={10} /></div>
                      <div title="Driver" className={`w-5 h-5 flex items-center justify-center rounded-full border ${sj.signed_by_driver ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><Truck size={10} /></div>
                      <div title="Customer" className={`w-5 h-5 flex items-center justify-center rounded-full border ${sj.signed_by_customer ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><CheckCircle2 size={10} /></div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 align-middle border ${
                      sj.status === 'Discharging' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
                      sj.status === 'Returning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {sj.status === 'Discharging' ? <ArrowRight size={12} /> : <AlertTriangle size={12} />}
                      {sj.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/50 shadow-sm">
                <th className="p-4 font-medium">Delivery Order</th>
                <th className="p-4 font-medium">Destination</th>
                <th className="p-4 font-medium">Vehicle</th>
                <th className="p-4 font-medium">Exchange (Full/Empty)</th>
                <th className="p-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredHoreca.map((do_) => (
                <tr key={do_.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-white text-sm">{do_.no_do}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Depart: {new Date(do_.depart_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="p-4 text-sm font-medium text-cyan-300">
                    {do_.customer_id}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-white">{do_.vehicle_plate}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{do_.vehicle_type} • {do_.driver_id}</div>
                    <button onClick={() => openGPS(do_.vehicle_plate, do_.driver_id, 'Horeca')} className="mt-1 px-2 py-0.5 bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 rounded text-xs border border-slate-700 transition-colors">
                      <MapPin size={10} className="inline mr-1"/> GPS
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <Package size={14} /> +{do_.qty_delivered_full}
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <Package size={14} /> -{do_.qty_returned_empty}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 align-middle border ${
                      do_.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {do_.status === 'Delivered' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {do_.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DispatchFleetModal 
        isOpen={isDispatchModalOpen} 
        onClose={() => setIsDispatchModalOpen(false)} 
      />

      <LiveGPSTrackerModal 
        isOpen={isGPSModalOpen}
        onClose={() => setIsGPSModalOpen(false)}
        truckData={selectedTruck}
      />
    </div>
  );
}
