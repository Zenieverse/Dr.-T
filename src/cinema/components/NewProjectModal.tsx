// =========================================================================
// DR. T CINEMA — NEW PROJECT CREATION MODAL & WIZARD
// Launches autonomous multi-agent studio with Parallel Search grounding
// =========================================================================

import React, { useState } from 'react';
import { VisualStyleKey } from '../types';
import { VISUAL_STYLE_REGISTRY, PRODUCTION_FORMATS } from '../data/productionTemplates';
import { 
  Sparkles, 
  X, 
  Clapperboard, 
  Search, 
  Clock, 
  Palette, 
  ArrowRight, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchProject: (params: {
    prompt: string;
    durationSeconds: number;
    visualStyle: VisualStyleKey;
  }) => Promise<void>;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onLaunchProject
}) => {
  const [prompt, setPrompt] = useState('Why people feel exhausted even when their routine blood test comes back "normal"');
  const [duration, setDuration] = useState<number>(90);
  const [visualStyle, setVisualStyle] = useState<VisualStyleKey>('Humanist');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');

  if (!isOpen) return null;

  const presetIdeas = [
    'Why people feel exhausted even when routine blood tests come back normal (Iron Reserve)',
    'Circadian Rhythm Disruptions: Why blue light halts melatonin synthesis at midnight',
    'Cellular Hydration: The biochemical role of sodium-potassium pumps in brain fog'
  ];

  const handleLaunch = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    const steps = [
      '1/5 Parallel Research Producer querying peer-reviewed evidence...',
      '2/5 Fact Checker verifying claims and credibility scores...',
      '3/5 Story Architect structuring 8-beat narrative arc...',
      '4/5 Screenwriter drafting screenplay with [C-xxx] badges...',
      '5/5 Storyboard Director & Production Manager compiling package...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStepText(steps[i]);
      await new Promise(r => setTimeout(r, 350));
    }

    try {
      await onLaunchProject({
        prompt,
        durationSeconds: duration,
        visualStyle
      });
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <Clapperboard className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Launch Evidence-to-Screen Production
              </h3>
              <p className="text-xs text-slate-400">
                Ground any biomedical idea into a full production package powered by Parallel Search & Gemini
              </p>
            </div>
          </div>
          {!isGenerating && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Form Content */}
        <div className="p-6 space-y-5">
          {/* Creative Intent Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
              Creative Intent & Topic
            </label>
            <textarea
              disabled={isGenerating}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a 90-second explainer on why ferritin causes fatigue without anemia..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              rows={3}
            />

            {/* Quick Preset Ideas */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-500 py-0.5">Quick Presets:</span>
              {presetIdeas.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setPrompt(preset)}
                  className="px-2.5 py-0.5 rounded text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors text-left truncate max-w-full"
                >
                  {preset.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                Target Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 60, 90, 120].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    disabled={isGenerating}
                    onClick={() => setDuration(dur)}
                    className={`py-2 rounded-lg font-mono text-xs font-bold transition-colors ${
                      duration === dur
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Style Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                Visual Style Engine
              </label>
              <select
                disabled={isGenerating}
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value as VisualStyleKey)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {Object.entries(VISUAL_STYLE_REGISTRY).map(([key, style]) => (
                  <option key={key} value={key}>
                    {style.name} — {style.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Processing Indicator */}
          {isGenerating && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 animate-pulse">
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
              <div className="text-xs font-mono text-amber-300">
                {currentStepText}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Autonomous Multi-Agent Pipeline
          </span>

          <div className="flex items-center gap-2">
            {!isGenerating && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              disabled={isGenerating || !prompt.trim()}
              onClick={handleLaunch}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 flex items-center gap-1.5 shadow-md transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Orchestrating Agents...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Launch Production Studio
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
