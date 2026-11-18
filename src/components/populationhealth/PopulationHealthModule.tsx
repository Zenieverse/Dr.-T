import React, { useCallback, useEffect, useState } from 'react';
import {
  PopulationHealthDashboardPayload,
  PopulationRole,
  PopulationWorkspaceId,
  DemoFocusTrack,
  PopulationParticipant,
  PopulationRiskSignal,
  SignalMetricType,
  SignalSourceSystem,
  PopulationAlert,
  CareNavigationStage,
  CareReferralItem,
} from '../../types/populationHealth';
import { NavTab } from '../../types';
import { populationHealthClient } from '../../services/populationHealthClient';
import { auth, signInWithGoogle, signOutUser, subscribeAuthState } from '../../services/firebase';
import { PopulationCoreWorkspaces } from './PopulationCoreWorkspaces';
import { PopulationCareWorkspaces } from './PopulationCareWorkspaces';
import { User } from 'firebase/auth';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  ClipboardCheck,
  Database,
  Globe,
  LayoutDashboard,
  LogIn,
  LogOut,
  Navigation,
  RefreshCw,
  Shield,
  Stethoscope,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

interface PopulationHealthModuleProps {
  setActiveTab?: (tab: NavTab) => void;
  currentLanguage?: 'en' | 'vi';
}

const WORKSPACES: Array<{
  id: PopulationWorkspaceId;
  label: string;
  group: 'Core Intelligence' | 'Care & Impact';
  icon: React.ReactNode;
}> = [
  { id: 'overview', label: 'Population Overview', group: 'Core Intelligence', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'registry', label: 'Community Registry', group: 'Core Intelligence', icon: <Users className="w-4 h-4" /> },
  { id: 'intake', label: 'Health Signal Intake', group: 'Core Intelligence', icon: <Activity className="w-4 h-4" /> },
  { id: 'risk', label: 'Risk Intelligence', group: 'Core Intelligence', icon: <Stethoscope className="w-4 h-4" /> },
  { id: 'trends', label: 'Community Trends', group: 'Core Intelligence', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'alerts', label: 'Early Warning Alerts', group: 'Core Intelligence', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'programmes', label: 'Screening Programmes', group: 'Care & Impact', icon: <ClipboardCheck className="w-4 h-4" /> },
  { id: 'navigation', label: 'Care Navigation', group: 'Care & Impact', icon: <Navigation className="w-4 h-4" /> },
  { id: 'ai_assistant', label: 'AI Research Assistant', group: 'Care & Impact', icon: <Bot className="w-4 h-4" /> },
  { id: 'engagement', label: 'Multilingual Outreach', group: 'Care & Impact', icon: <Globe className="w-4 h-4" /> },
  { id: 'impact', label: 'Impact & Outcomes', group: 'Care & Impact', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'governance', label: 'Governance & Audit', group: 'Care & Impact', icon: <Shield className="w-4 h-4" /> },
];

const STAFF_ROLES_ORDERED: Array<{ value: PopulationRole; label: string; rank: number }> = [
  { value: 'community_viewer', label: 'Community Viewer (Read-Only)', rank: 1 },
  { value: 'research_analyst', label: 'Research Analyst (De-ID)', rank: 3 },
  { value: 'care_navigator', label: 'Care Navigator', rank: 4 },
  { value: 'clinician', label: 'Clinician', rank: 5 },
  { value: 'programme_manager', label: 'Programme Manager', rank: 6 },
  { value: 'platform_admin', label: 'Platform Admin', rank: 7 },
];

const GUEST_ROLES: Array<{ value: PopulationRole; label: string }> = [
  { value: 'guest_demo', label: 'Guest Sandbox (Full Demo Flow)' },
  { value: 'research_analyst', label: 'Research Analyst (De-ID Preview)' },
  { value: 'community_viewer', label: 'Community Viewer (Read-Only Preview)' },
];

