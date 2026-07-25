'use client';

import React, { useState } from 'react';
import { AlertTriangle, Zap, Loader2, CheckCircle2, Phone } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface RefillFormValues {
  urgencyLevel: string;
  reason: string;
  contactPerson: string;
  phone: string;
  notes: string;
}

export default function EmergencyRefillCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RefillFormValues>({
    defaultValues: {
      urgencyLevel: 'high',
      reason: 'consumption_spike',
      contactPerson: 'Budi Ariyanto',
      phone: '+62 812 3456 7890',
      notes: '',
    },
  });

  const onSubmit = (data: RefillFormValues) => {
    setSubmitting(true);
    // Backend integration: POST /api/refill-requests → creates RefillRequest entity
    console.log('Refill request payload:', data);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setModalOpen(false);
      reset();
      toast.success('Emergency refill request submitted', {
        description: 'Request REQ-2026-0720 dispatched to operations team. ETA: 4–6 hours.',
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 2000);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-warning-bg to-orange-50 border border-warning/25 rounded-2xl shadow-card p-5 card-hover fade-in h-full flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-warning" />
          </div>
          <div>
            <p className="text-xs font-semibold text-warning-foreground uppercase tracking-wider">Emergency Action</p>
            <h3 className="text-base font-bold text-foreground mt-0.5">Refill Request</h3>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Request an early refill if your consumption has spiked unexpectedly or pressure is approaching the minimum threshold.
          </p>

          <div className="bg-card/70 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Est. Days Until Empty</span>
              <span className="font-bold text-warning-foreground font-tabular">~14 days</span>
            </div>
            <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-warning to-danger" style={{ width: '32%' }} />
            </div>
            <p className="text-[11px] text-muted-foreground/70">Based on avg. 280 m³/day consumption rate</p>
          </div>

          <div className="flex items-center gap-2 bg-info-bg rounded-xl px-3 py-2.5">
            <Phone size={13} className="text-info flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-info-foreground">24/7 Emergency Hotline</p>
              <p className="text-[11px] text-info-foreground/80">+62 21 8888 0001</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-warning text-white text-sm font-bold hover:bg-warning/90 active:scale-[0.98] transition-all duration-150 shadow-sm btn-primary-active"
        >
          {submitted ? (
            <>
              <CheckCircle2 size={16} />
              Request Submitted
            </>
          ) : (
            <>
              <Zap size={16} />
              Request Emergency Refill
            </>
          )}
        </button>
      </div>

      {/* Refill Request Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Emergency Refill Request" maxWidth="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-warning-bg border border-warning/20 rounded-xl px-4 py-3 flex items-start gap-2">
            <AlertTriangle size={15} className="text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-warning-foreground font-medium">
              This will immediately notify the operations dispatch team. Standard SLA: 4–6 hours. Emergency SLA: 2 hours.
            </p>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Urgency Level <span className="text-danger">*</span>
            </label>
            <select
              {...register('urgencyLevel', { required: 'Urgency level is required' })}
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
            >
              <option value="standard">Standard — within 6 hours</option>
              <option value="high">High — within 4 hours</option>
              <option value="critical">Critical — within 2 hours (emergency fee applies)</option>
            </select>
            {errors.urgencyLevel && (
              <p className="text-xs text-danger mt-1">{errors.urgencyLevel.message}</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Reason for Early Refill <span className="text-danger">*</span>
            </label>
            <select
              {...register('reason', { required: 'Please select a reason' })}
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
            >
              <option value="consumption_spike">Unexpected consumption spike</option>
              <option value="pressure_low">Pressure approaching minimum threshold</option>
              <option value="production_increase">Planned production increase</option>
              <option value="other">Other — specify in notes</option>
            </select>
            {errors.reason && (
              <p className="text-xs text-danger mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Contact Person */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Contact Person <span className="text-danger">*</span>
              </label>
              <input
                {...register('contactPerson', { required: 'Contact person required' })}
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                placeholder="Full name"
              />
              {errors.contactPerson && (
                <p className="text-xs text-danger mt-1">{errors.contactPerson.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Phone <span className="text-danger">*</span>
              </label>
              <input
                {...register('phone', {
                  required: 'Phone number required',
                  pattern: { value: /^\+?[\d\s\-]{10,}$/, message: 'Enter a valid phone number' },
                })}
                type="tel"
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150"
                placeholder="+62 8xx xxxx xxxx"
              />
              {errors.phone && (
                <p className="text-xs text-danger mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Additional Notes</label>
            <p className="text-xs text-muted-foreground mb-1.5">Provide any additional context to help the dispatch team prepare.</p>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150 resize-none"
              placeholder="e.g. Production line 3 running at 140% capacity due to emergency order..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-all duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-warning text-white text-sm font-bold hover:bg-warning/90 transition-all duration-150 disabled:opacity-70 btn-primary-active"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Zap size={14} />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}