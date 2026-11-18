// ============================================================================
// DR. T — COMMUNITY HEALTH SIGNAL INTELLIGENCE SERVICE
// Server-Authoritative Persistence, Multi-Role RBAC, Guest Sandbox Isolation,
// Privacy Redaction, k-Anonymity Suppression, PDPL Erasure & Responsible AI
// ============================================================================

import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import {
  CanonicalPopulationRole,
  PopulationRole,
  PopulationParticipant,
  ConsentRecordItem,
  ConsentScope,
  ConsentStatus,
  HealthSignalObservation,
  PopulationRiskSignal,
  PopulationAlert,
  AlertRuleConfig,
  ScreeningProgramme,
  CareReferralItem,
  CareNavigationStage,
  EngagementTemplate,
  GovernanceAuditLog,
  AiResearchSynthesisResult,
  PopulationHealthDashboardPayload,
  IntegrationConnectorStatus,
  DemoFocusTrack,
  SignalMetricType,
  SignalSourceSystem,
  DataProvenance,
} from '../types/populationHealth';
import {
  POPULATION_NON_DIAGNOSTIC_BANNER,
  POPULATION_GUIDELINES,
  containsDirectIdentifier,
  getReferenceRangeForMetric,
  validateObservationQuality,
  assessParticipantPopulationSignals,
  computeKAnonymityCohorts,
  computeTrendsAndImpact,
} from './populationHealthEngine';
import { buildSyntheticDemoDataset } from './populationHealthDemoData';
import { evaluateHealthAlertHeuristics, validateHealthAlertRequest } from './healthAlertService';
import {
  DrTRuntimeEnvironment,
  isNonDevIsolatedEnvironment,
  resolveRuntimeEnvironment,
} from './runtimeEnvironment';
import { PresageServerService } from './presageServerService';
import { GeminiCircuitBreaker } from './geminiCircuitBreaker';
import { canonicalizeRole, sanitizeText } from './populationHealthAuth';
import {
  FirestoreAdapterOptions,
  getCachedPersistenceStatusSync,
  PopulationHealthFirestoreStore,
  probePopulationFirestorePersistence,
} from './populationHealthFirestoreStore';
import { HealthAlertIntakeData } from '../types';

export type PopulationPermission =
  | 'VIEW_AGGREGATE'
  | 'VIEW_PARTICIPANTS'
  | 'MANAGE_PARTICIPANTS'
  | 'MANAGE_CONSENT'
  | 'INGEST_SIGNALS'
  | 'REVIEW_ALERTS'
  | 'MANAGE_PROGRAMMES'
  | 'MANAGE_REFERRALS'
  | 'RUN_AI_ASSISTANT'
  | 'APPROVE_AI_SYNTHESIS'
  | 'DRAFT_ENGAGEMENT'
  | 'APPROVE_AND_SEND_ENGAGEMENT'
  | 'EXPORT_REPORTS'
  | 'MANAGE_GOVERNANCE'
  | 'ERASE_PARTICIPANT'
  | 'RESET_DEMO';

const PROGRAMME_MANAGER_PERMS: PopulationPermission[] = [
  'VIEW_AGGREGATE',
  'VIEW_PARTICIPANTS',
  'MANAGE_PARTICIPANTS',
  'MANAGE_CONSENT',
  'INGEST_SIGNALS',
  'REVIEW_ALERTS',
  'MANAGE_PROGRAMMES',
  'MANAGE_REFERRALS',
  'RUN_AI_ASSISTANT',
  'APPROVE_AI_SYNTHESIS',
  'DRAFT_ENGAGEMENT',
  'APPROVE_AND_SEND_ENGAGEMENT',
  'EXPORT_REPORTS',
  'RESET_DEMO',
];

const COMMUNITY_VIEWER_PERMS: PopulationPermission[] = ['VIEW_AGGREGATE'];

// Guest Sandbox permits full non-admin workflow demonstration inside an isolated,
// synthetic-only ephemeral sandbox, while strictly denying MANAGE_GOVERNANCE,
// ERASE_PARTICIPANT, production persistence, and production audit logs.
const GUEST_SANDBOX_PERMS: PopulationPermission[] = [
  'VIEW_AGGREGATE',
  'VIEW_PARTICIPANTS',
  'MANAGE_PARTICIPANTS',
  'MANAGE_CONSENT',
  'INGEST_SIGNALS',
  'REVIEW_ALERTS',
  'MANAGE_PROGRAMMES',
  'MANAGE_REFERRALS',
  'RUN_AI_ASSISTANT',
  'APPROVE_AI_SYNTHESIS',
  'DRAFT_ENGAGEMENT',
  'APPROVE_AND_SEND_ENGAGEMENT',
  'EXPORT_REPORTS',
  'RESET_DEMO',
];

export const ROLE_PERMISSIONS: Record<PopulationRole, PopulationPermission[]> = {
  platform_admin: [
    ...PROGRAMME_MANAGER_PERMS,
    'MANAGE_GOVERNANCE',
    'ERASE_PARTICIPANT',
  ],
  programme_manager: PROGRAMME_MANAGER_PERMS,
  population_health_manager: PROGRAMME_MANAGER_PERMS,
  clinician: [
    'VIEW_AGGREGATE',
    'VIEW_PARTICIPANTS',
    'INGEST_SIGNALS',
    'REVIEW_ALERTS',
    'MANAGE_REFERRALS',
    'RUN_AI_ASSISTANT',
    'APPROVE_AI_SYNTHESIS',
    'DRAFT_ENGAGEMENT',
    'EXPORT_REPORTS',
  ],
  care_navigator: [
    'VIEW_AGGREGATE',
    'VIEW_PARTICIPANTS',
    'INGEST_SIGNALS',
    'MANAGE_REFERRALS',
    'DRAFT_ENGAGEMENT',
  ],
  research_analyst: ['VIEW_AGGREGATE', 'RUN_AI_ASSISTANT', 'EXPORT_REPORTS'],
  community_viewer: COMMUNITY_VIEWER_PERMS,
  read_only_reviewer: COMMUNITY_VIEWER_PERMS,
  guest_demo: GUEST_SANDBOX_PERMS,
};

const VALID_ROLES = new Set<PopulationRole>([
  'platform_admin',
  'programme_manager',
  'population_health_manager',
  'clinician',
  'care_navigator',
  'research_analyst',
  'community_viewer',
  'read_only_reviewer',
  'guest_demo',
]);

export interface PopulationServiceContext {
  actorId?: string;
  verifiedMaxRole?: CanonicalPopulationRole;
  authMode?: 'VERIFIED_FIREBASE_USER' | 'GUEST_SANDBOX' | 'ISOLATED_TEST';
  guestSessionId?: string;
  privilegedResetVerified?: boolean;
}

export interface PopulationRoutePolicyEntry {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  category:
    | 'PUBLIC_HEALTH'
    | 'GUEST_MINT'
    | 'READ_ONLY'
    | 'WRITE_MUTATION'
    | 'ADMIN_RESET_OR_SEED';
  publicJudgingRule: string;
}

export const POPULATION_HEALTH_ROUTE_INVENTORY: PopulationRoutePolicyEntry[] = [
  { method: 'GET', path: '/api/population-health/health', category: 'PUBLIC_HEALTH', publicJudgingRule: 'Allowed (redacted status only)' },
  { method: 'POST', path: '/api/population-health/guest-session', category: 'GUEST_MINT', publicJudgingRule: 'Allowed (mints ephemeral signed gdemo.* token)' },
  { method: 'GET', path: '/api/population-health/dashboard', category: 'READ_ONLY', publicJudgingRule: 'Allowed for authenticated or Guest Sandbox' },
  { method: 'GET', path: '/api/population-health/export', category: 'READ_ONLY', publicJudgingRule: 'Allowed (de-identified k-anonymity export)' },
  { method: 'POST', path: '/api/population-health/participants', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX synthetic-only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'PATCH', path: '/api/population-health/participants/:id/consent', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX in-memory only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'DELETE', path: '/api/population-health/participants/:id', category: 'WRITE_MUTATION', publicJudgingRule: 'Blocked for GUEST_SANDBOX & shared DB in public_judging (403)' },
  { method: 'POST', path: '/api/population-health/observations', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX synthetic-only (dataOrigin=SIMULATED); VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'POST', path: '/api/population-health/integrations/health-alert-bridge', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX synthetic-only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'POST', path: '/api/population-health/integrations/presage-bridge', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX synthetic-only (isLiveHardware!=true); VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'POST', path: '/api/population-health/risk-signals/:id/status', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX in-memory only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'PATCH', path: '/api/population-health/alerts/:id', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX in-memory only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'PATCH', path: '/api/population-health/alert-rules/:id', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX in-memory only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'POST', path: '/api/population-health/referrals', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX synthetic-only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'PATCH', path: '/api/population-health/referrals/:id', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX synthetic-only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'POST', path: '/api/population-health/programmes/:id/action', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX in-memory only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'POST', path: '/api/population-health/engagement/:id/gate', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX in-memory only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'POST', path: '/api/population-health/ai/synthesize', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX in-memory only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'POST', path: '/api/population-health/ai/:id/approve', category: 'WRITE_MUTATION', publicJudgingRule: 'GUEST_SANDBOX in-memory only; VERIFIED_FIREBASE_USER blocked (403)' },
  { method: 'PATCH', path: '/api/population-health/governance/k-threshold', category: 'WRITE_MUTATION', publicJudgingRule: 'Blocked for GUEST_SANDBOX & shared DB in public_judging (403)' },
  { method: 'POST', path: '/api/population-health/demo/load', category: 'ADMIN_RESET_OR_SEED', publicJudgingRule: 'Blocked for guests/public; requires platform_admin + X-DrT-Admin-Reset-Token' },
  { method: 'POST', path: '/api/population-health/demo/reset', category: 'ADMIN_RESET_OR_SEED', publicJudgingRule: 'Blocked for guests/public; requires platform_admin + X-DrT-Admin-Reset-Token' },
];

interface PersistedState {
  demoActive: boolean;
  kThreshold: number;
  participants: PopulationParticipant[];
  consents: ConsentRecordItem[];
  observations: HealthSignalObservation[];
  riskSignals: PopulationRiskSignal[];
  alerts: PopulationAlert[];
  alertRules: AlertRuleConfig[];
  programmes: ScreeningProgramme[];
  referrals: CareReferralItem[];
  engagementTemplates: EngagementTemplate[];
  auditLogs: GovernanceAuditLog[];
  aiSyntheses: AiResearchSynthesisResult[];
}

