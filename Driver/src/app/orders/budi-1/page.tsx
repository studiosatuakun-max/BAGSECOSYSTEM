'use client';

import { useState } from 'react';

export default function CustomerOrderDetailPage() {
  const [usePoints, setUsePoints] = useState(false);

  const itemPrice = 185000;
  const qty = 2;
  const itemTotal = itemPrice * qty;
  const shipping = 15000;
  const loyaltyDiscount = 10000;
  const pointsDiscount = usePoints ? 10000 : 0;
  const grandTotal = itemTotal + shipping - loyaltyDiscount - pointsDiscount;

  return (
    <div className="relative flex flex-col h-full bg-[var(--bg-canvas)] overflow-hidden">
      {/* Soft ambient */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[360px] h-[360px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 -left-32 w-[320px] h-[320px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 pb-4 relative z-10"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 44px)' }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="section-title">Order Detail</span>
            <span className="px-2 py-0.5 rounded-md chip-gold text-[9px] font-bold uppercase tracking-[0.12em]">Pesanan</span>
          </div>
          <h1 className="text-[20px] font-bold text-[var(--text-primary)] tracking-[-0.02em] truncate">Budi Santoso</h1>
          <p className="text-[12.5px] text-[var(--text-secondary)] mt-1 font-medium truncate">Rincian Pesanan LPG</p>
        </div>
        <button className="w-10 h-10 rounded-[12px] card flex items-center justify-center hover:bg-[var(--bg-subtle)] transition-colors flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)]">
            <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-[110px] relative z-10">
        <div className="space-y-4">

          {/* Customer Hero */}
          <div className="card-elevated p-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none opacity-60" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[12px] gradient-brand flex items-center justify-center text-white font-bold text-[16px] flex-shrink-0">B</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-bold text-[var(--text-primary)] tracking-[-0.01em] truncate">Budi Santoso</div>
                  <div className="text-[12.5px] text-[var(--text-secondary)] font-medium truncate">Warung Makan Barokah, Bandung</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-[10px] chip-gold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.91 8.84 3 9.27l5.46 4.73L6.82 21 12 17.27 17.18 21l-1.64-7 5.46-4.73-6.91-.43z"/></svg>
                <span className="text-[12px] font-bold">Hadiah Loyalitas</span>
                <span className="text-[13px] font-bold tabular-nums ml-auto">Rp 45.000</span>
              </div>
            </div>
          </div>

          {/* Delivery & Verification */}
          <Section title="Pengiriman & Verifikasi" icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>
          }>
            <Row label="Pesanan Bulan Juli" value="8 silinder" />
            <Row label="Pengiriman Berikutnya" value="Hari ini, 14:00–16:00" highlight />
            <Row label="Terakhir Diverifikasi" value="2 hari yang lalu" />
          </Section>

          {/* Cylinder Safety */}
          <Section title="Status Keamanan Silinder" icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          }>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md chip-brand text-[11px] font-bold">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Sertifikasi Ditemukan
              </span>
              <span className="text-[11.5px] text-[var(--text-tertiary)] font-medium">Terakhir dipindai 2 hari lalu</span>
            </div>
            <Row label="Nomor Seri" value="HG-12K-2024-087341" mono />
            <Row label="Tanggal Isi" value="17 Jul 2026" />
            <Row label="Produsen" value="PT. Pertamina Gas" />
            <Row label="Tgl. Kedaluwarsa" value="17 Jan 2027" />
            <Row label="Detail" value="Batch BDG-JUL-2026-B3" subvalue="12 Kg · 8.2 bar" />
          </Section>

          {/* Order Detail */}
          <Section title="Rincian Pesanan" icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          }>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[14px] font-bold text-[var(--text-primary)] tracking-[-0.01em]">Gas LPG 12 Kg</div>
                <div className="text-[11.5px] text-[var(--text-tertiary)] font-medium">Pesan Ulang</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-[var(--text-tertiary)]">Maks / Pesanan</div>
                <div className="text-[13px] font-bold text-[var(--text-primary)] tabular-nums">10 silinder</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border)]">
              <span className="text-[12.5px] text-[var(--text-secondary)] font-medium">Kuantitas Saat Ini</span>
              <span className="text-[20px] font-bold gradient-text-brand tabular-nums">{qty}</span>
            </div>
          </Section>

          {/* Cost Breakdown */}
          <Section title="Estimasi Biaya" icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          }>
            <Row label={`Total Item (${qty} × Rp${itemPrice.toLocaleString('id-ID')})`} value={`Rp${itemTotal.toLocaleString('id-ID')}`} />
            <Row label="Biaya Pengiriman" value={`Rp${shipping.toLocaleString('id-ID')}`} />
            <Row label="Diskon Loyalitas" value={`-Rp${loyaltyDiscount.toLocaleString('id-ID')}`} positive />
            {usePoints && <Row label="Poin Loyalty" value={`-Rp${pointsDiscount.toLocaleString('id-ID')}`} positive />}
            <div className="pt-3 mt-1 border-t border-[var(--border)]">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-semibold text-[var(--text-secondary)]">Total Keseluruhan</span>
                <span className="text-[24px] font-bold gradient-text-brand tracking-[-0.03em] tabular-nums">Rp{grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </Section>

          {/* Loyalty Points Toggle */}
          <div className="card-elevated p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] gradient-gold flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2L9.91 8.84 3 9.27l5.46 4.73L6.82 21 12 17.27 17.18 21l-1.64-7 5.46-4.73-6.91-.43z"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-[var(--text-primary)] tracking-[-0.01em]">Poin Loyalitas</div>
                <div className="text-[11.5px] text-[var(--text-secondary)] font-medium tabular-nums">450 poin · Hemat Rp10.000</div>
              </div>
              <button
                onClick={() => setUsePoints(!usePoints)}
                role="switch"
                aria-checked={usePoints}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                  usePoints ? 'gradient-brand' : 'bg-[var(--bg-muted)] border border-[var(--border)]'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  usePoints ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          {/* Address */}
          <Section title="Alamat Pengiriman" icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          }>
            <div className="text-[13px] text-[var(--text-primary)] font-medium leading-relaxed">Jl. Raya Cimahi No. 47, Bandung</div>
          </Section>

        </div>
      </div>

      {/* CTA */}
      <div className="absolute bottom-[96px] left-0 right-0 px-6 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <button
            className="relative w-full h-[58px] rounded-[14px] gradient-brand text-white text-[14.5px] font-bold flex items-center justify-center gap-2 shadow-[var(--shadow-accent)] hover:opacity-95 active:scale-[0.99] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            <span className="tracking-[-0.01em]">Tempatkan Pesanan</span>
            <span className="text-[13px] font-bold tabular-nums opacity-90">· Rp{grandTotal.toLocaleString('id-ID')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared sub-components ─── */
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card-elevated p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-secondary)]">
          {icon}
        </div>
        <span className="section-title">{title}</span>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Row({ label, value, subvalue, highlight, positive, mono }: {
  label: string; value: string; subvalue?: string; highlight?: boolean; positive?: boolean; mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[12.5px] text-[var(--text-secondary)] font-medium leading-snug">{label}</span>
      <div className="text-right">
        <div className={`text-[13px] font-bold tabular-nums tracking-tight ${positive ? 'text-[var(--accent-solid)]' : highlight ? 'gradient-text-brand' : 'text-[var(--text-primary)]'} ${mono ? 'font-mono' : ''}`}>
          {value}
        </div>
        {subvalue && <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{subvalue}</div>}
      </div>
    </div>
  );
}
