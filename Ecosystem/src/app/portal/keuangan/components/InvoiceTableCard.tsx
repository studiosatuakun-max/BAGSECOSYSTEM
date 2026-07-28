'use client';

import React, { useState } from 'react';
import { MOCK_INVOICES_INDUSTRI, MOCK_INVOICES_HORECA } from '../data/mockKeuanganData';
import { InvoiceIndustri, InvoiceHoreca } from '../_integration/types';
import Icon from '@/components/ui/AppIcon';
import { FileText, Search, Plus, CheckCircle2, AlertTriangle, Download, ArrowRightLeft, DollarSign } from 'lucide-react';

export default function InvoiceTableCard() {
  const [activeTab, setActiveTab] = useState<'Industri' | 'Horeca'>('Industri');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIndustri = MOCK_INVOICES_INDUSTRI.filter(inv => 
    inv.invoice_no.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredHoreca = MOCK_INVOICES_HORECA.filter(inv => 
    inv.invoice_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl flex flex-col h-full relative overflow-hidden group">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Billing & Invoicing Engine</h2>
            <p className="text-sm text-slate-400 mt-0.5">Dual-schema billing for Industrial (USD/MMBTU) and Retail (IDR/Tabung)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] whitespace-nowrap shrink-0">
            <Plus size={18} />
            <span className="hidden sm:inline">Issue Invoice</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-700/50 pb-2 relative z-10">
        <button 
          onClick={() => setActiveTab('Industri')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'Industri' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Industri B2B (FOB/CNF)
        </button>
        <button 
          onClick={() => setActiveTab('Horeca')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'Horeca' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          HORECA 12kg (Retail)
        </button>
      </div>

      {/* Tables */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/60 bg-slate-900/40 relative z-10">
        {activeTab === 'Industri' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
                <th className="p-4 font-medium">Invoice No</th>
                <th className="p-4 font-medium">Period</th>
                <th className="p-4 font-medium">Volume (MMBTU)</th>
                <th className="p-4 font-medium">Amount (USD)</th>
                <th className="p-4 font-medium">Payment Term</th>
                <th className="p-4 font-medium text-right">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredIndustri.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-white text-sm">{inv.invoice_no}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Due: {inv.due_date}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                    {inv.billing_period_start} <br/><span className="text-xs text-slate-500">to</span> {inv.billing_period_end}
                  </td>
                  <td className="p-4 text-sm font-medium text-amber-300">
                    {inv.total_volume_mmbtu.toLocaleString()} <span className="text-xs text-slate-500">MMBTU</span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-white">${inv.total_amount_usd.toLocaleString()}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <ArrowRightLeft size={10} /> IDR {(inv.total_amount_idr || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/10 text-slate-300 border border-slate-500/20 whitespace-nowrap shrink-0 align-middle">
                      {inv.payment_term}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 align-middle border ${
                      inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      inv.status === 'Issued' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {inv.status === 'Paid' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {inv.status}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                     <button className="p-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-lg hover:bg-slate-700">
                       <Download size={16} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
                <th className="p-4 font-medium">Invoice No</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Qty (Tabung)</th>
                <th className="p-4 font-medium">Amount (IDR)</th>
                <th className="p-4 font-medium">Payment Term</th>
                <th className="p-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredHoreca.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-white text-sm">{inv.invoice_no}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Due: {inv.due_date}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                    {inv.invoice_date}
                  </td>
                  <td className="p-4 text-sm font-medium text-amber-300">
                    {inv.total_tabung} <span className="text-xs text-slate-500">cylinders</span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-white flex items-center gap-1">
                      <span className="text-xs text-slate-500">Rp</span> {inv.total_amount_idr.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Inc. PPN</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/10 text-slate-300 border border-slate-500/20 whitespace-nowrap shrink-0 align-middle">
                      {inv.payment_term}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 align-middle border ${
                      inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {inv.status === 'Paid' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {inv.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}