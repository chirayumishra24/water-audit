'use client';

import { FileDown } from "lucide-react";

export function DownloadForm({ targetId }: { targetId?: string }) {
  const handlePrint = () => {
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
          printWindow.document.write('<html><head><title>Print Report</title>');
          // Copy styles for Tailwind
          const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
          styles.forEach(style => {
            printWindow.document.write(style.outerHTML);
          });
          printWindow.document.write('</head><body style="background: white; color: black; padding: 2rem;">');
          printWindow.document.write(element.innerHTML);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 500);
          return;
        }
      }
    }
    window.print();
  };

  return (
    <div className="flex justify-center mt-8 no-print">
      <button 
        onClick={handlePrint}
        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[1.25rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200 cursor-pointer group"
      >
        <FileDown className="w-5 h-5 group-hover:animate-bounce" />
        Download Form as PDF
      </button>
    </div>
  );
}
