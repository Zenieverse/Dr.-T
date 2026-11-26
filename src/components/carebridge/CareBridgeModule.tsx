// ============================================================================
// DR. T — CAREBRIDGE MAIN MODULE
// Codegeist 2026 | Track: Apps for Specialized Industries
// Healthcare care-navigation & non-emergency follow-up continuity workspace.
// Completely separate from HatBridge; responsive on iPad Safari, mobile, & desktop.
// ============================================================================

import React, { useEffect, useState } from 'react';
import {
  Activity,
  BookOpen,
  Bot,
  ClipboardList,
  FileText,
  History,
  ShieldCheck,
  TicketCheck,
} from 'lucide-react';
import { NavTab } from '../../types';
import {
  CareBridgeConnectionDisplayStatus,
  CareBridgeConsentState,
  CareBridgeFollowUpConsentRecord,
  CareBridgeJsmRequest,
  CareBridgePriority,
  CareBridgeSectionId,
  CareBridgeServerAuditEvent,
  CareBridgeTaskStatus,
  CareBridgeVerificationReport,
  CareBridgeWorkspaceBundle,
} from '../../types/carebridgeTypes';
import { getFirebaseIdToken, subscribeAuthState } from '../../services/firebase';
import { createEmptyCareWorkspace, createSamplePreviewBundle } from './data/carebridgeStarters';
import {
  deleteCareBridgeTaskFromStorage,
  getCareBridgeStorageOwner,
  loadCareBridgeWorkspace,
  purgeAllCareBridgeUserData,
  saveCareBridgeWorkspace,
} from './services/carebridgeStorageService';
import {
  appendWorkspaceAudit,
  applyRetentionPolicyCutoff,
  buildCareReentryBrief,
  createCareTaskRecord,
  linkJsmRequestToCareTask,
  updateCareTaskStatus,
} from './utils/carebridgeEngine';
import {
  CareCoordinationSection,
  CareOverviewSection,
} from './sections/CareBridgeOverviewAndCoordination';
import {
  ClinicalKnowledgeHubSection,
  JiraServiceManagementSection,
  RovoHealthcareAssistantSection,
} from './sections/CareBridgeAtlassianSections';
import {
  ActivityAndAuditSection,
  CareReentryBriefSection,
  PrivacyAndConsentSection,
} from './sections/CareBridgeBriefPrivacyAuditSections';

interface CareBridgeModuleProps {
  setActiveTab?: (tab: NavTab) => void;
}

const SECTION_NAV: Array<{
  id: CareBridgeSectionId;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: 'overview', label: '1. Care Overview', icon: <Activity className="w-4 h-4" /> },
  { id: 'coordination', label: '2. Care Coordination', icon: <ClipboardList className="w-4 h-4" /> },
  { id: 'knowledge', label: '3. Clinical Knowledge Hub', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'jsm', label: '4. Jira Service Management', icon: <TicketCheck className="w-4 h-4" /> },
  { id: 'rovo', label: '5. Rovo Assistant', icon: <Bot className="w-4 h-4" /> },
  { id: 'reentry-brief', label: '6. Care Re-entry Brief', icon: <FileText className="w-4 h-4" /> },
  { id: 'privacy', label: '7. Privacy & Consent', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'audit', label: '8. Activity & Audit', icon: <History className="w-4 h-4" /> },
];

