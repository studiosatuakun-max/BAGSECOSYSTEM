'use server';

import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

export async function getHorecaClients(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('horeca_clients')
    .select('*')
    .order('business_name', { ascending: true });

  return { data, error: error?.message ?? null };
}

export async function createHorecaClient(payload: {
  business_name: string;
  sector?: string;
  zone?: string;
  contact_person?: string;
  phone_number?: string;
  supply_type?: string;
  address?: string;
  cradle_rack_qty?: number;
  monthly_quota_sm3?: number;
  utilized_sm3?: number;
  mtd_revenue_idr?: number;
  operating_pressure_bar?: number;
  safety_status?: string;
  sla_inspection_date?: string;
  contract_start?: string;
  contract_end?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('horeca_clients')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/horeca');
  return { data, error: error?.message ?? null };
}

export async function updateHorecaClient(
  id: string,
  payload: Record<string, unknown>
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('horeca_clients')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (!error) revalidatePath('/portal/horeca');
  return { error: error?.message ?? null };
}

export async function deleteHorecaClient(id: string): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('horeca_clients').delete().eq('id', id);
  if (!error) revalidatePath('/portal/horeca');
  return { error: error?.message ?? null };
}
