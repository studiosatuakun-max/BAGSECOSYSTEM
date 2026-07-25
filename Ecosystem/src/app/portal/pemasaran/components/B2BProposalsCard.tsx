import React from 'react';
import { FileText, AlertTriangle, TrendingDown } from 'lucide-react';

export default function B2BProposalsCard() {
  return (
    <div
      className="rounded-2xl p-5 card-hover border animate-fade-in"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: '#FED7AA',
        boxShadow: '0 1px 3px rgba(234,88,12,0.08)',
        animationDelay: '80ms',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p
            className="text-xs font-600 uppercase tracking-widest mb-1"
            style={{ color: 'var(--muted-foreground)', fontWeight: 600, letterSpacing: '0.07em' }}
          >
            New B2B Proposals
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--muted-foreground)', fontSize: '0.7rem' }}
          >
            Generated · Jul 2026
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#FFF7ED' }}
        >
          <FileText size={18} style={{ color: 'var(--accent)' }} />
        </div>
      </div>
      {/* Value */}
      <div className="mb-3">
        <span
          className="tabular-nums"
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--foreground)',
            lineHeight: 1.1,
          }}
        >
          23
        </span>
        <span
          className="text-sm ml-1"
          style={{ color: 'var(--muted-foreground)' }}
        >
          proposals
        </span>
      </div>
      {/* Trend — warning state */}
      <div className="flex items-center gap-1.5">
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-600"
          style={{
            backgroundColor: '#FEF3C7',
            color: '#92400E',
            fontWeight: 600,
          }}
        >
          <TrendingDown size={11} />
          −6.1%
        </div>
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          vs last month
        </span>
      </div>
      {/* Stage breakdown */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Sent', value: '23', color: 'var(--foreground)' },
            { label: 'Reviewed', value: '14', color: 'var(--foreground)' },
            { label: 'Stalled', value: '4', color: '#DC2626' },
          ]?.map((s) => (
            <div key={`proposal-stage-${s?.label}`}>
              <p
                className="tabular-nums text-sm"
                style={{ fontWeight: 700, color: s?.color }}
              >
                {s?.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {s?.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Alert */}
      <div
        className="mt-3 flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs"
        style={{ backgroundColor: '#FEF9C3', color: '#854D0E' }}
      >
        <AlertTriangle size={12} />
        4 proposals stalled &gt;14 days — follow up needed
      </div>
    </div>
  );
}