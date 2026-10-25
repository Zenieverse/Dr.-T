import React, { useState } from 'react';
import { BuildWithAiProject, LifecycleStage } from '../types';
import { 
  Compass, 
  Target, 
  FileCheck2, 
  Cpu, 
  Hammer, 
  CheckCircle2, 
  FileText, 
  Rocket, 
  ArrowRight,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface LifecycleViewProps {
  project: BuildWithAiProject;
  setActiveSubtab: (subtab: string) => void;
  onUpdateProject: (updated: BuildWithAiProject) => void;
}

interface StageDetail {
  id: LifecycleStage;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  badge: string;
  objectives: string[];
  deliverables: string[];
  recommendedSubtab: string;
  subtabLabel: string;
}

const STAGES: StageDetail[] = [
  {
    id: 'discover',
    title: '1. Discover',
    tagline: 'Understand the authentic user problem and competitive context',
    icon: <Compass className="w-5 h-5 text-sky-500" />,
    color: 'sky',
    badge: 'Foundation',
    objectives: [
      'Identify target user pain points and daily operational hurdles.',
      'Explore plausible solutions and AI integration opportunities.',
      'Define non-diagnostic or domain-appropriate boundaries.'
    ],
    deliverables: ['Problem statement draft', 'Initial user personas', 'Core project intake parameters'],
    recommendedSubtab: 'intake',
    subtabLabel: 'Open Guided Intake'
  },
  {
    id: 'scope',
    title: '2. Scope',
    tagline: 'Establish explicit boundaries, exclusions, and acceptance criteria',
    icon: <Target className="w-5 h-5 text-teal-500" />,
    color: 'teal',
    badge: 'Boundary Gate',
    objectives: [
      'Document in-scope vs out-of-scope capabilities to prevent scope creep.',
      'Define clear exclusions (e.g., no autonomous medication prescribing).',
      'Establish unambiguous acceptance criteria.'
    ],
    deliverables: ['scope.md (Complete with all 7 required sections)'],
    recommendedSubtab: 'editor',
    subtabLabel: 'Edit scope.md'
  },
  {
    id: 'plan',
    title: '3. Plan',
    tagline: 'Structure user stories, development milestones, and release strategy',
    icon: <FileCheck2 className="w-5 h-5 text-indigo-500" />,
    color: 'indigo',
    badge: 'Execution Road',
    objectives: [
      'Craft user stories with clear "As a / I want / So that" format.',
      'Sequence chronological milestones from MVP to public release.',
      'Align project timeline with Devpost challenge submission deadline.'
    ],
    deliverables: ['Project Brief with Milestones', 'Validated User Stories'],
    recommendedSubtab: 'intake',
    subtabLabel: 'Review Brief & Milestones'
  },
  {
    id: 'specify',
    title: '4. Specify',
    tagline: 'Architect system components, data contracts, and error handling',
    icon: <Cpu className="w-5 h-5 text-purple-500" />,
    color: 'purple',
    badge: 'Architecture',
    objectives: [
      'Formulate complete Product Requirements Document (prd.md).',
      'Detail technical architecture, component design, and contracts in spec.md.',
      'Verify mutual consistency between scope.md, prd.md, and spec.md.'
    ],
    deliverables: ['prd.md', 'spec.md', 'Cross-document consistency validation'],
    recommendedSubtab: 'editor',
    subtabLabel: 'Edit PRD & Spec'
  },
  {
    id: 'build',
    title: '5. Build',
    tagline: 'Translate specifications into modular, tested software components',
    icon: <Hammer className="w-5 h-5 text-amber-500" />,
    color: 'amber',
    badge: 'Implementation',
    objectives: [
      'Deconstruct specification into atomic, prioritized development tasks.',
      'Utilize coding agent prompts for Cursor, Claude Code, or Copilot.',
      'Incorporate deterministic safety fallbacks and timeout protection.'
    ],
    deliverables: ['Kanban task cards', 'Working source code in repository'],
    recommendedSubtab: 'tasks',
    subtabLabel: 'Open Task Board'
  },
  {
    id: 'test',
    title: '6. Test',
    tagline: 'Validate deterministic rules, edge cases, and resilience',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    color: 'emerald',
    badge: 'Quality Gate',
    objectives: [
      'Execute unit tests covering boundary and extreme input conditions.',
      'Verify zero unhandled exceptions on AI API timeouts or disconnections.',
      'Run security checks against code injection and credential exposure.'
    ],
    deliverables: ['Automated test execution logs', '100% passing test assertions'],
    recommendedSubtab: 'assistant',
    subtabLabel: 'Open Code & Test Assistant'
  },
  {
    id: 'document',
    title: '7. Document',
    tagline: 'Deliver crystal-clear reproduction steps and architectural guides',
    icon: <FileText className="w-5 h-5 text-blue-500" />,
    color: 'blue',
    badge: 'Transparency',
    objectives: [
      'Draft a comprehensive README.md with quickstart and test commands.',
      'Document open-source license (e.g. MIT) and clinical/safety notices.',
      'Record concise 2-3 minute walk-through demonstration video.'
    ],
    deliverables: ['README.md', 'Demo Video Link', 'Export Manifest JSON'],
    recommendedSubtab: 'editor',
    subtabLabel: 'Edit README.md'
  },
  {
    id: 'publish',
    title: '8. Publish',
    tagline: 'Submit to Devpost Learn AI Basics with complete verifiable evidence',
    icon: <Rocket className="w-5 h-5 text-rose-500" />,
    color: 'rose',
    badge: 'Submission Gate',
    objectives: [
      'Complete all 14 checklist criteria for Devpost Learn AI Basics.',
      'Supply verifiable public GitHub repository and demo video URLs.',
      'Submit project before the official deadline in local timezone.'
    ],
    deliverables: ['Devpost Submission', 'Public verified GitHub release'],
    recommendedSubtab: 'devpost',
    subtabLabel: 'Open Submission Checklist'
  }
];

export const LifecycleView: React.FC<LifecycleViewProps> = ({
  project,
  setActiveSubtab,
  onUpdateProject
}) => {
  const [selectedStageId, setSelectedStageId] = useState<LifecycleStage>(project.stage);
  const selectedStage = STAGES.find(s => s.id === selectedStageId) || STAGES[0];
  const currentStageIndex = STAGES.findIndex(s => s.id === project.stage);

  return (
    <div className="space-y-6">
      {/* Header Explainer */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">8-Stage AI Project Lifecycle</h2>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            A disciplined, evidence-first framework guiding your project from raw idea to fully tested, documented software ready for the <strong>Devpost Learn AI Basics</strong> challenge.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">Current active stage:</span>
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 font-bold uppercase tracking-wider">
            {project.stage}
          </span>
        </div>
      </div>

      {/* Grid of All 8 Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {STAGES.map((stage, idx) => {
          const isCurrent = project.stage === stage.id;
          const isSelected = selectedStageId === stage.id;
          const isDone = idx < currentStageIndex;

          return (
            <div
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 relative select-none ${
                isSelected
                  ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : isCurrent
                  ? 'bg-indigo-50/50 border-indigo-300 hover:bg-white'
                  : isDone
                  ? 'bg-emerald-50/40 border-emerald-200 hover:bg-white'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100">
                  {stage.icon}
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {stage.badge}
                  </span>
                  {isCurrent && (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" title="Active Stage" />
                  )}
                  {isDone && (
                    <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{stage.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-snug">
                  {stage.tagline}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className={`font-mono font-medium ${
                  isCurrent ? 'text-indigo-700 font-bold' : isDone ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  {isCurrent ? 'Current Active' : isDone ? 'Completed' : 'Upcoming'}
                </span>
                <span className="text-indigo-600 hover:underline font-bold flex items-center space-x-0.5">
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Stage Detail Focus Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              {selectedStage.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900">{selectedStage.title}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold text-xs">
                  {selectedStage.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedStage.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {project.stage !== selectedStage.id && (
              <button
                onClick={() => {
                  onUpdateProject({ ...project, stage: selectedStage.id });
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                Set as Active Stage
              </button>
            )}
            <button
              onClick={() => setActiveSubtab(selectedStage.recommendedSubtab)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
            >
              <span>{selectedStage.subtabLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Objectives */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Stage Objectives
            </span>
            <ul className="space-y-2">
              {selectedStage.objectives.map((obj, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start space-x-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Deliverables & Validation Criteria */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Required Deliverables
            </span>
            <ul className="space-y-2">
              {selectedStage.deliverables.map((deliv, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-center space-x-2.5 bg-emerald-50/60 border border-emerald-100 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono font-medium">{deliv}</span>
                </li>
              ))}
            </ul>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">Definition of Done for this Stage:</span>
              <p>
                All deliverables must pass validation and be approved before progressing to the subsequent lifecycle phase. Work is never lost when returning to earlier stages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
