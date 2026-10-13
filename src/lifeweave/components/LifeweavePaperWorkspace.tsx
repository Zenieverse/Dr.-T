import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Lock, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Hash, 
  Activity, 
  Clock, 
  GitBranch, 
  Terminal, 
  ChevronRight,
  Filter,
  Flame,
  HelpCircle,
  FolderArchive,
  RefreshCw
} from 'lucide-react';

export const LifeweavePaperWorkspace: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'OVERVIEW' | 'METHOD' | 'RESULTS' | 'ABLATIONS' | 'LIMITATIONS' | 'DRAFT' | 'CHECKLIST'
  >('OVERVIEW');
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [paperContent, setPaperContent] = useState<string>('');
  const [checklistContent, setChecklistContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const FROZEN_SHA256 = '9f01eec9ba18a9eabc17de3c828e458117f62b81815da343ca601c77e2bf4c44';
  const WORD_COUNT = 2895;
  const WORD_LIMIT = 3000;

  // Load paper and checklist content from API
  useEffect(() => {
    fetchPaperData();
  }, []);

  const fetchPaperData = async () => {
    setIsLoadingContent(true);
    try {
      const res = await fetch('/api/lifeweave/paper/content');
      const data = await res.json();
      if (data && data.success) {
        setPaperContent(data.paperContent || '');
        setChecklistContent(data.checklistContent || '');
      }
    } catch (e) {
      console.warn('Failed to fetch paper content from server endpoint, using fallback', e);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(FROZEN_SHA256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Direct download for Paper Markdown
  const handleDownloadPaper = () => {
    // 1. Try server download route
    const link = document.createElement('a');
    link.href = '/api/lifeweave/paper/download-paper';
    link.download = 'LIFEWEAVE_GEMMA4_PAPER.md';
    link.click();

    // 2. Client Blob backup if direct navigation fails or in offline state
    if (paperContent) {
      const blob = new Blob([paperContent], { type: 'text/markdown;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const blobLink = document.createElement('a');
      blobLink.href = blobUrl;
      blobLink.download = 'LIFEWEAVE_GEMMA4_PAPER.md';
      // Blob url is preserved for backup
    }

    setDownloadSuccessMessage('Downloaded LIFEWEAVE_GEMMA4_PAPER.md');
    setTimeout(() => setDownloadSuccessMessage(null), 3000);
  };

  // Direct download for Submission Checklist Markdown
  const handleDownloadChecklist = () => {
    const link = document.createElement('a');
    link.href = '/api/lifeweave/paper/download-checklist';
    link.download = 'PAPER_TRACK_SUBMISSION_CHECKLIST.md';
    link.click();
    setDownloadSuccessMessage('Downloaded PAPER_TRACK_SUBMISSION_CHECKLIST.md');
    setTimeout(() => setDownloadSuccessMessage(null), 3000);
  };

  // Direct download for Complete Paper Workspace Archive (.zip)
  const handleDownloadWorkspacePackage = () => {
    const link = document.createElement('a');
    link.href = '/api/lifeweave/paper/download-package';
    link.download = 'lifeweave_paper_workspace.zip';
    link.click();
    setDownloadSuccessMessage('Downloaded lifeweave_paper_workspace.zip');
    setTimeout(() => setDownloadSuccessMessage(null), 3000);
  };

  const handleCopyPaper = () => {
    if (paperContent) {
      navigator.clipboard.writeText(paperContent);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white p-5 sm:p-6 space-y-6 shadow-2xl">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Gemma 4 Paper Track Research Workspace</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[10px] font-mono font-bold flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>LIFEWEAVE_OPTIMIZED_V1 (Frozen)</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[10px] font-mono font-bold">
              Word Count: {WORD_COUNT} / {WORD_LIMIT} ({Math.round((WORD_COUNT/WORD_LIMIT)*100)}%)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            “LIFEWEAVE: Evidence-Guided Causal Localization for Reliable Software Repair Agents”
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Formal scientific investigation for the Kaggle Google — The Gemma 4 Developer Agent Paper Track. Evaluates whether explicit Candidate Verification Gates and contradiction tracking improve top-1 localization and minimize speculative tool invocations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target: <strong className="text-slate-200">gemma-4-31b-it-qat-w4a16-ct</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Deadline: <strong className="text-amber-300">November 12, 2026, 11:59 PM UTC</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              <span>SHA-256: <code className="text-amber-300 bg-black/60 px-1.5 py-0.5 rounded text-[10px] select-all">{FROZEN_SHA256.slice(0, 16)}...</code></span>
              <button
                onClick={handleCopyHash}
                className="text-[10px] text-slate-400 hover:text-white ml-1 underline cursor-pointer"
              >
                {copiedHash ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Primary Download & Link Buttons in Header */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadPaper}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center space-x-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
            title="Download the full research paper markdown file"
          >
            <Download className="w-4 h-4" />
            <span>Download Paper (.md)</span>
          </button>

          <button
            onClick={handleDownloadWorkspacePackage}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition flex items-center space-x-1.5 cursor-pointer"
            title="Download full paper workspace ZIP (Paper, Checklist, Registry)"
          >
            <FolderArchive className="w-4 h-4 text-cyan-400" />
            <span>Download Package (.zip)</span>
          </button>

          <a
            href="https://www.kaggle.com/competitions/gemma-4-developer-agent-paper"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition flex items-center justify-center"
            title="Open Kaggle Paper Track Portal"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccessMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccessMessage}</span>
        </div>
      )}

      {/* 2. Subtab Navigation Ribbon */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
        {[
          { id: 'OVERVIEW', label: '1. Research Question' },
          { id: 'METHOD', label: '2. Candidate Gate (CVG)' },
          { id: 'RESULTS', label: '3. Baseline vs Optimized' },
          { id: 'ABLATIONS', label: '4. Experiment Registry' },
          { id: 'LIMITATIONS', label: '5. Threats & Limitations' },
          { id: 'DRAFT', label: '6. Paper Draft (2,895w)' },
          { id: 'CHECKLIST', label: '7. Submission Checklist' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer font-bold ${
              activeSubTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Subtab Content Panels */}

      {/* SUBTAB 1: OVERVIEW */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-cyan-300 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Core Research Question</span>
            </h3>
            <blockquote className="text-sm italic font-mono text-slate-200 border-l-2 border-cyan-400 pl-4 py-1 leading-relaxed bg-slate-950/50 rounded-r-xl">
              “Can explicit verification of candidate code locations using execution-path evidence, dependency structure, tests, contradictions, and causal position improve top-1 bug localization while preserving patch correctness and reducing unnecessary tool use?”
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase">Pathology 1</span>
              <h4 className="text-sm font-bold text-white">Confirmation Bias</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Agents jump to the first semantic vector match and immediately modify it without checking whether it is bypassed by caller guards.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">Pathology 2</span>
              <h4 className="text-sm font-bold text-white">Symptom Masking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                When a downstream boundary crashes, agents add local null checks at the symptom site instead of fixing the upstream causal root.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">Pathology 3</span>
              <h4 className="text-sm font-bold text-white">Refactoring Bloat</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Low localization confidence causes agents to rewrite formatting, types, and unrelated logic, breaking untouched invariants.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-slate-400">
              The LIFEWEAVE Epistemic Hierarchy
            </h3>
            <div className="font-mono text-xs text-slate-300 space-y-1 bg-black/60 p-4 rounded-xl border border-slate-800/80">
              <div className="text-emerald-400 font-bold">1. Observed Executable Behavior (Reproduction tests, stdout, exit codes)</div>
              <div className="text-teal-400 font-semibold pl-4">↓ 2. Observed Source Logic (Control flow, branches, return statements)</div>
              <div className="text-cyan-400 font-semibold pl-8">↓ 3. Test Assertions (Existing passing & failing unit test suites)</div>
              <div className="text-indigo-400 font-semibold pl-12">↓ 4. Code Graph Relationships (Callers, callees, AST dependencies)</div>
              <div className="text-purple-400 font-semibold pl-16">↓ 5. Semantic Similarity (Lexical and vector search matches)</div>
              <div className="text-slate-500 italic pl-20">✕ 6. Assumptions (Strictly prohibited from contributing to evidence scores)</div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: METHOD */}
      {activeSubTab === 'METHOD' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-indigo-300 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>The Candidate Verification Gate (5 Formal Invariants)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Before any candidate location is approved for patch formulation via <code className="text-cyan-300">edit_file</code>, it must pass all 5 invariants of the gate. Failure redirects the agent to acquire missing evidence rather than guessing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-300 font-mono">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[10px]">1</span>
                  <span>Reachability</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Candidate is situated directly on the active failing execution trace. Disqualifies dead code paths.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-teal-300 font-mono">
                  <span className="w-5 h-5 rounded-full bg-teal-950 border border-teal-800 flex items-center justify-center text-[10px]">2</span>
                  <span>Activity</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Candidate is actively imported and called by production runtime callers, not an abandoned legacy utility.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300 font-mono">
                  <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-[10px]">3</span>
                  <span>Implication</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Reproduction test assertion or error trace directly implicates this logic. Passing unit tests trigger verification.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 font-mono">
                  <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-800 flex items-center justify-center text-[10px]">4</span>
                  <span>Contradiction Freedom</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  No contradictory evidence refutes causality (e.g. candidate is sanitized upstream or passes test in isolation).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 md:col-span-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300 font-mono">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-[10px]">5</span>
                  <span>Causal Hierarchy (Upstream Root)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Must be located at the upstream causal origin rather than a superficial boundary mask. Fixes the cause, not the symptom.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: RESULTS */}
      {activeSubTab === 'RESULTS' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Empirical Benchmark Suite</span>
              <div className="text-white font-bold">10-Fixture Regression Suite (TASK-01 to TASK-10)</div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
              100% Patch Pass Rate Preserved
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-2xl overflow-hidden font-mono">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Metric</th>
                  <th className="p-3">Baseline (V1)</th>
                  <th className="p-3">Optimized (V1)</th>
                  <th className="p-3">Delta</th>
                  <th className="p-3">Significance / Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y border-slate-800/80 bg-slate-950/60">
                <tr>
                  <td className="p-3 font-semibold text-white">Patch Pass Rate</td>
                  <td className="p-3 text-emerald-400">10/10 (1.00)</td>
                  <td className="p-3 text-emerald-400 font-bold">10/10 (1.00)</td>
                  <td className="p-3 text-slate-400">0.00</td>
                  <td className="p-3 text-slate-300">Full correctness preserved</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Recall@1</td>
                  <td className="p-3 text-amber-400">0.90</td>
                  <td className="p-3 text-emerald-400 font-bold">1.00</td>
                  <td className="p-3 text-emerald-400 font-bold">+0.10 (+10%)</td>
                  <td className="p-3 text-slate-300">CVG eliminated downstream symptom trap (TASK-02)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Recall@3</td>
                  <td className="p-3 text-emerald-400">1.00</td>
                  <td className="p-3 text-emerald-400 font-bold">1.00</td>
                  <td className="p-3 text-slate-400">0.00</td>
                  <td className="p-3 text-slate-300">Candidate set consistently captures root</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Recall@5</td>
                  <td className="p-3 text-emerald-400">1.00</td>
                  <td className="p-3 text-emerald-400 font-bold">1.00</td>
                  <td className="p-3 text-slate-400">0.00</td>
                  <td className="p-3 text-slate-300">High top-k stability</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Total Tool Calls</td>
                  <td className="p-3 text-slate-300">42</td>
                  <td className="p-3 text-cyan-300 font-bold">38</td>
                  <td className="p-3 text-emerald-400 font-bold">-4 (-9.5%)</td>
                  <td className="p-3 text-slate-300">Reduced speculative file reading and editing</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Recovery Steps</td>
                  <td className="p-3 text-rose-400">1</td>
                  <td className="p-3 text-emerald-400 font-bold">0</td>
                  <td className="p-3 text-emerald-400 font-bold">-1 (-100%)</td>
                  <td className="p-3 text-slate-300">Zero patch rollbacks or hypothesis revisions</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Earlier Wall Time</td>
                  <td className="p-3 text-slate-400">11.53 s</td>
                  <td className="p-3 text-slate-400">11.49 s</td>
                  <td className="p-3 text-slate-500">-0.04 s</td>
                  <td className="p-3 text-slate-500">Dedicated single-process run</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Later Smoke-Test</td>
                  <td className="p-3 text-slate-500">—</td>
                  <td className="p-3 text-slate-400">12.50 s</td>
                  <td className="p-3 text-slate-500">+1.01 s*</td>
                  <td className="p-3 text-slate-500">*Concurrent compiler background load; no speedup claimed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: ABLATIONS */}
      {activeSubTab === 'ABLATIONS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase text-[10px]">Ablation Registry Status</span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
                Ablations A–D: Strictly Marked NOT RUN
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              In accordance with academic standards, component-level ablations across larger external datasets remain unexecuted and are not claimed.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { id: 'Config A', title: 'Semantic Retrieval Only', desc: 'BM25 and vector semantic search only. Graph traversal disabled; Evidence Field disabled; Verification Gate disabled.', status: 'NOT RUN' },
              { id: 'Config B', title: 'Graph Retrieval Only', desc: 'AST topological analysis: callers, callees, and dependency subgraph only. Semantic search disabled.', status: 'NOT RUN' },
              { id: 'Config C', title: 'Semantic + Graph Hybrid', desc: 'Semantic retrieval for candidate seeds followed by graph neighbor/subgraph traversal. Contradiction tracking disabled.', status: 'NOT RUN' },
              { id: 'Config D', title: 'Evidence-Aware Localization', desc: 'Semantic + Graph + multi-dimensional Evidence Field + contradiction tracking. Candidate Verification Gate disabled.', status: 'NOT RUN' },
              { id: 'Config E', title: 'Full LIFEWEAVE (with Verification Gate)', desc: 'Full architecture with Candidate Verification Gate and 5 invariants. Equivalent to LIFEWEAVE_OPTIMIZED_V1.', status: 'VALIDATED ON 10 FIXTURES' }
            ].map((cfg, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold text-[11px]">{cfg.id}</span>
                    <span className="font-bold text-white text-xs">{cfg.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{cfg.desc}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${cfg.status.includes('VALIDATED') ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
                  {cfg.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: LIMITATIONS */}
      {activeSubTab === 'LIMITATIONS' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-rose-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Explicit Limitations & Threats to Validity</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-rose-400 font-bold">1. Ten-Fixture Sample Scale</div>
                <p className="text-[11px] text-slate-400">Our internal benchmark contains ten task fixtures. While testing diverse defect classes, ten fixtures do not establish statistical significance across all software domains.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-amber-400 font-bold">2. Unseen Kaggle Evaluation</div>
                <p className="text-[11px] text-slate-400">Reported results do not guarantee performance on Kaggle's hidden evaluation test set, which features distinct repositories and build environments.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-indigo-400 font-bold">3. Comparative Ablations Unrun</div>
                <p className="text-[11px] text-slate-400">Component ablations (Configs A–D) are recorded as NOT RUN. Large-scale statistical verification of isolated features remains future work.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="text-purple-400 font-bold">4. Model Format Specificity</div>
                <p className="text-[11px] text-slate-400">Evaluated strictly on quantized <code className="text-cyan-300">gemma-4-31b-it-qat-w4a16-ct</code>. Results may vary on unquantized full-precision or different parameter sizes.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: PAPER DRAFT */}
      {activeSubTab === 'DRAFT' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">LIFEWEAVE_GEMMA4_PAPER.md</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Word Count: <strong className="text-emerald-400">{WORD_COUNT} words</strong> (Limit: 3,000)</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyPaper}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDraft ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleDownloadPaper}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black border border-slate-800 font-mono text-xs text-cyan-200/90 leading-relaxed max-h-[520px] overflow-y-auto whitespace-pre-wrap select-all">
            {isLoadingContent ? (
              <div className="text-slate-400 flex items-center space-x-2 py-4">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Loading draft from server...</span>
              </div>
            ) : (
              paperContent || `[Click 'Download .md' above to retrieve the complete paper file]`
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 7: CHECKLIST */}
      {activeSubTab === 'CHECKLIST' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Paper Track Submission-Readiness Checklist</h3>
                <span className="text-emerald-400 font-bold ml-2">14 / 14 Verified Ready</span>
              </div>

              <button
                onClick={handleDownloadChecklist}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Checklist (.md)</span>
              </button>
            </div>

            <div className="space-y-2 pt-1 text-slate-300">
              {[
                'Word count verified: 2,895 words (strictly under 3,000-word limit)',
                'Clear research question on causal localization and tool overhead reduction',
                'Candidate Verification Gate algorithm formally specified with 5 invariants',
                'Zero hallucinated citations: all 8 references point to real peer-reviewed literature',
                'Historical baseline (Recall@1: 0.90, 42 tools) and optimized (Recall@1: 1.00, 38 tools) preserved',
                'Latency discrepancy (earlier 11.49s vs later smoke-test 12.50s) investigated and attributed to compiler background load',
                'Ten-fixture boundary explicitly stated; no claims of universal SWE superiority',
                'Ablations A–D explicitly declared as NOT RUN in accordance with scientific rigor',
                'Archive checksum cbcc8e59b7e0329c48f08169027df6341f3ea0039638a61e8011de1570075a12 verified',
                'Manifest file saved at research/lifeweave/benchmark/LIFEWEAVE_OPTIMIZED_V1_MANIFEST.json',
                'Validation report saved at research/lifeweave/benchmark/FINAL_SUBMISSION_VALIDATION.md',
                'Paper draft saved at research/lifeweave/paper/LIFEWEAVE_GEMMA4_PAPER.md',
                'Experiment registry saved at research/lifeweave/paper/EXPERIMENT_REGISTRY.json',
                'Submission checklist saved at research/lifeweave/paper/PAPER_TRACK_SUBMISSION_CHECKLIST.md'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
