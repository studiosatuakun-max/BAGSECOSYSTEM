// src/app/api/chat/messages/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET /api/chat/messages?channelId=...&after=ISO_TIMESTAMP
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get('channelId');
  const after = searchParams.get('after');

  if (!channelId) {
    return NextResponse.json({ error: 'channelId required' }, { status: 400 });
  }

  let query = supabase
    .from('messages')
    .select('*')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (after) {
    query = query.gt('created_at', after);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/chat/messages
// Body: { channelId: string, content: string }
export async function POST(req: NextRequest) {
  const { channelId, content } = await req.json();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (!channelId || !content) {
    return NextResponse.json({ error: 'channelId and content required' }, { status: 400 });
  }

  const { data, error } = await supabase.from('messages').insert({
    channel_id: channelId,
    user_id: user.id,
    content,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
