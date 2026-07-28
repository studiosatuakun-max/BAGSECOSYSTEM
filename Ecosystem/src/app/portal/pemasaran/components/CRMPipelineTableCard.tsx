'use client';

import React, { useState } from 'react';
import { MOCK_SALES_LEADS_INDUSTRI, MOCK_SALES_LEADS_HORECA } from '../data/mockPemasaranData';
import Icon from '@/components/ui/AppIcon';
import { Search, Plus, Users, CheckCircle2, Phone, Briefcase, MapPin, TrendingUp, HelpCircle } from 'lucide-react';

export default function CRMPipelineTableCard() {
  const [activeTab, setActiveTab] = useState<'Industri' | 'Horeca'>('Industri');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIndustri = MOCK_SALES_LEADS_INDUSTRI.filter(lead => 
    lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredHoreca = MOCK_SALES_LEADS_HORECA.filter(lead => 
    lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl flex flex-col h-full relative overflow-hidden group">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">CRM Pipeline Tracking</h2>
            <p className="text-sm text-slate-400 mt-0.5">B2B Industri (MMBTU) and HORECA (Tabung) Sales Tracking</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search company or PIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] whitespace-nowrap shrink-0">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Lead</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-700/50 pb-2 relative z-10">
        <button 
          onClick={() => setActiveTab('Industri')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'Industri' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Industri B2B Pipeline
        </button>
        <button 
          onClick={() => setActiveTab('Horeca')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'Horeca' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'}`}
        >
          HORECA Sales Strategy
        </button>
      </div>

      {/* Tables */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/60 bg-slate-900/40 relative z-10">
        {activeTab === 'Industri' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/50">
                <th className="p-4 font-medium whitespace-nowrap">Company Name</th>
                <th className="p-4 font-medium whitespace-nowrap">PIC & Contact</th>
                <th className="p-4 font-medium whitespace-nowrap">Est. Volume (MMBTU)</th>
                <th className="p-4 font-medium whitespace-nowrap">Sales Rep</th>
                <th className="p-4 font-medium whitespace-nowrap">Pipeline Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredIndustri.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <Briefcase size={14} className="text-purple-400" /> {lead.company_name}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Added: {lead.created_at}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-300">{lead.contact_person}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Phone size={10} className="shrink-0" /> {lead.phone_number}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-white bg-purple-500/10 px-2 py-1 rounded inline-block border border-purple-500/20">
                      {lead.estimated_volume_mmbtu?.toLocaleString()} MMBTU
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-slate-400">
                    {lead.sales_rep_id}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      lead.pipeline_stage === 'Dealing_Closed_Won' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      lead.pipeline_stage === 'Closed_Lost' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {lead.pipeline_stage === 'Dealing_Closed_Won' ? <CheckCircle2 size={12} /> : <TrendingUp size={12} />}
                      {lead.pipeline_stage.replace(/_/g, ' ')}
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
                <th className="p-4 font-medium whitespace-nowrap">Horeca Outlet</th>
                <th className="p-4 font-medium whitespace-nowrap">PIC & Contact</th>
                <th className="p-4 font-medium whitespace-nowrap">Cluster / Area</th>
                <th className="p-4 font-medium whitespace-nowrap">Competitor Strategy</th>
                <th className="p-4 font-medium whitespace-nowrap">Pipeline Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredHoreca.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-white text-sm">{lead.company_name}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Rep: {lead.sales_rep_id}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-300">{lead.contact_person}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Phone size={10} className="shrink-0" /> {lead.phone_number}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-slate-300">
                    <div className="flex items-center gap-1.5 text-purple-300">
                      <MapPin size={12} /> {lead.cluster_location}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-[11px] font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded inline-block border border-slate-700">
                      Vendor: {lead.current_vendor || '-'}
                    </div>
                    {lead.competitor_contract_end_date && (
                      <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                        <HelpCircle size={10} /> Target Switch: {lead.competitor_contract_end_date}
                      </div>
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      lead.pipeline_stage === 'Dealing_Closed_Won' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      lead.pipeline_stage === 'Perkenalan_Awal' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {lead.pipeline_stage.replace(/_/g, ' ')}
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
