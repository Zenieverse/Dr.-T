// =========================================================================
// DR. T CINEMA — STUDIO COMMAND CENTER OVERVIEW
// High-level production state, pipeline stages, story beat strip, and key metrics
// =========================================================================

import React from 'react';
import { CinemaProject, CinemaViewTab, StoryBeat } from '../types';
import { VISUAL_STYLE_REGISTRY } from '../data/productionTemplates';
import { 
  Clapperboard, 
  Sparkles, 
  Play, 
  BookOpen, 
  Film, 
  Calendar, 
  ShieldCheck, 
  Download, 
  ArrowRight, 
  Clock, 
  Database, 
  Layers, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface CinemaDashboardProps {
  project: CinemaProject;
  onNavigateTab: (tab: CinemaViewTab) => void;
  onLaunchDirectorDemo: () => void;
  onInspectClaim: (claimId: string) => void;
}

export const CinemaDashboard: React.FC<CinemaDashboardProps> = ({
  project,
  onNavigateTab,
  onLaunchDirectorDemo,
  onInspectClaim
}) => {
  const visualConfig = VISUAL_STYLE_REGISTRY[project.visualStyle] || VISUAL_STYLE_REGISTRY.Humanist;

  const pipelineStages: Array<{ name: string; tab: CinemaViewTab; complete: boolean }> = [
    { name: '1. INTENT', tab: 'brief', complete: true },
    { name: '2. RESEARCH', tab: 'evidence', complete: true },
    { name: '3. STORY', tab: 'script', complete: true },
    { name: '4. SCRIPT', tab: 'script', complete: true },
    { name: '5. STORYBOARD', tab: 'storyboard', complete: true },
    { name: '6. PRODUCTION', tab: 'production', complete: true },
    { name: '7. QA AUDIT', tab: 'qa', complete: true },
    { name: '8. EXPORT', tab: 'export', complete: true },
  ];

  return (
    <div className="space-y-6 text-slate-200">
      {/* Studio Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-xl">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ACTIVE PRODUCTION
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-300 bg-slate-800 border border-slate-700">
                {project.format}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${visualConfig.badgeColor}`}>
                {visualConfig.name} Style
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> QA {project.qualityReport.overallScore}/100
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {project.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-serif italic">
              "{project.logline}"
            </p>

            <div className="text-xs text-slate-400 flex items-center gap-2 pt-1 font-mono">
              <span className="text-amber-400 font-semibold">Provenance Grounding:</span>
              <span>Indexed via Parallel Search • Orchestrated by Google Gemini 3.8</span>
            </div>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={onLaunchDirectorDemo}
              className="py-3 px-5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              Director's 90-Second Walkthrough
            </button>

            <button
              onClick={() => onNavigateTab('script')}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Clapperboard className="w-4 h-4 text-amber-400" />
              Review Master Screenplay
            </button>
          </div>
        </div>

        {/* Pipeline State Machine Indicator */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3 font-semibold">
            Autonomous Production Pipeline Progress
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {pipelineStages.map((st, i) => (
              <button
                key={st.name}
                onClick={() => onNavigateTab(st.tab)}
                className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-400 group-hover:text-amber-400 transition-colors">
                    {st.name.split('.')[0]}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-[11px] font-bold text-white truncate">
                  {st.name.split('. ')[1]}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Evidence Claims */}
        <div 
          onClick={() => onNavigateTab('evidence')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-mono uppercase">Verified Claims</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {project.claims.filter(c => c.status === 'VERIFIED').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">100% Verified</span>
            <span>via Parallel Search</span>
          </div>
        </div>

        {/* Stat 2: Screenplay Scenes */}
        <div 
          onClick={() => onNavigateTab('script')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-mono uppercase">Screenplay</span>
            <Clapperboard className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {project.scenes.length} Scenes
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {project.durationSeconds}s master duration
          </div>
        </div>

        {/* Stat 3: Storyboard Shots */}
        <div 
          onClick={() => onNavigateTab('storyboard')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-mono uppercase">Storyboard</span>
            <Film className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {project.shots.length} Shots
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Lens & lighting calibrated
          </div>
        </div>

        {/* Stat 4: Production Schedule */}
        <div 
          onClick={() => onNavigateTab('production')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-mono uppercase">Production Days</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            2 Days
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {project.schedule.length} shooting blocks planned
          </div>
        </div>
      </div>

      {/* 8-Beat Narrative Architecture Strip */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              8-Beat Narrative Story Architecture
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Emotional Pacing Engine
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {(project.beats || project.storyBeats || []).map((beat, idx) => (
            <div 
              key={beat.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2 text-xs hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">
                  BEAT 0{idx + 1} • {beat.type}
                </div>
                <div className="font-semibold text-slate-100 text-xs line-clamp-2">
                  {beat.title}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>{beat.estimatedSeconds}s</span>
                <span className="text-slate-400 truncate max-w-[60px]">{beat.emotionalTone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
