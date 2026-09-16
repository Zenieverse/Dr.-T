// =========================================================================
// DR. T CINEMA — QUALITY & SAFETY SUPERVISOR CONSOLE
// Multi-dimensional pre-distribution audit across factuality, safety, & access
// =========================================================================

import React from 'react';
import { QualityReport, HumanApprovalGate } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Award, 
  FileCheck2, 
  FileLock2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface QAConsoleProps {
  report: QualityReport;
  approvals: HumanApprovalGate[];
  onApproveStage?: (stageId: string) => void;
}

export const QAConsole: React.FC<QAConsoleProps> = ({
  report,
  approvals,
  onApproveStage
}) => {
  const scoreCategories = [
    { label: 'FACTUALITY', score: report.factualityScore, color: 'text-amber-400', bar: 'bg-amber-400' },
    { label: 'SOURCE QUALITY', score: report.sourceQualityScore, color: 'text-sky-400', bar: 'bg-sky-400' },
    { label: 'SAFETY (CLINICAL)', score: report.safetyScore, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { label: 'NARRATIVE', score: report.narrativeScore, color: 'text-purple-400', bar: 'bg-purple-400' },
    { label: 'PRODUCTION', score: report.productionScore, color: 'text-rose-400', bar: 'bg-rose-400' },
    { label: 'ACCESSIBILITY', score: report.accessibilityScore, color: 'text-cyan-400', bar: 'bg-cyan-400' },
  ];

  return (
    <div className="space-y-6 text-slate-200">
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Quality & Safety Supervisory Console</h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              OVERALL {report.overallScore}/100
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal production-quality indicator auditing clinical safety, peer-reviewed factuality, and copyright compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            CERTIFIED FOR PRODUCTION
          </span>
        </div>
      </div>

      {/* Score Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {scoreCategories.map((sc) => (
          <div key={sc.label} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
              {sc.label}
            </div>
            <div className={`text-2xl font-black font-mono mt-1 ${sc.color}`}>
              {sc.score}
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full ${sc.bar} rounded-full`}
                style={{ width: `${sc.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Supervisory Findings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Factuality & Evidence Audit */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2 font-bold">
            <Award className="w-4 h-4" /> Factuality & Literature Audit
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.factualityNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Medical Safety & Decision Support */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-bold">
            <ShieldCheck className="w-4 h-4" /> Clinical Decision-Support Boundaries
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.medicalSafetyNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright & Asset Provenance */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-sky-400 flex items-center gap-2 font-bold">
            <FileLock2 className="w-4 h-4" /> Copyright & Intellectual Property
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.copyrightNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Accessibility & Compliance */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 flex items-center gap-2 font-bold">
            <Sparkles className="w-4 h-4" /> Accessibility (WCAG 2.1 AA & Subtitles)
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.accessibilityNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Human Approval Gates Trail */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          Human-in-the-Loop Approval Checkpoints
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {approvals.map((gate) => (
            <div 
              key={gate.id}
              className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2 text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono font-bold text-slate-200">
                    {gate.stage.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {gate.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 italic">
                  "{gate.notes}"
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>By: {gate.approvedBy || 'Director'}</span>
                <span>{gate.timestamp?.split('T')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
