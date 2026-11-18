// ============================================================================
// DR. T — CLIENT FIREBASE RUNTIME CONFIGURATION RESOLVER
// Fail-closed resolver: reads VITE_* build-time environment variables and
// restricts firebase-applet-config.json strictly to explicit development builds.
// ============================================================================

import {
  resolveAndValidateClientFirebaseConfig,
  type ClientRuntimeEnv,
  type DevFirebaseConfigShape,
  type ResolvedClientFirebaseConfig,
} from './clientFirebaseValidation';

export type { ClientRuntimeEnv, ResolvedClientFirebaseConfig };

declare const __DRT_DEV_FIREBASE_CONFIG__: DevFirebaseConfigShape | null | undefined;

function resolveClientConfig(): ResolvedClientFirebaseConfig {
  const env = (import.meta as any).env || {};
  const injectedDevConfig =
    typeof __DRT_DEV_FIREBASE_CONFIG__ !== 'undefined' ? __DRT_DEV_FIREBASE_CONFIG__ : null;

  return resolveAndValidateClientFirebaseConfig(env, {
    viteMode: String(env.MODE || 'production'),
    devFallbackConfig: injectedDevConfig,
  });
}

export const firebaseRuntimeConfig = resolveClientConfig();
