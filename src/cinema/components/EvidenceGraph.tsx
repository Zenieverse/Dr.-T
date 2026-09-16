// =========================================================================
// DR. T CINEMA — EVIDENCE GRAPH & CLAIM LEDGER
// Complete provenance ledger linking Parallel Search sources to claims
// =========================================================================

import React, { useState } from 'react';
import { EvidenceClaim, ResearchSource, ResearchQuery } from '../types';
import { 
  Database, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Filter, 
  Sparkles, 
  BookOpen, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface EvidenceGraphProps {
  claims: EvidenceClaim[];
  sources: ResearchSource[];
  queries: ResearchQuery[];
  onInspectClaim: (claimId: string) => void;
}

export const EvidenceGraph: React.FC<EvidenceGraphProps> = ({
  claims,
  sources,
  queries,
  onInspectClaim
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClaims = claims.filter(c => {
    const matchesCat = activeCategory === 'ALL' || c.category === activeCategory;
    const matchesSearch = !searchTerm || 
      c.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 text-slate-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Evidence Ledger & Claim Graph</h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {claims.filter(c => c.status === 'VERIFIED').length}/{claims.length} Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Grounded directly by Parallel Search across authoritative peer-reviewed medical and scientific databases.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1">
            {['ALL', 'clinical', 'biochemical', 'physiological', 'lifestyle'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Claims Ledger Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Factual Claims ({filteredClaims.length})
        </h3>

        <div className="grid grid-cols-1 gap-3.5">
          {filteredClaims.map((claim) => {
            const matchingSources = sources.filter(s => claim.sourceIds.includes(s.id));

            return (
              <div 
                key={claim.id}
                onClick={() => onInspectClaim(claim.id)}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all shadow-sm hover:shadow-md group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {claim.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {claim.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono text-slate-400 bg-slate-800 border border-slate-700">
                      {claim.category.toUpperCase()}
                    </span>
                  </div>

                  <span className="text-xs text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-medium">
                    Inspect Full Provenance <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <p className="text-sm text-slate-100 font-medium leading-relaxed mb-3">
                  "{claim.statement}"
                </p>

                {/* Sources Footnote in Card */}
                <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Corroborated by {matchingSources.length} peer-reviewed source(s): {' '}
                      <span className="text-slate-300 font-medium">
                        {matchingSources.map(s => s.publisher).join(', ')}
                      </span>
                    </span>
                  </div>

                  {claim.scriptUsages.length > 0 && (
                    <span className="text-slate-500 font-mono text-[11px]">
                      Used in {claim.scriptUsages.length} script line(s)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Sources Indexed via Parallel Search */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400" />
          Primary Literature Sources Indexed ({sources.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((src) => (
            <div 
              key={src.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-sky-400 hover:underline flex items-center gap-1.5 leading-snug"
                  >
                    {src.title}
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-300 shrink-0">
                    Credibility {src.credibilityScore}%
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-2 font-mono">
                  <span className="text-amber-400 font-semibold">{src.publisher}</span> • {src.author} ({src.publicationDate})
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  "{src.snippet}"
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Methodology: {src.methodology}</span>
                {src.peerReviewed && (
                  <span className="text-emerald-400 font-medium">✓ Peer-Reviewed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
