'use client';

import React, { useState, useTransition } from 'react';
import Icon from '@/components/ui/AppIcon';
import { Search, Plus, FileText, Scale, ShieldAlert, CheckCircle2, AlertTriangle, FileSignature } from 'lucide-react';
import { updateContractStatus, updatePermitStatus } from '../_integration/actions';

type RawContract = {
  id: string;
  contract_number: string;
  customer_id: string | null;
  customer_name: string;
  contract_type: string;
  tube_ownership: string | null;
  has_liability_clause: boolean | null;
  liability_notes: string | null;
  start_date: string;
  end_date: string;
  status: string;
  counsel_name: string | null;
};

type RawPermit = {
  id: string;
  permit_name: string;
  permit_number: string;
  issuing_authority: string;
  issue_date: string | null;
  expiry_date: string;
  status: string;
};

interface Props {
  contracts: RawContract[];
  permits: RawPermit[];
}

const STATUS_CLASSES: Record<string, string> = {
  Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Under_Review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Expiring_Soon: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Expired: 'bg-rose-600/20 text-rose-300 border-rose-500/30',
  Terminated: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  Draft: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

function statusLabel(s: string) {
  return s.replace(/_/g, ' ');
}

export default function LegalComplianceTableCard({ contracts: initialContracts, permits: initialPermits }: Props) {
  const [activeTab, setActiveTab] = useState<'Contracts' | 'Permits'>('Contracts');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [localContracts, setLocalContracts] = useState(initialContracts);
  const [localPermits, setLocalPermits] = useState(initialPermits);

  const filteredContracts = localContracts.filter(ctr =>
    ctr.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ctr.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPermits = localPermits.filter(pmt =>
    pmt.permit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pmt.permit_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (id: string, newStatus: string, type: 'contract' | 'permit') => {
    startTransition(async () => {
      if (type === 'contract') {
        await updateContractStatus(id, newStatus);
        setLocalContracts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      } else {
        await updatePermitStatus(id, newStatus);
        setLocalPermits(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      }
    });
  };

  return (
    <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl flex flex-col h-full relative overflow-hidden group">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Scale size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Legal & Compliance Hub</h2>
            <p className="text-sm text-slate-400 mt-0.5">MIGAS Permits and B2B Liability Contracts (FOB/CNF)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search contracts or permits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-slate-900 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] whitespace-nowrap shrink-0">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Document</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-700/50 pb-2 relative z-10">
        <button 
          onClick={() => setActiveTab('Contracts')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'Contracts' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Customer Contracts (B2B)
        </button>
        <button 
          onClick={() => setActiveTab('Permits')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'Permits' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Government Permits (MIGAS)
        </button>
      </div>

      {/* Tables */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/60 bg-slate-900/40 relative z-10">
        {activeTab === 'Contracts' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
                <th className="p-4 font-medium whitespace-nowrap">Contract No</th>
                <th className="p-4 font-medium whitespace-nowrap">Client</th>
                <th className="p-4 font-medium whitespace-nowrap">Delivery Terms</th>
                <th className="p-4 font-medium whitespace-nowrap">Liability & Asset</th>
                <th className="p-4 font-medium whitespace-nowrap">Validity Period</th>
                <th className="p-4 font-medium text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredContracts.map((ctr) => (
                <tr key={ctr.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <FileSignature size={14} className="text-indigo-400" /> {ctr.contract_number}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-indigo-300">{ctr.customer_name}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono border border-slate-700">
                      {ctr.contract_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-xs font-medium text-slate-300 mb-1">{ctr.tube_ownership.replace(/_/g, ' ')}</div>
                    {ctr.has_liability_clause && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 max-w-[200px] truncate" title={ctr.liability_notes}>
                        <ShieldAlert size={10} className="shrink-0" /> FOB Liability Clause Active
                      </div>
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-slate-400">
                    {ctr.start_date} <br/><span className="text-[10px]">to</span> {ctr.end_date}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_CLASSES[ctr.status] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                      {ctr.status === 'Active' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {statusLabel(ctr.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
                <th className="p-4 font-medium whitespace-nowrap">Permit Name</th>
                <th className="p-4 font-medium whitespace-nowrap">Number & Authority</th>
                <th className="p-4 font-medium whitespace-nowrap">Issued</th>
                <th className="p-4 font-medium whitespace-nowrap">Expiry</th>
                <th className="p-4 font-medium text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredPermits.map((pmt) => (
                <tr key={pmt.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-white text-sm">{pmt.permit_name}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-indigo-300">{pmt.permit_number}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{pmt.issuing_authority}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-slate-300">{pmt.issue_date}</td>
                  <td className="p-4 whitespace-nowrap text-sm text-slate-300">{pmt.expiry_date}</td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_CLASSES[pmt.status] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'}${pmt.status === 'Expiring_Soon' ? ' animate-pulse' : ''}`}>
                      {pmt.status === 'Active' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {statusLabel(pmt.status)}
                    </span>
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
