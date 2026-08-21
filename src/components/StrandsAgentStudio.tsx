import React, { useState, useEffect } from 'react';
import {
  Bot,
  Zap,
  Shield,
  Layers,
  Sparkles,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Home,
  Briefcase,
  Users,
  Server,
  Code2,
  Terminal,
  Activity,
  ArrowRight,
  Database,
  Lock,
  Cpu,
  Workflow,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
  Send,
  PhoneCall,
  Flame,
  FileCode,
  Download
} from 'lucide-react';

// --- TYPES ---
export type AgentTrack = 'everyday' | 'professional' | 'good-neighbor';

export interface StrandsAgentConfig {
  id: string;
  name: string;
  track: AgentTrack;
  tagline: string;
  description: string;
  icon: string;
  colorScheme: {
    badge: string;
    border: string;
    bg: string;
    glow: string;
    accent: string;
  };
  sampleWorkflows: string[];
  toolsEnabled: string[];
  quietModeThreshold: number; // e.g. 90% runs silently
  decisionEscalationTrigger: string;
  defaultPayload: Record<string, any>;
  sampleDecisionPrompt: string;
}

export interface AgentExecutionLog {
  id: string;
  timestamp: string;
  agentId: string;
  status: 'silent_success' | 'escalated_decision' | 'autonomous_action' | 'failed';
  action: string;
  reasoning: string;
  decisionRequired?: {
    prompt: string;
    choices: string[];
    selectedChoice?: string;
    stakes: string;
    resolved: boolean;
  };
  metrics: {
    latencyMs: number;
    tokens: number;
    confidence: number;
    savedMinutes: number;
  };
}

