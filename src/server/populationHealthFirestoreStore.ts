// ============================================================================
// DR. T — POPULATION HEALTH FIRESTORE PERSISTENCE PROBE & REST ADAPTER
// Checks Cloud Run ADC / Firestore permissions honestly and implements
// full idempotent REST CRUD + startup hydration for Firestore v1 API.
// Preserves unrelated Dr. T collections and strictly avoids Guest Sandbox writes.
// ============================================================================

import fs from 'fs';
import path from 'path';
import {
  AiResearchSynthesisResult,
  AlertRuleConfig,
  CareReferralItem,
  ConsentRecordItem,
  EngagementTemplate,
  GovernanceAuditLog,
  HealthSignalObservation,
  PersistenceStatusInfo,
  PopulationAlert,
  PopulationParticipant,
  PopulationRiskSignal,
  ScreeningProgramme,
} from '../types/populationHealth';

import { resolveServerFirebaseConfig } from './runtimeEnvironment';

const METADATA_TOKEN_URL =
  'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';
const METADATA_SA_EMAIL_URL =
  'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/email';

export interface FirestorePersistedStateSnapshot {
  demoActive: boolean;
  kThreshold: number;
  seededComplete?: boolean;
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

export interface FirestoreAdapterOptions {
  firestoreApiOrigin?: string;
  accessTokenProvider?: () => Promise<string | null>;
  projectId?: string;
  databaseId?: string;
}

export function loadFirebaseConfig(options?: FirestoreAdapterOptions): {
  projectId: string;
  databaseId: string;
} {
  const resolved = resolveServerFirebaseConfig(process.env, {
    projectId: options?.projectId,
    databaseId: options?.databaseId,
    skipStrictEnvValidation: Boolean(options?.firestoreApiOrigin),
  });
  return {
    projectId: resolved.projectId,
    databaseId: resolved.databaseId,
  };
}

let cachedProbe: {
  status: PersistenceStatusInfo;
  checkedAtMs: number;
} | null = null;
let runtimeServiceAccountCache: string | null = null;

export async function getRuntimeServiceAccountEmail(): Promise<string> {
  if (runtimeServiceAccountCache) return runtimeServiceAccountCache;
  if (process.env.AUTHORIZED_SERVICE_ACCOUNT_EMAIL) {
    runtimeServiceAccountCache = process.env.AUTHORIZED_SERVICE_ACCOUNT_EMAIL;
    return runtimeServiceAccountCache;
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(METADATA_SA_EMAIL_URL, {
      headers: { 'Metadata-Flavor': 'Google' },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const email = (await res.text()).trim();
      if (email) {
        runtimeServiceAccountCache = email;
        return email;
      }
    }
  } catch {
    // ignore
  }
  return 'ais-sandbox@ais-asia-southeast1-a11562d113.iam.gserviceaccount.com';
}

async function fetchMetadataAccessToken(): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1800);
    const res = await fetch(METADATA_TOKEN_URL, {
      headers: { 'Metadata-Flavor': 'Google' },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data?.access_token || null;
  } catch {
    return null;
  }
}

// ============================================================================
// Firestore REST v1 Value Codec
// ============================================================================
type FirestoreValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { stringValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

export function toFirestoreValue(val: unknown): FirestoreValue {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) return { nullValue: null };
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === 'string') {
    return { stringValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.filter((v) => v !== undefined).map((item) => toFirestoreValue(item)),
      },
    };
  }
  if (typeof val === 'object') {
    const fields: Record<string, FirestoreValue> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

export function fromFirestoreValue(val: any): unknown {
  if (!val || typeof val !== 'object') return null;
  if ('nullValue' in val) return null;
  if ('booleanValue' in val) return Boolean(val.booleanValue);
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('stringValue' in val) return String(val.stringValue);
  if ('timestampValue' in val) return String(val.timestampValue);
  if ('arrayValue' in val) {
    const vals = Array.isArray(val.arrayValue?.values) ? val.arrayValue.values : [];
    return vals.map((item: any) => fromFirestoreValue(item));
  }
  if ('mapValue' in val) {
    const out: Record<string, unknown> = {};
    const fields = val.mapValue?.fields || {};
    for (const [k, v] of Object.entries(fields)) {
      out[k] = fromFirestoreValue(v);
    }
    return out;
  }
  return null;
}

export function encodeFirestoreFields(obj: Record<string, unknown>): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      fields[k] = toFirestoreValue(v);
    }
  }
  return fields;
}

