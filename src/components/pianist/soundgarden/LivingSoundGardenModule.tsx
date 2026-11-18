import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Download,
  Flower2,
  Hand,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
  Wind,
  X,
} from 'lucide-react';
import {
  BOTANICAL_SPECIES,
  GARDEN_PRESETS,
  GARDEN_SCALES,
  MAX_NOTE_DEGREE,
  SCALE_LIST,
  SPECIES_LIST,
  clamp,
  getOrbNoteLabel,
  instantiatePresetOrbs,
  loadSavedGardens,
  noteDegreeToElevation,
  saveGardenSnapshot,
  serializeGardenSnapshot,
  validateAndDeserializeGardenSnapshot,
} from './musicTheory';
import { LivingSoundGardenEngine } from './LivingSoundGardenEngine';
import {
  CameraPresetId,
  GardenEngineSnapshot,
  GardenMode,
  SavedGardenSnapshot,
  ScaleId,
  SkyMoodId,
  SoundOrb,
  SoundSpeciesId,
} from './types';

export interface LivingSoundGardenModuleProps {
  initialPresetId?: string;
  onOpenTouchGrass?: () => void;
  embedded?: boolean;
  standalone?: boolean;
}

const DEFAULT_SNAPSHOT: GardenEngineSnapshot = {
  isPlaying: true,
  currentStep: 0,
  bloomLevel: 0.18,
  bloomDwellProgress: 0,
  crescendoActive: false,
  handLift: 0.25,
  handSpread: 0.3,
  audioState: 'uninitialized',
  xrSupported: false,
  xrActive: false,
  xrSessionState: 'unsupported',
  xrHandCount: 0,
  xrControllerCount: 0,
  xrTrackingStatus: 'inactive',
  webcamActive: false,
  webcamPaused: false,
  webcamError: null,
  reducedMotion: false,
  isSoftwareGl: false,
  hoveredPreview: null,
  contextLost: false,
};

