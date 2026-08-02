'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { X, Activity, FileText, PhoneCall, Calendar } from 'lucide-react';
import { getLeadActivities } from '../_integration/actions';

interface ActivityRecord {
  id: string;
  activity_type: string;
  notes: string;
  created_at: string;
  auth_user?: { email: string };
}

interface LeadTimelineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
  companyName: string;
}

export default function LeadTimelineDrawer({ isOpen, onClose, leadId, companyName }: LeadTimelineDrawerProps) {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [isPending, startTransition] = useTransition();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen && leadId) {
      startTransition(async () => {
        const { data } = await getLeadActivities(leadId);
        setActivities((data as ActivityRecord[]) || []);
      });
    } else {
      setActivities([]);
    }
  }, [isOpen, leadId]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">{companyName}</h2>
            <p className="text-sm text-pink-400 font-medium">Activity Timeline</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isPending ? (
            <div className="flex justify-center items-center h-32">
              <Activity className="animate-spin text-pink-500" size={24} />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">
              <p>No activity history recorded yet.</p>
            </div>
          ) : (
            <div className="relative border-l border-slate-700 ml-3 space-y-8">
              {activities.map((act) => {
                let IconObj = Activity;
                let colorClass = 'bg-slate-800 text-slate-400 border-slate-600';
                
                if (act.activity_type === 'Stage_Change') {
                  IconObj = Activity;
                  colorClass = 'bg-pink-900/50 text-pink-400 border-pink-500/50';
                } else if (act.activity_type === 'Note') {
                  IconObj = FileText;
                  colorClass = 'bg-purple-900/50 text-purple-400 border-purple-500/50';
                } else if (act.activity_type === 'Meeting') {
                  IconObj = Calendar;
                  colorClass = 'bg-emerald-900/50 text-emerald-400 border-emerald-500/50';
                } else if (act.activity_type === 'Call') {
                  IconObj = PhoneCall;
                  colorClass = 'bg-sky-900/50 text-sky-400 border-sky-500/50';
                }

                return (
                  <div key={act.id} className="relative pl-6">
                    <span className={`absolute -left-[17px] p-1.5 rounded-full border ${colorClass} flex items-center justify-center`}>
                      <IconObj size={14} />
                    </span>
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{act.activity_type.replace('_', ' ')}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(act.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed mb-3">
                        {act.notes}
                      </p>
                      {act.auth_user?.email && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                          By {act.auth_user.email}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