export function decodeFirestoreDocument<T>(doc: { name?: string; fields?: Record<string, any> }): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(doc.fields || {})) {
    out[k] = fromFirestoreValue(v);
  }
  if (!out.id && doc.name) {
    out.id = doc.name.split('/').pop();
  }
  return out as T;
}

// ============================================================================
// Probe & Status Helpers
// ============================================================================
export async function probePopulationFirestorePersistence(
  forceRefresh = false,
  options?: FirestoreAdapterOptions
): Promise<PersistenceStatusInfo> {
  const now = Date.now();
  if (!forceRefresh && !options && cachedProbe && now - cachedProbe.checkedAtMs < 60_000) {
    return cachedProbe.status;
  }

  const defaults = loadFirebaseConfig(options);
  const projectId = options?.projectId || defaults.projectId;
  const databaseId = options?.databaseId || defaults.databaseId;
  const origin = options?.firestoreApiOrigin || 'https://firestore.googleapis.com';
  const saEmail = await getRuntimeServiceAccountEmail();

  const fallback: PersistenceStatusInfo = {
    mode: 'FILE_SANDBOX_FALLBACK',
    durableAcrossRestarts: false,
    firestoreProjectId: projectId,
    firestoreDatabaseId: databaseId,
    limitationNote:
      'Server persistence currently uses container file storage (.data/population-health-state.json) because Cloud Run ADC lacks Firestore IAM permission.',
    requiredAction: `Grant IAM role 'roles/datastore.user' to principal 'serviceAccount:${saEmail}' on project '${projectId}' (database '${databaseId}').`,
  };

  try {
    const token = options?.accessTokenProvider
      ? await options.accessTokenProvider()
      : await fetchMetadataAccessToken();
    if (!token) {
      const noTokenStatus: PersistenceStatusInfo = {
        ...fallback,
        limitationNote:
          'Metadata service access token unavailable; running with local file fallback (.data/population-health-state.json).',
      };
      if (!options) cachedProbe = { status: noTokenStatus, checkedAtMs: now };
      return noTokenStatus;
    }

    const endpoint = `${origin}/v1/projects/${encodeURIComponent(
      projectId
    )}/databases/${encodeURIComponent(databaseId)}/documents/population_participants?pageSize=1`;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      signal: ctrl.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const liveStatus: PersistenceStatusInfo = {
        mode: 'FIRESTORE_LIVE',
        durableAcrossRestarts: true,
        firestoreProjectId: projectId,
        firestoreDatabaseId: databaseId,
        limitationNote: `Firestore database '${databaseId}' verified reachable via ADC (${saEmail}).`,
        requiredAction: 'None — Firestore server access is active.',
      };
      if (!options) cachedProbe = { status: liveStatus, checkedAtMs: now };
      return liveStatus;
    }

    const deniedStatus: PersistenceStatusInfo = {
      ...fallback,
      limitationNote: `Firestore REST probe returned HTTP ${res.status} on database '${databaseId}' for ${saEmail}; using local file fallback (.data/population-health-state.json).`,
    };
    if (!options) cachedProbe = { status: deniedStatus, checkedAtMs: now };
    return deniedStatus;
  } catch (err) {
    const errStatus: PersistenceStatusInfo = {
      ...fallback,
      limitationNote: `Firestore probe error (${err instanceof Error ? err.message : 'network unavailable'}); using local file fallback (.data/population-health-state.json).`,
    };
    if (!options) cachedProbe = { status: errStatus, checkedAtMs: now };
    return errStatus;
  }
}

