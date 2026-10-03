// ==========================================
// HEDERA COMMONS: ProvenanceExplorer COMPONENT
// ==========================================

import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Filter, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { ProvenanceRecord } from '../types/provenance';
import { HashDisplay } from './HashDisplay';

interface ProvenanceExplorerProps {
  records: ProvenanceRecord[];
  isLoading: boolean;
  onSelectRecord: (record: ProvenanceRecord) => void;
  onVerifyRecord: (record: ProvenanceRecord, e: React.MouseEvent) => void;
  verifyingRecordId: string | null;
  onRefresh: () => void;
  onRegisterClick: () => void;
  className?: string;
}

export const ProvenanceExplorer: React.FC<ProvenanceExplorerProps> = ({
  records,
  isLoading,
  onSelectRecord,
  onVerifyRecord,
  verifyingRecordId,
  onRefresh,
  onRegisterClick,
  className = ''
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [privacyFilter, setPrivacyFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filter logic
  const filtered = records.filter(r => {
    if (typeFilter !== 'all' && r.artifactType.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }
    if (privacyFilter !== 'all' && r.privacyClassification.toUpperCase() !== privacyFilter.toUpperCase()) {
      return false;
    }
    if (verifiedOnly && !(r.verificationStatus === 'verified' || r.verificationStatus === 'VERIFIED')) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchId = r.artifactId.toLowerCase().includes(q);
      const matchTitle = r.artifactTitle.toLowerCase().includes(q);
      const matchHash = r.contentHash.toLowerCase().includes(q);
      const matchTopic = r.topicId ? r.topicId.toLowerCase().includes(q) : false;
      const matchTx = r.transactionId ? r.transactionId.toLowerCase().includes(q) : false;
      if (!matchId && !matchTitle && !matchHash && !matchTopic && !matchTx) {
        return false;
      }
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRecords = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6 ${className}`}>
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>Provenance Explorer</span>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              {filtered.length} of {records.length} Records
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Search and audit cryptographic fingerprints anchored to the Hedera Consensus ledger
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search ID, title, SHA-256 hash, topic..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500 font-bold text-[11px] flex items-center space-x-1">
          <Filter className="w-3 h-3" />
          <span>Filters:</span>
        </span>

        {/* Artifact Type */}
        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-hidden"
        >
          <option value="all">All Artifact Types</option>
          <option value="knowledge">Knowledge / Trib-House</option>
          <option value="ai-model">AI Models / Agents</option>
          <option value="ai-evaluation">AI Benchmarks</option>
          <option value="research">Research Studies</option>
          <option value="greenieverse">GreenieVerse Ecological</option>
          <option value="document">Governance Policies</option>
          <option value="dataset">Datasets</option>
        </select>

        {/* Privacy Tier */}
        <select
          value={privacyFilter}
          onChange={e => { setPrivacyFilter(e.target.value); setPage(1); }}
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
          type="button"
          onClick={() => { setVerifiedOnly(!verifiedOnly); setPage(1); }}
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
          onClick={onRefresh}
          disabled={isLoading}
          className="ml-auto p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
          title="Refresh Records"
          aria-label="Refresh records"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table / List */}
      {paginatedRecords.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-sm">No provenance records found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No records match your active query or filter criteria. You can anchor a new artifact using the button below.
            </p>
          </div>
          <button
            onClick={onRegisterClick}
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
              {paginatedRecords.map((r) => (
                <tr 
                  key={r.id}
                  onClick={() => onSelectRecord(r)}
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
                      r.privacyClassification.toUpperCase() === 'SENSITIVE'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : r.privacyClassification.toUpperCase() === 'PRIVATE'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {r.privacyClassification.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px]">
                    <div className="text-slate-900 font-bold">Seq #{r.sequenceNumber || 1042}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]" title={r.contentHash}>
                      {r.contentHash.slice(0, 14)}...
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      r.verificationStatus === 'verified' || r.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.verificationStatus === 'mismatch' || r.verificationStatus === 'INTEGRITY_CHECK_FAILED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{r.verificationStatus.toUpperCase()}</span>
                    </span>
                  </td>

                  <td className="py-3.5 pl-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={(e) => onVerifyRecord(r, e)}
                        disabled={verifyingRecordId === r.id}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition flex items-center space-x-1"
                        title="Audit against Hedera Mirror Node"
                      >
                        <RefreshCw className={`w-3 h-3 ${verifyingRecordId === r.id ? 'animate-spin' : ''}`} />
                        <span>Verify</span>
                      </button>

                      {r.hashscanUrl ? (
                        <a
                          href={r.hashscanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                          title="View on Hashscan Explorer"
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

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {currentPage} of {totalPages} ({filtered.length} total)
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
