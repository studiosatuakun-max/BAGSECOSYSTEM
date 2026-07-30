'use server';

import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

// ─── Master Fueling Records ────────────────────────────────────────────────────

export async function getMasterFuelingRecords(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('master_fueling_records')
    .select('*, inspections:atex_inspections(*), compressor_logs:compressor_hour_running(*)')
    .order('created_at', { ascending: false })
    .limit(50);

  return { data, error: error?.message ?? null };
}

export async function createMasterFuelingRecord(payload: {
  queue_no: number;
  customer_name: string;
  date?: string;
  tube_trailer_no: string;
  no_pol: string;
  lwc?: number;
  arrival_from?: string;
  start_time: string;
  finish_time?: string;
  pressure_initial_bar?: number;
  pressure_full_bar?: number;
  temp_start_c?: number;
  temp_finish_c?: number;
  fill_post_number?: string;
  volume_start_nm3?: number;
  volume_finish_nm3?: number;
  volume_delivery_nm3: number;
  volume_delivery_kg: number;
  status?: string;
  operator_id?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('master_fueling_records')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/stasiun');
  return { data, error: error?.message ?? null };
}

export async function updateMasterFuelingRecord(
  id: string,
  payload: Record<string, unknown>
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('master_fueling_records')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (!error) revalidatePath('/portal/stasiun');
  return { error: error?.message ?? null };
}

// ─── ATEX Inspections ─────────────────────────────────────────────────────────

export async function createAtexInspection(payload: {
  fueling_record_id: string;
  inspection_type: 'PRE_FILL' | 'POST_FILL';
  quick_connect_safety_rope: boolean;
  grounding_cable_tyre_stopper: boolean;
  sign_filling_process: boolean;
  recorded_by: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('atex_inspections')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/stasiun');
  return { data, error: error?.message ?? null };
}

// ─── Compressor Hour Running ───────────────────────────────────────────────────

export async function createCompressorHourRunning(payload: {
  fueling_record_id: string;
  compressor_name: 'IMW-01' | 'IMW-02' | 'AGIRA';
  start_hour: number;
  finish_hour: number;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('compressor_hour_running')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/stasiun');
  return { data, error: error?.message ?? null };
}
