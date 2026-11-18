import {
  ConductingMetrics,
  GardenPreset,
  HarmonicLink,
  SavedGardenSnapshot,
  ScaleId,
  ScaleSpec,
  SoundOrb,
  SoundSpeciesId,
  SoundSpeciesSpec,
} from './types';

export const TOTAL_STEPS = 16;
export const CLEARING_MIN_RADIUS = 1.65;
export const CLEARING_MAX_RADIUS = 6.55;
export const MIN_ELEVATION = 0.5;
export const MAX_ELEVATION = 3.15;
export const MAX_NOTE_DEGREE = 14;
export const STORAGE_KEY = 'drt_pianist_living_sound_garden_v1';

const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export const BOTANICAL_SPECIES: Record<SoundSpeciesId, SoundSpeciesSpec> = {
  bellflower: {
    id: 'bellflower',
    name: 'Dewdrop Bellflower',
    shortName: 'Bellflower',
    musicalRole: 'Crystalline Melody',
    timbreSummary: 'Acoustic piano & celesta harmonic bells',
    octaveOffset: 1,
    defaultElevation: 2.1,
    defaultSustain: 0.72,
    preferredRadius: 4.5,
    petalColor: '#e8d7a6',
    accentColor: '#f6d27a',
    orbColor: '#fff4cf',
    emissiveColor: '#f2c15a',
    stemColor: '#4c7554',
  },
  lotus: {
    id: 'lotus',
    name: 'Sunburst Lotus',
    shortName: 'Lotus',
    musicalRole: 'Warm Piano Harmony',
    timbreSummary: 'Grand piano chord bloom & golden warmth',
    octaveOffset: 0,
    defaultElevation: 1.45,
    defaultSustain: 0.85,
    preferredRadius: 3.1,
    petalColor: '#e0896b',
    accentColor: '#f3b78b',
    orbColor: '#ffe3c4',
    emissiveColor: '#e98952',
    stemColor: '#3f684b',
  },
  reed: {
    id: 'reed',
    name: 'Moss Lantern Reed',
    shortName: 'Moss Reed',
    musicalRole: 'Deep Root Pedal',
    timbreSummary: 'Wooden marimba resonance & cello-piano bass',
    octaveOffset: -1,
    defaultElevation: 0.85,
    defaultSustain: 0.92,
    preferredRadius: 2.3,
    petalColor: '#6d9b7c',
    accentColor: '#a6cca8',
    orbColor: '#d9f2d0',
    emissiveColor: '#6fb57d',
    stemColor: '#2f523a',
  },
  fern: {
    id: 'fern',
    name: 'Windchime Fern',
    shortName: 'Wind Fern',
    musicalRole: 'Cascading Arpeggio',
    timbreSummary: 'Shimmering harmonic chime ripples',
    octaveOffset: 1,
    defaultElevation: 2.45,
    defaultSustain: 0.78,
    preferredRadius: 5.5,
    petalColor: '#76b5b0',
    accentColor: '#a9ddd7',
    orbColor: '#dcfff9',
    emissiveColor: '#56c2b8',
    stemColor: '#35665d',
  },
  lily: {
    id: 'lily',
    name: 'Raindrop Lily',
    shortName: 'Rain Lily',
    musicalRole: 'Acoustic Pulse',
    timbreSummary: 'Pitched water-drop & soft wood percussion',
    octaveOffset: 0,
    defaultElevation: 1.25,
    defaultSustain: 0.48,
    preferredRadius: 3.9,
    petalColor: '#a89bd4',
    accentColor: '#d2c8f2',
    orbColor: '#efeaff',
    emissiveColor: '#9b86e0',
    stemColor: '#406055',
  },
};

export const SPECIES_LIST: SoundSpeciesSpec[] = [
  BOTANICAL_SPECIES.bellflower,
  BOTANICAL_SPECIES.lotus,
  BOTANICAL_SPECIES.reed,
  BOTANICAL_SPECIES.fern,
  BOTANICAL_SPECIES.lily,
];

