import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Globe, 
  Compass, 
  MapPin, 
  Mountain, 
  Sun, 
  Wind, 
  Droplets, 
  Layers, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Thermometer, 
  Search, 
  Info, 
  ShieldCheck, 
  Trees, 
  Waves,
  Maximize2,
  BookOpen
} from 'lucide-react';

export interface BlueZoneGeography {
  id: string;
  name: string;
  country: string;
  continent: string;
  coordinates: { lat: number; lng: number };
  elevation: string;
  climateType: string;
  soilMinerals: string;
  waterProfile: string;
  topography: string;
  avgLifeExpectancyCentenarians: string;
  geographicalFactors: string[];
  dietaryGeobotanicals: string[];
  color: string;
  description: string;
}

export const BLUE_ZONES_DATA: BlueZoneGeography[] = [
  {
    id: 'okinawa',
    name: 'Okinawa Archipelago',
    country: 'Japan',
    continent: 'Asia',
    coordinates: { lat: 26.2124, lng: 127.6809 },
    elevation: '0 – 503m (Subtropical islands)',
    climateType: 'Humid Subtropical (Cfa) with mild winters & year-round marine sea breeze',
    soilMinerals: 'Rich calcium-magnesium coral limestone soil (Ryukyu limestone) with marine trace elements',
    waterProfile: 'Alkaline mineral-rich groundwater filtered through ancient coral reefs',
    topography: 'Undulating coastal limestone hills, tidal lagoons, and lush subtropical forest hills',
    avgLifeExpectancyCentenarians: '34 centenarians per 100,000 (Historically highest in world)',
    geographicalFactors: [
      'Constant oceanic negative-ion air currents reduce systemic airway inflammation',
      'Year-round sunlight fosters steady Vitamin D synthesis without seasonal affective stress',
      'Coral-derived alkaline drinking water delivers bioavailable ionic calcium and magnesium',
      'Island geography historically fostered tight-knit, mutual-aid village neighborhoods (Moai)'
    ],
    dietaryGeobotanicals: [
      'Goya (Bitter melon rich in charantin)',
      'Okinawan Purple Sweet Potato (High anthocyanin density)',
      'Mozuku seaweed (Fucoidan-rich polysaccharide algae)',
      'Turmeric (Curcuma longa with high soil curcumin)'
    ],
    color: '#06b6d4',
    description: 'The southernmost island chain of Japan, where coral-filtered alkaline water, continuous Pacific negative ions, and steep garden terraces create unmatched centenarian vitality.'
  },
  {
    id: 'sardinia',
    name: 'Ogliastra & Barbagia Highlands',
    country: 'Italy',
    continent: 'Europe',
    coordinates: { lat: 39.9234, lng: 9.6582 },
    elevation: '600 – 1,400m (Gennargentu Mountains)',
    climateType: 'Mediterranean Highland (Csa/Csb) with cool mountain winds & dry sunny summers',
    soilMinerals: 'Granitic and schistose soils rich in polyphenolic bio-elements and potassium',
    waterProfile: 'Pure mountain runoff from crystalline granite springs low in heavy metals',
    topography: 'Steep rocky mountain slopes, oak and chestnut forested ravines, and high pastoral plateaus',
    avgLifeExpectancyCentenarians: 'World record male centenarian density (1:1 male-to-female centenarian ratio)',
    geographicalFactors: [
      'Steep mountain gradients require 8 to 12 km of natural incline walking per day for shepherds',
      'High altitude promotes mild hypoxic preconditioning and enhanced red blood cell efficiency',
      'Isolation within mountain valleys preserved pure ancestral genetic lineages and pastoral culture',
      'Clean mountain air with zero industrial particulates preserves microvascular endothelial health'
    ],
    dietaryGeobotanicals: [
      'Cannonau wine (Triple the proanthocyanidins of standard red wine)',
      'Pecorino Sardo cheese (Grass-fed sheep milk high in Omega-3 and CLA)',
      'Sourdough bread (Lactobacillus fermentation reducing glycemic index)',
      'Wild mountain fennel & chicory (Digestive prebiotics)'
    ],
    color: '#f59e0b',
    description: 'A rugged mountain region in central Sardinia where sheer slopes, daily high-altitude shepherd treks, and sun-drenched granitic vineyards sustain world-record male longevity.'
  },
  {
    id: 'nicoya',
    name: 'Nicoya Peninsula',
    country: 'Costa Rica',
    continent: 'Americas',
    coordinates: { lat: 10.1449, lng: -85.4522 },
    elevation: '10 – 350m (Tropical dry forest foothills)',
    climateType: 'Tropical Dry Forest Climate with high sunshine and distinct seasonal rains',
    soilMinerals: 'High calcium carbonate & magnesium volcanic soils',
    waterProfile: 'Hardest drinking water in Costa Rica, packed with dissolved calcium and magnesium',
    topography: 'Rolling tropical hills, coastal savannahs, and forest-lined rivers',
    avgLifeExpectancyCentenarians: 'Lowest middle-age mortality rate in the world; exceptional telomere length',
    geographicalFactors: [
      'Extremely hard drinking water fortifies bone density, drastically lowering hip fractures in elders',
      'Plentiful tropical sunshine promotes year-round Vitamin D3 synthesis and stable circadian rhythms',
      'Agricultural topography encourages continuous low-intensity outdoor manual movement',
      'Pura Vida lifestyle culture buffers cortisol and sympathetic nervous system overdrive'
    ],
    dietaryGeobotanicals: [
      'Nixtamalized corn tortillas (Calcium-steeped cornmeal)',
      'Black beans & squash ("Three Sisters" complete protein agricultural matrix)',
      'Marañón (Cashew fruit rich in Vitamin C & bioflavonoids)',
      'Papaya and wild tropical fruits (Proteolytic digestive enzymes)'
    ],
    color: '#10b981',
    description: 'A sunlit peninsula on Costa Rica’s Pacific coast where mineral-heavy hard water, agricultural hill walking, and strong social purpose (Plan de Vida) yield the world’s lowest middle-age mortality.'
  },
  {
    id: 'ikaria',
    name: 'Ikaria Island',
    country: 'Greece',
    continent: 'Europe',
    coordinates: { lat: 37.6049, lng: 26.1578 },
    elevation: '0 – 1,037m (Atheras Mountain Ridge)',
    climateType: 'Aegean Mediterranean Marine with strong Meltemi winds and mild winters',
    soilMinerals: 'Radon-bearing radioactive hot spring granite formations and rich mineral silt',
    waterProfile: 'Thermal springs, mineral-rich mountain streams, and natural spring water',
    topography: 'Steep mountainous island with dramatic ravines, terraced vineyards, and rocky coastline',
    avgLifeExpectancyCentenarians: '1 in 3 reach age 90; almost zero cases of dementia or cardiovascular disease',
    geographicalFactors: [
      'Mountainous terrain necessitates constant uphill and downhill walking to visit neighbors',
      'Thermal mineral springs (famous since ancient Greece) offer therapeutic sulfur and mineral bathing',
      'Meltemi sea winds provide pristine air quality devoid of atmospheric particulate pollution',
      'Temporal isolation from urban stress created a society without clock-based anxiety'
    ],
    dietaryGeobotanicals: [
      'Wild mountain herbal teas (Dittany, sage, rosemary, and marjoram rich in diuretics & antioxidants)',
      'Raw unpasteurized pine and heather honey (Antibacterial & prebiotic)',
      'Wild greens (Horta with 10x the antioxidant density of commercial lettuce)',
      'Greek mountain coffee (High chlorogenic acid and polyphenol content)'
    ],
    color: '#3b82f6',
    description: 'The "Island Where People Forget to Die"—an Aegean sanctuary where thermal mineral waters, mountain terrace climbs, wild antioxidant teas, and unhurried circadian rhythms protect against dementia.'
  },
  {
    id: 'loma_linda',
    name: 'Loma Linda Valley',
    country: 'United States (California)',
    continent: 'Americas',
    coordinates: { lat: 34.0489, lng: -117.2612 },
    elevation: '350 – 500m (San Bernardino Valley basin)',
    climateType: 'Mediterranean Semi-Arid with warm sunny days and cool dry nights',
    soilMinerals: 'Alluvial valley soils supporting citrus groves and organic agriculture',
    waterProfile: 'Alpine-fed aquifer water sourced from the San Bernardino Mountains',
    topography: 'Gentle valley floor flanked by mountain ranges with network of shaded walking trails',
    avgLifeExpectancyCentenarians: 'Residents live 7 to 10 years longer than the average American',
    geographicalFactors: [
      'Built environment integrates abundant urban green parks, tree-lined walking avenues, and cycling tracks',
      'Strict municipal zoning historically restricted smoking and alcohol, preserving local air quality',
      'Proximity to San Bernardino mountain trails encourages regular weekend nature immersion',
      'Protected quiet geographic enclave buffering residents from metropolitan noise pollution'
    ],
    dietaryGeobotanicals: [
      'Whole nuts (Almonds and walnuts rich in monounsaturated fatty acids)',
      'Legumes, oats, and whole grains (Soluble fiber lowering LDL cholesterol)',
      'Avocados and fresh citrus (Potassium and Vitamin C)',
      'Pure spring water (Encouraging 8+ glasses daily hydration)'
    ],
    color: '#8b5cf6',
    description: 'A sunny Southern California valley community of Seventh-day Adventists whose plant-based diet, weekly 24-hour nature Sabbath, and walking paths grant 10 extra healthy years.'
  },
  {
    id: 'hunza',
    name: 'Hunza Valley Highlands',
    country: 'Pakistan',
    continent: 'Asia',
    coordinates: { lat: 36.3167, lng: 74.6500 },
    elevation: '2,400 – 3,000m (Karakoram Mountain Range)',
    climateType: 'High-Altitude Alpine Arid with crisp dry mountain air and intense UV sunlight',
    soilMinerals: 'Glacial silt ("Glacier Milk") rich in colloidal minerals, silica, iron, and potassium',
    waterProfile: 'Ultramafic glacier runoff containing suspended colloidal trace minerals',
    topography: 'Dramatic vertical terraced mountain gorges, glacier-fed riverbeds, and high stone stairways',
    avgLifeExpectancyCentenarians: 'Renowned for vigorous old-age mobility and high cardiovascular resilience',
    geographicalFactors: [
      'High-altitude chronic hypoxic adaptation promotes coronary collateralization and lung vital capacity',
      'Glacial silt drinking water supplies micro-minerals that are missing from depleted lowland soils',
      'Vertical terrace farming demands intense daily climbing and load-bearing functional fitness',
      'Extreme physical isolation protected traditional organic farming methods and unpolluted glacial streams'
    ],
    dietaryGeobotanicals: [
      'Hunza apricots and sun-dried apricot kernels (Rich in carotenoids and amygdalin)',
      'Glacial silt-irrigated barley, millet, and buckwheat',
      'Walnuts and cold-pressed walnut oil (Omega-3 fatty acids)',
      'Tumuro mountain tea (Wild thyme with respiratory antimicrobial essential oils)'
    ],
    color: '#ec4899',
    description: 'A legendary high-altitude Karakoram mountain haven where colloidal glacial water, steep stone terraces, and apricot-rich botanical nutrition cultivate exceptional physical stamina into the 90s.'
  }
];

