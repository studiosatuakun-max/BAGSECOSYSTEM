import React from 'react';
import AppLayout from '@/components/AppLayout';
import LeaveSummaryCards from './components/LeaveSummaryCards';
import LeaveTable from './components/LeaveTable';
import { Plus } from 'lucide-react';

export default function LeaveManagementPage() {
  return (
    <AppLayout pageTitle="Leave Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-600 text-foreground">Leave Requests</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Review, approve, and track all employee leave requests</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-600 rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-150">
          <Plus size={16} />
          New Request
        </button>
      </div>
      <LeaveSummaryCards />
      <LeaveTable />
    </AppLayout>
  );
}