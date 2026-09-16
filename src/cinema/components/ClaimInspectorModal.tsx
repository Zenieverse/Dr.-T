// =========================================================================
// DR. T CINEMA — SIGNATURE TRACEABILITY INSPECTOR MODAL
// SOURCE ➔ CLAIM ➔ SCRIPT ➔ SHOT ➔ PRODUCTION
// =========================================================================

import React from 'react';
import { EvidenceClaim, ResearchSource, Scene, Shot, CinemaViewTab } from '../types';
import { 
  ShieldCheck, 
  ExternalLink, 
  Clapperboard, 
  Film, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  X, 
  ChevronRight,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface ClaimInspectorModalProps {
  claim: EvidenceClaim | null;
  sources: ResearchSource[];
  scenes: Scene[];
  shots: Shot[];
  onClose: () => void;
  onNavigateToTab: (tab: CinemaViewTab, focusId?: string) => void;
}

export const ClaimInspectorModal: React.FC<ClaimInspectorModalProps> = ({
  claim,
  sources,
  scenes,
  shots,
  onClose,
  onNavigateToTab
}) => {
  if (!claim) return null;

  const claimSources = sources.filter(s => claim.sourceIds.includes(s.id));
  const relatedScenes = scenes.filter(s => s.claimIds.includes(claim.id));
  const relatedShots = shots.filter(s => s.claimId === claim.id || relatedScenes.some(sc => sc.id === s.sceneId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Provenance Badge */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {claim.id}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {claim.status.replace('_', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {claim.category.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CONFIDENCE: {claim.confidence}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight">
              Evidence-to-Screen Provenance Audit
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provenance Pipeline Trail */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 overflow-x-auto gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-semibold text-amber-400">1. SOURCE</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-semibold text-amber-400">2. CLAIM</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-semibold text-amber-400">3. SCRIPT</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-semibold text-amber-400">4. SHOT</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-semibold text-amber-400">5. PRODUCTION</span>
          </div>
          <span className="text-slate-500 hidden sm:inline text-right">
            Parallel Search Grounding
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Claim Statement */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="text-xs uppercase tracking-wider text-amber-400/80 font-mono mb-1">
              Factual Assertion in Screenplay
            </div>
            <p className="text-base text-slate-100 font-medium leading-relaxed">
              "{claim.statement}"
            </p>
            {claim.factCheckerNotes && (
              <div className="mt-3 pt-3 border-t border-amber-500/10 text-xs text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-200">Fact-Checker Audit:</strong> {claim.factCheckerNotes}</span>
              </div>
            )}
          </div>

          {/* Supported By (Sources) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Supported By ({claimSources.length} Peer-Reviewed Sources via Parallel Search)
              </h4>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTab('evidence');
                }}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                View Full Evidence Ledger <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {claimSources.map(src => (
                <div 
                  key={src.id}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <a 
                      href={src.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm font-semibold text-sky-400 hover:underline flex items-center gap-1.5"
                    >
                      {src.title}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-emerald-500/15 text-emerald-300 shrink-0">
                      Credibility {src.credibilityScore}%
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mb-2">
                    <span className="text-slate-300 font-medium">{src.publisher}</span> • {src.author} ({src.publicationDate}) • {src.methodology}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 italic">
                    "{src.snippet}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Used In (Screenplay Scenes & Shots) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Screenplay Usage */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
                <Clapperboard className="w-4 h-4 text-amber-400" />
                Script Usage ({relatedScenes.length} Scenes)
              </h4>
              {relatedScenes.map(sc => (
                <div key={sc.id} className="text-xs text-slate-300 mb-2 last:mb-0">
                  <div className="font-semibold text-white">{sc.id}: {sc.title} ({sc.timecodeStart} - {sc.timecodeEnd})</div>
                  <div className="text-slate-400 mt-0.5 line-clamp-2">"{sc.narration}"</div>
                </div>
              ))}
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTab('script');
                }}
                className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Clapperboard className="w-3.5 h-3.5" /> Jump to Script Line
              </button>
            </div>

            {/* Storyboard & Production */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
                <Film className="w-4 h-4 text-amber-400" />
                Shot & Production ({relatedShots.length} Shots)
              </h4>
              {relatedShots.slice(0, 2).map(sh => (
                <div key={sh.shotId} className="text-xs text-slate-300 mb-2 last:mb-0">
                  <div className="font-semibold text-white">{sh.shotId} ({sh.durationSeconds}s) • {sh.shotType}</div>
                  <div className="text-slate-400 mt-0.5">{sh.cameraMovement} | {sh.lensStyle}</div>
                </div>
              ))}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToTab('storyboard');
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center gap-1 transition-colors"
                >
                  <Film className="w-3.5 h-3.5 text-amber-400" /> Storyboard
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToTab('production');
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center gap-1 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Schedule
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Dr. T Cinema Provenance-Aware Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
