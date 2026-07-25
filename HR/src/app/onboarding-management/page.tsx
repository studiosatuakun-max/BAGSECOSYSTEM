'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import OnboardingSummaryCards from './components/OnboardingSummaryCards';
import OnboardingTable from './components/OnboardingTable';
import Modal from '@/components/ui/Modal';
import NewOnboardingForm from './components/NewOnboardingForm';
import { UserPlus } from 'lucide-react';

export default function OnboardingManagementPage() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <AppLayout pageTitle="Onboarding Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-600 text-foreground">New Hire Onboarding</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Track task completion and progress for all new hires at Baskara Asri Ghas</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-600 rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-150"
        >
          <UserPlus size={16} />
          Start Onboarding
        </button>
      </div>

      <OnboardingSummaryCards />
      <OnboardingTable />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Start New Hire Onboarding"
        size="lg"
      >
        <NewOnboardingForm onClose={() => setFormOpen(false)} />
      </Modal>
    </AppLayout>
  );
}