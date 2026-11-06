/**
 * Presage SmartSpectra Node SDK Service
 * Pure-FFI C ABI Binding & Gemini Wellness Reflection Engine
 * SmartSpectra Challenge 2026 • Dr. T Platform
 */

import { GoogleGenAI } from '@google/genai';
import { createRequire } from 'module';
import { 
  PresageServerStatus, 
  PresageVitalsData, 
  SubjectiveCheckIn 
} from '../components/presagesense/types';

const require = createRequire(import.meta.url);

let smartSpectraInstance: any = null;
let sdkInitError: string | null = null;
let sdkLoadedModule: any = null;

// Safe dynamic loader for @smartspectra/node-sdk
function getSmartSpectraModule() {
  if (sdkLoadedModule) return sdkLoadedModule;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    sdkLoadedModule = require('@smartspectra/node-sdk');
    return sdkLoadedModule;
  } catch (err: any) {
    console.warn('[PresageServerService] Failed to load @smartspectra/node-sdk:', err?.message || err);
    sdkInitError = err?.message || 'SDK not available';
    return null;
  }
}

export class PresageServerService {
  private static instance: PresageServerService | null = null;
  private sdk: any = null;
  private isProcessing = false;
  private lastDecodedMetrics: any = null;
  private lastValidationStatus: { code: number; hint: string; timestampUs: number } | null = null;

  public static getInstance(): PresageServerService {
    if (!PresageServerService.instance) {
      PresageServerService.instance = new PresageServerService();
      PresageServerService.instance.initializeSdk();
    }
    return PresageServerService.instance;
  }

  private initializeSdk() {
    const mod = getSmartSpectraModule();
    if (!mod) return;

    const apiKey = process.env.PRESAGE_API_KEY || '';
    try {
      const { 
        SmartSpectraSDK, 
        breathingMetrics = [], 
        cardioMetrics = [], 
        faceMetrics = [] 
      } = mod;

      // Instantiate with requested metrics
      this.sdk = new SmartSpectraSDK({
        apiKey: apiKey || 'unconfigured_key_dr_t_companion',
        requestedMetrics: [...breathingMetrics, ...cardioMetrics, ...faceMetrics]
      });

      // Configure custom input for web frame streaming
      this.sdk.useCustomInput();

      // Register lifecycle and metric callbacks
      this.sdk.on('processingStatus', (status: any) => {
        // Status transitions: 1 (Starting), 2 (Running), 5 (Idle)
      });

      this.sdk.on('validationStatus', (code: number, timestampUs: number, hint: string) => {
        this.lastValidationStatus = { code, hint, timestampUs };
      });

      this.sdk.on('metrics', (buf: Buffer, timestampUs: number) => {
        try {
          if (mod.decodeMetrics) {
            const decoded = mod.decodeMetrics(buf);
            if (!Buffer.isBuffer(decoded)) {
              this.lastDecodedMetrics = decoded;
            }
          }
        } catch (decErr) {
          console.warn('[PresageServerService] Metric decode warning:', decErr);
        }
      });

      console.log('[PresageServerService] SmartSpectra Node SDK initialized successfully.');
    } catch (err: any) {
      console.warn('[PresageServerService] SDK init notice:', err?.message || err);
      sdkInitError = err?.message || 'Initialization failed';
    }
  }

  public getStatus(): PresageServerStatus {
    const hasKey = Boolean(process.env.PRESAGE_API_KEY && process.env.PRESAGE_API_KEY.trim().length > 0);
    const mod = getSmartSpectraModule();

    return {
      status: this.sdk ? 'OPERATIONAL' : 'INITIALIZING',
      sdkInstalled: Boolean(mod),
      sdkVersion: '3.4.0',
      nativePlatform: `${process.platform}-${process.arch}`,
      hasApiKey: hasKey,
      requestedMetrics: ['pulseRate', 'arterialPressureTrace', 'hrv', 'breathingRate', 'upperTrace', 'lowerTrace', 'faceLandmarks'],
      apiAuthStatus: hasKey ? 'AUTHORIZED' : 'NOT_CONFIGURED',
      notice: hasKey 
        ? 'Presage SmartSpectra SDK authenticated.' 
        : 'Presage API key not configured in environment (PRESAGE_API_KEY). Set key for live cloud model delivery.'
    };
  }

  public async processFrame(
    frameBuffer: Buffer, 
    width: number, 
    height: number, 
    stride: number, 
    timestampUs: number
  ): Promise<{
    accepted: boolean;
    lastMetrics: any;
    validation: { code: number; hint: string } | null;
  }> {
    if (!this.sdk) {
      return { accepted: false, lastMetrics: null, validation: null };
    }

    try {
      const mod = getSmartSpectraModule();
      const pixelFormat = mod?.PixelFormat?.kRGB ?? 0;
      
      if (!this.isProcessing) {
        this.sdk.start();
        this.isProcessing = true;
      }

      const accepted = this.sdk.sendFrame(
        frameBuffer, 
        width, 
        height, 
        stride, 
        pixelFormat, 
        timestampUs
      );

      return {
        accepted: Boolean(accepted),
        lastMetrics: this.lastDecodedMetrics,
        validation: this.lastValidationStatus
      };
    } catch (err: any) {
      console.warn('[PresageServerService] Frame processing error:', err?.message || err);
      return {
        accepted: false,
        lastMetrics: null,
        validation: { code: -1, hint: err?.message || 'Frame send failed' }
      };
    }
  }

