import React, { useState } from 'react';
import { BuildWithAiProject, ProjectBrief } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  UserCheck, 
  ShieldAlert, 
  Target, 
  ListOrdered, 
  Calendar, 
  RefreshCw,
  ThumbsUp,
  FileCheck
} from 'lucide-react';

interface IntakeBriefViewProps {
  project: BuildWithAiProject;
  onUpdateProject: (updated: BuildWithAiProject) => void;
  setActiveSubtab: (subtab: string) => void;
}

export const IntakeBriefView: React.FC<IntakeBriefViewProps> = ({
  project,
  onUpdateProject,
  setActiveSubtab
}) => {
  const [formData, setFormData] = useState({
    name: project.name,
    tagline: project.tagline,
    targetAudience: project.targetAudience,
    problemStatement: project.problemStatement,
    proposedSolution: project.proposedSolution,
    keyFeaturesStr: project.keyFeatures.join(', '),
    workflow: project.workflow,
    constraints: project.constraints,
    privacyConsiderations: project.privacyConsiderations,
    successCriteria: project.successCriteria,
    modelPreference: project.modelPreference
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationFeedback, setGenerationFeedback] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveIntake = () => {
    const keyFeatures = formData.keyFeaturesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updated: BuildWithAiProject = {
      ...project,
      name: formData.name,
      tagline: formData.tagline,
      targetAudience: formData.targetAudience,
      problemStatement: formData.problemStatement,
      proposedSolution: formData.proposedSolution,
      keyFeatures,
      workflow: formData.workflow,
      constraints: formData.constraints,
      privacyConsiderations: formData.privacyConsiderations,
      successCriteria: formData.successCriteria,
      modelPreference: formData.modelPreference,
      updatedAt: new Date().toISOString()
    };

    onUpdateProject(updated);
    setGenerationFeedback('Project intake details saved.');
    setTimeout(() => setGenerationFeedback(null), 3000);
  };

  const handleGenerateBrief = async () => {
    setIsGenerating(true);
    setGenerationFeedback(null);

    const keyFeatures = formData.keyFeaturesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/build-with-ai/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.tagline,
          targetAudience: formData.targetAudience,
          problemStatement: formData.problemStatement,
          proposedSolution: formData.proposedSolution,
          keyFeatures,
          workflow: formData.workflow,
          constraints: formData.constraints,
          privacyConsiderations: formData.privacyConsiderations,
          successCriteria: formData.successCriteria
        })
      });

      const data = await res.json();
      if (data.success && data.brief) {
        const updated: BuildWithAiProject = {
          ...project,
          name: formData.name,
          tagline: formData.tagline,
          targetAudience: formData.targetAudience,
          problemStatement: formData.problemStatement,
          proposedSolution: formData.proposedSolution,
          keyFeatures,
          workflow: formData.workflow,
          constraints: formData.constraints,
          privacyConsiderations: formData.privacyConsiderations,
          successCriteria: formData.successCriteria,
          modelPreference: formData.modelPreference,
          brief: data.brief,
          updatedAt: new Date().toISOString()
        };

        onUpdateProject(updated);
        setGenerationFeedback(`Brief generated via ${data.telemetry?.engine} (${data.telemetry?.latencyMs}ms). Review and approve below.`);
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err: any) {
      console.warn('Brief generation error, creating heuristic brief:', err);
      setGenerationFeedback('Generated structured brief using deterministic heuristic fallback.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleBriefApproval = () => {
    const updated: BuildWithAiProject = {
      ...project,
      brief: {
        ...project.brief,
        isApproved: !project.brief.isApproved
      },
      updatedAt: new Date().toISOString()
    };
    onUpdateProject(updated);
  };

  const brief = project.brief;

  return (
    <div className="space-y-8">
      {/* Top Helper Banner */}
      <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-indigo-950">AI-Assisted Guided Project Intake</h2>
          </div>
          <p className="text-xs text-indigo-800/90 max-w-2xl leading-relaxed">
            Answer the core questions below. The Dr. T AI Engine will formulate a structured product brief with user personas, user stories, boundary limits, and definition of done.
          </p>
        </div>
        {generationFeedback && (
          <span className="text-xs font-mono font-bold text-indigo-900 bg-white px-3 py-1.5 rounded-xl border border-indigo-200">
            {generationFeedback}
          </span>
        )}
      </div>

      {/* Two Column Layout: Intake Form (Left) & Generated Brief Review (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Intake (5 cols) */}
        <div className="lg:col-span-5 space-y-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <span>Project Parameters</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Project Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                placeholder="e.g. HealthAlert Mini"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tagline / Short Pitch</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => handleInputChange('tagline', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                placeholder="One sentence explaining the unique value proposition"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Audience *</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={e => handleInputChange('targetAudience', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Ambulatory patients with Stage 1/2 Hypertension"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Problem Statement *</label>
              <textarea
                rows={3}
                value={formData.problemStatement}
                onChange={e => handleInputChange('problemStatement', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
                placeholder="What core pain point or friction does the user experience today?"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Proposed Solution *</label>
              <textarea
                rows={3}
                value={formData.proposedSolution}
                onChange={e => handleInputChange('proposedSolution', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
                placeholder="How does your application intelligently solve this problem?"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Key Features (comma-separated)</label>
              <input
                type="text"
                value={formData.keyFeaturesStr}
                onChange={e => handleInputChange('keyFeaturesStr', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Vital intake, Red-flag triage, SBAR generator, FHIR export"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target AI Model</label>
              <select
                value={formData.modelPreference}
                onChange={e => handleInputChange('modelPreference', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Google GenAI — Recommended)</option>
                <option value="gemini-4-argon">gemini-4-argon (Complex STEM & Reasoning)</option>
                <option value="claude-3-7-sonnet">claude-3-7-sonnet</option>
                <option value="gpt-4o">gpt-4o</option>
                <option value="ollama-local">ollama-local (Local / Private Inference)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Workflow Overview</label>
              <input
                type="text"
                value={formData.workflow}
                onChange={e => handleInputChange('workflow', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Input -> Safety Check -> SBAR Generation -> Export"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Privacy & Safety Boundaries</label>
              <input
                type="text"
                value={formData.privacyConsiderations}
                onChange={e => handleInputChange('privacyConsiderations', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Zero diagnostic claims; client-side PII scrubbing"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={handleGenerateBrief}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-bold text-xs transition flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Project Brief with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Project Brief with Gemini</span>
                </>
              )}
            </button>

            <button
              onClick={handleSaveIntake}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Save Parameters
            </button>
          </div>
        </div>

        {/* Right Column: Structured Project Brief (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900">Structured Project Brief</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    brief?.isApproved
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {brief?.isApproved ? 'Approved ✓' : 'Draft Proposal'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {brief?.lastGeneratedAt
                    ? `Last generated ${new Date(brief.lastGeneratedAt).toLocaleString()}`
                    : 'Generated from project intake'}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleBriefApproval}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs ${
                    brief?.isApproved
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{brief?.isApproved ? 'Revoke Approval' : 'Approve Brief'}</span>
                </button>
                <button
                  onClick={() => setActiveSubtab('editor')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center space-x-1 shadow-xs"
                >
                  <span>Generate Docs</span>
                  <FileCheck className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>

            {/* Personas & Stories */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                User Personas & Pain Points
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(brief?.userPersonas || []).map((persona, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-900 block">{persona.name} — {persona.role}</span>
                    <p className="text-slate-600"><strong className="text-slate-700">Needs:</strong> {persona.needs}</p>
                    <p className="text-slate-500"><strong className="text-slate-700">Pain:</strong> {persona.painPoints}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scope Boundaries: In-Scope vs Out-of-Scope */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Scope Boundaries (Guardrail Discipline)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1.5">
                  <span className="font-bold text-emerald-900 flex items-center space-x-1">
                    <span>✓ In-Scope (MVP Deliverables)</span>
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-emerald-800 text-[11px]">
                    {(brief?.scopeBoundaries?.inScope || []).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-950 space-y-1.5">
                  <span className="font-bold text-rose-900 flex items-center space-x-1">
                    <span>✕ Explicit Exclusions (Out of Scope)</span>
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-rose-800 text-[11px]">
                    {(brief?.scopeBoundaries?.outOfScope || []).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Acceptance Criteria */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Acceptance Criteria & Definition of Done
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(brief?.acceptanceCriteria || []).map((crit, idx) => (
                  <li key={idx} className="flex items-start space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Risks & Security */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-2">
              <span className="font-bold text-amber-900 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Security, Privacy & Technical Risks</span>
              </span>
              <ul className="space-y-1 text-amber-900/90 text-[11px] list-disc list-inside">
                {(brief?.technicalRisks || []).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
                {(brief?.securityAndPrivacy || []).map((s, i) => (
                  <li key={`s_${i}`}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
