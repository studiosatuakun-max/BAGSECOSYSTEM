// src/app/api/inbox/files/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// POST /api/inbox/files (Max 25MB upload)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 25 MB limit' }, { status: 413 });
    }

    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const sizeMB = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    // Attempt upload to Supabase storage bucket 'inbox-files'
    const { data, error } = await supabase.storage.from('inbox-files').upload(fileName, file);

    if (error) {
      // Fallback for demo if storage bucket isn't configured in Supabase yet
      return NextResponse.json({
        file_name: file.name,
        file_url: '#',
        file_size: sizeMB,
        mock: true,
      });
    }

    const { data: publicUrlData } = supabase.storage.from('inbox-files').getPublicUrl(fileName);

    return NextResponse.json({
      file_name: file.name,
      file_url: publicUrlData?.publicUrl || '#',
      file_size: sizeMB,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing file upload' }, { status: 500 });
  }
}
