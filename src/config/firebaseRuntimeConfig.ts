// ============================================================================
// DR. T — CLIENT FIREBASE RUNTIME CONFIGURATION RESOLVER
// Reads VITE_* build-time environment variables for staging/production/judging
// and preserves firebase-applet-config.json exclusively for development builds.
// ============================================================================

import devFirebaseConfig from '../../firebase-applet-config.json';

const DEV_DATABASE_ID = 'ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2';

export type ClientRuntimeEnv =
  | 'development'
  | 'staging'
  | 'production'
  | 'public_judging';

export interface ResolvedClientFirebaseConfig {
  environment: ClientRuntimeEnv;
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  messagingSenderId: string;
}

function resolveClientConfig(): ResolvedClientFirebaseConfig {
  const env = (import.meta as any).env || {};
  const rawEnv = String(env.VITE_RUNTIME_ENV || 'development')
    .trim()
    .toLowerCase();
  const environment: ClientRuntimeEnv =
    rawEnv === 'production' ||
    rawEnv === 'staging' ||
    rawEnv === 'public_judging'
      ? (rawEnv as ClientRuntimeEnv)
      : 'development';

  const envProjectId = String(env.VITE_FIREBASE_PROJECT_ID || '').trim();
  const envDatabaseId = String(env.VITE_FIRESTORE_DATABASE_ID || '').trim();

  if (environment !== 'development') {
    if (!envProjectId || !envDatabaseId) {
      throw new Error(
        `[Dr. T Client Config] VITE_RUNTIME_ENV=${environment} requires explicit VITE_FIREBASE_PROJECT_ID and VITE_FIRESTORE_DATABASE_ID (cannot fall back to dev firebase-applet-config.json).`
      );
    }
    if (envDatabaseId === DEV_DATABASE_ID) {
      throw new Error(
        `[Dr. T Client Config] VITE_RUNTIME_ENV=${environment} cannot target the development Firestore database (${DEV_DATABASE_ID}).`
      );
    }
    return {
      environment,
      projectId: envProjectId,
      firestoreDatabaseId: envDatabaseId,
      appId: String(env.VITE_FIREBASE_APP_ID || devFirebaseConfig.appId || ''),
      apiKey: String(env.VITE_FIREBASE_API_KEY || devFirebaseConfig.apiKey || ''),
      authDomain: String(env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`),
      storageBucket: String(
        env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.firebasestorage.app`
      ),
      messagingSenderId: String(
        env.VITE_FIREBASE_MESSAGING_SENDER_ID || devFirebaseConfig.messagingSenderId || ''
      ),
    };
  }

  return {
    environment: 'development',
    projectId: envProjectId || devFirebaseConfig.projectId,
    firestoreDatabaseId: envDatabaseId || devFirebaseConfig.firestoreDatabaseId,
    appId: String(env.VITE_FIREBASE_APP_ID || devFirebaseConfig.appId),
    apiKey: String(env.VITE_FIREBASE_API_KEY || devFirebaseConfig.apiKey),
    authDomain: String(env.VITE_FIREBASE_AUTH_DOMAIN || devFirebaseConfig.authDomain),
    storageBucket: String(env.VITE_FIREBASE_STORAGE_BUCKET || devFirebaseConfig.storageBucket),
    messagingSenderId: String(
      env.VITE_FIREBASE_MESSAGING_SENDER_ID || devFirebaseConfig.messagingSenderId
    ),
  };
}

export const firebaseRuntimeConfig = resolveClientConfig();