export const GEO_HEALTH_DISPARITIES = [
  {
    region: 'East Asia & Pacific (Japan, S. Korea, Singapore)',
    avgLifeExpectancy: '84.8 Years',
    hpa: '74.2 Healthspan Years',
    keyFactors: 'Seafood-rich coastline, universal healthcare corridors, high public transit walking index, low ambient violence.',
    riskGrade: 'LOW RISK (Optimized Corridor)'
  },
  {
    region: 'Western & Southern Europe (Spain, Italy, Switzerland)',
    avgLifeExpectancy: '83.2 Years',
    hpa: '72.1 Healthspan Years',
    keyFactors: 'Mediterranean diet basin, walkable medieval town cores, active social piazzas, robust elder social safety nets.',
    riskGrade: 'LOW RISK (Optimized Corridor)'
  },
  {
    region: 'North America (US & Canada - High Spatial Variance)',
    avgLifeExpectancy: '78.5 Years',
    hpa: '66.4 Healthspan Years',
    keyFactors: 'Severe geographic gap between suburban car-dependent food deserts and affluent walkable mountain/coastal zones (up to 20-year zip code gap).',
    riskGrade: 'MODERATE-HIGH (Spatial Disparity)'
  },
  {
    region: 'Latin America (Costa Rica, Chile, Uruguay)',
    avgLifeExpectancy: '79.1 Years',
    hpa: '68.0 Healthspan Years',
    keyFactors: 'Strong multi-generational family cohesion, rich agricultural fruit/legume basins, community primary health networks.',
    riskGrade: 'MODERATE RISK'
  },
  {
    region: 'Sub-Saharan Africa & Vulnerable Climatic Corridors',
    avgLifeExpectancy: '63.4 Years',
    hpa: '55.8 Healthspan Years',
    keyFactors: 'High burden of tropical vector-borne diseases, severe healthcare infrastructure distance barriers, water insecurity, climate heat extremes.',
    riskGrade: 'CRITICAL PRIORITY (Infrastructure Need)'
  }
];

