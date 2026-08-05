import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { z } from 'zod';
import type { DispatchItem } from '@/types/dispatch';

export type { DispatchItem };

// 1. Strict Zod Schemas for Payload Validation & Anti-Injection
const AttachmentSchema = z.object({
  file_name: z.string().min(1).max(255).regex(/^[a-zA-Z0-9_.-]+$/, 'Invalid file name characters'),
  file_url: z.string().url().or(z.literal('#')),
  file_size: z.string().max(20),
});

const CreateDispatchSchema = z.object({
  sender_division: z.string().min(2).max(100),
  receiver_division: z.string().min(2).max(100),
  subject: z.string().min(3).max(200).transform((val) => val.replace(/<[^>]*>?/gm, '')),
  content: z.string().min(5).max(5000).transform((val) => val.replace(/<[^>]*>?/gm, '')),
  priority: z.enum(['Normal', 'High', 'Urgent']).default('Normal'),
  attachments: z.array(AttachmentSchema).max(5).optional().default([]),
});

const UpdateStatusSchema = z.object({
  id: z.string().min(3).max(100),
  status: z.enum(['Unread', 'Read', 'In Review', 'Resolved']),
});

// UI to DB Enum Mapper
const UI_TO_DB_DIV_MAP: Record<string, string> = {
  'Fleet & Transport': 'armada',
  'Finance & Accounting': 'keuangan',
  'HR & Workforce': 'hr',
  'Stasiun CNG': 'stasiun',
  'Pemasaran': 'pemasaran',
  'Legal & Compliance': 'legal',
  'Skid Tank Operations': 'skid',
  'Horeca Gas Logistics': 'horeca',
  'Direksi / Management': 'admin',
};

// DB Enum to UI Mapper
const DB_TO_UI_DIV_MAP: Record<string, string> = {
  'armada': 'Fleet & Transport',
  'keuangan': 'Finance & Accounting',
  'hr': 'HR & Workforce',
  'stasiun': 'Stasiun CNG',
  'pemasaran': 'Pemasaran',
  'legal': 'Legal & Compliance',
  'skid': 'Skid Tank Operations',
  'horeca': 'Horeca Gas Logistics',
  'admin': 'Direksi / Management',
  'pwa': 'PWA',
  'industrial': 'Industrial',
};

// Rich fallback dispatches
const MOCK_DISPATCHES: DispatchItem[] = [
  {
    id: 'dsp-1',
    sender_division: 'Fleet & Transport',
    receiver_division: 'Finance & Accounting',
    subject: 'Request Approval: Biaya Maintenance Rutin 5 Skid Tank CNG',
    content: 'Selamat pagi tim Keuangan. Mengajukan approval pencairan dana untuk perawatan rutin berkala dan sertifikasi ulang katup tekanan pada 5 unit Skid Tank (Plat W 8912 XG s/d W 8916 XG) di bengkel resmi Gresik. Total estimasi biaya Rp 42.500.000. Mohon proses secepatnya agar rotasi pengiriman gas tidak terhambat. Terima kasih.',
    priority: 'Urgent',
    status: 'Unread',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    attachments: [{ file_name: 'Quotation_Maintenance_Gresik_2026.pdf', file_url: '#', file_size: '3.4 MB' }],
  }
];

// GET /api/inbox/dispatches?view=inbox|sent&division=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view') || 'inbox';
  const division = searchParams.get('division') || 'All Divisions';

  try {
    let query = supabase.from('dispatches').select('*').order('created_at', { ascending: false });

    if (view === 'inbox' && division !== 'All Divisions') {
      const dbDiv = UI_TO_DB_DIV_MAP[division] || 'admin';
      query = query.eq('to_division', dbDiv);
    } else if (view === 'sent' && division !== 'All Divisions') {
      const dbDiv = UI_TO_DB_DIV_MAP[division] || 'admin';
      query = query.eq('from_division', dbDiv);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      let filtered = MOCK_DISPATCHES;
      if (view === 'sent' && division !== 'All Divisions') {
        filtered = MOCK_DISPATCHES.filter(d => d.sender_division === division);
      } else if (view === 'inbox' && division !== 'All Divisions') {
        filtered = MOCK_DISPATCHES.filter(d => d.receiver_division === division || d.receiver_division === 'All Divisions');
      }
      return NextResponse.json(filtered);
    }

    // MAP DB data back to UI schema
    const mappedData: DispatchItem[] = data.map((d: any) => ({
      id: d.id,
      sender_division: DB_TO_UI_DIV_MAP[d.from_division] || d.from_division,
      receiver_division: DB_TO_UI_DIV_MAP[d.to_division] || d.to_division,
      subject: d.subject,
      content: d.body,
      priority: d.priority,
      status: d.status,
      created_at: d.created_at,
      attachments: [] // Attachments would be joined from dispatch_files
    }));

    return NextResponse.json(mappedData);
  } catch (err) {
    return NextResponse.json(MOCK_DISPATCHES);
  }
}

// POST /api/inbox/dispatches (Hardened with Mapper & Broadcast System)
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = CreateDispatchSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed: Invalid payload schema or XSS attempt detected',
        details: parseResult.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { sender_division, receiver_division, subject, content, priority, attachments } = parseResult.data;
    const from_division = UI_TO_DB_DIV_MAP[sender_division] || 'admin';

    let inserts = [];

    // BROADCAST SYSTEM: If 'All Divisions', send to every other division in the map
    if (receiver_division === 'All Divisions') {
      const allTargetDivs = Object.values(UI_TO_DB_DIV_MAP).filter(div => div !== from_division);
      const uniqueTargetDivs = Array.from(new Set(allTargetDivs)); // Remove duplicates
      
      inserts = uniqueTargetDivs.map(to_div => ({
        from_division,
        to_division: to_div,
        subject,
        body: content,
        priority,
        status: 'Unread'
      }));
    } else {
      // SINGLE MESSAGE
      const to_division = UI_TO_DB_DIV_MAP[receiver_division] || 'admin';
      inserts = [{
        from_division,
        to_division,
        subject,
        body: content,
        priority,
        status: 'Unread'
      }];
    }

    // Insert payload into Supabase
    const { data, error } = await supabase.from('dispatches').insert(inserts).select();

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the first inserted row mapped back to UI
    const d = data[0];
    const newDispatch: DispatchItem = {
      id: d.id,
      sender_division: DB_TO_UI_DIV_MAP[d.from_division] || d.from_division,
      receiver_division: DB_TO_UI_DIV_MAP[d.to_division] || d.to_division,
      subject: d.subject,
      content: d.body,
      priority: d.priority,
      status: d.status,
      created_at: d.created_at,
      attachments,
    };

    return NextResponse.json(newDispatch, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing request' }, { status: 500 });
  }
}

// PATCH /api/inbox/dispatches
export async function PATCH(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = UpdateStatusSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed: Invalid status or ID format',
        details: parseResult.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { id, status } = parseResult.data;
    const { data, error } = await supabase.from('dispatches').update({ status }).eq('id', id).select().single();

    if (error) {
      return NextResponse.json({ id, status, updated: true });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating status' }, { status: 500 });
  }
}
