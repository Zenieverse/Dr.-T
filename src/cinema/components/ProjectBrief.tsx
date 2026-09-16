// =========================================================================
// DR. T CINEMA — CREATIVE DIRECTOR BRIEF COMPONENT
// Strategic blueprint framing the objective, audience, and narrative strategy
// =========================================================================

import React from 'react';
import { CreativeBrief, VisualStyleKey } from '../types';
import { VISUAL_STYLE_REGISTRY } from '../data/productionTemplates';
import { Compass, Target, Clock, Palette, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProjectBriefProps {
  brief: CreativeBrief;
}

export const ProjectBrief: React.FC<ProjectBriefProps> = ({ brief }) => {
  const visualConfig = VISUAL_STYLE_REGISTRY[brief.visualLanguage] || VISUAL_STYLE_REGISTRY.Humanist;

  return (
    <div className="space-y-6 text-slate-200">
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Creative Director Blueprint</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Strategic production mandate established by the Creative Director agent.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Core Specs Card */}
        <div className="md:col-span-1 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Production Specs
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-slate-500 text-[10px] font-mono uppercase">Format</div>
              <div className="font-semibold text-white mt-0.5">{brief.format}</div>
            </div>

            <div>
              <div className="text-slate-500 text-[10px] font-mono uppercase">Target Duration</div>
              <div className="font-semibold text-amber-400 font-mono mt-0.5">{brief.durationSeconds} Seconds</div>
            </div>

            <div>
              <div className="text-slate-500 text-[10px] font-mono uppercase">Visual Style Engine</div>
              <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded font-medium ${visualConfig.badgeColor}`}>
                <Palette className="w-3 h-3" /> {visualConfig.name}
              </div>
              <div className="text-slate-400 text-[11px] mt-1">{visualConfig.description}</div>
            </div>

            <div>
              <div className="text-slate-500 text-[10px] font-mono uppercase">Aesthetic Camera Profile</div>
              <div className="text-slate-300 mt-0.5 font-mono text-[11px]">{visualConfig.lensProfile}</div>
            </div>
          </div>
        </div>

        {/* Narrative Architecture (2 Cols) */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
              Project Logline
            </div>
            <p className="text-base text-slate-100 font-serif italic leading-relaxed">
              "{brief.logline}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">Target Audience</div>
              <div className="text-slate-300 leading-normal">{brief.audience}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">Director Tone</div>
              <div className="text-slate-300 leading-normal">{brief.tone}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs">
            <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">Production Objective</div>
            <p className="text-slate-300 leading-relaxed">{brief.objective}</p>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs">
            <div className="text-[10px] font-mono uppercase text-slate-500 mb-2">Success Criteria</div>
            <ul className="space-y-1.5">
              {brief.successCriteria.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
