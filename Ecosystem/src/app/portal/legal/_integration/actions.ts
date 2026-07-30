'use server';

import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

// ─── Legal Contracts ───────────────────────────────────────────────────────────

export async function getLegalContracts(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('legal_contracts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return { data, error: error?.message ?? null };
}

export async function createLegalContract(payload: {
  contract_number: string;
  customer_id?: string;
  customer_type: string;
  customer_name: string;
  contract_type: string;
  tube_ownership?: string;
  has_liability_clause?: boolean;
  liability_notes?: string;
  contract_value_idr?: number;
  monthly_quota_mmbtu?: number;
  start_date: string;
  end_date: string;
  counsel_name?: string;
  status?: string;
  notes?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('legal_contracts')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/legal');
  return { data, error: error?.message ?? null };
}

export async function updateContractStatus(
  id: string,
  status: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('legal_contracts')
    .update({ status })
    .eq('id', id);

  if (!error) revalidatePath('/portal/legal');
  return { error: error?.message ?? null };
}

export async function deleteLegalContract(id: string): Promise<{ error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('legal_contracts').delete().eq('id', id);
  if (!error) revalidatePath('/portal/legal');
  return { error: error?.message ?? null };
}

// ─── Legal Permits ─────────────────────────────────────────────────────────────

export async function getLegalPermits(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('legal_permits')
    .select('*')
    .order('expiry_date', { ascending: true })
    .limit(50);

  return { data, error: error?.message ?? null };
}

export async function createLegalPermit(payload: {
  permit_name: string;
  permit_number: string;
  issuing_authority: string;
  issue_date?: string;
  expiry_date: string;
  permit_category?: string;
  status?: string;
  renewal_notes?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('legal_permits')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/legal');
  return { data, error: error?.message ?? null };
}

export async function updatePermitStatus(
  id: string,
  status: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('legal_permits')
    .update({ status })
    .eq('id', id);

  if (!error) revalidatePath('/portal/legal');
  return { error: error?.message ?? null };
}
