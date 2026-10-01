// ==========================================
// HEDERA COMMONS: VERIFY RECORD MODAL
// Dual-Hash Comparison & Mirror Node Check
// ==========================================

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Hash, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Search,
  FileCheck
} from 'lucide-react';
import { 
  DrTProvenanceRecord, 
  VerificationResult 
} from '../../modules/hedera/types';
import { HederaClientApi } from '../../services/hederaClientApi';
import { computeSha256 } from '../../modules/hedera/canonicalizer';

interface VerifyRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: DrTProvenanceRecord;
  recordsList: DrTProvenanceRecord[];
}

export const VerifyRecordModal: React.FC<VerifyRecordModalProps> = ({
  isOpen,
  onClose,
  record,
  recordsList,
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string>(record?.id || recordsList[0]?.id || '');
  const [testContent, setTestContent] = useState<string>(record?.canonicalSerialization || '');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [hasSimulatedTamper, setHasSimulatedTamper] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentRecord = recordsList.find(r => r.id === selectedRecordId) || record;

  const handleRunVerification = async () => {
    if (!currentRecord) return;
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Send content to verify endpoint
      const result = await HederaClientApi.verifyProvenance({
        recordId: currentRecord.id,
        artifactId: currentRecord.artifactId,
        content: testContent.trim() || undefined
      });
      setVerificationResult(result);
    } catch (err: any) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSimulateTamper = () => {
    if (!testContent) return;
    // Inject a subtle alteration to test tamper-evidence
    const tampered = testContent + ' [TAMPERED_BYTE_MODIFICATION]';
    setTestContent(tampered);
    setHasSimulatedTamper(true);
  };

  const handleResetContent = () => {
    if (currentRecord) {
      setTestContent(currentRecord.canonicalSerialization);
      setHasSimulatedTamper(false);
      setVerificationResult(null);
    }
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
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shadow-inner">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Cryptographic Provenance Verification
              </h2>
              <p className="text-xs text-slate-300">
                Compare Local SHA-256 Digest vs. Hedera Consensus Service Ledger
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Target Artifact Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Select Anchored Record to Verify
            </label>
            <select
              value={selectedRecordId}
              onChange={e => {
                const rec = recordsList.find(r => r.id === e.target.value);
                setSelectedRecordId(e.target.value);
                if (rec) {
                  setTestContent(rec.canonicalSerialization);
                  setVerificationResult(null);
                  setHasSimulatedTamper(false);
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
            >
              {recordsList.map(r => (
                <option key={r.id} value={r.id}>
                  [{r.artifactType.toUpperCase()}] {r.artifactTitle} ({r.id})
                </option>
              ))}
            </select>
          </div>

          {currentRecord && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Hedera Topic ID:</span>
                <span className="font-bold text-purple-700">{currentRecord.topicId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sequence Number:</span>
                <span className="font-bold text-indigo-700">#{currentRecord.sequenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consensus Timestamp:</span>
                <span className="font-bold text-slate-800">{currentRecord.consensusTimestamp}</span>
              </div>
            </div>
          )}

          {/* Artifact Payload for Verification */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Artifact Content to Verify (Calculates Local SHA-256)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSimulateTamper}
                  className="text-[10px] text-amber-700 hover:text-amber-800 font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md transition"
                >
                  ⚡ Simulate Tampering
                </button>
                {hasSimulatedTamper && (
                  <button
                    type="button"
                    onClick={handleResetContent}
                    className="text-[10px] text-blue-700 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md transition"
                  >
                    Reset Content
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={testContent}
              onChange={e => {
                setTestContent(e.target.value);
                setVerificationResult(null);
              }}
              rows={4}
              className={`w-full px-3 py-2 text-xs font-mono rounded-xl border focus:outline-hidden ${
                hasSimulatedTamper 
                  ? 'border-amber-400 bg-amber-50/50' 
                  : 'border-slate-300 bg-slate-50'
              }`}
            />
          </div>

          {/* Action Trigger */}
          <button
            type="button"
            disabled={isVerifying}
            onClick={handleRunVerification}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-500/20 disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Querying Hedera Mirror Node & Verifying Proof...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Cryptographic Integrity Now</span>
              </>
            )}
          </button>

          {/* Verification Results Display */}
          {verificationResult && (
            <div className={`p-4 rounded-2xl border space-y-3 animate-in fade-in duration-200 ${
              verificationResult.status === 'VERIFIED'
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                : verificationResult.status === 'INTEGRITY_CHECK_FAILED'
                ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                : 'bg-amber-50/80 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center space-x-2.5">
                {verificationResult.status === 'VERIFIED' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {verificationResult.status === 'VERIFIED' && 'VERIFIED: Cryptographic Integrity Confirmed'}
                    {verificationResult.status === 'INTEGRITY_CHECK_FAILED' && 'INTEGRITY CHECK FAILED: Hash Mismatch Detected'}
                    {verificationResult.status === 'RECORD_NOT_FOUND' && 'RECORD NOT FOUND'}
                    {verificationResult.status === 'VERIFICATION_UNAVAILABLE' && 'VERIFICATION UNAVAILABLE'}
                  </h4>
                  <p className="text-xs opacity-90">
                    {verificationResult.message}
                  </p>
                </div>
              </div>

              {/* Hash Comparison Box */}
              <div className="p-3 bg-white/80 rounded-xl border border-slate-200 text-xs font-mono space-y-2">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">
                    Local Artifact Digest (SHA-256):
                  </span>
                  <span className={`break-all font-bold ${
                    verificationResult.hashesMatch ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {verificationResult.localHash}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">
                    Hedera HCS Anchored Digest:
                  </span>
                  <span className="break-all font-bold text-purple-700">
                    {verificationResult.anchoredHash || 'NONE'}
                  </span>
                </div>
              </div>

              {/* Mirror Node Status Details */}
              <div className="text-[11px] space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="opacity-70">Mirror Node Consensus Check:</span>
                  <span className="font-bold">
                    {verificationResult.mirrorNodeCheck.consensusVerified ? 'CONFIRMED' : 'FAILED / UNCONFIRMED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Timestamp:</span>
                  <span>{verificationResult.verifiedAt}</span>
                </div>
              </div>
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
