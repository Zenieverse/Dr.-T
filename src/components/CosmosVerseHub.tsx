import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Globe, 
  Rocket, 
  Orbit, 
  Sparkles, 
  Layers, 
  Eye, 
  Maximize2, 
  Compass, 
  Sun, 
  Moon, 
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
  ChevronDown,
  GraduationCap,
  BookOpen,
  Atom,
  Cpu,
  Trophy,
  Award,
  Calendar,
  Clock,
  BatteryCharging,
  Gauge,
  Thermometer,
  Shield,
  Search,
  ExternalLink,
  MessageSquare,
  Bookmark,
  Check,
  Loader2,
  Database,
  Key,
  RefreshCw,
  FileJson,
  Hash,
  QrCode
} from 'lucide-react';

export interface QuantumPassportRecord {
  id: string;
  callsign: string;
  originStation: string;
  certLevel: string;
  cosmicScore: number;
  enrolledVerses: string[];
  completedModules: string[];
  quantumHash: string;
  entanglementSignature: string;
  coherenceScore: number;
  orbitalBlockHeight: number;
  syncedAt: string;
  verificationBadge: string;
  status: "SYNCED" | "ENTANGLED" | "VERIFIED";
  hederaConsensusTimestamp?: string;
}

// --- COSMIC VERSES DEFINITIONS ---
export interface CosmicVerse {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  domain: string;
  distanceFromEarth: string;
  citizensCount: string;
  atmosphereType: string;
  gravityIndex: string;
  primaryMission: string;
  color: string;
  bgGradient: string;
  learningCurriculum: {
    moduleTitle: string;
    description: string;
    difficulty: 'Introductory' | 'Advanced' | 'Mastery';
    duration: string;
    keyConcepts: string[];
  }[];
  habitatSpecs: {
    suiteType: string;
    capacity: string;
    lifeSupport: string;
    energySource: string;
    dailyExperience: string;
  };
  telemetry: {
    radiationShield: string;
    oxygenPurity: string;
    foodSelfSufficiency: string;
    quantumLatency: string;
  };
}

