import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Terminal, 
  Activity, 
  Layers, 
  Users, 
  ShieldCheck, 
  Bot, 
  BookOpen, 
  Play, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { 
  OrchestrationState, 
  AgentActivityEvent, 
  CanvasCard, 
  AgentProposal, 
  AuditLogEntry, 
  WebMCPToolDefinition,
  ToolRiskLevel
} from '../../webmcp/types';
import { globalWebMCPRegistry } from '../../webmcp/registry';
import { globalAgentOrchestrator } from '../../webmcp/orchestrator';
import { useWebMCPStatus } from '../../webmcp/useWebMCPStatus';

// Views
import { HomeAgentCanvasView } from './views/HomeAgentCanvasView';
import { WebMCPToolsView } from './views/WebMCPToolsView';
import { AgentActivityView } from './views/AgentActivityView';
import { SharedWorkspaceView } from './views/SharedWorkspaceView';
import { AgentCollaborationView } from './views/AgentCollaborationView';
import { SafetyCenterView } from './views/SafetyCenterView';
import { AgentView } from './views/AgentView';
import { AboutHowItWorksView } from './views/AboutHowItWorksView';

// Components
import { ApprovalModal } from './components/ApprovalModal';

export type OpenWebOSTab = 
  | 'home'
  | 'tools'
  | 'activity'
  | 'workspace'
  | 'collaboration'
  | 'safety'
  | 'agent_view'
  | 'about';

