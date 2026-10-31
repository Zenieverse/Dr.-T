import React from 'react';
import { PermissionManifest } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Check, 
  Database, 
  Cpu, 
  Lock,
  AlertTriangle
} from 'lucide-react';

interface PermissionGateModalProps {
  manifest: PermissionManifest | null;
  isOpen: boolean;
  onApprove: () => void;
  onDeny: () => void;
}

export const PermissionGateModal: React.FC<PermissionGateModalProps> = ({
  manifest,
  isOpen,
  onApprove,
  onDeny
}) => {
  if (!isOpen || !manifest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Permission Approval Required
              </h3>
              <p className="text-xs text-slate-400">
                Lantern Keeper Personal AI — Consequential Action Gate
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDeny}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Summary Box */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Requested Tool:</span>
            <span className="font-mono text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/60">
              {manifest.toolName}
            </span>
          </div>

          <div className="text-xs space-y-1">
            <span className="text-slate-400">Action Scope:</span>
            <p className="text-slate-200 leading-relaxed font-medium">
              {manifest.scopeDescription}
            </p>
          </div>

          <div className="text-xs space-y-1 pt-1 border-t border-slate-800">
            <span className="text-slate-400">Consequential Impact:</span>
            <p className="text-slate-300">
              {manifest.consequentialImpact}
            </p>
          </div>
        </div>

        {/* Accessed Memories Manifest */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Memories Targeted for Access ({manifest.requiredMemoryTitles.length})</span>
            </span>
            <span className="text-[10px] text-slate-400">User-Isolated</span>
          </div>

          <div className="max-h-32 overflow-y-auto space-y-1.5 p-2 bg-slate-950/50 rounded-xl border border-slate-800">
            {manifest.requiredMemoryTitles.length === 0 ? (
              <div className="text-[11px] text-slate-500 italic p-1">No specific memory IDs targeted.</div>
            ) : (
              manifest.requiredMemoryTitles.map((title, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-center gap-2 px-2 py-1 bg-slate-900 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span className="truncate">{title}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Privacy Invariant Guarantee */}
        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-700/40 text-[11px] text-indigo-200 flex items-start gap-2">
          <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>Privacy Guarantee:</strong> Memory contents are never committed to permanent logs. 
            Only the approval outcome and memory count are recorded in the audit trail.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onDeny}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Deny & Cancel
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Approve & Execute</span>
          </button>
        </div>

      </div>
    </div>
  );
};
