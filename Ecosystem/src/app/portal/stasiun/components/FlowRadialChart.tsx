'use client';
import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, Tooltip } from 'recharts';

interface Props {
  current: number;
  max: number;
  setpoint: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-card px-2 py-1.5">
      <span className="text-xs font-700 text-primary tabular-nums">{payload[0].value} kg/h</span>
    </div>
  );
}

export default function FlowRadialChart({ current, max, setpoint }: Props) {
  const data = [
    { id: 'radial-flow', name: 'Flow', value: current, fill: 'var(--primary)' },
  ];

  return (
    <div className="relative w-full" style={{ height: '110px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="75%"
          innerRadius="60%"
          outerRadius="90%"
          startAngle={180}
          endAngle={0}
          data={data}
          barSize={12}
        >
          <PolarAngleAxis type="number" domain={[0, max]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'var(--muted)' }}
            dataKey="value"
            angleAxisId={0}
            cornerRadius={6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
        <span className="tabular-nums text-xs font-700 text-foreground">{current} kg/h</span>
        <span className="text-xs text-muted-foreground font-medium">of {max}</span>
      </div>
    </div>
  );
}