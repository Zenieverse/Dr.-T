// ============================================================================
// DR. T — CAREBRIDGE PERSISTENCE & OWNERSHIP SERVICE
// Stores CareBridge state under owner-isolated Firestore collections (`carebridge_*`)
// when signed in, and cleanly falls back to localStorage (`drt_carebridge_v1_<userId>`)
// when running offline or in guest mode. Never alters HatBridge collections.
// ============================================================================

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../../../services/firebase';
import {
  CareBridgeAuditEntry,
  CareBridgeConsentState,
  CareBridgeIntegrationState,
  CareBridgeReentryBrief,
  CareBridgeTask,
  CareBridgeWorkspaceBundle,
} from '../../../types/carebridgeTypes';
import { createEmptyCareWorkspace } from '../data/carebridgeStarters';

const LOCAL_STORAGE_PREFIX = 'drt_carebridge_v1_';

export const CAREBRIDGE_COLLECTIONS = {
  tasks: 'carebridge_tasks',
  briefs: 'carebridge_briefs',
  consents: 'carebridge_consents',
  integrations: 'carebridge_integrations',
  auditLogs: 'carebridge_audit_logs',
} as const;

export function getCareBridgeStorageOwner(): { userId: string; isAuthenticated: boolean } {
  const uid = auth?.currentUser?.uid;
  if (uid) {
    return { userId: uid, isAuthenticated: true };
  }
  return { userId: 'guest_local_carebridge', isAuthenticated: false };
}

function handleCareBridgeFirestoreError(error: unknown, operation: string, path: string): void {
  const errObj = {
    error: error instanceof Error ? error.message : String(error),
    operationType: operation,
    path,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
    },
  };
  console.warn('[CareBridge Firestore Warning]', JSON.stringify(errObj));
}

export async function loadCareBridgeWorkspace(): Promise<{
  bundle: CareBridgeWorkspaceBundle;
  storageMode: 'firestore' | 'local';
}> {
  const { userId, isAuthenticated } = getCareBridgeStorageOwner();
  const localRaw = typeof window !== 'undefined' ? window.localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${userId}`) : null;
  let localBundle: CareBridgeWorkspaceBundle | null = null;
  if (localRaw) {
    try {
      localBundle = JSON.parse(localRaw) as CareBridgeWorkspaceBundle;
    } catch {
      localBundle = null;
    }
  }

  if (!isAuthenticated || !db) {
    return {
      bundle: localBundle || createEmptyCareWorkspace(userId),
      storageMode: 'local',
    };
  }

  try {
    const [tasksSnap, briefsSnap, consentsSnap, integrationsSnap, auditSnap] = await Promise.all([
      getDocs(query(collection(db, CAREBRIDGE_COLLECTIONS.tasks), where('userId', '==', userId))),
      getDocs(query(collection(db, CAREBRIDGE_COLLECTIONS.briefs), where('userId', '==', userId))),
      getDocs(query(collection(db, CAREBRIDGE_COLLECTIONS.consents), where('userId', '==', userId))),
      getDocs(query(collection(db, CAREBRIDGE_COLLECTIONS.integrations), where('userId', '==', userId))),
      getDocs(query(collection(db, CAREBRIDGE_COLLECTIONS.auditLogs), where('userId', '==', userId))),
    ]);

    if (
      tasksSnap.empty &&
      briefsSnap.empty &&
      consentsSnap.empty &&
      integrationsSnap.empty &&
      auditSnap.empty &&
      localBundle
    ) {
      return { bundle: localBundle, storageMode: 'firestore' };
    }

    const base = createEmptyCareWorkspace(userId);
    const tasks = tasksSnap.docs.map((d) => d.data() as CareBridgeTask);
    const briefs = briefsSnap.docs
      .map((d) => d.data() as CareBridgeReentryBrief)
      .sort((a, b) => Date.parse(b.generatedAt) - Date.parse(a.generatedAt));
    const consents = (consentsSnap.docs[0]?.data() as CareBridgeConsentState | undefined) || base.consents;
    const integration =
      (integrationsSnap.docs[0]?.data() as CareBridgeIntegrationState | undefined) || base.integration;
    const auditLogs = auditSnap.docs
      .map((d) => d.data() as CareBridgeAuditEntry)
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

    return {
      bundle: {
        ...base,
        tasks: tasks.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)),
        latestBrief: briefs[0] || null,
        consents,
        integration,
        auditLogs: auditLogs.length > 0 ? auditLogs : base.auditLogs,
        linkedRequests: localBundle?.linkedRequests || [],
        knowledgePages: localBundle?.knowledgePages || [],
      },
      storageMode: 'firestore',
    };
  } catch (err) {
    handleCareBridgeFirestoreError(err, 'list', 'carebridge_*');
    return {
      bundle: localBundle || createEmptyCareWorkspace(userId),
      storageMode: 'local',
    };
  }
}

export async function saveCareBridgeWorkspace(bundle: CareBridgeWorkspaceBundle): Promise<'firestore' | 'local'> {
  const { userId, isAuthenticated } = getCareBridgeStorageOwner();
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${userId}`, JSON.stringify(bundle));
  }

  if (!isAuthenticated || !db) {
    return 'local';
  }

  try {
    const batch = writeBatch(db);
    for (const task of bundle.tasks.slice(0, 40)) {
      batch.set(doc(db, CAREBRIDGE_COLLECTIONS.tasks, task.id), { ...task, userId });
    }
    if (bundle.latestBrief) {
      batch.set(doc(db, CAREBRIDGE_COLLECTIONS.briefs, bundle.latestBrief.id), {
        ...bundle.latestBrief,
        userId,
      });
    }
    batch.set(doc(db, CAREBRIDGE_COLLECTIONS.consents, userId), {
      ...bundle.consents,
      userId,
    });
    batch.set(doc(db, CAREBRIDGE_COLLECTIONS.integrations, userId), {
      ...bundle.integration,
      userId,
    });
    // Audit logs are append-only/immutable per security rules; write newest entry only if missing
    if (bundle.auditLogs[0]) {
      batch.set(doc(db, CAREBRIDGE_COLLECTIONS.auditLogs, bundle.auditLogs[0].id), {
        ...bundle.auditLogs[0],
        userId,
      });
    }
    await batch.commit();
    return 'firestore';
  } catch (err) {
    handleCareBridgeFirestoreError(err, 'write', 'carebridge_*');
    return 'local';
  }
}