export const GlobalGeographyAtlas: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<BlueZoneGeography>(BLUE_ZONES_DATA[0]);
  const [activeLayer, setActiveLayer] = useState<'bluezones' | 'disparities' | 'climates' | 'interactive_globe'>('bluezones');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 3D Three.js Interactive Earth Globe Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeMeshRef = useRef<THREE.Mesh | null>(null);
  const pinGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !globeContainerRef.current) return;

    const width = globeContainerRef.current.clientWidth || 450;
    const height = globeContainerRef.current.clientHeight || 320;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#090d16');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Ambient & Directional Lighting for Globe
    const ambientLight = new THREE.AmbientLight('#f8fafc', 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#fed7aa', 1.8);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight('#06b6d4', 1.2);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // Globe Sphere with wireframe segments & glowing atmosphere
    const globeRadius = 2.4;
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.2,
      wireframe: false
    });
    const globe = new THREE.Mesh(sphereGeo, globeMat);
    scene.add(globe);
    globeMeshRef.current = globe;

    // Wireframe Grid overlay
    const wireGeo = new THREE.SphereGeometry(globeRadius * 1.002, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // Atmosphere Glow Shell
    const atmoGeo = new THREE.SphereGeometry(globeRadius * 1.05, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmoMesh);

    // Add Blue Zone Coordinate Pins
    const pinGroup = new THREE.Group();
    scene.add(pinGroup);
    pinGroupRef.current = pinGroup;

    BLUE_ZONES_DATA.forEach((zone) => {
      // Convert lat/lng to 3D sphere coordinate
      const phi = (90 - zone.coordinates.lat) * (Math.PI / 180);
      const theta = (zone.coordinates.lng + 180) * (Math.PI / 180);

      const x = -(globeRadius * Math.sin(phi) * Math.cos(theta));
      const z = globeRadius * Math.sin(phi) * Math.sin(theta);
      const y = globeRadius * Math.cos(phi);

      const pinGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(zone.color) });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(x, y, z);
      pinGroup.add(pin);

      // Pin Ring Pulse
      const ringGeo = new THREE.RingGeometry(0.12, 0.18, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(zone.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x * 1.02, y * 1.02, z * 1.02);
      ring.lookAt(0, 0, 0);
      pinGroup.add(ring);
    });

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth slow earth rotation
      globe.rotation.y = t * 0.08;
      wireMesh.rotation.y = t * 0.08;
      pinGroup.rotation.y = t * 0.08;

      renderer.render(scene, camera);
    };

    animate();

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
    resizeObserver.observe(globeContainerRef.current);

    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  const filteredZones = BLUE_ZONES_DATA.filter(z => 
    z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.continent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.climateType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white" id="global-geography-atlas-root">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-teal-950/60 to-stone-900 rounded-3xl p-6 border border-teal-900/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-teal-500/20 text-teal-300 px-3 py-0.5 rounded-full border border-teal-400/30">
              School 11: Global Health Geography & Planetary Biogeography
            </span>
            <span className="text-[10px] font-mono text-stone-400">Spatial Epidemiology & Blue Zones</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white flex items-center gap-2">
            <Globe className="w-7 h-7 text-teal-400 animate-spin-slow" />
            Global Geography & Longevity Atlas
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-3xl mt-1 leading-relaxed">
            Investigating how planetary topography, soil mineralogy, marine microclimates, thermal hydrology, and spatial built environments shape human healthspan and cellular vitality across 195 nations.
          </p>
        </div>

        <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-teal-500/30 text-right shrink-0">
          <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Mapped Blue Zones</span>
          <span className="text-xl font-black text-teal-400 font-mono">6 World Sanctuaries</span>
        </div>
      </div>

      {/* Layer Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-900 border border-stone-800 rounded-2xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveLayer('bluezones')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeLayer === 'bluezones' ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
        >
          <Compass className="w-4 h-4" /> <span>1. The World&apos;s Blue Zones Biogeography</span>
        </button>

        <button
          onClick={() => setActiveLayer('disparities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeLayer === 'disparities' ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
        >
          <Activity className="w-4 h-4" /> <span>2. Spatial Epidemiology & Geo-Health Corridors</span>
        </button>

        <button
          onClick={() => setActiveLayer('climates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeLayer === 'climates' ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
        >
          <Sun className="w-4 h-4" /> <span>3. Climatic Biomes & Altitude Adaptation</span>
        </button>
      </div>

      {/* LAYER 1: BLUE ZONES BIOGEOGRAPHY */}
      {activeLayer === 'bluezones' && (
        <div className="space-y-6">
          {/* Top Split: 3D Interactive World Globe & Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 3D Globe Visualizer */}
            <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-3xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-teal-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                      Interactive 3D Planetary Geosphere
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800/40">
                    Real-time Rotation
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Glowing markers depict the 6 planetary longevity corridors where human life expectancy and centenarian vigor reach historical zeniths.
                </p>
              </div>

              <div 
                ref={globeContainerRef} 
                className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 my-4 relative"
              >
                <canvas ref={canvasRef} className="w-full h-full block" />
                <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-[9px] font-mono px-2 py-1 rounded text-stone-300">
                  Focused: {selectedZone.name} ({selectedZone.country})
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="bg-stone-950 p-2 rounded-xl border border-stone-800">
                  <span className="text-stone-500 block">Latitude</span>
                  <span className="text-teal-400 font-bold">{selectedZone.coordinates.lat}° N</span>
                </div>
                <div className="bg-stone-950 p-2 rounded-xl border border-stone-800">
                  <span className="text-stone-500 block">Longitude</span>
                  <span className="text-teal-400 font-bold">{selectedZone.coordinates.lng}°</span>
                </div>
                <div className="bg-stone-950 p-2 rounded-xl border border-stone-800">
                  <span className="text-stone-500 block">Elevation</span>
                  <span className="text-amber-400 font-bold truncate">{selectedZone.elevation.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            {/* Right: Blue Zone Selector Cards */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-stone-300">
                  Select Longevity Sanctuary
                </h3>
                <div className="relative w-48">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search region, climate..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-teal-500"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredZones.map((zone) => {
                  const isSelected = selectedZone.id === zone.id;

                  return (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between
                        ${isSelected
                          ? 'bg-gradient-to-b from-stone-900 to-teal-950/70 border-teal-500 shadow-lg ring-2 ring-teal-500/30'
                          : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900'}
                      `}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span 
                            className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                            style={{ 
                              backgroundColor: `${zone.color}20`,
                              borderColor: `${zone.color}60`,
                              color: zone.color 
                            }}
                          >
                            {zone.continent}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400 font-bold">{zone.country}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{zone.name}</h4>
                        <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">{zone.description}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-emerald-400 font-bold truncate max-w-[70%]">
                          {zone.elevation}
                        </span>
                        <span className="text-teal-400 font-bold flex items-center gap-0.5">
                          Explore <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Blue Zone Detailed Geographic Dossier */}
          {selectedZone && (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-6 shadow-2xl">
              {/* Title & Centenarian Metric */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border"
                      style={{ 
                        backgroundColor: `${selectedZone.color}20`,
                        borderColor: `${selectedZone.color}60`,
                        color: selectedZone.color 
                      }}
                    >
                      {selectedZone.country} • {selectedZone.continent}
                    </span>
                    <span className="text-xs font-mono text-stone-400">Geographic Longevity Profile</span>
                  </div>
                  <h3 className="text-2xl font-black text-white font-sans">{selectedZone.name}</h3>
                  <p className="text-xs text-stone-300 mt-1 max-w-3xl leading-relaxed">{selectedZone.description}</p>
                </div>

                <div className="bg-stone-950 p-4 rounded-2xl border border-teal-500/30 text-right shrink-0">
                  <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Demographic Longevity Zenith</span>
                  <span className="text-xs font-black text-emerald-400 leading-tight block mt-0.5">
                    {selectedZone.avgLifeExpectancyCentenarians}
                  </span>
                </div>
              </div>

              {/* 4 Key Geographic Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                    <Sun className="w-3.5 h-3.5" /> Climate & Köppen Class
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{selectedZone.climateType}</p>
                </div>

                <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 mb-1">
                    <Droplets className="w-3.5 h-3.5" /> Hydrology & Mineral Water
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{selectedZone.waterProfile}</p>
                </div>

                <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                    <Trees className="w-3.5 h-3.5" /> Soil Minerals & Geology
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{selectedZone.soilMinerals}</p>
                </div>

                <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 mb-1">
                    <Mountain className="w-3.5 h-3.5" /> Topography & Slope Movement
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{selectedZone.topography}</p>
                </div>
              </div>

              {/* Geographical Factors & Botanical Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Environmental Mechanisms */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-400" /> Environmental Longevity Mechanisms
                  </h4>
                  <div className="space-y-2">
                    {selectedZone.geographicalFactors.map((factor, idx) => (
                      <div key={idx} className="bg-stone-950/70 p-3 rounded-xl border border-stone-800 text-xs text-stone-300 flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dietary Geobotanicals */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Soil-Derived Geobotanicals & Traditional Herbs
                  </h4>
                  <div className="space-y-2">
                    {selectedZone.dietaryGeobotanicals.map((herb, idx) => (
                      <div key={idx} className="bg-stone-950/70 p-3 rounded-xl border border-stone-800 text-xs text-stone-300 flex items-start gap-2 leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                        <span>{herb}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LAYER 2: SPATIAL EPIDEMIOLOGY & GEO-HEALTH DISPARITIES */}
      {activeLayer === 'disparities' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-black font-sans uppercase tracking-wider">
                  Global Health Geography & Life Expectancy Heatmap
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-400">WHO & Lancet Planetary Health Benchmarks</span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-4xl">
              Health geography explores the spatial distribution of disease, healthcare accessibility corridors, and how physical environmental variables (particulate air pollution, thermal stress, walkability infrastructure) account for over 60% of variance in population healthspan.
            </p>

            <div className="space-y-3 pt-2">
              {GEO_HEALTH_DISPARITIES.map((item, idx) => (
                <div key={idx} className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 hover:border-teal-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                        {item.riskGrade}
                      </span>
                      <h4 className="text-sm font-bold text-white">{item.region}</h4>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">{item.keyFactors}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 bg-stone-900/90 p-3 rounded-xl border border-stone-800">
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Avg Lifespan</span>
                      <span className="text-sm font-black text-amber-400 font-mono">{item.avgLifeExpectancy}</span>
                    </div>
                    <div className="text-right border-l border-stone-800 pl-3">
                      <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Healthy Healthspan</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">{item.hpa}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LAYER 3: CLIMATIC BIOMES & ALTITUDE ADAPTATION */}
      {activeLayer === 'climates' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <Waves className="w-4 h-4" /> Marine Coast & Negative Ions
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Coastal zones (Okinawa, Ikaria) benefit from ocean surf breaking, which creates high concentrations of airborne negative ions (1,000–5,000 ions/cm³). Negative ions improve ciliary motility in the respiratory tract and support autonomic nervous system equilibrium.
            </p>
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-[11px] font-mono text-sky-300">
              Biomarker: -18% Circulating Cortisol
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Mountain className="w-4 h-4" /> Mountain Altitude & Hypoxia
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Moderate elevations (600–1,500m in Sardinia, Hunza) stimulate mild intermittent hypoxia, triggering hypoxia-inducible factor (HIF-1α), enhancing mitochondrial biogenesis, vascular endothelial growth factor (VEGF), and coronary collateral capillary density.
            </p>
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-[11px] font-mono text-amber-300">
              Biomarker: +22% Capillary Collateralization
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Trees className="w-4 h-4" /> Forest Canopies & Phytoncides
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Temperate and subtropical forests release volatile organic antimicrobial terpenes (phytoncides like alpha-pinene and limonene). Breathing forest air triggers Natural Killer (NK) cell expression and intracellular anti-cancer protein synthesis (perforin, granzyme).
            </p>
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-[11px] font-mono text-emerald-300">
              Biomarker: +50% Sustained NK Cell Activity
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
