import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LUXURY_CHAMBERS, LuxuryChamber } from './eliteHomeData';
import { 
  Sparkles, 
  Bed, 
  Wind, 
  Heart, 
  Zap, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  Maximize, 
  Compass, 
  Activity, 
  Flame, 
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';
import eliteLuxChamberImg from '../../assets/images/elite_lux_chamber_1786694826069.jpg';
import eliteMasterplanImg from '../../assets/images/elite_home_masterplan_1786694813149.jpg';
import eliteHeartImg from '../../assets/images/elite_heart_plaza_1786694836765.jpg';
import eliteLongevityImg from '../../assets/images/elite_longevity_sanctuary_1786694849057.jpg';

const imageMap: Record<string, string> = {
  'elite_lux_chamber': eliteLuxChamberImg,
  'elite_home_masterplan': eliteMasterplanImg,
  'elite_heart_plaza': eliteHeartImg,
  'elite_longevity_sanctuary': eliteLongevityImg
};

export const ChamberExplorer3D: React.FC = () => {
  const [selectedChamber, setSelectedChamber] = useState<LuxuryChamber>(LUXURY_CHAMBERS[0]);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);

  // 3D Room Visualizer Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const roomMeshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 280;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0f172a');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(12, 14, 16);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    const ambLight = new THREE.AmbientLight('#f8fafc', 0.9);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight('#fed7aa', 1.8);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Build 3D Architectural Floorplan based on selected chamber
    const roomMeshes: THREE.Mesh[] = [];
    const colors = [0xf43f5e, 0x06b6d4, 0x8b5cf6, 0x10b981, 0xd97706];

    selectedChamber.floorPlanRooms.forEach((room, idx) => {
      const angle = (idx / selectedChamber.floorPlanRooms.length) * Math.PI * 2;
      const rx = Math.cos(angle) * 4.5;
      const rz = Math.sin(angle) * 4.5;

      const geo = new THREE.BoxGeometry(3.2, 1.4, 2.8);
      const isCurrent = idx === selectedRoomIndex;
      const mat = new THREE.MeshStandardMaterial({
        color: isCurrent ? 0xf43f5e : colors[idx % colors.length],
        metalness: 0.3,
        roughness: 0.4,
        emissive: isCurrent ? 0x9f1239 : 0x000000,
        emissiveIntensity: isCurrent ? 0.6 : 0
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(rx, 0.7, rz);
      mesh.castShadow = true;
      scene.add(mesh);
      roomMeshes.push(mesh);
    });
    roomMeshesRef.current = roomMeshes;

    // Floor Base Plate
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(8, 8.5, 0.4, 32), floorMat);
    floor.position.y = -0.2;
    floor.receiveShadow = true;
    scene.add(floor);

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Gentle floorplan rotation
      scene.rotation.y = t * 0.15;

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
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [selectedChamber, selectedRoomIndex]);

  const activeImage = imageMap[selectedChamber.imageKey] || eliteLuxChamberImg;

  return (
    <div className="space-y-6" id="chamber-explorer-3d-root">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 via-rose-950/40 to-stone-900 p-6 rounded-3xl border border-rose-900/30 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold border border-rose-500/30">
              Chambers of Longevity & Peace
            </span>
            <span className="text-[10px] font-mono text-stone-400">100% Biophilic Sanctuary Design</span>
          </div>
          <h2 className="text-2xl font-black font-sans tracking-tight">
            eLite Home Luxury Living Chambers
          </h2>
          <p className="text-xs text-stone-300 max-w-2xl mt-1 leading-relaxed">
            Private sanctuaries engineered to optimize sleep architecture, parasympathetic nervous tone, cellular regeneration, and continuous dignified connection with pristine nature.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">Selected Suite</span>
            <span className="text-sm font-black text-rose-400">{selectedChamber.sqFt.toLocaleString()} sq.ft • {selectedChamber.type}</span>
          </div>
        </div>
      </div>

      {/* Chamber Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LUXURY_CHAMBERS.map((chamber) => (
          <button
            key={chamber.id}
            onClick={() => {
              setSelectedChamber(chamber);
              setSelectedRoomIndex(0);
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between
              ${selectedChamber.id === chamber.id 
                ? 'bg-gradient-to-b from-stone-900 to-rose-950/70 border-rose-500 shadow-lg text-white ring-2 ring-rose-500/30' 
                : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700 hover:bg-stone-900'}
            `}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/40">
                  {chamber.districtName}
                </span>
                <span className="text-xs font-mono font-bold text-stone-300">{chamber.sqFt} sq.ft</span>
              </div>
              <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">{chamber.name}</h4>
              <p className="text-[10px] text-stone-400 line-clamp-2 leading-relaxed">{chamber.view}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-800/60 flex items-center justify-between text-[10px] font-mono">
              <span className="text-amber-400 font-bold">{chamber.pricePerYear.split(' ')[0]}</span>
              <span className="text-rose-400 font-bold flex items-center gap-0.5">Explore <ChevronRight className="w-3 h-3" /></span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Chamber Showcase: Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Render & 3D Interactive Floorplan */}
        <div className="lg:col-span-7 space-y-4">
          {/* Architectural Render Showcase */}
          <div className="relative rounded-3xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-950 group">
            <img 
              src={activeImage} 
              alt={selectedChamber.name}
              referrerPolicy="no-referrer"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-6">
              <span className="text-[10px] font-mono uppercase bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-bold w-fit mb-1.5">
                8K Photorealistic Architectural Visualization
              </span>
              <h3 className="text-xl font-black text-white font-sans">{selectedChamber.name}</h3>
              <p className="text-xs text-stone-300 mt-1 max-w-xl line-clamp-2 leading-relaxed">
                {selectedChamber.architecturalVision}
              </p>
            </div>
          </div>

          {/* 3D Interactive Floorplan Canvas */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-bold font-sans uppercase tracking-wider">
                  Interactive 3D Suite Spatial Model
                </h4>
              </div>
              <span className="text-[9px] font-mono text-stone-400">Click a sector below to highlight</span>
            </div>

            <div 
              ref={containerRef}
              className="w-full h-56 rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 relative mb-4"
            >
              <canvas ref={canvasRef} className="w-full h-full block" />
              <div className="absolute top-2 right-2 bg-stone-900/80 backdrop-blur-xs text-[9px] font-mono px-2 py-1 rounded text-stone-300">
                Real-time 3D Rotation
              </div>
            </div>

            {/* Room Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {selectedChamber.floorPlanRooms.map((room, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedRoomIndex(idx)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer text-xs
                    ${selectedRoomIndex === idx
                      ? 'bg-rose-950/80 border-rose-500 text-white font-bold'
                      : 'bg-stone-950/60 border-stone-800/80 text-stone-400 hover:text-stone-200'}
                  `}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono mb-0.5">
                    <span className="text-rose-400 font-bold">Room 0{idx + 1}</span>
                    <span>{room.size}</span>
                  </div>
                  <div className="font-sans font-bold text-[11px] truncate">{room.name}</div>
                </button>
              ))}
            </div>

            {/* Selected Room Description */}
            <div className="mt-3 p-3 rounded-xl bg-stone-950/80 border border-stone-800 text-xs text-stone-300 leading-relaxed">
              <strong className="text-rose-400">{selectedChamber.floorPlanRooms[selectedRoomIndex].name} ({selectedChamber.floorPlanRooms[selectedRoomIndex].size}):</strong> {selectedChamber.floorPlanRooms[selectedRoomIndex].description}
            </div>
          </div>
        </div>

        {/* Right Column: Biophilic Features & Health Tech Specifications */}
        <div className="lg:col-span-5 space-y-4">
          {/* Biophilic Architecture Highlights */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 text-white space-y-3">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-emerald-300">
                Biophilic Integration Matrix
              </h4>
            </div>
            <div className="space-y-2">
              {selectedChamber.biophilicFeatures.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-300 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/60 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Health-Tech & Longevity Suite */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 text-white space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-rose-300">
                Discreet Health-Tech & Longevity Suite
              </h4>
            </div>
            <div className="space-y-2">
              {selectedChamber.healthTechSuite.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-300 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/60 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eco-Materials & Carbon Profile */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 text-white space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-amber-300">
                Natural Materials & Energy Profile
              </h4>
            </div>
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-xs space-y-2">
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">Sustainable Materials:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedChamber.interiorMaterials.map((mat, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-stone-800 text-stone-200 px-2 py-0.5 rounded">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-stone-800">
                <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">Energy & Carbon Footprint:</span>
                <span className="text-xs text-amber-300 font-bold">{selectedChamber.energyProfile}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