export async function deleteCareBridgeTaskFromStorage(taskId: string): Promise<void> {
  const { userId, isAuthenticated } = getCareBridgeStorageOwner();
  if (!isAuthenticated || !db) return;
  try {
    await deleteDoc(doc(db, CAREBRIDGE_COLLECTIONS.tasks, taskId));
  } catch (err) {
    handleCareBridgeFirestoreError(err, 'delete', `${CAREBRIDGE_COLLECTIONS.tasks}/${taskId}`);
  }
  void userId;
}

export async function purgeAllCareBridgeUserData(): Promise<CareBridgeWorkspaceBundle> {
  const { userId, isAuthenticated } = getCareBridgeStorageOwner();
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${userId}`);
  }

  if (isAuthenticated && db) {
    try {
      const [tasksSnap, briefsSnap, consentsSnap, integrationsSnap] = await Promise.all([
        getDocs(query(collection(db, CAREBRIDGE_COLLECTIONS.tasks), where('userId', '==', userId))),
        getDocs(query(collection(db, CAREBRIDGE_COLLECTIONS.briefs), where('userId', '==', userId))),
        getDocs(query(collection(db, CAREBRIDGE_COLLECTIONS.consents), where('userId', '==', userId))),
        getDocs(query(collection(db, CAREBRIDGE_COLLECTIONS.integrations), where('userId', '==', userId))),
      ]);
      const deletes: Promise<void>[] = [];
      tasksSnap.forEach((d) => deletes.push(deleteDoc(d.ref)));
      briefsSnap.forEach((d) => deletes.push(deleteDoc(d.ref)));
      consentsSnap.forEach((d) => deletes.push(deleteDoc(d.ref)));
      integrationsSnap.forEach((d) => deletes.push(deleteDoc(d.ref)));
      await Promise.all(deletes);
      // Note: carebridge_audit_logs remain immutable for compliance provenance; append deletion marker
      await setDoc(doc(db, CAREBRIDGE_COLLECTIONS.auditLogs, `cb-purge-${Date.now().toString(36)}`), {
        id: `cb-purge-${Date.now().toString(36)}`,
        userId,
        timestamp: new Date().toISOString(),
        category: 'privacy',
        action: 'user_data_deleted',
        outcome: 'allowed',
        summary: 'User deleted stored CareBridge tasks, briefs, consents, and integration records.',
        actorUid: userId,
      });
    } catch (err) {
      handleCareBridgeFirestoreError(err, 'delete', 'carebridge_purge');
    }
  }

  return createEmptyCareWorkspace(userId);
}