// Pre-configured Strands Agents across all 3 tracks
export const STRANDS_AGENTS: StrandsAgentConfig[] = [
  // TRACK 1: EVERYDAY AGENTS
  {
    id: 'everyday-sensory-guardian',
    name: 'Sensory & Environmental Home Guardian',
    track: 'everyday',
    tagline: 'Quiet background guardian that resolves 95%+ of sensory triggers without bugging the user',
    description: 'Monitors acoustic resonance, flickering PWM lighting, HVAC transformer coil hums, air quality particulates, and tactile comfort. Silently adjusts smart blinds, humidifiers, anti-phase noise filters, and circadian kelvin curves to eliminate sensory overwhelm before it is felt.',
    icon: '🌿',
    colorScheme: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      border: 'border-emerald-500/40',
      bg: 'from-emerald-950/40 via-stone-900 to-stone-950',
      glow: 'shadow-emerald-500/10',
      accent: 'text-emerald-400'
    },
    sampleWorkflows: [
      'Silently dampen 60Hz HVAC compressor coil vibration with ambient anti-phase frequencies',
      'Smoothly shift living room lighting from 5000K cold blue to 2700K warm circadian curve at dusk',
      'Trigger silent HEPA air filtration upon indoor particulate spike (PM2.5 > 15 µg/m³)',
      'Pre-cool bedroom and calibrate weighted blanket temperature 30 mins before bedtime'
    ],
    toolsEnabled: ['AcousticSpectrumAnalyzer', 'CircadianLightingController', 'ParticulateSensoryFilter', 'QuietHomeMesh'],
    quietModeThreshold: 97,
    decisionEscalationTrigger: 'Physical hardware malfunction requiring manual repair or sensor replacement > $50.',
    defaultPayload: {
      room: 'Master Bedroom & Living Workspace',
      detectedTrigger: 'Acoustic resonance (120Hz refrigerator compressor vibration) + 18% ambient humidity drop',
      autonomousActionTaken: 'Engaged anti-vibration damping schedule, adjusted smart humidifier to 45% relative humidity, lowered luminaire glare to 180 lumens.',
      pendingApproval: 'Replace degraded acoustic baffle seal ($28) vs dispatch HVAC technician ($85).'
    },
    sampleDecisionPrompt: 'Decision needed. Refrigerator compressor baffle seal is degraded. Option 1: Auto-order $28 acoustic dampening kit for self-placement. Option 2: Dispatch appliance technician for $85. Which do you choose?'
  },
  {
    id: 'everyday-home-steward',
    name: 'Home & Family Life Steward',
    track: 'everyday',
    tagline: 'Silent background household, health scheduling, and grocery optimizer',
    description: 'Monitors pantry depletion, family doctor appointment cadence, utility tariffs, and maintenance. Executes 95% of chores autonomously and only interrupts you when real financial or safety decisions arise.',
    icon: '🏡',
    colorScheme: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      border: 'border-emerald-500/40',
      bg: 'from-emerald-950/40 via-stone-900 to-stone-950',
      glow: 'shadow-emerald-500/10',
      accent: 'text-emerald-400'
    },
    sampleWorkflows: [
      'Auto-refill pantry staples below reorder threshold under $30',
      'Quietly reschedule dentist appointment when calendar conflict occurs',
      'Optimize HVAC run-times against dynamic off-peak electricity tariffs',
      'Track vehicle preventative maintenance logs and warranty expirations'
    ],
    toolsEnabled: ['SmartPantryScanner', 'FamilyCalendarEngine', 'UtilityTariffScraper', 'MicroPaymentWallet'],
    quietModeThreshold: 94,
    decisionEscalationTrigger: 'Purchases > $50, medication dosage alterations, or new service vendor contracts.',
    defaultPayload: {
      familyMember: 'Grandma Chen & Lucas (Age 8)',
      detectedEvent: 'Water heater pressure sensor reporting 15% pressure drop',
      autonomousActionTaken: 'Flagged sensor log, isolated smart valve safety bypass, searched certified local plumbers under warranty.',
      pendingApproval: 'Plumbing dispatch fee $89 vs DIY valve replacement gasket $12'
    },
    sampleDecisionPrompt: 'Decision needed. Water heater valve is weeping. Option 1: Dispatch warranty plumber for $89. Option 2: Order $12 OEM gasket for self-install. Which do you choose?'
  },
  {
    id: 'everyday-fin-sentinel',
    name: 'Everyday Money & Subscription Sentinel',
    track: 'everyday',
    tagline: 'Zero-noise recurring bill trimmer and dynamic cash-flow guard',
    description: 'Monitors micro-transactions, detects surprise price hikes on streaming services, disputes mistaken bank fees, and silently sweeps surplus into high-yield buffers.',
    icon: '💳',
    colorScheme: {
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      border: 'border-cyan-500/40',
      bg: 'from-cyan-950/40 via-stone-900 to-stone-950',
      glow: 'shadow-cyan-500/10',
      accent: 'text-cyan-400'
    },
    sampleWorkflows: [
      'Silently cancel free trials 24h before billing starts',
      'Auto-dispute $2.50 duplicate merchant charge with automated evidence',
      'Sweep $45 idle checking balance to 5.1% APY treasury fund',
      'Benchmark auto-insurance rate against 4 carriers at policy renewal'
    ],
    toolsEnabled: ['BankFeedParser', 'TrialExpirationWatcher', 'DisputeFiler', 'YieldOptimizer'],
    quietModeThreshold: 98,
    decisionEscalationTrigger: 'Unusual transfers > $100 or insurance carrier policy switch authorizations.',
    defaultPayload: {
      account: 'Primary Household Checking',
      detectedEvent: 'Gym membership monthly fee increased from $49 to $69 without notification.',
      autonomousActionTaken: 'Drafted dispute citing original contract terms, located 2 comparable fitness studios within 1.5 miles.',
      pendingApproval: 'Send dispute demand letter or accept renewal rate.'
    },
    sampleDecisionPrompt: 'Decision needed. Gym raised monthly rate by $20. Option 1: Send automated contract dispute letter. Option 2: Accept increase. Which do you choose?'
  },

  // TRACK 2: PROFESSIONAL AGENTS
  {
    id: 'pro-veterinary-ethology',
    name: 'Veterinary Ethology & SOAP Medical Report Copilot',
    track: 'professional',
    tagline: 'Converts animal behavior & observation transcripts into structured SOAP medical reports for EHR export',
    description: 'Designed for veterinary ethologists, clinicians, and animal behaviorists. Deconstructs vocalizations, postural transcripts, gait analyses, and diagnostic markers into structured Subjective-Objective-Assessment-Plan (SOAP) records with instant Cornerstone/Idexx EHR interoperability.',
    icon: '🐾',
    colorScheme: {
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      border: 'border-purple-500/40',
      bg: 'from-purple-950/40 via-stone-900 to-stone-950',
      glow: 'shadow-purple-500/10',
      accent: 'text-purple-400'
    },
    sampleWorkflows: [
      'Convert freeform dictate audio into structured Subjective, Objective, Assessment, and Plan (SOAP) format',
      'Map feline grimace scale & canine postural stress markers to validated clinical pain indices',
      'Cross-reference dosage safety for psychotropic & neuro-modulating protocols (Fluoxetine, Gabapentin)',
      'Generate client-friendly behavioral modification discharge guides with step-by-step counter-conditioning'
    ],
    toolsEnabled: ['EthogramBehaviorParser', 'SOAPReportCompiler', 'VeterinaryEHRBridge', 'PharmaDosageSafetyMatrix'],
    quietModeThreshold: 88,
    decisionEscalationTrigger: 'Severe behavioral escalation indicators, high-risk drug-drug interaction, or off-label dosage authorization.',
    defaultPayload: {
      patient: 'Kona (4yo M/N Belgian Malinois, 31.2kg)',
      presentation: 'Acute noise phobia (thunderstorm/fireworks), redirected aggression towards door frames, pacing, dilated pupils',
      autonomousActionTaken: 'Synthesized 15-minute behavioral exam transcript into 4-section SOAP report, calculated Sileo/Trazodone protocol dosage ranges, pre-populated Vetspire EHR fields.',
      pendingApproval: 'Authorize combination Trazodone (5-7mg/kg) + Sileo oromucosal gel protocol vs Gabapentin bridge.'
    },
    sampleDecisionPrompt: 'Decision needed. Patient Kona exhibits acute noise phobia score 4/5. Option 1: Authorize Trazodone 150mg with Sileo oromucosal protocol. Option 2: Authorize Gabapentin 400mg titration. Which do you approve?'
  },
  {
    id: 'pro-clinical-triage',
    name: 'Clinical Practice & Differential Scribe',
    track: 'professional',
    tagline: 'High-judgment clinical intake, guideline cross-examiner, and billing coder',
    description: 'Tackles repetitive clinical documentation and judgment-heavy drug-drug interaction auditing for physicians and healthcare practitioners, cutting EHR administrative burden by 80%.',
    icon: '🩺',
    colorScheme: {
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      border: 'border-indigo-500/40',
      bg: 'from-indigo-950/40 via-stone-900 to-stone-950',
      glow: 'shadow-indigo-500/10',
      accent: 'text-indigo-400'
    },
    sampleWorkflows: [
      'Synthesize 45-page patient history into prioritized 5-point differential summary',
      'Cross-check drug interactions against renal clearance labs in real time',
      'Pre-populate ICD-10 and CPT codes with evidence-backed justification notes',
      'Draft prior-authorization appeal letters citing current clinical trials'
    ],
    toolsEnabled: ['PubMedClinicalRAG', 'ICD10CodeMapper', 'DrugInteractionMatrix', 'HIPAAAuditVault'],
    quietModeThreshold: 85,
    decisionEscalationTrigger: 'Conflicting guideline recommendations or high-risk contraindications requiring MD sign-off.',
    defaultPayload: {
      patientId: 'PT-8891-Longevity',
      chiefComplaint: 'Postprandial fatigue and fasting glucose 128 mg/dL with mild eGFR reduction (54 mL/min)',
      autonomousActionTaken: 'Synthesized 12-month metabolic trends, calculated HOMA-IR, cross-referenced SGLT2i renal dosing guidelines.',
      pendingApproval: 'Approve SGLT2i dose adjustment vs initiate Metformin ER titration.'
    },
    sampleDecisionPrompt: 'Decision needed. Patient eGFR is 54. Option 1: Approve Empagliflozin 10mg daily with renal monitoring. Option 2: Titrate Metformin ER. Which do you authorize?'
  },
  {
    id: 'pro-maker-compiler',
    name: 'SMB Maker & Contract Deal Copilot',
    track: 'professional',
    tagline: 'Autonomous contract redliner, quote generator, and pipeline accelerator',
    description: 'Built for independent creators, boutique consultancies, and makers. Reviews master service agreements, highlights indemnification pitfalls, and compiles accurate project estimates.',
    icon: '⚖️',
    colorScheme: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      border: 'border-amber-500/40',
      bg: 'from-amber-950/40 via-stone-900 to-stone-950',
      glow: 'shadow-amber-500/10',
      accent: 'text-amber-400'
    },
    sampleWorkflows: [
      'Scan 20-page client NDA for uncapped liability and IP assignment overreach',
      'Calculate project milestone margins based on real historical hours',
      'Auto-generate milestone invoices with automated payment reconciliation',
      'Draft vendor dispute responses matching precise contract clause references'
    ],
    toolsEnabled: ['ContractClauseAuditor', 'EstimateCalculator', 'StripeInvoiceBridge', 'IPClauseProtector'],
    quietModeThreshold: 90,
    decisionEscalationTrigger: 'Clauses with uncapped liability or scope expansions > 15% budget variance.',
    defaultPayload: {
      client: 'Apex BioTech Corp',
      dealValue: '$48,000 Milestone Agreement',
      autonomousActionTaken: 'Identified 3 non-standard IP indemnification clauses, drafted alternative mutual indemnification language.',
      pendingApproval: 'Send counter-redline to client legal counsel.'
    },
    sampleDecisionPrompt: 'Decision needed. Client MSA contains uncapped IP liability. Option 1: Send Strands-generated mutual cap redline ($50k cap). Option 2: Sign as is. Which do you choose?'
  },

  // TRACK 3: GOOD NEIGHBOR AGENTS
  {
    id: 'neighbor-pet-safety-mesh',
    name: 'Community Pet Safety & Lost Animal Mesh',
    track: 'good-neighbor',
    tagline: 'Coordinates neighborhood lost pet sweeps, shelter fostering networks, and dog park capacity alerts',
    description: 'Empowers neighborhoods, animal rescues, and municipal shelters to activate instant decentralized search grids for missing animals, coordinate emergency foster placements, monitor community dog park overcrowding, and manage microchip match networks.',
    icon: '🐕',
    colorScheme: {
      badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      border: 'border-orange-500/40',
      bg: 'from-orange-950/40 via-stone-900 to-stone-950',
      glow: 'shadow-orange-500/10',
      accent: 'text-orange-400'
    },
    sampleWorkflows: [
      'Broadcast geo-fenced lost pet alerts to volunteer sweepers with live search grid quadrant map',
      'Match urgent shelter intake dogs with certified local emergency foster families within 5 miles',
      'Monitor real-time dog park crowd density & temperature heat-index to prevent heatstroke and scuffles',
      'Automate microchip registry cross-referencing across 6 regional municipal registries'
    ],
    toolsEnabled: ['LostPetSearchGridMesh', 'FosterMatchingEngine', 'DogParkCapacityMonitor', 'MicrochipRegistryRelay'],
    quietModeThreshold: 94,
    decisionEscalationTrigger: 'Critical medical distress of found animal, severe bite quarantine protocols, or full shelter capacity.',
    defaultPayload: {
      communityZone: 'Oakridge & Riverfront District (Zone 6)',
      activeAlert: "Golden Retriever mix 'Barnaby' reported lost 22 mins ago (Last seen near 4th & Pine)",
      autonomousActionTaken: 'Created 0.75-mile radius search quadrant, dispatched SMS alerts to 14 verified neighborhood dog walkers, scanned 2 local microchip intake feeds.',
      pendingApproval: 'Deploy secondary volunteer sweep to Riverfront Trail vs alert municipal animal control officer.'
    },
    sampleDecisionPrompt: 'Decision needed. Lost dog Barnaby sighted near Riverfront highway. Option 1: Dispatch 4 volunteer sweepers with safety leashes. Option 2: Alert municipal animal control officer. Which do you choose?'
  },
  {
    id: 'neighbor-food-relay',
    name: 'Food Bank & Perishable Redistribution Mesh',
    track: 'good-neighbor',
    tagline: 'Multi-party surplus food rescue, cold-chain routing, and volunteer matcher',
    description: 'Coordinates between local grocery donors, food banks, shelters, and volunteer drivers. Rescues thousands of pounds of fresh produce daily before spoilage with zero manual dispatching.',
    icon: '🍎',
    colorScheme: {
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      border: 'border-rose-500/40',
      bg: 'from-rose-950/40 via-stone-900 to-stone-950',
      glow: 'shadow-rose-500/10',
      accent: 'text-rose-400'
    },
    sampleWorkflows: [
      'Ingest bakery and market surplus notifications via SMS/email webhooks',
      'Calculate optimal cold-chain routes to nearest homeless shelter within 45 min',
      'Auto-match volunteer drivers based on proximity and vehicle capacity',
      'Log tax-deduction receipts and food safety compliance temperatures'
    ],
    toolsEnabled: ['ColdChainTimer', 'VolunteerMeshRouter', 'DonorReceiptGenerator', 'SpoilagePredictor'],
    quietModeThreshold: 92,
    decisionEscalationTrigger: 'Shelter capacity overflow or perishable shipments exceeding cold-chain safety window.',
    defaultPayload: {
      donor: 'Sunset Organic Co-Op (Downtown)',
      surplusItem: '320 lbs fresh leafy greens and pasteurized milk (Expires in 18 hrs)',
      autonomousActionTaken: 'Calculated split payload: 200 lbs to St. Jude Shelter (Capacity: 85%), 120 lbs to Eastside Community Kitchen. Dispatched 2 volunteer drivers.',
      pendingApproval: 'Confirm route override for second volunteer van.'
    },
    sampleDecisionPrompt: 'Decision needed. St. Jude Shelter fridge is at 90% capacity. Option 1: Re-route 120 lbs to Eastside Kitchen (adds 8 mins travel). Option 2: Deliver all to St. Jude. Which do you choose?'
  },
  {
    id: 'neighbor-community-mesh',
    name: 'Public Library & Senior Mutual Aid Hub',
    track: 'good-neighbor',
    tagline: 'Community resource pairing, multilingual intake, and emergency care mesh',
    description: 'Empowers public libraries, senior centers, and mutual aid groups to triage wellness checks, tool-library checkouts, language translations, and emergency heat/freeze wave checks.',
    icon: '🤝',
    colorScheme: {
      badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      border: 'border-teal-500/40',
      bg: 'from-teal-950/40 via-stone-900 to-stone-950',
      glow: 'shadow-teal-500/10',
      accent: 'text-teal-400'
    },
    sampleWorkflows: [
      'Translate non-English senior service applications into 8 local dialects',
      'Coordinate neighborhood tool-sharing and emergency snow shovel teams',
      'Deploy automatic wellness check calls during severe heat/frost alerts',
      'Match after-school tutoring volunteers with low-income students'
    ],
    toolsEnabled: ['MultilingualSpeechEngine', 'CommunityEquipmentLocker', 'WeatherAlertMonitor', 'SeniorCareSafetyMesh'],
    quietModeThreshold: 96,
    decisionEscalationTrigger: 'Unresponsive senior citizen wellness check or emergency heating failure.',
    defaultPayload: {
      neighborhoodDistrict: 'Maplewood Senior Living & Library Zone 4',
      alertTrigger: 'Severe Freeze Advisory (-4°F projected tonight)',
      autonomousActionTaken: 'Contacted 48 enrolled seniors via automated warm voice check. 47 confirmed safe and heated. 1 resident (Mrs. Gable, Apt 3B) reported radiator outage.',
      pendingApproval: 'Escalate to building superintendent emergency line or dispatch volunteer space heater.'
    },
    sampleDecisionPrompt: 'Decision needed. Mrs. Gable radiator is cold during freeze advisory. Option 1: Dispatch on-call volunteer with emergency electric heater. Option 2: Page building superintendent. Which do you choose?'
  }
];