export const GARDEN_SCALES: Record<ScaleId, ScaleSpec> = {
  'f-lydian': {
    id: 'f-lydian',
    name: 'F Lydian Dawn',
    mood: 'Radiant open sunrise',
    rootMidi: 53, // F3
    intervals: [0, 2, 4, 6, 7, 9, 11],
  },
  'c-pentatonic': {
    id: 'c-pentatonic',
    name: 'C Major Pentatonic',
    mood: 'Pure effortless harmony',
    rootMidi: 48, // C3
    intervals: [0, 2, 4, 7, 9],
  },
  'd-dorian': {
    id: 'd-dorian',
    name: 'D Dorian Meadow',
    mood: 'Breezy woodland rain',
    rootMidi: 50, // D3
    intervals: [0, 2, 3, 5, 7, 9, 10],
  },
  'a-minor-twilight': {
    id: 'a-minor-twilight',
    name: 'A Minor Twilight',
    mood: 'Contemplative evening hush',
    rootMidi: 45, // A2
    intervals: [0, 2, 3, 5, 7, 8, 10],
  },
  'g-mixolydian': {
    id: 'g-mixolydian',
    name: 'G Mixolydian Breeze',
    mood: 'Warm sun-dappled cadence',
    rootMidi: 55, // G3
    intervals: [0, 2, 4, 5, 7, 9, 10],
  },
};

export const SCALE_LIST: ScaleSpec[] = [
  GARDEN_SCALES['f-lydian'],
  GARDEN_SCALES['c-pentatonic'],
  GARDEN_SCALES['d-dorian'],
  GARDEN_SCALES['a-minor-twilight'],
  GARDEN_SCALES['g-mixolydian'],
];

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function elevationToNoteDegree(elevation: number): number {
  const t = clamp(
    (elevation - MIN_ELEVATION) / (MAX_ELEVATION - MIN_ELEVATION),
    0,
    1
  );
  return Math.round(t * MAX_NOTE_DEGREE);
}

export function noteDegreeToElevation(degree: number): number {
  const clamped = clamp(Math.round(degree), 0, MAX_NOTE_DEGREE);
  const t = clamped / MAX_NOTE_DEGREE;
  return Number((MIN_ELEVATION + t * (MAX_ELEVATION - MIN_ELEVATION)).toFixed(3));
}

