import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  BOTANICAL_SPECIES,
  CLEARING_MAX_RADIUS,
  CLEARING_MIN_RADIUS,
  MAX_ELEVATION,
  MIN_ELEVATION,
  TOTAL_STEPS,
  clamp,
  computeConductingMetrics,
  computeHarmonicLinks,
  createOrbId,
  elevationToNoteDegree,
  getOrbMidi,
  getOrbNoteLabel,
  quantizeOrbPosition,
  stepToAngleRadians,
} from './musicTheory';
import {
  GardenEnvironmentHandle,
  SKY_PALETTES,
  SeedPreviewHandle,
  SoundOrbPlantHandle,
  SpatialHandRigHandle,
  createGardenEnvironment,
  createSeedPreviewRing,
  createSoundOrbPlant,
  createSpatialHandRig,
  groundHeightAt,
} from './gardenMeshes';
import { LivingSoundGardenAudioEngine } from './spatialAudioEngine';
import {
  XRHandFrameInput,
  XRHandInteractionController,
  XROrbTarget,
  XRSessionLifecycleManager,
  probeWebXRSupport,
} from './xrHandController';
import {
  CameraPresetId,
  GardenEngineSnapshot,
  GardenMode,
  HarmonicLink,
  ScaleId,
  SkyMoodId,
  SoundOrb,
  SoundSpeciesId,
  XRTrackingStatus,
} from './types';

// Reusable math scratch variables (zero per-frame GC allocations)
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _vMid = new THREE.Vector3();
const _vFwd = new THREE.Vector3();
const _vUp = new THREE.Vector3();
const _vRight = new THREE.Vector3();
const _vCamPos = new THREE.Vector3();
const _vHandLeft = new THREE.Vector3();
const _vHandRight = new THREE.Vector3();
const _vPointer = new THREE.Vector2();
const _dragNormal = new THREE.Vector3(0, 1, 0);
const _dragPlane = new THREE.Plane();
const _planeHit = new THREE.Vector3();
const _xrQuat = new THREE.Quaternion();
const _xrDir = new THREE.Vector3();
const _xrDummy = new THREE.Object3D();

const CAMERA_PRESETS: Record<
  CameraPresetId,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  sanctuary: { pos: [0, 5.4, 11.4], target: [0, 1.15, -0.4] },
  podium: { pos: [0, 2.35, 7.6], target: [0, 1.45, -1.2] },
  aerial: { pos: [0.2, 13.8, 7.2], target: [0, 0.4, 0] },
  blossom: { pos: [4.2, 2.1, 4.8], target: [0, 1.55, 0] },
};

export interface LivingSoundGardenCallbacks {
  onOrbsChange: (orbs: SoundOrb[]) => void;
  onSelectOrb: (orbId: string | null) => void;
  onSnapshot: (snapshot: GardenEngineSnapshot) => void;
}

interface HarmonicArcEntry {
  link: HarmonicLink;
  line: THREE.Line;
  material: THREE.LineBasicMaterial;
  geometry: THREE.BufferGeometry;
}

export class LivingSoundGardenEngine {
  private container: HTMLElement;
  private callbacks: LivingSoundGardenCallbacks;
  private audio = new LivingSoundGardenAudioEngine();

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private pmremGenerator: THREE.PMREMGenerator;
  private envRenderTarget: THREE.WebGLRenderTarget;

  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private rimLight: THREE.DirectionalLight;
  private bloomPointLight: THREE.PointLight;
  private fog: THREE.FogExp2;

  private environment: GardenEnvironmentHandle;
  private seedPreview: SeedPreviewHandle;
  private leftHandRig: SpatialHandRigHandle;
  private rightHandRig: SpatialHandRigHandle;

  // WebXR session & deterministic hand/controller tracking
  private xrLifecycle = new XRSessionLifecycleManager();
  private xrHandController = new XRHandInteractionController();
  private xrHands: THREE.Group[] = [];
  private xrControllers: THREE.Group[] = [];
  private xrControllerRays: THREE.Line[] = [];
  private xrControllerConnected: [boolean, boolean] = [false, false];
  private xrControllerGrabbedOrbId: [string | null, string | null] = [null, null];
  private xrHandMarkers: THREE.InstancedMesh[] = [];
  private xrHandCount = 0;
  private xrTrackingStatus: XRTrackingStatus = 'inactive';
  private bloomDwellProgress = 0;

  // State synchronized from React
  private orbs: SoundOrb[] = [];
  private plantHandles = new Map<string, SoundOrbPlantHandle>();
  private orbHitTargets: THREE.Object3D[] = [];
  private plantPulses = new Map<string, number>();
  private harmonicArcs: HarmonicArcEntry[] = [];
  private harmonicGroup = new THREE.Group();
  private lastHarmonicRebuildMs = 0;
  private harmonicRebuildPending = false;

  private mode: GardenMode = 'plant';
  private activeSpecies: SoundSpeciesId = 'bellflower';
  private scaleId: ScaleId = 'f-lydian';
  private baseBpm = 88;
  private skyMood: SkyMoodId = 'golden-dawn';
  private selectedOrbId: string | null = null;
  private hoveredOrbId: string | null = null;

  // Transport & conducting state
  private isPlaying = true;
  private stepAccumulator = 0;
  private currentStep = 0;
  private playheadAngle = 0;
  private bloomLevel = 0.18;
  private crescendoHeld = false;
  private crescendoLocked = false;
  private handLift = 0.25;
  private handSpread = 0.3;
  private tempoNudge = 0;
  private pointerNormalized = { x: 0, y: 0.35 };
  private lastPointerX = 0;
  private pointerInside = false;

  // Desktop sculpting drag state
  private raycaster = new THREE.Raycaster();
  private draggingOrbId: string | null = null;
  private dragStartY = 0;
  private dragStartElevation = 1.5;
  private dragStartClientY = 0;
  private dragStartClientX = 0;
  private dragMoved = false;
  private lastSculptDegree = -1;
  private hoveredPreview: GardenEngineSnapshot['hoveredPreview'] = null;

  // Camera smooth damping preset transition
  private cameraTargetPos: THREE.Vector3 | null = null;
  private cameraTargetLook: THREE.Vector3 | null = null;

  // Webcam hands-free conducting state (strictly local-only, zero upload)
  private webcamActive = false;
  private webcamPaused = false;
  private webcamError: string | null = null;
  private webcamStream: MediaStream | null = null;
  private webcamVideo: HTMLVideoElement | null = null;
  private webcamCanvas: HTMLCanvasElement | null = null;
  private webcamCtx: CanvasRenderingContext2D | null = null;
  private prevWebcamFrame: Uint8ClampedArray | null = null;
  private webcamTimer = 0;

