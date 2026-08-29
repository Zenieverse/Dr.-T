import React from 'react';
import { ShieldAlert, AlertTriangle, Check, X, Terminal } from 'lucide-react';
import { ToolRiskLevel } from '../../../webmcp/types';

interface ApprovalModalProps {
  isOpen: boolean;
  toolName: string;
  args: any;
  reason: string;
  riskLevel: ToolRiskLevel;
  onApprove: () => void;
  onReject: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  toolName,
  args,
  reason,
  riskLevel,
  onApprove,
  onReject,
}) => {
  if (!isOpen) return null;

  const riskBadgeMap: Record<ToolRiskLevel, string> = {
    LOW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    HIGH: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  };
  const riskBadge = riskBadgeMap[riskLevel] || 'bg-slate-500/20 text-slate-400 border-slate-500/40';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="approval-title"
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 id="approval-title" className="text-base font-bold text-white tracking-wide">
                AGENT APPROVAL REQUIRED
              </h2>
              <p className="text-xs text-slate-400 font-mono">WebMCP Security Intercept</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${riskBadge}`}>
            {riskLevel} RISK
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-sm">
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Target Tool
            </label>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-400">
              <Terminal className="w-4 h-4 text-cyan-500" />
              <span className="font-bold">{toolName}()</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Proposed Action &amp; Reason
            </label>
            <p className="text-slate-200 text-sm leading-relaxed bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
              {reason}
            </p>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Validated Arguments Payload
            </label>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 max-h-36 overflow-y-auto whitespace-pre-wrap">
              {JSON.stringify(args, null, 2)}
            </pre>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Consequential state actions require explicit human confirmation. Approving will allow the agent to execute this tool directly against the shared workspace.
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            onClick={onReject}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <X className="w-4 h-4" />
            <span>Reject</span>
          </button>
          <button
            onClick={onApprove}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-500/25 transition transform active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Approve &amp; Execute</span>
          </button>
        </div>
      </div>
    </div>
  );
};
