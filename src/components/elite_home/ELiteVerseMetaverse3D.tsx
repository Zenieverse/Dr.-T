import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Globe, 
  Sparkles, 
  Layers, 
  Eye, 
  Maximize2, 
  Compass, 
  Sun, 
  Moon, 
  Sunrise, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Camera, 
  ChevronRight, 
  ShieldCheck, 
  Activity, 
  Wind, 
  Droplets, 
  Flame, 
  Zap, 
  User, 
  Users, 
  MapPin, 
  Move, 
  Sliders, 
  Sparkle, 
  Building, 
  Bed, 
  Info,
  CheckCircle2,
  Tv,
  Radio,
  Share2,
  Download,
  Coffee,
  Heart,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Footprints,
  MousePointer,
  HelpCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { soundEngine } from './soundEngine';
import { MASTERPLAN_DISTRICTS, LUXURY_CHAMBERS } from './eliteHomeData';

export interface HotspotItem {
  id: string;
  name: string;
  category: 'air' | 'light' | 'water' | 'energy' | 'biophilic' | 'structural';
  position: { x: number; y: number; z: number };
  title: string;
  description: string;
  telemetry: { label: string; value: string; status: string }[];
  materials: string;
  clinicalImpact: string;
}

export const ELITE_VERSE_HOTSPOTS: HotspotItem[] = [
  {
    id: 'hs-circadian',
    name: 'Dynamic Circadian Skylight Rig',
    category: 'light',
    position: { x: 0, y: 7.5, z: 0 },
    title: 'Tunable Full-Spectrum Melanopic Lighting',
    description: 'Autonomous multi-channel LED daylight simulation tracking the solar angle in real-time, preventing melatonin suppression during dusk and optimizing cortisol awakening response.',
    telemetry: [
      { label: 'Melanopic EDI', value: '450 Lux (Peak Day)', status: 'Optimal' },
      { label: 'Color Temp', value: '1800K - 6500K dynamic', status: 'Active' },
      { label: 'Blue Peak Filter', value: '99.4% post-19:00', status: 'Shielded' }
    ],
    materials: 'Micro-prism optical diffusers with Japanese cedar frame',
    clinicalImpact: '+48 min slow-wave deep sleep & synchronized cortisol circadian curve'
  },
  {
    id: 'hs-air',
    name: 'HEPA-14 & Negative Ion Atmospheric Engine',
    category: 'air',
    position: { x: -4.5, y: 3.5, z: -3.5 },
    title: 'Continuous Laminar Clean-Air Flow',
    description: 'Hospital-grade triple HEPA-14 filtration with charcoal VOC scrubbing and oceanic negative ion micro-misters (5,000 ions/cm³).',
    telemetry: [
      { label: 'PM2.5 Index', value: '0.2 µg/m³ (Pure)', status: 'Ultra-Clean' },
      { label: 'O2 Enrichment', value: '23.5% (Hyper-Mild)', status: 'Boosted' },
      { label: 'Air Exchange', value: '6.2x changes/hour', status: 'Active' }
    ],
    materials: 'Acoustic-damped titanium ducts & medical silicone valves',
    clinicalImpact: '-32% systemic vascular inflammation & zero allergenic exposure'
  },
  {
    id: 'hs-onsen',
    name: 'Geothermal Mineral Hydrotherapy Onsen',
    category: 'water',
    position: { x: 5.5, y: 0.8, z: -3.0 },
    title: 'Ryukyu Coral-Filtered Magnesium Bath',
    description: 'Submerged volcanic basalt soaking pool with continuous 39.5°C natural geothermal spring water enriched with bio-available magnesium and silicon.',
    telemetry: [
      { label: 'Water Temp', value: '39.5°C / 103.1°F', status: 'Constant' },
      { label: 'Magnesium Ion', value: '185 mg/L dissolved', status: 'Rich' },
      { label: 'Hydrogen Saturation', value: '1.4 ppm micro-bubbles', status: 'Infused' }
    ],
    materials: 'Honed black volcanic basalt & Hinoki cypress overflow rim',
    clinicalImpact: 'Triggers heat shock proteins (HSP70) and profound parasympathetic vagal tone'
  },
  {
    id: 'hs-glass',
    name: 'Electrochromic Photovoltaic Smart Glass',
    category: 'energy',
    position: { x: 0, y: 4.5, z: 7.2 },
    title: 'Floor-to-Ceiling Curved Solar Facade',
    description: 'BIPV transparent glass that generates 4.8 kW clean energy while blocking 99.9% of UV and dynamically modulating tint for glare-free mountain and ocean panoramas.',
    telemetry: [
      { label: 'Solar Output', value: '4.8 kW/hr peak', status: 'Surplus' },
      { label: 'Acoustic Rating', value: 'STC 54 (NC-15 silent)', status: 'Library' },
      { label: 'U-Value', value: '0.12 BTU/hr·ft²·°F', status: 'Ultra-Insulated' }
    ],
    materials: 'Triple-laminated argon-injected photovoltaic crystal glass',
    clinicalImpact: 'Zero traffic noise disturbance; boosts nitric oxide via ambient daylight'
  },
  {
    id: 'hs-livingwall',
    name: 'Hydroponic Phytoncide Botanical Wall',
    category: 'biophilic',
    position: { x: -6.8, y: 3.0, z: 1.5 },
    title: 'Active Living Botanical Air Purifier',
    description: 'Vertical bio-wall populated by 35 varieties of oxygen-releasing orchids, ferns, and dwarf Hinoki moss delivering natural phytoncides into the living space.',
    telemetry: [
      { label: 'CO2 Scrubbing', value: '-380 ppm active', status: 'Efficient' },
      { label: 'Phytoncides', value: '12.4 µg/m³ alpha-pinene', status: 'Optimal' },
      { label: 'Bio-Humidity', value: '48% RH self-regulated', status: 'Balanced' }
    ],
    materials: 'Recycled felt growth matrix with closed-loop nutrient drip irrigation',
    clinicalImpact: '+50% sustained Natural Killer (NK) cell activity & reduced salivary amylase'
  },
  {
    id: 'hs-floor',
    name: 'Far-Infrared Radiant Travertine Floor',
    category: 'structural',
    position: { x: 0, y: 0.1, z: 0 },
    title: 'Sub-Surface Thermal Bio-Resonance Flooring',
    description: 'Hydronic geothermal heating coils embedded in Italian travertine stone emitting far-infrared bio-resonance waves between 8–14 microns.',
    telemetry: [
      { label: 'Surface Temp', value: '24.2°C / 75.5°F', status: 'Warm' },
      { label: 'FIR Waveband', value: '9.4 µm resonant', status: 'Emitting' },
      { label: 'EMF Field', value: '< 0.1 mG (Zero EMF)', status: 'Pure' }
    ],
    materials: 'Unpolished Roman travertine stone with non-slip organic seal',
    clinicalImpact: 'Improves micro-capillary circulation in lower extremities during barefoot walking'
  }
];

export interface TourStop {
  id: string;
  name: string;
  viewMode: 'interior' | 'exterior' | 'cutaway';
  cameraPos: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
  durationSec: number;
  badge: string;
  description: string;
  highlights: string[];
}

