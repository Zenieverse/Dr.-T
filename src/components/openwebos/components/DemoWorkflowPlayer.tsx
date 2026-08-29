import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, DollarSign, Leaf, Sparkles } from 'lucide-react';

interface DemoWorkflowPlayerProps {
  onRunDemo: () => Promise<void>;
  isRunning: boolean;
}

export const DemoWorkflowPlayer: React.FC<DemoWorkflowPlayerProps> = ({
  onRunDemo,
  isRunning,
}) => {
  const [demoStep, setDemoStep] = useState<number>(0);

  const steps = [
    { time: '0:00', label: 'Initialize WebMCP', desc: '12 tools registered & available' },
    { time: '0:20', label: 'Goal Ingestion', desc: '"Sustainable 3-day weekend for 2 under $500"' },
    { time: '0:40', label: 'search_options', desc: 'Discovers 12 eco-lodges & activities' },
    { time: '0:50', label: 'compare_options', desc: 'Evaluates LEED Platinum vs geodomes' },
    { time: '1:00', label: 'calculate_budget', desc: 'Ledger calculated: $417 of $500' },
    { time: '1:15', label: 'Critic Proposal', desc: 'Swap accommodation to save $38' },
    { time: '1:30', label: 'create_artifact', desc: 'Human confirms, publishes itinerary' },
  ];

  const handleStart = async () => {
    setDemoStep(1);
    await onRunDemo();
    setDemoStep(steps.length);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 p-5 shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              WEBMCP CHALLENGE SCENARIO
            </span>
            <span className="text-xs text-slate-400 font-mono">2-Minute Deterministic Demo</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Autonomous 3-Day Eco-Trip Workspace Synthesizer
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Demonstrates human goal &rarr; tool discovery &rarr; deterministic search &rarr; multi-criteria comparison &rarr; budget verification ($417 / $500) &rarr; human approval &rarr; shared canvas artifact.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition shadow-lg ${
              isRunning
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 hover:opacity-95 shadow-cyan-500/20 transform hover:scale-105 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run 2-Minute Demo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metric Callouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">Total Spend</div>
            <div className="text-sm font-bold text-white">$417.00 <span className="text-[10px] text-emerald-400 font-normal">($500 max)</span></div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">Surplus Headroom</div>
            <div className="text-sm font-bold text-cyan-300">+$83.00 remaining</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">Sustainability</div>
            <div className="text-sm font-bold text-teal-300">96.8 / 100</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">WebMCP Tools</div>
            <div className="text-sm font-bold text-indigo-300">12 Connected</div>
          </div>
        </div>
      </div>
    </div>
  );
};
