// ============================================================================
// DR. T — CAREBRIDGE SECTIONS 3, 4 & 5
// 3. Clinical Knowledge Hub (Confluence search + verbatim vs AI summary separation)
// 4. Jira Service Management (desks, confirmed minimal creation, lookup, task link)
// 5. Rovo Healthcare Assistant (4 Rovo actions + explicit unverified banner)
// ============================================================================

import React, { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Bot,
  ExternalLink,
  Link2,
  RefreshCw,
  Search,
  Send,
  TicketCheck,
} from 'lucide-react';
import {
  CareBridgeConfluencePage,
  CareBridgeConnectionDisplayStatus,
  CareBridgeJsmRequest,
  CareBridgeJsmServiceDesk,
  CareBridgeKnowledgeSummary,
  CareBridgeRovoAssistantOutput,
  CareBridgeVerificationReport,
  CareBridgeWorkspaceBundle,
} from '../../../types/carebridgeTypes';
import {
  buildLocalGroundedRovoOutput,
  checkCareBridgeDataMinimization,
} from '../utils/carebridgeEngine';

// ----------------------------------------------------------------------------
// 3. Clinical Knowledge Hub (Confluence)
// ----------------------------------------------------------------------------
interface KnowledgeHubProps {
  bundle: CareBridgeWorkspaceBundle;
  onSaveConfluenceResults: (pages: CareBridgeConfluencePage[], connected: boolean, message: string) => void;
  onLogAudit: (category: 'confluence' | 'rovo_ai', action: string, outcome: 'allowed' | 'blocked' | 'error', summary: string) => void;
}

