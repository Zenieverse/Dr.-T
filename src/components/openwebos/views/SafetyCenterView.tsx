import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  Hash, 
  Filter,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { AuditLogEntry } from '../../../webmcp/types';
import { CLASSIFICATIONS } from '../../../webmcp/security';

interface SafetyCenterViewProps {
  auditLogs: AuditLogEntry[];
}

export const SafetyCenterView: React.FC<SafetyCenterViewProps> = ({ auditLogs }) => {
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(l => {
    if (filterRisk !== 'ALL' && l.riskLevel !== filterRisk) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-black text-white uppercase tracking-wide">
            WebMCP Safety &amp; Trust Center
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Zero-trust boundary architecture ensuring safe tool discovery, schema sanitization, human authorization, and immutable cryptographic audit trails.
        </p>
      </div>

      {/* Safety Pipeline Visual Flow */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4 shadow-xl">
        <div className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>ZERO-TRUST EXECUTION PIPELINE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono text-rose-400 font-bold">STAGE 1</div>
            <div className="text-white font-bold">Untrusted Input</div>
            <p className="text-[10px] text-slate-500">Agent string or RPC payload</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono text-amber-400 font-bold">STAGE 2</div>
            <div className="text-white font-bold">Schema Validation</div>
            <p className="text-[10px] text-slate-500">JSON Schema Draft 7 sanitized</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono text-cyan-400 font-bold">STAGE 3</div>
            <div className="text-white font-bold">Tool Permission</div>
            <p className="text-[10px] text-slate-500">READ vs ACTION check</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-1.5">
            <div className="text-[10px] font-mono text-indigo-400 font-bold">STAGE 4</div>
            <div className="text-white font-bold">Human Approval</div>
            <p className="text-[10px] text-indigo-300">Mandatory for sensitive</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono text-teal-400 font-bold">STAGE 5</div>
            <div className="text-white font-bold">Local Execution</div>
            <p className="text-[10px] text-slate-500">Sandboxed state mutation</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1.5">
            <div className="text-[10px] font-mono text-emerald-400 font-bold">STAGE 6</div>
            <div className="text-white font-bold">Audit Log Chain</div>
            <p className="text-[10px] text-emerald-400">Cryptographic hash linked</p>
          </div>
        </div>
      </div>

      {/* Classification Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span>TOOL CLASSIFICATION &amp; ACCESS CONTROL MATRIX</span>
          </div>
          <span className="text-xs font-mono text-slate-400">12 tools declared</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-400">READ Tools (6)</span>
              <span className="text-[10px] font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                Auto-Allowed
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Query operations with zero state mutation side-effects.
            </p>
            <div className="space-y-1 pt-1 font-mono text-[10px] text-slate-300">
              <div>• search_options()</div>
              <div>• get_option_details()</div>
              <div>• compare_options()</div>
              <div>• rank_options()</div>
              <div>• calculate_budget()</div>
              <div>• summarize_workspace()</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-400">ACTION Tools (4)</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                Low/Med Risk
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Workspace mutations that add/export local artifacts.
            </p>
            <div className="space-y-1 pt-1 font-mono text-[10px] text-slate-300">
              <div>• update_artifact()</div>
              <div>• add_to_canvas()</div>
              <div>• save_workspace()</div>
              <div>• export_artifact()</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-rose-400">SENSITIVE Tools (2)</span>
              <span className="text-[10px] font-mono bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
                Explicit Sign-Off
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              High-consequence actions requiring direct human confirmation dialog.
            </p>
            <div className="space-y-1 pt-1 font-mono text-[10px] text-slate-300">
              <div className="text-rose-300 font-bold">• create_artifact()</div>
              <div className="text-rose-300 font-bold">• remove_from_canvas()</div>
            </div>
          </div>
        </div>
      </div>

      {/* Immutable Audit Log */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Immutable Cryptographic Audit Trail
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hash-chained record of all tool calls, approval decisions, and executed payloads.
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
            {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map(r => (
              <button
                key={r}
                onClick={() => setFilterRisk(r)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                  filterRisk === r ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">ACTOR</th>
                <th className="py-2.5 px-3">TOOL</th>
                <th className="py-2.5 px-3">ARGUMENTS SUMMARY</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">HASH SIGNATURE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No audit records logged yet. Execute a tool or demo to see the cryptographic hash chain.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/60 transition">
                    <td className="py-2.5 px-3 text-slate-500 text-[10px]">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.actor === 'HUMAN'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : log.actor === 'AGENT'
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {log.actor}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">
                      {log.toolName ? `${log.toolName}()` : log.action}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400 max-w-xs truncate font-sans">
                      {log.argumentsSummary}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.approvalStatus === 'APPROVED' || log.approvalStatus === 'AUTO_ALLOWED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {log.approvalStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[10px] text-teal-400 flex items-center space-x-1">
                      <Hash className="w-3 h-3 text-teal-500" />
                      <span>{log.hash}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