export class AuthorizationError extends Error {
  public readonly statusCode = 403;
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends Error {
  public readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const MAX_GUEST_SANDBOXES = 200;
const GUEST_SANDBOX_TTL_MS = 6 * 3600 * 1000;

export class PopulationHealthService {
  private static instance: PopulationHealthService | null = null;
  private stateFilePath: string;
  private state: PersistedState;
  private firestoreStore: PopulationHealthFirestoreStore | null = null;
  private firestoreEnabled = false;
  private firestoreOptions?: FirestoreAdapterOptions;
  private lastFirestoreStatus: ReturnType<typeof getCachedPersistenceStatusSync> | null = null;
  private initPromise: Promise<{ firestoreLive: boolean; hydratedFromFirestore: boolean }> | null =
    null;
  private pendingFirestoreSync: Promise<void> = Promise.resolve();
  private deletedParticipantIds = new Set<string>();
  private needsFullPrune = false;
  private guestSandboxes = new Map<
    string,
    { state: PersistedState; lastAccessedAt: number }
  >();

  private constructor(customFilePath?: string, firestoreOptions?: FirestoreAdapterOptions) {
    const envMode = resolveRuntimeEnvironment();
    const defaultFileName =
      envMode === 'development'
        ? 'population-health-state.json'
        : `population-health-state.${envMode}.json`;
    this.stateFilePath =
      customFilePath || path.join(process.cwd(), '.data', defaultFileName);
    this.firestoreOptions = firestoreOptions;
    this.state = this.loadOrInitializeState();
  }

  public static getInstance(): PopulationHealthService {
    if (!PopulationHealthService.instance) {
      PopulationHealthService.instance = new PopulationHealthService();
    }
    return PopulationHealthService.instance;
  }

  public static createIsolatedForTest(
    tempFilePath: string,
    firestoreOptions?: FirestoreAdapterOptions
  ): PopulationHealthService {
    return new PopulationHealthService(tempFilePath, firestoreOptions);
  }

  public initializeDurablePersistence(): Promise<{
    firestoreLive: boolean;
    hydratedFromFirestore: boolean;
  }> {
    if (!this.initPromise) {
      this.initPromise = this.runInitializeDurablePersistence();
    }
    return this.initPromise;
  }

  public async ensurePersistenceReady(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise.catch(() => undefined);
    }
  }

  private async runInitializeDurablePersistence(): Promise<{
    firestoreLive: boolean;
    hydratedFromFirestore: boolean;
  }> {
    const status = await probePopulationFirestorePersistence(true, this.firestoreOptions);
    this.lastFirestoreStatus = status;
    if (status.mode !== 'FIRESTORE_LIVE') {
      this.firestoreEnabled = false;
      this.firestoreStore = null;
      return { firestoreLive: false, hydratedFromFirestore: false };
    }

    const store = new PopulationHealthFirestoreStore(this.firestoreOptions);
    this.firestoreStore = store;
    this.firestoreEnabled = true;

    try {
      const existing = await store.loadFullSnapshot();
      if (existing) {
        const defaults = this.buildDemoState(false);

        if (existing.seededComplete === false && existing.demoActive !== false) {
          // Recover cleanly from an interrupted initial seed without clobbering any existing records
          const mergeById = <T extends { id: string }>(remote: T[], seed: T[]): T[] => {
            const byId = new Map(remote.map((item) => [item.id, item]));
            for (const item of seed) {
              if (!byId.has(item.id)) byId.set(item.id, item);
            }
            return Array.from(byId.values());
          };
          this.state = {
            ...defaults,
            ...existing,
            participants: mergeById(existing.participants, defaults.participants),
            consents: mergeById(existing.consents, defaults.consents),
            observations: mergeById(existing.observations, defaults.observations),
            alerts: mergeById(existing.alerts, defaults.alerts),
            programmes: mergeById(existing.programmes, defaults.programmes),
            referrals: mergeById(existing.referrals, defaults.referrals),
            auditLogs: mergeById(existing.auditLogs, defaults.auditLogs),
            alertRules:
              existing.alertRules.length > 0 ? existing.alertRules : defaults.alertRules,
            engagementTemplates:
              existing.engagementTemplates.length > 0
                ? existing.engagementTemplates
                : defaults.engagementTemplates,
          };
          this.recomputeAllSignals(this.state);
          this.writeLocalFileState(this.state);
          await store.syncSnapshot(this.state);
          return { firestoreLive: true, hydratedFromFirestore: true };
        }

        this.state = {
          ...existing,
          alertRules: existing.alertRules.length > 0 ? existing.alertRules : defaults.alertRules,
          engagementTemplates:
            existing.engagementTemplates.length > 0
              ? existing.engagementTemplates
              : defaults.engagementTemplates,
        };
        this.recomputeAllSignals(this.state);
        this.writeLocalFileState(this.state);
        return { firestoreLive: true, hydratedFromFirestore: true };
      }

      // First boot on empty database: outside development, refuse automatic demo seeding
      // unless DRT_SEED_DEMO_ON_EMPTY='true' is explicitly opted in.
      const envMode = resolveRuntimeEnvironment();
      if (isNonDevIsolatedEnvironment(envMode) && process.env.DRT_SEED_DEMO_ON_EMPTY !== 'true') {
        return { firestoreLive: true, hydratedFromFirestore: false };
      }

      // First boot on empty database (development or explicit opt-in): seed via batched upsert
      await store.syncSnapshot(this.state);
      return { firestoreLive: true, hydratedFromFirestore: false };
    } catch (err) {
      console.warn('[PopulationHealthService] Firestore hydration fallback:', err);
      this.firestoreEnabled = false;
      return { firestoreLive: false, hydratedFromFirestore: false };
    }
  }

  public async flushFirestoreSync(): Promise<void> {
    await this.ensurePersistenceReady();
    await this.pendingFirestoreSync;
  }

  public isFirestoreEnabled(): boolean {
    return this.firestoreEnabled;
  }

  public parseRole(rawRole?: string | null): PopulationRole {
    const candidate = (rawRole || 'community_viewer').trim() as PopulationRole;
    return VALID_ROLES.has(candidate) ? candidate : 'community_viewer';
  }

  private getTargetState(ctx?: PopulationServiceContext): {
    state: PersistedState;
    isGuestSandbox: boolean;
    actorLabel: string;
  } {
    const isGuest = Boolean(ctx?.guestSessionId || ctx?.authMode === 'GUEST_SANDBOX');
    if (isGuest && ctx?.guestSessionId) {
      const now = Date.now();
      // Evict stale sandboxes cleanly
      for (const [sid, entry] of this.guestSandboxes.entries()) {
        if (now - entry.lastAccessedAt > GUEST_SANDBOX_TTL_MS) {
          this.guestSandboxes.delete(sid);
        }
      }
      let existing = this.guestSandboxes.get(ctx.guestSessionId);
      if (!existing) {
        if (this.guestSandboxes.size >= MAX_GUEST_SANDBOXES) {
          const oldestKey = this.guestSandboxes.keys().next().value;
          if (oldestKey) this.guestSandboxes.delete(oldestKey);
        }
        existing = { state: this.buildDemoState(true), lastAccessedAt: now };
        this.guestSandboxes.set(ctx.guestSessionId, existing);
      } else {
        existing.lastAccessedAt = now;
      }
      return {
        state: existing.state,
        isGuestSandbox: true,
        actorLabel: ctx.actorId || ctx.guestSessionId,
      };
    }

    return {
      state: this.state,
      isGuestSandbox: false,
      actorLabel: ctx?.actorId || 'service-actor',
    };
  }

  private loadOrInitializeState(): PersistedState {
    try {
      if (fs.existsSync(this.stateFilePath)) {
        const raw = fs.readFileSync(this.stateFilePath, 'utf8');
        const parsed = JSON.parse(raw) as PersistedState;
        if (parsed && Array.isArray(parsed.participants)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[PopulationHealthService] State load fallback to synthetic seed:', err);
    }
    // Never auto-seed synthetic demo cohorts into an empty non-development database
    // (staging / production / public_judging) unless DRT_SEED_DEMO_ON_EMPTY='true'.
    const envMode = resolveRuntimeEnvironment();
    if (isNonDevIsolatedEnvironment(envMode) && process.env.DRT_SEED_DEMO_ON_EMPTY !== 'true') {
      const defaults = this.buildDemoState(false);
      const cleanIsolated: PersistedState = {
        demoActive: false,
        kThreshold: defaults.kThreshold,
        participants: [],
        consents: [],
        observations: [],
        riskSignals: [],
        alerts: [],
        alertRules: defaults.alertRules,
        programmes: [],
        referrals: [],
        engagementTemplates: defaults.engagementTemplates,
        auditLogs: [],
        aiSyntheses: [],
      };
      this.persistState(cleanIsolated);
      return cleanIsolated;
    }

    const fresh = this.buildDemoState(false);
    this.persistState(fresh);
    return fresh;
  }

  private buildDemoState(isGuestSandbox = false): PersistedState {
    const demo = buildSyntheticDemoDataset();
    const state: PersistedState = {
      demoActive: true,
      kThreshold: 5,
      participants: demo.participants,
      consents: demo.consents,
      observations: demo.observations,
      riskSignals: [],
      alerts: demo.alerts,
      alertRules: demo.alertRules,
      programmes: demo.programmes,
      referrals: demo.referrals,
      engagementTemplates: demo.engagementTemplates,
      auditLogs: isGuestSandbox
        ? [
            {
              id: `AUD-GUEST-${Date.now().toString(36).toUpperCase()}`,
              timestamp: new Date().toISOString(),
              actorRole: 'guest_demo',
              actorId: 'guest-sandbox',
              action: 'INITIALIZE_GUEST_SANDBOX',
              targetType: 'DemoDataset',
              targetId: 'SYNTHETIC_SANDBOX',
              outcome: 'ALLOWED',
              reason:
                'Initialized isolated synthetic Guest Sandbox session; zero real user data or production logs exposed.',
              dataMinimisationApplied: true,
            },
          ]
        : demo.auditLogs,
      aiSyntheses: [],
    };
    this.recomputeAllSignals(state);
    return state;
  }

  private writeLocalFileState(targetState: PersistedState): void {
    try {
      const dir = path.dirname(this.stateFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tmp = `${this.stateFilePath}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(targetState, null, 2), 'utf8');
      fs.renameSync(tmp, this.stateFilePath);
    } catch (err) {
      console.warn('[PopulationHealthService] Persistence write warning:', err);
    }
  }

  private persistState(targetState: PersistedState = this.state, isGuestSandbox = false): void {
    if (isGuestSandbox) return;
    this.writeLocalFileState(targetState);

    if (this.firestoreEnabled && this.firestoreStore) {
      const snapshot = structuredClone(targetState);
      const deletedIds = Array.from(this.deletedParticipantIds);
      const prune = this.needsFullPrune;
      this.deletedParticipantIds.clear();
      this.needsFullPrune = false;
      const store = this.firestoreStore;
      this.pendingFirestoreSync = this.pendingFirestoreSync
        .then(() =>
          store.syncSnapshot(snapshot, {
            deletedParticipantIds: deletedIds,
            deleteOrphanedNonAuditDocs: prune,
          })
        )
        .catch((err) => {
          console.warn('[PopulationHealthService] Firestore write-through warning:', err);
        });
    }
  }

  private recordAudit(
    targetState: PersistedState,
    isGuestSandbox: boolean,
    actorRole: PopulationRole,
    actorId: string,
    action: string,
    targetType: string,
    targetId: string,
    outcome: 'ALLOWED' | 'DENIED',
    reason: string,
    dataMinimisationApplied = true
  ): void {
    const entry: GovernanceAuditLog = {
      id: `AUD-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`,
      timestamp: new Date().toISOString(),
      actorRole,
      actorId: actorId || actorRole,
      action,
      targetType,
      targetId,
      outcome,
      reason,
      dataMinimisationApplied,
    };
    targetState.auditLogs.unshift(entry);
    if (targetState.auditLogs.length > 250) {
      targetState.auditLogs = targetState.auditLogs.slice(0, 250);
    }
    this.persistState(targetState, isGuestSandbox);
  }

  private authorize(
    targetState: PersistedState,
    isGuestSandbox: boolean,
    role: PopulationRole,
    permission: PopulationPermission,
    action: string,
    targetType: string,
    targetId: string,
    actorId: string
  ): void {
    const allowed = ROLE_PERMISSIONS[role]?.includes(permission);
    if (!allowed) {
      this.recordAudit(
        targetState,
        isGuestSandbox,
        role,
        actorId,
        action,
        targetType,
        targetId,
        'DENIED',
        `Role '${role}' lacks required permission '${permission}'.`
      );
      throw new AuthorizationError(
        `Access denied for role '${role}': permission '${permission}' required.`
      );
    }
  }

  private enforcePublicJudgingWriteGuard(
    targetState: PersistedState,
    isGuestSandbox: boolean,
    role: PopulationRole,
    actorId: string,
    action: string,
    targetType: string,
    targetId: string,
    syntheticFlags?: {
      dataOrigin?: unknown;
      isLiveHardware?: unknown;
      isSynthetic?: unknown;
      realPatient?: unknown;
    }
  ): void {
    const envMode = resolveRuntimeEnvironment();
    if (envMode !== 'public_judging') return;

    if (!isGuestSandbox) {
      this.recordAudit(
        targetState,
        false,
        role,
        actorId,
        action,
        targetType,
        targetId,
        'DENIED',
        '[public_judging] Blocked authenticated write against shared judging database; interactive demos must use Guest Sandbox.'
      );
      throw new AuthorizationError(
        '[public_judging] Shared judging database is read-only for authenticated users. Switch to Guest Sandbox mode for isolated synthetic interactive demos.'
      );
    }

    if (syntheticFlags) {
      const origin =
        typeof syntheticFlags.dataOrigin === 'string'
          ? syntheticFlags.dataOrigin.trim().toUpperCase()
          : '';
      const nonSyntheticOrigin = origin !== '' && origin !== 'SIMULATED';
      const liveHardware = syntheticFlags.isLiveHardware === true;
      const nonSyntheticFlag =
        syntheticFlags.isSynthetic === false || syntheticFlags.realPatient === true;

      if (nonSyntheticOrigin || liveHardware || nonSyntheticFlag) {
        this.recordAudit(
          targetState,
          true,
          role,
          actorId,
          action,
          targetType,
          targetId,
          'DENIED',
          '[public_judging] Blocked non-synthetic, live-hardware, or real-patient write payload (raw payload redacted).'
        );
        throw new AuthorizationError(
          '[public_judging] Only synthetic simulated payloads (dataOrigin=SIMULATED) are permitted in public judging mode.'
        );
      }
    }
  }

  private rejectWithRedactedAuditOnPII(
    targetState: PersistedState,
    isGuestSandbox: boolean,
    role: PopulationRole,
    actorId: string,
    action: string,
    targetType: string,
    targetId: string,
    message: string
  ): never {
    this.recordAudit(
      targetState,
      isGuestSandbox,
      role,
      actorId,
      action,
      targetType,
      targetId,
      'DENIED',
      'Rejected write payload violating direct personal identifier minimisation policy (raw payload redacted).'
    );
    throw new ValidationError(message);
  }

  private getEffectivePermissions(
    role: PopulationRole,
    ctx?: PopulationServiceContext
  ): PopulationPermission[] {
    const base = ROLE_PERMISSIONS[role] || [];
    const envMode = resolveRuntimeEnvironment();
    if (envMode === 'public_judging') {
      const isGuest = Boolean(ctx?.guestSessionId || ctx?.authMode === 'GUEST_SANDBOX');
      if (!isGuest) {
        // Shared public_judging DB is read-only for regular/authenticated endpoints.
        return base.filter(
          (p) => p === 'VIEW_AGGREGATE' || p === 'VIEW_PARTICIPANTS' || p === 'EXPORT_REPORTS'
        );
      }
      // Guests cannot run /demo/reset or /demo/load in public_judging.
      return base.filter((p) => p !== 'RESET_DEMO');
    }
    if (isNonDevIsolatedEnvironment(envMode)) {
      const canPrivilegedReset =
        canonicalizeRole(role) === 'platform_admin' && ctx?.privilegedResetVerified === true;
      return canPrivilegedReset ? base : base.filter((p) => p !== 'RESET_DEMO');
    }
    return base;
  }

  public getPublicJudgingPolicySummary(envMode: DrTRuntimeEnvironment = resolveRuntimeEnvironment()) {
    return {
      environment: envMode,
      sharedDatabaseWriteMode:
        envMode === 'public_judging' ? 'read_only_for_public_writes' : 'normal_rbac',
      guestSandboxWriteMode:
        envMode === 'public_judging' ? 'in_memory_synthetic_only' : 'in_memory_sandbox',
      demoSeedAndResetRequiresAdminToken: isNonDevIsolatedEnvironment(envMode),
      emptyDatabaseAutoSeedEnabled:
        !isNonDevIsolatedEnvironment(envMode) || process.env.DRT_SEED_DEMO_ON_EMPTY === 'true',
      routes: POPULATION_HEALTH_ROUTE_INVENTORY,
    };
  }

  private recomputeAllSignals(targetState: PersistedState = this.state): void {
    const allSignals: PopulationRiskSignal[] = [];
    for (const participant of targetState.participants) {
      const assessed = assessParticipantPopulationSignals(participant, targetState.observations);
      participant.riskTier = assessed.riskTier;
      participant.priorityScore = assessed.priorityScore;
      for (const sig of assessed.signals) {
        const existing = targetState.riskSignals.find((s) => s.id === sig.id);
        if (existing) {
          sig.status = existing.status;
          sig.reviewedBy = existing.reviewedBy;
          sig.reviewedAt = existing.reviewedAt;
        }
        allSignals.push(sig);
      }
    }
    allSignals.sort((a, b) => b.priorityScore - a.priorityScore);
    targetState.riskSignals = allSignals;
  }

  public getConnectorStatuses(
    targetState: PersistedState = this.state
  ): IntegrationConnectorStatus[] {
    let presageStatus: ReturnType<PresageServerService['getStatus']> | null = null;
    try {
      presageStatus = PresageServerService.getInstance().getStatus();
    } catch {
      presageStatus = null;
    }

    const healthAlertObsCount = targetState.observations.filter(
      (o) => o.sourceSystem === 'HEALTH_ALERT_MINI'
    ).length;
    const presageObsCount = targetState.observations.filter(
      (o) => o.sourceSystem === 'PRESAGE_OPTICAL'
    ).length;
    const clinicalCount = targetState.observations.filter(
      (o) => o.sourceSystem === 'CLINICAL_IMPORT' || o.sourceSystem === 'COMMUNITY_SCREENING'
    ).length;
    const wearableCount = targetState.observations.filter(
      (o) => o.sourceSystem === 'WEARABLE_BRIDGE'
    ).length;

    const presageConnected = Boolean(presageStatus?.sdkInstalled && presageStatus?.hasApiKey);
    const hasLivePresageObs = targetState.observations.some(
      (o) => o.sourceSystem === 'PRESAGE_OPTICAL' && o.dataOrigin === 'LIVE'
    );

    return [
      {
        id: 'health_alert_mini',
        name: 'Health Alert Mini Triage Engine',
        connectionState: targetState.observations.some(
          (o) => o.sourceSystem === 'HEALTH_ALERT_MINI' && o.dataOrigin === 'LIVE'
        )
          ? 'LIVE'
          : 'SIMULATED',
        details:
          'Connected to Dr. T Health Alert Mini heuristic & red-flag escalation pipeline (/api/health-alert/analyze).',
        lastSyncAt: new Date().toISOString(),
        recordsCount: healthAlertObsCount,
      },
      {
        id: 'presage_optical',
        name: 'Presage SmartSpectra Optical Sensing',
        connectionState: presageConnected && hasLivePresageObs ? 'LIVE' : 'SIMULATED',
        details: presageConnected
          ? `SmartSpectra SDK v${presageStatus?.sdkVersion} authenticated (${presageStatus?.nativePlatform}).`
          : `SDK ${presageStatus?.sdkInstalled ? 'installed' : 'unavailable'} · PRESAGE_API_KEY not configured; optical inputs require camera consent & remain marked SIMULATED until hardware stream configured.`,
        lastSyncAt: new Date().toISOString(),
        recordsCount: presageObsCount,
      },
      {
        id: 'clinical_import',
        name: 'Community Lab & Clinic Intake',
        connectionState: targetState.observations.some(
          (o) =>
            (o.sourceSystem === 'CLINICAL_IMPORT' || o.sourceSystem === 'COMMUNITY_SCREENING') &&
            o.dataOrigin === 'IMPORTED'
        )
          ? 'IMPORTED'
          : 'SIMULATED',
        details: 'Structured Hb, Ferritin, HbA1c, eGFR, BP, and Antenatal visit check-in intake.',
        lastSyncAt: new Date().toISOString(),
        recordsCount: clinicalCount,
      },
      {
        id: 'wearable_bridge',
        name: 'Approved Wearable Stream Bridge',
        connectionState: wearableCount > 0 ? 'IMPORTED' : 'UNAVAILABLE',
        details:
          wearableCount > 0
            ? 'Imported consenting wearable heart rate & SpO2 summaries.'
            : 'No external Apple Health / Fitbit OAuth device stream connected in this workspace.',
        recordsCount: wearableCount,
      },
    ];
  }

  public getDashboard(
    role: PopulationRole,
    filters?: {
      dateRange?: '30d' | '90d' | '180d' | 'all';
      cohort?: string;
      region?: string;
    },
    ctx?: PopulationServiceContext
  ): PopulationHealthDashboardPayload {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'VIEW_AGGREGATE',
      'VIEW_DASHBOARD',
      'Dashboard',
      'ALL',
      actorLabel
    );

    const dateRange = filters?.dateRange || '90d';
    const cohort = filters?.cohort || 'ALL';
    const region = filters?.region || 'ALL';

    const canViewParticipants = ROLE_PERMISSIONS[role].includes('VIEW_PARTICIPANTS');
    const piiRedacted = !canViewParticipants;

    const cutoffMs =
      dateRange === '30d'
        ? Date.now() - 30 * 86400000
        : dateRange === '90d'
          ? Date.now() - 90 * 86400000
          : dateRange === '180d'
            ? Date.now() - 180 * 86400000
            : 0;

    const filterParticipant = (p: PopulationParticipant) => {
      if (cohort !== 'ALL' && p.cohort !== cohort) return false;
      if (region !== 'ALL' && p.region !== region) return false;
      return true;
    };

    const filteredParticipantsRaw = state.participants.filter(filterParticipant);
    const participantById = new Map(state.participants.map((p) => [p.id, p]));
    const activeIds = new Set(
      filteredParticipantsRaw.filter((p) => p.consentStatus === 'ACTIVE').map((p) => p.id)
    );
    const allFilteredIds = new Set(filteredParticipantsRaw.map((p) => p.id));

    const filteredObservations = state.observations.filter((o) => {
      if (!activeIds.has(o.participantId)) return false;
      if (cutoffMs > 0 && Date.parse(o.recordedAt) < cutoffMs) return false;
      return true;
    });

    const maskAliasInText = (text: string): string => {
      if (!piiRedacted || !text) return text;
      let out = text;
      for (const p of state.participants) {
        if (p.displayAlias && out.includes(p.displayAlias)) {
          out = out.split(p.displayAlias).join(`Pseudonym ${p.syntheticCode}`);
        }
      }
      return out;
    };

    const filteredSignalsRaw = state.riskSignals.filter((s) => activeIds.has(s.participantId));
    const riskSignals: PopulationRiskSignal[] = filteredSignalsRaw.map((s) => {
      if (!piiRedacted) return s;
      const owner = participantById.get(s.participantId);
      return {
        ...s,
        participantAlias: `Pseudonym ${owner?.syntheticCode || s.participantId.slice(-6)}`,
      };
    });

    const filteredReferralsRaw = state.referrals.filter((r) => activeIds.has(r.participantId));
    const referrals: CareReferralItem[] = filteredReferralsRaw.map((r) => {
      if (!piiRedacted) return r;
      const owner = participantById.get(r.participantId);
      return {
        ...r,
        participantAlias: `Pseudonym ${owner?.syntheticCode || r.participantId.slice(-6)}`,
        reasonSummary: '[Redacted — aggregate care navigation count only]',
        communications: [],
      };
    });

    const filteredAlertsRaw = state.alerts.filter((a) => {
      if (cohort !== 'ALL' && a.affectedCohort !== cohort && a.affectedCohort !== 'All') return false;
      if (region !== 'ALL' && a.affectedRegion !== region && a.affectedRegion !== 'All') return false;
      return true;
    });
    const alerts: PopulationAlert[] = filteredAlertsRaw.map((a) =>
      piiRedacted
        ? {
            ...a,
            title: maskAliasInText(a.title),
            summary: maskAliasInText(a.summary),
          }
        : a
    );

    const filteredProgrammes = state.programmes.filter((p) => {
      if (cohort !== 'ALL' && p.cohort !== cohort && p.cohort !== 'All Consented Adults')
        return false;
      return true;
    });

    const participants: PopulationParticipant[] = filteredParticipantsRaw.map((p) =>
      canViewParticipants
        ? p
        : {
            ...p,
            displayAlias: `Pseudonym ${p.syntheticCode}`,
            notes: '[Redacted under role data-minimisation policy]',
          }
    );

    const consented = filteredParticipantsRaw.filter((p) => p.consentStatus === 'ACTIVE');
    const revoked = filteredParticipantsRaw.filter((p) => p.consentStatus === 'REVOKED');
    const upToDate = consented.filter((p) => p.screeningStatus === 'UP_TO_DATE').length;
    const validSignals = filteredObservations.filter((o) => o.qualityFlag === 'VALID').length;
    const elevatedCount = consented.filter(
      (p) => p.riskTier === 'ELEVATED' || p.riskTier === 'PRIORITY_FOLLOWUP'
    ).length;

    // k-Anonymity safeguard: prevent subgroup filter-bypass leaks!
    // If a non-empty filtered consented slice has 0 < n < kThreshold, suppress exact
    // aggregate KPI percentages/counts, trends, and operational impact breakdowns.
    const suppressedForPrivacy = consented.length > 0 && consented.length < state.kThreshold;

    const kAnonymitySummary = computeKAnonymityCohorts(
      filteredParticipantsRaw,
      state.kThreshold
    );
    const { trends, impactMetrics } = computeTrendsAndImpact(
      filteredParticipantsRaw,
      filteredReferralsRaw,
      filteredProgrammes,
      filteredObservations,
      suppressedForPrivacy
    );

    const loadedTracks = Array.from(
      new Set(state.participants.map((p) => p.cohort))
    ) as DemoFocusTrack[];

    const openAlertsCount = filteredAlertsRaw.filter((a) => a.status !== 'RESOLVED').length;
    const activeReferralsCount = filteredReferralsRaw.filter((r) => r.stage !== 'RESOLVED').length;
    const overdueFollowUpsCount = filteredReferralsRaw.filter(
      (r) => r.overdueDays > 7 && r.stage !== 'RESOLVED'
    ).length;

    const auditLogs: GovernanceAuditLog[] = state.auditLogs.slice(0, 80).map((log) =>
      piiRedacted || isGuestSandbox
        ? {
            ...log,
            actorId: isGuestSandbox ? 'guest-sandbox' : String(log.actorRole),
          }
        : log
    );

    return {
      roleContext: {
        currentRole: role,
        canonicalRole: canonicalizeRole(role),
        verifiedMaxRole: ctx?.verifiedMaxRole || canonicalizeRole(role),
        authMode: ctx?.authMode || (isGuestSandbox ? 'GUEST_SANDBOX' : 'ISOLATED_TEST'),
        isGuestSandbox,
        permissions: this.getEffectivePermissions(role, ctx),
        piiRedacted,
      },
      filtersApplied: {
        dateRange,
        cohort,
        region,
        kThreshold: state.kThreshold,
      },
      demoMode: {
        active: state.demoActive,
        loadedTracks,
        bannerText: isGuestSandbox
          ? 'Isolated Guest Sandbox Active — Synthetic competition cohorts (Blood Health, Cardiometabolic Health, Maternal Health) are isolated to your session and never modify production records.'
          : state.demoActive
            ? 'Synthetic Competition Demo Mode Active — All demo cohorts (Blood Health, Cardiometabolic Health, Maternal Health) are clearly marked SIMULATED and non-diagnostic.'
            : 'Workspace Active — Displaying only recorded community signals.',
      },
      persistenceStatus: isGuestSandbox
        ? getCachedPersistenceStatusSync(true)
        : this.lastFirestoreStatus || getCachedPersistenceStatusSync(false),
      emergencyGuidance: {
        internalRedirectOnlyNotice:
          'Internal clinical triage redirect only — Dr. T does NOT automatically dispatch ambulances or call emergency services.',
        emergencyNumbers: 'Vietnam: 115 | US/Canada: 911 | EU: 112 | UAE: 998',
      },
      complianceMetadata: {
        retentionPolicyDays: 365,
        legalFrameworks: [
          'Vietnam Personal Data Protection Law No. 91/2025/QH15 & Decree 356/2025/ND-CP (Consent, Data Minimisation, Right to Erasure)',
          'HIPAA Safe Harbor De-identification & Role-Based Least Privilege Architecture',
          'Non-Diagnostic Clinical Decision Support Boundary (WHO / AHA / ADA / KDIGO)',
        ],
        legalReviewNotice:
          'Platform technical safeguards implement consent ledger, k-anonymity, PII rejection, and erasure workflows; formal clinical & DPO legal sign-off is required prior to real-patient deployment.',
      },
      connectors: this.getConnectorStatuses(state),
      kpis: suppressedForPrivacy
        ? {
            totalParticipants: 0,
            consentedParticipants: 0,
            revokedParticipants: 0,
            totalSignals: 0,
            validSignalsPct: 0,
            elevatedRiskCount: 0,
            openAlertsCount: 0,
            activeReferralsCount: 0,
            overdueFollowUpsCount: 0,
            screeningCompletionPct: 0,
            avgReferralResolutionDays: 0,
            suppressedForPrivacy: true,
          }
        : {
            totalParticipants: filteredParticipantsRaw.length,
            consentedParticipants: consented.length,
            revokedParticipants: revoked.length,
            totalSignals: filteredObservations.length,
            validSignalsPct:
              filteredObservations.length > 0
                ? Math.round((validSignals / filteredObservations.length) * 100)
                : 100,
            elevatedRiskCount: elevatedCount,
            openAlertsCount,
            activeReferralsCount,
            overdueFollowUpsCount,
            screeningCompletionPct:
              consented.length > 0 ? Math.round((upToDate / consented.length) * 100) : 0,
            avgReferralResolutionDays: consented.length > 0 ? 4.5 : 0,
            suppressedForPrivacy: false,
          },
      participants,
      consents: state.consents.filter((c) => allFilteredIds.has(c.participantId)),
      observations: filteredObservations,
      riskSignals,
      alerts,
      alertRules: state.alertRules,
      programmes: filteredProgrammes,
      referrals,
      engagementTemplates: state.engagementTemplates,
      impactMetrics,
      trends,
      trendsSuppressedForPrivacy: suppressedForPrivacy,
      kAnonymitySummary,
      auditLogs,
      aiSyntheses: state.aiSyntheses.slice(0, 10),
      nonDiagnosticBanner: POPULATION_NON_DIAGNOSTIC_BANNER,
    };
  }

  public addParticipant(
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
      dataOrigin?: DataProvenance;
      isSynthetic?: boolean;
      realPatient?: boolean;
    },
    ctx?: PopulationServiceContext
  ): PopulationParticipant {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'MANAGE_PARTICIPANTS',
      'CREATE_PARTICIPANT',
      'Participant',
      'NEW',
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'CREATE_PARTICIPANT',
      'Participant',
      'NEW',
      {
        dataOrigin: input.dataOrigin,
        isSynthetic: input.isSynthetic,
        realPatient: input.realPatient,
      }
    );

    const cleanAlias = sanitizeText(input.displayAlias, 80);
    const cleanNotes = sanitizeText(input.notes, 320);
    const cleanRegion = sanitizeText(input.region, 80) || 'District 1 Clinic';

    if (!cleanAlias || cleanAlias.length < 2) {
      throw new ValidationError('Participant alias is required.');
    }
    if (
      containsDirectIdentifier(cleanAlias) ||
      containsDirectIdentifier(cleanNotes) ||
      containsDirectIdentifier(cleanRegion)
    ) {
      this.rejectWithRedactedAuditOnPII(
        state,
        isGuestSandbox,
        role,
        actorLabel,
        'CREATE_PARTICIPANT',
        'Participant',
        'NEW',
        'Direct personal identifiers (email, phone, Vietnamese CCCD, SSN) are blocked by privacy minimisation rules.'
      );
    }
    const age = Number(input.age);
    if (!Number.isFinite(age) || age < 1 || age > 120) {
      throw new ValidationError('Age must be between 1 and 120.');
    }

    const ageBand: PopulationParticipant['ageBand'] =
      age < 30 ? '18-29' : age < 45 ? '30-44' : age < 60 ? '45-59' : '60+';
    const now = new Date().toISOString();
    const id = `PART-${Date.now().toString(36).toUpperCase()}`;
    const syntheticCode = `REG-${Math.floor(1000 + Math.random() * 8999)}`;
    const consentStatus: ConsentStatus = input.consentGiven ? 'ACTIVE' : 'PENDING';
    const scopes: ConsentScope[] =
      input.consentGiven && input.scopes?.length
        ? input.scopes
        : input.consentGiven
          ? ['population_analytics', 'care_navigation']
          : [];

    const participant: PopulationParticipant = {
      id,
      syntheticCode,
      displayAlias: cleanAlias,
      isSynthetic: isGuestSandbox,
      age,
      ageBand,
      gender: input.gender || 'Unspecified',
      cohort: input.cohort || 'Cardiometabolic Health',
      region: cleanRegion,
      preferredLanguage: input.preferredLanguage || 'en',
      dataOrigin: isGuestSandbox ? 'SIMULATED' : 'IMPORTED',
      consentStatus,
      consentScopes: scopes,
      riskTier: 'ROUTINE',
      priorityScore: 10,
      screeningStatus: 'DUE_SOON',
      activeProgrammeIds: [],
      referralStage: 'NONE',
      lastSignalAt: now,
      notes: cleanNotes,
      createdAt: now,
      updatedAt: now,
    };

    state.participants.unshift(participant);
    state.consents.unshift({
      id: `CNS-${Date.now().toString(36).toUpperCase()}`,
      participantId: id,
      scopes,
      status: consentStatus,
      purpose: `${participant.cohort} community screening & care navigation`,
      grantedAt: now,
      updatedAt: now,
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      recordedBy: actorLabel,
    });

    this.recomputeAllSignals(state);
    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'CREATE_PARTICIPANT',
      'Participant',
      id,
      'ALLOWED',
      `Registered consented participant in ${participant.cohort} (${participant.region}).`
    );
    return participant;
  }

  public updateParticipantConsent(
    role: PopulationRole,
    participantId: string,
    status: ConsentStatus,
    scopes?: ConsentScope[],
    ctx?: PopulationServiceContext
  ): PopulationParticipant {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'MANAGE_CONSENT',
      'UPDATE_CONSENT',
      'ConsentRecord',
      participantId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'UPDATE_CONSENT',
      'ConsentRecord',
      participantId
    );

    const participant = state.participants.find((p) => p.id === participantId);
    if (!participant) {
      throw new ValidationError(`Participant ${participantId} not found.`);
    }

    const now = new Date().toISOString();
    participant.consentStatus = status;
    participant.consentScopes =
      status === 'REVOKED'
        ? []
        : scopes && scopes.length > 0
          ? scopes
          : participant.consentScopes.length > 0
            ? participant.consentScopes
            : ['population_analytics'];
    participant.updatedAt = now;

    const existingConsent = state.consents.find((c) => c.participantId === participantId);
    if (existingConsent) {
      existingConsent.status = status;
      existingConsent.scopes = participant.consentScopes;
      existingConsent.updatedAt = now;
      if (status === 'REVOKED') {
        existingConsent.withdrawnAt = now;
      }
    }

    this.recomputeAllSignals(state);
    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      status === 'REVOKED' ? 'REVOKE_PARTICIPANT_CONSENT' : 'UPDATE_PARTICIPANT_CONSENT',
      'ConsentRecord',
      participantId,
      'ALLOWED',
      `Consent status updated to ${status}; analytics & AI context updated immediately.`
    );
    return participant;
  }

  public eraseParticipantData(
    role: PopulationRole,
    participantId: string,
    ctx?: PopulationServiceContext
  ): { erasedParticipantId: string } {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'ERASE_PARTICIPANT',
      'PDPL_RIGHT_TO_ERASURE',
      'Participant',
      participantId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'PDPL_RIGHT_TO_ERASURE',
      'Participant',
      participantId
    );

    const exists = state.participants.some((p) => p.id === participantId);
    if (!exists) {
      throw new ValidationError(`Participant ${participantId} not found.`);
    }

    state.participants = state.participants.filter((p) => p.id !== participantId);
    state.observations = state.observations.filter((o) => o.participantId !== participantId);
    state.riskSignals = state.riskSignals.filter((s) => s.participantId !== participantId);
    state.referrals = state.referrals.filter((r) => r.participantId !== participantId);
    for (const c of state.consents) {
      if (c.participantId === participantId) {
        c.status = 'REVOKED';
        c.scopes = [];
        c.withdrawnAt = new Date().toISOString();
        c.updatedAt = c.withdrawnAt;
      }
    }

    if (!isGuestSandbox) {
      this.deletedParticipantIds.add(participantId);
      this.needsFullPrune = true;
    }

    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'PDPL_RIGHT_TO_ERASURE',
      'Participant',
      participantId,
      'ALLOWED',
      `Erased participant observations, risk signals, and referrals for ${participantId} under PDPL retention policy.`
    );
    return { erasedParticipantId: participantId };
  }

  public ingestObservation(
    role: PopulationRole,
    input: {
      participantId: string;
      sourceSystem: SignalSourceSystem;
      dataOrigin?: DataProvenance;
      metricType: SignalMetricType;
      valueDisplay: string;
      numericValue?: number;
      secondaryNumericValue?: number;
      unit?: string;
      recordedAt?: string;
      provenanceNote?: string;
      isSynthetic?: boolean;
      realPatient?: boolean;
      isLiveHardware?: boolean;
    },
    ctx?: PopulationServiceContext
  ): { observation: HealthSignalObservation; riskSignals: PopulationRiskSignal[] } {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'INGEST_SIGNALS',
      'INGEST_HEALTH_SIGNAL',
      'Observation',
      input.participantId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'INGEST_HEALTH_SIGNAL',
      'Observation',
      input.participantId,
      {
        dataOrigin: input.dataOrigin,
        isLiveHardware: input.isLiveHardware,
        isSynthetic: input.isSynthetic,
        realPatient: input.realPatient,
      }
    );

    const participant = state.participants.find((p) => p.id === input.participantId);
    if (!participant) {
      throw new ValidationError(`Participant ${input.participantId} not found.`);
    }
    if (participant.consentStatus !== 'ACTIVE') {
      this.recordAudit(
        state,
        isGuestSandbox,
        role,
        actorLabel,
        'INGEST_HEALTH_SIGNAL',
        'Observation',
        input.participantId,
        'DENIED',
        `Participant ${participant.syntheticCode} does not have ACTIVE consent (${participant.consentStatus}).`
      );
      throw new AuthorizationError(
        `Consent guardrail: Participant ${participant.syntheticCode} has ${participant.consentStatus} consent. Signal ingestion blocked.`
      );
    }

    const cleanNote = sanitizeText(input.provenanceNote, 240);
    const cleanValueDisplay = sanitizeText(input.valueDisplay, 80);

    if (containsDirectIdentifier(cleanNote) || containsDirectIdentifier(cleanValueDisplay)) {
      this.rejectWithRedactedAuditOnPII(
        state,
        isGuestSandbox,
        role,
        actorLabel,
        'INGEST_HEALTH_SIGNAL',
        'Observation',
        input.participantId,
        'Direct personal identifiers are prohibited in health signal fields.'
      );
    }

    const recordedAt = input.recordedAt || new Date().toISOString();
    const spec = getReferenceRangeForMetric(input.metricType);
    const quality = validateObservationQuality({
      metricType: input.metricType,
      numericValue: input.numericValue,
      secondaryNumericValue: input.secondaryNumericValue,
      unit: input.unit,
      recordedAt,
    });

    const forcedOrigin: DataProvenance = isGuestSandbox || participant.isSynthetic
      ? 'SIMULATED'
      : input.dataOrigin || 'IMPORTED';

    const obs: HealthSignalObservation = {
      id: `OBS-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 5)
        .toUpperCase()}`,
      participantId: participant.id,
      sourceSystem: input.sourceSystem,
      dataOrigin: forcedOrigin,
      metricType: input.metricType,
      metricLabel: spec.label,
      valueDisplay: cleanValueDisplay || `${input.numericValue ?? ''} ${quality.normalizedUnit}`.trim(),
      numericValue: input.numericValue,
      secondaryNumericValue: input.secondaryNumericValue,
      unit: quality.normalizedUnit,
      referenceRange: spec.referenceRange,
      qualityFlag: quality.qualityFlag,
      qualityScore: quality.qualityScore,
      recordedAt,
      provenanceNote: cleanNote || `Submitted via ${input.sourceSystem} intake pipeline.`,
      consentVerified: true,
    };

    state.observations.unshift(obs);
    participant.lastSignalAt = recordedAt;
    participant.updatedAt = new Date().toISOString();

    this.recomputeAllSignals(state);
    const participantSignals = state.riskSignals.filter((s) => s.participantId === participant.id);

    if (participant.priorityScore >= 75) {
      const alertId = `ALT-${participant.id}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
      state.alerts.unshift({
        id: alertId,
        category: 'CLINICAL_REVIEW',
        severity: 'URGENT_REVIEW',
        title: `Priority Population Signal: ${participant.displayAlias} (${participant.cohort})`,
        summary: `New ${obs.metricLabel} (${obs.valueDisplay}) raised composite priority score to ${participant.priorityScore}/100.`,
        affectedCohort: participant.cohort,
        affectedRegion: participant.region,
        metricEvidence: `${obs.metricLabel}: ${obs.valueDisplay} (${obs.sourceSystem})`,
        status: 'OPEN',
        assignedReviewer: 'Clinical Triage Queue',
        auditNotes: [
          {
            timestamp: new Date().toISOString(),
            actor: role,
            note: 'Signal ingested and queued for clinician review.',
          },
        ],
        urgentClinicalRedirect: quality.qualityFlag === 'VALID' && participant.priorityScore >= 85,
        createdAt: new Date().toISOString(),
      });
    }

    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'INGEST_HEALTH_SIGNAL',
      'Observation',
      obs.id,
      'ALLOWED',
      `Ingested ${obs.metricLabel} (${obs.valueDisplay}, quality=${obs.qualityFlag}, origin=${obs.dataOrigin}) for ${participant.syntheticCode}.`
    );

    return { observation: obs, riskSignals: participantSignals };
  }

  public ingestHealthAlertBridge(
    role: PopulationRole,
    participantId: string,
    intake: Partial<HealthAlertIntakeData> & {
      dataOrigin?: DataProvenance;
      isSynthetic?: boolean;
      realPatient?: boolean;
    },
    ctx?: PopulationServiceContext
  ) {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'INGEST_SIGNALS',
      'BRIDGE_HEALTH_ALERT_MINI',
      'Integration',
      participantId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'BRIDGE_HEALTH_ALERT_MINI',
      'Integration',
      participantId,
      {
        dataOrigin: intake?.dataOrigin,
        isSynthetic: intake?.isSynthetic,
        realPatient: intake?.realPatient,
      }
    );

    if (
      containsDirectIdentifier(intake?.patientAlias) ||
      containsDirectIdentifier(intake?.primaryConcern) ||
      (Array.isArray(intake?.symptoms) &&
        intake.symptoms.some((s) => containsDirectIdentifier(String(s))))
    ) {
      this.rejectWithRedactedAuditOnPII(
        state,
        isGuestSandbox,
        role,
        actorLabel,
        'BRIDGE_HEALTH_ALERT_MINI',
        'Integration',
        participantId,
        'Direct personal identifiers are prohibited in Health Alert bridge intake fields.'
      );
    }

    const participant = state.participants.find((p) => p.id === participantId);
    if (!participant) {
      throw new ValidationError(`Participant ${participantId} not found.`);
    }
    if (participant.consentStatus !== 'ACTIVE') {
      throw new AuthorizationError(
        `Consent guardrail: Participant ${participant.syntheticCode} has ${participant.consentStatus} consent.`
      );
    }

    const mappedGender: HealthAlertIntakeData['gender'] =
      participant.gender === 'Female' || participant.gender === 'Male'
        ? participant.gender
        : 'Prefer not to say';

    const normalizedIntake: HealthAlertIntakeData = {
      patientAlias: intake?.patientAlias || participant.syntheticCode,
      age: typeof intake?.age === 'number' ? intake.age : participant.age,
      gender: intake?.gender || mappedGender,
      primaryConcern: intake?.primaryConcern || 'Community screening triage check-in',
      durationDays: typeof intake?.durationDays === 'number' ? intake.durationDays : 3,
      severityScale: typeof intake?.severityScale === 'number' ? intake.severityScale : 5,
      vitals: intake?.vitals || {},
      labs: intake?.labs || {},
      symptoms: Array.isArray(intake?.symptoms) ? intake.symptoms : [],
      medications: Array.isArray(intake?.medications) ? intake.medications : [],
      allergies: Array.isArray(intake?.allergies) ? intake.allergies : [],
      consentGiven: intake?.consentGiven ?? participant.consentStatus === 'ACTIVE',
      deIdentifiedConfirmed: intake?.deIdentifiedConfirmed ?? true,
      countryOrRegion: intake?.countryOrRegion || participant.region,
    };

    const validation = validateHealthAlertRequest(normalizedIntake);
    if (!validation.isValid) {
      throw new ValidationError(validation.error || 'Invalid Health Alert Mini intake payload.');
    }

    const heuristic = evaluateHealthAlertHeuristics(normalizedIntake);
    const bridgeOrigin: DataProvenance =
      isGuestSandbox || participant.isSynthetic ? 'SIMULATED' : 'LIVE';
    const createdObs: HealthSignalObservation[] = [];

    if (normalizedIntake.vitals.bloodPressure) {
      const [sys, dia] = normalizedIntake.vitals.bloodPressure
        .split('/')
        .map((x) => parseInt(x.trim(), 10));
      if (!Number.isNaN(sys) && !Number.isNaN(dia)) {
        const res = this.ingestObservation(
          role,
          {
            participantId,
            sourceSystem: 'HEALTH_ALERT_MINI',
            dataOrigin: bridgeOrigin,
            metricType: 'blood_pressure',
            valueDisplay: `${sys}/${dia} mmHg`,
            numericValue: sys,
            secondaryNumericValue: dia,
            unit: 'mmHg',
            provenanceNote: `Health Alert Mini bridge (${heuristic.triageTier}, ${bridgeOrigin})`,
          },
          ctx
        );
        createdObs.push(res.observation);
      }
    }

    if (typeof normalizedIntake.labs.ferritin === 'number') {
      const res = this.ingestObservation(
        role,
        {
          participantId,
          sourceSystem: 'HEALTH_ALERT_MINI',
          dataOrigin: bridgeOrigin,
          metricType: 'ferritin',
          valueDisplay: `${normalizedIntake.labs.ferritin} ng/mL`,
          numericValue: normalizedIntake.labs.ferritin,
          unit: 'ng/mL',
          provenanceNote: `Health Alert Mini lab bridge (${heuristic.triageTier})`,
        },
        ctx
      );
      createdObs.push(res.observation);
    }

    if (typeof normalizedIntake.labs.hba1c === 'number') {
      const res = this.ingestObservation(
        role,
        {
          participantId,
          sourceSystem: 'HEALTH_ALERT_MINI',
          dataOrigin: bridgeOrigin,
          metricType: 'hba1c',
          valueDisplay: `${normalizedIntake.labs.hba1c} %`,
          numericValue: normalizedIntake.labs.hba1c,
          unit: '%',
          provenanceNote: `Health Alert Mini glycaemic bridge (${heuristic.triageTier})`,
        },
        ctx
      );
      createdObs.push(res.observation);
    }

    if (typeof normalizedIntake.labs.hemoglobin === 'number') {
      const res = this.ingestObservation(
        role,
        {
          participantId,
          sourceSystem: 'HEALTH_ALERT_MINI',
          dataOrigin: bridgeOrigin,
          metricType: 'haemoglobin',
          valueDisplay: `${normalizedIntake.labs.hemoglobin} g/dL`,
          numericValue: normalizedIntake.labs.hemoglobin,
          unit: 'g/dL',
          provenanceNote: `Health Alert Mini Hb bridge (${heuristic.triageTier})`,
        },
        ctx
      );
      createdObs.push(res.observation);
    }

    if (createdObs.length === 0) {
      const res = this.ingestObservation(
        role,
        {
          participantId,
          sourceSystem: 'HEALTH_ALERT_MINI',
          dataOrigin: bridgeOrigin,
          metricType: 'symptom_triage',
          valueDisplay: `${normalizedIntake.severityScale}/10 (${heuristic.triageTier})`,
          numericValue: normalizedIntake.severityScale,
          unit: 'score (1-10)',
          provenanceNote: `Health Alert Mini triage: ${normalizedIntake.primaryConcern}`,
        },
        ctx
      );
      createdObs.push(res.observation);
    }

    return {
      triageTier: heuristic.triageTier,
      triageTitle: heuristic.triageTitle,
      urgencyTimeline: heuristic.urgencyTimeline,
      urgentEmergencyRedirect: heuristic.triageTier === 'EMERGENT_ESCALATION',
      observationsCreated: createdObs,
    };
  }

