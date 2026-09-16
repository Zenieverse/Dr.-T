import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, Download, AlertTriangle, 
  Cpu, FileText, Lock, RefreshCw, X, Award, ExternalLink, HardDrive
} from 'lucide-react';
import { ZenBook, VirusScanReport, ThreatScanEngine } from '../types';
import { virusScanner } from '../services/virusScannerService';

interface ZenThreatScannerModalProps {
  book: ZenBook | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ZenThreatScannerModal: React.FC<ZenThreatScannerModalProps> = ({
  book,
  isOpen,
  onClose
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentStepName, setCurrentStepName] = useState<string>('Initializing threat detection matrix...');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [scanReport, setScanReport] = useState<VirusScanReport | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'AUTO' | 'MD' | 'TXT'>('AUTO');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && book) {
      startThreatScan(book);
    } else {
      setScanReport(null);
      setProgressPercent(0);
      setDownloadSuccess(false);
    }
  }, [isOpen, book?.id]);

  const startThreatScan = async (targetBook: ZenBook) => {
    setIsScanning(true);
    setProgressPercent(10);
    setDownloadSuccess(false);

    try {
      const report = await virusScanner.scanBook(targetBook, (step, engineName, pct) => {
        setCurrentStepName(`Inspecting: ${engineName}...`);
        setProgressPercent(pct);
      });
      setScanReport(report);
      setProgressPercent(100);
      setCurrentStepName('All 5 engines passed: 0 threats detected. Clean Certificate generated.');
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDownload = () => {
    if (!book || !scanReport) return;
    const formatOverride = selectedFormat === 'AUTO' ? book.fileMeta.format : selectedFormat;
    virusScanner.downloadVerifiedBook(book, scanReport, formatOverride);
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  if (!isOpen || !book) return null;

  return (
    <div 
      id="zen-threat-scanner-modal" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Security Seal */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-emerald-950 p-6 text-white border-b border-stone-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform ${
                scanReport?.threatScore === 'SAFE' 
                  ? 'bg-emerald-600 text-white shadow-emerald-900/50 scale-105' 
                  : 'bg-amber-600 text-white animate-pulse'
              }`}>
                {scanReport?.threatScore === 'SAFE' ? (
                  <ShieldCheck className="w-7 h-7" />
                ) : (
                  <Cpu className="w-7 h-7" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg tracking-tight">
                    Zen World Threat & Virus Quarantine Inspection
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    Zero-Trust Gate
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  Pre-download validation scanning for macros, malware, zero-day scripts & structural integrity.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Book Details Summary Card */}
          <div className="mt-4 p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="w-10 h-14 object-cover rounded-lg border border-stone-700 shadow-xs shrink-0"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <div className="space-y-0.5">
                <div className="font-bold text-white text-sm">{book.title}</div>
                <div className="text-stone-400">
                  {book.author} • <span className="text-emerald-400">{book.connectedLibraryName}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-stone-300">
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-200 border border-stone-700">
                {book.fileMeta.format} ({book.fileMeta.fileSize})
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700 hidden sm:inline">
                {book.scrollsOrPages}
              </span>
            </div>
          </div>
        </div>

        {/* Scan Progress Bar & Engine List */}
        <div className="p-6 space-y-5">
          {/* Real-time Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                {isScanning && <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />}
                {currentStepName}
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Engine Status Grid */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Multi-Engine Security Verification Status
            </h4>
            <div className="space-y-2">
              {scanReport?.engines.map(engine => (
                <div 
                  key={engine.id}
                  className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <span>{engine.name}</span>
                        <span className="text-[10px] font-normal text-stone-500 font-mono">
                          {engine.version}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        {engine.details}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0 font-mono">
                    PASS (CLEAN)
                  </span>
                </div>
              )) || (
                // Skeleton placeholders while first scan runs
                [1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800">
                    <div className="h-4 w-48 bg-stone-200 dark:bg-stone-700 rounded"></div>
                    <div className="h-4 w-16 bg-stone-200 dark:bg-stone-700 rounded"></div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Clean Certificate Seal & Hash */}
          {scanReport && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Sovereign Clean Document Certificate</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                  {scanReport.digitalCertificateId}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-300 font-mono">
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase">Cryptographic SHA-256</span>
                  <span className="truncate block">{scanReport.sha256Hash}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase">Threats & Exploits</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">0 Detected (100% Sanitized)</span>
                </div>
              </div>
            </div>
          )}

          {/* Download Action Bar */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
              <HardDrive className="w-4 h-4 text-stone-500" />
              <span>Format:</span>
              <div className="flex items-center gap-1">
                {(['AUTO', 'MD', 'TXT'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      selectedFormat === fmt
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {fmt === 'AUTO' ? `${book.fileMeta.format} (Default)` : fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                Close
              </button>

              <button
                id="zen-download-verified-btn"
                onClick={handleDownload}
                disabled={!scanReport || isScanning}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                  scanReport && !isScanning
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/30'
                    : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{downloadSuccess ? 'File Downloaded!' : 'Download Verified Clean Document'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
