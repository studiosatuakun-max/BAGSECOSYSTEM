'use client';
import React, { useState } from 'react';
import { PlusCircle, Megaphone, ArrowRight, Zap } from 'lucide-react';

export default function CreateCampaignCard() {
  const [loading, setLoading] = useState(false);
  const [launched, setLaunched] = useState(false);

  const handleClick = () => {
    setLoading(true);
    // Backend integration point: POST /api/campaigns/new
    setTimeout(() => {
      setLoading(false);
      setLaunched(true);
      setTimeout(() => setLaunched(false), 3000);
    }, 1200);
  };

  return (
    <div
      className="rounded-2xl p-5 border animate-fade-in relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #FFFBEB 0%, #FFF7ED 60%, #FEF3C7 100%)',
        borderColor: '#FDE68A',
        boxShadow: '0 1px 3px rgba(245,158,11,0.12)',
        animationDelay: '160ms',
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }}
      />
      <div
        className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent)' }}
      />

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative z-10"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        }}
      >
        <Megaphone size={18} style={{ color: '#FFFFFF' }} />
      </div>

      {/* Title */}
      <p
        className="text-sm font-700 mb-1 relative z-10"
        style={{ color: 'var(--foreground)', fontWeight: 700 }}
      >
        Create New Campaign
      </p>
      <p
        className="text-xs mb-5 relative z-10"
        style={{ color: 'var(--muted-foreground)', lineHeight: 1.5 }}
      >
        Launch a targeted campaign across email, social, or paid ads channels.
      </p>

      {/* Quick stats */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="flex items-center gap-1 text-xs" style={{ color: '#92400E' }}>
          <Zap size={11} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600 }}>7 active</span>
        </div>
        <span style={{ color: 'var(--border)' }}>·</span>
        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Avg ROI <span style={{ fontWeight: 700, color: 'var(--accent)' }}>214%</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        className="btn-primary w-full justify-center relative z-10"
        onClick={handleClick}
        disabled={loading}
        aria-label="Create New Campaign"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25" />
              <path d="M21 12a9 9 0 00-9-9" />
            </svg>
            Launching...
          </>
        ) : launched ? (
          <>
            <Zap size={14} />
            Campaign Created!
          </>
        ) : (
          <>
            <PlusCircle size={14} />
            Create Campaign
            <ArrowRight size={13} />
          </>
        )}
      </button>
    </div>
  );
}