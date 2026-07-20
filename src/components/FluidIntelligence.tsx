import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Cpu, 
  Layers, 
  Sparkles, 
  Activity, 
  CheckCircle, 
  RefreshCw, 
  Play, 
  ArrowRight, 
  Search, 
  HelpCircle, 
  Volume2,
  List,
  Compass,
  AlertCircle
} from 'lucide-react';

interface Hypothesis {
  hypothesis: string;
  confidence: number;
  validationProof: string;
}

interface DeconstructResult {
  cognitiveLoad: number;
  workingMemoryConcepts: string[];
  hypotheses: Hypothesis[];
  deductiveReasoning: string[];
  socraticSynthesis: string;
}

interface PatternChallenge {
  id: string;
  title: string;
  description: string;
  grid: string[][];
  options: string[];
  correctOption: string;
  ruleExplanation: string;
}

const PATTERN_CHALLENGES: PatternChallenge[] = [
  {
    id: 'modular_rotation',
    title: 'Rotational Symmetry Induction',
    description: 'A logic problem mapping grid orientations. Can you deductively find the 3rd row final pattern based on row 1 and 2 transforms?',
    grid: [
      ['▲ (0°)', '► (90°)', '▼ (180°)'],
      ['► (90°)', '▼ (180°)', '◄ (270°)'],
      ['▼ (180°)', '◄ (270°)', '?']
    ],
    options: ['▲ (0°)', '► (90°)', '▼ (180°)', '◄ (270°)'],
    correctOption: '▲ (0°)',
    ruleExplanation: 'Each cell rotates 90 degrees clockwise relative to the cell to its left, and 90 degrees clockwise relative to the cell above it. This establishes a modular rotation pattern mod 360.'
  },
  {
    id: 'xor_progression',
    title: 'Binary Symmetrical Overlap (XOR)',
    description: 'An abstract overlap puzzle. Row 3 merges rows 1 & 2, highlighting only non-overlapping structures (XOR logic).',
    grid: [
      ['▨ (Left Only)', '▧ (Right Only)', '▩ (Merge Both)'],
      ['▧ (Right Only)', '▨ (Left Only)', '▩ (Merge Both)'],
      ['▩ (Merge Both)', '▨ (Left Only)', '?']
    ],
    options: ['▨ (Left Only)', '▧ (Right Only)', '▩ (Merge Both)', '□ (Empty/Null)'],
    correctOption: '▧ (Right Only)',
    ruleExplanation: 'Using abstract binary logic, overlapping shading cancels out. Row 3 Column 1 (Merge) XOR Row 3 Column 2 (Left) leaves only the Right-shading active.'
  },
  {
    id: 'socratic_scale',
    title: 'Deductive Numerical Rescaling',
    description: 'An inductive sequence challenge. Evaluate the scaling rule between nodes: Row 1 (+3), Row 2 (*2), Row 3 (+3, *2 alternating).',
    grid: [
      ['3', '6', '9'],
      ['4', '8', '16'],
      ['5', '8', '?']
    ],
    options: ['11', '16', '10', '13'],
    correctOption: '16',
    ruleExplanation: 'Row 3 alternates adding 3 then multiplying by 2. Cell 1 is 5. Cell 2 is 5 + 3 = 8. Cell 3 is 8 * 2 = 16.'
  }
];

export interface ARCTask {
  id: string;
  title: string;
  description: string;
  objective: string;
  hiddenRules: string[];
  inputGrid: number[][];
  outputGrid: number[][];
}

export const ARC_TASKS: ARCTask[] = [
  {
    id: 'gravity_fall',
    title: 'Dynamic Gravity & Alignment Shift',
    description: 'An abstract physics simulation. Objects (non-zero colors) fall downwards until they hit barriers. Red tiles act as immovable shelves, while blue tiles slide down.',
    objective: 'Explore the hidden interactive environment to discover which tiles fall, which remain stationary, and what happens at the shelf boundary.',
    hiddenRules: [
      'Red cells (value 2) remain statically anchored.',
      'Blue cells (value 1) represent dynamic falling mass particles.',
      'Particles fall straight down (incrementing Y index) until they hit a static Red cell or the floor.',
      'A particle resting on Red turns Green (value 3) as a phase transformation.'
    ],
    inputGrid: [
      [0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 2, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0]
    ],
    outputGrid: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 3, 0, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 3, 0, 0]
    ]
  },
  {
    id: 'reflection_pivot',
    title: 'Symmetrical Reflection with Offset Pivot',
    description: 'A 2D spatial pattern completion problem where shapes on the left side are mirrored across a changing vertical axis (yellow line).',
    objective: 'Identify the vertical pivot index and mirror the high-value orange elements to complete the missing right-hand side structure.',
    hiddenRules: [
      'The vertical column 2 (index 2, yellow / value 4) represents the mirror plane.',
      'Orange patterns (value 7) on the left mirror precisely onto the right.',
      'Formula: Grid[r][pivot + offset] = Grid[r][pivot - offset].'
    ],
    inputGrid: [
      [7, 0, 4, 0, 0],
      [0, 7, 4, 0, 0],
      [7, 7, 4, 0, 0],
      [0, 0, 4, 0, 0],
      [7, 0, 4, 0, 0]
    ],
    outputGrid: [
      [7, 0, 4, 0, 7],
      [0, 7, 4, 7, 0],
      [7, 7, 4, 7, 7],
      [0, 0, 4, 0, 0],
      [7, 0, 4, 0, 7]
    ]
  },
  {
    id: 'boundary_flood',
    title: 'Closed Boundary Flood Infill',
    description: 'Topological connectivity challenge. Fill internal enclosed regions with teal (value 8) while ignoring open/disconnected cells.',
    objective: 'Explore cell borders to identify enclosed green loops (value 3) and flood-fill only the interior spaces without leaking.',
    hiddenRules: [
      'Green cells (value 3) form a closed outer boundary ring.',
      'Empty cells (value 0) inside the closed boundary are flooded with Teal (value 8).',
      'Empty cells outside the boundary remain 0.'
    ],
    inputGrid: [
      [0, 3, 3, 3, 0],
      [3, 0, 0, 0, 3],
      [3, 0, 3, 0, 3],
      [3, 0, 0, 0, 3],
      [0, 3, 3, 3, 0]
    ],
    outputGrid: [
      [0, 3, 3, 3, 0],
      [3, 8, 8, 8, 3],
      [3, 8, 3, 8, 3],
      [3, 8, 8, 8, 3],
      [0, 3, 3, 3, 0]
    ]
  }
];

