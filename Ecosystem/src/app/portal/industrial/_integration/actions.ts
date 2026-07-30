'use server';

import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

export async function getIndustrialClients(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('industrial_clients')
    .select('*')
    .order('company_name', { ascending: true });

  return { data, error: error?.message ?? null };
}

export async function createIndustrialClient(payload: {
  company_name: string;
  sector?: string;
  zone?: string;
  contact_person?: string;
  phone_number?: string;
  contract_no?: string;
  supply_method?: string;
  monthly_quota_mmbtu?: number;
  utilized_quota_mmbtu?: number;
  mtd_revenue_idr?: number;
  price_per_mmbtu_usd?: number;
  contract_start?: string;
  contract_end?: string;
  address?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('industrial_clients')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/industrial');
  return { data, error: error?.message ?? null };
}

export async function updateIndustrialClient(
  id: string,
  payload: Record<string, unknown>
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('industrial_clients')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (!error) revalidatePath('/portal/industrial');
  return { error: error?.message ?? null };
}

export async function deleteIndustrialClient(id: string): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('industrial_clients').delete().eq('id', id);
  if (!error) revalidatePath('/portal/industrial');
  return { error: error?.message ?? null };
}