export const GUIDED_TOUR_STOPS: TourStop[] = [
  {
    id: 'stop-aerial',
    name: '1. eLiteVerse 500-Acre Masterplan Orbit',
    viewMode: 'exterior',
    cameraPos: { x: 0, y: 65, z: 95 },
    lookAt: { x: 0, y: 0, z: 0 },
    durationSec: 8,
    badge: 'Masterplan Overview',
    description: 'Welcome to eLiteVerse—the interactive 3D digital twin of the eLite Home civilization. Observe the 500-acre biome nestled between misty mountains, crystal lakes, and the ocean.',
    highlights: ['500-Acre Carbon-Negative Sanctuary', 'Tree of Life 60m Central Atrium', 'Gondola & Autonomous Transit Web']
  },
  {
    id: 'stop-cutaway',
    name: '2. Exploded Inside-Out Architectural Cutaway',
    viewMode: 'cutaway',
    cameraPos: { x: 18, y: 16, z: 22 },
    lookAt: { x: 0, y: 3, z: 0 },
    durationSec: 9,
    badge: 'Inside-Out X-Ray',
    description: 'Peeling away the roof and smart photovoltaic glass reveals the biophilic interior: multi-level living salon, circadian master bedroom, geothermal hydrotherapy spa, and vertical botanical gardens.',
    highlights: ['Transparent Smart Glass Facade', 'Radiant Geothermal Floor Coils', 'Laminar HEPA-14 Clean Air Channels']
  },
  {
    id: 'stop-living',
    name: '3. Grand Living Salon & Oceanfront Terrace',
    viewMode: 'interior',
    cameraPos: { x: 0, y: 2.2, z: 4.5 },
    lookAt: { x: 0, y: 2.0, z: -4.0 },
    durationSec: 8,
    badge: 'Interior Walkthrough',
    description: 'Stepping inside the main living salon: double-height timber ceilings, floating minimalist furniture, acoustic insulation rated NC-15, and panoramic views of the coastal lagoon.',
    highlights: ['NC-15 Acoustic Silence', 'Zero-VOC Natural Hinoki Wood', 'Full-Spectrum Circadian Lighting']
  },
  {
    id: 'stop-bedroom',
    name: '4. Circadian Bio-Hacking Master Suite',
    viewMode: 'interior',
    cameraPos: { x: -4.2, y: 2.1, z: -1.2 },
    lookAt: { x: -4.0, y: 1.8, z: -6.0 },
    durationSec: 8,
    badge: 'Rest & Recovery Suite',
    description: 'The master bed is integrated with real-time sleep biometric tracking, oxygen-enriched micro-atmosphere (+24% O2), and electromagnetic field (EMF) grounding shielding.',
    highlights: ['EMF-Shielded Sleep Sanctuary', 'Hyper-Mild Oxygen Enrichment', 'Temperature-Regulated Sleep Pad']
  },
  {
    id: 'stop-onsen',
    name: '5. Geothermal Onsen & Cold Plunge Spa',
    viewMode: 'interior',
    cameraPos: { x: 4.5, y: 2.0, z: -0.5 },
    lookAt: { x: 5.5, y: 1.2, z: -3.5 },
    durationSec: 8,
    badge: 'Regenerative Hydrotherapy',
    description: 'A private indoor-outdoor thermal mineral spring bath with automated temperature cycling (39.5°C hot / 10°C cold plunge) to stimulate vascular elasticity and cellular autophagy.',
    highlights: ['Volcanic Basalt Mineral Bath', 'Hydrogen Nanobubble Infusion', 'Direct Forest Waterfall Vista']
  }
];

export const AVATAR_PROFILES = [
  { id: 'zen-scholar', name: 'Dr. Sarah Tanaka', role: 'Chief Longevity Director', color: '#06b6d4', icon: 'Heart' },
  { id: 'resident-kenji', name: 'Kenji Sato (Age 92)', role: 'Resident Bio-Hacker & Gardener', color: '#10b981', icon: 'User' },
  { id: 'architect-elena', name: 'Elena Rostova', role: 'Biophilic Master Architect', color: '#f59e0b', icon: 'Building' },
  { id: 'visitor-guest', name: 'Global Metaverse Explorer', role: 'Prospective Resident', color: '#ec4899', icon: 'Globe' }
];

