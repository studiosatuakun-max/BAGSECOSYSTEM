'use server';

import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

// ─── Custody Transfer Slips ────────────────────────────────────────────────────

export async function getCustodyTransfers(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('custody_transfers')
    .select('*')
    .order('date_wib', { ascending: false })
    .limit(100);

  return { data, error: error?.message ?? null };
}

export async function createCustodyTransfer(payload: {
  customer_id: string;
  fob_no: string;
  no_polisi: string;
  no_gtm: string;
  type_gtm?: string;
  date_wib?: string;
  time_wib: string;
  pressure_bar: number;
  fillpost_kg: number;
  micromotion_kg: number;
  selisih_kg?: number;
  koreksi_factor?: number;
  volume_nm3: number;
  volume_mmbtu: number;
  ghv: number;
  sg_gas: number;
  sg_fillpost: number;
  density: number;
  signed_by_ppc?: boolean;
  signed_by_driver?: boolean;
  signed_by_security?: boolean;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('custody_transfers')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/skid');
  return { data, error: error?.message ?? null };
}

export async function updateCustodyTransfer(
  id: string,
  payload: Record<string, unknown>
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('custody_transfers')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (!error) revalidatePath('/portal/skid');
  return { error: error?.message ?? null };
}

export async function signCustodyTransfer(
  id: string,
  role: 'ppc' | 'driver' | 'security'
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const fieldMap = { ppc: 'signed_by_ppc', driver: 'signed_by_driver', security: 'signed_by_security' };
  const { error } = await supabase
    .from('custody_transfers')
    .update({ [fieldMap[role]]: true, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (!error) revalidatePath('/portal/skid');
  return { error: error?.message ?? null };
}
