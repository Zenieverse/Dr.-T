// =======================================================
// AI PROVIDER ABSTRACTION LAYER FOR TOUCH GRASS
// Implements LocalHeuristicProvider and GemmaCloudProvider
// =======================================================

import { 
  ExtractedAudioFeatures, 
  GemmaMusicalReasoning, 
  OutdoorMissionType, 
  OutdoorMissionRecord 
} from '../types/touchGrassTypes';

export interface AIProvider {
  name: string;
  providerType: 'local' | 'cloud';
  modelId: string;
  interpretSound(
    features: ExtractedAudioFeatures, 
    userDescription?: string
  ): Promise<GemmaMusicalReasoning>;
  
  getCoachAdvice(
    query: string, 
    currentReasoning?: GemmaMusicalReasoning | null
  ): Promise<{ answer: string; actionPrompt: string; notesToAudition?: string[] }>;
}

// -------------------------------------------------------
// 1. DETERMINISTIC LOCAL HEURISTIC PROVIDER
// Runs zero-network, 100% offline, privacy-first deterministic
// music theory & acoustic reasoning. (Does not run neural weights).
// Outputs structured JSON matching the musical reasoning schema.
// -------------------------------------------------------
export class LocalHeuristicProvider implements AIProvider {
  public name = 'Deterministic Local Music Reasoning Engine';
  public providerType: 'local' = 'local';
  public modelId = 'deterministic-local-heuristic-v1';

