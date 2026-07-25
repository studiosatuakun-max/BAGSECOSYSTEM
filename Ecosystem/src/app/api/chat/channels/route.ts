// src/app/api/chat/channels/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  // Try to fetch the global channel (is_global = true)
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('is_global', true)
    .single();

  if (error?.code === 'PGRST116') {
    // Not found – create the global channel
    const { data: newChannel, error: insertErr } = await supabase
      .from('channels')
      .insert({ name: 'All Divisions', is_global: true })
      .select()
      .single();
    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
    return NextResponse.json(newChannel);
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
