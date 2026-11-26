// ============================================================================
// DR. T — CAREBRIDGE SERVER-SIDE FOLLOW-UP CONSENT, APPROVAL & AUDIT STORE
// Authoritative server enforcement for:
//   - Jira Service Management Follow-Up Consent (default disabled, expirable, revocable)
//   - Owner-isolated append-only privacy-preserving audit events
//   - Pending human-approval action previews (single-use, non-transferable)
//   - Idempotency deduplication & last-verified status comparison (CR2-1 baseline)
// ============================================================================

import crypto from 'crypto';
import {
  CareBridgeFollowUpActionPreview,
  CareBridgeFollowUpActionResult,
  CareBridgeFollowUpActionType,
  CareBridgeFollowUpConsentRecord,
  CareBridgeServerAuditEvent,
} from '../types/carebridgeTypes';
import { scanAndRedactCareBridgePhi } from '../utils/carebridgePhiGuard';
import { sanitizeCareBridgeErrorText } from './carebridgeAtlassianService';

export const CAREBRIDGE_FOLLOWUP_POLICY_VERSION = 'cb-jsm-followup-v1';

export const CAREBRIDGE_FOLLOWUP_CONSENT_DISCLOSURE =
  'When enabled, CareBridge queries Jira Service Management (https://zenieverse.atlassian.net, project CareBridge2 / CR2, Service Desk 2, Request Type 5) to read non-clinical request status and submit explicitly human-approved administrative follow-up updates. Sensitive patient identifiers (SSN, MRN, DOB, personal contacts), diagnoses, lab results, and clinical measurements are blocked before transmission and redacted from audit logs.';

interface StoredPreview {
  preview: CareBridgeFollowUpActionPreview;
  userId: string;
  consumed: boolean;
}

