import React, { useState } from 'react';
import { MemoryLanternItem } from '../types';
import { 
  SearchCheck, 
  X, 
  Trash2, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle,
  Lock,
  CheckCircle,
  Clock,
  Tag,
  Users
} from 'lucide-react';

interface MemoryInspectorModalProps {
  memory: MemoryLanternItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRevokeAccess: (memoryId: string) => void;
  onRestoreAccess: (memoryId: string) => void;
  onDeletePermanently: (memoryId: string) => void;
}

export const MemoryInspectorModal: React.FC<MemoryInspectorModalProps> = ({
  memory,
  isOpen,
  onClose,
  onRevokeAccess,
  onRestoreAccess,
  onDeletePermanently
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !memory) return null;

  const isRevoked = Boolean(memory.revokedAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <SearchCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Memory Inspector & Provenance Audit
              </h3>
              <p className="text-xs text-slate-400">
                Inspect raw record data, verify facts, and manage access permissions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Memory Metadata Status Card */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-amber-200">{memory.title}</h4>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
              isRevoked 
                ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
            }`}>
              {isRevoked ? 'PERMISSION REVOKED' : 'ACTIVE IN RETRIEVAL'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div><strong>ID:</strong> <span className="font-mono text-[10px] text-slate-400">{memory.id}</span></div>
            <div><strong>Privacy:</strong> {memory.privacyLevel}</div>
            <div><strong>Category:</strong> {memory.category}</div>
            <div><strong>Created:</strong> {new Date(memory.createdAt).toLocaleDateString()}</div>
          </div>

          {memory.peopleRemembered && memory.peopleRemembered.length > 0 && (
            <div className="text-xs text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span><strong>People:</strong> {memory.peopleRemembered.join(', ')}</span>
            </div>
          )}

          {memory.dateOrPeriod && (
            <div className="text-xs text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span><strong>Timeframe:</strong> {memory.dateOrPeriod}</span>
            </div>
          )}
        </div>

        {/* Verified Facts vs Freeform Narrative */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Structured Factual Details (Immutable Anchors)
          </h5>

          {(memory.meaningfulDetails || []).length === 0 ? (
            <div className="text-xs text-slate-500 italic p-2 bg-slate-950/40 rounded-xl">
              No structured recipes, proverbs, or traditions attached.
            </div>
          ) : (
            <div className="space-y-2">
              {memory.meaningfulDetails.map((d, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                    <span>{d.label}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{d.type.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-xs text-slate-200">{d.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Raw Story Excerpt */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Preserved Narrative
          </h5>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 max-h-36 overflow-y-auto leading-relaxed">
            {memory.story}
          </div>
        </div>

        {/* Permission & Deletion Controls */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-200">
                Permission Management
              </div>
              <div className="text-[11px] text-slate-400">
                Revoking access excludes this memory from AI retrieval without deleting it.
              </div>
            </div>

            {isRevoked ? (
              <button
                type="button"
                onClick={() => onRestoreAccess(memory.id)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Restore Retrieval Access</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onRevokeAccess(memory.id)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-700/60 hover:bg-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Revoke AI Access</span>
              </button>
            )}
          </div>

          <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl flex items-center justify-between gap-3">
            <div className="text-[11px] text-rose-300">
              {confirmDelete 
                ? 'Are you certain? This action cannot be undone.' 
                : 'Permanently delete this memory record and all associated metadata.'}
            </div>

            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => { onDeletePermanently(memory.id); onClose(); }}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-700/60 hover:bg-rose-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
