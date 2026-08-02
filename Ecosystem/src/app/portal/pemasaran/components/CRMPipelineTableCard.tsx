'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/AppIcon';
import { Search, Plus, Users, CheckCircle2, Phone, Briefcase, MapPin, TrendingUp, HelpCircle, X, Printer, FileText } from 'lucide-react';
import { updateLeadStage, createSalesLead } from '../_integration/actions';
import LeadTimelineDrawer from './LeadTimelineDrawer';
import type { SalesLead } from '../_integration/types';

type RawLead = SalesLead;

interface Props {
  industriLeads: RawLead[];
  horecaLeads: RawLead[];
}

const STAGE_LABELS: Record<string, string> = {
  Perkenalan_Awal: 'Perkenalan Awal',
  Presentasi: 'Presentasi',
  Penawaran: 'Penawaran',
  Follow_Up: 'Follow Up',
  Negosiasi: 'Negosiasi',
  Penyampaian_Kontrak: 'Penyampaian Kontrak',
  Dealing_Closed_Won: 'Closed Won',
  Dealing_Closed_Lost: 'Closed Lost',
};

function stageBadgeClass(stage: string) {
  if (stage === 'Dealing_Closed_Won') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (stage === 'Dealing_Closed_Lost') return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
}

export default function CRMPipelineTableCard({ industriLeads: initialIndustri, horecaLeads: initialHoreca }: Props) {
  const [activeTab, setActiveTab] = useState<'Industri' | 'Horeca'>('Industri');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [localIndustri, setLocalIndustri] = useState(initialIndustri);
  const [localHoreca, setLocalHoreca] = useState(initialHoreca);

  const filteredIndustri = localIndustri.filter(lead =>
    lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHoreca = localHoreca.filter(lead =>
    lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    phone_number: '',
    segment: 'Industri' as 'Industri' | 'Horeca',
    estimated_volume_mmbtu: 0,
    cluster_location: ''
  });
  
  const [stageGateModal, setStageGateModal] = useState<{
    isOpen: boolean;
    leadId: string;
    company_name: string;
    targetStage: string;
    segment: 'Industri' | 'Horeca';
  } | null>(null);

  const [stageFormData, setStageFormData] = useState({
    notes: '',
    next_follow_up_date: '',
    current_vendor: '',
    competitor_contract_end_date: '',
    estimated_volume_mmbtu: 0,
    lost_reason: ''
  });

  const [drawerState, setDrawerState] = useState<{ isOpen: boolean; leadId: string | null; companyName: string }>({
    isOpen: false,
    leadId: null,
    companyName: ''
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const openStageGate = (id: string, company_name: string, newStage: string, segment: 'Industri' | 'Horeca', currentVolume: number) => {
    setStageGateModal({ isOpen: true, leadId: id, company_name, targetStage: newStage, segment });
    setStageFormData({
      notes: '',
      next_follow_up_date: '',
      current_vendor: '',
      competitor_contract_end_date: '',
      estimated_volume_mmbtu: currentVolume || 0,
      lost_reason: ''
    });
  };

  const handleStageSubmit = () => {
    if (!stageGateModal) return;
    if (!stageFormData.notes.trim()) {
      alert('Catatan lapangan wajib diisi untuk mengubah stage!');
      return;
    }
    
    startTransition(async () => {
      // Optimistic update
      if (stageGateModal.segment === 'Industri') {
        setLocalIndustri(prev => prev.map(l => l.id === stageGateModal.leadId ? { ...l, pipeline_stage: stageGateModal.targetStage } : l));
      } else {
        setLocalHoreca(prev => prev.map(l => l.id === stageGateModal.leadId ? { ...l, pipeline_stage: stageGateModal.targetStage } : l));
      }
      
      const payload: any = {
        pipeline_stage: stageGateModal.targetStage,
        company_name: stageGateModal.company_name,
        notes: stageFormData.notes
      };
      
      if (stageFormData.next_follow_up_date) payload.next_follow_up_date = stageFormData.next_follow_up_date;
      if (stageFormData.current_vendor) payload.current_vendor = stageFormData.current_vendor;
      if (stageFormData.competitor_contract_end_date) payload.competitor_contract_end_date = stageFormData.competitor_contract_end_date;
      if (stageFormData.estimated_volume_mmbtu > 0) payload.estimated_volume_mmbtu = stageFormData.estimated_volume_mmbtu;
      if (stageFormData.lost_reason) payload.lost_reason = stageFormData.lost_reason;
      
      await updateLeadStage(stageGateModal.leadId, payload);
      setStageGateModal(null);
    });
  };

  const handleCreateLead = () => {
    if (!formData.company_name.trim()) return;
    startTransition(async () => {
      const { data, error } = await createSalesLead(formData);
      if (error) {
        alert(`Gagal menyimpan data: ${error}\n\nPastikan Anda memiliki role marketing_ae.`);
        setIsModalOpen(false);
        return;
      }
      if (data) {
        if (formData.segment === 'Industri') {
          setLocalIndustri(prev => [data as RawLead, ...prev]);
        } else {
          setLocalHoreca(prev => [data as RawLead, ...prev]);
        }
      }
      setIsModalOpen(false);
      setFormData({
        company_name: '',
        contact_person: '',
        phone_number: '',
        segment: 'Industri',
        estimated_volume_mmbtu: 0,
        cluster_location: ''
      });
    });
  };

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
          <button onClick={() => window.open('/portal/pemasaran/print-leads', '_blank')} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-sm font-bold transition-all shrink-0">
            <Printer size={18} />
            <span className="hidden sm:inline">Export Dossier (PDF)</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] whitespace-nowrap shrink-0">
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
      <div className="overflow-x-auto overflow-y-auto max-h-[280px] rounded-xl border border-slate-800/60 bg-slate-900/40 relative z-10">
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
                    <button 
                      onClick={() => setDrawerState({ isOpen: true, leadId: lead.id!, companyName: lead.company_name })}
                      className="font-semibold text-white text-sm flex items-center gap-2 hover:text-purple-400 transition-colors cursor-pointer text-left"
                    >
                      <Briefcase size={14} className="text-purple-400 shrink-0" /> {lead.company_name}
                    </button>
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
                    <select
                      value={lead.pipeline_stage}
                      onChange={(e) => openStageGate(lead.id!, lead.company_name, e.target.value, 'Industri', lead.estimated_volume_mmbtu || 0)}
                      disabled={isPending}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none appearance-none ${stageBadgeClass(lead.pipeline_stage)}`}
                    >
                      {Object.entries(STAGE_LABELS).map(([val, label]) => (
                        <option key={val} value={val} className="text-slate-900">{label}</option>
                      ))}
                    </select>
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
                    <button 
                      onClick={() => setDrawerState({ isOpen: true, leadId: lead.id!, companyName: lead.company_name })}
                      className="font-semibold text-white text-sm hover:text-purple-400 transition-colors cursor-pointer text-left"
                    >
                      {lead.company_name}
                    </button>
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
                    <select
                      value={lead.pipeline_stage}
                      onChange={(e) => openStageGate(lead.id!, lead.company_name, e.target.value, 'Horeca', lead.estimated_volume_mmbtu || 0)}
                      disabled={isPending}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none appearance-none ${stageBadgeClass(lead.pipeline_stage)}`}
                    >
                      {Object.entries(STAGE_LABELS).map(([val, label]) => (
                        <option key={val} value={val} className="text-slate-900">{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Lead Modal */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Add New Lead</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData((p) => ({ ...p, company_name: e.target.value }))}
                  placeholder="e.g. PT Indofood CBP"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Segment</label>
                <select
                  value={formData.segment}
                  onChange={(e) => setFormData((p) => ({ ...p, segment: e.target.value as 'Industri' | 'Horeca' }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Industri">Industri</option>
                  <option value="Horeca">Horeca</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Person</label>
                <input
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) => setFormData((p) => ({ ...p, contact_person: e.target.value }))}
                  placeholder="PIC Name"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone_number}
                  onChange={(e) => setFormData((p) => ({ ...p, phone_number: e.target.value }))}
                  placeholder="+62 8..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-500"
                />
              </div>

              {formData.segment === 'Industri' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estimated Volume (MMBTU)</label>
                  <input
                    type="number"
                    value={formData.estimated_volume_mmbtu}
                    onChange={(e) => setFormData((p) => ({ ...p, estimated_volume_mmbtu: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {formData.segment === 'Horeca' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cluster / Area</label>
                  <input
                    type="text"
                    value={formData.cluster_location}
                    onChange={(e) => setFormData((p) => ({ ...p, cluster_location: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button
                onClick={handleCreateLead}
                disabled={!formData.company_name.trim() || isPending}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-purple-500 hover:bg-purple-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPending && <Icon name="ArrowPathIcon" size={14} className="animate-spin" />}
                Add Lead
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Stage-Gate Modal */}
      {stageGateModal?.isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Update Stage: {STAGE_LABELS[stageGateModal.targetStage]}</h3>
              <button onClick={() => setStageGateModal(null)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Catatan Lapangan <span className="text-rose-400">*</span></label>
                <textarea
                  required
                  rows={3}
                  value={stageFormData.notes}
                  onChange={(e) => setStageFormData(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Catatan update progress..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-500 resize-none"
                />
              </div>

              {stageGateModal.targetStage !== 'Dealing_Closed_Won' && stageGateModal.targetStage !== 'Dealing_Closed_Lost' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Next Follow-Up Date</label>
                  <input
                    type="date"
                    value={stageFormData.next_follow_up_date}
                    onChange={(e) => setStageFormData(p => ({ ...p, next_follow_up_date: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {(stageGateModal.targetStage === 'Presentasi' || stageGateModal.targetStage === 'Penawaran') && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Vendor (Kompetitor)</label>
                    <input
                      type="text"
                      value={stageFormData.current_vendor}
                      onChange={(e) => setStageFormData(p => ({ ...p, current_vendor: e.target.value }))}
                      placeholder="e.g. PGN, CNE, EBS..."
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-500"
                    />
                  </div>
                  {stageFormData.current_vendor && (
                    <div>
                      <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">Target Contract Switch Date</label>
                      <input
                        type="date"
                        value={stageFormData.competitor_contract_end_date}
                        onChange={(e) => setStageFormData(p => ({ ...p, competitor_contract_end_date: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  )}
                </>
              )}

              {stageGateModal.targetStage === 'Dealing_Closed_Won' && (
                <div>
                  <label className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">Final Volume (MMBTU) <span className="text-rose-400">*</span></label>
                  <input
                    type="number"
                    value={stageFormData.estimated_volume_mmbtu}
                    onChange={(e) => setStageFormData(p => ({ ...p, estimated_volume_mmbtu: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {stageGateModal.targetStage === 'Dealing_Closed_Lost' && (
                <div>
                  <label className="block text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1.5">Lost Reason <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={stageFormData.lost_reason}
                    onChange={(e) => setStageFormData(p => ({ ...p, lost_reason: e.target.value }))}
                    placeholder="e.g. Kalah harga, Batal project..."
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder:text-slate-500"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6">
              <div>
                {(stageGateModal.targetStage === 'Penawaran' || stageGateModal.targetStage === 'Penyampaian_Kontrak') && (
                  <button
                    onClick={() => window.open(`/portal/pemasaran/quotation/${stageGateModal.leadId}`, '_blank')}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-2"
                  >
                    <FileText size={14} />
                    Generate Quotation
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStageGateModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                  Cancel
                </button>
              <button
                onClick={handleStageSubmit}
                disabled={!stageFormData.notes.trim() || isPending || (stageGateModal.targetStage === 'Dealing_Closed_Lost' && !stageFormData.lost_reason.trim())}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-purple-500 hover:bg-purple-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPending && <Icon name="ArrowPathIcon" size={14} className="animate-spin" />}
                Confirm Stage
              </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <LeadTimelineDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState({ ...drawerState, isOpen: false })}
        leadId={drawerState.leadId}
        companyName={drawerState.companyName}
      />
    </div>
  );
}