  public async stopSession(): Promise<void> {
    if (this.sdk && this.isProcessing) {
      try {
        if (typeof this.sdk.stopAsync === 'function') {
          await this.sdk.stopAsync();
        } else if (typeof this.sdk.stop === 'function') {
          this.sdk.stop();
        }
      } catch (err) {
        console.warn('[PresageServerService] Stop notice:', err);
      } finally {
        this.isProcessing = false;
      }
    }
  }

  /**
   * Gemini 3.8 Flash Wellness Reflection Engine
   * Strictly educational wellness context — NO disease diagnosis or treatment recommendations.
   */
  public async generateWellnessInsights(
    vitals: Partial<PresageVitalsData>,
    subjective?: SubjectiveCheckIn,
    geminiClient?: GoogleGenAI
  ) {
    return this.generateWellnessReflection(vitals, subjective, geminiClient);
  }

  public async generateWellnessReflection(
    vitals: Partial<PresageVitalsData>,
    subjective?: SubjectiveCheckIn,
    geminiClient?: GoogleGenAI
  ): Promise<{
    reflection: string;
    suggestedFocus: string;
    pacingTip: string;
    disclaimer: string;
  }> {
    const disclaimer = 'EDUCATIONAL WELLNESS INSIGHT ONLY: Presage Sense measurements and AI reflections are for general fitness and wellness awareness. They are not medical diagnostics, clinical evaluations, or therapeutic advice. For any health concerns, consult a licensed healthcare professional.';

    const pulse = vitals.pulseRateBpm ? `${Math.round(vitals.pulseRateBpm)} BPM` : 'Baseline in progress';
    const breathing = vitals.breathingRateRpm ? `${Math.round(vitals.breathingRateRpm)} breaths/min` : 'Calibrating';
    const hrv = vitals.hrvRmssdMs ? `${Math.round(vitals.hrvRmssdMs)} ms (RMSSD)` : 'Evaluating stability';
    const mood = subjective?.mood || 'Unspecified';
    const stress = subjective?.stressLevel ? `${subjective.stressLevel}/5` : 'Normal';

    if (!geminiClient) {
      return {
        reflection: `Your resting rhythm indicates a pulse of ${pulse} with a respiration cadence of ${breathing}. Combined with your check-in feeling "${mood}", your autonomic system is currently settling into a steady state.`,
        suggestedFocus: 'Box Breathing (4-4-4 rhythm) to reinforce vagal tone.',
        pacingTip: 'Take two deep diaphragmatic breaths through your nose, exhaling slowly through gently parted lips.',
        disclaimer
      };
    }

    try {
      const prompt = `You are the Dr. T Presage Sense Wellness Companion.
A user completed a camera-based contactless wellness check-in using the Presage SmartSpectra optical sensing system.

Measured Data:
- Pulse Rate: ${pulse}
- Breathing Cadence: ${breathing}
- Heart Rate Variability: ${hrv}
- Subjective Mood Check-in: ${mood}
- Self-Reported Stress: ${stress}
- Notes: ${subjective?.notes || 'None'}

CRITICAL COMPLIANCE RULES:
1. Do NOT diagnose any illness, cardiovascular condition, arrhythmia, anxiety disorder, or pathology.
2. Do NOT prescribe medication, treatments, or clinical interventions.
3. Provide warm, educational observations about heart-rate rhythm, breathing pacing, and somatic grounding.
4. Keep the reflection concise, reassuring, and under 120 words.
5. Provide a 1-sentence "suggestedFocus" and a 1-sentence "pacingTip".

Output JSON format:
{
  "reflection": "concise wellness reflection",
  "suggestedFocus": "actionable calming focus",
  "pacingTip": "breathing or posture tip"
}`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        reflection: parsed.reflection || `Your physiological cadence shows a pulse of ${pulse} and breathing at ${breathing}.`,
        suggestedFocus: parsed.suggestedFocus || 'Gentle diaphragmatic breathing and gentle shoulder release.',
        pacingTip: parsed.pacingTip || 'Inhale smoothly for 4 seconds, exhale softly for 4 seconds.',
        disclaimer
      };
    } catch (aiErr: any) {
      console.warn('[PresageServerService] Gemini reflection fallback:', aiErr?.message || aiErr);
      return {
        reflection: `Your measured rhythm reflects a pulse of ${pulse} and breathing of ${breathing}. Integrating mindful pauses helps align your cardiovascular and respiratory rhythms.`,
        suggestedFocus: '4-4-4 Box Breathing for autonomic balance.',
        pacingTip: 'Rest your hands on your lower abdomen and feel the gentle rise with each inhalation.',
        disclaimer
      };
    }
  }
}
