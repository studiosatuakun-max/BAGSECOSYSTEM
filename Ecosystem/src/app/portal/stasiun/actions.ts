'use server';
import { createSupabaseServerClient } from '@/lib/supabaseSSR';

export async function lookupRfidTag(epc: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('rfid_tags')
    .select('*')
    .eq('epc_hex', epc)
    .single();
    
  if (error || !data) {
    return { data: null, error: error?.message ?? 'Tag not found' };
  }
  
  return { data, error: null };
}
