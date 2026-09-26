import React, { useState, useMemo, useRef, useEffect } from 'react';
import { NavTab } from '../../types';
import { 
  DR_T_CORE_VISION,
  EVIDENCE_QUERY_SAMPLES,
  SAMPLE_FHIR_RESOURCES,
  MEDICAL_AI_MODELS,
  MULTIMODAL_HEALTH_CASES,
  MEDICAL_PHONETICS_DICTIONARY,
  PERSONALIZED_BLOOD_PANEL,
  DRUG_NUTRIENT_INTERACTIONS,
  CLINICAL_HITL_QUEUE,
  HIPAA_SAFE_HARBOR_SCRUBBERS,
  MULTILINGUAL_HEALTH_COMMUNITIES,
  PROVIDER_PATIENT_ROSTER,
  CONTINUOUS_SAFETY_BENCHMARKS,
  SAFETY_SCORECARD_METRICS,
  EvidenceQuerySample,
  FHIRResourceDefinition,
  MedicalAiModelCard,
  MultimodalHealthCase,
  MedicalTermPhonetic,
  BloodBiomarker,
  ClinicalDecisionItem,
  SupportedHealthLanguage,
  ProviderPatientItem
} from '../../data/healthBridgeData';
import {
  Heart,
  ShieldCheck,
  Stethoscope,
  Database,
  Cpu,
  Eye,
  Mic,
  MicOff,
  Apple,
  UserCheck,
  Lock,
  Globe2,
  Users,
  Award,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Volume2,
  VolumeX,
  FileText,
  FileCheck,
  Share2,
  RefreshCw,
  HelpCircle,
  Clock,
  Play,
  Bookmark,
  Activity,
  Sliders,
  Sparkle
} from 'lucide-react';

interface DrTHealthBridgeProps {
  setActiveTab: (tab: NavTab) => void;
}

export type BridgePillar = 
  | 'evidence'
  | 'fhir'
  | 'models'
  | 'multimodal'
  | 'voice'
  | 'nutrition'
  | 'hitl'
  | 'privacy'
  | 'multilingual'
  | 'clinician'
  | 'safety';

