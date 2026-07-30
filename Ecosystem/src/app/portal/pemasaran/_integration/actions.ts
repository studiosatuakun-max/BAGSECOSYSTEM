'use server';

import { createSupabaseServerClient } from '@/lib/supabaseSSR';
import { revalidatePath } from 'next/cache';

// ─── Sales Leads ──────────────────────────────────────────────────────────────

export async function getSalesLeads(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('sales_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return { data, error: error?.message ?? null };
}

export async function createSalesLead(payload: {
  company_name: string;
  contact_person: string;
  phone_number: string;
  email?: string;
  segment: 'Industri' | 'Horeca';
  pipeline_stage?: string;
  estimated_volume_mmbtu?: number;
  cluster_location?: string;
  current_vendor?: string;
  competitor_contract_end_date?: string;
  notes?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('sales_leads')
    .insert({ ...payload, pipeline_stage: payload.pipeline_stage ?? 'Perkenalan_Awal' })
    .select()
    .single();

  if (!error) revalidatePath('/portal/pemasaran');
  return { data, error: error?.message ?? null };
}

export async function updateLeadStage(
  id: string,
  pipeline_stage: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('sales_leads')
    .update({ pipeline_stage, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (!error) revalidatePath('/portal/pemasaran');
  return { error: error?.message ?? null };
}

export async function deleteSalesLead(id: string): Promise<{ error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('sales_leads').delete().eq('id', id);
  if (!error) revalidatePath('/portal/pemasaran');
  return { error: error?.message ?? null };
}

// ─── Marketing Campaigns ──────────────────────────────────────────────────────

export async function getMarketingCampaigns(): Promise<{
  data: Record<string, unknown>[] | null;
  error: string | null;
}> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('marketing_campaigns')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return { data, error: error?.message ?? null };
}

export async function createMarketingCampaign(payload: {
  campaign_name: string;
  campaign_type: string;
  segment_target: string;
  start_date: string;
  end_date?: string;
  budget_idr: number;
  notes?: string;
}): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('marketing_campaigns')
    .insert(payload)
    .select()
    .single();

  if (!error) revalidatePath('/portal/pemasaran');
  return { data, error: error?.message ?? null };
}

export async function updateCampaignStatus(
  id: string,
  status: string
): Promise<{ error: string | null }> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('marketing_campaigns')
    .update({ status })
    .eq('id', id);

  if (!error) revalidatePath('/portal/pemasaran');
  return { error: error?.message ?? null };
}
