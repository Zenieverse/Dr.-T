// =========================================================================
// DR. T CINEMA — PRODUCTION SHOT LIST COMPONENT
// Technical matrix for the cinematographer, gaffer, and line producer
// =========================================================================

import React, { useState } from 'react';
import { ShotListEntry } from '../types';
import { Layers, Camera, CheckCircle2, Clock, MapPin, Film, SlidersHorizontal } from 'lucide-react';

interface ShotListProps {
  entries: ShotListEntry[];
  onUpdateStatus?: (entryId: string, status: ShotListEntry['status']) => void;
}

export const ShotList: React.FC<ShotListProps> = ({ entries, onUpdateStatus }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredEntries = filterStatus === 'ALL'
    ? entries
    : entries.filter(e => e.status === filterStatus);

  return (
    <div className="space-y-5 text-slate-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Production Shot List</h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {entries.length} Line Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured shooting breakdown mapped by scene, location, gear, talent, and visual effects requirements.
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs">
          {['ALL', 'READY', 'FILMED', 'PLANNED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3">Shot</th>
              <th className="py-3 px-2">Scene</th>
              <th className="py-3 px-2">Dur</th>
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-3">Talent</th>
              <th className="py-3 px-3">Props</th>
              <th className="py-3 px-3">Camera / Lens</th>
              <th className="py-3 px-3">VFX / Graphics</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                  {entry.shotId}
                </td>
                <td className="py-3 px-2 font-mono text-slate-400 whitespace-nowrap">
                  {entry.sceneId}
                </td>
                <td className="py-3 px-2 font-mono text-slate-300 whitespace-nowrap">
                  {entry.duration}
                </td>
                <td className="py-3 px-3 text-slate-200 max-w-[150px] truncate" title={entry.location}>
                  {entry.location}
                </td>
                <td className="py-3 px-3 text-slate-300 max-w-[130px] truncate" title={entry.talent}>
                  {entry.talent}
                </td>
                <td className="py-3 px-3 text-slate-400 max-w-[130px] truncate" title={entry.props}>
                  {entry.props}
                </td>
                <td className="py-3 px-3 text-slate-300 max-w-[160px] truncate" title={entry.camera}>
                  {entry.camera}
                </td>
                <td className="py-3 px-3 text-purple-300 max-w-[150px] truncate" title={entry.vfx}>
                  {entry.vfx}
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    entry.status === 'FILMED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : entry.status === 'READY'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