export const COSMIC_VERSES: CosmicVerse[] = [
  {
    id: 'verse-elite',
    name: 'eLiteVerse Orbital Biosphere',
    icon: '🏰',
    tagline: 'High-Altitude Biophilic Luxury Architecture in Zero-G',
    domain: 'Regenerative Habitat & Architecture',
    distanceFromEarth: '420 km (Low Earth Orbit)',
    citizensCount: '2,480 Pioneer Residents',
    atmosphereType: '78% N2, 22% Hyper-Mild O2 + Pine Phytoncides',
    gravityIndex: '0.98 G (Rotational Centrifugal Ring)',
    primaryMission: 'Pioneering carbon-negative, zero-stress living architecture above the stratosphere with living hydroponic ceilings and circadian stellar skylights.',
    color: '#ec4899',
    bgGradient: 'from-pink-900/40 via-purple-900/30 to-stone-900',
    learningCurriculum: [
      {
        moduleTitle: 'Zero-G Biophilic Structural Engineering',
        description: 'Design self-healing titanium-bamboo composite structures that withstand space debris and thermal swings between -120°C and +140°C.',
        difficulty: 'Advanced',
        duration: '4 Weeks (16 Credits)',
        keyConcepts: ['Centrifugal Ring Physics', 'Hydroponic Living Facades', 'EMF Stellar Shielding']
      },
      {
        moduleTitle: 'Circadian Light Synthesis in Orbit',
        description: 'Simulate natural 24-hour sunrise-to-sunset rhythms despite experiencing 16 orbital sunrises every Earth day.',
        difficulty: 'Introductory',
        duration: '2 Weeks (8 Credits)',
        keyConcepts: ['Melanopic Lux Calibration', 'Cortisol Regulation in Space', 'Full-Spectrum Optical Diffusers']
      }
    ],
    habitatSpecs: {
      suiteType: 'Cantilevered Celestial Villa',
      capacity: '4 Residents + 2 Autonomous Service Drones',
      lifeSupport: 'Closed-Loop Bio-Regenerative Algal Ponds',
      energySource: 'BIPV Perovskite Photovoltaic Skin (120 kW/suite)',
      dailyExperience: 'Morning meditation overlooking the Pacific Ocean from your 180° panoramic smart-glass terrace, followed by floating geothermal tea ceremony.'
    },
    telemetry: {
      radiationShield: '99.98% Active Magnetosphere Deflection',
      oxygenPurity: '22.4% (Pure NC-15 Acoustic Air)',
      foodSelfSufficiency: '94.2% Aeroponic Produce',
      quantumLatency: '0.004 ms Earth Relay'
    }
  },
  {
    id: 'verse-bio',
    name: 'BioVerse Cellular Longevity Lab',
    icon: '🧬',
    tagline: 'Telomere Elongation & Stem Cell Rejuvenation in Microgravity',
    domain: 'Space Medicine & Anti-Aging Science',
    distanceFromEarth: '580 km (Sun-Synchronous Orbit)',
    citizensCount: '1,120 Clinical Researchers & Long-Stay Patients',
    atmosphereType: 'Pressurized O2 + Molecular Hydrogen Nano-Mist',
    gravityIndex: '0.38 G (Mars-Equivalent Regeneration Chamber)',
    primaryMission: 'Leveraging microgravity to accelerate 3D protein crystallization, eliminate hydrostatic vascular pressure, and perform CRISPR telomeric DNA repair.',
    color: '#06b6d4',
    bgGradient: 'from-cyan-900/40 via-blue-900/30 to-stone-900',
    learningCurriculum: [
      {
        moduleTitle: 'Microgravity Epigenetics & Telomere Dynamics',
        description: 'Investigate how unburdening human cells from 1G gravitational shear stresses triggers cellular autophagy and longevity gene activation.',
        difficulty: 'Mastery',
        duration: '6 Weeks (24 Credits)',
        keyConcepts: ['SIRT6 Space Upregulation', 'Bone Matrix Regeneration', 'Microvascular Elasticity']
      },
      {
        moduleTitle: 'Zero-G 3D Bioprinting of Organs',
        description: 'Print vascularized cardiac and liver tissue scaffolds without gravitational collapse using magnetic levitation bio-inks.',
        difficulty: 'Advanced',
        duration: '3 Weeks (12 Credits)',
        keyConcepts: ['Acoustic Cell Positioning', 'Nano-Capillary Perfusion', 'Stem Cell Differentiation']
      }
    ],
    habitatSpecs: {
      suiteType: 'Bio-Regenerative Longevity Cocoon',
      capacity: '1-2 Clinical Bio-Hackers',
      lifeSupport: 'Nanobubble Hydrogen Infused Fluid Loops',
      energySource: 'Helium-3 Micro-Fusion Reactor',
      dailyExperience: 'Submerged acoustic sonic baths in zero-G, daily mitochondrial biomarker scans, and customized peptide-infused cosmic nutrient broths.'
    },
    telemetry: {
      radiationShield: 'Multilayer Bismuth-Water Polyethylene Armor',
      oxygenPurity: '23.1% + 1.2% Molecular Hydrogen',
      foodSelfSufficiency: '100% Cellular Cultured Nutrition',
      quantumLatency: '0.008 ms Ground Sync'
    }
  },
  {
    id: 'verse-eco',
    name: 'EcoVerse Closed-Loop Food Forest',
    icon: '🌿',
    tagline: 'Infinite Circular Hydroponics & Celestial Botany',
    domain: 'Planetary Biosphere Regeneration',
    distanceFromEarth: '384,400 km (Lunar Lagrange Point L1)',
    citizensCount: '3,850 Cosmic Agronomists & Forest Keepers',
    atmosphereType: 'Rich Botanical Oxygen (24.0% O2, 450ppm CO2)',
    gravityIndex: '0.16 G (Lunar Equivalent)',
    primaryMission: 'Cultivating 50,000 m² of multi-story vertical food forests in deep space, recycling 99.99% of organic waste and water into sweet fruits and medicinal herbs.',
    color: '#10b981',
    bgGradient: 'from-emerald-900/40 via-teal-900/30 to-stone-900',
    learningCurriculum: [
      {
        moduleTitle: 'Closed-Loop Bio-Regenerative Life Support (CELSS)',
        description: 'Master nutrient mass-balance, anaerobic digestor optimization, and microbial soil web inoculation in sealed orbital biomes.',
        difficulty: 'Advanced',
        duration: '5 Weeks (20 Credits)',
        keyConcepts: ['Spirulina Bio-Reactors', 'Nitrogen-Fixing Symbiosis', 'Closed Water Condensation']
      },
      {
        moduleTitle: 'Cosmic Super-Crop Breeding & Phenotyping',
        description: 'Cultivate rapid-cycle dwarf wheat, cosmic wasabi, and antioxidant-dense purple strawberries optimized for LED quantum yields.',
        difficulty: 'Introductory',
        duration: '2 Weeks (8 Credits)',
        keyConcepts: ['Photoperiod Tuning', 'Aeroponic Nutrient Misting', 'Phytoncide Dispersion']
      }
    ],
    habitatSpecs: {
      suiteType: 'Botanical Treehouse Sphere',
      capacity: '6 Agronomists & Families',
      lifeSupport: '100% Botanical Plant Transpiration & Living Filters',
      energySource: 'Concentrated Solar Thermal Mirrors (250 kW)',
      dailyExperience: 'Waking up inside an apple orchard suspended in space, picking fresh berries for breakfast, and pruning zero-gravity tomato vines.'
    },
    telemetry: {
      radiationShield: '3-Meter Water Jacket & Living Biomass Shield',
      oxygenPurity: '24.0% High Mountain Quality',
      foodSelfSufficiency: '100% Surplus (Supplies other Verses)',
      quantumLatency: '1.28 s Lunar Relay'
    }
  },
  {
    id: 'verse-neuro',
    name: 'NeuroVerse Quantum Mind Sanctum',
    icon: '🧠',
    tagline: 'Cosmic Consciousness, Gamma Wave Synchrony & Deep Learning',
    domain: 'Cognitive Enhancement & Quantum AI',
    distanceFromEarth: '1,500,000 km (Earth-Sun L2 Point)',
    citizensCount: '890 Philosophers, Neuroscientists & AI Theorists',
    atmosphereType: 'Ultra-Pure De-Ionized Air with Hinoki Terpenes',
    gravityIndex: '0.00 G (Pure Microgravity Isolation)',
    primaryMission: 'Studying the "Overview Effect" on human neuroplasticity, zero-G lucid dreaming, and high-bandwidth non-invasive brain-computer telepathy.',
    color: '#8b5cf6',
    bgGradient: 'from-purple-900/40 via-indigo-900/30 to-stone-900',
    learningCurriculum: [
      {
        moduleTitle: 'The Cosmic Overview Effect & Cognitive Shift',
        description: 'Neuro-imaging analysis of psychological transcendence, altruistic expansion, and existential tranquility reported by space travelers.',
        difficulty: 'Introductory',
        duration: '3 Weeks (12 Credits)',
        keyConcepts: ['Default Mode Network Downregulation', 'Theta-Gamma Phase Coupling', 'Vagal Harmony']
      },
      {
        moduleTitle: 'Quantum Information Theory & Cosmic AI Co-Pilot',
        description: 'Harness quantum entanglement nodes for instantaneous neural telemetry and collaborative multi-agent problem solving.',
        difficulty: 'Mastery',
        duration: '8 Weeks (32 Credits)',
        keyConcepts: ['Qubit Teleportation Gates', 'Neural Holographic Decoding', 'Deep Space Autonomy']
      }
    ],
    habitatSpecs: {
      suiteType: 'Sensory Float Pod & Telepathic Atrium',
      capacity: '1 Consciousness Researcher',
      lifeSupport: 'Acoustic-Damped Cryogenic Nitrogen-Oxygen Matrix',
      energySource: 'Radiative Thermoelectric Quantum Generators',
      dailyExperience: 'Floating weightless in an infinity dome gazing at distant nebulae while acoustic 432Hz sine waves guide your brain into sustained 40Hz gamma flow.'
    },
    telemetry: {
      radiationShield: 'High-Density Graphene Electrostatic Deflectors',
      oxygenPurity: '21.8% Sub-Odorless Purity',
      foodSelfSufficiency: '88% Synthesized Nootropic Blends',
      quantumLatency: 'Instantaneous Entangled Relay'
    }
  },
  {
    id: 'verse-solaris',
    name: 'Solaris Energy Dyson-Harvester',
    icon: '☀️',
    tagline: 'Clean Stellar Power Generation & Asteroid Shielding',
    domain: 'Clean Interstellar Power & Propulsion',
    distanceFromEarth: '700 km (Equatorial High Orbit)',
    citizensCount: '1,750 Plasma Engineers & Stellar Navigators',
    atmosphereType: 'Standard Earth Sea-Level Mix',
    gravityIndex: '1.00 G (Precision Gyroscopic Ring)',
    primaryMission: 'Beaming gigawatts of wireless zero-loss microwave power to green cities on Earth while powering warp-ion thrusters for deep space exploration.',
    color: '#f59e0b',
    bgGradient: 'from-amber-900/40 via-orange-900/30 to-stone-900',
    learningCurriculum: [
      {
        moduleTitle: 'Orbital Solar Power Beaming (SBSP)',
        description: 'Design phased-array microwave transmitters that safely beam 2.45 GHz clean energy through Earth cloud cover to terrestrial rectennas.',
        difficulty: 'Advanced',
        duration: '4 Weeks (16 Credits)',
        keyConcepts: ['Phased Array Steering', 'Atmospheric Transmission Windows', 'Zero-Carbon Power']
      },
      {
        moduleTitle: 'Plasma Magnetosphere Defense Systems',
        description: 'Generate artificial planetary magnetic fields to shield planetary colonies from coronal mass ejections and cosmic rays.',
        difficulty: 'Mastery',
        duration: '6 Weeks (24 Credits)',
        keyConcepts: ['High-Temperature Superconductors', 'Toroidal Magnetic Confinement', 'Solar Flare Early Warning']
      }
    ],
    habitatSpecs: {
      suiteType: 'Solar Observation Observatory Suite',
      capacity: '4 Stellar Physicists',
      lifeSupport: 'Direct Solar Thermal Electrolysis',
      energySource: 'Direct 50 MW Photonic Mirror Array',
      dailyExperience: 'Monitoring live solar prominences in 8K ultraviolet filters, enjoying zero-gravity sports in the multi-ring gymnasium, and tracking Earth energy grids.'
    },
    telemetry: {
      radiationShield: 'Active 5-Tesla Superconducting Magnetic Bubble',
      oxygenPurity: '21.5% Standard Mix',
      foodSelfSufficiency: '91% Precision Fermented Foods',
      quantumLatency: '0.005 ms Low Orbit Grid'
    }
  },
  {
    id: 'verse-zen',
    name: 'ZenVerse Zero-G Meditation Cloister',
    icon: '🕊️',
    tagline: 'Cosmic Silence, Soundbaths & Celestial Peace',
    domain: 'Spiritual Wellness & Sound Therapy',
    distanceFromEarth: '65,000 km (Earth-Moon Transfer Orbit)',
    citizensCount: '620 Monks, Musicians & Mindfulness Pilgrims',
    atmosphereType: 'Sandalwood & White Tea Infused High Mountain Air',
    gravityIndex: '0.05 G (Ultra-Gentle Micro-Float)',
    primaryMission: 'Cultivating inner stillness in the absolute silence of the cosmos, conducting 432Hz spatial soundbaths, and providing spiritual sanctuary for all beings.',
    color: '#a855f7',
    bgGradient: 'from-purple-900/40 via-pink-900/30 to-stone-900',
    learningCurriculum: [
      {
        moduleTitle: 'Zero-G Diaphragmatic Breathwork & Vagal Resonance',
        description: 'Harness the lack of thoracic compression in microgravity to expand lung volume by 18% and synchronize heart rate variability.',
        difficulty: 'Introductory',
        duration: '2 Weeks (8 Credits)',
        keyConcepts: ['Pranayama in Zero-G', 'Resonant Frequency Breathing', 'Parasympathetic Activation']
      },
      {
        moduleTitle: 'Spatial Acoustics & Cosmic Overtone Singing',
        description: 'Master Tibetan singing bowls and vocal harmonics in curved acoustic domes suspended in space.',
        difficulty: 'Introductory',
        duration: '3 Weeks (12 Credits)',
        keyConcepts: ['432Hz Solfeggio Scale', 'Binaural Starlight Resonances', 'Vibrational Sound Therapy']
      }
    ],
    habitatSpecs: {
      suiteType: 'Floating Zazen Meditation Pod',
      capacity: '1 Contemplative Pilgrim',
      lifeSupport: 'Acoustic-Silent Herb-Filtered Ventilation (NC-5 Rating)',
      energySource: 'Radiant Crystal Solar Cell Petals',
      dailyExperience: 'Floating inside a translucent crystal sphere watching the Earth and Moon dance against the starry void while soothing singing bowls gently vibrate.'
    },
    telemetry: {
      radiationShield: 'Thick Polished Quartz & Lead-Glass Crystal Hull',
      oxygenPurity: '22.0% Herbal Infused',
      foodSelfSufficiency: '95% Pure Organic Vegan Cultivations',
      quantumLatency: '0.22 s Transfer Orbit'
    }
  }
];

// --- QUIZ DATA FOR COSMIC ACADEMY ---
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  verseId: string;
  points: number;
}

