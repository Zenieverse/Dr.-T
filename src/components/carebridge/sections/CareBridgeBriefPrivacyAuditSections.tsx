// ============================================================================
// DR. T — CAREBRIDGE SECTIONS 6, 7 & 8
// 6. Care Re-entry Brief (8 concise elements + 4 strict provenance buckets)
// 7. Privacy and Consent (toggles, minimization, retention, export & delete)
// 8. Activity and Audit History (immutable chronological ledger)
// ============================================================================

import React, { useState } from 'react';
import {
  CheckSquare,
  Download,
  ExternalLink,
  FileText,
  History,
  Lock,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  CareBridgeConsentState,
  CareBridgeRetentionPolicy,
  CareBridgeWorkspaceBundle,
} from '../../../types/carebridgeTypes';

// ----------------------------------------------------------------------------
// 6. Care Re-entry Brief
// ----------------------------------------------------------------------------
interface BriefSectionProps {
  bundle: CareBridgeWorkspaceBundle;
  onRefreshBrief: () => void;
  onMarkAiSuggestionReviewed: () => void;
}

export const CareReentryBriefSection: React.FC<BriefSectionProps> = ({
  bundle,
  onRefreshBrief,
  onMarkAiSuggestionReviewed,
}) => {
  const brief = bundle.latestBrief;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-700" />
            <span>Care Re-entry Brief (4-Bucket Provenance Model)</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Synthesizes your current navigation context without ever blending verified Atlassian sources, user notes, AI drafts, or missing gaps.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefreshBrief}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Re-entry Brief</span>
        </button>
      </div>

      {!brief ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-sm text-slate-500">
          Click "Refresh Re-entry Brief" above to compile your 8-item Care Re-entry Brief.
        </div>
      ) : (
        <div className="space-y-5">
          {/* Top 4 concise orientation fields */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-xs font-medium text-slate-500">1. Navigation Context</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{brief.currentNavigationContext}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">2. Last Activity</div>
              <div className="mt-1 text-sm font-semibold text-slate-900 tabular-nums">{brief.lastRecordedActivity}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">3. Open Follow-Up Tasks</div>
              <div className="mt-1 text-sm font-semibold text-slate-900 tabular-nums">
                {brief.openFollowUpTaskIds.length} open
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">4. Brief Generated</div>
              <div className="mt-1 text-sm font-semibold text-slate-900 tabular-nums">
                {brief.generatedAt.slice(0, 16).replace('T', ' ')}
              </div>
            </div>
          </div>

          {/* Strict 4-bucket provenance layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Bucket 1 · VERIFIED SOURCE INFORMATION
              </div>
              {brief.verifiedSourceInformation.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No live verified JSM or Confluence items retrieved yet (Sample fixtures are strictly kept out of Bucket 1).
                </p>
              ) : (
                <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
                  {brief.verifiedSourceInformation.map((item, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-semibold text-slate-900">{item.sourceLabel}</div>
                      <div>{item.text}</div>
                      {item.sourceUrl && (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline"
                        >
                          <span>Verify Original Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Bucket 2 · USER-RECORDED INFORMATION
              </div>
              {brief.userRecordedInformation.length === 0 ? (
                <p className="text-xs text-slate-500">No user-recorded tasks yet.</p>
              ) : (
                <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
                  {brief.userRecordedInformation.map((item, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Bucket 3 · AI-GENERATED SUGGESTION — UNCONFIRMED
                </div>
                {brief.aiGeneratedSuggestionUnconfirmed.humanReviewed && (
                  <span className="text-xs font-semibold text-teal-700 inline-flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5" /> Reviewed
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {brief.aiGeneratedSuggestionUnconfirmed.suggestedNextAdminAction}
              </p>
              <p className="text-xs text-slate-700">
                {brief.aiGeneratedSuggestionUnconfirmed.supportingRationale}
              </p>
              {!brief.aiGeneratedSuggestionUnconfirmed.humanReviewed && (
                <button
                  type="button"
                  onClick={onMarkAiSuggestionReviewed}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-xs font-semibold text-amber-950 cursor-pointer"
                >
                  Mark Suggestion Reviewed by Human
                </button>
              )}
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Bucket 4 · MISSING OR UNAVAILABLE CONTEXT
              </div>
              {brief.missingOrUnavailableContext.length === 0 ? (
                <p className="text-xs text-slate-500">All expected connections and due dates are present.</p>
              ) : (
                <ul className="list-disc pl-4 space-y-1.5 text-xs sm:text-sm text-slate-800">
                  {brief.missingOrUnavailableContext.map((gap, idx) => (
                    <li key={idx}>{gap}</li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------------
// 7. Privacy and Consent
// ----------------------------------------------------------------------------
interface PrivacyConsentProps {
  bundle: CareBridgeWorkspaceBundle;
  storageMode: 'firestore' | 'local';
  isAuthenticated: boolean;
  onUpdateConsents: (patch: Partial<CareBridgeConsentState>) => void;
  onExportJson: () => void;
  onDeleteAllUserData: () => void;
}

export const PrivacyAndConsentSection: React.FC<PrivacyConsentProps> = ({
  bundle,
  storageMode,
  isAuthenticated,
  onUpdateConsents,
  onExportJson,
  onDeleteAllUserData,
}) => {
  const [confirmPurge, setConfirmPurge] = useState(false);

  const consents = bundle.consents;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <span>Privacy, Consent &amp; Data Minimization Controls</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Outbound JSM, Confluence, and AI features stay disabled by default until explicitly enabled.
            Storage mode: {storageMode === 'firestore' ? 'Owner-isolated Firebase Firestore' : 'Local browser sandbox'} ({isAuthenticated ? 'Signed in' : 'Guest session'}).
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            {
              key: 'jsmMinimalSyncConsent' as const,
              title: 'Jira Service Management Follow-Up Consent',
              desc: 'Allow reading JSM Service Desks and creating explicitly confirmed, data-minimized follow-up tickets.',
            },
            {
              key: 'confluenceReadConsent' as const,
              title: 'Authorized Confluence Knowledge Read',
              desc: 'Allow searching Confluence spaces authorized for the connected Atlassian account.',
            },
            {
              key: 'rovoAssistantConsent' as const,
              title: 'Rovo Healthcare Navigator Consent',
              desc: 'Allow running CareBridge Rovo care-navigation assistance with unverified labeling.',
            },
            {
              key: 'geminiSynthesisConsent' as const,
              title: 'External Gemini AI Synthesis Consent',
              desc: 'Allow sending PII-scrubbed non-diagnostic coordination metadata to server-side Gemini.',
            },
            {
              key: 'wellnessReferenceOptIn' as const,
              title: 'Optional Health Alert Mini Cross-Reference Opt-In',
              desc: 'Keep disabled unless you choose to reference non-diagnostic administrative check-in dates inside CareBridge.',
            },
          ].map((item) => (
            <label
              key={item.key}
              className="py-3.5 flex items-start justify-between gap-4 cursor-pointer min-h-[44px]"
            >
              <div>
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="text-xs text-slate-600 mt-0.5">{item.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={Boolean(consents[item.key])}
                onChange={(e) => onUpdateConsents({ [item.key]: e.target.checked })}
                className="mt-1 w-5 h-5 accent-teal-700 shrink-0"
              />
            </label>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-700 block">Retention Policy (Completed &amp; Deferred Tasks)</span>
            <select
              value={consents.retentionPolicy}
              onChange={(e) =>
                onUpdateConsents({ retentionPolicy: e.target.value as CareBridgeRetentionPolicy })
              }
              className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="30_days">Auto-prune completed after 30 days</option>
              <option value="90_days">Auto-prune completed after 90 days</option>
              <option value="365_days">Auto-prune completed after 365 days</option>
              <option value="manual_only">Keep until manually deleted</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onExportJson}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CareBridge JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Explicit user deletion control */}
      <div className="bg-white border border-rose-200 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-rose-900">
          <Lock className="w-4 h-4" />
          <span>Delete CareBridge Tasks, Briefs &amp; Integration State</span>
        </div>
        <p className="text-xs text-slate-600">
          Permanently removes stored CareBridge tasks, briefs, consents, and local sandbox records for your account.
        </p>
        {!confirmPurge ? (
          <button
            type="button"
            onClick={() => setConfirmPurge(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-rose-300 text-xs font-semibold text-rose-800 hover:bg-rose-50 inline-flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Request Data Deletion...</span>
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onDeleteAllUserData();
                setConfirmPurge(false);
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer"
            >
              Confirm Permanent Deletion
            </button>
            <button
              type="button"
              onClick={() => setConfirmPurge(false)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 8. Activity and Audit History
// ----------------------------------------------------------------------------
interface AuditHistoryProps {
  bundle: CareBridgeWorkspaceBundle;
}

export const ActivityAndAuditSection: React.FC<AuditHistoryProps> = ({ bundle }) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'task' | 'jsm' | 'confluence' | 'rovo_ai' | 'privacy' | 'system'>('all');

  const logs =
    categoryFilter === 'all'
      ? bundle.auditLogs
      : bundle.auditLogs.filter((l) => l.category === categoryFilter);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-teal-700" />
            <span>Activity and Audit History ({logs.length})</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Chronological append-only ledger tracking task changes, JSM/Confluence requests, consent checks, and AI runs.
          </p>
        </div>

        <select
          aria-label="Filter audit category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as any)}
          className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
        >
          <option value="all">All categories</option>
          <option value="task">Care Tasks</option>
          <option value="jsm">Jira Service Management</option>
          <option value="confluence">Confluence Knowledge</option>
          <option value="rovo_ai">Rovo &amp; Gemini AI</option>
          <option value="privacy">Privacy &amp; Consent</option>
          <option value="system">System</option>
        </select>
      </div>

      {logs.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">
          No audit entries recorded for this filter.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {logs.map((entry) => (
            <div key={entry.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
              <div className="space-y-0.5">
                <div className="font-mono text-xs text-slate-500 tabular-nums">
                  {entry.timestamp.slice(0, 19).replace('T', ' ')} · {entry.category.toUpperCase()} · {entry.action}
                </div>
                <div className="text-slate-900">{entry.summary}</div>
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wide shrink-0 ${
                  entry.outcome === 'allowed'
                    ? 'text-teal-700'
                    : entry.outcome === 'blocked'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                }`}
              >
                {entry.outcome}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
