// =========================================================================
// DR. T CINEMA — AGENT ACTIVITY ORCHESTRATION STREAM
// Live timeline of autonomous multi-agent studio actions
// =========================================================================

import React from 'react';
import { AgentActivityLog, StudioAgentRole } from '../types';
import { 
  Bot, 
  Search, 
  Compass, 
  FileEdit, 
  Film, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles 
} from 'lucide-react';

interface AgentActivityProps {
  logs: AgentActivityLog[];
}

export const AgentActivity: React.FC<AgentActivityProps> = ({ logs }) => {
  const getRoleIcon = (role?: StudioAgentRole) => {
    switch (role) {
      case 'Parallel Research Producer':
        return <Search className="w-3.5 h-3.5 text-amber-400" />;
      case 'Creative Director':
        return <Compass className="w-3.5 h-3.5 text-sky-400" />;
      case 'Fact Checker':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Screenwriter':
        return <FileEdit className="w-3.5 h-3.5 text-purple-400" />;
      case 'Storyboard Director':
        return <Film className="w-3.5 h-3.5 text-rose-400" />;
      case 'Production Manager':
        return <Calendar className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Safety Supervisor':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-4 text-slate-200">
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
            Autonomous Multi-Agent Activity Stream
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-800">
          {logs.length} Operations Logged
        </span>
      </div>

      <div className="space-y-2">
        {logs.map((log) => {
          const role = (log.agentRole || log.agentName || 'Creative Director') as StudioAgentRole;

          return (
            <div 
              key={log.id}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0 mt-0.5">
                  {getRoleIcon(role)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-semibold text-slate-200">
                      {role}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[11px] text-slate-400">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {log.details}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-[10px] text-slate-500 block">
                  {log.timestamp.split('T')[1]?.slice(0, 8) || log.timestamp}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                  <CheckCircle2 className="w-2.5 h-2.5" /> {log.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
