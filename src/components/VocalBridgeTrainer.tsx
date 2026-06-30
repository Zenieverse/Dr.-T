import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVocalBridge, useTranscript } from '@vocalbridgeai/react';
import { ConnectionState } from '@vocalbridgeai/sdk';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Check, 
  X, 
  Play, 
  Volume2, 
  VolumeX, 
  Terminal, 
  Award, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Code, 
  BookOpen, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle,
  FileText,
  User,
  CheckSquare,
  ShieldCheck
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  shouldCall: boolean;
  explanation: string;
  calibrationRule: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'sc-1',
    title: 'Wiping Production database seed data',
    description: 'The agent is executing a database migration on the production server. Running it now will wipe out the current developer-focused seed mock records. Is a vocal call required?',
    shouldCall: true,
    explanation: 'Wiping production databases or mock structures blocks workflow execution and is irreversible. It directly impacts other users and developers, which requires human decision and clear authorization.',
    calibrationRule: 'Rule 4 & 5: Agent is not authorized to perform destructive actions unilaterally; no prior preference specified.'
  },
  {
    id: 'sc-2',
    title: 'Increasing input padding in CSS',
    description: 'The user asks to increase the padding of a form search input from 8px to 10px. Is a vocal call required?',
    shouldCall: false,
    explanation: 'This is a minor aesthetic adjustment. It is a fully reversible preference task that does not block execution or incur any financial, safety, or legal risks. The agent should resolve this independently.',
    calibrationRule: 'Rule 1: Workflow is NOT blocked; it is a simple developer aesthetic refinement.'
  },
  {
    id: 'sc-3',
    title: 'Spending $150/month on cloud GPU instances',
    description: 'The agent has built a model that requires a high-performance cloud container costing $150 per month to host. Is a vocal call required?',
    shouldCall: true,
    explanation: 'Spending company money or cloud budget is a sensitive, non-reversible financial action. AI agents are strictly unauthorized to commit financial obligations without human approval.',
    calibrationRule: 'Rule 4: Irreversible financial commitment; agent lacks authorization.'
  },
  {
    id: 'sc-4',
    title: 'Troubleshooting a local TypeScript lint error',
    description: 'The agent has encountered a TypeScript compile error: "Property \'children\' does not exist on type Props". Is a vocal call required?',
    shouldCall: false,
    explanation: 'This is a standard development bug. The agent is fully capable of applying typical TypeScript practices (e.g. adding children to type Props) independently. It is safe and completely reversible.',
    calibrationRule: 'Rule 2 & 4: Normal developer troubleshooting; agent is authorized and expected to solve these autonomously.'
  },
  {
    id: 'sc-5',
    title: 'Deploying a public marketing blast to 25,000 users',
    description: 'The developer requested to test the newsletter API, and the agent is about to press "send" on an active system endpoint that will email 25,000 real-world customers. Is a vocal call required?',
    shouldCall: true,
    explanation: 'Sending external public communications is a critical action that can have legal, compliance, and branding consequences. It must never be triggered autonomously.',
    calibrationRule: 'Rule 4: Sending external communications; high stakes and requires safety approval.'
  },
  {
    id: 'sc-6',
    title: 'Upgrading package.json dependency versions',
    description: 'The agent notices a dependency warning about a package. The project has a minor update available. Is a vocal call required?',
    shouldCall: false,
    explanation: 'Upgrading standard developer packages to fix warnings is typical maintenance. Unless it causes massive breaking changes, it is reversible via Git and does not require disrupting the user with a phone call.',
    calibrationRule: 'Rule 1: Routine maintenance; the agent is authorized to resolve compile issues.'
  }
];

const PRESET_SCRIPTS = [
  {
    name: "Production Wipe",
    script: "Decision needed. The migration will wipe existing production seed records. Option one executes the migration immediately, which deletes current data. Option two cancels the update to keep the database intact. Which do you choose?"
  },
  {
    name: "GPU Cloud Cost",
    script: "Decision needed. Hosting the neural net requires an active cloud container costing $150 monthly. Option one provisions the container to enable live AI inferences. Option two keeps the service offline to avoid charges. Which do you choose?"
  },
  {
    name: "Too Verbose (Fail)",
    script: "Hello, sorry to bother you! I am currently working on the backend routes inside the folder `/src/server/db` and I wanted to ask if it's okay for me to run a script because it might delete some rows. The UUIDs are 4a8e-bc92 and 8c34-aa12. Do you want me to do Option One (wipe it all and rebuild) or Option Two (let me write a custom python script that tries to back it up first, which will take 2 hours)?"
  },
  {
    name: "No-Option (Fail)",
    script: "Decision needed. We need to handle a database lock situation. Should I restart the PostgreSQL cluster right now or wait? Let me know what you think."
  }
];

