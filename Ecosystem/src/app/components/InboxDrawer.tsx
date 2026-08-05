'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';
import { DispatchItem } from '@/types/dispatch';

const DIVISIONS = [
  'All Divisions',
  'Fleet & Transport (Armada)',
  'Finance & Accounting (Keuangan)',
  'HR & Workforce (SDM)',
  'Stasiun CNG (Mother Station)',
  'Pemasaran (Marketing)',
  'Legal & Compliance',
  'Skid Tank Operations',
  'Horeca Gas Logistics',
  'Direksi / Management',
];

interface InboxDrawerProps {
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
  currentDivision?: string;
}

export default function InboxDrawer({ onClose, onUnreadChange, currentDivision = 'Finance & Accounting (Keuangan)' }: InboxDrawerProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [dispatches, setDispatches] = useState<DispatchItem[]>([]);
  const [selectedDispatch, setSelectedDispatch] = useState<DispatchItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Compose Form State
  const [targetDivision, setTargetDivision] = useState<string>('All Divisions');
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [attachedFile, setAttachedFile] = useState<{ file_name: string; file_url: string; file_size: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Dispatches
  const loadDispatches = async () => {
    setIsLoading(true);
    try {
      const cleanDiv = currentDivision.split(' (')[0];
      const res = await fetch(`/api/inbox/dispatches?view=${activeTab === 'compose' ? 'inbox' : activeTab}&division=${encodeURIComponent(cleanDiv)}`);
      if (res.ok) {
        const data = await res.json();
        setDispatches(data);
        const unread = data.filter((d: DispatchItem) => d.status === 'Unread').length;
        if (onUnreadChange) onUnreadChange(unread);
      }
    } catch (err) {
      console.error('Failed to load dispatches', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'compose') {
      loadDispatches();
      setSelectedDispatch(null);
    }
  }, [activeTab, currentDivision]);

  // Handle Send Memo
  const handleSendDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return toast.error('Mohon isi subjek dan isi memo.');
    
    setIsSubmitting(true);
    try {
      const cleanSender = currentDivision.split(' (')[0];
      const cleanReceiver = targetDivision.split(' (')[0];
      const res = await fetch('/api/inbox/dispatches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_division: cleanSender,
          receiver_division: cleanReceiver,
          subject,
          content,
          priority,
          attachments: attachedFile ? [attachedFile] : [],
        }),
      });

      if (res.ok) {
        toast.success('Memo berhasil dikirim!', {
          description: `Terkirim ke: ${targetDivision}`,
        });
        setSubject('');
        setContent('');
        setAttachedFile(null);
        setActiveTab('sent');
      }
    } catch (err) {
      toast.error('Gagal mengirim memo. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      toast.warning('Ukuran file melebihi batas maksimal 25 MB.');
      return;
    }

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/inbox/files', { method: 'POST', body: form });
      if (res.ok) {
        const data = await res.json();
        setAttachedFile(data);
      }
    } catch (err) {
      toast.error('Gagal mengunggah lampiran.');
    }
  };

  // Handle Status Update
  const handleUpdateStatus = async (id: string, newStatus: 'Unread' | 'Read' | 'In Review' | 'Resolved') => {
    try {
      await fetch('/api/inbox/dispatches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setDispatches(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
      if (selectedDispatch && selectedDispatch.id === id) {
        setSelectedDispatch({ ...selectedDispatch, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const getPriorityBadge = (p: 'Normal' | 'High' | 'Urgent') => {
    switch (p) {
      case 'Urgent': return 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse';
      case 'High': return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      default: return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'Resolved': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      case 'In Review': return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
      case 'Read': return 'bg-slate-500/20 text-slate-300 border border-slate-500/40';
      default: return 'bg-indigo-500/30 text-indigo-200 border border-indigo-400 font-bold';
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Drawer / Modal Container */}
      <div className="w-full max-w-5xl h-[85vh] bg-slate-900/85 dark:bg-slate-950/85 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Ambient Aurora Glows */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Left Sidebar / Navigation */}
        <div className="w-full md:w-64 bg-white/5 border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col justify-between relative z-10 shrink-0">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Icon name="EnvelopeIcon" size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-tight leading-none">Dispatch Memo</h3>
                  <span className="text-[10px] text-indigo-300 font-medium">Inter-Division Memos</span>
                </div>
              </div>
              <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg">
                <Icon name="XMarkIcon" size={22} />
              </button>
            </div>

            {/* Fixed Division Display */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">View As Division:</label>
              <div className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-300 cursor-not-allowed">
                {currentDivision}
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'inbox' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon name="InboxIcon" size={16} />
                  Inbox (Masuk)
                </span>
                {dispatches.filter(d => d.status === 'Unread').length > 0 && activeTab === 'inbox' && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold animate-pulse">
                    {dispatches.filter(d => d.status === 'Unread').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('sent')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === 'sent' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              >
                <Icon name="PaperAirplaneIcon" size={16} />
                Sent (Terkirim)
              </button>

              <button
                onClick={() => setActiveTab('compose')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all mt-4 ${activeTab === 'compose' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/10 text-emerald-300 hover:bg-emerald-600/30 hover:text-white border border-emerald-500/30'}`}
              >
                <Icon name="PencilSquareIcon" size={16} />
                New Dispatch (Tulis Memo)
              </button>
            </nav>
          </div>

          <div className="hidden md:flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
            <span>Enterprise ERP v2.5</span>
            <button onClick={onClose} className="text-white font-bold hover:text-indigo-400 flex items-center gap-1 transition-colors">
              Close <Icon name="XMarkIcon" size={16} />
            </button>
          </div>
        </div>

        {/* Right Main Content Pane */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          
          {/* TAB: COMPOSE NEW MEMO */}
          {activeTab === 'compose' ? (
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <h2 className="text-xl font-extrabold text-white tracking-tight mb-1 flex items-center gap-2">
                <Icon name="PencilSquareIcon" className="text-emerald-400" />
                Tulis Memo & Dispatch Antar Divisi
              </h2>
              <p className="text-xs text-slate-300 mb-6">Kirim memo resmi, instruksi kerja, atau lampiran dokumen (≤ 25MB) tercatat.</p>

              <form onSubmit={handleSendDispatch} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Dari Divisi:</label>
                    <input
                      type="text"
                      disabled
                      value={currentDivision.split(' (')[0]}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Kepada Divisi:</label>
                    <select
                      value={targetDivision}
                      onChange={(e) => setTargetDivision(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {DIVISIONS.map(d => <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Tingkat Prioritas:</label>
                  <div className="flex gap-3">
                    {(['Normal', 'High', 'Urgent'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${priority === p ? getPriorityBadge(p) + ' shadow-md' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Subjek / Judul Memo:</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contoh: Request Approval Maintenance Skid Tank / Konfirmasi Jadwal..."
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Isi Pesan / Detail Instruksi:</label>
                  <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tuliskan instruksi kerja, rincian biaya, atau nomor referensi dokumen di sini..."
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3.5 text-xs font-medium text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  />
                </div>

                {/* File Attachment Uploader ≤ 25MB */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Lampiran Dokumen (Max 25 MB):</label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 border border-dashed border-white/30 rounded-xl px-4 py-3 flex items-center gap-2 text-xs font-bold text-slate-200 transition-all">
                      <Icon name="PaperClipIcon" size={16} className="text-indigo-400" />
                      <span>{attachedFile ? 'Ganti File Lampiran' : 'Pilih File (PDF, Excel, IMG)'}</span>
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>

                    {attachedFile && (
                      <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-bold text-emerald-300">
                        <Icon name="CheckCircleIcon" size={16} />
                        <span className="truncate max-w-[180px]">{attachedFile.file_name}</span>
                        <span className="text-[10px] opacity-75">({attachedFile.file_size})</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('inbox')}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Dispatch'}
                    <Icon name="PaperAirplaneIcon" size={16} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* TAB: INBOX OR SENT LIST + DETAIL VIEW */
            <div className="flex-1 flex overflow-hidden">
              
              {/* Memo List Pane */}
              <div className={`w-full ${selectedDispatch ? 'hidden md:flex md:w-5/12 border-r border-white/10' : 'flex-1'} flex-col overflow-y-auto p-4 space-y-3`}>
                <div className="flex items-center justify-between px-2 mb-1">
                  <h3 className="font-extrabold text-white text-sm tracking-wide">
                    {activeTab === 'inbox' ? '📥 Memo Masuk' : '📤 Memo Terkirim'}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">{dispatches.length} items</span>
                </div>

                {isLoading ? (
                  <div className="p-8 text-center text-xs text-slate-400 animate-pulse">Memuat data dispatch...</div>
                ) : dispatches.length === 0 ? (
                  <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 my-4">
                    <Icon name="InboxIcon" size={32} className="text-slate-500 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold text-slate-300">Belum ada memo di folder ini.</p>
                  </div>
                ) : (
                  dispatches.map((dsp) => (
                    <div
                      key={dsp.id}
                      onClick={() => {
                        setSelectedDispatch(dsp);
                        if (dsp.status === 'Unread') handleUpdateStatus(dsp.id, 'Read');
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 relative group ${selectedDispatch?.id === dsp.id ? 'bg-indigo-600/30 border-indigo-400/80 shadow-lg' : dsp.status === 'Unread' ? 'bg-white/15 border-white/30 shadow-md hover:bg-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10 opacity-80 hover:opacity-100'}`}
                    >
                      {dsp.status === 'Unread' && (
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse shadow-sm shadow-red-500" />
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getPriorityBadge(dsp.priority)}`}>
                          {dsp.priority}
                        </span>
                        <span className="text-[11px] font-bold text-indigo-300 truncate">
                          {activeTab === 'inbox' ? `Dari: ${dsp.sender_division}` : `Ke: ${dsp.receiver_division}`}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-white text-xs md:text-sm tracking-tight line-clamp-1 mb-1 group-hover:text-indigo-200 transition-colors">
                        {dsp.subject}
                      </h4>
                      <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed mb-3">
                        {dsp.content}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 pt-2 border-t border-white/10">
                        <span>{new Date(dsp.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <span className={`px-2 py-0.5 rounded-md ${getStatusBadge(dsp.status)}`}>
                          {dsp.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Memo Detail Pane */}
              {selectedDispatch ? (
                <div className="flex-1 flex flex-col bg-slate-950/40 p-6 overflow-y-auto relative animate-in slide-in-from-right duration-200">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <button
                      onClick={() => setSelectedDispatch(null)}
                      className="md:hidden text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1"
                    >
                      <Icon name="ArrowLeftIcon" size={16} /> Kembali ke Daftar
                    </button>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-xs font-bold text-slate-400">Update Status:</span>
                      <select
                        value={selectedDispatch.status}
                        onChange={(e) => handleUpdateStatus(selectedDispatch.id, e.target.value as any)}
                        className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none shadow-sm ${getStatusBadge(selectedDispatch.status)} bg-slate-900`}
                      >
                        <option value="Unread" className="bg-slate-900 text-white">Unread</option>
                        <option value="Read" className="bg-slate-900 text-white">Read</option>
                        <option value="In Review" className="bg-slate-900 text-white">In Review</option>
                        <option value="Resolved" className="bg-slate-900 text-white">Resolved (Selesai)</option>
                      </select>
                    </div>
                  </div>

                  {/* Memo Header */}
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${getPriorityBadge(selectedDispatch.priority)}`}>
                        🔥 Priority: {selectedDispatch.priority}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto font-medium">
                        {new Date(selectedDispatch.created_at).toLocaleString()}
                      </span>
                    </div>

                    <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight leading-snug">
                      {selectedDispatch.subject}
                    </h2>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
                      <div className="flex">
                        <span className="w-24 font-bold text-slate-400">Dari Divisi:</span>
                        <span className="font-extrabold text-indigo-300">{selectedDispatch.sender_division}</span>
                      </div>
                      <div className="flex">
                        <span className="w-24 font-bold text-slate-400">Kepada:</span>
                        <span className="font-extrabold text-white">{selectedDispatch.receiver_division}</span>
                      </div>
                    </div>
                  </div>

                  {/* Memo Body */}
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-xs md:text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-wrap">
                    {selectedDispatch.content}
                  </div>

                  {/* Attachments Section */}
                  {selectedDispatch.attachments && selectedDispatch.attachments.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-white/10">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Icon name="PaperClipIcon" className="text-indigo-400" />
                        Lampiran Dokumen ({selectedDispatch.attachments.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedDispatch.attachments.map((att, idx) => (
                          <a
                            key={idx}
                            href={att.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-3 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0 text-indigo-300 group-hover:scale-105 transition-transform">
                              <Icon name="DocumentTextIcon" size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-white truncate group-hover:text-indigo-200 transition-colors">{att.file_name}</p>
                              <span className="text-[10px] font-semibold text-slate-400">{att.file_size} • Klik untuk unduh</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-3">
                    <button
                      onClick={() => handleUpdateStatus(selectedDispatch.id, 'Resolved')}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 transition-all flex items-center gap-2"
                    >
                      <Icon name="CheckCircleIcon" size={16} /> Mark as Resolved
                    </button>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-slate-950/20 text-slate-500">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Icon name="EnvelopeOpenIcon" size={32} className="opacity-40" />
                  </div>
                  <h4 className="font-extrabold text-slate-400 text-sm mb-1">Pilih Memo Dispatch</h4>
                  <p className="text-xs max-w-xs text-slate-500">Klik salah satu memo dari daftar di sebelah kiri untuk membaca detail instruksi dan mengunduh lampiran.</p>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}
