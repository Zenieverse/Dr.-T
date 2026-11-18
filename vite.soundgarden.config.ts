// ============================================================================
// DEDICATED PUBLIC JUDGING VITE CONFIG — PIANIST: THE LIVING SOUND GARDEN
// Produces a minimal, self-contained static WebXR bundle in `dist-soundgarden/`
// with fail-closed `public_judging` validation, zero Firebase SDK, zero server
// secrets, and zero unrelated Dr. T public assets.
// ============================================================================

import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { validateSoundGardenPublicBuildEnv } from './src/config/soundGardenPublicValidation';

function promoteSoundGardenHtmlToIndex(outDirAbs: string): Plugin {
  return {
    name: 'drt-soundgarden-index-entrypoint',
    closeBundle() {
      const generatedHtml = path.join(outDirAbs, 'sound-garden.html');
      const indexHtml = path.join(outDirAbs, 'index.html');
      if (fs.existsSync(generatedHtml)) {
        fs.renameSync(generatedHtml, indexHtml);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), 'VITE_');
  const mergedEnv: Record<string, string | undefined> = {
    ...fileEnv,
    ...process.env,
  };

  // Fail-closed validation: requires VITE_RUNTIME_ENV=public_judging,
  // VITE_SYNTHETIC_ONLY=true, zero env mismatch, zero dev DB/project, zero placeholders.
  const validated = validateSoundGardenPublicBuildEnv(mergedEnv);
  const outDirAbs = path.resolve(process.cwd(), 'dist-soundgarden');

  const rawBase = (mergedEnv.VITE_SOUNDGARDEN_BASE || '/').trim();
  const normalizedBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  if (!/^\/([A-Za-z0-9._-]+\/)*$/.test(normalizedBase)) {
    throw new Error(
      `[Living Sound Garden Public Build BLOCKED] Invalid VITE_SOUNDGARDEN_BASE='${rawBase}'. Expected a root-relative path such as '/' or '/Dr.-T/'.`
    );
  }

  return {
    base: normalizedBase,
    // CRITICAL: Exclude unrelated Dr. T /public artifacts (datasets, PDFs, portraits)
    publicDir: false,
    // Restrict exposed env prefix so accidental VITE_FIREBASE_* keys never leak into client JS
    envPrefix: 'VITE_SOUNDGARDEN_',
    plugins: [
      react(),
      tailwindcss(),
      promoteSoundGardenHtmlToIndex(outDirAbs),
    ],
    define: {
      __DRT_DEV_FIREBASE_CONFIG__: 'null',
      'import.meta.env.VITE_RUNTIME_ENV': JSON.stringify(validated.environment),
      'import.meta.env.VITE_SYNTHETIC_ONLY': JSON.stringify('true'),
    },
    build: {
      outDir: 'dist-soundgarden',
      emptyOutDir: true,
      sourcemap: false,
      target: 'es2022',
      rollupOptions: {
        input: path.resolve(process.cwd(), 'sound-garden.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three')) return 'three-vendor';
            if (
              id.includes('node_modules/react') ||
              id.includes('node_modules/lucide-react')
            ) {
              return 'ui-vendor';
            }
            return undefined;
          },
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: false,
    },
  };
});
