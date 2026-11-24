import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Plus,
  RefreshCw,
  Shield,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  HatBridgeCommitmentStatus,
  HatBridgeConflict,
  HatBridgeContextItem,
  HatBridgeReentryBrief,
  HatBridgeRole,
  HatBridgeTimeBlock,
} from '../../../types/hatbridgeTypes';
import { DailyWorkloadOverview } from '../utils/hatbridgeEngine';

// ============================================================================
// SECTION 2: TODAY BRIDGE — CROSS-ROLE DAILY OVERVIEW
// ============================================================================
interface TodayBridgeProps {
  roles: HatBridgeRole[];
  contextItems: HatBridgeContextItem[];
  timeBlocks: HatBridgeTimeBlock[];
  conflicts: HatBridgeConflict[];
  workload: DailyWorkloadOverview;
  onUpdateItemStatus: (itemId: string, status: HatBridgeCommitmentStatus) => void;
  onApplyConflictResolution: (conflict: HatBridgeConflict) => void;
  onSelectRoleBrief: (roleId: string) => void;
  onQuickCaptureClick: () => void;
}

const STATUS_ORDER: Array<{ key: HatBridgeCommitmentStatus; label: string; description: string }> = [
  { key: 'urgent', label: 'Urgent', description: 'Needs timely focus today' },
  { key: 'important', label: 'Important', description: 'High-impact responsibilities' },
  { key: 'scheduled', label: 'Scheduled', description: 'Timed meetings or anchored blocks' },
  { key: 'waiting', label: 'Waiting', description: 'Pending response or external dependency' },
  { key: 'deferred', label: 'Deferred', description: 'Intentionally postponed to protect capacity' },
  { key: 'completed', label: 'Completed', description: 'Finished commitments' },
];

