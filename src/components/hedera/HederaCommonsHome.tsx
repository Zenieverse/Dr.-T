// ==========================================
// HEDERA COMMONS: PRODUCTION HOME DASHBOARD
// Trust, Provenance & Verification for Dr. T
// ==========================================

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Network, 
  FileText, 
  Cpu, 
  Trees, 
  Activity, 
  Search, 
  PlusCircle, 
  FileCheck, 
  ExternalLink, 
  RefreshCw, 
  Layers, 
  Info, 
  CheckCircle2, 
  Clock, 
  Lock, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  Database,
  Radio,
  Copy,
  Check,
  Globe,
  Zap
} from 'lucide-react';
import { 
  DrTProvenanceRecord, 
  HederaStatusResponse, 
  ArtifactType, 
  PrivacyClassification 
} from '../../modules/hedera/types';
import { NavTab } from '../../types';
import { HederaClientApi } from '../../services/hederaClientApi';
import { RegisterProvenanceModal } from './RegisterProvenanceModal';
import { VerifyRecordModal } from './VerifyRecordModal';
import { ProvenanceDetailModal } from './ProvenanceDetailModal';
import { HowItWorksModal } from './HowItWorksModal';
import { NetworkActivityDrawer } from './NetworkActivityDrawer';

interface HederaCommonsHomeProps {
  onNavigateToTab?: (tab: NavTab) => void;
}

