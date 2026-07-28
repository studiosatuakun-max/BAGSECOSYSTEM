'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { CreditCard, ScanLine, Save, Fingerprint, Lock, ShieldCheck, Zap } from 'lucide-react';

interface Form101ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function Form101Modal({ isOpen, onClose, onSave }: Form101ModalProps) {
  const [step, setStep] = useState<'auth' | 'form'>('auth');
  const [isScanningAuth, setIsScanningAuth] = useState(false);
  const [operatorInfo, setOperatorInfo] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    queueNo: '',
    customer: 'PT. Galang (FOB)',
    tubeTrailerNo: '',
    noPol: '',
    lwc: '',
    pressureInitial: '',
    pressureFull: '',
    volNm3: '',
    volKg: '',
    hourStart: '',
    hourFinish: '',
  });

  const [isSyncingFlowMeter, setIsSyncingFlowMeter] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('auth');
      setOperatorInfo(null);
      setFormData({
        queueNo: `Q-${Math.floor(100 + Math.random() * 900)}`,
        customer: 'PT. Galang (FOB)',
        tubeTrailerNo: '',
        noPol: '',
        lwc: '',
        pressureInitial: '',
        pressureFull: '',
        volNm3: '',
        volKg: '',
        hourStart: '',
        hourFinish: '',
      });
    }
  }, [isOpen]);

  const simulateAlienH9Tap = () => {
    setIsScanningAuth(true);
    setTimeout(() => {
      setOperatorInfo({
        name: 'Lukman Arif',
        role: 'Head Operator MS',
        sio: 'SIO-ATEX-8922',
        cardEpc: 'EPC:ALIEN:H9:1024BITS',
      });
      setIsScanningAuth(false);
      setStep('form');
    }, 1500);
  };

  const simulateFlowMeterSync = () => {
    setIsSyncingFlowMeter(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        volNm3: '6392',
        volKg: '866.0',
        pressureFull: '240',
        hourStart: '63873.1',
        hourFinish: '63873.7'
      }));
      setIsSyncingFlowMeter(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 flex items-center justify-between border-b border-indigo-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Icon name="DocumentTextIcon" size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white tracking-tight">Master Fueling & Machine Log</h3>
              <p className="text-[11px] text-indigo-300">Form 101 & Form 102 Integrated Entry</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Auth Step */}
        {step === 'auth' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className={`w-24 h-24 rounded-3xl bg-slate-800 border-2 border-dashed ${isScanningAuth ? 'border-indigo-500 animate-pulse' : 'border-slate-600'} flex items-center justify-center relative z-10`}>
                <CreditCard size={40} className={isScanningAuth ? 'text-indigo-400' : 'text-slate-500'} />
              </div>
              {isScanningAuth && (
                <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl animate-ping" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Operator Authentication Required</h4>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Please tap your <strong>Alien H9 RFID Card</strong> to the reader to verify your SIO ATEX certification before starting the compressor.
              </p>
            </div>
            <button
              onClick={simulateAlienH9Tap}
              disabled={isScanningAuth}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70"
            >
              <ScanLine size={18} className={isScanningAuth ? 'animate-spin' : ''} />
              {isScanningAuth ? 'Reading User Memory 1024-Bits...' : 'Simulate Card Tap (CT-i607)'}
            </button>
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && (
          <div className="flex flex-col h-full max-h-[75vh]">
            {/* Operator Badge */}
            <div className="bg-slate-800/50 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="text-xs text-slate-300">Auth: <strong className="text-emerald-400">{operatorInfo.name}</strong> ({operatorInfo.sio})</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">{operatorInfo.cardEpc}</span>
            </div>

            <div className="p-6 overflow-y-auto scrollbar-thin space-y-6 flex-1">
              {/* Tubeskid Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Package size={14} /> 1. Tubeskid Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Customer / Scheme</label>
                    <select className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500">
                      <option>PT. Galang (FOB)</option>
                      <option>PT. Unilever (CNF)</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tube Trailer No</label>
                    <input type="text" placeholder="e.g. TUB-20" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">No Polisi</label>
                    <input type="text" placeholder="W 8912 BA" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">LWC (Kg)</label>
                    <input type="text" placeholder="3960" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              {/* Telemetry Data */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <Zap size={14} /> 2. SCADA Telemetry (Micromotion)
                  </h4>
                  <button 
                    onClick={simulateFlowMeterSync}
                    disabled={isSyncingFlowMeter}
                    className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-md flex items-center gap-1 hover:bg-indigo-500/30 transition-colors"
                  >
                    <Wifi size={12} className={isSyncingFlowMeter ? 'animate-pulse' : ''} />
                    Sync PLC
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Initial Pressure (Bar)</label>
                    <input type="text" placeholder="e.g. 20" value={formData.pressureInitial} onChange={e => setFormData({...formData, pressureInitial: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Pressure (Bar) - Max 250</label>
                    <input type="text" placeholder="e.g. 240" value={formData.pressureFull} onChange={e => setFormData({...formData, pressureFull: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-emerald-400 rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Volume Delivery (Nm³)</label>
                    <input type="text" placeholder="0.0" value={formData.volNm3} onChange={e => setFormData({...formData, volNm3: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Volume Delivery (Kg)</label>
                    <input type="text" placeholder="0.0" value={formData.volKg} onChange={e => setFormData({...formData, volKg: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              {/* Machine Performance */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Icon name="Cog6ToothIcon" size={14} /> 3. IMW-50 Hour Running (Form 102)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hour Start</label>
                    <input type="text" placeholder="63873.1" value={formData.hourStart} onChange={e => setFormData({...formData, hourStart: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hour Finish</label>
                    <input type="text" placeholder="63873.7" value={formData.hourFinish} onChange={e => setFormData({...formData, hourFinish: e.target.value})} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700 flex items-center justify-between">
              <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => {
                  onSave(formData);
                  onClose();
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                <Save size={16} /> Save Master Record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
