import { clamp } from './musicTheory';
import { XRSessionState, XRTrackingStatus } from './types';

export interface Vec3Like {
  x: number;
  y: number;
  z: number;
}

export interface XRHandFrameInput {
  handIndex: 0 | 1;
  tracked: boolean;
  wrist?: Vec3Like;
  indexTip?: Vec3Like;
  thumbTip?: Vec3Like;
  middleTip?: Vec3Like;
  pinkyTip?: Vec3Like;
}

export interface XROrbTarget {
  id: string;
  x: number;
  y: number;
  z: number;
}

export type XRHandActionEvent =
  | { type: 'plant'; handIndex: 0 | 1; x: number; y: number; z: number }
  | { type: 'grab'; handIndex: 0 | 1; orbId: string }
  | { type: 'sculpt'; handIndex: 0 | 1; orbId: string; x: number; y: number; z: number }
  | {
      type: 'release';
      handIndex: 0 | 1;
      orbId: string;
      reason: 'unpinch' | 'tracking-lost' | 'session-end';
    }
  | { type: 'bloom-start' }
  | { type: 'bloom-end' };

export interface XRHandInteractionOutput {
  events: XRHandActionEvent[];
  trackedHandCount: number;
  trackingStatus: XRTrackingStatus;
  handLift: number;
  handSpread: number;
  bloomActive: boolean;
  bloomDwellProgress: number;
  pinchStates: [boolean, boolean];
  grabbedOrbIds: [string | null, string | null];
  previewPoint: Vec3Like | null;
}

// Calibrated physical WebXR hand-tracking constants (in meters / milliseconds)
export const PINCH_ENGAGE_METERS = 0.024;
export const PINCH_RELEASE_METERS = 0.04;
export const PLANT_COOLDOWN_MS = 450;
export const GRAB_RADIUS_METERS = 0.48;
export const OPEN_PALM_EXTENSION_METERS = 0.11;
export const BLOOM_MEAN_HEIGHT_METERS = 1.38;
export const BLOOM_HOLD_MIN_HEIGHT_METERS = 1.24;
export const BLOOM_SPREAD_METERS = 0.34;
export const BLOOM_DWELL_MS = 420;
export const BLOOM_COOLDOWN_MS = 1400;
export const TRACKING_LOSS_GRACE_MS = 180;
export const HAND_FALLBACK_SUPPRESS_MS = 850;
export const PREVIEW_MIN_RADIUS_METERS = 1.15;
export const PREVIEW_MAX_RADIUS_METERS = 6.95;

export interface WebXRSystemLike {
  isSessionSupported?: (mode: 'immersive-vr') => Promise<boolean>;
  requestSession?: (
    mode: 'immersive-vr',
    init?: { optionalFeatures?: string[]; requiredFeatures?: string[] }
  ) => Promise<WebXRSessionLike>;
}

export interface WebXRSessionLike {
  end: () => Promise<void>;
  addEventListener: (type: 'end', listener: () => void) => void;
  removeEventListener?: (type: 'end', listener: () => void) => void;
}

/**
 * Safely probes browser WebXR `immersive-vr` availability without throwing.
 */
export async function probeWebXRSupport(
  xr: WebXRSystemLike | undefined | null
): Promise<boolean> {
  if (!xr || typeof xr.isSessionSupported !== 'function') {
    return false;
  }
  try {
    return Boolean(await xr.isSessionSupported('immersive-vr'));
  } catch {
    return false;
  }
}

/**
 * Manages the full Meta Quest WebXR session lifecycle with:
 * - Duplicate request locking (`requesting` state prevents overlapping `requestSession` calls)
 * - Clean rollback (`session.end()`) if attaching the session to Three.js fails
 * - Idempotent teardown on browser- or user-initiated session end
 */
export class XRSessionLifecycleManager {
  private supported = false;
  private state: XRSessionState = 'unsupported';
  private activeSession: WebXRSessionLike | null = null;
  private endListener: (() => void) | null = null;

  public getState(): XRSessionState {
    return this.state;
  }

  public isSupported(): boolean {
    return this.supported;
  }

  public isActive(): boolean {
    return this.state === 'active' && this.activeSession !== null;
  }

  public getSession(): WebXRSessionLike | null {
    return this.activeSession;
  }

  public setSupported(supported: boolean): void {
    this.supported = Boolean(supported);
    if (this.state !== 'active' && this.state !== 'requesting') {
      this.state = this.supported ? 'ready' : 'unsupported';
    }
  }

