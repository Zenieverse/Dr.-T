import React from 'react';
import { MemoryLanternItem } from '../types';
import { 
  Flame, 
  Calendar, 
  Users, 
  Tag, 
  Trash2, 
  Edit3, 
  Download, 
  Share2, 
  BookOpen, 
  Mic, 
  Sparkles,
  Heart
} from 'lucide-react';

interface LanternCardProps {
  memory: MemoryLanternItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReadTribute: () => void;
  onExportMarkdown: () => void;
  onShareText: () => void;
}

export const LanternCard: React.FC<LanternCardProps> = ({
  memory,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onReadTribute,
  onExportMarkdown,
  onShareText
}) => {
  const colorGlows = {
    amber: 'from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/30 text-amber-300',
    warm_gold: 'from-yellow-500/20 via-amber-500/10 to-transparent border-yellow-500/30 text-yellow-300',
    rose: 'from-rose-500/20 via-pink-500/10 to-transparent border-rose-500/30 text-rose-300',
    emerald: 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/30 text-emerald-300',
    indigo: 'from-indigo-500/20 via-purple-500/10 to-transparent border-indigo-500/30 text-indigo-300'
  };

  const activeColor = memory.lanternColor || 'amber';
  const glowStyle = colorGlows[activeColor] || colorGlows.amber;

  return (
    <div 
      className={`relative group flex flex-col justify-between rounded-2xl bg-gradient-to-b ${glowStyle} bg-slate-900/90 border backdrop-blur-md p-5 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-400/50 ${
        isSelected ? 'ring-2 ring-amber-400 border-amber-400 shadow-lg shadow-amber-500/20' : ''
      }`}
    >
      {/* Lantern Flame & Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-amber-400/20 blur-xs -z-10" />
            </div>
            <div>
              <span className="text-[11px] font-medium tracking-wider uppercase text-amber-400/80">
                {memory.category}
              </span>
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-1">
                {memory.title}
              </h3>
            </div>
          </div>

          {/* Selection Checkbox */}
          {onSelect && (
            <button
              onClick={onSelect}
              type="button"
              title={isSelected ? 'Deselect memory' : 'Select memory for story generation'}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isSelected 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-amber-400 hover:text-amber-300'
              }`}
            >
              {isSelected ? '✓ Selected' : '+ Select'}
            </button>
          )}
        </div>

        {/* Period and People Remembered */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-400">
          {memory.dateOrPeriod && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60">
              <Calendar className="w-3 h-3 text-amber-400/70" />
              {memory.dateOrPeriod}
            </span>
          )}
          {memory.peopleRemembered && memory.peopleRemembered.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60">
              <Users className="w-3 h-3 text-rose-400/70" />
              {memory.peopleRemembered.join(', ')}
            </span>
          )}
          {memory.isSample && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-[10px] font-mono">
              Fictional Sample
            </span>
          )}
        </div>

        {/* Story Snippet */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3.5">
          {memory.story}
        </p>

        {/* Meaningful Details Highlights */}
        {memory.meaningfulDetails && memory.meaningfulDetails.length > 0 && (
          <div className="space-y-1.5 mb-3.5 pt-2 border-t border-slate-800/80">
            {memory.meaningfulDetails.slice(0, 2).map((detail, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                <span className="shrink-0 text-amber-400/90 font-medium capitalize">
                  {detail.type.replace('_', ' ')}:
                </span>
                <span className="truncate italic text-slate-300">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tags & Audio Pill */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {memory.audioNote?.recorded && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-[10px] text-emerald-300">
              <Mic className="w-2.5 h-2.5" />
              Audio Note ({memory.audioNote.durationSeconds}s)
            </span>
          )}
          {memory.tags?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              <Tag className="w-2.5 h-2.5 opacity-60" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        <button
          onClick={onReadTribute}
          type="button"
          className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors font-medium"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Read Lantern
        </button>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={onShareText}
            type="button"
            title="Shareable Text (Stripped of IDs)"
            aria-label="Share text"
            className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onExportMarkdown}
            type="button"
            title="Download Markdown"
            aria-label="Download Markdown"
            className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onEdit}
            type="button"
            title="Edit memory"
            aria-label="Edit memory"
            className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            type="button"
            title="Delete memory permanently"
            aria-label="Delete memory"
            className="p-1.5 rounded-md hover:bg-rose-950/50 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
