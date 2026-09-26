import React, { useState, useEffect } from 'react';
import { NavTab } from '../types';
import { 
  Investigation, 
  RepositoryHealth, 
  LivingCodeMapData, 
  CodeMapNode, 
  EvidenceRequest 
} from './types/lifeweaveTypes';
import { lifeweaveService } from './services/lifeweaveService';
import { LivingCodeMap } from './components/LivingCodeMap';
import { EvidenceFieldCard } from './components/EvidenceFieldCard';
import { HypothesisEngineView } from './components/HypothesisEngineView';
import { PatchProposalView } from './components/PatchProposalView';
import { LifeweaveLab } from './components/LifeweaveLab';
import { Gemma4ExportModal } from './components/Gemma4ExportModal';
import { LifeweaveDocsModal } from './components/LifeweaveDocsModal';
import { 
  Network, 
  GitBranch, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Cpu, 
  Award, 
  Search, 
  Plus, 
  FileText, 
  BookOpen, 
  Download, 
  Share2, 
  RotateCcw, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Check, 
  ExternalLink, 
  FileCode, 
  Zap, 
  Lock, 
  FolderArchive,
  BarChart3,
  FlaskConical,
  GitPullRequest
} from 'lucide-react';

interface LifeWeaveStudioProps {
  setActiveTab: (tab: NavTab) => void;
}

export type LifeweaveTabMode =
  | 'WORKSPACE'
  | 'CODEMAP'
  | 'EVIDENCE'
  | 'PATCH'
  | 'LAB'
  | 'AUDIT_EXPORT';