  public async interpretSound(
    features: ExtractedAudioFeatures,
    userDescription?: string
  ): Promise<GemmaMusicalReasoning> {
    const desc = (userDescription || '').toLowerCase();
    
    // RHYTHM DETECTIONS (Footsteps, wheels, machinery, rain)
    if (desc.includes('footstep') || desc.includes('walk') || desc.includes('step')) {
      return {
        sound_type: 'environmental_footstep_pulse',
        source_category: 'Footsteps / Walking',
        pulse_detected: true,
        tempo_estimate: features.detectedTempoBpm || 96,
        pattern: 'steady duple stride (left-right-left-right)',
        melodic_contour: 'static',
        confidence: 0.91,
        recommended_skill: 'rhythm',
        pedagogy_explanation: 'Footstep strides form the natural physical foundation of 4/4 meter. Your body instinctively keeps time before your mind counts numbers. We will transfer this walking stride directly into your left-hand walking bass accompaniment.',
        exercise: {
          title: 'Footstep Walking Bass Anchor',
          type: 'ostinato_accompaniment',
          difficulty: 1,
          keySignature: 'C Major',
          targetNotes: ['C3', 'G3', 'A3', 'F3'],
          suggestedHand: 'LH',
          instructions: 'Play Left Hand C3 on beat 1, step up to G3 on beat 2, A3 on beat 3, and F3 on beat 4, synchronizing with your remembered walking pace.'
        },
        coach_tip: 'Keep your left wrist loose, as if dropping your arm gently with each heel strike.',
        model_provider_name: 'Deterministic Local Heuristic Engine'
      };
    }

    if (desc.includes('bird') || desc.includes('chirp') || desc.includes('whistle')) {
      return {
        sound_type: 'avian_melodic_contour',
        source_category: 'Birdsong / Avian Contour',
        pulse_detected: false,
        tempo_estimate: 112,
        pattern: 'tripartite rising-falling flutter',
        melodic_contour: 'arched',
        confidence: 0.88,
        recommended_skill: 'melody',
        pedagogy_explanation: 'Birdsong rarely follows rigid meter; instead, it uses expressive pitch intervals (often minor 3rds and major 2nds) with an arched melodic contour. We will reproduce the high-low-high vocal shape on Right Hand keys.',
        exercise: {
          title: 'High-Low-High Avian Motif',
          type: 'melody_reproduction',
          difficulty: 2,
          keySignature: 'C Major / G Pentatonic',
          targetNotes: ['G4', 'E4', 'G4', 'A4'],
          suggestedHand: 'RH',
          instructions: 'Start on G4 (Treble landmark), drop a minor 3rd to E4, then flutter back up to G4 and resolve softly on A4.'
        },
        coach_tip: 'Play with light fingertips, letting the keys rebound quickly like feathers.',
        model_provider_name: 'Deterministic Local Heuristic Engine'
      };
    }

    if (desc.includes('bicycle') || desc.includes('bike') || desc.includes('wheel')) {
      return {
        sound_type: 'mechanical_wheel_rotation',
        source_category: 'Bicycle Wheels / Mechanical',
        pulse_detected: true,
        tempo_estimate: features.detectedTempoBpm || 120,
        pattern: 'rapid freewheel click-click cadence',
        melodic_contour: 'static',
        confidence: 0.93,
        recommended_skill: 'rhythm',
        pedagogy_explanation: 'A spinning bicycle freewheel generates high-frequency sixteenth-note subdivisions. This is the classic groove pattern behind lively Allegro piano movements.',
        exercise: {
          title: 'Spinning Wheel 16th-Note Pulse',
          type: 'piano_rhythm',
          difficulty: 2,
          keySignature: 'G Major',
          targetNotes: ['D4', 'G4', 'B4', 'D5'],
          suggestedHand: 'RH',
          instructions: 'Play rapid, crisp repeated eighth/sixteenth pulses on G4 and B4, anchoring your wrist and using light finger-action.'
        },
        coach_tip: 'Keep your forearm completely still. The energy comes from the knuckles.',
        model_provider_name: 'Deterministic Local Heuristic Engine'
      };
    }

    if (desc.includes('construction') || desc.includes('hammer') || desc.includes('machinery') || desc.includes('engine')) {
      return {
        sound_type: 'industrial_percussive_thrust',
        source_category: 'Construction / Heavy Machinery',
        pulse_detected: true,
        tempo_estimate: features.detectedTempoBpm || 76,
        pattern: 'heavy downbeat strike with metallic resonance',
        melodic_contour: 'falling',
        confidence: 0.90,
        recommended_skill: 'harmony',
        pedagogy_explanation: 'Construction impacts deliver heavy accentuation on beat 1. In Russian romantic and modern piano works (Prokofiev, Bartók), percussive piano strokes evoke raw industrial power.',
        exercise: {
          title: 'Industrial Heavy Downbeat Accent',
          type: 'ostinato_accompaniment',
          difficulty: 2,
          keySignature: 'A Minor',
          targetNotes: ['A2', 'E3', 'A3', 'C4'],
          suggestedHand: 'LH',
          instructions: 'Strike low A2/E3 octaves with solid weight on count 1, then rest on counts 2 and 3 like a heavy machine cycle.'
        },
        coach_tip: 'Use full arm drop from the shoulder into the keyboard bed without tensing your wrists.',
        model_provider_name: 'Deterministic Local Heuristic Engine'
      };
    }

    if (desc.includes('signal') || desc.includes('traffic') || desc.includes('beep') || desc.includes('cross')) {
      return {
        sound_type: 'metronomic_pedestrian_chime',
        source_category: 'Traffic Signals / Pedestrian Crossing',
        pulse_detected: true,
        tempo_estimate: features.detectedTempoBpm || 108,
        pattern: 'isochronous metronomic pulse',
        melodic_contour: 'static',
        confidence: 0.95,
        recommended_skill: 'rhythm',
        pedagogy_explanation: 'Pedestrian crossing signals provide an exact acoustic metronome. Practicing with an unyielding external pulse builds rock-solid internal timing.',
        exercise: {
          title: 'Pedestrian Signal Metronome Lock',
          type: 'piano_rhythm',
          difficulty: 1,
          keySignature: 'C Major',
          targetNotes: ['C4', 'C4', 'G4', 'G4'],
          suggestedHand: 'RH',
          instructions: 'Lock into the steady 108 BPM pulse. Play four repeated quarter notes without rushing or dragging.'
        },
        coach_tip: 'Breathe evenly on beats 1 and 3 to anchor your nervous system.',
        model_provider_name: 'Deterministic Local Heuristic Engine'
      };
    }

    if (desc.includes('door') || desc.includes('latch') || desc.includes('click') || desc.includes('hinge')) {
      return {
        sound_type: 'acoustic_closure_cadence',
        source_category: 'Doors / Latches & Hinges',
        pulse_detected: true,
        tempo_estimate: features.detectedTempoBpm || 60,
        pattern: 'anticipation swing followed by crisp snap',
        melodic_contour: 'falling',
        confidence: 0.87,
        recommended_skill: 'harmony',
        pedagogy_explanation: 'A latch closing represents a musical cadence: tension (the swing) resolving into closure (the strike). In harmony, this mirrors a V7 to I resolution.',
        exercise: {
          title: 'Door Latch Harmonic Resolution',
          type: 'harmony' as any,
          difficulty: 1,
          keySignature: 'C Major',
          targetNotes: ['G3', 'B3', 'F4', 'C4'],
          suggestedHand: 'Both',
          instructions: 'Play tension chord (G-B-F) then firmly resolve into stable home chord (C-E-G).'
        },
        coach_tip: 'Feel the sense of arrival when the C major chord settles.',
        model_provider_name: 'Deterministic Local Heuristic Engine'
      };
    }

    if (desc.includes('rain') || desc.includes('water') || desc.includes('stream') || desc.includes('drop')) {
      return {
        sound_type: 'hydro_acoustic_texture',
        source_category: 'Rain / Water Flow',
        pulse_detected: true,
        tempo_estimate: features.detectedTempoBpm || 84,
        pattern: 'polyrhythmic raindrop ostinato',
        melodic_contour: 'falling',
        confidence: 0.85,
        recommended_skill: 'harmony',
        pedagogy_explanation: 'Rain creates an organic ostinato: a repeating atmospheric pattern with micro-variations. In piano music, Debussy and Chopin used this exact acoustic principle to compose gentle rolling preludes.',
        exercise: {
          title: 'Raindrop Ostinato in C',
          type: 'piano_rhythm',
          difficulty: 2,
          keySignature: 'C Major',
          targetNotes: ['E4', 'G4', 'C5', 'G4'],
          suggestedHand: 'RH',
          instructions: 'Repeat the broken triad E4 → G4 → C5 → G4 softly in looping eighth notes, mimicking droplets tapping a windowpane.'
        },
        coach_tip: 'Use subtle damper pedal to let the notes blend without blurring into dissonance.',
        model_provider_name: 'Deterministic Local Heuristic Engine'
      };
    }

    // Default General Environmental Discovery
    return {
      sound_type: 'ambient_urban_pulse',
      source_category: 'Traffic Signals / Pedestrian Crossing',
      pulse_detected: features.pulseDetected,
      tempo_estimate: features.detectedTempoBpm || 90,
      pattern: features.rhythmicPattern || 'steady pulse with syncopated echoes',
      melodic_contour: features.pitchDirection === 'ascending' ? 'rising' : 'falling',
      confidence: 0.82,
      recommended_skill: 'active_listening',
      pedagogy_explanation: 'You detected a periodic sound in your outdoor environment. Translating ambient real-world sounds into musical phrases is the foundational bridge between listening and improvisation.',
      exercise: {
        title: 'Discovered Pulse Translation',
        type: 'piano_rhythm',
        difficulty: 1,
        keySignature: 'C Major',
        targetNotes: ['C4', 'E4', 'G4'],
        suggestedHand: 'Both',
        instructions: 'Play C4 with thumb in rhythm with your detected outdoor tempo, answering with E4 and G4.'
      },
      coach_tip: 'Close your eyes for 5 seconds before playing to bring the acoustic memory back into focus.',
      model_provider_name: 'Deterministic Local Heuristic Engine'
    };
  }

