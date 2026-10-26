import React, { useState } from 'react';
import { BuildWithAiProject, ChecklistItem } from '../types';
import { 
  Trophy, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Terminal, 
  HelpCircle, 
  ShieldAlert, 
  Calendar,
  Link,
  Video,
  FileCode,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface LearnAiBasicsViewProps {
  project: BuildWithAiProject;
  onUpdateProject: (updated: BuildWithAiProject) => void;
}

export const LearnAiBasicsView: React.FC<LearnAiBasicsViewProps> = ({
  project,
  onUpdateProject
}) => {
  const [copiedCli, setCopiedCli] = useState<string | null>(null);
  const [repoUrlInput, setRepoUrlInput] = useState<string>(project.checklist.repositoryUrl || '');
  const [videoUrlInput, setVideoUrlInput] = useState<string>(project.checklist.demoVideoUrl || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const checklist = project.checklist;
  const items = checklist.items;

  const totalCount = items.length;
  const completedCount = items.filter(i => i.completed).length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleItem = (itemId: string) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          completed: !item.completed,
          verified: !item.completed ? Boolean(item.evidence) : false
        };
      }
      return item;
    });

    const updatedProject: BuildWithAiProject = {
      ...project,
      checklist: {
        ...project.checklist,
        items: updatedItems
      },
      updatedAt: new Date().toISOString()
    };

    onUpdateProject(updatedProject);
  };

  const handleSaveEvidence = () => {
    const updatedProject: BuildWithAiProject = {
      ...project,
      checklist: {
        ...project.checklist,
        repositoryUrl: repoUrlInput.trim(),
        demoVideoUrl: videoUrlInput.trim()
      },
      updatedAt: new Date().toISOString()
    };

    onUpdateProject(updatedProject);
    setSaveStatus('Evidence URLs updated and saved.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCli(key);
    setTimeout(() => setCopiedCli(null), 2000);
  };

  const skillPackCommand = `# 1. Project Directory Initialization
mkdir my-ai-project && cd my-ai-project
git init

# 2. Planning Artifacts Integration
# Copy approved scope.md, prd.md, and spec.md from Dr. T into your project root.

# 3. Agent Execution & Implementation
# Point your coding agent (Claude Code, Cursor, Gemini CLI) to spec.md to generate components and tests.
npm install && npm test
`;

  return (
    <div className="space-y-8">
      {/* Project Quality & Release Audit Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-300/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-2xs flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quality & Release Audit</span>
            </span>
            <span className="text-xs font-mono text-slate-500">
              Last Verified: {checklist.lastVerifiedDate}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-display">
            Project Quality & Release Readiness
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Audit, track, and verify critical software engineering criteria for your AI project. Dr. T guides your project definition, generates required planning artifacts (<code>scope.md</code>, <code>prd.md</code>, <code>spec.md</code>), validates deterministic safety fallbacks, and prepares verifiable repository and demonstration assets.
          </p>
        </div>

        {/* Readiness Circular / Pill Metric */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 text-center shrink-0 shadow-sm space-y-1 min-w-[180px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Readiness Score
          </span>
          <div className="text-3xl font-black text-emerald-600 font-display">
            {progressPct}%
          </div>
          <span className="text-xs font-medium text-slate-600 block">
            {completedCount} of {totalCount} criteria met
          </span>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Coding Agent & Skill Pack Workflow */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                AI Coding Agent & Skill Pack Workflow
              </h3>
              <p className="text-xs text-slate-400">
                Recommended command workflow for AI coding tools (Claude Code, Cursor, Gemini CLI)
              </p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(skillPackCommand, 'skillpack')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition flex items-center space-x-1 border border-white/10 cursor-pointer"
          >
            {copiedCli === 'skillpack' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCli === 'skillpack' ? 'Copied Commands!' : 'Copy Workflow Script'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 text-xs font-mono text-slate-300 space-y-2 overflow-x-auto leading-relaxed">
          <p className="text-teal-400 font-bold">
            # Structured Agent Workflow:
          </p>
          <p>
            AI development works best when guided by rigorous planning specifications. Dr. T Build With AI creates, verifies, and exports your complete <code>scope.md</code>, <code>prd.md</code>, and <code>spec.md</code> to direct your coding agent's implementation sprints.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Define in Dr. T</span>
            <span className="text-slate-200">Prepare scope, PRD, and architecture with AI guidance.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">2. Export Artifacts</span>
            <span className="text-slate-200">Save Markdown files into your workspace project root.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">3. Agent Execution</span>
            <span className="text-slate-200">Prompt coding agents with specs to build and test.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">4. Quality & Release</span>
            <span className="text-slate-200">Verify automated tests, zero secrets, and production build.</span>
          </div>
        </div>
      </div>

      {/* Submission Evidence Form */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Link className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Verifiable Submission Evidence</h3>
          </div>
          {saveStatus && (
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg">
              {saveStatus}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Public GitHub Repository URL *</label>
            <input
              type="url"
              value={repoUrlInput}
              onChange={e => setRepoUrlInput(e.target.value)}
              placeholder="https://github.com/your-username/your-project"
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Public Demo Video URL (Max 3 Min) *</label>
            <input
              type="url"
              value={videoUrlInput}
              onChange={e => setVideoUrlInput(e.target.value)}
              placeholder="https://youtu.be/..."
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveEvidence}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Save Evidence Links
          </button>
        </div>
      </div>

      {/* Detailed 14-Point Readiness Checklist */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          14-Point Quality, Testing & Release Readiness Checklist
        </h3>

        <div className="space-y-3">
          {items.map(item => {
            return (
              <div
                key={item.id}
                onClick={() => handleToggleItem(item.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start space-x-3 select-none ${
                  item.completed
                    ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                  item.completed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}>
                  {item.completed && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1 text-xs space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-bold ${item.completed ? 'text-emerald-950' : 'text-slate-900'}`}>
                      {item.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-slate-200 text-slate-700">
                      {item.category}
                    </span>
                    {item.required && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {item.description}
                  </p>
                  {item.evidence && (
                    <div className="text-[10px] font-mono text-indigo-700 pt-0.5">
                      Evidence: {item.evidence}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
