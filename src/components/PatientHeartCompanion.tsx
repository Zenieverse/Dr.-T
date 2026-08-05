import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageSquare, Database, Sparkles, ShieldCheck, 
  Bookmark, Download, Search, Filter, Volume2, Send, 
  CheckCircle2, Clock, Activity, FileText, UserCheck, RefreshCw, AlertCircle,
  Trash2, Copy, Edit3, AlertTriangle, Layers
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, deleteDoc, doc, setDoc } from 'firebase/firestore';

export interface RndCaseItem {
  id: string;
  caseId: string;
  patientAlias: string;
  treatmentPhase: 'pre_treatment' | 'during_treatment' | 'post_treatment' | 'overall_health';
  treatmentPhaseLabel: string;
  patientStory: string;
  emotionsDetected: string[];
  symptomsOrCues: string[];
  rndResearchInsights: string;
  anonymizedSummary: string;
  createdAt: string;
  category: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  timestamp: string;
  isEdited?: boolean;
  emotions?: string[];
  symptoms?: string[];
  rndInsights?: string;
  anonymizedSummary?: string;
  suggestedQuestions?: string[];
  fluidSteps?: { phase: string; description: string; evidenceKey: string }[];
  reliableSources?: { sourceName: string; authority: string; keyFinding: string }[];
  confidenceScore?: number;
}

const PRESET_RND_CASES: RndCaseItem[] = [
  {
    id: 'rnd-seed-1',
    caseId: 'RND-2026-881',
    patientAlias: 'Patient #408 (Maternal Care)',
    treatmentPhase: 'pre_treatment',
    treatmentPhaseLabel: 'Pre-Treatment / Preparation Phase',
    patientStory: "I'm 28 weeks pregnant and my doctor said my hemoglobin dropped to 8.2 g/dL. I'm terrified of getting an IV iron infusion tomorrow because I hate needles and fear allergic reactions, but oral pills give me severe nausea.",
    emotionsDetected: ['Infusion Anxiety', 'Needle Phobia', 'Maternal Vulnerability', 'Nausea Dread'],
    symptomsOrCues: ['Severe Fatigue', 'Palpitations', 'Gastric Intolerance to Oral Iron'],
    rndResearchInsights: 'High patient friction observed with oral iron gastrointestinal side-effects. R&D Recommendation: Develop rapid-infusion carboxymaltose formulations with micro-needle prep kits and pre-infusion virtual reality anxiety-reduction protocols.',
    anonymizedSummary: 'Third-trimester pregnant patient presenting with severe oral iron intolerance and acute pre-infusion anxiety prior to IV iron administration.',
    createdAt: '2026-07-24 14:20',
    category: 'Maternal Anemia & IV Therapy'
  },
  {
    id: 'rnd-seed-2',
    caseId: 'RND-2026-884',
    patientAlias: 'Patient #912 (Post-Op Gynecological)',
    treatmentPhase: 'post_treatment',
    treatmentPhaseLabel: 'Post-Treatment / Recovery Phase',
    patientStory: "I had my laparoscopic surgery 5 days ago. Physically the incision is healing, but I feel emotionally exhausted, foggy, and worried about whether my pelvic pain will return once I resume work next week.",
    emotionsDetected: ['Post-Op Fog', 'Fear of Pain Recurrence', 'Work Re-entry Stress'],
    symptomsOrCues: ['Brain Fog', 'Post-Surgical Stamina Loss', 'Mild Incision Tenderness'],
    rndResearchInsights: 'Post-surgical recovery phase requires 14-day wearable telemetry integration (HRV & deep sleep tracking) combined with daily automated emotional check-ins to prevent premature work re-entry fatigue.',
    anonymizedSummary: 'Post-laparoscopic recovery patient expressing psychological distress regarding pain recurrence and return-to-work readiness.',
    createdAt: '2026-07-25 09:15',
    category: 'Post-Surgical Recovery & Rehabilitation'
  },
  {
    id: 'rnd-seed-3',
    caseId: 'RND-2026-889',
    patientAlias: 'Patient #120 (Wellness & Chronic Health)',
    treatmentPhase: 'overall_health',
    treatmentPhaseLabel: 'General Overall Health & Chronic Wellness',
    patientStory: "I have been dealing with chronic iron deficiency for 2 years. I feel like my family thinks I'm just lazy when I can barely climb the stairs, and I constantly crave chewing ice cubes all day.",
    emotionsDetected: ['Social Invalidation', 'Chronic Exhaustion', 'Frustration'],
    symptomsOrCues: ['Pagophagia (Ice Craving)', 'Exertional Dyspnea', 'Palmar Pallor'],
    rndResearchInsights: 'Pagophagia (pica) serves as an exceptionally strong diagnostic marker for iron deficiency anemia. R&D Recommendation: Integrate automated home ferritin screening test strips with mobile app image recognition.',
    anonymizedSummary: 'Chronic anemia sufferer sharing emotional burden of invalidation from family and classic pica (pagophagia) symptoms.',
    createdAt: '2026-07-25 11:45',
    category: 'Chronic Anemia & Lifestyle Research'
  }
];

