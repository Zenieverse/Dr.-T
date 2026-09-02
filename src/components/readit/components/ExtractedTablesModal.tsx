import React, { useState } from 'react';
import { Table, X, Download, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { ExtractedTable } from '../../../types/readit';

interface ExtractedTablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: ExtractedTable[];
  documentTitle: string;
  onJumpToPage: (pageNumber: number) => void;
}

export const ExtractedTablesModal: React.FC<ExtractedTablesModalProps> = ({
  isOpen,
  onClose,
  tables,
  documentTitle,
  onJumpToPage,
}) => {
  const [selectedTableIdx, setSelectedTableIdx] = useState(0);

  if (!isOpen) return null;

  const currentTable = tables[selectedTableIdx] || tables[0];

  const handleDownloadCSV = () => {
    if (!currentTable) return;
    const csvRows: string[] = [];
    csvRows.push(currentTable.headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));
    currentTable.rows.forEach(row => {
      csvRows.push(row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Table_${selectedTableIdx + 1}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                Dr. T ReadIt — Extracted Data Tables
              </h3>
              <p className="text-xs text-slate-300">
                {tables.length} structured tabular dataset(s) extracted from document
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Selector Tabs */}
        {tables.length > 1 && (
          <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex space-x-2 overflow-x-auto">
            {tables.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setSelectedTableIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedTableIdx === idx
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Table {idx + 1} (Page {t.pageNumber})
              </button>
            ))}
          </div>
        )}

        {/* Table Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {currentTable ? (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Table on Page {currentTable.pageNumber} ({currentTable.rows.length} rows, {currentTable.headers.length} columns)
                  </span>
                </div>
                <button
                  onClick={() => {
                    onJumpToPage(currentTable.pageNumber);
                    onClose();
                  }}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
                >
                  Jump to Page {currentTable.pageNumber}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      {currentTable.headers.map((h, i) => (
                        <th key={i} className="py-2.5 px-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/80 transition font-mono">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-4 text-slate-800">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No tabular structures detected in this document.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleDownloadCSV}
            disabled={!currentTable}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs disabled:opacity-40 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
