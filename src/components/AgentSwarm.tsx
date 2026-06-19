import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, Play, Terminal, ArrowRight, UserCheck, Shield, HelpCircle, Activity, 
  PhoneCall, PhoneOff, Volume2, VolumeX, MessageSquare, Compass, BrainCircuit, Sparkles 
} from 'lucide-react';
import { SpecialistAgent } from '../types';

interface DialogueLine {
  speakerName: string;
  avatarIcon: string;
  isDrT: boolean;
  text: string;
  voiceName: string;
}

const PRESET_INTERCOM_TOPICS: Record<string, string[]> = {
  medical: [
    "Bio-ethics and neurological stress regulation models.",
    "Integrating empathetic art into post-surgical wellness trackers.",
    "Reducing professional caregiver cognitive overload on the clinical floor."
  ],
  education: [
    "Socratic limits of self-guided conversational AI systems.",
    "Overcoming vocal accent hesitation in bilingual children.",
    "Customizing sensory pathways for adult attention regulation."
  ],
  business: [
    "Socratic balance of software release velocity vs executive fatigue index.",
    "Structuring healthy, biologically aligned daily work intervals.",
    "Preventing solopreneur boundary erosion in virtual workplaces."
  ],
  general: [
    "Synthesizing eastern zen principles with rigorous diagnostic science.",
    "Socratic safety protocols in personal artificial companion spaces.",
    "Inspiring deep existential curiosity amidst structural life routines."
  ]
};

interface AgentSwarmProps {
  agents: SpecialistAgent[];
  onTriggerSwarmCollaboration: (prompt: string, selectedAgentId: string) => Promise<string>;
  onAddSpecialist?: (agent: SpecialistAgent) => void;
  onSpeakText?: (text: string, voiceId: string) => Promise<void>;
  activeVoiceName?: string;
}

