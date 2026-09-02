import React, { useState } from 'react';
import { 
  Compass, Eye, Sun, Moon, CloudRain, Wind, Layers, Copy, Check, 
  Sparkles, Maximize2, Shield, Info, MapPin, Volume2, TreeDeciduous, 
  ArrowRight, BookOpen, Clock, Play, Pause, Bookmark
} from 'lucide-react';
import { 
  CAMPUS_PAVILIONS, 
  ARCHITECTURAL_PERSPECTIVES, 
  CAMPUS_WEATHER_OPTIONS, 
  ARCHITECTURAL_PHILOSOPHY_PRINCIPLES,
  MATERIAL_PALETTE 
} from '../data/campusArchitectureData';
import { CampusPavilion, ArchitecturalPerspective, CampusWeatherTime, TribHouseView } from '../types';
import { ArchitecturalCanvasRenderer } from './ArchitecturalCanvasRenderer';

interface CampusArchitectureViewProps {
  onNavigateToView?: (viewId: TribHouseView) => void;
  onOpenTribLibrarian?: (context?: string, initialQuery?: string) => void;
}

export const CampusArchitectureView: React.FC<CampusArchitectureViewProps> = ({
  onNavigateToView,
  onOpenTribLibrarian
}) => {
  // Active states
  const [selectedPavilion, setSelectedPavilion] = useState<CampusPavilion>(CAMPUS_PAVILIONS[0]);
  const [selectedPerspective, setSelectedPerspective] = useState<ArchitecturalPerspective>(ARCHITECTURAL_PERSPECTIVES[0]);
  const [activeWeather, setActiveWeather] = useState<CampusWeatherTime>('morning');
  const [cameraFilter, setCameraFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'masterplan' | 'perspectives' | 'blueprints' | 'philosophy' | 'century'>('masterplan');
  
  // Perspective Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Audio preview state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handleCopyPrompt = (perspective: ArchitecturalPerspective) => {
    navigator.clipboard.writeText(perspective.heroPrompt);
    setCopiedPromptId(perspective.id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const filteredPerspectives = ARCHITECTURAL_PERSPECTIVES.filter(p => {
    if (cameraFilter === 'ALL') return true;
    return p.cameraType.toLowerCase().includes(cameraFilter.toLowerCase());
  });

  const currentWeatherObj = CAMPUS_WEATHER_OPTIONS.find(w => w.id === activeWeather) || CAMPUS_WEATHER_OPTIONS[1];

  return (
    <div id="trib-campus-architecture-view" className="min-h-screen bg-stone-900 text-stone-100 pb-20">
      {/* Hero Architectural Header */}
      <div className={`relative overflow-hidden bg-gradient-to-b ${currentWeatherObj.ambientColor} border-b border-stone-800 transition-colors duration-1000`}>
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#3a4d3f_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Trib-House Living Library Campus • Physical Masterplan</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-100 tracking-tight leading-tight">
                The Living Library in the Trees
              </h1>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans">
                A physical sanctuary suspended lightly among mature canopies rather than dominating the forest. 
                Twelve ecological research pavilions, elevated skyways, and silent archive chambers where knowledge, 
                trees, silence, and future generations meet in 100-year continuity.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-stone-400">
                <span className="flex items-center gap-1.5">
                  <TreeDeciduous className="w-4 h-4 text-emerald-400" />
                  <span>12 Biophilic Pavilions</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Zero Root Intrusion</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>100-Year Horizon (2126 CE)</span>
                </span>
              </div>
            </div>

            {/* Atmosphere & Time of Day Controller */}
            <div className="bg-stone-950/80 backdrop-blur-md p-4 rounded-2xl border border-stone-800 shadow-xl space-y-3 shrink-0 lg:w-80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lighting & Atmosphere</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {currentWeatherObj.label}
                </span>
              </div>

              {/* Weather Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {CAMPUS_WEATHER_OPTIONS.map(weather => (
                  <button
                    key={weather.id}
                    id={`campus-weather-${weather.id}`}
                    onClick={() => setActiveWeather(weather.id)}
                    className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all text-xs ${
                      activeWeather === weather.id
                        ? 'bg-gradient-to-tr from-emerald-400 to-teal-300 text-stone-950 font-extrabold shadow-md shadow-emerald-400/30 scale-105 border border-emerald-200'
                        : 'bg-stone-900/90 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                    }`}
                    title={weather.description}
                  >
                    <span className="text-base">{weather.icon}</span>
                    <span className="text-[10px] truncate max-w-full font-medium">{weather.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-stone-300 leading-snug">
                {currentWeatherObj.description}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pt-8 border-b border-stone-800/80 text-xs font-semibold">
            <button
              id="campus-tab-masterplan"
              onClick={() => setActiveTab('masterplan')}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'masterplan'
                  ? 'border-emerald-400 text-emerald-300 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Interactive Masterplan</span>
            </button>

            <button
              id="campus-tab-perspectives"
              onClick={() => setActiveTab('perspectives')}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'perspectives'
                  ? 'border-emerald-400 text-emerald-300 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>20 Master Perspectives</span>
            </button>

            <button
              id="campus-tab-blueprints"
              onClick={() => setActiveTab('blueprints')}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'blueprints'
                  ? 'border-emerald-400 text-emerald-300 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Pavilion Blueprints & Engineering</span>
            </button>

            <button
              id="campus-tab-century"
              onClick={() => setActiveTab('century')}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'century'
                  ? 'border-emerald-400 text-emerald-300 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Silent Future Archive (2126 CE)</span>
            </button>

            <button
              id="campus-tab-philosophy"
              onClick={() => setActiveTab('philosophy')}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'philosophy'
                  ? 'border-emerald-400 text-emerald-300 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <TreeDeciduous className="w-4 h-4 text-amber-400" />
              <span>Biophilic & Zen Philosophy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ========================================================================= */}
        {/* TAB 1: INTERACTIVE MASTERPLAN & PAVILION MAP */}
        {/* ========================================================================= */}
        {activeTab === 'masterplan' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Interactive 2D Topological Campus Canvas */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-stone-950 p-4 sm:p-6 rounded-3xl border border-stone-800 shadow-2xl relative">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
                        <span>Topological Canopy Masterplan</span>
                        <span className="text-xs font-mono font-normal text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800">
                          1:500 Scale
                        </span>
                      </h2>
                      <p className="text-xs text-stone-400">
                        Click any pavilion to inspect its spatial acoustics, elevation, and structural passive engineering.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const nextPerspective = ARCHITECTURAL_PERSPECTIVES.find(p => p.pavilionId === selectedPavilion.id) || ARCHITECTURAL_PERSPECTIVES[0];
                        setSelectedPerspective(nextPerspective);
                        setIsDetailModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View 3D Angle</span>
                    </button>
                  </div>

                  {/* SVG Masterplan Stage */}
                  <div className="relative w-full aspect-[16/10] bg-gradient-to-b from-stone-950 via-emerald-950/20 to-stone-950 rounded-2xl overflow-hidden border border-stone-800/80">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full object-contain cursor-crosshair"
                    >
                      {/* Forest Topography Contours */}
                      <path
                        d="M 5 20 Q 30 15 60 25 T 95 18 M 10 45 Q 40 40 70 50 T 90 42 M 5 70 Q 35 65 65 75 T 95 68"
                        stroke="#223a2b"
                        strokeWidth="0.8"
                        fill="none"
                        opacity="0.4"
                      />

                      {/* Forest stream waterway */}
                      <path
                        d="M 5 45 Q 30 40 50 35 T 78 24 T 95 18"
                        fill="none"
                        stroke="#1e4d58"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.7"
                      />

                      {/* Elevated Walkway Skyway Network */}
                      <path
                        d="M 38 22 Q 48 38 68 30 T 82 22 M 48 38 Q 28 46 24 64 M 48 38 Q 42 56 50 78 M 68 30 Q 78 44 74 62 M 74 62 Q 62 70 50 78 M 48 38 Q 55 18 62 12"
                        fill="none"
                        stroke="#8b5a2b"
                        strokeWidth="1.2"
                        strokeDasharray="1.5 0.8"
                        opacity="0.85"
                      />

                      {/* Living mature canopy tree foliage clusters */}
                      <circle cx="20" cy="18" r="14" fill="#14331d" opacity="0.6" />
                      <circle cx="50" cy="14" r="12" fill="#14331d" opacity="0.6" />
                      <circle cx="85" cy="40" r="16" fill="#14331d" opacity="0.6" />
                      <circle cx="35" cy="78" r="15" fill="#14331d" opacity="0.6" />
                      <circle cx="75" cy="85" r="14" fill="#14331d" opacity="0.6" />

                      {/* Ceremonial 100-Year Tree Indicator */}
                      <circle cx="55" cy="14" r="5" fill="#3b6e56" stroke="#c2a649" strokeWidth="0.6" />
                      <text x="55" y="11" textAnchor="middle" fill="#ffd699" fontSize="2.2" fontFamily="serif" fontWeight="bold">
                        100-Yr Tree
                      </text>

                      {/* Pavilion Interactive Nodes */}
                      {CAMPUS_PAVILIONS.map(pavilion => {
                        const isSelected = selectedPavilion.id === pavilion.id;
                        return (
                          <g
                            key={pavilion.id}
                            id={`map-node-${pavilion.id}`}
                            className="cursor-pointer transition-all duration-300"
                            onClick={() => setSelectedPavilion(pavilion)}
                          >
                            {/* Outer Pulse when selected */}
                            {isSelected && (
                              <circle
                                cx={pavilion.coordinates.x}
                                cy={pavilion.coordinates.y}
                                r="6.5"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="0.8"
                                strokeDasharray="1 1"
                                className="animate-spin"
                              />
                            )}

                            {/* Node Marker Base */}
                            <circle
                              cx={pavilion.coordinates.x}
                              cy={pavilion.coordinates.y}
                              r={isSelected ? 4.2 : 3.2}
                              fill={isSelected ? '#047857' : '#1c1917'}
                              stroke={isSelected ? '#34d399' : '#8b5a2b'}
                              strokeWidth="0.8"
                            />

                            {/* Center Dot */}
                            <circle
                              cx={pavilion.coordinates.x}
                              cy={pavilion.coordinates.y}
                              r="1.2"
                              fill={isSelected ? '#ffffff' : '#c2a649'}
                            />

                            {/* Label */}
                            <text
                              x={pavilion.coordinates.x}
                              y={pavilion.coordinates.y + (pavilion.coordinates.y > 70 ? -5 : 5.8)}
                              textAnchor="middle"
                              fill={isSelected ? '#ffffff' : '#d6d3d1'}
                              fontSize="2.4"
                              fontFamily="sans-serif"
                              fontWeight={isSelected ? 'bold' : 'normal'}
                              className="pointer-events-none drop-shadow-md"
                            >
                              {pavilion.name.replace('The ', '').split(' ')[0]}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Masterplan Map Legend */}
                    <div className="absolute bottom-3 left-3 bg-stone-950/90 backdrop-blur-md p-2.5 rounded-xl border border-stone-800 text-[10px] space-y-1.5">
                      <div className="font-semibold text-stone-300">Map Legend:</div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-stone-400">Selected Pavilion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-amber-700 border-b border-dashed border-amber-500" />
                        <span className="text-stone-400">Elevated Skyway (6–12m)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-700" />
                        <span className="text-stone-400">Forest Stream Wetland</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perspective Preview Strip for Selected Pavilion */}
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-300">
                      Architectural Perspectives for {selectedPavilion.name}
                    </span>
                    <span className="text-stone-400 font-mono">
                      {selectedPavilion.perspectives.length} view angles available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedPavilion.perspectives.slice(0, 3).map(pId => {
                      const p = ARCHITECTURAL_PERSPECTIVES.find(x => x.id === pId);
                      if (!p) return null;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedPerspective(p);
                            setIsDetailModalOpen(true);
                          }}
                          className="group cursor-pointer rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500 p-2 space-y-2 transition-all"
                        >
                          <div className="aspect-[16/10] rounded-lg overflow-hidden relative">
                            <ArchitecturalCanvasRenderer
                              perspective={p}
                              lightingTime={activeWeather}
                              className="w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Maximize2 className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="text-xs font-semibold text-stone-200 group-hover:text-emerald-400 truncate">
                            {p.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Selected Pavilion Inspector Panel */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
                  {/* Pavilion Title & Category */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono uppercase font-bold tracking-wider">
                        {selectedPavilion.category}
                      </span>
                      <span className="text-xs font-mono text-stone-400">
                        {selectedPavilion.elevationMeters}m Elevation
                      </span>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-stone-100 leading-snug">
                      {selectedPavilion.name}
                    </h3>
                    <p className="text-xs text-stone-400">
                      {selectedPavilion.subtitle}
                    </p>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-800/80 text-center">
                    <div>
                      <div className="text-[10px] text-stone-400 font-mono">Area</div>
                      <div className="text-sm font-bold text-emerald-400">{selectedPavilion.areaSqm} m²</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400 font-mono">Levels</div>
                      <div className="text-sm font-bold text-amber-400">{selectedPavilion.levels} Floors</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400 font-mono">Capacity</div>
                      <div className="text-xs font-bold text-cyan-400 truncate">{selectedPavilion.capacity.split(' ')[0]} Readers</div>
                    </div>
                  </div>

                  {/* Quote Inscription */}
                  {selectedPavilion.quoteInscription && (
                    <div className="p-3.5 rounded-xl bg-stone-900/90 border-l-2 border-amber-500 text-xs italic text-amber-200/90 font-serif">
                      &quot;{selectedPavilion.quoteInscription}&quot;
                    </div>
                  )}

                  {/* Architectural Philosophy */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-stone-300 font-mono uppercase tracking-wider">
                      Architectural Philosophy
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {selectedPavilion.architecturalPhilosophy}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-stone-300 font-mono uppercase tracking-wider">
                      Key Spatial Features
                    </h4>
                    <ul className="space-y-1.5 text-xs text-stone-300">
                      {selectedPavilion.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Primary Materials */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-stone-300 font-mono uppercase tracking-wider">
                      Biophilic Materials
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPavilion.primaryMaterials.map((mat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-stone-300"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Live Soundscape Player Preview */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-900 to-emerald-950/40 border border-stone-800 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-emerald-400" />
                        <span>Pavilion Soundscape</span>
                      </div>
                      <div className="text-xs font-semibold text-stone-200">
                        {selectedPavilion.soundscapeTrack}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-all shadow-md active:scale-95"
                      title="Play simulated soundscape"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Action Triggers */}
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const p = ARCHITECTURAL_PERSPECTIVES.find(x => x.pavilionId === selectedPavilion.id) || ARCHITECTURAL_PERSPECTIVES[0];
                        setSelectedPerspective(p);
                        setIsDetailModalOpen(true);
                      }}
                      className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Inspect Master Visual Perspectives</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenTribLibrarian) {
                          onOpenTribLibrarian(
                            selectedPavilion.name,
                            `Tell me more about the architectural physics, natural ventilation, and biophilic design of ${selectedPavilion.name}.`
                          );
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ask Trib AI About Construction</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 20 MASTER ARCHITECTURAL PERSPECTIVES GALLERY */}
        {/* ========================================================================= */}
        {activeTab === 'perspectives' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-stone-400 font-mono">Camera Angle:</span>
                {['ALL', 'Drone', 'Worm', 'Path', 'Interior', 'Archive', 'Canopy'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCameraFilter(cat)}
                    className={`px-3 py-1 rounded-xl font-semibold transition-all ${
                      cameraFilter === cat
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="text-xs font-mono text-stone-400">
                Showing {filteredPerspectives.length} of 20 Master Perspectives
              </div>
            </div>

            {/* Grid of 20 Perspectives */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPerspectives.map(p => (
                <div
                  key={p.id}
                  id={`perspective-card-${p.id}`}
                  className="bg-stone-950 rounded-3xl border border-stone-800 hover:border-emerald-500/80 shadow-xl overflow-hidden group flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    {/* Visual Preview Canvas */}
                    <div className="aspect-[16/10] relative overflow-hidden bg-stone-900">
                      <ArchitecturalCanvasRenderer
                        perspective={p}
                        lightingTime={activeWeather}
                        className="w-full h-full"
                      />

                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedPerspective(p);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-stone-950/90 text-white hover:bg-emerald-700 transition-colors shadow-lg"
                          title="Expand Full Details"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 font-semibold mb-1">
                          <span>Perspective #{p.number}</span>
                          <span className="text-stone-400">{p.aspectRatio}</span>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-stone-100 group-hover:text-emerald-300 transition-colors">
                          {p.title}
                        </h3>
                        <p className="text-xs text-stone-400 line-clamp-2 mt-1">
                          {p.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                        {p.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0 border-t border-stone-900 flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => handleCopyPrompt(p)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-mono flex items-center gap-1.5 border border-stone-800 transition-all"
                      title="Copy Master Architectural 8K Prompt"
                    >
                      {copiedPromptId === p.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied 8K Prompt</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-400" />
                          <span>Copy 8K Prompt</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPerspective(p);
                        setIsDetailModalOpen(true);
                      }}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <span>Deep Dive</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PAVILION BLUEPRINTS & PASSIVE ENGINEERING MATRIX */}
        {/* ========================================================================= */}
        {activeTab === 'blueprints' && (
          <div className="space-y-8">
            <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-6">
              <div className="max-w-3xl space-y-2">
                <h2 className="text-2xl font-serif font-bold text-stone-100">
                  Passive Climate & Structural Engineering Blueprints
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Real-world physics and climate responsiveness. The architecture obeys strict ecological structural constraints: 
                  zero clear-cutting, zero invasive tree collar penetrations, 100% natural cross-ventilation, and hurricane-resistant glulam joinery.
                </p>
              </div>

              {/* Passive Design Matrix Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CAMPUS_PAVILIONS.map(pav => (
                  <div
                    key={pav.id}
                    className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {pav.name}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {pav.areaSqm}m² • L{pav.levels}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-stone-400 font-mono text-[10px] block">VENTILATION / STACK EFFECT</span>
                          <p className="text-stone-300 text-[11px] leading-snug">{pav.passiveDesign.ventilation}</p>
                        </div>
                        <div>
                          <span className="text-stone-400 font-mono text-[10px] block">SOLAR & THERMAL STRATEGY</span>
                          <p className="text-stone-300 text-[11px] leading-snug">{pav.passiveDesign.solarStrategy}</p>
                        </div>
                        <div>
                          <span className="text-stone-400 font-mono text-[10px] block">RAINWATER & HYDROLOGY</span>
                          <p className="text-stone-300 text-[11px] leading-snug">{pav.passiveDesign.rainwater}</p>
                        </div>
                        <div>
                          <span className="text-stone-400 font-mono text-[10px] block">TREE INTEGRATION & COLLAR</span>
                          <p className="text-stone-300 text-[11px] leading-snug">{pav.passiveDesign.treeIntegration}</p>
                        </div>
                        <div>
                          <span className="text-stone-400 font-mono text-[10px] block">UNIVERSAL ACCESSIBILITY</span>
                          <p className="text-stone-300 text-[11px] leading-snug">{pav.passiveDesign.accessibility}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPavilion(pav);
                        setActiveTab('masterplan');
                      }}
                      className="w-full py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-all text-center"
                    >
                      Locate on Masterplan Map
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Material Palette Table */}
            <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-4">
              <h3 className="text-lg font-serif font-bold text-stone-100">
                Biophilic Material Palette Specifications
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-800 text-stone-400 font-mono">
                      <th className="pb-3 pr-4">Material</th>
                      <th className="pb-3 px-4">Primary Application</th>
                      <th className="pb-3 px-4">Aging & Durability</th>
                      <th className="pb-3 pl-4">Ecological Origin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-900 text-stone-300">
                    {MATERIAL_PALETTE.map((mat, i) => (
                      <tr key={i} className="hover:bg-stone-900/50">
                        <td className="py-3 pr-4 font-semibold text-stone-200 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: mat.code }} />
                          <span>{mat.name}</span>
                        </td>
                        <td className="py-3 px-4 text-stone-300">{mat.usage}</td>
                        <td className="py-3 px-4 text-emerald-400 font-mono">{mat.durability}</td>
                        <td className="py-3 pl-4 text-stone-400">100% Sustainable / Non-toxic</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: THE SILENT FUTURE ARCHIVE (2126 CE HORIZON) */}
        {/* ========================================================================= */}
        {activeTab === 'century' && (
          <div className="space-y-8">
            <div className="bg-stone-950 p-6 sm:p-10 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden space-y-8">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>The 100-Year Future Library & Silent Archive</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
                  &quot;For those who come after us.&quot;
                </h2>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Inside the 20m² Silent Room, sealed handwritten letters, speculative scientific folios, and community memories 
                  rest in dark smoked cypress boxes on a carved granite table. Outside the narrow vertical slit window, 
                  the ceremonial 100-Year Native Tree grows undisturbed toward 2126 CE.
                </p>
              </div>

              {/* Milestone Timeline Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {[
                  { year: '2026', title: 'Inception Horizon', desc: 'Current foundation year: first 100 letters sealed in oak vaults.' },
                  { year: '2036', title: 'Decade Horizon', desc: '10 years of canopy growth and initial ecological restoration review.' },
                  { year: '2051', title: '25-Year Quarter', desc: 'First intergenerational manuscript unlocking ceremony.' },
                  { year: '2076', title: 'Semi-Centennial', desc: '50-year flourishing review: mature timber patina & new generations.' },
                  { year: '2126', title: 'Centennial Opening', desc: 'Full 100-year vault opening for citizens of the 22nd Century.' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/80 space-y-2 transition-all"
                  >
                    <div className="text-2xl font-serif font-bold text-amber-400">
                      {item.year}
                    </div>
                    <div className="text-xs font-semibold text-stone-200">
                      {item.title}
                    </div>
                    <p className="text-[11px] text-stone-400 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Visual Preview of Silent Room */}
              <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-stone-800 relative">
                {ARCHITECTURAL_PERSPECTIVES.find(p => p.id === 'p9') && (
                  <ArchitecturalCanvasRenderer
                    perspective={ARCHITECTURAL_PERSPECTIVES.find(p => p.id === 'p9')!}
                    lightingTime={activeWeather}
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Action: Seal a Letter */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-stone-900 to-stone-900 border border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-serif font-bold text-amber-200">
                    Contribute to the Century Branch Vault
                  </div>
                  <div className="text-xs text-stone-300">
                    Write a message, research hypothesis, or poem to be sealed for readers in 2051, 2076, or 2126.
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onNavigateToView) onNavigateToView('century');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 transition-all shrink-0"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Go to 100-Year Letter Vault</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BIOPHILIC & ZEN PHILOSOPHY GUIDE */}
        {/* ========================================================================= */}
        {activeTab === 'philosophy' && (
          <div className="space-y-8">
            <div className="bg-stone-950 p-6 sm:p-10 rounded-3xl border border-stone-800 space-y-8">
              <div className="max-w-3xl space-y-3">
                <h2 className="text-3xl font-serif font-bold text-stone-100">
                  Architectural Philosophy: Interbeing & Mindful Space
                </h2>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Trib-House is built upon the recognition that true knowledge cannot be separated from living Earth. 
                  Architecture becomes a teacher of silence, patience, and ecological care.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ARCHITECTURAL_PHILOSOPHY_PRINCIPLES.map((principle, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3"
                  >
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      Principle 0{idx + 1}
                    </div>
                    <h3 className="text-base font-serif font-bold text-stone-100">
                      {principle.title}
                    </h3>
                    <div className="text-xs text-amber-300/80 font-mono">
                      {principle.subtitle}
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Master Statement Banner */}
              <div className="p-8 rounded-3xl bg-emerald-950/40 border border-emerald-800/80 text-center space-y-4">
                <div className="text-lg sm:text-xl font-serif italic text-emerald-200 max-w-2xl mx-auto leading-relaxed">
                  &quot;A library that did not conquer the forest. A library that learned how to live inside it.&quot;
                </div>
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                  Knowledge Grows Here • People Grow Here • Trees Grow Here • Time Grows Here
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PERSPECTIVE DETAIL MODAL (HIGH-RES PROMPT & SPECS) */}
      {/* ========================================================================= */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <div className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                  Master Perspective #{selectedPerspective.number} of 20
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mt-0.5">
                  {selectedPerspective.title}
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  {selectedPerspective.subtitle}
                </p>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* High-Res Visual Stage */}
            <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-stone-800">
              <ArchitecturalCanvasRenderer
                perspective={selectedPerspective}
                lightingTime={activeWeather}
                className="w-full h-full"
              />
            </div>

            {/* Three-Layer Composition Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs">
              <div>
                <span className="font-mono text-emerald-400 font-bold text-[10px] block">FOREGROUND</span>
                <p className="text-stone-300 mt-1 leading-snug">{selectedPerspective.composition.foreground}</p>
              </div>
              <div>
                <span className="font-mono text-amber-400 font-bold text-[10px] block">MIDDLEGROUND</span>
                <p className="text-stone-300 mt-1 leading-snug">{selectedPerspective.composition.middleground}</p>
              </div>
              <div>
                <span className="font-mono text-cyan-400 font-bold text-[10px] block">BACKGROUND</span>
                <p className="text-stone-300 mt-1 leading-snug">{selectedPerspective.composition.background}</p>
              </div>
            </div>

            {/* Architectural & Structural Specifications */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-stone-300 tracking-wider">
                Architectural & Structural Physics Notes
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
                {selectedPerspective.architecturalDetails.map((det, i) => (
                  <li key={i} className="flex items-start gap-2 bg-stone-900/50 p-2.5 rounded-xl border border-stone-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{det}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-400 italic bg-stone-900/30 p-3 rounded-xl border border-stone-800">
                <span className="font-semibold text-stone-300">Structural Safety:</span> {selectedPerspective.structuralNotes}
              </p>
            </div>

            {/* Master 8K Architectural Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase font-bold text-emerald-400">
                  Master Architectural 8K Prompt (Physically Accurate)
                </span>
                <button
                  onClick={() => handleCopyPrompt(selectedPerspective)}
                  className="px-3 py-1 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-mono text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  {copiedPromptId === selectedPerspective.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPromptId === selectedPerspective.id ? 'Copied to Clipboard' : 'Copy Prompt'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900 font-mono text-[11px] text-stone-300 leading-relaxed border border-stone-800 max-h-36 overflow-y-auto">
                {selectedPerspective.heroPrompt}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold"
              >
                Close Perspective
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