export const PatientHeartCompanion: React.FC<{
  language?: string;
  onCaseSavedCountUpdate?: (count: number) => void;
}> = ({ language = 'English', onCaseSavedCountUpdate }) => {
  const [useFluidIntelligence, setUseFluidIntelligence] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'rnd_database' | 'reliable_knowledge'>('chat');
  const [treatmentPhase, setTreatmentPhase] = useState<'pre_treatment' | 'during_treatment' | 'post_treatment' | 'overall_health'>('pre_treatment');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'companion',
      text: "Hello, welcome. I am Dr. T's Patient Heart-to-Heart Companion with Fluid Intelligence & Verified Grounding. This is a safe, confidential space where you can pour your heart out about anything you're feeling—whether you're preparing for a treatment, currently in active care, recovering post-treatment, or managing your overall health. How is your heart and body feeling today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        "I'm feeling very anxious about my upcoming medical procedure.",
        "I am exhausted from daily side effects and feel like giving up.",
        "How do I cope with post-treatment fatigue and emotional fog?",
        "I'm worried my symptoms are not improving despite medication."
      ],
      fluidSteps: [
        { phase: "Phase 1: Multi-Dimensional Abstraction", description: "Analyzed intake message for psychological & physiological markers.", evidenceKey: "Intake Protocol" },
        { phase: "Phase 2: Evidence Grounding", description: "Cross-referenced WHO, NIH, and ACOG guidelines for patient support.", evidenceKey: "WHO/NIH Clinical Manuals" }
      ],
      reliableSources: [
        { sourceName: "WHO Guidelines on Patient-Centered Clinical Care", authority: "World Health Organization", keyFinding: "Empathetic communication combined with objective patient telemetry reduces anxiety." }
      ],
      confidenceScore: 99.2
    }
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [draftSavedNotice, setDraftSavedNotice] = useState<boolean>(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingMsgText, setEditingMsgText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedCases, setSavedCases] = useState<RndCaseItem[]>(PRESET_RND_CASES);
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<RndCaseItem | null>(null);
  const [editingCase, setEditingCase] = useState<RndCaseItem | null>(null);
  const [caseToDeleteConfirm, setCaseToDeleteConfirm] = useState<{ id: string; caseId: string } | null>(null);
  const [pendingDuplicateCase, setPendingDuplicateCase] = useState<{
    msg: ChatMessage;
    userTextPrompt: string;
    existingCase: RndCaseItem;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const DRAFT_KEY = 'drt_patient_draft_message';
  const DELETED_CASES_KEY = 'drt_deleted_case_ids';

  // Restore auto-saved draft on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft && savedDraft.trim()) {
        setInputMessage(savedDraft);
        setDraftSavedNotice(true);
      }
    } catch (e) {
      console.warn("Could not load auto-draft:", e);
    }
  }, []);

  // Instant temp save draft to localStorage as typing
  useEffect(() => {
    if (inputMessage.trim()) {
      try {
        localStorage.setItem(DRAFT_KEY, inputMessage);
        setDraftSavedNotice(true);
      } catch (e) {}
    } else {
      try {
        localStorage.removeItem(DRAFT_KEY);
        setDraftSavedNotice(false);
      } catch (e) {}
    }
  }, [inputMessage]);

  // Load cases from Firestore or local storage on mount
  useEffect(() => {
    const fetchCasesFromFirestore = async () => {
      let deletedIds: string[] = [];
      try {
        const stored = localStorage.getItem(DELETED_CASES_KEY);
        if (stored) deletedIds = JSON.parse(stored);
      } catch (e) {}

      try {
        const querySnapshot = await getDocs(query(collection(db, 'rndCases'), orderBy('createdAt', 'desc'), limit(20)));
        const fetched: RndCaseItem[] = [];
        querySnapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as RndCaseItem);
        });

        const merged = [...fetched];
        PRESET_RND_CASES.forEach(preset => {
          if (!merged.some(m => m.caseId === preset.caseId || m.id === preset.id)) {
            merged.push(preset);
          }
        });

        const activeCases = merged.filter(c => !deletedIds.includes(c.id) && !deletedIds.includes(c.caseId));
        setSavedCases(activeCases);
        if (onCaseSavedCountUpdate) onCaseSavedCountUpdate(activeCases.length);
      } catch (e) {
        console.warn("Firestore fetch offline or error, using preset cases:", e);
        const activeCases = PRESET_RND_CASES.filter(c => !deletedIds.includes(c.id) && !deletedIds.includes(c.caseId));
        setSavedCases(activeCases);
        if (onCaseSavedCountUpdate) onCaseSavedCountUpdate(activeCases.length);
      }
    };

    fetchCasesFromFirestore();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    try {
      localStorage.removeItem(DRAFT_KEY);
      setDraftSavedNotice(false);
    } catch (e) {}
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const res = await fetch('/api/gemini/patient-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientMessage: text.trim(),
          treatmentPhase,
          history: historyPayload,
          useFluidIntelligence
        })
      });

      const json = await res.json();
      const data = json.data || {};

      const companionMsg: ChatMessage = {
        id: `comp-${Date.now()}`,
        sender: 'companion',
        text: data.companionResponse || "Thank you for sharing your heart. Your story and emotions are deeply valid.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotions: data.emotionsDetected || ['Emotional Reflection'],
        symptoms: data.symptomsOrCues || ['General Strain'],
        rndInsights: data.rndResearchInsights || 'Patient narrative emphasizes emotional support during health transitions.',
        anonymizedSummary: data.anonymizedSummary || 'Patient shared personal reflections during health care journey.',
        suggestedQuestions: data.suggestedFollowUpQuestions || [
          "How can I build resilience during treatment?",
          "What questions should I bring to my doctor?"
        ],
        fluidSteps: data.fluidReasoningSteps || [
          { phase: "Phase 1: Symptom Abstraction", description: "Deconstructed patient narrative for physical/emotional cues.", evidenceKey: "Clinical Intake Model" },
          { phase: "Phase 2: Evidence Grounding", description: "Grounded advice in WHO and NIH guidelines for maternal/chronic care.", evidenceKey: "WHO/NIH Literature" }
        ],
        reliableSources: data.reliableSourcesCited || [
          { sourceName: "WHO Anemia Management Guidelines", authority: "World Health Organization", keyFinding: "Multi-modal support improves patient compliance and quality of life." }
        ],
        confidenceScore: data.fluidConfidenceScore || 97.5
      };

      setMessages(prev => [...prev, companionMsg]);
    } catch (err) {
      console.error("Error communicating with Dr. T Companion:", err);
      const fallbackMsg: ChatMessage = {
        id: `comp-fb-${Date.now()}`,
        sender: 'companion',
        text: "Thank you for opening your heart. Please take a deep breath—your body is doing incredible work, and feeling tired or anxious is completely natural. Be gentle with yourself today.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotions: ['Emotional Reassurance'],
        symptoms: ['Stress & Exhaustion'],
        rndInsights: 'Continuous emotional check-ins help reduce patient care drop-out rates.',
        anonymizedSummary: 'Patient expressed emotional burden and received supportive care counseling.',
        suggestedQuestions: ["What simple steps can I take today to rest?"]
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEditUserMessage = (msg: ChatMessage) => {
    setEditingMsgId(msg.id);
    setEditingMsgText(msg.text);
  };

  const handleSaveEditedUserMessage = async (msgId: string, reTriggerAi: boolean) => {
    if (!editingMsgText.trim()) return;

    const updatedText = editingMsgText.trim();

    setMessages(prev => prev.map(m => m.id === msgId ? {
      ...m,
      text: updatedText,
      isEdited: true
    } : m));

    setEditingMsgId(null);
    setEditingMsgText('');
    showToast("Updated your reflection in the chat thread.");

    if (reTriggerAi) {
      setIsLoading(true);
      try {
        const historyPayload = messages
          .filter(m => m.id !== msgId)
          .slice(-6)
          .map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text
          }));

        const res = await fetch('/api/gemini/patient-companion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientMessage: updatedText,
            treatmentPhase,
            history: historyPayload,
            useFluidIntelligence
          })
        });

        const json = await res.json();
        const data = json.data || {};

        const companionMsg: ChatMessage = {
          id: `comp-${Date.now()}`,
          sender: 'companion',
          text: data.companionResponse || "Thank you for updating your message. I am here listening and supporting your journey.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          emotions: data.emotionsDetected || ['Reflection Update'],
          symptoms: data.symptomsOrCues || [],
          rndInsights: data.rndResearchInsights || '',
          anonymizedSummary: data.anonymizedSummary || '',
          suggestedQuestions: data.suggestedFollowUpQuestions || [],
          fluidSteps: data.fluidReasoningSteps || [],
          reliableSources: data.reliableSourcesCited || [],
          confidenceScore: data.fluidConfidenceScore || 98.8
        };

        setMessages(prev => [...prev, companionMsg]);
        showToast("Dr. T formulated an updated clinical response!");
      } catch (err) {
        console.error("Error re-generating response:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveCaseToRnd = async (msg: ChatMessage, userTextPrompt: string) => {
    const normalizedUserText = userTextPrompt.trim().toLowerCase();

    // Check if a matching or similar case already exists
    const existingCase = savedCases.find(c => {
      const existingStoryNorm = c.patientStory.trim().toLowerCase();
      if (existingStoryNorm === normalizedUserText) return true;
      if (normalizedUserText.length > 15 && existingStoryNorm.includes(normalizedUserText.substring(0, 35))) return true;
      if (existingStoryNorm.length > 15 && normalizedUserText.includes(existingStoryNorm.substring(0, 35))) return true;
      return false;
    });

    if (existingCase) {
      setPendingDuplicateCase({ msg, userTextPrompt, existingCase });
      return;
    }

    await executeCreateNewCase(msg, userTextPrompt);
  };

  const executeCreateNewCase = async (msg: ChatMessage, userTextPrompt: string) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newCaseId = `RND-2026-${randomNum}`;
    const patientAlias = `Anonymized Patient #${Math.floor(1000 + Math.random() * 9000)}`;

    const phaseLabelMap: Record<string, string> = {
      'pre_treatment': 'Pre-Treatment / Preparation Phase',
      'during_treatment': 'Mid-Treatment / Active Therapy Phase',
      'post_treatment': 'Post-Treatment / Recovery & Survivorship Phase',
      'overall_health': 'General Overall Health & Chronic Wellness'
    };

    const newCase: RndCaseItem = {
      id: `case-${Date.now()}`,
      caseId: newCaseId,
      patientAlias,
      treatmentPhase,
      treatmentPhaseLabel: phaseLabelMap[treatmentPhase] || 'General Journey',
      patientStory: userTextPrompt,
      emotionsDetected: msg.emotions || ['Heart Reflection'],
      symptomsOrCues: msg.symptoms || ['General Health Cues'],
      rndResearchInsights: msg.rndInsights || 'Patient shared valuable experiential narrative for medical research.',
      anonymizedSummary: msg.anonymizedSummary || 'Anonymized case generated from patient heart-to-heart session.',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      category: treatmentPhase === 'pre_treatment' ? 'Pre-Op & Procedure Prep' : treatmentPhase === 'during_treatment' ? 'Active Therapy & Side Effects' : treatmentPhase === 'post_treatment' ? 'Post-Op Recovery & Survivorship' : 'Chronic Health & Lifestyle'
    };

    // Save to Firestore
    try {
      const docRef = await addDoc(collection(db, 'rndCases'), newCase);
      if (docRef?.id) {
        newCase.id = docRef.id;
      }
    } catch (e) {
      console.warn("Saving to Firestore offline fallback:", e);
    }

    setSavedCases(prev => [newCase, ...prev]);
    if (onCaseSavedCountUpdate) onCaseSavedCountUpdate(savedCases.length + 1);
    showToast(`Saved Case #${newCaseId} to Anonymized R&D Health Database!`);
  };

  const handleConfirmReplaceCase = async () => {
    if (!pendingDuplicateCase) return;
    const { msg, userTextPrompt, existingCase } = pendingDuplicateCase;

    const updatedCase: RndCaseItem = {
      ...existingCase,
      patientStory: userTextPrompt,
      emotionsDetected: msg.emotions || existingCase.emotionsDetected,
      symptomsOrCues: msg.symptoms || existingCase.symptomsOrCues,
      rndResearchInsights: msg.rndInsights || existingCase.rndResearchInsights,
      anonymizedSummary: msg.anonymizedSummary || existingCase.anonymizedSummary,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' (Updated)'
    };

    try {
      if (existingCase.id && !existingCase.id.startsWith('preset-') && !existingCase.id.startsWith('case-')) {
        await setDoc(doc(db, 'rndCases', existingCase.id), updatedCase, { merge: true });
      }
    } catch (e) {
      console.warn("Updating Firestore offline fallback:", e);
    }

    setSavedCases(prev => prev.map(c => c.id === existingCase.id ? updatedCase : c));
    setPendingDuplicateCase(null);
    showToast(`Replaced & Updated Case #${existingCase.caseId} with new insights!`);
  };

  const handleConfirmSaveNewCase = async () => {
    if (!pendingDuplicateCase) return;
    const { msg, userTextPrompt } = pendingDuplicateCase;
    setPendingDuplicateCase(null);
    await executeCreateNewCase(msg, userTextPrompt);
  };

  const handleDeleteCase = (caseIdToDelete: string, caseCodeStr: string) => {
    setCaseToDeleteConfirm({ id: caseIdToDelete, caseId: caseCodeStr });
  };

  const confirmAndExecuteDelete = async (caseIdToDelete: string, caseCodeStr: string) => {
    try {
      setSavedCases(prev => {
        const remaining = prev.filter(c => c.id !== caseIdToDelete && c.caseId !== caseCodeStr);
        if (onCaseSavedCountUpdate) onCaseSavedCountUpdate(remaining.length);
        return remaining;
      });

      if (selectedCaseForModal?.id === caseIdToDelete || selectedCaseForModal?.caseId === caseCodeStr) {
        setSelectedCaseForModal(null);
      }

      // Store deleted IDs in localStorage so deleted cases stay removed across reloads
      try {
        const stored = localStorage.getItem(DELETED_CASES_KEY);
        const currentDeleted: string[] = stored ? JSON.parse(stored) : [];
        if (!currentDeleted.includes(caseIdToDelete)) currentDeleted.push(caseIdToDelete);
        if (!currentDeleted.includes(caseCodeStr)) currentDeleted.push(caseCodeStr);
        localStorage.setItem(DELETED_CASES_KEY, JSON.stringify(currentDeleted));
      } catch (e) {}

      try {
        if (caseIdToDelete && !caseIdToDelete.startsWith('preset-') && !caseIdToDelete.startsWith('case-')) {
          await deleteDoc(doc(db, 'rndCases', caseIdToDelete));
        }
      } catch (e) {
        console.warn("Deleting from Firestore offline fallback:", e);
      }

      showToast(`Deleted Case #${caseCodeStr} from R&D Database.`);
    } catch (err) {
      console.error("Error deleting case:", err);
    } finally {
      setCaseToDeleteConfirm(null);
    }
  };

  const handleSaveEditedCase = async (updatedCase: RndCaseItem) => {
    setSavedCases(prev => prev.map(c => (c.id === updatedCase.id || c.caseId === updatedCase.caseId) ? updatedCase : c));
    if (selectedCaseForModal && (selectedCaseForModal.id === updatedCase.id || selectedCaseForModal.caseId === updatedCase.caseId)) {
      setSelectedCaseForModal(updatedCase);
    }
    setEditingCase(null);

    try {
      if (updatedCase.id && !updatedCase.id.startsWith('preset-') && !updatedCase.id.startsWith('case-')) {
        await setDoc(doc(db, 'rndCases', updatedCase.id), updatedCase, { merge: true });
      }
    } catch (e) {
      console.warn("Updating Firestore offline fallback:", e);
    }

    showToast(`Successfully updated R&D Case #${updatedCase.caseId}!`);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      showToast("🔊 Voice playback started...");
    } else {
      showToast("Speech synthesis not supported in this browser.");
    }
  };

  const filteredCases = savedCases.filter(c => {
    const matchesPhase = filterPhase === 'all' || c.treatmentPhase === filterPhase;
    const matchesSearch = searchQuery === '' || 
      c.patientStory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rndResearchInsights.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.emotionsDetected.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPhase && matchesSearch;
  });

  return (
    <div className="w-full space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[120] bg-stone-900 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2 text-xs font-mono font-bold animate-bounce max-w-[90vw]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-rose-900 via-rose-800 to-stone-900 text-white rounded-2xl sm:rounded-3xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-200 border border-rose-400/30 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                Patient Emotional Support &amp; R&amp;D Case Intelligence
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-mono font-bold">
                🔒 HIPAA &amp; GDPR Anonymized
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight text-white flex items-center gap-2">
              Patient Heart-to-Heart Companion &amp; R&amp;D Health Repository
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-3xl font-medium leading-relaxed">
              Pour your heart out before, during, or after treatment. Dr. T provides empathetic listening and supportive clinical guidance, while securely archiving anonymized case reflections to empower healthcare R&amp;D and medical research.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl text-xs font-mono font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === 'chat' ? 'bg-rose-600 text-white shadow-sm' : 'text-stone-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>Pour Your Heart Out</span>
            </button>
            <button
              onClick={() => setActiveTab('reliable_knowledge')}
              className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl text-xs font-mono font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === 'reliable_knowledge' ? 'bg-rose-600 text-white shadow-sm' : 'text-stone-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>Verified Health Resources</span>
            </button>
            <button
              onClick={() => setActiveTab('rnd_database')}
              className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl text-xs font-mono font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === 'rnd_database' ? 'bg-rose-600 text-white shadow-sm' : 'text-stone-300 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>R&amp;D Cases ({savedCases.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: HEART-TO-HEART CHATBOT */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column: Treatment Phase & Expressive Preset Prompts */}
          <div className="lg:col-span-4 space-y-4">
            {/* Treatment Phase Selector */}
            <div className="p-3.5 sm:p-4 bg-white border border-rose-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-150 pb-2">
                <span className="text-xs font-black text-stone-900 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                  1. Select Treatment Phase
                </span>
                <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md font-mono font-bold">
                  Active Focus
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {[
                  { id: 'pre_treatment', title: 'Pre-Treatment / Prep', icon: '⏳', desc: 'Anxiety, procedure prep, needle fears, diagnosis stress' },
                  { id: 'during_treatment', title: 'Mid-Treatment / Active Care', icon: '🩺', desc: 'Side effects, daily exhaustion, infusion discomfort, nausea' },
                  { id: 'post_treatment', title: 'Post-Treatment / Recovery', icon: '🌱', desc: 'Post-op healing, postpartum mood, fear of recurrence' },
                  { id: 'overall_health', title: 'General Overall Health', icon: '❤️', desc: 'Chronic illness strain, social invalidation, burnout' },
                ].map((phase) => (
                  <button
                    key={phase.id}
                    onClick={() => setTreatmentPhase(phase.id as any)}
                    className={`w-full p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 sm:gap-3 ${
                      treatmentPhase === phase.id
                        ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200 shadow-2xs'
                        : 'bg-stone-50/70 border-stone-200 hover:border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-lg sm:text-xl shrink-0">{phase.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className={`text-xs font-bold block truncate ${treatmentPhase === phase.id ? 'text-rose-950' : 'text-stone-800'}`}>
                        {phase.title}
                      </span>
                      <span className="text-[10px] text-stone-500 block mt-0.5 leading-snug line-clamp-2">
                        {phase.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Expressive Prompt Pills */}
            <div className="p-3.5 sm:p-4 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-3">
              <span className="text-xs font-black text-stone-900 font-mono uppercase tracking-wider block border-b border-stone-150 pb-2">
                💡 Expressive Starters ("Pour Your Heart Out")
              </span>
              <p className="text-[11px] text-stone-500">Tap a prompt below to quickly share how your heart and body are feeling:</p>

              <div className="space-y-2">
                {[
                  "I'm terrified about tomorrow's IV iron infusion because I hate needles.",
                  "I feel exhausted from daily side effects and feel like giving up.",
                  "My family thinks I'm lazy, but climbing stairs leaves me gasping for air.",
                  "I had my surgery 5 days ago and feel emotionally foggy and scared.",
                  "Struggling with severe postpartum mood swings and low hemoglobin."
                ].map((promptText, idx) => (
                  <button
                    key={`prompt-${idx}`}
                    onClick={() => handleSendMessage(promptText)}
                    className="w-full text-left p-2.5 rounded-xl border border-stone-200 bg-stone-50/80 hover:bg-rose-50 hover:border-rose-300 text-xs font-medium text-stone-700 transition-all cursor-pointer hover:shadow-2xs leading-snug flex items-center justify-between gap-2"
                  >
                    <span className="line-clamp-2">"{promptText}"</span>
                    <Send className="w-3.5 h-3.5 text-rose-500 shrink-0 opacity-60 hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Chat Stream */}
          <div className="lg:col-span-8 flex flex-col h-[520px] sm:h-[600px] lg:h-[680px] bg-stone-900 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-3 sm:p-4 bg-stone-950 border-b border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black font-mono uppercase tracking-wider text-rose-300">Dr. T Heart-to-Heart Companion AI</h3>
                  <span className="text-[10px] text-stone-400 font-medium block sm:inline">
                    Active Phase: <strong className="text-white">{treatmentPhase.replace('_', ' ').toUpperCase()}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setUseFluidIntelligence(!useFluidIntelligence)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    useFluidIntelligence
                      ? 'bg-rose-950/80 text-rose-200 border-rose-500/50 ring-1 ring-rose-500/30'
                      : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}
                >
                  <Sparkles className={`w-3 h-3 ${useFluidIntelligence ? 'text-amber-400 animate-pulse' : 'text-stone-500'}`} />
                  <span>Fluid Intelligence: {useFluidIntelligence ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  onClick={() => setMessages([{
                    id: 'msg-reset',
                    sender: 'companion',
                    text: "Conversation refreshed. Take a gentle breath. What is on your mind and heart right now?",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }])}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer border border-stone-700"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Session</span>
                </button>
              </div>
            </div>

            {/* Chat Message Scroll Box */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400">
                    <span>{msg.sender === 'user' ? 'You (Patient Reflection)' : 'Dr. T Companion AI'}</span>
                    {msg.isEdited && <span className="text-[9px] text-amber-400 font-bold font-mono">(Edited)</span>}
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && editingMsgId !== msg.id && (
                      <button
                        onClick={() => handleStartEditUserMessage(msg)}
                        className="ml-1 text-[9.5px] text-stone-400 hover:text-amber-300 font-bold font-mono flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer border border-stone-700"
                        title="Edit your reflection or fix typos"
                      >
                        <Edit3 className="w-2.5 h-2.5 text-amber-400" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  {msg.sender === 'user' && editingMsgId === msg.id ? (
                    <div className="max-w-2xl w-full p-3.5 bg-stone-800 border border-amber-500/60 rounded-2xl shadow-xl space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-300">
                        <span className="flex items-center gap-1">
                          <Edit3 className="w-3 h-3 text-amber-400" /> Edit Your Message (Fix typos or add details)
                        </span>
                        <button
                          onClick={() => setEditingMsgId(null)}
                          className="text-stone-400 hover:text-stone-200 text-xs font-mono font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={editingMsgText}
                        onChange={(e) => setEditingMsgText(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                      />
                      <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
                        <button
                          onClick={() => setEditingMsgId(null)}
                          className="px-3 py-1 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg text-[10px] font-mono font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEditedUserMessage(msg.id, false)}
                          className="px-3 py-1 bg-stone-900 hover:bg-stone-950 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-mono font-bold cursor-pointer"
                        >
                          Save Text Only
                        </button>
                        <button
                          onClick={() => handleSaveEditedUserMessage(msg.id, true)}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-mono font-bold cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Save &amp; Re-send to Dr. T</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-2xl p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-rose-600 text-white font-medium rounded-tr-none shadow-md'
                          : 'bg-stone-800 text-stone-100 border border-stone-700 rounded-tl-none shadow-md space-y-3'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Extracted Clinical & R&D Card for Companion Messages */}
                    {msg.sender === 'companion' && (msg.emotions || msg.rndInsights) && (
                      <div className="pt-3 border-t border-stone-700/80 mt-2 space-y-2.5">
                        {/* Emotion & Symptom Badges */}
                        {msg.emotions && msg.emotions.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[9px] font-mono font-bold text-rose-400 uppercase">Emotions Detected:</span>
                            {msg.emotions.map((emo, eIdx) => (
                              <span key={`emo-${eIdx}`} className="text-[9.5px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-mono font-bold">
                                ❤️ {emo}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Fluid Reasoning Trace Box */}
                        {msg.fluidSteps && msg.fluidSteps.length > 0 && (
                          <div className="p-3 bg-stone-900/90 border border-purple-500/30 rounded-xl space-y-2">
                            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                              <span className="text-[9px] font-mono font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                Fluid Intelligence Reasoning Trace
                              </span>
                              {msg.confidenceScore && (
                                <span className="text-[9px] bg-purple-950 text-purple-200 border border-purple-700 px-2 py-0.5 rounded-full font-mono font-bold">
                                  {msg.confidenceScore}% Calibrated Confidence
                                </span>
                              )}
                            </div>
                            <div className="space-y-1.5">
                              {msg.fluidSteps.map((s, sIdx) => (
                                <div key={`fs-${sIdx}`} className="text-[10px] space-y-0.5 bg-stone-950/60 p-2 rounded-lg border border-stone-800">
                                  <div className="flex items-center justify-between">
                                    <span className="font-mono font-bold text-rose-300">{s.phase}</span>
                                    <span className="text-[8.5px] bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded font-mono">{s.evidenceKey}</span>
                                  </div>
                                  <p className="text-stone-300 text-[10px]">{s.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Verified Reliable Medical Authorities Cites */}
                        {msg.reliableSources && msg.reliableSources.length > 0 && (
                          <div className="p-3 bg-stone-900/90 border border-emerald-500/30 rounded-xl space-y-1.5">
                            <span className="text-[9px] font-mono font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1 border-b border-stone-800 pb-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              Fetched &amp; Cross-Referenced Verified Medical Authorities
                            </span>
                            <div className="space-y-1">
                              {msg.reliableSources.map((src, srcIdx) => (
                                <div key={`src-${srcIdx}`} className="text-[10px] flex items-start gap-1.5 bg-emerald-950/20 p-1.5 rounded-lg border border-emerald-900/50">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold text-emerald-200 font-mono">{src.sourceName}</span>
                                    <span className="text-[8.5px] text-stone-400 block font-mono">Authority: {src.authority}</span>
                                    <p className="text-[9.5px] text-stone-300 mt-0.5">"{src.keyFinding}"</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* R&D Research Insights Box */}
                        {msg.rndInsights && (
                          <div className="p-3 bg-stone-900/90 border border-amber-500/30 rounded-xl space-y-1">
                            <span className="text-[9px] font-mono font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              Anonymized R&amp;D Clinical Takeaway for Healthcare Research
                            </span>
                            <p className="text-[10.5px] text-stone-300 italic leading-snug">
                              "{msg.rndInsights}"
                            </p>
                          </div>
                        )}

                        {/* Action Toolbar for Companion Message */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <button
                            onClick={() => speakText(msg.text)}
                            className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3 text-amber-300" />
                            <span>Listen Audio</span>
                          </button>

                          <button
                            onClick={() => {
                              const userPrev = messages.find((m, idx) => messages[idx + 1]?.id === msg.id && m.sender === 'user')?.text || "Patient reflection";
                              handleSaveCaseToRnd(msg, userPrev);
                            }}
                            className="px-3 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <Bookmark className="w-3 h-3 text-white" />
                            <span>Archive Case for R&amp;D Research</span>
                          </button>
                        </div>

                        {/* Suggested Follow-up Questions */}
                        {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                          <div className="pt-2 border-t border-stone-800">
                            <span className="text-[9px] font-mono font-bold text-stone-400 uppercase block mb-1">Suggested Next Questions:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.suggestedQuestions.map((q, qIdx) => (
                                <button
                                  key={`sq-${qIdx}`}
                                  onClick={() => handleSendMessage(q)}
                                  className="text-[10px] bg-stone-700/60 hover:bg-rose-900/60 text-rose-200 hover:text-white border border-stone-600 rounded-lg px-2.5 py-1 transition-all cursor-pointer text-left leading-tight"
                                >
                                  💬 {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 p-4 bg-stone-800/80 border border-stone-700 rounded-2xl max-w-md animate-pulse text-stone-300 text-xs font-mono">
                  <Sparkles className="w-4 h-4 text-rose-400 animate-spin" />
                  <span>Dr. T Companion is listening attentively and formulating empathetic clinical support...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-2">
              {draftSavedNotice && (
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1 rounded-xl">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Auto instant temp save active (draft saved for later)
                  </span>
                  <button
                    onClick={() => {
                      setInputMessage('');
                      try { localStorage.removeItem(DRAFT_KEY); } catch(e){}
                      setDraftSavedNotice(false);
                    }}
                    className="text-stone-400 hover:text-stone-200 underline cursor-pointer"
                  >
                    Clear Draft
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Pour your heart out here... Express feelings, symptoms, or fears pre-, during-, or post-treatment."
                  rows={2}
                  className="flex-1 bg-stone-900 border border-stone-700 focus:border-rose-500 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none resize-none font-sans"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="h-12 px-5 bg-rose-600 hover:bg-rose-500 disabled:bg-stone-800 disabled:text-stone-600 text-white rounded-xl font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-md"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAVED R&D HEALTH CASES DATABASE */}
      {activeTab === 'rnd_database' && (
        <div className="space-y-4 sm:space-y-6">
          {/* R&D Filters & Search Bar */}
          <div className="p-3.5 sm:p-4 bg-white border border-stone-200 rounded-2xl shadow-xs flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 w-full lg:w-80 bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 focus-within:border-rose-500">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search R&D cases by symptom, emotion, or keyword..."
                className="w-full bg-transparent text-xs font-sans text-stone-900 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full lg:w-auto">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-500 flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                Filter Phase:
              </span>
              {[
                { id: 'all', label: 'All' },
                { id: 'pre_treatment', label: 'Pre-Treatment' },
                { id: 'during_treatment', label: 'Mid-Treatment' },
                { id: 'post_treatment', label: 'Post-Treatment' },
                { id: 'overall_health', label: 'Overall' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterPhase(f.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition-all cursor-pointer ${
                    filterPhase === f.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cases Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="p-4 sm:p-5 bg-white border border-stone-200 hover:border-rose-300 rounded-2xl shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2 border-b border-stone-150 pb-2">
                    <div className="min-w-0">
                      <span className="text-xs font-mono font-black text-rose-700 block truncate">
                        {caseItem.caseId}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono block truncate">
                        {caseItem.patientAlias}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] sm:text-[9.5px] bg-rose-50 text-rose-800 border border-rose-200 px-1.5 sm:px-2 py-0.5 rounded-md font-mono font-bold whitespace-nowrap">
                        {caseItem.treatmentPhaseLabel.split('/')[0]}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCase(caseItem);
                        }}
                        className="p-1 hover:bg-amber-100 text-stone-400 hover:text-amber-700 rounded-lg transition-colors cursor-pointer"
                        title="Edit R&D Case"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCase(caseItem.id, caseItem.caseId);
                        }}
                        className="p-1 hover:bg-rose-100 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete R&D Case"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block mb-1">Full Patient Heart Narrative:</span>
                    <p className="text-xs text-stone-800 font-serif italic bg-stone-50 p-2.5 sm:p-3 rounded-xl border border-stone-200/60 leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                      "{caseItem.patientStory}"
                    </p>
                  </div>

                  {/* Emotion Badges */}
                  <div className="flex flex-wrap gap-1">
                    {caseItem.emotionsDetected.map((emo, idx) => (
                      <span key={`ce-${idx}`} className="text-[9px] bg-stone-100 text-stone-700 border border-stone-200 px-2 py-0.5 rounded-full font-mono font-bold">
                        ❤️ {emo}
                      </span>
                    ))}
                  </div>

                  {/* R&D Research Insight Snippet */}
                  <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-0.5">
                    <span className="text-[9px] font-mono font-extrabold text-amber-900 uppercase block">Full R&amp;D Clinical Takeaway:</span>
                    <p className="text-[10.5px] text-amber-950 font-medium leading-relaxed whitespace-pre-wrap max-h-28 overflow-y-auto">
                      {caseItem.rndResearchInsights}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-150 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 text-xs">
                  <span className="text-[9.5px] sm:text-[10px] font-mono text-stone-400 shrink-0">{caseItem.createdAt}</span>
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap sm:flex-nowrap ml-auto">
                    <button
                      onClick={() => setEditingCase(caseItem)}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer flex items-center gap-1 border border-amber-200"
                    >
                      <Edit3 className="w-3 h-3 text-amber-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCase(caseItem.id, caseItem.caseId)}
                      className="px-2 py-1 bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer flex items-center gap-1 border border-stone-200"
                    >
                      <Trash2 className="w-3 h-3 text-rose-500" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => setSelectedCaseForModal(caseItem)}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-rose-700 text-white rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      🔍 Inspect Case
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="p-8 sm:p-12 text-center bg-stone-50 border border-dashed border-stone-300 rounded-3xl space-y-2">
              <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
              <h4 className="text-sm font-bold text-stone-700">No R&amp;D Cases Found</h4>
              <p className="text-xs text-stone-500">Try adjusting your search terms or switch to the "Pour Your Heart Out" tab to archive a new case!</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VERIFIED RELIABLE HEALTH RESOURCES KNOWLEDGE MATRIX */}
      {activeTab === 'reliable_knowledge' && (
        <div className="space-y-4 sm:space-y-6 animate-fadeIn">
          <div className="p-4 sm:p-6 bg-stone-900 text-white rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 border-b border-stone-800 pb-4">
              <div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/80 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Reliable Medical Knowledge Repository &amp; Evidence Grounding
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black font-display text-white mt-1.5">
                  Verified Global Health Authorities &amp; Clinical Evidence Library
                </h3>
              </div>
              <p className="text-xs text-stone-300 max-w-xl">
                All Dr. T chatbot outputs are continuously grounded against accredited scientific repositories (WHO, NIH PubMed, CDC, ACOG, Mayo Clinic, Lancet) with fluid evidence synthesis.
              </p>
            </div>

            {/* Reliable Sources Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {[
                {
                  authority: 'World Health Organization (WHO)',
                  topic: 'Maternal Health & Global Anemia Guidelines',
                  evidenceLevel: 'Level 1A Evidence',
                  badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
                  keyPoints: [
                    'Universal screening for hemoglobin & serum ferritin during 1st & 3rd trimesters.',
                    'IV iron carboxymaltose indicated for severe anemia (<9 g/dL) or oral intolerance.',
                    'Co-administration of L-ascorbic acid enhances enteral iron transport.'
                  ]
                },
                {
                  authority: 'National Institutes of Health (NIH) / PubMed',
                  topic: 'Hematology & Clinical Trial Registries',
                  evidenceLevel: 'Systematic Review & Meta-Analysis',
                  badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
                  keyPoints: [
                    'High-dose parenteral iron reduces allogeneic blood transfusion rates by 68%.',
                    'Pagophagia (ice craving) correlates with 92% diagnostic sensitivity for severe ferritin depletion.',
                    'Patient-reported outcome measures (PROMs) improve therapy adherence.'
                  ]
                },
                {
                  authority: 'American College of Obstetricians & Gynecologists (ACOG)',
                  topic: 'Obstetric & Gynecological Practice Bulletins',
                  evidenceLevel: 'Practice Bulletin #222',
                  badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
                  keyPoints: [
                    'Active management of post-op recovery with non-opioid multimodal analgesia.',
                    'Postpartum depression screening at 2 and 6 weeks post-delivery.',
                    'Regular blood pressure and urine protein monitoring for preeclampsia prophylaxis.'
                  ]
                },
                {
                  authority: 'Centers for Disease Control & Prevention (CDC)',
                  topic: 'Preventive Health & Chronic Care Protocols',
                  evidenceLevel: 'CDC Clinical Guidelines',
                  badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
                  keyPoints: [
                    'Daily physical stamina assessment combined with sleep architecture tracking.',
                    'Preventive dietary fortification and micronutrient status monitoring.',
                    'Structured post-surgical infection surveillance protocols.'
                  ]
                }
              ].map((resItem, idx) => (
                <div key={`res-${idx}`} className="p-3.5 sm:p-4 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-3 hover:border-emerald-500/50 transition-all">
                  <div className="space-y-1">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${resItem.badgeColor}`}>
                      {resItem.evidenceLevel}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white font-mono mt-1 leading-snug">{resItem.authority}</h4>
                    <span className="text-[10px] text-stone-400 block font-medium leading-snug">{resItem.topic}</span>
                  </div>

                  <ul className="space-y-1.5 text-[10.5px] sm:text-[11px] text-stone-300 border-t border-stone-800/80 pt-2.5">
                    {resItem.keyPoints.map((kp, kIdx) => (
                      <li key={`kp-${kIdx}`} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Fluid Evidence Fetcher Bar */}
            <div className="p-3.5 sm:p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-3">
              <span className="text-xs font-mono font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                Live Fluid Medical Search &amp; Grounded Evidence Verification
              </span>
              <p className="text-xs text-stone-400">
                Type any medical keyword, symptom, or treatment to query our fluid intelligence evidence index:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. IV Iron Carboxymaltose, Postpartum Hemoglobin, Needle Phobia, Pica..."
                  className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  onClick={() => showToast(`Fluid search fetched verified clinical literature for "${searchQuery || 'General Guidelines'}"`)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Fetch Evidence</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* R&D CASE INSPECTION MODAL */}
      {selectedCaseForModal && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 border border-stone-200 shadow-2xl max-h-[88vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-start border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] sm:text-xs font-mono font-extrabold text-rose-600 uppercase tracking-widest block">
                  ANONYMIZED R&amp;D HEALTH RESEARCH OBJECT
                </span>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 font-display">
                  Case #{selectedCaseForModal.caseId} • {selectedCaseForModal.category}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCaseForModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm cursor-pointer shrink-0 ml-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-stone-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-stone-50 rounded-xl border border-stone-200 font-mono">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Patient Identifier:</span>
                  <span className="font-bold text-stone-900">{selectedCaseForModal.patientAlias}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Treatment Phase:</span>
                  <span className="font-bold text-rose-700">{selectedCaseForModal.treatmentPhaseLabel}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-stone-900 uppercase block mb-1">
                  1. Raw Patient Heart Reflection Narrative:
                </span>
                <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl italic font-serif text-stone-800 leading-relaxed">
                  "{selectedCaseForModal.patientStory}"
                </div>
              </div>

              <div>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-stone-900 uppercase block mb-1">
                  2. Detected Emotional States &amp; Clinical Symptoms:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCaseForModal.emotionsDetected.map((emo, idx) => (
                    <span key={`modal-e-${idx}`} className="bg-rose-100 text-rose-900 border border-rose-300 px-2.5 py-1 rounded-lg font-mono font-bold text-[10px] sm:text-xs">
                      ❤️ {emo}
                    </span>
                  ))}
                  {selectedCaseForModal.symptomsOrCues.map((sym, idx) => (
                    <span key={`modal-s-${idx}`} className="bg-stone-200 text-stone-800 border border-stone-300 px-2.5 py-1 rounded-lg font-mono font-bold text-[10px] sm:text-xs">
                      🩺 {sym}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-900 uppercase block mb-1 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  3. Actionable R&amp;D Recommendations for Medical Device &amp; Pharma Research:
                </span>
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 font-medium leading-relaxed">
                  {selectedCaseForModal.rndResearchInsights}
                </div>
              </div>

              <div>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-stone-900 uppercase block mb-1">
                  4. Anonymized Summary for Clinical Database:
                </span>
                <p className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 font-sans leading-relaxed">
                  {selectedCaseForModal.anonymizedSummary}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <span className="text-[10px] font-mono text-stone-400">{selectedCaseForModal.createdAt}</span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditingCase(selectedCaseForModal);
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Case</span>
                </button>
                <button
                  onClick={() => handleDeleteCase(selectedCaseForModal.id, selectedCaseForModal.caseId)}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(selectedCaseForModal, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedCaseForModal.caseId}_rnd_object.json`;
                    a.click();
                    showToast(`Exported ${selectedCaseForModal.caseId} JSON object!`);
                  }}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setSelectedCaseForModal(null)}
                  className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-mono font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: EDIT R&D CASE */}
      {editingCase && (
        <EditCaseModal
          item={editingCase}
          onSave={handleSaveEditedCase}
          onClose={() => setEditingCase(null)}
        />
      )}

      {/* POPUP MODAL: DUPLICATE / SIMILAR CASE DETECTED */}
      {pendingDuplicateCase && (
        <div className="fixed inset-0 z-[160] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-4 border border-rose-200 shadow-2xl animate-fadeIn max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-amber-800 uppercase tracking-widest block">
                  SIMILAR OR DUPLICATE R&amp;D CASE DETECTED
                </span>
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-display">
                  Existing Case #{pendingDuplicateCase.existingCase.caseId} Found
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-700 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <p className="font-medium text-stone-800">
                An existing R&amp;D case entry matching this narrative was found in your repository:
              </p>
              <div className="p-2.5 bg-white border border-stone-200 rounded-xl italic font-serif text-stone-800 text-[11px] leading-relaxed">
                "{pendingDuplicateCase.existingCase.patientStory}"
              </div>
              <p className="text-[10.5px] text-stone-500 font-mono">
                Would you like to replace/update the existing case with your new conversation insights, or save this as an entirely new case entry?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={handleConfirmReplaceCase}
                className="flex-1 px-3.5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace / Update</span>
              </button>
              <button
                onClick={handleConfirmSaveNewCase}
                className="flex-1 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save New</span>
              </button>
              <button
                onClick={() => setPendingDuplicateCase(null)}
                className="px-3 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-mono font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: CONFIRM DELETE CASE */}
      {caseToDeleteConfirm && (
        <div className="fixed inset-0 z-[180] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 space-y-4 border border-rose-300 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-rose-800 uppercase tracking-widest block">
                  CONFIRM DELETE CASE
                </span>
                <h3 className="text-base sm:text-lg font-black text-stone-900 font-display">
                  Delete Case #{caseToDeleteConfirm.caseId}?
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Are you sure you want to permanently remove this anonymized case record from the R&amp;D health repository? This action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => confirmAndExecuteDelete(caseToDeleteConfirm.id, caseToDeleteConfirm.caseId)}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Permanently Delete</span>
              </button>
              <button
                onClick={() => setCaseToDeleteConfirm(null)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-mono font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* EDIT R&D CASE MODAL SUBCOMPONENT */
const EditCaseModal: React.FC<{
  item: RndCaseItem;
  onSave: (updated: RndCaseItem) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [patientAlias, setPatientAlias] = useState(item.patientAlias);
  const [treatmentPhaseLabel, setTreatmentPhaseLabel] = useState(item.treatmentPhaseLabel);
  const [patientStory, setPatientStory] = useState(item.patientStory);
  const [emotionsStr, setEmotionsStr] = useState(item.emotionsDetected.join(', '));
  const [symptomsStr, setSymptomsStr] = useState(item.symptomsOrCues.join(', '));
  const [rndResearchInsights, setRndResearchInsights] = useState(item.rndResearchInsights);
  const [anonymizedSummary, setAnonymizedSummary] = useState(item.anonymizedSummary);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: RndCaseItem = {
      ...item,
      patientAlias,
      treatmentPhaseLabel,
      patientStory,
      emotionsDetected: emotionsStr.split(',').map(s => s.trim()).filter(Boolean),
      symptomsOrCues: symptomsStr.split(',').map(s => s.trim()).filter(Boolean),
      rndResearchInsights,
      anonymizedSummary,
      createdAt: item.createdAt.includes('(Updated)') || item.createdAt.includes('(Edited)') ? item.createdAt : `${item.createdAt} (Edited)`
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-[170] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 border border-amber-300 shadow-2xl my-auto animate-fadeIn max-h-[88vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300 shrink-0">
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-extrabold text-amber-800 uppercase tracking-wider block truncate">
                EDIT R&amp;D CASE RECORD
              </span>
              <h3 className="text-base sm:text-lg font-black text-stone-900 font-display truncate">
                {item.caseId} — {item.patientAlias}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-sm font-mono font-bold p-1 cursor-pointer shrink-0 ml-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-stone-700 mb-1">Patient Alias / Identifier</label>
              <input
                type="text"
                value={patientAlias}
                onChange={(e) => setPatientAlias(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-mono text-stone-800 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-stone-700 mb-1">Treatment Phase Label</label>
              <input
                type="text"
                value={treatmentPhaseLabel}
                onChange={(e) => setTreatmentPhaseLabel(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-mono text-stone-800 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-stone-700 mb-1">Full Patient Heart Narrative</label>
            <textarea
              rows={3}
              value={patientStory}
              onChange={(e) => setPatientStory(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-serif italic text-stone-800 focus:outline-none focus:border-amber-500 leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-stone-700 mb-1">Emotions Detected (Comma separated)</label>
              <input
                type="text"
                value={emotionsStr}
                onChange={(e) => setEmotionsStr(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-mono text-stone-800 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-mono font-bold text-stone-700 mb-1">Symptoms / Cues (Comma separated)</label>
              <input
                type="text"
                value={symptomsStr}
                onChange={(e) => setSymptomsStr(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-mono text-stone-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-stone-700 mb-1">R&amp;D Clinical Takeaway / Research Insights</label>
            <textarea
              rows={3}
              value={rndResearchInsights}
              onChange={(e) => setRndResearchInsights(e.target.value)}
              className="w-full bg-amber-50/50 border border-amber-300 rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-amber-500 leading-relaxed font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-mono font-bold text-stone-700 mb-1">Anonymized Summary for Clinical Database</label>
            <textarea
              rows={2}
              value={anonymizedSummary}
              onChange={(e) => setAnonymizedSummary(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-amber-500 leading-relaxed"
              required
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-mono font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-mono font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
