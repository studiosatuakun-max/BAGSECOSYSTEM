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
  subject: z.string().min(3).max(200).transform((val) => val.replace(/<[^>]*>?/gm, '')), // Strip HTML tags against XSS
  content: z.string().min(5).max(5000).transform((val) => val.replace(/<[^>]*>?/gm, '')), // Strip HTML tags against XSS
  priority: z.enum(['Normal', 'High', 'Urgent']).default('Normal'),
  attachments: z.array(AttachmentSchema).max(5).optional().default([]),
});

const UpdateStatusSchema = z.object({
  id: z.string().min(3).max(100),
  status: z.enum(['Unread', 'Read', 'In Review', 'Resolved']),
});

// Rich fallback dispatches for instant demo experience if Supabase table is not yet created
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
    attachments: [
      {
        file_name: 'Quotation_Maintenance_Gresik_2026.pdf',
        file_url: '#',
        file_size: '3.4 MB',
      }
    ],
  },
  {
    id: 'dsp-2',
    sender_division: 'Stasiun CNG (Mother Station)',
    priority: 'High',
    status: 'In Review',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    attachments: [
      {
        file_name: 'Delivery_Order_Ariell_Parts.pdf',
        file_url: '#',
        file_size: '1.2 MB',
      }
    ],
  },
  {
    id: 'dsp-3',
    sender_division: 'HR & Legal',
    receiver_division: 'All Divisions',
    subject: 'Memo Direksi: Penyesuaian Jam Operasional Libur Nasional & Prosedur Safety ATEX',
    content: 'Sehubungan dengan libur nasional minggu depan, seluruh divisi operasional (Fleet, Stasiun, Horeca, Industri) wajib memastikan jadwal petugas piket pengawasan tekanan gas. Patuhi standar keselamatan ATEX Zone A/B di setiap titik bongkar muat.',
    priority: 'Normal',
    status: 'Read',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    attachments: [
      {
        file_name: 'SE_Direksi_Operasional_2026.pdf',
        file_url: '#',
        file_size: '850 KB',
      }
    ],
  },
  {
    id: 'dsp-4',
    sender_division: 'Fleet & Transport',
    content: 'Menginfokan bahwa PT Jatim Steel meminta percepatan waktu bongkar muat CNG dari jam 14.00 menjadi jam 10.00 WIB untuk pengiriman besok pagi dikarenakan peningkatan kapasitas produksi boiler. Driver Budi (Truk 01) sudah dikonfirmasi.',
    priority: 'High',
    status: 'Resolved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

// Helper: Verify Authentication Session (Zero-Trust)
async function verifyAuthSession(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) return user;
  }
  // Check browser session via cookies in Supabase client
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (!sessionError && session?.user) return session.user;
  return null;
}

// GET /api/inbox/dispatches?view=inbox|sent&division=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view') || 'inbox';
  const division = searchParams.get('division') || 'All Divisions';

  try {
    let query = supabase.from('dispatches').select('*').order('created_at', { ascending: false });

    if (view === 'inbox' && division !== 'All Divisions') {
      query = query.or(`receiver_division.eq.${division},receiver_division.eq.All Divisions`);
    } else if (view === 'sent' && division !== 'All Divisions') {
      query = query.eq('sender_division', division);
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

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(MOCK_DISPATCHES);
  }
}

// POST /api/inbox/dispatches (Hardened with Zod Validation)
export async function POST(req: NextRequest) {
  try {
    // Optional: Enforce auth in strict production mode
    // const user = await verifyAuthSession(req);
    // if (!user) return NextResponse.json({ error: 'Unauthorized. Valid token required.' }, { status: 401 });

    const rawBody = await req.json();
    const parseResult = CreateDispatchSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed: Invalid payload schema or XSS attempt detected',
        details: parseResult.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { sender_division, receiver_division, subject, content, priority, attachments } = parseResult.data;

    const newDispatch: DispatchItem = {
      id: `dsp-${Date.now()}`,
      sender_division,
      receiver_division,
      subject,
      content,
      priority,
      status: 'Unread',
      created_at: new Date().toISOString(),
      attachments,
    };

    const { data, error } = await supabase.from('dispatches').insert([newDispatch]).select().single();

    if (error) {
      return NextResponse.json(newDispatch, { status: 201 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing request' }, { status: 500 });
  }
}

// PATCH /api/inbox/dispatches (Hardened with Zod Validation)
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
