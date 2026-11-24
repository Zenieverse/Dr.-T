// ============================================================================
// DR. T — HATBRIDGE CLIENT & FIRESTORE PERSISTENCE SERVICE
// Uses existing Firebase Auth + Firestore collections:
//   hatbridge_roles, hatbridge_context_items, hatbridge_handoffs,
//   hatbridge_decisions, hatbridge_reentry_briefs, hatbridge_preferences,
//   hatbridge_integrations, hatbridge_audit_events, hatbridge_time_blocks
// Safe browser fallback when user is signed out (explicitly marked local sandbox).
// ============================================================================

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../../services/firebase';
import {
  HatBridgeAuditEvent,
  HatBridgeContextItem,
  HatBridgeDecision,
  HatBridgeHandoff,
  HatBridgeIntegrationState,
  HatBridgePreferences,
  HatBridgeReentryBrief,
  HatBridgeRole,
  HatBridgeTimeBlock,
  HatBridgeWorkspaceBundle,
} from '../../../types/hatbridgeTypes';
import { DEFAULT_HATBRIDGE_PREFERENCES } from '../data/hatbridgeStarters';

export enum HatBridgeOperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleHatBridgeFirestoreError(
  error: unknown,
  operationType: HatBridgeOperationType,
  path: string | null
): never {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
    },
    operationType,
    path,
  };
  console.error('HatBridge Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const LOCAL_PREFIX = 'drt_hatbridge_v1_';

function getLocalKey(userId: string): string {
  return `${LOCAL_PREFIX}${userId}`;
}

export function createEmptyWorkspace(userId: string): HatBridgeWorkspaceBundle {
  const now = new Date().toISOString();
  return {
    roles: [],
    activeRoleId: '',
    contextItems: [],
    decisions: [],
    handoffs: [],
    reentryBriefs: [],
    timeBlocks: [],
    preferences: DEFAULT_HATBRIDGE_PREFERENCES(userId),
    integration: {
      userId,
      connectionMode: 'disconnected',
      siteUrl: '',
      jiraConnected: false,
      confluenceConnected: false,
      forgeAppInstalled: false,
      statusMessage: 'Not connected to a live Atlassian Cloud site. Install apps/hatbridge-forge or configure server credentials.',
      isDemoSandboxActive: false,
      updatedAt: now,
    },
    auditEvents: [],
    analytics: {
      reentryBriefsConfirmed: 0,
      handoffsCompleted: 0,
      averageResumeRating: null,
      followUpsTrackedCount: 0,
      aiSuggestionsAccepted: 0,
      aiCorrectionsRecorded: 0,
      contextSwitchingBurdenCheckIn: null,
      analyticsOptedIn: false,
    },
  };
}

function readLocalWorkspace(userId: string): HatBridgeWorkspaceBundle | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(getLocalKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as HatBridgeWorkspaceBundle;
  } catch {
    return null;
  }
}

function writeLocalWorkspace(userId: string, bundle: HatBridgeWorkspaceBundle): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(getLocalKey(userId), JSON.stringify(bundle));
  } catch {
    // ignore quota errors
  }
}

async function queryUserCollection<T>(collectionName: string, userId: string): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, any>) } as T));
  } catch (err) {
    handleHatBridgeFirestoreError(err, HatBridgeOperationType.LIST, collectionName);
  }
}

