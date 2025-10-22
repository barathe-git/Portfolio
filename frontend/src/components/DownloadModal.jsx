import React from 'react';
import { X, FileText, Download, Table } from 'lucide-react';

/**
 * Download Modal Component - Allows users to download CV/Portfolio in different formats
 */
const DownloadModal = ({ isOpen, onClose, onDownload }) => {
  if (!isOpen) return null;

  const downloadOptions = [
    {
      id: 'html',
      title: 'Resume (HTML)',
      description: 'Professional resume in HTML format, ready to print as PDF',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'csv',
      title: 'Portfolio Data (CSV)',
      description: 'All portfolio data in CSV format for Excel/Sheets',
      icon: Table,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'json',
      title: 'Portfolio (JSON)',
      description: 'Complete portfolio data in JSON format',
      icon: Download,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-card max-w-2xl w-full p-6 relative animate-fadeInUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold gradient-text mb-2">Download Portfolio</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Choose your preferred format to download
          </p>
        </div>

        {/* Download Options */}
        <div className="space-y-4">
          {downloadOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => {
                  onDownload(option.id);
                  onClose();
                }}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {option.description}
                    </p>
                  </div>
                  <Download className="text-slate-400 group-hover:text-blue-600 transition-colors" size={20} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Tip:</strong> The HTML resume can be opened in a browser and printed to PDF using your browser's print function (Ctrl/Cmd + P).
          </p>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;