export const StrandsAgentStudio: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<AgentTrack>('everyday');
  const [selectedAgent, setSelectedAgent] = useState<StrandsAgentConfig>(STRANDS_AGENTS[0]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<AgentExecutionLog[]>([]);
  const [activeTab, setActiveTab] = useState<'orchestration' | 'agentcore-deploy' | 'vbcall-matrix' | 'python-sdk'>('orchestration');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [customPromptInput, setCustomPromptInput] = useState<string>('');
  const [isDeployingAgentCore, setIsDeployingAgentCore] = useState<boolean>(false);
  const [agentCoreDeploySuccess, setAgentCoreDeploySuccess] = useState<boolean>(false);
  const [activeVoiceCallModal, setActiveVoiceCallModal] = useState<AgentExecutionLog | null>(null);

  // Initialize with sample execution history
  useEffect(() => {
    const initialLogs: AgentExecutionLog[] = [
      {
        id: 'log-101',
        timestamp: '10:42:15',
        agentId: 'everyday-home-steward',
        status: 'silent_success',
        action: 'Pantry Replenishment Evaluation',
        reasoning: 'Olive oil and organic oats fell below 20% threshold. Evaluated price across 3 stores. Total $18.40 (< $30 limit). Auto-purchased silently.',
        metrics: { latencyMs: 312, tokens: 420, confidence: 99.4, savedMinutes: 25 }
      },
      {
        id: 'log-102',
        timestamp: '10:44:02',
        agentId: 'pro-clinical-triage',
        status: 'silent_success',
        action: 'EHR Differential Deconstruction',
        reasoning: 'Processed 38-page laboratory report. Flagged elevated hs-CRP (3.8 mg/L) and paired with ApoB trend. Generated 3 ICD-10 billable pre-codes.',
        metrics: { latencyMs: 540, tokens: 1280, confidence: 98.7, savedMinutes: 45 }
      },
      {
        id: 'log-103',
        timestamp: '10:45:50',
        agentId: 'neighbor-food-relay',
        status: 'autonomous_action',
        action: 'Cold-Chain Redistribution Dispatch',
        reasoning: 'Received 180 lbs bakery surplus. Matched volunteer driver Elena (3 mins away). Dispatched with refrigerated turn-by-turn route to Community Mission.',
        metrics: { latencyMs: 280, tokens: 360, confidence: 99.1, savedMinutes: 60 }
      },
      {
        id: 'log-104',
        timestamp: '10:48:12',
        agentId: selectedAgent.id,
        status: 'escalated_decision',
        action: 'High-Stakes Decision Escalation (vb_call)',
        reasoning: 'Autonomous execution paused per AGENTS.md policy: Action exceeds autonomous budget threshold or involves high-stakes outcome.',
        decisionRequired: {
          prompt: selectedAgent.sampleDecisionPrompt,
          choices: ['Option 1: Execute Recommended Action', 'Option 2: Alternative Conservative Action'],
          stakes: 'Affects budget and operational timeline directly.',
          resolved: false
        },
        metrics: { latencyMs: 410, tokens: 680, confidence: 94.2, savedMinutes: 30 }
      }
    ];
    setExecutionLogs(initialLogs);
  }, [selectedAgent]);

  // Track filter
  const filteredAgents = STRANDS_AGENTS.filter(a => a.track === activeTrack);

  // Trigger Execution
  const handleExecuteAgent = async () => {
    setIsExecuting(true);

    try {
      // Simulate Strands Agents SDK & AgentCore execution pipeline
      const response = await fetch('/api/strands/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          track: selectedAgent.track,
          customPrompt: customPromptInput || undefined,
          payload: selectedAgent.defaultPayload
        })
      });

      const data = await response.json();
      
      const newLog: AgentExecutionLog = {
        id: `log-${Date.now().toString(36)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agentId: selectedAgent.id,
        status: data.escalated ? 'escalated_decision' : 'silent_success',
        action: data.action || `Executed ${selectedAgent.name} Routine`,
        reasoning: data.reasoning || `Strands Agents SDK processed input stream. ${selectedAgent.quietModeThreshold}% quiet confidence score verified.`,
        decisionRequired: data.decisionRequired || (data.escalated ? {
          prompt: selectedAgent.sampleDecisionPrompt,
          choices: ['Option 1: Proceed with primary recommendation', 'Option 2: Halt and defer to manual review'],
          stakes: 'Decides resource allocation and external communication.',
          resolved: false
        } : undefined),
        metrics: data.metrics || {
          latencyMs: Math.floor(Math.random() * 300) + 180,
          tokens: Math.floor(Math.random() * 800) + 400,
          confidence: Number((96.0 + Math.random() * 3.8).toFixed(1)),
          savedMinutes: Math.floor(Math.random() * 40) + 20
        }
      };

      setExecutionLogs(prev => [newLog, ...prev]);

      if (newLog.status === 'escalated_decision') {
        setActiveVoiceCallModal(newLog);
      }
    } catch (e) {
      // Fallback local simulation if offline
      const isEscalation = Math.random() > 0.4;
      const fallbackLog: AgentExecutionLog = {
        id: `log-${Date.now().toString(36)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agentId: selectedAgent.id,
        status: isEscalation ? 'escalated_decision' : 'silent_success',
        action: isEscalation ? 'vb_call Policy Escalation' : 'Autonomous Background Pass',
        reasoning: isEscalation 
          ? 'Quiet mode halted: Decision threshold reached. Requesting human authorization per vb_call policy.' 
          : `Handled task with zero cognitive noise. ${selectedAgent.toolsEnabled.join(', ')} executed smoothly.`,
        decisionRequired: isEscalation ? {
          prompt: selectedAgent.sampleDecisionPrompt,
          choices: ['Option 1: Authorize Action', 'Option 2: Reject & Keep in Draft'],
          stakes: 'Permanent execution on production rails.',
          resolved: false
        } : undefined,
        metrics: {
          latencyMs: 245,
          tokens: 580,
          confidence: 98.2,
          savedMinutes: 35
        }
      };
      setExecutionLogs(prev => [fallbackLog, ...prev]);
      if (isEscalation) {
        setActiveVoiceCallModal(fallbackLog);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  // Resolve Decision
  const handleResolveDecision = (logId: string, choice: string) => {
    setExecutionLogs(prev => prev.map(log => {
      if (log.id === logId && log.decisionRequired) {
        return {
          ...log,
          decisionRequired: {
            ...log.decisionRequired,
            selectedChoice: choice,
            resolved: true
          },
          status: 'autonomous_action'
        };
      }
      return log;
    }));
    setActiveVoiceCallModal(null);
  };

  // Deploy with AgentCore
  const handleDeployAgentCore = () => {
    setIsDeployingAgentCore(true);
    setTimeout(() => {
      setIsDeployingAgentCore(false);
      setAgentCoreDeploySuccess(true);
      setTimeout(() => setAgentCoreDeploySuccess(false), 5000);
    }, 1800);
  };

  // Python Strands Agents SDK Snippet
  const pythonSdkCode = `"""
Dr. T Autonomous Platform powered by Strands Agents SDK & AgentCore
Production-ready Multi-Agent Mesh with Zero-Noise Background Routing & vb_call Escalation
"""

from strands import Agent, AgentCoreRuntime, Tool, EventStream
from strands.memory import MemoryBank
from strands.policies import HumanInTheLoopPolicy

# 1. Initialize Strands Agent with AgentCore State & Memory Bank
agent = Agent(
    name="${selectedAgent.name}",
    track="${selectedAgent.track}",
    model="gemini-2.5-pro",
    quiet_threshold=${selectedAgent.quietModeThreshold / 100},
    memory=MemoryBank(namespace="drt-${selectedAgent.id}", ttl_days=90),
    tools=[
        ${selectedAgent.toolsEnabled.map(t => `Tool(name="${t}")`).join(',\n        ')}
    ]
)

# 2. Configure vb_call Human Escalation Guardrails (Under 60 words, Eyes-Free)
@agent.policy(HumanInTheLoopPolicy)
def evaluate_decision_barrier(context):
    if context.action_cost > 50.0 or context.is_irreversible:
        return context.escalate_vb_call(
            decision_lead="Decision needed.",
            situation=context.summary,
            choices=["Option 1: Proceed with autonomous dispatch", "Option 2: Halt action"],
            stakes="Direct impact on operational budget."
        )
    return context.execute_silently()

# 3. Deploy onto AgentCore Container Mesh
runtime = AgentCoreRuntime.deploy(
    agent=agent,
    concurrency=128,
    zero_trust_gateway=True,
    event_bus="aws.eventbridge.drt"
)

if __name__ == "__main__":
    print(f"Strands Agent '{agent.name}' is live on AgentCore runtime.")
    runtime.listen_and_serve()
`;

  return (
    <div className="space-y-6 text-stone-100 font-sans select-none pb-16" id="strands-agent-studio-root">
      
      {/* Top Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-stone-800 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Strands Agents SDK
              </span>
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" /> AgentCore Production Architecture
              </span>
              <span className="px-2.5 py-1 bg-stone-800 text-stone-300 rounded-full text-[11px] font-mono">
                AWS Production-Grade Open Source
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Dr. T Multi-Track Autonomous Agent Studio
            </h1>
            <p className="text-sm text-stone-300 max-w-3xl leading-relaxed">
              Build, run, and scale production-ready autonomous agents built with the <strong className="text-white">Strands Agents SDK</strong> and deployed via <strong className="text-white">AgentCore</strong>. Agents run silently in the background and only escalate with voice-grade <strong className="text-amber-300">vb_call</strong> decisions when human judgment is strictly required.
            </p>
          </div>

          {/* Quick Stats Capsule */}
          <div className="flex items-center gap-3 bg-stone-900/90 border border-stone-800 p-3.5 rounded-2xl shrink-0">
            <div className="text-center px-3 border-r border-stone-800">
              <div className="text-xs text-stone-400 font-mono">Quiet Ratio</div>
              <div className="text-lg font-black text-emerald-400">95.4%</div>
            </div>
            <div className="text-center px-3 border-r border-stone-800">
              <div className="text-xs text-stone-400 font-mono">vb_call Speed</div>
              <div className="text-lg font-black text-amber-400">&lt; 30s</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xs text-stone-400 font-mono">Architecture</div>
              <div className="text-lg font-black text-cyan-400">AgentCore</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-stone-800/80">
          <button
            onClick={() => setActiveTab('orchestration')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orchestration'
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Agent Orchestrator & Live Testbed</span>
          </button>

          <button
            onClick={() => setActiveTab('vbcall-matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'vbcall-matrix'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md font-black'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-amber-300" />
            <span>vb_call Human-in-the-Loop Protocol</span>
          </button>

          <button
            onClick={() => setActiveTab('agentcore-deploy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'agentcore-deploy'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md font-black'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Server className="w-4 h-4 text-cyan-300" />
            <span>AgentCore Deployment Mesh</span>
          </button>

          <button
            onClick={() => setActiveTab('python-sdk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'python-sdk'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md font-black'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-300" />
            <span>Strands SDK Code Sample</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: AGENT ORCHESTRATION & THREE TRACKS --- */}
      {activeTab === 'orchestration' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Three Tracks Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* TRACK 1: EVERYDAY AGENTS */}
            <div
              onClick={() => {
                setActiveTrack('everyday');
                setSelectedAgent(STRANDS_AGENTS.find(a => a.track === 'everyday') || STRANDS_AGENTS[0]);
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                activeTrack === 'everyday'
                  ? 'bg-gradient-to-br from-emerald-950/70 via-stone-900 to-stone-950 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                  : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-2xl text-xl">
                  🏡
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Track 1
                </span>
              </div>
              <h3 className="text-base font-black text-white">Everyday Agents</h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Takes the busywork out of daily life, home, money, health, errands, and family. Runs quietly in the background and only pings when there's a real decision to make.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> 95%+ Autonomous Quiet Mode
              </div>
            </div>

            {/* TRACK 2: PROFESSIONAL AGENTS */}
            <div
              onClick={() => {
                setActiveTrack('professional');
                setSelectedAgent(STRANDS_AGENTS.find(a => a.track === 'professional') || STRANDS_AGENTS[2]);
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                activeTrack === 'professional'
                  ? 'bg-gradient-to-br from-indigo-950/70 via-stone-900 to-stone-950 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                  : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="p-2.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-2xl text-xl">
                  💼
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Track 2
                </span>
              </div>
              <h3 className="text-base font-black text-white">Professional Agents</h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Makes someone dramatically better at their work (doctors, lawyers, creators, SMB owners). Targets repetitive, judgment-heavy tasks that eat their day.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-indigo-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> High-Judgment Clinical & Deal AI
              </div>
            </div>

            {/* TRACK 3: GOOD NEIGHBOR AGENTS */}
            <div
              onClick={() => {
                setActiveTrack('good-neighbor');
                setSelectedAgent(STRANDS_AGENTS.find(a => a.track === 'good-neighbor') || STRANDS_AGENTS[4]);
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                activeTrack === 'good-neighbor'
                  ? 'bg-gradient-to-br from-rose-950/70 via-stone-900 to-stone-950 border-rose-500 shadow-xl shadow-rose-500/10 ring-2 ring-rose-500/30'
                  : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="p-2.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-2xl text-xl">
                  🤝
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Track 3
                </span>
              </div>
              <h3 className="text-base font-black text-white">Good Neighbor Agents</h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Helps groups of people, not just one (neighborhoods, nonprofits, food banks, schools, libraries, small local orgs).
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-rose-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Community Mutual Aid Mesh
              </div>
            </div>

          </div>

          {/* Interactive Agent Sandbox & Execution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Agent Selection & Configuration Deck */}
            <div className="p-6 bg-stone-900 border border-stone-800 rounded-3xl space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Sliders className="w-4 h-4 text-amber-400" /> Active Agent Pipeline
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${selectedAgent.colorScheme.badge}`}>
                  {selectedAgent.track.toUpperCase()}
                </span>
              </div>

              {/* Agent Selector in Current Track */}
              <div className="space-y-2">
                <label className="text-xs text-stone-400 block font-bold">Select Strands Agent Blueprint:</label>
                <div className="space-y-2">
                  {filteredAgents.map(a => (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAgent(a)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        selectedAgent.id === a.id
                          ? `${a.colorScheme.border} bg-stone-950 ring-1 ring-amber-400/40`
                          : 'border-stone-800 bg-stone-950/40 hover:bg-stone-800/60'
                      }`}
                    >
                      <span className="text-2xl">{a.icon}</span>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate">{a.name}</div>
                        <div className="text-[11px] text-stone-400 truncate">{a.tagline}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Capability Matrix */}
              <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-stone-300">Enabled Strands SDK Tools:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.toolsEnabled.map(tool => (
                    <span key={tool} className="px-2.5 py-1 bg-stone-900 border border-stone-700 rounded-lg text-[11px] font-mono text-cyan-300">
                      ⚡ {tool}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-800/80 text-xs text-stone-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Quiet Run Threshold:</span>
                    <strong className="text-emerald-400 font-mono">{selectedAgent.quietModeThreshold}% Silent</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Escalation Rule:</span>
                    <strong className="text-amber-300 font-mono">vb_call Strict</strong>
                  </div>
                </div>
              </div>

              {/* Action Trigger Button */}
              <button
                onClick={handleExecuteAgent}
                disabled={isExecuting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:brightness-110 text-stone-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Strands SDK Agent Reasoning...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-stone-950" />
                    <span>Run {selectedAgent.name} Routine</span>
                  </>
                )}
              </button>

            </div>

            {/* Middle & Right 2 Cols: Live Execution Telemetry & Decision Console */}
            <div className="lg:col-span-2 p-6 bg-stone-900 border border-stone-800 rounded-3xl space-y-5 shadow-xl flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      AgentCore Live Runtime Logs & Telemetry
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-mono text-[10px]">
                    ● Subspace Event Mesh Active
                  </span>
                </div>

                {/* Selected Agent Quick Overview Card */}
                <div className={`p-4 rounded-2xl border bg-gradient-to-br ${selectedAgent.colorScheme.bg} ${selectedAgent.colorScheme.border} space-y-2`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedAgent.icon}</span>
                    <span className="text-sm font-bold text-white">{selectedAgent.name}</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {selectedAgent.description}
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-stone-400">
                    <strong className="text-amber-300">Escalation Trigger:</strong> {selectedAgent.decisionEscalationTrigger}
                  </div>
                </div>

                {/* Execution Stream Logs */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {executionLogs.map(log => (
                    <div
                      key={log.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        log.status === 'escalated_decision'
                          ? 'bg-amber-950/30 border-amber-500/60 shadow-lg ring-1 ring-amber-400/30'
                          : log.status === 'autonomous_action'
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-stone-950/60 border-stone-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {log.status === 'escalated_decision' ? (
                            <span className="px-2 py-0.5 bg-amber-500 text-stone-950 font-black rounded-md text-[10px] flex items-center gap-1 font-mono">
                              <PhoneCall className="w-3 h-3" /> vb_call ESCALATION
                            </span>
                          ) : log.status === 'autonomous_action' ? (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-md text-[10px] font-bold font-mono">
                              AUTONOMOUS ACTION
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-md text-[10px] font-bold font-mono">
                              SILENT PASS
                            </span>
                          )}
                          <span className="text-xs font-bold text-white">{log.action}</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400">{log.timestamp}</span>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed font-sans">
                        {log.reasoning}
                      </p>

                      {/* Interactive Human Decision Block if escalated */}
                      {log.decisionRequired && (
                        <div className="mt-3 p-3.5 bg-stone-900/90 border border-amber-500/40 rounded-xl space-y-2.5">
                          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Eyes-Free Human Decision Required:</span>
                          </div>
                          <div className="text-xs text-stone-200 font-medium italic">
                            "{log.decisionRequired.prompt}"
                          </div>

                          {!log.decisionRequired.resolved ? (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {log.decisionRequired.choices.map((choice, i) => (
                                <button
                                  key={choice}
                                  onClick={() => handleResolveDecision(log.id, choice)}
                                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                                >
                                  {choice}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 pt-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approved & Executed: {log.decisionRequired.selectedChoice}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Telemetry Capsule */}
                      <div className="mt-2.5 pt-2 border-t border-stone-800/60 flex items-center justify-between text-[10px] font-mono text-stone-400">
                        <span>Latency: <strong className="text-stone-200">{log.metrics.latencyMs}ms</strong></span>
                        <span>Confidence: <strong className="text-emerald-400">{log.metrics.confidence}%</strong></span>
                        <span>Time Saved: <strong className="text-amber-300">+{log.metrics.savedMinutes}m</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Custom Prompt & Simulation Input */}
              <div className="pt-3 border-t border-stone-800 flex items-center gap-2">
                <input
                  type="text"
                  value={customPromptInput}
                  onChange={(e) => setCustomPromptInput(e.target.value)}
                  placeholder="Inject custom telemetry event or chore (e.g., 'Dishwasher salt low' or 'Contract liability clause')..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  onClick={handleExecuteAgent}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Send</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* --- TAB 2: VB_CALL HUMAN-IN-THE-LOOP PROTOCOL --- */}
      {activeTab === 'vbcall-matrix' && (
        <div className="p-6 md:p-8 bg-stone-900 border border-stone-800 rounded-3xl space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                <PhoneCall className="w-3.5 h-3.5" /> vb_call Escalation Policy
              </div>
              <h2 className="text-xl font-black text-white">Eyes-Free & Hands-Free Decision Escalation Standard</h2>
              <p className="text-xs text-stone-400 mt-1 max-w-2xl">
                A <strong className="text-white">vb_call</strong> exists for one purpose: Obtain a human decision required to continue execution. If a decision is not required, do not call.
              </p>
            </div>
            <div className="px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-mono text-stone-300">
              Max: <strong className="text-amber-400">60 Words</strong> • <strong className="text-amber-400">30s</strong> • <strong className="text-amber-400">1 Decision</strong>
            </div>
          </div>

          {/* 4 Pillars of a Valid vb_call */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-2">
              <div className="text-amber-400 font-mono text-xs font-bold">01. The Decision</div>
              <div className="text-xs text-stone-300 font-medium">
                Front-loaded in the first 10 words, stating exactly what requires authorization.
              </div>
            </div>

            <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-2">
              <div className="text-cyan-400 font-mono text-xs font-bold">02. The Situation</div>
              <div className="text-xs text-stone-300 font-medium">
                A concise, non-technical context of the current state, free of history or fluff.
              </div>
            </div>

            <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-2">
              <div className="text-indigo-400 font-mono text-xs font-bold">03. The Choices</div>
              <div className="text-xs text-stone-300 font-medium">
                Clear, numbered options (Option 1 vs Option 2) distinguishable via speech.
              </div>
            </div>

            <div className="p-4 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-2">
              <div className="text-rose-400 font-mono text-xs font-bold">04. The Stakes</div>
              <div className="text-xs text-stone-300 font-medium">
                Direct positive or negative consequences of choosing each option or doing nothing.
              </div>
            </div>
          </div>

          {/* Gold Standard Examples Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-3">
              <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5 uppercase font-mono">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> BAD Escalation (Noise & Fluff)
              </div>
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "Hello! Just checking in to give you an update. The report in /data/v2/draft.pdf has been generated with our deep neural models and we have verified step id 491. Do you think we should maybe publish it or wait?"
              </p>
              <div className="text-[11px] text-rose-400 font-mono">❌ Breaks 60-word limit, mentions URLs/paths, no clear choices.</div>
            </div>

            <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-3">
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> GOLD Standard vb_call (Eyes-Free)
              </div>
              <p className="text-xs text-white font-medium italic leading-relaxed">
                "Decision needed. The report is ready. You can publish now or keep it in draft. Publishing now meets today's deadline. Keeping it in draft delays release until tomorrow. Which do you choose?"
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">✅ 34 words • Instant voice comprehension • Explicit stakes.</div>
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 3: AGENTCORE DEPLOYMENT MESH --- */}
      {activeTab === 'agentcore-deploy' && (
        <div className="p-6 md:p-8 bg-stone-900 border border-stone-800 rounded-3xl space-y-6 shadow-2xl animate-fadeIn">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
                <Server className="w-3.5 h-3.5" /> AgentCore Architecture
              </div>
              <h2 className="text-xl font-black text-white">Deploying with AgentCore on AWS & Cloud Containers</h2>
              <p className="text-xs text-stone-400 mt-1 max-w-2xl">
                Deploying with AgentCore provides zero-trust identity, persistent state isolation, sub-millisecond event routing, and deterministic guardrails for production agent fleets.
              </p>
            </div>

            <button
              onClick={handleDeployAgentCore}
              disabled={isDeployingAgentCore}
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isDeployingAgentCore ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Provisioning AgentCore Mesh...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Deploy Fleets to AgentCore</span>
                </>
              )}
            </button>
          </div>

          {/* Success Banner */}
          {agentCoreDeploySuccess && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex items-center gap-3 text-xs text-emerald-200 animate-fadeIn">
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-white block font-bold">AgentCore Fleet Provisioned!</strong>
                All 6 Strands Agents registered across Everyday, Professional, and Good Neighbor clusters with active EventBridge triggers.
              </div>
            </div>
          )}

          {/* 4 Architectural Subsystems of AgentCore */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                <Database className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">AgentCore Memory Bank</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Persistent cross-session state keeping user preferences, past approval records, and household/patient graphs without data leaks.
              </p>
            </div>

            <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Zero-Trust Agent Gateway</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Hardware-isolated IAM tokens ensuring agents never hold static API keys and only execute authenticated scoped tool transactions.
              </p>
            </div>

            <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Model Armor Guardrails</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Real-time prompt injection filtering, PII redaction, tool poisoning prevention, and deterministic budget kill-switches.
              </p>
            </div>

            <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Runtime Observability</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Step-by-step reasoning traces, latency budgets, token consumption metrics, and Hedera on-chain consensus timestamps.
              </p>
            </div>

          </div>

          {/* Infrastructure Topology Card */}
          <div className="p-5 bg-stone-950 border border-stone-800 rounded-2xl space-y-3 font-mono text-xs">
            <div className="text-stone-400 flex items-center justify-between border-b border-stone-800 pb-2">
              <span>AgentCore Container Deployment Spec</span>
              <span className="text-cyan-400">AWS Fargate / Cloud Run</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-stone-500 block">Autoscale:</span>
                <span className="text-white">1 to 64 Replicas</span>
              </div>
              <div>
                <span className="text-stone-500 block">Cold Start:</span>
                <span className="text-emerald-400">&lt; 140ms</span>
              </div>
              <div>
                <span className="text-stone-500 block">Event Mesh:</span>
                <span className="text-amber-300">AWS EventBridge</span>
              </div>
              <div>
                <span className="text-stone-500 block">Security:</span>
                <span className="text-cyan-300">mTLS + VPC Peering</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 4: STRANDS PYTHON SDK CODE --- */}
      {activeTab === 'python-sdk' && (
        <div className="p-6 md:p-8 bg-stone-900 border border-stone-800 rounded-3xl space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase font-mono">
                Strands Agents SDK • Open Source Implementation
              </h3>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(pythonSdkCode);
                setCopiedSnippet(true);
                setTimeout(() => setCopiedSnippet(false), 2000);
              }}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? 'Copied to Clipboard' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 bg-stone-950 rounded-2xl border border-stone-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
            {pythonSdkCode}
          </pre>
        </div>
      )}

      {/* Interactive vb_call Hands-Free Voice Escalation Modal */}
      {activeVoiceCallModal && activeVoiceCallModal.decisionRequired && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" id="vbcall-escalation-modal">
          <div className="max-w-lg w-full bg-stone-900 border-2 border-amber-500 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl shadow-amber-500/20 relative">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500 text-stone-950">
                  <PhoneCall className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-white">Incoming vb_call Escalation</h3>
                  <p className="text-[11px] font-mono text-amber-300">Eyes-Free Decision Required (&lt; 60 words)</p>
                </div>
              </div>
              <button
                onClick={() => setActiveVoiceCallModal(null)}
                className="text-stone-400 hover:text-white text-xs px-2.5 py-1 bg-stone-800 rounded-lg cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            <div className="p-4 bg-stone-950/90 border border-amber-500/40 rounded-2xl space-y-2">
              <div className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" /> Voice Synthesis Prompt
              </div>
              <p className="text-sm font-bold text-white leading-relaxed">
                "{activeVoiceCallModal.decisionRequired.prompt}"
              </p>
              {activeVoiceCallModal.decisionRequired.stakes && (
                <div className="text-xs text-stone-400 pt-1 border-t border-stone-800">
                  <strong className="text-amber-300">Stakes:</strong> {activeVoiceCallModal.decisionRequired.stakes}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs text-stone-300 font-bold block">Select Your Spoken Decision:</label>
              <div className="grid grid-cols-1 gap-2.5">
                {activeVoiceCallModal.decisionRequired.choices.map((choice, i) => (
                  <button
                    key={choice}
                    onClick={() => handleResolveDecision(activeVoiceCallModal.id, choice)}
                    className="p-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer shadow-md"
                  >
                    <span>{choice}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-1 border-t border-stone-800">
              <span>Policy: <strong className="text-emerald-400">AGENTS.md Compliant</strong></span>
              <span>Audio Channel: <strong className="text-cyan-400">Connected</strong></span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
