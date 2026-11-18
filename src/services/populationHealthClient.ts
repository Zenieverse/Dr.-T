// ============================================================================
// DR. T — COMMUNITY HEALTH SIGNAL INTELLIGENCE CLIENT
// Bearer Token Auth (Firebase ID Token OR Signed Guest Sandbox Session),
// Explicit Role Header (within verified authority) & Filtered Export Support
// ============================================================================

import {
  PopulationRole,
  PopulationHealthDashboardPayload,
  DemoFocusTrack,
  PopulationParticipant,
  ConsentScope,
  ConsentStatus,
  SignalMetricType,
  SignalSourceSystem,
  CareNavigationStage,
  CareReferralItem,
  PopulationAlert,
  AiResearchSynthesisResult,
  HealthSignalObservation,
  PopulationRiskSignal,
  ScreeningProgramme,
  EngagementTemplate,
  AlertRuleConfig,
} from '../types/populationHealth';
import { HealthAlertIntakeData } from '../types';
import { getFirebaseIdToken } from './firebase';
import { firebaseRuntimeConfig } from '../config/firebaseRuntimeConfig';
import { checkFrontendBackendEnvAgreement } from '../config/clientFirebaseValidation';

const GUEST_TOKEN_KEY = 'drt_pop_guest_sandbox_token_v1';
const GUEST_SID_KEY = 'drt_pop_guest_sandbox_sid_v1';
const SESSION_MODE_KEY = 'drt_pop_auth_mode_v1'; // 'guest' | 'firebase'

let memoryGuestToken: string | null = null;
let memoryGuestSid: string | null = null;
let pendingMintPromise: Promise<{ token: string; sessionId: string | null }> | null = null;

function readStoredGuestToken(): string | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem(GUEST_TOKEN_KEY) || memoryGuestToken;
    }
  } catch {
    // ignore storage restriction
  }
  return memoryGuestToken;
}

function readStoredGuestSid(): string | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem(GUEST_SID_KEY) || memoryGuestSid;
    }
  } catch {
    // ignore storage restriction
  }
  return memoryGuestSid;
}

function writeStoredGuestToken(token: string | null, sessionId: string | null = null): void {
  memoryGuestToken = token;
  memoryGuestSid = sessionId;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      if (token) {
        window.sessionStorage.setItem(GUEST_TOKEN_KEY, token);
      } else {
        window.sessionStorage.removeItem(GUEST_TOKEN_KEY);
      }
      if (sessionId) {
        window.sessionStorage.setItem(GUEST_SID_KEY, sessionId);
      } else {
        window.sessionStorage.removeItem(GUEST_SID_KEY);
      }
    }
  } catch {
    // ignore
  }
}

export function getPreferredAuthMode(): 'guest' | 'firebase' {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const m = window.sessionStorage.getItem(SESSION_MODE_KEY);
      if (m === 'guest' || m === 'firebase') return m;
    }
  } catch {
    // ignore
  }
  return 'firebase';
}

export function setPreferredAuthMode(mode: 'guest' | 'firebase'): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(SESSION_MODE_KEY, mode);
    }
  } catch {
    // ignore
  }
}

async function mintNewGuestSessionInternal(): Promise<{ token: string; sessionId: string | null }> {
  if (pendingMintPromise) return pendingMintPromise;
  pendingMintPromise = (async () => {
    const res = await fetch('/api/population-health/guest-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-DrT-Client-Env': firebaseRuntimeConfig.environment,
      },
    });
    if (!res.ok) {
      throw new Error(`Unable to initialize Guest Sandbox session (${res.status}).`);
    }
    const data = (await res.json()) as { token?: string; sessionId?: string };
    if (!data?.token) {
      throw new Error('Guest Sandbox session endpoint did not return a token.');
    }
    const sid = data.sessionId || null;
    writeStoredGuestToken(data.token, sid);
    return { token: data.token, sessionId: sid };
  })();

  try {
    return await pendingMintPromise;
  } finally {
    pendingMintPromise = null;
  }
}