export function getCachedPersistenceStatusSync(isGuestSandbox = false): PersistenceStatusInfo {
  const { projectId, databaseId } = loadFirebaseConfig();
  if (isGuestSandbox) {
    return {
      mode: 'EPHEMERAL_GUEST_SANDBOX',
      durableAcrossRestarts: false,
      firestoreProjectId: projectId,
      firestoreDatabaseId: databaseId,
      limitationNote:
        'Isolated synthetic Guest Sandbox session in server memory (6h TTL). Writes never modify Firestore or production state.',
      requiredAction: 'Sign in with a verified staff account for durable team workflows.',
    };
  }

  if (cachedProbe) return cachedProbe.status;

  return {
    mode: 'FILE_SANDBOX_FALLBACK',
    durableAcrossRestarts: false,
    firestoreProjectId: projectId,
    firestoreDatabaseId: databaseId,
    limitationNote:
      'Running with local container file fallback (.data/population-health-state.json) unless Cloud Run ADC holds roles/datastore.user on Firestore.',
    requiredAction: `Grant IAM role 'roles/datastore.user' to serviceAccount:ais-sandbox@ais-asia-southeast1-a11562d113.iam.gserviceaccount.com on project '${projectId}'.`,
  };
}

// ============================================================================
// Firestore REST v1 Durable Repository Adapter
// ============================================================================
export const POP_COLLECTIONS = {
  participants: 'population_participants',
  consents: 'population_consents',
  observations: 'population_observations',
  alerts: 'population_alerts',
  programmes: 'population_programmes',
  referrals: 'population_referrals',
  auditLogs: 'population_audit_logs',
  config: 'population_system_config',
} as const;

export class PopulationHealthFirestoreStore {
  private readonly projectId: string;
  private readonly databaseId: string;
  private readonly apiOrigin: string;
  private readonly tokenProvider: () => Promise<string | null>;

  constructor(options?: FirestoreAdapterOptions) {
    const cfg = loadFirebaseConfig();
    this.projectId = options?.projectId || cfg.projectId;
    this.databaseId = options?.databaseId || cfg.databaseId;
    this.apiOrigin = options?.firestoreApiOrigin || 'https://firestore.googleapis.com';
    this.tokenProvider = options?.accessTokenProvider || fetchMetadataAccessToken;
  }

  private get documentsRoot(): string {
    return `${this.apiOrigin}/v1/projects/${encodeURIComponent(
      this.projectId
    )}/databases/${encodeURIComponent(this.databaseId)}/documents`;
  }

