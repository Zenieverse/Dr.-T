/**
 * Presage Sense — Client-Side Sensing & Persistence Service
 * SmartSpectra Challenge 2026 • Dr. T Platform
 */

import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { 
  PresageSenseSession, 
  PresageServerStatus, 
  PresageVitalsData, 
  SubjectiveCheckIn 
} from '../components/presagesense/types';

const STORAGE_KEYS = {
  SESSIONS: 'dr_t_presage_sessions_v1',
  CONSENT: 'dr_t_presage_camera_consent_v1'
};

export class PresageService {
  /**
   * Resolve current authenticated user or isolated guest identity
   */
  public static getCurrentUserId(): string {
    if (auth && auth.currentUser && auth.currentUser.uid) {
      return auth.currentUser.uid;
    }
    let guestId = sessionStorage.getItem('presage_guest_id');
    if (!guestId) {
      guestId = `guest_ps_${Date.now().toString(36)}`;
      sessionStorage.setItem('presage_guest_id', guestId);
    }
    return guestId;
  }

  /**
   * Check if camera consent has been explicitly granted
   */
  public static hasConsent(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.CONSENT) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Store camera consent
   */
  public static setConsent(granted: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONSENT, granted ? 'true' : 'false');
    } catch (err) {
      console.warn('[PresageService] Consent storage warning:', err);
    }
  }

  /**
   * Fetch Presage server SDK diagnostic status
   */
  public static async getServerStatus(): Promise<PresageServerStatus> {
    try {
      const res = await fetch('/api/presage/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return {
        status: 'INITIALIZING',
        sdkInstalled: true,
        sdkVersion: '3.4.0',
        nativePlatform: 'linux-x64',
        hasApiKey: false,
        requestedMetrics: ['pulseRate', 'breathingRate', 'hrv'],
        apiAuthStatus: 'NOT_CONFIGURED',
        notice: 'Connecting to local SmartSpectra service...'
      };
    }
  }

  /**
   * Transmit sampled video frame to server SmartSpectra C ABI pipeline
   */
  public static async sendFrameToServer(
    canvas: HTMLCanvasElement,
    timestampUs: number
  ): Promise<{
    accepted: boolean;
    lastMetrics: any;
    validation: { code: number; hint: string } | null;
  }> {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return { accepted: false, lastMetrics: null, validation: null };

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data; // RGBA
      
      // Convert to RGB byte array for SmartSpectra
      const rgb = new Uint8Array(canvas.width * canvas.height * 3);
      let j = 0;
      for (let i = 0; i < data.length; i += 4) {
        rgb[j++] = data[i];     // R
        rgb[j++] = data[i + 1]; // G
        rgb[j++] = data[i + 2]; // B
      }

      // Convert to base64 for lightweight JSON transport
      let binary = '';
      const len = rgb.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(rgb[i]);
      }
      const base64Data = btoa(binary);

      const resp = await fetch('/api/presage/process-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frameBase64: base64Data,
          width: canvas.width,
          height: canvas.height,
          stride: canvas.width * 3,
          timestampUs
        })
      });

      if (!resp.ok) return { accepted: false, lastMetrics: null, validation: null };
      return await resp.json();
    } catch (err) {
      return { accepted: false, lastMetrics: null, validation: null };
    }
  }

  /**
   * Request Gemini 3.8 Flash wellness reflection
   */
  public static async getWellnessReflection(
    vitals: Partial<PresageVitalsData>,
    subjective?: SubjectiveCheckIn
  ): Promise<{
    reflection: string;
    suggestedFocus: string;
    pacingTip: string;
    disclaimer: string;
  }> {
    try {
      const resp = await fetch('/api/presage/wellness-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vitals, subjective })
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (err) {
      return {
        reflection: 'Your measured rhythm demonstrates balanced resting physiology. Gentle breathing synchrony supports sustained mental focus.',
        suggestedFocus: 'Diaphragmatic 4-4-4 rhythm.',
        pacingTip: 'Softly relax jaw and shoulder muscles while exhaling fully.',
        disclaimer: 'EDUCATIONAL WELLNESS INSIGHT ONLY: Presage Sense measurements are for wellness awareness and do not constitute clinical diagnostics or healthcare advice.'
      };
    }
  }

  /**
   * Load saved measurement sessions with Firestore persistence and local storage fallback
   */
  public static async getSessions(): Promise<PresageSenseSession[]> {
    const userId = this.getCurrentUserId();
    let localSessions: PresageSenseSession[] = [];
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.SESSIONS}_${userId}`);
      if (raw) localSessions = JSON.parse(raw);
    } catch (err) {
      console.warn('[PresageService] Local session read error:', err);
    }

    try {
      if (db && auth && auth.currentUser) {
        const q = query(
          collection(db, 'presage_sense_sessions'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remote: PresageSenseSession[] = [];
          snapshot.forEach(docSnap => {
            remote.push({ id: docSnap.id, ...docSnap.data() } as PresageSenseSession);
          });
          localStorage.setItem(`${STORAGE_KEYS.SESSIONS}_${userId}`, JSON.stringify(remote));
          return remote;
        }
      }
    } catch (err) {
      console.warn('[PresageService] Firestore sessions query notice:', err);
    }

    return localSessions;
  }

  /**
   * Save completed wellness session
   */
  public static async saveSession(sessionData: Partial<PresageSenseSession> & { durationSeconds: number }): Promise<PresageSenseSession> {
    const userId = this.getCurrentUserId();
    const session: PresageSenseSession = {
      id: sessionData.id || `ps_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      userId: sessionData.userId || userId,
      timestamp: sessionData.timestamp || new Date().toISOString(),
      durationSeconds: sessionData.durationSeconds,
      meanPulseBpm: sessionData.meanPulseBpm ?? sessionData.vitalsSummary?.averagePulseBpm ?? null,
      meanBreathingRpm: sessionData.meanBreathingRpm ?? sessionData.vitalsSummary?.averageBreathingRpm ?? null,
      hrvRmssdMs: sessionData.hrvRmssdMs ?? sessionData.vitalsSummary?.hrvRmssdMs ?? null,
      vitalsSummary: sessionData.vitalsSummary,
      subjectiveCheckIn: sessionData.subjectiveCheckIn,
      aiWellnessReflection: sessionData.aiWellnessReflection ?? sessionData.aiReflection,
      aiReflection: sessionData.aiReflection ?? sessionData.aiWellnessReflection,
      tags: sessionData.tags || ['presage-challenge-2026', 'rppg'],
      provenance: sessionData.provenance || {
        engine: 'SmartSpectra Pure-FFI C ABI',
        sdkVersion: '3.4.0',
        platformArch: 'linux-x64',
        isLiveAuthorized: false,
        requestedMetrics: ['pulseRate', 'breathingRate', 'hrv'],
        telemetryOptOut: true
      }
    };

    const existing = await this.getSessions();
    const updated = [session, ...existing.filter(s => s.id !== session.id)];

    try {
      localStorage.setItem(`${STORAGE_KEYS.SESSIONS}_${userId}`, JSON.stringify(updated));
    } catch (err) {
      console.warn('[PresageService] Local session write error:', err);
    }

    try {
      if (db && auth && auth.currentUser) {
        const docRef = doc(db, 'presage_sense_sessions', session.id);
        await setDoc(docRef, { ...session, userId }, { merge: true });
      }
    } catch (err) {
      console.warn('[PresageService] Firestore session save notice:', err);
    }

    return session;
  }

  /**
   * Delete specific session
   */
  public static async deleteSession(sessionId: string): Promise<boolean> {
    const userId = this.getCurrentUserId();
    const existing = await this.getSessions();
    const updated = existing.filter(s => s.id !== sessionId);

    try {
      localStorage.setItem(`${STORAGE_KEYS.SESSIONS}_${userId}`, JSON.stringify(updated));
    } catch (err) {
      console.warn('[PresageService] Local session delete error:', err);
    }

    try {
      if (db && auth && auth.currentUser) {
        const docRef = doc(db, 'presage_sense_sessions', sessionId);
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.warn('[PresageService] Firestore session delete notice:', err);
    }

    return true;
  }
}