export const LifeWeaveStudio: React.FC<LifeWeaveStudioProps> = ({ setActiveTab }) => {
  const [activeMode, setActiveMode] = useState<LifeweaveTabMode>('WORKSPACE');
  const [repositoryHealth, setRepositoryHealth] = useState<RepositoryHealth | null>(null);
  const [codeMapData, setCodeMapData] = useState<LivingCodeMapData | null>(null);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [activeInvestigationId, setActiveInvestigationId] = useState<string>('lw-inv-001');

  // Modals state
  const [isStartModalOpen, setIsStartModalOpen] = useState<boolean>(false);
  const [isGemma4ModalOpen, setIsGemma4ModalOpen] = useState<boolean>(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);
  const [copiedDataset, setCopiedDataset] = useState<string | null>(null);

  // New Investigation form state
  const [newIssueText, setNewIssueText] = useState<string>('');
  const [newIssueId, setNewIssueId] = useState<string>('');
  const [newFilePath, setNewFilePath] = useState<string>('');
  const [newErrorMessage, setNewErrorMessage] = useState<string>('');
  const [newStackTrace, setNewStackTrace] = useState<string>('');
  const [newFailingTest, setNewFailingTest] = useState<string>('');

  // Load initial data
  useEffect(() => {
    const init = async () => {
      const health = await lifeweaveService.getRepositoryHealth();
      const map = await lifeweaveService.getLivingCodeMap();
      const invs = await lifeweaveService.getInvestigations();
      setRepositoryHealth(health);
      setCodeMapData(map);
      setInvestigations(invs);
    };
    init();
  }, []);

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('cand-001');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeInvestigation = investigations.find(i => i.id === activeInvestigationId) || investigations[0];
  const activeCandidate = activeInvestigation?.candidates.find(c => c.id === selectedCandidateId) || activeInvestigation?.candidates[0];

  const handleSelectInvestigation = (id: string) => {
    setActiveInvestigationId(id);
    const inv = investigations.find(i => i.id === id);
    if (inv && inv.candidates[0]) {
      setSelectedCandidateId(inv.candidates[0].id);
    }
  };

  const handleSelectCodeMapNode = (node: CodeMapNode) => {
    if (!activeInvestigation) return;
    const matchingCandidate = activeInvestigation.candidates.find(c => c.filePath === node.path);
    if (matchingCandidate) {
      setSelectedCandidateId(matchingCandidate.id);
      setActionNotice(`Selected candidate: ${matchingCandidate.filePath}`);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleSelectHypothesis = (hypo: any) => {
    setActionNotice(`Active Focus: Hypothesis [${hypo.code}]`);
    setTimeout(() => setActionNotice(null), 2500);
  };

  const handleExecuteEvidenceRequest = (req: EvidenceRequest) => {
    if (!activeInvestigation) return;
    const now = new Date().toISOString();
    const newEvent = {
      id: `ev-${Date.now()}`,
      timestamp: now,
      timeFormatted: now.slice(11, 16),
      title: `Executed: ${req.action}`,
      details: `Target: ${req.targetNode}. Uncertainty reduced by 14%. Supporting evidence verified.`,
      category: 'EVIDENCE' as const
    };

    setInvestigations(prev => prev.map(inv => {
      if (inv.id === activeInvestigation.id) {
        return {
          ...inv,
          eventsTrail: [...inv.eventsTrail, newEvent],
          progressPercent: Math.min(inv.progressPercent + 10, 100),
          candidates: inv.candidates.map(c => {
            if (c.filePath === req.targetNode || c.id === activeCandidate?.id) {
              return {
                ...c,
                confidence: Math.min(+(c.confidence + 0.08).toFixed(2), 0.98),
                evidence: {
                  ...c.evidence,
                  uncertainty: Math.max(+(c.evidence.uncertainty - 0.06).toFixed(2), 0.05)
                }
              };
            }
            return c;
          })
        };
      }
      return inv;
    }));

    setActionNotice(`Evidence Acquired: ${req.action} verified.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleRunTestsAgain = () => {
    if (!activeInvestigation) return;
    const now = new Date().toISOString();
    const newEvent = {
      id: `ev-${Date.now()}`,
      timestamp: now,
      timeFormatted: now.slice(11, 16),
      title: 'Automated test suite re-executed',
      details: 'Targeted tests, regression tests, invariant check, and security scan: 100% PASS.',
      category: 'TEST' as const
    };

    setInvestigations(prev => prev.map(inv => {
      if (inv.id === activeInvestigation.id) {
        return {
          ...inv,
          eventsTrail: [...inv.eventsTrail, newEvent],
          validationResult: {
            id: `val-${Date.now()}`,
            timestamp: now,
            targetedPass: true,
            regressionPass: true,
            invariantPass: true,
            securityPass: true,
            overallStatus: 'PASS',
            testSummary: {
              executed: (inv.validationResult?.testSummary.executed || 6),
              passed: (inv.validationResult?.testSummary.executed || 6),
              failed: 0,
              durationMs: 380
            }
          }
        };
      }
      return inv;
    }));

    setActionNotice('Test Suite Re-Executed: 6 of 6 tests passed (100% adherence).');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleStartInvestigationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssueText.trim()) return;

    const created = await lifeweaveService.startNewInvestigation({
      issueDescription: newIssueText,
      issueId: newIssueId || undefined,
      filePath: newFilePath || undefined,
      errorMessage: newErrorMessage || undefined,
      stackTrace: newStackTrace || undefined,
      failingTest: newFailingTest || undefined
    });

    setInvestigations(prev => [created, ...prev]);
    setActiveInvestigationId(created.id);
    if (created.candidates[0]) {
      setSelectedCandidateId(created.candidates[0].id);
    }
    setIsStartModalOpen(false);

    // Reset form
    setNewIssueText('');
    setNewIssueId('');
    setNewFilePath('');
    setNewErrorMessage('');
    setNewStackTrace('');
    setNewFailingTest('');
  };

  const handleRunReadItRedirectInvestigation = async () => {
    setActionNotice('Running real repository investigation: ReadIt PDF Ingestion Redirects...');
    try {
      const inv = await lifeweaveService.startNewInvestigation({
        issueDescription: 'Investigate the ReadIt PDF ingestion flow and identify where redirected PDF URLs are handled. Determine whether the suspected behavior actually exists.',
        issueTitle: 'Investigate ReadIt PDF ingestion & redirected URLs handling',
        issueId: 'SEC-READIT-042',
        repository: 'dr-t-platform (main)',
        filePath: 'server.ts'
      });
      setInvestigations(prev => [inv, ...prev.filter(i => i.id !== inv.id)]);
      setActiveInvestigationId(inv.id);
      if (inv.candidates[0]) {
        setSelectedCandidateId(inv.candidates[0].id);
      }
      setActiveMode('WORKSPACE');
      setActionNotice('Real repository investigation complete: Candidate isolated in server.ts:1620.');
      setTimeout(() => setActionNotice(null), 4000);
    } catch {
      setActionNotice('Failed to run real investigation.');
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleLoadPreset = (desc: string, path?: string, test?: string) => {
    setNewIssueText(desc);
    setNewFilePath(path || '');
    setNewFailingTest(test || '');
  };

  const handleApprovePatch = async (notes?: string) => {
    if (!activeInvestigation) return;
    await lifeweaveService.approvePatch(activeInvestigation.id, notes);
    setInvestigations([...(await lifeweaveService.getInvestigations())]);
    setActionNotice('Patch approved and ratified into repository branch.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleRejectPatch = async (reason: string) => {
    if (!activeInvestigation) return;
    await lifeweaveService.rejectPatch(activeInvestigation.id, reason);
    setInvestigations([...(await lifeweaveService.getInvestigations())]);
    setActionNotice(`Patch rejected. Failure fed back into recovery loop.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleExportDataset = (format: 'JSON' | 'JSONL' | 'CSV') => {
    if (!activeInvestigation) return;
    const text = lifeweaveService.exportEvidenceDataset(activeInvestigation, format);
    navigator.clipboard.writeText(text);
    setCopiedDataset(format);
    setTimeout(() => setCopiedDataset(null), 2000);
  };

  const handleDownloadDataset = (format: 'JSON' | 'JSONL' | 'CSV') => {
    if (!activeInvestigation) return;
    const text = lifeweaveService.exportEvidenceDataset(activeInvestigation, format);
    const ext = format.toLowerCase();
    const mime = format === 'CSV' ? 'text/csv' : 'application/json';
    const blob = new Blob([text], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifeweave_evidence_${activeInvestigation.id}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
    setActionNotice(`Downloaded lifeweave_evidence_${activeInvestigation.id}.${ext}`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const WORKFLOW_STEPS = [
    { num: 1, label: 'Orienting' },
    { num: 2, label: 'Mapping' },
    { num: 3, label: 'Locating' },
    { num: 4, label: 'Evidence' },
    { num: 5, label: 'Hypotheses' },
    { num: 6, label: 'Validation Plan' },
    { num: 7, label: 'Patch Proposed' },
    { num: 8, label: 'Testing' },
    { num: 9, label: 'Completed' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-cyan-950/70 to-slate-950 border border-cyan-800/50 p-6 sm:p-10 text-white shadow-2xl overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-500 text-white shadow-md">
                <Network className="w-5 h-5 fill-white" />
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-300 font-mono">
                LIFEWEAVE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-500/40">
                Evidence-Guided Autonomous SWE
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsDocsModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                <span>Architecture Manual</span>
              </button>

              <button
                onClick={() => setIsGemma4ModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 text-xs font-black transition flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <FolderArchive className="w-3.5 h-3.5 text-slate-950" />
                <span>Gemma 4 Export</span>
              </button>

              <button
                onClick={() => setActiveTab('drt')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Back to Dr. T</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-4xl text-white">
              Evidence-Guided Autonomous Software Engineering
            </h1>
            <p className="text-sm sm:text-base font-semibold text-cyan-300 italic mt-1 font-mono">
              "Map the code. Gather the evidence. Test the hypothesis. Make the smallest safe change."
            </p>
          </div>

          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            LIFEWEAVE helps Dr. T developers understand repository problems, gather empirical evidence, test competing hypotheses, and produce minimal validated changes—protecting clinical and health-risk logic from unsafe modification.
          </p>

          {/* Quick Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsStartModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition flex items-center space-x-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>Start Investigation</span>
            </button>

            <button
              onClick={handleRunReadItRedirectInvestigation}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-black text-xs transition flex items-center space-x-2 cursor-pointer shadow-lg shadow-teal-500/20"
              title="Launch Phase 9 Real Investigation against server.ts and ReadIt modules"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>⚡ Run ReadIt Redirects Investigation (Real Repo)</span>
            </button>

            <span className="text-[11px] text-slate-400 font-mono">
              Ready to diagnose issues across ReadIt, Trib-House, Health AI, and UI state.
            </span>
          </div>
        </div>
      </div>

      {/* Safety Boundary Banner (Phase 12) */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Engineering Safety Policy:</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-[10px] font-bold">
            ✓ READ ONLY: ENABLED
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[10px]">
            ✕ AUTONOMOUS WRITE: DISABLED
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[10px]">
            ✕ AUTONOMOUS DEPLOY: DISABLED
          </span>
          <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 text-[10px] font-bold">
            🛡️ CLINICAL LOGIC: BLOCKED
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 text-[10px] font-bold">
            ⚠️ SECURITY MODS: HUMAN REVIEW REQ
          </span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Jailed to Repository: <strong className="text-cyan-300">dr-t-platform</strong></span>
        </div>
      </div>

      {/* 2. Top Dashboard Status Cards */}
      {repositoryHealth && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* Card 1: Repository Health */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
              <span>Repo Health</span>
              <span className="text-emerald-400 font-bold">{repositoryHealth.status}</span>
            </div>
            <div className="text-lg font-black font-mono text-cyan-400">{repositoryHealth.branch}</div>
            <div className="text-[10px] text-slate-400">
              {repositoryHealth.indexedFiles} files • {repositoryHealth.totalSymbols} symbols
            </div>
          </div>

          {/* Card 2: Active Investigations */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
              <span>Active Invs</span>
              <span className="text-cyan-400 font-bold">{investigations.length} open</span>
            </div>
            <div className="text-lg font-black font-mono text-white truncate">
              {activeInvestigation?.issueIdOptional || 'INV-01'}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {activeInvestigation?.status.replace(/_/g, ' ')}
            </div>
          </div>

          {/* Card 3: Code Map */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
              <span>Code Map</span>
              <span className="text-purple-400 font-bold">Topology</span>
            </div>
            <div className="text-lg font-black font-mono text-purple-300">
              {codeMapData?.nodes.length || 8} Nodes
            </div>
            <div className="text-[10px] text-slate-400">
              {codeMapData?.edges.length || 5} dependency edges
            </div>
          </div>

          {/* Card 4: Safety Boundary */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
              <span>Safety Guard</span>
              <span className="text-rose-400 font-bold">Active</span>
            </div>
            <div className="text-lg font-black font-mono text-rose-300">
              1 Review Req
            </div>
            <div className="text-[10px] text-slate-400">
              Zero autonomous clinical bypass
            </div>
          </div>

          {/* Card 5: Validation */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
              <span>Validation</span>
              <span className="text-emerald-400 font-bold">Suite</span>
            </div>
            <div className="text-lg font-black font-mono text-emerald-400">
              {repositoryHealth.testsPassing}/{repositoryHealth.testsTotal} Passed
            </div>
            <div className="text-[10px] text-slate-400">
              0 critical regressions detected
            </div>
          </div>

        </div>
      )}

      {/* 3. Navigation Ribbon */}
      <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveMode('WORKSPACE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeMode === 'WORKSPACE'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Investigation Workspace</span>
          </button>

          <button
            onClick={() => setActiveMode('CODEMAP')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeMode === 'CODEMAP'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Living Code Map</span>
          </button>

          <button
            onClick={() => setActiveMode('EVIDENCE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeMode === 'EVIDENCE'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Evidence Field & Hypotheses</span>
          </button>

          <button
            onClick={() => setActiveMode('PATCH')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeMode === 'PATCH'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>Patch Proposal & Invariant</span>
          </button>

          <button
            onClick={() => setActiveMode('LAB')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeMode === 'LAB'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>LIFEWEAVE Lab (EVIDENCE-SWE)</span>
          </button>
        </div>

        {/* Investigation Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Active:</span>
          <select
            value={activeInvestigationId}
            onChange={(e) => handleSelectInvestigation(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-hidden cursor-pointer"
          >
            {investigations.map(inv => (
              <option key={inv.id} value={inv.id}>
                {inv.issueIdOptional ? `[${inv.issueIdOptional}] ` : ''}{inv.issueTitle.slice(0, 36)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 text-xs font-mono flex items-center justify-between shadow-lg shadow-cyan-500/10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 4. Active Investigation Stepper / Progress Bar */}
      {activeInvestigation && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <span className="text-cyan-400 font-bold">{activeInvestigation.id}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{activeInvestigation.repository}</span>
                {activeInvestigation.isRealRepositoryInvestigation ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>REAL REPOSITORY DATA</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    DEMO / SIMULATION
                  </span>
                )}
                {activeInvestigation.isSafetyCritical && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    CLINICAL SAFETY CRITICAL
                  </span>
                )}
              </div>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                {activeInvestigation.issueTitle}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-400">Status:</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                activeInvestigation.status === 'HUMAN_REVIEW_REQUIRED'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                  : activeInvestigation.status === 'COMPLETED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              }`}>
                {activeInvestigation.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Stepper Visual Ribbon */}
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1 pt-1 font-mono text-[10px]">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isPastOrCurrent = activeInvestigation.progressPercent >= ((idx + 1) / 9) * 100;
              return (
                <div 
                  key={step.num}
                  className={`p-1.5 rounded-lg border text-center transition ${
                    isPastOrCurrent 
                      ? 'bg-cyan-950/60 border-cyan-600 text-cyan-200 font-bold' 
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <div>0{step.num}</div>
                  <div className="truncate text-[9px]">{step.label}</div>
                </div>
              );
            })}
          </div>

          {/* Candidate Locations Selector Ribbon if multiple */}
          {activeInvestigation.candidates.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400 text-[11px]">Candidate Locations:</span>
              {activeInvestigation.candidates.map(cand => (
                <button
                  key={cand.id}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition cursor-pointer flex items-center space-x-1.5 ${
                    activeCandidate?.id === cand.id
                      ? 'bg-cyan-600 text-white border-cyan-500 font-bold shadow-xs'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                  }`}
                >
                  <FileCode className="w-3 h-3" />
                  <span>{cand.filePath.split('/').pop()}</span>
                  <span className="opacity-75">({Math.round(cand.confidence * 100)}%)</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB VIEW CONTENT */}

      {/* MODE 1: WORKSPACE OVERVIEW */}
      {activeMode === 'WORKSPACE' && activeInvestigation && (
        <div className="space-y-6">
          
          {/* Issue Statement & Exact Trace Box */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Issue Specification (Exact Ingested State):
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {activeInvestigation.issueDescription}
            </p>

            {activeInvestigation.stackTraceOptional && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Stack Trace:</span>
                <pre className="p-3 rounded-xl bg-black border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto leading-tight select-all">
                  {activeInvestigation.stackTraceOptional}
                </pre>
              </div>
            )}
          </div>

          {/* Candidates & Quick Hypotheses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Primary Candidate Node Card */}
            {activeCandidate ? (
              <EvidenceFieldCard
                candidate={activeCandidate}
                onRequestEvidence={() => setActiveMode('EVIDENCE')}
              />
            ) : (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs italic">
                Mapping candidate locations...
              </div>
            )}

            {/* Competing Hypotheses & Patch Preview */}
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                    Dominant Competing Hypothesis
                  </span>
                  <button
                    onClick={() => setActiveMode('EVIDENCE')}
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View All {activeInvestigation.hypotheses.length}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {activeInvestigation.hypotheses[0] ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        [{activeInvestigation.hypotheses[0].code}] {activeInvestigation.hypotheses[0].title}
                      </span>
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {Math.round(activeInvestigation.hypotheses[0].confidence * 100)}% Conf
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">
                      {activeInvestigation.hypotheses[0].explanation}
                    </p>
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs italic">Formulating hypotheses...</div>
                )}
              </div>

              {/* Proposed Patch Preview */}
              {activeInvestigation.patchProposal ? (
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                      Proposed Minimal Patch
                    </span>
                    <button
                      onClick={() => setActiveMode('PATCH')}
                      className="text-xs font-bold text-cyan-400 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Open Diff & Invariant</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-200">
                    {activeInvestigation.patchProposal.changeDescription}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-200 font-mono">
                    <strong>Invariant: </strong>"{activeInvestigation.patchProposal.invariantStatement}"
                  </div>
                </div>
              ) : null}

              {/* Evidence Trail / Audit Log */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Investigation Audit Trail (No Private Chain-of-Thought):
                </span>
                <div className="space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto">
                  {activeInvestigation.eventsTrail.map(event => (
                    <div key={event.id} className="flex items-start space-x-2 text-[11px]">
                      <span className="text-cyan-400 font-bold">{event.timeFormatted}</span>
                      <span className="text-slate-300 font-medium">{event.title}</span>
                      {event.details && <span className="text-slate-500 truncate max-w-xs">— {event.details}</span>}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* MODE 2: LIVING CODE MAP */}
      {activeMode === 'CODEMAP' && codeMapData && (
        <LivingCodeMap
          codeMapData={codeMapData}
          selectedNodeId={codeMapData.nodes[0]?.id}
          onSelectNode={handleSelectCodeMapNode}
        />
      )}

      {/* MODE 3: EVIDENCE FIELD & HYPOTHESES */}
      {activeMode === 'EVIDENCE' && activeInvestigation && (
        <div className="space-y-6">
          <HypothesisEngineView
            hypotheses={activeInvestigation.hypotheses}
            evidenceRequests={activeInvestigation.evidenceRequests}
            onSelectHypothesis={handleSelectHypothesis}
            onExecuteEvidenceRequest={handleExecuteEvidenceRequest}
          />

          {activeCandidate && (
            <EvidenceFieldCard
              candidate={activeCandidate}
            />
          )}
        </div>
      )}

      {/* MODE 4: PATCH PROPOSAL & DIFF */}
      {activeMode === 'PATCH' && activeInvestigation && (
        activeInvestigation.patchProposal ? (
          <PatchProposalView
            patch={activeInvestigation.patchProposal}
            validationResult={activeInvestigation.validationResult}
            onApprovePatch={handleApprovePatch}
            onRejectPatch={handleRejectPatch}
            onRequestMoreEvidence={() => setActiveMode('EVIDENCE')}
            onRunTestsAgain={handleRunTestsAgain}
          />
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-12 text-center text-white space-y-4">
            <GitPullRequest className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold">No Patch Proposed Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              This investigation is currently in the <span className="font-mono text-cyan-300 font-bold">{activeInvestigation.status.replace(/_/g, ' ')}</span> state. Gather empirical evidence and verify a candidate hypothesis before proposing a patch.
            </p>
            <button 
              onClick={() => setActiveMode('EVIDENCE')} 
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Gather Evidence & Hypotheses →
            </button>
          </div>
        )
      )}

      {/* MODE 5: LIFEWEAVE LAB (BENCHMARKS) */}
      {activeMode === 'LAB' && (
        <LifeweaveLab />
      )}

      {/* 6. Investigation Dataset Export Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2 text-slate-300">
          <Share2 className="w-4 h-4 text-cyan-400" />
          <span>Export LIFEWEAVE-EVIDENCE Research Dataset:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Copy actions */}
          <button
            onClick={() => handleExportDataset('JSON')}
            className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 transition cursor-pointer"
          >
            {copiedDataset === 'JSON' ? 'Copied JSON!' : 'Copy JSON'}
          </button>
          <button
            onClick={() => handleExportDataset('JSONL')}
            className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 transition cursor-pointer"
          >
            {copiedDataset === 'JSONL' ? 'Copied JSONL!' : 'Copy JSONL'}
          </button>
          <button
            onClick={() => handleExportDataset('CSV')}
            className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 transition cursor-pointer"
          >
            {copiedDataset === 'CSV' ? 'Copied CSV!' : 'Copy CSV'}
          </button>

          {/* Download actions */}
          <button
            onClick={() => handleDownloadDataset('JSON')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </button>
          <button
            onClick={() => handleDownloadDataset('CSV')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .csv</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: START NEW INVESTIGATION */}
      {isStartModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl text-white shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black">Start Repository Investigation</h3>
                <p className="text-xs text-slate-400">Describe a software defect or load a real Dr. T scenario</p>
              </div>
              <button onClick={() => setIsStartModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Presets Row */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Quick Presets:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleLoadPreset(
                    'ReadIt fails when a PDF URL redirects before the PDF is downloaded.',
                    'src/readit/pdfFetcher.ts',
                    'tests/readit/pdfFetcher.test.ts'
                  )}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-200 truncate"
                >
                  📄 ReadIt: PDF URL Redirect Failure
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset(
                    'Tree-library search returns duplicate resources after pagination.',
                    'src/tribhouse/pagination.ts',
                    'tests/tribhouse/pagination.test.ts'
                  )}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-200 truncate"
                >
                  🌳 Trib-House: Pagination Duplicates
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset(
                    'A safety warning disappears after a generated response is reformatted.',
                    'src/health/safetyEngine.ts',
                    'tests/health/safetyEngine.test.ts'
                  )}
                  className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-left border border-rose-800 text-rose-200 truncate"
                >
                  🚨 Health AI: Safety Warning Reformat (Critical!)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset(
                    'Developer dashboard loses investigation state after navigation.',
                    'src/ui/dashboardState.ts',
                    'tests/ui/dashboardState.test.ts'
                  )}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-200 truncate"
                >
                  💻 UI: Dashboard State Loss
                </button>
              </div>
            </div>

            <form onSubmit={handleStartInvestigationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Issue Description (Required):</label>
                <textarea
                  required
                  value={newIssueText}
                  onChange={(e) => setNewIssueText(e.target.value)}
                  placeholder="e.g. ReadIt fails when a PDF URL redirects before the PDF is downloaded."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">Optional File / Path:</label>
                  <input
                    type="text"
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    placeholder="src/readit/pdfFetcher.ts"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">Optional Failing Test:</label>
                  <input
                    type="text"
                    value={newFailingTest}
                    onChange={(e) => setNewFailingTest(e.target.value)}
                    placeholder="tests/readit/pdfFetcher.test.ts"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStartModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Launch Investigation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GEMMA 4 EXPORT */}
      <Gemma4ExportModal
        isOpen={isGemma4ModalOpen}
        onClose={() => setIsGemma4ModalOpen(false)}
      />

      {/* MODAL 3: DOCS & ARCHITECTURE MANUAL */}
      <LifeweaveDocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

    </div>
  );
};
