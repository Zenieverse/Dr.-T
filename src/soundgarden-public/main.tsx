// ============================================================================
// PIANIST — THE LIVING SOUND GARDEN: STANDALONE PUBLIC WEBXR ENTRYPOINT
// Renders strictly the spatial WebXR Living Sound Garden module in complete
// isolation: zero Firebase SDK, zero backend APIs, zero unrelated Dr. T modules.
// ============================================================================

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LivingSoundGardenModule } from '../components/pianist/soundgarden/LivingSoundGardenModule';

const CANONICAL_HASH = '#living-sound-garden';
const ACCEPTED_ALIASES = new Set([
  '',
  'living-sound-garden',
  'sound-garden',
  'soundgarden',
  'livingsoundgarden',
]);

function normalizePublicSoundGardenHash(): void {
  try {
    if (typeof window === 'undefined') return;
    const rawHash = window.location.hash
      .replace(/^#\/?/, '')
      .replace(/\/$/, '')
      .split(/[?&]/)[0]
      .trim()
      .toLowerCase();

    if (ACCEPTED_ALIASES.has(rawHash) && window.location.hash !== CANONICAL_HASH) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${CANONICAL_HASH}`);
    }
  } catch {
    // Ignore history API restrictions in unusual browser contexts
  }
}

const StandaloneLivingSoundGardenApp: React.FC = () => {
  useEffect(() => {
    normalizePublicSoundGardenHash();
  }, []);

  return (
    <main className="w-screen h-[100dvh] overflow-hidden bg-[#0c1411]">
      <LivingSoundGardenModule standalone />
    </main>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <StandaloneLivingSoundGardenApp />
    </React.StrictMode>
  );
}
