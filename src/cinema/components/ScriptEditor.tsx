// =========================================================================
// DR. T CINEMA — SCREENPLAY & SCRIPT EDITOR COMPONENT
// Screenplay formatting with interactive claim provenance badges [C-xxx]
// =========================================================================

import React, { useState } from 'react';
import { Scene, EvidenceClaim } from '../types';
import { 
  Clapperboard, 
  Clock, 
  Camera, 
  Volume2, 
  Sparkles, 
  ShieldAlert, 
  Edit3, 
  Check, 
  Info,
  Layers,
  FileText
} from 'lucide-react';

interface ScriptEditorProps {
  scenes: Scene[];
  claims: EvidenceClaim[];
  onInspectClaim: (claimId: string) => void;
  onUpdateScene?: (updatedScene: Scene) => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  scenes,
  claims,
  onInspectClaim,
  onUpdateScene
}) => {
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editedNarration, setEditedNarration] = useState('');

  const handleStartEdit = (scene: Scene) => {
    setEditingSceneId(scene.id);
    setEditedNarration(scene.narration);
  };

  const handleSaveEdit = (scene: Scene) => {
    if (onUpdateScene) {
      onUpdateScene({
        ...scene,
        narration: editedNarration
      });
    }
    setEditingSceneId(null);
  };

  // Helper to render narration text with clickable [C-xxx] tags
  const renderNarrationWithBadges = (narration: string) => {
    const parts = narration.split(/(\[C-\d+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/\[(C-\d+)\]/);
      if (match) {
        const claimId = match[1];
        const claim = claims.find(c => c.id === claimId);
        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onInspectClaim(claimId);
            }}
            title={`Verified Claim: ${claim?.statement || claimId} (Click to inspect provenance)`}
            className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/25 text-amber-300 hover:bg-amber-500/40 border border-amber-500/40 cursor-pointer shadow-xs transition-all hover:scale-105"
          >
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>[{claimId}]</span>
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Master Screenplay</h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {scenes.length} Scenes
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Every factual statement links directly to peer-reviewed evidence through interactive provenance markers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Click any <strong className="font-mono">[C-xxx]</strong> badge to audit evidence
          </div>
        </div>
      </div>

      {/* Screenplay Scene Cards */}
      <div className="space-y-5">
        {scenes.map((scene) => (
          <div 
            key={scene.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
          >
            {/* Scene Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-800 text-amber-400 border border-slate-700">
                  {scene.id}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-mono">
                  {scene.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {scene.timecodeStart} – {scene.timecodeEnd} ({scene.durationSeconds}s)
                </span>
                {editingSceneId !== scene.id && onUpdateScene && (
                  <button
                    onClick={() => handleStartEdit(scene)}
                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Narration"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scene Body Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Visual & Camera Direction */}
              <div className="lg:col-span-4 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-1">
                    Location & Setting
                  </div>
                  <div className="text-slate-200 font-medium">
                    {scene.location}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-1 flex items-center gap-1">
                    <Camera className="w-3 h-3 text-sky-400" />
                    Camera & Lens
                  </div>
                  <div className="text-slate-300">
                    {scene.camera}
                  </div>
                </div>

                {scene.onScreenText && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-purple-400" />
                      On-Screen Graphic
                    </div>
                    <div className="text-purple-300 font-mono font-medium">
                      "{scene.onScreenText}"
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Visual Action & Voiceover Narration */}
              <div className="lg:col-span-8 space-y-3.5">
                {/* Visual Action Description */}
                <div>
                  <div className="text-[11px] font-mono uppercase text-slate-500 tracking-wider mb-1">
                    Visual Action
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                    {scene.visualAction}
                  </p>
                </div>

                {/* Voiceover Narration */}
                <div>
                  <div className="text-[11px] font-mono uppercase text-amber-400/90 tracking-wider mb-1 flex items-center gap-1.5 font-semibold">
                    <Volume2 className="w-3.5 h-3.5" />
                    Voiceover Narration
                  </div>

                  {editingSceneId === scene.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editedNarration}
                        onChange={(e) => setEditedNarration(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-amber-500/50 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-serif"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingSceneId(null)}
                          className="px-3 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(scene)}
                          className="px-3 py-1 rounded text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Save Narration
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm sm:text-base text-slate-100 leading-relaxed font-serif">
                      "{renderNarrationWithBadges(scene.narration)}"
                    </div>
                  )}
                </div>

                {/* Audio & Safety Notes */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Audio Design:</span>
                    <span className="text-slate-300">{scene.sfx} • {scene.music}</span>
                  </div>

                  {scene.safetyNotes && (
                    <div className="flex items-center gap-1 text-emerald-400/90 text-[11px]">
                      <ShieldAlert className="w-3 h-3 text-emerald-400" />
                      <span>{scene.safetyNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
