import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Terminal, 
  CheckCircle2, 
  Activity, 
  Pin, 
  Share2, 
  Copy, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { 
  OrchestrationState, 
  AgentActivityEvent, 
  CanvasCard, 
  WebMCPToolDefinition 
} from '../../../webmcp/types';
import { DemoWorkflowPlayer } from '../components/DemoWorkflowPlayer';

interface HomeAgentCanvasViewProps {
  goal: string;
  setGoal: (g: string) => void;
  onExecuteGoal: (customGoal?: string) => Promise<void>;
  orchestrationState: OrchestrationState;
  activityStream: AgentActivityEvent[];
  cards: CanvasCard[];
  tools: WebMCPToolDefinition[];
  onOpenToolView: (toolName?: string) => void;
  onPinCard: (id: string) => void;
  onExportCard: (id: string, format: 'markdown' | 'json' | 'text') => void;
}

export const HomeAgentCanvasView: React.FC<HomeAgentCanvasViewProps> = ({
  goal,
  setGoal,
  onExecuteGoal,
  orchestrationState,
  activityStream,
  cards,
  tools,
  onOpenToolView,
  onPinCard,
  onExportCard,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const samplePrompts = [
    'Create a sustainable 3-day weekend plan for two people under $500.',
    'Research low-emission transit routes & compare electric ferries vs light rail.',
    'Compare top 4 zero-waste farm-to-table dinners under $35/person.',
    'Build a weekend itinerary focusing on bioluminescence and dark-sky astronomy.',
    'Draft a budget optimization report comparing lodging energy efficiency.',
  ];

  const handleCopy = (card: CanvasCard) => {
    navigator.clipboard.writeText(card.content);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isRunning = orchestrationState !== 'IDLE' && orchestrationState !== 'COMPLETED' && orchestrationState !== 'ERROR';

  const stateLabels: Record<OrchestrationState, { title: string; desc: string; color: string }> = {
    IDLE: { title: 'Workspace Ready', desc: 'Standing by for human goal injection.', color: 'text-slate-400' },
    UNDERSTANDING: { title: 'Understanding Intent', desc: 'Synthesizing natural language constraints & goals.', color: 'text-cyan-400' },
    DISCOVERING_TOOLS: { title: 'Discovering WebMCP Tools', desc: 'Inspecting 12 registered capabilities on active page.', color: 'text-indigo-400' },
    EXECUTING: { title: 'Executing Tools', desc: 'Executing deterministic search, comparison & budget tools.', color: 'text-amber-400' },
    WAITING_FOR_APPROVAL: { title: 'Awaiting Human Approval', desc: 'Sensitive action interception paused for user sign-off.', color: 'text-rose-400' },
    CREATING: { title: 'Creating Shared Artifact', desc: 'Publishing formatted document to collaborative canvas.', color: 'text-emerald-400' },
    REVIEWING: { title: 'Critic Verification', desc: 'Validating budget constraints & environmental scores.', color: 'text-purple-400' },
    COMPLETED: { title: 'Collaboration Complete', desc: 'Artifact live on shared canvas.', color: 'text-teal-400' },
    ERROR: { title: 'Execution Fault', desc: 'Check WebMCP audit log for error details.', color: 'text-red-400' },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-4 pt-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="font-bold">● WebMCP Connected</span>
          <span className="text-slate-500">|</span>
          <span>12 capabilities available</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
          THE WEB THAT AGENTS CAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">ACTUALLY USE</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          OpenWebOS turns websites from pages agents read into environments agents can work inside.
        </p>

        {/* Main Command Input Box */}
        <div className="pt-2 max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (goal.trim()) onExecuteGoal(goal);
            }}
            className="p-2 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Create a sustainable 3-day weekend plan for two people under $500."
                className="w-full px-4 py-3.5 bg-transparent text-white placeholder:text-slate-500 text-sm font-medium focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isRunning || !goal.trim()}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
                isRunning || !goal.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 active:scale-95'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Working...</span>
                </>
              ) : (
                <>
                  <span>Let the Web Work</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
            <span className="text-slate-500 font-mono text-[11px]">Quick Scenarios:</span>
            {samplePrompts.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setGoal(prompt);
                  onExecuteGoal(prompt);
                }}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition text-[11px] font-medium truncate max-w-xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Minute Demo Highlight Banner */}
      <DemoWorkflowPlayer onRunDemo={() => onExecuteGoal('Create a sustainable 3-day weekend plan for two people under $500.')} isRunning={isRunning} />

      {/* Main 3-Column Agent Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Human Request & Goal Context (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>HUMAN GOAL</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <p className="text-sm text-slate-200 font-medium leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              {goal || 'Create a sustainable 3-day weekend plan for two people under $500.'}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Budget Limit:</span>
                <span className="font-mono text-white font-bold">$500.00 USD</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Party Size:</span>
                <span className="font-mono text-white font-bold">2 Persons</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Optimization:</span>
                <span className="font-mono text-teal-400 font-bold">Max Sustainability</span>
              </div>
            </div>
          </div>

          {/* Current State Machine Indicator */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              State Machine
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className={`text-sm font-bold font-mono ${stateLabels[orchestrationState].color}`}>
                {stateLabels[orchestrationState].title}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {stateLabels[orchestrationState].desc}
            </p>
          </div>
        </div>

        {/* CENTER COLUMN: Agent Reasoning & Activity Visualization (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col h-full min-h-[380px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>AGENT REASONING &amp; WEBMCP ACTIVITY</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {activityStream.length} events logged
              </span>
            </div>

            {/* Event Activity Stream */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
              {activityStream.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No activity events yet. Click &quot;Let the Web Work&quot; or &quot;Run 2-Minute Demo&quot; to start.
                </div>
              ) : (
                activityStream.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-slate-500">
                          {event.timeLabel}
                        </span>
                        {event.role && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {event.role}
                          </span>
                        )}
                        <span className="font-bold text-slate-200">{event.title}</span>
                      </div>
                      {event.toolName && (
                        <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                          {event.toolName}()
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {event.summary}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WebMCP Tools Used (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span>WEBMCP TOOLS</span>
              </span>
              <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                12 ACTIVE
              </span>
            </div>

            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
              {tools.map((t) => (
                <button
                  key={t.name}
                  onClick={() => onOpenToolView(t.name)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-left transition flex items-center justify-between group"
                >
                  <div>
                    <div className="font-mono text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                      {t.name}()
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[170px]">
                      {t.description}
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      t.classification === 'READ'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : t.riskLevel === 'HIGH'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    {t.classification}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Shared Artifact Canvas */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Shared Workspace Canvas
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {cards.length} live collaborative artifacts
          </span>
        </div>

        {cards.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
            Canvas is waiting for agent artifact generation. Run the demo above to generate the first verified 3-Day Eco-Plan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-xl space-y-4 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                        {card.type}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        by {card.author} • {card.createdAt}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {card.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => onPinCard(card.id)}
                      title={card.pinned ? 'Unpin card' : 'Pin card'}
                      className={`p-1.5 rounded-lg border transition ${
                        card.pinned
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(card)}
                      title="Copy artifact content"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition"
                    >
                      {copiedId === card.id ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {card.content}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    {card.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onExportCard(card.id, 'markdown')}
                      className="text-cyan-400 hover:underline text-[11px] font-mono"
                    >
                      Export .MD
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => onExportCard(card.id, 'json')}
                      className="text-indigo-400 hover:underline text-[11px] font-mono"
                    >
                      Export JSON
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
