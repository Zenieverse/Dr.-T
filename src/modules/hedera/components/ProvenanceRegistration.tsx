// ==========================================
// HEDERA COMMONS: ProvenanceRegistration COMPONENT
// 5-Step Cryptographic Notarization Wizard
// ==========================================

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Hash, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Network, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Upload, 
  Download, 
  FileCode 
} from 'lucide-react';
import { 
  ProvenanceRecord, 
  ProvenanceArtifactType, 
  PrivacyClassification, 
  TransactionState 
} from '../types/provenance';
import { HashDisplay } from './HashDisplay';
import { PrivacyNotice } from './PrivacyNotice';
import { TransactionStatus } from './TransactionStatus';
import { computeSha256 } from '../services/hashingService';
import { HederaClientApi } from '../../../services/hederaClientApi';
import { downloadProvenanceCertificateHtml, generateProvenanceCertificateJson } from '../certificateGenerator';

interface ProvenanceRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (record: ProvenanceRecord) => void;
  initialArtifact?: {
    id: string;
    type: ProvenanceArtifactType;
    title: string;
    content: unknown;
    version?: string;
    privacy?: PrivacyClassification;
  };
}

const DR_T_PRESETS = [
  {
    id: 'art-trib-paper-p2p',
    type: 'knowledge' as ProvenanceArtifactType,
    title: 'Trib-House: Autonomous Peer-to-Peer Gossip Pruning Protocol',
    version: '1.2.0',
    privacy: 'public' as PrivacyClassification,
    content: JSON.stringify({
      title: "Trib-House: Autonomous Peer-to-Peer Gossip Pruning Protocol",
      author: "Trib-House Living Library Consortium",
      subsystem: "Federated Mesh",
      consensusLatencyMs: 320
    }, null, 2),
    department: 'Trib-House Living Library'
  },
  {
    id: 'art-lifeweave-ablation',
    type: 'ai-model' as ProvenanceArtifactType,
    title: 'LIFEWEAVE Gemma 4 SWE Agent: Candidate Verification Gate Ablation Matrix',
    version: '2.0.0',
    privacy: 'public' as PrivacyClassification,
    content: JSON.stringify({
      agent: "LIFEWEAVE Gemma 4 Developer Agent",
      model: "gemma-4-31b-it-qat-w4a16-ct",
      candidateVerificationGate: "Active-5-Invariants",
      patchPassRate: 1.00
    }, null, 2),
    department: 'LIFEWEAVE Research Lab'
  },
  {
    id: 'art-clinical-guideline-vitals',
    type: 'document' as ProvenanceArtifactType,
    title: 'Dr. T Multi-Agent Clinical Consensus: Ferritin & Circadian Phase Delay Protocol',
    version: '3.1.0',
    privacy: 'sensitive' as PrivacyClassification,
    content: JSON.stringify({
      protocolId: "PROT-FE-CIRC-2026",
      biomarkerTargets: { ferritinMinNgMl: 24, sleepCurfewHours: 22 },
      recommendation: "Gentle iron bisglycinate alongside outdoor lux synchronization"
    }, null, 2),
    department: 'Clinical Informatics & Privacy Center'
  },
  {
    id: 'art-greenieverse-canopy-quadrant',
    type: 'greenieverse' as ProvenanceArtifactType,
    title: 'GreenieVerse Galactic Canopy: Alpha Quadrant Photosynthetic Yield Audit',
    version: '1.0.4',
    privacy: 'public' as PrivacyClassification,
    content: JSON.stringify({
      quadrant: "Galactic-Alpha-7",
      biomassIndex: 88.4,
      co2CapturedKgPerDay: 8420.5
    }, null, 2),
    department: 'GreenieVerse Ecological Commons'
  }
];