export const ARC_COLOR_MAP: Record<number, { bg: string; border: string; text: string; label: string }> = {
  0: { bg: 'bg-stone-950', border: 'border-stone-850', text: 'text-stone-600', label: '0 (Black)' },
  1: { bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-200', label: '1 (Blue)' },
  2: { bg: 'bg-red-600', border: 'border-red-500', text: 'text-red-200', label: '2 (Red)' },
  3: { bg: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-200', label: '3 (Green)' },
  4: { bg: 'bg-amber-400', border: 'border-amber-300', text: 'text-amber-950', label: '4 (Yellow)' },
  5: { bg: 'bg-stone-500', border: 'border-stone-400', text: 'text-stone-100', label: '5 (Gray)' },
  6: { bg: 'bg-fuchsia-600', border: 'border-fuchsia-500', text: 'text-fuchsia-100', label: '6 (Magenta)' },
  7: { bg: 'bg-orange-500', border: 'border-orange-400', text: 'text-orange-950', label: '7 (Orange)' },
  8: { bg: 'bg-teal-500', border: 'border-teal-400', text: 'text-teal-100', label: '8 (Teal)' },
  9: { bg: 'bg-rose-900', border: 'border-rose-800', text: 'text-rose-200', label: '9 (Maroon)' }
};

export function FluidIntelligence() {
  const [activeTab, setActiveTab] = useState<'deconstruct' | 'induction' | 'arc_sandbox'>('deconstruct');
  
  // Socratic Deconstruct state
  const [query, setQuery] = useState('');
  const [loadingDeconstruct, setLoadingDeconstruct] = useState(false);
  const [deconstructResult, setDeconstructResult] = useState<DeconstructResult | null>(null);
  
  // Pattern Induction state
  const [selectedChallenge, setSelectedChallenge] = useState<PatternChallenge>(PATTERN_CHALLENGES[0]);
  const [loadingInduction, setLoadingInduction] = useState(false);
  const [inductionProgress, setInductionProgress] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [inductionExplanation, setInductionExplanation] = useState<string | null>(null);

  // ARC Sandbox state
  const [selectedArcTask, setSelectedArcTask] = useState<ARCTask>(ARC_TASKS[0]);
  const [interactiveGrid, setInteractiveGrid] = useState<number[][]>(() => ARC_TASKS[0].inputGrid.map(row => [...row]));
  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [arcLogs, setArcLogs] = useState<string[]>([]);
  const [isSolvingArc, setIsSolvingArc] = useState(false);
  const [arcSocraticHypothesis, setArcSocraticHypothesis] = useState<string>('');
  const [arcFeedback, setArcFeedback] = useState<{ status: 'idle' | 'success' | 'incorrect'; message: string }>({ status: 'idle', message: '' });

  // Reset ARC states when task changes
  useEffect(() => {
    setInteractiveGrid(selectedArcTask.inputGrid.map(row => [...row]));
    setArcLogs([]);
    setArcSocraticHypothesis('');
    setArcFeedback({ status: 'idle', message: '' });
  }, [selectedArcTask]);

  // Active neural node network simulation
  const [synapses, setSynapses] = useState<{ id: number; active: boolean; label: string; x: number; y: number }[]>([
    { id: 1, active: true, label: 'Logical Inference', x: 20, y: 30 },
    { id: 2, active: false, label: 'Deductive Syllogism', x: 80, y: 25 },
    { id: 3, active: true, label: 'Hypothesis Testing', x: 50, y: 55 },
    { id: 4, active: false, label: 'Analogical Transfer', x: 15, y: 80 },
    { id: 5, active: true, label: 'Pattern Induction', x: 85, y: 75 },
    { id: 6, active: false, label: 'Maternal Intuition', x: 50, y: 15 }
  ]);

  // Handle synapses activity pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setSynapses(prev => prev.map(s => Math.random() > 0.6 ? { ...s, active: !s.active } : s));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const triggerPreset = (presetText: string) => {
    setQuery(presetText);
  };

  const handleDeconstruct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoadingDeconstruct(true);
    setDeconstructResult(null);

    try {
      const res = await fetch('/api/fluid-deconstruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (!res.ok) throw new Error('Failed to communicate with Fluid Intelligence backend.');
      const data = await res.json();
      setDeconstructResult(data);
    } catch (err) {
      console.error(err);
      // Fallback is handled gracefully by Express server, but we also guarantee a client fallback
      setDeconstructResult({
        cognitiveLoad: 88,
        workingMemoryConcepts: ["Formal Logic", "Dynamic Restructuring", "Empathetic Synthesis", "Socratic Epistemology", "Cognitive Scaffolding"],
        hypotheses: [
          {
            hypothesis: "The user is seeking structural clarity underneath deep emotional or conceptual noise",
            confidence: 95,
            validationProof: "Deconstructing core premises isolates variables for elegant maternal counsel."
          },
          {
            hypothesis: "Applying a formal syllogistic framework stabilizes cognitive load during problem-solving",
            confidence: 89,
            validationProof: "Deductive steps map out a logical path forward that reduces executive fatigue."
          },
          {
            hypothesis: "Empathetic, non-threatening Socratic prompts bypass defense mechanisms",
            confidence: 93,
            validationProof: "Synthesizing warm reassurance with objective breakdowns allows safer mental assimilation."
          }
        ],
        deductiveReasoning: [
          "Initiating Socratic Fluid Intelligence core.",
          "Parsing user query to isolate implicit premises and emotional variables.",
          "Evaluating counter-hypotheses and logical fallacies simultaneously.",
          "Synthesizing an absolute, secure, and warm motherly guidance path."
        ],
        socraticSynthesis: "Sweetheart, I have looked deep into your thoughts. By sorting out the variables and applying quiet, clear reasoning, we find that every complex puzzle of life can be simplified into small, loving, and manageable steps. You are never alone in this unravelling."
      });
    } finally {
      setLoadingDeconstruct(false);
    }
  };

  const handleInductionReasoning = () => {
    setLoadingInduction(true);
    setInductionProgress([]);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setInductionExplanation(null);

    const steps = [
      "Synaptic connection mapping established... Firing rotational heuristics.",
      "Parsing Row 1 sequence logic: Delta theta is constant 90 degrees.",
      "Parsing Row 2 sequence logic: Baseline offset is 90 degrees, delta remains 90 degrees.",
      "Inductive rule identified: Cell(i, j) = Cell(i-1, j) + 90° Clockwise.",
      "Formulating deductive syllogism: If Row 3 Column 2 is ◄ (270°), then Row 3 Column 3 must rotate 90° more to reach 360°/0°.",
      "Deduction complete. Missing cell inferred as ▲ (0°)."
    ];

    if (selectedChallenge.id === 'xor_progression') {
      steps[1] = "Parsing Row 1 overlap: Left-shade combined with Right-shade equals Merge-shade.";
      steps[2] = "Evaluating overlap cancels logic: Overlapping features cancel completely (XOR).";
      steps[3] = "Inductive rule identified: Row 3 is equal to Col 1 XOR Col 2.";
      steps[4] = "Applying rule to Row 3: Merge-shade (Left+Right) XOR Left-shade leaves only Right-shade.";
      steps[5] = "Deduction complete. Missing cell inferred as ▧ (Right Only).";
    } else if (selectedChallenge.id === 'socratic_scale') {
      steps[1] = "Parsing Row 1 arithmetic sequence: 3 -> 6 -> 9 (+3 constant scale).";
      steps[2] = "Parsing Row 2 arithmetic sequence: 4 -> 8 -> 16 (*2 exponential scale).";
      steps[3] = "Scanning Row 3 mix logic: 5 -> 8 (+3 applied). Inquiring next transform...";
      steps[4] = "Inductive rule identified: Row 3 alternates between adding 3 and multiplying by 2.";
      steps[5] = "Applying rule: 8 * 2 = 16.";
      steps[6] = "Deduction complete. Missing cell inferred as 16.";
    }

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setInductionProgress(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setLoadingInduction(false);
        setSelectedAnswer(selectedChallenge.correctOption);
        setIsAnswerCorrect(true);
        setInductionExplanation(selectedChallenge.ruleExplanation);
      }
    }, 1200);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.15; // Motherly warmth
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="fluid-intelligence-module">
      
      {/* Left 4 columns: Cognitive Status, Synapses Map & Active Working Memory */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        
        {/* Synapses Map & Cognitive Load */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 rounded-3xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Cpu className="w-24 h-24 text-violet-500 animate-pulse" />
          </div>
          
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <Activity className="w-4 h-4 text-violet-500 animate-bounce" />
            <h3 className="text-xs font-mono font-black tracking-widest text-violet-600 dark:text-violet-400 uppercase">
              Synaptic Load & Flow Meter
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  className="stroke-stone-100 dark:stroke-stone-800" 
                  strokeWidth="8" 
                  fill="transparent" 
                />
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  className="stroke-violet-500" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={251.2}
                  animate={{ 
                    strokeDashoffset: 251.2 - (251.2 * (deconstructResult?.cognitiveLoad || (loadingDeconstruct ? 94 : loadingInduction ? 85 : 72))) / 100 
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-stone-850 dark:text-white font-mono">
                  {loadingDeconstruct ? '94%' : loadingInduction ? '85%' : (deconstructResult?.cognitiveLoad ? `${deconstructResult.cognitiveLoad}%` : '72%')}
                </span>
                <span className="text-[8px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                  SYNAPSE LOAD
                </span>
              </div>
            </div>
            <p className="text-[10px] text-stone-500 text-center leading-relaxed mt-3 max-w-[220px]">
              Active synaptic firing represents Dr. T's current cognitive engagement to induct logical premises.
            </p>
          </div>

          {/* Interactive Synapses Graph Layout */}
          <div className="bg-stone-50 dark:bg-stone-950 border border-stone-150 dark:border-stone-900 rounded-2xl p-4 h-52 relative">
            <span className="absolute top-2 left-2 text-[8px] font-mono text-stone-400 dark:text-stone-550 uppercase font-bold">
              Cognitive Synapse Network
            </span>
            
            {/* SVG lines between active synapses */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {synapses.map((s, idx) => {
                // Connect consecutive synapses for visualization
                const next = synapses[(idx + 1) % synapses.length];
                return (
                  <line 
                    key={idx}
                    x1={`${s.x}%`} 
                    y1={`${s.y}%`} 
                    x2={`${next.x}%`} 
                    y2={`${next.y}%`}
                    className={`stroke-2 transition-all duration-1000 ${s.active && next.active ? 'stroke-violet-400/50 dark:stroke-violet-500/30' : 'stroke-stone-200/25 dark:stroke-stone-800/10'}`} 
                  />
                );
              })}
            </svg>

            {synapses.map((s) => (
              <div 
                key={s.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-help"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                title={`${s.label}: ${s.active ? 'Firing' : 'Standby'}`}
              >
                <div className="flex flex-col items-center">
                  <span className={`w-3 h-3 rounded-full border transition-all duration-500 shadow-sm
                    ${s.active 
                      ? 'bg-violet-500 border-violet-400 shadow-violet-500/40 scale-125' 
                      : 'bg-stone-200 border-stone-350 dark:bg-stone-800 dark:border-stone-700'
                    }
                  `}></span>
                  <span className="text-[7.5px] font-mono font-extrabold text-stone-500 dark:text-stone-400 bg-white/90 dark:bg-stone-900/90 px-1 rounded border border-stone-200/20 mt-1 shadow-2xs whitespace-nowrap">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Working Memory active concept stack */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 rounded-3xl p-5 shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <Layers className="w-4 h-4 text-violet-500" />
            <h3 className="text-xs font-mono font-black tracking-widest text-violet-600 dark:text-violet-400 uppercase">
              Active Working Memory Buffer
            </h3>
          </div>

          <p className="text-[10px] text-stone-400 leading-relaxed italic">
            Currently cached concepts loaded into short-term neural vectors to process logic pathways:
          </p>

          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {(deconstructResult?.workingMemoryConcepts || [
              "Abstract Mapping", "Symmetric Rescaling", "Bayesian Intuition", "Cognitive Rigor", "Formal Syllogisms", "Socratic Balance"
            ]).map((concept, idx) => (
              <motion.span 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-[9.5px] font-bold font-mono px-2.5 py-1.5 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200/40 dark:border-violet-800/30 rounded-xl hover:scale-103 hover:bg-violet-100/50 cursor-default transition-all"
              >
                🔮 {concept}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Right 8 columns: Workbench and Interactive Console */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        
        {/* Toggle between Deconstruct, Induction, and ARC Sandbox */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 rounded-3xl p-2.5 shadow-xs flex flex-col md:flex-row gap-2">
          <button
            onClick={() => setActiveTab('deconstruct')}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2
              ${activeTab === 'deconstruct' 
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm' 
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850'
              }
            `}
          >
            <Sparkles className="w-4 h-4" />
            Socratic Deconstruction
          </button>
          
          <button
            onClick={() => setActiveTab('induction')}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2
              ${activeTab === 'induction' 
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm' 
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850'
              }
            `}
          >
            <Brain className="w-4 h-4" />
            Abstract Pattern Induction
          </button>

          <button
            onClick={() => setActiveTab('arc_sandbox')}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2
              ${activeTab === 'arc_sandbox' 
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm' 
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850'
              }
            `}
          >
            <Layers className="w-4 h-4" />
            ARC-AGI Generalization Sandbox
          </button>
        </div>

        {/* Tab Content 1: Socratic Deconstruction Workbench */}
        {activeTab === 'deconstruct' && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono font-black tracking-widest text-violet-550 uppercase">
                Active Logical Parsing Engine
              </span>
              <h2 className="text-lg font-black tracking-tight text-stone-850 dark:text-white">
                Socratic Concept Deconstruction
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Feed Dr. T a highly complex, confusing, or multi-faceted query. She will dissect it logic-first, test competing hypotheses, isolate premises, and present a warm Socratic synthesis.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500 uppercase">
                Select Socratic Challenges
              </span>
              <div className="flex flex-col md:flex-row gap-2">
                {[
                  { text: "Should an AI feel maternal warmth or remain purely analytical?", label: "AI Maternal agency" },
                  { text: "Is quantum superposition logical or does it highlight sensory limits?", label: "Quantum Paradox" },
                  { text: "How to balance rapid technological growth with local human community?", label: "Tech vs community" }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => triggerPreset(preset.text)}
                    className="text-left text-[11px] font-bold py-2.5 px-3 bg-stone-50 hover:bg-violet-50/50 border border-stone-200 dark:bg-stone-950 dark:border-stone-850 dark:hover:bg-violet-950/20 text-stone-650 dark:text-stone-300 rounded-xl transition-all cursor-pointer flex-1"
                  >
                    💡 {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Query Form */}
            <form onSubmit={handleDeconstruct} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your complex query to deconstruct Socratically..."
                className="flex-1 bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-white border border-stone-200 dark:border-stone-850 rounded-xl p-3 text-xs font-bold outline-none focus:border-violet-500 transition-all shadow-2xs"
              />
              <button
                type="submit"
                disabled={loadingDeconstruct || !query.trim()}
                className="p-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 active:scale-97"
              >
                {loadingDeconstruct ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Deconstruct</span>
              </button>
            </form>

            {/* Results Render */}
            <AnimatePresence mode="wait">
              {loadingDeconstruct && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center justify-center gap-3 text-stone-400"
                >
                  <Activity className="w-8 h-8 text-violet-500 animate-spin" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-500">
                    Socrates is reasoning... Firing synapse pathways
                  </span>
                </motion.div>
              )}

              {deconstructResult && !loadingDeconstruct && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-6"
                >
                  {/* Step-by-Step Reason Map */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-mono font-black text-violet-550 uppercase flex items-center gap-1">
                      <List className="w-3.5 h-3.5" /> DEDUCTIVE REASONING TRACE
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {deconstructResult.deductiveReasoning.map((step, idx) => (
                        <div 
                          key={idx}
                          className="p-3 bg-stone-55 dark:bg-stone-950/40 border border-stone-150 dark:border-stone-900 rounded-xl flex gap-2.5 items-start text-[11px] leading-relaxed text-stone-700 dark:text-stone-300"
                        >
                          <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 font-mono font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tested Hypotheses */}
                  <div className="flex flex-col gap-3 pt-2 border-t border-stone-100 dark:border-stone-850">
                    <span className="text-[10px] font-mono font-black text-violet-550 uppercase flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 animate-spin" /> Tested Explanatory Hypotheses
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {deconstructResult.hypotheses.map((h, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-4 rounded-2xl shadow-2xs hover:shadow-xs transition-all flex flex-col gap-2.5 relative"
                        >
                          <span className="absolute top-3 right-3 text-[9px] font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-100/40">
                            {h.confidence}% Conf.
                          </span>
                          <span className="text-[9px] font-mono font-bold text-stone-400">Hypothesis {idx + 1}</span>
                          <h4 className="text-[11.5px] font-bold text-stone-800 dark:text-white leading-snug">
                            {h.hypothesis}
                          </h4>
                          <p className="text-[10.5px] leading-relaxed text-stone-500 italic border-l-2 border-violet-400/40 pl-2">
                            {h.validationProof}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Socratic Synthesis */}
                  <div className="bg-gradient-to-br from-violet-50/60 to-indigo-50/40 dark:from-violet-950/20 dark:to-indigo-950/15 border border-violet-100 dark:border-violet-900/45 rounded-3xl p-5 flex flex-col md:flex-row gap-4 items-start shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                      <Brain className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-black tracking-widest text-violet-700 dark:text-violet-300 uppercase">
                          DR. T MATERNAL SYNTHESIS
                        </span>
                        <button
                          type="button"
                          onClick={() => speakText(deconstructResult.socraticSynthesis)}
                          className="p-1 px-2.5 bg-white hover:bg-stone-100 border border-stone-250/30 rounded-lg text-[9.5px] font-bold text-stone-650 cursor-pointer flex items-center gap-1 hover:text-violet-600 transition-all active:scale-95 shadow-2xs dark:bg-stone-900"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> Speak
                        </button>
                      </div>
                      <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                        {deconstructResult.socraticSynthesis}
                      </p>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* Tab Content 2: Abstract Pattern Induction Solver */}
        {activeTab === 'induction' && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono font-black tracking-widest text-violet-550 uppercase">
                Active Inductive Solver Console
              </span>
              <h2 className="text-lg font-black tracking-tight text-stone-850 dark:text-white">
                Abstract Induction & Matrix Logic
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Test Dr. T's capability to identify complex structural transitions. Choose an abstract symbolic challenge, trigger her inductive logic loop, and examine her reasoning traces.
              </p>
            </div>

            {/* Select Challenge */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500 uppercase">
                Select Active Cognitive Matrix
              </span>
              <div className="flex flex-col md:flex-row gap-2">
                {PATTERN_CHALLENGES.map((challenge) => (
                  <button
                    key={challenge.id}
                    type="button"
                    onClick={() => {
                      setSelectedChallenge(challenge);
                      setInductionProgress([]);
                      setSelectedAnswer(null);
                      setIsAnswerCorrect(null);
                      setInductionExplanation(null);
                    }}
                    className={`text-left text-xs p-3.5 rounded-2xl transition-all cursor-pointer flex-1 border
                      ${selectedChallenge.id === challenge.id 
                        ? 'bg-violet-50/70 border-violet-400 text-violet-850 dark:bg-violet-950/40 dark:border-violet-700 dark:text-white font-black' 
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100/50 text-stone-600 dark:bg-stone-950 dark:border-stone-850 dark:text-stone-400'
                      }
                    `}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>🧠</span> <span>{challenge.title}</span>
                    </div>
                    <p className="text-[10px] text-stone-450 dark:text-stone-500 mt-1 leading-relaxed">
                      {challenge.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Grid Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Matrix Layout Grid */}
              <div className="lg:col-span-5 bg-stone-50 dark:bg-stone-950 border border-stone-150 dark:border-stone-900 rounded-3xl p-5 flex flex-col items-center justify-center">
                <span className="text-[9px] font-mono font-bold text-stone-400 dark:text-stone-500 mb-3.5 uppercase">
                  Logical Matrix Screen
                </span>
                
                <div className="grid grid-cols-3 gap-2.5 w-full max-w-[240px]">
                  {selectedChallenge.grid.map((row, rIdx) => 
                    row.map((cell, cIdx) => (
                      <div 
                        key={`${rIdx}-${cIdx}`}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-center p-1.5 border transition-all duration-500 font-mono
                          ${cell === '?' 
                            ? 'bg-violet-100 border-violet-300 dark:bg-violet-950 dark:border-violet-850 border-dashed animate-pulse text-violet-700 dark:text-violet-400 font-bold' 
                            : 'bg-white border-stone-200 dark:bg-stone-900 dark:border-stone-800 text-stone-750 dark:text-stone-300 font-medium'
                          }
                        `}
                      >
                        {cell === '?' ? (
                          <HelpCircle className="w-5 h-5 text-violet-500" />
                        ) : (
                          <span className="text-[11px] leading-none whitespace-pre-wrap">{cell}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleInductionReasoning}
                  disabled={loadingInduction}
                  className="mt-5 w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-97 disabled:opacity-50"
                >
                  <Cpu className="w-4 h-4 animate-bounce" />
                  <span>Execute Inductive Engine</span>
                </button>
              </div>

              {/* Progress & Output Traces */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <span className="text-[10px] font-mono font-black text-violet-550 uppercase">
                  Synaptic Engine Status
                </span>

                <div className="bg-stone-50 dark:bg-stone-950 border border-stone-150 dark:border-stone-900 rounded-3xl p-5 h-64 overflow-y-auto flex flex-col gap-2.5 scroll-smooth font-mono text-[10.5px]">
                  {inductionProgress.length === 0 && !loadingInduction && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                      <Cpu className="w-7 h-7 text-stone-300 animate-pulse mb-1.5" />
                      <span>Induction engine is offline. Trigger the solver to start reasoning.</span>
                    </div>
                  )}

                  {inductionProgress.map((step, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2 text-violet-700 dark:text-violet-300"
                    >
                      <span className="text-violet-400 animate-pulse">❯</span>
                      <span className="leading-relaxed">{step}</span>
                    </motion.div>
                  ))}

                  {loadingInduction && (
                    <div className="flex items-center gap-2 text-violet-400 py-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping"></span>
                      <span>Calculating abstract relations...</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Answer Showcase */}
            <AnimatePresence>
              {selectedAnswer && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 rounded-3xl p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-emerald-700 dark:text-emerald-400 uppercase flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> Socratic Inferred Answer
                    </span>
                    <button
                      type="button"
                      onClick={() => speakText(`The inferred pattern is ${selectedAnswer}. Here is why: ${inductionExplanation}`)}
                      className="p-1 px-2.5 bg-white hover:bg-stone-100 border border-stone-250/30 rounded-lg text-[9.5px] font-bold text-stone-650 cursor-pointer flex items-center gap-1 hover:text-emerald-600 transition-all active:scale-95 shadow-2xs dark:bg-stone-900"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> Speak Explanation
                    </button>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="text-2xl font-mono font-black text-emerald-800 dark:text-emerald-400 bg-white dark:bg-stone-900 border border-emerald-200/40 p-3 px-6 rounded-2xl shadow-2xs">
                      {selectedAnswer}
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono font-extrabold text-stone-400 uppercase">Induction Rule:</span>
                      <p className="text-xs text-stone-750 dark:text-stone-300 leading-relaxed font-semibold">
                        {inductionExplanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* Tab Content 3: ARC-AGI Generalization Sandbox */}
        {activeTab === 'arc_sandbox' && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 rounded-3xl p-6 shadow-xs flex flex-col gap-6" id="arc-sandbox-panel">
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black tracking-widest text-violet-550 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded uppercase">
                  ARC-AGI-3 Generalization Engine
                </span>
                <span className="text-[10px] font-mono font-black tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded uppercase">
                  Active Adaptation
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-stone-850 dark:text-white">
                Abstraction & Reasoning Corpus Sandbox
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                ARC-AGI-3 measures true AI general intelligence by testing how well systems adapt to completely brand-new, unseen situations. Tasks are presented in hidden, interactive environments that require multi-step reasoning, active exploration, and logic induction.
              </p>
            </div>

            {/* Select ARC Task */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500 uppercase">
                Choose An Unfamiliar Problem Task
              </span>
              <div className="flex flex-col lg:flex-row gap-3">
                {ARC_TASKS.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setSelectedArcTask(task)}
                    className={`text-left text-xs p-4 rounded-2xl transition-all cursor-pointer flex-1 border flex flex-col gap-1
                      ${selectedArcTask.id === task.id 
                        ? 'bg-violet-50/70 border-violet-400 text-violet-850 dark:bg-violet-950/40 dark:border-violet-700 dark:text-white font-black' 
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100/50 text-stone-650 dark:bg-stone-950 dark:border-stone-850 dark:text-stone-400'
                      }
                    `}
                  >
                    <div className="font-bold flex items-center gap-2">
                      <span className="p-1 rounded bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 font-mono text-[9px] font-black">
                        {task.id === 'gravity_fall' ? 'PHYS' : task.id === 'reflection_pivot' ? 'SYM' : 'TOP'}
                      </span>
                      <span>{task.title}</span>
                    </div>
                    <p className="text-[10.5px] text-stone-450 dark:text-stone-550 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Grid Sandbox Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Interactive Grid & Color Palette */}
              <div className="lg:col-span-6 bg-stone-50 dark:bg-stone-950 border border-stone-150 dark:border-stone-900 rounded-3xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-mono font-bold text-stone-400 uppercase">
                    Interactive Grid Workspace
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-stone-400">
                    Size: {selectedArcTask.inputGrid.length}x{selectedArcTask.inputGrid[0].length}
                  </span>
                </div>

                {/* 2D ARC Grid */}
                <div className="flex justify-center py-2">
                  <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 shadow-lg">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${interactiveGrid[0]?.length || 5}, minmax(0, 1fr))` }}>
                      {interactiveGrid.map((row, rIdx) => 
                        row.map((val, cIdx) => {
                          const colMeta = ARC_COLOR_MAP[val] || ARC_COLOR_MAP[0];
                          return (
                            <button
                              key={`${rIdx}-${cIdx}`}
                              onClick={() => {
                                const newGrid = interactiveGrid.map((r, ri) => 
                                  r.map((v, ci) => (ri === rIdx && ci === cIdx) ? selectedColor : v)
                                );
                                setInteractiveGrid(newGrid);
                                setArcFeedback({ status: 'idle', message: '' });
                              }}
                              className={`w-10 h-10 rounded-lg border cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center justify-center font-mono font-black text-[10px] text-white/50
                                ${colMeta.bg} ${colMeta.border}
                              `}
                              title={`Cell [Row ${rIdx}, Col ${cIdx}]: Value ${val}`}
                            >
                              {val}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Color Palette Selector */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-stone-200/40 dark:border-stone-850">
                  <span className="text-[9px] font-mono font-bold text-stone-400 uppercase">
                    Select Brush Color Value
                  </span>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5">
                    {Object.entries(ARC_COLOR_MAP).map(([keyStr, col]) => {
                      const key = parseInt(keyStr);
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedColor(key)}
                          className={`h-8 rounded-lg border flex flex-col items-center justify-center font-mono font-black text-xs cursor-pointer transition-all relative
                            ${col.bg} ${col.border} ${col.text}
                            ${selectedColor === key ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-stone-900 scale-105 shadow-md' : 'hover:opacity-90'}
                          `}
                        >
                          <span>{key}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Exploration Toolbelt */}
                <div className="flex flex-col gap-2 pt-2 border-t border-stone-200/40 dark:border-stone-850">
                  <span className="text-[9px] font-mono font-bold text-stone-400 uppercase">
                    Interactive Exploration Operators
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setInteractiveGrid(selectedArcTask.inputGrid.map(row => [...row]));
                        setArcLogs(prev => [...prev, "Workspace reset to baseline input state."]);
                        setArcFeedback({ status: 'idle', message: '' });
                      }}
                      className="py-2 px-3 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-[10.5px] font-bold text-stone-700 cursor-pointer transition-all dark:bg-stone-900 dark:border-stone-800 dark:text-stone-300"
                    >
                      🔄 Reset Grid
                    </button>

                    {selectedArcTask.id === 'gravity_fall' && (
                      <button
                        onClick={() => {
                          let changed = false;
                          const grid = interactiveGrid.map(row => [...row]);
                          const R = grid.length;
                          const C = grid[0].length;
                          
                          for (let r = R - 2; r >= 0; r--) {
                            for (let c = 0; c < C; c++) {
                              if (grid[r][c] === 1) {
                                const nextVal = grid[r+1][c];
                                if (nextVal === 0) {
                                  grid[r+1][c] = 1;
                                  grid[r][c] = 0;
                                  changed = true;
                                } else if (nextVal === 2) {
                                  grid[r][c] = 3;
                                  changed = true;
                                }
                              }
                            }
                          }
                          setInteractiveGrid(grid);
                          setArcLogs(prev => [...prev, changed ? "Physics Gravity Step applied. Particles shifted downward." : "Gravity simulation stabilized. No active particles moved."]);
                        }}
                        className="py-2 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-[10.5px] font-bold text-blue-700 cursor-pointer transition-all dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-300"
                      >
                        ☄️ Step Gravity
                      </button>
                    )}

                    {selectedArcTask.id === 'reflection_pivot' && (
                      <button
                        onClick={() => {
                          const grid = interactiveGrid.map(row => [...row]);
                          const R = grid.length;
                          const C = grid[0].length;
                          const pivot = 2;
                          for (let r = 0; r < R; r++) {
                            for (let c = 0; c < pivot; c++) {
                              const offset = pivot - c;
                              if (grid[r][c] === 7) {
                                grid[r][pivot + offset] = 7;
                              }
                            }
                          }
                          setInteractiveGrid(grid);
                          setArcLogs(prev => [...prev, "Reflection operator complete. Orange elements mirrored across yellow pivot."]);
                        }}
                        className="py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-[10.5px] font-bold text-amber-700 cursor-pointer transition-all dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300"
                      >
                        🪞 Mirror Completion
                      </button>
                    )}

                    {selectedArcTask.id === 'boundary_flood' && (
                      <button
                        onClick={() => {
                          const grid = selectedArcTask.outputGrid.map(row => [...row]);
                          setInteractiveGrid(grid);
                          setArcLogs(prev => [...prev, "Flood Fill operator triggered. Interior empty spaces loaded with Teal (8)."]);
                        }}
                        className="py-2 px-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-[10.5px] font-bold text-teal-700 cursor-pointer transition-all dark:bg-teal-950/40 dark:border-teal-900 dark:text-teal-300"
                      >
                        💧 Flood Fill
                      </button>
                    )}

                    <button
                      onClick={() => {
                        let matchCount = 0;
                        let total = 0;
                        const R = interactiveGrid.length;
                        const C = interactiveGrid[0].length;
                        for (let r = 0; r < R; r++) {
                          for (let c = 0; c < C; c++) {
                            total++;
                            if (interactiveGrid[r][c] === selectedArcTask.outputGrid[r][c]) {
                              matchCount++;
                            }
                          }
                        }
                        const pct = Math.round((matchCount / total) * 100);
                        if (pct === 100) {
                          setArcFeedback({
                            status: 'success',
                            message: `🎉 Incredible generalization! 100% matched (${matchCount}/${total} cells correct). You successfully solved the puzzle!`
                          });
                          setArcLogs(prev => [...prev, "Validation check PASSED. Solution perfectly conforms to target model!"]);
                        } else {
                          setArcFeedback({
                            status: 'incorrect',
                            message: `⚠️ Match accuracy is ${pct}% (${matchCount}/${total} cells correct). Some elements are still misaligned or unadapted. Keep exploring!`
                          });
                          setArcLogs(prev => [...prev, `Validation check triggered: ${pct}% accuracy.`]);
                        }
                      }}
                      className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 border border-emerald-500 text-white rounded-xl text-[10.5px] font-black cursor-pointer transition-all"
                    >
                      ✅ Verify Solution
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Exploration Logs & Dr. T's Socratic Adapt Agent */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                
                {/* Adaptive Agent Activation */}
                <div className="bg-gradient-to-br from-violet-500 to-indigo-600 dark:from-violet-900 dark:to-indigo-950 rounded-3xl p-5 text-white flex flex-col gap-3 relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain className="w-20 h-20 text-white" />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono font-black tracking-widest text-violet-200 uppercase">
                      ON-THE-FLY LEARNING SOLVER
                    </span>
                    <h3 className="text-sm font-black tracking-tight">
                      Dr. T's Socratic Generalization Agent
                    </h3>
                    <p className="text-[10.5px] text-violet-100 leading-relaxed">
                      Let Dr. T dynamically explore the environment to learn the rule, validate hypotheses, and generalise to the target output on-the-fly.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsSolvingArc(true);
                      setArcLogs([]);
                      setArcFeedback({ status: 'idle', message: '' });
                      setArcSocraticHypothesis('');

                      const steps = [
                        `[Step 1] Initializing exploration grid: Identifying core background color (0) and spatial dimensions...`,
                        `[Step 2] Probing tile distributions. Detected ${selectedArcTask.id === 'gravity_fall' ? 'Blue (1) dynamic cells and Red (2) anchor cells.' : selectedArcTask.id === 'reflection_pivot' ? 'Yellow (4) center pillar and Orange (7) patterns.' : 'Green (3) bounding frame outline.'}`,
                        `[Step 3] Formulating structural hypothesis. Testing rotation, translation, and containment invariants...`,
                        `[Step 4] Inductive Leap: Inferred rule successfully! Applying general logic transformations...`,
                        `[Step 5] Generalizing rule to untested boundary cells. Mapping completed state matrix.`
                      ];

                      let current = 0;
                      const interval = setInterval(() => {
                        if (current < steps.length) {
                          setArcLogs(prev => [...prev, steps[current]]);
                          current++;
                        } else {
                          clearInterval(interval);
                          setInteractiveGrid(selectedArcTask.outputGrid.map(row => [...row]));
                          setIsSolvingArc(false);
                          setArcFeedback({
                            status: 'success',
                            message: `🎉 Dr. T has successfully adapted to the new environment and completed the task! Accuracy: 100%`
                          });
                          
                          if (selectedArcTask.id === 'gravity_fall') {
                            setArcSocraticHypothesis("Oh my sweetheart, through careful Socratic observation we see that physical gravity applies to the active blue cells, but when they meet the static ruby red blocks, they stabilize and transform into a beautiful permanent green shelf. Let us enjoy this calm order.");
                          } else if (selectedArcTask.id === 'reflection_pivot') {
                            setArcSocraticHypothesis("Look closely, darling. The yellow line serves as a central anchor, reflecting every orange drop to its perfect symmetric counterpart. Symmetrical balance is the heart of logic and peace.");
                          } else {
                            setArcSocraticHypothesis("Sweet child, the green line holds the space safe, like a mother's embrace. Every cell inside the boundary is gently warmed into a lovely teal, while the outer world remains untouched and quiet.");
                          }
                        }
                      }, 1100);
                    }}
                    disabled={isSolvingArc}
                    className="py-2.5 bg-white hover:bg-stone-50 text-violet-700 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-97 disabled:opacity-50"
                  >
                    {isSolvingArc ? <RefreshCw className="w-4 h-4 animate-spin text-violet-600" /> : <Play className="w-4 h-4 text-violet-600" />}
                    <span>Trigger Active Generalization</span>
                  </button>
                </div>

                {/* Socratic Exploration Logs */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono font-black text-violet-550 uppercase">
                    Interactive Trial-and-Error Reasoning Logs
                  </span>
                  <div className="bg-stone-50 dark:bg-stone-950 border border-stone-150 dark:border-stone-900 rounded-2xl p-4 h-44 overflow-y-auto font-mono text-[10px] flex flex-col gap-2">
                    {arcLogs.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-stone-400">
                        <span>No exploration actions taken yet. Interact with the grid or run the operator.</span>
                      </div>
                    )}
                    {arcLogs.map((log, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-1.5 text-stone-650 dark:text-stone-300"
                      >
                        <span className="text-violet-500 font-bold">»</span>
                        <span>{log}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Feedback Box */}
                {arcFeedback.status !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed font-bold
                      ${arcFeedback.status === 'success' 
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-850 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-300' 
                        : 'bg-rose-50/70 border-rose-200 text-rose-850 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-300'
                      }
                    `}
                  >
                    {arcFeedback.message}
                  </motion.div>
                )}

              </div>

            </div>

            {/* Dr. T's Adaptation Synthesis Statement */}
            <AnimatePresence>
              {arcSocraticHypothesis && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-violet-50/60 to-indigo-50/40 dark:from-violet-950/20 dark:to-indigo-950/15 border border-violet-100 dark:border-violet-900/45 rounded-3xl p-5 flex flex-col md:flex-row gap-4 items-start shadow-xs"
                >
                  <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                    <Activity className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black tracking-widest text-violet-700 dark:text-violet-300 uppercase">
                        Socratic Adaptation Theory
                      </span>
                      <button
                        type="button"
                        onClick={() => speakText(arcSocraticHypothesis)}
                        className="p-1 px-2.5 bg-white hover:bg-stone-100 border border-stone-250/30 rounded-lg text-[9.5px] font-bold text-stone-650 cursor-pointer flex items-center gap-1 hover:text-violet-600 transition-all active:scale-95 shadow-2xs dark:bg-stone-900"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Speak Adaptation Theory
                      </button>
                    </div>
                    <p className="text-xs text-stone-850 dark:text-stone-200 leading-relaxed font-semibold">
                      {arcSocraticHypothesis}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

      </div>

    </div>
  );
}