export class HatBridgeStorageService {
  static async loadWorkspace(userId: string): Promise<{
    bundle: HatBridgeWorkspaceBundle;
    storageBackend: 'firestore_cloud' | 'browser_local';
    warning?: string;
  }> {
    const localCached = readLocalWorkspace(userId) || createEmptyWorkspace(userId);
    const isSignedInOwner = Boolean(auth.currentUser && auth.currentUser.uid === userId);

    if (!isSignedInOwner) {
      return {
        bundle: localCached,
        storageBackend: 'browser_local',
      };
    }

    try {
      const [roles, contextItems, decisions, handoffs, reentryBriefs, timeBlocks, auditEvents, prefSnap, integSnap] =
        await Promise.all([
          queryUserCollection<HatBridgeRole>('hatbridge_roles', userId),
          queryUserCollection<HatBridgeContextItem>('hatbridge_context_items', userId),
          queryUserCollection<HatBridgeDecision>('hatbridge_decisions', userId),
          queryUserCollection<HatBridgeHandoff>('hatbridge_handoffs', userId),
          queryUserCollection<HatBridgeReentryBrief>('hatbridge_reentry_briefs', userId),
          queryUserCollection<HatBridgeTimeBlock>('hatbridge_time_blocks', userId),
          queryUserCollection<HatBridgeAuditEvent>('hatbridge_audit_events', userId),
          getDoc(doc(db, 'hatbridge_preferences', userId)),
          getDoc(doc(db, 'hatbridge_integrations', userId)),
        ]);

      const merged: HatBridgeWorkspaceBundle = {
        ...localCached,
        roles: roles.length > 0 ? roles.sort((a, b) => a.sortOrder - b.sortOrder) : localCached.roles,
        activeRoleId:
          localCached.activeRoleId ||
          (roles.find((r) => !r.archived)?.id ?? ''),
        contextItems: contextItems.length > 0 ? contextItems : localCached.contextItems,
        decisions: decisions.length > 0 ? decisions : localCached.decisions,
        handoffs: handoffs.length > 0 ? handoffs : localCached.handoffs,
        reentryBriefs: reentryBriefs.length > 0 ? reentryBriefs : localCached.reentryBriefs,
        timeBlocks: timeBlocks.length > 0 ? timeBlocks : localCached.timeBlocks,
        auditEvents:
          auditEvents.length > 0
            ? auditEvents.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 100)
            : localCached.auditEvents,
        preferences: prefSnap.exists()
          ? (prefSnap.data() as HatBridgePreferences)
          : localCached.preferences,
        integration: integSnap.exists()
          ? (integSnap.data() as HatBridgeIntegrationState)
          : localCached.integration,
      };
      writeLocalWorkspace(userId, merged);
      return { bundle: merged, storageBackend: 'firestore_cloud' };
    } catch (err) {
      return {
        bundle: localCached,
        storageBackend: 'browser_local',
        warning: err instanceof Error ? err.message : 'Firestore read unavailable; loaded local cache.',
      };
    }
  }

  static async upsertEntity<T extends { id: string; userId: string }>(
    collectionName:
      | 'hatbridge_roles'
      | 'hatbridge_context_items'
      | 'hatbridge_decisions'
      | 'hatbridge_handoffs'
      | 'hatbridge_reentry_briefs'
      | 'hatbridge_time_blocks',
    record: T,
    fullBundle: HatBridgeWorkspaceBundle
  ): Promise<void> {
    writeLocalWorkspace(record.userId, fullBundle);
    if (auth.currentUser && auth.currentUser.uid === record.userId) {
      try {
        await setDoc(doc(db, collectionName, record.id), record, { merge: true });
      } catch (err) {
        console.warn(`HatBridge Firestore upsert deferred (${collectionName}):`, err);
      }
    }
  }

  static async removeEntity(
    collectionName:
      | 'hatbridge_roles'
      | 'hatbridge_context_items'
      | 'hatbridge_decisions'
      | 'hatbridge_handoffs'
      | 'hatbridge_reentry_briefs'
      | 'hatbridge_time_blocks',
    id: string,
    userId: string,
    fullBundle: HatBridgeWorkspaceBundle
  ): Promise<void> {
    writeLocalWorkspace(userId, fullBundle);
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (err) {
        console.warn(`HatBridge Firestore delete deferred (${collectionName}):`, err);
      }
    }
  }

  static async savePreferences(prefs: HatBridgePreferences, fullBundle: HatBridgeWorkspaceBundle): Promise<void> {
    writeLocalWorkspace(prefs.userId, fullBundle);
    if (auth.currentUser && auth.currentUser.uid === prefs.userId) {
      try {
        await setDoc(doc(db, 'hatbridge_preferences', prefs.userId), prefs, { merge: true });
      } catch (err) {
        console.warn('HatBridge preferences sync error:', err);
      }
    }
  }

  static async saveIntegration(integ: HatBridgeIntegrationState, fullBundle: HatBridgeWorkspaceBundle): Promise<void> {
    writeLocalWorkspace(integ.userId, fullBundle);
    if (auth.currentUser && auth.currentUser.uid === integ.userId) {
      try {
        await setDoc(doc(db, 'hatbridge_integrations', integ.userId), integ, { merge: true });
      } catch (err) {
        console.warn('HatBridge integration sync error:', err);
      }
    }
  }

  static async appendAuditEvent(event: HatBridgeAuditEvent, fullBundle: HatBridgeWorkspaceBundle): Promise<void> {
    writeLocalWorkspace(event.userId, fullBundle);
    if (auth.currentUser && auth.currentUser.uid === event.userId) {
      try {
        await setDoc(doc(db, 'hatbridge_audit_events', event.id), event);
      } catch (err) {
        console.warn('HatBridge audit append note:', err);
      }
    }
  }

  static saveLocalSnapshot(userId: string, bundle: HatBridgeWorkspaceBundle): void {
    writeLocalWorkspace(userId, bundle);
  }

  static exportWorkspaceJson(bundle: HatBridgeWorkspaceBundle): string {
    return JSON.stringify(
      {
        exportSchema: 'drt-hatbridge/v1',
        exportedAt: new Date().toISOString(),
        privacyNotice: 'Exported directly by workspace owner. Contains zero clinical patient identifiers.',
        ...bundle,
      },
      null,
      2
    );
  }

  static async deleteAllUserHatBridgeData(userId: string): Promise<void> {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(getLocalKey(userId));
      }
    } catch {
      // ignore
    }

    if (auth.currentUser && auth.currentUser.uid === userId) {
      const collectionsToClear = [
        'hatbridge_roles',
        'hatbridge_context_items',
        'hatbridge_decisions',
        'hatbridge_handoffs',
        'hatbridge_reentry_briefs',
        'hatbridge_time_blocks',
      ] as const;

      for (const colName of collectionsToClear) {
        try {
          const rows = await queryUserCollection<{ id: string }>(colName, userId);
          await Promise.all(rows.map((r) => deleteDoc(doc(db, colName, r.id))));
        } catch (err) {
          console.warn(`Cleanup note for ${colName}:`, err);
        }
      }
      try {
        await deleteDoc(doc(db, 'hatbridge_preferences', userId));
        await deleteDoc(doc(db, 'hatbridge_integrations', userId));
      } catch {
        // ignore
      }
    }
  }
}
