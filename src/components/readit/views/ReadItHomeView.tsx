import React, { useState, useRef } from 'react';
import { 
  Shield, 
  Upload, 
  FileText, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Stethoscope, 
  RefreshCw,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Link as LinkIcon,
  Globe,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { NormalizedDocument } from '../../../types/readit';
import { PRESET_DOCUMENTS } from '../../../data/readitPresetDocuments';
import { READIT_PRESET_URLS, PresetUrlItem } from '../../../engine/readit/security/urlSecurityEngine';

interface ReadItHomeViewProps {
  documents: NormalizedDocument[];
  onOpenDocument: (doc: NormalizedDocument) => void;
  onOpenUploadModal: () => void;
  onOpenUrlModal: (initialUrl?: string) => void;
  onOpenTestBench: () => void;
  onOpenAuditModal: (doc: NormalizedDocument) => void;
  onDeleteDocument: (id: string) => void;
  onResetPresets: () => void;
  onQuickUploadFile?: (file: File) => void;
  onQuickSubmitUrl?: (url: string) => void;
}

export const ReadItHomeView: React.FC<ReadItHomeViewProps> = ({
  documents,
  onOpenDocument,
  onOpenUploadModal,
  onOpenUrlModal,
  onOpenTestBench,
  onOpenAuditModal,
  onDeleteDocument,
  onResetPresets,
  onQuickUploadFile,
  onQuickSubmitUrl,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'MEDICAL' | 'GENERAL' | 'QUARANTINED'>('ALL');
  const [urlInputValue, setUrlInputValue] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const homeFileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = documents.filter((doc) => {
    if (filterType === 'MEDICAL') return doc.medicalData?.isMedical;
    if (filterType === 'GENERAL') return !doc.medicalData?.isMedical && doc.securityStatus === 'READY';
    if (filterType === 'QUARANTINED') return doc.securityStatus !== 'READY';
    return true;
  });

  const handleUrlSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = urlInputValue.trim();
    if (!cleanUrl) return;
    if (onQuickSubmitUrl) {
      onQuickSubmitUrl(cleanUrl);
    } else {
      onOpenUrlModal(cleanUrl);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (onQuickUploadFile) {
        onQuickUploadFile(file);
      } else {
        onOpenUploadModal();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (onQuickUploadFile) {
        onQuickUploadFile(file);
      } else {
        onOpenUploadModal();
      }
    }
  };

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Hidden File Input for Native File Dialog */}
      <input
        type="file"
        ref={homeFileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx,.xlsx,.pptx,.txt,.csv,.png,.jpg,.jpeg,.webp,.tiff"
      />

      {/* ==================================================================== */}
      {/* 1. HERO & SECURITY STATEMENT */}
      {/* ==================================================================== */}
      <div className="text-center space-y-3 py-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Zero-Trust Universal Document Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
          Dr. T ReadIt
        </h1>

        <p className="text-lg sm:text-xl font-medium text-teal-300/90">
          Securely read, understand &amp; discuss documents
        </p>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Upload a file or paste a public document URL. Every document is isolated in memory, verified with magic byte checks, scanned for threats, and grounded with page-level citations.
        </p>
      </div>

      {/* ==================================================================== */}
      {/* 2. DUAL-INPUT GATEWAY: UPLOAD A FILE  OR  PASTE DOCUMENT URL */}
      {/* ==================================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* OPTION 1: 📄 UPLOAD A DOCUMENT */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
            onDrop={handleFileDrop}
            onClick={() => homeFileInputRef.current?.click()}
            className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-200 group ${
              isDragOver 
                ? 'border-teal-400 bg-teal-950/30 scale-[1.01]' 
                : 'border-slate-700 bg-slate-950/70 hover:border-teal-500/50 hover:bg-slate-950'
            }`}
          >
            <div className="space-y-4 my-auto">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-slate-950 transition duration-200">
                <Upload className="w-6 h-6 stroke-[2.2]" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
                  <span>📄 Upload a document</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1.5">
                  Drop a file here or <span className="text-teal-400 underline font-semibold">Choose File</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400 pt-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">PDF</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">DOCX</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">XLSX</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">CSV</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">IMAGES</span>
              </div>
            </div>

            <div className="pt-4 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>Isolated in Memory Quarantine Sandbox</span>
            </div>
          </div>

          {/* OPTION 2: 🔗 PASTE DOCUMENT URL */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-700 bg-slate-950/70 flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🔗 Paste document URL</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Paste a link to a PDF or supported document. ReadIt retrieves and checks the document before processing it.
                  </p>
                </div>
              </div>

              {/* URL Input Form */}
              <form onSubmit={handleUrlSubmit} className="space-y-3 pt-2">
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={urlInputValue}
                    onChange={(e) => setUrlInputValue(e.target.value)}
                    placeholder="https://example.com/research-paper.pdf"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-hidden font-mono transition"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SSRF &amp; Metadata Filter Active</span>
                  </span>

                  <button
                    type="submit"
                    disabled={!urlInputValue.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md disabled:opacity-40 transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
                  >
                    <span>Read from URL</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Test URL Pills */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Quick Test URLs:</span>
                <span className="text-teal-400 font-mono">1-Click Try</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {READIT_PRESET_URLS.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setUrlInputValue(item.url);
                      if (onQuickSubmitUrl) onQuickSubmitUrl(item.url);
                      else onOpenUrlModal(item.url);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-800 transition font-mono truncate max-w-full text-left"
                    title={item.url}
                  >
                    {item.title.split(':')[0]} ({item.docType.toUpperCase()})
                  </button>
                ))}
                <button
                  onClick={() => {
                    const ssrfTest = READIT_PRESET_URLS.find(u => u.isThreatSimulation);
                    if (ssrfTest) {
                      setUrlInputValue(ssrfTest.url);
                      if (onQuickSubmitUrl) onQuickSubmitUrl(ssrfTest.url);
                      else onOpenUrlModal(ssrfTest.url);
                    }
                  }}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 transition font-mono"
                  title="Simulate SSRF Attack to verify deflection"
                >
                  🛡️ SSRF Attack Test
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Security & Pipeline Banner */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3 text-slate-400">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
            <div className="leading-relaxed">
              <span className="font-bold text-slate-200">Enforced Security Ingress Pipeline: </span>
              <span className="font-mono text-[11px] text-teal-300">
                USER URL ➔ URL VALIDATION ➔ SSRF PROTECTION ➔ SAFE NETWORK FETCH ➔ QUARANTINE BUFFER ➔ AI
              </span>
            </div>
          </div>

          <button
            onClick={onOpenTestBench}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition shrink-0"
          >
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>Run Security Suite</span>
          </button>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* 3. PRESET CLINICAL & SECURITY DEMONSTRATIONS */}
      {/* ==================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base text-white">Preset Clinical &amp; Security Demonstrations</h3>
          </div>
          <span className="text-xs text-slate-400">Click to inspect in Dr. T Reader</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_DOCUMENTS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onOpenDocument(preset)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                preset.securityStatus === 'READY'
                  ? 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-teal-500/50 shadow-md'
                  : 'bg-rose-950/20 hover:bg-rose-950/40 border-rose-900/50 hover:border-rose-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    preset.securityStatus === 'READY'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {preset.securityStatus === 'READY' ? 'Certified Safe' : 'Quarantined Threat'}
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    {preset.pageCount} Pages
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {preset.summary?.oneSentence || preset.originalName}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  {preset.medicalData ? 'Clinical Lab Report' : preset.securityStatus !== 'READY' ? 'Malware Test Signature' : 'General Document'}
                </span>
                <span className="flex items-center gap-1 text-teal-400 group-hover:translate-x-0.5 transition font-bold text-xs">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. USER DOCUMENT CATALOG & AUDIT LOGS */}
      {/* ==================================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base text-white">Document Catalog ({filteredDocs.length})</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  filterType === 'ALL' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({documents.length})
              </button>
              <button
                onClick={() => setFilterType('MEDICAL')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  filterType === 'MEDICAL' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Medical
              </button>
              <button
                onClick={() => setFilterType('GENERAL')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  filterType === 'GENERAL' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setFilterType('QUARANTINED')}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  filterType === 'QUARANTINED' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Quarantined
              </button>
            </div>

            <button
              onClick={onResetPresets}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs border border-slate-800"
              title="Reset preset documents"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Grid */}
        {filteredDocs.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-slate-800 text-center space-y-3 bg-slate-950/40">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">No documents found matching this filter</p>
            <p className="text-xs text-slate-400">Upload a file or paste a document URL above to add new records</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      doc.securityStatus === 'READY'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {doc.securityStatus === 'READY' ? 'Verified Safe' : 'Quarantined'}
                    </span>

                    <div className="flex items-center space-x-1">
                      {doc.sourceType === 'URL' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-950/80 text-teal-300 border border-teal-800/60 font-mono">
                          URL Source
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-400">
                        {doc.pageCount} pgs
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition line-clamp-1">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {doc.sourceUrl ? `URL: ${doc.sourceUrl}` : doc.summary?.oneSentence || doc.filename}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onOpenAuditModal(doc)}
                    className="text-xs font-mono text-slate-400 hover:text-teal-300 transition flex items-center gap-1"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Audit Log</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                      title="Cryptographic Purge Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onOpenDocument(doc)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center space-x-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
