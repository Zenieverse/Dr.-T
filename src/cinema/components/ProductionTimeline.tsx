// =========================================================================
// DR. T CINEMA — PRODUCTION TIMELINE & ASSET CHECKLIST
// Shooting schedule optimization and post-production asset tracking
// =========================================================================

import React from 'react';
import { ProductionScheduleBlock, AssetChecklistItem } from '../types';
import { Calendar, Clock, MapPin, CheckSquare, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';

interface ProductionTimelineProps {
  schedule: ProductionScheduleBlock[];
  assets: AssetChecklistItem[];
}

export const ProductionTimeline: React.FC<ProductionTimelineProps> = ({ schedule, assets }) => {
  const days = Array.from(new Set(schedule.map(s => s.day))).sort();

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Production Schedule & Asset Vault</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimized shooting order calibrated for daylight quality, location logistics, and post-production delivery.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2-Day Shooting Schedule (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Shooting Order ({days.length} Production Days)
          </h3>

          <div className="space-y-4">
            {days.map(dayNum => {
              const dayBlocks = schedule.filter(s => s.day === dayNum);

              return (
                <div key={dayNum} className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
                  <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      DAY {dayNum} — PRODUCTION CALL
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {dayBlocks.length} Shooting Blocks
                    </span>
                  </div>

                  <div className="p-4 divide-y divide-slate-800/80 space-y-3">
                    {dayBlocks.map((block, idx) => (
                      <div key={idx} className="pt-3 first:pt-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <span className="font-mono text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {block.timeRange}
                          </span>
                          <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {block.sceneReferences.join(', ')}
                          </span>
                        </div>

                        <div className="text-xs font-medium text-slate-200 mb-1">
                          {block.activity}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-400 mb-1.5">
                          <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                          <span>{block.location}</span>
                        </div>

                        <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded border border-slate-800/50">
                          Crew Note: {block.crewNotes}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Master Asset Checklist (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-sky-400" />
            Master Asset Checklist ({assets.length})
          </h3>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-3">
            {assets.map((asset) => (
              <div 
                key={asset.id}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-semibold uppercase text-slate-400 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">
                      {asset.category}
                    </span>
                    <span className="font-medium text-slate-200">
                      {asset.item}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">
                    {asset.formatSpecs}
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {asset.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
