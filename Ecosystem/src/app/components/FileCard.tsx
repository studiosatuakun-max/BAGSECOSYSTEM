// src/app/components/FileCard.tsx
import React from 'react';

interface FileItem {
  id: string;
  file_name: string;
  url: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export default function FileCard({ file }: { file: FileItem }) {
  const sizeInKB = (file.size / 1024).toFixed(1);
  return (
    <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{file.file_name}</p>
        <p className="text-xs text-gray-300">{sizeInKB} KB • {new Date(file.created_at).toLocaleDateString()}</p>
      </div>
    </a>
  );
}
