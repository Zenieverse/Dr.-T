// =========================================================================
// LIVING LIBRARY MAP: INTERACTIVE GLOBAL GEOSPATIAL EXPLORER
// Displays community libraries, mobile fleets, and tree restoration projects
// Status colors represent project development stages, NOT wealth or GDP.
// =========================================================================

import React, { useState, useMemo } from 'react';
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
  Navigation
} from 'lucide-react';
import { LibraryProject, ProjectStatus, ProjectType } from '../types';

interface LivingLibraryMapProps {
  projects: LibraryProject[];
  onSelectProject: (project: LibraryProject) => void;
  onPlantForProject: (project: LibraryProject) => void;
  onGiveTreeForProject: (project: LibraryProject) => void;
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string; border: string }> = {
  IDEA: { label: 'Idea Proposal', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40' },
  VERIFIED_NEED: { label: 'Verified Need', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40' },
  FUNDRAISING: { label: 'Active Campaign', color: 'text-sky-400', bg: 'bg-sky-500/20', border: 'border-sky-500/40' },
  FUNDED: { label: 'Escrow Funded', color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/40' },
  BUILDING: { label: 'Constructing', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40' },
  OPEN: { label: 'Doors Open', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' },
  GROWING: { label: 'Growing Community', color: 'text-teal-400', bg: 'bg-teal-500/20', border: 'border-teal-500/40' },
  SELF_SUSTAINING: { label: 'Self-Sustaining Root', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/40' },
};

export const LivingLibraryMap: React.FC<LivingLibraryMapProps> = ({
  projects,
  onSelectProject,
  onPlantForProject,
  onGiveTreeForProject,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [activeProject, setActiveProject] = useState<LibraryProject | null>(projects[0] || null);
  const [zoomRegion, setZoomRegion] = useState<'WORLD' | 'SE_ASIA' | 'EAST_AFRICA' | 'ANDES' | 'PACIFIC' | 'NORTH_AFRICA' | 'ARCTIC'>('WORLD');

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchStatus = selectedStatusFilter === 'ALL' || p.status === selectedStatusFilter;
      const matchType = selectedTypeFilter === 'ALL' || p.projectType === selectedTypeFilter;
      return matchStatus && matchType;
    });
  }, [projects, selectedStatusFilter, selectedTypeFilter]);

  // Convert lat/lng to SVG percentage coordinates (Equirectangular projection)
  const projectToCoords = (lat: number, lng: number) => {
    // Basic Equirectangular map projection bounds
    // X: lng from -180 to 180 => 0% to 100%
    // Y: lat from 85 to -60 => 0% to 100%
    const x = ((lng + 180) / 360) * 100;
    const y = ((85 - lat) / 145) * 100;
    return {
      x: Math.max(4, Math.min(96, x)),
      y: Math.max(6, Math.min(94, y)),
    };
  };

  return (
    <div id="living-library-map-section" className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Globe2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-stone-900 font-display">
                🌍 The Living Library World Map
              </h2>
              <p className="text-xs text-stone-500">
                Explore real community libraries, riverboat fleets, mountain reading nests & native restoration groves.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-stone-100 p-1 rounded-xl text-xs">
            <span className="text-[11px] font-semibold text-stone-500 px-2">Stage:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-white border border-stone-200 text-stone-800 rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Stages ({projects.length})</option>
              <option value="OPEN">Doors Open</option>
              <option value="FUNDRAISING">Active Fundraising</option>
              <option value="BUILDING">Constructing</option>
              <option value="FUNDED">Escrow Funded</option>
              <option value="VERIFIED_NEED">Verified Need</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-1.5 bg-stone-100 p-1 rounded-xl text-xs">
            <span className="text-[11px] font-semibold text-stone-500 px-2">Type:</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="bg-white border border-stone-200 text-stone-800 rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Project Types</option>
              <option value="LIBRARY_GARDEN">Library Garden</option>
              <option value="MOBILE_LIBRARY">Mobile Caravan / Riverboat</option>
              <option value="TREEHOUSE_LIBRARY">Highland Treehouse</option>
              <option value="COMMUNITY_LIBRARY">Community Library</option>
              <option value="CHILDREN_READING_HOUSE">Children Reading Lodge</option>
              <option value="DIGITAL_NEST">Polar / Solar Digital Nest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950 border border-stone-800 h-[420px] shadow-inner flex items-center justify-center">
        {/* Subtle Map Grid lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Global Continent Outlines (Stylized Vector Shapes for Visual Cartography) */}
        <svg 
          viewBox="0 0 1000 500" 
          className="w-full h-full object-cover opacity-25 pointer-events-none"
          aria-hidden="true"
        >
          {/* North America */}
          <path d="M 120 70 Q 240 60 280 140 T 200 240 T 150 280 Q 90 200 120 70 Z" fill="#10b981" />
          {/* South America */}
          <path d="M 260 270 Q 340 290 320 400 T 250 480 Q 220 380 260 270 Z" fill="#10b981" />
          {/* Europe & Africa */}
          <path d="M 450 80 Q 560 70 540 160 T 480 210 Q 420 150 450 80 Z" fill="#10b981" />
          <path d="M 460 210 Q 580 230 570 380 T 480 430 Q 430 330 460 210 Z" fill="#10b981" />
          {/* Asia */}
          <path d="M 580 70 Q 820 60 840 220 T 670 320 Q 590 220 580 70 Z" fill="#10b981" />
          {/* Oceania & Australia */}
          <path d="M 760 330 Q 880 340 850 430 T 750 420 Q 730 370 760 330 Z" fill="#10b981" />
        </svg>

        {/* Project Markers */}
        <div className="absolute inset-0">
          {filteredProjects.map((project) => {
            const { x, y } = projectToCoords(
              project.geographicEntity.coordinates.lat, 
              project.geographicEntity.coordinates.lng
            );
            const isSelected = activeProject?.id === project.id;
            const statusStyle = STATUS_CONFIG[project.status] || STATUS_CONFIG.OPEN;

            return (
              <button
                key={project.id}
                id={`map-pin-${project.id}`}
                onClick={() => setActiveProject(project)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none z-20 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
                title={`${project.name} (${project.countryName})`}
              >
                {/* Ping ring for active open / fundraising projects */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-emerald-400/40 animate-ping" />
                )}

                {/* Pin Head */}
                <div className={`p-2 rounded-2xl shadow-xl flex items-center justify-center border-2 transition-transform ${
                  isSelected 
                    ? 'bg-emerald-400 text-stone-950 border-white shadow-emerald-400/50' 
                    : `${statusStyle.bg} text-white ${statusStyle.border}`
                }`}>
                  {project.projectType === 'MOBILE_LIBRARY' ? (
                    <Navigation className="w-3.5 h-3.5" />
                  ) : project.projectType === 'LIBRARY_GARDEN' ? (
                    <Trees className="w-3.5 h-3.5" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Floating Tag */}
                <div className={`absolute left-1/2 -translate-x-1/2 -bottom-6 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap pointer-events-none transition-all ${
                  isSelected 
                    ? 'bg-white text-stone-900 shadow-md ring-1 ring-emerald-500 opacity-100' 
                    : 'bg-stone-900/90 text-stone-200 opacity-0 group-hover:opacity-100 border border-stone-700'
                }`}>
                  {project.communityName}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-stone-950/85 backdrop-blur-md rounded-2xl p-2.5 border border-stone-800 text-stone-300 text-[11px] flex flex-wrap items-center justify-between gap-2 z-20">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">Project Stage Legend:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {Object.entries(STATUS_CONFIG).slice(0, 5).map(([statusKey, cfg]) => (
                <span key={statusKey} className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                  {cfg.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1 text-[10px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Approximate coordinates protect sensitive community sites</span>
          </div>
        </div>
      </div>

      {/* Selected Project Interactive Drawer */}
      {activeProject && (
        <div className="rounded-2xl bg-stone-50 border border-stone-200 p-5 space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${STATUS_CONFIG[activeProject.status]?.bg} ${STATUS_CONFIG[activeProject.status]?.color} border ${STATUS_CONFIG[activeProject.status]?.border}`}>
                  {STATUS_CONFIG[activeProject.status]?.label}
                </span>
                <span className="text-xs font-medium text-stone-500">
                  {activeProject.countryName} • {activeProject.geographicEntity.regionName}
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  {activeProject.verificationLevel.replace(/_/g, ' ')}
                </span>
              </div>
              <h3 className="text-lg font-black text-stone-900 font-display">
                {activeProject.name}
              </h3>
              <p className="text-xs text-stone-600 max-w-3xl">
                {activeProject.tagline}
              </p>
            </div>

            {/* Actions for this specific project */}
            <div className="flex items-center gap-2 shrink-0">
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
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-emerald-800 font-bold text-xs border border-emerald-300 shadow-xs flex items-center space-x-1.5"
              >
                <span>🌳</span>
                <span>Give a Tree</span>
              </button>

              <button
                id={`btn-view-dossier-${activeProject.id}`}
                onClick={() => onSelectProject(activeProject)}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-1 shadow-sm"
              >
                <span>Full Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-200/80 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-stone-200">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Community Partner</span>
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
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Collection & Needs</span>
              <strong className="text-stone-900 font-semibold block mt-0.5">
                {activeProject.booksInCollectionCount} books / {activeProject.booksNeededCount} needed
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
