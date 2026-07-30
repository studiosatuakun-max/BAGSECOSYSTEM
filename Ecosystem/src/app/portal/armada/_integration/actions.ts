'use server';

import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

// ─── Surat Jalan CNF ────────────────────────────────────────────────────────────

export async function getSuratJalanCNF(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('surat_jalan_cnf')
    .select('*')
    .order('depart_time', { ascending: false })
    .limit(100);

  return { data, error: error?.message ?? null };
}

export async function createSuratJalanCNF(payload: {
  no_pengiriman: string;
  customer_id?: string;
  customer_address?: string;
  no_gtm: string;
  no_head: string;
  depart_time?: string;
  depart_pressure_bar?: number;
  depart_temp_c?: number;
  notes?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('surat_jalan_cnf')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/armada');
  return { data, error: error?.message ?? null };
}

export async function updateSuratJalanCNF(
  id: string,
  payload: Record<string, unknown>
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('surat_jalan_cnf')
    .update(payload)
    .eq('id', id);

  if (!error) revalidatePath('/portal/armada');
  return { error: error?.message ?? null };
}

export async function deleteSuratJalanCNF(id: string): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('surat_jalan_cnf').delete().eq('id', id);
  if (!error) revalidatePath('/portal/armada');
  return { error: error?.message ?? null };
}

// ─── Delivery Orders Horeca ─────────────────────────────────────────────────────

export async function getDeliveryOrdersHoreca(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('delivery_orders_horeca')
    .select('*')
    .order('depart_time', { ascending: false })
    .limit(100);

  return { data, error: error?.message ?? null };
}

export async function createDeliveryOrderHoreca(payload: {
  no_do: string;
  customer_id?: string;
  customer_name?: string;
  driver_name?: string;
  vehicle_type?: string;
  vehicle_plate: string;
  qty_delivered_full?: number;
  qty_returned_empty?: number;
  depart_time?: string;
  delivery_zone?: string;
  notes?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('delivery_orders_horeca')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/armada');
  return { data, error: error?.message ?? null };
}

export async function updateDeliveryOrderHoreca(
  id: string,
  payload: Record<string, unknown>
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('delivery_orders_horeca')
    .update(payload)
    .eq('id', id);

  if (!error) revalidatePath('/portal/armada');
  return { error: error?.message ?? null };
}
