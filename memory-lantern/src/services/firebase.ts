// ============================================================================
// MEMORY LANTERN — STANDALONE FIREBASE CLIENT ADAPTER
// Graceful fallback to browser localStorage if Firebase is unconfigured
// ============================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

try {
  // If FIREBASE_CONFIG is present in environment or window, initialize real Firebase
  const config = (typeof window !== 'undefined' && (window as any).__FIREBASE_CONFIG__) 
    || process.env.FIREBASE_CONFIG 
    ? JSON.parse(process.env.FIREBASE_CONFIG || '{}')
    : null;

  if (config && config.projectId) {
    const app = !getApps().length ? initializeApp(config) : getApp();
    dbInstance = getFirestore(app);
    authInstance = getAuth(app);
  }
} catch {
  // Safe offline fallback
}

export const db: Firestore | null = dbInstance;
export const auth: Auth | null = authInstance;