export const OpenWebOSApp: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<OpenWebOSTab>('home');
  const [viewMode, setViewMode] = useState<'HUMAN' | 'AGENT'>('HUMAN');
  const [goal, setGoal] = useState<string>('Create a sustainable 3-day weekend plan for two people under $500.');
  const [orchestrationState, setOrchestrationState] = useState<OrchestrationState>('IDLE');
  const [activityStream, setActivityStream] = useState<AgentActivityEvent[]>([]);
  const [cards, setCards] = useState<CanvasCard[]>([]);
  const [proposals, setProposals] = useState<AgentProposal[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => globalWebMCPRegistry.getAuditLog());
  const [selectedToolForInspect, setSelectedToolForInspect] = useState<string | undefined>(undefined);
  const status = useWebMCPStatus();

  // Human approval modal state
  const [approvalModal, setApprovalModal] = useState<{
    isOpen: boolean;
    toolName: string;
    args: any;
    reason: string;
    riskLevel: ToolRiskLevel;
    resolver?: (approved: boolean) => void;
  }>({
    isOpen: false,
    toolName: '',
    args: {},
    reason: '',
    riskLevel: 'LOW',
  });

  const allTools = globalWebMCPRegistry.getAllTools();

  // Sync audit logs on tool execution
  useEffect(() => {
    const unsub = globalWebMCPRegistry.subscribe(() => {
      setAuditLogs(globalWebMCPRegistry.getAuditLog());
    });
    return unsub;
  }, []);

  // Tool execution context connecting to React shared canvas state
  const toolContext = {
    cards,
    setCards,
    proposals,
    setProposals,
    activityLog: activityStream,
    setActivityLog: setActivityStream,
  };

  const handleRequestHumanApproval = (
    toolName: string,
    args: any,
    reason: string,
    riskLevel: ToolRiskLevel
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setApprovalModal({
        isOpen: true,
        toolName,
        args,
        reason,
        riskLevel,
        resolver: resolve,
      });
    });
  };

  const handleModalApprove = () => {
    if (approvalModal.resolver) {
      approvalModal.resolver(true);
    }
    setApprovalModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleModalReject = () => {
    if (approvalModal.resolver) {
      approvalModal.resolver(false);
    }
    setApprovalModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleExecuteGoal = async (customGoal?: string) => {
    const targetGoal = customGoal || goal;
    if (!targetGoal.trim()) return;

    await globalAgentOrchestrator.executeGoal({
      goal: targetGoal,
      context: toolContext,
      onStateChange: (st) => setOrchestrationState(st),
      onActivityEvent: (ev) => setActivityStream(prev => [ev, ...prev]),
      onProposalCreated: (prop) => setProposals(prev => [prop, ...prev]),
      requestHumanApproval: handleRequestHumanApproval,
    });
  };

  const handleOpenToolView = (toolName?: string) => {
    setSelectedToolForInspect(toolName);
    setActiveSubtab('tools');
  };

  const handlePinCard = (id: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  const handleExportCard = (id: string, format: 'markdown' | 'json' | 'text') => {
    const card = cards.find(c => c.id === id);
    if (!card) return;

    let contentToDownload = card.content;
    let mimeType = 'text/markdown';
    let ext = 'md';

    if (format === 'json') {
      contentToDownload = JSON.stringify(card, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else if (format === 'text') {
      mimeType = 'text/plain';
      ext = 'txt';
    }

    const blob = new Blob([contentToDownload], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAcceptProposal = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'accepted' } : p));
  };

  const handleRejectProposal = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
  };

  const navTabs = [
    { id: 'home' as const, label: 'Canvas', icon: Globe, badge: 'Core' },
    { id: 'tools' as const, label: 'WebMCP Tools', icon: Terminal, count: allTools.length },
    { id: 'activity' as const, label: 'Agent Stream', icon: Activity, count: activityStream.length },
    { id: 'workspace' as const, label: 'Shared Cards', icon: Layers, count: cards.length },
    { id: 'collaboration' as const, label: 'Collaboration', icon: Users, count: proposals.filter(p => p.status === 'pending').length },
    { id: 'safety' as const, label: 'Trust & Safety', icon: ShieldCheck, badge: 'Zero-Trust' },
    { id: 'agent_view' as const, label: 'Machine View', icon: Bot },
    { id: 'about' as const, label: 'Guide & Spec', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top OpenWebOS Brand Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo & Tagline */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black text-white tracking-tight">
                    OpenWebOS
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    WebMCP 2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  The web that agents can actually use.
                </p>
              </div>
            </div>

            {/* View Mode Toggle & Status Badge */}
            <div className="flex items-center space-x-3">
              {/* WebMCP Connection Status */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-medium">WebMCP Connected</span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-400 font-bold">{allTools.length} Tools</span>
              </div>

              {/* Human vs Agent Machine View Toggle */}
              <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
                <button
                  onClick={() => {
                    setViewMode('HUMAN');
                    if (activeSubtab === 'agent_view') setActiveSubtab('home');
                  }}
                  className={`px-3 py-1 rounded-lg transition flex items-center space-x-1.5 ${
                    viewMode === 'HUMAN' && activeSubtab !== 'agent_view'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Human View</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('AGENT');
                    setActiveSubtab('agent_view');
                  }}
                  className={`px-3 py-1 rounded-lg transition flex items-center space-x-1.5 ${
                    viewMode === 'AGENT' || activeSubtab === 'agent_view'
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Agent View</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubtab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubtab(tab.id);
                    if (tab.id === 'agent_view') setViewMode('AGENT');
                    else setViewMode('HUMAN');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shrink-0 transition ${
                    isActive
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-700">
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSubtab === 'home' && (
          <HomeAgentCanvasView
            goal={goal}
            setGoal={setGoal}
            onExecuteGoal={handleExecuteGoal}
            orchestrationState={orchestrationState}
            activityStream={activityStream}
            cards={cards}
            tools={allTools}
            onOpenToolView={handleOpenToolView}
            onPinCard={handlePinCard}
            onExportCard={handleExportCard}
          />
        )}

        {activeSubtab === 'tools' && (
          <WebMCPToolsView
            tools={allTools}
            context={toolContext}
            selectedToolName={selectedToolForInspect}
          />
        )}

        {activeSubtab === 'activity' && (
          <AgentActivityView
            events={activityStream}
            onClearEvents={() => setActivityStream([])}
          />
        )}

        {activeSubtab === 'workspace' && (
          <SharedWorkspaceView
            cards={cards}
            setCards={setCards}
            onExportCard={handleExportCard}
            onSaveWorkspace={() => {}}
          />
        )}

        {activeSubtab === 'collaboration' && (
          <AgentCollaborationView
            proposals={proposals}
            onAcceptProposal={handleAcceptProposal}
            onRejectProposal={handleRejectProposal}
          />
        )}

        {activeSubtab === 'safety' && (
          <SafetyCenterView auditLogs={auditLogs} />
        )}

        {activeSubtab === 'agent_view' && (
          <AgentView tools={allTools} />
        )}

        {activeSubtab === 'about' && (
          <AboutHowItWorksView />
        )}
      </main>

      {/* Human Approval Intercept Modal */}
      <ApprovalModal
        isOpen={approvalModal.isOpen}
        toolName={approvalModal.toolName}
        args={approvalModal.args}
        reason={approvalModal.reason}
        riskLevel={approvalModal.riskLevel}
        onApprove={handleModalApprove}
        onReject={handleModalReject}
      />
    </div>
  );
};
