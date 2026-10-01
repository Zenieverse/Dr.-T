// ==========================================
// HEDERA COMMONS: PROVENANCE RECORD DETAIL
// Deep Audit, Cryptographic Timeline & Explorer
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
  Layers,
  FileCheck,
  RefreshCw,
  Sparkles,
  Download,
  FileCode
} from 'lucide-react';
import { DrTProvenanceRecord } from '../../modules/hedera/types';
import { HederaClientApi } from '../../services/hederaClientApi';
import { downloadProvenanceCertificateHtml, generateProvenanceCertificateJson } from '../../modules/hedera/certificateGenerator';

interface ProvenanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DrTProvenanceRecord | null;
  onRecordUpdated?: (updated: DrTProvenanceRecord) => void;
}

export const ProvenanceDetailModal: React.FC<ProvenanceDetailModalProps> = ({
  isOpen,
  onClose,
  record,
  onRecordUpdated,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'payload' | 'timeline'>('overview');

  if (!isOpen || !record) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleQuickVerify = async () => {
    setIsVerifying(true);
    try {
      const result = await HederaClientApi.verifyProvenance({
        recordId: record.id,
        artifactId: record.artifactId,
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

  const timelineEvents = [
    { title: 'Artifact Created', date: record.createdAt, status: 'completed' },
    { title: 'Canonical SHA-256 Fingerprint Generated', date: record.createdAt, status: 'completed' },
    { title: `HCS Message Anchored (Seq #${record.sequenceNumber})`, date: record.createdAt, status: 'completed' },
    { title: 'Consensus Reached on Hedera Ledger', date: new Date(Number(record.consensusTimestamp.split('.')[0]) * 1000).toISOString(), status: 'completed' },
    { title: 'Mirror Node Audit & Verification Check', date: record.lastVerifiedAt || record.createdAt, status: 'completed' },
  ];

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
                  {record.verificationStatus}
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
              {/* SHA-256 Fingerprint Card */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                    <Hash className="w-4 h-4 text-blue-600" />
                    <span>Cryptographic SHA-256 Fingerprint</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(record.contentHash)}
                    className="p-1 rounded-md hover:bg-blue-100 text-blue-700 text-xs flex items-center space-x-1"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-blue-200 font-mono text-xs text-slate-800 break-all select-all">
                  {record.contentHash}
                </div>
              </div>

              {/* Hedera Consensus Service Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono">
                  <span className="text-slate-500 text-[10px] block">Network</span>
                  <span className="font-bold text-slate-900 uppercase">
                    Hedera {record.network}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono">
                  <span className="text-slate-500 text-[10px] block">HCS Topic ID</span>
                  <span className="font-bold text-purple-700">
                    {record.topicId}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono">
                  <span className="text-slate-500 text-[10px] block">Topic Sequence Number</span>
                  <span className="font-bold text-indigo-700">
                    #{record.sequenceNumber}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono">
                  <span className="text-slate-500 text-[10px] block">Consensus Timestamp</span>
                  <span className="font-bold text-slate-900 truncate block">
                    {record.consensusTimestamp}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono sm:col-span-2">
                  <span className="text-slate-500 text-[10px] block">Transaction ID</span>
                  <span className="font-bold text-slate-900 break-all">
                    {record.transactionId}
                  </span>
                </div>
              </div>

              {/* Privacy Barrier Guard Status */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Privacy Classification: </span>
                    <span className="underline decoration-emerald-500 font-bold">{record.privacyClassification}</span>
                    <p className="text-[11px] text-emerald-800">
                      Off-chain data boundary confirmed. No private or clinical content transmitted.
                    </p>
                  </div>
                </div>
              </div>

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

                {record.hashscanUrl && (
                  <a
                    href={record.hashscanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                  >
                    <span>View on Hashscan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => downloadProvenanceCertificateHtml(record)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Certificate (HTML)</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(generateProvenanceCertificateJson(record))}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 border border-slate-200"
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-600" />
                  <span>Copy JSON Audit Receipt</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4 py-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Immutable Event History
              </h4>
              <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6">
                {timelineEvents.map((evt, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{evt.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{evt.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