  private async requestWithRetry(
    url: string,
    init: RequestInit,
    retries = 2
  ): Promise<Response> {
    const token = await this.tokenProvider();
    if (!token) {
      throw new Error('Firestore ADC token unavailable');
    }

    let lastErr: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 4000);
        const res = await fetch(url, {
          ...init,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...(init.headers || {}),
          },
          signal: ctrl.signal,
        });
        clearTimeout(timer);

        // Retry only on transient conflict/availability statuses
        if ((res.status === 409 || res.status === 503 || res.status === 429) && attempt < retries) {
          await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
          continue;
        }
        return res;
      } catch (err) {
        lastErr = err;
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
        }
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('Firestore REST request failed');
  }

  public async listCollection<T>(collectionName: string, pageSize = 500): Promise<T[]> {
    const out: T[] = [];
    let pageToken = '';

    do {
      const qs = new URLSearchParams({ pageSize: String(pageSize) });
      if (pageToken) qs.set('pageToken', pageToken);
      const res = await this.requestWithRetry(`${this.documentsRoot}/${collectionName}?${qs}`, {
        method: 'GET',
      });
      if (!res.ok) {
        throw new Error(`Firestore list ${collectionName} failed: HTTP ${res.status}`);
      }
      const data = (await res.json()) as {
        documents?: Array<{ name?: string; fields?: Record<string, any> }>;
        nextPageToken?: string;
      };
      for (const doc of data.documents || []) {
        out.push(decodeFirestoreDocument<T>(doc));
      }
      pageToken = data.nextPageToken || '';
    } while (pageToken);

    return out;
  }

  public async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    const res = await this.requestWithRetry(
      `${this.documentsRoot}/${collectionName}/${encodeURIComponent(docId)}`,
      { method: 'GET' }
    );
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Firestore get ${collectionName}/${docId} failed: HTTP ${res.status}`);
    }
    const doc = (await res.json()) as { name?: string; fields?: Record<string, any> };
    return decodeFirestoreDocument<T>(doc);
  }

  public async upsertDocument(
    collectionName: string,
    docId: string,
    data: Record<string, unknown>
  ): Promise<void> {
    const safeId = encodeURIComponent(docId);
    const res = await this.requestWithRetry(`${this.documentsRoot}/${collectionName}/${safeId}`, {
      method: 'PATCH',
      body: JSON.stringify({ fields: encodeFirestoreFields(data) }),
    });
    if (!res.ok) {
      throw new Error(`Firestore upsert ${collectionName}/${docId} failed: HTTP ${res.status}`);
    }
  }

  /**
   * Append-only creation (currentDocument.exists=false) for immutable audit logs.
   * Ignores 409 ALREADY_EXISTS to guarantee idempotency on network retries.
   */
  public async createImmutableDocument(
    collectionName: string,
    docId: string,
    data: Record<string, unknown>
  ): Promise<void> {
    const qs = new URLSearchParams({ documentId: docId });
    const res = await this.requestWithRetry(`${this.documentsRoot}/${collectionName}?${qs}`, {
      method: 'POST',
      body: JSON.stringify({ fields: encodeFirestoreFields(data) }),
    });
    if (res.status === 409) return;
    if (!res.ok) {
      throw new Error(
        `Firestore append-only create ${collectionName}/${docId} failed: HTTP ${res.status}`
      );
    }
  }

  public async deleteDocument(collectionName: string, docId: string): Promise<void> {
    const safeId = encodeURIComponent(docId);
    const res = await this.requestWithRetry(`${this.documentsRoot}/${collectionName}/${safeId}`, {
      method: 'DELETE',
    });
    if (res.status === 404) return;
    if (!res.ok) {
      throw new Error(`Firestore delete ${collectionName}/${docId} failed: HTTP ${res.status}`);
    }
  }

  public async loadFullSnapshot(): Promise<FirestorePersistedStateSnapshot | null> {
    const [
      participants,
      consents,
      observations,
      alerts,
      programmes,
      referrals,
      auditLogs,
      configDoc,
    ] = await Promise.all([
      this.listCollection<PopulationParticipant>(POP_COLLECTIONS.participants),
      this.listCollection<ConsentRecordItem>(POP_COLLECTIONS.consents),
      this.listCollection<HealthSignalObservation>(POP_COLLECTIONS.observations),
      this.listCollection<PopulationAlert>(POP_COLLECTIONS.alerts),
      this.listCollection<ScreeningProgramme>(POP_COLLECTIONS.programmes),
      this.listCollection<CareReferralItem>(POP_COLLECTIONS.referrals),
      this.listCollection<GovernanceAuditLog>(POP_COLLECTIONS.auditLogs),
      this.getDocument<{
        demoActive?: boolean;
        kThreshold?: number;
        seededComplete?: boolean;
        alertRules?: AlertRuleConfig[];
        engagementTemplates?: EngagementTemplate[];
        aiSyntheses?: AiResearchSynthesisResult[];
      }>(POP_COLLECTIONS.config, 'default'),
    ]);

    const hasAnyData = participants.length > 0 || configDoc !== null;
    if (!hasAnyData) return null;

    auditLogs.sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
    observations.sort((a, b) => String(b.recordedAt).localeCompare(String(a.recordedAt)));

    return {
      demoActive: configDoc?.demoActive ?? true,
      kThreshold: typeof configDoc?.kThreshold === 'number' ? configDoc.kThreshold : 5,
      seededComplete: Boolean(configDoc?.seededComplete),
      participants,
      consents,
      observations,
      riskSignals: [],
      alerts,
      alertRules: Array.isArray(configDoc?.alertRules) ? configDoc.alertRules : [],
      programmes,
      referrals,
      engagementTemplates: Array.isArray(configDoc?.engagementTemplates)
        ? configDoc.engagementTemplates
        : [],
      auditLogs: auditLogs.slice(0, 250),
      aiSyntheses: Array.isArray(configDoc?.aiSyntheses) ? configDoc.aiSyntheses : [],
    };
  }

  public async syncSnapshot(
    snapshot: FirestorePersistedStateSnapshot,
    options?: { deletedParticipantIds?: string[]; deleteOrphanedNonAuditDocs?: boolean }
  ): Promise<void> {
    const runBatched = async <T>(items: T[], worker: (item: T) => Promise<void>, chunkSize = 8) => {
      for (let i = 0; i < items.length; i += chunkSize) {
        await Promise.all(items.slice(i, i + chunkSize).map((item) => worker(item)));
      }
    };

    const upsertAll = async <T extends { id: string }>(col: string, items: T[]) => {
      await runBatched(items, (item) =>
        this.upsertDocument(col, item.id, item as unknown as Record<string, unknown>)
      );
    };

    await Promise.all([
      upsertAll(POP_COLLECTIONS.participants, snapshot.participants),
      upsertAll(POP_COLLECTIONS.consents, snapshot.consents),
      upsertAll(POP_COLLECTIONS.observations, snapshot.observations),
      upsertAll(POP_COLLECTIONS.alerts, snapshot.alerts),
      upsertAll(POP_COLLECTIONS.programmes, snapshot.programmes),
      upsertAll(POP_COLLECTIONS.referrals, snapshot.referrals),
    ]);

    // Audit logs are strictly append-only (never updated or deleted).
    await runBatched(snapshot.auditLogs.slice(0, 40), (log) =>
      this.createImmutableDocument(
        POP_COLLECTIONS.auditLogs,
        log.id,
        log as unknown as Record<string, unknown>
      )
    );

    if (options?.deletedParticipantIds?.length) {
      await runBatched(options.deletedParticipantIds, (pid) =>
        this.deleteDocument(POP_COLLECTIONS.participants, pid)
      );
    }

    await this.upsertDocument(POP_COLLECTIONS.config, 'default', {
      demoActive: snapshot.demoActive,
      kThreshold: snapshot.kThreshold,
      seededComplete: true,
      alertRules: snapshot.alertRules,
      engagementTemplates: snapshot.engagementTemplates,
      aiSyntheses: snapshot.aiSyntheses.slice(0, 25),
      updatedAt: new Date().toISOString(),
    });

    if (options?.deleteOrphanedNonAuditDocs) {
      const cleanupMissing = async (col: string, activeIds: Set<string>) => {
        const remote = await this.listCollection<{ id: string }>(col);
        for (const r of remote) {
          if (!activeIds.has(r.id)) {
            await this.deleteDocument(col, r.id);
          }
        }
      };
      await Promise.all([
        cleanupMissing(
          POP_COLLECTIONS.participants,
          new Set(snapshot.participants.map((x) => x.id))
        ),
        cleanupMissing(
          POP_COLLECTIONS.observations,
          new Set(snapshot.observations.map((x) => x.id))
        ),
        cleanupMissing(POP_COLLECTIONS.alerts, new Set(snapshot.alerts.map((x) => x.id))),
        cleanupMissing(POP_COLLECTIONS.programmes, new Set(snapshot.programmes.map((x) => x.id))),
        cleanupMissing(POP_COLLECTIONS.referrals, new Set(snapshot.referrals.map((x) => x.id))),
      ]);
    }
  }
}
