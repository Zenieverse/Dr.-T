'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Lock, 
  Layers, 
  Cpu, 
  Hash, 
  Clock, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { computeSha256 } from '@/lib/hashing';
import { ProvenanceRecord, HederaStatus } from '@/lib/types';

export default function RegisterProvenancePage() {
  const [artifactId, setArtifactId] = useState('hpk-model-spec-01');
  const [artifactType, setArtifactType] = useState('research');
  const [artifactTitle, setArtifactTitle] = useState('Decentralized Scientific Verification Protocol');
  const [artifactVersion, setArtifactVersion] = useState('1.0.0');
  const [content, setContent] = useState(
    JSON.stringify(
      {
        specification: "Hedera Provenance Kit Core Engine",
        author: "Zenieverse Engineering",
        timestamp: "2026-10-02T00:00:00.000Z",
        guarantees: [
          "RFC 8785 Canonical JSON Serialization",
          "SHA-256 Cryptographic Digest",
          "Sub-2s Hedera Consensus Service Finality",
          "Independent Mirror Node Auditability"
        ]
      },
      null,
      2
    )
  );

  const [liveDigest, setLiveDigest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchoredRecord, setAnchoredRecord] = useState<ProvenanceRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<HederaStatus | null>(null);
  const [copied, setCopied] = useState(false);

  // Compute live digest on keystroke
  useEffect(() => {
    try {
      let parsed = content;
      try {
        parsed = JSON.parse(content);
      } catch {
        // Plain string content
      }
      const res = computeSha256(parsed);
      setLiveDigest(res.hash);
    } catch {
      setLiveDigest('');
    }
  }, [content]);

  // Fetch status
  useEffect(() => {
    fetch('/api/hedera/status')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(() => {});
  }, []);

  const handleAnchor = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      let parsedContent: any = content;
      try {
        parsedContent = JSON.parse(content);
      } catch {
        // Plain string
      }

      const res = await fetch('/api/provenance/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifactId: artifactId.trim(),
          artifactType,
          artifactTitle: artifactTitle.trim(),
          artifactVersion: artifactVersion.trim(),
          content: parsedContent
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to anchor provenance');
      }

      setAnchoredRecord(data.record);
    } catch (err: any) {
      setErrorMessage(err.message || 'HCS submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-8 border border-slate-800 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Hedera Consensus Service (HCS) Integration
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Anchor Cryptographic Provenance to Hedera
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Generate a deterministic RFC 8785 SHA-256 fingerprint from any artifact and anchor it to 
            Hedera Consensus Service with sub-2s finality and independent Mirror Node auditability.
          </p>

          {status && (
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
                Network: <strong className="text-white uppercase">{status.network}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
                Topic ID: <strong className="text-emerald-400">{status.topicId}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
                Mode: <strong className={status.isMock ? 'text-amber-400' : 'text-emerald-400'}>{status.mode}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Registration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Artifact Details */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            1. Artifact Definition
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Artifact Identifier</label>
              <input
                type="text"
                value={artifactId}
                onChange={e => setArtifactId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
                placeholder="e.g. art-spec-01"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Artifact Type</label>
              <select
                value={artifactType}
                onChange={e => setArtifactType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="research">Research / Paper</option>
                <option value="document">Document / Spec</option>
                <option value="ai-model">AI Model Weights / Manifest</option>
                <option value="ai-evaluation">AI Safety Benchmark</option>
                <option value="dataset">Dataset Manifest</option>
                <option value="code">Code / Patch</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
              <input
                type="text"
                value={artifactTitle}
                onChange={e => setArtifactTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Descriptive title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Version</label>
              <input
                type="text"
                value={artifactVersion}
                onChange={e => setArtifactVersion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-hidden focus:border-emerald-500"
                placeholder="1.0.0"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-400">Content / Data (Text or JSON)</label>
              <span className="text-[11px] text-slate-500 font-mono">{content.length} chars</span>
            </div>
            <textarea
              rows={8}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-hidden focus:border-emerald-500"
              placeholder="Paste content to fingerprint..."
            />
          </div>

          {/* Privacy Notice Card */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block">Zero-PHI Privacy Model Enforced:</strong>
              Raw document content remains strictly off-chain. Only the deterministic SHA-256 fingerprint, 
              artifact ID, version, and timestamp will be submitted to the Hedera Consensus Service.
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleAnchor}
            disabled={isSubmitting || !liveDigest}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Submitting to Hedera Consensus Service...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Anchor to Hedera Testnet
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Column: Cryptographic Preview & Receipt */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Fingerprint Card */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-400" />
              Deterministic SHA-256 Fingerprint
            </h3>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 break-all font-mono text-xs text-emerald-400 select-all">
              {liveDigest || 'Waiting for valid input...'}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Canonicalizer: RFC 8785 JSON</span>
              <button
                onClick={() => copyToClipboard(liveDigest)}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Hash'}
              </button>
            </div>
          </div>

          {/* Consensus Receipt (if anchored) */}
          {anchoredRecord && (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-6 border border-emerald-500/30 space-y-4 shadow-xl animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Consensus Confirmed
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Seq #{anchoredRecord.sequenceNumber}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Transaction ID:</span>
                  <span className="font-mono text-slate-200 select-all">{anchoredRecord.transactionId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Consensus Timestamp:</span>
                  <span className="font-mono text-slate-200">{anchoredRecord.consensusTimestamp}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">HCS Topic ID:</span>
                  <span className="font-mono text-emerald-400">{anchoredRecord.topicId}</span>
                </div>
              </div>

              {anchoredRecord.hashscanUrl && (
                <a
                  href={anchoredRecord.hashscanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition flex items-center justify-center gap-1.5"
                >
                  View on Hashscan Explorer
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