const E2E_STEPS: Array<{ step: string; ws: PopulationWorkspaceId }> = [
  { step: '1. Consent & Registry', ws: 'registry' },
  { step: '2. Signal Intake', ws: 'intake' },
  { step: '3. Risk Insights', ws: 'risk' },
  { step: '4. Care Navigation', ws: 'navigation' },
  { step: '5. AI & Governance', ws: 'governance' },
];

export const PopulationHealthModule: React.FC<PopulationHealthModuleProps> = ({
  setActiveTab,
  currentLanguage = 'en',
}) => {
  const [role, setRole] = useState<PopulationRole>('guest_demo');
  const [workspace, setWorkspace] = useState<PopulationWorkspaceId>('overview');
  const [dateRange, setDateRange] = useState<'30d' | '90d' | '180d' | 'all'>('90d');
  const [cohortFilter, setCohortFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');

  const [fbUser, setFbUser] = useState<User | null>(() => auth.currentUser);
  const [data, setData] = useState<PopulationHealthDashboardPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bannerMsg, setBannerMsg] = useState<{ type: 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const unsub = subscribeAuthState((u) => {
      setFbUser(u);
      if (u) {
        populationHealthClient.switchToFirebaseAuth();
        setRole('community_viewer');
      } else {
        setRole('guest_demo');
      }
    });
    return unsub;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await populationHealthClient.getDashboard(role, {
        dateRange,
        cohort: cohortFilter,
        region: regionFilter,
      });
      setData(payload);
    } catch (err) {
      setBannerMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to load population health dashboard.',
      });
    } finally {
      setLoading(false);
    }
  }, [role, dateRange, cohortFilter, regionFilter]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const runAction = async (fn: () => Promise<unknown>, successText: string) => {
    setBannerMsg(null);
    try {
      await fn();
      await refresh();
      setBannerMsg({ type: 'info', text: successText });
    } catch (err) {
      setBannerMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Operation denied or validation error.',
      });
      await refresh();
    }
  };

  const handleContinueAsGuest = async () => {
    setBannerMsg(null);
    await populationHealthClient.continueAsGuestSandbox();
    setRole('guest_demo');
    await refresh();
    setBannerMsg({
      type: 'info',
      text: 'Isolated Guest Sandbox active — all synthetic Population Health features unlocked without login credentials.',
    });
  };

  const handleResetGuestDemo = async () => {
    setBannerMsg(null);
    if (data?.roleContext.isGuestSandbox) {
      await populationHealthClient.startFreshGuestSandbox();
      setRole('guest_demo');
      await refresh();
      setBannerMsg({
        type: 'info',
        text: 'Started fresh isolated Guest Sandbox session with clean synthetic cohorts.',
      });
    } else {
      await runAction(
        () => populationHealthClient.loadDemo(role),
        'Synthetic 3-track competition dataset reloaded.'
      );
    }
  };

  const handleSignInGoogle = async () => {
    setBannerMsg(null);
    populationHealthClient.switchToFirebaseAuth();
    const user = await signInWithGoogle();
    if (user) {
      setRole('community_viewer');
      setBannerMsg({
        type: 'info',
        text: `Signed in as ${user.email || user.displayName || 'Firebase user'}. Role assigned server-side.`,
      });
      await refresh();
    } else {
      await handleContinueAsGuest();
    }
  };

  const canResetDemo = data?.roleContext.permissions.includes('RESET_DEMO') ?? false;
  const isGuestSandbox = data?.roleContext.isGuestSandbox ?? true;

  const availableRoleOptions = isGuestSandbox
    ? GUEST_ROLES
    : STAFF_ROLES_ORDERED.filter((item) => {
        const verifiedMax = data?.roleContext.verifiedMaxRole || 'community_viewer';
        const maxRank =
          STAFF_ROLES_ORDERED.find((r) => r.value === verifiedMax)?.rank ?? 1;
        return item.rank <= maxRank;
      });

  const activeWsMeta = WORKSPACES.find((w) => w.id === workspace);
  const isCoreWorkspace = ['overview', 'registry', 'intake', 'risk', 'trends', 'alerts'].includes(
    workspace
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Session & Guest Access Banner */}
        <div className="border border-teal-200 rounded-xl bg-teal-50/70 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-teal-950 space-y-0.5">
            <div className="font-semibold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-teal-700" />
              {isGuestSandbox
                ? 'Guest Sandbox Mode Active — No Login Credentials Required'
                : `Authenticated Staff Session (${fbUser?.email || data?.roleContext.verifiedMaxRole})`}
            </div>
            <p className="text-[11px] text-teal-800">
              {isGuestSandbox
                ? 'Isolated per-session synthetic demo cohorts. Production admin controls, real user records, and secrets remain strictly server-protected.'
                : 'Cryptographic Firebase ID Token verified on every server request.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-700 text-white hover:bg-teal-800 flex items-center gap-1.5 whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5" />
              CONTINUE AS GUEST
            </button>
            {fbUser ? (
              <button
                type="button"
                onClick={async () => {
                  await signOutUser();
                  await handleContinueAsGuest();
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignInGoogle}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                Staff Sign In (Google)
              </button>
            )}
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">
                Population Health Track · Future Health Challenge 2026 ·{' '}
                {activeWsMeta?.label || 'Overview'}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Dr. T — Community Health Signal Intelligence
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                From individual health signals to healthier communities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs text-slate-500" htmlFor="pop-role-select">
                Role View:
              </label>
              <select
                id="pop-role-select"
                value={role}
                onChange={(e) => setRole(e.target.value as PopulationRole)}
                className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-900"
              >
                {availableRoleOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={!canResetDemo && !isGuestSandbox}
                onClick={handleResetGuestDemo}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-teal-300 bg-teal-50 text-teal-800 hover:bg-teal-100 disabled:opacity-40 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Database className="w-3.5 h-3.5" />
                {isGuestSandbox ? 'Fresh Guest Demo' : 'Load Demo Cohorts'}
              </button>

              <button
                type="button"
                disabled={!canResetDemo}
                onClick={() =>
                  runAction(
                    () => populationHealthClient.resetDemo(role),
                    'Synthetic demo dataset cleared to empty state.'
                  )
                }
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5 whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Clean
              </button>
            </div>
          </div>

          {/* 5-step Guided Demo Navigation Strip */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mr-1">
              End-to-End Demo Flow:
            </span>
            {E2E_STEPS.map((item) => (
              <button
                key={item.ws}
                type="button"
                onClick={() => setWorkspace(item.ws)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors whitespace-nowrap ${
                  workspace === item.ws
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.step}
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              {data?.nonDiagnosticBanner ||
                'Population-level risk pattern prioritisation and care navigation support only. Not a medical diagnosis.'}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
              >
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="180d">Last 180 days</option>
                <option value="all">All periods</option>
              </select>
              <select
                value={cohortFilter}
                onChange={(e) => setCohortFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
              >
                <option value="ALL">All Cohorts</option>
                <option value="Blood Health">Blood Health</option>
                <option value="Cardiometabolic Health">Cardiometabolic Health</option>
                <option value="Maternal Health">Maternal Health</option>
              </select>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
              >
                <option value="ALL">All Regions</option>
                <option value="District 1 Clinic">District 1 Clinic</option>
                <option value="Urban Core Clinic">Urban Core Clinic</option>
                <option value="River Ward Outreach">River Ward Outreach</option>
                <option value="Rural Outreach South">Rural Outreach South</option>
              </select>
            </div>
          </div>
        </div>

        {bannerMsg && (
          <div
            role="status"
            className={`border rounded-xl px-4 py-2.5 text-xs flex items-center justify-between ${
              bannerMsg.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-teal-50 border-teal-200 text-teal-900'
            }`}
          >
            <span>{bannerMsg.text}</span>
            <button
              type="button"
              onClick={() => setBannerMsg(null)}
              className="text-xs underline ml-4 whitespace-nowrap"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="w-full lg:w-64 shrink-0 border border-slate-200 rounded-xl bg-white p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 px-2.5 py-1">
              Core Intelligence
            </div>
            <div className="space-y-0.5 mb-3">
              {WORKSPACES.filter((w) => w.group === 'Core Intelligence').map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => setWorkspace(ws.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                    workspace === ws.id
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {ws.icon}
                  <span className="truncate">{ws.label}</span>
                </button>
              ))}
            </div>

            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 px-2.5 py-1 border-t border-slate-100 pt-2">
              Care & Impact
            </div>
            <div className="space-y-0.5">
              {WORKSPACES.filter((w) => w.group === 'Care & Impact').map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => setWorkspace(ws.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                    workspace === ws.id
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {ws.icon}
                  <span className="truncate">{ws.label}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1 min-w-0 w-full">
            {loading && !data ? (
              <div className="border border-slate-200 rounded-xl bg-white p-10 text-center text-sm text-slate-500">
                Loading Community Health Signal Intelligence workspace...
              </div>
            ) : !data ? (
              <div className="border border-slate-200 rounded-xl bg-white p-10 text-center text-sm text-red-600">
                Unable to load workspace data.
              </div>
            ) : isCoreWorkspace ? (
              <PopulationCoreWorkspaces
                workspace={workspace}
                data={data}
                onNavigateWorkspace={setWorkspace}
                onNavigatePlatformTab={setActiveTab}
                onRegisterParticipant={(input: {
                  displayAlias: string;
                  age: number;
                  gender: PopulationParticipant['gender'];
                  cohort: DemoFocusTrack;
                  region: string;
                  preferredLanguage: PopulationParticipant['preferredLanguage'];
                  consentGiven: boolean;
                  notes: string;
                }) =>
                  runAction(
                    () => populationHealthClient.addParticipant(role, input),
                    `Registered consented participant "${input.displayAlias}".`
                  )
                }
                onUpdateConsent={(participantId, status) =>
                  runAction(
                    () => populationHealthClient.updateConsent(role, participantId, status),
                    `Updated consent status to ${status}.`
                  )
                }
                onIngestObservation={(input: {
                  participantId: string;
                  sourceSystem: SignalSourceSystem;
                  metricType: SignalMetricType;
                  valueDisplay: string;
                  numericValue?: number;
                  secondaryNumericValue?: number;
                  unit?: string;
                  provenanceNote?: string;
                }) =>
                  runAction(
                    () => populationHealthClient.ingestObservation(role, input),
                    `Recorded ${input.metricType} signal (${input.valueDisplay}).`
                  )
                }
                onBridgeHealthAlert={(participantId) => {
                  const p = data.participants.find((item) => item.id === participantId);
                  return runAction(
                    () =>
                      populationHealthClient.bridgeHealthAlert(role, participantId, {
                        patientAlias: p?.syntheticCode || 'COMM-PT',
                        age: p?.age || 40,
                        gender:
                          p?.gender === 'Female' || p?.gender === 'Male'
                            ? p.gender
                            : 'Prefer not to say',
                        primaryConcern: 'Elevated screening BP + fatigue check-in',
                        durationDays: 4,
                        severityScale: 7,
                        vitals: {
                          bloodPressure: '148/94',
                          restingHeartRate: 88,
                          spo2Percent: 98,
                        },
                        labs: { hemoglobin: 10.6, ferritin: 11 },
                        symptoms: ['Afternoon fatigue'],
                        medications: [],
                        allergies: [],
                        consentGiven: true,
                        deIdentifiedConfirmed: true,
                        countryOrRegion: p?.region || 'District 1 Clinic',
                      }),
                    'Evaluated Health Alert Mini triage bridge and synced observations.'
                  );
                }}
                onBridgePresage={(participantId, cameraConsentVerified) =>
                  runAction(
                    () =>
                      populationHealthClient.bridgePresage(role, participantId, {
                        pulseRateBpm: 76,
                        breathingRateRpm: 16,
                        hrvRmssdMs: 42,
                        isLiveHardware: false,
                        cameraConsentVerified,
                      }),
                    'Synced Presage SmartSpectra optical vitals with verified provenance tag.'
                  )
                }
                onReviewRiskSignal={(signalId, status: PopulationRiskSignal['status']) =>
                  runAction(
                    () => populationHealthClient.reviewRiskSignal(role, signalId, status),
                    `Marked risk signal ${signalId} as ${status}.`
                  )
                }
                onUpdateAlert={(
                  alertId: string,
                  payload: {
                    status: PopulationAlert['status'];
                    assignedReviewer?: string;
                    note?: string;
                  }
                ) =>
                  runAction(
                    () => populationHealthClient.updateAlert(role, alertId, payload),
                    `Alert ${alertId} marked ${payload.status}.`
                  )
                }
                onToggleAlertRule={(ruleId, enabled) =>
                  runAction(
                    () => populationHealthClient.toggleAlertRule(role, ruleId, enabled),
                    `Monitoring rule ${enabled ? 'enabled' : 'disabled'}.`
                  )
                }
                onDownloadReport={(format) =>
                  runAction(
                    () =>
                      populationHealthClient.downloadReport(role, format, {
                        dateRange,
                        cohort: cohortFilter,
                        region: regionFilter,
                      }),
                    `Exported de-identified k-anonymity report (${format.toUpperCase()}).`
                  )
                }
              />
            ) : (
              <PopulationCareWorkspaces
                workspace={workspace}
                data={data}
                appLanguage={currentLanguage}
                onProgrammeAction={(programmeId, action) =>
                  runAction(
                    () => populationHealthClient.programmeAction(role, programmeId, action),
                    `Updated programme action (${action}).`
                  )
                }
                onCreateReferral={(input: {
                  participantId: string;
                  destinationService: string;
                  reasonSummary: string;
                  priority: CareReferralItem['priority'];
                  navigatorName: string;
                }) =>
                  runAction(
                    () => populationHealthClient.createReferral(role, input),
                    `Created care navigation referral to ${input.destinationService}.`
                  )
                }
                onAdvanceReferral={(
                  referralId: string,
                  payload: {
                    stage?: CareNavigationStage;
                    appointmentStatus?: CareReferralItem['appointmentStatus'];
                    communicationNote?: string;
                    channel?: 'SMS' | 'VOICE' | 'IN_CLINIC' | 'PORTAL';
                    language?: 'en' | 'vi';
                    escalated?: boolean;
                  }
                ) =>
                  runAction(
                    () => populationHealthClient.advanceReferral(role, referralId, payload),
                    `Updated care navigation referral ${referralId}.`
                  )
                }
                onRunAiQuery={(query) =>
                  runAction(
                    () => populationHealthClient.runAiSynthesis(role, query),
                    'Generated de-identified synthesis (awaiting clinician human review gate).'
                  )
                }
                onApproveAiSynthesis={(synthesisId, decision) =>
                  runAction(
                    () => populationHealthClient.approveAiSynthesis(role, synthesisId, decision),
                    `AI synthesis marked ${decision}.`
                  )
                }
                onGateEngagement={(templateId, action) =>
                  runAction(
                    () => populationHealthClient.gateEngagement(role, templateId, action),
                    `Engagement template ${action === 'APPROVE' ? 'approved' : 'dispatched'}.`
                  )
                }
                onUpdateKThreshold={(k) =>
                  runAction(
                    () => populationHealthClient.updateKThreshold(role, k),
                    `Privacy suppression threshold updated to k=${k}.`
                  )
                }
                onEraseParticipant={(participantId) =>
                  runAction(
                    () => populationHealthClient.eraseParticipant(role, participantId),
                    `Erased participant ${participantId} under PDPL right-to-erasure policy.`
                  )
                }
                onTestGovernanceBoundary={() =>
                  runAction(
                    () => populationHealthClient.updateKThreshold(role, 3),
                    'Unexpectedly succeeded.'
                  )
                }
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
