// ==========================================
// HEDERA COMMONS: HOW IT WORKS MODAL
// Trust, Provenance & Privacy Architecture
// ==========================================

import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Hash, 
  Network, 
  CheckCircle2, 
  Database,
  ArrowRight,
  ExternalLink,
  Info,
  AlertTriangle
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Your Artifact Stays Off-Chain',
      icon: <Lock className="w-5 h-5 text-emerald-500" />,
      color: 'border-emerald-500/30 bg-emerald-50/50',
      description: 'Dr. T keeps the original research paper, knowledge manuscript, dataset, AI weights, or private clinical documentation in its designated secure off-chain storage layer (Firestore, Cloud Storage, or local repository). Confidential medical records, clinical notes, and PII are NEVER exposed to a public blockchain.',
      principle: 'Strict Privacy Barrier (Zero PHI on-chain)'
    },
    {
      step: '02',
      title: 'Dr. T Computes a Cryptographic Fingerprint',
      icon: <Hash className="w-5 h-5 text-blue-500" />,
      color: 'border-blue-500/30 bg-blue-50/50',
      description: 'Using deterministic canonical JSON serialization (RFC 8785) and standard cryptographic algorithms, Dr. T computes an immutable 256-bit SHA-256 digest of the artifact. Any single character change or byte alteration in the underlying data produces an entirely different hash.',
      principle: 'Deterministic & Collision-Resistant'
    },
    {
      step: '03',
      title: 'Hedera Records the Proof via HCS',
      icon: <Network className="w-5 h-5 text-purple-500" />,
      color: 'border-purple-500/30 bg-purple-50/50',
      description: 'The sanitized provenance event (schema, artifact ID, SHA-256 fingerprint, privacy tier, and timestamp) is submitted to a dedicated Hedera Consensus Service (HCS) topic. The Hedera Hashgraph network assigns a decentralized, tamper-proof consensus timestamp and sequence number within seconds.',
      principle: 'Hedera Consensus Service (HCS) Ordering'
    },
    {
      step: '04',
      title: 'Independent Mirror Node Verification',
      icon: <CheckCircle2 className="w-5 h-5 text-indigo-500" />,
      color: 'border-indigo-500/30 bg-indigo-50/50',
      description: 'Anyone authorized to verify the artifact recalculates the SHA-256 hash of their local copy and queries an independent Hedera Mirror Node via REST API. If the local hash matches the anchored HCS consensus record, integrity and version authenticity are mathematically proven.',
      principle: 'Decentralized Auditability'
    },
    {
      step: '05',
      title: 'Private Information Remains Private Forever',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-600/30 bg-emerald-50/50',
      description: 'Hedera stores only the cryptographic proof—not the confidential medical or proprietary record. The blockchain provides a tamper-evident, independently verifiable record of provenance that was submitted, without ever turning Hedera into a medical database.',
      principle: 'Cryptographic Trust without Data Leakage'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-it-works-title"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 id="how-it-works-title" className="text-lg font-bold tracking-tight">
                How Hedera Commons Works
              </h2>
              <p className="text-xs text-slate-300">
                Dr. T Trust, Provenance & Verification Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Trust Declaration */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 text-emerald-950 text-xs sm:text-sm leading-relaxed flex items-start space-x-3">
            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Core Principle: </span>
              Keep private or sensitive information off-chain. Put only cryptographic proofs, provenance metadata, and identifiers on Hedera. Hedera provides <span className="font-bold underline decoration-emerald-500">verifiability and tamper-evidence</span>, not raw data storage.
            </div>
          </div>

          {/* Architecture Visual Diagram */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700">
            <div className="font-sans font-bold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Cryptographic Provenance Pipeline</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">Zero-Knowledge Integrity</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 py-2">
              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-bold shadow-2xs">
                Private / Research Data
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 font-bold text-blue-900 shadow-2xs">
                SHA-256 Digest
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 font-bold text-purple-900 shadow-2xs">
                Hedera HCS Topic
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 font-bold text-indigo-900 shadow-2xs">
                Mirror Node REST
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 font-bold text-emerald-900 shadow-2xs">
                VERIFIED Proof
              </div>
            </div>
          </div>

          {/* 5 Architectural Steps */}
          <div className="space-y-3.5">
            {steps.map((s) => (
              <div 
                key={s.step} 
                className={`p-4 rounded-2xl border ${s.color} transition hover:shadow-xs`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                    {s.icon}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                        <span className="font-mono text-xs text-slate-400 font-normal">{s.step}.</span>
                        <span>{s.title}</span>
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-medium">
                        {s.principle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scientific Disclaimer (Prompt #42: Do not overclaim) */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Important Scientific Rigor Note: </span>
              A matching cryptographic hash demonstrates that the verified artifact corresponds precisely to the anchored artifact representation. It proves tamper-evidence and timeline provenance, but does not autonomously certify that the underlying clinical or empirical content is factually true.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>Powered by</span>
            <span className="font-bold text-slate-800">Hedera Consensus Service (HCS)</span>
            <span>&</span>
            <span className="font-bold text-slate-800">Mirror Nodes</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