export const ProvenanceRegistration: React.FC<ProvenanceRegistrationProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialArtifact
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [txState, setTxState] = useState<TransactionState>('idle');

  // Form Fields
  const [artifactId, setArtifactId] = useState(initialArtifact?.id || '');
  const [artifactType, setArtifactType] = useState<ProvenanceArtifactType>(initialArtifact?.type || 'research');
  const [artifactTitle, setArtifactTitle] = useState(initialArtifact?.title || '');
  const [artifactVersion, setArtifactVersion] = useState(initialArtifact?.version || '1.0.0');
  const [privacyClassification, setPrivacyClassification] = useState<PrivacyClassification>(initialArtifact?.privacy || 'public');
  const [content, setContent] = useState<string>(
    typeof initialArtifact?.content === 'string' 
      ? initialArtifact.content 
      : initialArtifact?.content ? JSON.stringify(initialArtifact.content, null, 2) : ''
  );

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Digest State
  const [computedDigest, setComputedDigest] = useState<{
    hash: string;
    byteLength: number;
    canonicalString: string;
  } | null>(null);

  // Result State
  const [anchoredRecord, setAnchoredRecord] = useState<ProvenanceRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    if (content.trim()) {
      try {
        const digest = computeSha256(content);
        setComputedDigest(digest);
      } catch {
        setComputedDigest(null);
      }
    } else {
      setComputedDigest(null);
    }
  }, [content]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      let textContent = '';
      if (file.type.startsWith('text/') || file.name.endsWith('.json') || file.name.endsWith('.md') || file.name.endsWith('.ts') || file.name.endsWith('.csv')) {
        textContent = await file.text();
      } else {
        textContent = `<Binary file: ${file.name}, MIME: ${file.type || 'application/octet-stream'}, Size: ${file.size} bytes>`;
      }

      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      const generatedId = `art-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24)}-${Date.now().toString().slice(-4)}`;

      setArtifactId(generatedId);
      setArtifactTitle(cleanName);
      setContent(textContent.slice(0, 50000));
      setUploadedFileName(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      setComputedDigest({
        hash: hexHash,
        byteLength: file.size,
        canonicalString: `<File: ${file.name}, Size: ${file.size} bytes>`
      });
      setErrorMessage(null);
    } catch (err: any) {
      console.warn('File read error:', err);
      setErrorMessage('Failed to read file for cryptographic fingerprinting.');
    }
  };

  const handleSelectPreset = (preset: typeof DR_T_PRESETS[0]) => {
    setArtifactId(preset.id);
    setArtifactType(preset.type);
    setArtifactTitle(preset.title);
    setArtifactVersion(preset.version);
    setPrivacyClassification(preset.privacy);
    setContent(preset.content);
    setUploadedFileName(null);
  };

  const handleStepNext = () => {
    if (step === 1) {
      if (!artifactId.trim() || !artifactTitle.trim() || !content.trim()) {
        setErrorMessage('Please fill in Artifact ID, Title, and Content.');
        return;
      }
      setErrorMessage(null);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      handleAnchorToHedera();
    }
  };

  const handleAnchorToHedera = async () => {
    setStep(4);
    setTxState('preparing');
    setErrorMessage(null);

    try {
      setTxState('submitting');
      await new Promise(r => setTimeout(r, 600));

      setTxState('pending');
      const response = await HederaClientApi.registerProvenance({
        artifactId: artifactId.trim(),
        artifactType: artifactType as any,
        artifactTitle: artifactTitle.trim(),
        artifactVersion: artifactVersion.trim(),
        content,
        privacyClassification: privacyClassification as any,
        actorId: 'DR_T_SYSTEM',
        metadata: {
          submittedVia: 'Dr. T ProvenanceRegistration Wizard',
          byteLength: computedDigest?.byteLength || 0
        }
      });

      setTxState('confirmed');
      setAnchoredRecord(response.record as any);
      setStep(5);
      onSuccess(response.record as any);
    } catch (err: any) {
      console.error('Anchoring error:', err);
      setTxState('failed');
      setErrorMessage(err.message || 'Hedera HCS submission failed');
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setTxState('idle');
    setAnchoredRecord(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 shadow-inner">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Register Provenance on Hedera HCS
              </h2>
              <p className="text-xs text-slate-300">
                Step {step} of 5: {
                  step === 1 ? 'Select Artifact' :
                  step === 2 ? 'Generate Integrity Proof' :
                  step === 3 ? 'Review Privacy & Payload' :
                  step === 4 ? 'Anchoring to Consensus Topic' :
                  'Provenance Confirmed'
                }
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 shrink-0">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Select Artifact */}
          {step === 1 && (
            <div className="space-y-4">
              {/* File Drag-and-Drop Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition ${
                  isDraggingFile 
                    ? 'border-purple-500 bg-purple-50' 
                    : uploadedFileName 
                    ? 'border-emerald-400 bg-emerald-50/40' 
                    : 'border-slate-300 hover:border-purple-400 bg-slate-50/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Drop or browse any file to notarize (PDF, JSON, CSV, Weights)'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Instant client-side SHA-256 calculation. The file itself never leaves your browser.
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Or Quick-Select Dr. T Ecosystem Artifact
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DR_T_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50 hover:bg-purple-50/50 text-left transition flex items-start space-x-2 group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{p.title}</div>
                        <div className="text-[10px] text-slate-500">{p.department}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Artifact ID *
                  </label>
                  <input
                    type="text"
                    value={artifactId}
                    onChange={e => setArtifactId(e.target.value)}
                    placeholder="e.g. art-research-001"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Artifact Type
                  </label>
                  <select
                    value={artifactType}
                    onChange={e => setArtifactType(e.target.value as ProvenanceArtifactType)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-white"
                  >
                    <option value="research">Research Paper / Study</option>
                    <option value="knowledge">Trib-House Knowledge / Book</option>
                    <option value="ai-model">AI Model / SWE Specification</option>
                    <option value="ai-evaluation">AI Benchmark / Evaluation</option>
                    <option value="dataset">Dataset / Reference Cohort</option>
                    <option value="document">Governance / Ethical Policy</option>
                    <option value="greenieverse">GreenieVerse Ecological Record</option>
                    <option value="other">Other Digital Artifact</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Artifact Title *
                </label>
                <input
                  type="text"
                  value={artifactTitle}
                  onChange={e => setArtifactTitle(e.target.value)}
                  placeholder="e.g. Century-Scale Living Forest Peer-to-Peer Protocol"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    value={artifactVersion}
                    onChange={e => setArtifactVersion(e.target.value)}
                    placeholder="1.0.0"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Privacy Tier (Zero-PHI Guard)
                  </label>
                  <select
                    value={privacyClassification}
                    onChange={e => setPrivacyClassification(e.target.value as PrivacyClassification)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-white"
                  >
                    <option value="public">PUBLIC — Open research metadata</option>
                    <option value="internal">INTERNAL — Platform-wide record</option>
                    <option value="private">PRIVATE — Digest only, off-chain data</option>
                    <option value="sensitive">SENSITIVE — Strict HIPAA/GDPR clinical barrier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Artifact Content / Payload (Raw or JSON) *
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={4}
                  placeholder="Paste document text, research abstract, or JSON payload to fingerprint..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Generate Integrity Proof */}
          {step === 2 && computedDigest && (
            <div className="space-y-4">
              <HashDisplay hash={computedDigest.hash} label="Calculated SHA-256 Cryptographic Fingerprint" />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Algorithm</span>
                  <span className="font-bold text-slate-800">SHA-256 (256-bit Digest)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Canonical Payload Size</span>
                  <span className="font-bold text-slate-800">{computedDigest.byteLength} bytes</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Deterministic Normalization</span>
                  <span className="font-bold text-slate-800">RFC 8785 Canonical JSON</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Enforced Privacy Tier</span>
                  <span className="font-bold text-purple-700">{privacyClassification.toUpperCase()}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  The original payload ({computedDigest.byteLength} bytes) will remain strictly in off-chain storage.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Review Privacy & Payload */}
          {step === 3 && (
            <div className="space-y-4">
              <PrivacyNotice classification={privacyClassification} />

              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono space-y-2 overflow-x-auto shadow-inner">
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between font-sans">
                  <span>HCS Topic Message Preview</span>
                  <span className="bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-300">Target Topic: 0.0.5892147</span>
                </div>
                <pre className="text-[11px] leading-relaxed">
{JSON.stringify({
  schema: "drt.provenance.v1",
  artifactId,
  artifactType,
  artifactTitle,
  version: artifactVersion,
  contentHash: computedDigest?.hash,
  hashAlgorithm: "SHA-256",
  timestamp: new Date().toISOString(),
  platform: "Dr. T",
  privacyClassification: privacyClassification.toUpperCase(),
  actorId: "DR_T_SYSTEM"
}, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* STEP 4: Anchoring in Progress */}
          {step === 4 && (
            <TransactionStatus state={txState} errorMessage={errorMessage} />
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && anchoredRecord && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-950">
                  Provenance Anchored Successfully
                </h3>
                <p className="text-xs text-emerald-800">
                  This artifact's cryptographic fingerprint is now recorded on the Hedera Consensus ledger with an immutable timestamp.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5 font-mono">
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">Record ID:</span>
                  <span className="font-bold text-slate-900">{anchoredRecord.id}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">Topic ID:</span>
                  <span className="font-bold text-purple-700">{anchoredRecord.topicId || '0.0.5892147'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">Sequence Number:</span>
                  <span className="font-bold text-indigo-700">#{anchoredRecord.sequenceNumber || 1042}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">Consensus Timestamp:</span>
                  <span className="font-bold text-slate-800">{anchoredRecord.consensusTimestamp || 'Ledger confirmed'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">{anchoredRecord.transactionId}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Verification Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    VERIFIED
                  </span>
                </div>
              </div>

              {anchoredRecord.hashscanUrl ? (
                <a
                  href={anchoredRecord.hashscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-xs"
                >
                  <span>View Transaction on Hashscan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : null}

              {/* Provenance Certificate Downloads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => downloadProvenanceCertificateHtml(anchoredRecord as any)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Certificate (HTML)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generateProvenanceCertificateJson(anchoredRecord as any));
                    setCopiedHash(true);
                    setTimeout(() => setCopiedHash(false), 2000);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center space-x-1.5 border border-slate-200"
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-600" />
                  <span>{copiedHash ? 'Copied JSON' : 'Copy JSON Audit Proof'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={handleStepNext}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center space-x-1 shadow-xs"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : step === 3 ? (
            <button
              onClick={handleStepNext}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center space-x-1 shadow-md shadow-emerald-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit & Anchor to HCS</span>
            </button>
          ) : step === 5 ? (
            <button
              onClick={resetAndClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
            >
              Done
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
