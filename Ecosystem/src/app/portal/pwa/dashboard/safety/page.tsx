'use client';

import { useState } from 'react';

interface CheckItem { id: string; title: string; description: string; isChecked: boolean; }

const initialItems: CheckItem[] = [
  { id: 'tires', title: 'Tires', description: 'Check tread depth, pressure (min 32 PSI), and visual damage', isChecked: true },
  { id: 'brakes', title: 'Brakes', description: 'Test brake responsiveness, check fluid level, no grinding sounds', isChecked: true },
  { id: 'extinguisher', title: 'Fire Extinguisher', description: 'Verify ABC-class extinguisher present, sealed, and within service date', isChecked: true },
  { id: 'grounding', title: 'Grounding Cable', description: 'Confirm anti-static grounding cable attached and continuity tested', isChecked: false },
];

export default function SafetyCheckPage() {
  const [items, setItems] = useState<CheckItem[]>(initialItems);
  const [isConfirming, setIsConfirming] = useState(false);
  const completedCount = items.filter(i => i.isChecked).length;
  const allComplete = completedCount === items.length;
  const progress = Math.round((completedCount / items.length) * 100);

  const toggleItem = (index: number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, isChecked: !item.isChecked } : item));
  };

  const handleConfirm = async () => {
    if (!allComplete) return;
    setIsConfirming(true);
    await new Promise(r => setTimeout(r, 800));
    window.location.href = '/portal/pwa/dashboard';
  };

  return (
    <div className="relative flex flex-col h-full bg-[#FAFAFA] overflow-hidden">
      
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pb-4 bg-white border-b border-gray-200 relative z-10 flex-shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}
      >
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Pre-Trip Safety</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Marcus O. · Today 07:58</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-[var(--sky-50)] border border-[var(--sky-100)]">
          <span className="text-xs font-bold text-[var(--sky-600)] tabular-nums">{completedCount}/{items.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-36 relative z-10 pt-4">
        <div className="space-y-4">

          {/* Progress Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-900">Inspection Progress</span>
                <span className="text-2xl font-bold text-[var(--sky-500)] tracking-[-0.03em] tabular-nums">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-[var(--sky-500)] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-3 font-medium">
                {allComplete ? 'All items checked — ready to confirm.' : `${items.length - completedCount} item${items.length - completedCount === 1 ? '' : 's'} remaining`}
              </p>
            </div>
          </div>

          <div className="text-sm font-bold text-gray-900 pt-2 px-1">Inspection List</div>

          {items.map((item, index) => (
            <button key={item.id} onClick={() => toggleItem(index)}
              className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all border ${
                item.isChecked
                  ? 'bg-[var(--sky-50)] border-[var(--sky-200)] shadow-sm'
                  : 'bg-white border-gray-200 shadow-sm hover:border-gray-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                item.isChecked
                  ? 'bg-[var(--sky-500)] border-[var(--sky-500)]'
                  : 'border-gray-300 bg-white'
              }`}>
                {item.isChecked && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900">
                  {item.title}
                </div>
                <div className="text-xs text-gray-500 mt-1 leading-relaxed pr-2">{item.description}</div>
              </div>
            </button>
          ))}

          {/* Confirm Button */}
          <div className="pt-4">
            <button onClick={handleConfirm} disabled={!allComplete || isConfirming}
              className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                allComplete
                  ? 'bg-[var(--sky-500)] text-white shadow-md hover:brightness-105 active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isConfirming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  Complete Inspection
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