export function VocalBridgeTrainer() {
  const [activeSubTab, setActiveSubTab] = useState<'calibration' | 'auditor' | 'simulator' | 'prompts' | 'skill'>('calibration');
  
  // Calibration game states
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userCalibrationChoice, setUserCalibrationChoice] = useState<boolean | null>(null);
  const [isCalibrationCorrect, setIsCalibrationCorrect] = useState<boolean | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);

  // Auditor states
  const [draftScript, setDraftScript] = useState(PRESET_SCRIPTS[0].script);
  const [auditResult, setAuditResult] = useState<{
    wordCount: number;
    hasDecisionFirst: boolean;
    hasNumberedOptions: boolean;
    hasTechnicalJargon: boolean;
    isWordCountValid: boolean;
    overallGrade: 'A' | 'B' | 'C' | 'F';
    suggestions: string[];
  } | null>(null);

  // Simulator states
  const [simStatus, setSimStatus] = useState<'idle' | 'ringing' | 'active' | 'hangup'>('idle');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simResponse, setSimResponse] = useState<string>('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // Real Vocal Bridge Connection & Mode
  const [simulatorMode, setSimulatorMode] = useState<'mock' | 'vocalbridge'>('mock');
  const { 
    state: vbState, 
    connect: vbConnect, 
    disconnect: vbDisconnect, 
    isMicrophoneEnabled, 
    toggleMicrophone, 
    sendAction: vbSendAction,
    error: vbError 
  } = useVocalBridge();
  const { transcript: vbTranscript, clear: vbClear } = useTranscript();

  // Prompt exporter state
  const [activePromptTab, setActivePromptTab] = useState<'cursor' | 'claude' | 'windsurf' | 'copilot'>('cursor');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Speech synth & recognition ref
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if voice is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setVoiceSupported(!!SpeechRecognition);
    }
    // Auto audit on load
    handleAudit(PRESET_SCRIPTS[0].script);
  }, []);

  // Synchronize Vocal Bridge connection state
  useEffect(() => {
    if (simulatorMode !== 'vocalbridge') return;

    if (vbState === ConnectionState.Connecting) {
      setSimStatus('ringing');
      setSimLogs(prev => [...prev, `[Vocal Bridge] Connecting to WebRTC server...`]);
    } else if (vbState === ConnectionState.WaitingForAgent) {
      setSimStatus('ringing');
      setSimLogs(prev => [...prev, `[Vocal Bridge] Waiting for Voice Agent to join the room...`]);
    } else if (vbState === ConnectionState.Connected) {
      setSimStatus('active');
      setMicActive(isMicrophoneEnabled);
      setSimLogs(prev => [...prev, `[Vocal Bridge] CALL ESTABLISHED. Microphone is live.`]);
    } else if (vbState === ConnectionState.Reconnecting) {
      setSimLogs(prev => [...prev, `[Vocal Bridge] Reconnecting due to signal degradation...`]);
    } else if (vbState === ConnectionState.Disconnected) {
      setSimStatus('idle');
      setMicActive(false);
      setSimLogs(prev => [...prev, `[Vocal Bridge] Session closed.`]);
    }
  }, [vbState, simulatorMode, isMicrophoneEnabled]);

  // Synchronize Vocal Bridge error state
  useEffect(() => {
    if (simulatorMode !== 'vocalbridge' || !vbError) return;
    setSimLogs(prev => [...prev, `[Vocal Bridge Error] ${vbError.message || vbError}`]);
  }, [vbError, simulatorMode]);

  // Sync Live transcript to Agent Console
  const lastTranscriptLengthRef = useRef(0);
  useEffect(() => {
    if (simulatorMode !== 'vocalbridge') return;
    if (vbTranscript.length === 0) {
      lastTranscriptLengthRef.current = 0;
      return;
    }

    const newEntries = vbTranscript.slice(lastTranscriptLengthRef.current);
    if (newEntries.length > 0) {
      newEntries.forEach(entry => {
        const prefix = entry.role === 'user' ? '[Human Spoke]' : '[Agent]';
        setSimLogs(prev => [...prev, `${prefix} "${entry.text}"`]);
      });
      lastTranscriptLengthRef.current = vbTranscript.length;
    }
  }, [vbTranscript, simulatorMode]);

  // ----------------------------------------------------
  // SCENARIO CALIBRATION GAME
  // ----------------------------------------------------
  const handleCalibrationChoice = (choice: boolean) => {
    const scenario = SCENARIOS[currentScenarioIndex];
    setUserCalibrationChoice(choice);
    const correct = choice === scenario.shouldCall;
    setIsCalibrationCorrect(correct);
    
    if (correct && !completedScenarios[scenario.id]) {
      setScore(prev => prev + 1);
    }

    setCompletedScenarios(prev => ({
      ...prev,
      [scenario.id]: true
    }));
  };

  const nextScenario = () => {
    setUserCalibrationChoice(null);
    setIsCalibrationCorrect(null);
    setCurrentScenarioIndex((currentScenarioIndex + 1) % SCENARIOS.length);
  };

  const resetCalibrationGame = () => {
    setCurrentScenarioIndex(0);
    setUserCalibrationChoice(null);
    setIsCalibrationCorrect(null);
    setCompletedScenarios({});
    setScore(0);
  };

  // ----------------------------------------------------
  // REAL-TIME AUDITOR ENGINE
  // ----------------------------------------------------
  const handleAudit = (text: string) => {
    setDraftScript(text);
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const isWordCountValid = wordCount <= 60;

    // Front-loaded decision first check (starts with "Decision needed", "Decision required", or "Action needed" etc within first 4 words)
    const firstFewWords = words.slice(0, 4).join(" ").toLowerCase();
    const hasDecisionFirst = firstFewWords.includes("decision needed") || 
                             firstFewWords.includes("decision required") || 
                             firstFewWords.includes("action needed") ||
                             firstFewWords.includes("need choice");

    // Clear numbered choices check
    const lowerText = text.toLowerCase();
    const hasNumberedOptions = (lowerText.includes("option one") || lowerText.includes("option 1")) && 
                               (lowerText.includes("option two") || lowerText.includes("option 2"));

    // Anti-Technical Jargon ("no-screen" rule)
    const jargonRegex = /(\.ts|\.js|\.tsx|\.json|localhost|uuid|hash|http|url|directory|folder|\/src|database id|db_)/i;
    const hasTechnicalJargon = jargonRegex.test(text);

    // Score calculating grade
    let score = 100;
    const suggestions: string[] = [];

    if (!hasDecisionFirst) {
      score -= 30;
      suggestions.push("Front-load the decision! Start the script with exactly 'Decision needed.' so the user hears the purpose in the first 3 seconds.");
    }
    if (!hasNumberedOptions) {
      score -= 30;
      suggestions.push("Specify numbered options clearly (e.g. 'Option one...' and 'Option two...'). Users who are walking or driving need to respond with a simple number.");
    }
    if (wordCount > 60) {
      score -= 25;
      suggestions.push(`Keep it under 60 words (current: ${wordCount}). Spoken conversations over the phone must be dense, clear, and high-speed.`);
    }
    if (hasTechnicalJargon) {
      score -= 20;
      suggestions.push("Omit technical jargon! Omit folder paths, code extensions (.ts), localhosts, or hashes. The user is hands-free/eyes-free and cannot see a screen.");
    }

    let overallGrade: 'A' | 'B' | 'C' | 'F' = 'A';
    if (score >= 90) overallGrade = 'A';
    else if (score >= 70) overallGrade = 'B';
    else if (score >= 50) overallGrade = 'C';
    else overallGrade = 'F';

    setAuditResult({
      wordCount,
      hasDecisionFirst,
      hasNumberedOptions,
      hasTechnicalJargon,
      isWordCountValid,
      overallGrade,
      suggestions
    });
  };

  // ----------------------------------------------------
  // INTERACTIVE SIMULATOR (PHONE CALL)
  // ----------------------------------------------------
  const handleIncomingCall = () => {
    setSimStatus('ringing');
    setSimResponse('');
    
    if (simulatorMode === 'vocalbridge') {
      setSimLogs(["[Vocal Bridge] Dispatching live Vocal Bridge call request...", "[Vocal Bridge] Ready to connect to Dr. T voice agent. Click ACCEPT to join room via WebRTC."]);
    } else {
      setSimLogs(["[System] Dispatching Vocal Bridge request...", "[System] Simulating physical cell phone ringing..."]);
    }
    
    // Play ringing sound conceptually or visual pulsate
    if (ttsEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      // Small vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  };

  const acceptCall = () => {
    if (simulatorMode === 'vocalbridge') {
      setSimLogs(prev => [...prev, "[Vocal Bridge] Human clicked ACCEPT. Fetching voice token and opening WebRTC room..."]);
      vbClear();
      lastTranscriptLengthRef.current = 0;
      vbConnect().catch(err => {
        setSimLogs(prev => [...prev, `[Vocal Bridge Connection Error] Failed: ${err.message || err}`]);
      });
    } else {
      setSimStatus('active');
      setSimLogs(prev => [...prev, "[Call] Human clicked ACCEPT. Connection open.", "[Agent] Reading escalation script..."]);

      // Speak the script via Web Speech API
      if (ttsEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(draftScript);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';

        utterance.onend = () => {
          setSimLogs(prev => [...prev, "[Agent] Awaiting human voice approval..."]);
          if (voiceSupported) {
            startSpeechRecognition();
          }
        };

        utterance.onerror = (e) => {
          setSimLogs(prev => [...prev, `[System] Audio playback completed with notice.`]);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Simulate typewriter readout if audio is off
        setTimeout(() => {
          setSimLogs(prev => [...prev, "[Agent] Awaiting human response... (Audio disabled)"]);
        }, 2000);
      }
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setMicActive(true);
      setSimLogs(prev => [...prev, "[Mic] Listening for human approval (e.g. 'Approve option one', 'no', 'cancel')..."]);
    };

    recognition.onerror = (e: any) => {
      console.error(e);
      setMicActive(false);
    };

    recognition.onend = () => {
      setMicActive(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSimResponse(transcript);
      handleSimDecision(transcript);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {}
  };

  const handleSimDecision = (decisionText: string) => {
    setSimLogs(prev => [...prev, `[Human Spoke] "${decisionText}"`]);
    const cleanText = decisionText.toLowerCase();

    let reply = "";
    let executionLog = "";

    if (cleanText.includes("option one") || cleanText.includes("option 1") || cleanText.includes("yes") || cleanText.includes("approve 1")) {
      reply = "Approved option one. Executing immediately. Proceeding with workflow.";
      executionLog = "[Agent Status] APPROVED: Executing Option 1 (System migration/provision active).";
    } else if (cleanText.includes("option two") || cleanText.includes("option 2") || cleanText.includes("approve 2")) {
      reply = "Approved option two. Restoring backup and halting dangerous change. Continuing safely.";
      executionLog = "[Agent Status] APPROVED: Executing Option 2 (Safe fallback applied).";
    } else if (cleanText.includes("no") || cleanText.includes("reject") || cleanText.includes("cancel") || cleanText.includes("stop")) {
      reply = "Escalation rejected. Halting workflow and leaving database unchanged.";
      executionLog = "[Agent Status] REJECTED: Halting execution. System state preserved unchanged.";
    } else if (cleanText.includes("chat") || cleanText.includes("ask in chat") || cleanText.includes("slack")) {
      reply = "Recorded preference. Stopping phone calls and switching to chat.";
      executionLog = "[Agent Status] DELEGATED: Moving conversation thread back to local code editor workspace chat.";
    } else {
      reply = "Understood. Applying safe fallback. Marking decision pending.";
      executionLog = "[Agent Status] PENDING: Human response logged. Safely awaiting confirmation.";
    }

    setSimLogs(prev => [...prev, executionLog]);

    // Speak reply
    if (ttsEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const replyUtterance = new SpeechSynthesisUtterance(reply);
      replyUtterance.rate = 1.05;
      replyUtterance.lang = 'en-US';
      replyUtterance.onend = () => {
        hangUp();
      };
      window.speechSynthesis.speak(replyUtterance);
    } else {
      setTimeout(() => {
        hangUp();
      }, 3000);
    }
  };

  const handleManualAction = (type: 'option-1' | 'option-2' | 'reject' | 'chat') => {
    if (simulatorMode === 'vocalbridge') {
      let actionName = "";
      let payloadText = "";
      if (type === 'option-1') {
        actionName = "approve_option_1";
        payloadText = "Approved option one (execute)";
      } else if (type === 'option-2') {
        actionName = "approve_option_2";
        payloadText = "Approved option two (safe fallback)";
      } else if (type === 'reject') {
        actionName = "reject_escalation";
        payloadText = "Rejected escalation call";
      } else if (type === 'chat') {
        actionName = "delegate_to_chat";
        payloadText = "Delegated to chat";
      }

      setSimLogs(prev => [...prev, `[Action Sent] "${payloadText}"`]);
      vbSendAction(actionName, { source: "VocalBridgeTrainer", draftScript }).catch(err => {
        setSimLogs(prev => [...prev, `[Vocal Bridge Error] Failed to send action: ${err.message || err}`]);
      });
      return;
    }

    if (simStatus !== 'active') return;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    let decisionStr = "";
    if (type === 'option-1') decisionStr = "Approve option one";
    else if (type === 'option-2') decisionStr = "Approve option two";
    else if (type === 'reject') decisionStr = "Reject and stop";
    else if (type === 'chat') decisionStr = "Ask in chat instead";

    handleSimDecision(decisionStr);
  };

  const hangUp = () => {
    setSimStatus('hangup');
    setMicActive(false);
    
    if (simulatorMode === 'vocalbridge') {
      vbDisconnect().catch(() => {});
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {}
      }
    }
    
    setSimLogs(prev => [...prev, "[Call] Connection closed. Hang up signal broadcasted."]);
    
    setTimeout(() => {
      setSimStatus('idle');
    }, 4000);
  };

  // ----------------------------------------------------
  // UTILITIES & EXPORTERS
  // ----------------------------------------------------
  const handleCopy = (text: string, index: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const getPromptContent = () => {
    switch (activePromptTab) {
      case 'cursor':
        return `# Cursor Rules for Vocal Bridge Escalation (.cursorrules)
{
  "rules": [
    "Before editing code, view existing files first to avoid path mismatches or overwriting.",
    "Always reference rules in AGENTS.md before making decisions.",
    "You are strictly forbidden from performing unauthorized financial, public, or highly destructive operations (e.g. wiping real database tables, purchasing API tiers, or emailing users) unilaterally.",
    "When a critical decision is blocked, invoke vb_call to reach the user. Calibrate the call using the 5 Calibration Rules.",
    "Formulate spoken escalation scripts: front-load with 'Decision needed.', outline Option One and Option Two with direct stakes, and keep under 60 words."
  ]
}`;
      case 'claude':
        return `# Claude Code Custom Configuration Rules
instructions: |
  You are connected to Vocal Bridge (vb_call) allowing real-time phone calls to the developer.
  Calibrate calls using these 5 guidelines:
  1. Is workflow blocked?
  2. Is human choice required?
  3. Does choice change what happens next?
  4. Are you unauthorized?
  5. Is there no prior preference?
  If yes to all: execute vb_call.
  Make spoken script dense and clear:
  - Decision MUST be stated in first 10 words.
  - Detail option 1 vs option 2.
  - Limit script to 60 words. No code blocks, folders, or UUIDs.`;
      case 'windsurf':
        return `# Windsurf Agent Rules (.windsurfrules)
rules:
  - Use relative workspace paths, never absolute routes starting with /
  - Follow the 5-point decision calibration from AGENTS.md to check if a vb_call is warranted.
  - Phone scripts must be under 60 words, hands-free optimized, and speak of options as numbered choices.
  - If call is approved, record the decision and proceed instantly. Do not ask for duplicate confirmation.
  - If rejected or no response, preserve previous system state and return thread control back to local chat.`;
      case 'copilot':
        return `### GitHub Copilot / Codex System Prompt Injection
You are an expert full-stack developer agent.
You must escalate high-risk operations to the developer using vb_call.
High-risk tasks include spending funds, launching production migrations that wipe data, or sending system-wide public communications.
Spoken scripts:
- Keep under 60 words and 30 seconds.
- State choice: "Option 1" vs "Option 2" clearly.
- Do not mention technical jargon (such as directories, code files, hashes).
- Front-load decision in the first sentence.`;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6" id="vocal-bridge-trainer-root">
      {/* Sleek Display Header */}
      <div className="relative mb-8 text-center md:text-left bg-gradient-to-br from-stone-900 via-stone-950 to-rose-950 p-6 md:p-8 rounded-3xl border border-rose-500/20 shadow-xl overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs font-bold text-rose-400 mb-3 tracking-wide">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-rose-400" /> AGENT COGNITIVE CENTER
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
              Vocal Bridge Escalation Trainer
            </h1>
            <p className="text-stone-400 text-sm mt-2 max-w-2xl font-sans leading-relaxed">
              Teach Claude Code, Cursor, and custom developer agents to call you <span className="text-rose-400 font-semibold">only when it matters</span>. Calibrate decision boundaries and audit phone scripts in real-time.
            </p>
          </div>
          
          {/* Circular Score Badge */}
          <div className="flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shrink-0 w-32">
            <span className="text-xs text-stone-400 uppercase font-bold tracking-widest font-mono">My Calib</span>
            <span className="text-3xl font-extrabold text-rose-400 font-mono mt-1">
              {score}/{SCENARIOS.length}
            </span>
            <span className="text-[10px] text-stone-500 font-sans mt-1">Scenarios Clear</span>
          </div>
        </div>

        {/* Dynamic Mini Soundwave Decoration */}
        <div className="flex items-center gap-1 mt-6 justify-center md:justify-start h-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-rose-500/30 rounded-full animate-pulse" 
              style={{ 
                height: `${Math.floor(Math.sin(i * 0.5) * 12) + 14}px`,
                animationDelay: `${i * 0.08}s`
              }} 
            />
          ))}
          <span className="text-[10px] text-stone-500 font-mono ml-3 uppercase tracking-wider">CALIBRATION ENGINE ACTIVE</span>
        </div>
      </div>

      {/* Primary Tab Bar */}
      <div className="flex overflow-x-auto pb-1 mb-6 border-b border-stone-200 dark:border-stone-800 gap-1 select-none scrollbar-none">
        <button
          onClick={() => setActiveSubTab('calibration')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            activeSubTab === 'calibration'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900/60'
          }`}
          id="vb-subtab-calibration"
        >
          <CheckSquare className="w-4 h-4" /> 1. Escalation Calibration
        </button>
        <button
          onClick={() => setActiveSubTab('auditor')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            activeSubTab === 'auditor'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900/60'
          }`}
          id="vb-subtab-auditor"
        >
          <ShieldCheck className="w-4 h-4" /> 2. Script Auditor
        </button>
        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            activeSubTab === 'simulator'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900/60'
          }`}
          id="vb-subtab-simulator"
        >
          <PhoneCall className="w-4 h-4 animate-pulse" /> 3. Voice Simulator
        </button>
        <button
          onClick={() => setActiveSubTab('prompts')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            activeSubTab === 'prompts'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900/60'
          }`}
          id="vb-subtab-prompts"
        >
          <Code className="w-4 h-4" /> 4. Prompt Exporter
        </button>
        <button
          onClick={() => setActiveSubTab('skill')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            activeSubTab === 'skill'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900/60'
          }`}
          id="vb-subtab-skill"
        >
          <FileText className="w-4 h-4" /> 5. SKILL.md Document
        </button>
      </div>

      {/* Main SubTab Container */}
      <div className="min-h-[460px]">
        {/* SUBTAB 1: CALIBRATION GAME */}
        {activeSubTab === 'calibration' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Active Card */}
            <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">
                    Scenario {currentScenarioIndex + 1} of {SCENARIOS.length}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                    completedScenarios[SCENARIOS[currentScenarioIndex].id]
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                  }`}>
                    {completedScenarios[SCENARIOS[currentScenarioIndex].id] ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">
                  {SCENARIOS[currentScenarioIndex].title}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed mb-6 whitespace-pre-line bg-stone-50 dark:bg-stone-950/50 p-4 rounded-xl border border-stone-100 dark:border-stone-900">
                  {SCENARIOS[currentScenarioIndex].description}
                </p>

                {/* Question choice */}
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-stone-500 font-sans italic">
                    How should your AI agent respond in this situation?
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleCalibrationChoice(true)}
                      disabled={userCalibrationChoice !== null}
                      className={`flex items-center justify-center gap-2 p-3.5 border rounded-xl text-xs font-bold tracking-wide cursor-pointer transition-all ${
                        userCalibrationChoice !== null
                          ? SCENARIOS[currentScenarioIndex].shouldCall
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                            : 'opacity-40 border-stone-200 dark:border-stone-800 text-stone-400'
                          : 'bg-rose-500/5 hover:bg-rose-500/10 border-rose-300 dark:border-rose-950/60 text-rose-600 dark:text-rose-400 active:scale-98'
                      }`}
                    >
                      <PhoneCall className="w-4 h-4 shrink-0" /> Escalation: Call vb_call
                    </button>

                    <button
                      onClick={() => handleCalibrationChoice(false)}
                      disabled={userCalibrationChoice !== null}
                      className={`flex items-center justify-center gap-2 p-3.5 border rounded-xl text-xs font-bold tracking-wide cursor-pointer transition-all ${
                        userCalibrationChoice !== null
                          ? !SCENARIOS[currentScenarioIndex].shouldCall
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                            : 'opacity-40 border-stone-200 dark:border-stone-800 text-stone-400'
                          : 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 active:scale-98'
                      }`}
                    >
                      <X className="w-4 h-4 shrink-0" /> Autonomy: Resolve Independently
                    </button>
                  </div>
                </div>

                {/* Explanation feedback */}
                <AnimatePresence>
                  {userCalibrationChoice !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-6 p-4 rounded-xl border ${
                        isCalibrationCorrect
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-950/30 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-50/60 dark:bg-rose-950/10 border-rose-200 dark:border-rose-950/30 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {isCalibrationCorrect ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider font-sans">
                            {isCalibrationCorrect ? 'Correct Calibration!' : 'Calibration Mismatch'}
                          </p>
                          <p className="text-xs mt-1.5 leading-relaxed font-sans opacity-90">
                            {SCENARIOS[currentScenarioIndex].explanation}
                          </p>
                          <div className="mt-2.5 inline-block text-[10px] font-mono font-bold bg-white/40 dark:bg-stone-900/40 px-2 py-0.5 rounded-md text-stone-500 dark:text-stone-400 border border-stone-200/20">
                            {SCENARIOS[currentScenarioIndex].calibrationRule}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80">
                <button
                  onClick={resetCalibrationGame}
                  className="p-1 px-2 text-[11px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-mono font-bold uppercase transition-all cursor-pointer"
                >
                  Reset Progress
                </button>

                <button
                  onClick={nextScenario}
                  className="flex items-center gap-1 p-2 px-4 bg-stone-900 hover:bg-stone-850 dark:bg-stone-800 dark:hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-98"
                >
                  {currentScenarioIndex === SCENARIOS.length - 1 ? 'Go to Start' : 'Next Scenario'}
                </button>
              </div>
            </div>

            {/* Calibration Sidebar Guidelines */}
            <div className="bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-950 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 mb-3">
                  <Award className="w-4 h-4 text-rose-500" /> Escalation Calibration Guide
                </h4>
                <p className="text-[11px] text-stone-500 leading-relaxed mb-4">
                  AI Agents are expensive to trigger for trivial things, and telephone calls disrupt the user. Keep this calibration list in mind when designing agent policies.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                    <span className="text-xs mt-0.5">🚨</span>
                    <div>
                      <p className="text-[11px] font-bold text-stone-800 dark:text-stone-300">Irreversible Damage</p>
                      <p className="text-[10px] text-stone-500 leading-tight mt-0.5">Wiping live databases, bulk data alterations, breaking updates.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                    <span className="text-xs mt-0.5">💰</span>
                    <div>
                      <p className="text-[11px] font-bold text-stone-800 dark:text-stone-300">Financial Liability</p>
                      <p className="text-[10px] text-stone-500 leading-tight mt-0.5">Incurring API charges, spinning up high cost VMs, paid subscriptions.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 bg-rose-500/5 rounded-lg border border-rose-500/10">
                    <span className="text-xs mt-0.5">📢</span>
                    <div>
                      <p className="text-[11px] font-bold text-stone-800 dark:text-stone-300">External Publicity</p>
                      <p className="text-[10px] text-stone-500 leading-tight mt-0.5">Sending newsletters to thousands, publishing social media posts, committing directly to production.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-[10px] text-stone-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                <span>Defined strictly in <strong>AGENTS.md</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: SCRIPT AUDITOR */}
        {activeSubTab === 'auditor' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Left Draft Input */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono">
                    Escalation Script Editor
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-stone-400">Presets:</span>
                    {PRESET_SCRIPTS.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAudit(p.script)}
                        className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-[10px] font-semibold rounded-md border border-stone-200/20 transition-all cursor-pointer text-stone-700 dark:text-stone-300"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={draftScript}
                  onChange={(e) => handleAudit(e.target.value)}
                  placeholder="Type your escalation spoken script here..."
                  className="w-full h-44 p-3 bg-stone-50 dark:bg-stone-950 font-mono text-xs sm:text-sm border border-stone-200 dark:border-stone-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-stone-800 dark:text-stone-200 leading-relaxed"
                />

                <div className="flex items-center justify-between mt-3 text-[10px] text-stone-500 font-mono">
                  <span>Aim for max 60 words for speech clarity.</span>
                  <span className={`${(auditResult?.wordCount || 0) > 60 ? 'text-rose-500 font-bold' : 'text-stone-400'}`}>
                    Word count: {auditResult?.wordCount || 0}/60 words
                  </span>
                </div>
              </div>

              {/* Suggestions */}
              {auditResult && auditResult.suggestions.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-2">
                    <AlertCircle className="w-3.5 h-3.5" /> Auditor Recommendations
                  </h5>
                  <ul className="list-disc pl-4 space-y-1.5">
                    {auditResult.suggestions.map((s, i) => (
                      <li key={i} className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Scorecard Sidebar */}
            {auditResult && (
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono mb-4">
                    Audit Scorecard
                  </h4>

                  <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-900 rounded-xl mb-6">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Grade Quality</span>
                    <span className={`text-2xl font-extrabold font-mono w-10 h-10 rounded-full flex items-center justify-center ${
                      auditResult.overallGrade === 'A' ? 'bg-emerald-500/10 text-emerald-500' :
                      auditResult.overallGrade === 'B' ? 'bg-blue-500/10 text-blue-500' :
                      auditResult.overallGrade === 'C' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {auditResult.overallGrade}
                    </span>
                  </div>

                  {/* Criteria Checklist */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 dark:text-stone-400">Front-Loaded Decision</span>
                      {auditResult.hasDecisionFirst ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> First 10 Words</span>
                      ) : (
                        <span className="text-rose-500 font-bold flex items-center gap-1"><X className="w-3.5 h-3.5" /> Missing</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 dark:text-stone-400">Clear Numbered Options</span>
                      {auditResult.hasNumberedOptions ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Option 1 vs 2</span>
                      ) : (
                        <span className="text-rose-500 font-bold flex items-center gap-1"><X className="w-3.5 h-3.5" /> Missing</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 dark:text-stone-400">Concise (Under 60 words)</span>
                      {auditResult.isWordCountValid ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Compliant</span>
                      ) : (
                        <span className="text-rose-500 font-bold flex items-center gap-1"><X className="w-3.5 h-3.5" /> Too Long</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 dark:text-stone-400">No Technical Jargon</span>
                      {!auditResult.hasTechnicalJargon ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Clean Speech</span>
                      ) : (
                        <span className="text-amber-500 font-bold flex items-center gap-1"><X className="w-3.5 h-3.5" /> Flagged Files/IDs</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveSubTab('simulator');
                    handleIncomingCall();
                  }}
                  disabled={auditResult.overallGrade === 'F'}
                  className={`mt-8 w-full p-3 flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all uppercase font-mono tracking-wider cursor-pointer ${
                    auditResult.overallGrade === 'F'
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10 active:scale-98'
                  }`}
                >
                  <Phone className="w-4 h-4 animate-bounce" /> Push to Simulator
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: VOICE SIMULATOR */}
        {activeSubTab === 'simulator' && (
          <div className="lg:col-span-5 space-y-6 animate-fadeIn w-full">
            {/* Connection Protocol Selection Card */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="text-left">
                <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                  <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
                  Select Connection Protocol
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                  Switch between offline mock speech synthesis or actual live WebRTC voice calling via the Vocal Bridge SDK.
                </p>
              </div>
              <div className="flex bg-stone-100 dark:bg-stone-950 p-1 rounded-xl border border-stone-200 dark:border-stone-850 self-stretch sm:self-auto">
                <button
                  onClick={() => {
                    setSimulatorMode('mock');
                    vbDisconnect().catch(() => {});
                    setSimStatus('idle');
                    setSimLogs(["[System] Switched to Offline Simulator (Mock). Ready."]);
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    simulatorMode === 'mock'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-850 dark:hover:text-stone-200'
                  }`}
                >
                  Offline Mock (Speech API)
                </button>
                <button
                  onClick={() => {
                    setSimulatorMode('vocalbridge');
                    setSimStatus('idle');
                    setSimLogs(["[System] Switched to Live Vocal Bridge (WebRTC). Connects directly to Dr. T agent."]);
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    simulatorMode === 'vocalbridge'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-850 dark:hover:text-stone-200'
                  }`}
                >
                  Live Vocal Bridge (WebRTC)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Console Logs */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="bg-stone-950 dark:bg-black rounded-2xl border border-stone-850 p-5 font-mono shadow-inner h-96 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-850 pb-2.5 mb-3.5 select-none">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Agent Console Terminal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-[9px] text-stone-500 uppercase">Simulated Pipeline</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto max-h-72 text-xs text-stone-300 leading-relaxed pr-1 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
                    {simLogs.length === 0 ? (
                      <p className="text-stone-500 italic text-[11px] select-none">No active simulations. Click "Launch Escalation Call" on the device simulator panel to start testing.</p>
                    ) : (
                      simLogs.map((log, i) => {
                        let color = 'text-stone-400';
                        if (log.startsWith('[Call]')) color = 'text-rose-400 font-semibold';
                        else if (log.startsWith('[Agent]')) color = 'text-amber-400';
                        else if (log.startsWith('[Human Spoke]')) color = 'text-emerald-400 font-extrabold';
                        else if (log.includes('APPROVED')) color = 'text-emerald-500 font-bold';
                        else if (log.includes('REJECTED')) color = 'text-rose-500 font-bold';
                        else if (log.includes('DELEGATED')) color = 'text-blue-500 font-bold';
                        
                        return (
                          <div key={i} className={`text-[11px] leading-relaxed select-text ${color}`}>
                            {log}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stone-850 pt-3 select-none">
                  <span className="text-[9px] text-stone-600">WORKSPACE: VIRTUAL-AGENT-CONTAINER</span>
                  <button
                    onClick={() => setSimLogs([])}
                    className="text-[9px] text-stone-500 hover:text-stone-300 font-bold"
                  >
                    Clear Terminal
                  </button>
                </div>
              </div>

              {/* Active mic status warning */}
              {micActive && (
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 flex items-center gap-2 animate-pulse">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <p className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold">
                    Microphone active. Speak options clearly (e.g., "Approve option one", "No", or "Chat") to respond to the phone call.
                  </p>
                </div>
              )}
            </div>

            {/* Right Phone Mockup Panel */}
            <div className="lg:col-span-2 flex flex-col items-center">
              {/* Phone Container */}
              <div className="w-64 sm:w-72 h-[470px] bg-stone-900 border-4 border-stone-800 rounded-[38px] p-4.5 shadow-[0_24px_48px_rgba(0,0,0,0.35)] flex flex-col justify-between relative overflow-hidden select-none">
                {/* Speaker top detail */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-stone-950 rounded-full flex items-center justify-center z-20">
                  <div className="w-8 h-1 bg-stone-800 rounded-full" />
                </div>

                {/* Inner screen content */}
                <div className="w-full h-full bg-gradient-to-b from-stone-950 to-stone-900 rounded-[30px] p-4 flex flex-col justify-between relative z-10 text-white">
                  
                  {/* Status header bar */}
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-stone-500 px-1 pt-1">
                    <span>9:41 AM</span>
                    <div className="flex items-center gap-1">
                      <span>Vocal Bridge</span>
                      <div className="w-2.5 h-2 bg-emerald-500 rounded-xs" />
                    </div>
                  </div>

                  {/* Central call screen */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center mt-4">
                    {simStatus === 'idle' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="w-16 h-16 bg-white/5 rounded-full border border-white/10 flex items-center justify-center mx-auto text-xl shadow-lg">
                          🤖
                        </div>
                        <div>
                          <p className="text-sm font-bold tracking-tight text-white">Coding Agent</p>
                          <p className="text-[10px] text-stone-500 mt-1">Ready for simulation call</p>
                        </div>
                        <button
                          onClick={handleIncomingCall}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-rose-600/10 cursor-pointer"
                        >
                          Launch Call
                        </button>
                      </div>
                    )}

                    {simStatus === 'ringing' && (
                      <div className="space-y-6 animate-pulse">
                        <div className="w-20 h-20 bg-rose-600/10 rounded-full border border-rose-500/20 flex items-center justify-center mx-auto text-2xl animate-bounce">
                          📞
                        </div>
                        <div>
                          <p className="text-base font-extrabold tracking-tight text-white animate-pulse">Incoming Call</p>
                          <p className="text-[10px] text-rose-400 mt-1 uppercase font-bold tracking-widest">Escalation pending</p>
                        </div>
                        <div className="text-[10px] text-stone-400 italic px-2">
                          "{draftScript.substring(0, 30)}..."
                        </div>
                      </div>
                    )}

                    {simStatus === 'active' && (
                      <div className="space-y-5 animate-fadeIn">
                        {/* Audio wave dynamic visualization */}
                        <div className="flex items-center justify-center gap-1 h-10">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-1 bg-emerald-400 rounded-full"
                              style={{ 
                                height: micActive ? `${Math.floor(Math.random() * 24) + 6}px` : '4px',
                                transition: 'height 0.1s ease-in-out'
                              }}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-emerald-400 font-mono">00:04</p>
                          <p className="text-xs text-stone-400 mt-1 font-semibold">Speaker active</p>
                        </div>

                        {/* Interactive response inputs inside simulator */}
                        <div className="grid grid-cols-2 gap-2 mt-4 px-1">
                          <button
                            onClick={() => handleManualAction('option-1')}
                            className="p-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-bold cursor-pointer transition-all"
                          >
                            Option 1 (Approve)
                          </button>
                          <button
                            onClick={() => handleManualAction('option-2')}
                            className="p-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 rounded-xl text-[10px] font-bold cursor-pointer transition-all"
                          >
                            Option 2 (Safe)
                          </button>
                          <button
                            onClick={() => handleManualAction('reject')}
                            className="p-2 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 rounded-xl text-[10px] font-bold cursor-pointer transition-all"
                          >
                            No (Reject)
                          </button>
                          <button
                            onClick={() => handleManualAction('chat')}
                            className="p-2 bg-stone-500/10 border border-stone-500/30 hover:bg-stone-500/20 text-stone-400 rounded-xl text-[10px] font-bold cursor-pointer transition-all"
                          >
                            Ask in Chat
                          </button>
                        </div>
                      </div>
                    )}

                    {simStatus === 'hangup' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="w-16 h-16 bg-rose-600/20 border border-rose-500/40 rounded-full flex items-center justify-center mx-auto text-xl text-rose-500">
                          <PhoneOff className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-rose-400">Call Ended</p>
                          <p className="text-[10px] text-stone-500 mt-1">Disconnecting system bridge...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Slide controls / Buttons bottom */}
                  <div className="flex justify-around items-center pt-4 border-t border-stone-800/80">
                    {simStatus === 'ringing' ? (
                      <>
                        <button
                          onClick={hangUp}
                          className="w-12 h-12 bg-rose-600 hover:bg-rose-700 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90"
                        >
                          <PhoneOff className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={acceptCall}
                          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90 animate-bounce"
                        >
                          <Phone className="w-5 h-5 text-white" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={hangUp}
                        disabled={simStatus === 'idle'}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          simStatus === 'idle'
                            ? 'bg-stone-800/40 text-stone-600 cursor-not-allowed'
                            : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer active:scale-90'
                        }`}
                      >
                        <PhoneOff className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Speech engine settings */}
              <div className="mt-4 flex items-center gap-4 text-xs select-none">
                <label className="flex items-center gap-1.5 text-stone-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ttsEnabled}
                    onChange={(e) => setTtsEnabled(e.target.checked)}
                    className="accent-rose-500"
                  />
                  <span>Voice Synthesis (TTS)</span>
                </label>

                <div className="flex items-center gap-1 text-[11px] text-stone-400">
                  {voiceSupported ? (
                    <span className="text-emerald-500 font-semibold">🎙️ Mic Supported</span>
                  ) : (
                    <span className="text-stone-500">🎙️ Local Speech Mic Locked</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* SUBTAB 4: PROMPT EXPORTER */}
        {activeSubTab === 'prompts' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn select-none">
            {/* Sidebar exporter choice */}
            <div className="space-y-1 bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200 dark:border-stone-800/80">
              <button
                onClick={() => setActivePromptTab('cursor')}
                className={`w-full flex items-center gap-2 p-2.5 px-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                  activePromptTab === 'cursor'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-850 dark:hover:text-stone-200'
                }`}
              >
                <span>🚀</span> Cursor (.cursorrules)
              </button>
              <button
                onClick={() => setActivePromptTab('claude')}
                className={`w-full flex items-center gap-2 p-2.5 px-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                  activePromptTab === 'claude'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-850 dark:hover:text-stone-200'
                }`}
              >
                <span>🤖</span> Claude Code Config
              </button>
              <button
                onClick={() => setActivePromptTab('windsurf')}
                className={`w-full flex items-center gap-2 p-2.5 px-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                  activePromptTab === 'windsurf'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-850 dark:hover:text-stone-200'
                }`}
              >
                <span>🌊</span> Windsurf Config
              </button>
              <button
                onClick={() => setActivePromptTab('copilot')}
                className={`w-full flex items-center gap-2 p-2.5 px-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                  activePromptTab === 'copilot'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-850 dark:hover:text-stone-200'
                }`}
              >
                <span>💬</span> General Copilot System Prompt
              </button>
            </div>

            {/* Display code output */}
            <div className="lg:col-span-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 rounded-2xl p-5 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-mono">
                    Calibration Prompt System Payload
                  </h4>
                  <button
                    onClick={() => handleCopy(getPromptContent(), 'exporter')}
                    className="flex items-center gap-1.5 p-1.5 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 border border-stone-200/20 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedIndex === 'exporter' ? 'Copied!' : 'Copy Rule Payload'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-stone-50 dark:bg-stone-950 rounded-xl font-mono text-[11px] leading-relaxed text-stone-800 dark:text-stone-300 overflow-x-auto whitespace-pre-wrap select-text max-h-80 border border-stone-100 dark:border-stone-900">
                  {getPromptContent()}
                </pre>
              </div>

              <div className="mt-6 p-4 bg-rose-500/5 border border-rose-500/15 rounded-xl flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <p className="text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                  <strong>How to use this ruleset:</strong> Download or copy the text block above, then paste it directly into your project's custom instructions configuration folder. This ensures any coding assistant editing your files will respect your physical phone constraints and always use the Vocal Bridge `vb_call` tool!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: SKILL.md DOCUMENT */}
        {activeSubTab === 'skill' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn text-stone-800 dark:text-stone-100">
            {/* Sidebar Overview */}
            <div className="space-y-4 bg-stone-50 dark:bg-stone-900/60 p-5 rounded-2xl border border-stone-200 dark:border-stone-800/80">
              <div className="text-center pb-4 border-b border-stone-200 dark:border-stone-800">
                <span className="text-[10px] text-rose-500 font-extrabold uppercase tracking-widest font-mono">INTEGRATION META</span>
                <h4 className="text-sm font-extrabold text-stone-950 dark:text-stone-50 font-sans mt-1">vocal-bridge-instruction</h4>
                <p className="text-[10.5px] text-stone-500 dark:text-stone-400 font-sans mt-2 leading-relaxed">
                  Core escalation and calibration rules for coding agents to delegate critical decisions to users via Vocal Bridge.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500 dark:text-stone-400">File Type</span>
                  <span className="font-mono font-bold text-stone-700 dark:text-stone-300">Markdown (.md)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500 dark:text-stone-400">File Size</span>
                  <span className="font-mono font-bold text-stone-700 dark:text-stone-300">5.43 KB</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500 dark:text-stone-400">Calibration Rules</span>
                  <span className="font-mono font-bold text-emerald-500">5 Protocols</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500 dark:text-stone-400">Speech Limitation</span>
                  <span className="font-mono font-bold text-rose-500">&lt; 60 words</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const entireSkillMd = `---
name: vocal-bridge-instruction
description: Core escalation and calibration rules for coding agents (Claude Code, Cursor, Codex, Windsurf) to delegate critical decisions to users via Vocal Bridge (vb_call).
---

# Vocal Bridge (vb_call) Escalation & Calibration Skill

This skill provides comprehensive instructions, patterns, and templates to teach AI coding agents (Claude Code, Cursor, Codex, Windsurf, and custom developer agents) when and how to invoke a vocal bridge call (\`vb_call\`) to escalate critical decisions to a human developer.

---

## 1. Core Rule: The Golden Standard

A vocal bridge call (\`vb_call\`) exists for one single purpose:
**Obtain a human decision that is strictly required to continue execution.**

- If a decision is not required, **DO NOT CALL**. Keep working independently.
- If execution can continue safely without a decision, **DO NOT CALL**.

---

## 2. Decision Calibration Engine

To minimize misfires and ensure calls are only made when truly necessary, follow these strict calibration criteria.

### Call Only When All Conditions Are True (The 5 Rules)
An agent must ONLY trigger a call if **ALL FIVE** of the following conditions are met:
1. **The workflow is blocked:** The agent cannot proceed further without resolving the choice.
2. **A human decision is required:** The choice cannot be resolved autonomously by standard code logic, linting rules, or error handling.
3. **The decision changes what happens next:** It has a material impact on system architecture, code paths, or deployment state.
4. **The agent is not authorized to choose:** The agent has no credentials, authorization, or rights to make this specific high-risk or trade-off choice unilaterally.
5. **No existing preference or prior decision already answers the question:** The user has not previously specified a preference or rule covering this exact scenario.

### Clear Boundaries: When to Reach Out vs. Keep Working
*   **KEEP WORKING (Do NOT Call):**
    *   *Troubleshooting and Fixing:* Compiler errors, TypeScript complaints (e.g., missing type declarations or property errors), formatting/style guidelines, standard lint warnings. Fix these using best practices and documentation.
    *   *Minor Aesthetic Preferences:* Choosing button padding (8px vs 10px), standard layout alignments, color palette tweaks matching existing components, or choosing standard React icons.
    *   *Refactoring & Internal Structure:* Extracting clean sub-components, helper functions, or folder organization unless they violate explicit project rules.
*   **REACH OUT (Call Required):**
    *   *Financial Commitments:* Provisioning paid infrastructure, cloud databases, or subscribing to external APIs costing real-world currency or cloud credits.
    *   *Destructive Actions:* Overwriting database schemas, running migrations that wipe mock seed data, deleting file directories, or overwriting human-made custom implementations in production.
    *   *Public-Facing Operations:* Deploying live updates, sending automated systems emails (e.g. newsletters or notifications) to real-world users, or publishing public content.
    *   *Unresolved Blocked Requirements:* Conflicting user instructions that directly block execution and cannot be clarified via code context.

### Call/No-Call Calibration Chart

| Scenario | Call? | Reason |
| :--- | :---: | :--- |
| **Spending real money / cloud credits** (e.g. provisioning high-cost VMs) | **YES** | Irreversible financial impact; blocked until approved. |
| **Deleting database tables / user content in production** | **YES** | High-risk, irreversible action; requires human confirmation. |
| **Publishing content / sending external communications** (e.g. newsletters) | **YES** | Public-facing, permanent communication. |
| **Fixing a local compiler error or lint warning** | **NO** | Reversible, standard troubleshooting within agent capabilities. |
| **Choosing between two naming conventions** (e.g., camelCase vs. snake_case) | **NO** | Minor developer preference; not a blocker, agent should choose best practice. |
| **A database migration that wipes mock seed data on start** | **YES** | Potential loss of mock database state that could break workflow. |
| **Adding a standard React icon in the UI** | **NO** | Standard development work; fully reversible. |

---

## 3. Communication Protocol (No-Fluff Speech)

When placing a call, your message must never bury the decision under unnecessary detail. It must provide exactly what the listener needs to make an immediate, eyes-free decision.

### Structure of the Perfect Script
1.  **The Decision (First 10 Words):** Lead immediately with the core question requiring authorization.
2.  **The Situation (Context):** A brief, non-technical sentence explaining why this is happening. No technical jargon, no file paths, no code variables.
3.  **The Choices:** Present clear, numbered choices (Option 1 vs. Option 2) that are easy to remember and select.
4.  **The Stakes:** Explicitly describe the consequences of choosing each option, or of doing nothing.

### Hard Constraints
-   **Max 60 words** (strictly enforced).
-   **Max 30 seconds** of speech.
-   **Single decision per call.**
-   **No visual or technical dependencies:** Never speak file paths (e.g. \`/src/types.ts\`), UUIDs, hashes, CSS classes, or web URLs. Keep it in humble, plain speech.

### Script Comparison

*   **❌ BAD (Buries the decision, heavy jargon, too verbose):**
    > "Hello developer, I am in the process of running a migration in \`/src/db/schema.ts\` which will alter the tables. The problem is that running this schema modification will drop the current state and wipe our mock seed data in our database container on port 3000, causing a loss of your progress. Should I run \`npm run migrate:force\` or stop the build?"
    *Reason for Failure:* Buries the decision at the end, includes complex folder paths, port numbers, shell commands, and exceeds the word limit.

*   **✅ GOOD (The Gold Standard - Concise, front-loaded, plain speech):**
    > "Decision needed. We need to perform a database migration. We can wipe and rebuild the database, or stop the migration to keep the current data. Option one wipes all existing mock records. Option two preserves the data but halts the application start. Which do you choose?"
    *Why it succeeds:* The decision is in the first 2 words. Plain English is used. Option 1 vs. Option 2 is clear. Stakes of both options are explicit. Word count: 54 words.

---

## 4. Safe Execution Rules

To protect system integrity, your interaction flow must adhere to robust safety parameters.

1.  **Silence is Never Approval:**
    *   If a call goes unanswered, or is declined in the UI, **do not proceed** with the risky action.
    *   Leave the system unchanged, mark the decision as pending, and transition the conversation back to the text chat.
2.  **Explicit Affirmation Required:**
    *   Only execute high-risk actions when you receive a clear, unambiguous approval (e.g., "Yes", "Approve", "Proceed", "Go ahead", "Send it").
3.  **Secrets Stay Unspoken:**
    *   Never say passwords, API keys, tokens, auth credentials, or sensitive account numbers over the vocal channel. Only describe the associated service (e.g., "the Stripe integration").
4.  **Do Not Repeat Calls:**
    *   If a blocker is unchanged, or a decision was already made/rejected, **do not trigger a duplicate call**. Record the user's rejection/approval and proceed based on that settled state.

---

## 5. Guidance Completeness (Unhappy Paths & Edges)

A less capable model must not stumble when things go wrong. Handle these unhappy paths gracefully:

*   **Ambiguous Responses ("Maybe", "I don't know"):**
    *   Attempt exactly **one** brief clarification (e.g., "Just to confirm, should we proceed with wiping the database?").
    *   If the response remains ambiguous, treat it as a rejection. Hang up, do not proceed, and return to text chat.
*   **Abrupt Disconnections / Hang-ups:**
    *   If the connection fails mid-call, immediately rollback any staged, high-risk changes.
    *   Save your current draft script and state, and wait for the user to resume in text chat.
*   **SDK Errors / Call Failures:**
    *   If the \`vb_call\` fails to dial or connect, log the error locally.
    *   Do not retry in a loop. Gracefully notify the developer via the text console or chat box and halt execution.

---

## 6. Across the Conversation (State Preservation)

The agent must maintain state across turns to avoid repeating questions or ignoring user preferences.

*   **Respect "Stop Calls" Preferences:**
    *   If the user says "Stop calling," "Don't call me," or "Use chat instead," this preference **MUST** be persisted in the agent's memory or rules.
    *   **STRICTLY FORBIDDEN:** Ever placing another physical phone call for the duration of the task. All future escalations must be handled via the text-based chat.
*   **Persist Settled Decisions:**
    *   Do not re-ask a settled question in subsequent turns.
    *   If the user approved or rejected an action in Turn 1, do not ask them to confirm again in Turn 2 or Turn 3. Carry out the decision, or proceed with the alternative path.
*   **No Duplicate Dialing for Persistent Blockers:**
    *   If a blocker remains active and the user has already rejected or failed to answer the call, do not initiate a new call. Present the state clearly in the text chat.

---

## 7. Coding Agent Configurations

Inject the following configurations into your coding agent's settings to enforce this behavior:

### Cursor Configuration (\`.cursorrules\`)
\`\`\`json
{
  "rules": [
    "Before editing, view files first. Prioritize user intent.",
    "Strictly follow the vb_call escalation policy specified in AGENTS.md.",
    "Do not make automatic high-risk decisions (financial, destructive, public-facing) without initiating vb_call.",
    "Formulate vb_call spoken scripts: front-load the decision in under 10 words, specify option 1 vs option 2, state stakes clearly, and keep under 60 words.",
    "Ensure silence is never treated as approval. Respect 'stop call' preferences permanently."
  ]
}
\`\`\`

### Claude Code Configuration (\`claude_code_config\` / System Prompt)
\`\`\`text
You have access to the \`vb_call\` tool to escalate blocked, critical workflows to the user over a real-time vocal bridge.
When to call:
- Blocked on spending money, deleting database records, publishing content, or irreversible changes.
- Ensure all 5 conditions in your system rules are met.
- NEVER call for minor preferences, code layout, refactoring, or reversible bugs.
How to speak:
- Front-load decision in the first 10 words.
- Offer numbered Choices (Option 1 vs Option 2).
- Under 60 words total.
Safe Execution:
- Respect "Stop calling" permanently. Silence is never approval. Never re-ask a settled question.
\`\`\`

### Windsurf / Roo Code Config (\`.windsurfrules\` / \`system-prompt\`)
\`\`\`text
Escalate human-critical decisions via \`vb_call\` according to the 5-point calibration protocol.
If a call is answered:
- Record the decision and continue immediately. Do not ask for duplicate confirmation.
- Respect stop requests and hold state across turns.
If no answer:
- Stop executing, rollback staged changes, and wait for instructions in chat.
\`\`\`
`;
                  handleCopy(entireSkillMd, 'entire-skill');
                }}
                className="w-full mt-4 p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedIndex === 'entire-skill' ? 'Copied Entire File!' : 'Copy Entire SKILL.md'}</span>
              </button>
            </div>

            {/* Document Content */}
            <div className="lg:col-span-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col gap-6 max-h-[640px] overflow-y-auto scrollbar-thin">
              
              {/* Document Header */}
              <div className="border-b border-stone-100 dark:border-stone-850 pb-5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                  Vocal Bridge (vb_call) Escalation & Calibration Skill
                </h2>
                <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Comprehensive instructions, patterns, and templates to teach AI coding agents when and how to invoke vocal bridge calls to escalate critical decisions to developers.
                </p>
              </div>

              {/* Section 1 */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider font-mono border-l-2 border-rose-500 pl-2.5 mb-3">
                  1. Core Rule: The Golden Standard
                </h3>
                <div className="bg-stone-50 dark:bg-stone-950/50 p-4 rounded-xl border border-stone-150/40 dark:border-stone-850/30">
                  <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-bold leading-relaxed mb-2">
                    A vocal bridge call (<code className="bg-stone-200/50 dark:bg-stone-900 px-1 py-0.5 rounded font-mono text-xs text-rose-600">vb_call</code>) exists for one single purpose:
                  </p>
                  <blockquote className="border-l-4 border-rose-500/50 pl-3.5 py-1 text-sm sm:text-base font-extrabold italic text-stone-950 dark:text-white my-3 font-sans">
                    "Obtain a human decision that is strictly required to continue execution."
                  </blockquote>
                  <ul className="list-disc pl-5 mt-2 text-xs text-stone-600 dark:text-stone-400 space-y-1">
                    <li>If a decision is not required, <strong className="text-rose-500 uppercase">Do Not Call</strong>.</li>
                    <li>If execution can continue safely without a decision, <strong className="text-rose-500 uppercase">Do Not Call</strong>.</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider font-mono border-l-2 border-rose-500 pl-2.5 mb-3">
                  2. Decision Calibration Engine (The 5 Rules)
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  An agent must ONLY trigger a call if <strong className="text-rose-500">ALL FIVE</strong> of the following conditions are true:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 mb-6">
                  {[
                    { nr: "1", title: "Blocked", desc: "The workflow is blocked; cannot proceed further." },
                    { nr: "2", title: "Human Choice", desc: "Cannot be resolved autonomously by standard code." },
                    { nr: "3", title: "Stakes", desc: "Has a material impact on deployment or architecture." },
                    { nr: "4", title: "No Auth", desc: "The agent lacks credentials or unilateral rights." },
                    { nr: "5", title: "No Preference", desc: "No prior rule or setting answers the choice." }
                  ].map((rule) => (
                    <div key={rule.nr} className="p-3 bg-stone-50 dark:bg-stone-950/30 border border-stone-200/50 dark:border-stone-850/50 rounded-xl text-center">
                      <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs mx-auto mb-2 font-mono">
                        {rule.nr}
                      </div>
                      <p className="text-[11px] font-extrabold text-stone-900 dark:text-white">{rule.title}</p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">{rule.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Table Calibration chart */}
                <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest font-mono mb-2">
                  Call / No-Call Calibration Chart
                </h4>
                <div className="overflow-x-auto border border-stone-200/60 dark:border-stone-850/50 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 dark:bg-stone-950/50 border-b border-stone-200/60 dark:border-stone-850/50 font-bold text-stone-700 dark:text-stone-300 select-none">
                        <th className="p-3">Scenario</th>
                        <th className="p-3 text-center">Call?</th>
                        <th className="p-3">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-850/50 text-stone-600 dark:text-stone-300">
                      {[
                        { sc: "Spending real money / cloud credits", call: "YES", reason: "Irreversible financial impact; blocked until approved." },
                        { sc: "Deleting database tables in production", call: "YES", reason: "High-risk, irreversible action; requires human confirmation." },
                        { sc: "Publishing content / sending system blast", call: "YES", reason: "Public-facing, permanent communication." },
                        { sc: "Fixing a local compiler or lint error", call: "NO", reason: "Reversible, standard troubleshooting." },
                        { sc: "Choosing between two naming conventions", call: "NO", reason: "Minor aesthetic preference; not a blocker." },
                        { sc: "Database migration wiping mock seed data", call: "YES", reason: "Potential loss of workflow state; blocks execution." }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-stone-50/50 dark:hover:bg-stone-950/20">
                          <td className="p-3 font-semibold text-stone-800 dark:text-stone-200">{row.sc}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              row.call === 'YES' ? 'bg-rose-500/15 text-rose-500' : 'bg-stone-200/50 dark:bg-stone-800 text-stone-500'
                            }`}>
                              {row.call}
                            </span>
                          </td>
                          <td className="p-3 text-stone-500 dark:text-stone-400">{row.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider font-mono border-l-2 border-rose-500 pl-2.5 mb-3">
                  3. Communication Protocol (The perfect script)
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
                  When executing a call, speak clearly and concisely. The spoken message must be <strong className="text-stone-900 dark:text-white">100% understandable eyes-free and hands-free</strong>.
                </p>

                <div className="bg-stone-50 dark:bg-stone-950/40 p-4 border border-stone-150 dark:border-stone-850 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 select-none text-[10px] uppercase tracking-wider font-mono text-center font-bold">
                    <div className="bg-white dark:bg-stone-900 p-2 border border-stone-200/50 dark:border-stone-800/80 rounded-lg text-stone-700 dark:text-stone-300">
                      1. Decision
                    </div>
                    <div className="bg-white dark:bg-stone-900 p-2 border border-stone-200/50 dark:border-stone-800/80 rounded-lg text-stone-700 dark:text-stone-300">
                      2. Situation
                    </div>
                    <div className="bg-white dark:bg-stone-900 p-2 border border-stone-200/50 dark:border-stone-800/80 rounded-lg text-stone-700 dark:text-stone-300">
                      3. Choices
                    </div>
                    <div className="bg-white dark:bg-stone-900 p-2 border border-stone-200/50 dark:border-stone-800/80 rounded-lg text-stone-700 dark:text-stone-300">
                      4. Stakes
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                    <p><strong>🚨 Hard Constraints:</strong></p>
                    <ul className="list-disc pl-5 space-y-1 text-[11px] leading-relaxed">
                      <li><strong>Max 60 words</strong> strictly enforced.</li>
                      <li><strong>Max 30 seconds</strong> of vocal speech.</li>
                      <li><strong>No visual dependencies</strong> (No UUIDs, folder paths, code snippets, or URLs).</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg">
                    <p className="text-[10px] text-rose-500 font-extrabold uppercase tracking-widest font-mono">GOLD STANDARD SCRIPT</p>
                    <p className="text-xs sm:text-sm font-serif italic text-stone-700 dark:text-stone-300 leading-relaxed mt-1.5 antialiased">
                      "Decision needed. The report is ready. You can publish now or keep it in draft. Publishing now meets today's deadline. Keeping it in draft delays release until tomorrow. Which do you choose?"
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider font-mono border-l-2 border-rose-500 pl-2.5 mb-3">
                  4. Coding Agent Configurations
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  Enforce these instructions inside your agent settings using the exact payloads provided under the <strong>Prompt Exporter</strong> tab.
                </p>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setActiveSubTab('prompts')}
                    className="p-2 px-4 bg-stone-900 dark:bg-stone-850 hover:bg-stone-800 hover:text-white text-stone-100 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all"
                  >
                    Open Prompt Exporter
                  </button>
                  <button
                    onClick={() => setActiveSubTab('calibration')}
                    className="p-2 px-4 border border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-950 text-stone-600 dark:text-stone-400 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all"
                  >
                    Take Calibration Quiz
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
