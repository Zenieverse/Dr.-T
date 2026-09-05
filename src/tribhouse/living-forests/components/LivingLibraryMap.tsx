// =========================================================================
// LIVING LIBRARY MAP: INTERACTIVE GLOBAL GEOSPATIAL EXPLORER
// Accurate Equirectangular World Cartography, Zoom/Pan Engine, Pin Tooltips,
// Mobile Caravan Routes, Tree Groves Layer, and Regional Focus Presets
// =========================================================================

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Globe2, 
  MapPin, 
  Filter, 
  Trees, 
  BookOpen, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Info,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Navigation,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Ship,
  Eye,
  Check,
  X,
  Maximize2
} from 'lucide-react';
import { LibraryProject, ProjectStatus, ProjectType, MobileLibraryRoute, TreeDedication } from '../types';

interface LivingLibraryMapProps {
  projects: LibraryProject[];
  mobileRoutes?: MobileLibraryRoute[];
  dedications?: TreeDedication[];
  onSelectProject: (project: LibraryProject) => void;
  onPlantForProject: (project: LibraryProject) => void;
  onGiveTreeForProject: (project: LibraryProject) => void;
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string; border: string; hex: string }> = {
  IDEA: { label: 'Idea Proposal', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40', hex: '#f59e0b' },
  VERIFIED_NEED: { label: 'Verified Need', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40', hex: '#f97316' },
  FUNDRAISING: { label: 'Active Campaign', color: 'text-sky-400', bg: 'bg-sky-500/20', border: 'border-sky-500/40', hex: '#38bdf8' },
  FUNDED: { label: 'Escrow Funded', color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/40', hex: '#818cf8' },
  BUILDING: { label: 'Constructing', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', hex: '#eab308' },
  OPEN: { label: 'Doors Open', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', hex: '#34d399' },
  GROWING: { label: 'Growing Community', color: 'text-teal-400', bg: 'bg-teal-500/20', border: 'border-teal-500/40', hex: '#2dd4bf' },
  SELF_SUSTAINING: { label: 'Self-Sustaining Root', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/40', hex: '#c084fc' },
};

// Region presets for one-click camera focus
type RegionKey = 'WORLD' | 'SE_ASIA' | 'EAST_AFRICA' | 'ANDES' | 'CENTRAL_AMERICA' | 'NORTH_AFRICA' | 'ARCTIC' | 'PACIFIC';

interface RegionPreset {
  id: RegionKey;
  label: string;
  flag: string;
  viewBox: { x: number; y: number; w: number; h: number };
}

const REGION_PRESETS: RegionPreset[] = [
  { id: 'WORLD', label: 'All World', flag: '🌐', viewBox: { x: 0, y: 0, w: 1000, h: 500 } },
  { id: 'SE_ASIA', label: 'SE Asia (Mekong)', flag: '🇻🇳', viewBox: { x: 700, y: 160, w: 180, h: 140 } },
  { id: 'EAST_AFRICA', label: 'East Africa (Turkana)', flag: '🇰🇪', viewBox: { x: 530, y: 180, w: 150, h: 140 } },
  { id: 'ANDES', label: 'Andes & Amazon', flag: '🇵🇪', viewBox: { x: 230, y: 220, w: 160, h: 170 } },
  { id: 'CENTRAL_AMERICA', label: 'Mesoamerica (Oaxaca)', flag: '🇲🇽', viewBox: { x: 170, y: 160, w: 150, h: 130 } },
  { id: 'NORTH_AFRICA', label: 'High Atlas (Morocco)', flag: '🇲🇦', viewBox: { x: 440, y: 130, w: 150, h: 120 } },
  { id: 'ARCTIC', label: 'Arctic (Nunavut)', flag: '🇨🇦', viewBox: { x: 220, y: 30, w: 180, h: 120 } },
  { id: 'PACIFIC', label: 'Pacific (Fiji)', flag: '🇫🇯', viewBox: { x: 890, y: 240, w: 120, h: 120 } },
];

// Standard Equirectangular Projection formula:
// Width: 1000, Height: 500
// lng in [-180, 180] -> x in [0, 1000]
// lat in [90, -90] -> y in [0, 500]
const projectToSvg = (lat: number, lng: number): { x: number; y: number } => {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return {
    x: Math.max(10, Math.min(990, x)),
    y: Math.max(10, Math.min(490, y)),
  };
};

export const LivingLibraryMap: React.FC<LivingLibraryMapProps> = ({
  projects,
  mobileRoutes = [],
  dedications = [],
  onSelectProject,
  onPlantForProject,
  onGiveTreeForProject,
}) => {
  // State for filters & selection
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<LibraryProject | null>(projects[0] || null);
  const [hoveredProject, setHoveredProject] = useState<LibraryProject | null>(null);

  // Layer Toggles
  const [showLibrariesLayer, setShowLibrariesLayer] = useState(true);
  const [showCaravanLayer, setShowCaravanLayer] = useState(true);
  const [showTreeGrovesLayer, setShowTreeGrovesLayer] = useState(true);
  const [showGraticules, setShowGraticules] = useState(true);

  // Map ViewBox State (Smooth Pan & Zoom)
  const [currentViewBox, setCurrentViewBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0,
    y: 0,
    w: 1000,
    h: 500,
  });
  const [activeRegion, setActiveRegion] = useState<RegionKey>('WORLD');

  // Drag-to-Pan state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; vbX: number; vbY: number }>({ clientX: 0, clientY: 0, vbX: 0, vbY: 0 });
  const mapSvgRef = useRef<SVGSVGElement | null>(null);

  // Mouse Coordinate Display
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Filter projects based on stage, type, and search query
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchStatus = selectedStatusFilter === 'ALL' || p.status === selectedStatusFilter;
      const matchType = selectedTypeFilter === 'ALL' || p.projectType === selectedTypeFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery = !query || 
        p.name.toLowerCase().includes(query) ||
        p.countryName.toLowerCase().includes(query) ||
        p.communityName.toLowerCase().includes(query) ||
        p.languagesServed.some(l => l.toLowerCase().includes(query)) ||
        p.tagline.toLowerCase().includes(query);
      return matchStatus && matchType && matchQuery;
    });
  }, [projects, selectedStatusFilter, selectedTypeFilter, searchQuery]);

  // Handle Zoom In
  const handleZoomIn = () => {
    setCurrentViewBox(prev => {
      const zoomFactor = 0.7; // zoom in 30%
      const newW = Math.max(80, prev.w * zoomFactor);
      const newH = Math.max(40, prev.h * zoomFactor);
      const newX = Math.max(0, Math.min(1000 - newW, prev.x + (prev.w - newW) / 2));
      const newY = Math.max(0, Math.min(500 - newH, prev.y + (prev.h - newH) / 2));
      return { x: newX, y: newY, w: newW, h: newH };
    });
    setActiveRegion('WORLD');
  };

  // Handle Zoom Out
  const handleZoomOut = () => {
    setCurrentViewBox(prev => {
      const zoomFactor = 1.4; // zoom out
      const newW = Math.min(1000, prev.w * zoomFactor);
      const newH = Math.min(500, prev.h * zoomFactor);
      const newX = Math.max(0, Math.min(1000 - newW, prev.x - (newW - prev.w) / 2));
      const newY = Math.max(0, Math.min(500 - newH, prev.y - (newH - prev.h) / 2));
      return { x: newX, y: newY, w: newW, h: newH };
    });
    setActiveRegion('WORLD');
  };

  // Reset View
  const handleResetView = () => {
    setCurrentViewBox({ x: 0, y: 0, w: 1000, h: 500 });
    setActiveRegion('WORLD');
  };

  // Switch to specific Region Preset
  const handleSelectRegion = (preset: RegionPreset) => {
    setActiveRegion(preset.id);
    setCurrentViewBox(preset.viewBox);
  };

  // Focus directly onto a project pin
  const handleFocusProject = (proj: LibraryProject) => {
    setActiveProject(proj);
    const { x, y } = projectToSvg(
      proj.geographicEntity.coordinates.lat,
      proj.geographicEntity.coordinates.lng
    );
    const w = 160;
    const h = 120;
    const newX = Math.max(0, Math.min(1000 - w, x - w / 2));
    const newY = Math.max(0, Math.min(500 - h, y - h / 2));
    setCurrentViewBox({ x: newX, y: newY, w, h });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // only main left click
    isDraggingRef.current = true;
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      vbX: currentViewBox.x,
      vbY: currentViewBox.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    // 1. Calculate cursor latitude and longitude for HUD
    if (mapSvgRef.current) {
      const rect = mapSvgRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      const svgX = currentViewBox.x + relX * currentViewBox.w;
      const svgY = currentViewBox.y + relY * currentViewBox.h;
      // Reverse equirectangular
      const lng = (svgX / 1000) * 360 - 180;
      const lat = 90 - (svgY / 500) * 180;
      setCursorCoords({
        lat: Math.round(lat * 100) / 100,
        lng: Math.round(lng * 100) / 100,
      });
    }

    // 2. Perform dragging if mouse down
    if (!isDraggingRef.current || !mapSvgRef.current) return;
    const rect = mapSvgRef.current.getBoundingClientRect();
    const scaleX = currentViewBox.w / rect.width;
    const scaleY = currentViewBox.h / rect.height;
    const deltaX = (e.clientX - dragStartRef.current.clientX) * scaleX;
    const deltaY = (e.clientY - dragStartRef.current.clientY) * scaleY;

    setCurrentViewBox(prev => ({
      ...prev,
      x: Math.max(0, Math.min(1000 - prev.w, dragStartRef.current.vbX - deltaX)),
      y: Math.max(0, Math.min(500 - prev.h, dragStartRef.current.vbY - deltaY)),
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85;
    setCurrentViewBox(prev => {
      const newW = Math.max(60, Math.min(1000, prev.w * zoomFactor));
      const newH = Math.max(30, Math.min(500, prev.h * zoomFactor));
      const newX = Math.max(0, Math.min(1000 - newW, prev.x + (prev.w - newW) / 2));
      const newY = Math.max(0, Math.min(500 - newH, prev.y + (prev.h - newH) / 2));
      return { x: newX, y: newY, w: newW, h: newH };
    });
  };

  // Mobile routes coordinates for animated paths
  const caravanRoutesPaths = [
    {
      id: 'mob-vn-mekong',
      name: 'Mekong Riverboat "Hoa Sen" Canal Loop',
      vehicle: 'RIVER_BOAT',
      // Châu Đốc (10.70°N, 105.11°E) to Tân Châu to Long Xuyên
      points: [
        { lat: 10.7042, lng: 105.1167 },
        { lat: 10.8010, lng: 105.2400 },
        { lat: 10.5300, lng: 105.4200 },
        { lat: 10.3800, lng: 105.4300 }
      ],
      color: '#38bdf8'
    },
    {
      id: 'mob-ke-turkana',
      name: 'Turkana Camel Caravan "Akadeli"',
      vehicle: 'COMMUNITY_CART',
      // Kalokol (3.53°N, 35.84°E) to Lodwar (3.11°N, 35.60°E)
      points: [
        { lat: 3.5300, lng: 35.8400 },
        { lat: 3.3200, lng: 35.7200 },
        { lat: 3.1167, lng: 35.6000 }
      ],
      color: '#f59e0b'
    },
    {
      id: 'mob-pe-andes',
      name: 'Andean High Pass Mule Route',
      vehicle: 'CARGO_BICYCLE',
      // Ollantaytambo (-13.25°S, -72.26°W) to Willoq (-13.18°S, -72.18°W)
      points: [
        { lat: -13.2500, lng: -72.2600 },
        { lat: -13.2000, lng: -72.2200 },
        { lat: -13.1500, lng: -72.1800 }
      ],
      color: '#34d399'
    }
  ];

  return (
    <div id="living-library-map-section" className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 space-y-6">
      {/* 1. Header, Live Search & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 shadow-xs">
              <Globe2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-stone-900 font-display">
                  🌍 The Living Library World Map
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                  LIVE ATLAS
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Real community libraries, riverboat fleets, mountain reading nests & native restoration groves across 16 countries.
              </p>
            </div>
          </div>
        </div>

        {/* Global Summary Badge Counters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span><strong>{projects.length}</strong> Sanctuaries</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 flex items-center space-x-1.5">
            <Ship className="w-3.5 h-3.5 text-sky-600" />
            <span><strong>3</strong> Active Mobile Routes</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 flex items-center space-x-1.5">
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            <span><strong>54,300+</strong> Trees Planted</span>
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar: Region Pills, Search, Filters, Layer Toggles */}
      <div className="space-y-3 pt-1">
        {/* Quick Region Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 font-bold text-[11px] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Focus Region:</span>
          </span>
          {REGION_PRESETS.map((preset) => {
            const isActive = activeRegion === preset.id;
            return (
              <button
                key={preset.id}
                id={`region-btn-${preset.id}`}
                onClick={() => handleSelectRegion(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 border ${
                  isActive
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-400/30'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                }`}
              >
                <span>{preset.flag}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search, Stage & Type Filters + Layer Toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pt-1 border-t border-stone-100">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country, community, language, or biome..."
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl pl-9 pr-8 py-1.5 text-xs font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Layers */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Stage Filter */}
            <div className="flex items-center space-x-1 bg-stone-50 border border-stone-200 px-2 py-1 rounded-xl text-xs">
              <span className="text-[11px] font-semibold text-stone-500">Stage:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-transparent text-stone-800 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Stages ({projects.length})</option>
                <option value="OPEN">Doors Open</option>
                <option value="FUNDRAISING">Active Campaign</option>
                <option value="BUILDING">Constructing</option>
                <option value="FUNDED">Escrow Funded</option>
                <option value="VERIFIED_NEED">Verified Need</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-1 bg-stone-50 border border-stone-200 px-2 py-1 rounded-xl text-xs">
              <span className="text-[11px] font-semibold text-stone-500">Type:</span>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="bg-transparent text-stone-800 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="LIBRARY_GARDEN">Library Garden</option>
                <option value="MOBILE_LIBRARY">Mobile Caravan / Riverboat</option>
                <option value="TREEHOUSE_LIBRARY">Highland Treehouse</option>
                <option value="COMMUNITY_LIBRARY">Community Library</option>
                <option value="CHILDREN_READING_HOUSE">Children Lodge</option>
                <option value="DIGITAL_NEST">Polar / Solar Nest</option>
              </select>
            </div>

            {/* Layer Toggles Group */}
            <div className="flex items-center space-x-1 bg-stone-100 p-0.5 rounded-xl text-xs border border-stone-200">
              <button
                onClick={() => setShowLibrariesLayer(prev => !prev)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all ${
                  showLibrariesLayer ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="Toggle Physical Library Sanctuaries"
              >
                <BookOpen className="w-3 h-3" />
                <span>Sanctuaries</span>
              </button>
              <button
                onClick={() => setShowCaravanLayer(prev => !prev)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all ${
                  showCaravanLayer ? 'bg-white text-sky-800 shadow-xs' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="Toggle Mobile Fleet & Caravan Routes"
              >
                <Ship className="w-3 h-3" />
                <span>Caravans</span>
              </button>
              <button
                onClick={() => setShowTreeGrovesLayer(prev => !prev)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all ${
                  showTreeGrovesLayer ? 'bg-white text-teal-800 shadow-xs' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="Toggle Native Tree Restoration Groves"
              >
                <Trees className="w-3 h-3" />
                <span>Tree Groves</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive World Map Stage (SVG Cartography) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#081214] via-[#0d221c] to-[#071310] border border-stone-800 h-[480px] shadow-2xl select-none group">
        
        {/* Floating Zoom & Map Nav Controls */}
        <div className="absolute top-4 right-4 z-30 flex flex-col items-center bg-stone-950/85 backdrop-blur-md rounded-2xl p-1 border border-stone-700/80 shadow-lg text-white space-y-1">
          <button
            id="map-zoom-in-btn"
            onClick={handleZoomIn}
            className="p-2 hover:bg-stone-800 rounded-xl transition-colors text-stone-200 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="map-zoom-out-btn"
            onClick={handleZoomOut}
            className="p-2 hover:bg-stone-800 rounded-xl transition-colors text-stone-200 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-full h-px bg-stone-800 my-0.5" />
          <button
            id="map-reset-view-btn"
            onClick={handleResetView}
            className="p-2 hover:bg-stone-800 rounded-xl transition-colors text-stone-200 hover:text-white"
            title="Reset to Full World View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Coordinates & Compass HUD (Top Left) */}
        <div className="absolute top-4 left-4 z-30 pointer-events-none flex items-center space-x-2 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-800 text-[11px] text-stone-300 font-mono shadow-sm">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {cursorCoords 
              ? `${Math.abs(cursorCoords.lat)}° ${cursorCoords.lat >= 0 ? 'N' : 'S'}, ${Math.abs(cursorCoords.lng)}° ${cursorCoords.lng >= 0 ? 'E' : 'W'}` 
              : 'Interactive Sovereign Atlas'}
          </span>
          <span className="text-stone-500 font-sans text-[10px] pl-1 border-l border-stone-800">
            Click & Drag to Pan • Scroll to Zoom
          </span>
        </div>

        {/* Master Interactive SVG Canvas */}
        <svg
          ref={mapSvgRef}
          viewBox={`${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            isDraggingRef.current = false;
            setCursorCoords(null);
          }}
          onWheel={handleWheel}
          className="w-full h-full cursor-grab active:cursor-grabbing transition-[viewBox] duration-300 ease-out"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Interactive Living Forests World Map"
        >
          <defs>
            {/* Ocean radial gradient background */}
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#0e2a22" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#081816" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#050d0c" stopOpacity="1" />
            </radialGradient>

            {/* Continent land gradient */}
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18362d" />
              <stop offset="50%" stopColor="#132c25" />
              <stop offset="100%" stopColor="#0e231c" />
            </linearGradient>

            {/* Continent border stroke gradient */}
            <linearGradient id="landBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
            </linearGradient>

            {/* Pin beacon glow filter */}
            <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
            </filter>
          </defs>

          {/* Deep Ocean Background Layer */}
          <rect x="0" y="0" width="1000" height="500" fill="url(#oceanGlow)" />

          {/* Latitude & Longitude Graticule Grid Lines */}
          {showGraticules && (
            <g className="opacity-20 pointer-events-none" stroke="#2dd4bf" strokeWidth="0.5">
              {/* Latitude Lines */}
              <line x1="0" y1="69.4" x2="1000" y2="69.4" strokeDasharray="3 3" /> {/* 65°N Arctic */}
              <line x1="0" y1="184.7" x2="1000" y2="184.7" strokeDasharray="4 2" stroke="#34d399" strokeWidth="0.8" /> {/* 23.5°N Tropic of Cancer */}
              <line x1="0" y1="250" x2="1000" y2="250" stroke="#10b981" strokeWidth="1.2" strokeDasharray="6 3" /> {/* 0° Equator */}
              <line x1="0" y1="315.3" x2="1000" y2="315.3" strokeDasharray="4 2" stroke="#34d399" strokeWidth="0.8" /> {/* 23.5°S Tropic of Capricorn */}
              <line x1="0" y1="430.6" x2="1000" y2="430.6" strokeDasharray="3 3" /> {/* 65°S Antarctic */}

              {/* Longitude Lines at 60° intervals */}
              <line x1="166.7" y1="0" x2="166.7" y2="500" strokeDasharray="2 4" /> {/* 120°W */}
              <line x1="333.3" y1="0" x2="333.3" y2="500" strokeDasharray="2 4" /> {/* 60°W */}
              <line x1="500" y1="0" x2="500" y2="500" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" /> {/* 0° Prime Meridian */}
              <line x1="666.7" y1="0" x2="666.7" y2="500" strokeDasharray="2 4" /> {/* 60°E */}
              <line x1="833.3" y1="0" x2="833.3" y2="500" strokeDasharray="2 4" /> {/* 120°E */}
            </g>
          )}

          {/* Graticule Labels */}
          {showGraticules && (
            <g className="fill-emerald-400/40 text-[7px] font-mono select-none pointer-events-none">
              <text x="6" y="247">EQUATOR 0°</text>
              <text x="6" y="181">TROPIC OF CANCER 23.5°N</text>
              <text x="6" y="312">TROPIC OF CAPRICORN 23.5°S</text>
              <text x="502" y="15">PRIME MERIDIAN 0°</text>
            </g>
          )}

          {/* =========================================================================
              HIGH-PRECISION EQUIRECTANGULAR CONTINENTS & MAJOR ISLANDS
              Cartographically aligned to X: [-180..180]->[0..1000], Y: [90..-90]->[0..500]
             ========================================================================= */}
          <g id="world-continents-layer" fill="url(#landGradient)" stroke="url(#landBorder)" strokeWidth="0.8">
            
            {/* 1. NORTH AMERICA (Alaska, Canada, Continental US, Mexico, Central America) */}
            <path
              id="continent-north-america"
              d="M 36 70 
                 C 55 58, 85 52, 115 52 
                 C 145 52, 175 42, 210 45 
                 C 235 48, 255 60, 275 68 
                 L 282 62 C 295 58, 310 65, 315 78 
                 C 320 90, 305 105, 320 115 
                 C 335 125, 350 128, 342 138 
                 C 330 148, 310 135, 305 142 
                 C 295 150, 292 165, 278 180 
                 C 272 188, 278 198, 272 202 
                 C 265 200, 252 190, 245 195 
                 C 238 200, 235 210, 248 218 
                 C 255 224, 272 232, 282 238 
                 C 285 242, 282 245, 275 242 
                 C 260 236, 242 225, 230 215 
                 C 215 202, 195 190, 185 175 
                 L 192 195 C 190 202, 182 195, 178 175 
                 C 172 160, 160 145, 150 130 
                 C 142 118, 132 108, 118 95 
                 C 95 85, 75 92, 55 95 
                 C 35 98, 20 95, 28 82 Z"
            />

            {/* 2. GREENLAND */}
            <path
              id="landmass-greenland"
              d="M 345 35 
                 C 370 25, 410 20, 435 38 
                 C 450 50, 440 70, 420 85 
                 C 395 95, 375 90, 360 70 
                 C 345 55, 335 45, 345 35 Z"
            />

            {/* 3. SOUTH AMERICA (Andes, Amazon, Brazil Bulge, Patagonia, Tierra del Fuego) */}
            <path
              id="continent-south-america"
              d="M 282 240 
                 C 300 230, 325 228, 345 235 
                 C 365 242, 385 255, 405 275 
                 C 412 285, 400 305, 395 320 
                 C 388 335, 375 350, 360 365 
                 C 345 380, 330 395, 320 415 
                 C 315 425, 310 435, 305 435 
                 C 298 435, 295 425, 298 405 
                 C 302 385, 300 365, 300 345 
                 C 298 320, 288 295, 280 275 
                 C 272 260, 275 248, 282 240 Z"
            />

            {/* 4. EUROPE (British Isles, Scandinavia, Western Europe, Mediterranean, Balkans) */}
            <path
              id="continent-europe"
              d="M 470 148 
                 C 468 135, 480 125, 495 125 
                 C 505 115, 515 110, 525 95 
                 C 535 80, 550 65, 565 52 
                 C 575 52, 575 75, 555 90 
                 C 545 100, 535 108, 545 120 
                 C 555 130, 570 135, 580 145 
                 C 575 158, 560 168, 548 165 
                 C 540 160, 532 145, 522 140 
                 C 515 145, 512 155, 498 155 
                 C 485 155, 475 155, 470 148 Z"
            />

            {/* British Isles */}
            <path
              id="landmass-britain"
              d="M 488 88 C 498 85, 504 95, 502 110 C 495 115, 485 110, 488 88 Z"
            />
            <path
              id="landmass-ireland"
              d="M 472 102 C 480 98, 482 106, 478 112 C 472 112, 468 106, 472 102 Z"
            />

            {/* 5. AFRICA (Sahara, West Africa, Nile, Congo, Turkana Basin, Cape, Madagascar) */}
            <path
              id="continent-africa"
              d="M 482 160 
                 C 510 155, 540 160, 575 168 
                 C 595 172, 605 185, 615 205 
                 C 625 218, 642 225, 638 235 
                 C 628 248, 615 260, 610 280 
                 C 605 305, 595 330, 582 355 
                 C 570 370, 550 372, 540 365 
                 C 532 345, 535 320, 528 290 
                 C 522 265, 520 250, 505 240 
                 C 485 240, 465 240, 452 222 
                 C 445 205, 452 185, 468 175 
                 C 475 170, 478 165, 482 160 Z"
            />

            {/* Madagascar */}
            <path
              id="landmass-madagascar"
              d="M 622 288 C 632 292, 638 305, 632 328 C 625 330, 618 315, 622 288 Z"
            />

            {/* 6. ASIA (Arabia, India, Indochina/Mekong, China, Siberia, Kamchatka, Japan) */}
            <path
              id="continent-asia"
              d="M 585 155 
                 C 605 145, 630 135, 660 130 
                 C 700 115, 750 95, 800 80 
                 C 850 70, 910 65, 960 60 
                 C 980 55, 985 75, 955 85 
                 C 920 95, 890 110, 875 125 
                 C 860 140, 845 155, 835 168 
                 C 825 182, 810 190, 802 215 
                 C 795 228, 785 245, 782 260 
                 C 778 250, 772 235, 765 220 
                 C 755 200, 742 195, 735 210 
                 C 725 230, 715 242, 705 235 
                 C 695 215, 688 195, 675 185 
                 C 660 180, 642 188, 630 205 
                 C 620 220, 608 215, 600 195 
                 C 595 180, 582 170, 585 155 Z"
            />

            {/* Japan Archipelago */}
            <path
              id="landmass-japan"
              d="M 870 145 C 880 135, 892 125, 895 115 C 890 128, 882 142, 870 145 Z"
            />

            {/* Southeast Asian Archipelago (Sumatra, Java, Borneo, Philippines) */}
            <path
              id="landmass-indonesia-borneo"
              d="M 778 252 C 790 262, 795 272, 785 278 C 775 270, 772 258, 778 252 Z
                 M 812 245 C 830 240, 835 255, 825 268 C 815 265, 810 252, 812 245 Z
                 M 802 278 C 825 278, 832 280, 825 285 C 810 285, 802 282, 802 278 Z"
            />
            <path
              id="landmass-philippines"
              d="M 840 215 C 848 210, 852 225, 846 238 C 840 235, 838 222, 840 215 Z"
            />

            {/* 7. AUSTRALIA & OCEANIA */}
            <path
              id="continent-australia"
              d="M 825 315 
                 C 850 295, 880 290, 895 285 
                 C 915 305, 928 335, 925 365 
                 C 915 375, 895 372, 875 368 
                 C 845 365, 825 355, 818 335 
                 C 815 325, 820 318, 825 315 Z"
            />

            {/* Tasmania */}
            <path
              id="landmass-tasmania"
              d="M 910 390 C 918 390, 918 402, 912 405 C 908 402, 906 395, 910 390 Z"
            />

            {/* New Guinea */}
            <path
              id="landmass-new-guinea"
              d="M 875 260 C 905 262, 920 270, 910 278 C 890 278, 880 270, 875 260 Z"
            />

            {/* New Zealand */}
            <path
              id="landmass-new-zealand"
              d="M 975 365 C 985 360, 990 375, 982 385 Z
                 M 968 388 C 976 385, 978 405, 968 412 Z"
            />

            {/* 8. ANTARCTICA ICE SHELF (Southern Baseline) */}
            <path
              id="continent-antarctica"
              d="M 20 495 
                 C 150 480, 260 465, 290 445 
                 C 305 450, 330 465, 450 470 
                 C 600 475, 750 470, 900 475 
                 C 950 480, 980 490, 990 498 
                 L 10 498 Z"
              fill="#102520"
              stroke="#2dd4bf"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />
          </g>

          {/* =========================================================================
              LAYER 1: TREE GROVES & NATIVE RESTORATION HEAT RINGS
             ========================================================================= */}
          {showTreeGrovesLayer && (
            <g id="tree-groves-layer" className="transition-opacity duration-300">
              {filteredProjects.map((proj) => {
                const { x, y } = projectToSvg(
                  proj.geographicEntity.coordinates.lat,
                  proj.geographicEntity.coordinates.lng
                );
                const planted = proj.ecologicalComponent?.plantedCount || 800;
                // Radius scales smoothly with trees count
                const ringRadius = Math.max(8, Math.min(24, Math.sqrt(planted) * 0.35));

                return (
                  <g key={`grove-${proj.id}`} className="pointer-events-none">
                    {/* Glowing outer canopy aura */}
                    <circle
                      cx={x}
                      cy={y}
                      r={ringRadius * 1.5}
                      fill="#10b981"
                      fillOpacity="0.12"
                      stroke="#10b981"
                      strokeOpacity="0.3"
                      strokeWidth="0.6"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={ringRadius}
                      fill="#059669"
                      fillOpacity="0.18"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* =========================================================================
              LAYER 2: MOBILE CARAVAN & RIVERBOAT ROUTES (Curved SVG Tracks)
             ========================================================================= */}
          {showCaravanLayer && (
            <g id="caravan-routes-layer">
              {caravanRoutesPaths.map((route) => {
                const pathCoords = route.points.map(pt => projectToSvg(pt.lat, pt.lng));
                if (pathCoords.length < 2) return null;
                
                // Construct smooth SVG path string
                const d = pathCoords.reduce((acc, curr, idx) => {
                  return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
                }, '');

                const midPoint = pathCoords[Math.floor(pathCoords.length / 2)];

                return (
                  <g key={route.id} className="cursor-pointer group/route">
                    {/* Shadow track */}
                    <path
                      d={d}
                      fill="none"
                      stroke="#020617"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Pulsing colored track */}
                    <path
                      d={d}
                      fill="none"
                      stroke={route.color}
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    {/* Animated moving vessel marker on midpoint */}
                    <circle
                      cx={midPoint.x}
                      cy={midPoint.y}
                      r="4"
                      fill={route.color}
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <title>{route.name}</title>
                  </g>
                );
              })}
            </g>
          )}

          {/* =========================================================================
              LAYER 3: LIBRARY SANCTUARY PINS & ACTIVE HOTSPOTS
             ========================================================================= */}
          {showLibrariesLayer && (
            <g id="sanctuary-pins-layer">
              {filteredProjects.map((project) => {
                const { x, y } = projectToSvg(
                  project.geographicEntity.coordinates.lat,
                  project.geographicEntity.coordinates.lng
                );
                const isSelected = activeProject?.id === project.id;
                const isHovered = hoveredProject?.id === project.id;
                const statusStyle = STATUS_CONFIG[project.status] || STATUS_CONFIG.OPEN;

                return (
                  <g
                    key={project.id}
                    id={`svg-pin-${project.id}`}
                    transform={`translate(${x}, ${y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProject(project);
                    }}
                    onMouseEnter={() => setHoveredProject(project)}
                    onMouseLeave={() => setHoveredProject(null)}
                    className="cursor-pointer transition-transform duration-200"
                  >
                    {/* Ping Wave Ring for Selected or Open Projects */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="14"
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="1.5"
                        className="animate-ping opacity-60"
                      />
                    )}

                    {/* Outer glow circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 10 : 7}
                      fill={statusStyle.hex}
                      fillOpacity={isSelected ? 0.4 : 0.25}
                    />

                    {/* Inner core circle pin */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 6 : 4.5}
                      fill={isSelected ? '#ffffff' : statusStyle.hex}
                      stroke={isSelected ? statusStyle.hex : '#ffffff'}
                      strokeWidth={isSelected ? 2 : 1.2}
                      className="shadow-md"
                    />

                    {/* Icon glyph inside pin if selected or large */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="2.5"
                        fill={statusStyle.hex}
                      />
                    )}

                    {/* Persistent Text Badge for Active Projects */}
                    <g transform="translate(0, -9)">
                      <rect
                        x="-30"
                        y="-12"
                        width="60"
                        height="13"
                        rx="4"
                        fill="#0b1617"
                        fillOpacity="0.9"
                        stroke={isSelected ? '#34d399' : '#1e3a34'}
                        strokeWidth="0.8"
                      />
                      <text
                        x="0"
                        y="-3"
                        textAnchor="middle"
                        fill={isSelected ? '#34d399' : '#e2e8f0'}
                        fontSize="6.5"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                      >
                        {project.communityName.length > 13 
                          ? project.communityName.substring(0, 11) + '..' 
                          : project.communityName}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay (Appears over map when user hovers a pin) */}
        {hoveredProject && (
          <div 
            className="absolute top-16 left-4 z-40 bg-stone-950/90 backdrop-blur-md border border-stone-700 rounded-2xl p-3 shadow-2xl text-white text-xs max-w-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_CONFIG[hoveredProject.status]?.bg} ${STATUS_CONFIG[hoveredProject.status]?.color} border ${STATUS_CONFIG[hoveredProject.status]?.border}`}>
                {STATUS_CONFIG[hoveredProject.status]?.label}
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                {hoveredProject.countryName}
              </span>
            </div>
            <h4 className="font-black text-white text-sm">
              {hoveredProject.name}
            </h4>
            <p className="text-[11px] text-stone-300 line-clamp-2">
              {hoveredProject.tagline}
            </p>
            <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-stone-800 text-[10px]">
              <div>
                <span className="text-stone-400">Learners:</span>{' '}
                <strong className="text-emerald-400 font-bold">{hoveredProject.peopleServedCount.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-stone-400">Trees:</span>{' '}
                <strong className="text-teal-400 font-bold">{hoveredProject.ecologicalComponent?.plantedCount || 0}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-stone-950/85 backdrop-blur-md rounded-2xl p-2.5 border border-stone-800 text-stone-300 text-[11px] flex flex-wrap items-center justify-between gap-2 z-20">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">Stage Colors:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {Object.entries(STATUS_CONFIG).slice(0, 5).map(([statusKey, cfg]) => (
                <span key={statusKey} className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                  {cfg.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[10px] text-stone-400">
            <div className="flex items-center space-x-1 text-sky-400">
              <span className="w-2.5 h-0.5 bg-sky-400 inline-block"></span>
              <span>Mobile Caravan Track</span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full border border-emerald-400 inline-block"></span>
              <span>Living Tree Grove</span>
            </div>
            <div className="flex items-center space-x-1 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sovereign Coordinates</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Selected Project Inspection Drawer */}
      {activeProject && (
        <div className="rounded-3xl bg-stone-50 border border-stone-200 p-5 space-y-4 animate-in fade-in duration-300 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${STATUS_CONFIG[activeProject.status]?.bg} ${STATUS_CONFIG[activeProject.status]?.color} border ${STATUS_CONFIG[activeProject.status]?.border}`}>
                  {STATUS_CONFIG[activeProject.status]?.label}
                </span>
                <span className="text-xs font-semibold text-stone-600">
                  {activeProject.countryName} • {activeProject.geographicEntity.regionName}
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  {activeProject.verificationLevel.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-mono text-stone-400">
                  [{activeProject.geographicEntity.coordinates.lat.toFixed(2)}°, {activeProject.geographicEntity.coordinates.lng.toFixed(2)}°]
                </span>
              </div>
              <h3 className="text-lg font-black text-stone-900 font-display">
                {activeProject.name}
              </h3>
              <p className="text-xs text-stone-600 max-w-3xl">
                {activeProject.tagline}
              </p>
            </div>

            {/* Quick Actions for Selected Project */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                id={`btn-focus-map-${activeProject.id}`}
                onClick={() => handleFocusProject(activeProject)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs border border-stone-300 shadow-xs flex items-center space-x-1.5 transition-colors"
                title="Center camera on this project"
              >
                <Maximize2 className="w-3.5 h-3.5 text-stone-500" />
                <span>Focus Map</span>
              </button>

              <button
                id={`btn-plant-for-${activeProject.id}`}
                onClick={() => onPlantForProject(activeProject)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-transform active:scale-95"
              >
                <span>🌱</span>
                <span>Plant for this Project</span>
              </button>

              <button
                id={`btn-tree-for-${activeProject.id}`}
                onClick={() => onGiveTreeForProject(activeProject)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-300 shadow-xs flex items-center space-x-1.5 transition-colors"
              >
                <span>🌳</span>
                <span>Give a Tree</span>
              </button>

              <button
                id={`btn-view-dossier-${activeProject.id}`}
                onClick={() => onSelectProject(activeProject)}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-1 shadow-sm transition-colors"
              >
                <span>Full Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Detailed Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-200/80 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-stone-200">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Community Custodian</span>
              <strong className="text-stone-900 font-semibold truncate block mt-0.5">
                {activeProject.localPartner.name}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-stone-200">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">People Served</span>
              <strong className="text-stone-900 font-semibold block mt-0.5">
                {activeProject.peopleServedCount.toLocaleString()} learners
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-stone-200">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Collection & Demand</span>
              <strong className="text-stone-900 font-semibold block mt-0.5">
                {activeProject.booksInCollectionCount} cataloged • {activeProject.booksNeededCount} requested
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-stone-200">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Native Landscape</span>
              <strong className="text-stone-900 font-semibold block mt-0.5">
                {activeProject.ecologicalComponent?.plantedCount || 0} planted ({activeProject.ecologicalComponent?.survivalRatePct || 100}% survival)
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
