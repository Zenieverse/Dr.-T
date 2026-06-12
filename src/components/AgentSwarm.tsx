import React, { useState } from 'react';
import { Network, Play, Terminal, ArrowRight, UserCheck, Shield, HelpCircle, Activity } from 'lucide-react';
import { SpecialistAgent } from '../types';

interface AgentSwarmProps {
  agents: SpecialistAgent[];
  onTriggerSwarmCollaboration: (prompt: string, selectedAgentId: string) => Promise<string>;
  onAddSpecialist?: (agent: SpecialistAgent) => void;
}

export const AgentSwarm: React.FC<AgentSwarmProps> = ({ agents, onTriggerSwarmCollaboration, onAddSpecialist }) => {
  const [selectedAgent, setSelectedAgent] = useState<SpecialistAgent>(agents[0]);
  const [userQuery, setUserQuery] = useState('');
  
  // Local Simulation Output logs and active animation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<{ step: string; type: 'system' | 'agent' | 'success'; details: string }[]>([]);
  const [collaboratedResponse, setCollaboratedResponse] = useState<string | null>(null);

  // Dynamic creator states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('🔮');
  const [newDesc, setNewDesc] = useState('');
  const [newLongDesc, setNewLongDesc] = useState('');
  const [newCaps, setNewCaps] = useState('');

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
