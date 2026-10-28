import React from 'react';
import { MemoryLanternItem } from '../types';
import { 
  X, 
  Flame, 
  Calendar, 
  Users, 
  Printer, 
  Copy, 
  Download,
  Mic,
  Tag
} from 'lucide-react';
import { MemoryLanternService } from '../services/memoryLanternService';

interface TributeReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: MemoryLanternItem | null;
}

export const TributeReaderModal: React.FC<TributeReaderModalProps> = ({
  isOpen,
  onClose,
  memory
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !memory) return null;

  const handleCopy = () => {
    const text = MemoryLanternService.exportShareableText(memory);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden my-8 print:border-none print:shadow-none print:bg-white print:text-slate-900">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/80 print:hidden">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Remembrance Reading Mode</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tribute Content */}
        <div className="p-8 sm:p-10 space-y-6 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* Header */}
          <div className="text-center space-y-2 border-b border-slate-800/80 pb-6 print:border-slate-300">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2 print:border-slate-400">
              <Flame className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-slate-100 print:text-slate-900">
              {memory.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 print:text-slate-600">
              {memory.dateOrPeriod && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
                  {memory.dateOrPeriod}
                </span>
              )}
              {memory.peopleRemembered && memory.peopleRemembered.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-rose-400/80" />
                  Remembering: {memory.peopleRemembered.join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Story Narrative */}
          <div className="prose prose-invert prose-slate max-w-none print:prose-neutral">
            <p className="text-sm sm:text-base leading-relaxed font-serif text-slate-200 whitespace-pre-line print:text-slate-800">
              {memory.story}
            </p>
          </div>

          {/* Meaningful Details */}
          {memory.meaningfulDetails && memory.meaningfulDetails.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-slate-800/80 print:border-slate-300">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-amber-400 print:text-slate-800">
                Cherished Traditions & Keepsakes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {memory.meaningfulDetails.map((detail, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 print:border-slate-200 print:bg-slate-50 space-y-1"
                  >
                    <span className="text-[10px] uppercase font-bold text-amber-400/90 print:text-slate-600">
                      {detail.type.replace('_', ' ')}: {detail.label}
                    </span>
                    <p className="text-xs text-slate-300 italic print:text-slate-700">
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audio Note Details */}
          {memory.audioNote?.recorded && (
            <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800/60 print:hidden flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400">
                <Mic className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-medium text-slate-200">Oral History Voice Recording Attached</div>
                <div className="text-slate-400">{memory.audioNote.durationSeconds} seconds • {memory.audioNote.transcriptSummary || 'Spoken memories recorded'}</div>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500 print:border-slate-300 print:text-slate-500">
            <div>Preserved with Memory Lantern — Stories That Stay</div>
            <div className="text-[10px] mt-0.5">Sanctuary of Intergenerational Remembrance</div>
          </div>

        </div>

      </div>
    </div>
  );
};