export const CareBridgeModule: React.FC<CareBridgeModuleProps> = ({ setActiveTab }) => {
  const initialOwner = getCareBridgeStorageOwner();
  const [activeSection, setActiveSection] = useState<CareBridgeSectionId>('overview');
  const [bundle, setBundle] = useState<CareBridgeWorkspaceBundle>(() =>
    createEmptyCareWorkspace(initialOwner.userId)
  );
  const [storageMode, setStorageMode] = useState<'firestore' | 'local'>('local');
  const [isAuthenticated, setIsAuthenticated] = useState(initialOwner.isAuthenticated);
  const [serverReadyNote, setServerReadyNote] = useState<string>(
    'Checking Atlassian CareBridge integration status...'
  );
  const [defaultSiteUrl, setDefaultSiteUrl] = useState<string>('https://zenieverse.atlassian.net');
  const [defaultServiceDeskId, setDefaultServiceDeskId] = useState<string>('2');
  const [defaultRequestTypeId, setDefaultRequestTypeId] = useState<string>('5');
  const [connectionDisplayStatus, setConnectionDisplayStatus] =
    useState<CareBridgeConnectionDisplayStatus>('Unavailable');
  const [verificationReport, setVerificationReport] = useState<CareBridgeVerificationReport | null>(null);
  const [verifyingConnection, setVerifyingConnection] = useState<boolean>(false);
  const [serverFollowUpConsent, setServerFollowUpConsent] = useState<CareBridgeFollowUpConsentRecord | null>(null);
  const [followUpConsentBusy, setFollowUpConsentBusy] = useState<boolean>(false);
  const [followUpConsentMessage, setFollowUpConsentMessage] = useState<string | null>(null);
  const [serverAuditEvents, setServerAuditEvents] = useState<CareBridgeServerAuditEvent[]>([]);
  const [loadingServerAudit, setLoadingServerAudit] = useState<boolean>(false);

  const loadServerFollowUpState = async () => {
    const token = await getFirebaseIdToken();
    if (!token) {
      setServerFollowUpConsent(null);
      setServerAuditEvents([]);
      return;
    }
    try {
      setLoadingServerAudit(true);
      const [consentResp, auditResp] = await Promise.all([
        fetch('/api/carebridge/consent/followup', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/carebridge/followup/audit', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (consentResp.ok) {
        const cData = await consentResp.json();
        if (cData.consent) setServerFollowUpConsent(cData.consent as CareBridgeFollowUpConsentRecord);
      }
      if (auditResp.ok) {
        const aData = await auditResp.json();
        if (Array.isArray(aData.events)) setServerAuditEvents(aData.events as CareBridgeServerAuditEvent[]);
      }
    } catch {
      // Preserve local workspace when server unreachable
    } finally {
      setLoadingServerAudit(false);
    }
  };

  const refreshServerAuditEvents = async () => {
    const token = await getFirebaseIdToken();
    if (!token) return;
    setLoadingServerAudit(true);
    try {
      const resp = await fetch('/api/carebridge/followup/audit', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.events)) setServerAuditEvents(data.events as CareBridgeServerAuditEvent[]);
      }
    } finally {
      setLoadingServerAudit(false);
    }
  };

  const runReadOnlyConnectionVerification = async (): Promise<CareBridgeVerificationReport | null> => {
    setVerifyingConnection(true);
    try {
      const resp = await fetch('/api/carebridge/atlassian/verify');
      const data = await resp.json();
      if (resp.ok && data && Array.isArray(data.checks)) {
        const report = data as CareBridgeVerificationReport;
        setVerificationReport(report);
        setConnectionDisplayStatus(report.status);
        setServerReadyNote(
          report.allChecksPassed
            ? `Connected to ${report.siteUrl} · Desk ${report.expectedServiceDeskId} (${report.actualProjectKey || report.expectedProjectKey}) · Type ${report.expectedRequestTypeId}`
            : `${report.status}: ${report.safeError || 'Verification incomplete.'}`
        );
        return report;
      }
      setConnectionDisplayStatus('Unavailable');
      setServerReadyNote(data?.error || `Unavailable (HTTP ${resp.status}).`);
      return null;
    } catch {
      setConnectionDisplayStatus('Unavailable');
      setServerReadyNote('Unavailable — could not reach CareBridge verification service.');
      return null;
    } finally {
      setVerifyingConnection(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const owner = getCareBridgeStorageOwner();
      if (mounted) setIsAuthenticated(owner.isAuthenticated);
      const loaded = await loadCareBridgeWorkspace();
      if (mounted) {
        const refreshed = loaded.bundle.latestBrief
          ? loaded.bundle
          : { ...loaded.bundle, latestBrief: buildCareReentryBrief(loaded.bundle) };
        setBundle(refreshed);
        setStorageMode(loaded.storageMode);
      }
      try {
        const statusResp = await fetch('/api/carebridge/status');
        if (statusResp.ok && mounted) {
          const st = await statusResp.json();
          const configuredSite = st.siteUrl || st.defaultSiteUrl || 'https://zenieverse.atlassian.net';
          setDefaultSiteUrl(configuredSite);
          if (st.defaultServiceDeskId) setDefaultServiceDeskId(String(st.defaultServiceDeskId));
          if (st.defaultRequestTypeId) setDefaultRequestTypeId(String(st.defaultRequestTypeId));
          if (st.atlassianConfigured) {
            await runReadOnlyConnectionVerification();
          } else {
            setConnectionDisplayStatus('Unavailable');
            setServerReadyNote(
              st.safeError
                ? `Unavailable: ${st.safeError}`
                : `Configured target site ${configuredSite} (Desk ${st.defaultServiceDeskId || '2'}, Type ${st.defaultRequestTypeId || '5'}) — add server credentials for live verification.`
            );
          }
        }
      } catch {
        if (mounted) {
          setConnectionDisplayStatus('Unavailable');
          setServerReadyNote('Server integration status unavailable — running in local CareBridge workspace.');
        }
      }
      if (owner.isAuthenticated) {
        void loadServerFollowUpState();
      }
    })();
    const unsubscribeAuth = subscribeAuthState((user) => {
      if (!mounted) return;
      setIsAuthenticated(Boolean(user));
      if (user) {
        void loadServerFollowUpState();
      } else {
        setServerFollowUpConsent(null);
        setServerAuditEvents([]);
      }
    });
    return () => {
      mounted = false;
      unsubscribeAuth();
    };
  }, []);

  const persistBundle = (next: CareBridgeWorkspaceBundle) => {
    setBundle(next);
    void saveCareBridgeWorkspace(next).then((mode) => setStorageMode(mode));
  };

  const handleLoadSamplePreview = () => {
    const owner = getCareBridgeStorageOwner();
    const sample = createSamplePreviewBundle(owner.userId);
    const withBrief: CareBridgeWorkspaceBundle = {
      ...sample,
      latestBrief: buildCareReentryBrief(sample),
    };
    persistBundle(withBrief);
  };

  const handleClearSamplePreview = () => {
    const owner = getCareBridgeStorageOwner();
    const clean = createEmptyCareWorkspace(owner.userId);
    persistBundle({ ...clean, latestBrief: buildCareReentryBrief(clean) });
  };

  const handleCreateTask = (input: {
    contextRef: string;
    description: string;
    priority: CareBridgePriority;
    dueDate?: string;
    responsibleAssignee: string;
    jsmRequestKey?: string;
    confluencePageId?: string;
  }) => {
    const reqMatch = input.jsmRequestKey
      ? bundle.linkedRequests.find((r) => r.issueKey === input.jsmRequestKey)
      : undefined;
    const pgMatch = input.confluencePageId
      ? bundle.knowledgePages.find((p) => p.id === input.confluencePageId)
      : undefined;

    const task = createCareTaskRecord(bundle.consents.userId, {
      ...input,
      jsmRequestUrl: reqMatch?.requestUrl,
      jsmStatus: reqMatch?.status,
      confluenceUrl: pgMatch?.url,
    });

    const nextBase: CareBridgeWorkspaceBundle = {
      ...bundle,
      tasks: [task, ...bundle.tasks],
      auditLogs: appendWorkspaceAudit(bundle, {
        category: 'task',
        action: 'care_task_created',
        outcome: 'allowed',
        summary: `Recorded follow-up task ${task.id} (${task.priority}).`,
      }),
    };
    persistBundle({ ...nextBase, latestBrief: buildCareReentryBrief(nextBase) });
  };

  const handleUpdateTaskStatus = (taskId: string, status: CareBridgeTaskStatus) => {
    const nextBase: CareBridgeWorkspaceBundle = {
      ...bundle,
      tasks: bundle.tasks.map((t) =>
        t.id === taskId ? updateCareTaskStatus(t, status, bundle.consents.userId) : t
      ),
      auditLogs: appendWorkspaceAudit(bundle, {
        category: 'task',
        action: 'care_task_status_updated',
        outcome: 'allowed',
        summary: `Updated task ${taskId} status to ${status}.`,
      }),
    };
    persistBundle({ ...nextBase, latestBrief: buildCareReentryBrief(nextBase) });
  };

  const handleDeleteTask = (taskId: string) => {
    void deleteCareBridgeTaskFromStorage(taskId);
    const nextBase: CareBridgeWorkspaceBundle = {
      ...bundle,
      tasks: bundle.tasks.filter((t) => t.id !== taskId),
      auditLogs: appendWorkspaceAudit(bundle, {
        category: 'task',
        action: 'care_task_deleted',
        outcome: 'allowed',
        summary: `Deleted follow-up task ${taskId}.`,
      }),
    };
    persistBundle({ ...nextBase, latestBrief: buildCareReentryBrief(nextBase) });
  };

  const handleLogAudit = (
    category: 'task' | 'jsm' | 'confluence' | 'rovo_ai' | 'privacy' | 'system',
    action: string,
    outcome: 'allowed' | 'blocked' | 'error',
    summary: string
  ) => {
    persistBundle({
      ...bundle,
      auditLogs: appendWorkspaceAudit(bundle, { category, action, outcome, summary }),
    });
  };

  const handleUpdateConsents = (patch: Partial<CareBridgeConsentState>) => {
    const now = new Date().toISOString();
    let nextBundle: CareBridgeWorkspaceBundle = {
      ...bundle,
      consents: {
        ...bundle.consents,
        ...patch,
        consentGrantedAt: bundle.consents.consentGrantedAt || now,
        updatedAt: now,
      },
      auditLogs: appendWorkspaceAudit(bundle, {
        category: 'privacy',
        action: 'consent_settings_updated',
        outcome: 'allowed',
        summary: `Updated consent flags (${Object.keys(patch).join(', ')}).`,
      }),
    };
    if (patch.retentionPolicy) {
      nextBundle = applyRetentionPolicyCutoff(nextBundle, patch.retentionPolicy);
    }
    persistBundle({ ...nextBundle, latestBrief: buildCareReentryBrief(nextBundle) });
  };

  const handleFollowUpConsentAction = async (action: 'grant' | 'withdraw') => {
    setFollowUpConsentMessage(null);
    setFollowUpConsentBusy(true);
    try {
      const token = await getFirebaseIdToken();
      if (!token) {
        handleUpdateConsents({
          jsmMinimalSyncConsent: action === 'grant',
          consentPolicyVersion: 'cb-jsm-followup-v1',
          followUpConsentWithdrawnAt: action === 'withdraw' ? new Date().toISOString() : undefined,
        });
        setFollowUpConsentMessage(
          action === 'grant'
            ? 'Updated local session consent only. Sign in with Dr. T to activate server-enforced JSM follow-up consent.'
            : 'Withdrew local JSM follow-up consent.'
        );
        return;
      }

      const resp = await fetch('/api/carebridge/consent/followup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, ttlHours: 24 }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.consent) {
        setFollowUpConsentMessage(data.error || `Could not update follow-up consent (HTTP ${resp.status}).`);
        return;
      }
      const record = data.consent as CareBridgeFollowUpConsentRecord;
      setServerFollowUpConsent(record);
      const nextBundle: CareBridgeWorkspaceBundle = {
        ...bundle,
        consents: {
          ...bundle.consents,
          jsmMinimalSyncConsent: record.granted,
          consentPolicyVersion: record.policyVersion,
          consentGrantedAt: record.grantedAt || bundle.consents.consentGrantedAt,
          followUpConsentExpiresAt: record.expiresAt,
          followUpConsentWithdrawnAt: record.withdrawnAt,
          updatedAt: record.updatedAt,
        },
        auditLogs: appendWorkspaceAudit(bundle, {
          category: 'privacy',
          action: record.granted ? 'consent_granted' : 'consent_withdrawn',
          outcome: 'allowed',
          policyVersion: record.policyVersion,
          correlationId: data.correlationId,
          summary: record.granted
            ? `Granted Jira Service Management Follow-Up Consent (${record.policyVersion}).`
            : `Withdrew Jira Service Management Follow-Up Consent (${record.policyVersion}).`,
        }),
      };
      persistBundle({ ...nextBundle, latestBrief: buildCareReentryBrief(nextBundle) });
      setFollowUpConsentMessage(
        record.granted
          ? `Server-verified follow-up consent granted (${record.policyVersion}, expires ${record.expiresAt}).`
          : `Server-verified follow-up consent withdrawn (${record.policyVersion}).`
      );
      void refreshServerAuditEvents();
    } catch {
      setFollowUpConsentMessage('Unable to update server follow-up consent right now.');
    } finally {
      setFollowUpConsentBusy(false);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drt-carebridge-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    handleLogAudit('privacy', 'workspace_exported_json', 'allowed', 'Exported CareBridge workspace JSON bundle.');
  };

  const handleDeleteAllUserData = () => {
    void purgeAllCareBridgeUserData().then((clean) => {
      setBundle({ ...clean, latestBrief: buildCareReentryBrief(clean) });
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header bar — calm clinical neutral + single teal accent */}
      <header className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              Codegeist 2026 · Apps for Specialized Industries · Healthcare
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Dr. T — CareBridge
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">{serverReadyNote}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                connectionDisplayStatus === 'Connected'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : connectionDisplayStatus === 'Unauthorized'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : connectionDisplayStatus === 'Permission Denied'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              Atlassian: {verifyingConnection ? 'Verifying...' : connectionDisplayStatus}
            </span>
            <span className="text-xs font-mono text-slate-600">
              {bundle.integration.isSampleSandboxActive
                ? 'Mode: Sample Preview Sandbox'
                : connectionDisplayStatus === 'Connected'
                  ? 'Mode: Live Atlassian Verified'
                  : 'Mode: Disconnected Local'}
            </span>
          </div>
        </div>

        {/* Horizontal scrollable section tabs on mobile/iPad, clean multi-item bar on desktop */}
        <nav
          aria-label="CareBridge sections"
          className="mt-5 pt-4 border-t border-slate-100 flex gap-2 overflow-x-auto pb-1"
        >
          {SECTION_NAV.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-2 transition cursor-pointer ${
                  active
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {activeSection === 'overview' && (
        <CareOverviewSection
          bundle={bundle}
          connectionDisplayStatus={connectionDisplayStatus}
          verifyingConnection={verifyingConnection}
          isAuthenticated={isAuthenticated}
          onSelectSection={setActiveSection}
          onNavigateDrTTab={setActiveTab}
          onLoadSamplePreview={handleLoadSamplePreview}
          onClearSamplePreview={handleClearSamplePreview}
        />
      )}

      {activeSection === 'coordination' && (
        <CareCoordinationSection
          bundle={bundle}
          onCreateTask={handleCreateTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {activeSection === 'knowledge' && (
        <ClinicalKnowledgeHubSection
          bundle={bundle}
          onSaveConfluenceResults={(pages, connected, msg) => {
            const nextBase: CareBridgeWorkspaceBundle = {
              ...bundle,
              knowledgePages: pages,
              integration: {
                ...bundle.integration,
                connectionMode: connected ? 'live_atlassian_configured' : bundle.integration.connectionMode,
                confluenceConnected: connected,
                statusMessage: msg,
                isSampleSandboxActive: connected ? false : bundle.integration.isSampleSandboxActive,
                updatedAt: new Date().toISOString(),
              },
            };
            persistBundle({ ...nextBase, latestBrief: buildCareReentryBrief(nextBase) });
          }}
          onLogAudit={(cat, act, out, sum) => handleLogAudit(cat, act, out, sum)}
        />
      )}

      {activeSection === 'jsm' && (
        <JiraServiceManagementSection
          bundle={bundle}
          isAuthenticated={isAuthenticated}
          serverFollowUpConsent={serverFollowUpConsent}
          defaultSiteUrl={defaultSiteUrl}
          defaultServiceDeskId={defaultServiceDeskId}
          defaultRequestTypeId={defaultRequestTypeId}
          connectionDisplayStatus={connectionDisplayStatus}
          verificationReport={verificationReport}
          verifyingConnection={verifyingConnection}
          onVerifyConnection={runReadOnlyConnectionVerification}
          onFollowUpConsentAction={handleFollowUpConsentAction}
          onRefreshServerAudit={refreshServerAuditEvents}
          onSyncJsmRequests={(requests, connected, msg) => {
            const nextBase: CareBridgeWorkspaceBundle = {
              ...bundle,
              linkedRequests: requests,
              integration: {
                ...bundle.integration,
                connectionMode: connected ? 'live_atlassian_configured' : bundle.integration.connectionMode,
                jsmConnected: connected,
                statusMessage: msg,
                isSampleSandboxActive: connected ? false : bundle.integration.isSampleSandboxActive,
                updatedAt: new Date().toISOString(),
              },
            };
            persistBundle({ ...nextBase, latestBrief: buildCareReentryBrief(nextBase) });
          }}
          onCreateJsmSuccess={(created, linkedTaskId) => {
            const nextTasks = linkedTaskId
              ? bundle.tasks.map((t) =>
                  t.id === linkedTaskId ? linkJsmRequestToCareTask(t, created, bundle.consents.userId) : t
                )
              : bundle.tasks;
            const nextBase: CareBridgeWorkspaceBundle = {
              ...bundle,
              tasks: nextTasks,
              linkedRequests: [created, ...bundle.linkedRequests],
              integration: {
                ...bundle.integration,
                connectionMode: 'live_atlassian_configured',
                jsmConnected: true,
                isSampleSandboxActive: false,
                updatedAt: new Date().toISOString(),
              },
            };
            persistBundle({ ...nextBase, latestBrief: buildCareReentryBrief(nextBase) });
          }}
          onLinkExistingToTask={(req, taskId) => {
            const nextBase: CareBridgeWorkspaceBundle = {
              ...bundle,
              tasks: bundle.tasks.map((t) =>
                t.id === taskId ? linkJsmRequestToCareTask(t, req, bundle.consents.userId) : t
              ),
              auditLogs: appendWorkspaceAudit(bundle, {
                category: 'jsm',
                action: 'jsm_linked_to_task',
                outcome: 'allowed',
                summary: `Linked JSM ${req.issueKey} to CareBridge task ${taskId}.`,
              }),
            };
            persistBundle({ ...nextBase, latestBrief: buildCareReentryBrief(nextBase) });
          }}
          onLogAudit={(cat, act, out, sum) => handleLogAudit(cat, act, out, sum)}
        />
      )}

      {activeSection === 'rovo' && (
        <RovoHealthcareAssistantSection
          bundle={bundle}
          onLogAudit={(cat, act, out, sum) => handleLogAudit(cat, act, out, sum)}
        />
      )}

      {activeSection === 'reentry-brief' && (
        <CareReentryBriefSection
          bundle={bundle}
          onRefreshBrief={() => {
            const brief = buildCareReentryBrief(bundle);
            persistBundle({
              ...bundle,
              latestBrief: brief,
              auditLogs: appendWorkspaceAudit(bundle, {
                category: 'system',
                action: 'reentry_brief_refreshed',
                outcome: 'allowed',
                summary: 'Refreshed 4-bucket Care Re-entry Brief.',
              }),
            });
          }}
          onMarkAiSuggestionReviewed={() => {
            if (!bundle.latestBrief) return;
            persistBundle({
              ...bundle,
              latestBrief: {
                ...bundle.latestBrief,
                aiGeneratedSuggestionUnconfirmed: {
                  ...bundle.latestBrief.aiGeneratedSuggestionUnconfirmed,
                  humanReviewed: true,
                },
              },
              auditLogs: appendWorkspaceAudit(bundle, {
                category: 'rovo_ai',
                action: 'ai_suggestion_human_reviewed',
                outcome: 'allowed',
                summary: 'Authorized user reviewed the unconfirmed AI next-step suggestion.',
              }),
            });
          }}
        />
      )}

      {activeSection === 'privacy' && (
        <PrivacyAndConsentSection
          bundle={bundle}
          storageMode={storageMode}
          isAuthenticated={isAuthenticated}
          serverFollowUpConsent={serverFollowUpConsent}
          followUpConsentBusy={followUpConsentBusy}
          followUpConsentMessage={followUpConsentMessage}
          onFollowUpConsentAction={handleFollowUpConsentAction}
          onUpdateConsents={handleUpdateConsents}
          onExportJson={handleExportJson}
          onDeleteAllUserData={handleDeleteAllUserData}
        />
      )}

      {activeSection === 'audit' && (
        <ActivityAndAuditSection
          bundle={bundle}
          serverAuditEvents={serverAuditEvents}
          loadingServerAudit={loadingServerAudit}
          isAuthenticated={isAuthenticated}
          onRefreshServerAudit={refreshServerAuditEvents}
        />
      )}
    </div>
  );
};
