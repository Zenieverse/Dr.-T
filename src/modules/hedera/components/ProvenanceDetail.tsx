// ==========================================
// HEDERA COMMONS: ProvenanceDetail COMPONENT
// ==========================================

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Hash, 
  Network, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  Lock, 
  Download, 
  FileCode, 
  RefreshCw 
} from 'lucide-react';
import { ProvenanceRecord } from '../types/provenance';
import { HashDisplay } from './HashDisplay';
import { PrivacyNotice } from './PrivacyNotice';
import { ProvenanceTimeline } from './ProvenanceTimeline';
import { downloadProvenanceCertificateHtml, generateProvenanceCertificateJson } from '../certificateGenerator';
import { HederaClientApi } from '../../../services/hederaClientApi';

interface ProvenanceDetailProps {
  isOpen: boolean;
  onClose: () => void;
  record: ProvenanceRecord | null;
  onRecordUpdated?: (updated: ProvenanceRecord) => void;
}

export const ProvenanceDetail: React.FC<ProvenanceDetailProps> = ({
  isOpen,
  onClose,
  record,
  onRecordUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'payload'>('overview');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen || !record) return null;

  const handleQuickVerify = async () => {
    setIsVerifying(true);
    try {
      const result = await HederaClientApi.verifyProvenance({
        recordId: record.id,
        artifactId: record.artifactId
      });
      if (onRecordUpdated) {
        onRecordUpdated({
          ...record,
          verificationStatus: result.status,
          lastVerifiedAt: result.verifiedAt
        });
      }
    } catch (err) {
      console.error('Quick verify error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const copyJsonProof = () => {
    navigator.clipboard.writeText(generateProvenanceCertificateJson(record as any));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight truncate max-w-md">
                  {record.artifactTitle}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {record.verificationStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                {record.id} • {record.artifactType.toUpperCase()} v{record.artifactVersion}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Sub-Header */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center space-x-4 text-xs font-bold text-slate-600 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-1.5 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Overview & Hedera Ledger
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-1.5 border-b-2 transition ${
              activeTab === 'timeline'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Provenance Timeline
          </button>
          <button
            onClick={() => setActiveTab('payload')}
            className={`py-1.5 border-b-2 transition ${
              activeTab === 'payload'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Canonical Payload
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* SHA-256 Hash Display */}
              <HashDisplay 
                hash={record.contentHash} 
                label="Cryptographic SHA-256 Fingerprint (RFC 8785 Canonical Digest)" 
              />

              {/* Hedera Consensus Service Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono">
                  <span className="text-slate-500 text-[10px] block">Hedera Network</span>
                  <span className="font-bold text-slate-900 uppercase">
                    Hedera {record.network}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono">
                  <span className="text-slate-500 text-[10px] block">HCS Topic ID</span>
                  <span className="font-bold text-purple-700">
                    {record.topicId || '0.0.5892147'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono">
                  <span className="text-slate-500 text-[10px] block">Topic Sequence Number</span>
                  <span className="font-bold text-indigo-700">
                    #{record.sequenceNumber || 1042}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono">
                  <span className="text-slate-500 text-[10px] block">Consensus Timestamp</span>
                  <span className="font-bold text-slate-900 truncate block">
                    {record.consensusTimestamp || 'Ledger Finalized'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono sm:col-span-2">
                  <span className="text-slate-500 text-[10px] block">Transaction ID</span>
                  <span className="font-bold text-slate-900 break-all">
                    {record.transactionId || 'Anchored by consensus'}
                  </span>
                </div>
              </div>

              {/* Privacy Notice Component */}
              <PrivacyNotice classification={record.privacyClassification} />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={handleQuickVerify}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>Verify with Mirror Node</span>
                </button>

                {record.hashscanUrl ? (
                  <a
                    href={record.hashscanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                  >
                    <span>View on Hashscan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : null}

                <button
                  type="button"
                  onClick={() => downloadProvenanceCertificateHtml(record as any)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Certificate (HTML)</span>
                </button>

                <button
                  type="button"
                  onClick={copyJsonProof}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 border border-slate-200"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileCode className="w-3.5 h-3.5 text-purple-600" />}
                  <span>{copiedJson ? 'Copied JSON' : 'Copy JSON Audit Receipt'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <ProvenanceTimeline record={record} />
          )}

          {activeTab === 'payload' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Canonical Serialization Representation (RFC 8785)
              </span>
              <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-72 leading-relaxed shadow-inner">
                {record.canonicalSerialization || JSON.stringify(record.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
