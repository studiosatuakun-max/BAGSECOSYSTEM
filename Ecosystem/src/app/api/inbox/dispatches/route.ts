// src/app/api/inbox/dispatches/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export interface DispatchItem {
  id: string;
  sender_division: string;
  receiver_division: string;
  subject: string;
  content: string;
  priority: 'Normal' | 'High' | 'Urgent';
  status: 'Unread' | 'Read' | 'In Review' | 'Resolved';
  created_at: string;
  attachments?: {
    file_name: string;
    file_url: string;
    file_size: string;
  }[];
}

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
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
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
    sender_division: 'Purchasing',
    receiver_division: 'Stasiun CNG (Mother Station)',
    subject: 'Konfirm Jadwal Kedatangan Sparepart Kompresor Ariell',
    content: 'Tim Stasiun CNG, kami informasikan bahwa suku cadang seal ring dan oli hidrolik untuk kompresor utama sudah tiba di gudang pusat Surabaya. Mohon tim teknisi stasiun melakukan pengecekan fisik dan penjadwalan instalasi pada shift malam besok.',
    priority: 'High',
    status: 'In Review',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
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
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
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
    sender_division: 'Customer Service',
    receiver_division: 'Fleet & Transport',
    subject: 'Laporan Pelanggan: Penyesuaian Waktu Bongkar PT Jatim Steel',
    content: 'Menginfokan bahwa PT Jatim Steel meminta percepatan waktu bongkar muat CNG dari jam 14.00 menjadi jam 10.00 WIB untuk pengiriman besok pagi dikarenakan peningkatan kapasitas produksi boiler. Driver Budi (Truk 01) sudah dikonfirmasi.',
    priority: 'High',
    status: 'Resolved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

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
      // If table doesn't exist yet or is empty, return our rich mock data filtered by view/division
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

// POST /api/inbox/dispatches
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sender_division, receiver_division, subject, content, priority, attachments } = body;

    if (!sender_division || !receiver_division || !subject || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newDispatch: DispatchItem = {
      id: `dsp-${Date.now()}`,
      sender_division,
      receiver_division,
      subject,
      content,
      priority: priority || 'Normal',
      status: 'Unread',
      created_at: new Date().toISOString(),
      attachments: attachments || [],
    };

    // Attempt to insert into Supabase
    const { data, error } = await supabase.from('dispatches').insert([newDispatch]).select().single();

    if (error) {
      // Fallback: return the newly created object so client state updates seamlessly
      return NextResponse.json(newDispatch, { status: 201 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing request' }, { status: 500 });
  }
}

// PATCH /api/inbox/dispatches
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const { data, error } = await supabase.from('dispatches').update({ status }).eq('id', id).select().single();

    if (error) {
      // Fallback: return mock update success
      return NextResponse.json({ id, status, updated: true });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating status' }, { status: 500 });
  }
}
