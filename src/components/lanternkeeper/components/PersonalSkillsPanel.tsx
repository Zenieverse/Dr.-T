import React, { useState } from 'react';
import { 
  MemoryLanternItem, 
  PersonalSkillName, 
  SkillExecutionResponse,
  PermissionManifest 
} from '../types';
import { 
  BookHeart, 
  CalendarCheck2, 
  SearchCheck, 
  ShieldAlert, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Lock,
  FileText
} from 'lucide-react';

interface PersonalSkillsPanelProps {
  memories: MemoryLanternItem[];
  onOpenStoryModal: () => void;
  onOpenMemoryInspector: (memoryId?: string) => void;
  onRequestActionApproval: (manifest: PermissionManifest, onApproved: () => void) => void;
}

export const PersonalSkillsPanel: React.FC<PersonalSkillsPanelProps> = ({
  memories,
  onOpenStoryModal,
  onOpenMemoryInspector,
  onRequestActionApproval
}) => {
  const [activeSkillResult, setActiveSkillResult] = useState<SkillExecutionResponse | null>(null);
  const [executingSkill, setExecutingSkill] = useState<PersonalSkillName | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Skill 1: Family Story Keeper
  const handleLaunchStoryKeeper = () => {
    const manifest: PermissionManifest = {
      actionType: 'execute_skill',
      toolName: 'family_story_keeper',
      requiredMemoryIds: memories.slice(0, 3).map(m => m.id),
      requiredMemoryTitles: memories.slice(0, 3).map(m => m.title),
      scopeDescription: 'Read selected family memories and synthesize an editable narrative draft.',
      consequentialImpact: 'Generates a new story draft. Does not modify original memory records.',
      isConsequential: true,
      requiresExplicitApproval: true
    };

    onRequestActionApproval(manifest, () => {
      onOpenStoryModal();
    });
  };

  // Skill 2: Weekly Life Review
  const handleExecuteWeeklyReview = () => {
    const manifest: PermissionManifest = {
      actionType: 'execute_skill',
      toolName: 'weekly_life_review',
      requiredMemoryIds: memories.map(m => m.id),
      requiredMemoryTitles: memories.map(m => m.title),
      scopeDescription: 'Synthesize recorded commitments, weekly priorities, and life-balance reflections.',
      consequentialImpact: 'Generates an actionable checklist for upcoming week.',
      isConsequential: true,
      requiresExplicitApproval: true
    };

    onRequestActionApproval(manifest, async () => {
      setExecutingSkill('weekly_life_review');
      setError(null);
      try {
        const response = await fetch('/api/lantern-keeper/execute-skill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skillName: 'weekly_life_review',
            userMemories: memories,
            userApproved: true,
            payload: {
              commitments: [
                { roleName: 'Lifelong Learner', title: 'Study open-source AI architecture', priority: 'high', status: 'in_progress', nextAction: 'Review NVIDIA Nemotron prompt contracts' },
                { roleName: 'Caretaker of Wellbeing', title: 'Protect 8-hour sleep window', priority: 'high', status: 'in_progress', nextAction: 'Set bedtime phone silence at 10 PM' },
                { roleName: 'Tradition Keeper', title: 'Brew lemon verbena tea with family', priority: 'medium', status: 'completed', nextAction: 'Enjoy Sunday tea gathering' }
              ],
              roles: [
                { name: 'Lifelong Learner' },
                { name: 'Caretaker of Wellbeing' },
                { name: 'Tradition Keeper' }
              ]
            }
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Execution failed');
        }

        const data: SkillExecutionResponse = await response.json();
        setActiveSkillResult(data);
      } catch (err: any) {
        setError(err.message || 'Error executing Weekly Life Review.');
      } finally {
        setExecutingSkill(null);
      }
    });
  };

  // Skill 3: Memory Inspector
  const handleLaunchMemoryInspector = () => {
    onOpenMemoryInspector(memories[0]?.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Reusable Personal Skills</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Modular, permission-gated capabilities powered by NVIDIA Nemotron and deterministic safety logic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Skill Card 1: Family Story Keeper */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-600/40 rounded-2xl p-5 flex flex-col justify-between transition-all space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <BookHeart className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60">
                Story Engine
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-100">
              Family Story Keeper
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Weaves user-selected memories into coherent, editable narrative keepsakes while strictly honoring factual provenance.
            </p>
            <div className="text-[11px] text-slate-500 space-y-1 pt-1">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Permission: Explicit selection required</span>
              </div>
              <div>Input: 1+ selected memories, mode, style</div>
              <div>Output: Editable Markdown narrative</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLaunchStoryKeeper}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-amber-500/30"
          >
            <span>Launch Story Keeper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Skill Card 2: Weekly Life Review */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-600/40 rounded-2xl p-5 flex flex-col justify-between transition-all space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CalendarCheck2 className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                Review Engine
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-100">
              Weekly Life Review
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes user-approved commitments and role maps to prepare a grounded, realistic checklist for balance.
            </p>
            <div className="text-[11px] text-slate-500 space-y-1 pt-1">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Permission: Approval manifest check</span>
              </div>
              <div>Input: Roles, active commitments, reflections</div>
              <div>Output: Grounded summary + action checklist</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExecuteWeeklyReview}
            disabled={executingSkill === 'weekly_life_review'}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-500/30 disabled:opacity-50"
          >
            {executingSkill === 'weekly_life_review' ? (
              <span>Synthesizing...</span>
            ) : (
              <>
                <span>Run Weekly Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Skill Card 3: Memory Inspector */}
        <div className="bg-slate-900/80 border border-slate-800 hover:border-sky-600/40 rounded-2xl p-5 flex flex-col justify-between transition-all space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                <SearchCheck className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-700/60">
                Audit Engine
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-100">
              Memory Inspector
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audits memory authenticity, verifies extracted facts, inspects access history, and tests revocation or permanent deletion.
            </p>
            <div className="text-[11px] text-slate-500 space-y-1 pt-1">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Permission: Read-only audit with deletion gate</span>
              </div>
              <div>Input: Memory ID or search query</div>
              <div>Output: Provenance verification report</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLaunchMemoryInspector}
            className="w-full py-2.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-sky-500/30"
          >
            <span>Open Inspector</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Output of Weekly Life Review */}
      {activeSkillResult && activeSkillResult.skillName === 'weekly_life_review' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-600/30 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-slate-100">
                Weekly Life Review Synthesis
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
              {activeSkillResult.modelUsed}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-lg font-bold text-slate-100">{activeSkillResult.result.totalRolesCount}</div>
              <div className="text-[10px] text-slate-400 uppercase">Mapped Roles</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-lg font-bold text-slate-100">{activeSkillResult.result.totalCommitmentsCount}</div>
              <div className="text-[10px] text-slate-400 uppercase">Commitments</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-lg font-bold text-emerald-400">{activeSkillResult.result.completedCount}</div>
              <div className="text-[10px] text-slate-400 uppercase">Completed</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-lg font-bold text-amber-400">{activeSkillResult.result.inProgressCount}</div>
              <div className="text-[10px] text-slate-400 uppercase">In Progress</div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-slate-300">
              Grounded Reflection:
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              "{activeSkillResult.result.reflectionPrompt}"
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-slate-300">
              Actionable Weekly Checklist:
            </h5>
            <ul className="space-y-1.5">
              {activeSkillResult.result.realisticChecklist.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
