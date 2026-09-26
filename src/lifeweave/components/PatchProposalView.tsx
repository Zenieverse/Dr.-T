import React, { useState } from 'react';
import { PatchProposal, ValidationResult } from '../types/lifeweaveTypes';
import { 
  GitPullRequest, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  FileCode, 
  RotateCcw, 
  Check, 
  X, 
  Search, 
  Play, 
  Code2, 
  Lock,
  Layers
} from 'lucide-react';

interface PatchProposalViewProps {
  patch: PatchProposal;
  validationResult?: ValidationResult;
  onApprovePatch: (notes?: string) => void;
  onRejectPatch: (reason: string) => void;
  onRequestMoreEvidence: () => void;
  onRunTestsAgain: () => void;
}

export const PatchProposalView: React.FC<PatchProposalViewProps> = ({
  patch,
  validationResult,
  onApprovePatch,
  onRejectPatch,
  onRequestMoreEvidence,
  onRunTestsAgain
}) => {
  const [activeDiffFileIdx, setActiveDiffFileIdx] = useState<number>(0);
  const [rejectReasonInput, setRejectReasonInput] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [approvalNotes, setApprovalNotes] = useState<string>('');

  const activeDiff = patch.diffs[activeDiffFileIdx] || patch.diffs[0];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HUMAN_REVIEW_REQUIRED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50 flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>HIGH-IMPACT / HUMAN REVIEW REQUIRED</span>
          </span>
        );
      case 'HIGH':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50">HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">MEDIUM RISK</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">LOW RISK</span>;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white p-5 sm:p-6 space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <GitPullRequest className="w-4 h-4 text-cyan-400" />
            <span>Patch Proposal & Invariant Engine</span>
            <span>•</span>
            <span>Minimal Validated Repair</span>
          </div>
          <h3 className="text-xl font-black text-white mt-1">
            Smallest Justified Change & Validation Plan
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          {getRiskBadge(patch.riskLevel)}
          <span className="text-xs font-mono text-slate-400">
            Status: <strong className="text-white uppercase">{patch.humanApprovalStatus}</strong>
          </span>
        </div>
      </div>

      {/* Safety Boundary Critical Alert Banner */}
      {patch.isHumanReviewRequired && (
        <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-rose-100 font-extrabold uppercase font-mono tracking-wider">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Autonomous Approval Disabled — Human Review Required</span>
          </div>
          <p className="leading-relaxed">
            Human review required because this change may affect a health/safety-critical component ({patch.clinicalSafetyImpactReason || 'Clinical reasoning or safety policies'}). The patch cannot be merged autonomously.
          </p>
        </div>
      )}

      {/* Change Overview & Invariant Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        
        {/* Description & Scope */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Change Description:
          </span>
          <p className="text-slate-200 leading-snug">{patch.changeDescription}</p>
          
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            <strong>Scope Evaluation: </strong>{patch.scopeEvaluation}
          </div>
        </div>

        {/* Expected Invariant (Core LIFEWEAVE Principle) */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/60 space-y-2">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            System Invariant That Must Remain True:
          </span>
          <p className="text-cyan-100 font-semibold leading-relaxed italic bg-slate-950/60 p-2.5 rounded-xl border border-cyan-900/60">
            "{patch.invariantStatement}"
          </p>
        </div>

      </div>

      {/* Integrated Diff Viewer */}
      {activeDiff && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-300">File Diff:</span>
              <span className="text-cyan-300 font-bold">{activeDiff.path}</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px]">
              <span className="text-emerald-400 font-bold">+{activeDiff.addedLinesCount} lines</span>
              <span className="text-rose-400 font-bold">-{activeDiff.removedLinesCount} lines</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            
            {/* Original Code (Before) */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                <span>ORIGINAL (BEFORE)</span>
                <span className="text-rose-400">-{activeDiff.removedLinesCount}</span>
              </div>
              <pre className="p-2.5 rounded-xl bg-slate-950 text-rose-300 text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                {activeDiff.originalCode}
              </pre>
            </div>

            {/* Proposed Code (After) */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                <span>PROPOSED PATCH (AFTER)</span>
                <span className="text-emerald-400">+{activeDiff.addedLinesCount}</span>
              </div>
              <pre className="p-2.5 rounded-xl bg-slate-950 text-emerald-300 text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                {activeDiff.proposedCode}
              </pre>
            </div>

          </div>
        </div>
      )}

      {/* Validation Engine Results Bar */}
      {validationResult && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-slate-400 uppercase">Automated Validation Test Suite</span>
            <span className={`px-2.5 py-0.5 rounded-full ${
              validationResult.overallStatus === 'PASS' 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {validationResult.overallStatus} ({validationResult.testSummary.passed}/{validationResult.testSummary.executed} Passed)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Targeted test:</span>
              <span className="text-emerald-400 font-bold">{validationResult.targetedPass ? 'PASS' : 'FAIL'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Regression tests:</span>
              <span className="text-emerald-400 font-bold">{validationResult.regressionPass ? 'PASS' : 'FAIL'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Invariant check:</span>
              <span className="text-emerald-400 font-bold">{validationResult.invariantPass ? 'PASS' : 'FAIL'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Security scan:</span>
              <span className="text-emerald-400 font-bold">{validationResult.securityPass ? 'PASS' : 'FAIL'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Human Review Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onApprovePatch(approvalNotes)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Approve Patch</span>
          </button>

          <button
            onClick={() => setShowRejectModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Reject Patch</span>
          </button>

          <button
            onClick={onRequestMoreEvidence}
            className="px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Request More Evidence</span>
          </button>
        </div>

        <button
          onClick={onRunTestsAgain}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center space-x-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Run Tests Again</span>
        </button>
      </div>

      {/* Rejection Modal Input */}
      {showRejectModal && (
        <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-800 text-xs space-y-3">
          <span className="font-bold text-rose-200 block">
            Provide Rejection Reason & Hypothesis Invalidation Feedback:
          </span>
          <textarea
            value={rejectReasonInput}
            onChange={(e) => setRejectReasonInput(e.target.value)}
            placeholder="e.g. Fails boundary check for encrypted clinical payloads; root cause occurs upstream in normalizer."
            className="w-full bg-slate-900 border border-rose-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-hidden"
            rows={3}
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onRejectPatch(rejectReasonInput);
                setShowRejectModal(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Confirm Rejection & Enter Recovery Loop
            </button>
            <button
              onClick={() => setShowRejectModal(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
