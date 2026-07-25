'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { employees, DEPARTMENTS } from '@/lib/mockData';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface OnboardingFormData {
  employeeName: string;
  employeeId: string;
  department: string;
  role: string;
  startDate: string;
  buddy: string;
  notes: string;
}

interface NewOnboardingFormProps {
  onClose: () => void;
}

export default function NewOnboardingForm({ onClose }: NewOnboardingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OnboardingFormData>();

  // Backend integration point: replace with API call to POST /onboarding
  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    toast.success(`Onboarding started for ${data.employeeName}`);
    reset();
    onClose();
  };

  const buddyCandidates = employees.filter((e) => e.status === 'Active').slice(0, 8);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        {/* Employee Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="onb-name" className="text-xs font-600 text-foreground">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="onb-name"
            type="text"
            placeholder="e.g. Ahmad Fauzi"
            className={`px-3 py-2 rounded-xl border text-sm text-foreground bg-background outline-none transition-all duration-150 focus:ring-2 focus:ring-primary/30 ${errors.employeeName ? 'border-rose-400' : 'border-input'}`}
            {...register('employeeName', { required: 'Employee name is required' })}
          />
          {errors.employeeName && (
            <p className="text-[10px] text-rose-600 font-500">{errors.employeeName.message}</p>
          )}
        </div>

        {/* Employee ID */}
        <div className="flex flex-col gap-1">
          <label htmlFor="onb-id" className="text-xs font-600 text-foreground">
            Employee ID <span className="text-rose-500">*</span>
          </label>
          <input
            id="onb-id"
            type="text"
            placeholder="e.g. BAG-0250"
            className={`px-3 py-2 rounded-xl border text-sm text-foreground bg-background outline-none font-mono transition-all duration-150 focus:ring-2 focus:ring-primary/30 ${errors.employeeId ? 'border-rose-400' : 'border-input'}`}
            {...register('employeeId', {
              required: 'Employee ID is required',
              pattern: { value: /^BAG-\d{4}$/, message: 'Format: BAG-XXXX' },
            })}
          />
          {errors.employeeId && (
            <p className="text-[10px] text-rose-600 font-500">{errors.employeeId.message}</p>
          )}
        </div>

        {/* Department */}
        <div className="flex flex-col gap-1">
          <label htmlFor="onb-dept" className="text-xs font-600 text-foreground">
            Department <span className="text-rose-500">*</span>
          </label>
          <select
            id="onb-dept"
            className={`px-3 py-2 rounded-xl border text-sm text-foreground bg-background outline-none cursor-pointer transition-all duration-150 focus:ring-2 focus:ring-primary/30 ${errors.department ? 'border-rose-400' : 'border-input'}`}
            {...register('department', { required: 'Department is required' })}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={`form-dept-${d}`} value={d}>{d}</option>
            ))}
          </select>
          {errors.department && (
            <p className="text-[10px] text-rose-600 font-500">{errors.department.message}</p>
          )}
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1">
          <label htmlFor="onb-role" className="text-xs font-600 text-foreground">
            Job Role <span className="text-rose-500">*</span>
          </label>
          <input
            id="onb-role"
            type="text"
            placeholder="e.g. Operations Coordinator"
            className={`px-3 py-2 rounded-xl border text-sm text-foreground bg-background outline-none transition-all duration-150 focus:ring-2 focus:ring-primary/30 ${errors.role ? 'border-rose-400' : 'border-input'}`}
            {...register('role', { required: 'Job role is required' })}
          />
          {errors.role && (
            <p className="text-[10px] text-rose-600 font-500">{errors.role.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <label htmlFor="onb-start" className="text-xs font-600 text-foreground">
            Start Date <span className="text-rose-500">*</span>
          </label>
          <p className="text-[10px] text-muted-foreground -mt-0.5">Onboarding tasks will be scheduled from this date</p>
          <input
            id="onb-start"
            type="date"
            className={`px-3 py-2 rounded-xl border text-sm text-foreground bg-background outline-none cursor-pointer transition-all duration-150 focus:ring-2 focus:ring-primary/30 ${errors.startDate ? 'border-rose-400' : 'border-input'}`}
            {...register('startDate', { required: 'Start date is required' })}
          />
          {errors.startDate && (
            <p className="text-[10px] text-rose-600 font-500">{errors.startDate.message}</p>
          )}
        </div>

        {/* Buddy */}
        <div className="flex flex-col gap-1">
          <label htmlFor="onb-buddy" className="text-xs font-600 text-foreground">
            Assign Buddy <span className="text-rose-500">*</span>
          </label>
          <p className="text-[10px] text-muted-foreground -mt-0.5">An active employee who will guide the new hire</p>
          <select
            id="onb-buddy"
            className={`px-3 py-2 rounded-xl border text-sm text-foreground bg-background outline-none cursor-pointer transition-all duration-150 focus:ring-2 focus:ring-primary/30 ${errors.buddy ? 'border-rose-400' : 'border-input'}`}
            {...register('buddy', { required: 'Buddy assignment is required' })}
          >
            <option value="">Select buddy</option>
            {buddyCandidates.map((e) => (
              <option key={`buddy-${e.id}`} value={e.name}>{e.name} — {e.department}</option>
            ))}
          </select>
          {errors.buddy && (
            <p className="text-[10px] text-rose-600 font-500">{errors.buddy.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1">
        <label htmlFor="onb-notes" className="text-xs font-600 text-foreground">Additional Notes</label>
        <p className="text-[10px] text-muted-foreground">Any special requirements or context for the onboarding team</p>
        <textarea
          id="onb-notes"
          rows={3}
          placeholder="e.g. Remote hire — IT equipment to be shipped to home address"
          className="px-3 py-2 rounded-xl border border-input text-sm text-foreground bg-background outline-none resize-none transition-all duration-150 focus:ring-2 focus:ring-primary/30"
          {...register('notes')}
        />
      </div>

      <div className="flex gap-3 pt-2 border-t border-border">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-border text-sm font-600 text-muted-foreground hover:bg-muted transition-all duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-600 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 transition-all duration-150 flex items-center justify-center gap-2"
          style={{ minWidth: '120px' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Starting...
            </>
          ) : (
            'Start Onboarding'
          )}
        </button>
      </div>
    </form>
  );
}