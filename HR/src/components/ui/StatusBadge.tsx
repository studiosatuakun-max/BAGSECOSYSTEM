import React from 'react';

type StatusType =
  | 'Active' |'On Leave' |'Onboarding' |'Inactive' |'Pending' |'Approved' |'Rejected' |'Cancelled' |'In Progress' |'Completed' |'Overdue' |'Not Started';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const statusMap: Record<StatusType, string> = {
  Active: 'status-active',
  'On Leave': 'status-leave',
  Onboarding: 'status-onboarding',
  Inactive: 'status-inactive',
  Pending: 'status-pending',
  Approved: 'status-approved',
  Rejected: 'status-rejected',
  Cancelled: 'status-inactive',
  'In Progress': 'status-onboarding',
  Completed: 'status-approved',
  Overdue: 'status-rejected',
  'Not Started': 'status-inactive',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cls = statusMap[status] ?? 'status-inactive';
  return (
    <span
      className={`inline-flex items-center font-600 rounded-full whitespace-nowrap ${cls} ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      {status}
    </span>
  );
}