  public async requestImmersiveSession(params: {
    xr: WebXRSystemLike | undefined | null;
    attachSession: (session: WebXRSessionLike) => Promise<void>;
    onSessionEnded: () => void;
  }): Promise<{ started: boolean; message?: string }> {
    if (this.state === 'requesting') {
      return {
        started: false,
        message: 'VR session request is already in progress.',
      };
    }

    if (this.state === 'active' && this.activeSession) {
      await this.endSession();
      return { started: false };
    }

    if (!this.supported || !params.xr || typeof params.xr.requestSession !== 'function') {
      this.state = 'unsupported';
      return {
        started: false,
        message:
          'Meta Quest WebXR headset not detected in this browser. Open this URL in Meta Quest Browser to step inside with native hand tracking.',
      };
    }

    this.state = 'requesting';
    let session: WebXRSessionLike | null = null;

    try {
      session = await params.xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
      });

      let cleanedUp = false;
      const handleEnd = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        if (this.activeSession === session) {
          this.activeSession = null;
        }
        this.endListener = null;
        this.state = this.supported ? 'ready' : 'unsupported';
        params.onSessionEnded();
      };

      this.endListener = handleEnd;
      session.addEventListener('end', handleEnd);
      this.activeSession = session;

      await params.attachSession(session);
      this.state = 'active';
      return { started: true };
    } catch (err) {
      if (session) {
        if (this.endListener && typeof session.removeEventListener === 'function') {
          session.removeEventListener('end', this.endListener);
        }
        this.endListener = null;
        this.activeSession = null;
        try {
          await session.end();
        } catch {
          // ignore rollback end error
        }
      }
      this.state = this.supported ? 'ready' : 'unsupported';
      return {
        started: false,
        message:
          err instanceof Error
            ? err.message
            : 'Unable to start immersive WebXR session.',
      };
    }
  }

  public async endSession(): Promise<void> {
    const session = this.activeSession;
    if (!session) {
      this.state = this.supported ? 'ready' : 'unsupported';
      return;
    }
    try {
      await session.end();
    } catch {
      // Force local cleanup if runtime already dropped session
      this.activeSession = null;
      this.endListener = null;
      this.state = this.supported ? 'ready' : 'unsupported';
    }
  }
}

function dist3(a: Vec3Like, b: Vec3Like): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

interface InternalHandState {
  isPinching: boolean;
  grabbedOrbId: string | null;
  lastPlantAtMs: number;
  lastTrackedAtMs: number;
  currentlyTracked: boolean;
  openPalm: boolean;
}

/**
 * Pure deterministic WebXR hand-tracking interaction controller.
 * Encapsulates pinch hysteresis, plant debouncing, grab/sculpt/release,
 * tracking-loss grace recovery, deliberate two-hand Conduct Bloom dwell/cooldown,
 * and controller fallback gating so both live Meta Quest WebXR and Node tests
 * execute identical logic.
 */
export class XRHandInteractionController {
  private hands: [InternalHandState, InternalHandState] = [
    this.makeInitialHand(),
    this.makeInitialHand(),
  ];

  private handLift = 0.25;
  private handSpread = 0.3;
  private bloomActive = false;
  private bloomDwellStartMs: number | null = null;
  private bloomDwellProgress = 0;
  private lastBloomEndMs = -Infinity;
  private lastAnyHandTrackedMs = -Infinity;
  private hadTrackedHandsInSession = false;

  private makeInitialHand(): InternalHandState {
    return {
      isPinching: false,
      grabbedOrbId: null,
      lastPlantAtMs: -Infinity,
      lastTrackedAtMs: -Infinity,
      currentlyTracked: false,
      openPalm: false,
    };
  }

  public reset(
    reason: 'session-end' | 'tracking-lost' = 'session-end'
  ): XRHandActionEvent[] {
    const events: XRHandActionEvent[] = [];
    for (let h = 0; h < 2; h++) {
      const grabbed = this.hands[h].grabbedOrbId;
      if (grabbed) {
        events.push({
          type: 'release',
          handIndex: h as 0 | 1,
          orbId: grabbed,
          reason,
        });
      }
      this.hands[h] = this.makeInitialHand();
    }
    if (this.bloomActive) {
      this.bloomActive = false;
      events.push({ type: 'bloom-end' });
    }
    this.bloomDwellStartMs = null;
    this.bloomDwellProgress = 0;
    this.handLift = 0.25;
    this.handSpread = 0.3;
    this.lastBloomEndMs = -Infinity;
    this.lastAnyHandTrackedMs = -Infinity;
    this.hadTrackedHandsInSession = false;
    return events;
  }

  /**
   * Prevents Touch controller `selectstart` events from overriding or double-firing
   * alongside active Meta Quest optical hand tracking.
   */
  public shouldAllowControllerFallback(
    _handIndex: 0 | 1,
    nowMs: number
  ): boolean {
    if (this.hands[0].currentlyTracked || this.hands[1].currentlyTracked) {
      return false;
    }
    if (nowMs - this.lastAnyHandTrackedMs < HAND_FALLBACK_SUPPRESS_MS) {
      return false;
    }
    return true;
  }

