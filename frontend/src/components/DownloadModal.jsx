import { createElement, useEffect, useRef } from 'react';
import { Braces, Download, FileText, Table, X } from 'lucide-react';

const DownloadModal = ({ isOpen, onClose, onDownload }) => {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return undefined;
    closeRef.current?.focus();
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  const options = [
    { id: 'html', title: 'Printable résumé', text: 'A polished HTML résumé ready to print or save as PDF.', icon: FileText },
    { id: 'csv', title: 'Portfolio spreadsheet', text: 'Structured project and experience data for Excel or Sheets.', icon: Table },
    { id: 'json', title: 'Portfolio JSON', text: 'The complete portfolio dataset in a developer-friendly format.', icon: Braces },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="download-title" className="w-full max-w-xl rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="section-kicker">Download</p><h2 id="download-title" className="mt-3 text-2xl font-semibold text-slate-950">Choose a format</h2><p className="mt-2 text-sm leading-6 text-slate-600">Take the portfolio with you in the format that fits your workflow.</p></div><button ref={closeRef} type="button" onClick={onClose} className="icon-button shrink-0" aria-label="Close download dialog"><X size={20} aria-hidden="true" /></button></div>
        <div className="mt-7 space-y-3">{options.map(({ id, title, text, icon: Icon }) => <button key={id} type="button" onClick={() => { onDownload(id); onClose(); }} className="group flex min-h-20 w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition duration-200 hover:border-blue-300 hover:bg-blue-50"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">{createElement(Icon, { size: 22, 'aria-hidden': true })}</span><span className="flex-1"><strong className="block font-heading text-sm text-slate-900">{title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{text}</span></span><Download size={18} className="text-slate-400 transition group-hover:text-blue-700" aria-hidden="true" /></button>)}</div>
      </div>
    </div>
  );
};

export default DownloadModal;
