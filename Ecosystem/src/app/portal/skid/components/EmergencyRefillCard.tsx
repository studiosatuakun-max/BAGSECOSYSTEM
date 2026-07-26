'use client';

import React, { useState } from 'react';
import { AlertTriangle, Zap, CheckCircle2, Phone, Truck, X } from 'lucide-react';
import { toast } from 'sonner';

export default function EmergencyRefillCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    urgency: 'high',
    reason: 'consumption_spike',
    contact: 'Budi Ariyanto (Plant Manager)',
    phone: '+62 812 3456 7890',
    notes: 'Kiln line #2 running at 140% capacity due to emergency export order.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setModalOpen(false);
      toast.success('Emergency Refill Skid Tank Dispatched!', {
        description: `Armada Skid B 9200 VGL dikirim dari Mother Station. ETA tiba: 2.5 jam.`,
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900/5 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-slate-900 border border-amber-500/30 dark:border-amber-500/20 rounded-3xl shadow-xl p-6 transition-all duration-300 h-full flex flex-col justify-between group hover:border-amber-500/60">
        <div>
          <div className="flex items-start gap-3 mb-4 border-b border-amber-500/20 pb-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 dark:bg-amber-950/60 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 font-bold">
              <AlertTriangle size={18} className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Emergency Action
              </p>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                Refill Request Dispatch
              </h3>
            </div>
          </div>

          <div className="space-y-3.5">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Ajukan pengantaran armada Skid Tank darurat dari Mother Station jika konsumsi pabrik meningkat drastis atau tekanan manifold turun mendekati threshold 180 Bar.
            </p>

            <div className="bg-white/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-bold">Est. Habis (Current Rate)</span>
                <span className="font-black text-amber-600 dark:text-amber-400 tabular-nums">~3.5 Hari</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500" style={{ width: '38%' }} />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                Berdasarkan laju konsumsi rata-rata 1,450 Sm³/hari
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl px-3.5 py-2.5">
              <Phone size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="text-[11px] font-extrabold text-blue-900 dark:text-blue-200">24/7 Mother Station Dispatch</p>
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400">+62 21 8888 0001 (Ext. CNG)</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-extrabold transition-all shadow-md active:scale-95"
        >
          {submitted ? (
            <>
              <CheckCircle2 size={16} />
              <span>Refill Dispatched!</span>
            </>
          ) : (
            <>
              <Truck size={16} />
              <span>Request Emergency Refill Skid</span>
            </>
          )}
        </button>
      </div>

      {/* Inline Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Zap size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Emergency Refill Skid Request
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Prioritas pengantaran armada darurat ke manifold PRMS klien.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3 flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                  Pengiriman darurat akan memprioritaskan armada Skid yang sedang berada di rute terdekat. SLA Tanggap Darurat: 2 Jam.
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Tingkat Urgensi
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="high">High Priority — Tiba dalam 2.5 - 4 Jam</option>
                  <option value="critical">Critical SOS — Tiba di bawah 2 Jam (Emergency Milk-Run)</option>
                  <option value="standard">Standard Refill — Jadwal rutin berikutnya (Besok Pagi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Alasan Request Refill Ekstra
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="consumption_spike">Lonjakan konsumsi pabrik mendadak (Export order)</option>
                  <option value="pressure_low">Tekanan manifold turun mendekati batas minimum 180 Bar</option>
                  <option value="production_increase">Penambahan line kiln / boiler baru</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Catatan Tambahan untuk Operator &amp; Driver
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-extrabold shadow-md transition-all active:scale-95 disabled:opacity-70"
                >
                  {submitting ? 'Dispatching...' : 'Confirm Dispatch Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}