  public update(params: {
    nowMs: number;
    dtSec: number;
    hands: [XRHandFrameInput, XRHandFrameInput];
    orbs: XROrbTarget[];
    activeControllerCount: number;
    canPlantMore: boolean;
  }): XRHandInteractionOutput {
    const { nowMs, dtSec, hands, orbs, activeControllerCount, canPlantMore } = params;
    const events: XRHandActionEvent[] = [];
    const existingOrbIds = new Set(orbs.map((o) => o.id));

    let trackedHandCount = 0;
    let wristHeightSum = 0;
    let wristCount = 0;
    let leftWrist: Vec3Like | null = null;
    let rightWrist: Vec3Like | null = null;
    let previewPoint: Vec3Like | null = null;

    for (let i = 0; i < 2; i++) {
      const handIndex = i as 0 | 1;
      const input = hands[handIndex];
      const state = this.hands[handIndex];

      // Clear stale grab if orb was deleted externally
      if (state.grabbedOrbId && !existingOrbIds.has(state.grabbedOrbId)) {
        state.grabbedOrbId = null;
      }

      if (!input.tracked || !input.indexTip || !input.thumbTip) {
        state.currentlyTracked = false;
        state.openPalm = false;

        // Tracking-loss grace window: safely release stuck grab after TRACKING_LOSS_GRACE_MS
        if (
          state.grabbedOrbId &&
          nowMs - state.lastTrackedAtMs >= TRACKING_LOSS_GRACE_MS
        ) {
          events.push({
            type: 'release',
            handIndex,
            orbId: state.grabbedOrbId,
            reason: 'tracking-lost',
          });
          state.grabbedOrbId = null;
          state.isPinching = false;
        } else if (
          state.isPinching &&
          nowMs - state.lastTrackedAtMs >= TRACKING_LOSS_GRACE_MS
        ) {
          state.isPinching = false;
        }
        continue;
      }

      state.currentlyTracked = true;
      state.lastTrackedAtMs = nowMs;
      this.lastAnyHandTrackedMs = nowMs;
      this.hadTrackedHandsInSession = true;
      trackedHandCount++;

      const wrist = input.wrist ?? input.indexTip;
      wristHeightSum += wrist.y;
      wristCount++;
      if (handIndex === 0) leftWrist = wrist;
      else rightWrist = wrist;

      // Dual-threshold pinch hysteresis prevents fingertip jitter double-triggers
      const pinchDist = dist3(input.indexTip, input.thumbTip);
      const nextPinching = state.isPinching
        ? pinchDist <= PINCH_RELEASE_METERS
        : pinchDist < PINCH_ENGAGE_METERS;

      // Open palm verification: not pinching and extended middle/index tip far enough from wrist
      const extTip = input.middleTip ?? input.indexTip;
      const palmExtension = dist3(wrist, extTip);
      state.openPalm = !nextPinching && palmExtension >= OPEN_PALM_EXTENSION_METERS;

      if (nextPinching && !state.isPinching) {
        // Pinch onset: try grabbing nearest orb within GRAB_RADIUS_METERS first
        const otherGrabbed = this.hands[handIndex === 0 ? 1 : 0].grabbedOrbId;
        let nearestId: string | null = null;
        let nearestDist = GRAB_RADIUS_METERS;

        for (const orb of orbs) {
          if (orb.id === otherGrabbed) continue;
          const d = dist3(input.indexTip, orb);
          if (d < nearestDist) {
            nearestDist = d;
            nearestId = orb.id;
          }
        }

        if (nearestId) {
          state.grabbedOrbId = nearestId;
          events.push({ type: 'grab', handIndex, orbId: nearestId });
        } else if (
          canPlantMore &&
          nowMs - state.lastPlantAtMs >= PLANT_COOLDOWN_MS
        ) {
          state.lastPlantAtMs = nowMs;
          events.push({
            type: 'plant',
            handIndex,
            x: input.indexTip.x,
            y: input.indexTip.y,
            z: input.indexTip.z,
          });
        }
      } else if (nextPinching && state.grabbedOrbId) {
        events.push({
          type: 'sculpt',
          handIndex,
          orbId: state.grabbedOrbId,
          x: input.indexTip.x,
          y: input.indexTip.y,
          z: input.indexTip.z,
        });
      } else if (!nextPinching && state.isPinching) {
        if (state.grabbedOrbId) {
          events.push({
            type: 'release',
            handIndex,
            orbId: state.grabbedOrbId,
            reason: 'unpinch',
          });
          state.grabbedOrbId = null;
        }
      }

      state.isPinching = nextPinching;

      // Live planting preview when unpinched fingertip hovers over clearing (prefer right hand, fallback left)
      if (!nextPinching && !state.grabbedOrbId && (!previewPoint || handIndex === 1)) {
        const radialDist = Math.hypot(input.indexTip.x, input.indexTip.z);
        if (
          radialDist >= PREVIEW_MIN_RADIUS_METERS &&
          radialDist <= PREVIEW_MAX_RADIUS_METERS
        ) {
          previewPoint = {
            x: input.indexTip.x,
            y: input.indexTip.y,
            z: input.indexTip.z,
          };
        }
      }
    }

    // Exponential smoothing for comfortable dynamics & bloom conducting
    const smoothAlpha = clamp(1 - Math.exp(-Math.max(0.001, dtSec) * 8.5), 0.05, 1);

    if (trackedHandCount > 0 && wristCount > 0) {
      const meanY = wristHeightSum / wristCount;
      const targetLift = clamp((meanY - 0.82) / 0.72, 0.08, 1);
      this.handLift += (targetLift - this.handLift) * smoothAlpha;

      let spreadDist = 0;
      if (leftWrist && rightWrist) {
        spreadDist = dist3(leftWrist, rightWrist);
        const targetSpread = clamp((spreadDist - 0.22) / 0.85, 0.1, 1);
        this.handSpread += (targetSpread - this.handSpread) * smoothAlpha;
      }

      const bothOpenPalms =
        trackedHandCount === 2 &&
        this.hands[0].openPalm &&
        this.hands[1].openPalm &&
        leftWrist !== null &&
        rightWrist !== null;

      const poseMeetsBloomEntry =
        bothOpenPalms &&
        meanY >= BLOOM_MEAN_HEIGHT_METERS &&
        spreadDist >= BLOOM_SPREAD_METERS;

      const poseMaintainsBloom =
        bothOpenPalms &&
        meanY >= BLOOM_HOLD_MIN_HEIGHT_METERS &&
        spreadDist >= BLOOM_SPREAD_METERS * 0.8;

      if (this.bloomActive) {
        if (!poseMaintainsBloom) {
          this.bloomActive = false;
          this.bloomDwellStartMs = null;
          this.bloomDwellProgress = 0;
          this.lastBloomEndMs = nowMs;
          events.push({ type: 'bloom-end' });
        } else {
          this.bloomDwellProgress = 1;
        }
      } else {
        const cooldownElapsed = nowMs - this.lastBloomEndMs >= BLOOM_COOLDOWN_MS;
        if (poseMeetsBloomEntry && cooldownElapsed) {
          if (this.bloomDwellStartMs === null) {
            this.bloomDwellStartMs = nowMs;
          }
          const heldMs = nowMs - this.bloomDwellStartMs;
          this.bloomDwellProgress = clamp(heldMs / BLOOM_DWELL_MS, 0, 1);
          if (heldMs >= BLOOM_DWELL_MS) {
            this.bloomActive = true;
            this.bloomDwellProgress = 1;
            events.push({ type: 'bloom-start' });
          }
        } else {
          this.bloomDwellStartMs = null;
          this.bloomDwellProgress = Math.max(0, this.bloomDwellProgress - dtSec * 3.5);
        }
      }
    } else {
      // Gentle calm decay when hands leave tracking FOV
      const decayAlpha = clamp(1 - Math.exp(-Math.max(0.001, dtSec) * 2.4), 0.02, 1);
      this.handLift += (0.25 - this.handLift) * decayAlpha;
      this.handSpread += (0.3 - this.handSpread) * decayAlpha;
      this.bloomDwellStartMs = null;
      this.bloomDwellProgress = 0;
      if (
        this.bloomActive &&
        nowMs - this.lastAnyHandTrackedMs >= TRACKING_LOSS_GRACE_MS
      ) {
        this.bloomActive = false;
        this.lastBloomEndMs = nowMs;
        events.push({ type: 'bloom-end' });
      }
    }

    let trackingStatus: XRTrackingStatus;
    if (trackedHandCount > 0) {
      trackingStatus = 'hands';
    } else if (activeControllerCount > 0) {
      trackingStatus = 'controllers';
    } else if (this.hadTrackedHandsInSession) {
      trackingStatus = 'lost';
    } else {
      trackingStatus = 'inactive';
    }

    return {
      events,
      trackedHandCount,
      trackingStatus,
      handLift: this.handLift,
      handSpread: this.handSpread,
      bloomActive: this.bloomActive,
      bloomDwellProgress: this.bloomDwellProgress,
      pinchStates: [this.hands[0].isPinching, this.hands[1].isPinching],
      grabbedOrbIds: [this.hands[0].grabbedOrbId, this.hands[1].grabbedOrbId],
      previewPoint,
    };
  }
}