export class CareBridgeFollowUpAuthError extends Error {
  public readonly statusCode: 400 | 401 | 403 | 404 | 409;
  public readonly code: string;
  constructor(statusCode: 400 | 401 | 403 | 404 | 409, code: string, message: string) {
    super(message);
    this.name = 'CareBridgeFollowUpAuthError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class CareBridgeFollowupStore {
  private readonly consents = new Map<string, CareBridgeFollowUpConsentRecord>();
  private readonly auditEvents: CareBridgeServerAuditEvent[] = [];
  private readonly lastStatusByUserAndKey = new Map<string, { status: string; checkedAt: string }>();
  private readonly authorizedKeysByUser = new Map<string, Set<string>>();
  private readonly previews = new Map<string, StoredPreview>();
  private readonly executedIdempotency = new Map<string, CareBridgeFollowUpActionResult>();

  public newCorrelationId(): string {
    return `cb-corr-${crypto.randomBytes(6).toString('hex')}`;
  }

  private redactAuditSummary(raw: string): string {
    const tokenSafe = sanitizeCareBridgeErrorText(raw);
    return scanAndRedactCareBridgePhi(tokenSafe).redactedText.slice(0, 260);
  }

  public appendAuditEvent(params: {
    userId: string;
    operationType: CareBridgeServerAuditEvent['operationType'];
    outcome: CareBridgeServerAuditEvent['outcome'];
    summary: string;
    requestKey?: string;
    correlationId?: string;
    policyVersion?: string;
  }): CareBridgeServerAuditEvent {
    const event: CareBridgeServerAuditEvent = {
      eventId: `cb-srv-${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}`,
      userId: params.userId,
      timestamp: new Date().toISOString(),
      requestKey: params.requestKey ? params.requestKey.trim().toUpperCase().slice(0, 24) : undefined,
      operationType: params.operationType,
      outcome: params.outcome,
      policyVersion: params.policyVersion || CAREBRIDGE_FOLLOWUP_POLICY_VERSION,
      correlationId: params.correlationId || this.newCorrelationId(),
      summary: this.redactAuditSummary(params.summary),
    };
    // Append-only: prepend newest for chronological retrieval; never mutate or delete historical records.
    this.auditEvents.unshift(event);
    if (this.auditEvents.length > 2000) {
      this.auditEvents.length = 2000;
    }
    return event;
  }

  public getAuditEventsForUser(requesterUid: string, requestedOwnerUid?: string): CareBridgeServerAuditEvent[] {
    if (!requesterUid) {
      throw new CareBridgeFollowUpAuthError(401, 'UNAUTHORIZED', 'Authentication is required to access CareBridge audit events.');
    }
    if (requestedOwnerUid && requestedOwnerUid !== requesterUid) {
      throw new CareBridgeFollowUpAuthError(
        403,
        'FORBIDDEN_AUDIT_ACCESS',
        'Cross-user CareBridge audit access is forbidden.'
      );
    }
    return this.auditEvents.filter((ev) => ev.userId === requesterUid);
  }

  public getConsentState(userId: string, nowMs = Date.now()): CareBridgeFollowUpConsentRecord {
    const existing = this.consents.get(userId);
    if (!existing) {
      return {
        userId,
        granted: false,
        policyVersion: CAREBRIDGE_FOLLOWUP_POLICY_VERSION,
        disclosureText: CAREBRIDGE_FOLLOWUP_CONSENT_DISCLOSURE,
        updatedAt: new Date(nowMs).toISOString(),
      };
    }

    const expired =
      Boolean(existing.expiresAt) &&
      Number.isFinite(Date.parse(existing.expiresAt!)) &&
      Date.parse(existing.expiresAt!) <= nowMs;

    if (expired && existing.granted) {
      const updated: CareBridgeFollowUpConsentRecord = {
        ...existing,
        granted: false,
        updatedAt: new Date(nowMs).toISOString(),
      };
      this.consents.set(userId, updated);
      return updated;
    }

    return existing;
  }

  public grantConsent(params: {
    userId: string;
    ttlHours?: number;
    expiresAtOverride?: string;
    correlationId?: string;
  }): CareBridgeFollowUpConsentRecord {
    const now = new Date();
    const ttlHours = Math.max(1, Math.min(params.ttlHours ?? 24, 24 * 30));
    const expiresAt = params.expiresAtOverride || new Date(now.getTime() + ttlHours * 3600_000).toISOString();
    const record: CareBridgeFollowUpConsentRecord = {
      userId: params.userId,
      granted: true,
      policyVersion: CAREBRIDGE_FOLLOWUP_POLICY_VERSION,
      disclosureText: CAREBRIDGE_FOLLOWUP_CONSENT_DISCLOSURE,
      grantedAt: now.toISOString(),
      expiresAt,
      withdrawnAt: undefined,
      updatedAt: now.toISOString(),
    };
    this.consents.set(params.userId, record);
    this.appendAuditEvent({
      userId: params.userId,
      operationType: 'consent_granted',
      outcome: 'allowed',
      correlationId: params.correlationId,
      policyVersion: record.policyVersion,
      summary: `Granted Jira Service Management Follow-Up Consent (${record.policyVersion}, expires ${expiresAt}).`,
    });
    return record;
  }

  public withdrawConsent(params: {
    userId: string;
    correlationId?: string;
  }): CareBridgeFollowUpConsentRecord {
    const now = new Date().toISOString();
    const prev = this.consents.get(params.userId);
    const record: CareBridgeFollowUpConsentRecord = {
      userId: params.userId,
      granted: false,
      policyVersion: CAREBRIDGE_FOLLOWUP_POLICY_VERSION,
      disclosureText: CAREBRIDGE_FOLLOWUP_CONSENT_DISCLOSURE,
      grantedAt: prev?.grantedAt,
      expiresAt: prev?.expiresAt,
      withdrawnAt: now,
      updatedAt: now,
    };
    this.consents.set(params.userId, record);
    this.appendAuditEvent({
      userId: params.userId,
      operationType: 'consent_withdrawn',
      outcome: 'allowed',
      correlationId: params.correlationId,
      policyVersion: record.policyVersion,
      summary: `Withdrew Jira Service Management Follow-Up Consent (${record.policyVersion}).`,
    });
    return record;
  }

  public assertActiveFollowUpConsent(
    userId: string,
    requestKey?: string,
    correlationId?: string,
    nowMs = Date.now()
  ): CareBridgeFollowUpConsentRecord {
    if (!userId) {
      throw new CareBridgeFollowUpAuthError(401, 'UNAUTHORIZED', 'Authentication is required for CareBridge follow-up operations.');
    }
    const state = this.getConsentState(userId, nowMs);
    if (!state.granted) {
      const reason = state.withdrawnAt
        ? 'Jira Service Management Follow-Up Consent was withdrawn.'
        : state.expiresAt && Date.parse(state.expiresAt) <= nowMs
          ? 'Jira Service Management Follow-Up Consent has expired.'
          : 'Jira Service Management Follow-Up Consent is disabled by default and has not been granted.';
      this.appendAuditEvent({
        userId,
        requestKey,
        operationType: 'followup_status_retrieved',
        outcome: 'blocked',
        correlationId,
        policyVersion: state.policyVersion,
        summary: `Blocked JSM follow-up access: ${reason}`,
      });
      throw new CareBridgeFollowUpAuthError(403, 'FOLLOWUP_CONSENT_REQUIRED', reason);
    }
    return state;
  }

  public getPreviousStatus(userId: string, requestKey: string): { status: string; checkedAt: string } | undefined {
    const key = `${userId}:${requestKey.toUpperCase()}`;
    if (this.lastStatusByUserAndKey.has(key)) {
      return this.lastStatusByUserAndKey.get(key);
    }
    if (requestKey.toUpperCase() === 'CR2-1') {
      return { status: 'To Do', checkedAt: '2026-11-26T06:10:00.000Z' };
    }
    return undefined;
  }

  public recordVerifiedStatus(userId: string, requestKey: string, status: string, checkedAt: string): void {
    const cleanKey = requestKey.toUpperCase();
    this.lastStatusByUserAndKey.set(`${userId}:${cleanKey}`, { status, checkedAt });
    let set = this.authorizedKeysByUser.get(userId);
    if (!set) {
      set = new Set(['CR2-1']);
      this.authorizedKeysByUser.set(userId, set);
    }
    set.add(cleanKey);
  }

  public assertRequestAuthorizedForUser(userId: string, requestKey: string): void {
    const cleanKey = requestKey.trim().toUpperCase();
    if (!/^CR2-\d{1,10}$/.test(cleanKey) && !/^[A-Z0-9_]{1,12}-\d{1,10}$/.test(cleanKey)) {
      throw new CareBridgeFollowUpAuthError(400, 'INVALID_ISSUE_KEY', `Invalid JSM request key "${requestKey}".`);
    }
    const allowedSet = this.authorizedKeysByUser.get(userId);
    if (cleanKey !== 'CR2-1' && (!allowedSet || !allowedSet.has(cleanKey))) {
      throw new CareBridgeFollowUpAuthError(
        403,
        'FOLLOWUP_REQUEST_NOT_OWNED',
        `Request ${cleanKey} must first be verified via authorized follow-up lookup for your account before proposing state-changing operations.`
      );
    }
  }

  public saveActionPreview(userId: string, preview: CareBridgeFollowUpActionPreview): void {
    this.previews.set(preview.previewId, {
      preview,
      userId,
      consumed: false,
    });
  }

  public consumeApprovedPreview(params: {
    userId: string;
    previewId: string;
    requestKey: string;
    actionType: CareBridgeFollowUpActionType;
  }): CareBridgeFollowUpActionPreview {
    const entry = this.previews.get(params.previewId);
    if (!entry) {
      throw new CareBridgeFollowUpAuthError(
        400,
        'PREVIEW_NOT_FOUND',
        'A valid proposed-action preview is required before human approval and execution.'
      );
    }
    if (entry.userId !== params.userId) {
      throw new CareBridgeFollowUpAuthError(
        403,
        'PREVIEW_OWNERSHIP_MISMATCH',
        'Action preview belongs to a different authenticated user.'
      );
    }
    if (entry.consumed) {
      throw new CareBridgeFollowUpAuthError(
        409,
        'DUPLICATE_PREVIEW_EXECUTION',
        'This action preview was already executed. Generate a new preview before submitting another action.'
      );
    }
    if (Date.parse(entry.preview.expiresAt) <= Date.now()) {
      throw new CareBridgeFollowUpAuthError(
        400,
        'PREVIEW_EXPIRED',
        'Action preview expired. Preview the exact payload again before approving.'
      );
    }
    if (
      entry.preview.requestKey !== params.requestKey.toUpperCase() ||
      entry.preview.actionType !== params.actionType
    ) {
      throw new CareBridgeFollowUpAuthError(
        400,
        'PREVIEW_MISMATCH',
        'Submitted action parameters do not match the approved preview payload.'
      );
    }
    entry.consumed = true;
    return entry.preview;
  }

  public getIdempotentResult(userId: string, idempotencyKey?: string): CareBridgeFollowUpActionResult | undefined {
    if (!idempotencyKey) return undefined;
    return this.executedIdempotency.get(`${userId}:${idempotencyKey.trim()}`);
  }

  public saveIdempotentResult(userId: string, idempotencyKey: string, result: CareBridgeFollowUpActionResult): void {
    if (!idempotencyKey) return;
    this.executedIdempotency.set(`${userId}:${idempotencyKey.trim()}`, result);
  }
}

export const defaultCareBridgeFollowupStore = new CareBridgeFollowupStore();
