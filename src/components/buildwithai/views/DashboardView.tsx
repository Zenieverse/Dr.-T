import React from 'react';
import { BuildWithAiProject } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  ArrowRight, 
  Bot, 
  ShieldCheck, 
  ExternalLink,
  Kanban,
  Code2,
  Trophy,
  Flame,
  FileCheck,
  Layers
} from 'lucide-react';

interface DashboardViewProps {
  project: BuildWithAiProject;
  setActiveSubtab: (subtab: string) => void;
  onUpdateProject: (updated: BuildWithAiProject) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  setActiveSubtab,
  onUpdateProject
}) => {
  const documents = project.documents;
  const docKeys: Array<'scope.md' | 'prd.md' | 'spec.md' | 'README.md'> = ['scope.md', 'prd.md', 'spec.md', 'README.md'];
  
  const approvedDocsCount = docKeys.filter(k => documents[k]?.isApproved).length;
  const totalTasks = project.tasks.length;
  const doneTasks = project.tasks.filter(t => t.status === 'done').length;
  const taskProgressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  
  const checklistTotal = project.checklist.items.length;
  const checklistDone = project.checklist.items.filter(i => i.completed).length;
  const checklistProgressPct = checklistTotal > 0 ? Math.round((checklistDone / checklistTotal) * 100) : 0;

  const stageOrder = ['discover', 'scope', 'plan', 'specify', 'build', 'test', 'document', 'publish'];
  const currentStageIndex = stageOrder.indexOf(project.stage);

  return (
    <div className="space-y-6">
      {/* Template Notice Banner if Template */}
      {project.isTemplate && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start space-x-3 text-amber-900 shadow-xs">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-amber-950">Demonstration Template: HealthAlert Mini</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono text-[10px] font-bold">Read-Only Template</span>
            </div>
            <p className="text-amber-800/90 leading-relaxed">
              This is a synthetic reference project demonstrating an approved <code>scope.md</code>, <code>prd.md</code>, and <code>spec.md</code> for the Devpost Learn AI Basics challenge. You can review its architecture, duplicate it as a starting point, or create your own project anew.
            </p>
          </div>
        </div>
      )}

      {/* Hero Overview Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-indigo-900/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Stage: {project.stage.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/10 text-slate-200 border border-white/10 flex items-center space-x-1">
                <Bot className="w-3.5 h-3.5 text-teal-400" />
                <span>{project.modelPreference}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                Devpost Learn AI Basics
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              {project.name}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {project.tagline || project.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target: {project.targetAudience.slice(0, 45)}...</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Pillar */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Docs Approved</span>
              <div className="text-2xl font-black text-teal-300 font-display">
                {approvedDocsCount}/4
              </div>
              <span className="text-[10px] text-slate-400">Core artifacts</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tasks Done</span>
              <div className="text-2xl font-black text-amber-300 font-display">
                {doneTasks}/{totalTasks}
              </div>
              <span className="text-[10px] text-slate-400">{taskProgressPct}% sprint</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Devpost Ready</span>
              <div className="text-2xl font-black text-purple-300 font-display">
                {checklistProgressPct}%
              </div>
              <span className="text-[10px] text-slate-400">{checklistDone}/{checklistTotal} rules</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8-Stage Lifecycle Progress Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">8-Stage AI Project Lifecycle</h3>
          </div>
          <button 
            onClick={() => setActiveSubtab('lifecycle')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {stageOrder.map((s, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div 
                key={s} 
                onClick={() => {
                  onUpdateProject({ ...project, stage: s as any });
                }}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer select-none ${
                  isCurrent
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-2xs'
                    : isDone
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] font-mono font-bold uppercase">{idx + 1}. {s}</div>
                <div className="text-[9px] mt-0.5">
                  {isCurrent ? '⚡ Active' : isDone ? '✓ Done' : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverables & Next Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliverables Status Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Required Challenge Planning Artifacts</h3>
            </div>
            <button 
              onClick={() => setActiveSubtab('editor')}
              className="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center space-x-1"
            >
              <span>Open Document Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {docKeys.map(key => {
              const doc = documents[key];
              const isApproved = doc?.isApproved;
              const hasErrors = doc?.validationErrors && doc.validationErrors.length > 0;
              return (
                <div 
                  key={key}
                  onClick={() => setActiveSubtab('editor')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 transition cursor-pointer bg-slate-50/50 hover:bg-white space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-teal-700">
                      {key}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isApproved 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : hasErrors 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isApproved ? 'Approved ✓' : hasErrors ? 'Needs Sections' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {doc?.title}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Updated {new Date(doc?.lastUpdated || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consistency Summary */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-indigo-950">Mutual Consistency Assurance</span>
              <p className="text-indigo-800/90 leading-relaxed mt-0.5">
                The Dr. T Build With AI engine checks <code>scope.md</code>, <code>prd.md</code>, and <code>spec.md</code> to guarantee no conflicting scope boundaries or contradictory requirements exist before challenge submission.
              </p>
            </div>
          </div>
        </div>

        {/* Action Center & Next Steps */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Recommended Next Step</h3>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-amber-800 block">
              {project.stage === 'discover' ? 'Define Core Problem' : project.stage === 'specify' ? 'Review & Approve Spec' : 'Execute Tasks'}
            </span>
            <p className="text-amber-900 leading-relaxed">
              {project.stage === 'discover'
                ? 'Complete the guided intake to generate your structured project brief and user personas.'
                : project.stage === 'specify'
                ? 'Ensure scope.md, prd.md, and spec.md pass required section validation before exporting.'
                : 'Move ready tasks to In-Progress on the Kanban task board and review code with the AI Assistant.'}
            </p>
            <button 
              onClick={() => {
                if (project.stage === 'discover') setActiveSubtab('intake');
                else if (project.stage === 'specify') setActiveSubtab('editor');
                else setActiveSubtab('tasks');
              }}
              className="mt-1 w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <span>Take Action</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Quick Workspaces</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => setActiveSubtab('tasks')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 hover:bg-white transition flex items-center space-x-2"
              >
                <Kanban className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-medium">Task Board</span>
              </button>
              <button 
                onClick={() => setActiveSubtab('assistant')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 hover:bg-white transition flex items-center space-x-2"
              >
                <Code2 className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-medium">Code Assist</span>
              </button>
              <button 
                onClick={() => setActiveSubtab('devpost')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 hover:bg-white transition flex items-center space-x-2 col-span-2"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-medium">Devpost Learn AI Basics Checklist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
