// ==========================================
// HEDERA COMMONS: HederaDashboard COMPONENT
// ==========================================

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  PlusCircle, 
  FileCheck, 
  RefreshCw, 
  Info, 
  Trees, 
  Cpu, 
  ArrowRight, 
  Zap, 
  Network, 
  CheckCircle2, 
  Radio 
} from 'lucide-react';
import { ProvenanceRecord } from '../types/provenance';
import { HederaStatusCard } from './HederaStatusCard';
import { ProvenanceStats } from './ProvenanceStats';
import { ProvenanceExplorer } from './ProvenanceExplorer';
import { ProvenanceRegistration } from './ProvenanceRegistration';
import { ProvenanceVerification } from './ProvenanceVerification';
import { ProvenanceDetail } from './ProvenanceDetail';
import { NetworkActivity } from './NetworkActivity';
import { useHederaStatus } from '../hooks/useHederaStatus';
import { useProvenance } from '../hooks/useProvenance';
import { HederaClientApi } from '../../../services/hederaClientApi';
import { NavTab } from '../../../types';

interface HederaDashboardProps {
  onNavigateToTab?: (tab: NavTab) => void;
  className?: string;
}

export const HederaDashboard: React.FC<HederaDashboardProps> = ({
  onNavigateToTab,
  className = ''
}) => {
  const { status, isLoading: isStatusLoading, refetch: refetchStatus } = useHederaStatus();
  const { records, stats, isLoading: isRecordsLoading, refreshRecords, setRecords } = useProvenance();

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ProvenanceRecord | null>(null);

  // Batch verify state
  const [isBatchVerifying, setIsBatchVerifying] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const [verifyingRowId, setVerifyingRowId] = useState<string | null>(null);

  const handleRowVerify = async (record: ProvenanceRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setVerifyingRowId(record.id);
    try {
      const res = await HederaClientApi.verifyProvenance({
        recordId: record.id,
        artifactId: record.artifactId
      });
      setRecords(prev => prev.map(r => r.id === record.id ? {
        ...r,
        verificationStatus: res.status,
        lastVerifiedAt: res.verifiedAt
      } : r));
    } catch (err) {
      console.error('Row verify error:', err);
    } finally {
      setVerifyingRowId(null);
    }
  };

  const handleBatchVerifyAll = async () => {
    if (records.length === 0 || isBatchVerifying) return;
    setIsBatchVerifying(true);
    setBatchProgress({ current: 0, total: records.length });

    const updated = [...records];
    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      try {
        const res = await HederaClientApi.verifyProvenance({
          recordId: rec.id,
          artifactId: rec.artifactId
        });
        updated[i] = {
          ...rec,
          verificationStatus: res.status,
          lastVerifiedAt: res.verifiedAt
        };
      } catch (err) {
        console.error('Batch verify error:', err);
      }
      setBatchProgress({ current: i + 1, total: records.length });
    }

    setRecords(updated);
    setIsBatchVerifying(false);
    setTimeout(() => setBatchProgress(null), 3000);
  };

  const handleSelectRecord = (record: ProvenanceRecord) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Banner Notice */}
      <HederaStatusCard 
        status={status} 
        isLoading={isStatusLoading} 
        onRefresh={refetchStatus} 
      />

      {/* Main Header & Product Statement */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-purple-500/15 flex items-center justify-center text-white">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display flex items-center space-x-2.5">
                <span>Hedera Commons</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  HCS Trust Center
                </span>
              </h1>
              <p className="text-sm font-semibold text-slate-600">
                Trust, Provenance & Verification for the Dr. T Knowledge Ecosystem
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            Verify the cryptographic integrity of research papers, AI models, and living campus manuscripts without exposing private patient information on-chain.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center space-x-2 shadow-md shadow-purple-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Provenance</span>
          </button>

          <button
            onClick={() => setIsVerifyOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 transition flex items-center space-x-2 shadow-2xs"
          >
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Verify Record</span>
          </button>

          <button
            onClick={handleBatchVerifyAll}
            disabled={isBatchVerifying || records.length === 0}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition flex items-center space-x-1.5 shadow-2xs disabled:opacity-50"
            title="Audit all records against Hedera Mirror Node"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isBatchVerifying ? 'animate-spin' : ''}`} />
            <span>{isBatchVerifying ? `Auditing (${batchProgress?.current}/${batchProgress?.total})...` : 'Batch Verify All'}</span>
          </button>

          <button
            onClick={() => setIsActivityOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-purple-600" />
            <span>Consensus Stream</span>
          </button>

          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>How It Works</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <ProvenanceStats stats={stats} />

      {/* Latency & Energy Speedometer */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight">Hedera Hashgraph aBFT Consensus Finality</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Sub-2s Finality
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Deterministic consensus without block reorganization, energy-intensive mining, or probabilistic rollback risks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
          <div className="text-center px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 block uppercase">Median Latency</span>
            <span className="font-bold text-emerald-400 text-sm">~1.84 sec</span>
          </div>
          <div className="text-center px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 block uppercase">Fixed Cost</span>
            <span className="font-bold text-indigo-300 text-sm">$0.0001 / msg</span>
          </div>
          <div className="text-center px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 block uppercase">Energy / Tx</span>
            <span className="font-bold text-teal-300 text-sm">0.000003 kWh</span>
          </div>
        </div>
      </div>

      {/* Ecosystem Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
        <div 
          onClick={() => onNavigateToTab?.('tribhouse')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between cursor-pointer hover:border-emerald-300 transition group"
        >
          <div className="flex items-center space-x-2.5">
            <Trees className="w-5 h-5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-bold text-slate-900 block">Trib-House Living Library</span>
              <span className="text-[11px] text-slate-600">Century-scale papers with HCS provenance anchors</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>

        <div 
          onClick={() => onNavigateToTab?.('lifeweave')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 flex items-center justify-between cursor-pointer hover:border-indigo-300 transition group"
        >
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-5 h-5 text-indigo-600 shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-bold text-slate-900 block">LIFEWEAVE Gemma 4 Agent</span>
              <span className="text-[11px] text-slate-600">Audit SWE specifications & 10-task benchmark proofs</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0" />
        </div>
      </div>

      {/* Searchable Provenance Explorer Table */}
      <ProvenanceExplorer
        records={records}
        isLoading={isRecordsLoading}
        onSelectRecord={handleSelectRecord}
        onVerifyRecord={handleRowVerify}
        verifyingRecordId={verifyingRowId}
        onRefresh={refreshRecords}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />

      {/* Modals */}
      <ProvenanceRegistration
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => {
          refreshRecords();
          refetchStatus();
        }}
      />

      <ProvenanceVerification
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        record={selectedRecord || undefined}
        recordsList={records}
      />

      <ProvenanceDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
        onRecordUpdated={(updated) => {
          setSelectedRecord(updated);
          setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
        }}
      />

      <NetworkActivity
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        topicId={status?.topicId}
      />

      {/* How It Works Modal */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">How Hedera Provenance Works</h3>
              <button onClick={() => setIsHowItWorksOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <p><strong>1. Off-Chain Confidentiality:</strong> Your clinical records, research data, and notes stay in encrypted local databases.</p>
              <p><strong>2. Deterministic Hash:</strong> We calculate a standardized SHA-256 fingerprint using RFC 8785 key canonicalization.</p>
              <p><strong>3. HCS Consensus:</strong> Only the hash and timestamp are submitted to Hedera Consensus Service Topic 0.0.5892147.</p>
              <p><strong>4. Mirror Node Audit:</strong> Any reviewer can recalculate the hash and query Hedera Mirror Nodes to prove the artifact has not been modified since that timestamp.</p>
            </div>
            <button onClick={() => setIsHowItWorksOpen(false)} className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold text-xs">Got It</button>
          </div>
        </div>
      )}
    </div>
  );
};
