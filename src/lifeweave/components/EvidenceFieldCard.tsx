import React from 'react';
import { CandidateLocation, EvidenceMetrics } from '../types/lifeweaveTypes';
import { 
  Award, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface EvidenceFieldCardProps {
  candidate: CandidateLocation;
  onRequestEvidence?: (action: string) => void;
}

export const EvidenceFieldCard: React.FC<EvidenceFieldCardProps> = ({
  candidate,
  onRequestEvidence
}) => {
  const { evidence, supportingEvidence, contradictoryEvidence, confidence } = candidate;

  // Format metric value or "Unknown"
  const renderMetricValue = (val: number | null) => {
    if (val === null || val === undefined) {
      return (
        <span className="text-amber-400 font-bold text-[11px] font-mono bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
          Unknown
        </span>
      );
    }
    return (
      <span className="font-mono font-bold text-slate-100 text-xs">
        {val.toFixed(2)}
      </span>
    );
  };

  const METRIC_ROWS = [
    { label: 'Semantic relevance', value: evidence.semanticRelevance, desc: 'Vector & keyword alignment with issue text' },
    { label: 'Structural relevance', value: evidence.structuralRelevance, desc: 'Position in AST hierarchy and class/module structure' },
    { label: 'Dependency relevance', value: evidence.dependencyRelevance, desc: 'Direct caller/callee coupling in execution path' },
    { label: 'Test relevance', value: evidence.testRelevance, desc: 'Coverage by failing or affected test assertions' },
    { label: 'Behavioral relevance', value: evidence.behavioralRelevance, desc: 'Runtime traces, logs, and stack frame presence' },
    { label: 'Issue clue relevance', value: evidence.issueClueRelevance, desc: 'Direct identifier matches to error messages' },
    { label: 'Contradiction', value: evidence.contradiction, desc: 'Evidence refuting this location as root cause', isWarning: true },
    { label: 'Uncertainty', value: evidence.uncertainty, desc: 'Remaining epistemic doubt before patching', isWarning: true }
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 text-white p-5 sm:p-6 space-y-6 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Evidence Field</span>
            <span>•</span>
            <span>Empirical Grounding</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <FileCode className="w-4 h-4 text-slate-400" />
            <h4 className="text-base font-extrabold text-white font-mono">{candidate.filePath}</h4>
            <span className="text-xs text-slate-400 font-mono">({candidate.symbol})</span>
            {candidate.isClinicalOrSafetyCritical && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Safety Critical
              </span>
            )}
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Composite Confidence</div>
            <div className="text-lg font-black font-mono text-cyan-400">
              {Math.round(confidence * 100)}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
            {confidence >= 0.7 ? 'HIGH' : confidence >= 0.4 ? 'MED' : 'LOW'}
          </div>
        </div>
      </div>

      {/* Quantitative Evidence Field Metrics Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          <span>Multi-Criteria Relevance & Contradiction Scores:</span>
          <span className="text-[10px] text-slate-500">Scale: 0.00 – 1.00 (Never Fabricated)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {METRIC_ROWS.map((row, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-xl border flex flex-col justify-between space-y-1 ${
                row.isWarning 
                  ? 'bg-slate-950/80 border-slate-800' 
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-300">{row.label}</span>
                {renderMetricValue(row.value)}
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                {row.value !== null ? (
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      row.isWarning 
                        ? (row.value > 0.4 ? 'bg-rose-500' : 'bg-amber-400')
                        : 'bg-gradient-to-r from-cyan-500 to-teal-400'
                    }`}
                    style={{ width: `${Math.min(row.value * 100, 100)}%` }}
                  />
                ) : (
                  <div className="h-full bg-slate-700 w-1/4 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] text-slate-500 leading-tight">{row.desc}</span>
            </div>
          ))}
        </div>

        {/* Provenance note */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
          <strong className="text-slate-300">Evidence Provenance: </strong>
          {evidence.provenance}
        </div>
      </div>

      {/* Supporting vs Contradictory Evidence Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Supporting Evidence Column */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Supporting Evidence (+ Increases Confidence)</span>
          </div>

          <div className="space-y-2">
            {supportingEvidence.length > 0 ? (
              supportingEvidence.map(item => (
                <div key={item.id} className="p-2.5 rounded-xl bg-slate-950 border border-emerald-900/30 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                      {item.source}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      +{item.confidenceContribution.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-slate-200 leading-snug">{item.description}</p>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-xs italic p-3 text-center">
                No supporting evidence collected yet.
              </div>
            )}
          </div>
        </div>

        {/* Contradictory Evidence Column */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider font-mono">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <span>Contradictory Evidence (- Decreases Confidence)</span>
          </div>

          <div className="space-y-2">
            {contradictoryEvidence.length > 0 ? (
              contradictoryEvidence.map(item => (
                <div key={item.id} className="p-2.5 rounded-xl bg-slate-950 border border-rose-900/30 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                      {item.source}
                    </span>
                    <span className="text-[10px] font-mono text-rose-300 font-bold bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800/40">
                      {item.confidenceImpact.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-slate-200 leading-snug">{item.description}</p>
                </div>
              ))
            ) : (
              <div className="text-slate-400 text-xs italic p-3 text-center bg-slate-950/60 rounded-xl border border-slate-800">
                No counter-evidence observed on this node path.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Real Code Extract from Repository (if present) */}
      {candidate.codeSnippet && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <FileCode className="w-3.5 h-3.5" />
              <span>
                Real Repository Extract {candidate.lineNumbers ? `(Lines ${candidate.lineNumbers.start}–${candidate.lineNumbers.end})` : ''}
              </span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Verified Source
            </span>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 overflow-x-auto select-all leading-relaxed whitespace-pre-wrap">
            {candidate.codeSnippet}
          </pre>
        </div>
      )}

      {/* Recommended Next Action */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider">
            Adaptive Next Step:
          </div>
          <div className="text-slate-200">{candidate.recommendedAction}</div>
        </div>

        {onRequestEvidence && (
          <button
            onClick={() => onRequestEvidence('Acquire Next Evidence')}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-md"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Acquire Next Evidence</span>
          </button>
        )}
      </div>

    </div>
  );
};
