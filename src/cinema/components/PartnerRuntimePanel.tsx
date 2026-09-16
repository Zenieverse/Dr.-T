// =========================================================================
// DR. T CINEMA — PARTNER RUNTIME TELEMETRY PANEL
// Live visibility for Parallel Search integration
// =========================================================================

import React, { useState } from 'react';
import { PartnerRuntimeStats, ResearchSource } from '../types';
import { Radio, Search, Database, CheckCircle2, Clock, ChevronDown, ChevronUp, Cpu } from 'lucide-react';

interface PartnerRuntimePanelProps {
  telemetry: PartnerRuntimeStats;
  sources: ResearchSource[];
  isExpandedDefault?: boolean;
}

export const PartnerRuntimePanel: React.FC<PartnerRuntimePanelProps> = ({
  telemetry,
  sources,
  isExpandedDefault = false
}) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedDefault);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden text-slate-200 shadow-lg transition-all">
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider text-slate-100">
            PARALLEL WEB SEARCH
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {telemetry.status}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-slate-500">Requests:</span>
            <span className="text-slate-200 font-bold">{telemetry.requestsCount}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-slate-500">Sources:</span>
            <span className="text-amber-400 font-bold">{sources.length || telemetry.sourcesCount}</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-slate-500">Claims Verified:</span>
            <span className="text-emerald-400 font-bold">{telemetry.claimsVerifiedCount}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{telemetry.latencyMs}ms</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Expanded Audit Tray */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-4 animate-in slide-in-from-top-2 duration-150 text-xs">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-500">Search Provider</div>
              <div className="text-sm font-bold text-slate-100 mt-0.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                Parallel Search API
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-500">Authoritative Sources</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                {sources.length || telemetry.sourcesCount} Indexed
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-500">Extracted Claims</div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {telemetry.evidenceExtractedCount} Factual Units
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-500">Grounding Reasoning</div>
              <div className="text-sm font-bold text-purple-400 mt-0.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Google Gemini 3.8
              </div>
            </div>
          </div>

          {/* Last Query Telemetry */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-slate-300">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>ACTIVE RESEARCH QUERY</span>
              <span className="text-slate-500">{telemetry.lastTimestamp}</span>
            </div>
            <div className="text-amber-300 font-semibold truncate">
              "{telemetry.lastQuery}"
            </div>
          </div>

          {/* Source Sample Preview */}
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400 mb-2">
              Retrieved Biomedical Evidence (Sample)
            </div>
            <div className="space-y-1.5">
              {sources.slice(0, 3).map((src, i) => (
                <div key={src.id || i} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="truncate text-slate-300">
                    <span className="text-amber-400 font-semibold mr-1.5">[{src.publisher}]</span>
                    {src.title}
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Score: {src.credibilityScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