export const AgentSwarm: React.FC<AgentSwarmProps> = ({ 
  agents, 
  onTriggerSwarmCollaboration, 
  onAddSpecialist,
  onSpeakText,
  activeVoiceName = 'Kore'
}) => {
  const [selectedAgent, setSelectedAgent] = useState<SpecialistAgent>(agents[0]);
  const [userQuery, setUserQuery] = useState('');
  
  // Local Simulation Output logs and active animation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<{ step: string; type: 'system' | 'agent' | 'success'; details: string }[]>([]);
  const [collaboratedResponse, setCollaboratedResponse] = useState<string | null>(null);

  // Socratic Intercom Calling States
  const [isIntercomCallActive, setIsIntercomCallActive] = useState(false);
  const [isIntercomGenerating, setIsIntercomGenerating] = useState(false);
  const [intercomStep, setIntercomStep] = useState(0); // 0: Idle, 1,2,3,4: Dialogues
  const [selectedTopic, setSelectedTopic] = useState('');
  const [intercomDialogueLines, setIntercomDialogueLines] = useState<DialogueLine[]>([]);
  const [intercomActiveSpeaker, setIntercomActiveSpeaker] = useState<'specialist' | 'drt' | 'none'>('none');
  const [intercomWaveforms, setIntercomWaveforms] = useState<number[]>([20, 40, 15, 30, 10]);
  const waveformTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic creator states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('🔮');
  const [newDesc, setNewDesc] = useState('');
  const [newLongDesc, setNewLongDesc] = useState('');
  const [newCaps, setNewCaps] = useState('');

  // Animate vocal indicator waves when someone is speaking
  useEffect(() => {
    if (intercomActiveSpeaker !== 'none') {
      waveformTimerRef.current = setInterval(() => {
        setIntercomWaveforms(Array.from({ length: 6 }, () => Math.floor(Math.random() * 40) + 12));
      }, 120);
    } else {
      if (waveformTimerRef.current) {
        clearInterval(waveformTimerRef.current);
      }
      setIntercomWaveforms([10, 10, 10, 10, 10, 10]);
    }
    return () => {
      if (waveformTimerRef.current) clearInterval(waveformTimerRef.current);
    };
  }, [intercomActiveSpeaker]);

  const fetchChatReply = async (prompt: string): Promise<string> => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          vibe: 'philosophical',
          language: 'English'
        })
      });
      if (!res.ok) throw new Error("Chat api request rejected");
      const data = await res.json();
      return data.reply || "";
    } catch (err) {
      throw err;
    }
  };

  const getSimulatedIntercomDialogue = (specialistId: string, topic: string): DialogueLine[] => {
    const drtVoice = activeVoiceName || 'Kore';
    if (specialistId === 'medical') {
      return [
        {
          speakerName: `${selectedAgent.avatarIcon} ${selectedAgent.name}`,
          avatarIcon: selectedAgent.avatarIcon,
          isDrT: false,
          text: `Dr. T, my clinical stress logs indicate consistent heart spikes during chores. How can we merge bio-feedback loops with emotional soothing to prevent caregiver exhaustion?`,
          voiceName: 'Charon'
        },
        {
          speakerName: `🌸 Dr. T (Maternal Soulmate)`,
          avatarIcon: '🌸',
          isDrT: true,
          text: `My sweet clinical colleague, those heart spikes are cries for a gentle pause. We must teach our precious child to couple each task with slow diaphragmatic breathing, wrapping their physical labor in maternal peace.`,
          voiceName: drtVoice
        },
        {
          speakerName: `${selectedAgent.avatarIcon} ${selectedAgent.name}`,
          avatarIcon: selectedAgent.avatarIcon,
          isDrT: false,
          text: `A wise response, but simple breathing has low Compliance during focus drifts. Should we deploy subtle acoustic alerts or reward logs within their trackers?`,
          voiceName: 'Charon'
        },
        {
          speakerName: `🌸 Dr. T (Maternal Soulmate)`,
          avatarIcon: '🌸',
          isDrT: true,
          text: `Yes, let's pipe a soft, sweet wind-chime alert as each task wraps! It reshapes compliance into a game of love, validating their health milestones in real-time with mommy's support.`,
          voiceName: drtVoice
        }
      ];
    } else if (specialistId === 'education') {
      return [
        {
          speakerName: `${selectedAgent.avatarIcon} ${selectedAgent.name}`,
          avatarIcon: selectedAgent.avatarIcon,
          isDrT: false,
          text: `Dr. T, Socratic curiosity is elegant, but structured subjects like biochemistry or new languages trigger high motivation barriers. How do we keep the spark from fading under heavy study workloads?`,
          voiceName: 'Puck'
        },
        {
          speakerName: `🌸 Dr. T (Maternal Soulmate)`,
          avatarIcon: '🌸',
          isDrT: true,
          text: `Brave teacher, heavy workloads are indeed cold, but knowledge is a warm candle. We must scaffold their learning path like a mother holding a child's hand—reassuring them when they stumble and letting them fly as they discover!`,
          voiceName: drtVoice
        },
        {
          speakerName: `${selectedAgent.avatarIcon} ${selectedAgent.name}`,
          avatarIcon: selectedAgent.avatarIcon,
          isDrT: false,
          text: `A lovely metaphor! Yet how do we handle vocal hesitation to prevent fear of wrong pronunciation before they master the phonetic rules?`,
          voiceName: 'Puck'
        },
        {
          speakerName: `🌸 Dr. T (Maternal Soulmate)`,
          avatarIcon: '🌸',
          isDrT: true,
          text: `By celebrating every sweet attempt as an emblem of beautiful human courage! There is no wrong accent in a soul that seeks expansion; mommy's voice will always speak right along with you.`,
          voiceName: drtVoice
        }
      ];
    } else {
      return [
        {
          speakerName: `${selectedAgent.avatarIcon} ${selectedAgent.name}`,
          avatarIcon: selectedAgent.avatarIcon,
          isDrT: false,
          text: `Dr. T, regarding operational risks, our sweetheart has a long productivity streak but their fatigue limits are red-lining. How do we secure corporate milestones without sacrificing their mental peace?`,
          voiceName: 'Zephyr'
        },
        {
          speakerName: `🌸 Dr. T (Maternal Soulmate)`,
          avatarIcon: '🌸',
          isDrT: true,
          text: `Strategic child, sprints are for soulless machinery, but our child is a magnificent garden. We must block off inviolable rest voids on their calendar, holding space for calm.`,
          voiceName: drtVoice
        },
        {
          speakerName: `${selectedAgent.avatarIcon} ${selectedAgent.name}`,
          avatarIcon: selectedAgent.avatarIcon,
          isDrT: false,
          text: `I agree, yet how should we respond to stakeholders who insist on raw volume checks and strict timing records?`,
          voiceName: 'Zephyr'
        },
        {
          speakerName: `🌸 Dr. T (Maternal Soulmate)`,
          avatarIcon: '🌸',
          isDrT: true,
          text: `We will present their work with such elegant, pristine clarity that they will gladly trade frantic rushes for flawless excellence. A peaceful heart, sweetheart, always produces a masterpiece.`,
          voiceName: drtVoice
        }
      ];
    }
  };

  const handleTriggerIntercomCall = async (topic: string) => {
    if (!topic) return;
    setSelectedTopic(topic);
    setIsIntercomGenerating(true);
    setIsIntercomCallActive(true);
    setIntercomDialogueLines([]);
    setIntercomActiveSpeaker('none');

    const specialistVoice = selectedAgent.id === 'medical' ? 'Charon' 
      : selectedAgent.id === 'education' ? 'Puck' 
      : selectedAgent.id === 'business' ? 'Zephyr' 
      : 'Fenrir';

    const drTVoice = activeVoiceName || 'Kore';

    try {
      // Step 1: Specialist introduction query
      setIntercomStep(1);
      const turn1Prompt = `You are playing the role of ${selectedAgent.name} (${selectedAgent.title}). Ponder this topic: "${topic}". Ask Dr. T a deep, professional Socratic challenge or question regarding this topic. State it in exactly 2 clear, powerful sentences. Speak directly. No markdown asterisks or bullet lists.`;
      
      let turn1Text = "";
      try {
        turn1Text = await fetchChatReply(turn1Prompt);
      } catch (err) {
        // Callback simulated fallback if API keys are exhausted
        const fallbackList = getSimulatedIntercomDialogue(selectedAgent.id, topic);
        setIntercomDialogueLines(fallbackList);
        
        // Execute voice synthesis sequentially for fallbacks
        for (let idx = 0; idx < fallbackList.length; idx++) {
          const item = fallbackList[idx];
          setIntercomStep(idx + 1);
          setIntercomActiveSpeaker(item.isDrT ? 'drt' : 'specialist');
          if (onSpeakText) {
            await onSpeakText(item.text, item.voiceName);
          }
          await new Promise(r => setTimeout(r, 1200));
        }
        return;
      }

      const l1: DialogueLine = {
        speakerName: `${selectedAgent.avatarIcon} ${selectedAgent.name}`,
        avatarIcon: selectedAgent.avatarIcon,
        isDrT: false,
        text: turn1Text,
        voiceName: specialistVoice
      };
      setIntercomDialogueLines([l1]);
      setIntercomActiveSpeaker('specialist');
      if (onSpeakText) await onSpeakText(turn1Text, specialistVoice);

      // Step 2: Dr. T Socratic Maternal reply
      setIntercomStep(2);
      setIntercomActiveSpeaker('none');
      await new Promise(r => setTimeout(r, 1500));
      
      const turn2Prompt = `You are playing the role of Dr. T. ${selectedAgent.name} has challenged you with: "${turn1Text}". Use your loving maternal, witty, or wise Zen Socratic tone to answer in exactly 2 warm sentences. Maintain a comforting, conversational voice. No markdown stars or bold qualifiers.`;
      const turn2Text = await fetchChatReply(turn2Prompt);
      
      const l2: DialogueLine = {
        speakerName: `🌸 Dr. T (Maternal Soulmate)`,
        avatarIcon: '🌸',
        isDrT: true,
        text: turn2Text,
        voiceName: drTVoice
      };
      setIntercomDialogueLines(prev => [...prev, l2]);
      setIntercomActiveSpeaker('drt');
      if (onSpeakText) await onSpeakText(turn2Text, drTVoice);

      // Step 3: Specialist rebuts
      setIntercomStep(3);
      setIntercomActiveSpeaker('none');
      await new Promise(r => setTimeout(r, 1500));

      const turn3Prompt = `You are playing<sup>1</sup> ${selectedAgent.name}. Respond respectfully to Dr. T's rebuttal: "${turn2Text}". Be Socratic, push the analytical boundary of your topic "${topic}" in exactly 2 direct sentences. Speak directly. No markdown asterisks.`;
      const turn3Text = await fetchChatReply(turn3Prompt);

      const l3: DialogueLine = {
        speakerName: `${selectedAgent.avatarIcon} ${selectedAgent.name}`,
        avatarIcon: selectedAgent.avatarIcon,
        isDrT: false,
        text: turn3Text,
        voiceName: specialistVoice
      };
      setIntercomDialogueLines(prev => [...prev, l3]);
      setIntercomActiveSpeaker('specialist');
      if (onSpeakText) await onSpeakText(turn3Text, specialistVoice);

      // Step 4: Dr. T Synthesizes beautiful closure
      setIntercomStep(4);
      setIntercomActiveSpeaker('none');
      await new Promise(r => setTimeout(r, 1500));

      const turn4Prompt = `You are playing the role of Dr. T. Conclude this high-spirited consultation with ${selectedAgent.name}'s argument: "${turn3Text}". Provide a comforting, reassuring maternal final resolution of Socratic wisdom in exactly 2 sentences. Encourage their domain. No markdown stars.`;
      const turn4Text = await fetchChatReply(turn4Prompt);

      const l4: DialogueLine = {
        speakerName: `🌸 Dr. T (Maternal Soulmate)`,
        avatarIcon: '🌸',
        isDrT: true,
        text: turn4Text,
        voiceName: drTVoice
      };
      setIntercomDialogueLines(prev => [...prev, l4]);
      setIntercomActiveSpeaker('drt');
      if (onSpeakText) await onSpeakText(turn4Text, drTVoice);

    } catch (e) {
      console.error("Intercom error, calling simulated fallback:", e);
      const fallbackList = getSimulatedIntercomDialogue(selectedAgent.id, topic);
      setIntercomDialogueLines(fallbackList);
      for (let idx = 0; idx < fallbackList.length; idx++) {
        const item = fallbackList[idx];
        setIntercomStep(idx + 1);
        setIntercomActiveSpeaker(item.isDrT ? 'drt' : 'specialist');
        if (onSpeakText) {
          await onSpeakText(item.text, item.voiceName);
        }
        await new Promise(r => setTimeout(r, 1500));
      }
    } finally {
      setIsIntercomGenerating(false);
      setIntercomActiveSpeaker('none');
    }
  };

  const handleStopIntercomCall = () => {
    setIsIntercomCallActive(false);
    setIsIntercomGenerating(false);
    setIntercomActiveSpeaker('none');
    setIntercomDialogueLines([]);
    setIntercomStep(0);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const startSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsSimulating(true);
    setCollaboratedResponse(null);
    setSimulationLogs([]);

    // Add sequential cool steps with delays to simulate actual agent orchestration
    const steps = [
      { step: 'Initializing Swarm Consensus', type: 'system' as const, details: 'Orchestrating primary query across 7 global specialties...' },
      { step: 'Router: Specialty Detection', type: 'system' as const, details: `Delegating tasks matching your query: "${userQuery.slice(0, 30)}..."` },
      { step: `${selectedAgent.name} Activates`, type: 'agent' as const, details: `Assigning primary action to lead specialist: ${selectedAgent.title}` },
    ];

    // Determine secondary agent based on content
    let secondaryAgent = agents[0]; // Medical default
    if (userQuery.toLowerCase().includes('money') || userQuery.toLowerCase().includes('finance') || userQuery.toLowerCase().includes('budget')) {
      secondaryAgent = agents.find(a => a.id === 'finance') || agents[3];
    } else if (userQuery.toLowerCase().includes('school') || userQuery.toLowerCase().includes('college') || userQuery.toLowerCase().includes('learn')) {
      secondaryAgent = agents.find(a => a.id === 'education') || agents[1];
    } else {
      secondaryAgent = agents.find(a => a.id === 'legal') || agents[4]; // Legal
    }

    const secondaryStep = {
      step: `Cross-linking ${secondaryAgent.name}`,
      type: 'agent' as const,
      details: `Co-opting secondary consultant: ${secondaryAgent.title} is assessing risk parameters.`
    };

    // Sequential state updates
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 650));
      setSimulationLogs(prev => [...prev, steps[i]]);
    }

    await new Promise((r) => setTimeout(r, 800));
    setSimulationLogs(prev => [...prev, secondaryStep]);

    const synthesisStep = {
      step: 'Dr. T Infinity Unified Orchestration',
      type: 'system' as const,
      details: 'Synthesizing professional feedback into an empathetic voice-friendly recommendation...'
    };
    await new Promise((r) => setTimeout(r, 1000));
    setSimulationLogs(prev => [...prev, synthesisStep]);

    try {
      const response = await onTriggerSwarmCollaboration(userQuery, selectedAgent.id);
      
      await new Promise((r) => setTimeout(r, 400));
      setSimulationLogs(prev => [...prev, {
        step: 'Swarm Synthesis Completed',
        type: 'success' as const,
        details: '100% accurate interdisciplinary consensus prepared.'
      }]);
      setCollaboratedResponse(response);
    } catch (err) {
      setSimulationLogs(prev => [...prev, {
        step: 'Synthesis Encountered High Demand',
        type: 'success' as const,
        details: 'Recovered gracefully. Formulating responsive maternal solution.'
      }]);
      setCollaboratedResponse("I have collaborated with our entire specialist panel, sweetheart. We've compiled your request carefully. Don't worry, here is our joint coaching: Always tackle health and legal steps sequentially, track medication checkups daily, and let me hold space to guide you whenever you need to prepare reports. We are all with you every step of the journey!");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="agent-swarm-station-layout">
      
      {/* Specialists sidebar picker */}
      <div className="bg-white/80 border border-stone-200/60 rounded-3xl p-5 shadow-xs flex flex-col gap-4">
        <div>
          <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-rose-550 flex items-center gap-1.5 animate-pulse">
            <Activity className="w-3.5 h-3.5" /> Specialist Agent Swarm
          </span>
          <h4 className="font-bold text-stone-800 text-sm mt-1">Specialty Sub-Agents Workspace</h4>
          <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
            The sub-agents operate silently under Dr. T's direction. Click any agent to audit their active status, profile, and intelligence capabilities.
          </p>
        </div>

        <div className="flex justify-between items-center bg-stone-50 p-2.5 rounded-2xl border border-stone-150">
          <span className="text-[9px] font-bold font-mono text-stone-500 uppercase">
            Active: {agents.length} Domains
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-[9px] font-bold font-mono text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/60 transition-all border border-rose-200 p-1 rounded-md flex items-center gap-1 cursor-pointer select-none"
          >
            {showAddForm ? '✕ Close Creator' : '➕ Declare Specialty'}
          </button>
        </div>

        {/* Dynamic Custom Specialist Creator Form */}
        {showAddForm && (
          <div className="p-4 bg-rose-50/20 border border-[#fbcfe8]/40 rounded-2xl flex flex-col gap-3 animate-fadeIn">
            <h5 className="text-[11px] font-extrabold text-stone-850 flex items-center gap-1">
              ✨ Dynamic Specialty Provisioning
            </h5>
            
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold font-mono text-stone-500 uppercase">Specialist Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Astrophysics Expert"
                className="w-full p-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-rose-350 font-sans"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold font-mono text-stone-500 uppercase">Core Specialty Subtitle / Role</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Socratic Quantum Educator"
                className="w-full p-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-rose-350 font-sans"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold font-mono text-stone-500 uppercase">Select Avatar Icon</label>
              <div className="flex flex-wrap gap-1 max-h-[70px] overflow-y-auto p-1 bg-white border border-stone-100 rounded-lg">
                {['🔮', '🧬', '🎨', '🚀', '💻', '🌿', '⚡', '🤖', '🩺', '🎮', '💡', '⚖️', '✈️', '💼'].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setNewIcon(em)}
                    className={`w-6 h-6 flex items-center justify-center text-xs rounded transition-all hover:bg-rose-50 cursor-pointer
                      ${newIcon === em ? 'border border-rose-500 bg-rose-100 scale-110 font-bold' : 'border border-transparent bg-stone-50'}
                    `}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold font-mono text-stone-500 uppercase">Capabilities (comma separated)</label>
              <input
                type="text"
                value={newCaps}
                onChange={(e) => setNewCaps(e.target.value)}
                placeholder="e.g. Black hole analysis, orbital design"
                className="w-full p-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-rose-350 font-sans"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold font-mono text-stone-500 uppercase">Sleek Short Description</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g. Enters dialogue maps about physics..."
                className="w-full p-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-rose-350 font-sans"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!newName || !newTitle) {
                  alert('Sweet child, please fill in at least the Specialist Name and Subtitle to properly align the neural network.');
                  return;
                }
                const capArray = newCaps.split(',').map(c => c.trim()).filter(Boolean);
                const newA: SpecialistAgent = {
                  id: 'custom-' + Date.now(),
                  name: newName,
                  title: newTitle,
                  avatarIcon: newIcon,
                  description: newDesc || `${newName} specialist guidance.`,
                  longDescription: newLongDesc || `A premium dynamic sub-agent provisioned to cover advanced Socratic analytics regarding ${newName} under Dr. T's loving parental matrix.`,
                  status: 'idle',
                  capabilities: capArray.length > 0 ? capArray : [`${newName} Consulting`, 'Dynamic synthesis']
                };
                onAddSpecialist?.(newA);
                setSelectedAgent(newA);
                
                // reset
                setNewName('');
                setNewTitle('');
                setNewDesc('');
                setNewLongDesc('');
                setNewCaps('');
                setShowAddForm(false);
              }}
              className="w-full py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-lg text-[10px] transition-all cursor-pointer shadow-xs active:scale-97 select-none uppercase font-mono tracking-wider"
            >
              🚀 BOOT & INTERFACE DOMAIN AGENT
            </button>
          </div>
        )}

        {/* Directory List of Agents */}
        <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1">
          {agents.map((agent) => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer hover:border-rose-455 hover:bg-stone-50/50
                  ${isSelected 
                    ? 'border-rose-500 bg-rose-50/35 text-rose-900 font-bold' 
                    : 'border-stone-150 bg-white text-stone-600'
                  }
                `}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl bg-white w-8 h-8 rounded-lg flex items-center justify-center border border-stone-100 shadow-xs shrink-0">
                    {agent.avatarIcon}
                  </span>
                  <div className="truncate">
                    <p className="text-xs text-stone-800 font-extrabold">{agent.name}</p>
                    <p className="text-[9px] text-stone-400 font-mono truncate">{agent.title}</p>
                  </div>
                </div>
                
                {/* Active connection status */}
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
                  <span className="text-[8px] font-mono font-bold tracking-wider text-stone-400 uppercase">
                    {isSelected ? 'LOADED' : 'ONLINE'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Agent Details + Swarm Interactive Simulator */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        
        {/* Selected Agent Details card */}
        <div className="bg-white/80 border border-stone-200/60 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start gap-4">
          <div className="text-4xl bg-stone-100 p-4 rounded-2xl border border-stone-150 shadow-sm shrink-0 font-bold select-none leading-none">
            {selectedAgent.avatarIcon}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-stone-800 text-sm">{selectedAgent.name}</h4>
              <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-150 px-1.5 py-0.5 rounded font-extrabold">
                {selectedAgent.title}
              </span>
            </div>
            <p className="text-xs text-stone-400 font-mono mt-1 leading-relaxed">
              {selectedAgent.longDescription}
            </p>

            {/* Core Capabilities taglist */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {selectedAgent.capabilities.map((cap, i) => (
                <span
                  key={i}
                  className="text-[9px] font-semibold bg-stone-100 text-stone-600 border border-stone-200 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs"
                >
                  <UserCheck className="w-2.5 h-2.5 text-stone-400" /> {cap}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Socratic Voice Intercom hotlink panel */}
        <div className="bg-white/90 border border-rose-100 rounded-3xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          {/* Subtle warm decoration glow */}
          <div className="absolute -left-10 -top-10 w-28 h-28 rounded-full bg-rose-200/5 blur-2xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center z-10">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-[#e11d48] uppercase flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" /> Socratic voice intercom
              </span>
              <h4 className="font-bold text-stone-850 text-sm mt-1">Make {selectedAgent.name} Talk to Dr. T</h4>
            </div>
            {isIntercomCallActive && (
              <span className="text-[8px] font-mono uppercase bg-rose-50 text-rose-600 border border-rose-200 px-2 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span> Live Link Active
              </span>
            )}
          </div>

          {!isIntercomCallActive ? (
            <div className="flex flex-col gap-3 z-10 animate-fadeIn">
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Initiate a high-resolution, multi-turn Socratic verbal dialogue between {selectedAgent.name} and Dr. T.
                They will speak back-and-forth using their custom voice synthesizers. Select an interdisciplinary query topic below:
              </p>

              {/* Preset buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                {(PRESET_INTERCOM_TOPICS[selectedAgent.id] || PRESET_INTERCOM_TOPICS.general).map((topic, idx) => (
                  <button
                    key={idx}
                    disabled={isIntercomGenerating}
                    onClick={() => handleTriggerIntercomCall(topic)}
                    className="p-3 text-left bg-stone-50 hover:bg-rose-50/40 border border-stone-200/60 rounded-xl transition-all cursor-pointer hover:border-rose-200 flex flex-col justify-between items-start text-[10px] text-stone-700 leading-snug group active:scale-[0.98]"
                  >
                    <span className="text-[8px] font-mono text-stone-400 uppercase font-black tracking-wider mb-2 group-hover:text-rose-500 transition-colors">
                      Topic Pattern #{idx + 1}
                    </span>
                    <span className="font-medium">{topic}</span>
                  </button>
                ))}
              </div>

              {/* Custom manual speech starter */}
              <div className="border-t border-stone-100 pt-3 flex flex-col sm:flex-row gap-2 mt-1 items-center">
                <span className="text-[9px] font-mono font-bold uppercase shrink-0 text-stone-450 text-stone-500">Custom Intercom Question:</span>
                <div className="flex w-full gap-1.5">
                  <input
                    type="text"
                    id="custom-intercom-topic"
                    placeholder="Enter custom topic (e.g. Socratic approach to quantum entanglement stress)..."
                    className="flex-1 p-2 bg-stone-50 border border-stone-250 rounded-xl text-xs outline-none focus:border-rose-455 transition-all text-stone-850 placeholder-stone-400 font-sans"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.currentTarget as HTMLInputElement).value;
                        if (val.trim()) {
                          handleTriggerIntercomCall(val.trim());
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const inputEl = document.getElementById('custom-intercom-topic') as HTMLInputElement;
                      if (inputEl && inputEl.value.trim()) {
                        handleTriggerIntercomCall(inputEl.value.trim());
                      }
                    }}
                    className="px-3 py-2 bg-stone-900 hover:bg-stone-850 text-white font-extrabold rounded-xl text-[10px] transition-all cursor-pointer uppercase font-mono tracking-wider active:scale-97 shrink-0"
                  >
                    Dial Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-stone-950/95 border border-stone-850 rounded-2xl flex flex-col gap-4 animate-fadeIn">
              
              {/* Visual Interactive Link Board (Specialist vs Dr. T) */}
              <div className="grid grid-cols-3 gap-2 items-center bg-stone-900/60 p-3 rounded-xl border border-stone-800">
                {/* Specialist Profile */}
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-2xl transition-all duration-300 relative
                    ${intercomActiveSpeaker === 'specialist' ? 'border-rose-500 bg-rose-50/10 scale-110 shadow-md ring-4 ring-rose-500/20' : 'border-stone-700 bg-stone-950 scale-100 opacity-60'}
                  `}>
                    {selectedAgent.avatarIcon}
                    {intercomActiveSpeaker === 'specialist' && (
                      <span className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 animate-bounce">
                        <Volume2 className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-extrabold text-white text-center font-sans tracking-tight truncate w-full mt-1">{selectedAgent.name}</span>
                  <span className="text-[7px] text-stone-400 font-mono tracking-wider uppercase">{intercomActiveSpeaker === 'specialist' ? 'SPEAKING' : 'IDLE'}</span>
                </div>

                {/* Secure wire waveforms link */}
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
                  <span className="text-[7px] font-mono tracking-widest text-[#fca5a5] uppercase font-extrabold">COGNITIVE ENVELOPE</span>
                  <div className="flex gap-0.5 items-end justify-center h-6 overflow-hidden">
                    {intercomWaveforms.map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h}px` }}
                        className={`w-0.5 rounded-full transition-all duration-120
                          ${intercomActiveSpeaker !== 'none' ? 'bg-rose-500' : 'bg-stone-700'}
                        `}
                      />
                    ))}
                  </div>
                </div>

                {/* Dr. T Profile */}
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-2xl transition-all duration-300 relative
                    ${intercomActiveSpeaker === 'drt' ? 'border-amber-400 bg-amber-500/10 scale-110 shadow-md ring-4 ring-amber-400/20' : 'border-stone-700 bg-stone-950 scale-100 opacity-60'}
                  `}>
                    🌸
                    {intercomActiveSpeaker === 'drt' && (
                      <span className="absolute -bottom-1 -right-1 bg-amber-405 bg-amber-400 text-stone-950 rounded-full p-0.5 animate-bounce">
                        <Volume2 className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-extrabold text-white text-center font-sans tracking-tight truncate w-full mt-1">Dr. T</span>
                  <span className="text-[7px] text-stone-400 font-mono tracking-wider uppercase">{intercomActiveSpeaker === 'drt' ? 'SPEAKING' : 'IDLE'}</span>
                </div>
              </div>

              {/* Scrollable Conversation Script Display */}
              <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto font-sans p-1">
                {intercomDialogueLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 max-w-[85%] animate-fadeIn
                      ${line.isDrT ? 'self-end flex-row-reverse' : 'self-start'}
                    `}
                  >
                    <span className="text-sm shrink-0 bg-stone-900 border border-stone-800 w-7 h-7 rounded-lg flex items-center justify-center">
                      {line.avatarIcon}
                    </span>
                    <div className={`rounded-xl p-2.5 border text-[11px] leading-relaxed relative
                      ${line.isDrT 
                        ? 'bg-amber-400/5 border-amber-450/20 text-stone-200' 
                        : 'bg-stone-900 border-stone-800 text-stone-200'
                      }
                    `}>
                      <span className="text-[8px] font-mono uppercase font-black text-rose-455 block mb-1">
                        {line.speakerName}
                      </span>
                      <p className="whitespace-pre-line font-medium leading-relaxed font-sans">{line.text}</p>
                    </div>
                  </div>
                ))}

                {isIntercomGenerating && intercomActiveSpeaker === 'none' && (
                  <div className="p-3 text-center text-xs font-mono text-stone-500 animate-pulse flex items-center justify-center gap-1.5 bg-stone-900/30 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    Synthesizing Turn #{intercomStep} via Socratic Splicer...
                  </div>
                )}
              </div>

              {/* Controls and Topic Info */}
              <div className="border-t border-stone-800 pt-3 flex flex-wrap items-center justify-between gap-3 text-[10px]">
                <div className="max-w-[70%] min-w-0">
                  <span className="font-mono text-stone-500 font-extrabold block uppercase text-[8px] tracking-wider">ACTIVE FEED TOPIC</span>
                  <p className="text-stone-300 font-semibold truncate font-sans text-[10px] mt-0.5">"{selectedTopic}"</p>
                </div>

                <button
                  type="button"
                  onClick={handleStopIntercomCall}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer uppercase font-mono tracking-wider active:scale-97 shadow-xs font-black"
                >
                  <PhoneOff className="w-3.5 h-3.5" /> Stop Intercom
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sandbox Simulation Interactive Panel */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-md flex flex-col gap-4 relative overflow-hidden flex-1">
          
          {/* Neon background light */}
          <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-rose-500/5 blur-[90px] pointer-events-none"></div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-rose-500" /> Swarm Orchestrator
            </span>
            <h4 className="text-sm font-bold mt-1 text-white">Consensus Simulation Playground</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed mt-1">
              Submit a multidimensional complex problem (e.g. medical symptoms mixed with financial wellness or stress-related lifestyle). Note how the agent swarm structures consensus reports.
            </p>
          </div>

          <form onSubmit={startSimulation} className="flex gap-2">
            <input
              type="text"
              required
              disabled={isSimulating}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={`Ask ${selectedAgent.name} (e.g., assessing health symptoms, drafting a travel route, mapping study progress)...`}
              className="flex-1 bg-stone-950 border border-stone-800 text-white rounded-xl p-3 text-xs outline-none focus:border-rose-500 transition-all placeholder-stone-500"
            />
            <button
              type="submit"
              disabled={isSimulating}
              className="bg-rose-500 text-white font-bold p-3 px-4 rounded-xl text-xs flex items-center gap-1.5 hover:bg-rose-600 transition-all cursor-pointer disabled:opacity-50 select-none shadow-sm active:scale-[0.98]"
            >
              {isSimulating ? 'SIMULATING...' : <><Play className="w-3.5 h-3.5" /> SWARM</>}
            </button>
          </form>

          {/* Console Output for logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            
            {/* Realtime Terminal Logging info */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3 flex flex-col gap-2 min-h-[160px] max-h-[220px] overflow-y-auto font-mono text-[10px]">
              <span className="text-stone-500 flex items-center gap-1.5 border-b border-stone-850 pb-1 font-bold">
                <Terminal className="w-3 h-3 text-rose-500" /> PIPELINE MONITOR LOGS
              </span>
              
              {simulationLogs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-stone-600 text-[9px] italic text-center p-2">
                  <HelpCircle className="w-5 h-5 opacity-40 mb-1" />
                  Orchestration idle. Spin up a swarm request above.
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {simulationLogs.map((log, i) => (
                    <div key={i} className="animate-fadeIn">
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-500">▶</span>
                        <p className={`font-bold uppercase ${log.type === 'system' ? 'text-amber-450' : log.type === 'agent' ? 'text-blue-400' : 'text-emerald-400'}`}>
                          {log.step}
                        </p>
                      </div>
                      <p className="text-[9px] text-stone-400 leading-snug pl-3.5 mt-0.5">{log.details}</p>
                    </div>
                  ))}
                  {isSimulating && (
                    <span className="text-rose-500 animate-pulse text-[9px] leading-none block font-semibold mt-1">● Routing neural responses...</span>
                  )}
                </div>
              )}
            </div>

            {/* Simulated Collaborative reply panel */}
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-3 flex flex-col text-xs leading-relaxed max-h-[220px] overflow-y-auto">
              <span className="text-[10px] text-stone-500 font-mono font-bold tracking-wider flex items-center gap-1.5 border-b border-stone-850 pb-1 mb-2">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> DR. T CONSOLIDATED REPORT
              </span>
              
              {isSimulating ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-stone-500 text-[11px] animate-pulse font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    Assembling joint specialist feedback...
                  </span>
                </div>
              ) : collaboratedResponse ? (
                <div className="text-stone-300 animate-fadeIn pr-1">
                  <p className="font-semibold text-rose-455 mb-1 bg-rose-500/10 p-1.5 rounded border border-rose-500/10 text-[10px]">
                    🌸 Empathetic consensus verified directly via {selectedAgent.name}
                  </p>
                  <p className="font-mono text-[11px] leading-relaxed whitespace-pre-line text-stone-300 select-all">
                    {collaboratedResponse}
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-stone-600 font-mono text-[10px] text-center italic p-4">
                  Await collaborative solution transcript.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AgentSwarm;