export async function mintNewGuestSandboxSession(): Promise<string> {
  const minted = await mintNewGuestSessionInternal();
  return minted.token;
}

async function resolveBearerToken(): Promise<{
  token: string;
  isGuest: boolean;
  guestSessionId: string | null;
}> {
  const pref = getPreferredAuthMode();
  if (pref === 'firebase') {
    const fbToken = await getFirebaseIdToken();
    if (fbToken) {
      return { token: fbToken, isGuest: false, guestSessionId: null };
    }
  }
  const existingGuest = readStoredGuestToken();
  if (existingGuest) {
    return { token: existingGuest, isGuest: true, guestSessionId: readStoredGuestSid() };
  }
  const fresh = await mintNewGuestSessionInternal();
  return { token: fresh.token, isGuest: true, guestSessionId: fresh.sessionId };
}

async function popFetch<T>(
  url: string,
  role: PopulationRole,
  options?: RequestInit
): Promise<T> {
  const { token, isGuest, guestSessionId } = await resolveBearerToken();

  const doRequest = (bearer: string, sid: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearer}`,
        'X-Population-Role': role,
        'X-DrT-Client-Env': firebaseRuntimeConfig.environment,
        'X-DrT-Client-Db': firebaseRuntimeConfig.firestoreDatabaseId,
        ...(isGuest && sid ? { 'X-Guest-Session-Id': sid } : {}),
        ...(options?.headers || {}),
      },
    });

  let res = await doRequest(token, guestSessionId);

  // If guest sandbox token expired or server restarted with new HMAC secret, re-mint once
  if (res.status === 401 && isGuest) {
    writeStoredGuestToken(null, null);
    const refreshed = await mintNewGuestSessionInternal();
    res = await doRequest(refreshed.token, refreshed.sessionId);
  }

  if (!res.ok) {
    let errMsg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) errMsg = data.error;
    } catch {
      // ignore json parse failure
    }
    throw new Error(errMsg);
  }

  return res.json() as Promise<T>;
}

export const populationHealthClient = {
  async continueAsGuestSandbox(): Promise<void> {
    setPreferredAuthMode('guest');
    if (!readStoredGuestToken()) {
      await mintNewGuestSandboxSession();
    }
  },

  async startFreshGuestSandbox(): Promise<void> {
    setPreferredAuthMode('guest');
    writeStoredGuestToken(null);
    await mintNewGuestSandboxSession();
  },

  switchToFirebaseAuth(): void {
    setPreferredAuthMode('firebase');
  },

  getDashboard(
    role: PopulationRole,
    filters?: { dateRange?: '30d' | '90d' | '180d' | 'all'; cohort?: string; region?: string }
  ): Promise<PopulationHealthDashboardPayload> {
    const params = new URLSearchParams();
    if (filters?.dateRange) params.set('dateRange', filters.dateRange);
    if (filters?.cohort) params.set('cohort', filters.cohort);
    if (filters?.region) params.set('region', filters.region);
    return popFetch(`/api/population-health/dashboard?${params.toString()}`, role);
  },

  addParticipant(
    role: PopulationRole,
    input: {
      displayAlias: string;
      age: number;
      gender: PopulationParticipant['gender'];
      cohort: DemoFocusTrack;
      region: string;
      preferredLanguage?: PopulationParticipant['preferredLanguage'];
      consentGiven: boolean;
      scopes?: ConsentScope[];
      notes?: string;
    }
  ): Promise<{ participant: PopulationParticipant }> {
    return popFetch('/api/population-health/participants', role, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateConsent(
    role: PopulationRole,
    participantId: string,
    status: ConsentStatus,
    scopes?: ConsentScope[]
  ): Promise<{ participant: PopulationParticipant }> {
    return popFetch(
      `/api/population-health/participants/${encodeURIComponent(participantId)}/consent`,
      role,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, scopes }),
      }
    );
  },

  eraseParticipant(
    role: PopulationRole,
    participantId: string
  ): Promise<{ erasedParticipantId: string }> {
    return popFetch(
      `/api/population-health/participants/${encodeURIComponent(participantId)}`,
      role,
      { method: 'DELETE' }
    );
  },

  ingestObservation(
    role: PopulationRole,
    input: {
      participantId: string;
      sourceSystem: SignalSourceSystem;
      metricType: SignalMetricType;
      valueDisplay: string;
      numericValue?: number;
      secondaryNumericValue?: number;
      unit?: string;
      provenanceNote?: string;
    }
  ): Promise<{ observation: HealthSignalObservation; riskSignals: PopulationRiskSignal[] }> {
    return popFetch('/api/population-health/observations', role, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  bridgeHealthAlert(
    role: PopulationRole,
    participantId: string,
    intake: HealthAlertIntakeData
  ): Promise<{
    triageTier: string;
    triageTitle: string;
    urgencyTimeline: string;
    urgentEmergencyRedirect: boolean;
    observationsCreated: HealthSignalObservation[];
  }> {
    return popFetch('/api/population-health/integrations/health-alert-bridge', role, {
      method: 'POST',
      body: JSON.stringify({ participantId, intake }),
    });
  },

  bridgePresage(
    role: PopulationRole,
    participantId: string,
    vitals: {
      pulseRateBpm?: number;
      breathingRateRpm?: number;
      hrvRmssdMs?: number;
      isLiveHardware?: boolean;
      cameraConsentVerified?: boolean;
    }
  ): Promise<{
    presageStatus: unknown;
    dataOrigin: string;
    observationsCreated: HealthSignalObservation[];
  }> {
    return popFetch('/api/population-health/integrations/presage-bridge', role, {
      method: 'POST',
      body: JSON.stringify({ participantId, vitals }),
    });
  },

  reviewRiskSignal(
    role: PopulationRole,
    signalId: string,
    status: PopulationRiskSignal['status']
  ): Promise<{ signal: PopulationRiskSignal }> {
    return popFetch(
      `/api/population-health/risk-signals/${encodeURIComponent(signalId)}/status`,
      role,
      {
        method: 'POST',
        body: JSON.stringify({ status }),
      }
    );
  },

  updateAlert(
    role: PopulationRole,
    alertId: string,
    payload: { status: PopulationAlert['status']; assignedReviewer?: string; note?: string }
  ): Promise<{ alert: PopulationAlert }> {
    return popFetch(`/api/population-health/alerts/${encodeURIComponent(alertId)}`, role, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  toggleAlertRule(
    role: PopulationRole,
    ruleId: string,
    enabled: boolean
  ): Promise<{ rule: AlertRuleConfig }> {
    return popFetch(`/api/population-health/alert-rules/${encodeURIComponent(ruleId)}`, role, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    });
  },

  createReferral(
    role: PopulationRole,
    input: {
      participantId: string;
      destinationService: string;
      reasonSummary: string;
      priority?: CareReferralItem['priority'];
      navigatorName?: string;
    }
  ): Promise<{ referral: CareReferralItem }> {
    return popFetch('/api/population-health/referrals', role, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  advanceReferral(
    role: PopulationRole,
    referralId: string,
    payload: {
      stage?: CareNavigationStage;
      appointmentStatus?: CareReferralItem['appointmentStatus'];
      appointmentDate?: string;
      communicationNote?: string;
      channel?: 'SMS' | 'VOICE' | 'IN_CLINIC' | 'PORTAL';
      language?: 'en' | 'vi';
      escalated?: boolean;
    }
  ): Promise<{ referral: CareReferralItem }> {
    return popFetch(`/api/population-health/referrals/${encodeURIComponent(referralId)}`, role, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  programmeAction(
    role: PopulationRole,
    programmeId: string,
    action: 'SEND_INVITE' | 'RECORD_COMPLETION' | 'TOGGLE_STATUS'
  ): Promise<{ programme: ScreeningProgramme }> {
    return popFetch(
      `/api/population-health/programmes/${encodeURIComponent(programmeId)}/action`,
      role,
      {
        method: 'POST',
        body: JSON.stringify({ action }),
      }
    );
  },

  gateEngagement(
    role: PopulationRole,
    templateId: string,
    action: 'APPROVE' | 'SEND'
  ): Promise<{ template: EngagementTemplate }> {
    return popFetch(
      `/api/population-health/engagement/${encodeURIComponent(templateId)}/gate`,
      role,
      {
        method: 'POST',
        body: JSON.stringify({ action }),
      }
    );
  },

  runAiSynthesis(
    role: PopulationRole,
    query: string
  ): Promise<{ synthesis: AiResearchSynthesisResult }> {
    return popFetch('/api/population-health/ai/synthesize', role, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },

  approveAiSynthesis(
    role: PopulationRole,
    synthesisId: string,
    decision: 'APPROVED' | 'REJECTED'
  ): Promise<{ synthesis: AiResearchSynthesisResult }> {
    return popFetch(
      `/api/population-health/ai/${encodeURIComponent(synthesisId)}/approve`,
      role,
      {
        method: 'POST',
        body: JSON.stringify({ decision }),
      }
    );
  },

  updateKThreshold(
    role: PopulationRole,
    kThreshold: number
  ): Promise<{ kThreshold: number }> {
    return popFetch('/api/population-health/governance/k-threshold', role, {
      method: 'PATCH',
      body: JSON.stringify({ kThreshold }),
    });
  },

  async downloadReport(
    role: PopulationRole,
    format: 'csv' | 'json',
    filters?: { dateRange?: '30d' | '90d' | '180d' | 'all'; cohort?: string; region?: string }
  ): Promise<void> {
    const params = new URLSearchParams({ format });
    if (filters?.dateRange) params.set('dateRange', filters.dateRange);
    if (filters?.cohort) params.set('cohort', filters.cohort);
    if (filters?.region) params.set('region', filters.region);

    const { token, isGuest, guestSessionId } = await resolveBearerToken();
    const doFetch = (bearer: string, sid: string | null) =>
      fetch(`/api/population-health/export?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${bearer}`,
          'X-Population-Role': role,
          'X-DrT-Client-Env': firebaseRuntimeConfig.environment,
          'X-DrT-Client-Db': firebaseRuntimeConfig.firestoreDatabaseId,
          ...(isGuest && sid ? { 'X-Guest-Session-Id': sid } : {}),
        },
      });

    let res = await doFetch(token, guestSessionId);
    if (res.status === 401 && isGuest) {
      writeStoredGuestToken(null, null);
      const refreshed = await mintNewGuestSessionInternal();
      res = await doFetch(refreshed.token, refreshed.sessionId);
    }

    if (!res.ok) {
      let msg = `Export failed (${res.status})`;
      try {
        const data = await res.json();
        if (data?.error) msg = data.error;
      } catch {
        // ignore
      }
      throw new Error(msg);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download =
      format === 'json'
        ? 'dr-t-population-health-report.json'
        : 'dr-t-population-health-cohort-summary.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  },

  async verifyEnvironmentAgreement(): Promise<{ agrees: boolean; mismatchReason?: string }> {
    try {
      const res = await fetch('/api/population-health/health');
      if (!res.ok) return { agrees: true };
      const data = await res.json();
      return checkFrontendBackendEnvAgreement(firebaseRuntimeConfig, {
        environment: data.environment,
        gcpProjectId: data.projectId,
        persistenceStatus: data.persistenceStatus,
      });
    } catch {
      return { agrees: true };
    }
  },

  loadDemo(role: PopulationRole): Promise<PopulationHealthDashboardPayload> {
    return popFetch('/api/population-health/demo/load', role, { method: 'POST' });
  },

  resetDemo(role: PopulationRole): Promise<PopulationHealthDashboardPayload> {
    return popFetch('/api/population-health/demo/reset', role, { method: 'POST' });
  },
};
