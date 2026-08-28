import React, { useState } from 'react';
import { NavTab } from '../../types';
import { 
  Compass, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ArrowRight,
  HeartPulse,
  Activity,
  FileText,
  Cpu,
  FlaskConical,
  Camera,
  Bot,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface DemoJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: NavTab) => void;
  openVoiceMode: () => void;
}

interface StepInfo {
  step: number;
  title: string;
  tab: NavTab;
  description: string;
  actionLabel: string;
  triggerVoice?: boolean;
}

const DEMO_STEPS: StepInfo[] = [
  {
    step: 1,
    title: 'Dr. T Home Dashboard & Empathetic Entry',
    tab: 'drt',
    description: 'Welcome to Dr. T! Observe the conversational entry point, personality mode selector, and the Central Safety Engine indicator.',
    actionLabel: 'Explore Dr. T Home',
  },
  {
    step: 2,
    title: "Today's Biometric Health Snapshot",
    tab: 'drt',
    description: 'Inspect synchronized wearable metrics: Sleep (6.2 hrs, 42% N3 deep sleep deficit), Resting HR (68 bpm), Blood Pressure (118/76 mmHg), and active Vitamin D3 reminders.',
    actionLabel: 'View Health Snapshot',
  },
  {
    step: 3,
    title: 'Central Clinical Safety Engine (GREEN/YELLOW/ORANGE/RED)',
    tab: 'drt',
    description: 'Notice the top safety status banner. Dr. T continually screens input against acute red-flag conditions with transparent educational escalation rules.',
    actionLabel: 'Examine Safety Engine',
  },
  {
    step: 4,
    title: 'Interactive Live Voice Mode',
    tab: 'drt',
    description: 'Launch the immersive voice companion with real-time pulsing waveform animation, speech recognition, and empathetic auditory synthesis.',
    actionLabel: 'Launch Voice Mode',
    triggerVoice: true,
  },
  {
    step: 5,
    title: 'Socratic Dialogue & Clarifying Questions',
    tab: 'drt',
    description: 'Notice how Dr. T gently distinguishes raw symptoms from patient assumptions and suggests structured questions to bring to your physician.',
    actionLabel: 'Inspect Socratic Dialogue',
  },
  {
    step: 6,
    title: 'Longitudinal Health Timeline',
    tab: 'intelligence',
    description: 'Navigate to Health Intelligence. Browse the chronological stream unifying Symptoms, Labs, Medications, Clinic Encounters, and AI Insights.',
    actionLabel: 'Open Health Timeline',
  },
  {
    step: 7,
    title: 'Laboratory Event Deep Dive: Serum Ferritin',
    tab: 'intelligence',
    description: 'Filter timeline by Labs. Inspect the Serum Ferritin (19 ng/mL) event and read the multi-dimensional clinical synthesis.',
    actionLabel: 'Filter by Labs',
  },
  {
    step: 8,
    title: 'AI-Discovered Physiological Patterns',
    tab: 'intelligence',
    description: 'Switch to AI Patterns to review the correlation between late sleep chronotypes (>12:45 AM) and next-day afternoon fatigue dips.',
    actionLabel: 'Review AI Patterns',
  },
  {
    step: 9,
    title: 'Curated Questions for Primary Care Clinician',
    tab: 'intelligence',
    description: 'View and copy the prioritized list of high-yield questions formulated for your upcoming encounter with Dr. Sarah Chen, MD.',
    actionLabel: 'Inspect Clinician Questions',
  },
  {
    step: 10,
    title: 'SOAP Clinical Progress Note Generator',
    tab: 'informatics',
    description: 'Open Clinical Informatics. Transform patient dialogue into Subjective, Objective, Assessment, and Plan documentation.',
    actionLabel: 'Open SOAP Generator',
  },
  {
    step: 11,
    title: 'Laboratory Interpretation Engine',
    tab: 'informatics',
    description: 'Switch to Lab Interpretation. Inspect reference intervals, biochemical mechanism explanations, and clinical significance for 6+ diagnostic panels.',
    actionLabel: 'Explore Lab Engine',
  },
  {
    step: 12,
    title: 'HL7 FHIR R4 Interoperability Graph & JSON Validator',
    tab: 'informatics',
    description: 'Inspect the live FHIR resource relationship graph (Patient → Encounter → Observation → Condition) with schema syntax validation.',
    actionLabel: 'View FHIR Graph',
  },
  {
    step: 13,
    title: 'AI Multi-Agent Swarm Orchestrator (7 Agents)',
    tab: 'swarm',
    description: 'Enter the AI Swarm. See Dr. Med, Dr. Research, Dr. Edu, Dr. Ops, Dr. Data, and Dr. Safety decompose a complex case in parallel.',
    actionLabel: 'Open AI Swarm',
  },
  {
    step: 14,
    title: 'Signature Agent Disagreement System',
    tab: 'swarm',
    description: 'Inspect the Reasoning Review where tensions between Dr. Med and Dr. Research are surfaced, followed by Dr. T’s empathetic synthesis.',
    actionLabel: 'Inspect Disagreement Review',
  },
  {
    step: 15,
    title: 'Biomedical Research Lab & GRADE Evidence Synthesis',
    tab: 'research',
    description: 'Search clinical queries. Review evidence certainty grades (HIGH CONFIDENCE), uncertainty limitations, and Lancet/BMJ citations.',
    actionLabel: 'Explore Research Lab',
  },
  {
    step: 16,
    title: 'Multimodal AI Medical Image Research Mode',
    tab: 'research',
    description: 'Inspect dermatology lesions and chest X-rays with morphological ABCDE feature extraction and clinical consultation recommendations.',
    actionLabel: 'Inspect Image AI Mode',
  },
  {
    step: 17,
    title: 'MIMIC-IV ICU Predictive Analytics & Deterioration Models',
    tab: 'research',
    description: 'Explore predictive risk modeling with SOFA scores, time-series vital trends, and SHAP feature importance weights.',
    actionLabel: 'View ICU Predictive Analytics',
  },
  {
    step: 18,
    title: 'SmArist 3D AR Virtual Try-On Studio',
    tab: 'smarist',
    description: 'Try on lipstick shades and designer eyewear in real time with facial landmark tracking and portrait mode.',
    actionLabel: 'Open SmArist AR',
  },
  {
    step: 19,
    title: '14-Dimension Spectroscopic Skin Intelligence',
    tab: 'smarist',
    description: 'Inspect zonal dermal maps (Forehead, Malar Cheeks, Periorbital) with hydration, elasticity, and barrier function scores.',
    actionLabel: 'View Skin Intelligence',
  },
  {
    step: 20,
    title: 'Longitudinal Dermal Age Simulator (-5 to +20 yrs)',
    tab: 'smarist',
    description: 'Slide through simulated collagen evolution and learn how daily broad-spectrum SPF preserves biological youth.',
    actionLabel: 'Run Age Simulator',
  },
  {
    step: 21,
    title: 'Clinical Workflow Automation & Human-in-the-Loop Queue',
    tab: 'automation',
    description: 'Review pending chart updates in the HITL queue and click "Approve & Dispatch" to simulate instant EHR synchronization.',
    actionLabel: 'Open Automation Queue',
  },
  {
    step: 22,
    title: 'Sovereign Privacy, ZKP Consent Receipts & Agent Economy',
    tab: 'privacy',
    description: 'Inspect your DID verifiable credentials, ZKP consent tokens, AI memory controls, and x402 micro-transaction services.',
    actionLabel: 'Review Privacy & Economy',
  },
];

