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
    <div className="bg-slate-900/95 border border-slate-700/80 backdrop-blur-md rounded-lg shadow-2xl px-2.5 py-1.5">
      <span className="text-xs font-bold text-emerald-400 tabular-nums">{payload[0].value} kg/h</span>
    </div>
  );
}

export default function FlowRadialChart({ current, max, setpoint }: Props) {
  const data = [
    { id: 'radial-flow', name: 'Flow', value: current, fill: '#10b981' },
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
          barSize={14}
        >
          <PolarAngleAxis type="number" domain={[0, max]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: '#334155' }}
            dataKey="value"
            angleAxisId={0}
            cornerRadius={6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
        <span className="tabular-nums text-xs font-black text-slate-900 dark:text-white">{current} kg/h</span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">of {max} max</span>
      </div>
    </div>
  );
}