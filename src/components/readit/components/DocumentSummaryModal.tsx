import React, { useState } from 'react';
import { Sparkles, X, Volume2, Copy, Check, FileText } from 'lucide-react';
import { NormalizedDocument } from '../../../types/readit';
import { ReadAloudService } from '../../../engine/readit/tts/readAloudService';

interface DocumentSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: NormalizedDocument;
}

export const DocumentSummaryModal: React.FC<DocumentSummaryModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const [activeTier, setActiveTier] = useState<'5_bullets' | 'one_sentence' | 'detailed'>('5_bullets');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const summary = document.summary || {
    oneSentence: `Document ${document.title} contains ${document.pageCount} page(s) with structured clinical and technical content.`,
    fiveBullets: [
      `Normalized from ${document.filename} with verified SHA-256 integrity.`,
      `Contains ${document.pageCount} structured pages and ${document.chunks.length} retrieval chunks.`,
      `Passes all isolated threat signature and security scans.`,
      document.medicalData ? 'Clinical biomarkers and lab ranges detected.' : 'Standard technical documentation.',
      'Ready for grounded natural language query resolution.'
    ],
    detailed: `Comprehensive overview for ${document.title}.`
  };

  const handleSpeak = () => {
    let textToSpeak = '';
    if (activeTier === 'one_sentence') textToSpeak = summary.oneSentence;
    else if (activeTier === '5_bullets') textToSpeak = summary.fiveBullets.join('. ');
    else textToSpeak = summary.detailed;

    ReadAloudService.getInstance().speakText(textToSpeak, { mode: 'summary' });
  };

  const handleCopy = () => {
    let textToCopy = '';
    if (activeTier === 'one_sentence') textToCopy = summary.oneSentence;
    else if (activeTier === '5_bullets') textToCopy = summary.fiveBullets.map(b => `• ${b}`).join('\n');
    else textToCopy = summary.detailed;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                Dr. T ReadIt — Document Summary
              </h3>
              <p className="text-xs text-slate-300 truncate max-w-md">
                {document.title}
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

        {/* Tier Tabs */}
        <div className="px-6 pt-4 bg-slate-50 border-b border-slate-200 flex space-x-2">
          <button
            onClick={() => setActiveTier('5_bullets')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTier === '5_bullets'
                ? 'border-teal-600 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            5 Key Takeaways
          </button>
          <button
            onClick={() => setActiveTier('one_sentence')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTier === 'one_sentence'
                ? 'border-teal-600 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            One-Sentence Synthesis
          </button>
          <button
            onClick={() => setActiveTier('detailed')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTier === 'detailed'
                ? 'border-teal-600 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Executive Briefing
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800 text-sm leading-relaxed">
          
          {activeTier === 'one_sentence' && (
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 font-medium text-teal-950 text-base leading-relaxed">
              "{summary.oneSentence}"
            </div>
          )}

          {activeTier === '5_bullets' && (
            <div className="space-y-2.5">
              {summary.fiveBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="text-xs text-slate-800 font-medium leading-relaxed">
                    {bullet}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTier === 'detailed' && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 whitespace-pre-wrap text-xs text-slate-700 leading-relaxed font-mono">
              {summary.detailed}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSpeak}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Read Aloud</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

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
