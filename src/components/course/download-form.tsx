'use client';

import { FileDown } from "lucide-react";

export function DownloadForm({ targetId }: { targetId?: string }) {
  const handleDownloadDoc = () => {
    if (!targetId) return;
    const element = document.getElementById(targetId);
    if (!element) return;

    const clonedElement = element.cloneNode(true) as HTMLElement;
    const originalInputs = element.querySelectorAll('input, textarea, select');
    const clonedInputs = clonedElement.querySelectorAll('input, textarea, select');

    clonedInputs.forEach((clonedInput, index) => {
      const originalInput = originalInputs[index] as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const val = originalInput.value || '';
      const span = document.createElement('span');
      span.style.fontWeight = 'bold';
      span.style.color = '#1e56e2';
      span.style.borderBottom = '1px solid #93c5fd';
      span.style.padding = '0 4px';
      
      if (clonedInput.tagName.toLowerCase() === 'textarea') {
        span.style.whiteSpace = 'pre-wrap';
        span.innerHTML = val.replace(/\n/g, '<br />') || '<i>No response</i>';
      } else {
        span.textContent = val || '__________';
      }
      clonedInput.parentNode?.replaceChild(span, clonedInput);
    });

    // Remove download buttons inside the clone
    clonedElement.querySelectorAll('.no-print').forEach(el => el.remove());

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Water Audit Form</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; margin: 1in; }
          h1, h2, h3, h4 { color: #1e56e2; font-family: 'Segoe UI', Arial, sans-serif; margin-top: 12pt; margin-bottom: 6pt; }
          h3 { font-size: 16pt; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
          table { border-collapse: collapse; width: 100%; margin: 18pt 0; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 10.5pt; }
          th { background-color: #f8fafc; font-weight: bold; color: #0f172a; }
          ol, ul { padding-left: 20px; margin-bottom: 12pt; }
          li { margin-bottom: 12pt; }
          strong { color: #0f172a; }
        </style>
      </head>
      <body>
        ${clonedElement.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${targetId}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex justify-center mt-8 no-print">
      <button 
        onClick={handleDownloadDoc}
        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[1.25rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200 cursor-pointer group"
      >
        <FileDown className="w-5 h-5 group-hover:animate-bounce" />
        Download Form as DOC
      </button>
    </div>
  );
}
