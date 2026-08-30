// ============================================================================
// 🌌 GREENIEVERSE - KAGGLE SUBMISSION EXPORTER MODAL
// Generates self-contained submission/main.py with one-click copy & download
// ============================================================================

import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, ShieldCheck, Terminal } from 'lucide-react';
import { KaggleSubmissionExporter } from '../../../engine/greenieverse/submission/kaggleExporter';

interface KaggleExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KaggleExporterModal: React.FC<KaggleExporterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const code = KaggleSubmissionExporter.generatePythonSubmission();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/x-python' });
    element.href = URL.createObjectURL(file);
    element.download = 'main.py';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-emerald-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <FileCode className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white font-mono">Export Kaggle Submission</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  submission/main.py
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Self-contained, deterministic Python agent compliant with official GreenieCulture rules
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

        {/* Badges / Compliance */}
        <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Network Access</span>
            </div>
            <div className="flex items-center space-x-1.5 text-cyan-400 font-mono">
              <Terminal className="w-4 h-4" />
              <span>Deterministic Time Complexity (O(1))</span>
            </div>
            <div className="flex items-center space-x-1.5 text-amber-400 font-mono">
              <span>Target Benchmark: 3043.5+</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <a
              href="/main.py"
              download="main.py"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold font-mono text-xs border border-emerald-500/30 transition shadow-sm"
              title="Download standalone main.py"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>.PY</span>
            </a>

            <a
              href="/submission.zip"
              download="submission.zip"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold font-mono text-xs transition shadow-md shadow-emerald-500/20"
              title="Download Kaggle-ready .zip archive with main.py at root"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.ZIP</span>
            </a>

            <a
              href="/submission.tar.gz"
              download="submission.tar.gz"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold font-mono text-xs border border-cyan-500/30 transition shadow-sm"
              title="Download .tar.gz archive with main.py at root"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>.GZ (.tar.gz)</span>
            </a>

            <a
              href="/submission.tar.xz"
              download="submission.tar.xz"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold font-mono text-xs border border-purple-500/30 transition shadow-sm"
              title="Download 7z/LZMA-compatible .tar.xz archive"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>.XZ / 7Z</span>
            </a>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950">
          <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto selection:bg-emerald-900 selection:text-white">
            {code}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Kaggle agricultural strategy environment entry point: <code className="text-emerald-400">def agent(obs): ...</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
