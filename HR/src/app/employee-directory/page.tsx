import React from 'react';
import AppLayout from '@/components/AppLayout';
import EmployeeTable from './components/EmployeeTable';
import { UserPlus } from 'lucide-react';

export default function EmployeeDirectoryPage() {
  return (
    <AppLayout pageTitle="Employee Directory">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-600 text-foreground">All Employees</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and search the full Baskara Asri Ghas workforce</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-600 rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-150">
          <UserPlus size={16} />
          Add Employee
        </button>
      </div>
      <EmployeeTable />
    </AppLayout>
  );
}