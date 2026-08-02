'use server';

import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

// ─── Employees ────────────────────────────────────────────────────────────────

export async function getEmployees(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return { data, error: error?.message ?? null };
}

export async function createEmployee(payload: {
  full_name: string;
  employee_number?: string;
  department?: string;
  position?: string;
  hire_date?: string;
  employment_status?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('employees')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/hr');
  return { data, error: error?.message ?? null };
}

export async function updateEmployee(
  id: string,
  payload: Record<string, unknown>
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('employees')
    .update(payload)
    .eq('id', id);

  if (!error) revalidatePath('/portal/hr');
  return { error: error?.message ?? null };
}

// ─── Employee Trainings ─────────────────────────────────────────────────────────

export async function getEmployeeTrainings(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('employee_trainings')
    .select('*')
    .order('training_date', { ascending: false })
    .limit(100);

  return { data, error: error?.message ?? null };
}

export async function createTraining(payload: {
  employee_id: string;
  training_name: string;
  training_date: string;
  trainer_name?: string;
  duration_hours?: number;
  certificate_issued?: boolean;
  attendance_doc_url?: string;
  material_doc_url?: string;
  notes?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('employee_trainings')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/hr');
  return { data, error: error?.message ?? null };
}

// ─── Shift Schedules ──────────────────────────────────────────────────────────

export async function getShiftSchedules(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('shift_schedules')
    .select('*')
    .order('shift_date', { ascending: false })
    .limit(100);

  return { data, error: error?.message ?? null };
}

export async function createShiftSchedule(payload: {
  employee_id: string;
  shift_date: string;
  shift_type: string;
  station_location?: string;
  notes?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('shift_schedules')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/hr');
  return { data, error: error?.message ?? null };
}

export async function updateShiftSchedule(
  id: string,
  payload: Record<string, unknown>
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('shift_schedules')
    .update(payload)
    .eq('id', id);

  if (!error) revalidatePath('/portal/hr');
  return { error: error?.message ?? null };
}

// ─── ATEX & Migas HR Command Center ──────────────────────────────────────────

export async function getHRMetrics() {
  const supabase = await createSupabaseServerClient();
  
  // 1. Headcount & KPI
  const { data: employees } = await supabase
    .from('employees')
    .select('id, kpi_score, sio_expiry')
    .eq('status', 'Active');
    
  const headcount = employees?.length || 0;
  const averageKpi = employees && headcount > 0
    ? employees.reduce((sum, emp) => sum + (Number(emp.kpi_score) || 0), 0) / headcount
    : 0;
    
  const today = new Date();
  let criticalSio = 0;
  let warningSio = 0;
  
  employees?.forEach(emp => {
    if (emp.sio_expiry) {
      const expiryDate = new Date(emp.sio_expiry);
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 30) {
        criticalSio++;
      } else if (diffDays <= 60) {
        warningSio++;
      }
    }
  });

  // 2. Today's Shifts (Not 'Off')
  const todayStr = new Date().toISOString().split('T')[0];
  const { count: shiftCount } = await supabase
    .from('shift_schedules')
    .select('*', { count: 'exact', head: true })
    .eq('shift_date', todayStr)
    .neq('shift_type', 'Off');

  return {
    data: {
      headcount,
      averageKpi: Number(averageKpi.toFixed(1)),
      activeShiftsToday: shiftCount || 0,
      sioAlerts: {
        critical: criticalSio,
        warning: warningSio,
        totalAlerts: criticalSio + warningSio
      }
    }
  };
}

export async function getTodaysShifts() {
  const supabase = await createSupabaseServerClient();
  const todayStr = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('shift_schedules')
    .select('*, employees(full_name, role_title, department)')
    .eq('shift_date', todayStr)
    .order('shift_type', { ascending: true });
    
  return { data, error: error?.message ?? null };
}

export async function getTrainingMatrix() {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('employee_trainings')
    .select('*, employees(full_name, role_title, department)')
    .in('training_type', ['ATEX', 'MIGAS', 'HSE'])
    .order('expiry_date', { ascending: true });
    
  return { data, error: error?.message ?? null };
}
