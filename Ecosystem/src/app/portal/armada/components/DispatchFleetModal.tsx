'use client';

import React, { useState, useEffect } from 'react';
import { X, Truck, Calendar, MapPin, Gauge, Box, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface DispatchFleetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DispatchFleetModal({ isOpen, onClose }: DispatchFleetModalProps) {
  const [activeTab, setActiveTab] = useState<'CNF' | 'Horeca'>('CNF');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSaved(false);
      setIsAuthenticating(false);
      setActiveTab('CNF');
    }
  }, [isOpen]);

  const handleSave = () => {
    setIsAuthenticating(true);
    // Simulate Card Tap Auth
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsSaved(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Truck className="text-cyan-400" />
              New Fleet Dispatch
            </h2>
            <p className="text-sm text-slate-400 mt-1">Issue official delivery documents</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors z-10">
            <X size={20} />
          </button>
        </div>

        {/* Auth Overlay */}
        {isAuthenticating && (
          <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Authenticating PPC...</h3>
            <p className="text-slate-400 flex items-center gap-2">
              <ShieldCheck size={18} className="text-cyan-400" />
              Please tap your Alien H9 RFID Card
            </p>
          </div>
        )}

        {isSaved && (
          <div className="absolute inset-0 z-50 bg-emerald-950/90 backdrop-blur flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <ShieldCheck size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-emerald-400 mb-2">Dispatch Authorized</h3>
            <p className="text-emerald-200/60">GPS Telemetry Activated. Fleet may depart.</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-950 rounded-lg">
            <button
              onClick={() => setActiveTab('CNF')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                activeTab === 'CNF' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Surat Jalan CNF (Tubeskid)
            </button>
            <button
              onClick={() => setActiveTab('Horeca')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                activeTab === 'Horeca' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Delivery Order (12kg Horeca)
            </button>
          </div>

          {activeTab === 'CNF' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Surat Jalan Number</label>
                  <input type="text" disabled value={`SJ/CNG/2026/08/${Math.floor(Math.random() * 900) + 100}`} className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Customer / Destination</label>
                  <select className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none">
                    <option>PT Unilever (Gresik)</option>
                    <option>PT Indofood (Pasuruan)</option>
                    <option>PT Mayora (Mojokerto)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Truck size={14} /> Fleet Identity
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">GTM Unit</label>
                    <select className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm">
                      <option>GTM-40-01 (40ft)</option>
                      <option>GTM-20-05 (20ft)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Head Truck Plate</label>
                    <input type="text" defaultValue="L 9123 GAH" className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Driver SIO ID</label>
                    <input type="text" defaultValue="Dian Prasetyo" className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Gauge size={14} /> Mother Station Departure Params
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Depart Pressure (Bar)</label>
                    <div className="relative">
                      <input type="number" defaultValue="245" className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm pl-9" />
                      <Gauge size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Depart Temp (°C)</label>
                    <input type="number" defaultValue="31" className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                  <Tag size={12} /> Data auto-synced from Form 101 Master Fueling
                </p>
              </div>

            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Delivery Order Number</label>
                  <input type="text" disabled value={`DO/HOR/2026/08/${Math.floor(Math.random() * 90) + 10}`} className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Horeca Customer</label>
                  <select className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none">
                    <option>Aston Hotel Surabaya</option>
                    <option>Sederhana Resto Sidoarjo</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Truck size={14} /> Retail Fleet
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Vehicle Type</label>
                    <select className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm">
                      <option>Colt Diesel</option>
                      <option>Pick Up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Plate Number</label>
                    <input type="text" defaultValue="L 8452 TX" className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Driver Name</label>
                    <input type="text" defaultValue="Budi Santoso" className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Box size={14} /> Cylinder Exchange Setup
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-emerald-400 mb-1">Qty Delivered (FULL)</label>
                    <input type="number" defaultValue="20" className="w-full bg-slate-900 border border-emerald-500/50 text-emerald-400 px-3 py-2 rounded-lg text-lg font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-400 mb-1">Qty Expected (EMPTY)</label>
                    <input type="number" defaultValue="20" className="w-full bg-slate-900 border border-amber-500/50 text-amber-400 px-3 py-2 rounded-lg text-lg font-bold" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 rounded-xl text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            Authorize Dispatch <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