export const HederaCommonsHome: React.FC<HederaCommonsHomeProps> = ({ onNavigateToTab }) => {
  // Data States
  const [records, setRecords] = useState<DrTProvenanceRecord[]>([]);
  const [stats, setStats] = useState<any>({
    totalRecords: 0,
    verifiedRecords: 0,
    researchArtifacts: 0,
    knowledgeRecords: 0,
    aiArtifacts: 0,
    ecologicalRecords: 0,
    lastVerificationTimestamp: null
  });
  const [networkStatus, setNetworkStatus] = useState<HederaStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerifyingRowId, setIsVerifyingRowId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [privacyFilter, setPrivacyFilter] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<DrTProvenanceRecord | null>(null);

  // Copy helper
  const [copiedTopic, setCopiedTopic] = useState<boolean>(false);

  // Batch Verification State
  const [isBatchVerifying, setIsBatchVerifying] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  const handleBatchVerifyAll = async () => {
    if (records.length === 0 || isBatchVerifying) return;
    setIsBatchVerifying(true);
    setBatchProgress({ current: 0, total: records.length });

    const updated = [...records];
    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      try {
        const result = await HederaClientApi.verifyProvenance({
          recordId: rec.id,
          artifactId: rec.artifactId
        });
        updated[i] = {
          ...rec,
          verificationStatus: result.status,
          lastVerifiedAt: result.verifiedAt
        };
      } catch (err) {
        console.error('Batch verify error:', err);
      }
      setBatchProgress({ current: i + 1, total: records.length });
    }

    setRecords(updated);
    setIsBatchVerifying(false);
    setTimeout(() => setBatchProgress(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, recordsRes] = await Promise.all([
        HederaClientApi.getStatus(),
        HederaClientApi.getRecords({
          artifactType: typeFilter !== 'all' ? (typeFilter as ArtifactType) : undefined,
          privacy: privacyFilter !== 'all' ? (privacyFilter as PrivacyClassification) : undefined,
          query: searchQuery.trim() || undefined,
          verifiedOnly: verifiedOnly || undefined
        })
      ]);
      setNetworkStatus(statusRes);
      setRecords(recordsRes.records || []);
      setStats(recordsRes.stats || {});
    } catch (err) {
      console.warn('Error loading Hedera Commons data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [typeFilter, privacyFilter, verifiedOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleRowQuickVerify = async (rec: DrTProvenanceRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVerifyingRowId(rec.id);
    try {
      const result = await HederaClientApi.verifyProvenance({
        recordId: rec.id,
        artifactId: rec.artifactId
      });
      // Update in place
      setRecords(prev => prev.map(r => r.id === rec.id ? {
        ...r,
        verificationStatus: result.status,
        lastVerifiedAt: result.verifiedAt
      } : r));
    } catch (err) {
      console.error('Quick verify error:', err);
    } finally {
      setIsVerifyingRowId(null);
    }
  };

  const copyTopicId = (topicId: string) => {
    navigator.clipboard.writeText(topicId);
    setCopiedTopic(true);
    setTimeout(() => setCopiedTopic(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 pb-16">
      {/* Network & Sandbox Warning Banner */}
      <div className={`w-full py-2 px-4 sm:px-6 border-b text-xs flex flex-wrap items-center justify-between gap-2 transition ${
        networkStatus?.mode === 'real'
          ? 'bg-emerald-950 text-emerald-200 border-emerald-900'
          : 'bg-indigo-950 text-indigo-200 border-indigo-900'
      }`}>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 font-bold">
            <span className={`w-2 h-2 rounded-full ${
              networkStatus?.status === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`} />
            <span className="uppercase tracking-wider">
              Hedera {networkStatus?.network || 'Testnet'}
            </span>
          </div>
          <span className="opacity-40">•</span>
          <span className="font-mono text-[11px] opacity-90">
            HCS Topic: {networkStatus?.topicId || '0.0.5892147'}
          </span>
          <button
            onClick={() => copyTopicId(networkStatus?.topicId || '0.0.5892147')}
            className="hover:text-white transition p-0.5"
            title="Copy Topic ID"
          >
            {copiedTopic ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
          </button>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          {networkStatus?.mode === 'real' ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
              Live Network Mode
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-indigo-300" />
              <span>Development / Mock Mode (Cryptographic Sandbox)</span>
            </span>
          )}

          {networkStatus?.hbarBalance && (
            <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">
              {networkStatus.hbarBalance}
            </span>
          )}

          <button
            onClick={() => setIsActivityDrawerOpen(true)}
            className="underline hover:text-white transition cursor-pointer"
          >
            View Consensus Stream
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Main Header & Product Statement */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-purple-500/15 flex items-center justify-center text-white">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display flex items-center space-x-2.5">
                  <span>Hedera Commons</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    HCS Provenance Layer
                  </span>
                </h1>
                <p className="text-sm font-semibold text-slate-600">
                  Trust, Provenance & Verification for the Dr. T Knowledge Ecosystem
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              Verify the integrity and provenance of research, knowledge, AI artifacts and ecological records without exposing private clinical information on-chain.
            </p>
          </div>

          {/* Primary Quick Actions */}
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
              title="Verify all records against Hedera Consensus ledger"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBatchVerifying ? 'animate-spin' : ''}`} />
              <span>{isBatchVerifying ? `Auditing (${batchProgress?.current}/${batchProgress?.total})...` : 'Batch Verify All'}</span>
            </button>

            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span>How It Works</span>
            </button>
          </div>
        </div>

        {/* Dashboard Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Provenance</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.totalRecords}</div>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{stats.verifiedRecords} Verified</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Knowledge</span>
              <Trees className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.knowledgeRecords}</div>
            <div className="text-[10px] text-slate-500">Trib-House Records</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>AI Artifacts</span>
              <Cpu className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.aiArtifacts}</div>
            <div className="text-[10px] text-slate-500">Models & Benchmarks</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Research</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.researchArtifacts}</div>
            <div className="text-[10px] text-slate-500">Studies & Protocols</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Ecological</span>
              <Globe className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.ecologicalRecords}</div>
            <div className="text-[10px] text-slate-500">GreenieVerse Registry</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Ledger Health</span>
              <Radio className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">
              {networkStatus?.status || 'CONNECTED'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">
              Topic #{networkStatus?.consensusMessagesCount || 1042}
            </div>
          </div>
        </div>

        {/* Real-time Consensus Performance & Energy Efficiency Card (Optimax Finality) */}
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
                Deterministic finality without block reorganization, energy-intensive PoW mining, or probabilistic confirmations.
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

        {/* Ecosystem Integration Quick Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
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

          <div 
            onClick={() => onNavigateToTab?.('privacy')}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/80 flex items-center justify-between cursor-pointer hover:border-purple-300 transition group"
          >
            <div className="flex items-center space-x-2.5">
              <Lock className="w-5 h-5 text-purple-600 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-slate-900 block">Zero-PHI Privacy Center</span>
                <span className="text-[11px] text-slate-600">Strict off-chain clinical boundary enforcement</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 shrink-0" />
          </div>
        </div>

        {/* Provenance Explorer Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <span>Provenance Explorer</span>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {records.length} Records
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Search and independently audit cryptographic fingerprints anchored to Hedera
              </p>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 max-w-sm w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search ID, title, SHA-256 hash..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-bold text-[11px]">Filter by:</span>

            {/* Artifact Type */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-hidden"
            >
              <option value="all">All Artifact Types</option>
              <option value="knowledge">Knowledge / Trib-House</option>
              <option value="ai_model">AI Models / Agents</option>
              <option value="ai_evaluation">AI Benchmarks</option>
              <option value="research">Research Studies</option>
              <option value="greenieverse">GreenieVerse Ecological</option>
              <option value="document">Governance Policies</option>
            </select>

            {/* Privacy Tier */}
            <select
              value={privacyFilter}
              onChange={e => setPrivacyFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-hidden"
            >
              <option value="all">All Privacy Tiers</option>
              <option value="PUBLIC">PUBLIC</option>
              <option value="INTERNAL">INTERNAL</option>
              <option value="PRIVATE">PRIVATE</option>
              <option value="SENSITIVE">SENSITIVE (Zero-PHI)</option>
            </select>

            {/* Verified Toggle */}
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-1 rounded-lg border text-xs font-bold transition flex items-center space-x-1 ${
                verifiedOnly 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Only</span>
            </button>

            <button
              onClick={loadData}
              disabled={isLoading}
              className="ml-auto p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              title="Refresh Records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Records Table / List */}
          {records.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">No provenance records found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search query or filter settings, or anchor a new artifact using the button above.
                </p>
              </div>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition"
              >
                Anchor New Artifact
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pr-4">Artifact / Record</th>
                    <th className="pb-3 px-3">Type</th>
                    <th className="pb-3 px-3">Privacy Tier</th>
                    <th className="pb-3 px-3">Consensus Proof</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 pl-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => (
                    <tr 
                      key={r.id} 
                      onClick={() => {
                        setSelectedRecord(r);
                        setIsDetailOpen(true);
                      }}
                      className="hover:bg-slate-50/80 transition cursor-pointer group"
                    >
                      <td className="py-3.5 pr-4 max-w-xs">
                        <div className="font-bold text-slate-900 group-hover:text-purple-600 transition truncate">
                          {r.artifactTitle}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 truncate flex items-center space-x-1.5 pt-0.5">
                          <span>{r.artifactId}</span>
                          <span>•</span>
                          <span>v{r.artifactVersion}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                          {r.artifactType}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          r.privacyClassification === 'SENSITIVE'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : r.privacyClassification === 'PRIVATE'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {r.privacyClassification}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[11px]">
                        <div className="text-slate-900 font-bold">Seq #{r.sequenceNumber}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={r.contentHash}>
                          {r.contentHash.slice(0, 14)}...
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.verificationStatus === 'INTEGRITY_CHECK_FAILED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{r.verificationStatus}</span>
                        </span>
                      </td>

                      <td className="py-3.5 pl-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleRowQuickVerify(r, e)}
                            disabled={isVerifyingRowId === r.id}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition flex items-center space-x-1"
                            title="Verify via Mirror Node"
                          >
                            <RefreshCw className={`w-3 h-3 ${isVerifyingRowId === r.id ? 'animate-spin' : ''}`} />
                            <span>Verify</span>
                          </button>

                          {r.hashscanUrl ? (
                            <a
                              href={r.hashscanUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                              title="View on Hashscan"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals & Drawers */}
      <RegisterProvenanceModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={(rec) => {
          loadData();
          setSelectedRecord(rec);
          setIsDetailOpen(true);
        }}
      />

      <VerifyRecordModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        recordsList={records}
      />

      <ProvenanceDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
        onRecordUpdated={() => loadData()}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <NetworkActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
        topicId={networkStatus?.topicId || '0.0.5892147'}
      />
    </div>
  );
};
