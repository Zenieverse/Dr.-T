import React, { useState, useRef } from 'react';
import {
  FolderArchive,
  Upload,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  X,
  Terminal,
  HelpCircle,
} from 'lucide-react';
import { DiscoveredArtifact, ArtifactStatus, ArtifactValidationReport } from './artifactTypes';
import { downloadZenithPdfClientSide, downloadZenithZipClientSide } from './submissionFiles';

interface ArtifactManagerViewProps {
  artifacts: DiscoveredArtifact[];
  validationReport: ArtifactValidationReport | null;
  isLoading: boolean;
  onRefresh: () => void;
  onArtifactUploaded: () => void;
  onArtifactDeleted: () => void;
}

export const ArtifactManagerView: React.FC<ArtifactManagerViewProps> = ({
  artifacts,
  validationReport,
  isLoading,
  onRefresh,
  onArtifactUploaded,
  onArtifactDeleted,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ArtifactStatus>('ALL');
  const [previewArtifact, setPreviewArtifact] = useState<DiscoveredArtifact | null>(null);
  const [deleteConfirmArtifact, setDeleteConfirmArtifact] = useState<DiscoveredArtifact | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered artifacts
  const filteredArtifacts = artifacts.filter((art) => {
    const matchesSearch =
      art.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.machineIdentity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.fileType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.integrityHash.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || art.validationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const verifiedCount = artifacts.filter((a) => a.validationStatus === 'VERIFIED').length;
  const missingCount = artifacts.filter((a) => a.validationStatus === 'MISSING').length;
  const totalBytes = artifacts
    .filter((a) => a.validationStatus !== 'MISSING')
    .reduce((acc, cur) => acc + cur.fileSizeBytes, 0);

  const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);
  const isWithinLimit = totalBytes <= 100 * 1024 * 1024;

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(null);
      try {
        const res = await fetch('/api/buildarena/artifacts/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentBase64: base64,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setUploadSuccess(data.message || `Artifact ${file.name} uploaded successfully.`);
          onArtifactUploaded();
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          setUploadError(data.error || 'Upload failed');
        }
      } catch (err: any) {
        setUploadError(err?.message || 'Network upload error');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirmArtifact) return;
    try {
      const res = await fetch(
        `/api/buildarena/artifacts/${encodeURIComponent(deleteConfirmArtifact.filename)}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (data.success) {
        setDeleteConfirmArtifact(null);
        onArtifactDeleted();
      } else {
        alert(data.error || 'Failed to delete artifact');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDownload = (art: DiscoveredArtifact) => {
    if (art.filename === 'Zenith-01_Submission_Writeup.pdf') {
      downloadZenithPdfClientSide();
      return;
    }
    if (art.filename === 'zenith01_kaggle_submission.zip') {
      downloadZenithZipClientSide();
      return;
    }
    if (art.contentPreview) {
      const blob = new Blob([art.contentPreview], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = art.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      window.location.href = `/submission/${encodeURIComponent(art.filename)}`;
    }
  };

  const renderStatusBadge = (status: ArtifactStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>VERIFIED</span>
          </span>
        );
      case 'PRESENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <span>PRESENT</span>
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>MISSING</span>
          </span>
        );
      case 'INVALID':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>INVALID</span>
          </span>
        );
      case 'NEEDS USER ACTION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <span>ACTION REQUIRED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <span>NOT VERIFIED</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Metrics */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <FolderArchive className="w-4 h-4" />
              <span>OFFICIAL COMPETITION ARTIFACT DISCOVERY & VALIDATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              BuildArena S02 Artifact Manager
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Inspect, validate, hash (SHA-256), and preview genuine simulation records. Missing files are explicitly flagged with desktop export steps.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700 disabled:opacity-50"
              title="Re-scan workspace for files"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Re-Scan Workspace</span>
            </button>
            <label className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Desktop File</span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".bsg,.json,.csv,.py,.md,.txt,.png,.jpg"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {/* Upload feedback */}
        {uploadError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
        {uploadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Top Quantitative Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase text-slate-400">Verified Evidence</div>
            <div className="text-xl font-bold text-emerald-400 tabular-nums">
              {verifiedCount} <span className="text-xs text-slate-500 font-normal">/ {artifacts.length}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Integrity SHA-256 Passed</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase text-slate-400">Missing Evidence</div>
            <div className={`text-xl font-bold tabular-nums ${missingCount === 0 ? 'text-slate-400' : 'text-amber-400'}`}>
              {missingCount} <span className="text-xs text-slate-500 font-normal">files</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {missingCount === 0 ? 'Full Evidence Set' : 'Desktop Export Needed'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase text-slate-400">Total Artifact Size</div>
            <div className="text-xl font-bold text-cyan-400 tabular-nums">
              {totalMb} <span className="text-xs text-slate-500 font-normal">MB</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {(totalBytes / 1024).toFixed(1)} KB unpacked
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] uppercase text-slate-400">Kaggle 100MB Quota</div>
            <div className={`text-xl font-bold tabular-nums ${isWithinLimit ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isWithinLimit ? '< 0.1%' : 'EXCEEDED'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Direct Writeup Compliant</div>
          </div>
        </div>

        {/* Missing Evidence Callout if any */}
        {missingCount > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Missing Evidence Action Plan</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
              Some optional or secondary competition evidence files were not discovered in the local project workspace.
              To export them from your official Windows Besiege simulation environment:
            </p>
            <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/20 font-mono text-[11px] text-slate-300 space-y-1">
              <div># In Windows PowerShell / Command Prompt with BuildArena 2.0 active:</div>
              <div className="text-cyan-400">python -m buildarena.export --machine Zenith-01 --out submission/</div>
              <div className="text-cyan-400">python -m buildarena.export --full-trace build_history_full.json</div>
              <div className="text-cyan-400">python -m buildarena.telemetry --save trajectory.csv</div>
            </div>
          </div>
        )}

        {/* 2. Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by filename, machine, type, or SHA-256 hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] text-slate-500 font-mono uppercase mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            {(['ALL', 'VERIFIED', 'PRESENT', 'MISSING', 'INVALID'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition ${
                  statusFilter === st
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Discovered Artifacts Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Filename</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Validation Status</th>
                <th className="py-2.5 px-3">SHA-256 Hash</th>
                <th className="py-2.5 px-3">Provenance</th>
                <th className="py-2.5 px-3">Final Run</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredArtifacts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No artifacts matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredArtifacts.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        {art.fileType === 'BSG' ? (
                          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                        ) : art.fileType === 'CSV' ? (
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                        ) : art.fileType === 'PYTHON' ? (
                          <FileCode className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span>{art.filename}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {art.fileType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 tabular-nums">
                      {art.validationStatus === 'MISSING'
                        ? '—'
                        : art.fileSizeBytes >= 1024
                        ? `${(art.fileSizeBytes / 1024).toFixed(1)} KB`
                        : `${art.fileSizeBytes} B`}
                    </td>
                    <td className="py-2.5 px-3">{renderStatusBadge(art.validationStatus)}</td>
                    <td className="py-2.5 px-3">
                      {art.integrityHash ? (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                          <span>{art.integrityHash.slice(0, 10)}...</span>
                          <button
                            onClick={() => handleCopyHash(art.integrityHash)}
                            className="p-1 hover:text-cyan-400 transition"
                            title="Copy full SHA-256 hash"
                          >
                            {copiedHash === art.integrityHash ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600">None</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400">
                      <span className="truncate max-w-[140px] block" title={art.sourceLocation}>
                        {art.sourceLocation}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {art.isFinalRunArtifact ? (
                        <span className="text-[10px] text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                          Final Run
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">History</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {art.validationStatus !== 'MISSING' && (
                          <>
                            <button
                              onClick={() => setPreviewArtifact(art)}
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                              title="Preview contents"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDownload(art)}
                              className="p-1.5 rounded hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition"
                              title="Download artifact"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmArtifact(art)}
                              className="p-1.5 rounded hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition"
                              title="Remove artifact"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {art.validationStatus === 'MISSING' && (
                          <button
                            onClick={() => setPreviewArtifact(art)}
                            className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition flex items-center gap-1"
                          >
                            <HelpCircle className="w-3 h-3" />
                            <span>Export Guide</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Artifact Content Preview Drawer / Modal */}
      {previewArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono">{previewArtifact.filename}</h3>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {previewArtifact.fileType}
                </span>
                {renderStatusBadge(previewArtifact.validationStatus)}
              </div>
              <button
                onClick={() => setPreviewArtifact(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 font-mono text-xs text-slate-300">
              {/* Validation Details */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-[10px] uppercase text-slate-500 font-bold">Validation Audit Details:</div>
                {previewArtifact.validationDetails.map((det, idx) => (
                  <div key={idx} className="text-slate-300 flex items-start gap-1.5">
                    <span className="text-cyan-400">›</span>
                    <span>{det}</span>
                  </div>
                ))}
              </div>

              {previewArtifact.integrityHash && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-500 uppercase block">SHA-256 Checksum:</span>
                    <span className="text-xs text-slate-300 font-mono select-all">
                      {previewArtifact.integrityHash}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyHash(previewArtifact.integrityHash)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition shrink-0"
                  >
                    Copy Hash
                  </button>
                </div>
              )}

              {/* Content Preview if Present */}
              {previewArtifact.contentPreview && (
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase text-slate-500 font-bold">Content Preview:</div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-[11px] leading-relaxed text-slate-200 max-h-80 scrollbar-thin">
                    {previewArtifact.contentPreview}
                  </pre>
                </div>
              )}

              {/* Export instructions if missing */}
              {previewArtifact.validationStatus === 'MISSING' && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="font-bold text-amber-400 text-xs">How to Export from BuildArena 2.0:</div>
                  <p className="text-xs text-amber-200/90 font-sans leading-relaxed">
                    {previewArtifact.exportInstructions}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 font-mono">
                Location: {previewArtifact.sourceLocation}
              </div>
              <div className="flex items-center gap-2">
                {previewArtifact.validationStatus !== 'MISSING' && (
                  <button
                    onClick={() => handleDownload(previewArtifact)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                )}
                <button
                  onClick={() => setPreviewArtifact(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {deleteConfirmArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Confirm Artifact Deletion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Are you sure you want to remove <span className="font-mono text-cyan-400 font-bold">{deleteConfirmArtifact.filename}</span>?
              This action cannot be undone. You will need to re-import the file if needed for competition submission.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmArtifact(null)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Artifact</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