  public ingestPresageBridge(
    role: PopulationRole,
    participantId: string,
    vitals: {
      pulseRateBpm?: number;
      breathingRateRpm?: number;
      hrvRmssdMs?: number;
      isLiveHardware?: boolean;
      cameraConsentVerified?: boolean;
      dataOrigin?: DataProvenance;
      isSynthetic?: boolean;
      realPatient?: boolean;
    },
    ctx?: PopulationServiceContext
  ) {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'INGEST_SIGNALS',
      'BRIDGE_PRESAGE_OPTICAL',
      'Integration',
      participantId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'BRIDGE_PRESAGE_OPTICAL',
      'Integration',
      participantId,
      {
        dataOrigin: vitals?.dataOrigin,
        isLiveHardware: vitals?.isLiveHardware,
        isSynthetic: vitals?.isSynthetic,
        realPatient: vitals?.realPatient,
      }
    );

    const status = PresageServerService.getInstance().getStatus();
    const origin: DataProvenance =
      !isGuestSandbox &&
      vitals.isLiveHardware &&
      vitals.cameraConsentVerified &&
      status.hasApiKey &&
      status.sdkInstalled
        ? 'LIVE'
        : 'SIMULATED';
    const created: HealthSignalObservation[] = [];

    if (typeof vitals.pulseRateBpm === 'number') {
      created.push(
        this.ingestObservation(
          role,
          {
            participantId,
            sourceSystem: 'PRESAGE_OPTICAL',
            dataOrigin: origin,
            metricType: 'resting_hr',
            valueDisplay: `${vitals.pulseRateBpm} bpm`,
            numericValue: vitals.pulseRateBpm,
            unit: 'bpm',
            provenanceNote: `Presage SmartSpectra optical pulse (${origin})`,
          },
          ctx
        ).observation
      );
    }
    if (typeof vitals.breathingRateRpm === 'number') {
      created.push(
        this.ingestObservation(
          role,
          {
            participantId,
            sourceSystem: 'PRESAGE_OPTICAL',
            dataOrigin: origin,
            metricType: 'breathing_rate',
            valueDisplay: `${vitals.breathingRateRpm} breaths/min`,
            numericValue: vitals.breathingRateRpm,
            unit: 'breaths/min',
            provenanceNote: `Presage SmartSpectra optical respiratory rate (${origin})`,
          },
          ctx
        ).observation
      );
    }
    if (typeof vitals.hrvRmssdMs === 'number') {
      created.push(
        this.ingestObservation(
          role,
          {
            participantId,
            sourceSystem: 'PRESAGE_OPTICAL',
            dataOrigin: origin,
            metricType: 'hrv',
            valueDisplay: `${vitals.hrvRmssdMs} ms`,
            numericValue: vitals.hrvRmssdMs,
            unit: 'ms',
            provenanceNote: `Presage SmartSpectra RMSSD HRV (${origin})`,
          },
          ctx
        ).observation
      );
    }