export const HatBridgeTodaySection: React.FC<TodayBridgeProps> = ({
  roles,
  contextItems,
  timeBlocks,
  conflicts,
  workload,
  onUpdateItemStatus,
  onApplyConflictResolution,
  onSelectRoleBrief,
  onQuickCaptureClick,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | HatBridgeCommitmentStatus>('all');
  const [dismissedConflictIds, setDismissedConflictIds] = useState<string[]>([]);

  const roleMap = new Map(roles.map((r) => [r.id, r]));
  const visibleConflicts = conflicts.filter((c) => !dismissedConflictIds.includes(c.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">Today Bridge — Cross-Role Overview</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Calm daily view bridging your work commitments, follow-ups, and protected personal boundaries.
          </p>
        </div>
        <button
          type="button"
          onClick={onQuickCaptureClick}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Capture Thought / Task</span>
        </button>
      </div>

      {/* Concise Daily Briefing & Human Limits Strip */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Concise Daily Briefing · <span className="font-mono tabular-nums">{workload.date}</span>
            </div>
            <p className="text-sm text-slate-800 mt-1">{workload.calmNotice}</p>
          </div>
          <div className="flex items-center gap-6 shrink-0 text-xs font-mono tabular-nums">
            <div>
              <div className="text-slate-500">Planned Work</div>
              <div className={`text-base font-bold ${workload.isOverloaded ? 'text-amber-700' : 'text-slate-900'}`}>
                {(workload.committedMinutes / 60).toFixed(1)}h / {(workload.sustainableMinutes / 60).toFixed(0)}h
              </div>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <div className="text-slate-500">Protected Time</div>
              <div className="text-base font-bold text-emerald-700">
                {(workload.protectedMinutes / 60).toFixed(1)}h
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Role Conflict Alerts (Never auto-reschedules!) */}
      {visibleConflicts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Schedule Conflicts Requiring Your Review ({visibleConflicts.length})</span>
          </h3>
          {visibleConflicts.map((c) => (
            <div key={c.id} className="rounded-2xl border border-amber-300 bg-amber-50/60 p-4 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-slate-900">{c.title}</div>
                  <p className="text-xs text-slate-700 mt-1">{c.explanation}</p>
                </div>
                <span className="text-[11px] font-mono font-semibold text-amber-900 shrink-0">
                  {c.involvesProtectedTime ? 'Protected Boundary Overlap' : 'Cross-Role Overlap'}
                </span>
              </div>
              <div className="text-xs text-slate-800 bg-white/80 rounded-xl border border-amber-200/80 p-3">
                <span className="font-semibold">Suggested Resolution (requires your approval): </span>
                {c.suggestedResolution}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onApplyConflictResolution(c)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Approve Suggested Deferral
                </button>
                <button
                  type="button"
                  onClick={() => setDismissedConflictIds((prev) => [...prev, c.id])}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Keep As-Is
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All ({contextItems.length})
        </button>
        {STATUS_ORDER.map((s) => {
          const count = contextItems.filter((i) => i.commitmentStatus === s.key).length;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setStatusFilter(s.key)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                statusFilter === s.key
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Commitments List + Protected Time Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {contextItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
              <p className="text-sm text-slate-700 font-medium">No commitments captured yet.</p>
              <p className="text-xs text-slate-500">Capture a task, meeting note, or follow-up before switching hats.</p>
              <button
                type="button"
                onClick={onQuickCaptureClick}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Capture First Item
              </button>
            </div>
          ) : (
            STATUS_ORDER.filter((s) => statusFilter === 'all' || statusFilter === s.key).map((group) => {
              const items = contextItems.filter((i) => i.commitmentStatus === group.key);
              if (items.length === 0) return null;

              return (
                <div key={group.key} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">{group.label}</span>
                      <span className="text-xs text-slate-500 ml-2">· {group.description}</span>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-slate-500">{items.length}</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => {
                      const roleName = roleMap.get(item.roleId)?.name || 'Unassigned Hat';
                      return (
                        <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/60">
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => onSelectRoleBrief(item.roleId)}
                              className="text-left text-sm font-semibold text-slate-900 hover:text-teal-700 cursor-pointer"
                            >
                              {item.title}
                            </button>
                            <p className="text-xs text-slate-600">{item.content}</p>
                            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                              {roleName}
                              {item.dueDate ? ` · Due ${item.dueDate}` : ''}
                              {item.startTime && item.endTime ? ` (${item.startTime}–${item.endTime})` : ''}
                              {item.waitingOnPerson ? ` · Waiting on ${item.waitingOnPerson}` : ''}
                              {item.jiraIssueKey ? ` · Jira ${item.jiraIssueKey}` : ''}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <select
                              aria-label={`Change status for ${item.title}`}
                              value={item.commitmentStatus}
                              onChange={(e) => onUpdateItemStatus(item.id, e.target.value as HatBridgeCommitmentStatus)}
                              className="min-h-[44px] px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
                            >
                              {STATUS_ORDER.map((opt) => (
                                <option key={opt.key} value={opt.key}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Protected Personal Time Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Protected Human Time</span>
            </div>
            {timeBlocks.length === 0 ? (
              <p className="text-xs text-slate-500">
                No protected personal or recovery blocks defined yet. Add family, rest, or recovery time in Time Protection.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {timeBlocks.map((b) => (
                  <div key={b.id} className="py-2.5 space-y-0.5">
                    <div className="text-xs font-semibold text-slate-900">{b.title}</div>
                    <div className="text-[11px] font-mono tabular-nums text-slate-500">
                      {b.category} · {b.date} · {b.startTime}–{b.endTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SECTION 3: THE SIGNATURE FEATURE — RE-ENTRY BRIEF
// ============================================================================
interface ReentryBriefProps {
  roles: HatBridgeRole[];
  selectedRoleId: string;
  onChangeRole: (roleId: string) => void;
  brief: HatBridgeReentryBrief | null;
  onGenerateBrief: (roleId: string, useGemini: boolean) => Promise<void>;
  onSaveBrief: (brief: HatBridgeReentryBrief) => void;
  onConfirmBrief: (briefId: string, rating?: 1 | 2 | 3 | 4 | 5) => void;
  onDismissBrief: (briefId: string) => void;
  onConvertActionToTask: (roleId: string, actionText: string) => void;
  onAskAiForClarification: (prompt: string) => void;
  aiLoading: boolean;
  aiConsentGranted: boolean;
  aiNotice: string | null;
}

export const HatBridgeReentryBriefSection: React.FC<ReentryBriefProps> = ({
  roles,
  selectedRoleId,
  onChangeRole,
  brief,
  onGenerateBrief,
  onSaveBrief,
  onConfirmBrief,
  onDismissBrief,
  onConvertActionToTask,
  onAskAiForClarification,
  aiLoading,
  aiConsentGranted,
  aiNotice,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<Partial<HatBridgeReentryBrief>>({});
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);

  const activeRoles = roles.filter((r) => !r.archived);
  const currentRole = roles.find((r) => r.id === selectedRoleId) || activeRoles[0];

  const beginEdit = () => {
    if (!brief) return;
    setEditedFields({
      whatWasWorkingOn: brief.whatWasWorkingOn,
      lastMeaningfulUpdate: brief.lastMeaningfulUpdate,
      decisionsAlreadyMade: brief.decisionsAlreadyMade,
      whatRemainsUnfinished: brief.whatRemainsUnfinished,
      whoIsWaiting: brief.whoIsWaiting,
      nextMeaningfulAction: brief.nextMeaningfulAction,
      whatCanSafelyWait: brief.whatCanSafelyWait,
      deadlineNotToMiss: brief.deadlineNotToMiss,
    });
    setIsEditing(true);
  };

  const commitEdit = () => {
    if (!brief) return;
    onSaveBrief({
      ...brief,
      ...editedFields,
      status: 'saved',
      userEdited: true,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const EIGHT_QUESTIONS: Array<{
    key: keyof HatBridgeReentryBrief;
    label: string;
    originLabel: string;
  }> = [
    { key: 'whatWasWorkingOn', label: '1. What was I working on?', originLabel: 'User-Recorded & Linked Source' },
    { key: 'lastMeaningfulUpdate', label: '2. Last relevant activity / meaningful update', originLabel: 'Verified Source / User Note' },
    { key: 'decisionsAlreadyMade', label: '3. Confirmed decisions & rationale', originLabel: 'User-Recorded Decisions' },
    { key: 'whatRemainsUnfinished', label: '4. Unfinished commitments', originLabel: 'User Commitments & Jira Issues' },
    { key: 'whoIsWaiting', label: '5. Who is waiting for a response?', originLabel: 'User-Recorded Dependency' },
    { key: 'nextMeaningfulAction', label: '6. Suggested next actionable step', originLabel: brief?.generatedBy === 'gemini' ? 'AI-Synthesized from Records' : 'Handoff / Deterministic Record' },
    { key: 'whatCanSafelyWait', label: '7. Items that can safely wait', originLabel: 'User-Deferred / Low-Urgency Items' },
    { key: 'deadlineNotToMiss', label: '8. Deadlines or commitments not to miss', originLabel: 'Verified Due Dates Only' },
  ];

  const verifiedSourceRefs = (brief?.sourceReferences || []).filter((s) => s.kind === 'jira' || s.kind === 'confluence');
  const userRecordedFacts = (brief?.observedFacts || []).filter((f) => !f.startsWith('Jira ') && !f.startsWith('Confluence '));
  const verifiedSourceFacts = (brief?.observedFacts || []).filter((f) => f.startsWith('Jira ') || f.startsWith('Confluence '));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">Re-entry Brief</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Resume any hat immediately from grounded records—no guesswork, no fabricated deadlines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {activeRoles.length > 0 && (
            <select
              aria-label="Choose Hat for Re-entry Brief"
              value={currentRole?.id || ''}
              onChange={(e) => onChangeRole(e.target.value)}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
            >
              {activeRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}
          {currentRole && (
            <button
              type="button"
              onClick={() => onGenerateBrief(currentRole.id, false)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rebuild from Records</span>
            </button>
          )}
          {currentRole && (
            <button
              type="button"
              disabled={aiLoading || !aiConsentGranted}
              onClick={() => onGenerateBrief(currentRole.id, true)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-45 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              title={aiConsentGranted ? 'Synthesize with server-side Gemini AI' : 'Enable AI consent in Settings & Privacy first'}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiLoading ? 'Synthesizing...' : 'Gemini AI Synthesis'}</span>
            </button>
          )}
        </div>
      </div>

      {aiNotice && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          {aiNotice}
        </div>
      )}

      {!currentRole ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          Create or select a hat in My Hats first to generate a Re-entry Brief.
        </div>
      ) : !brief ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
          <p className="text-sm font-medium text-slate-800">Ready to prepare Re-entry Brief for {currentRole.name}</p>
          <button
            type="button"
            onClick={() => onGenerateBrief(currentRole.id, false)}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
          >
            Generate Re-entry Brief
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {/* Brief Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-teal-800 font-bold">
                Current Hat: {brief.roleName}
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Welcome back to {brief.roleName} mode.</h3>
              <div className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                Status: {brief.status.toUpperCase()} · Grounded via {brief.generatedBy === 'gemini' ? 'Gemini AI (Verified)' : 'Deterministic Local Context Builder'} · {brief.updatedAt.slice(0, 16).replace('T', ' ')}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={beginEdit}
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={commitEdit}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Edits</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onSaveBrief({ ...brief, status: 'saved', updatedAt: new Date().toISOString() })}
                className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Save Snapshot
              </button>
              <button
                type="button"
                onClick={() => onDismissBrief(brief.id)}
                className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-xs font-semibold text-slate-600 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>
            </div>
          </div>

          {/* 8 Structured Resume Questions */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EIGHT_QUESTIONS.map((q) => {
                const value = String(brief[q.key] || '');
                const isMissing = value.includes('Not available in the connected context');
                return (
                  <div key={String(q.key)} className="rounded-xl border border-slate-200/90 p-4 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold text-slate-700">{q.label}</div>
                      <span className={`text-[10px] font-mono uppercase ${isMissing ? 'text-slate-400' : 'text-teal-700'}`}>
                        {isMissing ? 'Missing Context' : q.originLabel}
                      </span>
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={String((editedFields as any)[q.key] ?? value)}
                        onChange={(e) => setEditedFields((prev) => ({ ...prev, [q.key]: e.target.value }))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-900"
                      />
                    ) : (
                      <p className={`text-sm leading-relaxed ${isMissing ? 'text-slate-400 italic' : 'text-slate-900'}`}>
                        {value}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Protected Time Note */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3 flex items-center gap-2.5 text-xs text-emerald-900">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{brief.protectedTimeNote}</span>
            </div>

            {/* Source References & Four-Bucket Provenance Separation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Linked Jira, Confluence &amp; Saved References ({brief.sourceReferences.length})
                </div>
                {brief.sourceReferences.length === 0 ? (
                  <p className="text-xs text-slate-500">No linked captures, decisions, Jira issues, or Confluence pages yet.</p>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {brief.sourceReferences.map((ref, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-2 text-slate-700">
                        <span>
                          <span className="font-mono text-slate-500">[{ref.kind}]</span> {ref.label}
                        </span>
                        {ref.url && /^https?:\/\//i.test(ref.url.trim()) && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 text-teal-700 hover:underline shrink-0"
                          >
                            <span>Open Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 p-4 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Provenance Breakdown (Verified vs. Recorded vs. Inferred vs. Missing)
                </div>
                <ul className="space-y-1 text-xs text-slate-700">
                  {verifiedSourceFacts.map((fact, idx) => (
                    <li key={`vs-${idx}`}>• <span className="font-semibold text-teal-800">Verified Source Information:</span> {fact}</li>
                  ))}
                  {verifiedSourceRefs.length > 0 && verifiedSourceFacts.length === 0 && verifiedSourceRefs.map((r, idx) => (
                    <li key={`vsr-${idx}`}>• <span className="font-semibold text-teal-800">Verified Source Information:</span> [{r.kind}] {r.label}</li>
                  ))}
                  {userRecordedFacts.map((fact, idx) => (
                    <li key={`ur-${idx}`}>• <span className="font-semibold text-emerald-800">User-Recorded Information:</span> {fact}</li>
                  ))}
                  {brief.aiSuggestions.map((sug, idx) => (
                    <li key={`s-${idx}`} className="text-indigo-800">• <span className="font-semibold">AI-Generated Suggestion (Unconfirmed):</span> {sug}</li>
                  ))}
                  {brief.missingInformation.map((gap, idx) => (
                    <li key={`m-${idx}`} className="text-slate-500">• <span className="font-semibold">Missing / Unavailable Context:</span> {gap}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Workflow Actions */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {brief.nextMeaningfulAction !== 'Not available in the connected context.' && (
                  <button
                    type="button"
                    onClick={() => onConvertActionToTask(brief.roleId, brief.nextMeaningfulAction)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Convert Next Action to Task</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    onAskAiForClarification(
                      `Clarify the highest-priority open context and missing details for my "${brief.roleName}" hat.`
                    )
                  }
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  Ask AI Assistant for Clarification
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-600 flex items-center gap-1.5">
                  <span>Usefulness:</span>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                    className="min-h-[44px] px-2 rounded-lg border border-slate-300 bg-white text-xs"
                  >
                    <option value={5}>5 / 5</option>
                    <option value={4}>4 / 5</option>
                    <option value={3}>3 / 5</option>
                    <option value={2}>2 / 5</option>
                    <option value={1}>1 / 5</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => onConfirmBrief(brief.id, rating)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Brief</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
