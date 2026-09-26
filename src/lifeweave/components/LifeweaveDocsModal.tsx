import React from 'react';
import { X, BookOpen, ShieldAlert, Cpu, Award, Zap, GitPullRequest, Layers, Network } from 'lucide-react';

interface LifeweaveDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LifeweaveDocsModal: React.FC<LifeweaveDocsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>LIFEWEAVE Documentation & Architecture Manual</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              Evidence-Guided Autonomous Software Engineering
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              "Map the code. Gather the evidence. Test the hypothesis. Make the smallest safe change."
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          
          {/* Section 1: Core Philosophy */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 space-y-2">
            <h4 className="font-extrabold text-sm text-cyan-300 flex items-center space-x-2">
              <Network className="w-4 h-4 text-cyan-400" />
              <span>1. The Core Paradigm: Evidence Over Assumption</span>
            </h4>
            <p>
              Standard coding models operate on a simplistic <strong>Search → Edit → Test</strong> loop that frequently falls into hallucinated repairs and bloated refactoring. LIFEWEAVE replaces this with an epistemically grounded workflow:
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-300 text-center font-bold border border-slate-800">
              Map → Hypothesize → Gather Evidence → Assess Uncertainty → Patch → Validate → Learn → Reconsider
            </div>
          </div>

          {/* Section 2: Clinical Safety Boundary */}
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-2 text-rose-200">
            <h4 className="font-extrabold text-sm text-rose-300 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>2. Critical Safety Boundary: Protecting Health-AI</span>
            </h4>
            <p className="leading-relaxed">
              LIFEWEAVE is a <strong>software-engineering system</strong>, never an autonomous clinical decision-maker. When LIFEWEAVE detects that a proposed software change affects clinical reasoning, medical advice, medication logic, patient data, health-risk classification, or safety policies:
            </p>
            <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-rose-300">
              <li>Autonomous approval is permanently DISABLED.</li>
              <li>The change is classified as <strong>HIGH-IMPACT / HUMAN REVIEW REQUIRED</strong>.</li>
              <li>Requires explicit developer and attending clinician sign-off before application.</li>
            </ul>
          </div>

          {/* Section 3: Evidence Field & Contradiction Modeling */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>3. The Evidence Field & Contradiction Modeling</span>
            </h4>
            <p>
              Every candidate location is evaluated across 8 empirical dimensions: Semantic, Structural, Dependency, Test, Behavioral, and Issue-Clue relevance, alongside Contradiction and Epistemic Uncertainty. If data is unavailable, LIFEWEAVE explicitly shows <strong>Unknown</strong> rather than fabricating numbers.
            </p>
            <p>
              Contradictory evidence (e.g. neighboring code already handles the condition, or runtime trace reveals the function was never executed) is surfaced with equal prominence to prevent confirmation bias.
            </p>
          </div>

          {/* Section 4: Adaptive Evidence Acquisition */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>4. Adaptive Evidence Acquisition Heuristic</span>
            </h4>
            <p>
              Before modifying code, LIFEWEAVE asks: <em>"What evidence would most reduce uncertainty about the correct repair?"</em> It prioritizes actions using the heuristic:
            </p>
            <pre className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800">
              Priority = (EvidenceValue × InformationGain × StructuralRelevance) / (Cost + Uncertainty + ε)
            </pre>
            <p className="text-[11px] text-slate-400">
              This is a transparent experimental heuristic to optimize action efficiency without exposing hidden internal chain-of-thought.
            </p>
          </div>

          {/* Section 5: The 4 Specialized Agent Roles */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>5. Logical Agent Roles</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-cyan-300 block">Orchestrator:</strong>
                Maintains investigation state, hypotheses, evidence, uncertainty, and next steps.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-purple-300 block">Locator:</strong>
                Traverses code graph, semantic indices, AST imports, and callers.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-amber-300 block">Analyst:</strong>
                Calculates Evidence Field, evaluates competing hypotheses, and isolates contradictions.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-emerald-300 block">Patcher / Validator:</strong>
                Formulates minimal patch, verifies invariants, runs tests, and guides failure recovery.
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
};
