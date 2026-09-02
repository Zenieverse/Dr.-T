import React, { useState } from 'react';
import { 
  Shield, 
  Link as LinkIcon, 
  Globe, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  RefreshCw,
  Eye,
  AlertOctagon,
  FileText
} from 'lucide-react';
import { SecurityState, NormalizedDocument } from '../../../types/readit';
import { QuarantineStorageManager } from '../../../engine/readit/storage/quarantineStorage';
import { UrlSecurityValidator, READIT_PRESET_URLS, PresetUrlItem } from '../../../engine/readit/security/urlSecurityEngine';

interface UrlReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentReady: (doc: NormalizedDocument) => void;
  initialUrl?: string;
}

export const UrlReaderModal: React.FC<UrlReaderModalProps> = ({
  isOpen,
  onClose,
  onDocumentReady,
  initialUrl = '',
}) => {
  const [urlInput, setUrlInput] = useState<string>(initialUrl);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<SecurityState>('VALIDATING');
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [processedDoc, setProcessedDoc] = useState<NormalizedDocument | null>(null);

  if (!isOpen) return null;

  const handleFetchUrl = async (targetUrl: string) => {
    const cleanUrl = targetUrl.trim();
    if (!cleanUrl) return;

    setIsProcessing(true);
    setLogs([]);
    setProcessedDoc(null);
    setProgressPercent(10);
    setStatusMessage(`Validating remote URL structure...`);

    const addLog = (msg: string) => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    addLog(`Target URL: ${cleanUrl}`);
    addLog(`Initiating Step 1: Protocol whitelist & Hostname security checks...`);

    const storage = QuarantineStorageManager.getInstance();

    try {
      const doc = await storage.processUrlFetch(cleanUrl, (stage, percent, detail) => {
        setCurrentStage(stage);
        setProgressPercent(percent);
        setStatusMessage(detail);
        addLog(`[${stage}] ${detail}`);
      });

      setProcessedDoc(doc);
      if (doc.securityStatus === 'READY') {
        addLog(`Document certified clean. Normalization complete.`);
      } else {
        addLog(`Security Alert: Remote target isolated or blocked by fail-closed policy.`);
      }
    } catch (err: any) {
      setCurrentStage('FAILED');
      setStatusMessage(`Retrieval failed: ${err.message || 'Unknown error'}`);
      addLog(`ERROR: Network pipeline terminated prematurely.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectPreset = (preset: PresetUrlItem) => {
    setUrlInput(preset.url);
    handleFetchUrl(preset.url);
  };

  const handleConfirmOpen = () => {
    if (processedDoc && processedDoc.securityStatus === 'READY') {
      onDocumentReady(processedDoc);
      onClose();
    }
  };

  const resetState = () => {
    setIsProcessing(false);
    setProgressPercent(0);
    setLogs([]);
    setProcessedDoc(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Secure Remote URL Ingestion</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800/80 font-mono">
                  SSRF Shield Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Never trust the URL. Ingress traffic is strictly screened, isolated, and scanned.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* URL Input Form */}
          {!isProcessing && !processedDoc && (
            <div className="space-y-6">
              
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Document URL (PDF, DOCX, CSV, Image)
                </label>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/medical-guidelines.pdf"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && urlInput.trim()) {
                          handleFetchUrl(urlInput);
                        }
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 focus:border-teal-400 rounded-2xl text-sm text-white placeholder-slate-500 outline-hidden font-mono transition"
                    />
                  </div>

                  <button
                    onClick={() => handleFetchUrl(urlInput)}
                    disabled={!urlInput.trim()}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-md disabled:opacity-40 transition flex items-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>Read from URL</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Paste a link to a PDF or supported document. ReadIt retrieves and checks the document before processing it.
                </p>
              </div>

              {/* Verified Sample Presets */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Or Try Verified Preset Links & Security Tests:
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">1-Click Test</span>
                </div>

                <div className="space-y-2">
                  {READIT_PRESET_URLS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between group ${
                        preset.isThreatSimulation
                          ? 'bg-amber-950/20 border-amber-900/40 hover:bg-amber-950/40 hover:border-amber-700/60'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 hover:border-teal-500/40'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold truncate ${preset.isThreatSimulation ? 'text-amber-400' : 'text-slate-200 group-hover:text-teal-300'}`}>
                            {preset.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 shrink-0 uppercase">
                            {preset.docType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {preset.description}
                        </p>
                      </div>

                      <button
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                          preset.isThreatSimulation
                            ? 'bg-amber-900/40 hover:bg-amber-800 text-amber-200'
                            : 'bg-teal-500/20 hover:bg-teal-500 hover:text-slate-950 text-teal-300'
                        }`}
                      >
                        Read this
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zero-Trust Architecture Notice */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="flex items-center space-x-2 text-teal-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Security Flow: USER URL ➔ SSRF FILTER ➔ QUARANTINE ➔ AI</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Target URLs never communicate directly with Gemini models. The document stream is fetched through an isolated network proxy, validated against private IP ranges, inspected for magic byte signatures, and scanned for malware before being parsed.
                </p>
              </div>

            </div>
          )}

          {/* Processing / Progress Stepper View */}
          {isProcessing && (
            <div className="space-y-6 py-4">
              
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 animate-pulse">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  Executing Zero-Trust Quarantine Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  {statusMessage}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Stage: {currentStage}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Live Security Audit Log Stream */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Live Security Gate Inspection Log:
                </span>
                <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 max-h-48 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Post-Process / Result Card */}
          {processedDoc && (
            <div className="space-y-6 py-2">
              
              {processedDoc.securityStatus === 'READY' ? (
                <div className="p-5 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-emerald-300">
                        Document Certified Clean & Ready
                      </h3>
                      <p className="text-xs text-slate-300 truncate font-semibold">
                        {processedDoc.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                        <span>Pages: {processedDoc.pageCount}</span>
                        <span>·</span>
                        <span>Size: {(processedDoc.fileSize / 1024).toFixed(1)} KB</span>
                        <span>·</span>
                        <span className="text-emerald-400 font-bold">SHA-256: {processedDoc.sha256.slice(0, 12)}...</span>
                      </div>
                    </div>
                  </div>

                  {processedDoc.medicalData?.isMedical && (
                    <div className="p-3 rounded-2xl bg-teal-950/60 border border-teal-800/80 flex items-center justify-between text-xs">
                      <span className="text-teal-300 font-medium">
                        🔬 Clinical Biomarkers Extracted: {processedDoc.medicalData.labResults.length} parameters
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-900 text-teal-200">
                        Medical Mode Enabled
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end space-x-3">
                    <button
                      onClick={resetState}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                    >
                      Read Another URL
                    </button>
                    <button
                      onClick={handleConfirmOpen}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs hover:from-teal-400 hover:to-emerald-400 shadow-md transition flex items-center space-x-1.5"
                    >
                      <span>Open in Dr. T Reader</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-3xl bg-rose-950/30 border border-rose-500/30 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-2xl bg-rose-500/20 text-rose-400">
                      <AlertOctagon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <h3 className="text-sm font-bold text-rose-300">
                        Security Threat / SSRF Policy Quarantine
                      </h3>
                      <p className="text-xs text-slate-300">
                        {processedDoc.securityScanResult.threatsFound[0] || 'Security violation tripped.'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Status: Fail-Closed Protection Active. AI model access blocked.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end space-x-3">
                    <button
                      onClick={resetState}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                    >
                      Try Different URL
                    </button>
                  </div>
                </div>
              )}

              {/* Log History */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Audit History:
                </span>
                <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1 max-h-36 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
