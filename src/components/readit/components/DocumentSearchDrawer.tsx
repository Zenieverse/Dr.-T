import React, { useState } from 'react';
import { Search, X, ChevronRight, FileText } from 'lucide-react';
import { NormalizedDocument } from '../../../types/readit';

interface DocumentSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  document: NormalizedDocument;
  onJumpToPage: (pageNumber: number) => void;
}

export const DocumentSearchDrawer: React.FC<DocumentSearchDrawerProps> = ({
  isOpen,
  onClose,
  document,
  onJumpToPage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const matches = searchTerm.trim().length > 1
    ? document.pages.flatMap((page) => {
        const lowerPage = page.text.toLowerCase();
        const lowerSearch = searchTerm.toLowerCase();
        if (lowerPage.includes(lowerSearch)) {
          // Find snippets
          const idx = lowerPage.indexOf(lowerSearch);
          const start = Math.max(0, idx - 40);
          const end = Math.min(page.text.length, idx + searchTerm.length + 60);
          const snippet = (start > 0 ? '...' : '') + page.text.slice(start, end) + (end < page.text.length ? '...' : '');
          return [{ pageNumber: page.pageNumber, snippet }];
        }
        return [];
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm">Search Document Text</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type keyword, lab test, dosage, phrase..."
              autoFocus
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="mt-2 text-[11px] font-bold text-slate-500 flex items-center justify-between">
            <span>
              {searchTerm.trim().length > 1 ? `${matches.length} result(s) found across ${document.pageCount} page(s)` : 'Enter at least 2 characters to search'}
            </span>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {matches.map((m, i) => (
            <div
              key={i}
              onClick={() => {
                onJumpToPage(m.pageNumber);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 cursor-pointer transition flex items-start justify-between group"
            >
              <div className="space-y-1 pr-2">
                <div className="flex items-center space-x-1 text-xs font-bold text-teal-800">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  <span>Page {m.pageNumber}</span>
                </div>
                <div className="text-xs text-slate-700 font-mono leading-relaxed">
                  {m.snippet}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 shrink-0 mt-2 transition" />
            </div>
          ))}

          {searchTerm.trim().length > 1 && matches.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching text found for "{searchTerm}".
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
