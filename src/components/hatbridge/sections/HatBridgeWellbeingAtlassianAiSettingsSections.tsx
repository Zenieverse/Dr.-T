import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  ExternalLink,
  Link2,
  Plus,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  HatBridgeAnalyticsSnapshot,
  HatBridgeAtlassianIssue,
  HatBridgeAuditEvent,
  HatBridgeConfluencePage,
  HatBridgeIntegrationState,
  HatBridgePreferences,
  HatBridgeRole,
  HatBridgeStructuredAiResponse,
  HatBridgeTimeBlock,
  HatBridgeTimeCategory,
} from '../../../types/hatbridgeTypes';
import { HATBRIDGE_PLAN_TIERS } from '../data/hatbridgeStarters';
import { DailyWorkloadOverview } from '../utils/hatbridgeEngine';

// ============================================================================
// SECTION 7: TIME PROTECTION & HUMAN WELLBEING
// ============================================================================
interface TimeProtectionProps {
  timeBlocks: HatBridgeTimeBlock[];
  workload: DailyWorkloadOverview;
  sustainableDailyHours: number;
  onAddTimeBlock: (block: Omit<HatBridgeTimeBlock, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteTimeBlock: (id: string) => void;
  onUpdateSustainableHours: (hours: number) => void;
}

export const HatBridgeTimeProtectionSection: React.FC<TimeProtectionProps> = ({
  timeBlocks,
  workload,
  sustainableDailyHours,
  onAddTimeBlock,
  onDeleteTimeBlock,
  onUpdateSustainableHours,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HatBridgeTimeCategory>('family');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('18:30');
  const [endTime, setEndTime] = useState('20:00');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTimeBlock({
      title: title.trim(),
      category,
      date,
      startTime,
      endTime,
      protected: true,
      notes: notes.trim() || undefined,
      privacyLevel: 'private_personal',
    });
    setTitle('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">Time Protection &amp; Human Boundaries</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Protect family life, rest, recovery, and learning. Scheduling suggestions honor these blocks and never optimize you into exhaustion.
        </p>
      </div>

      {/* Gentle Workload & Sustainable Ceiling */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Gentle Daily Capacity Check</div>
            <p className={`text-sm ${workload.isOverloaded ? 'text-amber-900 font-medium' : 'text-slate-800'}`}>
              {workload.calmNotice}
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-700 shrink-0">
            <span className="font-semibold">Sustainable Work Limit:</span>
            <select
              value={sustainableDailyHours}
              onChange={(e) => onUpdateSustainableHours(Number(e.target.value))}
              className="min-h-[44px] px-3 rounded-xl border border-slate-300 bg-white text-xs font-mono"
            >
              {[5, 6, 7, 8, 9, 10].map((h) => (
                <option key={h} value={h}>
                  {h} hrs / day
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Add Protected Block */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="text-sm font-bold text-slate-900">Protect a Human Time Window</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Uninterrupted Family Dinner or Evening Walk"
            className="md:col-span-2 min-h-[44px] px-3 rounded-xl border border-slate-300 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as HatBridgeTimeCategory)}
            className="min-h-[44px] px-3 rounded-xl border border-slate-300 bg-white text-sm"
          >
            <option value="family">Family time</option>
            <option value="rest">Rest</option>
            <option value="appointment">Personal appointments</option>
            <option value="exercise">Exercise</option>
            <option value="learning">Learning</option>
            <option value="recovery">Recovery</option>
            <option value="unavailable">Unavailable period</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs font-mono"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs font-mono"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs font-mono"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional personal note (stays strictly in private vault)"
            className="flex-1 min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs"
          />
          <button
            type="submit"
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Save Protected Block</span>
          </button>
        </div>
      </form>

      {/* Protected Blocks List */}
      <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
        {timeBlocks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No protected blocks defined yet. Add rest, family, or recovery periods above.
          </div>
        ) : (
          timeBlocks.map((b) => (
            <div key={b.id} className="p-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{b.title}</div>
                <div className="text-xs font-mono tabular-nums text-slate-500 mt-0.5">
                  {b.category.toUpperCase()} · {b.date} · {b.startTime}–{b.endTime} · Private Personal Vault
                </div>
                {b.notes && <div className="text-xs text-slate-600 mt-1">{b.notes}</div>}
              </div>
              <button
                type="button"
                onClick={() => onDeleteTimeBlock(b.id)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                title="Remove protected block"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SECTION 8: ATLASSIAN WORKSPACE (Live Jira/Confluence vs Clearly Labeled Sandbox)
// ============================================================================
function isSafeHttpUrl(url?: string): boolean {
  return /^https?:\/\//i.test((url || '').trim());
}

interface AtlassianWorkspaceProps {
  integration: HatBridgeIntegrationState;
  roles: HatBridgeRole[];
  issues: HatBridgeAtlassianIssue[];
  pages: HatBridgeConfluencePage[];
  isChecking: boolean;
  onRefreshLive: () => Promise<void>;
  onToggleSandbox: (enabled: boolean) => void;
  onLinkIssueToRole: (issueKey: string, roleId: string) => void;
  onLinkPageToRole: (pageId: string, roleId: string) => void;
  onCaptureIssueAsContext?: (issue: HatBridgeAtlassianIssue, roleId: string) => void;
  onCapturePageAsContext?: (page: HatBridgeConfluencePage, roleId: string) => void;
  onRecordDecisionFromPage?: (page: HatBridgeConfluencePage, roleId: string) => void;
  onCreateJiraIssueConfirmed: (payload: { projectKey: string; summary: string; description: string }) => Promise<void>;
}

export const HatBridgeAtlassianSection: React.FC<AtlassianWorkspaceProps> = ({
  integration,
  roles,
  issues,
  pages,
  isChecking,
  onRefreshLive,
  onToggleSandbox,
  onLinkIssueToRole,
  onLinkPageToRole,
  onCaptureIssueAsContext,
  onCapturePageAsContext,
  onRecordDecisionFromPage,
  onCreateJiraIssueConfirmed,
}) => {
  const activeRoles = roles.filter((r) => !r.archived);
  const workplaceRoles = activeRoles.filter((r) => r.privacyLevel !== 'private_personal');
  const [selectedBridgeRoleId, setSelectedBridgeRoleId] = useState<string>(
    () => workplaceRoles[0]?.id || activeRoles[0]?.id || ''
  );
  const [projectKey, setProjectKey] = useState('HB');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [confirmedBox, setConfirmedBox] = useState(false);

  const resolveRoleForItem = (linkedRoleId?: string) =>
    linkedRoleId || selectedBridgeRoleId || workplaceRoles[0]?.id || activeRoles[0]?.id || '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">
            Atlassian Workspace — Jira, Confluence &amp; Forge
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Capture Jira tasks or Confluence pages into HatBridge, record source-linked decisions, and preserve your private personal boundary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onRefreshLive}
            disabled={isChecking}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Probe Server / Live Atlassian</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleSandbox(!integration.isDemoSandboxActive)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
              integration.isDemoSandboxActive
                ? 'border-amber-400 bg-amber-50 text-amber-900'
                : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
            }`}
          >
            {integration.isDemoSandboxActive ? 'Exit Demo Atlassian Sandbox' : 'Open Demo Atlassian Sandbox'}
          </button>
        </div>
      </div>

      {/* Honest Connection State Card */}
      <div className={`rounded-2xl border p-5 space-y-2 ${
        integration.connectionMode === 'live_atlassian_configured' || integration.connectionMode === 'forge_app_linked'
          ? 'border-emerald-200 bg-emerald-50/40'
          : integration.isDemoSandboxActive
            ? 'border-amber-300 bg-amber-50/50'
            : 'border-slate-200 bg-white'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
            {integration.jiraConnected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            ) : (
              <AlertCircle className="w-4 h-4 text-slate-600" />
            )}
            <span>
              {integration.connectionMode === 'live_atlassian_configured'
                ? 'Live Atlassian Cloud Connected'
                : integration.isDemoSandboxActive
                  ? 'Demo Atlassian Sandbox Active (Not Live Data)'
                  : 'Disconnected from Live Atlassian Site'}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-600">
            Forge App: apps/hatbridge-forge/manifest.yml
          </span>
        </div>
        <p className="text-xs text-slate-700">{integration.statusMessage}</p>
        {integration.siteUrl && (
          <div className="text-xs font-mono text-slate-600">Site: {integration.siteUrl}</div>
        )}
      </div>

      {/* Target Workplace Hat for One-Click Capture */}
      {activeRoles.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <span className="font-semibold text-slate-700">
            Default Target Hat for Atlassian Captures &amp; Decisions:
          </span>
          <select
            aria-label="Default Target Hat for Atlassian Captures"
            value={selectedBridgeRoleId}
            onChange={(e) => setSelectedBridgeRoleId(e.target.value)}
            className="min-h-[40px] px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
          >
            {activeRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}{r.privacyLevel === 'private_personal' ? ' (Private Personal — blocked from external export)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Jira & Confluence Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Jira Issues */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Jira Issues ({issues.length})
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {integration.isDemoSandboxActive ? 'SAMPLE SANDBOX' : integration.jiraConnected ? 'LIVE JIRA' : 'DISCONNECTED'}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {issues.length === 0 ? (
              <div className="p-6 text-xs text-slate-500">
                No live Jira issues loaded. Install the Forge companion app inside Jira or open the Demo Atlassian Sandbox to inspect workflows.
              </div>
            ) : (
              issues.map((issue) => {
                const targetRoleId = resolveRoleForItem(issue.linkedRoleId);
                return (
                  <div key={issue.id} className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono font-bold text-indigo-800">
                          {issue.key} · {issue.status}
                          {issue.isOverdue ? ' · OVERDUE' : ''}
                          {issue.isBlocked ? ' · BLOCKED' : ''}
                        </div>
                        <div className="text-sm font-semibold text-slate-900 mt-0.5">{issue.summary}</div>
                      </div>
                      {isSafeHttpUrl(issue.url) && (
                        <a
                          href={issue.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-xs text-teal-700 hover:underline inline-flex items-center gap-1 shrink-0"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] font-mono text-slate-500">
                        Origin: {issue.dataOrigin === 'sample_sandbox' ? 'Sample Sandbox' : 'Live Jira'}
                        {issue.dueDate ? ` · Due ${issue.dueDate}` : ''}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {onCaptureIssueAsContext && (
                          <button
                            type="button"
                            disabled={!targetRoleId}
                            onClick={() => onCaptureIssueAsContext(issue, targetRoleId)}
                            className="min-h-[38px] px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-45 text-xs font-semibold text-slate-800 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Capture Context</span>
                          </button>
                        )}
                        <select
                          aria-label={`Link ${issue.key} to Hat`}
                          value={issue.linkedRoleId || ''}
                          onChange={(e) => onLinkIssueToRole(issue.key, e.target.value)}
                          className="min-h-[38px] px-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                        >
                          <option value="">Link to Hat...</option>
                          {activeRoles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Confluence Pages */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Confluence Pages &amp; Meeting Notes ({pages.length})
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {integration.isDemoSandboxActive ? 'SAMPLE SANDBOX' : integration.confluenceConnected ? 'LIVE CONFLUENCE' : 'DISCONNECTED'}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {pages.length === 0 ? (
              <div className="p-6 text-xs text-slate-500">
                No live Confluence pages loaded. Use the Forge app inside Confluence or open the Demo Atlassian Sandbox.
              </div>
            ) : (
              pages.map((page) => {
                const targetRoleId = resolveRoleForItem(page.linkedRoleId);
                return (
                  <div key={page.id} className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono text-slate-500">
                          {page.spaceKey} · {page.id}
                          {page.isMeetingNote ? ' · Meeting Note' : ''}
                        </div>
                        <div className="text-sm font-semibold text-slate-900 mt-0.5">{page.title}</div>
                        <p className="text-xs text-slate-600 mt-1">{page.excerpt}</p>
                      </div>
                      {isSafeHttpUrl(page.url) && (
                        <a
                          href={page.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-xs text-teal-700 hover:underline inline-flex items-center gap-1 shrink-0"
                        >
                          <span>Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] font-mono text-slate-500">
                        Origin: {page.dataOrigin === 'sample_sandbox' ? 'Sample Sandbox' : 'Live Confluence'}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {onCapturePageAsContext && (
                          <button
                            type="button"
                            disabled={!targetRoleId}
                            onClick={() => onCapturePageAsContext(page, targetRoleId)}
                            className="min-h-[38px] px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-45 text-xs font-semibold text-slate-800 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Capture Context</span>
                          </button>
                        )}
                        {onRecordDecisionFromPage && (
                          <button
                            type="button"
                            disabled={!targetRoleId}
                            onClick={() => onRecordDecisionFromPage(page, targetRoleId)}
                            className="min-h-[38px] px-2.5 py-1.5 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 disabled:opacity-45 text-xs font-semibold text-teal-900 cursor-pointer"
                          >
                            Record Decision
                          </button>
                        )}
                        <select
                          aria-label={`Link ${page.id} to Hat`}
                          value={page.linkedRoleId || ''}
                          onChange={(e) => onLinkPageToRole(page.id, e.target.value)}
                          className="min-h-[38px] px-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                        >
                          <option value="">Link to Hat...</option>
                          {activeRoles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* User-Confirmed Jira Task Creation (Live Only) */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!confirmedBox || !summary.trim()) return;
          await onCreateJiraIssueConfirmed({ projectKey, summary, description });
          setSummary('');
          setDescription('');
          setConfirmedBox(false);
        }}
        className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3"
      >
        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-slate-700" />
          <span>Create Jira Issue from HatBridge (Requires Live Atlassian &amp; Confirmation)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            value={projectKey}
            onChange={(e) => setProjectKey(e.target.value)}
            placeholder="Project Key (e.g. HB)"
            className="min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs font-mono uppercase"
          />
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Issue summary (non-PHI workplace task only)"
            className="sm:col-span-3 min-h-[44px] px-3 rounded-xl border border-slate-300 text-sm"
          />
        </div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description & role context"
          className="w-full min-h-[44px] px-3 rounded-xl border border-slate-300 text-sm"
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={confirmedBox}
              onChange={(e) => setConfirmedBox(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span>I confirm this contains zero private personal or patient information and should create a real Jira issue.</span>
          </label>
          <button
            type="submit"
            disabled={!integration.jiraConnected || !confirmedBox || !summary.trim()}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-45 text-white text-xs font-semibold cursor-pointer"
          >
            Create Live Jira Issue
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// SECTION 9: AI ASSISTANT (Grounded Gemini Reasoning with 6-Part Output)
// ============================================================================
interface AiAssistantProps {
  roles: HatBridgeRole[];
  activeRoleId: string;
  preferences: HatBridgePreferences;
  aiLoading: boolean;
  lastResponse: HatBridgeStructuredAiResponse | null;
  onGrantAiConsent: (granted: boolean) => void;
  onRunPrompt: (prompt: string) => Promise<void>;
}

export const HatBridgeAiAssistantSection: React.FC<AiAssistantProps> = ({
  roles,
  activeRoleId,
  preferences,
  aiLoading,
  lastResponse,
  onGrantAiConsent,
  onRunPrompt,
}) => {
  const [prompt, setPrompt] = useState('');
  const activeRole = roles.find((r) => r.id === activeRoleId);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">AI Continuity Assistant</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Structured continuity reasoning separating observed facts, confirmed human decisions, AI suggestions, and missing context.
        </p>
      </div>

      {/* Explicit Consent Disclosure */}
      <div className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
        preferences.aiConsentGranted ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-300 bg-amber-50/60'
      }`}>
        <div className="text-xs text-slate-800 space-y-1">
          <div className="font-bold">AI Disclosure &amp; Privacy Boundary</div>
          <p>
            Server-side Gemini calls receive ONLY authorized HatBridge role records. Private personal notes are{' '}
            <strong>{preferences.allowPrivatePersonalInAi ? 'INCLUDED by your opt-in' : 'EXCLUDED by default'}</strong>. Patient clinical records are never included.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onGrantAiConsent(!preferences.aiConsentGranted)}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold shrink-0 cursor-pointer ${
            preferences.aiConsentGranted
              ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {preferences.aiConsentGranted ? 'Revoke AI Consent' : 'Enable Grounded AI Consent'}
        </button>
      </div>

      {/* Prompt Input */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!prompt.trim() || !preferences.aiConsentGranted) return;
          await onRunPrompt(prompt.trim());
        }}
        className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3"
      >
        <div className="text-xs font-mono text-slate-500">
          Active Context Scope: {activeRole?.name || 'All Authorized Hats'}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask for a daily briefing, conflict explanation, open decision summary, or role resume..."
            className="flex-1 min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm"
          />
          <button
            type="submit"
            disabled={aiLoading || !preferences.aiConsentGranted || !prompt.trim()}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-45 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{aiLoading ? 'Analyzing...' : 'Ask HatBridge AI'}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            'Prepare a calm daily briefing across my authorized hats.',
            'Summarize unfinished work and pending approvals in my active hat.',
            'Which decisions lack a supporting Confluence link or confirmation?',
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={!preferences.aiConsentGranted || aiLoading}
              onClick={() => {
                setPrompt(preset);
                void onRunPrompt(preset);
              }}
              className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-45 text-xs text-slate-700 cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      </form>

      {/* Structured 6-Part Output */}
      {lastResponse && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Structured Continuity Output</span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Engine: {lastResponse.generatedBy === 'gemini' ? `Gemini (${lastResponse.model || 'gemini-4-hydrogen'})` : lastResponse.generatedBy}
            </span>
          </div>

          {lastResponse.errorMessage && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
              {lastResponse.errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-slate-200 p-4 space-y-1.5">
              <div className="font-bold uppercase tracking-wider text-slate-500">1. Observed Facts</div>
              <ul className="space-y-1 text-slate-800">
                {lastResponse.observedFacts.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-1.5">
              <div className="font-bold uppercase tracking-wider text-slate-500">2. Source References</div>
              {lastResponse.sourceReferences.length === 0 ? (
                <p className="text-slate-500">None cited.</p>
              ) : (
                <ul className="space-y-1 text-slate-800">
                  {lastResponse.sourceReferences.map((s, i) => (
                    <li key={i}>• [{s.type}] {s.label}{s.id ? ` (${s.id})` : ''}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-1.5">
              <div className="font-bold uppercase tracking-wider text-emerald-800">3. User-Confirmed Decisions</div>
              {lastResponse.userConfirmedDecisions.length === 0 ? (
                <p className="text-slate-500">No confirmed decisions matched.</p>
              ) : (
                <ul className="space-y-1 text-slate-800">
                  {lastResponse.userConfirmedDecisions.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-1.5">
              <div className="font-bold uppercase tracking-wider text-indigo-800">4. AI-Generated Suggestions</div>
              <ul className="space-y-1 text-slate-800">
                {lastResponse.aiSuggestions.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-1.5">
              <div className="font-bold uppercase tracking-wider text-amber-800">5. Missing Information</div>
              {lastResponse.missingInformation.length === 0 ? (
                <p className="text-slate-500">No missing context flagged.</p>
              ) : (
                <ul className="space-y-1 text-slate-700">
                  {lastResponse.missingInformation.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 space-y-1.5">
              <div className="font-bold uppercase tracking-wider text-teal-900">6. Proposed Next Action</div>
              <p className="text-sm font-medium text-slate-900">{lastResponse.proposedNextAction}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SECTION 10: SETTINGS, PRIVACY, EXPORT, DELETION, ANALYTICS & PLANS
// ============================================================================
interface SettingsPrivacyProps {
  preferences: HatBridgePreferences;
  analytics: HatBridgeAnalyticsSnapshot;
  auditEvents: HatBridgeAuditEvent[];
  authDisplayLabel: string;
  storageBackend: 'firestore_cloud' | 'browser_local';
  onUpdatePreferences: (patch: Partial<HatBridgePreferences>) => void;
  onExportJson: () => void;
  onDeleteAllData: () => void;
  onRecordBurdenCheckIn: (score: number) => void;
}

export const HatBridgeSettingsPrivacySection: React.FC<SettingsPrivacyProps> = ({
  preferences,
  analytics,
  auditEvents,
  authDisplayLabel,
  storageBackend,
  onUpdatePreferences,
  onExportJson,
  onDeleteAllData,
  onRecordBurdenCheckIn,
}) => {
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">Settings, Privacy &amp; Governance</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Full user ownership: manage AI consent, personal/work isolation, retention windows, JSON export, and deletion.
        </p>
      </div>

      {/* Consent & Boundary Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="text-xs font-mono text-slate-500">
          Identity: {authDisplayLabel} · Vault: {storageBackend === 'firestore_cloud' ? 'Authenticated Firestore' : 'Local Browser Storage'}
        </div>

        <div className="divide-y divide-slate-100">
          <label className="py-3 flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-slate-900">Allow server-side Gemini AI synthesis</div>
              <div className="text-xs text-slate-600">Disabled by default until explicitly consented. Patient health records are never sent.</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.aiConsentGranted}
              onChange={(e) => onUpdatePreferences({ aiConsentGranted: e.target.checked })}
              className="w-5 h-5"
            />
          </label>

          <label className="py-3 flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-slate-900">Include &ldquo;Private Personal&rdquo; notes in AI prompts</div>
              <div className="text-xs text-slate-600">Keep unchecked to keep family/personal hats strictly local and excluded from Gemini payloads.</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.allowPrivatePersonalInAi}
              onChange={(e) => onUpdatePreferences({ allowPrivatePersonalInAi: e.target.checked })}
              className="w-5 h-5"
            />
          </label>

          <label className="py-3 flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-slate-900">Opt in to privacy-conscious continuity analytics</div>
              <div className="text-xs text-slate-600">Counts confirmed briefs, handoffs, and self-reported switch burden locally without content tracking.</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.analyticsEnabled}
              onChange={(e) => onUpdatePreferences({ analyticsEnabled: e.target.checked })}
              className="w-5 h-5"
            />
          </label>

          <div className="py-3 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Local &amp; Archive Retention Window</div>
              <div className="text-xs text-slate-600">Controls how long dismissed briefs and temporary logs are kept.</div>
            </div>
            <select
              value={preferences.retentionDays}
              onChange={(e) => onUpdatePreferences({ retentionDays: Number(e.target.value) as 30 | 90 | 365 | 0 })}
              className="min-h-[44px] px-3 rounded-xl border border-slate-300 bg-white text-xs font-mono"
            >
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={365}>365 days</option>
              <option value={0}>Manual cleanup only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy-Conscious Product Evaluation */}
      {preferences.analyticsEnabled && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900">Continuity Evaluation (Opted In · Content-Free Counters)</h3>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-600">Switch Burden (1=Calm, 5=Heavy):</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onRecordBurdenCheckIn(n)}
                  className={`min-h-[36px] min-w-[36px] rounded-lg border font-mono text-xs cursor-pointer ${
                    analytics.contextSwitchingBurdenCheckIn === n
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono tabular-nums text-xs">
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/70">
              <div className="text-slate-500">Confirmed Briefs</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{analytics.reentryBriefsConfirmed}</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/70">
              <div className="text-slate-500">Handoffs Completed</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{analytics.handoffsCompleted}</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/70">
              <div className="text-slate-500">Avg Brief Rating</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {analytics.averageResumeRating !== null ? `${analytics.averageResumeRating}/5` : '—'}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/70">
              <div className="text-slate-500">AI Edits Recorded</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{analytics.aiCorrectionsRecorded}</div>
            </div>
          </div>
        </div>
      )}

      {/* Export & Deletion */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Data Portability &amp; Right to Erase</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Download all HatBridge roles, captures, decisions, handoffs &amp; briefs as JSON, or permanently wipe your HatBridge workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onExportJson}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          {!confirmDeleteStep ? (
            <button
              type="button"
              onClick={() => setConfirmDeleteStep(true)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete All HatBridge Data</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onDeleteAllData();
                setConfirmDeleteStep(false);
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer"
            >
              Confirm Permanent Wipe
            </button>
          )}
        </div>
      </div>

      {/* Subscription-Ready Plan Architecture (No fake billing) */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Commercial &amp; Pilot Architecture</h3>
          <p className="text-xs text-slate-600">
            Transparent tier boundaries prepared for controlled pilot deployment; billing checkout is intentionally inactive.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HATBRIDGE_PLAN_TIERS.map((tier) => {
            const active = preferences.subscriptionTier === tier.id;
            return (
              <div
                key={tier.id}
                className={`rounded-2xl border p-5 bg-white flex flex-col justify-between space-y-4 ${
                  active ? 'border-slate-900 ring-1 ring-slate-900/10' : 'border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {tier.audienceLabel}
                  </div>
                  <div className="text-base font-bold text-slate-900">{tier.name}</div>
                  <div className="text-lg font-mono font-bold text-slate-900">
                    {tier.priceLabel} <span className="text-xs font-sans font-normal text-slate-500">· {tier.cadence}</span>
                  </div>
                  <p className="text-xs text-slate-600">{tier.summary}</p>
                  <ul className="space-y-1 text-xs text-slate-700 pt-2 border-t border-slate-100">
                    {tier.limits.map((lim, i) => (
                      <li key={i}>• {lim}</li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdatePreferences({ subscriptionTier: tier.id })}
                  className={`min-h-[44px] w-full rounded-xl text-xs font-semibold border cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {active ? 'Selected Plan Tier' : 'Select Plan Preview'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700">
          Governance &amp; Privacy Audit Events ({auditEvents.length})
        </div>
        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
          {auditEvents.length === 0 ? (
            <div className="p-4 text-xs text-slate-500">No audit events recorded yet.</div>
          ) : (
            auditEvents.slice(0, 25).map((ev) => (
              <div key={ev.id} className="px-4 py-2.5 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="font-medium text-slate-800">
                  <span className="font-mono text-slate-500 mr-2">{ev.action}</span>
                  {ev.detail}
                </span>
                <span className="font-mono text-[11px] text-slate-400 shrink-0">
                  {ev.timestamp.slice(0, 19).replace('T', ' ')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