export const DemoJourneyModal: React.FC<DemoJourneyModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  openVoiceMode,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const current = DEMO_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setActiveTab(DEMO_STEPS[nextIdx].tab);
      if (DEMO_STEPS[nextIdx].triggerVoice) {
        openVoiceMode();
      }
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setActiveTab(DEMO_STEPS[prevIdx].tab);
    }
  };

  const handleJumpToStep = (idx: number) => {
    setCurrentStepIndex(idx);
    setActiveTab(DEMO_STEPS[idx].tab);
    if (DEMO_STEPS[idx].triggerVoice) {
      openVoiceMode();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black tracking-tight">Dr. T Guided End-to-End Walkthrough</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300">
                  Step {current.step} of {DEMO_STEPS.length}
                </span>
              </div>
              <p className="text-xs text-slate-400">Complete multi-phase showcase of all 49 biomedical platform capabilities</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div 
            style={{ width: `${((currentStepIndex + 1) / DEMO_STEPS.length) * 100}%` }}
            className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full transition-all duration-300"
          />
        </div>

        {/* Current Step Body */}
        <div className="p-8 space-y-6 flex-1">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Module: {current.tab.toUpperCase()}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
              {current.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Step Navigator Pills */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Jump to any stage in the 22-step journey:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-100">
              {DEMO_STEPS.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => handleJumpToStep(idx)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                    idx === currentStepIndex
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  {s.step}. {s.title.split(':')[0].split('—')[0].substring(0, 22)}...
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold disabled:opacity-30 hover:bg-slate-100 transition flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setActiveTab(current.tab);
                if (current.triggerVoice) openVoiceMode();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition"
            >
              Exit Tour & Explore This Screen
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition flex items-center space-x-1.5"
            >
              <span>{currentStepIndex === DEMO_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
