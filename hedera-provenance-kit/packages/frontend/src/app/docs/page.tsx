import React from 'react';
import { BookOpen, ShieldCheck, Lock, Layers, Cpu, ExternalLink } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 text-slate-200">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-purple-400" />
          Hedera Provenance Kit Documentation
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Complete developer reference for cryptographic provenance, HCS anchoring, and Mirror Node audits.
        </p>
      </div>

      {/* Architecture */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          1. Cryptographic Pipeline Architecture
        </h2>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
          <pre>{`Application Artifact
       │
       ▼
RFC 8785 Deterministic Canonicalization
       │
       ▼
SHA-256 Digest Computation (256-bit Hex)
       │
       ▼
Compact Provenance Payload (hpk.provenance.v1)
       │
       ▼
Hedera Consensus Service (HCS TopicMessageSubmitTransaction)
       │
       ▼
Decentralized Consensus Timestamp & Topic Sequence #
       │
       ▼
Independent Mirror Node Audit (REST API verification)`}</pre>
        </div>
      </section>

      {/* Privacy Model */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          2. Privacy Model: On-Chain vs. Off-Chain
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm">ON-CHAIN (Hedera HCS)</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Deterministic SHA-256 Content Digest</li>
              <li>Schema identifier (<code>hpk.provenance.v1</code>)</li>
              <li>Public artifact identifier & version</li>
              <li>Consensus timestamp & sequence number</li>
              <li>Payer account identifier</li>
            </ul>
          </div>
          <div className="p-5 bg-blue-950/20 border border-blue-500/30 rounded-xl space-y-2">
            <h3 className="font-bold text-blue-400 text-sm">OFF-CHAIN (Confidential Storage)</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Raw document text & uploaded files</li>
              <li>Patient health information (PHI / HIPAA)</li>
              <li>Personally identifiable data (PII / GDPR)</li>
              <li>Proprietary model weights & source code</li>
              <li>Private keys and API credentials</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Schema */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          3. Provenance Schema: hpk.provenance.v1
        </h2>
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          <pre>{`{
  "schema": "hpk.provenance.v1",
  "artifactId": "art-model-v2",
  "artifactType": "ai-model",
  "artifactTitle": "Autonomous Reasoning Model Specification",
  "version": "2.1.0",
  "hashAlgorithm": "SHA-256",
  "contentHash": "ca7c77d8e0aab26f85254783d3659484200514c59c78f3fbc59b582874a98f54",
  "timestamp": "2026-10-02T02:42:49.562Z",
  "privacy": "public-provenance",
  "source": "Hedera Provenance Kit"
}`}</pre>
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          4. REST API Endpoints
        </h2>
        <div className="space-y-3 text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">POST</span>
              <span className="text-white font-semibold">/api/provenance/register</span>
            </div>
            <p className="text-slate-400 pt-1">
              Computes RFC 8785 SHA-256 digest, submits payload to HCS topic, and returns anchored transaction receipt.
            </p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">POST</span>
              <span className="text-white font-semibold">/api/provenance/verify</span>
            </div>
            <p className="text-slate-400 pt-1">
              Audits artifact content or hash against the official Hedera Mirror Node and returns full cryptographic match diagnostics.
            </p>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">GET</span>
              <span className="text-white font-semibold">/api/hedera/status</span>
            </div>
            <p className="text-slate-400 pt-1">
              Returns sanitized network status, operator account masking, and topic configuration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
