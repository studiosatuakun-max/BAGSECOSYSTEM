'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';

export default function AutoPrint() {
  const router = useRouter();

  useEffect(() => {
    // Delay print slightly to ensure fonts and styles are loaded
    const timeout = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="print:hidden mb-8 flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl shadow-lg">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors text-sm font-semibold"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>
      <button 
        onClick={() => window.print()}
        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-900 hover:bg-amber-600 rounded-lg transition-colors text-sm font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
      >
        <Printer size={16} />
        Print Invoice
      </button>
    </div>
  );
}