  public async getCoachAdvice(
    query: string,
    currentReasoning?: GemmaMusicalReasoning | null
  ): Promise<{ answer: string; actionPrompt: string; notesToAudition?: string[] }> {
    const q = query.toLowerCase();

    if (q.includes('rhythm') || q.includes('tempo')) {
      return {
        answer: "When capturing outdoor rhythms, do not worry about exact beats-per-minute. Focus on the relationship: are the pulses even like a heartbeat, or syncopated like a bounce? We can anchor it with your left hand on the piano.",
        actionPrompt: "Audition Duple Walking Pulse",
        notesToAudition: ['C3', 'G3', 'C3', 'G3']
      };
    }

    if (q.includes('melody') || q.includes('bird') || q.includes('pitch')) {
      return {
        answer: "Every melodic contour in nature can be mapped to three basic directions: Rising, Falling, or Arched. Listen for whether the final note resolves higher or lower than where it began.",
        actionPrompt: "Audition Rising 3-Note Interval",
        notesToAudition: ['C4', 'E4', 'G4']
      };
    }

    return {
      answer: "The greatest pianists and composers (from Beethoven walking Vienna's woods to Debussy studying rain) learned their phrasing directly from nature. Take what you heard outdoors and find just one anchor key on the piano.",
      actionPrompt: "Explore Piano Deck",
      notesToAudition: ['C4', 'D4', 'E4', 'G4']
    };
  }
}

// -------------------------------------------------------
// 2. GEMMA-COMPATIBLE CLOUD PROVIDER
// Interfaces with hosted Gemma-2 endpoints or backend proxy
// with seamless graceful fallback to LocalHeuristicProvider
// -------------------------------------------------------
export class GemmaCloudProvider implements AIProvider {
  public name = 'Gemma Cloud Provider (gemma-4-31b-it)';
  public providerType: 'cloud' = 'cloud';
  public modelId = 'gemma-4-31b-it';
  private localFallback = new LocalHeuristicProvider();

  public async interpretSound(
    features: ExtractedAudioFeatures,
    userDescription?: string
  ): Promise<GemmaMusicalReasoning> {
    try {
      // In production/dev, verify if server proxy is responsive
      const response = await fetch('/api/gemma/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features, userDescription })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reasoning) {
          return {
            ...data.reasoning,
            model_provider_name: data.reasoning.model_provider_name || 'Gemma Cloud Provider (Hosted)'
          };
        }
      }
    } catch (e) {
      // Graceful fallback to verified local engine
    }

    // Default to verified local reasoning pipeline
    const localResult = await this.localFallback.interpretSound(features, userDescription);
    return {
      ...localResult,
      model_provider_name: 'Deterministic Local Heuristic (Offline / Fallback)'
    };
  }

  public async getCoachAdvice(
    query: string,
    currentReasoning?: GemmaMusicalReasoning | null
  ): Promise<{ answer: string; actionPrompt: string; notesToAudition?: string[] }> {
    return this.localFallback.getCoachAdvice(query, currentReasoning);
  }
}

// Default export singletons
export const localHeuristicProvider = new LocalHeuristicProvider();
export const gemmaCloudProvider = new GemmaCloudProvider();

// Preserved aliases for backwards compatibility without false Gemma claims
export { LocalHeuristicProvider as GemmaLocalProvider, localHeuristicProvider as gemmaLocalProvider };