export function degreeToMidi(
  scaleId: ScaleId,
  degree: number,
  octaveOffset = 0
): number {
  const scale = GARDEN_SCALES[scaleId] ?? GARDEN_SCALES['f-lydian'];
  const len = scale.intervals.length;
  const safeDegree = Math.max(0, Math.round(degree));
  const octave = Math.floor(safeDegree / len);
  const index = safeDegree % len;
  const raw = scale.rootMidi + (octave + octaveOffset) * 12 + scale.intervals[index];
  return clamp(raw, 36, 96);
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function midiToNoteName(midi: number): string {
  const safe = Math.round(midi);
  const pitchClass = ((safe % 12) + 12) % 12;
  const octave = Math.floor(safe / 12) - 1;
  return `${NOTE_NAMES[pitchClass]}${octave}`;
}

export function getOrbMidi(orb: Pick<SoundOrb, 'species' | 'noteDegree'>, scaleId: ScaleId): number {
  const spec = BOTANICAL_SPECIES[orb.species];
  return degreeToMidi(scaleId, orb.noteDegree, spec.octaveOffset);
}

export function getOrbNoteLabel(
  orb: Pick<SoundOrb, 'species' | 'noteDegree'>,
  scaleId: ScaleId
): string {
  return midiToNoteName(getOrbMidi(orb, scaleId));
}

/**
 * Converts (x, z) ground coordinates around the sanctuary center (0, 0)
 * into a 0..15 clockwise beat step starting at North (-Z).
 */
export function xzToRadialStep(x: number, z: number): number {
  // atan2(x, -z) yields 0 at North (0, -r), +PI/2 at East (+r, 0), PI at South (0, +r)
  let angle = Math.atan2(x, -z);
  if (angle < 0) angle += Math.PI * 2;
  const normalized = angle / (Math.PI * 2);
  return Math.round(normalized * TOTAL_STEPS) % TOTAL_STEPS;
}

export function stepToAngleRadians(step: number): number {
  const wrapped = ((step % TOTAL_STEPS) + TOTAL_STEPS) % TOTAL_STEPS;
  return (wrapped / TOTAL_STEPS) * Math.PI * 2;
}

export function radialStepToXZ(step: number, radius: number): { x: number; z: number } {
  const safeRadius = clamp(radius, CLEARING_MIN_RADIUS, CLEARING_MAX_RADIUS);
  const angle = stepToAngleRadians(step);
  return {
    x: Number((Math.sin(angle) * safeRadius).toFixed(3)),
    z: Number((-Math.cos(angle) * safeRadius).toFixed(3)),
  };
}

export function quantizeOrbPosition(
  rawX: number,
  rawZ: number,
  rawElevation: number
): {
  x: number;
  z: number;
  elevation: number;
  step: number;
  noteDegree: number;
} {
  const dist = Math.hypot(rawX, rawZ);
  const clampedRadius = clamp(dist < 0.05 ? 3.2 : dist, CLEARING_MIN_RADIUS, CLEARING_MAX_RADIUS);
  const step = xzToRadialStep(rawX, rawZ);
  // Allow subtle natural organic offset from exact spoke angle while preserving crisp beat slot
  const spokeAngle = stepToAngleRadians(step);
  const rawAngle = Math.atan2(rawX, -rawZ);
  let delta = rawAngle - spokeAngle;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  const maxStepArc = (Math.PI * 2) / TOTAL_STEPS;
  const softenedAngle = spokeAngle + clamp(delta, -maxStepArc * 0.28, maxStepArc * 0.28);

  const elevation = clamp(rawElevation, MIN_ELEVATION, MAX_ELEVATION);
  const noteDegree = elevationToNoteDegree(elevation);

  return {
    x: Number((Math.sin(softenedAngle) * clampedRadius).toFixed(3)),
    z: Number((-Math.cos(softenedAngle) * clampedRadius).toFixed(3)),
    elevation: Number(elevation.toFixed(3)),
    step,
    noteDegree,
  };
}

/**
 * Computes consonant harmonic pairs between unmuted orbs so glowing luminous
 * garden filaments weave musically coherent connections during playback and bloom.
 */
export function computeHarmonicLinks(orbs: SoundOrb[], scaleId: ScaleId): HarmonicLink[] {
  const active = orbs.filter((o) => !o.muted);
  const links: HarmonicLink[] = [];

  for (let i = 0; i < active.length; i++) {
    const a = active[i];
    const midiA = getOrbMidi(a, scaleId);
    for (let j = i + 1; j < active.length; j++) {
      const b = active[j];
      const midiB = getOrbMidi(b, scaleId);
      const semitones = Math.abs(midiA - midiB) % 12;
      const dist = Math.hypot(a.x - b.x, a.z - b.z);
      if (dist > 9.5) continue;

      if (semitones === 0 && midiA !== midiB) {
        links.push({ fromId: a.id, toId: b.id, consonance: 1.0, intervalLabel: 'octave' });
      } else if (semitones === 7 || semitones === 5) {
        links.push({ fromId: a.id, toId: b.id, consonance: 0.9, intervalLabel: 'fifth' });
      } else if (semitones === 4 || semitones === 3) {
        links.push({ fromId: a.id, toId: b.id, consonance: 0.72, intervalLabel: 'third' });
      }
    }
  }

  // Sort strongest consonant pairings first and cap to keep scene elegant & readable
  return links.sort((l1, l2) => l2.consonance - l1.consonance).slice(0, 22);
}

/**
 * Maps live spatial conducting gestures (hand lift, dual-hand spread, rubato nudge,
 * and full-bloom crescendo hold) into continuous musical and botanical parameters.
 */
export function computeConductingMetrics(
  baseBpm: number,
  handLift: number,
  handSpread: number,
  tempoNudge: number,
  crescendoActive: boolean
): ConductingMetrics {
  const lift = clamp(handLift, 0, 1);
  const spread = clamp(handSpread, 0, 1);
  const nudge = clamp(tempoNudge, -0.25, 0.25);

  const bloomLevel = crescendoActive
    ? clamp(0.86 + lift * 0.14, 0, 1)
    : clamp(lift * 0.68 + spread * 0.22, 0, 0.85);

  const dynamics = clamp(0.62 + lift * 0.52 + (crescendoActive ? 0.28 : 0), 0.55, 1.45);
  const brilliance = clamp(0.28 + lift * 0.52 + (crescendoActive ? 0.2 : 0), 0.2, 1.0);
  const reverbSend = clamp(0.24 + spread * 0.28 + bloomLevel * 0.22, 0.22, 0.74);
  const harmonyShimmer = clamp(spread * 0.5 + bloomLevel * 0.5, 0, 1);
  const effectiveBpm = Math.round(clamp(baseBpm * (1 + nudge), 48, 160));

  return {
    dynamics,
    bloomLevel,
    brilliance,
    reverbSend,
    harmonyShimmer,
    effectiveBpm,
  };
}

function makePresetOrb(
  species: SoundSpeciesId,
  step: number,
  radius: number,
  noteDegree: number,
  sustain?: number,
  velocity = 0.82
): Omit<SoundOrb, 'id' | 'plantedAt'> {
  const { x, z } = radialStepToXZ(step, radius);
  const spec = BOTANICAL_SPECIES[species];
  return {
    species,
    x,
    z,
    elevation: noteDegreeToElevation(noteDegree),
    step: ((step % TOTAL_STEPS) + TOTAL_STEPS) % TOTAL_STEPS,
    noteDegree: clamp(noteDegree, 0, MAX_NOTE_DEGREE),
    sustain: sustain ?? spec.defaultSustain,
    velocity,
    muted: false,
  };
}

export const GARDEN_PRESETS: GardenPreset[] = [
  {
    id: 'morning-robin',
    name: 'Morning Robin & Dew',
    subtitle: 'Luminous F Lydian sunrise meadow with drifting birdsong bells',
    touchGrassOrigin: 'Touch Grass · Morning Birdsong',
    scale: 'f-lydian',
    bpm: 88,
    skyMood: 'golden-dawn',
    orbs: [
      makePresetOrb('reed', 0, 2.2, 0, 0.94, 0.88),
      makePresetOrb('lotus', 0, 3.25, 4, 0.88, 0.82),
      makePresetOrb('bellflower', 2, 4.65, 9, 0.72, 0.78),
      makePresetOrb('lily', 3, 3.85, 7, 0.45, 0.65),
      makePresetOrb('lotus', 4, 3.1, 6, 0.86, 0.8),
      makePresetOrb('fern', 6, 5.55, 11, 0.8, 0.76),
      makePresetOrb('reed', 8, 2.35, 3, 0.94, 0.86),
      makePresetOrb('bellflower', 9, 4.8, 12, 0.74, 0.8),
      makePresetOrb('lily', 11, 4.0, 5, 0.48, 0.68),
      makePresetOrb('lotus', 12, 3.3, 2, 0.88, 0.82),
      makePresetOrb('fern', 14, 5.35, 10, 0.82, 0.75),
    ],
  },
  {
    id: 'rain-oak',
    name: 'Rain on Oak Leaves',
    subtitle: 'D Dorian rhythmic raindrop cadence & shimmering canopy ferns',
    touchGrassOrigin: 'Touch Grass · Raindrops on Leaves',
    scale: 'd-dorian',
    bpm: 78,
    skyMood: 'sunlit-meadow',
    orbs: [
      makePresetOrb('reed', 0, 2.25, 0, 0.92, 0.86),
      makePresetOrb('lily', 1, 3.7, 4, 0.42, 0.72),
      makePresetOrb('bellflower', 2, 4.7, 7, 0.7, 0.78),
      makePresetOrb('lily', 4, 3.9, 6, 0.44, 0.74),
      makePresetOrb('lotus', 4, 3.0, 2, 0.88, 0.82),
      makePresetOrb('fern', 6, 5.4, 9, 0.82, 0.76),
      makePresetOrb('lily', 7, 3.85, 5, 0.44, 0.68),
      makePresetOrb('reed', 8, 2.35, 4, 0.92, 0.84),
      makePresetOrb('bellflower', 10, 4.9, 11, 0.75, 0.8),
      makePresetOrb('lotus', 12, 3.2, 3, 0.86, 0.8),
      makePresetOrb('lily', 13, 3.95, 7, 0.45, 0.7),
      makePresetOrb('fern', 15, 5.6, 12, 0.8, 0.74),
    ],
  },
  {
    id: 'twilight-brook',
    name: 'Twilight Brook Nocturne',
    subtitle: 'A Minor reflective dusk sanctuary with glowing lantern reeds',
    touchGrassOrigin: 'Touch Grass · Quiet Brook',
    scale: 'a-minor-twilight',
    bpm: 68,
    skyMood: 'twilight-glow',
    orbs: [
      makePresetOrb('reed', 0, 2.15, 0, 0.96, 0.88),
      makePresetOrb('lotus', 0, 3.15, 4, 0.92, 0.82),
      makePresetOrb('fern', 3, 5.3, 9, 0.84, 0.72),
      makePresetOrb('bellflower', 4, 4.5, 7, 0.78, 0.78),
      makePresetOrb('lotus', 6, 3.3, 5, 0.88, 0.76),
      makePresetOrb('reed', 8, 2.25, 3, 0.96, 0.85),
      makePresetOrb('bellflower', 10, 4.85, 11, 0.8, 0.78),
      makePresetOrb('lily', 11, 3.8, 6, 0.5, 0.64),
      makePresetOrb('lotus', 12, 3.2, 2, 0.9, 0.8),
      makePresetOrb('fern', 14, 5.55, 8, 0.86, 0.74),
    ],
  },
];

export function instantiatePresetOrbs(preset: GardenPreset): SoundOrb[] {
  const now = Date.now();
  return preset.orbs.map((orb, idx) => ({
    ...orb,
    id: `orb-${preset.id}-${idx + 1}`,
    plantedAt: now - (preset.orbs.length - idx) * 120,
  }));
}

export function createOrbId(): string {
  return `orb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const MAX_SAVED_ORBS = 28;
export const MAX_SNAPSHOT_JSON_BYTES = 262144; // 256 KB guard

const FORBIDDEN_JSON_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export interface GardenSnapshotValidationResult {
  ok: boolean;
  snapshot: SavedGardenSnapshot | null;
  error?: string;
  warnings: string[];
}

function containsForbiddenKey(value: unknown, depth = 0): boolean {
  if (depth > 8 || value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) {
    return value.some((entry) => containsForbiddenKey(entry, depth + 1));
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_JSON_KEYS.has(key)) return true;
    if (containsForbiddenKey(record[key], depth + 1)) return true;
  }
  return false;
}

export function serializeGardenSnapshot(snapshot: SavedGardenSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

export function validateAndDeserializeGardenSnapshot(
  raw: string
): GardenSnapshotValidationResult {
  const warnings: string[] = [];

  if (typeof raw !== 'string' || !raw.trim()) {
    return { ok: false, snapshot: null, error: 'Snapshot JSON is empty.', warnings };
  }
  if (raw.length > MAX_SNAPSHOT_JSON_BYTES) {
    return {
      ok: false,
      snapshot: null,
      error: `Snapshot exceeds maximum size (${Math.round(MAX_SNAPSHOT_JSON_BYTES / 1024)} KB).`,
      warnings,
    };
  }
  if (/"(__proto__|constructor|prototype)"\s*:/.test(raw)) {
    return {
      ok: false,
      snapshot: null,
      error: 'Snapshot rejected: unsafe object key detected.',
      warnings,
    };
  }

  let parsedRaw: unknown;
  try {
    parsedRaw = JSON.parse(raw);
  } catch {
    return { ok: false, snapshot: null, error: 'Invalid JSON syntax.', warnings };
  }

  if (!parsedRaw || typeof parsedRaw !== 'object' || Array.isArray(parsedRaw)) {
    return { ok: false, snapshot: null, error: 'Snapshot root must be a JSON object.', warnings };
  }
  if (containsForbiddenKey(parsedRaw)) {
    return {
      ok: false,
      snapshot: null,
      error: 'Snapshot rejected: unsafe nested key detected.',
      warnings,
    };
  }

  const parsed = parsedRaw as Partial<SavedGardenSnapshot>;
  if (!Array.isArray(parsed.orbs)) {
    return { ok: false, snapshot: null, error: 'Snapshot is missing an orbs array.', warnings };
  }
  if (parsed.orbs.length > MAX_SAVED_ORBS) {
    return {
      ok: false,
      snapshot: null,
      error: `Snapshot exceeds maximum orb count (${MAX_SAVED_ORBS}).`,
      warnings,
    };
  }
  if (typeof parsed.scale !== 'string' || !(parsed.scale in GARDEN_SCALES)) {
    return { ok: false, snapshot: null, error: 'Snapshot specifies an unknown musical scale.', warnings };
  }
  if (parsed.bpm !== undefined && (typeof parsed.bpm !== 'number' || !Number.isFinite(parsed.bpm))) {
    return { ok: false, snapshot: null, error: 'Snapshot BPM must be a finite number.', warnings };
  }

  const validOrbs: SoundOrb[] = [];
  const seenOrbIds = new Set<string>();

  for (let i = 0; i < parsed.orbs.length; i++) {
    const item = parsed.orbs[i] as Partial<SoundOrb> | null | undefined;
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { ok: false, snapshot: null, error: `Orb entry #${i + 1} is not a valid object.`, warnings };
    }
    if (typeof item.species !== 'string' || !(item.species in BOTANICAL_SPECIES)) {
      return {
        ok: false,
        snapshot: null,
        error: `Orb entry #${i + 1} uses an unknown botanical species.`,
        warnings,
      };
    }
    if (
      typeof item.x !== 'number' ||
      !Number.isFinite(item.x) ||
      typeof item.z !== 'number' ||
      !Number.isFinite(item.z)
    ) {
      return {
        ok: false,
        snapshot: null,
        error: `Orb entry #${i + 1} has non-finite coordinates.`,
        warnings,
      };
    }
    if (
      item.elevation !== undefined &&
      (typeof item.elevation !== 'number' || !Number.isFinite(item.elevation))
    ) {
      return {
        ok: false,
        snapshot: null,
        error: `Orb entry #${i + 1} has a non-finite elevation.`,
        warnings,
      };
    }

    const quantized = quantizeOrbPosition(
      item.x,
      item.z,
      typeof item.elevation === 'number'
        ? item.elevation
        : BOTANICAL_SPECIES[item.species as SoundSpeciesId].defaultElevation
    );

    let orbId =
      typeof item.id === 'string' && item.id.trim()
        ? item.id.trim().slice(0, 64)
        : createOrbId();
    if (seenOrbIds.has(orbId)) {
      orbId = createOrbId();
      warnings.push(`Deduplicated repeated orb id at entry #${i + 1}.`);
    }
    seenOrbIds.add(orbId);

    validOrbs.push({
      id: orbId,
      species: item.species as SoundSpeciesId,
      x: quantized.x,
      z: quantized.z,
      elevation: quantized.elevation,
      step:
        typeof item.step === 'number' && Number.isFinite(item.step)
          ? ((Math.round(item.step) % TOTAL_STEPS) + TOTAL_STEPS) % TOTAL_STEPS
          : quantized.step,
      noteDegree:
        typeof item.noteDegree === 'number' && Number.isFinite(item.noteDegree)
          ? clamp(Math.round(item.noteDegree), 0, MAX_NOTE_DEGREE)
          : quantized.noteDegree,
      sustain:
        typeof item.sustain === 'number' && Number.isFinite(item.sustain)
          ? clamp(item.sustain, 0.25, 1.0)
          : 0.75,
      velocity:
        typeof item.velocity === 'number' && Number.isFinite(item.velocity)
          ? clamp(item.velocity, 0.35, 1.0)
          : 0.8,
      muted: Boolean(item.muted),
      plantedAt:
        typeof item.plantedAt === 'number' && Number.isFinite(item.plantedAt)
          ? item.plantedAt
          : Date.now(),
    });
  }

  const safeSkyMood: SavedGardenSnapshot['skyMood'] =
    parsed.skyMood === 'golden-dawn' ||
    parsed.skyMood === 'sunlit-meadow' ||
    parsed.skyMood === 'twilight-glow'
      ? parsed.skyMood
      : 'golden-dawn';

  const snapshot: SavedGardenSnapshot = {
    id:
      typeof parsed.id === 'string' && parsed.id.trim()
        ? parsed.id.trim().slice(0, 64)
        : `saved-${Date.now().toString(36)}`,
    name:
      typeof parsed.name === 'string' && parsed.name.trim()
        ? parsed.name.trim().slice(0, 64)
        : 'Saved Sound Garden',
    savedAt:
      typeof parsed.savedAt === 'string' && parsed.savedAt.trim()
        ? parsed.savedAt.trim().slice(0, 48)
        : new Date().toISOString(),
    scale: parsed.scale as ScaleId,
    bpm: typeof parsed.bpm === 'number' ? clamp(Math.round(parsed.bpm), 48, 160) : 84,
    skyMood: safeSkyMood,
    orbs: validOrbs,
  };

  return { ok: true, snapshot, warnings };
}

