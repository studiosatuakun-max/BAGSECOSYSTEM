'use client';

import React, { useState } from 'react';
import { onboardingEmployees, OnboardingEmployee, OnboardingTask } from '@/lib/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { ClipboardList, Eye, X, CheckSquare, Square, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const color = pct === 100 ? 'bg-emerald-500' : pct < 40 ? 'bg-rose-500' : 'bg-primary';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-600 tabular-nums text-muted-foreground whitespace-nowrap">{completed}/{total}</span>
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Documentation: 'bg-blue-50 text-blue-700',
  'IT Setup': 'bg-violet-50 text-violet-700',
  Training: 'bg-amber-50 text-amber-700',
  Orientation: 'bg-emerald-50 text-emerald-700',
};

function TaskPanel({ employee, onClose }: { employee: OnboardingEmployee; onClose: () => void }) {
  const [tasks, setTasks] = useState<OnboardingTask[]>(employee.tasks);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
    toast.success('Task status updated');
  };

  const categories = ['Documentation', 'IT Setup', 'Orientation', 'Training'] as const;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-card border-l border-border shadow-modal flex flex-col fade-in">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-600 text-foreground">{employee.name}</h3>
          <p className="text-xs text-muted-foreground">{employee.role} · {employee.department}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
          aria-label="Close task panel"
        >
          <X size={16} />
        </button>
      </div>

      <div className="px-6 py-4 border-b border-border bg-muted/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-600 text-foreground">Overall Progress</span>
          <span className="text-xs font-700 text-primary tabular-nums">
            {tasks.filter((t) => t.completed).length}/{tasks.length} tasks
          </span>
        </div>
        <ProgressBar
          completed={tasks.filter((t) => t.completed).length}
          total={tasks.length}
        />
        <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
          <span>Buddy: <span className="font-600 text-foreground">{employee.buddy}</span></span>
          <span>Start: <span className="font-600 text-foreground">{employee.startDate}</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
        {categories.map((cat) => {
          const catTasks = tasks.filter((t) => t.category === cat);
          if (catTasks.length === 0) return null;
          return (
            <div key={`cat-${cat}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-600 rounded-lg px-2 py-0.5 ${CATEGORY_COLORS[cat]}`}>{cat}</span>
                <span className="text-[10px] text-muted-foreground">
                  {catTasks.filter((t) => t.completed).length}/{catTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {catTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-150 w-full ${
                      task.completed ? 'bg-emerald-50/60 hover:bg-emerald-50' : 'bg-muted/60 hover:bg-muted'
                    }`}
                  >
                    {task.completed ? (
                      <CheckSquare size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square size={15} className="text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <span className={`text-xs leading-relaxed ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {task.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OnboardingTable() {
  const [selectedEmployee, setSelectedEmployee] = useState<OnboardingEmployee | null>(null);

  const formatDate = (d: string) => {
    const [y, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${day} ${months[parseInt(m) - 1]} ${y}`;
  };

  return (
    <>
      <div className="card-elevated rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground">New Hire</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Department</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Start Date</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Buddy</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground min-w-[140px]">Task Progress</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-600 uppercase tracking-wide text-muted-foreground whitespace-nowrap">Days Left</th>
                <th className="px-4 py-3 text-right text-[11px] font-600 uppercase tracking-wide text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {onboardingEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon={ClipboardList}
                      title="No onboarding records yet"
                      description="New hire onboarding records will appear here once you initiate the process for an employee."
                      actionLabel="Start Onboarding"
                      onAction={() => toast.info('Onboarding wizard opened')}
                    />
                  </td>
                </tr>
              ) : (
                onboardingEmployees.map((emp, idx) => (
                  <tr
                    key={emp.id}
                    className={`border-b border-border last:border-0 hover:bg-muted/40 transition-colors group ${
                      emp.status === 'Overdue' ?'bg-rose-50/30'
                        : idx % 2 === 1
                        ? 'bg-muted/20' :''
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${emp.status === 'Overdue' ? 'bg-rose-100' : 'bg-primary/10'}`}>
                          <span className={`text-[10px] font-700 ${emp.status === 'Overdue' ? 'text-rose-600' : 'text-primary'}`}>
                            {emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-600 text-foreground whitespace-nowrap">{emp.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{emp.department}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(emp.startDate)}</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{emp.buddy}</td>
                    <td className="px-4 py-3">
                      <ProgressBar completed={emp.tasksCompleted} total={emp.tasksTotal} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="px-4 py-3">
                      {emp.status === 'Completed' ? (
                        <span className="text-xs font-600 text-emerald-600">Done</span>
                      ) : emp.daysRemaining < 0 ? (
                        <span className="text-xs font-700 text-rose-600 tabular-nums">{Math.abs(emp.daysRemaining)}d overdue</span>
                      ) : (
                        <span className="text-xs font-600 tabular-nums">{emp.daysRemaining}d left</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          title="View onboarding tasks"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-primary transition-all duration-150"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          title="Open task checklist"
                          className="flex items-center gap-1 px-2 h-7 rounded-lg text-[10px] font-600 text-primary bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-150"
                        >
                          Tasks <ChevronRight size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Slide-out Panel */}
      {selectedEmployee && (
        <>
          <div
            className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setSelectedEmployee(null)}
          />
          <TaskPanel employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
        </>
      )}
    </>
  );
}