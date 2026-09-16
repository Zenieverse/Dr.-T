// =========================================================================
// DR. T CINEMA — STORYBOARD DIRECTOR COMPONENT
// Visual shot-by-shot decomposition with camera, lens, and lighting styling
// =========================================================================

import React, { useState } from 'react';
import { Shot, Scene, VisualStyleKey } from '../types';
import { VISUAL_STYLE_REGISTRY } from '../data/productionTemplates';
import { 
  Film, 
  Camera, 
  Sun, 
  Eye, 
  Sparkles, 
  Clock, 
  Layers, 
  Palette, 
  SlidersHorizontal 
} from 'lucide-react';

interface StoryboardProps {
  shots: Shot[];
  scenes: Scene[];
  visualStyle: VisualStyleKey;
  onInspectClaim: (claimId: string) => void;
}

export const Storyboard: React.FC<StoryboardProps> = ({
  shots,
  scenes,
  visualStyle,
  onInspectClaim
}) => {
  const [selectedSceneFilter, setSelectedSceneFilter] = useState<string>('ALL');
  const styleConfig = VISUAL_STYLE_REGISTRY[visualStyle] || VISUAL_STYLE_REGISTRY.Humanist;

  const filteredShots = selectedSceneFilter === 'ALL' 
    ? shots 
    : shots.filter(s => s.sceneId === selectedSceneFilter);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Director Storyboard</h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {shots.length} Shots
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styleConfig.badgeColor}`}>
              {styleConfig.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Every shot engineered with camera movement, lens character, and chromatic atmosphere.
          </p>
        </div>

        {/* Scene Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full text-xs">
          <button
            onClick={() => setSelectedSceneFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              selectedSceneFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Shots ({shots.length})
          </button>
          {scenes.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSceneFilter(s.id)}
              className={`px-2.5 py-1 rounded-lg font-mono transition-colors shrink-0 ${
                selectedSceneFilter === s.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s.id}
            </button>
          ))}
        </div>
      </div>

      {/* Shots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredShots.map((shot) => {
          const parentScene = scenes.find(s => s.id === shot.sceneId);

          return (
            <div 
              key={shot.shotId}
              className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all shadow-md overflow-hidden flex flex-col"
            >
              {/* Card Canvas Header / Mock Thumbnail Canvas */}
              <div className="relative aspect-video w-full bg-slate-950 flex flex-col justify-between p-3.5 border-b border-slate-800/80 overflow-hidden">
                {/* Visual Style Ambient Tint */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${styleConfig.colorPalette[1]}, transparent 70%)`
                  }}
                />

                {/* Top Badge Overlay */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-900/90 text-amber-400 border border-slate-700 backdrop-blur-sm">
                      {shot.shotId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-300 bg-slate-900/90 border border-slate-700 backdrop-blur-sm">
                      {shot.sceneId}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-900/90 text-white border border-slate-700 backdrop-blur-sm flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {shot.durationSeconds}s
                    </span>
                  </div>
                </div>

                {/* Center Visual Mock Prompt */}
                <div className="relative z-10 my-auto text-center px-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
                    {shot.shotType.toUpperCase()}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 italic font-serif">
                    "{shot.thumbnailPrompt}"
                  </p>
                </div>

                {/* Bottom Overlay Info */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[180px]">{shot.environment}</span>
                  {shot.claimId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectClaim(shot.claimId!);
                      }}
                      className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 border border-amber-500/30 flex items-center gap-1 transition-colors"
                      title="Inspect Linked Evidence"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      [{shot.claimId}]
                    </button>
                  )}
                </div>
              </div>

              {/* Technical Specifications Breakdown */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs bg-slate-900/80">
                <div className="space-y-2">
                  {/* Camera & Lens */}
                  <div className="flex items-start gap-2 text-slate-300">
                    <Camera className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Camera:</span> {shot.cameraMovement}
                      <div className="text-slate-400 text-[11px]">{shot.lensStyle}</div>
                    </div>
                  </div>

                  {/* Lighting & Atmosphere */}
                  <div className="flex items-start gap-2 text-slate-300">
                    <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Lighting:</span> {shot.lighting}
                      <div className="text-slate-400 text-[11px]">Palette: {shot.colorMood}</div>
                    </div>
                  </div>

                  {/* Composition */}
                  <div className="flex items-start gap-2 text-slate-300">
                    <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Composition:</span> {shot.composition}
                    </div>
                  </div>
                </div>

                {/* Transition & Action Footer */}
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="truncate">Transition: {shot.transition}</span>
                  <span className="text-slate-500 font-mono">Scene #{parentScene?.sceneNumber || 1}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
