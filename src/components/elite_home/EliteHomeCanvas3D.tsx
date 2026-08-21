import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MASTERPLAN_DISTRICTS, MasterplanDistrict } from './eliteHomeData';
import { 
  Maximize2, 
  RotateCcw, 
  Sun, 
  Moon, 
  Sunrise, 
  Eye, 
  Navigation, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Camera,
  Layers,
  MapPin
} from 'lucide-react';
import { soundEngine } from './soundEngine';

interface EliteHomeCanvas3DProps {
  selectedDistrict: MasterplanDistrict | null;
  onSelectDistrict: (district: MasterplanDistrict) => void;
  timeOfDay: 'golden-hour' | 'day' | 'sunset' | 'night';
  setTimeOfDay: (time: 'golden-hour' | 'day' | 'sunset' | 'night') => void;
}

export const EliteHomeCanvas3D: React.FC<EliteHomeCanvas3DProps> = ({
  selectedDistrict,
  onSelectDistrict,
  timeOfDay,
  setTimeOfDay
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  // Animation targets for smooth camera flyover
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 55, 90));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Objects to animate in the loop
  const treeParticlesRef = useRef<THREE.Points | null>(null);
  const fountainParticlesRef = useRef<THREE.Points | null>(null);
  const podObjectsRef = useRef<THREE.Mesh[]>([]);
  const gondolaCabinsRef = useRef<THREE.Group[]>([]);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const districtMeshesRef = useRef<{ id: string; mesh: THREE.Object3D }[]>([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Spherical Coordinates & Mouse/Touch Drag
  const isDraggingRef = useRef(false);
  const dragButtonRef = useRef<number>(0);
  const lastPointerPosRef = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);
  const touchMidpointRef = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef(false);

  const sphericalRef = useRef({
    radius: 95,
    theta: 0.0,
    phi: 1.05
  });

  const syncSphericalFromPositions = () => {
    const offset = new THREE.Vector3().subVectors(targetCamPos.current, targetLookAt.current);
    const r = offset.length();
    sphericalRef.current.radius = Math.max(10, Math.min(r, 180));
    sphericalRef.current.phi = Math.acos(Math.max(-1, Math.min(1, offset.y / r))) || 1.05;
    sphericalRef.current.theta = Math.atan2(offset.x, offset.z) || 0.0;
  };

  // Interactive UI State
  const [hoveredDistrict, setHoveredDistrict] = useState<MasterplanDistrict | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [activeCameraPreset, setActiveCameraPreset] = useState<string>('masterplan');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);

  // Lighting reference
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Camera presets
  const applyCameraPreset = (presetKey: string) => {
    setActiveCameraPreset(presetKey);
    setIsAutoRotating(false);

    if (presetKey === 'masterplan') {
      targetCamPos.current.set(0, 65, 95);
      targetLookAt.current.set(0, 0, 0);
    } else if (presetKey === 'heart') {
      targetCamPos.current.set(0, 18, 38);
      targetLookAt.current.set(0, 3, 0);
    } else if (presetKey === 'forest') {
      targetCamPos.current.set(-45, 22, -10);
      targetLookAt.current.set(-45, 5, -35);
    } else if (presetKey === 'ocean') {
      targetCamPos.current.set(65, 24, -15);
      targetLookAt.current.set(55, 6, -40);
    } else if (presetKey === 'longevity') {
      targetCamPos.current.set(0, 20, -28);
      targetLookAt.current.set(0, 4, -55);
    } else if (presetKey === 'promenade') {
      targetCamPos.current.set(0, 4, 18);
      targetLookAt.current.set(0, 2, -15);
    }
    syncSphericalFromPositions();
  };

  // Sync camera when selectedDistrict changes from props
  useEffect(() => {
    if (selectedDistrict) {
      targetCamPos.current.set(
        selectedDistrict.cameraPosition.x,
        selectedDistrict.cameraPosition.y,
        selectedDistrict.cameraPosition.z
      );
      targetLookAt.current.set(
        selectedDistrict.cameraTarget.x,
        selectedDistrict.cameraTarget.y,
        selectedDistrict.cameraTarget.z
      );
      setIsAutoRotating(false);
      setActiveCameraPreset(selectedDistrict.id);
    }
  }, [selectedDistrict]);

  // Adjust lights based on Time of Day
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !hemiLightRef.current || !ambientLightRef.current) return;

    if (timeOfDay === 'golden-hour') {
      sceneRef.current.background = new THREE.Color('#fdba74'); // Warm peach/gold
      sceneRef.current.fog = new THREE.FogExp2('#fed7aa', 0.0055);
      
      dirLightRef.current.color.set('#ffedd5');
      dirLightRef.current.intensity = 2.2;
      dirLightRef.current.position.set(60, 25, 40);

      hemiLightRef.current.color.set('#fef08a');
      hemiLightRef.current.groundColor.set('#78350f');
      hemiLightRef.current.intensity = 0.9;

      ambientLightRef.current.color.set('#fed7aa');
      ambientLightRef.current.intensity = 0.8;
    } else if (timeOfDay === 'day') {
      sceneRef.current.background = new THREE.Color('#bae6fd'); // Crisp blue
      sceneRef.current.fog = new THREE.FogExp2('#e0f2fe', 0.0045);
      
      dirLightRef.current.color.set('#ffffff');
      dirLightRef.current.intensity = 2.4;
      dirLightRef.current.position.set(40, 70, 40);

      hemiLightRef.current.color.set('#ffffff');
      hemiLightRef.current.groundColor.set('#14532d');
      hemiLightRef.current.intensity = 1.0;

      ambientLightRef.current.color.set('#ffffff');
      ambientLightRef.current.intensity = 0.7;
    } else if (timeOfDay === 'sunset') {
      sceneRef.current.background = new THREE.Color('#fda4af'); // Rose/Crimson
      sceneRef.current.fog = new THREE.FogExp2('#f43f5e', 0.006);
      
      dirLightRef.current.color.set('#f43f5e');
      dirLightRef.current.intensity = 2.0;
      dirLightRef.current.position.set(70, 15, -30);

      hemiLightRef.current.color.set('#f472b6');
      hemiLightRef.current.groundColor.set('#4c0519');
      hemiLightRef.current.intensity = 0.8;

      ambientLightRef.current.color.set('#fb7185');
      ambientLightRef.current.intensity = 0.6;
    } else if (timeOfDay === 'night') {
      sceneRef.current.background = new THREE.Color('#090d16'); // Deep night indigo
      sceneRef.current.fog = new THREE.FogExp2('#0f172a', 0.007);
      
      dirLightRef.current.color.set('#38bdf8');
      dirLightRef.current.intensity = 0.6;
      dirLightRef.current.position.set(-30, 40, -20);

      hemiLightRef.current.color.set('#818cf8');
      hemiLightRef.current.groundColor.set('#020617');
      hemiLightRef.current.intensity = 0.5;

      ambientLightRef.current.color.set('#1e1b4b');
      ambientLightRef.current.intensity = 0.5;
    }
  }, [timeOfDay]);

  // Audio Ambience Toggle
  const toggleAudioSoundscape = () => {
    const isNowPlaying = soundEngine.togglePlay('golden-hour');
    setIsAudioPlaying(isNowPlaying);
  };

  // Main Three.js Scene Setup
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#fdba74');
    scene.fog = new THREE.FogExp2('#fed7aa', 0.0055);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    camera.position.set(0, 65, 95);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight('#fed7aa', 0.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight('#fef08a', '#78350f', 0.9);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight('#ffedd5', 2.2);
    dirLight.position.set(60, 25, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 250;
    const d = 80;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 5. Build 3D Terrain & Mountains
    const terrainGeo = new THREE.PlaneGeometry(240, 240, 48, 48);
    terrainGeo.rotateX(-Math.PI / 2);
    
    // Elevate mountains on perimeter and sculpt central valley
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const distFromCenter = Math.sqrt(x * x + z * z);
      
      let elevation = 0;
      // Mountains surrounding the 500-acre valley
      if (distFromCenter > 45) {
        const mountainFactor = (distFromCenter - 45) / 55;
        elevation = Math.pow(mountainFactor, 1.8) * 26 + Math.sin(x * 0.15) * Math.cos(z * 0.15) * 4;
      } else {
        // Subtle rolling green terraces in valley
        elevation = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 1.5;
      }
      // Ocean shelf on east side (x > 50)
      if (x > 45 && z < -20) {
        elevation = Math.max(-4, elevation - 18);
      }
      posAttr.setY(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x3d7041, // lush forest green
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Ocean Water Plane (East Coastline)
    const oceanGeo = new THREE.PlaneGeometry(100, 100);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.1,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.set(70, -2, -45);
    scene.add(ocean);
    waterMeshRef.current = ocean;

    // Meandering Valley River & Reflection Lake
    const riverGeo = new THREE.RingGeometry(8, 14, 32);
    riverGeo.rotateX(-Math.PI / 2);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.9
    });
    const lake = new THREE.Mesh(riverGeo, riverMat);
    lake.position.set(0, 0.05, 0);
    scene.add(lake);

    // 6. BUILD SECTORS & BIOPHILIC ARCHITECTURAL STRUCTURES

    const districtsList: { id: string; mesh: THREE.Object3D }[] = [];

    // SECTOR 1: THE HEART OF LIFE PLAZA (Central)
    const heartGroup = new THREE.Group();
    heartGroup.position.set(0, 0, 0);
    
    // Circular Plaza stepped terraces
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
    const plazaBase = new THREE.Mesh(new THREE.CylinderGeometry(18, 20, 0.6, 32), plazaMat);
    plazaBase.position.y = 0.3;
    plazaBase.receiveShadow = true;
    heartGroup.add(plazaBase);

    // The Glowing Tree of Life (Central 60m Landmark)
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x573418, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.8, 10, 16), trunkMat);
    trunk.position.y = 5;
    trunk.castShadow = true;
    heartGroup.add(trunk);

    // Multi-tier bioluminescent foliage canopy
    const canopyMat = new THREE.MeshStandardMaterial({ 
      color: 0xec4899, 
      emissive: 0xdb2777,
      emissiveIntensity: 0.45,
      roughness: 0.3
    });
    const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(5, 1), canopyMat);
    canopy1.position.y = 10;
    canopy1.castShadow = true;
    heartGroup.add(canopy1);

    const canopy2 = new THREE.Mesh(new THREE.DodecahedronGeometry(3.5, 1), canopyMat);
    canopy2.position.set(2.5, 12, 1);
    heartGroup.add(canopy2);

    const canopy3 = new THREE.Mesh(new THREE.DodecahedronGeometry(3.5, 1), canopyMat);
    canopy3.position.set(-2.5, 11.5, -1);
    heartGroup.add(canopy3);

    // Surrounding Curved Colonnades & Glass Domes
    const glassMat = new THREE.MeshStandardMaterial({ 
      color: 0x93c5fd, 
      roughness: 0.1, 
      metalness: 0.8, 
      transparent: true, 
      opacity: 0.7 
    });
    for (let a = 0; a < 6; a++) {
      const angle = (a / 6) * Math.PI * 2;
      const rx = Math.cos(angle) * 12;
      const rz = Math.sin(angle) * 12;
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
      dome.position.set(rx, 0.6, rz);
      dome.castShadow = true;
      heartGroup.add(dome);
    }

    scene.add(heartGroup);
    districtsList.push({ id: 'heart-of-life', mesh: heartGroup });

    // SECTOR 2: THE SERENITY FOREST (Northwest)
    const forestGroup = new THREE.Group();
    forestGroup.position.set(-45, 5, -35);

    // Clustered Redwood trees
    const redwoodWood = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.8 });
    const redwoodLeaves = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7 });
    for (let t = 0; t < 22; t++) {
      const tx = (Math.random() - 0.5) * 26;
      const tz = (Math.random() - 0.5) * 26;
      const tHeight = 12 + Math.random() * 8;
      
      const tTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, tHeight, 8), redwoodWood);
      tTrunk.position.set(tx, tHeight / 2, tz);
      tTrunk.castShadow = true;
      forestGroup.add(tTrunk);

      const tFoliage = new THREE.Mesh(new THREE.ConeGeometry(3 + Math.random() * 1.5, 9, 8), redwoodLeaves);
      tFoliage.position.set(tx, tHeight + 2, tz);
      tFoliage.castShadow = true;
      forestGroup.add(tFoliage);
    }

    // Elevated Treehouse Villas
    const treehouseMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    for (let v = 0; v < 5; v++) {
      const vx = Math.cos(v * 1.25) * 8;
      const vz = Math.sin(v * 1.25) * 8;
      const villa = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.2, 3), treehouseMat);
      villa.position.set(vx, 7, vz);
      villa.castShadow = true;
      forestGroup.add(villa);

      // Elevated walkway pillar
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 7, 6), redwoodWood);
      pillar.position.set(vx, 3.5, vz);
      forestGroup.add(pillar);
    }

    scene.add(forestGroup);
    districtsList.push({ id: 'serenity-forest', mesh: forestGroup });

    // SECTOR 3: THE OCEAN HORIZON (Northeast Sea Cliffs)
    const oceanGroup = new THREE.Group();
    oceanGroup.position.set(55, 8, -40);

    const cliffVillaMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const poolMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, metalness: 0.8 });

    for (let ov = 0; ov < 4; ov++) {
      const ox = (ov - 1.5) * 7;
      const oz = ov * 3;
      const cliffVilla = new THREE.Mesh(new THREE.BoxGeometry(5.5, 2.5, 4), cliffVillaMat);
      cliffVilla.position.set(ox, ov * 1.5, oz);
      cliffVilla.castShadow = true;
      oceanGroup.add(cliffVilla);

      // Cantilevered Infinity Pool
      const pool = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 2), poolMat);
      pool.position.set(ox + 1.8, ov * 1.5 - 0.6, oz + 2);
      oceanGroup.add(pool);
    }

    scene.add(oceanGroup);
    districtsList.push({ id: 'ocean-horizon', mesh: oceanGroup });

    // SECTOR 4: THE VILLAGE OF FRIENDS (Southwest Piazza Clusters)
    const villageGroup = new THREE.Group();
    villageGroup.position.set(-35, 2, 40);

    const terracottaMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.7 });
    const stuccoMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 });

    for (let vg = 0; vg < 6; vg++) {
      const vAngle = (vg / 6) * Math.PI * 2;
      const vx = Math.cos(vAngle) * 9;
      const vz = Math.sin(vAngle) * 9;
      
      const house = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3, 3.5), stuccoMat);
      house.position.set(vx, 1.5, vz);
      house.castShadow = true;
      villageGroup.add(house);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.8, 4), terracottaMat);
      roof.position.set(vx, 3.8, vz);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      villageGroup.add(roof);
    }

    scene.add(villageGroup);
    districtsList.push({ id: 'village-of-friends', mesh: villageGroup });

    // SECTOR 5: THE INNOVATION QUARTER (Southeast Tech-Bio Pods)
    const innovGroup = new THREE.Group();
    innovGroup.position.set(45, 3, 35);

    const techMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.8, roughness: 0.2 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.9, roughness: 0.1 });

    const centralLab = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 4, 8), techMat);
    centralLab.position.y = 2;
    centralLab.castShadow = true;
    innovGroup.add(centralLab);

    const solarRoof = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 4, 0.5, 8), solarMat);
    solarRoof.position.y = 4.2;
    innovGroup.add(solarRoof);

    // Surrounding satellite innovation pods
    for (let p = 0; p < 4; p++) {
      const pAngle = (p / 4) * Math.PI * 2;
      const px = Math.cos(pAngle) * 8;
      const pz = Math.sin(pAngle) * 8;
      const pod = new THREE.Mesh(new THREE.OctahedronGeometry(2), techMat);
      pod.position.set(px, 2.5, pz);
      pod.castShadow = true;
      innovGroup.add(pod);
    }

    scene.add(innovGroup);
    districtsList.push({ id: 'innovation-quarter', mesh: innovGroup });

    // SECTOR 6: LONGEVITY & HEALTH SANCTUARY (North Zen Ryokan)
    const longevityGroup = new THREE.Group();
    longevityGroup.position.set(0, 4, -55);

    const ryokanWood = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
    const spaGlass = new THREE.MeshStandardMaterial({ color: 0x10b981, transparent: true, opacity: 0.7, roughness: 0.2 });

    const mainSanctuary = new THREE.Mesh(new THREE.BoxGeometry(14, 3.5, 7), ryokanWood);
    mainSanctuary.position.y = 1.75;
    mainSanctuary.castShadow = true;
    longevityGroup.add(mainSanctuary);

    // Japanese hip-and-gable curved roof
    const spaRoof = new THREE.Mesh(new THREE.ConeGeometry(9, 2.5, 4), ryokanWood);
    spaRoof.position.y = 4.5;
    spaRoof.rotation.y = Math.PI / 4;
    spaRoof.scale.set(1.5, 1, 0.8);
    longevityGroup.add(spaRoof);

    // Cascading Hydrotherapy pool series
    const hydroPoolMat = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.1, metalness: 0.7 });
    for (let hp = 0; hp < 3; hp++) {
      const hPool = new THREE.Mesh(new THREE.CylinderGeometry(2.5 - hp * 0.4, 2.5 - hp * 0.4, 0.4, 16), hydroPoolMat);
      hPool.position.set(-6 + hp * 6, 0.2 - hp * 0.2, 6);
      longevityGroup.add(hPool);
    }

    scene.add(longevityGroup);
    districtsList.push({ id: 'longevity-health', mesh: longevityGroup });

    // SECTOR 7: LIVING HARVEST & AGRICULTURE (East Terraces)
    const farmGroup = new THREE.Group();
    farmGroup.position.set(60, 2, 0);

    const greenhouseMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, transparent: true, opacity: 0.6, roughness: 0.3 });
    for (let gh = 0; gh < 3; gh++) {
      const dome = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), greenhouseMat);
      dome.position.set((gh - 1) * 7, 0, gh % 2 === 0 ? 3 : -3);
      farmGroup.add(dome);
    }

    scene.add(farmGroup);
    districtsList.push({ id: 'food-agriculture', mesh: farmGroup });

    // SECTOR 8: ACTIVE DOMAIN & WATERFALL YOGA (Northwest Valley)
    const sportsGroup = new THREE.Group();
    sportsGroup.position.set(-20, 6, -60);

    const courtMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4 });
    const court = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 8), courtMat);
    court.position.y = 0.1;
    sportsGroup.add(court);

    // Suspended Yoga Deck
    const yogaDeck = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 0.3, 24), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    yogaDeck.position.set(7, 2, -4);
    sportsGroup.add(yogaDeck);

    scene.add(sportsGroup);
    districtsList.push({ id: 'sports-active', mesh: sportsGroup });

    // SECTOR 9: THE ARTIST SANCTUARY (West Sculptural Valley)
    const artistGroup = new THREE.Group();
    artistGroup.position.set(-60, 4, 5);

    const sculptureMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, metalness: 0.5, roughness: 0.2 });
    const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(2.5, 0.8, 48, 8), sculptureMat);
    torus.position.set(0, 3.5, 0);
    torus.castShadow = true;
    artistGroup.add(torus);

    scene.add(artistGroup);
    districtsList.push({ id: 'artist-sanctuary', mesh: artistGroup });

    // SECTOR 10: INTERFAITH SPIRITUAL SANCTUARY (Northeast Mountain Ridge)
    const spiritGroup = new THREE.Group();
    spiritGroup.position.set(30, 10, -55);

    const spiritMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.2 });
    const spire = new THREE.Mesh(new THREE.ConeGeometry(2.5, 10, 16), spiritMat);
    spire.position.y = 5;
    spire.castShadow = true;
    spiritGroup.add(spire);

    scene.add(spiritGroup);
    districtsList.push({ id: 'spiritual-sanctuary', mesh: spiritGroup });

    districtMeshesRef.current = districtsList;

    // 7. PARTICLES: Tree of Life Bioluminescence
    const pCount = 300;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const radius = 2 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const py = 6 + Math.random() * 10;
      pPos[i * 3] = Math.cos(theta) * radius;
      pPos[i * 3 + 1] = py;
      pPos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf472b6,
      size: 0.6,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const treeParticles = new THREE.Points(pGeo, pMat);
    scene.add(treeParticles);
    treeParticlesRef.current = treeParticles;

    // 8. PARTICLES: Interactive Water Fountains in Heart Plaza
    const fCount = 150;
    const fGeo = new THREE.BufferGeometry();
    const fPos = new Float32Array(fCount * 3);
    for (let i = 0; i < fCount; i++) {
      const fAngle = Math.random() * Math.PI * 2;
      const fRad = 8 + Math.random() * 4;
      fPos[i * 3] = Math.cos(fAngle) * fRad;
      fPos[i * 3 + 1] = Math.random() * 3.5;
      fPos[i * 3 + 2] = Math.sin(fAngle) * fRad;
    }
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    const fMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.45,
      transparent: true,
      opacity: 0.75
    });
    const fountainParticles = new THREE.Points(fGeo, fMat);
    scene.add(fountainParticles);
    fountainParticlesRef.current = fountainParticles;

    // 9. AUTONOMOUS TRANSIT: Electric Pods along Garden Ring Track
    const podList: THREE.Mesh[] = [];
    const podMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8, roughness: 0.2 });
    for (let pd = 0; pd < 6; pd++) {
      const podMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1.2, 8, 12), podMat);
      podMesh.rotation.z = Math.PI / 2;
      podMesh.castShadow = true;
      scene.add(podMesh);
      podList.push(podMesh);
    }
    podObjectsRef.current = podList;

    // 10. AERIAL GONDOLA CABLEWAY across Valley
    const gondolaCabins: THREE.Group[] = [];
    const gondolaMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 });
    for (let g = 0; g < 3; g++) {
      const gGroup = new THREE.Group();
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 1), gondolaMat);
      const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5), new THREE.MeshBasicMaterial({ color: 0x1e293b }));
      hanger.position.y = 1.2;
      gGroup.add(cabin);
      gGroup.add(hanger);
      scene.add(gGroup);
      gondolaCabins.push(gGroup);
    }
    gondolaCabinsRef.current = gondolaCabins;

    // 11. Interactive Raycasting & Pointer/Touch Event Listeners
    const handlePointerMove = (event: PointerEvent) => {
      if (!canvasRef.current || !cameraRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Hover Raycasting
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      let found: MasterplanDistrict | null = null;
      for (const item of districtMeshesRef.current) {
        const intersects = raycasterRef.current.intersectObjects(item.mesh.children, true);
        if (intersects.length > 0) {
          found = MASTERPLAN_DISTRICTS.find(d => d.id === item.id) || null;
          break;
        }
      }
      setHoveredDistrict(found);

      // Pointer Dragging for 360 Orbit & Pan
      if (isDraggingRef.current) {
        const dx = event.clientX - lastPointerPosRef.current.x;
        const dy = event.clientY - lastPointerPosRef.current.y;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasDraggedRef.current = true;
        }
        lastPointerPosRef.current = { x: event.clientX, y: event.clientY };

        if (dragButtonRef.current === 2 || event.shiftKey) {
          // Right drag / Shift drag -> Pan
          const cam = cameraRef.current;
          if (cam) {
            const panFactor = 0.003 * sphericalRef.current.radius;
            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
            const up = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
            const panOffset = new THREE.Vector3()
              .addScaledVector(right, -dx * panFactor)
              .addScaledVector(up, dy * panFactor);
            targetCamPos.current.add(panOffset);
            targetLookAt.current.add(panOffset);
          }
        } else {
          // Left drag -> 3D Orbit
          sphericalRef.current.theta -= dx * 0.007;
          sphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, sphericalRef.current.phi - dy * 0.007));
          const { radius, theta, phi } = sphericalRef.current;
          targetCamPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
          targetCamPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
          targetCamPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
        }
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      isDraggingRef.current = true;
      dragButtonRef.current = event.button;
      hasDraggedRef.current = false;
      lastPointerPosRef.current = { x: event.clientX, y: event.clientY };
      setIsAutoRotating(false);
      syncSphericalFromPositions();
    };

    const handlePointerUp = (event: PointerEvent) => {
      isDraggingRef.current = false;

      // If click without drag, select district
      if (!hasDraggedRef.current && canvasRef.current && cameraRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        for (const item of districtMeshesRef.current) {
          const intersects = raycasterRef.current.intersectObjects(item.mesh.children, true);
          if (intersects.length > 0) {
            const district = MASTERPLAN_DISTRICTS.find(d => d.id === item.id);
            if (district) {
              soundEngine.triggerChime(640);
              onSelectDistrict(district);
              break;
            }
          }
        }
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      setIsAutoRotating(false);
      syncSphericalFromPositions();
      const zoomDelta = event.deltaY * 0.05;
      sphericalRef.current.radius = Math.max(10, Math.min(160, sphericalRef.current.radius + zoomDelta));
      const { radius, theta, phi } = sphericalRef.current;
      targetCamPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
      targetCamPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
      targetCamPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        touchDistanceRef.current = Math.hypot(dx, dy);
        touchMidpointRef.current = {
          x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
          y: (event.touches[0].clientY + event.touches[1].clientY) / 2
        };
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2 && touchDistanceRef.current !== null && touchMidpointRef.current !== null) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        const newDist = Math.hypot(dx, dy);
        const zoomChange = (touchDistanceRef.current - newDist) * 0.12;
        touchDistanceRef.current = newDist;

        syncSphericalFromPositions();
        sphericalRef.current.radius = Math.max(10, Math.min(160, sphericalRef.current.radius + zoomChange));
        const { radius, theta, phi } = sphericalRef.current;
        targetCamPos.current.x = targetLookAt.current.x + radius * Math.sin(phi) * Math.sin(theta);
        targetCamPos.current.y = targetLookAt.current.y + radius * Math.cos(phi);
        targetCamPos.current.z = targetLookAt.current.z + radius * Math.sin(phi) * Math.cos(theta);
      }
    };

    const handleTouchEnd = () => {
      touchDistanceRef.current = null;
      touchMidpointRef.current = null;
    };

    const canvasDom = canvasRef.current;
    canvasDom.addEventListener('pointermove', handlePointerMove);
    canvasDom.addEventListener('pointerdown', handlePointerDown);
    canvasDom.addEventListener('pointerup', handlePointerUp);
    canvasDom.addEventListener('wheel', handleWheel, { passive: false });
    canvasDom.addEventListener('touchstart', handleTouchStart);
    canvasDom.addEventListener('touchmove', handleTouchMove);
    canvasDom.addEventListener('touchend', handleTouchEnd);
    canvasDom.addEventListener('contextmenu', (e) => e.preventDefault());

    // 12. Main 60FPS Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Camera Lerp
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPos.current, 0.04);
        currentLookAt.current.lerp(targetLookAt.current, 0.04);
        cameraRef.current.lookAt(currentLookAt.current);

        // Gentle auto-rotation orbit if enabled
        if (isAutoRotating) {
          const angle = elapsedTime * 0.04;
          const currentDist = 85;
          targetCamPos.current.x = Math.sin(angle) * currentDist;
          targetCamPos.current.z = Math.cos(angle) * currentDist;
        }
      }

      // Bioluminescent Tree Particles gentle swirl
      if (treeParticlesRef.current) {
        treeParticlesRef.current.rotation.y = elapsedTime * 0.15;
      }

      // Fountain water droplets animation
      if (fountainParticlesRef.current) {
        const fPosArray = fountainParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < fCount; i++) {
          fPosArray[i * 3 + 1] = ((Math.sin(elapsedTime * 3 + i) + 1) * 2.2);
        }
        fountainParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Autonomous Pods along garden ring
      podObjectsRef.current.forEach((pod, idx) => {
        const podAngle = elapsedTime * 0.2 + (idx / 6) * Math.PI * 2;
        const radius = 24 + Math.sin(podAngle * 2) * 2;
        pod.position.x = Math.cos(podAngle) * radius;
        pod.position.z = Math.sin(podAngle) * radius;
        pod.position.y = 0.7;
        pod.rotation.y = -podAngle + Math.PI / 2;
      });

      // Aerial Gondolas gliding across mountains
      gondolaCabinsRef.current.forEach((gondola, idx) => {
        const progress = ((elapsedTime * 0.08 + idx * 0.33) % 1);
        const startX = -60;
        const endX = 60;
        const startZ = -50;
        const endZ = 40;
        const currentX = startX + (endX - startX) * progress;
        const currentZ = startZ + (endZ - startZ) * progress;
        const heightArc = 16 + Math.sin(progress * Math.PI) * 8;
        gondola.position.set(currentX, heightArc, currentZ);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
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
      cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      canvasDom.removeEventListener('pointermove', handlePointerMove);
      canvasDom.removeEventListener('pointerdown', handlePointerDown);
      canvasDom.removeEventListener('pointerup', handlePointerUp);
      canvasDom.removeEventListener('wheel', handleWheel);
      canvasDom.removeEventListener('touchstart', handleTouchStart);
      canvasDom.removeEventListener('touchmove', handleTouchMove);
      canvasDom.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
    };
  }, [isAutoRotating]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[540px] md:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-950 select-none group"
      id="elite-home-3d-canvas-container"
    >
      {/* 3D WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Floating Masterplan Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2.5 bg-stone-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-stone-700/60 shadow-xl pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50"></div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-tight text-white font-sans">eLite Home Masterplan</span>
              <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-1.5 py-0.2 rounded">500 ACRES</span>
            </div>
            <span className="text-[9px] text-stone-400 font-mono block">Real-time 3D Biophilic Architecture Simulator</span>
          </div>
        </div>

        {/* Lighting / Time of Day Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-700/60 shadow-xl pointer-events-auto">
          <button
            onClick={() => setTimeOfDay('golden-hour')}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1
              ${timeOfDay === 'golden-hour' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-white'}
            `}
            title="Golden Hour Sunset Atmosphere"
          >
            <Sunrise className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">Golden Hour</span>
          </button>

          <button
            onClick={() => setTimeOfDay('day')}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1
              ${timeOfDay === 'day' ? 'bg-sky-500 text-white shadow-md' : 'text-stone-400 hover:text-white'}
            `}
            title="Crisp Daylight Mode"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">Daylight</span>
          </button>

          <button
            onClick={() => setTimeOfDay('night')}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1
              ${timeOfDay === 'night' ? 'bg-indigo-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
            `}
            title="Bioluminescent Night Mode"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">Night</span>
          </button>
        </div>
      </div>

      {/* Camera Flyover Perspective Shortcuts (Bottom Left) */}
      <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-1.5 z-10 pointer-events-auto max-w-[80%]">
        <div className="bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-700/60 shadow-xl flex items-center gap-1 flex-wrap">
          <span className="text-[9px] font-mono text-stone-400 px-2 font-bold uppercase hidden md:inline">Flyover:</span>
          
          <button
            onClick={() => applyCameraPreset('masterplan')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1
              ${activeCameraPreset === 'masterplan' ? 'bg-white text-stone-950 font-black' : 'text-stone-300 hover:bg-stone-800'}
            `}
          >
            <Camera className="w-3 h-3 text-pink-400" /> Aerial Masterplan
          </button>

          <button
            onClick={() => applyCameraPreset('heart')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1
              ${activeCameraPreset === 'heart' ? 'bg-pink-600 text-white font-black' : 'text-stone-300 hover:bg-stone-800'}
            `}
          >
            🌸 Heart Plaza
          </button>

          <button
            onClick={() => applyCameraPreset('forest')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1
              ${activeCameraPreset === 'forest' ? 'bg-emerald-600 text-white font-black' : 'text-stone-300 hover:bg-stone-800'}
            `}
          >
            🌲 Serenity Forest
          </button>

          <button
            onClick={() => applyCameraPreset('ocean')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1
              ${activeCameraPreset === 'ocean' ? 'bg-sky-600 text-white font-black' : 'text-stone-300 hover:bg-stone-800'}
            `}
          >
            🌊 Ocean Horizon
          </button>

          <button
            onClick={() => applyCameraPreset('longevity')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1
              ${activeCameraPreset === 'longevity' ? 'bg-teal-600 text-white font-black' : 'text-stone-300 hover:bg-stone-800'}
            `}
          >
            🌿 Longevity Spa
          </button>

          <button
            onClick={() => applyCameraPreset('promenade')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1
              ${activeCameraPreset === 'promenade' ? 'bg-amber-600 text-white font-black' : 'text-stone-300 hover:bg-stone-800'}
            `}
          >
            🚶 Promenade Level
          </button>
        </div>

        {/* Orbit Auto-Rotate & Audio Toggles */}
        <div className="bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-700/60 shadow-xl flex items-center gap-1">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1
              ${isAutoRotating ? 'bg-indigo-600 text-white' : 'text-stone-400 hover:text-white'}
            `}
            title={isAutoRotating ? 'Pause Orbit Rotation' : 'Enable Orbit Rotation'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleAudioSoundscape}
            className={`p-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1
              ${isAudioPlaying ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-white'}
            `}
            title={isAudioPlaying ? 'Mute Procedural Soundscape' : 'Play Nature & Singing Bowl Soundscape'}
          >
            {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Hovered District Interactive Info Badge (Bottom Right) */}
      {hoveredDistrict && (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none animate-fadeIn">
          <div className="bg-stone-900/95 backdrop-blur-md border border-pink-500/50 p-3 rounded-2xl shadow-2xl max-w-xs text-left">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-black text-white">{hoveredDistrict.name}</span>
              <span className="text-[8px] font-mono uppercase bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded font-bold">
                Click to Inspect
              </span>
            </div>
            <p className="text-[10px] text-stone-300 line-clamp-2 leading-relaxed">
              {hoveredDistrict.tagline}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