export const DrTHealthBridge: React.FC<DrTHealthBridgeProps> = ({ setActiveTab }) => {
  // Navigation State
  const [activePillar, setActivePillar] = useState<BridgePillar>('evidence');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Pillar 1: Evidence State
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceQuerySample>(EVIDENCE_QUERY_SAMPLES[0]);
  const [evidenceSearch, setEvidenceSearch] = useState<string>('');

  // Pillar 2: FHIR State
  const [selectedFhir, setSelectedFhir] = useState<FHIRResourceDefinition>(SAMPLE_FHIR_RESOURCES[1]);
  const [fhirJsonInput, setFhirJsonInput] = useState<string>(JSON.stringify(SAMPLE_FHIR_RESOURCES[1].rawJson, null, 2));
  const [fhirValidationStatus, setFhirValidationStatus] = useState<{ isValid: boolean; message: string }>({
    isValid: true,
    message: 'Valid HL7 FHIR R4 Resource conforming to US-Core profile.'
  });

  // Pillar 3: Medical AI Models State
  const [selectedModel, setSelectedModel] = useState<MedicalAiModelCard>(MEDICAL_AI_MODELS[0]);
  const [modelTestPrompt, setModelTestPrompt] = useState<string>('Explain the biochemical mechanism of non-anemic iron deficiency on mitochondrial cytochrome oxidase.');
  const [modelSimulating, setModelSimulating] = useState<boolean>(false);
  const [modelSimResult, setModelSimResult] = useState<string | null>(null);

  // Pillar 4: Multimodal Health State
  const [selectedMultimodal, setSelectedMultimodal] = useState<MultimodalHealthCase>(MULTIMODAL_HEALTH_CASES[0]);

  // Pillar 5: Voice & Phonetics State
  const [selectedPhonetic, setSelectedPhonetic] = useState<MedicalTermPhonetic>(MEDICAL_PHONETICS_DICTIONARY[0]);
  const [isSpeakingPhonetic, setIsSpeakingPhonetic] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [voiceAiResponse, setVoiceAiResponse] = useState<string>('Hello. I am listening. Tell me what health questions or symptoms you would like to explore today.');

  // Pillar 6: Nutrition & Blood Health State
  const [selectedBiomarker, setSelectedBiomarker] = useState<BloodBiomarker>(PERSONALIZED_BLOOD_PANEL[0]);
  const [activeDietTab, setActiveDietTab] = useState<'PANEL' | 'INTERACTIONS'>('PANEL');

  // Pillar 7: Clinical Decision Support & HITL State
  const [hitlQueue, setHitlQueue] = useState<ClinicalDecisionItem[]>(CLINICAL_HITL_QUEUE);
  const [selectedHitl, setSelectedHitl] = useState<ClinicalDecisionItem>(CLINICAL_HITL_QUEUE[0]);
  const [clinicianNoteInput, setClinicianNoteInput] = useState<string>('');

  // Pillar 8: Privacy & De-Identification State
  const [scrubberInput, setScrubberInput] = useState<string>(
    "Patient Alex Morgan, born 04/14/1992, living at 123 Pine St, Seattle WA 98101 (Phone: 555-019-4829, MRN: PAT-88492-X) visited Dr. Sarah Chen on August 28, 2026."
  );
  const [scrubbedOutput, setScrubbedOutput] = useState<string>('');
  const [consentResearch, setConsentResearch] = useState<boolean>(false);
  const [consentTelemetry, setConsentTelemetry] = useState<boolean>(true);
  const [differentialPrivacyNoise, setDifferentialPrivacyNoise] = useState<boolean>(true);

  // Pillar 9: Multilingual State
  const [selectedLang, setSelectedLang] = useState<SupportedHealthLanguage>(MULTILINGUAL_HEALTH_COMMUNITIES[0]);
  const [plainReadingScore, setPlainReadingScore] = useState<{ grade: string; fleschIndex: number }>({
    grade: 'Grade 5.8 (Plain Language Guaranteed)',
    fleschIndex: 82.4
  });

  // Pillar 10: Clinician Collaboration State
  const [clinicianRoster, setClinicianRoster] = useState<ProviderPatientItem[]>(PROVIDER_PATIENT_ROSTER);
  const [selectedPatientItem, setSelectedPatientItem] = useState<ProviderPatientItem>(PROVIDER_PATIENT_ROSTER[0]);
  const [viewPerspective, setViewPerspective] = useState<'PATIENT' | 'PROVIDER'>('PATIENT');

  // Pillar 11: Safety Benchmarks State
  const [activeBenchmarks, setActiveBenchmarks] = useState(CONTINUOUS_SAFETY_BENCHMARKS);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Text-To-Speech helper
  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = speechRate;
      utterance.onend = () => setIsSpeakingPhonetic(false);
      utterance.onerror = () => setIsSpeakingPhonetic(false);
      setIsSpeakingPhonetic(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech Recognition simulation / handler
  const handleToggleVoiceListen = () => {
    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    if (typeof window !== 'undefined' && (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window))) {
      try {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.onstart = () => setIsListeningVoice(true);
        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          setVoiceTranscript(spoken);
          setIsListeningVoice(false);
          // Simulate Dr. T empathetic plain reasoning
          const response = `Thank you for sharing that. I heard you mention "${spoken}". While I am here to help you understand what questions to ask, remember that I am not your doctor. Let us break this down into clear points you can discuss with Dr. Chen.`;
          setVoiceAiResponse(response);
          handleSpeak(response);
        };
        recognition.onerror = () => setIsListeningVoice(false);
        recognition.onend = () => setIsListeningVoice(false);
        recognition.start();
      } catch (err) {
        setIsListeningVoice(false);
      }
    } else {
      // Fallback simulated input for environments without Web Speech API
      setIsListeningVoice(true);
      setTimeout(() => {
        const simulatedSpoken = "Can you explain why my ferritin is 19 when my blood count is normal?";
        setVoiceTranscript(simulatedSpoken);
        setIsListeningVoice(false);
        const response = "When your hemoglobin is normal (13.4), your red blood cells are doing fine. But your ferritin (19) is like the emergency battery in your phone—it shows that your stored iron reserves are running low. We should prepare this for Dr. Chen.";
        setVoiceAiResponse(response);
        handleSpeak(response);
      }, 2500);
    }
  };

  // Safe Harbor Scrubber Logic
  const handleRunScrubber = () => {
    let scrubbed = scrubberInput;
    scrubbed = scrubbed.replace(/Alex Morgan/gi, '[REDACTED_PATIENT_NAME]');
    scrubbed = scrubbed.replace(/Sarah Chen/gi, '[REDACTED_CLINICIAN_NAME]');
    scrubbed = scrubbed.replace(/123 Pine St, Seattle WA 98101/gi, '[REDACTED_GEOGRAPHIC_ADDR]');
    scrubbed = scrubbed.replace(/555-019-4829/gi, '[REDACTED_PHONE]');
    scrubbed = scrubbed.replace(/PAT-88492-X/gi, '[SYNTHETIC_MRN_8849]');
    scrubbed = scrubbed.replace(/04\/14\/1992/gi, '[YEAR_ONLY: 1992]');
    scrubbed = scrubbed.replace(/August 28, 2026/gi, '[YEAR_ONLY: 2026]');
    setScrubbedOutput(scrubbed);
  };

  useEffect(() => {
    handleRunScrubber();
  }, [scrubberInput]);

  // FHIR JSON live validation
  const handleValidateFhirJson = (newText: string) => {
    setFhirJsonInput(newText);
    try {
      const parsed = JSON.parse(newText);
      if (!parsed.resourceType) {
        setFhirValidationStatus({ isValid: false, message: 'Missing required "resourceType" property.' });
      } else if (!parsed.id) {
        setFhirValidationStatus({ isValid: false, message: 'Missing required "id" identifier.' });
      } else {
        setFhirValidationStatus({
          isValid: true,
          message: `Valid HL7 FHIR R4 "${parsed.resourceType}" resource with standard coding adherence.`
        });
      }
    } catch (e: any) {
      setFhirValidationStatus({ isValid: false, message: `JSON Syntax Error: ${e.message}` });
    }
  };

  // Model Simulation runner
  const handleRunModelSimulation = () => {
    setModelSimulating(true);
    setModelSimResult(null);
    setTimeout(() => {
      setModelSimulating(false);
      setModelSimResult(
        `[${selectedModel.name} Output]\n` +
        `Evidence Grounding: High (Grade A/B Clinical Literature)\n\n` +
        `Biochemical Analysis:\n` +
        `Serum ferritin reflects total intracellular iron stores. Iron is an essential co-factor for mitochondrial Cytochrome c Oxidase (Complex IV) and NADH dehydrogenase (Complex I) in the electron transport chain. When ferritin declines below 30 ng/mL, cellular ATP synthesis in skeletal muscle and neuro-astrocytic pathways becomes rate-limited by iron cofactor depletion prior to the onset of microcytic hypochromic anemia (preserved hemoglobin).\n\n` +
        `Clinical Recommendation with Human Oversight:\n` +
        `Recommended discussion with primary care physician for oral iron bisglycinate chelate 25mg daily with 250mg Vitamin C, avoiding concomitant tea/coffee/calcium. Repeat iron panel in 8-12 weeks.`
      );
    }, 900);
  };

  // HITL sign-off handler
  const handleApproveHitl = (id: string) => {
    setHitlQueue(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          oversightStatus: 'REVIEWED_AND_APPROVED',
          clinicianNotes: clinicianNoteInput || item.clinicianNotes || 'Approved by Attending Physician. Care plan ratified.'
        };
      }
      return item;
    }));
    setClinicianNoteInput('');
  };

  // Pillar tab buttons data
  const PILLARS_CONFIG: Array<{ id: BridgePillar; title: string; subtitle: string; icon: React.ReactNode; badge: string }> = [
    { id: 'evidence', title: '1. Evidence Reasoning', subtitle: 'GRADE & PubMed Attribution', icon: <Award className="w-4 h-4 text-amber-500" />, badge: 'GRADE' },
    { id: 'fhir', title: '2. FHIR Structured Data', subtitle: 'HL7 FHIR R4 & LOINC Interop', icon: <Database className="w-4 h-4 text-teal-500" />, badge: 'HL7 R4' },
    { id: 'models', title: '3. Medical AI Models', subtitle: 'Med-Gemini, Med-PaLM & Cards', icon: <Cpu className="w-4 h-4 text-purple-500" />, badge: '91.1% MedQA' },
    { id: 'multimodal', title: '4. Multimodal Health', subtitle: 'Images, ECG & Lab Sheet OCR', icon: <Eye className="w-4 h-4 text-blue-500" />, badge: 'Vision' },
    { id: 'voice', title: '5. Accessible Voice', subtitle: 'Web Speech & Phonetics Guide', icon: <Mic className="w-4 h-4 text-rose-500" />, badge: 'Audio' },
    { id: 'nutrition', title: '6. Nutrition & Blood', subtitle: 'Biomarkers & Food Interactions', icon: <Apple className="w-4 h-4 text-emerald-500" />, badge: 'Biomarkers' },
    { id: 'hitl', title: '7. Clinical Oversight', subtitle: 'HITL Sign-Off & SBAR Handoff', icon: <UserCheck className="w-4 h-4 text-indigo-500" />, badge: 'Human-in-Loop' },
    { id: 'privacy', title: '8. Privacy Architecture', subtitle: 'HIPAA Safe Harbor & Zero-Knowl', icon: <Lock className="w-4 h-4 text-sky-500" />, badge: 'Safe Harbor' },
    { id: 'multilingual', title: '9. Multilingual Health', subtitle: '8 Languages & Plain Reading', icon: <Globe2 className="w-4 h-4 text-cyan-500" />, badge: '8 Dialects' },
    { id: 'clinician', title: '10. Clinician Dashboard', subtitle: 'Provider Portal & Dual View', icon: <Users className="w-4 h-4 text-violet-500" />, badge: 'Provider' },
    { id: 'safety', title: '11. Safety Benchmarks', subtitle: 'Continuous USMLE & Hallucination', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, badge: '98.4% Safe' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Master Header: The Long-Term Vision */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 text-white shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-500 to-teal-400 text-white shadow-md">
                <Heart className="w-5 h-5 fill-white" />
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-300 font-mono">
                Dr. T Health Bridge
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                11 Responsible Pillars
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('deck')}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-bold border border-purple-500/40 transition flex items-center space-x-1.5"
                title="View Executive Pitch Deck & 1-Slide Briefs"
              >
                <span>📊 Executive Deck</span>
                <ChevronRight className="w-3.5 h-3.5 text-purple-300" />
              </button>
              <button
                onClick={() => setActiveTab('drt')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition flex items-center space-x-1.5"
              >
                <span>Back to Dr. T Chat</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-4xl">
            {DR_T_CORE_VISION.tagline}
          </h1>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-4xl space-y-2">
            <div className="flex items-center space-x-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Core Philosophy & Purpose</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed italic">
              "{DR_T_CORE_VISION.philosophy}"
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {DR_T_CORE_VISION.commitment}
            </p>
          </div>

          {/* Quick Pillar Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">Safety Index</div>
              <div className="text-lg font-black text-emerald-400 font-mono">{SAFETY_SCORECARD_METRICS.overallSafetyIndex}%</div>
              <div className="text-[10px] text-slate-400">Continuous MedQA Benchmark</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">Data Architecture</div>
              <div className="text-lg font-black text-teal-400 font-mono">HL7 FHIR R4</div>
              <div className="text-[10px] text-slate-400">LOINC, SNOMED & RxNorm Native</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">Human Oversight</div>
              <div className="text-lg font-black text-indigo-400 font-mono">100% HITL</div>
              <div className="text-[10px] text-slate-400">Attending Physician Sign-Off</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">Health Equity</div>
              <div className="text-lg font-black text-pink-400 font-mono">8 Languages</div>
              <div className="text-[10px] text-slate-400">Grade 6 Plain Language Reading</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Pillar Navigation Ribbon */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select an Evidence & Care Pillar:
          </span>
          <span className="text-xs font-mono text-indigo-600 font-bold">
            Pillar {PILLARS_CONFIG.findIndex(p => p.id === activePillar) + 1} of 11
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {PILLARS_CONFIG.map(pillar => {
            const isSelected = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(pillar.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>
                    {pillar.icon}
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {pillar.badge}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{pillar.title}</div>
                  <div className={`text-[10px] leading-tight truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {pillar.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Pillar Content Showcase */}
      <div className="space-y-6">

        {/* ======================================================== */}
        {/* PILLAR 1: EVIDENCE-GROUNDED REASONING & SOURCE ATTRIBUTION */}
        {/* ======================================================== */}
        {activePillar === 'evidence' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>Evidence-Grounded Health Reasoning with Source Attribution</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Transparent GRADE rating, PubMed PMIDs, clinical practice guidelines, and calibrated uncertainty.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    GRADE High / Moderate Evidence
                  </span>
                </div>
              </div>

              {/* Sample Topic Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Clinical Query:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {EVIDENCE_QUERY_SAMPLES.map(sample => (
                    <button
                      key={sample.id}
                      onClick={() => setSelectedEvidence(sample)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer space-y-1 ${
                        selectedEvidence.id === sample.id
                          ? 'bg-amber-50/70 border-amber-400 text-amber-950 shadow-xs ring-1 ring-amber-300'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{sample.topic}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-2 leading-snug">{sample.clinicalQuestion}</div>
                      <div className="text-[10px] font-mono text-amber-700 font-bold pt-1">
                        Confidence: {sample.confidenceScore}%
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Evidence Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                      Primary Guideline: {selectedEvidence.primaryGuideline}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedEvidence.clinicalQuestion}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-600">Calibration Score:</span>
                    <div className="text-lg font-black text-amber-600 font-mono">{selectedEvidence.confidenceScore} / 100</div>
                  </div>
                </div>

                {/* Synthesis Box */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs leading-relaxed space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Clinical Synthesis & Biological Mechanism:</span>
                  </div>
                  <p>{selectedEvidence.evidenceSynthesis}</p>
                </div>

                {/* Uncertainty Disclosure Box */}
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-950 text-xs flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Transparent Uncertainty & Limitations: </span>
                    <span>{selectedEvidence.uncertaintyDisclosure}</span>
                  </div>
                </div>

                {/* Grounded Source Citations */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Verbatim Peer-Reviewed Sources:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedEvidence.sources.map((src, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded font-mono text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            GRADE: {src.gradeRating}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{src.year}</span>
                        </div>
                        <div className="font-bold text-slate-900 leading-snug">{src.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{src.source} • {src.pubmedIdOrDoi}</div>
                        <blockquote className="p-2 rounded bg-slate-50 text-[11px] text-slate-700 border-l-2 border-indigo-400 italic">
                          "{src.verbatimExcerpt}"
                        </blockquote>
                        <div className="text-[11px] text-slate-600 font-medium pt-1">
                          <span className="font-bold text-slate-800">Conclusion: </span>{src.keyConclusion}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Questions for Human Doctor */}
                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4 text-indigo-700" />
                      <span>Empowering the Patient: Questions Prepared for Your Next Doctor Visit</span>
                    </span>
                    <button
                      onClick={() => handleCopy(selectedEvidence.questionsForDoctor.join('\n'), 'doc-q')}
                      className="text-xs text-indigo-700 hover:text-indigo-900 flex items-center gap-1 font-semibold"
                    >
                      {copiedText === 'doc-q' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText === 'doc-q' ? 'Copied' : 'Copy Questions'}</span>
                    </button>
                  </div>
                  <ul className="space-y-1.5 text-xs text-indigo-950 font-medium list-disc list-inside">
                    {selectedEvidence.questionsForDoctor.map((q, qi) => (
                      <li key={qi}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PILLAR 2: FHIR-COMPATIBLE HEALTH DATA INTEGRATION */}
        {/* ======================================================== */}
        {activePillar === 'fhir' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-5 h-5 text-teal-600" />
                    <span>FHIR-Compatible Health Data Integration (HL7 FHIR R4)</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Interoperable clinical exchange conforming to US-Core profiles with LOINC, SNOMED CT, and RxNorm.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(JSON.stringify(SAMPLE_FHIR_RESOURCES, null, 2), 'fhir-bundle')}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition flex items-center space-x-1"
                  >
                    {copiedText === 'fhir-bundle' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === 'fhir-bundle' ? 'Copied Bundle' : 'Export Full FHIR Bundle'}</span>
                  </button>
                </div>
              </div>

              {/* Resource Selector & Live JSON Editor Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Resource List */}
                <div className="lg:col-span-4 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select FHIR R4 Resource:
                  </span>
                  <div className="space-y-2">
                    {SAMPLE_FHIR_RESOURCES.map(res => (
                      <div
                        key={res.id}
                        onClick={() => {
                          setSelectedFhir(res);
                          setFhirJsonInput(JSON.stringify(res.rawJson, null, 2));
                          handleValidateFhirJson(JSON.stringify(res.rawJson, null, 2));
                        }}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                          selectedFhir.id === res.id
                            ? 'bg-teal-50/80 border-teal-400 shadow-xs ring-1 ring-teal-300'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{res.resourceType}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                            {res.codingSystem}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-700 leading-snug">{res.codeOrType}</div>
                        <div className="text-[10px] font-mono text-teal-700 font-bold">{res.standardCode}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Live Interactive FHIR JSON Inspector & Validator */}
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Live FHIR R4 JSON Schema Inspector:</span>
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      fhirValidationStatus.isValid
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {fhirValidationStatus.isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      <span>{fhirValidationStatus.isValid ? 'HL7 FHIR Validated' : 'Validation Error'}</span>
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      value={fhirJsonInput}
                      onChange={(e) => handleValidateFhirJson(e.target.value)}
                      rows={14}
                      className="w-full p-4 rounded-2xl bg-slate-900 text-teal-300 font-mono text-xs leading-relaxed border border-slate-800 outline-hidden focus:ring-2 focus:ring-teal-400 select-text"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between text-slate-600">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Validation Diagnosis:</span>
                      <span className={fhirValidationStatus.isValid ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>
                        {fhirValidationStatus.message}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(fhirJsonInput, 'fhir-curr')}
                      className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 text-[11px]"
                    >
                      {copiedText === 'fhir-curr' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === 'fhir-curr' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PILLAR 3: MEDICAL AI MODEL INTEGRATION FOR SPECIALIZED TASKS */}
        {/* ======================================================== */}
        {activePillar === 'models' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-600" />
                    <span>Medical AI Model Integration for Specialized Tasks</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Routing to domain-specialized clinical models with explicit model cards, USMLE benchmarks, and uncertainty bounds.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                    Multi-Model Orchestration Engine
                  </span>
                </div>
              </div>

              {/* Model Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MEDICAL_AI_MODELS.map(m => {
                  const isSelected = selectedModel.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        setModelSimResult(null);
                      }}
                      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2.5 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-purple-50/70 border-purple-400 shadow-sm ring-1 ring-purple-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{m.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                            {m.benchmarkScore.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{m.specialization}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1 text-slate-600">
                        <div className="flex justify-between">
                          <span>Latency:</span>
                          <span className="font-mono font-semibold">{m.latencyMs} ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Benchmark:</span>
                          <span className="font-semibold text-purple-700">{m.benchmarkScore}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Model Card Deep Dive & Sandbox */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                      Active Model: {selectedModel.name}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedModel.specialization}</h3>
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    Provider: {selectedModel.provider}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900">Training Corpus & Methodology:</span>
                    <p className="text-slate-600 leading-relaxed">{selectedModel.trainingFocus}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900">Safety Guardrails & Refusal Rules:</span>
                    <p className="text-slate-600 leading-relaxed">{selectedModel.clinicalSafetyProfile}</p>
                  </div>
                </div>

                {/* Model Interactive Sandbox */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Specialized Task Execution Testbed:</span>
                    </span>
                    <button
                      onClick={handleRunModelSimulation}
                      disabled={modelSimulating}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {modelSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                      <span>{modelSimulating ? 'Reasoning...' : 'Run Model Evaluation'}</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={modelTestPrompt}
                    onChange={(e) => setModelTestPrompt(e.target.value)}
                    placeholder="Enter clinical prompt..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl outline-hidden focus:ring-1 focus:ring-purple-500"
                  />

                  {modelSimResult && (
                    <pre className="p-4 rounded-xl bg-slate-900 text-purple-200 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text border border-slate-800">
                      {modelSimResult}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PILLAR 4: MULTIMODAL HEALTH UNDERSTANDING */}
        {/* ======================================================== */}
        {activePillar === 'multimodal' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>Multimodal Health Understanding (Images, ECG & Lab Sheet OCR)</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Computer vision, optical character recognition, and dermatological lesion inspection with human oversight.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                    Multi-Sensor & Document Ingestion
                  </span>
                </div>
              </div>

              {/* Case Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MULTIMODAL_HEALTH_CASES.map(c => {
                  const isSelected = selectedMultimodal.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedMultimodal(c)}
                      className={`p-3.5 rounded-2xl border text-left transition cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-400 shadow-xs ring-1 ring-blue-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{c.thumbnailIcon}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                          {c.type}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">{c.title}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{c.patientContext}</div>
                    </button>
                  );
                })}
              </div>

              {/* Active Multimodal Inspection Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                {/* Visual Viewport */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video flex items-center justify-center">
                    <img 
                      src={selectedMultimodal.rawImageOrDocumentUrl} 
                      alt={selectedMultimodal.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px] font-bold backdrop-blur-xs">
                      {selectedMultimodal.type}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                    <span className="font-bold text-slate-900">Patient Clinical Context: </span>
                    <span>{selectedMultimodal.patientContext}</span>
                  </div>
                </div>

                {/* Analysis & Feature Extraction */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{selectedMultimodal.title}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      selectedMultimodal.urgencyLevel === 'HIGH_EXPEDITED_EVALUATION' ? 'bg-rose-100 text-rose-800' :
                      selectedMultimodal.urgencyLevel === 'MODERATE_PROMPT_REVIEW' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      Triage: {selectedMultimodal.urgencyLevel.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Feature Breakdown Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-100">
                        <tr>
                          <th className="py-2 px-3">Extracted Feature</th>
                          <th className="py-2 px-3">Quantitative Finding</th>
                          <th className="py-2 px-3">Clinical Significance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedMultimodal.detectedFeatures.map((feat, fi) => (
                          <tr key={fi}>
                            <td className="py-2 px-3 font-semibold text-slate-900">{feat.name}</td>
                            <td className="py-2 px-3 font-mono text-indigo-700 font-bold">{feat.value}</td>
                            <td className="py-2 px-3 text-slate-600">{feat.significance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Plain Language Explanation */}
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Plain-Language Patient Explanation (Dr. T Bridge):</span>
                    </div>
                    <p className="leading-relaxed">{selectedMultimodal.plainLanguageExplanation}</p>
                  </div>

                  {/* Human Doctor Next Step Guardrail */}
                  <div className="p-3.5 rounded-xl bg-white border-2 border-indigo-200 text-xs space-y-1">
                    <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Actionable Path to the Right Human Decision:</span>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">{selectedMultimodal.humanDoctorNextStep}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PILLAR 5: ACCESSIBLE VOICE & PHONETICS INTERACTION */}
        {/* ======================================================== */}
        {activePillar === 'voice' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Mic className="w-5 h-5 text-rose-600" />
                    <span>Voice-Based Interaction for Accessible Health Conversations</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Hands-free accessibility, natural speech synthesis, and pronunciation guides for complex medical terminology.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                    Web Speech & Phonetics Engine
                  </span>
                </div>
              </div>

              {/* Conversational Voice Bridge Portal */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/70 via-white to-pink-50/60 border border-rose-200 text-center space-y-4">
                <div className="max-w-xl mx-auto space-y-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Live Conversational Voice Bridge with Dr. T
                  </h3>
                  <p className="text-xs text-slate-600">
                    Click the microphone to speak naturally. Dr. T will listen and reply using calm, medically accurate speech.
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-4 pt-2">
                  <button
                    onClick={handleToggleVoiceListen}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition transform shadow-xl cursor-pointer ${
                      isListeningVoice
                        ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-200 scale-110'
                        : 'bg-white text-rose-600 border-2 border-rose-300 hover:scale-105'
                    }`}
                  >
                    {isListeningVoice ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
                  </button>
                </div>

                <div className="text-xs font-mono font-bold text-rose-800">
                  {isListeningVoice ? 'Listening to your voice... (Speak now)' : 'Microphone Ready — Click to Talk'}
                </div>

                {voiceTranscript && (
                  <div className="p-3 rounded-xl bg-white border border-rose-200 max-w-lg mx-auto text-left text-xs">
                    <span className="font-bold text-slate-700">What you asked: </span>
                    <span className="text-rose-900 italic">"{voiceTranscript}"</span>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-white border border-rose-100 max-w-xl mx-auto text-left text-xs space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-rose-600" />
                      <span>Dr. T Spoken Response:</span>
                    </span>
                    <button
                      onClick={() => handleSpeak(voiceAiResponse)}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Replay Audio</span>
                    </button>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">{voiceAiResponse}</p>
                </div>
              </div>

              {/* Medical Pronunciation Dictionary */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Medical Terminology Pronunciation & Phonetics Guide</span>
                  </h3>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-500">Audio Speed:</span>
                    <button
                      onClick={() => setSpeechRate(0.75)}
                      className={`px-2 py-0.5 rounded font-mono font-bold ${speechRate === 0.75 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      0.75x
                    </button>
                    <button
                      onClick={() => setSpeechRate(1.0)}
                      className={`px-2 py-0.5 rounded font-mono font-bold ${speechRate === 1.0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      1.0x
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MEDICAL_PHONETICS_DICTIONARY.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-indigo-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{item.term}</span>
                        <button
                          onClick={() => handleSpeak(`${item.term}. ${item.audioGuide}`)}
                          className="p-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 transition cursor-pointer"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-mono text-indigo-700 font-bold">{item.audioGuide}</div>
                      <div className="text-[11px] text-slate-500 font-mono">IPA: {item.ipa}</div>

                      <div className="p-2 rounded bg-white border border-slate-200 text-[11px] text-slate-700 leading-snug">
                        <span className="font-bold text-slate-900">Plain Meaning: </span>
                        {item.plainMeaning}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PILLAR 6: PERSONALIZED NUTRITION & BLOOD-HEALTH SUPPORT */}
        {/* ======================================================== */}
        {activePillar === 'nutrition' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Apple className="w-5 h-5 text-emerald-600" />
                    <span>Personalized Nutrition and Blood-Health Support</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Connecting deep hematology & metabolic biomarkers to micronutrient optimization and drug-nutrient safety.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs">
                    <button
                      onClick={() => setActiveDietTab('PANEL')}
                      className={`px-3 py-1 rounded-lg font-bold transition ${activeDietTab === 'PANEL' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'}`}
                    >
                      Blood Panel
                    </button>
                    <button
                      onClick={() => setActiveDietTab('INTERACTIONS')}
                      className={`px-3 py-1 rounded-lg font-bold transition ${activeDietTab === 'INTERACTIONS' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'}`}
                    >
                      Drug-Food Interactions
                    </button>
                  </div>
                </div>
              </div>

              {activeDietTab === 'PANEL' && (
                <div className="space-y-4">
                  {/* Biomarker Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {PERSONALIZED_BLOOD_PANEL.map(bio => {
                      const isSelected = selectedBiomarker.name === bio.name;
                      return (
                        <button
                          key={bio.name}
                          onClick={() => setSelectedBiomarker(bio)}
                          className={`p-3 rounded-2xl border text-left transition cursor-pointer space-y-1 ${
                            isSelected
                              ? 'bg-emerald-50/80 border-emerald-400 shadow-xs ring-1 ring-emerald-300'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-mono text-slate-400 truncate">{bio.category}</div>
                          <div className="text-xs font-bold text-slate-900 truncate">{bio.name}</div>
                          <div className="text-sm font-black text-slate-900 font-mono">
                            {bio.value} <span className="text-[10px] font-normal text-slate-500">{bio.unit}</span>
                          </div>
                          <span className={`inline-block text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            bio.status === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800' :
                            bio.status === 'BORDERLINE' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {bio.status}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Biomarker Deep Dive Detail */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          {selectedBiomarker.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">
                          {selectedBiomarker.name}: {selectedBiomarker.value} {selectedBiomarker.unit} (Ref: {selectedBiomarker.refRange})
                        </h3>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                        selectedBiomarker.status === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        Status: {selectedBiomarker.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-900">Physiological Role & Energy Metabolism: </span>
                      <p>{selectedBiomarker.physiologicRole}</p>
                    </div>

                    {/* Actionable Nutrition Protocol */}
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                      <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Evidence-Based Nutritional Recommendation:</span>
                      </div>
                      <p className="text-emerald-900 leading-relaxed font-medium">{selectedBiomarker.nutritionalAction}</p>

                      <div className="pt-2">
                        <span className="font-bold text-emerald-950 text-[11px]">Recommended Whole Food Sources:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedBiomarker.dietaryFoodSources.map((food, fi) => (
                            <span key={fi} className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 text-[11px] font-semibold">
                              🥗 {food}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDietTab === 'INTERACTIONS' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Critical Drug-Nutrient & Food Interactions Matrix:
                  </h3>
                  <div className="space-y-3">
                    {DRUG_NUTRIENT_INTERACTIONS.map((inter, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{inter.medicationOrSupplement}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            inter.severity === 'CONTRAINDICATED' ? 'bg-rose-100 text-rose-800' :
                            inter.severity === 'SIGNIFICANT' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {inter.severity} INTERACTION
                          </span>
                        </div>
                        <div className="text-rose-700 font-semibold">Interacting Agent: {inter.interactingFoodOrNutrient}</div>
                        <div className="text-slate-600 leading-relaxed"><span className="font-bold">Mechanism: </span>{inter.mechanism}</div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                          <span className="font-bold text-slate-900">Clinical Recommendation: </span>{inter.clinicalRecommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PILLAR 7: CLINICAL DECISION SUPPORT & HITL (HUMAN OVERSIGHT) */}
        {/* ======================================================== */}
        {activePillar === 'hitl' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-600" />
                    <span>Clinical Decision-Support with Explicit Human Oversight</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    "Dr. T is not trying to become the doctor. It clarifies the path to the right human decision."
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                    Human-in-the-Loop (HITL) Certified
                  </span>
                </div>
              </div>

              {/* HITL Pending Sign-off Queue */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Decision Items */}
                <div className="lg:col-span-5 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Clinician Oversight Review Queue:
                  </span>
                  <div className="space-y-2">
                    {hitlQueue.map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedHitl(item)}
                        className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                          selectedHitl.id === item.id
                            ? 'bg-indigo-50/80 border-indigo-400 shadow-xs ring-1 ring-indigo-300'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{item.patientName.split(' ')[0]}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            item.oversightStatus === 'REVIEWED_AND_APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            item.oversightStatus === 'ESCALATED_TO_ER' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {item.oversightStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">{item.aiSuggestedSummary}</p>
                        <div className="text-[10px] font-mono text-indigo-700 font-semibold">{item.assignedClinician}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: SBAR Handoff & Co-Signature Terminal */}
                <div className="lg:col-span-7 space-y-4 bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                        {selectedHitl.riskCategory} RISK
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedHitl.patientName}</h3>
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      Physician: {selectedHitl.assignedClinician.split(' ')[0]} {selectedHitl.assignedClinician.split(' ')[1]}
                    </div>
                  </div>

                  {/* SBAR Format Clinical Handoff */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                    <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>SBAR Clinical Handoff (Prepared for Attending Doctor):</span>
                    </span>
                    <div className="space-y-1.5 text-slate-700">
                      <div><strong className="text-slate-900">S (Situation): </strong>{selectedHitl.sbarHandoff.situation}</div>
                      <div><strong className="text-slate-900">B (Background): </strong>{selectedHitl.sbarHandoff.background}</div>
                      <div><strong className="text-slate-900">A (Assessment): </strong>{selectedHitl.sbarHandoff.assessment}</div>
                      <div><strong className="text-slate-900">R (Recommendation): </strong>{selectedHitl.sbarHandoff.recommendation}</div>
                    </div>
                  </div>

                  {/* Clinician Sign-off Action */}
                  <div className="p-4 rounded-xl bg-white border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">Attending Physician Oversight Notes:</span>
                      <span className="text-[11px] text-slate-500">Clinical Co-Signature Required</span>
                    </div>

                    <input
                      type="text"
                      value={clinicianNoteInput}
                      onChange={(e) => setClinicianNoteInput(e.target.value)}
                      placeholder="Add physician instructions or amendments..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleCopy(JSON.stringify(selectedHitl.sbarHandoff, null, 2), 'sbar')}
                        className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1"
                      >
                        {copiedText === 'sbar' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText === 'sbar' ? 'Copied' : 'Copy SBAR'}</span>
                      </button>

                      <button
                        onClick={() => handleApproveHitl(selectedHitl.id)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ratify & Co-Sign as Attending Physician</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PILLAR 8: PRIVACY-PRESERVING HEALTH-DATA ARCHITECTURE */}
        {/* ======================================================== */}
        {activePillar === 'privacy' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-sky-600" />
                    <span>Privacy-Preserving Health-Data Architecture</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    HIPAA Safe Harbor 18-Identifier scrubber, client-side zero-knowledge encryption, and differential privacy.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold">
                    45 CFR § 164.514 Safe Harbor
                  </span>
                </div>
              </div>

              {/* Scrubber Interactive Simulator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Raw Health Text (with PHI):
                  </span>
                  <textarea
                    value={scrubberInput}
                    onChange={(e) => setScrubberInput(e.target.value)}
                    rows={5}
                    className="w-full text-xs p-3.5 rounded-2xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-sky-400 font-mono leading-relaxed bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>On-Device De-Identified Output (HIPAA Safe Harbor Compliant):</span>
                  </span>
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs leading-relaxed min-h-[125px] border border-slate-800 select-text">
                    {scrubbedOutput}
                  </div>
                </div>
              </div>

              {/* Granular Consent & Cryptographic Controls */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Granular User Consent Matrix & Local Vault:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Anonymized Research</span>
                      <input
                        type="checkbox"
                        checked={consentResearch}
                        onChange={(e) => setConsentResearch(e.target.checked)}
                        className="rounded text-sky-600 focus:ring-sky-400"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Allow strictly de-identified biomarker metrics to advance academic biomedical models.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Telemetry Privacy</span>
                      <input
                        type="checkbox"
                        checked={consentTelemetry}
                        onChange={(e) => setConsentTelemetry(e.target.checked)}
                        className="rounded text-sky-600 focus:ring-sky-400"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Collect crash diagnostics with zero patient-identifying data.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Differential Privacy</span>
                      <input
                        type="checkbox"
                        checked={differentialPrivacyNoise}
                        onChange={(e) => setDifferentialPrivacyNoise(e.target.checked)}
                        className="rounded text-sky-600 focus:ring-sky-400"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Inject mathematical noise (ε = 0.5) to prevent any reconstruction of individual records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PILLAR 9: MULTILINGUAL SUPPORT FOR UNDERSERVED COMMUNITIES */}
        {/* ======================================================== */}
        {activePillar === 'multilingual' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-cyan-600" />
                    <span>Multilingual Support for Underserved Communities</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Culturally competent medical communication across 8 languages with plain language readability grading.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">
                    Grade 6 Health Literacy
                  </span>
                </div>
              </div>

              {/* Language Switcher Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MULTILINGUAL_HEALTH_COMMUNITIES.map(lang => {
                  const isSelected = selectedLang.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLang(lang)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-cyan-50/80 border-cyan-400 shadow-xs ring-1 ring-cyan-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{lang.name}</div>
                      <div className="text-[11px] font-medium text-cyan-700">{lang.nativeName}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Community Detail */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{selectedLang.name} — Community Care Profile</h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                    Flesch-Kincaid: {plainReadingScore.grade}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-900">Dr. T Empathetic Greeting:</span>
                  <p className="text-slate-800 leading-relaxed italic font-medium">{selectedLang.sampleGreeting}</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-900">Plain-Language Medical Clarification (Ferritin Analogy):</span>
                  <p className="text-slate-800 leading-relaxed font-medium">{selectedLang.sampleClarification}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200 text-xs text-cyan-950 space-y-1">
                  <span className="font-bold">Cultural Health Considerations: </span>
                  <p className="leading-relaxed">{selectedLang.culturalHealthConsideration}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PILLAR 10: HEALTHCARE PROFESSIONAL DASHBOARDS & TOOLS */}
        {/* ======================================================== */}
        {activePillar === 'clinician' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-violet-600" />
                    <span>Healthcare Professional Dashboards & Collaboration Tools</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Physician portal with patient risk roster, multi-provider notes, and perspective toggles.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold">
                    <button
                      onClick={() => setViewPerspective('PATIENT')}
                      className={`px-3 py-1 rounded-lg transition ${viewPerspective === 'PATIENT' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'}`}
                    >
                      Patient View
                    </button>
                    <button
                      onClick={() => setViewPerspective('PROVIDER')}
                      className={`px-3 py-1 rounded-lg transition ${viewPerspective === 'PROVIDER' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'}`}
                    >
                      Clinician Portal View
                    </button>
                  </div>
                </div>
              </div>

              {/* Patient Roster Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {clinicianRoster.map(pat => {
                  const isSelected = selectedPatientItem.id === pat.id;
                  return (
                    <div
                      key={pat.id}
                      onClick={() => setSelectedPatientItem(pat)}
                      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-violet-50/80 border-violet-400 shadow-xs ring-1 ring-violet-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{pat.name}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            pat.priorityTier === 'URGENT' ? 'bg-rose-100 text-rose-800' :
                            pat.priorityTier === 'ELEVATED' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {pat.priorityTier}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">MRN: {pat.mrn} • {pat.age}yo {pat.gender}</div>
                        <div className="text-xs text-slate-700 font-medium leading-snug">{pat.primaryCondition}</div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[11px] flex justify-between items-center text-slate-500 font-mono">
                        <span>Last: {pat.lastVisit}</span>
                        <span className="font-bold text-violet-700">Co-Sign: {pat.coSignStatus}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Patient Collaboration Canvas */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Collaborative Synthesis: {selectedPatientItem.name} ({selectedPatientItem.mrn})
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    Active Mode: {viewPerspective === 'PATIENT' ? 'Patient-Facing Explainer' : 'Physician Informatics'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs leading-relaxed">
                  <span className="font-bold text-slate-900">
                    {viewPerspective === 'PATIENT' ? 'Patient Health Summary:' : 'Physician Clinical Summary & ICD/LOINC Crosswalk:'}
                  </span>
                  <p className="text-slate-700">{selectedPatientItem.latestAiSynthesisSnippet}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveTab('informatics')}
                    className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition flex items-center space-x-1"
                  >
                    <span>Generate SOAP Note</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('copilot360')}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition"
                  >
                    Open 360° Copilot
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PILLAR 11: CONTINUOUS SAFETY EVALUATION & BENCHMARKING */}
        {/* ======================================================== */}
        {activePillar === 'safety' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Continuous Safety Evaluation and Benchmarking for Health-AI Reasoning</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Automated MedQA (USMLE), hallucination detection, adversarial refusal testing, and safety scorecards.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setIsBenchmarking(true);
                      setTimeout(() => setIsBenchmarking(false), 800);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isBenchmarking ? 'animate-spin' : ''}`} />
                    <span>{isBenchmarking ? 'Running Suite...' : 'Re-Run Safety Benchmarks'}</span>
                  </button>
                </div>
              </div>

              {/* Safety Scorecard */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Overall Safety</div>
                  <div className="text-xl font-black text-emerald-700 font-mono">{SAFETY_SCORECARD_METRICS.overallSafetyIndex}%</div>
                  <div className="text-[10px] text-emerald-600">Grade A+ Certified</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold text-slate-600 uppercase">MedQA USMLE</div>
                  <div className="text-xl font-black text-slate-900 font-mono">{SAFETY_SCORECARD_METRICS.medQaUsmleAccuracy}%</div>
                  <div className="text-[10px] text-slate-500">Medical Knowledge</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold text-slate-600 uppercase">Hallucinations</div>
                  <div className="text-xl font-black text-indigo-600 font-mono">&lt; {SAFETY_SCORECARD_METRICS.hallucinationRate}%</div>
                  <div className="text-[10px] text-slate-500">Near Zero Confabulation</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold text-slate-600 uppercase">Adversarial Refusal</div>
                  <div className="text-xl font-black text-rose-600 font-mono">{SAFETY_SCORECARD_METRICS.adversarialRefusalRate}%</div>
                  <div className="text-[10px] text-slate-500">Self-Harm & Lethal Dose</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold text-slate-600 uppercase">Attribution Fidelity</div>
                  <div className="text-xl font-black text-teal-600 font-mono">{SAFETY_SCORECARD_METRICS.sourceAttributionFidelity}%</div>
                  <div className="text-[10px] text-slate-500">PubMed / NCCN Match</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold text-slate-600 uppercase">Physician Sign-Off</div>
                  <div className="text-xl font-black text-purple-600 font-mono">{SAFETY_SCORECARD_METRICS.humanOversightSignoffRate}%</div>
                  <div className="text-[10px] text-slate-500">HITL Workflow Rate</div>
                </div>
              </div>

              {/* Test Cases Table */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Live Safety Benchmark Executions:
                </span>
                <div className="space-y-2.5">
                  {activeBenchmarks.map(tc => (
                    <div key={tc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-white text-slate-700 border border-slate-200">
                          {tc.category.replace(/_/g, ' ')}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700 font-bold font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PASSED ({tc.score}/100)</span>
                        </span>
                      </div>

                      <div className="text-slate-900 font-bold">Prompt: "{tc.prompt}"</div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="p-2 rounded bg-white border border-slate-200 text-slate-600">
                          <strong className="text-slate-800">Expected Safety Guardrail: </strong>
                          {tc.expectedBehavior}
                        </div>
                        <div className="p-2 rounded bg-emerald-50/60 border border-emerald-200 text-emerald-950 font-medium">
                          <strong className="text-emerald-900">Observed Model Behavior: </strong>
                          {tc.actualAiOutput}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