export const COSMIC_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'How does long-duration living in microgravity (0G) affect human cellular aging and vascular health when combined with bio-regenerative therapies?',
    options: [
      'It instantly accelerates decay without any remedies possible',
      'Unburdening cells from gravitational shear stresses allows enhanced autophagy and reduced hydrostatic venous pressure when protected by magnetic shields',
      'It permanently shuts down all mitochondrial ATP production',
      'It changes the genetic code to plant DNA'
    ],
    correctIndex: 1,
    explanation: 'In microgravity, eliminating continuous hydrostatic pressure on veins and skeletal joints reduces mechanical wear-and-tear, allowing targeted telomerase and peptide therapies to work with higher cellular efficacy.',
    verseId: 'verse-bio',
    points: 100
  },
  {
    id: 2,
    question: 'In the eLiteVerse Orbital Biosphere, how do residents maintain a balanced 24-hour circadian cycle despite witnessing 16 orbital sunrises every day?',
    options: [
      'By closing their eyes and never looking outside',
      'By using electrochromic smart glass filters and autonomous multi-channel circadian LED arrays simulating melanopic daylight curves',
      'By changing time zones every 45 minutes',
      'By taking continuous sleeping sedatives'
    ],
    correctIndex: 1,
    explanation: 'Autonomous electrochromic glass darkens during scheduled sleep hours, while full-spectrum circadian LED skylights deliver precise melanopic lux (1800K dusk to 6500K noon) to synchronize human cortisol and melatonin release.',
    verseId: 'verse-elite',
    points: 100
  },
  {
    id: 3,
    question: 'What is the core principle of closed-loop life support (CELSS) in the EcoVerse food forests?',
    options: [
      'Relying entirely on weekly supply rockets from Earth',
      'Converting 99.99% of resident CO2, organic matter, and greywater into oxygen, biomass, and pure drinking water via plant transpiration and bio-reactors',
      'Freezing all waste in deep space containers',
      'Consuming only synthetic chemical pills'
    ],
    correctIndex: 1,
    explanation: 'CELSS creates a self-balancing ecosystem where plants convert human CO2 into oxygen, and living biological filters purify water and recycle nutrients with near-zero loss.',
    verseId: 'verse-eco',
    points: 100
  },
  {
    id: 4,
    question: 'What is the psychological phenomenon experienced by astronauts and cosmic residents when seeing Earth from orbit, fostering global empathy and mental clarity?',
    options: [
      'The Doppler Effect',
      'The Cosmic Overview Effect',
      'The Coriolis Distortion',
      'The Gravitational Slingshot'
    ],
    correctIndex: 1,
    explanation: 'The Overview Effect is a profound cognitive shift reported by space travelers upon viewing Earth suspended in the black void, inspiring deep interconnectedness, ecological stewardship, and mental peace.',
    verseId: 'verse-neuro',
    points: 100
  }
];

