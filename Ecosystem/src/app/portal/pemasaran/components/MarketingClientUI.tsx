'use client';

import React, { useState, useTransition } from 'react';
import Icon from '@/components/ui/AppIcon';
import {
  RefreshCw,
  CheckCircle2,
  Plus,
  X,
} from 'lucide-react';
import { updateCampaignStatus } from '../_integration/actions';

interface Campaign {
  id: string;
  campaign_name: string;
  campaign_type: string;
  status: string;
  budget_idr: number;
  leads_generated: number;
}

interface Props {
  initialCampaigns: Campaign[];
}

function formatBudget(v: number) {
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}M`;
  if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(0)}Jt`;
  return `Rp ${v.toLocaleString()}`;
}

export default function MarketingClientUI({ initialCampaigns }: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isSyncingCrm, setIsSyncingCrm] = useState(false);
  const [crmSyncSuccess, setCrmSyncSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    campaign_name: '',
    campaign_type: 'Digital',
    budget_idr: 20_000_000,
    leads_generated: 0,
    leads_converted: 0,
  });
  const [isPending, startTransition] = useTransition();

  const handleTriggerCrmSync = () => {
    setIsSyncingCrm(true);
    setCrmSyncSuccess(false);
    setTimeout(() => {
      setIsSyncingCrm(false);
      setCrmSyncSuccess(true);
      setTimeout(() => setCrmSyncSuccess(false), 4000);
    }, 1500);
  };

  const handleOpenModal = (mode: 'create' | 'edit', campaign?: Campaign) => {
    setModalMode(mode);
    if (mode === 'edit' && campaign) {
      setEditingId(campaign.id);
      setFormData({
        campaign_name: campaign.campaign_name,
        campaign_type: campaign.campaign_type,
        budget_idr: campaign.budget_idr,
        leads_generated: campaign.leads_generated,
        leads_converted: 0,
      });
    } else {
      setEditingId(null);
      setFormData({
        campaign_name: '',
        campaign_type: 'Digital',
        budget_idr: 20_000_000,
        leads_generated: 0,
        leads_converted: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.campaign_name.trim()) return;
    if (modalMode === 'create') {
      setCampaigns((prev) => [
        {
          id: `CMP-${Date.now()}`,
          campaign_name: formData.campaign_name,
          campaign_type: formData.campaign_type,
          status: 'Draft',
          budget_idr: formData.budget_idr,
          leads_generated: formData.leads_generated,
        },
        ...prev,
      ]);
    } else if (editingId) {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, campaign_name: formData.campaign_name, campaign_type: formData.campaign_type, budget_idr: formData.budget_idr, leads_generated: formData.leads_generated }
            : c
        )
      );
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      await updateCampaignStatus(id, newStatus);
      setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    });
  };

  const statusColors: Record<string, string> = {
    Draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Paused: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const campaignTypes = ['Digital', 'Event', 'Direct_Visit', 'Telemarketing', 'Other'];
  const statuses = ['Draft', 'Active', 'Paused', 'Completed', 'Cancelled'];

  return (
    <>
      {/* ── CRM Sync Button ── */}
      <button
        onClick={handleTriggerCrmSync}
        disabled={isSyncingCrm || crmSyncSuccess}
        className={`px-5 py-3 font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2.5 active:scale-95 shrink-0 whitespace-nowrap z-10 self-stretch sm:self-auto justify-center disabled:cursor-not-allowed ${
          crmSyncSuccess
            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-950/50'
            : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white shadow-pink-500/30'
        }`}
      >
        {isSyncingCrm ? (
          <>
            <Icon name="ArrowPathIcon" size={18} className="animate-spin text-white" />
            <span>Syncing AE CRM...</span>
          </>
        ) : crmSyncSuccess ? (
          <>
            <Icon name="CheckCircleIcon" size={18} className="text-white" />
            <span>Pipeline Verified</span>
          </>
        ) : (
          <>
            <Icon name="BoltIcon" size={18} />
            <span>Sync AE CRM Pipeline</span>
          </>
        )}
      </button>

      {/* ── Campaign CRUD Table (simplified) ── */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Icon name="MegaphoneIcon" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">Marketing Campaigns</h2>
          </div>
          <button
            onClick={() => handleOpenModal('create')}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-bold transition-all shadow-pink-500/20"
          >
            <Plus size={16} /> Add Campaign
          </button>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] uppercase text-slate-400 border-b border-slate-700/50">
                <th className="p-3 font-medium">Campaign Name</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium text-right">Budget</th>
                <th className="p-3 font-medium text-right">Leads</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 text-sm font-semibold text-white whitespace-nowrap">{c.campaign_name}</td>
                  <td className="p-3 text-xs text-slate-400">{c.campaign_type.replace(/_/g, ' ')}</td>
                  <td className="p-3 text-sm text-right font-bold text-pink-300 tabular-nums">{formatBudget(c.budget_idr)}</td>
                  <td className="p-3 text-sm text-right text-slate-300 tabular-nums">{c.leads_generated}</td>
                  <td className="p-3">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      disabled={isPending}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColors[c.status] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'} cursor-pointer focus:outline-none`}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleOpenModal('edit', c)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors mr-1">
                      <Icon name="PencilIcon" size={14} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <Icon name="TrashIcon" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">
                {modalMode === 'create' ? 'New Marketing Campaign' : 'Edit Campaign'}
              </h3>
              <button onClick={handleCloseModal} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Campaign Name</label>
                <input
                  type="text"
                  value={formData.campaign_name}
                  onChange={(e) => setFormData((p) => ({ ...p, campaign_name: e.target.value }))}
                  placeholder="e.g. B2B Smelter Q4 Retargeting"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Campaign Type</label>
                <select
                  value={formData.campaign_type}
                  onChange={(e) => setFormData((p) => ({ ...p, campaign_type: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {campaignTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Budget (IDR)</label>
                <input
                  type="number"
                  value={formData.budget_idr}
                  onChange={(e) => setFormData((p) => ({ ...p, budget_idr: Number(e.target.value) }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Leads Generated</label>
                <input
                  type="number"
                  value={formData.leads_generated}
                  onChange={(e) => setFormData((p) => ({ ...p, leads_generated: Number(e.target.value) }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={handleCloseModal} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.campaign_name.trim()}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-pink-500 hover:bg-pink-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {modalMode === 'create' ? 'Create Campaign' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
