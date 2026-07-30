'use server';

import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

// ─── Employees ────────────────────────────────────────────────────────────────

export async function getEmployees(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseServerClient();
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
  const supabase = createSupabaseServerClient();
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
  const supabase = createSupabaseServerClient();
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
  const supabase = createSupabaseServerClient();
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
  const supabase = createSupabaseServerClient();
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
  const supabase = createSupabaseServerClient();
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
  const supabase = createSupabaseServerClient();
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
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('shift_schedules')
    .update(payload)
    .eq('id', id);

  if (!error) revalidatePath('/portal/hr');
  return { error: error?.message ?? null };
}
