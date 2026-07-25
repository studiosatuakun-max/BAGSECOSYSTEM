'use client';
import React, { useState } from 'react';
import { Users, PhoneCall, FileText, CheckCircle, ChevronRight } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


// Backend integration point: GET /api/funnel/acquisition-stages
const funnelStages = [
  {
    id: 'stage-leads',
    stage: 'Leads',
    count: 1240,
    percentage: 100,
    dropOff: null,
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: Users,
    description: 'Total leads captured across all channels',
  },
  {
    id: 'stage-contacted',
    stage: 'Contacted',
    count: 832,
    percentage: 67.1,
    dropOff: 32.9,
    color: '#F97316',
    bgColor: '#FFF7ED',
    borderColor: '#FED7AA',
    icon: PhoneCall,
    description: 'Leads reached via call, email, or WhatsApp',
  },
  {
    id: 'stage-proposal',
    stage: 'Proposal',
    count: 287,
    percentage: 23.1,
    dropOff: 65.5,
    color: '#EA580C',
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A',
    icon: FileText,
    description: 'Formal proposals sent to qualified prospects',
  },
  {
    id: 'stage-closed',
    stage: 'Closed Won',
    count: 94,
    percentage: 7.6,
    dropOff: 67.2,
    color: '#C2410C',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    icon: CheckCircle,
    description: 'Deals closed and contracts signed',
  },
];

const MAX_WIDTH = 100;
const MIN_WIDTH = 38;

function getBarWidth(pct: number) {
  return MIN_WIDTH + (pct / 100) * (MAX_WIDTH - MIN_WIDTH);
}

export default function AcquisitionFunnelClient() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  return (
    <div
      className="rounded-2xl border p-6 h-full"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div className="mb-5">
        <h2
          className="text-base"
          style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '1rem' }}
        >
          Acquisition Funnel
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
          Lead-to-close progression · Jul 2026
        </p>
      </div>

      {/* Overall conversion badge */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-xl mb-5 text-xs"
        style={{ backgroundColor: 'var(--muted)' }}
      >
        <span style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>
          Overall Conversion
        </span>
        <span
          className="tabular-nums"
          style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.875rem' }}
        >
          7.6%
        </span>
      </div>

      {/* Funnel Stages */}
      <div className="flex flex-col gap-2.5">
        {funnelStages.map((stage, index) => {
          const Icon = stage.icon;
          const barWidth = getBarWidth(stage.percentage);
          const isHovered = hoveredStage === stage.id;

          return (
            <div key={stage.id} className="relative">
              {/* Connector arrow */}
              {index > 0 && (
                <div
                  className="flex items-center justify-center mb-1"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <div className="flex flex-col items-center gap-0">
                    <ChevronRight
                      size={13}
                      style={{
                        transform: 'rotate(90deg)',
                        color: 'var(--muted-foreground)',
                        opacity: 0.5,
                      }}
                    />
                    {stage.dropOff !== null && (
                      <span
                        className="text-xs tabular-nums"
                        style={{ color: '#DC2626', fontWeight: 600, fontSize: '0.65rem' }}
                      >
                        −{stage.dropOff}%
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Stage Bar */}
              <button
                className="w-full text-left transition-all duration-200 rounded-xl border"
                style={{
                  backgroundColor: isHovered ? stage.color + '18' : stage.bgColor,
                  borderColor: isHovered ? stage.color + '80' : stage.borderColor,
                  transform: isHovered ? 'scale(1.015)' : 'scale(1)',
                  boxShadow: isHovered ? `0 4px 12px ${stage.color}22` : 'none',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
                aria-label={`${stage.stage}: ${stage.count} (${stage.percentage}%)`}
              >
                {/* Visual funnel bar width */}
                <div
                  className="overflow-hidden rounded-t-xl"
                  style={{ width: '100%' }}
                >
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, ${stage.color}, ${stage.color}AA)`,
                      marginBottom: 0,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: stage.color + '22' }}
                    >
                      <Icon size={14} style={{ color: stage.color }} />
                    </div>
                    <div>
                      <p
                        className="text-sm"
                        style={{ fontWeight: 600, color: 'var(--foreground)' }}
                      >
                        {stage.stage}
                      </p>
                      {isHovered && (
                        <p
                          className="text-xs animate-fade-in"
                          style={{ color: 'var(--muted-foreground)', fontSize: '0.68rem' }}
                        >
                          {stage.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="tabular-nums text-sm"
                      style={{ fontWeight: 700, color: stage.color }}
                    >
                      {stage.count.toLocaleString('id-ID')}
                    </p>
                    <p
                      className="tabular-nums text-xs"
                      style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}
                    >
                      {stage.percentage}%
                    </p>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer insight */}
      <div
        className="mt-4 p-3 rounded-xl text-xs"
        style={{ backgroundColor: '#FEF9C3', color: '#854D0E' }}
      >
        <strong>Bottleneck:</strong> Contacted → Proposal drop-off is 65.5% — highest friction point. Consider qualifying scripts.
      </div>
    </div>
  );
}