'use client';

import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  Zap, 
  Clock, 
  Hash, 
  Layers 
} from 'lucide-react';
import { computeSha256 } from '@/lib/hashing';
import { VerificationResult } from '@/lib/types';

export default function VerifyProvenancePage() {
  const [artifactId, setArtifactId] = useState('drt-hedera-testnet-verification');
  const [testContent, setTestContent] = useState(
    `Dr. T Hedera Commons public provenance verification artifact.\n\nThis artifact contains no personal data,\nno patient information,\nno clinical record,\nand no confidential research information.\n\nPurpose:\nVerify end-to-end SHA-256 hashing,\nHedera Consensus Service anchoring,\nMirror Node retrieval,\nand cryptographic provenance verification\nfor the Dr. T platform.`
  );

  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    setResult(null);
    try {
      const res = await fetch('/api/provenance/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifactId: artifactId.trim(),
          content: testContent.trim()
        })
      });

      const data: VerificationResult = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSimulateTamper = () => {
    setTestContent(prev => prev + '\n[TAMPERED_BYTE_MODIFICATION_DETECTED]');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <FileCheck2 className="w-8 h-8 text-blue-400" />
          Mirror Node Cryptographic Verification
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Compare local artifact content against immutable Hedera Consensus Service topic records retrieved live from official Mirror Nodes.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Artifact Identifier to Audit</label>
          <input
            type="text"
            value={artifactId}
            onChange={e => setArtifactId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-hidden focus:border-blue-500"
            placeholder="e.g. drt-hedera-testnet-verification"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-400">Artifact Content to Verify</label>
            <button
              onClick={handleSimulateTamper}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition"
              title="Appends unexpected bytes to content to trigger integrity failure demonstration"
            >
              <Zap className="w-3.5 h-3.5" />
              Simulate Tampering
            </button>
          </div>
          <textarea
            rows={7}
            value={testContent}
            onChange={e => setTestContent(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white transition shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Querying Hedera Mirror Node...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Perform Independent Audit
            </>
          )}
        </button>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div 
          className={`rounded-2xl p-6 border transition-all ${
            result.status === 'VERIFIED'
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-red-950/20 border-red-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              {result.status === 'VERIFIED' ? (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className={`font-bold text-base ${result.status === 'VERIFIED' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.status === 'VERIFIED' ? 'VERIFIED: CRYPTOGRAPHIC INTEGRITY CONFIRMED' : 'INTEGRITY CHECK FAILED'}
                </h3>
                <p className="text-xs text-slate-400">{result.message}</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {new Date(result.verifiedAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Dual Hash Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block mb-1">Local Recomputed Digest:</span>
              <span className="text-slate-200 break-all select-all">{result.localHash}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Anchored On-Chain Digest (Mirror Node):</span>
              <span className={`break-all select-all ${result.hashesMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.anchoredHash || 'NONE'}
              </span>
            </div>
          </div>

          {/* On-Chain Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">HCS Topic</span>
              <span className="font-mono text-slate-300">{result.topicId || 'N/A'}</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">Consensus Timestamp</span>
              <span className="font-mono text-slate-300">{result.consensusTimestamp || 'N/A'}</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block">Mirror Node Status</span>
                <span className={`font-semibold ${result.mirrorNodeVerified ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {result.mirrorNodeVerified ? 'Verified' : 'Unavailable'}
                </span>
              </div>
              {result.hashscanUrl && (
                <a
                  href={result.hashscanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Open in Hashscan Explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
