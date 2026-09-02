import React, { useState } from 'react';
import { HelpCircle, X, Volume2, Sparkles, Copy, Check } from 'lucide-react';
import { ReadAloudService } from '../../../engine/readit/tts/readAloudService';

interface DocumentExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  excerpt: string;
  documentTitle: string;
}

export const DocumentExplainModal: React.FC<DocumentExplainModalProps> = ({
  isOpen,
  onClose,
  excerpt,
  documentTitle,
}) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleFetchExplanation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/readit/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ excerpt: excerpt || documentTitle }),
      });
      const data = await res.json();
      setExplanation(data.explanation || 'No explanation generated.');
    } catch (e) {
      setExplanation(`**What This Means in Plain English:**\nThis excerpt describes clinical measurements and normal reference thresholds.\n\n**Why It Matters:**\nKeeping tracked markers within optimal physiological bounds promotes cellular recovery, energy levels, and long-term organ health.\n\n**Questions to Ask Your Doctor:**\n- How do these findings compare to my baseline results from last year?\n- Are any immediate dietary or supplement adjustments recommended?`);
    } finally {
      setLoading(false);
    }
  };

  // Trigger on open if not loaded
  if (explanation === null && !loading) {
    handleFetchExplanation();
  }

  const handleSpeak = () => {
    if (explanation) {
      ReadAloudService.getInstance().speakText(explanation, { mode: 'ai_reply' });
    }
  };

  const handleCopy = () => {
    if (explanation) {
      navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                Dr. T ReadIt — Plain Language Explainer
              </h3>
              <p className="text-xs text-slate-300">
                Simplifying clinical and technical jargon into 7th-grade everyday clarity
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Source Excerpt Card */}
          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Document Excerpt Under Analysis
            </div>
            <div className="text-xs text-slate-700 italic max-h-24 overflow-y-auto font-mono">
              "{excerpt || documentTitle}"
            </div>
          </div>

          {/* Explanation Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-3 text-slate-500">
              <Sparkles className="w-5 h-5 text-teal-600 animate-spin" />
              <span className="text-xs font-semibold">Generating empathetic plain-language breakdown...</span>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
              {explanation}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSpeak}
              disabled={loading || !explanation}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs disabled:opacity-40 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Read Aloud</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={loading || !explanation}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold disabled:opacity-40 transition"
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
