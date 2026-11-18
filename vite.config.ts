import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {
  normalizeConfigEnvValue,
  resolveAndValidateClientFirebaseConfig,
  type DevFirebaseConfigShape,
} from './src/config/clientFirebaseValidation';

function readDevAppletConfig(): DevFirebaseConfigShape | null {
  try {
    const cfgPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (!fs.existsSync(cfgPath)) return null;
    return JSON.parse(fs.readFileSync(cfgPath, 'utf8')) as DevFirebaseConfigShape;
  } catch {
    return null;
  }
}

export default defineConfig(({ command, mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), 'VITE_');
  const mergedEnv = { ...fileEnv, ...process.env };

  // Also check if server runtime env was provided at build time and enforce agreement
  const explicitServerEnv = normalizeConfigEnvValue(
    'DRT_RUNTIME_ENV',
    mergedEnv.DRT_RUNTIME_ENV
  ).toLowerCase();
  const explicitClientEnv = normalizeConfigEnvValue(
    'VITE_RUNTIME_ENV',
    mergedEnv.VITE_RUNTIME_ENV
  ).toLowerCase();
  if (explicitServerEnv && explicitClientEnv && explicitServerEnv !== explicitClientEnv) {
    throw new Error(
      `[Dr. T Frontend Build BLOCKED] Environment mismatch: DRT_RUNTIME_ENV='${explicitServerEnv}' disagrees with VITE_RUNTIME_ENV='${explicitClientEnv}'.`
    );
  }

  const devFallbackConfig =
    explicitClientEnv === 'development' || (!explicitClientEnv && command === 'serve' && mode === 'development')
      ? readDevAppletConfig()
      : null;

  const resolvedClient = resolveAndValidateClientFirebaseConfig(
    {
      ...mergedEnv,
      MODE: mode,
      DEV: mode === 'development',
      PROD: mode === 'production',
    },
    {
      viteCommand: command,
      viteMode: mode,
      devFallbackConfig,
    }
  );

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      __DRT_DEV_FIREBASE_CONFIG__:
        resolvedClient.environment === 'development'
          ? JSON.stringify(devFallbackConfig)
          : 'null',
      'import.meta.env.VITE_RUNTIME_ENV': JSON.stringify(resolvedClient.environment),
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: false,
    },
  };
});