  // Accessibility & renderer lifecycle bookkeeping
  private reducedMotion = false;
  private reducedMotionQuery: MediaQueryList | null = null;
  private isSoftwareGl = false;
  private contextLost = false;
  private disposed = false;
  private rafId: number | null = null;
  private fenceTimerId: number | null = null;
  private lastFrameMs = 0;
  private elapsedTime = 0;
  private snapshotTimer = 0;
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    container: HTMLElement,
    initialOrbs: SoundOrb[],
    initialScale: ScaleId,
    initialBpm: number,
    initialSkyMood: SkyMoodId,
    callbacks: LivingSoundGardenCallbacks
  ) {
    this.container = container;
    this.callbacks = callbacks;
    this.scaleId = initialScale;
    this.baseBpm = initialBpm;
    this.skyMood = initialSkyMood;

    // 1. Create renderer with software WebGL detection and immediate probe context cleanup
    const probeCanvas = document.createElement('canvas');
    const probeGl =
      probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (probeGl) {
      const dbg = probeGl.getExtension('WEBGL_debug_renderer_info');
      const rendererStr = dbg
        ? String(probeGl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
        : String(probeGl.getParameter(probeGl.RENDERER));
      this.isSoftwareGl =
        /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
      // Release temporary probe context immediately to preserve browser WebGL context budget
      probeGl.getExtension('WEBGL_lose_context')?.loseContext();
    }

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);
    this.renderer.setSize(width, height, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.touchAction = 'none';
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.xr.enabled = true;
    container.appendChild(this.renderer.domElement);

    // 2. Scene, studio IBL (`RoomEnvironment`), and atmospheric horizon fog
    this.scene = new THREE.Scene();
    const palette = SKY_PALETTES[this.skyMood];
    this.fog = new THREE.FogExp2(palette.fogColor, palette.fogDensity);
    this.scene.fog = this.fog;

    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.envRenderTarget = this.pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    );
    this.scene.environment = this.envRenderTarget.texture;
    this.scene.environmentIntensity = 0.68;

    // 3. Camera & OrbitControls
    this.camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 180);
    this.camera.position.set(...CAMERA_PRESETS.sanctuary.pos);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(...CAMERA_PRESETS.sanctuary.target);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.065;
    this.controls.maxPolarAngle = Math.PI * 0.465;
    this.controls.minPolarAngle = 0.18;
    this.controls.minDistance = 4.2;
    this.controls.maxDistance = 24;
    this.controls.enablePan = false;
    this.controls.addEventListener('start', () => {
      // Immediately cancel preset flight if user grabs the camera
      this.cameraTargetPos = null;
      this.cameraTargetLook = null;
    });
    this.controls.update();

    // 4. Three-point outdoor lighting rig
    this.hemiLight = new THREE.HemisphereLight(
      palette.hemiSky,
      palette.hemiGround,
      palette.hemiIntensity
    );
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(
      palette.sunColor,
      palette.sunIntensity
    );
    this.sunLight.position.set(14, 18, 10);
    this.sunLight.castShadow = !this.isSoftwareGl;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.near = 2;
    this.sunLight.shadow.camera.far = 48;
    this.sunLight.shadow.camera.left = -13;
    this.sunLight.shadow.camera.right = 13;
    this.sunLight.shadow.camera.top = 13;
    this.sunLight.shadow.camera.bottom = -13;
    this.sunLight.shadow.bias = -0.0005;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);

    this.rimLight = new THREE.DirectionalLight(
      palette.rimColor,
      palette.rimIntensity
    );
    this.rimLight.position.set(-12, 8, -14);
    this.scene.add(this.rimLight);

    // Warm sanctuary center glow that swells during Signature Conduct Bloom
    this.bloomPointLight = new THREE.PointLight('#ffd580', 0.4, 18, 1.4);
    this.bloomPointLight.position.set(0, 2.2, 0);
    this.scene.add(this.bloomPointLight);

    // 5. Build outdoor environment, harmonic link group, seed preview & spatial hands
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.environment = createGardenEnvironment(
      this.skyMood,
      maxAniso,
      this.isSoftwareGl
    );
    this.scene.add(this.environment.group);
    this.scene.add(this.harmonicGroup);

    this.seedPreview = createSeedPreviewRing();
    this.scene.add(this.seedPreview.group);

    this.leftHandRig = createSpatialHandRig('left');
    this.rightHandRig = createSpatialHandRig('right');
    this.scene.add(this.leftHandRig.group);
    this.scene.add(this.rightHandRig.group);

    // 6. Initialize Meta Quest WebXR hand-tracking markers & session availability
    this.setupWebXR();

    // 7. Load initial orbs & pre-warm shaders on hardware GPUs
    this.setOrbs(initialOrbs);
    if (!this.isSoftwareGl) {
      try {
        this.renderer.compile(this.scene, this.camera);
      } catch {
        // non-fatal pre-warm fallback
      }
    }

    // 8. Bind pointer, wheel, keyboard, reduced-motion, resize, and context-loss events
    this.bindEvents();

    // 9. Start render loop
    this.lastFrameMs = performance.now();
    this.startLoop();
    this.emitSnapshot();
  }

  private get xrActive(): boolean {
    return this.xrLifecycle.isActive();
  }

  private setupWebXR(): void {
    // Prepare instanced pearl joint visualizers for left & right Meta Quest XR hands
    const jointGeo = new THREE.SphereGeometry(0.011, 8, 8);
    const jointMat = new THREE.MeshStandardMaterial({
      color: '#fff1cc',
      emissive: new THREE.Color('#f0c05e'),
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.2,
    });

    const rayGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -6.5),
    ]);
    const rayMat = new THREE.LineBasicMaterial({
      color: '#f4d386',
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

    for (let h = 0; h < 2; h++) {
      const handIdx = h as 0 | 1;

      // CRITICAL: Attach Three.js XR hand spaces to the scene so joint matrices update in WebXR!
      const xrHand = this.renderer.xr.getHand(handIdx);
      this.scene.add(xrHand);
      this.xrHands.push(xrHand);

      const mesh = new THREE.InstancedMesh(jointGeo, jointMat, 25);
      mesh.frustumCulled = false;
      mesh.visible = false;
      this.scene.add(mesh);
      this.xrHandMarkers.push(mesh);

      // Gated Touch controller fallback (suppressed automatically whenever native hand tracking is active)
      const ctrl = this.renderer.xr.getController(handIdx);
      const rayLine = new THREE.Line(rayGeo.clone(), rayMat.clone());
      rayLine.visible = false;
      ctrl.add(rayLine);
      this.xrControllerRays.push(rayLine);

      ctrl.addEventListener('connected', (event: { data?: { hand?: unknown } }) => {
        // Ignore optical hand input sources so they never display controller laser rays
        const isOpticalHand = Boolean(event?.data?.hand);
        this.xrControllerConnected[handIdx] = !isOpticalHand;
      });
      ctrl.addEventListener('disconnected', () => {
        this.xrControllerConnected[handIdx] = false;
        this.xrControllerGrabbedOrbId[handIdx] = null;
        rayLine.visible = false;
      });
      ctrl.addEventListener('selectstart', () => {
        this.handleXRSelectStart(handIdx, ctrl);
      });
      ctrl.addEventListener('selectend', () => {
        if (this.xrControllerGrabbedOrbId[handIdx]) {
          this.xrControllerGrabbedOrbId[handIdx] = null;
          this.rebuildHarmonicArcs();
          this.callbacks.onOrbsChange([...this.orbs]);
        }
      });
      this.scene.add(ctrl);
      this.xrControllers.push(ctrl);
    }

    rayGeo.dispose();
    rayMat.dispose();

    const xrSystem = typeof navigator !== 'undefined' ? navigator.xr : undefined;
    void probeWebXRSupport(xrSystem).then((supported) => {
      if (this.disposed) return;
      this.xrLifecycle.setSupported(supported);
      this.emitSnapshot();
    });
  }

  private handleXRSelectStart(handIdx: 0 | 1, ctrl: THREE.Object3D): void {
    const nowMs = performance.now();
    // Never allow Touch controller events to override or double-fire alongside native hand tracking
    if (!this.xrHandController.shouldAllowControllerFallback(handIdx, nowMs)) {
      return;
    }

    this.audio.ensureStarted();
    const origin = ctrl.getWorldPosition(_vA);
    _xrDir.set(0, 0, -1).applyQuaternion(ctrl.getWorldQuaternion(_xrQuat));
    this.raycaster.set(origin, _xrDir);

    const orbHits = this.raycaster.intersectObjects(this.orbHitTargets, false);
    if (orbHits.length > 0) {
      const orbId = orbHits[0].object.userData.orbId as string;
      this.xrControllerGrabbedOrbId[handIdx] = orbId;
      this.selectedOrbId = orbId;
      this.callbacks.onSelectOrb(orbId);
      const orb = this.orbs.find((o) => o.id === orbId);
      if (orb) {
        this.plantPulses.set(orbId, 0.92);
        this.audio.triggerOrb(orb, this.scaleId, this.getCurrentMetrics());
      }
      return;
    }

    // Plant orb where Touch controller points on clearing
    const groundHits = this.raycaster.intersectObject(
      this.environment.groundCollider,
      false
    );
    if (groundHits.length > 0) {
      const pt = groundHits[0].point;
      const dist = Math.hypot(pt.x, pt.z);
      if (dist >= CLEARING_MIN_RADIUS - 0.6 && dist <= CLEARING_MAX_RADIUS + 0.8) {
        this.plantOrbAt(
          pt.x,
          pt.z,
          BOTANICAL_SPECIES[this.activeSpecies].defaultElevation
        );
      }
    }
  }

  public unlockAudio(): void {
    this.audio.ensureStarted();
    this.emitSnapshot();
  }

  public async toggleVRSession(): Promise<{ started: boolean; message?: string }> {
    this.audio.ensureStarted();
    const xrSystem = typeof navigator !== 'undefined' ? navigator.xr : undefined;
    const result = await this.xrLifecycle.requestImmersiveSession({
      xr: xrSystem,
      attachSession: async (session) => {
        // Stop any desktop local webcam before entering immersive VR
        if (this.webcamActive) {
          this.stopWebcam();
        }
        await this.renderer.xr.setSession(session as unknown as XRSession);
        this.stopNonXRLoop();
        this.renderer.setAnimationLoop((timestamp) => {
          this.stepFrame(timestamp);
        });
      },
      onSessionEnded: () => {
        this.xrHandController.reset('session-end');
        this.xrHandCount = 0;
        this.xrTrackingStatus = 'inactive';
        this.bloomDwellProgress = 0;
        this.xrControllerGrabbedOrbId = [null, null];
        this.xrControllerConnected = [false, false];
        this.xrHandMarkers.forEach((m) => {
          m.visible = false;
        });
        this.xrControllerRays.forEach((r) => {
          r.visible = false;
        });
        this.crescendoHeld = false;
        this.seedPreview.update(false, 0, 0, 1, this.activeSpecies, this.elapsedTime);
        this.renderer.setAnimationLoop(null);
        if (!this.disposed && !this.contextLost) {
          this.startLoop();
        }
        this.emitSnapshot();
      },
    });

    this.emitSnapshot();
    return result;
  }

  public async toggleWebcamConducting(): Promise<void> {
    if (this.webcamActive) {
      this.stopWebcam();
      this.emitSnapshot();
      return;
    }

    this.audio.ensureStarted();
    this.webcamError = null;
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      this.webcamError = 'Webcam unavailable in this browser.';
      this.emitSnapshot();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 160, height: 120, facingMode: 'user' },
        audio: false,
      });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = 80;
      canvas.height = 60;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      this.webcamStream = stream;
      this.webcamVideo = video;
      this.webcamCanvas = canvas;
      this.webcamCtx = ctx;
      this.prevWebcamFrame = null;
      this.webcamActive = true;
      this.webcamPaused = false;
      this.mode = 'conduct';
      this.emitSnapshot();
    } catch {
      this.webcamError = 'Camera permission declined. Use mouse or VR hands to conduct.';
      this.stopWebcam();
      this.emitSnapshot();
    }
  }

  public toggleWebcamPause(): void {
    if (!this.webcamActive) return;
    this.webcamPaused = !this.webcamPaused;
    if (this.webcamPaused) {
      this.prevWebcamFrame = null;
      this.crescendoHeld = false;
    }
    this.emitSnapshot();
  }

  public stopWebcamNow(): void {
    this.stopWebcam();
    this.emitSnapshot();
  }

  private stopWebcam(): void {
    this.webcamActive = false;
    this.webcamPaused = false;
    if (this.webcamVideo) {
      try {
        this.webcamVideo.pause();
        this.webcamVideo.srcObject = null;
      } catch {
        // noop
      }
      this.webcamVideo = null;
    }
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach((t) => t.stop());
      this.webcamStream = null;
    }
    this.webcamCanvas = null;
    this.webcamCtx = null;
    this.prevWebcamFrame = null;
  }

  private sampleWebcamMotion(): void {
    if (
      !this.webcamActive ||
      this.webcamPaused ||
      !this.webcamVideo ||
      !this.webcamCtx ||
      !this.webcamCanvas
    ) {
      return;
    }
    const w = this.webcamCanvas.width;
    const h = this.webcamCanvas.height;
    this.webcamCtx.drawImage(this.webcamVideo, 0, 0, w, h);
    const data = this.webcamCtx.getImageData(0, 0, w, h).data;

    if (this.prevWebcamFrame) {
      let leftWeight = 0;
      let leftY = 0;
      let rightWeight = 0;
      let rightY = 0;

      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          const idx = (y * w + x) * 4;
          const diff =
            Math.abs(data[idx] - this.prevWebcamFrame[idx]) +
            Math.abs(data[idx + 1] - this.prevWebcamFrame[idx + 1]) +
            Math.abs(data[idx + 2] - this.prevWebcamFrame[idx + 2]);
          if (diff > 54) {
            // Mirrored horizontally for natural webcam conducting feel
            const normY = 1 - y / h;
            if (x > w * 0.5) {
              leftWeight += diff;
              leftY += normY * diff;
            } else {
              rightWeight += diff;
              rightY += normY * diff;
            }
          }
        }
      }

      const totalMotion = leftWeight + rightWeight;
      if (totalMotion > 900) {
        const avgLift =
          ((leftWeight > 0 ? leftY / leftWeight : 0.45) +
            (rightWeight > 0 ? rightY / rightWeight : 0.45)) *
          0.5;
        this.handLift = THREE.MathUtils.lerp(this.handLift, clamp(avgLift, 0.1, 1), 0.35);
        this.handSpread = THREE.MathUtils.lerp(
          this.handSpread,
          leftWeight > 450 && rightWeight > 450 ? 0.85 : 0.42,
          0.25
        );
        // Raising both hands high in front of webcam triggers the Signature Bloom!
        this.crescendoHeld =
          avgLift > 0.7 && leftWeight > 550 && rightWeight > 550;
      } else {
        this.crescendoHeld = false;
      }
    }

    if (!this.prevWebcamFrame || this.prevWebcamFrame.length !== data.length) {
      this.prevWebcamFrame = new Uint8ClampedArray(data);
    } else {
      this.prevWebcamFrame.set(data);
    }
  }

  public setMode(mode: GardenMode): void {
    this.mode = mode;
    if (mode !== 'plant') {
      this.hoveredPreview = null;
      this.seedPreview.update(false, 0, 0, 1, this.activeSpecies, this.elapsedTime);
    }
    this.emitSnapshot();
  }

  public setSpecies(species: SoundSpeciesId): void {
    this.activeSpecies = species;
  }

  public setScale(scaleId: ScaleId): void {
    this.scaleId = scaleId;
    this.rebuildHarmonicArcs();
  }

  public setBpm(bpm: number): void {
    this.baseBpm = clamp(Math.round(bpm), 48, 160);
  }

  public setSkyMood(mood: SkyMoodId): void {
    this.skyMood = mood;
    const p = SKY_PALETTES[mood];
    this.environment.skyMaterial.uniforms.uTopColor.value.set(p.skyTop);
    this.environment.skyMaterial.uniforms.uHorizonColor.value.set(p.skyHorizon);
    this.fog.color.set(p.fogColor);
    this.fog.density = p.fogDensity;
    this.sunLight.color.set(p.sunColor);
    this.sunLight.intensity = p.sunIntensity;
    this.hemiLight.color.set(p.hemiSky);
    this.hemiLight.groundColor.set(p.hemiGround);
    this.hemiLight.intensity = p.hemiIntensity;
    this.rimLight.color.set(p.rimColor);
    this.rimLight.intensity = p.rimIntensity;
    this.environment.waterMaterial.color.set(p.waterColor);
    this.environment.waterMaterial.emissive.set(p.waterEmissive);
  }

  public setPlaying(playing: boolean): void {
    if (playing) {
      this.audio.ensureStarted();
    }
    this.isPlaying = playing;
    this.emitSnapshot();
  }

  public setMuted(muted: boolean): void {
    this.audio.setMuted(muted);
  }

  public setAmbienceEnabled(enabled: boolean): void {
    this.audio.setAmbienceEnabled(enabled);
  }

  public setSelectedOrb(orbId: string | null): void {
    this.selectedOrbId = orbId;
  }

  public triggerBloomCrescendo(active: boolean, locked = false): void {
    this.audio.ensureStarted();
    const wasActive = this.crescendoHeld || this.crescendoLocked;
    if (locked) {
      this.crescendoLocked = active;
    } else {
      this.crescendoHeld = active;
    }
    const isNowActive = this.crescendoHeld || this.crescendoLocked;

    if (isNowActive && !wasActive) {
      this.handLift = Math.max(this.handLift, 0.88);
      this.handSpread = Math.max(this.handSpread, 0.86);
      this.audio.playBloomCrescendoSwell(this.scaleId);
      // Ripple every orb softly in response to the grand bloom command
      for (const orb of this.orbs) {
        if (!orb.muted) {
          this.plantPulses.set(orb.id, 0.95);
        }
      }
      if (!this.isPlaying) {
        this.isPlaying = true;
      }
    }
    this.emitSnapshot();
  }

  public flyToCameraPreset(preset: CameraPresetId): void {
    const cfg = CAMERA_PRESETS[preset];
    if (!cfg) return;
    this.cameraTargetPos = new THREE.Vector3(...cfg.pos);
    this.cameraTargetLook = new THREE.Vector3(...cfg.target);
  }

  public setOrbs(nextOrbs: SoundOrb[]): void {
    this.orbs = nextOrbs.map((o) => ({ ...o }));
    const nextIds = new Set(this.orbs.map((o) => o.id));

    // Remove pruned plants
    for (const [id, handle] of this.plantHandles.entries()) {
      if (!nextIds.has(id)) {
        this.scene.remove(handle.group);
        handle.dispose();
        this.plantHandles.delete(id);
        this.plantPulses.delete(id);
      }
    }

    // Add or reposition plants
    for (const orb of this.orbs) {
      let handle = this.plantHandles.get(orb.id);
      if (!handle) {
        handle = createSoundOrbPlant(orb, this.isSoftwareGl);
        this.scene.add(handle.group);
        this.plantHandles.set(orb.id, handle);
        this.plantPulses.set(orb.id, 0.8);
      } else if (handle.species !== orb.species) {
        this.scene.remove(handle.group);
        handle.dispose();
        handle = createSoundOrbPlant(orb, this.isSoftwareGl);
        this.scene.add(handle.group);
        this.plantHandles.set(orb.id, handle);
      }
      handle.group.position.set(orb.x, groundHeightAt(orb.x, orb.z), orb.z);
    }

    // Cache raycast targets cleanly whenever orbs change (zero per-pointermove allocations)
    this.orbHitTargets = Array.from(this.plantHandles.values()).map(
      (p) => p.orbHitMesh
    );

    this.rebuildHarmonicArcs();
  }

  private scheduleHarmonicArcRebuild(nowMs: number): void {
    if (nowMs - this.lastHarmonicRebuildMs >= 65) {
      this.rebuildHarmonicArcs();
      this.lastHarmonicRebuildMs = nowMs;
      this.harmonicRebuildPending = false;
    } else {
      this.harmonicRebuildPending = true;
    }
  }

  private rebuildHarmonicArcs(): void {
    for (const arc of this.harmonicArcs) {
      this.harmonicGroup.remove(arc.line);
      arc.geometry.dispose();
      arc.material.dispose();
    }
    this.harmonicArcs = [];

    const links = computeHarmonicLinks(this.orbs, this.scaleId);
    const orbById = new Map(this.orbs.map((o) => [o.id, o]));

    for (const link of links) {
      const a = orbById.get(link.fromId);
      const b = orbById.get(link.toId);
      if (!a || !b) continue;

      const ay = groundHeightAt(a.x, a.z) + a.elevation + 0.16;
      const by = groundHeightAt(b.x, b.z) + b.elevation + 0.16;
      const midY = Math.max(ay, by) + 0.75 + Math.hypot(a.x - b.x, a.z - b.z) * 0.12;

      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(a.x, ay, a.z),
        new THREE.Vector3((a.x + b.x) * 0.5, midY, (a.z + b.z) * 0.5),
        new THREE.Vector3(b.x, by, b.z)
      );
      const pts = curve.getPoints(18);
      const geometry = new THREE.BufferGeometry().setFromPoints(pts);
      const material = new THREE.LineBasicMaterial({
        color:
          link.intervalLabel === 'octave'
            ? '#ffe7a6'
            : link.intervalLabel === 'fifth'
            ? '#a9ebd8'
            : '#f3be9b',
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(geometry, material);
      this.harmonicGroup.add(line);
      this.harmonicArcs.push({ link, line, material, geometry });
    }
  }

  private plantOrbAt(rawX: number, rawZ: number, rawElevation: number): void {
    if (this.orbs.length >= 28) return;
    this.audio.ensureStarted();

    const quantized = quantizeOrbPosition(rawX, rawZ, rawElevation);
    const spec = BOTANICAL_SPECIES[this.activeSpecies];
    const orb: SoundOrb = {
      id: createOrbId(),
      species: this.activeSpecies,
      x: quantized.x,
      z: quantized.z,
      elevation: quantized.elevation,
      step: quantized.step,
      noteDegree: quantized.noteDegree,
      sustain: spec.defaultSustain,
      velocity: 0.82,
      muted: false,
      plantedAt: Date.now(),
    };

    const next = [...this.orbs, orb];
    this.setOrbs(next);
    this.selectedOrbId = orb.id;
    this.plantPulses.set(orb.id, 1.0);

    const metrics = this.getCurrentMetrics();
    this.audio.triggerOrb(orb, this.scaleId, metrics);

    this.callbacks.onOrbsChange(next);
    this.callbacks.onSelectOrb(orb.id);
  }

  private updatePointerCoords(ev: PointerEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const nx = ((ev.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
    const ny = -((ev.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
    _vPointer.set(nx, ny);
    this.pointerNormalized.x = nx;
    this.pointerNormalized.y = clamp((ny + 1) * 0.5, 0, 1);
  }

  private bindEvents(): void {
    const dom = this.renderer.domElement;

    const onPointerDown = (ev: PointerEvent) => {
      if (this.xrActive) return;
      this.audio.ensureStarted();
      this.updatePointerCoords(ev);
      this.raycaster.setFromCamera(_vPointer, this.camera);

      // Conduct mode: holding pointer unleashes the living bloom crescendo!
      if (this.mode === 'conduct' && ev.button === 0) {
        this.controls.enabled = false;
        this.triggerBloomCrescendo(true, false);
        return;
      }

      const orbHits = this.raycaster.intersectObjects(this.orbHitTargets, false);

      if (orbHits.length > 0 && ev.button === 0) {
        const orbId = orbHits[0].object.userData.orbId as string;
        const orb = this.orbs.find((o) => o.id === orbId);
        if (orb) {
          this.selectedOrbId = orbId;
          this.callbacks.onSelectOrb(orbId);
          this.plantPulses.set(orbId, 0.92);
          this.audio.triggerOrb(orb, this.scaleId, this.getCurrentMetrics());

          if (this.mode === 'sculpt') {
            this.draggingOrbId = orbId;
            this.dragStartElevation = orb.elevation;
            this.dragStartClientY = ev.clientY;
            this.dragStartClientX = ev.clientX;
            this.dragMoved = false;
            this.lastSculptDegree = orb.noteDegree;
            this.controls.enabled = false;

            // Horizontal drag plane at ground height for moving radial step
            _vA.set(orb.x, groundHeightAt(orb.x, orb.z), orb.z);
            _dragPlane.setFromNormalAndCoplanarPoint(_dragNormal, _vA);
          }
          return;
        }
      }

      // Plant mode: click clearing terrain to plant a new botanical sound orb
      if (this.mode === 'plant' && ev.button === 0) {
        const hits = this.raycaster.intersectObject(
          this.environment.groundCollider,
          false
        );
        if (hits.length > 0) {
          const pt = hits[0].point;
          const dist = Math.hypot(pt.x, pt.z);
          if (dist >= CLEARING_MIN_RADIUS - 0.6 && dist <= CLEARING_MAX_RADIUS + 0.8) {
            this.dragStartClientX = ev.clientX;
            this.dragStartClientY = ev.clientY;
            this.dragStartY = 1; // flag candidate plant click
          }
        }
      }
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (this.xrActive) return;
      this.pointerInside = true;
      this.updatePointerCoords(ev);
      this.raycaster.setFromCamera(_vPointer, this.camera);

      // Conduct mode: pointer elevation & lateral sweep directly shape dynamics & phrasing
      if (this.mode === 'conduct') {
        const vx = this.pointerNormalized.x - this.lastPointerX;
        this.lastPointerX = this.pointerNormalized.x;
        this.handLift = THREE.MathUtils.lerp(
          this.handLift,
          clamp(this.pointerNormalized.y * 1.08, 0.08, 1),
          0.26
        );
        this.handSpread = THREE.MathUtils.lerp(
          this.handSpread,
          clamp(0.28 + Math.abs(this.pointerNormalized.x) * 0.72, 0.2, 1),
          0.2
        );
        this.tempoNudge = clamp(this.tempoNudge * 0.88 + vx * 0.45, -0.18, 0.18);

        // Brushing cursor across flowers triggers delicate crystalline harp shimmers!
        const brushHits = this.raycaster.intersectObjects(this.orbHitTargets, false);
        if (brushHits.length > 0) {
          const id = brushHits[0].object.userData.orbId as string;
          const orb = this.orbs.find((o) => o.id === id);
          if (orb && !orb.muted) {
            this.plantPulses.set(id, Math.max(this.plantPulses.get(id) ?? 0, 0.75));
            this.audio.playPetalBrush(
              orb.x,
              orb.elevation + 0.3,
              orb.z,
              getOrbMidi(orb, this.scaleId)
            );
          }
        }
        return;
      }

      // Active sculpting drag
      if (this.draggingOrbId) {
        const idx = this.orbs.findIndex((o) => o.id === this.draggingOrbId);
        if (idx >= 0) {
          const orb = this.orbs[idx];
          const dyPx = this.dragStartClientY - ev.clientY;
          const dxPx = Math.abs(ev.clientX - this.dragStartClientX);
          if (Math.abs(dyPx) > 4 || dxPx > 4) {
            this.dragMoved = true;
          }

          // Vertical pointer motion sculpts pitch elevation smoothly; Shift or horizontal drag orbits step
          const nextElevation = clamp(
            this.dragStartElevation + dyPx * 0.011,
            MIN_ELEVATION,
            MAX_ELEVATION
          );
          let nextX = orb.x;
          let nextZ = orb.z;

          if (ev.shiftKey || Math.abs(ev.clientX - this.dragStartClientX) > 26) {
            if (this.raycaster.ray.intersectPlane(_dragPlane, _planeHit)) {
              nextX = _planeHit.x;
              nextZ = _planeHit.z;
            }
          }

          const quantized = quantizeOrbPosition(nextX, nextZ, nextElevation);
          const updated: SoundOrb = {
            ...orb,
            x: quantized.x,
            z: quantized.z,
            elevation: quantized.elevation,
            step: quantized.step,
            noteDegree: quantized.noteDegree,
          };
          this.orbs[idx] = updated;
          const handle = this.plantHandles.get(orb.id);
          if (handle) {
            handle.group.position.set(
              updated.x,
              groundHeightAt(updated.x, updated.z),
              updated.z
            );
          }

          // Audition crystalline note feedback whenever sculpted pitch crosses a scale degree
          if (updated.noteDegree !== this.lastSculptDegree) {
            this.lastSculptDegree = updated.noteDegree;
            this.plantPulses.set(updated.id, 0.92);
            this.audio.triggerOrb(updated, this.scaleId, this.getCurrentMetrics());
          }
          this.scheduleHarmonicArcRebuild(performance.now());
          this.callbacks.onOrbsChange([...this.orbs]);
        }
        return;
      }

      // Hover detection over existing orbs
      const orbHits = this.raycaster.intersectObjects(this.orbHitTargets, false);
      this.hoveredOrbId =
        orbHits.length > 0 ? (orbHits[0].object.userData.orbId as string) : null;

      // Plant mode preview ring on clearing
      if (this.mode === 'plant' && !this.hoveredOrbId) {
        const hits = this.raycaster.intersectObject(
          this.environment.groundCollider,
          false
        );
        if (hits.length > 0) {
          const pt = hits[0].point;
          const dist = Math.hypot(pt.x, pt.z);
          if (dist >= CLEARING_MIN_RADIUS - 0.5 && dist <= CLEARING_MAX_RADIUS + 0.7) {
            const spec = BOTANICAL_SPECIES[this.activeSpecies];
            const radialElev = clamp(
              MIN_ELEVATION +
                ((dist - CLEARING_MIN_RADIUS) /
                  (CLEARING_MAX_RADIUS - CLEARING_MIN_RADIUS)) *
                  (MAX_ELEVATION - MIN_ELEVATION) *
                  0.65 +
                spec.defaultElevation * 0.35,
              MIN_ELEVATION,
              MAX_ELEVATION
            );
            const q = quantizeOrbPosition(pt.x, pt.z, radialElev);
            this.seedPreview.update(
              true,
              q.x,
              q.z,
              q.elevation,
              this.activeSpecies,
              this.elapsedTime
            );
            this.hoveredPreview = {
              step: q.step,
              noteName: getOrbNoteLabel(
                { species: this.activeSpecies, noteDegree: q.noteDegree },
                this.scaleId
              ),
              x: q.x,
              z: q.z,
            };
            dom.style.cursor = 'crosshair';
            return;
          }
        }
      }

      this.seedPreview.update(false, 0, 0, 1, this.activeSpecies, this.elapsedTime);
      this.hoveredPreview = null;
      dom.style.cursor = this.hoveredOrbId
        ? this.mode === 'sculpt'
          ? 'ns-resize'
          : 'pointer'
        : 'grab';
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (this.xrActive) return;

      if (this.mode === 'conduct') {
        this.controls.enabled = true;
        this.triggerBloomCrescendo(false, false);
        return;
      }

      if (this.draggingOrbId) {
        this.draggingOrbId = null;
        this.controls.enabled = true;
        if (this.harmonicRebuildPending) {
          this.rebuildHarmonicArcs();
          this.harmonicRebuildPending = false;
        }
        return;
      }

      // Confirm crisp non-orbit click in Plant mode
      if (this.mode === 'plant' && this.dragStartY === 1) {
        this.dragStartY = 0;
        const moveDist = Math.hypot(
          ev.clientX - this.dragStartClientX,
          ev.clientY - this.dragStartClientY
        );
        if (moveDist < 8) {
          this.updatePointerCoords(ev);
          this.raycaster.setFromCamera(_vPointer, this.camera);
          const hits = this.raycaster.intersectObject(
            this.environment.groundCollider,
            false
          );
          if (hits.length > 0) {
            const pt = hits[0].point;
            const dist = Math.hypot(pt.x, pt.z);
            const spec = BOTANICAL_SPECIES[this.activeSpecies];
            const radialElev = clamp(
              MIN_ELEVATION +
                ((dist - CLEARING_MIN_RADIUS) /
                  (CLEARING_MAX_RADIUS - CLEARING_MIN_RADIUS)) *
                  (MAX_ELEVATION - MIN_ELEVATION) *
                  0.65 +
                spec.defaultElevation * 0.35,
              MIN_ELEVATION,
              MAX_ELEVATION
            );
            this.plantOrbAt(pt.x, pt.z, radialElev);
          }
        }
      }
    };

    const onPointerLeave = () => {
      this.pointerInside = false;
      this.hoveredOrbId = null;
      this.hoveredPreview = null;
      this.seedPreview.update(false, 0, 0, 1, this.activeSpecies, this.elapsedTime);
    };

    const onContextLost = (ev: Event) => {
      ev.preventDefault();
      this.contextLost = true;
      this.stopNonXRLoop();
      this.renderer.setAnimationLoop(null);
      this.emitSnapshot();
    };

    const onContextRestored = () => {
      this.contextLost = false;
      if (!this.disposed) {
        this.lastFrameMs = performance.now();
        if (this.xrActive) {
          this.renderer.setAnimationLoop((timestamp) => {
            this.stepFrame(timestamp);
          });
        } else {
          this.startLoop();
        }
      }
      this.emitSnapshot();
    };

    const onReducedMotionChange = (ev: MediaQueryListEvent) => {
      this.reducedMotion = ev.matches;
      this.emitSnapshot();
    };

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = this.reducedMotionQuery.matches;
      this.reducedMotionQuery.addEventListener?.('change', onReducedMotionChange);
    }

    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointerleave', onPointerLeave);
    dom.addEventListener('webglcontextlost', onContextLost, false);
    dom.addEventListener('webglcontextrestored', onContextRestored, false);

    this.resizeObserver = new ResizeObserver(() => {
      if (this.disposed || this.xrActive) return;
      const w = Math.max(this.container.clientWidth, 320);
      const h = Math.max(this.container.clientHeight, 320);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
    });
    this.resizeObserver.observe(this.container);

    this.cleanupListeners = () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointerleave', onPointerLeave);
      dom.removeEventListener('webglcontextlost', onContextLost);
      dom.removeEventListener('webglcontextrestored', onContextRestored);
      this.reducedMotionQuery?.removeEventListener?.('change', onReducedMotionChange);
    };
  }

  private cleanupListeners: () => void = () => {};

  private getCurrentMetrics() {
    return computeConductingMetrics(
      this.baseBpm,
      this.handLift,
      this.handSpread,
      this.tempoNudge,
      this.crescendoHeld || this.crescendoLocked
    );
  }

  private updateWebXRHands(nowMs: number, dt: number): void {
    if (!this.xrActive) return;

    const handInputs: [XRHandFrameInput, XRHandFrameInput] = [
      { handIndex: 0, tracked: false },
      { handIndex: 1, tracked: false },
    ];

    for (let h = 0; h < 2; h++) {
      const handIdx = h as 0 | 1;
      const xrHand = this.xrHands[handIdx] as THREE.Group & {
        joints?: Record<string, THREE.Object3D>;
      };
      const markerMesh = this.xrHandMarkers[handIdx];
      const jointsMap = xrHand?.joints;
      const jointValues = jointsMap ? Object.values(jointsMap) : [];
      const indexTip = jointsMap?.['index-finger-tip'];
      const thumbTip = jointsMap?.['thumb-tip'];
      const wrist = jointsMap?.['wrist'];
      const middleTip = jointsMap?.['middle-finger-tip'];
      const pinkyTip = jointsMap?.['pinky-finger-tip'];

      // Check that joint poses are genuinely tracked (non-empty and visible)
      const isTracked =
        jointValues.length > 0 &&
        Boolean(indexTip && thumbTip && (indexTip.visible !== false || wrist?.visible !== false)) &&
        (indexTip!.position.lengthSq() > 0.0001 || thumbTip!.position.lengthSq() > 0.0001);

      if (!isTracked) {
        markerMesh.visible = false;
        continue;
      }

      markerMesh.visible = true;
      for (let j = 0; j < Math.min(25, jointValues.length); j++) {
        const joint = jointValues[j];
        joint.getWorldPosition(_vA);
        _xrDummy.position.copy(_vA);
        _xrDummy.scale.setScalar(j === 4 || j === 9 ? 1.4 : 0.9);
        _xrDummy.updateMatrix();
        markerMesh.setMatrixAt(j, _xrDummy.matrix);
      }
      markerMesh.instanceMatrix.needsUpdate = true;

      const idxPos = indexTip!.getWorldPosition(new THREE.Vector3());
      const thmPos = thumbTip!.getWorldPosition(new THREE.Vector3());
      const wstPos = wrist ? wrist.getWorldPosition(new THREE.Vector3()) : undefined;
      const midPos = middleTip ? middleTip.getWorldPosition(new THREE.Vector3()) : undefined;
      const pnkPos = pinkyTip ? pinkyTip.getWorldPosition(new THREE.Vector3()) : undefined;

      handInputs[handIdx] = {
        handIndex: handIdx,
        tracked: true,
        wrist: wstPos ? { x: wstPos.x, y: wstPos.y, z: wstPos.z } : undefined,
        indexTip: { x: idxPos.x, y: idxPos.y, z: idxPos.z },
        thumbTip: { x: thmPos.x, y: thmPos.y, z: thmPos.z },
        middleTip: midPos ? { x: midPos.x, y: midPos.y, z: midPos.z } : undefined,
        pinkyTip: pnkPos ? { x: pnkPos.x, y: pnkPos.y, z: pnkPos.z } : undefined,
      };
    }

    const orbTargets: XROrbTarget[] = this.orbs.map((orb) => ({
      id: orb.id,
      x: orb.x,
      y: groundHeightAt(orb.x, orb.z) + orb.elevation,
      z: orb.z,
    }));

    const activeControllers =
      (this.xrControllerConnected[0] ? 1 : 0) +
      (this.xrControllerConnected[1] ? 1 : 0);

    const output = this.xrHandController.update({
      nowMs,
      dtSec: dt,
      hands: handInputs,
      orbs: orbTargets,
      activeControllerCount: activeControllers,
      canPlantMore: this.orbs.length < 28,
    });

    this.xrHandCount = output.trackedHandCount;
    this.xrTrackingStatus = output.trackingStatus;
    this.handLift = output.handLift;
    this.handSpread = output.handSpread;
    this.bloomDwellProgress = output.bloomDwellProgress;

    // Show non-hand Touch controller laser rays ONLY when controller fallback is active & permitted
    for (let h = 0; h < 2; h++) {
      const handIdx = h as 0 | 1;
      const allowFallback =
        this.xrControllerConnected[handIdx] &&
        this.xrHandController.shouldAllowControllerFallback(handIdx, nowMs);
      this.xrControllerRays[handIdx].visible = allowFallback;

      // Live ray-sculpting for Touch controller trigger fallback
      const grabbedByCtrl = this.xrControllerGrabbedOrbId[handIdx];
      if (allowFallback && grabbedByCtrl) {
        const ctrl = this.xrControllers[handIdx];
        const idx = this.orbs.findIndex((o) => o.id === grabbedByCtrl);
        if (idx >= 0) {
          const origin = ctrl.getWorldPosition(_vA);
          _xrDir.set(0, 0, -1).applyQuaternion(ctrl.getWorldQuaternion(_xrQuat));
          _vB.copy(origin).addScaledVector(_xrDir, 3.2);
          const q = quantizeOrbPosition(_vB.x, _vB.z, _vB.y);
          const prevDeg = this.orbs[idx].noteDegree;
          this.orbs[idx] = { ...this.orbs[idx], ...q };
          const handle = this.plantHandles.get(this.orbs[idx].id);
          handle?.group.position.set(q.x, groundHeightAt(q.x, q.z), q.z);
          if (q.noteDegree !== prevDeg) {
            this.plantPulses.set(this.orbs[idx].id, 0.92);
            this.audio.triggerOrb(this.orbs[idx], this.scaleId, this.getCurrentMetrics());
            this.scheduleHarmonicArcRebuild(nowMs);
          }
        }
      }
    }

    // Show spatial VR seed preview ring when hovering index finger over clearing
    if (output.previewPoint) {
      const q = quantizeOrbPosition(
        output.previewPoint.x,
        output.previewPoint.z,
        clamp(output.previewPoint.y, MIN_ELEVATION, MAX_ELEVATION)
      );
      this.seedPreview.update(
        true,
        q.x,
        q.z,
        q.elevation,
        this.activeSpecies,
        this.elapsedTime
      );
    } else {
      this.seedPreview.update(false, 0, 0, 1, this.activeSpecies, this.elapsedTime);
    }

    // Apply deterministic XR hand actions
    for (const ev of output.events) {
      switch (ev.type) {
        case 'plant':
          this.plantOrbAt(ev.x, ev.z, clamp(ev.y, MIN_ELEVATION, MAX_ELEVATION));
          break;
        case 'grab':
          this.selectedOrbId = ev.orbId;
          this.callbacks.onSelectOrb(ev.orbId);
          break;
        case 'sculpt': {
          const idx = this.orbs.findIndex((o) => o.id === ev.orbId);
          if (idx >= 0) {
            const q = quantizeOrbPosition(ev.x, ev.z, ev.y);
            const prevDeg = this.orbs[idx].noteDegree;
            this.orbs[idx] = { ...this.orbs[idx], ...q };
            const handle = this.plantHandles.get(this.orbs[idx].id);
            handle?.group.position.set(q.x, groundHeightAt(q.x, q.z), q.z);
            if (q.noteDegree !== prevDeg) {
              this.plantPulses.set(this.orbs[idx].id, 0.92);
              this.audio.triggerOrb(this.orbs[idx], this.scaleId, this.getCurrentMetrics());
              this.scheduleHarmonicArcRebuild(nowMs);
            }
          }
          break;
        }
        case 'release':
          this.rebuildHarmonicArcs();
          this.callbacks.onOrbsChange([...this.orbs]);
          break;
        case 'bloom-start':
          this.triggerBloomCrescendo(true, false);
          break;
        case 'bloom-end':
          this.triggerBloomCrescendo(false, false);
          break;
      }
    }
  }

  private stepFrame(nowMs: number): void {
    if (this.disposed || this.contextLost) return;
    const dt = Math.min(0.05, Math.max(0.001, (nowMs - this.lastFrameMs) / 1000));
    this.lastFrameMs = nowMs;
    this.elapsedTime += dt;

    // Sample optional strictly local webcam conducting at ~14Hz
    if (this.webcamActive && !this.webcamPaused) {
      this.webcamTimer += dt;
      if (this.webcamTimer >= 0.072) {
        this.webcamTimer = 0;
        this.sampleWebcamMotion();
      }
    }

    // Update WebXR hand tracking & Touch controller fallback if inside headset
    this.updateWebXRHands(nowMs, dt);

    // Gentle tempo nudge decay
    this.tempoNudge = THREE.MathUtils.damp(this.tempoNudge, 0, 3.2, dt);

    const metrics = this.getCurrentMetrics();
    this.bloomLevel = THREE.MathUtils.damp(this.bloomLevel, metrics.bloomLevel, 4.5, dt);
    this.audio.updateConductingMix(metrics);

    // Advance 16-step radial musical transport
    if (this.isPlaying) {
      const stepsPerSecond = (metrics.effectiveBpm / 60) * 2; // eighth-note pulse = 16 steps over 2 bars
      this.stepAccumulator += dt * stepsPerSecond;
      this.playheadAngle =
        ((this.currentStep + Math.min(1, this.stepAccumulator)) / TOTAL_STEPS) *
        Math.PI *
        2;

      if (this.stepAccumulator >= 1) {
        this.stepAccumulator -= 1;
        this.currentStep = (this.currentStep + 1) % TOTAL_STEPS;

        for (const orb of this.orbs) {
          if (!orb.muted && orb.step === this.currentStep) {
            this.plantPulses.set(orb.id, 1.0);
            this.audio.triggerOrb(orb, this.scaleId, metrics);
          }
        }
      }
    }

    // Smooth camera preset damping
    if (this.cameraTargetPos && this.cameraTargetLook && !this.xrActive) {
      this.camera.position.x = THREE.MathUtils.damp(
        this.camera.position.x,
        this.cameraTargetPos.x,
        5.5,
        dt
      );
      this.camera.position.y = THREE.MathUtils.damp(
        this.camera.position.y,
        this.cameraTargetPos.y,
        5.5,
        dt
      );
      this.camera.position.z = THREE.MathUtils.damp(
        this.camera.position.z,
        this.cameraTargetPos.z,
        5.5,
        dt
      );
      this.controls.target.x = THREE.MathUtils.damp(
        this.controls.target.x,
        this.cameraTargetLook.x,
        5.5,
        dt
      );
      this.controls.target.y = THREE.MathUtils.damp(
        this.controls.target.y,
        this.cameraTargetLook.y,
        5.5,
        dt
      );
      this.controls.target.z = THREE.MathUtils.damp(
        this.controls.target.z,
        this.cameraTargetLook.z,
        5.5,
        dt
      );
      if (this.camera.position.distanceTo(this.cameraTargetPos) < 0.04) {
        this.cameraTargetPos = null;
        this.cameraTargetLook = null;
      }
    }

    if (!this.xrActive) {
      this.controls.update();
    }

    // Sync Web Audio HRTF 3D spatial listener to active camera / WebXR headset world pose
    const activeCam = this.xrActive
      ? this.renderer.xr.getCamera()
      : this.camera;
    activeCam.getWorldPosition(_vCamPos);
    activeCam.getWorldDirection(_vFwd);
    activeCam.getWorldQuaternion(_xrQuat);
    _vUp.set(0, 1, 0).applyQuaternion(_xrQuat);
    this.audio.syncListener(
      _vCamPos.x,
      _vCamPos.y,
      _vCamPos.z,
      _vFwd.x,
      _vFwd.y,
      _vFwd.z,
      _vUp.x,
      _vUp.y,
      _vUp.z
    );

    // Update desktop 3D spatial conductor/sculptor hands hovering naturally before the camera
    const showDesktopHands =
      !this.xrActive && (this.mode === 'conduct' || this.draggingOrbId !== null || this.crescendoLocked);
    if (showDesktopHands) {
      _vRight.crossVectors(_vFwd, _vUp).normalize();
      const spreadMeters = 0.65 + this.handSpread * 1.15;
      const liftMeters = -0.55 + this.handLift * 1.15;
      const forwardDist = 3.1;

      _vMid
        .copy(_vCamPos)
        .addScaledVector(_vFwd, forwardDist)
        .addScaledVector(_vUp, liftMeters);

      const sway = Math.sin(this.elapsedTime * 2.1) * 0.12;
      _vHandLeft
        .copy(_vMid)
        .addScaledVector(_vRight, -spreadMeters * 0.5 + this.pointerNormalized.x * 0.4)
        .addScaledVector(_vUp, sway);
      _vHandRight
        .copy(_vMid)
        .addScaledVector(_vRight, spreadMeters * 0.5 + this.pointerNormalized.x * 0.4)
        .addScaledVector(_vUp, -sway);

      const pinch = this.draggingOrbId ? 0.95 : 0;
      const bloomPose = this.mode === 'conduct' ? 0.35 + this.bloomLevel * 0.65 : 0.15;

      this.leftHandRig.group.lookAt(0, 1.4, 0);
      this.rightHandRig.group.lookAt(0, 1.4, 0);
      this.leftHandRig.update({
        dt,
        time: this.elapsedTime,
        targetPos: _vHandLeft,
        pinchAmount: pinch,
        openBloomAmount: bloomPose,
        visible: true,
        handedness: 'left',
      });
      this.rightHandRig.update({
        dt,
        time: this.elapsedTime,
        targetPos: _vHandRight,
        pinchAmount: pinch,
        openBloomAmount: bloomPose,
        visible: true,
        handedness: 'right',
      });
    } else {
      this.leftHandRig.group.visible = false;
      this.rightHandRig.group.visible = false;
    }

    // Dynamic Signature Bloom lighting warmth
    const basePalette = SKY_PALETTES[this.skyMood];
    this.sunLight.intensity =
      basePalette.sunIntensity + this.bloomLevel * 1.15;
    this.bloomPointLight.intensity = 0.35 + this.bloomLevel * 3.8;
    this.bloomPointLight.position.y = 1.9 + this.bloomLevel * 1.4;
    this.renderer.toneMappingExposure = 1.06 + this.bloomLevel * 0.14;

    // Update outdoor meadow, brook, radial sweep, grass & pollen
    this.environment.update({
      dt,
      time: this.elapsedTime,
      bloomLevel: this.bloomLevel,
      playheadAngle: this.playheadAngle,
      activeStep: this.currentStep,
      isPlaying: this.isPlaying,
      reducedMotion: this.reducedMotion,
    });

    // Update every botanical sound orb plant
    const nowWall = Date.now();
    for (const orb of this.orbs) {
      const handle = this.plantHandles.get(orb.id);
      if (!handle) continue;
      const pulse = this.plantPulses.get(orb.id) ?? 0;
      const decayedPulse = Math.max(0, pulse - dt * 1.65);
      this.plantPulses.set(orb.id, decayedPulse);

      const sproutProgress = clamp((nowWall - orb.plantedAt) / 680, 0.02, 1);
      handle.update({
        dt,
        time: this.elapsedTime,
        elevation: orb.elevation,
        globalBloom: this.bloomLevel,
        pulse: decayedPulse,
        sustain: orb.sustain,
        selected: this.selectedOrbId === orb.id,
        hovered: this.hoveredOrbId === orb.id,
        muted: orb.muted,
        sproutProgress,
        reducedMotion: this.reducedMotion,
      });
    }

    // Illuminate consonant harmonic constellation arcs between singing plants!
    for (const arc of this.harmonicArcs) {
      const pA = this.plantPulses.get(arc.link.fromId) ?? 0;
      const pB = this.plantPulses.get(arc.link.toId) ?? 0;
      const energy = Math.max(pA, pB);
      arc.material.opacity = clamp(
        0.04 + this.bloomLevel * 0.44 * arc.link.consonance + energy * 0.42,
        0.03,
        0.88
      );
    }

    this.renderer.render(this.scene, this.camera);

    // Emit compact UI snapshot at ~12Hz so React stays snappy with zero jank
    this.snapshotTimer += dt;
    if (this.snapshotTimer >= 0.085) {
      this.snapshotTimer = 0;
      this.emitSnapshot();
    }
  }

  /**
   * Software-WebGL fenceSync frame pacing (prevents main-thread starvation on SwiftShader/llvmpipe)
   * while running full native requestAnimationFrame on hardware GPUs.
   */
  private afterDraw(fn: () => void): void {
    const gl = this.renderer.getContext();
    if (!this.isSoftwareGl || !(gl instanceof WebGL2RenderingContext)) {
      this.rafId = window.requestAnimationFrame(fn);
      return;
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (!sync) {
      this.fenceTimerId = window.setTimeout(fn, 80);
      return;
    }
    gl.flush();
    const poll = () => {
      if (this.disposed || this.xrActive) {
        gl.deleteSync(sync);
        return;
      }
      if (gl.clientWaitSync(sync, 0, 0) !== gl.TIMEOUT_EXPIRED) {
        gl.deleteSync(sync);
        this.fenceTimerId = window.setTimeout(fn, 80);
      } else {
        this.fenceTimerId = window.setTimeout(poll, 16);
      }
    };
    this.fenceTimerId = window.setTimeout(poll, 16);
  }

  private startLoop(): void {
    if (this.disposed || this.xrActive) return;
    const tick = () => {
      if (this.disposed || this.xrActive) return;
      this.stepFrame(performance.now());
      this.afterDraw(tick);
    };
    this.rafId = window.requestAnimationFrame(tick);
  }

  private stopNonXRLoop(): void {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.fenceTimerId !== null) {
      window.clearTimeout(this.fenceTimerId);
      this.fenceTimerId = null;
    }
  }

  private emitSnapshot(): void {
    const xrControllerCount =
      (this.xrControllerConnected[0] ? 1 : 0) +
      (this.xrControllerConnected[1] ? 1 : 0);

    this.callbacks.onSnapshot({
      isPlaying: this.isPlaying,
      currentStep: this.currentStep,
      bloomLevel: this.bloomLevel,
      bloomDwellProgress: this.bloomDwellProgress,
      crescendoActive: this.crescendoHeld || this.crescendoLocked,
      handLift: this.handLift,
      handSpread: this.handSpread,
      audioState: this.audio.getState(),
      xrSupported: this.xrLifecycle.isSupported(),
      xrActive: this.xrLifecycle.isActive(),
      xrSessionState: this.xrLifecycle.getState(),
      xrHandCount: this.xrHandCount,
      xrControllerCount,
      xrTrackingStatus: this.xrTrackingStatus,
      webcamActive: this.webcamActive,
      webcamPaused: this.webcamPaused,
      webcamError: this.webcamError,
      reducedMotion: this.reducedMotion,
      isSoftwareGl: this.isSoftwareGl,
      hoveredPreview: this.hoveredPreview,
      contextLost: this.contextLost,
    });
  }

  public dispose(): void {
    this.disposed = true;
    this.stopNonXRLoop();
    this.stopWebcam();
    this.cleanupListeners();
    this.resizeObserver?.disconnect();
    this.renderer.setAnimationLoop(null);
    void this.xrLifecycle.endSession();
    this.xrHandController.reset('session-end');

    for (const handle of this.plantHandles.values()) {
      handle.dispose();
    }
    this.plantHandles.clear();
    this.orbHitTargets = [];

    for (const arc of this.harmonicArcs) {
      arc.geometry.dispose();
      arc.material.dispose();
    }
    this.harmonicArcs = [];

    for (const m of this.xrHandMarkers) {
      m.geometry.dispose();
      if (Array.isArray(m.material)) {
        m.material.forEach((mat) => mat.dispose());
      } else {
        m.material.dispose();
      }
    }
    for (const ray of this.xrControllerRays) {
      ray.geometry.dispose();
      if (Array.isArray(ray.material)) {
        ray.material.forEach((mat) => mat.dispose());
      } else {
        ray.material.dispose();
      }
    }

    this.environment.dispose();
    this.seedPreview.dispose();
    this.leftHandRig.dispose();
    this.rightHandRig.dispose();
    this.envRenderTarget.dispose();
    this.pmremGenerator.dispose();
    this.controls.dispose();
    this.audio.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
