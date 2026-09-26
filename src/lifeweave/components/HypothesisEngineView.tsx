import React, { useState } from 'react';
import { Hypothesis, EvidenceRequest } from '../types/lifeweaveTypes';
import { 
  Cpu, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  Layers, 
  Target, 
  Activity, 
  Lightbulb,
  FileSearch,
  Zap
} from 'lucide-react';

interface HypothesisEngineViewProps {
  hypotheses: Hypothesis[];
  evidenceRequests: EvidenceRequest[];
  selectedHypothesisId?: string;
  onSelectHypothesis: (hypothesis: Hypothesis) => void;
  onExecuteEvidenceRequest: (request: EvidenceRequest) => void;
}

export const HypothesisEngineView: React.FC<HypothesisEngineViewProps> = ({
  hypotheses,
  evidenceRequests,
  selectedHypothesisId,
  onSelectHypothesis,
  onExecuteEvidenceRequest
}) => {
  const [activeHypothesis, setActiveHypothesis] = useState<Hypothesis>(
    hypotheses.find(h => h.id === selectedHypothesisId) || hypotheses[0]
  );

  const handleSelect = (hypo: Hypothesis) => {
    setActiveHypothesis(hypo);
    onSelectHypothesis(hypo);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white p-5 sm:p-6 space-y-6 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Hypothesis Engine & Adaptive Acquisition</span>
            <span>•</span>
            <span>Competing Hypotheses Matrix</span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">
            Active Competing Explanations & Evidence Prioritization
          </h3>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-xs font-mono font-bold self-start sm:self-auto">
          {hypotheses.length} Competing Hypotheses
        </span>
      </div>

      {/* Hypotheses Ribbon / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {hypotheses.map(hypo => {
          const isSelected = activeHypothesis.id === hypo.id;
          return (
            <div
              key={hypo.id}
              onClick={() => handleSelect(hypo)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                  {hypo.code}
                </span>
                <span className="font-mono text-xs font-black text-cyan-400">
                  {Math.round(hypo.confidence * 100)}% Conf
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-white leading-snug">{hypo.title}</h4>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                  {hypo.targetFile}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(hypo.confidence * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Hypothesis Detailed Inspector */}
      {activeHypothesis && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold">
                <span>Selected: {activeHypothesis.code}</span>
                <span>•</span>
                <span>Target: {activeHypothesis.targetFile}</span>
              </div>
              <h4 className="text-base font-extrabold text-white mt-0.5">
                {activeHypothesis.title}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Epistemic Uncertainty</span>
              <span className="font-mono text-sm font-black text-amber-400">
                {Math.round(activeHypothesis.uncertainty * 100)}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-3 rounded-xl border border-slate-800">
            {activeHypothesis.explanation}
          </p>

          {/* Supporting and Contradictory Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Primary Supporting Points:
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {activeHypothesis.supportingSummary.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                Contradictory / Unsettled Points:
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {activeHypothesis.contradictorySummary.length > 0 ? (
                  activeHypothesis.contradictorySummary.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))
                ) : (
                  <li className="italic text-slate-500">No strong contradictory evidence identified</li>
                )}
              </ul>
            </div>
          </div>

          {/* Missing Evidence & Next Step */}
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs space-y-1">
            <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider block">
              Missing Evidence To Verify {activeHypothesis.code}:
            </span>
            <p className="text-slate-200 text-[11px] leading-snug">{activeHypothesis.missingEvidence}</p>
          </div>
        </div>
      )}

      {/* Adaptive Evidence Acquisition Requests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Adaptive Evidence Acquisition Queue:</span>
          </div>
          <span className="text-[10px] text-slate-500">
            Heuristic: (EvidenceValue × InfoGain × Relevance) / (Cost + Uncertainty + ε)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {evidenceRequests.map(req => (
            <div 
              key={req.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-white block">{req.action}</span>
                  <span className="text-[10px] font-mono text-cyan-400 truncate max-w-[200px] block">
                    {req.targetNode}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Priority: {(req.priorityScore * 10).toFixed(1)}/10
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug">
                <strong>Why: </strong>{req.rationale}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                <span>Value: <strong className="text-emerald-400">{req.expectedValue}</strong></span>
                <span>Cost: <strong className="text-slate-300">{req.estimatedCost}</strong></span>
                <button
                  onClick={() => onExecuteEvidenceRequest(req)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <FileSearch className="w-3 h-3" />
                  <span>Execute Action</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