export const ClinicalKnowledgeHubSection: React.FC<KnowledgeHubProps> = ({
  bundle,
  onSaveConfluenceResults,
  onLogAudit,
}) => {
  const [queryText, setQueryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, CareBridgeKnowledgeSummary>>({});
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  const handleSearchConfluence = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!bundle.consents.confluenceReadConsent) {
      setErrorMsg('Enable "Authorized Confluence Knowledge Read" in Privacy and Consent first.');
      onLogAudit('confluence', 'confluence_search_blocked', 'blocked', 'Blocked Confluence search because consent is disabled.');
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`/api/carebridge/atlassian/confluence/pages?q=${encodeURIComponent(queryText)}&consentGranted=true`);
      const data = await resp.json();
      if (!resp.ok || !data.connected) {
        const msg = data.error || data.message || `Confluence unavailable (HTTP ${resp.status}).`;
        setErrorMsg(msg);
        onLogAudit('confluence', 'confluence_search_unavailable', 'error', msg);
        return;
      }
      const pages: CareBridgeConfluencePage[] = Array.isArray(data.pages) ? data.pages : [];
      onSaveConfluenceResults(pages, true, `Retrieved ${pages.length} authorized Confluence page(s).`);
      onLogAudit('confluence', 'confluence_search_success', 'allowed', `Retrieved ${pages.length} Confluence knowledge page(s).`);
    } catch (err: any) {
      const msg = err?.message || 'Unable to query Confluence REST proxy.';
      setErrorMsg(msg);
      onLogAudit('confluence', 'confluence_search_error', 'error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizePage = async (page: CareBridgeConfluencePage) => {
    setErrorMsg(null);
    if (!bundle.consents.geminiSynthesisConsent) {
      setErrorMsg('Enable "External Gemini Synthesis Consent" in Privacy and Consent to generate an AI summary.');
      onLogAudit('rovo_ai', 'confluence_summary_blocked', 'blocked', 'Blocked AI summary without explicit Gemini consent.');
      return;
    }
    setSummarizingId(page.id);
    try {
      const resp = await fetch('/api/carebridge/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'knowledge_page_summary',
          prompt: `Summarize administrative care-navigation takeaways strictly from Confluence page "${page.title}". Never invent clinical rules.`,
          geminiConsentGranted: bundle.consents.geminiSynthesisConsent,
          rovoConsentGranted: true,
          navigationContext: bundle.navigationContextTitle,
          tasks: [],
          knowledgePages: [page],
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.result) {
        const msg = data.error || 'Gemini AI summarization unavailable right now.';
        setErrorMsg(msg);
        onLogAudit('rovo_ai', 'confluence_summary_unavailable', 'error', msg);
        return;
      }
      setSummaries((prev) => ({
        ...prev,
        [page.id]: {
          pageId: page.id,
          pageTitle: page.title,
          sourceUrl: page.url,
          sourceExcerpt: page.excerpt,
          aiSummaryText: data.result.aiSummaryOrSuggestion,
          unverifiedLabel: data.result.unverifiedBanner,
          missingInformation: data.result.missingInformation || [],
          generatedBy: 'gemini',
          model: data.result.model,
          generatedAt: new Date().toISOString(),
        },
      }));
      onLogAudit('rovo_ai', 'confluence_ai_summary_generated', 'allowed', `Generated unverified AI summary for Confluence page ${page.id}.`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to generate AI page summary.');
    } finally {
      setSummarizingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearchConfluence} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" />
            <span>Clinical Knowledge Hub (Authorized Confluence)</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Queries authorized Confluence spaces via server-side Atlassian REST / Forge asUser(). Source excerpts and AI-generated summaries are never mixed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search Confluence playbooks (e.g. post-visit, transport, scheduling)"
            className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching...' : 'Search Authorized Confluence'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            {errorMsg}
          </div>
        )}
      </form>

      <div className="space-y-4">
        {bundle.knowledgePages.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-sm text-slate-500">
            No Confluence pages retrieved yet. Connect authorized Atlassian credentials or load Sample Preview Sandbox from Overview.
          </div>
        ) : (
          bundle.knowledgePages.map((pg) => {
            const summary = summaries[pg.id];
            return (
              <article key={pg.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-500 font-mono">
                      {pg.dataOrigin === 'live_confluence' ? 'Live Confluence Source' : 'Sample Preview Fixture'} · Space {pg.spaceKey} · Page #{pg.id}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{pg.title}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={pg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-teal-700 inline-flex items-center gap-1.5"
                    >
                      <span>Open Source Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleSummarizePage(pg)}
                      disabled={summarizingId === pg.id}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                    >
                      {summarizingId === pg.id ? 'Summarizing...' : 'AI Summarize Excerpt'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Original Source Excerpt ({pg.dataOrigin === 'live_confluence' ? 'Authorized Confluence' : 'Sample Fixture'})
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">{pg.excerpt || 'No excerpt returned.'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      {summary ? summary.unverifiedLabel : 'AI-Generated Summary (Not Run)'}
                    </div>
                    {summary ? (
                      <>
                        <p className="text-xs sm:text-sm text-slate-900 leading-relaxed">{summary.aiSummaryText}</p>
                        {summary.missingInformation.length > 0 && (
                          <p className="text-xs text-amber-900 mt-1">
                            Missing context: {summary.missingInformation.join('; ')}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-slate-600">
                        Optional AI synthesis runs only with explicit consent and always remains labeled unverified.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 4. Jira Service Management Section
// ----------------------------------------------------------------------------
interface JsmSectionProps {
  bundle: CareBridgeWorkspaceBundle;
  defaultSiteUrl?: string;
  defaultServiceDeskId?: string;
  defaultRequestTypeId?: string;
  connectionDisplayStatus?: CareBridgeConnectionDisplayStatus;
  verificationReport?: CareBridgeVerificationReport | null;
  verifyingConnection?: boolean;
  onVerifyConnection?: () => Promise<CareBridgeVerificationReport | null>;
  onSyncJsmRequests: (requests: CareBridgeJsmRequest[], connected: boolean, statusMsg: string) => void;
  onCreateJsmSuccess: (request: CareBridgeJsmRequest, linkedTaskId?: string) => void;
  onLinkExistingToTask: (request: CareBridgeJsmRequest, taskId: string) => void;
  onLogAudit: (category: 'jsm', action: string, outcome: 'allowed' | 'blocked' | 'error', summary: string) => void;
}

export const JiraServiceManagementSection: React.FC<JsmSectionProps> = ({
  bundle,
  defaultSiteUrl = 'https://zenieverse.atlassian.net',
  defaultServiceDeskId = '2',
  defaultRequestTypeId = '5',
  connectionDisplayStatus = 'Unavailable',
  verificationReport = null,
  verifyingConnection = false,
  onVerifyConnection,
  onSyncJsmRequests,
  onCreateJsmSuccess,
  onLinkExistingToTask,
  onLogAudit,
}) => {
  const [desks, setDesks] = useState<CareBridgeJsmServiceDesk[]>([]);
  const [serviceDeskId, setServiceDeskId] = useState(defaultServiceDeskId);
  const [requestTypeId, setRequestTypeId] = useState(defaultRequestTypeId);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [taskIdToLink, setTaskIdToLink] = useState('');
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [testRequestConfirmed, setTestRequestConfirmed] = useState(false);
  const [sendingTestRequest, setSendingTestRequest] = useState(false);
  const [createdTestRequest, setCreatedTestRequest] = useState<CareBridgeJsmRequest | null>(null);
  const [lookupKey, setLookupKey] = useState('');
  const [loadingDesks, setLoadingDesks] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'warn'; text: string } | null>(null);
  const [linkSelectByIssue, setLinkSelectByIssue] = useState<Record<string, string>>({});

  const minimization = checkCareBridgeDataMinimization(`${summary} ${description}`);

  const handleLoadDesksAndRequests = async () => {
    setFeedback(null);
    if (!bundle.consents.jsmMinimalSyncConsent) {
      const msg = 'Enable "Jira Service Management Follow-Up Consent" in Privacy and Consent before connecting.';
      setFeedback({ kind: 'warn', text: msg });
      onLogAudit('jsm', 'jsm_sync_blocked', 'blocked', msg);
      return;
    }
    setLoadingDesks(true);
    try {
      const [desksResp, reqResp] = await Promise.all([
        fetch('/api/carebridge/atlassian/jsm/desks'),
        fetch('/api/carebridge/atlassian/jsm/requests'),
      ]);
      const desksData = await desksResp.json();
      const reqData = await reqResp.json();
      if (!desksResp.ok || !desksData.connected) {
        const msg = desksData.error || desksData.message || 'Jira Service Management live REST service is not configured.';
        setFeedback({ kind: 'warn', text: msg });
        onSyncJsmRequests(bundle.linkedRequests, false, msg);
        onLogAudit('jsm', 'jsm_sync_unavailable', 'error', msg);
        return;
      }
      const loadedDesks: CareBridgeJsmServiceDesk[] = desksData.desks || [];
      setDesks(loadedDesks);
      const preferredDesk = loadedDesks.find((d) => d.id === defaultServiceDeskId) || loadedDesks[0];
      if (preferredDesk) {
        setServiceDeskId(preferredDesk.id);
        const preferredType =
          preferredDesk.requestTypes?.find((rt) => rt.id === defaultRequestTypeId) ||
          preferredDesk.requestTypes?.[0];
        setRequestTypeId(preferredType?.id || defaultRequestTypeId);
      }
      const loadedReqs: CareBridgeJsmRequest[] = reqData.requests || [];
      onSyncJsmRequests(loadedReqs, true, `Connected to JSM (${loadedDesks.length} desk(s), ${loadedReqs.length} request(s)).`);
      onLogAudit('jsm', 'jsm_sync_success', 'allowed', `Loaded ${loadedDesks.length} JSM service desk(s) and ${loadedReqs.length} request(s).`);
      setFeedback({ kind: 'ok', text: `Loaded ${loadedDesks.length} Service Desk(s) and ${loadedReqs.length} JSM request(s).` });
    } catch (err: any) {
      const msg = err?.message || 'Unable to reach JSM REST proxy.';
      setFeedback({ kind: 'warn', text: msg });
      onLogAudit('jsm', 'jsm_sync_error', 'error', msg);
    } finally {
      setLoadingDesks(false);
    }
  };

  const handleLookupRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!bundle.consents.jsmMinimalSyncConsent) {
      setFeedback({ kind: 'warn', text: 'Enable JSM consent in Privacy and Consent first.' });
      return;
    }
    try {
      const resp = await fetch(`/api/carebridge/atlassian/jsm/requests/${encodeURIComponent(lookupKey.trim().toUpperCase())}`);
      const data = await resp.json();
      if (!resp.ok || !data.request) {
        const msg = data.error || data.message || `Request ${lookupKey} could not be retrieved.`;
        setFeedback({ kind: 'warn', text: msg });
        onLogAudit('jsm', 'jsm_lookup_failed', 'error', msg);
        return;
      }
      const req: CareBridgeJsmRequest = data.request;
      const merged = [req, ...bundle.linkedRequests.filter((r) => r.issueKey !== req.issueKey)];
      onSyncJsmRequests(merged, true, `Retrieved ${req.issueKey} (${req.status}).`);
      onLogAudit('jsm', 'jsm_lookup_success', 'allowed', `Retrieved JSM request ${req.issueKey} (${req.status}).`);
      setFeedback({ kind: 'ok', text: `Retrieved ${req.issueKey} · Status: ${req.status}` });
      setLookupKey('');
    } catch (err: any) {
      setFeedback({ kind: 'warn', text: err?.message || 'Request lookup failed.' });
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (connectionDisplayStatus !== 'Connected') {
      const msg = `Live Atlassian connection status is "${connectionDisplayStatus}". Verify connection above until status reports Connected before creating a JSM request.`;
      setFeedback({ kind: 'warn', text: msg });
      onLogAudit('jsm', 'jsm_create_blocked_disconnected', 'blocked', msg);
      return;
    }
    if (!bundle.consents.jsmMinimalSyncConsent || !userConfirmed) {
      const msg = 'Explicit consent in Privacy and Consent plus the confirmation checkbox below are both required.';
      setFeedback({ kind: 'warn', text: msg });
      onLogAudit('jsm', 'jsm_create_blocked', 'blocked', msg);
      return;
    }
    if (!minimization.safe) {
      const msg = `Blocked by data minimization: ${minimization.warnings.join(' ')}`;
      setFeedback({ kind: 'warn', text: msg });
      onLogAudit('jsm', 'jsm_create_phi_blocked', 'blocked', msg);
      return;
    }
    setSubmitting(true);
    try {
      const resp = await fetch('/api/carebridge/atlassian/jsm/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteUrl: defaultSiteUrl,
          serviceDeskId,
          requestTypeId,
          summary,
          minimalNote: description,
          description,
          jsmConsentGranted: true,
          userConfirmed: true,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.request) {
        const msg = data.error || data.message || `JSM creation failed (HTTP ${resp.status}). No ticket was fabricated.`;
        setFeedback({ kind: 'warn', text: msg });
        onLogAudit('jsm', 'jsm_create_failed', 'error', msg);
        return;
      }
      const created: CareBridgeJsmRequest = data.request;
      onCreateJsmSuccess(created, taskIdToLink || undefined);
      onLogAudit('jsm', 'jsm_request_created', 'allowed', `Created JSM follow-up request ${created.issueKey}.`);
      setFeedback({ kind: 'ok', text: `Created JSM request ${created.issueKey} (${created.status}).` });
      setSummary('');
      setDescription('');
      setUserConfirmed(false);
    } catch (err: any) {
      setFeedback({ kind: 'warn', text: err?.message || 'Unable to submit JSM request.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRunVerification = async () => {
    setFeedback(null);
    if (!onVerifyConnection) return;
    const report = await onVerifyConnection();
    if (report) {
      onLogAudit(
        'jsm',
        'atlassian_readonly_verification',
        report.allChecksPassed ? 'allowed' : 'error',
        `Read-only Atlassian verification returned ${report.status}${report.safeError ? `: ${report.safeError}` : ''}.`
      );
      if (report.allChecksPassed) {
        setFeedback({
          kind: 'ok',
          text: `Verified live connection to ${report.siteUrl} · Service Desk ${report.expectedServiceDeskId} (${report.actualProjectKey}) · Request Type ${report.expectedRequestTypeId} ("${report.actualRequestTypeName}"). No ticket was created.`,
        });
      } else {
        setFeedback({
          kind: 'warn',
          text: `${report.status}: ${report.safeError || 'Verification checks did not complete.'}`,
        });
      }
    }
  };

  const handleSendAuthorizedTestRequest = async () => {
    setFeedback(null);
    if (!verificationReport?.allChecksPassed) {
      setFeedback({
        kind: 'warn',
        text: 'Run read-only connection verification and confirm status "Connected" before running the authorized test-request workflow.',
      });
      return;
    }
    if (!bundle.consents.jsmMinimalSyncConsent || !testRequestConfirmed) {
      const msg = 'Enable JSM consent in Privacy and Consent and check explicit test-request confirmation first.';
      setFeedback({ kind: 'warn', text: msg });
      onLogAudit('jsm', 'jsm_authorized_test_blocked', 'blocked', msg);
      return;
    }
    setSendingTestRequest(true);
    try {
      const resp = await fetch('/api/carebridge/atlassian/jsm/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteUrl: defaultSiteUrl,
          serviceDeskId: verificationReport.expectedServiceDeskId || defaultServiceDeskId,
          requestTypeId: verificationReport.expectedRequestTypeId || defaultRequestTypeId,
          summary: 'CareBridge Authorized Integration Verification Request (Non-Clinical)',
          minimalNote:
            'Explicitly user-confirmed administrative connectivity test from Dr. T CareBridge. Contains no patient or clinical data.',
          jsmConsentGranted: true,
          userConfirmed: true,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.request) {
        const msg = data.error || data.message || `Authorized test request failed (HTTP ${resp.status}).`;
        setFeedback({ kind: 'warn', text: msg });
        onLogAudit('jsm', 'jsm_authorized_test_failed', 'error', msg);
        return;
      }
      const created: CareBridgeJsmRequest = data.request;
      setCreatedTestRequest(created);
      onCreateJsmSuccess(created);
      setTestRequestConfirmed(false);
      onLogAudit(
        'jsm',
        'jsm_authorized_test_created',
        'allowed',
        `Created explicitly confirmed test request ${created.issueKey} on Desk ${created.serviceDeskId} (Type ${created.requestTypeId}).`
      );
      setFeedback({
        kind: 'ok',
        text: `Authorized test request ${created.issueKey} created (${created.status}).`,
      });
    } catch (err: any) {
      const msg = err?.message || 'Unable to submit authorized test request.';
      setFeedback({ kind: 'warn', text: msg });
      onLogAudit('jsm', 'jsm_authorized_test_error', 'error', msg);
    } finally {
      setSendingTestRequest(false);
    }
  };

  const activeDesk = desks.find((d) => d.id === serviceDeskId);

  const statusBadgeClass =
    connectionDisplayStatus === 'Connected'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
      : connectionDisplayStatus === 'Unauthorized'
        ? 'bg-rose-50 border-rose-200 text-rose-800'
        : connectionDisplayStatus === 'Permission Denied'
          ? 'bg-amber-50 border-amber-300 text-amber-900'
          : 'bg-slate-100 border-slate-200 text-slate-700';

  return (
    <div className="space-y-6">
      {/* Live Read-Only Connection Status & Verification Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Atlassian Connection Status</h2>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${statusBadgeClass}`}>
                {verifyingConnection ? 'Verifying...' : connectionDisplayStatus}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Target: <span className="font-mono">{defaultSiteUrl}</span> · Desk <span className="font-mono">{defaultServiceDeskId}</span> (CR2) · Request Type <span className="font-mono">{defaultRequestTypeId}</span>. Verification is strictly read-only and never creates a ticket.
            </p>
          </div>
          {onVerifyConnection && (
            <button
              type="button"
              onClick={handleRunVerification}
              disabled={verifyingConnection}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-2 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${verifyingConnection ? 'animate-spin' : ''}`} />
              <span>{verifyingConnection ? 'Verifying...' : 'Verify Connection (Read-Only)'}</span>
            </button>
          )}
        </div>

        {verificationReport && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {verificationReport.checks.map((chk) => (
              <div
                key={chk.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200/70"
              >
                <div>
                  <span className="font-semibold text-slate-900">{chk.label}</span>
                  <p className="text-slate-600 mt-0.5">{chk.detail}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold self-start sm:self-center shrink-0 ${
                    chk.outcome === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : chk.outcome === 'FAILED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {chk.outcome}
                </span>
              </div>
            ))}
            {verificationReport.safeError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Safe Diagnostic:</strong> {verificationReport.safeError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Explicitly Authorized Test-Request Workflow (Gated until all read-only checks pass) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Authorized Test-Request Workflow</h3>
            <p className="text-xs text-slate-600">
              Unlocked only after all read-only checks report Connected. Creates a single non-clinical administrative request only upon explicit confirmation.
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 ${
              verificationReport?.allChecksPassed
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {verificationReport?.allChecksPassed ? 'Ready for Confirmation' : 'Locked Until Connected'}
          </span>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={testRequestConfirmed}
            disabled={!verificationReport?.allChecksPassed}
            onChange={(e) => setTestRequestConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-teal-700"
          />
          <span>
            I explicitly authorize sending one minimal, non-clinical verification test request to{' '}
            <span className="font-mono">{defaultSiteUrl}</span> (Desk {defaultServiceDeskId} / CR2, Type {defaultRequestTypeId}: Submit a request or incident).
          </span>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {createdTestRequest ? (
            <a
              href={createdTestRequest.requestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-teal-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Created {createdTestRequest.issueKey} ({createdTestRequest.status})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-xs text-slate-500">No test request sent in this session.</span>
          )}
          <button
            type="button"
            onClick={handleSendAuthorizedTestRequest}
            disabled={
              sendingTestRequest ||
              !verificationReport?.allChecksPassed ||
              !testRequestConfirmed ||
              !bundle.consents.jsmMinimalSyncConsent
            }
            className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{sendingTestRequest ? 'Sending Test Request...' : 'Confirm & Send Authorized Test Request'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TicketCheck className="w-5 h-5 text-teal-700" />
              <span>Jira Service Management Integration</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Uses official <code className="font-mono">/rest/servicedeskapi/*</code> endpoints. CareBridge never claims a request exists unless confirmed by the live JSM API.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLoadDesksAndRequests}
            disabled={loadingDesks}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loadingDesks ? 'animate-spin' : ''}`} />
            <span>{loadingDesks ? 'Connecting...' : 'Fetch Live JSM Desks & Requests'}</span>
          </button>
        </div>

        <form onSubmit={handleLookupRequest} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            value={lookupKey}
            onChange={(e) => setLookupKey(e.target.value)}
            placeholder="Lookup real JSM request key (e.g. CR2-1)"
            className="flex-1 min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900"
            required
          />
          <button
            type="submit"
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer"
          >
            Inspect Request Details
          </button>
        </form>

        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs font-medium border ${
              feedback.kind === 'ok'
                ? 'bg-teal-50 border-teal-200 text-teal-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>

      {/* Create minimal consented request */}
      <form onSubmit={handleCreateRequest} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Create Follow-Up Request (Data-Minimized &amp; Confirmed)</h3>
          <p className="text-xs text-slate-600">
            Sensitive medical identifiers (SSN, MRN, DOB, lab values, diagnoses) are blocked before transmission.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Service Desk ID</span>
            {desks.length > 0 ? (
              <select
                value={serviceDeskId}
                onChange={(e) => {
                  const id = e.target.value;
                  setServiceDeskId(id);
                  const found = desks.find((d) => d.id === id);
                  setRequestTypeId(found?.requestTypes?.[0]?.id || '');
                }}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                required
              >
                {desks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id} · {d.projectName} ({d.projectKey})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={serviceDeskId}
                onChange={(e) => setServiceDeskId(e.target.value)}
                placeholder="Numeric Service Desk ID"
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
                required
              />
            )}
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Request Type ID</span>
            {activeDesk && activeDesk.requestTypes.length > 0 ? (
              <select
                value={requestTypeId}
                onChange={(e) => setRequestTypeId(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                required
              >
                {activeDesk.requestTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.id} · {rt.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={requestTypeId}
                onChange={(e) => setRequestTypeId(e.target.value)}
                placeholder="Numeric Request Type ID"
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
                required
              />
            )}
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Link to CareBridge Task</span>
            <select
              value={taskIdToLink}
              onChange={(e) => setTaskIdToLink(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="">Optional — link after confirmation</option>
              {bundle.tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id}: {t.description.slice(0, 34)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-semibold text-slate-700">Minimal Follow-Up Summary</span>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="e.g. Confirm outpatient referral scheduling window"
            className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-semibold text-slate-700">Consented Administrative Context</span>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe non-emergency coordination details without personal medical identifiers."
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
            required
          />
        </label>

        {!minimization.safe && (summary.trim() || description.trim()) && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
            <strong>Data Minimization Block:</strong> {minimization.warnings.join(' ')}
          </div>
        )}

        {connectionDisplayStatus !== 'Connected' && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
            <strong>Creation Locked ({connectionDisplayStatus}):</strong> Verify live Atlassian connection above so status reports <strong>Connected</strong> before sending any JSM request.
          </div>
        )}

        {/* Exact Data Transmission Disclosure Preview */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="font-bold uppercase tracking-wider text-slate-700">
            Exact Request &amp; Data Transmission Preview (No Credentials Included)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700 font-mono">
            <div>siteUrl: {defaultSiteUrl}</div>
            <div>serviceDeskId: {serviceDeskId} ({activeDesk?.projectKey || verificationReport?.actualProjectKey || 'CR2'})</div>
            <div>requestTypeId: {requestTypeId}</div>
            <div>linkedTaskId: {taskIdToLink || 'None'}</div>
          </div>
          <div className="text-slate-700">
            <span className="font-semibold">summary:</span> {summary.trim() || '(empty)'}
          </div>
          <div className="text-slate-700">
            <span className="font-semibold">minimalNote:</span> {description.trim() || '(empty)'}
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={userConfirmed}
            disabled={connectionDisplayStatus !== 'Connected'}
            onChange={(e) => setUserConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-teal-700"
          />
          <span>
            I confirm this JSM follow-up request contains minimal, consented administrative wording and approve transmitting the previewed fields above to Jira Service Management.
          </span>
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              submitting ||
              connectionDisplayStatus !== 'Connected' ||
              !userConfirmed ||
              !minimization.safe
            }
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting to JSM...' : 'Confirm & Create JSM Request'}</span>
          </button>
        </div>
      </form>

      {/* Linked & Retrieved Requests */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3">
        <h3 className="text-base font-bold text-slate-900 tabular-nums">
          JSM Requests ({bundle.linkedRequests.length})
        </h3>
        {bundle.linkedRequests.length === 0 ? (
          <p className="text-xs text-slate-500">
            No live or sample JSM requests loaded yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {bundle.linkedRequests.map((req) => (
              <div key={req.issueKey} className="py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-slate-500">
                    {req.issueKey} · {req.status} · {req.dataOrigin === 'live_jsm' ? 'Live JSM API' : 'Sample Preview Fixture'}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">{req.summary}</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {bundle.tasks.length > 0 && (
                    <>
                      <select
                        aria-label={`Select task to link ${req.issueKey}`}
                        value={linkSelectByIssue[req.issueKey] || bundle.tasks[0].id}
                        onChange={(e) =>
                          setLinkSelectByIssue((prev) => ({ ...prev, [req.issueKey]: e.target.value }))
                        }
                        className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                      >
                        {bundle.tasks.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.id}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          onLinkExistingToTask(req, linkSelectByIssue[req.issueKey] || bundle.tasks[0].id)
                        }
                        className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Link to Task</span>
                      </button>
                    </>
                  )}
                  <a
                    href={req.requestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-teal-700 inline-flex items-center gap-1"
                  >
                    <span>Open JSM Request</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 5. Rovo Healthcare Assistant Section
// ----------------------------------------------------------------------------
interface RovoAssistantProps {
  bundle: CareBridgeWorkspaceBundle;
  onLogAudit: (category: 'rovo_ai', action: string, outcome: 'allowed' | 'blocked' | 'error', summary: string) => void;
}

export const RovoHealthcareAssistantSection: React.FC<RovoAssistantProps> = ({ bundle, onLogAudit }) => {
  const [actionType, setActionType] =
    useState<CareBridgeRovoAssistantOutput['actionType']>('summarize-care-context');
  const [prompt, setPrompt] = useState('Summarize open care-navigation tasks and highlight any missing information.');
  const [output, setOutput] = useState<CareBridgeRovoAssistantOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleRunAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!bundle.consents.rovoAssistantConsent) {
      const msg = 'Rovo Healthcare Assistant consent is turned off in Privacy and Consent.';
      setNotice(msg);
      onLogAudit('rovo_ai', 'rovo_assist_blocked', 'blocked', msg);
      return;
    }

    setLoading(true);
    try {
      if (bundle.consents.geminiSynthesisConsent) {
        const resp = await fetch('/api/carebridge/ai/assist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType,
            prompt,
            geminiConsentGranted: true,
            rovoConsentGranted: true,
            navigationContext: bundle.navigationContextTitle,
            tasks: bundle.tasks,
            knowledgePages: bundle.knowledgePages,
          }),
        });
        const data = await resp.json();
        if (resp.ok && data.result) {
          setOutput({
            id: `cb-rovo-${Date.now().toString(36)}`,
            actionType,
            prompt,
            unverifiedBanner: data.result.unverifiedBanner,
            nonClinicalNotice: data.result.nonClinicalNotice,
            verifiedSourceFacts: data.result.verifiedSourceFacts || [],
            userRecordedFacts: data.result.userRecordedFacts || [],
            aiNarrativeDraft: data.result.aiSummaryOrSuggestion,
            missingInformation: data.result.missingInformation || [],
            sourceLinks: data.result.sourceLinks || [],
            generatedBy: 'gemini',
            model: data.result.model,
            generatedAt: new Date().toISOString(),
          });
          onLogAudit('rovo_ai', `rovo_gemini_${actionType}`, 'allowed', `Generated Rovo-aligned Gemini draft for ${actionType}.`);
          setLoading(false);
          return;
        }
        setNotice(data.error || 'Gemini cloud synthesis unavailable — showing local grounded non-diagnostic brief instead.');
      } else {
        setNotice('Gemini cloud synthesis consent is off — using local grounded CareBridge Rovo preview.');
      }

      const localResult = buildLocalGroundedRovoOutput(
        actionType,
        prompt,
        bundle.tasks,
        bundle.knowledgePages,
        bundle.linkedRequests
      );
      setOutput(localResult);
      onLogAudit('rovo_ai', `rovo_local_${actionType}`, 'allowed', `Generated local grounded Rovo preview for ${actionType}.`);
    } catch {
      const localResult = buildLocalGroundedRovoOutput(
        actionType,
        prompt,
        bundle.tasks,
        bundle.knowledgePages,
        bundle.linkedRequests
      );
      setOutput(localResult);
      onLogAudit('rovo_ai', `rovo_local_fallback_${actionType}`, 'allowed', `Used local grounded fallback for ${actionType}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleRunAssistant} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-teal-700" />
            <span>Rovo Healthcare Assistant (<code className="font-mono text-sm">carebridge-navigator</code>)</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Supports 4 Forge Rovo <code className="font-mono">action</code> modules inside Atlassian Rovo and mirrored Gemini synthesis here. Never operates as a clinician.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Rovo Agent Action Module</span>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value as CareBridgeRovoAssistantOutput['actionType'])}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="summarize-care-context">summarize-care-context (Authorized Care Context)</option>
              <option value="retrieve-care-knowledge">retrieve-care-knowledge (Confluence Guidance)</option>
              <option value="summarize-followup-tasks">summarize-followup-tasks (Task Deadlines)</option>
              <option value="prepare-care-handoff">prepare-care-handoff (4-Bucket Care Handoff)</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Navigation Prompt</span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
              required
            />
          </label>
        </div>

        {notice && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            {notice}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold cursor-pointer"
          >
            {loading ? 'Running Rovo Navigator...' : 'Run CareBridge Rovo Action'}
          </button>
        </div>
      </form>

      {output && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <div className="font-bold">{output.unverifiedBanner}</div>
              <div className="mt-0.5">{output.nonClinicalNotice}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              AI Draft Narrative ({output.generatedBy === 'gemini' ? `Gemini ${output.model || ''}` : 'Local Grounded Helper'})
            </div>
            <p className="text-sm text-slate-900 leading-relaxed">{output.aiNarrativeDraft}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase">Verified Source Facts</div>
              {output.verifiedSourceFacts.length === 0 ? (
                <p className="text-xs text-slate-500">No live Atlassian source facts in scope.</p>
              ) : (
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                  {output.verifiedSourceFacts.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase">User-Recorded Facts</div>
              {output.userRecordedFacts.length === 0 ? (
                <p className="text-xs text-slate-500">No CareBridge tasks recorded yet.</p>
              ) : (
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                  {output.userRecordedFacts.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase">Missing Information</div>
              {output.missingInformation.length === 0 ? (
                <p className="text-xs text-slate-500">No gaps reported.</p>
              ) : (
                <ul className="list-disc pl-4 space-y-1 text-xs text-amber-900">
                  {output.missingInformation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
