export type SoundSpeciesId = 'bellflower' | 'lotus' | 'reed' | 'fern' | 'lily';

export type ScaleId =
  | 'f-lydian'
  | 'c-pentatonic'
  | 'd-dorian'
  | 'a-minor-twilight'
  | 'g-mixolydian';

export type GardenMode = 'plant' | 'sculpt' | 'conduct';

export type CameraPresetId = 'sanctuary' | 'podium' | 'aerial' | 'blossom';

export type SkyMoodId = 'golden-dawn' | 'sunlit-meadow' | 'twilight-glow';

export interface SoundSpeciesSpec {
  id: SoundSpeciesId;
  name: string;
  shortName: string;
  musicalRole: string;
  timbreSummary: string;
  octaveOffset: number;
  defaultElevation: number;
  defaultSustain: number;
  preferredRadius: number;
  petalColor: string;
  accentColor: string;
  orbColor: string;
  emissiveColor: string;
  stemColor: string;
}

export interface ScaleSpec {
  id: ScaleId;
  name: string;
  mood: string;
  rootMidi: number;
  intervals: number[];
}

export interface SoundOrb {
  id: string;
  species: SoundSpeciesId;
  x: number;
  z: number;
  /** Vertical orb height in meters (0.45m - 3.20m), mapped directly to scale pitch degree */
  elevation: number;
  /** Quantized radial sequencer beat slot (0..15 clockwise around the sanctuary ring) */
  step: number;
  /** Quantized degree index into the active musical scale (0..14) */
  noteDegree: number;
  /** Harmonic sustain & petal openness weight (0.25..1.0) */
  sustain: number;
  /** Base velocity (0.35..1.0) */
  velocity: number;
  muted: boolean;
  plantedAt: number;
}

export interface HarmonicLink {
  fromId: string;
  toId: string;
  consonance: number; // 0.5..1.0 (octave/fifth strongest)
  intervalLabel: 'unison' | 'fifth' | 'third' | 'octave';
}

export interface GardenPreset {
  id: string;
  name: string;
  subtitle: string;
  touchGrassOrigin: string;
  scale: ScaleId;
  bpm: number;
  skyMood: SkyMoodId;
  orbs: Omit<SoundOrb, 'id' | 'plantedAt'>[];
}

export interface SavedGardenSnapshot {
  id: string;
  name: string;
  savedAt: string;
  scale: ScaleId;
  bpm: number;
  skyMood: SkyMoodId;
  orbs: SoundOrb[];
}

export interface ConductingMetrics {
  /** Overall dynamic amplitude multiplier (0.55..1.45) */
  dynamics: number;
  /** Visual and harmonic bloom state (0..1) */
  bloomLevel: number;
  /** Low-pass filter brightness opening (0..1) */
  brilliance: number;
  /** Wet spatial reverb bloom mix (0.22..0.72) */
  reverbSend: number;
  /** Upper harmonic chord shimmer probability/gain (0..1) */
  harmonyShimmer: number;
  /** Effective BPM adjusted by subtle conducting rubato */
  effectiveBpm: number;
}

export type AudioEngineState = 'uninitialized' | 'suspended' | 'running' | 'closed';

export type XRSessionState = 'unsupported' | 'ready' | 'requesting' | 'active';

export type XRTrackingStatus = 'inactive' | 'hands' | 'controllers' | 'lost';

export interface GardenEngineSnapshot {
  isPlaying: boolean;
  currentStep: number;
  bloomLevel: number;
  bloomDwellProgress: number;
  crescendoActive: boolean;
  handLift: number;
  handSpread: number;
  audioState: AudioEngineState;
  xrSupported: boolean;
  xrActive: boolean;
  xrSessionState: XRSessionState;
  xrHandCount: number;
  xrControllerCount: number;
  xrTrackingStatus: XRTrackingStatus;
  webcamActive: boolean;
  webcamPaused: boolean;
  webcamError: string | null;
  reducedMotion: boolean;
  isSoftwareGl: boolean;
  hoveredPreview: {
    step: number;
    noteName: string;
    x: number;
    z: number;
  } | null;
  contextLost: boolean;
}