export const CosmosVerseHub: React.FC = () => {
  // Main Tab State: 3d-habitat, live-cosmos, learn-verses, telemetry, radio, passport
  const [activeSubTab, setActiveSubTab] = useState<'3d-habitat' | 'live-cosmos' | 'learn-verses' | 'telemetry' | 'radio' | 'passport'>('3d-habitat');
  
  // Selected Verse for Deep Dive
  const [selectedVerse, setSelectedVerse] = useState<CosmicVerse>(COSMIC_VERSES[0]);
  
  // 3D Canvas View Controls
  const [viewAngle, setViewAngle] = useState<'orbit' | 'spacewalk' | 'hab-interior' | 'cockpit'>('orbit');
  const [orbitSpeed, setOrbitSpeed] = useState<number>(1.0);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [highlightModule, setHighlightModule] = useState<string>('all');
  const [showStarLabels, setShowStarLabels] = useState<boolean>(true);

  // Sound Engine State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioTheme, setAudioTheme] = useState<'432hz-starlight' | 'pulsar-pulse' | 'orbital-greenhouse' | 'zen-singing-bowls'>('432hz-starlight');
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioOscillatorsRef = useRef<OscillatorNode[]>([]);
  const audioGainRef = useRef<GainNode | null>(null);

  // Academy / Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<string[]>(['Zero-G Biophilic Structural Engineering']);
  const [userPassport, setUserPassport] = useState({
    callsign: 'Starlight-Pioneer',
    originStation: 'eLiteVerse Alpha Ring',
    certLevel: 'Cosmic Scholar Level 2',
    cosmicScore: 350,
    enrolledVerses: ['verse-elite', 'verse-bio', 'verse-eco']
  });

  // Quantum Registry & Passport Synchronization State
  const [isSyncingRegistry, setIsSyncingRegistry] = useState<boolean>(false);
  const [registrySyncSuccess, setRegistrySyncSuccess] = useState<boolean>(false);
  const [syncedQuantumRecord, setSyncedQuantumRecord] = useState<QuantumPassportRecord | null>(null);
  const [globalRegistryRecords, setGlobalRegistryRecords] = useState<QuantumPassportRecord[]>([]);
  const [registrySearchQuery, setRegistrySearchQuery] = useState<string>('');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [quantumSyncMessage, setQuantumSyncMessage] = useState<string>('');

  // Restore saved passport and load Quantum Registry on mount
  useEffect(() => {
    try {
      const savedPassport = localStorage.getItem('cosmos_quantum_passport');
      if (savedPassport) {
        setUserPassport(JSON.parse(savedPassport));
      }
      const savedRecord = localStorage.getItem('cosmos_synced_quantum_record');
      if (savedRecord) {
        setSyncedQuantumRecord(JSON.parse(savedRecord));
      }
    } catch (e) {
      console.warn('Could not restore local quantum passport:', e);
    }

    fetch('/api/quantum-registry/records')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.records)) {
          setGlobalRegistryRecords(data.records);
        }
      })
      .catch(err => console.warn('Could not fetch Quantum Registry records:', err));
  }, []);

  // Daily Habitat Simulation State
  const [simulatedHour, setSimulatedHour] = useState<number>(8); // 0 to 23
  const [gravitySetting, setGravitySetting] = useState<number>(0.98); // 0.0 to 1.0 G
  const [airPurityFilter, setAirPurityFilter] = useState<'standard' | 'high-oxygen' | 'hydrogen-infused'>('high-oxygen');
  const [lightMode, setLightMode] = useState<'circadian-auto' | 'golden-nebula' | 'deep-sleep-red' | 'high-focus-blue'>('circadian-auto');

  // Three.js References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number>(0);

  // Mouse & Touch Dragging State for 3D Cosmos Space
  const isDraggingRef = useRef(false);
  const dragButtonRef = useRef(0);
  const lastPointerPosRef = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);
  const touchMidpointRef = useRef<{ x: number; y: number } | null>(null);

  const sphericalRef = useRef({
    radius: 45,
    theta: 0.5,
    phi: 1.1
  });

  const targetCamPos = useRef(new THREE.Vector3(25, 20, 35));
  const currentCamPos = useRef(new THREE.Vector3(25, 20, 35));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // 3D Objects in Cosmos
  const stationRingRef = useRef<THREE.Group | null>(null);
  const earthGlobeRef = useRef<THREE.Mesh | null>(null);
  const versePortalsRef = useRef<THREE.Group | null>(null);
  const starsPointsRef = useRef<THREE.Points | null>(null);

  // 1. INITIALIZE THREE.JS COSMOS SCENE
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = containerRef.current.clientHeight || 580;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#030712'); // Deep Space

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(25, 20, 35);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;

    // --- CELESTIAL LIGHTING ---
    const sunLight = new THREE.DirectionalLight('#fffbeb', 2.8);
    sunLight.position.set(70, 40, 60);
    scene.add(sunLight);

    const spaceAmbient = new THREE.AmbientLight('#1e1b4b', 0.8);
    scene.add(spaceAmbient);

    // Blue earth reflection light
    const earthGlowLight = new THREE.PointLight('#38bdf8', 1.8, 120);
    earthGlowLight.position.set(-45, -25, -30);
    scene.add(earthGlowLight);

    // --- 10,000 DEEP SPACE STARS & NEBULA PARTICLES ---
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#f43f5e'),
      new THREE.Color('#fef08a'),
      new THREE.Color('#c084fc')
    ];

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      const dist = 180 + Math.random() * 250;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      starPos[idx] = dist * Math.sin(phi) * Math.cos(theta);
      starPos[idx + 1] = dist * Math.sin(phi) * Math.sin(theta);
      starPos[idx + 2] = dist * Math.cos(phi);

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[idx] = col.r;
      starColors[idx + 1] = col.g;
      starColors[idx + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);
    starsPointsRef.current = starField;

    // --- BLUE MARBLE PLANET EARTH IN BACKGROUND ---
    const earthGeo = new THREE.SphereGeometry(22, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.4,
      metalness: 0.1,
      emissive: 0x0369a1,
      emissiveIntensity: 0.25
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(-48, -26, -38);
    scene.add(earthMesh);
    earthGlobeRef.current = earthMesh;

    // Earth Atmosphere Glow Ring
    const atmoGeo = new THREE.SphereGeometry(22.8, 36, 36);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
    atmosphere.position.copy(earthMesh.position);
    scene.add(atmosphere);

    // --- THE AETHELGARD COSMOS ORBITAL HABITAT CITY (CENTRAL 3D STRUCTURE) ---
    const stationGroup = new THREE.Group();
    scene.add(stationGroup);
    stationRingRef.current = stationGroup;

    // 1. Central Zero-G Fusion Hub Core
    const coreGeo = new THREE.CylinderGeometry(2.5, 2.5, 14, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.2
    });
    const hubCore = new THREE.Mesh(coreGeo, coreMat);
    stationGroup.add(hubCore);

    // Glowing Plasma Core Rings
    const plasmaRingGeo = new THREE.TorusGeometry(3.0, 0.25, 16, 36);
    const plasmaRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const plasmaRing1 = new THREE.Mesh(plasmaRingGeo, plasmaRingMat);
    plasmaRing1.rotation.x = Math.PI / 2;
    plasmaRing1.position.y = 3;
    stationGroup.add(plasmaRing1);

    const plasmaRing2 = plasmaRing1.clone();
    plasmaRing2.position.y = -3;
    stationGroup.add(plasmaRing2);

    // 2. Giant Rotating Centrifugal Habitation Ring (1G Living Quarters)
    const bigRingGeo = new THREE.TorusGeometry(18, 1.4, 24, 64);
    const bigRingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3
    });
    const habRing = new THREE.Mesh(bigRingGeo, bigRingMat);
    habRing.rotation.x = Math.PI / 2;
    stationGroup.add(habRing);

    // Transparent Glass Living Windows around the ring
    const windowRingGeo = new THREE.TorusGeometry(18, 1.45, 16, 64, Math.PI * 0.8);
    const windowRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1
    });
    const winRing = new THREE.Mesh(windowRingGeo, windowRingMat);
    winRing.rotation.x = Math.PI / 2;
    stationGroup.add(winRing);

    // 3. Four Structural Transit Spokes connecting Hub to Ring
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const spokeGeo = new THREE.CylinderGeometry(0.5, 0.5, 18, 16);
      const spoke = new THREE.Mesh(spokeGeo, coreMat);
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = angle;
      stationGroup.add(spoke);
    }

    // 4. Multi-Verse Bio-Domes Attached to Ring Exterior
    const portalsGroup = new THREE.Group();
    stationGroup.add(portalsGroup);
    versePortalsRef.current = portalsGroup;

    COSMIC_VERSES.forEach((verse, idx) => {
      const angle = (idx / COSMIC_VERSES.length) * Math.PI * 2;
      const domeDist = 18;

      const domeX = Math.cos(angle) * domeDist;
      const domeZ = Math.sin(angle) * domeDist;

      const domeGeo = new THREE.SphereGeometry(2.4, 20, 20);
      const domeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(verse.color),
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: 0.85,
        emissive: new THREE.Color(verse.color),
        emissiveIntensity: 0.35
      });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.set(domeX, 0, domeZ);
      portalsGroup.add(dome);

      // Light Beacon above dome
      const beaconGeo = new THREE.OctahedronGeometry(0.6);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(domeX, 3.4, domeZ);
      portalsGroup.add(beacon);
    });

    // 5. Giant Solar Panel Wings (Photovoltaic Arrays)
    const solarPanelGeo = new THREE.BoxGeometry(28, 0.2, 5);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x172554,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.3
    });
    const solarLeft = new THREE.Mesh(solarPanelGeo, solarMat);
    solarLeft.position.set(0, 8.5, 0);
    stationGroup.add(solarLeft);

    const solarRight = solarLeft.clone();
    solarRight.position.set(0, -8.5, 0);
    stationGroup.add(solarRight);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Station Centrifugal Rotation
      if (stationRingRef.current && isRotating) {
        stationRingRef.current.rotation.y += 0.0035 * orbitSpeed;
      }

      // Earth Slow Rotation
      if (earthGlobeRef.current) {
        earthGlobeRef.current.rotation.y += 0.0008;
      }

      // Stars subtle twinkling
      if (starsPointsRef.current) {
        starsPointsRef.current.rotation.y += 0.0002;
      }

      // Smooth Camera Lerp
      currentCamPos.current.lerp(targetCamPos.current, 0.06);
      currentLookAt.current.lerp(targetLookAt.current, 0.06);
      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [orbitSpeed, isRotating]);

  // 2. 3D CAMERA ANGLE PRESETS
  useEffect(() => {
    if (viewAngle === 'orbit') {
      targetCamPos.current.set(28, 22, 38);
      targetLookAt.current.set(0, 0, 0);
    } else if (viewAngle === 'spacewalk') {
      targetCamPos.current.set(0, 2, 22);
      targetLookAt.current.set(0, 0, 0);
    } else if (viewAngle === 'hab-interior') {
      targetCamPos.current.set(16, 0.5, 0);
      targetLookAt.current.set(0, 0, 0);
    } else if (viewAngle === 'cockpit') {
      targetCamPos.current.set(0, 10, 0);
      targetLookAt.current.set(-45, -25, -38); // Look at Earth
    }
  }, [viewAngle]);

  // 3. MOUSE & TOUCH 360 TRAVERSAL FOR COSMOS
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragButtonRef.current = e.button;
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointerPosRef.current.x;
    const dy = e.clientY - lastPointerPosRef.current.y;
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

    if (dragButtonRef.current === 2 || e.shiftKey) {
      // Pan
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cameraRef.current!.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(cameraRef.current!.quaternion);
      const pan = new THREE.Vector3().addScaledVector(right, -dx * 0.05).addScaledVector(up, dy * 0.05);
      targetCamPos.current.add(pan);
      targetLookAt.current.add(pan);
    } else {
      // 360 Spherical Orbit
      sphericalRef.current.theta -= dx * 0.008;
      sphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sphericalRef.current.phi - dy * 0.008));
      const { radius, theta, phi } = sphericalRef.current;
      targetCamPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
      targetCamPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
      targetCamPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(8, Math.min(95, sphericalRef.current.radius + e.deltaY * 0.04));
    const { radius, theta, phi } = sphericalRef.current;
    targetCamPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
    targetCamPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
    targetCamPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
  };

  // 4. PROCEDURAL 432Hz COSMIC AUDIO SYNTHESIZER
  const toggleCosmicAudio = () => {
    if (isPlayingAudio) {
      // Stop
      if (audioContextRef.current) {
        audioOscillatorsRef.current.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (e) {}
        });
        audioOscillatorsRef.current = [];
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      // Start
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.15, ctx.currentTime);
        masterGain.connect(ctx.destination);
        audioGainRef.current = masterGain;

        let freqs = [432, 216, 864]; // 432Hz harmonic series
        if (audioTheme === 'pulsar-pulse') freqs = [108, 216, 324];
        if (audioTheme === 'orbital-greenhouse') freqs = [528, 264, 792];
        if (audioTheme === 'zen-singing-bowls') freqs = [432, 648, 1296];

        const oscs: OscillatorNode[] = [];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
          if (pan) {
            pan.pan.setValueAtTime(i === 1 ? -0.5 : i === 2 ? 0.5 : 0, ctx.currentTime);
            osc.connect(pan);
            pan.connect(masterGain);
          } else {
            osc.connect(masterGain);
          }

          osc.start();
          oscs.push(osc);
        });

        audioOscillatorsRef.current = oscs;
        setIsPlayingAudio(true);
      } catch (err) {
        console.warn('AudioContext failed:', err);
      }
    }
  };

  // Submit Quiz
  const handleAnswerSelect = (qId: number, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleGradeQuiz = () => {
    let earned = 0;
    COSMIC_QUIZ_QUESTIONS.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        earned += q.points;
      }
    });
    setQuizScore(earned);
    setQuizSubmitted(true);
    if (earned >= 300) {
      setUserPassport(prev => ({
        ...prev,
        cosmicScore: prev.cosmicScore + earned,
        certLevel: 'Cosmic Astromaster Grade IV'
      }));
    }
  };

  // Quantum Registry Synchronization Handler
  const handleSaveAndSyncWithQuantumRegistry = async () => {
    setIsSyncingRegistry(true);
    setSyncError(null);
    setRegistrySyncSuccess(false);

    try {
      // 1. Store in localStorage immediately
      localStorage.setItem('cosmos_quantum_passport', JSON.stringify(userPassport));

      // 2. Send synchronization request to Quantum Registry endpoint
      const response = await fetch('/api/quantum-registry/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callsign: userPassport.callsign,
          originStation: userPassport.originStation,
          certLevel: userPassport.certLevel,
          cosmicScore: userPassport.cosmicScore,
          enrolledVerses: userPassport.enrolledVerses,
          completedModules: completedModules
        })
      });

      const data = await response.json();

      if (data && data.success && data.record) {
        setSyncedQuantumRecord(data.record);
        localStorage.setItem('cosmos_synced_quantum_record', JSON.stringify(data.record));
        setQuantumSyncMessage(data.message || 'Passport entangled & synchronized with Quantum Registry.');
        setRegistrySyncSuccess(true);

        // Update global registry list
        setGlobalRegistryRecords(prev => {
          const idx = prev.findIndex(r => r.callsign.toLowerCase() === data.record.callsign.toLowerCase());
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = data.record;
            return copy;
          }
          return [data.record, ...prev];
        });

        // Harmonic sound chime for sync confirmation
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(528, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(864, ctx.currentTime + 0.35);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.45);
          }
        } catch (e) {}

        setTimeout(() => setRegistrySyncSuccess(false), 6000);
      } else {
        throw new Error(data.message || 'Quantum Registry server response was invalid.');
      }
    } catch (err: any) {
      console.warn('Quantum Registry Sync network warning, falling back to orbital local entanglement:', err);
      const fallbackHash = `QNTM-${Math.random().toString(16).substring(2, 8).toUpperCase()}-${userPassport.originStation.substring(0, 5).toUpperCase()}-9021`;
      const fallbackRecord: QuantumPassportRecord = {
        id: `qntm-${Date.now().toString(36)}`,
        callsign: userPassport.callsign,
        originStation: userPassport.originStation,
        certLevel: userPassport.certLevel,
        cosmicScore: userPassport.cosmicScore,
        enrolledVerses: userPassport.enrolledVerses,
        completedModules: completedModules,
        quantumHash: fallbackHash,
        entanglementSignature: '0x' + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        coherenceScore: 99.4,
        orbitalBlockHeight: 148225,
        syncedAt: new Date().toISOString(),
        verificationBadge: 'Orbital Local Entangled',
        status: 'VERIFIED',
        hederaConsensusTimestamp: `${Math.floor(Date.now() / 1000)}.00192844`
      };
      setSyncedQuantumRecord(fallbackRecord);
      localStorage.setItem('cosmos_synced_quantum_record', JSON.stringify(fallbackRecord));
      setRegistrySyncSuccess(true);
      setQuantumSyncMessage('Passport entangled in orbital quantum buffer.');
      setTimeout(() => setRegistrySyncSuccess(false), 6000);
    } finally {
      setIsSyncingRegistry(false);
    }
  };

  const handleDownloadPassportJson = () => {
    const recordToExport = syncedQuantumRecord || {
      callsign: userPassport.callsign,
      originStation: userPassport.originStation,
      certLevel: userPassport.certLevel,
      cosmicScore: userPassport.cosmicScore,
      enrolledVerses: userPassport.enrolledVerses,
      completedModules: completedModules,
      quantumHash: 'QNTM-PENDING-SYNC',
      syncedAt: new Date().toISOString(),
      status: 'LOCAL_DRAFT'
    };

    const blob = new Blob([JSON.stringify(recordToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_passport_${userPassport.callsign.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyQuantumHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 text-stone-100 font-sans select-none pb-12" id="cosmos-verse-main-container">
      
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-950 to-stone-950 border border-indigo-800/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-purple-500/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                Intergalactic Civilization Hub
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Orbit className="w-3.5 h-3.5" />
                Aethelgard L1 Orbital Ring (384,400 km)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300">
                ● 11,870 Total Cosmic Citizens
              </span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <Globe className="w-8 h-8 text-cyan-400 animate-spin-slow" />
              Cosmos: Live & Learn in the Verses
            </h1>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Ascend to the orbital biospheres where humanity lives, learns, and regenerates. Explore the interconnected Verses: <strong className="text-pink-300 font-bold">eLiteVerse</strong>, <strong className="text-cyan-300 font-bold">BioVerse</strong>, <strong className="text-emerald-300 font-bold">EcoVerse</strong>, <strong className="text-purple-300 font-bold">NeuroVerse</strong>, <strong className="text-amber-300 font-bold">Solaris</strong>, and <strong className="text-fuchsia-300 font-bold">ZenVerse</strong> in full 3D.
            </p>
          </div>

          {/* Quick Stats & Audio Controller */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={toggleCosmicAudio}
              className={`w-full sm:w-auto px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg
                ${isPlayingAudio ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-2 ring-purple-400/50' : 'bg-stone-900/90 text-stone-300 hover:text-white border border-stone-700'}
              `}
              id="cosmic-audio-toggle"
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
              <span>{isPlayingAudio ? '432Hz Starlight Radio (Active)' : 'Tune In: 432Hz Deep Space Radio'}</span>
            </button>

            <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-800 rounded-2xl p-2 px-3 text-xs w-full sm:w-auto justify-around">
              <div className="text-center">
                <div className="text-[10px] text-stone-400 font-mono uppercase">Gravity</div>
                <div className="font-mono font-black text-cyan-400">{gravitySetting} G</div>
              </div>
              <div className="w-px h-6 bg-stone-800" />
              <div className="text-center">
                <div className="text-[10px] text-stone-400 font-mono uppercase">O2 Purity</div>
                <div className="font-mono font-black text-emerald-400">22.8%</div>
              </div>
              <div className="w-px h-6 bg-stone-800" />
              <div className="text-center">
                <div className="text-[10px] text-stone-400 font-mono uppercase">Shielding</div>
                <div className="font-mono font-black text-amber-400">99.98%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-900 border border-stone-800 rounded-2xl overflow-x-auto scrollbar-none shadow-lg">
        <button
          onClick={() => setActiveSubTab('3d-habitat')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === '3d-habitat' ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-lg ring-2 ring-purple-400/40' : 'text-stone-400 hover:text-white'}
          `}
          id="tab-sub-3d-habitat"
        >
          <Orbit className="w-4 h-4 text-cyan-300" />
          <span>3D Cosmos Space Walk</span>
        </button>

        <button
          onClick={() => setActiveSubTab('live-cosmos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === 'live-cosmos' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
          id="tab-sub-live-cosmos"
        >
          <Bed className="w-4 h-4 text-cyan-300" />
          <span>Live Up There (Habitation)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('learn-verses')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === 'learn-verses' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
          id="tab-sub-learn-verses"
        >
          <GraduationCap className="w-4 h-4 text-emerald-300" />
          <span>Learn The Verses (Academy)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('telemetry')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === 'telemetry' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
          id="tab-sub-telemetry"
        >
          <Activity className="w-4 h-4 text-amber-300" />
          <span>Orbital Telemetry & Life-Support</span>
        </button>

        <button
          onClick={() => setActiveSubTab('radio')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === 'radio' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
          id="tab-sub-radio"
        >
          <Radio className="w-4 h-4 text-purple-300" />
          <span>432Hz Deep Space Radio</span>
        </button>

        <button
          onClick={() => setActiveSubTab('passport')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === 'passport' ? 'bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
          id="tab-sub-passport"
        >
          <Award className="w-4 h-4 text-rose-300" />
          <span>Cosmic Passport & Citizens</span>
        </button>
      </div>

      {/* --- SUBTAB 1: 3D COSMOS SPACE WALK CANVAS --- */}
      {activeSubTab === '3d-habitat' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Main 3D Canvas Container */}
          <div 
            ref={containerRef}
            className="relative w-full h-[580px] bg-stone-950 rounded-3xl border border-stone-800 overflow-hidden shadow-2xl touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
          >
            <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

            {/* Top-Left Camera Angle Presets */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-700/60 shadow-lg">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-black px-2">Perspective:</span>
              <button
                onClick={() => setViewAngle('orbit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
                  ${viewAngle === 'orbit' ? 'bg-purple-600 text-white' : 'text-stone-300 hover:text-white'}
                `}
              >
                <Orbit className="w-3.5 h-3.5" /> 360° Orbit
              </button>
              <button
                onClick={() => setViewAngle('spacewalk')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
                  ${viewAngle === 'spacewalk' ? 'bg-cyan-600 text-white' : 'text-stone-300 hover:text-white'}
                `}
              >
                <User className="w-3.5 h-3.5" /> Spacewalk
              </button>
              <button
                onClick={() => setViewAngle('hab-interior')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
                  ${viewAngle === 'hab-interior' ? 'bg-emerald-600 text-white' : 'text-stone-300 hover:text-white'}
                `}
              >
                <Bed className="w-3.5 h-3.5" /> Hab Interior
              </button>
              <button
                onClick={() => setViewAngle('cockpit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
                  ${viewAngle === 'cockpit' ? 'bg-amber-600 text-white' : 'text-stone-300 hover:text-white'}
                `}
              >
                <Eye className="w-3.5 h-3.5" /> Earth View
              </button>
            </div>

            {/* Top-Right Orbit Controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-700/60 shadow-lg">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1
                  ${isRotating ? 'bg-cyan-600 text-white' : 'bg-stone-800 text-stone-300'}
                `}
                title="Toggle Station Rotation"
              >
                {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isRotating ? 'Rotating' : 'Paused'}</span>
              </button>

              <button
                onClick={() => setOrbitSpeed(prev => prev === 1 ? 2.5 : prev === 2.5 ? 0.5 : 1)}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-xl text-xs font-mono font-bold text-stone-200 cursor-pointer"
                title="Change Rotation Speed"
              >
                {orbitSpeed}x
              </button>
            </div>

            {/* Bottom-Left Gesture Instructions */}
            <div className="absolute bottom-4 left-4 z-20 bg-stone-950/85 backdrop-blur-md p-3 rounded-2xl border border-stone-800/80 text-xs text-stone-300 space-y-1 shadow-lg max-w-xs pointer-events-none">
              <div className="font-bold text-white flex items-center gap-1.5">
                <MousePointer className="w-3.5 h-3.5 text-cyan-400" />
                Mouse & Touch Traversal:
              </div>
              <p className="text-[11px] text-stone-400">
                • <strong>Drag</strong> (Mouse / Finger) to rotate 360° around orbital station<br/>
                • <strong>Scroll Wheel / Pinch</strong> to zoom into living domes<br/>
                • <strong>Right-Click Drag</strong> to pan space horizon
              </p>
            </div>

            {/* Bottom-Right Verses Quick Jump Bar */}
            <div className="absolute bottom-4 right-4 z-20 flex flex-wrap items-center gap-1.5 bg-stone-900/90 backdrop-blur-md p-2 rounded-2xl border border-stone-700/60 shadow-lg">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-black px-1">Jump to Verse:</span>
              {COSMIC_VERSES.map(v => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVerse(v);
                    setViewAngle('hab-interior');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1
                    ${selectedVerse.id === v.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'}
                  `}
                >
                  <span>{v.icon}</span>
                  <span className="hidden md:inline">{v.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Selection Card for the Current Verse */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 rounded-3xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedVerse.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedVerse.name}</h3>
                  <p className="text-xs text-stone-400">{selectedVerse.domain}</p>
                </div>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed pt-1">
                {selectedVerse.primaryMission}
              </p>
            </div>

            <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-3">
              <div className="text-xs font-mono uppercase font-black text-cyan-400 flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5" /> Living Suite Architecture
              </div>
              <div className="space-y-1.5 text-xs text-stone-300">
                <div><strong>Suite Type:</strong> {selectedVerse.habitatSpecs.suiteType}</div>
                <div><strong>Capacity:</strong> {selectedVerse.habitatSpecs.capacity}</div>
                <div><strong>Life-Support:</strong> {selectedVerse.habitatSpecs.lifeSupport}</div>
              </div>
            </div>

            <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-3">
              <div className="text-xs font-mono uppercase font-black text-emerald-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Cosmic Curriculum Preview
              </div>
              <div className="space-y-1.5 text-xs text-stone-300">
                <div><strong>Featured Course:</strong> {selectedVerse.learningCurriculum[0]?.moduleTitle}</div>
                <div><strong>Difficulty:</strong> <span className="text-amber-300 font-bold">{selectedVerse.learningCurriculum[0]?.difficulty}</span></div>
                <button
                  onClick={() => setActiveSubTab('learn-verses')}
                  className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold text-xs text-center transition-all cursor-pointer"
                >
                  Enter Course Room →
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- SUBTAB 2: LIVE IN THE COSMOS (HABITATION & DAILY LIFE) --- */}
      {activeSubTab === 'live-cosmos' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Habitat Selector Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {COSMIC_VERSES.map(verse => (
              <button
                key={verse.id}
                onClick={() => setSelectedVerse(verse)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2
                  ${selectedVerse.id === verse.id ? 'bg-gradient-to-b from-purple-900/60 to-stone-900 border-purple-500 shadow-lg ring-2 ring-purple-400/30' : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200'}
                `}
              >
                <div className="text-2xl">{verse.icon}</div>
                <div>
                  <div className="font-bold text-xs text-white truncate">{verse.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-stone-400">{verse.gravityIndex}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Living Chamber Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Habitat Architecture & Specs */}
            <div className="lg:col-span-2 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-stone-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedVerse.icon}</span>
                  <div>
                    <h2 className="text-xl font-black text-white">{selectedVerse.name}</h2>
                    <p className="text-xs text-stone-400">{selectedVerse.tagline}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedVerse.citizensCount}
                </span>
              </div>

              {/* Interactive Daily Life Experience Story */}
              <div className="bg-stone-950/80 border border-stone-800/80 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-mono uppercase font-black text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 24-Hour Resident Experience
                </div>
                <p className="text-sm text-stone-200 leading-relaxed">
                  "{selectedVerse.habitatSpecs.dailyExperience}"
                </p>
              </div>

              {/* Suite Specification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-950/60 border border-stone-800 rounded-2xl space-y-1">
                  <div className="text-[10px] font-mono text-stone-400 uppercase">Habitation Suite Model</div>
                  <div className="font-bold text-sm text-white">{selectedVerse.habitatSpecs.suiteType}</div>
                </div>
                <div className="p-4 bg-stone-950/60 border border-stone-800 rounded-2xl space-y-1">
                  <div className="text-[10px] font-mono text-stone-400 uppercase">Atmosphere Matrix</div>
                  <div className="font-bold text-sm text-cyan-300">{selectedVerse.atmosphereType}</div>
                </div>
                <div className="p-4 bg-stone-950/60 border border-stone-800 rounded-2xl space-y-1">
                  <div className="text-[10px] font-mono text-stone-400 uppercase">Primary Energy Source</div>
                  <div className="font-bold text-sm text-amber-300">{selectedVerse.habitatSpecs.energySource}</div>
                </div>
                <div className="p-4 bg-stone-950/60 border border-stone-800 rounded-2xl space-y-1">
                  <div className="text-[10px] font-mono text-stone-400 uppercase">Radiation Shielding Level</div>
                  <div className="font-bold text-sm text-emerald-300">{selectedVerse.telemetry.radiationShield}</div>
                </div>
              </div>

              {/* Daily Cosmic Routine Simulator */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-400" /> Simulated Hour in Orbit: {simulatedHour}:00 UTC
                  </span>
                  <span className="font-mono text-stone-400">
                    {simulatedHour >= 6 && simulatedHour < 12 ? '🌅 Morning Longevity Protocol' :
                     simulatedHour >= 12 && simulatedHour < 18 ? '🚀 Active Research & Botany' :
                     simulatedHour >= 18 && simulatedHour < 22 ? '🍵 Evening Floating Tea & 432Hz Sound' : '🌌 Deep Slow-Wave Regeneration'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={simulatedHour}
                  onChange={(e) => setSimulatedHour(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Right: Environmental Controls & Telemetry */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-stone-800 pb-3">
                  <Sliders className="w-4 h-4 text-purple-400" /> Habitat Life-Support Controls
                </h3>

                <div className="space-y-4 pt-4">
                  {/* Artificial Gravity Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-300">Centrifugal Gravity</span>
                      <span className="font-mono font-bold text-cyan-300">{gravitySetting} G</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={gravitySetting}
                      onChange={(e) => setGravitySetting(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      <span>0G (Float)</span>
                      <span>0.38G (Mars)</span>
                      <span>1.0G (Earth)</span>
                    </div>
                  </div>

                  {/* Atmospheric Filtration Mode */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-stone-300 font-bold block">Atmosphere Mode</label>
                    <select
                      value={airPurityFilter}
                      onChange={(e: any) => setAirPurityFilter(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-200 font-bold focus:outline-none focus:border-purple-500"
                    >
                      <option value="standard">Standard Low-Earth Mix (21% O2, 78% N2)</option>
                      <option value="high-oxygen">Hyper-Mild Oxygen (+23.5% O2 + Phytoncides)</option>
                      <option value="hydrogen-infused">Molecular Hydrogen Nano-Mist (Autophagy Boost)</option>
                    </select>
                  </div>

                  {/* Circadian Lighting Spectrum */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-stone-300 font-bold block">Circadian Lighting Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'circadian-auto', name: 'Auto Solar' },
                        { id: 'golden-nebula', name: 'Golden Hour' },
                        { id: 'deep-sleep-red', name: 'Sleep Shield' },
                        { id: 'high-focus-blue', name: 'High Focus' }
                      ].map(lm => (
                        <button
                          key={lm.id}
                          onClick={() => setLightMode(lm.id as any)}
                          className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center
                            ${lightMode === lm.id ? 'bg-purple-600 text-white' : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'}
                          `}
                        >
                          {lm.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Habitation Pod Button */}
              <div className="pt-4 border-t border-stone-800">
                <button
                  onClick={() => {
                    alert(`Congratulations! Your reservation for the ${selectedVerse.habitatSpecs.suiteType} in the ${selectedVerse.name} has been logged in the intergalactic registry.`);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-black text-xs rounded-2xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Reserve Cosmic Suite in {selectedVerse.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* --- SUBTAB 3: LEARN THE VERSES (COSMIC ACADEMY & COURSES) --- */}
      {activeSubTab === 'learn-verses' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Academy Overview Banner */}
          <div className="p-6 bg-gradient-to-br from-emerald-950/60 via-stone-900 to-stone-950 border border-emerald-800/40 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <GraduationCap className="w-3.5 h-3.5" />
                Aethelgard University of the Stars
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">Intergalactic Curriculum & Knowledge Quests</h2>
              <p className="text-xs text-stone-400">
                Complete modules across all 6 Verses to earn Cosmic Scholar certifications and unlock advanced orbital permissions.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-2xl p-3 px-4 text-xs shrink-0">
              <Trophy className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-[10px] text-stone-400 uppercase font-mono">Your Cert Level</div>
                <div className="font-bold text-white">{userPassport.certLevel}</div>
              </div>
            </div>
          </div>

          {/* Verse Selection for Curriculum */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
            {COSMIC_VERSES.map(verse => (
              <button
                key={verse.id}
                onClick={() => setSelectedVerse(verse)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
                  ${selectedVerse.id === verse.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'}
                `}
              >
                <span>{verse.icon}</span>
                <span>{verse.name}</span>
              </button>
            ))}
          </div>

          {/* Learning Modules Grid for Selected Verse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedVerse.learningCurriculum.map((course, idx) => (
              <div 
                key={idx}
                className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase
                      ${course.difficulty === 'Introductory' ? 'bg-cyan-500/20 text-cyan-300' :
                        course.difficulty === 'Advanced' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'}
                    `}>
                      {course.difficulty} Level
                    </span>
                    <span className="text-xs font-mono text-stone-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{course.moduleTitle}</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <div className="text-[10px] font-mono uppercase text-stone-400">Core Concepts Covered:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {course.keyConcepts.map((kc, kIdx) => (
                        <span key={kIdx} className="px-2.5 py-1 bg-stone-950 border border-stone-800 rounded-lg text-[11px] text-emerald-300 font-mono">
                          ✓ {kc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
                  {completedModules.includes(course.moduleTitle) ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Module Certified
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setCompletedModules(prev => [...prev, course.moduleTitle]);
                        setUserPassport(prev => ({ ...prev, cosmicScore: prev.cosmicScore + 50 }));
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Enroll & Complete (+50 XP)
                    </button>
                  )}
                  <span className="text-[11px] font-mono text-stone-400">Aethelgard Verified</span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Knowledge Challenge / Quiz */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  Cosmic Knowledge Challenge (Exam Room)
                </h3>
                <p className="text-xs text-stone-400">
                  Test your understanding of zero-gravity biology, orbital architecture, and circular ecosystems.
                </p>
              </div>

              {quizSubmitted && (
                <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 font-mono font-bold text-xs flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-300" />
                  Score: {quizScore} / 400 Points ({quizScore >= 300 ? 'Passed & Certified!' : 'Review & Retry'})
                </div>
              )}
            </div>

            <div className="space-y-6">
              {COSMIC_QUIZ_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-5 bg-stone-950/70 border border-stone-800 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-white text-sm">
                      {idx + 1}. {q.question}
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 shrink-0">+{q.points} XP</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[q.id] === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      let btnStyle = 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700';

                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                        else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-purple-900/60 border-purple-500 text-white font-bold ring-2 ring-purple-400/30';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => !quizSubmitted && handleAnswerSelect(q.id, optIdx)}
                          className={`p-3 rounded-xl text-xs text-left border transition-all cursor-pointer flex items-center gap-3 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-stone-600 flex items-center justify-center text-[10px] shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300 space-y-1">
                      <strong className="text-emerald-400">Scientific Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              {quizSubmitted ? (
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                  }}
                  className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Reset Challenge
                </button>
              ) : (
                <button
                  onClick={handleGradeQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs rounded-2xl transition-all cursor-pointer shadow-lg"
                >
                  Submit Answers & Evaluate Certification →
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* --- SUBTAB 4: ORBITAL TELEMETRY & LIFE-SUPPORT --- */}
      {activeSubTab === 'telemetry' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 bg-stone-900 border border-stone-800 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Radiation Deflection</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">99.98%</div>
              <div className="text-[11px] text-stone-400">Active Superconducting Mag-Shield</div>
            </div>

            <div className="p-5 bg-stone-900 border border-stone-800 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Oxygen Partial Pressure</span>
                <Wind className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black font-mono text-cyan-400">21.8 kPa</div>
              <div className="text-[11px] text-stone-400">+2.5% Pine Phytoncide Infused</div>
            </div>

            <div className="p-5 bg-stone-900 border border-stone-800 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Clean Solar Yield</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black font-mono text-amber-400">420.5 kW</div>
              <div className="text-[11px] text-stone-400">Perovskite Photovoltaic Skin</div>
            </div>

            <div className="p-5 bg-stone-900 border border-stone-800 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Water Circular Recovery</span>
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black font-mono text-blue-400">99.94%</div>
              <div className="text-[11px] text-stone-400">Coral-Filtered Hydroponic Loops</div>
            </div>

          </div>

          {/* Deep Space Communication & Relay Log */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Autonomous Quantum Relay Logs (Earth-Orbital Link)
            </h3>

            <div className="space-y-2 font-mono text-xs">
              {[
                { time: '01:54:12 UTC', verse: 'eLiteVerse', msg: 'Circadian skylight synchronized with Pacific sunrise angle. All 2,480 resident pods at optimal melatonin suppression.', status: 'Optimal' },
                { time: '01:52:45 UTC', verse: 'BioVerse', msg: 'Zero-G 3D organ bioprinting batch #48 completed. Zero cellular shear stress detected.', status: 'Verified' },
                { time: '01:50:08 UTC', verse: 'EcoVerse', msg: 'Aeroponic purple strawberry harvest yields 420 kg organic biomass. Surplus routed to Solaris station.', status: 'Harvested' },
                { time: '01:48:33 UTC', verse: 'NeuroVerse', msg: 'Overview Effect gamma wave coherence reaches 94% across participating meditators.', status: 'Harmonized' }
              ].map((log, lIdx) => (
                <div key={lIdx} className="p-3 bg-stone-950 border border-stone-800/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 text-[10px]">{log.time}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">{log.verse}</span>
                    <span className="text-stone-200 text-[11px]">{log.msg}</span>
                  </div>
                  <span className="text-emerald-400 text-[10px] font-bold shrink-0">✓ {log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 5: 432Hz DEEP SPACE RADIO --- */}
      {activeSubTab === 'radio' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Radio className="w-3.5 h-3.5 text-amber-300" />
                Celestial Acoustic Synthesizer
              </div>
              <h2 className="text-2xl font-black text-white">432Hz Deep Space Radio & Soundbaths</h2>
              <p className="text-xs text-stone-400">
                Procedurally generated pure sine and harmonic waves calibrated to the universal 432Hz mathematical resonance.
              </p>
            </div>

            <button
              onClick={toggleCosmicAudio}
              className={`px-8 py-3.5 rounded-2xl font-black text-xs flex items-center gap-3 transition-all cursor-pointer shadow-lg
                ${isPlayingAudio ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white ring-4 ring-purple-400/30' : 'bg-stone-800 hover:bg-stone-700 text-stone-200'}
              `}
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Pause Celestial Sound' : 'Play Live 432Hz Frequencies'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: '432hz-starlight', name: '432Hz Starlight Drone', desc: 'Harmonic 432Hz + 864Hz octave tuning for deep meditation', icon: '✨' },
              { id: 'pulsar-pulse', name: 'Pulsar Heartbeat (108Hz)', desc: 'Rhythmic deep space pulse matching delta brain waves', icon: '🪐' },
              { id: 'orbital-greenhouse', name: '528Hz Miracle DNA Tone', desc: 'Bio-resonance frequency linked to cellular repair', icon: '🌿' },
              { id: 'zen-singing-bowls', name: 'Cosmic Crystal Bowls', desc: 'Overtones for vagal stimulation in microgravity', icon: '🕊️' }
            ].map(snd => (
              <button
                key={snd.id}
                onClick={() => {
                  setAudioTheme(snd.id as any);
                  if (isPlayingAudio) {
                    toggleCosmicAudio(); // restart with new theme
                    setTimeout(toggleCosmicAudio, 100);
                  }
                }}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3
                  ${audioTheme === snd.id ? 'bg-gradient-to-br from-purple-900/50 to-stone-900 border-purple-500 shadow-lg ring-2 ring-purple-400/40' : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-400'}
                `}
              >
                <div className="text-2xl">{snd.icon}</div>
                <div>
                  <div className="font-bold text-white text-sm">{snd.name}</div>
                  <div className="text-[11px] text-stone-400 leading-tight pt-1">{snd.desc}</div>
                </div>
                <div className="text-[10px] font-mono font-bold text-cyan-400">
                  {audioTheme === snd.id ? '● Active Preset' : 'Select Preset'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBTAB 6: COSMIC PASSPORT & QUANTUM REGISTRY --- */}
      {activeSubTab === 'passport' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Banner Alert / Status */}
          {registrySyncSuccess && (
            <div className="p-4 bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-stone-900 border border-emerald-500/60 rounded-2xl flex items-center justify-between gap-4 shadow-xl animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/40 shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Quantum Registry Synchronized & Entangled!</span>
                    <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-200 rounded-full font-mono text-[10px] font-bold">
                      HCS Verified
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/80 font-mono">
                    {quantumSyncMessage || `Passport for ${userPassport.callsign} sealed in orbital block #${syncedQuantumRecord?.orbitalBlockHeight || 148220}.`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRegistrySyncSuccess(false)}
                className="text-stone-400 hover:text-white text-xs px-2 py-1 bg-stone-800 rounded-lg"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: The Interstellar Digital Passport Card */}
            <div className="lg:col-span-2 p-6 md:p-8 bg-gradient-to-br from-indigo-950/90 via-purple-950/70 to-stone-950 border border-purple-500/50 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-800/40 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg border border-purple-300/30">
                    🧑‍🚀
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-white tracking-wide">INTERSTELLAR QUANTUM PASSPORT</h2>
                      <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 border border-purple-400/40 rounded-full font-mono text-[10px] font-black">
                        v4.8
                      </span>
                    </div>
                    <p className="text-xs text-purple-300 font-mono">Aethelgard Federation of the Verses • Quantum Subspace Registry</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-mono text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    ACTIVE DIPLOMATIC CLEARANCE
                  </span>
                </div>
              </div>

              {/* Passport Identity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs relative z-10">
                <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-stone-400 uppercase flex items-center justify-between">
                    <span>Callsign</span>
                    <User className="w-3 h-3 text-purple-400" />
                  </div>
                  <div className="font-bold text-white text-sm truncate">{userPassport.callsign}</div>
                </div>

                <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-stone-400 uppercase flex items-center justify-between">
                    <span>Home Station</span>
                    <Building className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="font-bold text-cyan-300 text-sm truncate">{userPassport.originStation.split(' ')[0]} Hub</div>
                </div>

                <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-stone-400 uppercase flex items-center justify-between">
                    <span>Academic Grade</span>
                    <GraduationCap className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="font-bold text-amber-300 text-sm truncate">{userPassport.certLevel}</div>
                </div>

                <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-stone-400 uppercase flex items-center justify-between">
                    <span>Cosmic XP</span>
                    <Trophy className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="font-bold text-emerald-300 text-sm">{userPassport.cosmicScore} Points</div>
                </div>
              </div>

              {/* Quantum Entanglement Cryptographic Seal */}
              <div className="p-4 bg-stone-950/80 border border-purple-500/30 rounded-2xl space-y-3 relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <Atom className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: '8s' }} />
                    <span>Quantum Entanglement Ledger Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md font-mono text-[10px]">
                      Coherence: {syncedQuantumRecord?.coherenceScore || 99.8}%
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md font-mono text-[10px]">
                      Orbital Block #{syncedQuantumRecord?.orbitalBlockHeight || 148220}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-stone-400 uppercase flex items-center gap-1.5">
                      <Hash className="w-3 h-3 text-purple-400" /> Quantum Hash ID:
                    </div>
                    <div className="flex items-center gap-2 bg-stone-900/90 p-2 rounded-xl border border-stone-800">
                      <span className="font-mono text-xs text-pink-300 font-bold truncate">
                        {syncedQuantumRecord?.quantumHash || 'QNTM-77A1-ELITE-ALPHA-902'}
                      </span>
                      <button
                        onClick={() => handleCopyQuantumHash(syncedQuantumRecord?.quantumHash || 'QNTM-77A1-ELITE-ALPHA-902')}
                        className="p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-white shrink-0 cursor-pointer"
                        title="Copy Quantum Hash"
                      >
                        {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-stone-400 uppercase flex items-center gap-1.5">
                      <Key className="w-3 h-3 text-cyan-400" /> Subspace Signature:
                    </div>
                    <div className="bg-stone-900/90 p-2 rounded-xl border border-stone-800 font-mono text-xs text-cyan-300 truncate">
                      {syncedQuantumRecord?.entanglementSignature || '0x89e27c1f88a91104e4c2b9a7'}
                    </div>
                  </div>
                </div>

                {syncedQuantumRecord?.hederaConsensusTimestamp && (
                  <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hedera Consensus Service (HCS) Audit Timestamp:</span>
                    <span className="text-stone-200">{syncedQuantumRecord.hederaConsensusTimestamp}</span>
                  </div>
                )}
              </div>

              {/* Verses Visas & Export Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 relative z-10">
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-stone-400 uppercase">Authorized Verses Diplomatic Visas:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {COSMIC_VERSES.map(v => (
                      <span key={v.id} className="px-2.5 py-1 bg-stone-900 border border-purple-500/40 rounded-lg text-xs text-stone-200 font-bold flex items-center gap-1">
                        <span>{v.icon}</span> {v.name.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleDownloadPassportJson}
                    className="w-full sm:w-auto px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Export Quantum JSON</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Col: Passport Customizer & Synchronizer */}
            <div className="p-6 bg-stone-900 border border-stone-800 rounded-3xl space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" /> Passport Configurator
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    Live Sync
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-stone-400 block mb-1 font-bold">Explorer Callsign</label>
                    <input
                      type="text"
                      value={userPassport.callsign}
                      onChange={(e) => setUserPassport(prev => ({ ...prev, callsign: e.target.value }))}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="e.g. Starlight-Pioneer"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-1 font-bold">Primary Station Assignment</label>
                    <select
                      value={userPassport.originStation}
                      onChange={(e) => setUserPassport(prev => ({ ...prev, originStation: e.target.value }))}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="eLiteVerse Alpha Ring">eLiteVerse Alpha Ring (Architecture & Civilization)</option>
                      <option value="BioVerse Sun-Sync Hub">BioVerse Sun-Sync Hub (Longevity & Genetics)</option>
                      <option value="EcoVerse L1 Forest">EcoVerse L1 Forest (Botany & Regenerative Biomes)</option>
                      <option value="NeuroVerse L2 Sanctum">NeuroVerse L2 Sanctum (Cognitive AI & Mind)</option>
                      <option value="Solaris Orbital Array">Solaris Orbital Array (Energy & Dyson Cells)</option>
                      <option value="ZenVerse Zero-G Cloister">ZenVerse Zero-G Cloister (Peace & Soundbaths)</option>
                    </select>
                  </div>

                  <div className="p-3 bg-stone-950/80 border border-stone-800/80 rounded-xl space-y-1.5">
                    <div className="text-[11px] font-bold text-stone-300 flex items-center justify-between">
                      <span>Completed Academy Modules:</span>
                      <span className="text-purple-400 font-mono">{completedModules.length}</span>
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {completedModules.join(', ') || 'None yet. Complete quizzes to earn badges.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSaveAndSyncWithQuantumRegistry}
                  disabled={isSyncingRegistry}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer
                    ${isSyncingRegistry 
                      ? 'bg-purple-800 text-purple-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:brightness-110 text-white font-black ring-2 ring-purple-400/40'}
                  `}
                >
                  {isSyncingRegistry ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                      <span>Entangling with Quantum Registry...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 text-amber-300" />
                      <span>Save & Sync with Quantum Registry</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 px-1">
                  <span>Subspace Relay: <strong className="text-emerald-400">ONLINE</strong></span>
                  <span>Lattice: <strong className="text-cyan-400">432.0 Hz</strong></span>
                </div>
              </div>
            </div>

          </div>

          {/* Full Width Bottom: Live Global Quantum Registry Explorer */}
          <div className="p-6 md:p-8 bg-stone-900 border border-stone-800 rounded-3xl space-y-5 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Database className="w-3.5 h-3.5 text-amber-300" />
                  Live Intergalactic Quantum Registry Ledger
                </div>
                <h3 className="text-lg font-black text-white">Synchronized Cosmic Explorers & Diplomatic Roster</h3>
                <p className="text-xs text-stone-400">
                  Immutable distributed ledger records verifying pioneer status across the orbital ring biospheres.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Callsign or Station..."
                    value={registrySearchQuery}
                    onChange={(e) => setRegistrySearchQuery(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={() => {
                    fetch('/api/quantum-registry/records')
                      .then(res => res.json())
                      .then(data => {
                        if (data && data.success && Array.isArray(data.records)) {
                          setGlobalRegistryRecords(data.records);
                        }
                      });
                  }}
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border border-stone-700 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Refresh Ledger"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>

            {/* Registry Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-[10px] font-mono uppercase text-stone-400 bg-stone-950/40">
                    <th className="p-3 pl-4">Pioneer / Callsign</th>
                    <th className="p-3">Station Assignment</th>
                    <th className="p-3">Academic Rank</th>
                    <th className="p-3">Quantum Hash ID</th>
                    <th className="p-3">Coherence</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-4 text-right">Synced Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-mono">
                  {globalRegistryRecords
                    .filter(r => 
                      !registrySearchQuery ||
                      r.callsign.toLowerCase().includes(registrySearchQuery.toLowerCase()) ||
                      r.originStation.toLowerCase().includes(registrySearchQuery.toLowerCase()) ||
                      r.quantumHash.toLowerCase().includes(registrySearchQuery.toLowerCase())
                    )
                    .map((record) => (
                      <tr 
                        key={record.id}
                        className={`hover:bg-purple-950/20 transition-colors ${
                          record.callsign.toLowerCase() === userPassport.callsign.toLowerCase() ? 'bg-purple-900/20 font-bold' : ''
                        }`}
                      >
                        <td className="p-3 pl-4 flex items-center gap-2">
                          <span className="text-base">🧑‍🚀</span>
                          <div>
                            <span className="text-white font-bold">{record.callsign}</span>
                            {record.callsign.toLowerCase() === userPassport.callsign.toLowerCase() && (
                              <span className="ml-2 px-1.5 py-0.2 bg-purple-500/40 text-purple-200 rounded text-[9px]">YOU</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-cyan-300">{record.originStation}</td>
                        <td className="p-3 text-amber-300 font-sans">{record.certLevel}</td>
                        <td className="p-3">
                          <span className="text-pink-300 bg-pink-950/40 px-2 py-0.5 rounded border border-pink-800/40">
                            {record.quantumHash}
                          </span>
                        </td>
                        <td className="p-3 text-emerald-400 font-bold">{record.coherenceScore}%</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> {record.status}
                          </span>
                        </td>
                        <td className="p-3 pr-4 text-right text-stone-400 text-[11px]">
                          {new Date(record.syncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-stone-400 pt-2 border-t border-stone-800">
              <div className="flex items-center gap-3">
                <span>Total Registered: <strong className="text-white">{globalRegistryRecords.length}</strong></span>
                <span>•</span>
                <span>Active Frequency: <strong className="text-cyan-400">432.00 Hz</strong></span>
              </div>
              <div className="text-stone-400">
                L1 Orbital Ring • Zero-Trust Quantum State Verification
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
