'use client';

import { FileDown } from "lucide-react";

export function DownloadForm() {
  return (
    <div className="flex justify-center mt-8 no-print">
      <button 
        onClick={() => window.print()}
        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[1.25rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200 cursor-pointer group"
      >
        <FileDown className="w-5 h-5 group-hover:animate-bounce" />
        Download Form as PDF
      </button>
    </div>
  );
}