export const LivingSoundGardenModule: React.FC<LivingSoundGardenModuleProps> = ({
  initialPresetId,
  onOpenTouchGrass,
  embedded = false,
  standalone = false,
}) => {
  const initialPreset = useMemo(
    () =>
      GARDEN_PRESETS.find((p) => p.id === initialPresetId) ?? GARDEN_PRESETS[0],
    [initialPresetId]
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const engineRef = useRef<LivingSoundGardenEngine | null>(null);

  const [orbs, setOrbs] = useState<SoundOrb[]>(() =>
    instantiatePresetOrbs(initialPreset)
  );
  const [selectedOrbId, setSelectedOrbId] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>(initialPreset.id);
  const [mode, setMode] = useState<GardenMode>('plant');
  const [activeSpecies, setActiveSpecies] = useState<SoundSpeciesId>('bellflower');
  const [scaleId, setScaleId] = useState<ScaleId>(initialPreset.scale);
  const [bpm, setBpm] = useState<number>(initialPreset.bpm);
  const [skyMood, setSkyMood] = useState<SkyMoodId>(initialPreset.skyMood);
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('sanctuary');
  const [muted, setMuted] = useState<boolean>(false);
  const [ambienceOn, setAmbienceOn] = useState<boolean>(false);
  const [controlsOpen, setControlsOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [vrNotice, setVrNotice] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [savedGardens, setSavedGardens] = useState<SavedGardenSnapshot[]>(() =>
    loadSavedGardens()
  );
  const [snapshot, setSnapshot] = useState<GardenEngineSnapshot>(DEFAULT_SNAPSHOT);
  const [rendererError, setRendererError] = useState<string | null>(null);

  // Refs for stable single-mount WebGL lifecycle
  const initialOrbsRef = useRef(orbs);
  const initialScaleRef = useRef(scaleId);
  const initialBpmRef = useRef(bpm);
  const initialSkyRef = useRef(skyMood);

  // Mount Three.js + WebXR engine exactly once
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    let engine: LivingSoundGardenEngine | null = null;
    try {
      engine = new LivingSoundGardenEngine(
        mount,
        initialOrbsRef.current,
        initialScaleRef.current,
        initialBpmRef.current,
        initialSkyRef.current,
        {
          onOrbsChange: (nextOrbs) => setOrbs(nextOrbs),
          onSelectOrb: (id) => setSelectedOrbId(id),
          onSnapshot: (nextSnap) => setSnapshot(nextSnap),
        }
      );
      engineRef.current = engine;
      setRendererError(null);
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Unable to initialize WebGL renderer.';
      setRendererError(detail);
      engineRef.current = null;
    }

    return () => {
      engine?.dispose();
      engineRef.current = null;
    };
  }, []);

  // Keyboard shortcuts: Space = hold Bloom Crescendo, H = toggle control dock, 1/2/3 = modes
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const tag = (ev.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      if (ev.code === 'Space' && !ev.repeat) {
        ev.preventDefault();
        engineRef.current?.triggerBloomCrescendo(true, false);
      } else if (ev.key === 'Escape') {
        setVrNotice(null);
        setSavedNotice(null);
      } else if (ev.key === 'h' || ev.key === 'H') {
        setControlsOpen((prev) => !prev);
      } else if (ev.key === '1') {
        setMode('plant');
        engineRef.current?.setMode('plant');
      } else if (ev.key === '2') {
        setMode('sculpt');
        engineRef.current?.setMode('sculpt');
      } else if (ev.key === '3') {
        setMode('conduct');
        engineRef.current?.setMode('conduct');
      }
    };

    const onKeyUp = (ev: KeyboardEvent) => {
      if (ev.code === 'Space') {
        engineRef.current?.triggerBloomCrescendo(false, false);
      }
    };

    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, []);

  const selectedOrb = useMemo(
    () => orbs.find((o) => o.id === selectedOrbId) ?? null,
    [orbs, selectedOrbId]
  );

  const handleModeChange = useCallback((nextMode: GardenMode) => {
    setMode(nextMode);
    engineRef.current?.setMode(nextMode);
    if (nextMode === 'conduct') {
      engineRef.current?.flyToCameraPreset('podium');
      setCameraPreset('podium');
    }
  }, []);

  const handleSpeciesChange = useCallback((species: SoundSpeciesId) => {
    setActiveSpecies(species);
    engineRef.current?.setSpecies(species);
  }, []);

  const handleScaleChange = useCallback((nextScale: ScaleId) => {
    setScaleId(nextScale);
    engineRef.current?.setScale(nextScale);
  }, []);

  const handleBpmChange = useCallback((nextBpm: number) => {
    const safe = clamp(Math.round(nextBpm), 48, 160);
    setBpm(safe);
    engineRef.current?.setBpm(safe);
  }, []);

  const handleSkyMoodChange = useCallback((nextMood: SkyMoodId) => {
    setSkyMood(nextMood);
    engineRef.current?.setSkyMood(nextMood);
  }, []);

  const handleCameraPreset = useCallback((preset: CameraPresetId) => {
    setCameraPreset(preset);
    engineRef.current?.flyToCameraPreset(preset);
  }, []);

  const handleTogglePlay = useCallback(() => {
    engineRef.current?.setPlaying(!snapshot.isPlaying);
  }, [snapshot.isPlaying]);

  const handleToggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    engineRef.current?.setMuted(next);
  }, [muted]);

  const handleToggleAmbience = useCallback(() => {
    const next = !ambienceOn;
    setAmbienceOn(next);
    engineRef.current?.setAmbienceEnabled(next);
  }, [ambienceOn]);

  const handleToggleBloomFinale = useCallback(() => {
    const next = !snapshot.crescendoActive;
    if (next && mode !== 'conduct') {
      setMode('conduct');
      engineRef.current?.setMode('conduct');
    }
    engineRef.current?.triggerBloomCrescendo(next, true);
  }, [snapshot.crescendoActive, mode]);

  const handleLoadPreset = useCallback((presetId: string) => {
    const preset = GARDEN_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const nextOrbs = instantiatePresetOrbs(preset);
    setActivePresetId(preset.id);
    setScaleId(preset.scale);
    setBpm(preset.bpm);
    setSkyMood(preset.skyMood);
    setOrbs(nextOrbs);
    setSelectedOrbId(null);
    engineRef.current?.setScale(preset.scale);
    engineRef.current?.setBpm(preset.bpm);
    engineRef.current?.setSkyMood(preset.skyMood);
    engineRef.current?.setOrbs(nextOrbs);
    engineRef.current?.setSelectedOrb(null);
    engineRef.current?.setPlaying(true);
  }, []);

  const handleClearGarden = useCallback(() => {
    setActivePresetId('custom');
    setOrbs([]);
    setSelectedOrbId(null);
    engineRef.current?.setOrbs([]);
    engineRef.current?.setSelectedOrb(null);
    engineRef.current?.triggerBloomCrescendo(false, true);
  }, []);

  const updateSelectedOrb = useCallback(
    (updater: (orb: SoundOrb) => SoundOrb) => {
      if (!selectedOrbId) return;
      setOrbs((prev) => {
        const next = prev.map((o) => (o.id === selectedOrbId ? updater(o) : o));
        engineRef.current?.setOrbs(next);
        return next;
      });
    },
    [selectedOrbId]
  );

  const handleRemoveSelectedOrb = useCallback(() => {
    if (!selectedOrbId) return;
    setOrbs((prev) => {
      const next = prev.filter((o) => o.id !== selectedOrbId);
      engineRef.current?.setOrbs(next);
      return next;
    });
    setSelectedOrbId(null);
    engineRef.current?.setSelectedOrb(null);
  }, [selectedOrbId]);

  const handleSaveGarden = useCallback(() => {
    const activePreset = GARDEN_PRESETS.find((p) => p.id === activePresetId);
    const label = activePreset
      ? `${activePreset.name} (${orbs.length} orbs)`
      : `Garden · ${GARDEN_SCALES[scaleId].name}`;
    const snap: SavedGardenSnapshot = {
      id: `garden-${Date.now().toString(36)}`,
      name: label,
      savedAt: new Date().toISOString(),
      scale: scaleId,
      bpm,
      skyMood,
      orbs,
    };
    const list = saveGardenSnapshot(snap);
    setSavedGardens(list);
    setSavedNotice('Garden saved locally');
    window.setTimeout(() => setSavedNotice(null), 2400);
  }, [activePresetId, bpm, orbs, scaleId, skyMood]);

  const handleLoadSavedGarden = useCallback(
    (id: string) => {
      const found = savedGardens.find((g) => g.id === id);
      if (!found) return;
      setActivePresetId('custom');
      setScaleId(found.scale);
      setBpm(found.bpm);
      setSkyMood(found.skyMood);
      setOrbs(found.orbs);
      setSelectedOrbId(null);
      engineRef.current?.setScale(found.scale);
      engineRef.current?.setBpm(found.bpm);
      engineRef.current?.setSkyMood(found.skyMood);
      engineRef.current?.setOrbs(found.orbs);
      engineRef.current?.setSelectedOrb(null);
    },
    [savedGardens]
  );

  const handleExportGarden = useCallback(() => {
    const payload = serializeGardenSnapshot({
      id: `export-${Date.now().toString(36)}`,
      name: `PIANIST Living Sound Garden (${GARDEN_SCALES[scaleId].name})`,
      savedAt: new Date().toISOString(),
      scale: scaleId,
      bpm,
      skyMood,
      orbs,
    });
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `living-sound-garden-${scaleId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [bpm, orbs, scaleId, skyMood]);

  const handleImportGardenFile = useCallback(
    async (ev: React.ChangeEvent<HTMLInputElement>) => {
      const file = ev.target.files?.[0];
      ev.target.value = '';
      if (!file) return;
      try {
        const text = await file.text();
        const result = validateAndDeserializeGardenSnapshot(text);
        if (!result.ok || !result.snapshot) {
          setVrNotice(result.error ?? 'Invalid Living Sound Garden JSON file.');
          return;
        }
        const loaded = result.snapshot;
        setActivePresetId('custom');
        setScaleId(loaded.scale);
        setBpm(loaded.bpm);
        setSkyMood(loaded.skyMood);
        setOrbs(loaded.orbs);
        setSelectedOrbId(null);
        engineRef.current?.setScale(loaded.scale);
        engineRef.current?.setBpm(loaded.bpm);
        engineRef.current?.setSkyMood(loaded.skyMood);
        engineRef.current?.setOrbs(loaded.orbs);
        engineRef.current?.setSelectedOrb(null);
        const list = saveGardenSnapshot(loaded);
        setSavedGardens(list);
        setVrNotice(null);
        setSavedNotice(`Imported "${loaded.name}" (${loaded.orbs.length} orbs)`);
        window.setTimeout(() => setSavedNotice(null), 3000);
      } catch {
        setVrNotice('Could not read the selected JSON file.');
      }
    },
    []
  );

  const handleToggleVR = useCallback(async () => {
    const res = await engineRef.current?.toggleVRSession();
    if (res && !res.started && res.message) {
      setVrNotice(res.message);
    } else {
      setVrNotice(null);
    }
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    if (!rootRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await rootRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore fullscreen denial in restricted iframe contexts
    }
  }, []);

  const scaleSpec = GARDEN_SCALES[scaleId];
  const bloomPercent = Math.round(snapshot.bloomLevel * 100);
  const stepLabel = String(snapshot.currentStep + 1).padStart(2, '0');

  return (
    <section
      ref={rootRef}
      className={`relative w-full overflow-hidden bg-[#0c1411] text-[#f3ecdc] select-none ${
        standalone
          ? 'h-[100dvh] min-h-[560px]'
          : embedded
            ? 'h-[calc(100vh-11rem)] min-h-[620px] rounded-2xl border border-[#e3d5b2]/15'
            : 'h-[calc(100vh-4rem)] min-h-[620px]'
      }`}
      aria-label="PIANIST — The Living Sound Garden spatial music workspace"
    >
      {/* Dedicated empty Three.js WebGL / WebXR mount container */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" />

      {/* Graceful WebGL unavailable or context-lost fallback */}
      {(rendererError || snapshot.contextLost) && (
        <div
          role="alert"
          className="absolute inset-0 z-30 flex items-center justify-center bg-[#0c1411]/95 px-6 text-center"
        >
          <div className="max-w-md space-y-3 border border-[#e3d5b2]/20 bg-[#131f1a] p-6 rounded-xl">
            <h2 className="text-lg font-serif text-[#f5ecd6]">
              {rendererError ? 'WebGL 3D graphics unavailable' : 'Graphics context paused'}
            </h2>
            <p className="text-sm text-[#c7c2b2]">
              {rendererError
                ? 'PIANIST — The Living Sound Garden requires WebGL to render the 3D botanical sanctuary. Enable hardware acceleration or open in Meta Quest Browser / a WebGL-capable browser.'
                : 'The 3D garden renderer lost its WebGL context. Reload or switch tabs to restore the living garden.'}
            </p>
            {rendererError && (
              <p className="text-xs font-mono text-[#9e9682] break-words">
                {rendererError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* TOP-LEFT MINIMAL HEADER & QUIET UNBOXED METADATA */}
      <div className="pointer-events-none absolute top-4 left-4 sm:top-5 sm:left-6 z-20 max-w-[68vw]">
        <div className="pointer-events-auto inline-block">
          <h1
            className="text-xl sm:text-2xl font-semibold tracking-tight text-[#fbf5e6] drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            PIANIST — The Living Sound Garden
          </h1>
          <p className="text-xs sm:text-sm text-[#e8dec5]/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] mt-0.5">
            Grow music with your hands
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-mono tabular-nums text-[#dfd6be]/85 drop-shadow-[0_1px_5px_rgba(0,0,0,0.75)]">
            <span>{scaleSpec.name}</span>
            <span className="opacity-45">·</span>
            <span>{bpm} BPM</span>
            <span className="opacity-45">·</span>
            <span>{orbs.length} Orbs</span>
            <span className="opacity-45">·</span>
            <span>Step {stepLabel}/16</span>
            {snapshot.bloomLevel > 0.45 && (
              <>
                <span className="opacity-45">·</span>
                <span className="text-[#f8d787]">Bloom {bloomPercent}%</span>
              </>
            )}
            {snapshot.hoveredPreview && mode === 'plant' && (
              <>
                <span className="opacity-45">·</span>
                <span className="text-[#ffe4a0]">
                  Plant {snapshot.hoveredPreview.noteName} (Step{' '}
                  {String(snapshot.hoveredPreview.step + 1).padStart(2, '0')})
                </span>
              </>
            )}
            {snapshot.xrActive ? (
              <>
                <span className="opacity-45">·</span>
                <span className="text-[#9ee8d1]">
                  {snapshot.xrTrackingStatus === 'hands'
                    ? `VR Active · ${snapshot.xrHandCount} ${snapshot.xrHandCount === 1 ? 'Hand' : 'Hands'}`
                    : snapshot.xrTrackingStatus === 'controllers'
                    ? `VR Active · ${snapshot.xrControllerCount} ${snapshot.xrControllerCount === 1 ? 'Controller' : 'Controllers'}`
                    : snapshot.xrTrackingStatus === 'lost'
                    ? 'Hand tracking paused — raise hands into view'
                    : 'VR Active'}
                </span>
              </>
            ) : snapshot.xrSessionState === 'requesting' ? (
              <>
                <span className="opacity-45">·</span>
                <span className="text-[#f8d787]">Starting VR…</span>
              </>
            ) : snapshot.xrSupported ? (
              <>
                <span className="opacity-45">·</span>
                <span className="text-[#9ee8d1]">Meta Quest WebXR Ready</span>
              </>
            ) : null}
            {snapshot.bloomDwellProgress > 0.05 && !snapshot.crescendoActive && (
              <>
                <span className="opacity-45">·</span>
                <span className="text-[#ffe4a0]">
                  Bloom charging {Math.round(snapshot.bloomDwellProgress * 100)}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* TOP-RIGHT PRIMARY ACTIONS (AUDIO UNLOCK + SIGNATURE BLOOM + ENTER VR + FULLSCREEN) */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-20 flex flex-wrap items-center justify-end gap-2">
        {snapshot.audioState !== 'running' && !muted && (
          <button
            type="button"
            onClick={() => engineRef.current?.unlockAudio()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#192c24]/95 hover:bg-[#213a30] border border-[#9ee8d1]/45 text-xs font-medium text-[#d7f7ec] transition whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c]"
          >
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <span>Enable Spatial Sound</span>
          </button>
        )}

        {onOpenTouchGrass && (
          <button
            type="button"
            onClick={onOpenTouchGrass}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0d1713]/90 hover:bg-[#16251f] border border-[#e3d5b2]/20 text-xs font-medium text-[#e5dcc6] transition whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c]"
          >
            <span>Touch Grass</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleToggleBloomFinale}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap shrink-0 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c] ${
            snapshot.crescendoActive
              ? 'bg-[#e8bd68] text-[#111914] border-[#fae0a5] shadow-[0_0_24px_rgba(232,189,104,0.45)]'
              : 'bg-[#101c17]/92 hover:bg-[#192c24] text-[#f6dd9c] border-[#e8bd68]/45'
          }`}
          title="Conduct the full living sound garden bloom (or hold Space)"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{snapshot.crescendoActive ? 'Blooming' : 'Conduct Bloom'}</span>
        </button>

        <button
          type="button"
          onClick={handleToggleVR}
          disabled={snapshot.xrSessionState === 'requesting'}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap shrink-0 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c] disabled:opacity-65 disabled:cursor-wait ${
            snapshot.xrActive
              ? 'bg-[#6fd1b4] text-[#0c1613] border-[#a8f0da]'
              : 'bg-[#0d1713]/90 hover:bg-[#16251f] text-[#e7dfcb] border-[#e3d5b2]/22'
          }`}
          title="Enter Meta Quest WebXR with native hand tracking"
        >
          <Hand className="w-3.5 h-3.5 shrink-0" />
          <span>
            {snapshot.xrSessionState === 'requesting'
              ? 'Starting VR…'
              : snapshot.xrActive
              ? 'Exit VR'
              : 'Enter VR'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="p-2 rounded-lg bg-[#0d1713]/90 hover:bg-[#16251f] border border-[#e3d5b2]/20 text-[#e5dcc6] transition shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c]"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ALWAYS-VISIBLE LOCAL-ONLY CAMERA PRIVACY BAR (VISIBLE EVEN WHEN DOCK IS COLLAPSED) */}
      {snapshot.webcamActive && (
        <div
          role="status"
          className="absolute top-16 left-4 sm:left-6 z-20 inline-flex items-center gap-2 rounded-lg border border-[#78cfb3]/45 bg-[#0c1713]/95 px-3 py-1.5 text-xs text-[#dcf5ec] shadow-md"
        >
          <Camera className="w-3.5 h-3.5 text-[#78cfb3] shrink-0" />
          <span className="font-medium">
            {snapshot.webcamPaused
              ? 'Camera Paused (Local Only)'
              : 'Camera Active (Local Only)'}
          </span>
          <button
            type="button"
            onClick={() => engineRef.current?.toggleWebcamPause()}
            className="px-2 py-0.5 rounded bg-[#182c24] hover:bg-[#223d32] border border-[#78cfb3]/30 text-[11px] text-[#e7f8f2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c]"
          >
            {snapshot.webcamPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button"
            onClick={() => engineRef.current?.stopWebcamNow()}
            className="px-2 py-0.5 rounded bg-[#2d1a17] hover:bg-[#3e2420] border border-[#e0896b]/40 text-[11px] text-[#f4bfb0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c]"
          >
            Stop
          </button>
        </div>
      )}

      {/* Inline non-blocking Meta Quest VR / Save / Webcam toast */}
      {(vrNotice || savedNotice || snapshot.webcamError) && (
        <div
          role="alert"
          className="absolute top-16 right-4 sm:right-6 z-20 max-w-sm rounded-lg border border-[#e3d5b2]/25 bg-[#0d1713]/95 px-3.5 py-2.5 text-xs text-[#ece4d0] flex items-start gap-2.5 shadow-lg"
        >
          <div className="flex-1 leading-relaxed">
            {vrNotice || snapshot.webcamError || savedNotice}
          </div>
          <button
            type="button"
            onClick={() => {
              setVrNotice(null);
              setSavedNotice(null);
            }}
            className="text-[#c4baa2] hover:text-white shrink-0 mt-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c]"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* COLLAPSIBLE BOTTOM CONTROL DOCK (ZERO BACKDROP-BLUR OVER WEBGL) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-24px)] max-w-[960px] flex flex-col items-center">
        {/* Compact collapse toggle tab */}
        <button
          type="button"
          onClick={() => setControlsOpen((prev) => !prev)}
          className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0b1310]/92 hover:bg-[#13201b] border border-[#e3d5b2]/18 text-[11px] font-medium text-[#dfd6be] transition whitespace-nowrap"
          title="Toggle controls (H)"
        >
          {controlsOpen ? (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Hide Controls</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show Controls</span>
            </>
          )}
        </button>

        {controlsOpen && (
          <div className="w-full rounded-xl bg-[#0b1310]/92 border border-[#e3d5b2]/18 shadow-[0_14px_40px_rgba(0,0,0,0.55)] px-3.5 py-2.5 space-y-2">
            {/* ROW 1: MODES · TRANSPORT · TEMPO · SCALE · SKY · CAMERA */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Primary Interaction Modes */}
              <div className="inline-flex items-center rounded-lg bg-[#14211c] p-0.5 border border-[#e3d5b2]/12">
                {(
                  [
                    { id: 'plant', label: 'Plant', icon: Flower2 },
                    { id: 'sculpt', label: 'Sculpt', icon: SlidersHorizontal },
                    { id: 'conduct', label: 'Conduct', icon: Hand },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  const active = mode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleModeChange(item.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#e6be6c] text-[#111914] font-semibold'
                          : 'text-[#d8d0bc] hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Transport & Musical Controls */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#162620] hover:bg-[#1f342c] border border-[#e3d5b2]/18 text-xs font-medium text-[#f5eedc] transition whitespace-nowrap shrink-0"
                >
                  {snapshot.isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="p-1.5 rounded-lg bg-[#162620] hover:bg-[#1f342c] border border-[#e3d5b2]/15 text-[#dfd6be] transition shrink-0"
                  aria-label={muted ? 'Unmute audio' : 'Mute audio'}
                  title={muted ? 'Unmute' : 'Mute'}
                >
                  {muted ? (
                    <VolumeX className="w-3.5 h-3.5 text-[#e69a82]" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* BPM Stepper */}
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#14211c] border border-[#e3d5b2]/12 text-xs font-mono tabular-nums">
                  <button
                    type="button"
                    onClick={() => handleBpmChange(bpm - 4)}
                    className="px-1 text-[#c9c0aa] hover:text-white"
                    aria-label="Decrease tempo"
                  >
                    −
                  </button>
                  <span className="min-w-[54px] text-center text-[#f3ead5]">
                    {bpm} BPM
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBpmChange(bpm + 4)}
                    className="px-1 text-[#c9c0aa] hover:text-white"
                    aria-label="Increase tempo"
                  >
                    +
                  </button>
                </div>

                {/* Scale Selector */}
                <select
                  value={scaleId}
                  onChange={(e) => handleScaleChange(e.target.value as ScaleId)}
                  aria-label="Musical scale"
                  className="px-2 py-1.5 rounded-lg bg-[#14211c] border border-[#e3d5b2]/15 text-xs text-[#f0e8d4] focus:outline-none focus:border-[#e6be6c]"
                >
                  {SCALE_LIST.map((sc) => (
                    <option key={sc.id} value={sc.id} className="bg-[#0e1714]">
                      {sc.name}
                    </option>
                  ))}
                </select>

                {/* Sky Mood */}
                <select
                  value={skyMood}
                  onChange={(e) =>
                    handleSkyMoodChange(e.target.value as SkyMoodId)
                  }
                  aria-label="Garden sky atmosphere"
                  className="px-2 py-1.5 rounded-lg bg-[#14211c] border border-[#e3d5b2]/15 text-xs text-[#f0e8d4] focus:outline-none focus:border-[#e6be6c]"
                >
                  <option value="golden-dawn" className="bg-[#0e1714]">
                    Golden Dawn
                  </option>
                  <option value="sunlit-meadow" className="bg-[#0e1714]">
                    Sunlit Meadow
                  </option>
                  <option value="twilight-glow" className="bg-[#0e1714]">
                    Twilight Glow
                  </option>
                </select>

                {/* Camera Presets */}
                <div className="hidden sm:inline-flex items-center rounded-lg bg-[#14211c] p-0.5 border border-[#e3d5b2]/12">
                  {(
                    [
                      { id: 'sanctuary', label: 'Sanctuary' },
                      { id: 'podium', label: 'Podium' },
                      { id: 'aerial', label: 'Aerial' },
                      { id: 'blossom', label: 'Blossom' },
                    ] as const
                  ).map((cam) => (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => handleCameraPreset(cam.id)}
                      className={`px-2 py-1 rounded text-[11px] transition whitespace-nowrap shrink-0 ${
                        cameraPreset === cam.id
                          ? 'bg-[#253b32] text-[#f7e2a8] font-medium'
                          : 'text-[#bdb49d] hover:text-white'
                      }`}
                    >
                      {cam.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ROW 2: CONTEXT-SPECIFIC HANDS-FIRST TOOLING */}
            <div className="pt-2 border-t border-[#e3d5b2]/10 flex flex-wrap items-center justify-between gap-2">
              {mode === 'plant' && (
                <>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {SPECIES_LIST.map((sp) => {
                      const active = activeSpecies === sp.id;
                      return (
                        <button
                          key={sp.id}
                          type="button"
                          onClick={() => handleSpeciesChange(sp.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition whitespace-nowrap shrink-0 border ${
                            active
                              ? 'bg-[#1c2e26] border-[#e6be6c]/70 text-[#fdf7e8] font-medium'
                              : 'bg-[#121e19] border-[#e3d5b2]/12 text-[#cfc7b2] hover:text-white'
                          }`}
                          title={`${sp.name} — ${sp.timbreSummary}`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: sp.accentColor }}
                          />
                          <span>{sp.shortName}</span>
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[11px] text-[#c5bca6]">
                    Click the stone clearing to plant a{' '}
                    <span className="text-[#f3e6c4]">
                      {BOTANICAL_SPECIES[activeSpecies].name}
                    </span>
                  </span>
                </>
              )}

              {mode === 'sculpt' && (
                <>
                  {selectedOrb ? (
                    <div className="flex flex-wrap items-center gap-2 text-xs w-full justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor:
                              BOTANICAL_SPECIES[selectedOrb.species].accentColor,
                          }}
                        />
                        <span className="font-medium text-[#f8f0dc]">
                          {BOTANICAL_SPECIES[selectedOrb.species].shortName}
                        </span>
                        <span className="font-mono tabular-nums text-[#f0cf82]">
                          {getOrbNoteLabel(selectedOrb, scaleId)}
                        </span>
                        <span className="font-mono tabular-nums text-[#b8b09b]">
                          Step {String(selectedOrb.step + 1).padStart(2, '0')}/16
                        </span>

                        {/* Quick Pitch Steps */}
                        <div className="inline-flex items-center rounded-md bg-[#14211c] border border-[#e3d5b2]/15">
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedOrb((o) => {
                                const deg = clamp(
                                  o.noteDegree - 1,
                                  0,
                                  MAX_NOTE_DEGREE
                                );
                                return {
                                  ...o,
                                  noteDegree: deg,
                                  elevation: noteDegreeToElevation(deg),
                                };
                              })
                            }
                            className="px-2 py-0.5 text-xs hover:text-white text-[#d5ccb6]"
                            title="Lower pitch one scale step"
                          >
                            Pitch −
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedOrb((o) => {
                                const deg = clamp(
                                  o.noteDegree + 1,
                                  0,
                                  MAX_NOTE_DEGREE
                                );
                                return {
                                  ...o,
                                  noteDegree: deg,
                                  elevation: noteDegreeToElevation(deg),
                                };
                              })
                            }
                            className="px-2 py-0.5 text-xs hover:text-white text-[#d5ccb6] border-l border-[#e3d5b2]/12"
                            title="Raise pitch one scale step"
                          >
                            Pitch +
                          </button>
                        </div>

                        {/* Sustain Slider */}
                        <label className="inline-flex items-center gap-1.5 text-[11px] text-[#c7bfa8]">
                          <span>Sustain</span>
                          <input
                            type="range"
                            min={0.25}
                            max={1}
                            step={0.05}
                            value={selectedOrb.sustain}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateSelectedOrb((o) => ({ ...o, sustain: val }));
                            }}
                            className="w-20 accent-[#e6be6c]"
                          />
                        </label>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedOrb((o) => ({
                              ...o,
                              muted: !o.muted,
                            }))
                          }
                          className="px-2.5 py-1 rounded-md bg-[#162620] hover:bg-[#1f342c] border border-[#e3d5b2]/15 text-[11px] text-[#e5dcc6] whitespace-nowrap"
                        >
                          {selectedOrb.muted ? 'Unmute Orb' : 'Mute Orb'}
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveSelectedOrb}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#2a1916] hover:bg-[#3a221d] border border-[#e0896b]/35 text-[11px] text-[#f3b5a0] whitespace-nowrap"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-wrap items-center justify-between gap-2 text-xs text-[#cfc7b2]">
                      <span>
                        Drag any sound orb up or down to shape pitch, or horizontally around the ring to shift its beat.
                      </span>
                      <span className="text-[11px] text-[#a79f8b]">
                        Select a flower to edit sustain or prune
                      </span>
                    </div>
                  )}
                </>
              )}

              {mode === 'conduct' && (
                <div className="w-full flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 text-[11px] text-[#ded6c0]">
                      <span>Garden Bloom</span>
                      <div className="w-28 h-2 rounded-full bg-[#1a2b24] overflow-hidden border border-[#e3d5b2]/15">
                        <div
                          className="h-full bg-[#e8be6a] transition-all duration-100"
                          style={{ width: `${bloomPercent}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-[#f6d98c] w-8">
                        {bloomPercent}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => engineRef.current?.toggleWebcamConducting()}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition whitespace-nowrap ${
                        snapshot.webcamActive
                          ? 'bg-[#6fd1b4] text-[#0c1613] border-[#a5efda] font-semibold'
                          : 'bg-[#14211c] hover:bg-[#1e322a] text-[#e5dcc6] border-[#e3d5b2]/18'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>
                        {snapshot.webcamActive
                          ? 'Stop Webcam Hands'
                          : 'Webcam Conduct'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleAmbience}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition whitespace-nowrap ${
                        ambienceOn
                          ? 'bg-[#213b31] text-[#bcead7] border-[#78cfb3]/45'
                          : 'bg-[#14211c] hover:bg-[#1e322a] text-[#d6ceb9] border-[#e3d5b2]/15'
                      }`}
                    >
                      <Wind className="w-3.5 h-3.5" />
                      <span>Meadow Breeze</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-[#c5bca6]">
                    Lift hands to swell dynamics · Hold pointer or Space to unfurl the full garden
                  </span>
                </div>
              )}
            </div>

            {/* ROW 3: TOUCH GRASS SEED PRESETS & GARDEN SAVE/LOAD */}
            <div className="pt-2 border-t border-[#e3d5b2]/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[#9e9682] mr-0.5">Touch Grass Seeds:</span>
                {GARDEN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleLoadPreset(preset.id)}
                    className={`px-2.5 py-1 rounded-md transition whitespace-nowrap shrink-0 border ${
                      activePresetId === preset.id
                        ? 'bg-[#1f332a] border-[#e6be6c]/55 text-[#f7e7bf]'
                        : 'bg-[#121d18] border-[#e3d5b2]/12 text-[#c8c0aa] hover:text-white'
                    }`}
                    title={preset.subtitle}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {savedGardens.length > 0 && (
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) handleLoadSavedGarden(e.target.value);
                    }}
                    aria-label="Load saved garden"
                    className="px-2 py-1 rounded-md bg-[#121d18] border border-[#e3d5b2]/15 text-[11px] text-[#dfd6be]"
                  >
                    <option value="" disabled className="bg-[#0e1714]">
                      Saved ({savedGardens.length})
                    </option>
                    {savedGardens.map((g) => (
                      <option key={g.id} value={g.id} className="bg-[#0e1714]">
                        {g.name}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  type="button"
                  onClick={handleSaveGarden}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#14211c] hover:bg-[#1d3029] border border-[#e3d5b2]/15 text-[#e5dcc6] transition whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c]"
                >
                  <Save className="w-3 h-3" />
                  <span>Save</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportGarden}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#14211c] hover:bg-[#1d3029] border border-[#e3d5b2]/15 text-[#e5dcc6] transition whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c]"
                  title="Download composition JSON"
                >
                  <Download className="w-3 h-3" />
                  <span>Export</span>
                </button>

                <input
                  ref={importInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportGardenFile}
                  className="hidden"
                  aria-label="Import composition JSON file"
                />
                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#14211c] hover:bg-[#1d3029] border border-[#e3d5b2]/15 text-[#e5dcc6] transition whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c]"
                  title="Import validated Living Sound Garden JSON"
                >
                  <Upload className="w-3 h-3" />
                  <span>Import</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearGarden}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#14211c] hover:bg-[#2a1c19] border border-[#e3d5b2]/15 text-[#d6ceb9] hover:text-[#f2b5a0] transition whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e6be6c]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LivingSoundGardenModule;