    if (created.length === 0) {
      throw new ValidationError(
        'Provide at least one Presage optical metric (pulseRateBpm, breathingRateRpm, or hrvRmssdMs).'
      );
    }

    return { presageStatus: status, dataOrigin: origin, observationsCreated: created };
  }

  public reviewRiskSignal(
    role: PopulationRole,
    signalId: string,
    status: PopulationRiskSignal['status'],
    ctx?: PopulationServiceContext
  ): PopulationRiskSignal {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'REVIEW_ALERTS',
      'REVIEW_RISK_SIGNAL',
      'RiskSignal',
      signalId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'REVIEW_RISK_SIGNAL',
      'RiskSignal',
      signalId
    );

    const signal = state.riskSignals.find((s) => s.id === signalId);
    if (!signal) {
      throw new ValidationError(`Risk signal ${signalId} not found.`);
    }

    signal.status = status;
    signal.reviewedBy = role;
    signal.reviewedAt = new Date().toISOString();

    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'REVIEW_RISK_SIGNAL',
      'RiskSignal',
      signalId,
      'ALLOWED',
      `Clinician/manager updated signal status to ${status}.`
    );
    return signal;
  }

  public updateAlertStatus(
    role: PopulationRole,
    alertId: string,
    payload: {
      status: PopulationAlert['status'];
      assignedReviewer?: string;
      note?: string;
    },
    ctx?: PopulationServiceContext
  ): PopulationAlert {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'REVIEW_ALERTS',
      'UPDATE_POPULATION_ALERT',
      'Alert',
      alertId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'UPDATE_POPULATION_ALERT',
      'Alert',
      alertId
    );

    const alert = state.alerts.find((a) => a.id === alertId);
    if (!alert) {
      throw new ValidationError(`Alert ${alertId} not found.`);
    }

    const now = new Date().toISOString();
    alert.status = payload.status;
    if (payload.assignedReviewer) alert.assignedReviewer = sanitizeText(payload.assignedReviewer, 80);
    if (payload.status === 'ACKNOWLEDGED' && !alert.acknowledgedAt) {
      alert.acknowledgedBy = role;
      alert.acknowledgedAt = now;
    }
    if (payload.status === 'RESOLVED') {
      alert.resolvedAt = now;
    }
    if (payload.note) {
      alert.auditNotes.push({ timestamp: now, actor: role, note: sanitizeText(payload.note, 240) });
    }

    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'UPDATE_POPULATION_ALERT',
      'Alert',
      alertId,
      'ALLOWED',
      `Alert status changed to ${payload.status}.`
    );
    return alert;
  }

  public toggleAlertRule(
    role: PopulationRole,
    ruleId: string,
    enabled: boolean,
    ctx?: PopulationServiceContext
  ): AlertRuleConfig {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'REVIEW_ALERTS',
      'TOGGLE_ALERT_RULE',
      'AlertRule',
      ruleId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'TOGGLE_ALERT_RULE',
      'AlertRule',
      ruleId
    );
    const rule = state.alertRules.find((r) => r.id === ruleId);
    if (!rule) throw new ValidationError(`Alert rule ${ruleId} not found.`);
    rule.enabled = enabled;
    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'TOGGLE_ALERT_RULE',
      'AlertRule',
      ruleId,
      'ALLOWED',
      `Rule '${rule.name}' ${enabled ? 'enabled' : 'disabled'}.`
    );
    return rule;
  }

  public createReferral(
    role: PopulationRole,
    input: {
      participantId: string;
      destinationService: string;
      reasonSummary: string;
      priority?: CareReferralItem['priority'];
      navigatorName?: string;
    },
    ctx?: PopulationServiceContext
  ): CareReferralItem {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'MANAGE_REFERRALS',
      'CREATE_REFERRAL',
      'Referral',
      input.participantId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'CREATE_REFERRAL',
      'Referral',
      input.participantId
    );
    const participant = state.participants.find((p) => p.id === input.participantId);
    if (!participant) throw new ValidationError(`Participant ${input.participantId} not found.`);
    if (participant.consentStatus !== 'ACTIVE') {
      throw new AuthorizationError(
        'Cannot create care navigation referral for participant without active consent.'
      );
    }
    const cleanReason = sanitizeText(input.reasonSummary, 240);
    if (containsDirectIdentifier(cleanReason)) {
      this.rejectWithRedactedAuditOnPII(
        state,
        isGuestSandbox,
        role,
        actorLabel,
        'CREATE_REFERRAL',
        'Referral',
        input.participantId,
        'Direct personal identifiers are not permitted in referral summary.'
      );
    }

    const now = new Date().toISOString();
    const ref: CareReferralItem = {
      id: `REF-${Date.now().toString(36).toUpperCase()}`,
      participantId: participant.id,
      participantAlias: participant.displayAlias,
      cohort: participant.cohort,
      region: participant.region,
      stage: 'HUMAN_REVIEW',
      priority: input.priority || 'EXPEDITED',
      navigatorName: sanitizeText(input.navigatorName, 80) || 'Care Navigator Linh',
      destinationService:
        sanitizeText(input.destinationService, 120) || `${participant.region} Community Clinic`,
      reasonSummary: cleanReason,
      appointmentStatus: 'PENDING_SCHEDULING',
      communications: [],
      overdueDays: 0,
      escalated: false,
      createdAt: now,
      updatedAt: now,
    };

    participant.referralStage = ref.stage;
    state.referrals.unshift(ref);
    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'CREATE_REFERRAL',
      'Referral',
      ref.id,
      'ALLOWED',
      `Created care navigation pathway for ${participant.syntheticCode} -> ${ref.destinationService}.`
    );
    return ref;
  }

  public advanceReferral(
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
    },
    ctx?: PopulationServiceContext
  ): CareReferralItem {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'MANAGE_REFERRALS',
      'UPDATE_REFERRAL',
      'Referral',
      referralId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'UPDATE_REFERRAL',
      'Referral',
      referralId
    );

    const ref = state.referrals.find((r) => r.id === referralId);
    if (!ref) throw new ValidationError(`Referral ${referralId} not found.`);

    const now = new Date().toISOString();
    if (payload.stage) {
      ref.stage = payload.stage;
      const p = state.participants.find((part) => part.id === ref.participantId);
      if (p) p.referralStage = payload.stage;
    }
    if (payload.appointmentStatus) ref.appointmentStatus = payload.appointmentStatus;
    if (payload.appointmentDate) ref.appointmentDate = sanitizeText(payload.appointmentDate, 40);
    if (typeof payload.escalated === 'boolean') ref.escalated = payload.escalated;
    if (payload.communicationNote && payload.communicationNote.trim()) {
      const cleanComm = sanitizeText(payload.communicationNote, 240);
      if (containsDirectIdentifier(cleanComm)) {
        this.rejectWithRedactedAuditOnPII(
          state,
          isGuestSandbox,
          role,
          actorLabel,
          'UPDATE_REFERRAL',
          'Referral',
          referralId,
          'Direct personal identifiers are blocked in communication logs.'
        );
      }
      ref.communications.push({
        id: `COMM-${Date.now().toString(36).toUpperCase()}`,
        timestamp: now,
        channel: payload.channel || 'PORTAL',
        language: payload.language || 'en',
        summary: cleanComm,
        actor: role,
      });
    }
    if (ref.stage === 'RESOLVED') {
      ref.overdueDays = 0;
      ref.escalated = false;
      if (ref.appointmentStatus === 'PENDING_SCHEDULING') {
        ref.appointmentStatus = 'COMPLETED';
      }
    }
    ref.updatedAt = now;

    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'UPDATE_REFERRAL',
      'Referral',
      referralId,
      'ALLOWED',
      `Updated referral stage=${ref.stage}, appointment=${ref.appointmentStatus}.`
    );
    return ref;
  }

  public updateProgrammeAction(
    role: PopulationRole,
    programmeId: string,
    action: 'SEND_INVITE' | 'RECORD_COMPLETION' | 'TOGGLE_STATUS',
    ctx?: PopulationServiceContext
  ): ScreeningProgramme {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'MANAGE_PROGRAMMES',
      'UPDATE_PROGRAMME',
      'Programme',
      programmeId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'UPDATE_PROGRAMME',
      'Programme',
      programmeId
    );
    const prog = state.programmes.find((p) => p.id === programmeId);
    if (!prog) throw new ValidationError(`Programme ${programmeId} not found.`);

    if (action === 'SEND_INVITE') {
      prog.invitedCount += 1;
      prog.consentedCount += 1;
    } else if (action === 'RECORD_COMPLETION') {
      prog.screenedCount += 1;
      prog.completedCount += 1;
      if (prog.overdueCount > 0) prog.overdueCount -= 1;
    } else if (action === 'TOGGLE_STATUS') {
      prog.status = prog.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    }
    prog.operationalCompletionRatePct =
      prog.invitedCount > 0 ? Math.round((prog.completedCount / prog.invitedCount) * 100) : 0;

    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      `PROGRAMME_${action}`,
      'Programme',
      programmeId,
      'ALLOWED',
      `Programme '${prog.name}' updated (${action}).`
    );
    return prog;
  }

  public gateEngagementTemplate(
    role: PopulationRole,
    templateId: string,
    action: 'APPROVE' | 'SEND',
    ctx?: PopulationServiceContext
  ): EngagementTemplate {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'APPROVE_AND_SEND_ENGAGEMENT',
      `ENGAGEMENT_${action}`,
      'EngagementTemplate',
      templateId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      `ENGAGEMENT_${action}`,
      'EngagementTemplate',
      templateId
    );
    const tpl = state.engagementTemplates.find((t) => t.id === templateId);
    if (!tpl) throw new ValidationError(`Engagement template ${templateId} not found.`);

    const now = new Date().toISOString();
    if (action === 'APPROVE') {
      tpl.status = 'APPROVED_TO_SEND';
      tpl.approvedBy = role;
      tpl.approvedAt = now;
    } else {
      if (tpl.status !== 'APPROVED_TO_SEND' && tpl.status !== 'SENT') {
        throw new ValidationError(
          'Human review gate: Message must be explicitly APPROVED_TO_SEND before dispatch.'
        );
      }
      tpl.status = 'SENT';
      tpl.sentAt = now;
    }

    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      `ENGAGEMENT_${action}`,
      'EngagementTemplate',
      templateId,
      'ALLOWED',
      `Multilingual engagement template '${tpl.title}' -> ${tpl.status}.`
    );
    return tpl;
  }

  public async runAiResearchQuery(
    role: PopulationRole,
    query: string,
    geminiClient: GoogleGenAI | null,
    ctx?: PopulationServiceContext
  ): Promise<AiResearchSynthesisResult> {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'RUN_AI_ASSISTANT',
      'RUN_AI_RESEARCH_SYNTHESIS',
      'AiAssistant',
      'QUERY',
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'RUN_AI_RESEARCH_SYNTHESIS',
      'AiAssistant',
      'QUERY'
    );

    const cleanQuery = sanitizeText(query, 400);
    if (!cleanQuery || cleanQuery.length < 3) {
      throw new ValidationError('Research query must be at least 3 characters.');
    }
    if (containsDirectIdentifier(cleanQuery)) {
      this.rejectWithRedactedAuditOnPII(
        state,
        isGuestSandbox,
        role,
        actorLabel,
        'RUN_AI_RESEARCH_SYNTHESIS',
        'AiAssistant',
        'QUERY',
        'Direct personal identifiers are not allowed in AI research prompts.'
      );
    }

    const consented = state.participants.filter((p) => p.consentStatus === 'ACTIVE');
    const cohortBreakdown = (['Blood Health', 'Cardiometabolic Health', 'Maternal Health'] as const).map(
      (track) => {
        const group = consented.filter((p) => p.cohort === track);
        if (group.length > 0 && group.length < state.kThreshold) {
          return `${track}: subgroup <${state.kThreshold} (metrics suppressed for k-anonymity)`;
        }
        const elevated = group.filter(
          (p) => p.riskTier === 'ELEVATED' || p.riskTier === 'PRIORITY_FOLLOWUP'
        ).length;
        const overdue = group.filter((p) => p.screeningStatus === 'OVERDUE').length;
        return `${track}: n=${group.length}, elevated/priority=${elevated}, overdue_screening=${overdue}`;
      }
    );

    const openReferrals = state.referrals.filter((r) => r.stage !== 'RESOLVED').length;
    const overdueFollowUps = state.referrals.filter(
      (r) => r.overdueDays > 7 && r.stage !== 'RESOLVED'
    ).length;

    const observationalSummary = `De-identified Consented Cohorts (n=${consented.length} active; ${state.participants.length - consented.length} excluded by consent revocation): ${cohortBreakdown.join(' | ')}. Active referrals: ${openReferrals} (${overdueFollowUps} overdue >7 days).`;

    let aiSynthesis = '';
    let prioritisedActions: string[] = [];
    let uncertaintyNotes =
      'Cohort observations combine Health Alert Mini intake, clinical imports, and synthetic demo records; single-point screenings require confirmatory laboratory or cuff testing.';
    let providerUsed = 'population-health-deterministic-evidence-engine (Verified Fallback)';
    let fallbackEngaged = true;

    const modelName = 'gemini-3.8-flash';
    if (geminiClient && !GeminiCircuitBreaker.isCircuitOpen(modelName)) {
      const prompt = `You are the Dr. T Community Health Signal Intelligence AI Research Assistant.
Strictly follow these Responsible AI rules:
- You only receive aggregated, de-identified population statistics (never raw PII).
- You NEVER make medical diagnoses or prescribe treatments.
- Distinguish clearly between observed data metrics and AI interpretation.
- Never invent or hallucinate journal citations or URLs; refer only to WHO, AHA/ACC, ADA, and KDIGO guidelines already attached by the platform.
- Keep your summary structured, concise, and operational for public health teams.

Observed Population Metrics:
${observationalSummary}

Research Question: "${cleanQuery}"

Respond in JSON with exactly:
{
  "synthesis": "3-4 sentence evidence-grounded population interpretation",
  "prioritisedActions": ["action 1", "action 2", "action 3"],
  "uncertainty": "concise note on data completeness and non-diagnostic boundaries"
}`;

      const raw = await GeminiCircuitBreaker.executeWithFallback(
        geminiClient,
        modelName,
        prompt,
        10000
      );
      if (raw) {
        try {
          const clean = raw.replace(/```json|```/gi, '').trim();
          const parsed = JSON.parse(clean);
          if (parsed && typeof parsed.synthesis === 'string') {
            aiSynthesis = parsed.synthesis;
            prioritisedActions = Array.isArray(parsed.prioritisedActions)
              ? parsed.prioritisedActions.slice(0, 4).map(String)
              : [];
            if (typeof parsed.uncertainty === 'string' && parsed.uncertainty.trim()) {
              uncertaintyNotes = parsed.uncertainty.trim();
            }
            providerUsed = `${modelName} (Server-Side Proxy)`;
            fallbackEngaged = false;
          }
        } catch {
          aiSynthesis = raw.slice(0, 700);
          providerUsed = `${modelName} (Server-Side Proxy)`;
          fallbackEngaged = false;
        }
      }
    }

    if (!aiSynthesis) {
      fallbackEngaged = true;
      providerUsed = 'population-health-deterministic-evidence-engine (Verified Fallback)';
      aiSynthesis = `Based on the aggregated consented population dataset (n=${consented.length}), screening priorities concentrate in Maternal Health perinatal continuity (overdue ANC scheduling and gestational BP checks), District 1 Blood Health iron/haemoglobin depletion flags, and Urban Core Cardiometabolic follow-up delays. All findings are non-diagnostic triage priorities requiring clinician and care-navigator verification before outreach.`;
      prioritisedActions = [
        'Prioritise River Ward Maternal care-navigator follow-up for overdue ANC visits and gestational BP >= 140/90 mmHg.',
        'Schedule confirmatory ferritin/CBC clinics for flagged District 1 Blood Health participants using bilingual EN/VI outreach.',
        'Clear unscheduled Urban Core cardiometabolic referrals exceeding 5-day wait targets before expanding new screening drives.',
      ];
    }

    const isAiGenerated = !fallbackEngaged;

    const result: AiResearchSynthesisResult = {
      id: `AI-SYN-${Date.now().toString(36).toUpperCase()}`,
      query: cleanQuery,
      generatedAt: new Date().toISOString(),
      providerUsed,
      isAiGenerated,
      fallbackEngaged,
      observationalSummary,
      aiSynthesis,
      prioritisedActions,
      uncertaintyNotes,
      citations: POPULATION_GUIDELINES.slice(0, 4),
      humanApprovalStatus: 'PENDING_HUMAN_REVIEW',
    };

    state.aiSyntheses.unshift(result);
    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'RUN_AI_RESEARCH_SYNTHESIS',
      'AiAssistant',
      result.id,
      'ALLOWED',
      `Generated de-identified synthesis (${providerUsed}, isAiGenerated=${isAiGenerated}); awaiting mandatory human approval.`,
      true
    );
    return result;
  }

  public approveAiSynthesis(
    role: PopulationRole,
    synthesisId: string,
    decision: 'APPROVED' | 'REJECTED',
    ctx?: PopulationServiceContext
  ): AiResearchSynthesisResult {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'APPROVE_AI_SYNTHESIS',
      `AI_SYNTHESIS_${decision}`,
      'AiAssistant',
      synthesisId,
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      `AI_SYNTHESIS_${decision}`,
      'AiAssistant',
      synthesisId
    );
    const item = state.aiSyntheses.find((s) => s.id === synthesisId);
    if (!item) throw new ValidationError(`AI synthesis ${synthesisId} not found.`);
    item.humanApprovalStatus = decision;
    item.approvedBy = role;
    item.approvedAt = new Date().toISOString();
    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      `AI_SYNTHESIS_${decision}`,
      'AiAssistant',
      synthesisId,
      'ALLOWED',
      `Human clinician/manager marked synthesis ${decision}.`
    );
    return item;
  }

  public updateGovernanceThreshold(
    role: PopulationRole,
    kThreshold: number,
    ctx?: PopulationServiceContext
  ): { kThreshold: number } {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'MANAGE_GOVERNANCE',
      'UPDATE_K_ANONYMITY_THRESHOLD',
      'Governance',
      'K_THRESHOLD',
      actorLabel
    );
    this.enforcePublicJudgingWriteGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'UPDATE_K_ANONYMITY_THRESHOLD',
      'Governance',
      'K_THRESHOLD'
    );
    const k = Math.min(20, Math.max(3, Math.round(Number(kThreshold) || 5)));
    state.kThreshold = k;
    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'UPDATE_K_ANONYMITY_THRESHOLD',
      'Governance',
      'K_THRESHOLD',
      'ALLOWED',
      `Small-group privacy threshold k updated to ${k}.`
    );
    return { kThreshold: k };
  }

  public exportDeidentifiedReport(
    role: PopulationRole,
    format: 'csv' | 'json',
    filters?: {
      dateRange?: '30d' | '90d' | '180d' | 'all';
      cohort?: string;
      region?: string;
    },
    ctx?: PopulationServiceContext
  ): { contentType: string; filename: string; body: string } {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'EXPORT_REPORTS',
      'EXPORT_POPULATION_REPORT',
      'Report',
      format,
      actorLabel
    );

    const dashboard = this.getDashboard(role, filters, ctx);
    this.recordAudit(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'EXPORT_POPULATION_REPORT',
      'Report',
      format,
      'ALLOWED',
      `Exported de-identified k-anonymity (k=${dashboard.kAnonymitySummary.kThreshold}) report in ${format.toUpperCase()}.`,
      true
    );

    if (format === 'json') {
      const payload = {
        exportedAt: new Date().toISOString(),
        disclaimer: POPULATION_NON_DIAGNOSTIC_BANNER,
        filtersApplied: dashboard.filtersApplied,
        kThreshold: dashboard.kAnonymitySummary.kThreshold,
        suppressedSubgroupCells: dashboard.kAnonymitySummary.suppressedCount,
        suppressedForPrivacy: Boolean(dashboard.kpis.suppressedForPrivacy),
        kpis: dashboard.kpis,
        cohortBreakdown: dashboard.kAnonymitySummary.cells,
        trends: dashboard.trends,
        impactMetrics: dashboard.impactMetrics,
      };
      return {
        contentType: 'application/json; charset=utf-8',
        filename: 'dr-t-population-health-report.json',
        body: JSON.stringify(payload, null, 2),
      };
    }

    const lines = [
      'cohort_region_cell,consented_count,suppressed_for_privacy,elevated_risk_count,screening_completion_pct',
    ];
    for (const cell of dashboard.kAnonymitySummary.cells) {
      const safeLabel = `"${cell.label.replace(/"/g, '""')}"`;
      lines.push(
        `${safeLabel},${cell.suppressed ? `<${dashboard.kAnonymitySummary.kThreshold}` : cell.count},${cell.suppressed},${cell.elevatedRiskCount ?? 'SUPPRESSED'},${cell.screeningCompletionPct ?? 'SUPPRESSED'}`
      );
    }
    return {
      contentType: 'text/csv; charset=utf-8',
      filename: 'dr-t-population-health-cohort-summary.csv',
      body: lines.join('\n'),
    };
  }

  private enforcePrivilegedDemoResetGuard(
    targetState: PersistedState,
    isGuestSandbox: boolean,
    role: PopulationRole,
    actorLabel: string,
    action: string,
    ctx?: PopulationServiceContext
  ): void {
    const envMode = resolveRuntimeEnvironment();
    if (!isNonDevIsolatedEnvironment(envMode)) return;
    const canon = canonicalizeRole(role);
    if (isGuestSandbox || canon !== 'platform_admin' || !ctx?.privilegedResetVerified) {
      this.recordAudit(
        targetState,
        isGuestSandbox,
        role,
        actorLabel,
        action,
        'DemoDataset',
        'RESTRICTED',
        'DENIED',
        `[${envMode}] Rejected unprivileged demo/reset request (requires platform_admin + server-side reset token).`
      );
      throw new AuthorizationError(
        `[${envMode}] Demo dataset load/reset requires platform_admin authority and a verified X-DrT-Admin-Reset-Token.`
      );
    }
  }

  public loadSyntheticDemo(
    role: PopulationRole,
    ctx?: PopulationServiceContext
  ): PopulationHealthDashboardPayload {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'RESET_DEMO',
      'LOAD_SYNTHETIC_DEMO',
      'DemoDataset',
      'ALL',
      actorLabel
    );
    this.enforcePrivilegedDemoResetGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'LOAD_SYNTHETIC_DEMO',
      ctx
    );
    const priorAuditLogs = state.auditLogs;
    const demoState = this.buildDemoState(isGuestSandbox);
    const nextState: PersistedState = {
      ...demoState,
      auditLogs: [...priorAuditLogs, ...demoState.auditLogs].slice(0, 250),
    };

    if (isGuestSandbox && ctx?.guestSessionId) {
      this.guestSandboxes.set(ctx.guestSessionId, { state: nextState, lastAccessedAt: Date.now() });
    } else {
      this.state = nextState;
    }

    this.recordAudit(
      nextState,
      isGuestSandbox,
      role,
      actorLabel,
      'LOAD_SYNTHETIC_DEMO',
      'DemoDataset',
      'ALL',
      'ALLOWED',
      'Loaded synthetic competition demo cohorts (Blood Health, Cardiometabolic Health, Maternal Health).'
    );
    return this.getDashboard(role, undefined, ctx);
  }

  public resetDemoToClean(
    role: PopulationRole,
    ctx?: PopulationServiceContext
  ): PopulationHealthDashboardPayload {
    const { state, isGuestSandbox, actorLabel } = this.getTargetState(ctx);
    this.authorize(
      state,
      isGuestSandbox,
      role,
      'RESET_DEMO',
      'RESET_DEMO_CLEAN',
      'DemoDataset',
      'CLEAN',
      actorLabel
    );
    this.enforcePrivilegedDemoResetGuard(
      state,
      isGuestSandbox,
      role,
      actorLabel,
      'RESET_DEMO_CLEAN',
      ctx
    );
    const priorAuditLogs = state.auditLogs;
    const cleanSeed = this.buildDemoState(isGuestSandbox);
    const nextState: PersistedState = {
      demoActive: false,
      kThreshold: 5,
      participants: [],
      consents: [],
      observations: [],
      riskSignals: [],
      alerts: [],
      alertRules: cleanSeed.alertRules,
      programmes: [],
      referrals: [],
      engagementTemplates: cleanSeed.engagementTemplates,
      auditLogs: priorAuditLogs,
      aiSyntheses: [],
    };

    if (isGuestSandbox && ctx?.guestSessionId) {
      this.guestSandboxes.set(ctx.guestSessionId, { state: nextState, lastAccessedAt: Date.now() });
    } else {
      this.state = nextState;
      this.needsFullPrune = true;
    }

    this.recordAudit(
      nextState,
      isGuestSandbox,
      role,
      actorLabel,
      'RESET_DEMO_CLEAN',
      'DemoDataset',
      'CLEAN',
      'ALLOWED',
      'Cleared synthetic competition dataset to empty state.'
    );
    return this.getDashboard(role, undefined, ctx);
  }
}
