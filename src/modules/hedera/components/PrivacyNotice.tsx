// ==========================================
// HEDERA COMMONS: PrivacyNotice COMPONENT
// ==========================================

import React from 'react';
import { ShieldCheck, Lock, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PrivacyClassification } from '../types/provenance';

interface PrivacyNoticeProps {
  classification?: PrivacyClassification;
  className?: string;
  showDetails?: boolean;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({
  classification = 'public',
  className = '',
  showDetails = true
}) => {
  const norm = classification.toUpperCase();

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200 text-slate-800 text-xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 font-bold text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Strict Zero-PHI Cryptographic Guarantee</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          Tier: {norm}
        </span>
      </div>

      {showDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
          <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-100 space-y-1">
            <span className="font-bold text-emerald-900 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>What Stays Private (Off-Chain)</span>
            </span>
            <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
              <li>Raw medical records & clinical notes</li>
              <li>Patient identifiers, names & MRNs</li>
              <li>Proprietary dataset contents & AI prompts</li>
              <li>Private keys and API credentials</li>
            </ul>
          </div>

          <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-100 space-y-1">
            <span className="font-bold text-purple-900 flex items-center space-x-1">
              <EyeOff className="w-3.5 h-3.5 text-purple-600" />
              <span>What Goes to Hedera (HCS)</span>
            </span>
            <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
              <li>256-bit SHA-256 fingerprint</li>
              <li>Decentralized consensus timestamp</li>
              <li>Topic sequence number & running hash</li>
              <li>Minimal non-PHI metadata (schema, version)</li>
            </ul>
          </div>
        </div>
      )}

      <div className="text-[10px] text-emerald-800 leading-relaxed">
        <strong>HIPAA Safe Harbor & GDPR Article 9 Compliant:</strong> The cryptographic hash is mathematically one-way and cannot be reverse-engineered to reveal patient or private data.
      </div>
    </div>
  );
};
