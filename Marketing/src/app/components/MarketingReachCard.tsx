import React from 'react';
import { Radio, TrendingUp } from 'lucide-react';

export default function MarketingReachCard() {
  return (
    <div
      className="rounded-2xl p-5 card-hover border animate-fade-in"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p
            className="text-xs font-600 uppercase tracking-widest mb-1"
            style={{ color: 'var(--muted-foreground)', fontWeight: 600, letterSpacing: '0.07em' }}
          >
            Marketing Reach
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--muted-foreground)', fontSize: '0.7rem' }}
          >
            Mock Data · Jul 2026
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--secondary)' }}
        >
          <Radio size={18} style={{ color: 'var(--primary)' }} />
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
          284.6K
        </span>
        <span
          className="text-sm ml-1"
          style={{ color: 'var(--muted-foreground)' }}
        >
          impressions
        </span>
      </div>
      {/* Trend */}
      <div className="flex items-center gap-1.5">
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-600"
          style={{
            backgroundColor: '#DCFCE7',
            color: '#166534',
            fontWeight: 600,
          }}
        >
          <TrendingUp size={11} />
          +18.4%
        </div>
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          vs last month
        </span>
      </div>
      {/* Channel breakdown */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Email', value: '112K' },
            { label: 'Social', value: '98K' },
            { label: 'Ads', value: '74K' },
          ]?.map((ch) => (
            <div key={`reach-channel-${ch?.label}`}>
              <p
                className="tabular-nums text-sm"
                style={{ fontWeight: 700, color: 'var(--foreground)' }}
              >
                {ch?.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {ch?.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}