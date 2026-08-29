import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  ChevronDown, 
  ChevronRight,
  Filter,
  Trash2
} from 'lucide-react';
import { AgentActivityEvent } from '../../../webmcp/types';

interface AgentActivityViewProps {
  events: AgentActivityEvent[];
  onClearEvents: () => void;
}

export const AgentActivityView: React.FC<AgentActivityViewProps> = ({
  events,
  onClearEvents,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const statusIcons = {
    queued: <Clock className="w-4 h-4 text-slate-400" />,
    running: <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    error: <XCircle className="w-4 h-4 text-rose-400" />,
  };

  const filtered = events.filter(e => {
    if (filterStatus !== 'ALL' && e.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">
              WebMCP Agent Activity Stream
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time event ledger tracking discovery, arguments, execution times, and state transitions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            {['ALL', 'running', 'success', 'warning', 'error'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
                  filterStatus === st
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={onClearEvents}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
            title="Clear Activity Stream"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            No events match current filter criteria. Run an agent goal from the Home screen.
          </div>
        ) : (
          <div className="relative border-l border-slate-800 ml-4 pl-6 space-y-6">
            {filtered.map((event) => {
              const isExpanded = expandedIds.has(event.id);
              const hasPayload = event.payload || event.result;

              return (
                <div key={event.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[35px] top-1.5 p-1 rounded-full bg-slate-950 border border-slate-700 shadow-md">
                    {statusIcons[event.status]}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-slate-700 transition">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-slate-500">
                          {event.timeLabel}
                        </span>
                        {event.role && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {event.role}
                          </span>
                        )}
                        <span className="text-sm font-bold text-slate-200">
                          {event.title}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {event.toolName && (
                          <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/50 flex items-center space-x-1">
                            <Terminal className="w-3 h-3 text-cyan-400" />
                            <span>{event.toolName}()</span>
                          </span>
                        )}
                        {hasPayload && (
                          <button
                            onClick={() => toggleExpand(event.id)}
                            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition"
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {event.summary}
                    </p>

                    {/* Expandable JSON details */}
                    {isExpanded && hasPayload && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                        {event.payload && (
                          <div>
                            <div className="text-[10px] font-mono text-slate-400 mb-1">Payload:</div>
                            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 max-h-40 overflow-y-auto whitespace-pre-wrap">
                              {JSON.stringify(event.payload, null, 2)}
                            </pre>
                          </div>
                        )}
                        {event.result && (
                          <div>
                            <div className="text-[10px] font-mono text-slate-400 mb-1">Result:</div>
                            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-400 max-h-40 overflow-y-auto whitespace-pre-wrap">
                              {JSON.stringify(event.result, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