export const ELiteVerseMetaverse3D: React.FC = () => {
  // Primary State
  const [viewMode, setViewMode] = useState<'inside-out' | 'interior' | 'exterior' | 'drone'>('inside-out');
  const [controlMode, setControlMode] = useState<'orbit' | 'walk'>('orbit');
  const [timeOfDay, setTimeOfDay] = useState<'golden-hour' | 'cyber-neon' | 'daylight' | 'starry-night' | 'dawn'>('golden-hour');
  const [cutawayProgress, setCutawayProgress] = useState<number>(0.65); // 0 = fully closed, 1 = fully exploded
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotItem | null>(ELITE_VERSE_HOTSPOTS[0]);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [activeSoundtrack, setActiveSoundtrack] = useState<'golden-hour' | 'forest-stream' | 'ocean-breeze' | 'zen-bowl'>('golden-hour');
  
  // Guided Tour State
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [tourStopIndex, setTourStopIndex] = useState<number>(0);
  const [tourCountdown, setTourCountdown] = useState<number>(0);
  
  // Avatar & Social Presence
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PROFILES[0]);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(true);
  const [showXRayMesh, setShowXRayMesh] = useState<boolean>(true);
  
  // Virtual Camera Fly target & Orbit
  const [isAutoOrbit, setIsAutoOrbit] = useState<boolean>(false);
  const [walkSpeedMultiplier, setWalkSpeedMultiplier] = useState<number>(1.0); // 0.6x, 1.0x, 2.2x

  // Three.js Canvas References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animIdRef = useRef<number>(0);

  // Camera Motion interpolation
  const currentCamPos = useRef(new THREE.Vector3(18, 16, 24));
  const targetCamPos = useRef(new THREE.Vector3(18, 16, 24));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.5, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 2.5, 0));

  // Spherical Coordinates for Orbiting
  const sphericalRef = useRef({
    radius: 32,
    theta: 0.85, // Azimuthal angle around Y
    phi: 1.15    // Polar angle from top
  });

  // First-Person Walk Angles (Yaw & Pitch)
  const fpAnglesRef = useRef({
    yaw: -Math.PI / 2,
    pitch: 0
  });

  // Mouse & Touch Dragging State
  const isDraggingRef = useRef(false);
  const dragButtonRef = useRef<number>(0); // 0 = left, 1 = middle, 2 = right
  const lastPointerPosRef = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);
  const touchMidpointRef = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const lastClickTimeRef = useRef(0);

  // Keyboard & D-Pad Continuous Walking State
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const activeDpadActionRef = useRef<string | null>(null);

  // Dynamic Scene Meshes for Exploded / Inside-Out Cutaway
  const roofMeshRef = useRef<THREE.Mesh | null>(null);
  const ceilingFrameRef = useRef<THREE.Group | null>(null);
  const exteriorGlassRef = useRef<THREE.Mesh | null>(null);
  const interiorWallsRef = useRef<THREE.Group | null>(null);
  const furnitureGroupRef = useRef<THREE.Group | null>(null);
  const ductworkGroupRef = useRef<THREE.Group | null>(null);
  const hotspotSpritesRef = useRef<THREE.Group | null>(null);
  const hotspotMeshMapRef = useRef<{ id: string; mesh: THREE.Object3D }[]>([]);
  const coAvatarsGroupRef = useRef<THREE.Group | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const onsenSteamRef = useRef<THREE.Points | null>(null);

  // Lighting References for Day/Night/Neon transitions
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const neonPointLightsRef = useRef<THREE.PointLight[]>([]);

  // 1. INITIALIZE THREE.JS SCENE
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = containerRef.current.clientHeight || 560;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0b101b');
    scene.fog = new THREE.FogExp2('#0b101b', 0.012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    camera.position.set(18, 16, 24);
    camera.lookAt(0, 2.5, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // --- LIGHTING RIG ---
    const ambLight = new THREE.AmbientLight('#f8fafc', 0.85);
    scene.add(ambLight);
    ambientLightRef.current = ambLight;

    const hemiLight = new THREE.HemisphereLight('#fed7aa', '#0f172a', 0.7);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight('#fbbf24', 1.9);
    dirLight.position.set(25, 45, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Cyber-neon interior accent lights
    const neon1 = new THREE.PointLight('#ec4899', 1.2, 18);
    neon1.position.set(-4, 3, 0);
    scene.add(neon1);

    const neon2 = new THREE.PointLight('#06b6d4', 1.4, 20);
    neon2.position.set(4, 2.5, -2);
    scene.add(neon2);

    const neon3 = new THREE.PointLight('#f59e0b', 1.0, 15);
    neon3.position.set(0, 5, 3);
    scene.add(neon3);

    neonPointLightsRef.current = [neon1, neon2, neon3];

    // --- TERRAIN & EXTERIOR BIOME ---
    const groundGeo = new THREE.CylinderGeometry(42, 45, 2, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x141e2e,
      roughness: 0.8,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Reflective Water Lagoon
    const waterGeo = new THREE.CircleGeometry(26, 36);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(12, 0.05, 12);
    water.receiveShadow = true;
    scene.add(water);
    waterMeshRef.current = water;

    // Distant Mountain Ridges
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      const dist = 36 + (i % 3) * 3;
      const mHeight = 8 + (i % 4) * 4;
      const mGeo = new THREE.ConeGeometry(7 + (i % 2) * 2, mHeight, 6);
      const mMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x0f172a : 0x1e293b,
        roughness: 0.9
      });
      const mountain = new THREE.Mesh(mGeo, mMat);
      mountain.position.set(Math.cos(angle) * dist, mHeight / 2 - 2, Math.sin(angle) * dist);
      scene.add(mountain);
    }

    // Distant Mini Monorail Loop
    const railCurve = new THREE.EllipseCurve(0, 0, 32, 32, 0, 2 * Math.PI, false, 0);
    const railPoints = railCurve.getPoints(50);
    const railGeo = new THREE.BufferGeometry().setFromPoints(railPoints.map(p => new THREE.Vector3(p.x, 3.5, p.y)));
    const railMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.4 });
    const railLine = new THREE.Line(railGeo, railMat);
    scene.add(railLine);

    // Autonomous Transit Pod on rail
    const podGeo = new THREE.BoxGeometry(2.4, 1.0, 1.2);
    const podMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.8, roughness: 0.2 });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.position.set(32, 3.5, 0);
    scene.add(pod);

    // Distant Central Tree of Life Glow Dome
    const treeTrunkGeo = new THREE.CylinderGeometry(0.8, 1.6, 12, 16);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const treeTrunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
    treeTrunk.position.set(-20, 5, -20);
    scene.add(treeTrunk);

    const canopyGeo = new THREE.SphereGeometry(6.5, 24, 24);
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.4,
      emissive: 0x059669,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.9
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(-20, 11, -20);
    scene.add(canopy);

    // --- THE LUXURY VILLA ARCHITECTURE (INSIDE-OUT CUTAWAY MODEL) ---
    const villaBaseGeo = new THREE.BoxGeometry(16, 0.4, 14);
    const villaBaseMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1, // Italian Roman Travertine
      roughness: 0.5,
      metalness: 0.1
    });
    const villaBase = new THREE.Mesh(villaBaseGeo, villaBaseMat);
    villaBase.position.set(0, 0.2, 0);
    villaBase.receiveShadow = true;
    scene.add(villaBase);

    // INTERIOR WALLS & ROOM PARTITIONS
    const interiorGroup = new THREE.Group();
    scene.add(interiorGroup);
    interiorWallsRef.current = interiorGroup;

    // Living Room / Master Bedroom Divider Wall (Curved Bamboo / Travertine)
    const wall1Geo = new THREE.BoxGeometry(0.4, 4.2, 8);
    const wall1Mat = new THREE.MeshStandardMaterial({ color: 0xe7e5e4, roughness: 0.6 });
    const wall1 = new THREE.Mesh(wall1Geo, wall1Mat);
    wall1.position.set(-2.0, 2.3, -2.5);
    wall1.castShadow = true;
    wall1.receiveShadow = true;
    interiorGroup.add(wall1);

    // Onsen / Spa Wall Divider
    const wall2Geo = new THREE.BoxGeometry(0.4, 4.2, 7);
    const wall2 = new THREE.Mesh(wall2Geo, wall1Mat);
    wall2.position.set(2.5, 2.3, -3.0);
    wall2.castShadow = true;
    wall2.receiveShadow = true;
    interiorGroup.add(wall2);

    // Back Solid Wall (Hinoki Timber Slats)
    const backWallGeo = new THREE.BoxGeometry(16, 4.2, 0.4);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const backWall = new THREE.Mesh(backWallGeo, woodMat);
    backWall.position.set(0, 2.3, -6.8);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    interiorGroup.add(backWall);

    // Hydroponic Botanical Living Wall on the left interior
    const bioWallGeo = new THREE.BoxGeometry(0.5, 3.8, 4.5);
    const bioWallMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.8,
      emissive: 0x166534,
      emissiveIntensity: 0.3
    });
    const bioWall = new THREE.Mesh(bioWallGeo, bioWallMat);
    bioWall.position.set(-7.6, 2.1, 0);
    interiorGroup.add(bioWall);

    // --- DETAILED FURNITURE GROUP (INSIDE EXPLORATION) ---
    const furnGroup = new THREE.Group();
    scene.add(furnGroup);
    furnitureGroupRef.current = furnGroup;

    // 1. Living Salon: Curved Designer Sofa
    const sofaGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.8, 24, 1, false, 0, Math.PI);
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 });
    const sofa = new THREE.Mesh(sofaGeo, sofaMat);
    sofa.rotation.y = Math.PI / 2;
    sofa.position.set(0, 0.6, 2.5);
    sofa.castShadow = true;
    furnGroup.add(sofa);

    // Coffee Table (Italian Calacatta Marble)
    const tableGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 20);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.3, roughness: 0.2 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.4, 2.5);
    table.castShadow = true;
    furnGroup.add(table);

    // 2. Master Bedroom: Floating King Bed
    const bedBaseGeo = new THREE.BoxGeometry(3.6, 0.6, 3.8);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const bed = new THREE.Mesh(bedBaseGeo, bedMat);
    bed.position.set(-4.8, 0.5, -4.2);
    bed.castShadow = true;
    furnGroup.add(bed);

    const mattressGeo = new THREE.BoxGeometry(3.2, 0.5, 3.4);
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 });
    const mattress = new THREE.Mesh(mattressGeo, mattressMat);
    mattress.position.set(-4.8, 0.9, -4.2);
    mattress.castShadow = true;
    furnGroup.add(mattress);

    const headboardGeo = new THREE.BoxGeometry(3.6, 2.2, 0.4);
    const headboard = new THREE.Mesh(headboardGeo, woodMat);
    headboard.position.set(-4.8, 1.5, -6.0);
    furnGroup.add(headboard);

    // 3. Longevity Spa: Recessed Geothermal Onsen Tub
    const onsenGeo = new THREE.CylinderGeometry(2.4, 2.0, 1.0, 24);
    const onsenMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 });
    const onsen = new THREE.Mesh(onsenGeo, onsenMat);
    onsen.position.set(5.2, 0.7, -3.2);
    onsen.castShadow = true;
    furnGroup.add(onsen);

    // Onsen Thermal Water
    const onsenWaterGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.1, 24);
    const onsenWaterMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85
    });
    const onsenWater = new THREE.Mesh(onsenWaterGeo, onsenWaterMat);
    onsenWater.position.set(5.2, 1.0, -3.2);
    furnGroup.add(onsenWater);

    // Cold Plunge Tub
    const coldTubGeo = new THREE.BoxGeometry(1.6, 1.0, 1.6);
    const coldTubMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const coldTub = new THREE.Mesh(coldTubGeo, coldTubMat);
    coldTub.position.set(6.2, 0.7, 0.5);
    coldTub.castShadow = true;
    furnGroup.add(coldTub);

    // 4. Outdoor Cantilevered Infinity Deck & Sun Loungers
    const deckGeo = new THREE.BoxGeometry(16, 0.3, 4.5);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 0.15, 8.8);
    deck.receiveShadow = true;
    furnGroup.add(deck);

    // --- HVAC & GEOTHERMAL DUCTWORK GROUP (X-RAY MODE) ---
    const ductGroup = new THREE.Group();
    scene.add(ductGroup);
    ductworkGroupRef.current = ductGroup;

    // Radiant In-Floor Heating Pipe Grid (Glowing Cyan Wireframe)
    const pipeGridGeo = new THREE.PlaneGeometry(15, 13, 16, 14);
    const pipeGridMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const pipeGrid = new THREE.Mesh(pipeGridGeo, pipeGridMat);
    pipeGrid.rotation.x = -Math.PI / 2;
    pipeGrid.position.set(0, 0.42, 0);
    ductGroup.add(pipeGrid);

    // Overhead Clean Air Ducting Lines
    const ductPath1 = new THREE.CylinderGeometry(0.18, 0.18, 14, 12);
    const ductMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7
    });
    const duct1 = new THREE.Mesh(ductPath1, ductMat);
    duct1.rotation.z = Math.PI / 2;
    duct1.position.set(0, 4.4, -2.5);
    ductGroup.add(duct1);

    // --- CEILING / ROOF & CIRCADIAN LIGHTING RIG (CUTAWAY / EXPLODED MESH) ---
    const ceilFrameGroup = new THREE.Group();
    scene.add(ceilFrameGroup);
    ceilingFrameRef.current = ceilFrameGroup;

    // Circadian Ceiling Ring Light
    const ringGeo = new THREE.TorusGeometry(3.5, 0.15, 12, 36);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const ringLight = new THREE.Mesh(ringGeo, ringMat);
    ringLight.rotation.x = Math.PI / 2;
    ringLight.position.set(0, 4.5, 2.0);
    ceilFrameGroup.add(ringLight);

    // Solid Biophilic Curved Roof Slab (Moves in Cutaway Exploded Mode)
    const roofGeo = new THREE.BoxGeometry(17.5, 0.6, 15.5);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x292524,
      roughness: 0.4,
      metalness: 0.3
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 4.8, 0);
    roof.castShadow = true;
    ceilFrameGroup.add(roof);
    roofMeshRef.current = roof;

    // --- EXTERIOR TRANSPARENT SMART GLASS FAÇADE ---
    const glassGeo = new THREE.BoxGeometry(16.2, 4.2, 0.2);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.05,
      metalness: 0.2,
      transparent: true,
      opacity: 0.25
    });
    const frontGlass = new THREE.Mesh(glassGeo, glassMat);
    frontGlass.position.set(0, 2.3, 6.8);
    scene.add(frontGlass);
    exteriorGlassRef.current = frontGlass;

    // Side Glass Panels
    const sideGlassGeo = new THREE.BoxGeometry(0.2, 4.2, 13.6);
    const rightGlass = new THREE.Mesh(sideGlassGeo, glassMat);
    rightGlass.position.set(7.8, 2.3, 0);
    scene.add(rightGlass);

    // --- PARTICLES: BIOLUMINESCENT MOTES & ONSEN STEAM ---
    const partCount = 180;
    const partGeo = new THREE.BufferGeometry();
    const partPositions = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i += 3) {
      partPositions[i] = (Math.random() - 0.5) * 32;
      partPositions[i + 1] = Math.random() * 12;
      partPositions[i + 2] = (Math.random() - 0.5) * 32;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      size: 0.22,
      color: 0xfef08a,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);
    particleSystemRef.current = particles;

    // Onsen Steam Particles
    const steamCount = 60;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount * 3; i += 3) {
      steamPos[i] = 5.2 + (Math.random() - 0.5) * 2.0;
      steamPos[i + 1] = 1.0 + Math.random() * 3.0;
      steamPos[i + 2] = -3.2 + (Math.random() - 0.5) * 2.0;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      size: 0.35,
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.45
    });
    const steam = new THREE.Points(steamGeo, steamMat);
    scene.add(steam);
    onsenSteamRef.current = steam;

    // --- CO-RESIDENT 3D AVATARS IN METAVERSE ---
    const avatarsGroup = new THREE.Group();
    scene.add(avatarsGroup);
    coAvatarsGroupRef.current = avatarsGroup;

    AVATAR_PROFILES.forEach((av, idx) => {
      const avGroup = new THREE.Group();
      const bodyGeo = new THREE.CapsuleGeometry(0.35, 1.1, 8, 16);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(av.color),
        roughness: 0.4,
        emissive: new THREE.Color(av.color),
        emissiveIntensity: 0.3
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 1.0;
      body.castShadow = true;
      avGroup.add(body);

      // Head
      const headGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.85;
      avGroup.add(head);

      // Aura Ring at feet
      const ringG = new THREE.RingGeometry(0.4, 0.6, 16);
      const ringM = new THREE.MeshBasicMaterial({ color: new THREE.Color(av.color), side: THREE.DoubleSide });
      const ringMsh = new THREE.Mesh(ringG, ringM);
      ringMsh.rotation.x = Math.PI / 2;
      ringMsh.position.y = 0.05;
      avGroup.add(ringMsh);

      // Position avatars around different hotspots
      if (idx === 0) avGroup.position.set(-4.0, 0.4, 2.0); // Living room
      if (idx === 1) avGroup.position.set(5.5, 0.4, 3.5);  // Sun deck
      if (idx === 2) avGroup.position.set(-6.2, 0.4, -2.0); // Bio wall
      if (idx === 3) avGroup.position.set(0, 0.4, 6.5);     // Infinity terrace

      avatarsGroup.add(avGroup);
    });

    // --- 3D INTERACTIVE HOTSPOT SPRITES ---
    const hsGroup = new THREE.Group();
    scene.add(hsGroup);
    hotspotSpritesRef.current = hsGroup;
    hotspotMeshMapRef.current = [];

    ELITE_VERSE_HOTSPOTS.forEach((hs) => {
      const pinGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(hs.position.x, hs.position.y, hs.position.z);
      hsGroup.add(pin);

      const pulseGeo = new THREE.RingGeometry(0.45, 0.65, 16);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.position.set(hs.position.x, hs.position.y, hs.position.z);
      pulse.lookAt(18, 16, 24);
      hsGroup.add(pulse);

      hotspotMeshMapRef.current.push({ id: hs.id, mesh: pin });
    });

    // --- KEYBOARD LISTENERS FOR WALKING ---
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        keysPressedRef.current[key] = true;
        setIsAutoOrbit(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keysPressedRef.current[key]) {
        keysPressedRef.current[key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // --- ANIMATION & RENDER LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Continuous Walking Motion (from WASD / Arrow Keys or Virtual D-Pad)
      const isWalkingForward = keysPressedRef.current['w'] || keysPressedRef.current['arrowup'] || activeDpadActionRef.current === 'forward';
      const isWalkingBackward = keysPressedRef.current['s'] || keysPressedRef.current['arrowdown'] || activeDpadActionRef.current === 'backward';
      const isStrafingLeft = keysPressedRef.current['a'] || keysPressedRef.current['arrowleft'] || activeDpadActionRef.current === 'left';
      const isStrafingRight = keysPressedRef.current['d'] || keysPressedRef.current['arrowright'] || activeDpadActionRef.current === 'right';
      const isElevatingUp = keysPressedRef.current['e'] || keysPressedRef.current[' '] || activeDpadActionRef.current === 'up';
      const isElevatingDown = keysPressedRef.current['q'] || activeDpadActionRef.current === 'down';

      if (isWalkingForward || isWalkingBackward || isStrafingLeft || isStrafingRight || isElevatingUp || isElevatingDown) {
        setIsAutoOrbit(false);
        const baseSpeed = 8.0 * walkSpeedMultiplier * delta;

        // Calculate horizontal forward & right vectors
        const fwd = new THREE.Vector3().subVectors(targetLookAt.current, targetCamPos.current);
        fwd.y = 0; // lock to horizontal plane
        fwd.normalize();

        const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();

        const moveVec = new THREE.Vector3(0, 0, 0);
        if (isWalkingForward) moveVec.addScaledVector(fwd, baseSpeed);
        if (isWalkingBackward) moveVec.addScaledVector(fwd, -baseSpeed);
        if (isStrafingRight) moveVec.addScaledVector(right, baseSpeed);
        if (isStrafingLeft) moveVec.addScaledVector(right, -baseSpeed);
        if (isElevatingUp) moveVec.y += baseSpeed * 0.8;
        if (isElevatingDown) moveVec.y -= baseSpeed * 0.8;

        // Apply translation to both camera position & lookAt target
        targetCamPos.current.add(moveVec);
        targetLookAt.current.add(moveVec);

        // Clamp minimum elevation to avoid falling below ground
        if (targetCamPos.current.y < 0.6) {
          const diff = 0.6 - targetCamPos.current.y;
          targetCamPos.current.y = 0.6;
          targetLookAt.current.y += diff;
        }
      }

      // Auto Orbit when enabled
      if (isAutoOrbit && !isTourActive && !isDraggingRef.current) {
        sphericalRef.current.theta += 0.003;
        const { radius, theta, phi } = sphericalRef.current;
        targetCamPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
        targetCamPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
        targetCamPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
      }

      // Smooth Camera Lerp
      currentCamPos.current.lerp(targetCamPos.current, 0.08);
      currentLookAt.current.lerp(targetLookAt.current, 0.08);
      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);

      // Transit Pod Movement
      const podAngle = elapsedTime * 0.25;
      pod.position.set(Math.cos(podAngle) * 32, 3.5, Math.sin(podAngle) * 32);
      pod.rotation.y = -podAngle;

      // Particles float animation
      if (particleSystemRef.current) {
        const posAttr = particleSystemRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        for (let i = 1; i < arr.length; i += 3) {
          arr[i] += Math.sin(elapsedTime + i) * 0.006;
          if (arr[i] > 14) arr[i] = 0.5;
        }
        posAttr.needsUpdate = true;
      }

      // Onsen Steam Rising
      if (onsenSteamRef.current) {
        const posAttr = onsenSteamRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        for (let i = 1; i < arr.length; i += 3) {
          arr[i] += 0.015;
          if (arr[i] > 4.5) arr[i] = 1.0;
        }
        posAttr.needsUpdate = true;
      }

      // Avatar subtle breathing & idle bobbing
      if (coAvatarsGroupRef.current) {
        coAvatarsGroupRef.current.children.forEach((av, i) => {
          av.position.y = 0.4 + Math.sin(elapsedTime * 2 + i) * 0.03;
        });
      }

      // Pulse Hotspot Rings facing camera
      if (hotspotSpritesRef.current) {
        hotspotSpritesRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) {
            child.lookAt(camera.position);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [walkSpeedMultiplier]);

  // 2. DYNAMIC CUTAWAY & EXPLODED VIEW EFFECT
  useEffect(() => {
    if (!ceilingFrameRef.current || !exteriorGlassRef.current || !interiorWallsRef.current || !ductworkGroupRef.current) return;

    ceilingFrameRef.current.position.y = cutawayProgress * 7.5;
    
    if (roofMeshRef.current) {
      const mat = roofMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.transparent = true;
      mat.opacity = Math.max(0.15, 1 - cutawayProgress * 0.85);
    }

    if (exteriorGlassRef.current) {
      const mat = exteriorGlassRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = showXRayMesh ? Math.max(0.08, 0.35 - cutawayProgress * 0.28) : 0.4;
    }

    ductworkGroupRef.current.visible = showXRayMesh || cutawayProgress > 0.3;
  }, [cutawayProgress, showXRayMesh]);

  // 3. LIGHTING & ATMOSPHERE PRESET TRANSITIONS
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !hemiLightRef.current || !ambientLightRef.current) return;

    const scene = sceneRef.current;
    const dir = dirLightRef.current;
    const hemi = hemiLightRef.current;
    const amb = ambientLightRef.current;

    if (timeOfDay === 'golden-hour') {
      scene.background = new THREE.Color('#1c131d');
      scene.fog = new THREE.FogExp2('#1c131d', 0.012);
      dir.color = new THREE.Color('#fbbf24');
      dir.intensity = 2.0;
      dir.position.set(30, 25, 25);
      hemi.color = new THREE.Color('#fed7aa');
      hemi.groundColor = new THREE.Color('#431407');
      amb.color = new THREE.Color('#fff7ed');
      amb.intensity = 0.9;
    } else if (timeOfDay === 'cyber-neon') {
      scene.background = new THREE.Color('#050711');
      scene.fog = new THREE.FogExp2('#050711', 0.015);
      dir.color = new THREE.Color('#a855f7');
      dir.intensity = 1.0;
      hemi.color = new THREE.Color('#06b6d4');
      hemi.groundColor = new THREE.Color('#020617');
      amb.color = new THREE.Color('#e0e7ff');
      amb.intensity = 0.5;
    } else if (timeOfDay === 'daylight') {
      scene.background = new THREE.Color('#0284c7');
      scene.fog = new THREE.FogExp2('#0284c7', 0.008);
      dir.color = new THREE.Color('#ffffff');
      dir.intensity = 2.4;
      dir.position.set(10, 50, 20);
      hemi.color = new THREE.Color('#f0f9ff');
      hemi.groundColor = new THREE.Color('#1e293b');
      amb.color = new THREE.Color('#ffffff');
      amb.intensity = 1.1;
    } else if (timeOfDay === 'starry-night') {
      scene.background = new THREE.Color('#030712');
      scene.fog = new THREE.FogExp2('#030712', 0.014);
      dir.color = new THREE.Color('#38bdf8');
      dir.intensity = 0.6;
      hemi.color = new THREE.Color('#1e1b4b');
      hemi.groundColor = new THREE.Color('#000000');
      amb.color = new THREE.Color('#64748b');
      amb.intensity = 0.35;
    } else if (timeOfDay === 'dawn') {
      scene.background = new THREE.Color('#2e1065');
      scene.fog = new THREE.FogExp2('#2e1065', 0.011);
      dir.color = new THREE.Color('#f43f5e');
      dir.intensity = 1.8;
      dir.position.set(-25, 20, 20);
      hemi.color = new THREE.Color('#fbcfe8');
      hemi.groundColor = new THREE.Color('#1e1b4b');
      amb.color = new THREE.Color('#fdf2f8');
      amb.intensity = 0.8;
    }
  }, [timeOfDay]);

  // 4. MOUSE & TOUCH EVENT HANDLERS (ORBIT, PAN, ZOOM, LOOK AROUND, TAP TO JUMP)
  const syncSphericalFromPositions = () => {
    const offset = new THREE.Vector3().subVectors(targetCamPos.current, targetLookAt.current);
    const r = offset.length();
    sphericalRef.current.radius = Math.max(1.5, Math.min(r, 140));
    sphericalRef.current.phi = Math.acos(Math.max(-1, Math.min(1, offset.y / r))) || 1.1;
    sphericalRef.current.theta = Math.atan2(offset.x, offset.z) || 0.8;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragButtonRef.current = e.button;
    hasDraggedRef.current = false;
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    setIsAutoOrbit(false);
    setIsTourActive(false);
    syncSphericalFromPositions();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastPointerPosRef.current.x;
    const dy = e.clientY - lastPointerPosRef.current.y;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDraggedRef.current = true;
    }

    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

    // RIGHT CLICK or SHIFT + LEFT CLICK -> SCREEN-SPACE PAN
    if (dragButtonRef.current === 2 || e.shiftKey) {
      const panFactor = 0.0025 * (targetCamPos.current.distanceTo(targetLookAt.current) || 15);
      const cam = cameraRef.current;
      if (cam) {
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);

        const panOffset = new THREE.Vector3()
          .addScaledVector(right, -dx * panFactor)
          .addScaledVector(up, dy * panFactor);

        targetCamPos.current.add(panOffset);
        targetLookAt.current.add(panOffset);
      }
      return;
    }

    // LEFT CLICK DRAG -> ROTATE / ORBIT / LOOK AROUND
    if (controlMode === 'walk' || viewMode === 'interior') {
      // First-person head look around (yaw & pitch)
      fpAnglesRef.current.yaw -= dx * 0.005;
      fpAnglesRef.current.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, fpAnglesRef.current.pitch - dy * 0.005));

      const lookDist = 6.0;
      const lookX = targetCamPos.current.x + Math.cos(fpAnglesRef.current.pitch) * Math.sin(fpAnglesRef.current.yaw) * lookDist;
      const lookY = targetCamPos.current.y + Math.sin(fpAnglesRef.current.pitch) * lookDist;
      const lookZ = targetCamPos.current.z + Math.cos(fpAnglesRef.current.pitch) * Math.cos(fpAnglesRef.current.yaw) * lookDist;

      targetLookAt.current.set(lookX, lookY, lookZ);
    } else {
      // Spherical 3D Orbit around property
      sphericalRef.current.theta -= dx * 0.007;
      sphericalRef.current.phi = Math.max(0.08, Math.min(Math.PI / 2 - 0.02, sphericalRef.current.phi - dy * 0.007));

      const { radius, theta, phi } = sphericalRef.current;
      targetCamPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
      targetCamPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
      targetCamPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;

    // IF CLICK WITHOUT DRAG -> Raycast Hotspot Pins or Double-Click Teleport
    if (!hasDraggedRef.current && containerRef.current && cameraRef.current && sceneRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      // Check Hotspots Raycast
      if (hotspotSpritesRef.current) {
        const intersects = raycaster.intersectObjects(hotspotSpritesRef.current.children, true);
        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          const found = hotspotMeshMapRef.current.find((item) => item.mesh === hitObj);
          if (found) {
            const hs = ELITE_VERSE_HOTSPOTS.find((h) => h.id === found.id);
            if (hs) {
              setSelectedHotspot(hs);
              targetLookAt.current.set(hs.position.x, hs.position.y, hs.position.z);
              return;
            }
          }
        }
      }

      // Double Click / Double Tap Detection -> Walk towards clicked point
      const now = performance.now();
      if (now - lastClickTimeRef.current < 320) {
        const floorIntersects = raycaster.intersectObjects(sceneRef.current.children, true);
        if (floorIntersects.length > 0) {
          const targetPoint = floorIntersects[0].point;
          // Step 2.5 meters away from target point
          const dir = new THREE.Vector3().subVectors(targetCamPos.current, targetPoint).normalize();
          targetCamPos.current.set(targetPoint.x + dir.x * 2.5, Math.max(1.8, targetPoint.y + 1.6), targetPoint.z + dir.z * 2.5);
          targetLookAt.current.set(targetPoint.x, targetPoint.y + 1.2, targetPoint.z);
          syncSphericalFromPositions();
        }
      }
      lastClickTimeRef.current = now;
    }
  };

  // MOUSE WHEEL ZOOM
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setIsAutoOrbit(false);
    setIsTourActive(false);

    const zoomDelta = e.deltaY * 0.02;

    if (controlMode === 'walk' || viewMode === 'interior') {
      // Step forward/backward in first-person mode
      const fwd = new THREE.Vector3().subVectors(targetLookAt.current, targetCamPos.current).normalize();
      targetCamPos.current.addScaledVector(fwd, -zoomDelta * 0.5);
      targetLookAt.current.addScaledVector(fwd, -zoomDelta * 0.5);
    } else {
      // Spherical radius zoom
      syncSphericalFromPositions();
      sphericalRef.current.radius = Math.max(2.0, Math.min(130, sphericalRef.current.radius + zoomDelta));
      const { radius, theta, phi } = sphericalRef.current;
      targetCamPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
      targetCamPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
      targetCamPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
    }
  };

  // TOUCH GESTURES (PINCH TO ZOOM & TWO-FINGER PAN)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
      touchMidpointRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null && touchMidpointRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);

      const zoomChange = (touchDistanceRef.current - newDist) * 0.06;
      touchDistanceRef.current = newDist;

      // Pinch to Zoom
      syncSphericalFromPositions();
      sphericalRef.current.radius = Math.max(2.0, Math.min(130, sphericalRef.current.radius + zoomChange));
      const { radius, theta, phi } = sphericalRef.current;
      targetCamPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
      targetCamPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
      targetCamPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);

      // Two-Finger Pan
      const curMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const curMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const panDx = curMidX - touchMidpointRef.current.x;
      const panDy = curMidY - touchMidpointRef.current.y;
      touchMidpointRef.current = { x: curMidX, y: curMidY };

      const cam = cameraRef.current;
      if (cam) {
        const panFactor = 0.003 * (sphericalRef.current.radius || 15);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);

        const panOffset = new THREE.Vector3()
          .addScaledVector(right, -panDx * panFactor)
          .addScaledVector(up, panDy * panFactor);

        targetCamPos.current.add(panOffset);
        targetLookAt.current.add(panOffset);
      }
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
    touchMidpointRef.current = null;
  };

  // 5. VIEW MODE TELEPORTATION & CAMERA TARGETS
  const handleViewModeChange = (mode: 'inside-out' | 'interior' | 'exterior' | 'drone') => {
    setViewMode(mode);
    setIsAutoOrbit(false);
    setIsTourActive(false);

    if (mode === 'inside-out') {
      setControlMode('orbit');
      setCutawayProgress(0.65);
      targetCamPos.current.set(16, 15, 20);
      targetLookAt.current.set(0, 2.5, 0);
      syncSphericalFromPositions();
    } else if (mode === 'interior') {
      setControlMode('walk');
      setCutawayProgress(0.1);
      targetCamPos.current.set(0, 2.2, 4.2);
      targetLookAt.current.set(0, 2.0, -3.5);
      fpAnglesRef.current.yaw = -Math.PI / 2;
      fpAnglesRef.current.pitch = 0;
    } else if (mode === 'exterior') {
      setControlMode('orbit');
      setCutawayProgress(0.0);
      targetCamPos.current.set(0, 60, 90);
      targetLookAt.current.set(0, 0, 0);
      syncSphericalFromPositions();
    } else if (mode === 'drone') {
      setControlMode('orbit');
      setCutawayProgress(0.3);
      targetCamPos.current.set(-24, 28, 32);
      targetLookAt.current.set(0, 2, 0);
      syncSphericalFromPositions();
    }
  };

  // Quick Room Jump
  const handleJumpToRoom = (roomName: string) => {
    setIsAutoOrbit(false);
    setIsTourActive(false);

    if (roomName === 'living') {
      setViewMode('interior');
      setControlMode('walk');
      setCutawayProgress(0.1);
      targetCamPos.current.set(0, 2.2, 4.2);
      targetLookAt.current.set(0, 2.0, -3.5);
      fpAnglesRef.current.yaw = -Math.PI / 2;
      fpAnglesRef.current.pitch = 0;
    } else if (roomName === 'bedroom') {
      setViewMode('interior');
      setControlMode('walk');
      setCutawayProgress(0.15);
      targetCamPos.current.set(-4.5, 2.1, -1.0);
      targetLookAt.current.set(-4.8, 1.8, -5.5);
      fpAnglesRef.current.yaw = -Math.PI / 2;
      fpAnglesRef.current.pitch = 0;
    } else if (roomName === 'onsen') {
      setViewMode('interior');
      setControlMode('walk');
      setCutawayProgress(0.15);
      targetCamPos.current.set(4.5, 2.0, 0.0);
      targetLookAt.current.set(5.2, 1.2, -3.2);
      fpAnglesRef.current.yaw = -Math.PI / 2;
      fpAnglesRef.current.pitch = 0;
    } else if (roomName === 'terrace') {
      setViewMode('interior');
      setControlMode('walk');
      setCutawayProgress(0.2);
      targetCamPos.current.set(0, 2.0, 10.5);
      targetLookAt.current.set(0, 1.8, 18.0);
      fpAnglesRef.current.yaw = 0;
      fpAnglesRef.current.pitch = 0;
    } else if (roomName === 'masterplan') {
      setViewMode('exterior');
      setControlMode('orbit');
      setCutawayProgress(0.0);
      targetCamPos.current.set(0, 60, 90);
      targetLookAt.current.set(0, 0, 0);
      syncSphericalFromPositions();
    }
  };

  // Zoom In / Out Buttons
  const handleZoom = (direction: 'in' | 'out') => {
    setIsAutoOrbit(false);
    const factor = direction === 'in' ? 0.75 : 1.35;
    syncSphericalFromPositions();
    sphericalRef.current.radius = Math.max(2.0, Math.min(130, sphericalRef.current.radius * factor));
    const { radius, theta, phi } = sphericalRef.current;
    targetCamPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
    targetCamPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
    targetCamPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
  };

  // Level Camera Horizon
  const handleResetHorizon = () => {
    targetLookAt.current.y = targetCamPos.current.y;
    fpAnglesRef.current.pitch = 0;
    syncSphericalFromPositions();
  };

  // 6. GUIDED TOUR AUTOMATION
  useEffect(() => {
    if (!isTourActive) return;

    const stop = GUIDED_TOUR_STOPS[tourStopIndex];
    if (!stop) return;

    // Apply stop view settings
    if (stop.viewMode === 'cutaway') {
      setViewMode('inside-out');
      setControlMode('orbit');
      setCutawayProgress(0.7);
    } else if (stop.viewMode === 'interior') {
      setViewMode('interior');
      setControlMode('walk');
      setCutawayProgress(0.1);
    } else {
      setViewMode('exterior');
      setControlMode('orbit');
      setCutawayProgress(0.0);
    }

    targetCamPos.current.set(stop.cameraPos.x, stop.cameraPos.y, stop.cameraPos.z);
    targetLookAt.current.set(stop.lookAt.x, stop.lookAt.y, stop.lookAt.z);
    syncSphericalFromPositions();
    setTourCountdown(stop.durationSec);

    const timer = setInterval(() => {
      setTourCountdown((prev) => {
        if (prev <= 1) {
          // Next stop
          setTourStopIndex((curIdx) => (curIdx + 1) % GUIDED_TOUR_STOPS.length);
          return stop.durationSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTourActive, tourStopIndex]);

  const toggleGuidedTour = () => {
    if (isTourActive) {
      setIsTourActive(false);
    } else {
      setIsTourActive(true);
      setTourStopIndex(0);
    }
  };

  // Sound Engine Control
  const toggleAudio = (type?: 'golden-hour' | 'forest-stream' | 'ocean-breeze' | 'zen-bowl') => {
    const nextType = type || activeSoundtrack;
    if (isAudioPlaying && !type) {
      soundEngine.stopAll();
      setIsAudioPlaying(false);
    } else {
      setActiveSoundtrack(nextType);
      soundEngine.playAmbience(nextType);
      setIsAudioPlaying(true);
    }
  };

  return (
    <div className="space-y-6 text-white select-none font-sans" id="elite-verse-metaverse-root">
      {/* Top Banner & Metaverse Header */}
      <div className="bg-gradient-to-r from-stone-950 via-purple-950/60 to-stone-950 rounded-3xl p-6 border border-purple-900/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white px-3 py-0.5 rounded-full shadow-sm">
              Metaverse Digital Twin 3D
            </span>
            <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> Mouse & Touch 360° Walk
            </span>
            <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
              142 Live Virtual Residents
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-sans tracking-tight text-white flex items-center gap-3">
            <Globe className="w-8 h-8 text-purple-400 animate-spin-slow" />
            <span>eLiteVerse</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-3xl mt-1 leading-relaxed">
            Freely explore the luxury sanctuary with your <strong>mouse</strong>, <strong>trackpad</strong>, or <strong>fingers on mobile</strong>. Orbit 360° around the villa, walk through interior suites, pinch to zoom, and peel away structural walls with real-time architectural cutaways.
          </p>
        </div>

        {/* Action Controls in Header */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={toggleGuidedTour}
            className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg
              ${isTourActive ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300 animate-pulse' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'}
            `}
          >
            {isTourActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isTourActive ? `Guided Tour (${tourCountdown}s)` : 'Cinematic Tour'}</span>
          </button>

          <button
            onClick={() => toggleAudio()}
            className={`p-2.5 rounded-2xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5
              ${isAudioPlaying ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-md' : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'}
            `}
            title="Toggle Ambient Spatial Audio"
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">432Hz Sound</span>
          </button>
        </div>
      </div>

      {/* METAVERSE VIEWPORT CONTAINER */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-stone-800 bg-stone-950 shadow-2xl">
        {/* 3D WebGL Canvas */}
        <div 
          ref={containerRef} 
          className="w-full h-[520px] sm:h-[620px] lg:h-[680px] relative cursor-grab active:cursor-grabbing touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onContextMenu={(e) => e.preventDefault()}
        >
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Top-Left Floating Controls: View & Navigation Mode */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-stone-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800/80 shadow-xl max-w-[90%] sm:max-w-none">
            <button
              onClick={() => handleViewModeChange('inside-out')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
                ${viewMode === 'inside-out' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
              `}
            >
              <Layers className="w-3.5 h-3.5" /> <span>Inside-Out X-Ray</span>
            </button>

            <button
              onClick={() => handleViewModeChange('interior')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
                ${viewMode === 'interior' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
              `}
            >
              <Footprints className="w-3.5 h-3.5" /> <span>Walk Inside</span>
            </button>

            <button
              onClick={() => handleViewModeChange('exterior')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
                ${viewMode === 'exterior' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
              `}
            >
              <Compass className="w-3.5 h-3.5" /> <span>500-Acre Masterplan</span>
            </button>

            <button
              onClick={() => handleViewModeChange('drone')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
                ${viewMode === 'drone' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
              `}
            >
              <Camera className="w-3.5 h-3.5" /> <span>Drone Flycam</span>
            </button>

            {/* Orbit vs Walk Control Switch */}
            <div className="hidden sm:flex items-center gap-1 border-l border-stone-800 pl-2 ml-1">
              <button
                onClick={() => setControlMode(controlMode === 'orbit' ? 'walk' : 'orbit')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5
                  ${controlMode === 'walk' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'}
                `}
                title="Switch between 360 Orbit Mode and Free Walk Mode"
              >
                {controlMode === 'walk' ? <Footprints className="w-3.5 h-3.5 text-emerald-400" /> : <RotateCcw className="w-3.5 h-3.5 text-purple-400" />}
                <span>{controlMode === 'walk' ? 'Walk Mode' : 'Orbit Mode'}</span>
              </button>
            </div>
          </div>

          {/* Top-Right Floating Controls: Lighting, Orbit & Zoom */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-stone-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800/80 shadow-xl">
            {/* Time of Day Presets */}
            <div className="flex items-center gap-1 border-r border-stone-800 pr-2 mr-1">
              <button
                onClick={() => setTimeOfDay('golden-hour')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${timeOfDay === 'golden-hour' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-stone-400 hover:text-white'}`}
                title="Golden Hour Dusk"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTimeOfDay('cyber-neon')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${timeOfDay === 'cyber-neon' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-stone-400 hover:text-white'}`}
                title="Cyber-Neon Night"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTimeOfDay('daylight')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${timeOfDay === 'daylight' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-stone-400 hover:text-white'}`}
                title="High Daylight"
              >
                <Sunrise className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTimeOfDay('starry-night')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${timeOfDay === 'starry-night' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-stone-400 hover:text-white'}`}
                title="Starry Night & Aurora"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Zoom In/Out Buttons */}
            <div className="flex items-center gap-1 border-r border-stone-800 pr-2 mr-1">
              <button
                onClick={() => handleZoom('in')}
                className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
                title="Zoom In (or Scroll Wheel / Pinch)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
                title="Zoom Out (or Scroll Wheel / Pinch)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Auto Orbit Toggle */}
            <button
              onClick={() => setIsAutoOrbit(!isAutoOrbit)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1
                ${isAutoOrbit ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-stone-400 hover:text-white'}
              `}
              title="Continuous cinematic rotation"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Orbit</span>
            </button>
          </div>

          {/* Center-Bottom Floating Instructions Badge */}
          {showControlsGuide && (
            <div className="absolute top-16 right-4 z-20 hidden sm:flex items-center gap-3 bg-stone-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-stone-800 text-[11px] font-mono text-stone-300 shadow-xl animate-fadeIn">
              <div className="flex items-center gap-1.5 text-purple-300">
                <MousePointer className="w-3.5 h-3.5 text-pink-400" />
                <span>Drag: Orbit / Look</span>
              </div>
              <span className="text-stone-600">•</span>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <span>✌️ 2-Finger / Right Drag: Pan</span>
              </div>
              <span className="text-stone-600">•</span>
              <div className="flex items-center gap-1.5 text-amber-300">
                <span>Scroll / Pinch: Zoom</span>
              </div>
              <span className="text-stone-600">•</span>
              <div className="flex items-center gap-1.5 text-sky-300">
                <span>WASD: Walk</span>
              </div>
              <button
                onClick={() => setShowControlsGuide(false)}
                className="text-stone-500 hover:text-stone-300 text-xs pl-1 cursor-pointer"
                title="Dismiss guide"
              >
                ✕
              </button>
            </div>
          )}

          {/* VIRTUAL ON-SCREEN WALK JOYSTICK & D-PAD (Bottom Left) */}
          <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
            {/* Quick Room Teleport Bar */}
            <div className="flex flex-wrap items-center gap-1.5 bg-stone-950/90 backdrop-blur-md p-2 rounded-2xl border border-stone-800/80 shadow-2xl max-w-[85vw] sm:max-w-md">
              <span className="text-[9px] font-mono uppercase text-stone-400 font-bold block w-full px-1">
                Jump To Location:
              </span>
              <button
                onClick={() => handleJumpToRoom('living')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 transition-all cursor-pointer"
              >
                🛋️ Living Salon
              </button>
              <button
                onClick={() => handleJumpToRoom('bedroom')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 transition-all cursor-pointer"
              >
                🛏️ Master Suite
              </button>
              <button
                onClick={() => handleJumpToRoom('onsen')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 transition-all cursor-pointer"
              >
                ♨️ Mineral Onsen
              </button>
              <button
                onClick={() => handleJumpToRoom('terrace')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 transition-all cursor-pointer"
              >
                🌊 Ocean Deck
              </button>
              <button
                onClick={() => handleJumpToRoom('masterplan')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-stone-900 hover:bg-stone-800 text-purple-300 border border-purple-800/50 transition-all cursor-pointer"
              >
                🌳 500-Acre Dome
              </button>
            </div>

            {/* Interactive D-Pad Walk Controller */}
            <div className="bg-stone-950/90 backdrop-blur-md p-2 rounded-2xl border border-stone-800/80 shadow-2xl flex items-center gap-3 w-fit">
              {/* 4-Way Directional Pad */}
              <div className="grid grid-cols-3 gap-1 w-24 h-24">
                <div />
                <button
                  onPointerDown={() => { activeDpadActionRef.current = 'forward'; setIsAutoOrbit(false); }}
                  onPointerUp={() => { activeDpadActionRef.current = null; }}
                  onPointerLeave={() => { activeDpadActionRef.current = null; }}
                  className="bg-stone-900 active:bg-purple-600 hover:bg-stone-800 text-stone-200 rounded-xl flex items-center justify-center border border-stone-800 active:scale-95 transition-all cursor-pointer"
                  title="Walk Forward (W / Up Arrow)"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <div />

                <button
                  onPointerDown={() => { activeDpadActionRef.current = 'left'; setIsAutoOrbit(false); }}
                  onPointerUp={() => { activeDpadActionRef.current = null; }}
                  onPointerLeave={() => { activeDpadActionRef.current = null; }}
                  className="bg-stone-900 active:bg-purple-600 hover:bg-stone-800 text-stone-200 rounded-xl flex items-center justify-center border border-stone-800 active:scale-95 transition-all cursor-pointer"
                  title="Strafe Left (A / Left Arrow)"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetHorizon}
                  className="bg-stone-800 hover:bg-stone-700 text-purple-300 rounded-xl flex items-center justify-center border border-purple-500/30 text-[10px] font-mono font-bold active:scale-95 transition-all cursor-pointer"
                  title="Center Horizon"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
                <button
                  onPointerDown={() => { activeDpadActionRef.current = 'right'; setIsAutoOrbit(false); }}
                  onPointerUp={() => { activeDpadActionRef.current = null; }}
                  onPointerLeave={() => { activeDpadActionRef.current = null; }}
                  className="bg-stone-900 active:bg-purple-600 hover:bg-stone-800 text-stone-200 rounded-xl flex items-center justify-center border border-stone-800 active:scale-95 transition-all cursor-pointer"
                  title="Strafe Right (D / Right Arrow)"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div />
                <button
                  onPointerDown={() => { activeDpadActionRef.current = 'backward'; setIsAutoOrbit(false); }}
                  onPointerUp={() => { activeDpadActionRef.current = null; }}
                  onPointerLeave={() => { activeDpadActionRef.current = null; }}
                  className="bg-stone-900 active:bg-purple-600 hover:bg-stone-800 text-stone-200 rounded-xl flex items-center justify-center border border-stone-800 active:scale-95 transition-all cursor-pointer"
                  title="Walk Backward (S / Down Arrow)"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div />
              </div>

              {/* Elevation & Walk Speed Selector */}
              <div className="flex flex-col gap-1.5 border-l border-stone-800 pl-3">
                <div className="flex items-center gap-1">
                  <button
                    onPointerDown={() => { activeDpadActionRef.current = 'up'; setIsAutoOrbit(false); }}
                    onPointerUp={() => { activeDpadActionRef.current = null; }}
                    onPointerLeave={() => { activeDpadActionRef.current = null; }}
                    className="p-1.5 bg-stone-900 hover:bg-stone-800 active:bg-emerald-600 rounded-lg border border-stone-800 text-stone-300 text-xs flex items-center gap-1 cursor-pointer"
                    title="Elevate Up / Fly Higher (E / Space)"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono">Up</span>
                  </button>

                  <button
                    onPointerDown={() => { activeDpadActionRef.current = 'down'; setIsAutoOrbit(false); }}
                    onPointerUp={() => { activeDpadActionRef.current = null; }}
                    onPointerLeave={() => { activeDpadActionRef.current = null; }}
                    className="p-1.5 bg-stone-900 hover:bg-stone-800 active:bg-emerald-600 rounded-lg border border-stone-800 text-stone-300 text-xs flex items-center gap-1 cursor-pointer"
                    title="Descend / Lower Elevation (Q)"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono">Down</span>
                  </button>
                </div>

                {/* Speed Multiplier */}
                <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800 text-[10px] font-mono">
                  <button
                    onClick={() => setWalkSpeedMultiplier(0.6)}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${walkSpeedMultiplier === 0.6 ? 'bg-purple-600 text-white font-bold' : 'text-stone-400'}`}
                  >
                    Stroll
                  </button>
                  <button
                    onClick={() => setWalkSpeedMultiplier(1.0)}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${walkSpeedMultiplier === 1.0 ? 'bg-purple-600 text-white font-bold' : 'text-stone-400'}`}
                  >
                    Walk
                  </button>
                  <button
                    onClick={() => setWalkSpeedMultiplier(2.2)}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${walkSpeedMultiplier === 2.2 ? 'bg-purple-600 text-white font-bold' : 'text-stone-400'}`}
                  >
                    Fast
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Right Exploded Cutaway Slider */}
          <div className="absolute bottom-4 right-4 z-20 bg-stone-950/90 backdrop-blur-md p-3 rounded-2xl border border-stone-800/80 shadow-2xl w-48 sm:w-56 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-purple-300 font-bold flex items-center gap-1">
                <Sliders className="w-3 h-3" /> Cutaway X-Ray
              </span>
              <span className="text-stone-400 font-bold">{Math.round(cutawayProgress * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={cutawayProgress}
              onChange={(e) => {
                setCutawayProgress(parseFloat(e.target.value));
                if (viewMode !== 'inside-out') setViewMode('inside-out');
              }}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex items-center justify-between text-[9px] font-mono text-stone-400">
              <span>Solid Shell</span>
              <span>Fully Exploded</span>
            </div>
          </div>

          {/* Guided Tour Caption Card Overlay */}
          {isTourActive && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-xl bg-stone-950/95 backdrop-blur-md p-4 rounded-2xl border border-amber-500/40 shadow-2xl text-left animate-fadeIn">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[9px] font-mono uppercase bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded">
                  {GUIDED_TOUR_STOPS[tourStopIndex].badge}
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  Auto Advance in {tourCountdown}s
                </span>
              </div>
              <h4 className="text-base font-black text-white font-sans">
                {GUIDED_TOUR_STOPS[tourStopIndex].name}
              </h4>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                {GUIDED_TOUR_STOPS[tourStopIndex].description}
              </p>
              <div className="mt-2.5 pt-2 border-t border-stone-800 flex flex-wrap items-center gap-2">
                {GUIDED_TOUR_STOPS[tourStopIndex].highlights.map((h, i) => (
                  <span key={i} className="text-[10px] font-mono bg-stone-900 text-stone-300 px-2 py-0.5 rounded border border-stone-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* METAVERSE INTERACTIVE DASHBOARD: HOTSPOTS, TELEMETRY & SOCIAL PRESENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Inside-Out Hotspot Dossier (7 Cols) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-black font-sans uppercase tracking-wider text-white">
                Inside-Out Architectural & Biophilic Hotspots
              </h3>
            </div>
            <span className="text-[10px] font-mono text-stone-400">Click Pin to Inspect</span>
          </div>

          {/* Hotspot Horizontal Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {ELITE_VERSE_HOTSPOTS.map((hs) => {
              const isSelected = selectedHotspot?.id === hs.id;
              return (
                <button
                  key={hs.id}
                  onClick={() => {
                    setSelectedHotspot(hs);
                    targetLookAt.current.set(hs.position.x, hs.position.y, hs.position.z);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5
                    ${isSelected 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md ring-2 ring-purple-400/40' 
                      : 'bg-stone-950 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700'}
                  `}
                >
                  <Sparkle className="w-3 h-3 text-amber-400" />
                  <span>{hs.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Hotspot Detailed Card */}
          {selectedHotspot && (
            <div className="bg-stone-950 rounded-2xl p-5 border border-stone-800 space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800/80">
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
                    Category: {selectedHotspot.category.toUpperCase()}
                  </span>
                  <h4 className="text-lg font-black text-white font-sans">{selectedHotspot.title}</h4>
                </div>
                <div className="bg-purple-950/80 px-3 py-1.5 rounded-xl border border-purple-500/30 text-right shrink-0">
                  <span className="text-[9px] font-mono text-purple-300 block">Longevity Impact</span>
                  <span className="text-xs font-bold text-emerald-400">{selectedHotspot.clinicalImpact}</span>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">{selectedHotspot.description}</p>

              {/* 3 Real-time Telemetry Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedHotspot.telemetry.map((t, idx) => (
                  <div key={idx} className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-1">
                    <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">{t.label}</span>
                    <span className="text-sm font-black text-amber-400 font-mono block">{t.value}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {t.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between font-mono">
                <span>Materials: <strong className="text-stone-200">{selectedHotspot.materials}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Metaverse Social Co-Explorers & Ambient Audio Suite (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Avatar Profile & Presence */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black font-sans uppercase tracking-wider text-white">
                  Metaverse Resident Avatars
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                142 Active Online
              </span>
            </div>

            <div className="space-y-2.5">
              {AVATAR_PROFILES.map((av) => {
                const isCurrent = selectedAvatar.id === av.id;
                return (
                  <div
                    key={av.id}
                    onClick={() => setSelectedAvatar(av)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between
                      ${isCurrent 
                        ? 'bg-gradient-to-r from-stone-950 to-purple-950/60 border-purple-500 shadow-md ring-2 ring-purple-500/30' 
                        : 'bg-stone-950/80 border-stone-800 hover:border-stone-700'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                        style={{ backgroundColor: av.color }}
                      >
                        {av.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{av.name}</h5>
                        <p className="text-[10px] text-stone-400 font-mono">{av.role}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-purple-400 font-bold">
                      {isCurrent ? 'Current Avatar' : 'Select'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ambient 432Hz Soundscape Switcher */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black font-sans uppercase tracking-wider text-white">
                  Spatial Soundscape Channels
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-400">Web Audio API</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => toggleAudio('golden-hour')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer
                  ${activeSoundtrack === 'golden-hour' && isAudioPlaying 
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300' 
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Golden Hour</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 block font-normal">Warm wind & 432Hz</span>
              </button>

              <button
                onClick={() => toggleAudio('forest-stream')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer
                  ${activeSoundtrack === 'forest-stream' && isAudioPlaying 
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Waterfall Spa</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 block font-normal">Stream & bird calls</span>
              </button>

              <button
                onClick={() => toggleAudio('ocean-breeze')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer
                  ${activeSoundtrack === 'ocean-breeze' && isAudioPlaying 
                    ? 'bg-sky-950/80 border-sky-500 text-sky-300' 
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  <span>Ocean Lagoon</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 block font-normal">Rhythmic tidal surf</span>
              </button>

              <button
                onClick={() => toggleAudio('zen-bowl')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer
                  ${activeSoundtrack === 'zen-bowl' && isAudioPlaying 
                    ? 'bg-purple-950/80 border-purple-500 text-purple-300' 
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tibetan Zen Bowl</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 block font-normal">Resonant theta chime</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
