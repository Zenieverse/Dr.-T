import React, { useState, useRef } from 'react';
import { 
  Shield, 
  Upload, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  ArrowRight, 
  Lock, 
  Globe, 
  Link as LinkIcon, 
  AlertOctagon, 
  ShieldCheck,
  RefreshCw 
} from 'lucide-react';
import { SecurityState, NormalizedDocument } from '../../../types/readit';
import { QuarantineStorageManager } from '../../../engine/readit/storage/quarantineStorage';
import { READIT_PRESET_URLS, PresetUrlItem } from '../../../engine/readit/security/urlSecurityEngine';

interface UploadQuarantineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentReady: (doc: NormalizedDocument) => void;
  defaultMode?: 'UPLOAD' | 'URL';
}

export const UploadQuarantineModal: React.FC<UploadQuarantineModalProps> = ({
  isOpen,
  onClose,
  onDocumentReady,
  defaultMode = 'UPLOAD',
}) => {
  const [activeTab, setActiveTab] = useState<'UPLOAD' | 'URL'>(defaultMode);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<SecurityState>('UPLOADING');
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [processedDoc, setProcessedDoc] = useState<NormalizedDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setLogs([]);
    setProcessedDoc(null);
    setProgressPercent(10);
    setStatusMessage(`Initiating secure upload for ${file.name}...`);

    addLog(`File received: ${file.name} (${(file.size / 1024).toFixed(1)} KB, MIME: ${file.type || 'unknown'})`);
    addLog(`Quarantine buffer initialized. Allocating memory isolation sandbox...`);

    const storage = QuarantineStorageManager.getInstance();
    
    try {
      const doc = await storage.processUpload(file, (stage, percent, detail) => {
        setCurrentStage(stage);
        setProgressPercent(percent);
        setStatusMessage(detail);
        addLog(`[${stage}] ${detail}`);
      });

      setProcessedDoc(doc);
      if (doc.securityStatus === 'READY') {
        addLog(`Document certified clean. Normalization complete.`);
      } else {
        addLog(`Security Alert: Content blocked by fail-closed policy.`);
      }
    } catch (err: any) {
      setCurrentStage('FAILED');
      setStatusMessage(`Upload failed: ${err.message || 'Unknown error'}`);
      addLog(`ERROR: Processing pipeline terminated prematurely.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlFetch = async (targetUrl: string) => {
    const cleanUrl = targetUrl.trim();
    if (!cleanUrl) return;

    setIsProcessing(true);
    setLogs([]);
    setProcessedDoc(null);
    setProgressPercent(10);
    setStatusMessage(`Validating remote URL structure...`);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                Dr. T ReadIt — Secure Ingress Gateway
              </h3>
              <p className="text-xs text-slate-400">
                Principle: No untrusted file or URL goes directly to AI models
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

        {/* Ingress Mode Switcher (File vs URL) */}
        {!isProcessing && !processedDoc && (
          <div className="px-6 pt-4 pb-0 bg-slate-900/50 flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab('UPLOAD')}
              className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
                activeTab === 'UPLOAD'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>📄 Upload a Document</span>
            </button>

            <button
              onClick={() => setActiveTab('URL')}
              className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition ${
                activeTab === 'URL'
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>🔗 Paste Document URL</span>
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {!isProcessing && !processedDoc && activeTab === 'UPLOAD' && (
            <>
              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-teal-400 bg-teal-950/30 scale-[0.99]'
                    : 'border-slate-700 bg-slate-950/60 hover:border-teal-500 hover:bg-slate-950'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.xlsx,.pptx,.txt,.csv,.md,.jpg,.jpeg,.png,.webp,.tiff"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  Drag &amp; Drop your document here, or <span className="text-teal-400 underline">Browse</span>
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  Supports PDF (native &amp; scanned), DOCX, XLSX, PPTX, TXT, CSV, Markdown, and Medical Imaging (JPG, PNG). Max 50 MB.
                </p>

                {/* Security Badge Ribbon */}
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Isolated Sandbox · Magic Byte Inspection · Antivirus Scanned</span>
                </div>
              </div>

              {/* Supported Format Pills */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Supported Document Formats
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['PDF (Native/OCR)', 'Word (.DOCX)', 'Excel (.XLSX/.CSV)', 'PowerPoint (.PPTX)', 'Plain Text (.TXT/.MD)', 'Scanned Images (.PNG/.JPG)'].map((fmt) => (
                    <span key={fmt} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 text-slate-300 border border-slate-800">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {!isProcessing && !processedDoc && activeTab === 'URL' && (
            <div className="space-y-5">
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
                          handleUrlFetch(urlInput);
                        }
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 focus:border-teal-400 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 outline-hidden font-mono transition"
                    />
                  </div>

                  <button
                    onClick={() => handleUrlFetch(urlInput)}
                    disabled={!urlInput.trim()}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md disabled:opacity-40 transition flex items-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>Read this</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Paste a link to a PDF or supported document. ReadIt retrieves and checks the document before processing it.
                </p>
              </div>

              {/* Presets List */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Or Test Preset Remote Documents:
                </span>
                <div className="space-y-1.5">
                  {READIT_PRESET_URLS.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setUrlInput(item.url);
                        handleUrlFetch(item.url);
                      }}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 flex items-center justify-between cursor-pointer group transition"
                    >
                      <div className="text-xs text-slate-300 font-medium truncate pr-2">
                        <span className="text-teal-400 font-mono text-[10px] uppercase mr-2 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {item.docType}
                        </span>
                        {item.title}
                      </div>
                      <span className="text-xs text-teal-400 group-hover:translate-x-0.5 transition font-bold shrink-0">
                        Read ➔
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Live Progress Stage */}
          {(isProcessing || processedDoc) && (
            <div className="space-y-4">
              
              {/* Progress Bar & Stage Header */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                  <span className="flex items-center gap-2">
                    {processedDoc?.securityStatus === 'READY' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : processedDoc?.securityStatus === 'THREAT_DETECTED' ? (
                      <AlertOctagon className="w-4 h-4 text-rose-400" />
                    ) : (
                      <span className="w-3 h-3 rounded-full bg-teal-400 animate-ping"></span>
                    )}
                    Stage: <span className="font-mono text-teal-300">{currentStage}</span>
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      processedDoc?.securityStatus === 'THREAT_DETECTED'
                        ? 'bg-rose-500'
                        : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <p className="mt-2 text-xs text-slate-400 font-medium">
                  {statusMessage}
                </p>
              </div>

              {/* Status Outcome Card */}
              {processedDoc && (
                <div className={`p-4 rounded-2xl border ${
                  processedDoc.securityStatus === 'READY'
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    {processedDoc.securityStatus === 'READY' ? (
                      <FileCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-sm mb-1 text-white">
                        {processedDoc.securityStatus === 'READY' ? 'Security Gate Clearance Approved' : 'Security Quarantine: File Blocked'}
                      </div>
                      <div className="space-y-1 text-slate-300">
                        <div><strong>Title:</strong> {processedDoc.title}</div>
                        <div><strong>SHA-256:</strong> <code className="font-mono text-[11px] bg-slate-900 px-1 py-0.5 rounded text-teal-300">{processedDoc.sha256.slice(0, 24)}...</code></div>
                        <div><strong>Scan Certification:</strong> {processedDoc.securityScanResult.certificationMessage}</div>
                        {processedDoc.securityScanResult.threatsFound.length > 0 && (
                          <div className="mt-2 p-2 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800/80">
                            <strong>Threats Flagged:</strong>
                            <ul className="list-disc pl-4 mt-1 space-y-0.5">
                              {processedDoc.securityScanResult.threatsFound.map((t, i) => (
                                <li key={i}>{t}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Diagnostic Terminal Logs */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Quarantine Diagnostic Stream</span>
                  <span className="text-[10px] text-teal-400 font-mono">FAIL-CLOSED ARCHITECTURE</span>
                </div>
                <div className="bg-slate-950 text-slate-200 rounded-xl p-3 font-mono text-[11px] h-36 overflow-y-auto space-y-1 shadow-inner border border-slate-800">
                  {logs.map((l, i) => (
                    <div key={i} className={l.includes('ERROR') || l.includes('Threat') || l.includes('Blocked') ? 'text-rose-400' : l.includes('certified') || l.includes('PASSED') || l.includes('clean') ? 'text-emerald-400' : 'text-slate-300'}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {processedDoc ? (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={resetState}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Ingest Another
              </button>
              {processedDoc.securityStatus === 'READY' ? (
                <button
                  onClick={handleConfirmOpen}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md transition transform hover:scale-[1.02]"
                >
                  <span>Open in Dr. T Reader</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition"
                >
                  Close &amp; Purge
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400">
                All data is encrypted in transit and isolated in temporary memory.
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
