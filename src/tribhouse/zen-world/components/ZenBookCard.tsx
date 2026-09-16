import React from 'react';
import { 
  BookOpen, ShieldCheck, Download, Sparkles, Clock, 
  Trees, Tag, ExternalLink, CheckCircle2, FileText 
} from 'lucide-react';
import { ZenBook } from '../types';

interface ZenBookCardProps {
  book: ZenBook;
  onReadOnline: (book: ZenBook) => void;
  onTriggerScanAndDownload: (book: ZenBook) => void;
}

export const ZenBookCard: React.FC<ZenBookCardProps> = ({
  book,
  onReadOnline,
  onTriggerScanAndDownload
}) => {
  return (
    <div 
      id={`zen-book-card-${book.id}`}
      className="group bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-800/80 transition-all duration-300 flex flex-col justify-between space-y-4"
    >
      <div className="space-y-4">
        {/* Top Badges & Connected Library */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="truncate max-w-[170px]">{book.connectedLibraryName}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            {book.fileMeta.format} • {book.fileMeta.fileSize}
          </span>
        </div>

        {/* Visual Cover & Header Info */}
        <div className="flex gap-4 items-start">
          <div className="relative w-24 sm:w-28 h-36 sm:h-40 rounded-2xl overflow-hidden shadow-md shrink-0 border border-stone-200/80 dark:border-stone-700 group-hover:scale-105 transition-transform duration-300">
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center">
              <span className="text-[9px] font-mono font-bold text-emerald-300 bg-stone-900/80 px-1.5 py-0.5 rounded border border-emerald-400/40">
                {book.year}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
                {book.title}
              </h3>
            </div>
            
            {book.originalTitle && (
              <div className="text-xs font-serif text-stone-500 dark:text-stone-400">
                {book.originalTitle} {book.kanjiScript && <span className="opacity-80">({book.kanjiScript})</span>}
              </div>
            )}

            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 pt-0.5">
              {book.author}
            </div>

            <div className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
              {book.lineage}
            </div>

            {/* Quote Teaser */}
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-[11px] font-serif italic text-stone-600 dark:text-stone-300 line-clamp-2">
              "{book.quote}"
            </div>
          </div>
        </div>

        {/* Key Contemplative Points */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            Key Teachings
          </div>
          <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-1">
            {book.keyTeachings.slice(0, 2).map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span className="line-clamp-1 text-[11px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
        {/* Read Online Button */}
        <button
          id={`zen-read-online-${book.id}`}
          onClick={() => onReadOnline(book)}
          className="flex-1 px-3.5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read Online</span>
        </button>

        {/* Scan & Download Button */}
        <button
          id={`zen-scan-download-${book.id}`}
          onClick={() => onTriggerScanAndDownload(book)}
          className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95"
          title="Scan for viruses & download threat-free copy"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Scan & Download</span>
        </button>
      </div>
    </div>
  );
};
