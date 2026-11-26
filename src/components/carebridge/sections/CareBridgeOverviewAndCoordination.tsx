// ============================================================================
// DR. T — CAREBRIDGE SECTIONS 1 & 2
// 1. Care Overview
// 2. Care Coordination (non-emergency follow-up tasks with provenance & audit)
// ============================================================================

import React, { useState } from 'react';
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  History,
  Link2,
  Plus,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { NavTab } from '../../../types';
import {
  CareBridgeConnectionDisplayStatus,
  CareBridgePriority,
  CareBridgeSectionId,
  CareBridgeTask,
  CareBridgeTaskStatus,
  CareBridgeWorkspaceBundle,
} from '../../../types/carebridgeTypes';
import { checkCareBridgeDataMinimization } from '../utils/carebridgeEngine';

interface CareBridgeOverviewProps {
  bundle: CareBridgeWorkspaceBundle;
  connectionDisplayStatus?: CareBridgeConnectionDisplayStatus;
  verifyingConnection?: boolean;
  isAuthenticated?: boolean;
  onSelectSection: (section: CareBridgeSectionId) => void;
  onNavigateDrTTab?: (tab: NavTab) => void;
  onLoadSamplePreview: () => void;
  onClearSamplePreview: () => void;
}

export const CareOverviewSection: React.FC<CareBridgeOverviewProps> = ({
  bundle,
  connectionDisplayStatus = 'Unavailable',
  verifyingConnection = false,
  isAuthenticated = false,
  onSelectSection,
  onNavigateDrTTab,
  onLoadSamplePreview,
  onClearSamplePreview,
}) => {
  const openTasks = bundle.tasks.filter((t) => t.status !== 'completed' && t.status !== 'deferred');
  const timeSensitiveCount = openTasks.filter((t) => t.priority === 'time_sensitive').length;
  const liveJsmCount = bundle.linkedRequests.filter((r) => r.dataOrigin === 'live_jsm').length;
  const liveConfluenceCount = bundle.knowledgePages.filter((p) => p.dataOrigin === 'live_confluence').length;
  const latestActivity = bundle.auditLogs[0];
  const ungrantedConsents = [
    !bundle.consents.jsmMinimalSyncConsent ? 'JSM Follow-Up Sync' : null,
    !bundle.consents.confluenceReadConsent ? 'Confluence Knowledge Read' : null,
    !bundle.consents.rovoAssistantConsent ? 'Rovo Navigator' : null,
    !bundle.consents.geminiSynthesisConsent ? 'Gemini AI Synthesis' : null,
  ].filter(Boolean) as string[];
  const missingContext = bundle.latestBrief?.missingOrUnavailableContext || [];
  const suggestedAction = bundle.latestBrief?.aiGeneratedSuggestionUnconfirmed;

  const statusTone =
    connectionDisplayStatus === 'Connected'
      ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
      : connectionDisplayStatus === 'Unauthorized'
        ? 'text-rose-800 bg-rose-50 border-rose-200'
        : connectionDisplayStatus === 'Permission Denied'
          ? 'text-amber-900 bg-amber-50 border-amber-300'
          : 'text-slate-700 bg-slate-100 border-slate-200';

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              Non-Emergency Care-Navigation Workspace · {bundle.navigationContextTitle}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Care Overview &amp; Continuity Snapshot
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Organize non-emergency post-visit follow-ups, review authorized Confluence care guidance, and
              coordinate consented Jira Service Management requests — keeping verified sources strictly
              separate from user notes and AI suggestions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!bundle.integration.isSampleSandboxActive ? (
              <button
                type="button"
                onClick={onLoadSamplePreview}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-800 transition cursor-pointer"
              >
                Load Sample Preview Sandbox
              </button>
            ) : (
              <button
                type="button"
                onClick={onClearSamplePreview}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-sm font-medium text-amber-900 transition cursor-pointer"
              >
                Clear Sample Sandbox
              </button>
            )}
            <button
              type="button"
              onClick={() => onSelectSection('coordination')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition cursor-pointer"
            >
              Add Follow-Up Task
            </button>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500">Active Follow-Up Tasks</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{openTasks.length}</div>
            <div className="text-xs text-slate-500 tabular-nums">{timeSensitiveCount} time-sensitive</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Service Desk Status</div>
            <div className="mt-1 flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${statusTone}`}>
                {verifyingConnection ? 'Verifying...' : connectionDisplayStatus}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 tabular-nums">{liveJsmCount} live JSM request(s)</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Confluence Pages</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{liveConfluenceCount}</div>
            <div className="text-xs text-slate-500">
              {bundle.integration.confluenceConnected ? 'Authorized read enabled' : 'Live bridge disconnected'}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Consents Active</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">
              {4 - ungrantedConsents.length}/4
            </div>
            <div className="text-xs text-slate-500">Retention · {bundle.consents.retentionPolicy.replace('_', ' ')}</div>
          </div>
        </div>

        {/* 7-Item Continuity Readout */}
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="font-bold uppercase tracking-wider text-slate-600">Latest Activity &amp; Outstanding Permissions</div>
            <div className="text-slate-900">
              <span className="font-semibold">Latest Activity:</span>{' '}
              {latestActivity
                ? `${latestActivity.timestamp.slice(0, 16).replace('T', ' ')} · ${latestActivity.summary}`
                : 'No workspace activity recorded yet.'}
            </div>
            <div className="text-slate-700">
              <span className="font-semibold">Outstanding Consents / Permissions:</span>{' '}
              {ungrantedConsents.length === 0
                ? isAuthenticated
                  ? 'All 4 workspace consents active.'
                  : 'All 4 workspace consents active (local browser session — sign in for Firestore sync).'
                : `${ungrantedConsents.join(', ')} turned off in Privacy & Consent.`}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="font-bold uppercase tracking-wider text-slate-600">
              Missing Context &amp; AI-Generated Suggestion — Unconfirmed
            </div>
            <div className="text-slate-900">
              <span className="font-semibold">Missing / Unavailable:</span>{' '}
              {missingContext.length === 0 ? 'None flagged.' : missingContext[0]}
              {missingContext.length > 1 ? ` (+${missingContext.length - 1} more in Re-entry Brief)` : ''}
            </div>
            <div className="text-amber-950 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
              <span className="font-bold uppercase text-[11px]">Unconfirmed Suggestion:</span>{' '}
              {suggestedAction?.suggestedNextAdminAction || 'Refresh Care Re-entry Brief to compute next administrative check.'}
            </div>
          </div>
        </div>
      </div>

      {/* Non-diagnostic safety note */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          <strong className="font-semibold">Non-Emergency &amp; Non-Diagnostic Boundary:</strong> CareBridge coordinates
          follow-up logistics, documentation lookup, and scheduling handoffs only. It never diagnoses medical
          conditions or prescribes treatment. For urgent symptoms, contact local emergency services or your licensed
          clinician immediately.
        </div>
      </div>

      {/* Quick navigation cards across CareBridge & existing Dr. T healthcare modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onSelectSection('jsm')}
          className="text-left bg-white border border-slate-200 hover:border-teal-600/50 rounded-2xl p-5 transition cursor-pointer min-h-[120px] flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Atlassian JSM</div>
            <div className="mt-1 text-base font-bold text-slate-900">Jira Service Management</div>
            <p className="mt-1 text-xs text-slate-600">
              View live service desks, create minimal consented follow-up requests, and inspect actual URLs.
            </p>
          </div>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-700">
            Open JSM Workspace <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSection('knowledge')}
          className="text-left bg-white border border-slate-200 hover:border-teal-600/50 rounded-2xl p-5 transition cursor-pointer min-h-[120px] flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Atlassian Confluence</div>
            <div className="mt-1 text-base font-bold text-slate-900">Clinical Knowledge Hub</div>
            <p className="mt-1 text-xs text-slate-600">
              Search authorized Confluence guidance pages with strict separation of verbatim excerpts vs. AI summaries.
            </p>
          </div>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-700">
            Search Knowledge <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSection('reentry-brief')}
          className="text-left bg-white border border-slate-200 hover:border-teal-600/50 rounded-2xl p-5 transition cursor-pointer min-h-[120px] flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wide">4-Bucket Brief</div>
            <div className="mt-1 text-base font-bold text-slate-900">Care Re-entry Brief</div>
            <p className="mt-1 text-xs text-slate-600">
              Resume your care workflow cleanly with verified sources, recorded tasks, AI suggestions, and missing gaps.
            </p>
          </div>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-700">
            Generate Brief <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {/* Safe optional links to existing Dr. T healthcare modules (without coupling PHI) */}
      {onNavigateDrTTab && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">Companion Dr. T Health Modules</div>
            <p className="text-xs text-slate-600 mt-0.5">
              CareBridge keeps external Atlassian workspaces isolated from personal check-ins unless you explicitly opt in.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigateDrTTab('healthalert')}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer"
            >
              Open Health Alert Mini
            </button>
            <button
              type="button"
              onClick={() => onNavigateDrTTab('presagesense')}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer"
            >
              Open Presage Sense
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface CareCoordinationProps {
  bundle: CareBridgeWorkspaceBundle;
  onCreateTask: (input: {
    contextRef: string;
    description: string;
    priority: CareBridgePriority;
    dueDate?: string;
    responsibleAssignee: string;
    jsmRequestKey?: string;
    confluencePageId?: string;
  }) => void;
  onUpdateTaskStatus: (taskId: string, status: CareBridgeTaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

export const CareCoordinationSection: React.FC<CareCoordinationProps> = ({
  bundle,
  onCreateTask,
  onUpdateTaskStatus,
  onDeleteTask,
}) => {
  const [contextRef, setContextRef] = useState('Post-Visit Follow-Up Navigation');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CareBridgePriority>('routine');
  const [dueDate, setDueDate] = useState('');
  const [responsibleAssignee, setResponsibleAssignee] = useState('Care Navigation Coordinator');
  const [linkedJsmKey, setLinkedJsmKey] = useState('');
  const [linkedPageId, setLinkedPageId] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CareBridgeTaskStatus>('all');
  const [expandedAuditTaskId, setExpandedAuditTaskId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const minimizationCheck = checkCareBridgeDataMinimization(`${contextRef} ${description}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!description.trim()) {
      setFormError('Please describe the non-emergency follow-up task.');
      return;
    }
    if (!minimizationCheck.safe) {
      setFormError(minimizationCheck.warnings.join(' '));
      return;
    }
    onCreateTask({
      contextRef,
      description,
      priority,
      dueDate: dueDate || undefined,
      responsibleAssignee,
      jsmRequestKey: linkedJsmKey || undefined,
      confluencePageId: linkedPageId || undefined,
    });
    setDescription('');
    setDueDate('');
    setLinkedJsmKey('');
    setLinkedPageId('');
  };

  const visibleTasks =
    statusFilter === 'all' ? bundle.tasks : bundle.tasks.filter((t) => t.status === statusFilter);

  const priorityLabel = (p: CareBridgePriority) =>
    p === 'time_sensitive' ? 'Time-Sensitive' : p === 'soon' ? 'Soon' : 'Routine';

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal-700" />
              <span>Record Non-Emergency Follow-Up Task</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Administrative scheduling, document preparation, and care coordination only. Never enter SSN, MRN, DOB, or diagnoses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">User-Owned Context Reference</span>
            <input
              type="text"
              value={contextRef}
              onChange={(e) => setContextRef(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              placeholder="e.g. Post-Visit Cardiology Scheduling"
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Responsible Person or Team</span>
            <input
              type="text"
              value={responsibleAssignee}
              onChange={(e) => setResponsibleAssignee(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              placeholder="e.g. Outpatient Clinic Desk"
              required
            />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-semibold text-slate-700">Follow-Up Task Description</span>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="e.g. Confirm referral authorization number and follow-up visit time slot"
            required
          />
        </label>

        {!minimizationCheck.safe && description.trim().length > 0 && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
            <strong>Data Minimization Guard:</strong> {minimizationCheck.warnings.join(' ')}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Priority</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as CareBridgePriority)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white"
            >
              <option value="routine">Routine</option>
              <option value="soon">Soon</option>
              <option value="time_sensitive">Time-Sensitive</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Target Due Date</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Link JSM Request (Optional)</span>
            <select
              value={linkedJsmKey}
              onChange={(e) => setLinkedJsmKey(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white"
            >
              <option value="">None linked</option>
              {bundle.linkedRequests.map((req) => (
                <option key={req.issueKey} value={req.issueKey}>
                  {req.issueKey} ({req.dataOrigin === 'live_jsm' ? 'Live' : 'Sample'})
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Link Confluence Page (Optional)</span>
            <select
              value={linkedPageId}
              onChange={(e) => setLinkedPageId(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white"
            >
              <option value="">None linked</option>
              {bundle.knowledgePages.map((pg) => (
                <option key={pg.id} value={pg.id}>
                  {pg.title.slice(0, 38)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-900">
            {formError}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!minimizationCheck.safe}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-sm font-semibold inline-flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Care Follow-Up Task</span>
          </button>
        </div>
      </form>

      {/* Task Ledger */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 tabular-nums">
              Care Coordination Tasks ({visibleTasks.length})
            </h3>
            <p className="text-xs text-slate-500">
              Each task tracks identifier, owner reference, priority, due date, source provenance, and immutable audit trail.
            </p>
          </div>
          <select
            aria-label="Filter tasks by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | CareBridgeTaskStatus)}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white"
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="scheduled">Scheduled</option>
            <option value="waiting_external">Waiting External</option>
            <option value="completed">Completed</option>
            <option value="deferred">Deferred</option>
          </select>
        </div>

        {visibleTasks.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
            No follow-up tasks match this view. Add a non-emergency task above or load the Sample Preview Sandbox.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleTasks.map((task: CareBridgeTask) => {
              const showAudit = expandedAuditTaskId === task.id;
              return (
                <div key={task.id} className="py-4 first:pt-1 last:pb-1 space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="text-xs text-slate-500 font-mono tabular-nums">
                        {task.id} · {task.contextRef} · {priorityLabel(task.priority)}
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-slate-900">
                        {task.description}
                      </div>
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Assignee: {task.responsibleAssignee}</span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
                          {task.dueDate || 'No due date set'}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Link2 className="w-3.5 h-3.5 text-slate-400" />
                          Provenance: {task.source.provenance === 'verified_source' ? 'Verified Source' : 'User Recorded'} ({task.source.label})
                        </span>
                      </div>

                      {(task.source.jsmRequestUrl || task.source.confluenceUrl) && (
                        <div className="flex flex-wrap gap-3 pt-1">
                          {task.source.jsmRequestUrl && (
                            <a
                              href={task.source.jsmRequestUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline"
                            >
                              <span>JSM {task.source.jsmRequestKey}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {task.source.confluenceUrl && (
                            <a
                              href={task.source.confluenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline"
                            >
                              <span>Confluence #{task.source.confluencePageId}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <select
                        aria-label={`Status for ${task.id}`}
                        value={task.status}
                        onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as CareBridgeTaskStatus)}
                        className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                      >
                        <option value="open">Open</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="waiting_external">Waiting External</option>
                        <option value="completed">Completed</option>
                        <option value="deferred">Deferred</option>
                      </select>

                      {task.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                          className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-teal-700 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setExpandedAuditTaskId(showAudit ? null : task.id)}
                        className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span className="tabular-nums">History ({task.auditTrail.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        aria-label={`Delete task ${task.id}`}
                        className="min-h-[44px] min-w-[44px] p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-700 inline-flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {showAudit && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                      <div className="text-xs font-semibold text-slate-700">Task Audit History</div>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {task.auditTrail.map((entry) => (
                          <li key={entry.id} className="tabular-nums">
                            <span className="font-mono text-slate-500">{entry.timestamp.slice(0, 19).replace('T', ' ')}</span>
                            {' · '}
                            <span className="font-semibold text-slate-800">{entry.action}</span>
                            {' · '}
                            <span>{entry.summary}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