export function deserializeGardenSnapshot(raw: string): SavedGardenSnapshot | null {
  return validateAndDeserializeGardenSnapshot(raw).snapshot;
}

/**
 * Pure non-destructive merge helper: guarantees saving a new composition NEVER
 * silently overwrites a prior saved garden by assigning a unique ID and
 * disambiguating duplicate display names cleanly.
 */
export function mergeSavedGardenSnapshot(
  existing: SavedGardenSnapshot[],
  snapshot: SavedGardenSnapshot,
  maxSlots = 12
): SavedGardenSnapshot[] {
  const existingIds = new Set(existing.map((item) => item.id));
  const existingNames = new Set(existing.map((item) => item.name.trim().toLowerCase()));

  let uniqueId = snapshot.id.trim() || `garden-${Date.now().toString(36)}`;
  let idSuffix = 2;
  while (existingIds.has(uniqueId)) {
    uniqueId = `${snapshot.id}-${idSuffix}`;
    idSuffix++;
  }

  const baseName = (snapshot.name.trim() || 'Saved Sound Garden').slice(0, 56);
  let uniqueName = baseName;
  let nameSuffix = 2;
  while (existingNames.has(uniqueName.toLowerCase())) {
    uniqueName = `${baseName} (${nameSuffix})`.slice(0, 64);
    nameSuffix++;
  }

  const savedEntry: SavedGardenSnapshot = {
    ...snapshot,
    id: uniqueId,
    name: uniqueName,
    orbs: snapshot.orbs.map((o) => ({ ...o })),
  };

  return [savedEntry, ...existing].slice(0, maxSlots);
}

export function loadSavedGardens(): SavedGardenSnapshot[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => deserializeGardenSnapshot(JSON.stringify(item)))
      .filter((item): item is SavedGardenSnapshot => item !== null)
      .slice(0, 12);
  } catch {
    return [];
  }
}

export function saveGardenSnapshot(snapshot: SavedGardenSnapshot): SavedGardenSnapshot[] {
  const existing = loadSavedGardens();
  const next = mergeSavedGardenSnapshot(existing, snapshot, 12);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota failures cleanly
    }
  }
  return next;
}
