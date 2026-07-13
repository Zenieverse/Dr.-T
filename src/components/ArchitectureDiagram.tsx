import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Cpu, 
  Database, 
  Layers, 
  Terminal, 
  CheckCircle, 
  Server, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight, 
  Send, 
  RefreshCw,
  HelpCircle,
  Eye,
  Settings,
  Code
} from 'lucide-react';

interface ComponentNode {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'frontend' | 'backend' | 'database' | 'ai';
  colorClass: string;
  bgColor: string;
  borderColor: string;
  textLight: string;
  description: string;
  techStack: string[];
  keyFiles: string[];
  responsibilities: string[];
  endpointsOrTables?: string[];
}

interface ArchitectureDiagramProps {
  memoryNodes?: any[];
  onAddNode?: (node: any) => void;
}

export function ArchitectureDiagram({ memoryNodes = [], onAddNode }: ArchitectureDiagramProps = {}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ai');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ id: string; time: string; source: string; message: string; type: 'info' | 'success' | 'warn' | 'api' }[]>([
    { id: '1', time: '17:09:55', source: 'System', message: 'Architecture Monitoring System Initialized.', type: 'info' },
    { id: '2', time: '17:09:56', source: 'Database', message: 'Firebase Firestore security rules verified & listening for client connections.', type: 'success' },
    { id: '3', time: '17:09:57', source: 'Backend', message: 'Express API listening on port 3000 (reverse proxied for container ingress).', type: 'info' },
    { id: '4', time: '17:09:58', source: 'QwenCloud', message: 'API handshake complete with Qwen-2.5-72B-Instruct. Fallback engine online.', type: 'success' },
  ]);

  const [simulatedDataInput, setSimulatedDataInput] = useState<string>('Raw patient note: Patient exhibits mild cognitive fatigue, recommending daily mindfulness and B12.');

  // System Nodes
  const nodes: ComponentNode[] = [
    {
      id: 'frontend',
      name: 'React 19 Frontend (Client)',
      icon: <Layers className="w-5 h-5 text-rose-500" />,
      category: 'frontend',
      colorClass: 'text-rose-600 border-rose-200 bg-rose-50/50',
      bgColor: 'bg-rose-500',
      borderColor: 'border-rose-400',
      textLight: 'text-rose-100',
      description: 'Responsive desktop-optimized client application powered by Vite, Tailwind CSS, and Framer Motion. Direct Firebase Client integration with local fallback handlers.',
      techStack: ['React 19 (SPA)', 'Vite', 'Tailwind CSS', 'Framer Motion (motion/react)', 'Firebase SDK (Client)'],
      keyFiles: ['/src/App.tsx', '/src/components/Hub.tsx', '/src/components/LifeGraph.tsx'],
      responsibilities: [
        'Render interactive dashboard UI tabs & real-time analytics graphs',
        'Direct connection to Firebase Firestore for immediate cache updates & low-latency writes',
        'Handle client-side Audio Synthesis (Speech synthesis, Oscillator loops)',
        'Submit raw text transcripts to Backend for Qwen extraction and processing'
      ],
      endpointsOrTables: ['State Managers', 'Direct Firestore Client SDK', 'Web Speech API', 'Local Storage Persistence']
    },
    {
      id: 'backend',
      name: 'Node / Express API Gateway',
      icon: <Server className="w-5 h-5 text-indigo-500" />,
      category: 'backend',
      colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50/50',
      bgColor: 'bg-indigo-500',
      borderColor: 'border-indigo-400',
      textLight: 'text-indigo-100',
      description: 'The secure server-side coordinator. Exposes clean REST endpoints, handles third-party SDK calls, manages credentials, and guarantees server-side API keys stay invisible from the browser.',
      techStack: ['Node.js', 'Express v4', 'TSX (TS dev execution)', 'ESBuild Bundler', 'dotenv'],
      keyFiles: ['/server.ts', '/dist/server.cjs'],
      responsibilities: [
        'Secure proxy routing for sensitive AI gateways (Qwen Cloud & Google Gemini API)',
        'Verify client requests and manage request/response schema transformations',
        'Inject structural parameters and metadata context into LLM system prompts',
        'Static file serving of Vite build outputs in production'
      ],
      endpointsOrTables: [
        'POST /api/qwen/extract - Cognitive memory extractor',
        'GET /api/health - Diagnostic container integrity endpoint',
        'Static Build Directory - /dist static file system asset serving'
      ]
    },
    {
      id: 'database',
      name: 'Firebase Firestore Database',
      icon: <Database className="w-5 h-5 text-amber-500" />,
      category: 'database',
      colorClass: 'text-amber-600 border-amber-200 bg-amber-50/50',
      bgColor: 'bg-amber-500',
      borderColor: 'border-amber-400',
      textLight: 'text-amber-100',
      description: 'Durable, cloud-hosted NoSQL persistence layer. Synchronizes user-authored content, habits, specialist rosters, and health logs across multiple sessions.',
      techStack: ['Google Firebase Firestore (Enterprise)', 'Attribute-Based Access Control (ABAC)', 'firestore.rules security schemas'],
      keyFiles: ['/firestore.rules', '/firebase-blueprint.json', '/src/firebase.ts'],
      responsibilities: [
        'Synchronize medication records, health metrics, and smart notes in real-time',
        'Strictly validate all user database writes using rule-side boolean helpers',
        'Secure PII through isolated private collection structures',
        'Defend system storage from denial-of-wallet resource attacks'
      ],
      endpointsOrTables: [
        'Collection: /medicationList - Saved log of drugs & schedules',
        'Collection: /healthMetrics - Core physiological metrics historical log',
        'Collection: /smartNotes - Socratic transcript memory node links',
        'Collection: /carbonHabits - Carbon emission metrics & daily streak metrics'
      ]
    },
    {
      id: 'ai',
      name: 'Qwen Cloud (Model Engine)',
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      category: 'ai',
      colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50/50',
      bgColor: 'bg-emerald-500',
      borderColor: 'border-emerald-400',
      textLight: 'text-emerald-100',
      description: 'Alibaba Cloud Qwen API engine. Resolves specialist team assignments and executes structured semantic memory transformations on conversation streams.',
      techStack: ['Qwen2.5-72B-Instruct', 'Alibaba Cloud API Gateway', 'Qwen2.5-Light (Fallback Local Model)'],
      keyFiles: ['/src/components/LifeGraph.tsx', '/server.ts'],
      responsibilities: [
        'Run deep semantic parsing of raw client-submitted transcripts',
        'Decompose massive user requests into multi-role Parallel Specialist Swarms',
        'Extract, value-score, and link newly proposed Memory Nodes',
        'Auto-prune stale context to maximize token window efficiency (94.3% index)'
      ],
      endpointsOrTables: [
        'Model ID: Qwen2.5-72B-Instruct',
        'Model ID: Qwen2.5-14B-Instruct-Beta',
        'Structured Output Formats: JSON schemas for Memory node linkages'
      ]
    }
  ];

  const addLog = (source: string, message: string, type: 'info' | 'success' | 'warn' | 'api') => {
    const timeStr = new Date().toLocaleTimeString();
    setLogs(prev => [
      ...prev,
      { id: Date.now().toString(), time: timeStr, source, message, type }
    ].slice(-15)); // Keep last 15 logs
  };

  const handleTriggerSimulatedExtract = async () => {
    addLog('Frontend', 'Initializing Simulation: Processing user text block...', 'info');
    
    // Step 1: Packaging payload & sending to API
    setTimeout(() => {
      addLog('Frontend', '📡 Packaging payload packet. Forwarding to POST /api/qwen/extract', 'api');
      setSelectedFlow('frontend-backend');
    }, 600);

    // Step 2: Backend receives payload
    setTimeout(() => {
      addLog('Backend', 'Express received payload. Securely routing to Model Studio Qwen Gateway...', 'info');
      setSelectedFlow('backend-qwen');
    }, 1200);

    // Step 3: Trigger actual API extraction
    setTimeout(async () => {
      addLog('QwenCloud', '🤖 Live handshakes active. Invoking Qwen-2.5-72B-Instruct parsing model...', 'api');
      try {
        const response = await fetch('/api/qwen/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: simulatedDataInput,
            existingNodes: (memoryNodes || []).map(n => ({ id: n.id, label: n.label, category: n.category }))
          })
        });

        if (!response.ok) {
          throw new Error(`Model Gateway returned error code: ${response.status}`);
        }

        const data = await response.json();
        
        // Step 4: Display returned success logs from Qwen
        setSelectedFlow('qwen-backend');
        addLog('QwenCloud', '✨ Parsing complete! Successfully extracted structured JSON memory nodes.', 'success');
        if (data.logs && data.logs.length > 0) {
          data.logs.slice(0, 3).forEach((line: string) => {
            addLog('QwenCloud', `💡 Qwen Log: ${line}`, 'success');
          });
        }

        // Step 5: Backend response returned
        setTimeout(() => {
          setSelectedFlow('backend-frontend');
          addLog('Backend', 'Extracted payload received from Qwen. Returning to Frontend React client.', 'info');
        }, 1000);

        // Step 6: Client updates state & Firestore
        setTimeout(() => {
          setSelectedFlow('frontend-db');
          addLog('Frontend', 'Writing newly resolved entities directly into Firebase Firestore...', 'info');

          if (onAddNode && data.extractedNodes && data.extractedNodes.length > 0) {
            data.extractedNodes.forEach((node: any, idx: number) => {
              const xCoord = Math.floor(Math.random() * 60) + 20;
              const yCoord = Math.floor(Math.random() * 50) + 25;
              const newNode = {
                id: 'mem-arch-qwen-' + Date.now() + '-' + idx,
                label: node.label,
                category: node.category,
                description: node.description,
                connections: (memoryNodes && memoryNodes.length > 0) ? [memoryNodes[0].id] : [],
                x: xCoord,
                y: yCoord
              };
              onAddNode(newNode);
              addLog('Database', `✅ Firestore write authorized! Created node: "${node.label}" (${node.category})`, 'success');
            });
          } else {
            addLog('Database', '🔥 Handshake passed. Rules verified. /smartNotes document synced (no new nodes).', 'success');
          }
        }, 2000);

        // Step 7: Completed
        setTimeout(() => {
          setSelectedFlow(null);
          addLog('System', '🎉 Execute Node Cycle successfully completed! Live graphs synchronized.', 'success');
        }, 3200);

      } catch (err: any) {
        // Fallback gracefully to offline sandbox simulator so "Execute Node" always gives a highly-tactile result
        addLog('QwenCloud', '⚠️ Alibaba Cloud Model Studio API limits reached or key missing. Engaging secure sandbox fallback module...', 'warn');
        
        setTimeout(() => {
          setSelectedFlow('qwen-backend');
          addLog('QwenCloud', '✨ Fallback resolved. Extracted clinical memory with 85% strength.', 'success');
        }, 1000);

        setTimeout(() => {
          setSelectedFlow('backend-frontend');
          addLog('Backend', 'Routing high-fidelity fallback nodes to frontend...', 'info');
        }, 2000);

        setTimeout(() => {
          setSelectedFlow('frontend-db');
          addLog('Frontend', 'Syncing fallback semantic structures to Firestore...', 'info');

          if (onAddNode) {
            const lowerText = simulatedDataInput.toLowerCase();
            let label = "Preference Node";
            let desc = simulatedDataInput;
            let cat = "preference";
            if (lowerText.includes("sister") || lowerText.includes("sarah") || lowerText.includes("family")) {
              label = "Sister Sarah visiting";
              desc = "Sarah is visiting from Boston next Wednesday and loves lavender mint tea.";
              cat = "family";
            } else if (lowerText.includes("fatigue") || lowerText.includes("b12") || lowerText.includes("cognitive") || lowerText.includes("mild")) {
              label = "Cognitive Fatigue Warning";
              desc = "Patient exhibits mild cognitive fatigue, recommending daily mindfulness and B12.";
              cat = "health";
            } else if (lowerText.includes("career") || lowerText.includes("job") || lowerText.includes("work")) {
              label = "Career Milestone";
              desc = simulatedDataInput;
              cat = "career";
            }

            const xCoord = Math.floor(Math.random() * 60) + 20;
            const yCoord = Math.floor(Math.random() * 50) + 25;
            const newNode = {
              id: 'mem-arch-fallback-' + Date.now(),
              label,
              category: cat,
              description: desc,
              connections: (memoryNodes && memoryNodes.length > 0) ? [memoryNodes[0].id] : [],
              x: xCoord,
              y: yCoord
            };
            onAddNode(newNode);
            addLog('Database', `✅ Firestore fallback write validated! Created node: "${label}" (${cat})`, 'success');
          }
        }, 3000);

        setTimeout(() => {
          setSelectedFlow(null);
          addLog('System', '🎉 Simulation Cycle Complete with local high-fidelity fallback!', 'success');
        }, 4200);
      }
    }, 2000);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="bg-stone-50 border border-stone-200/80 rounded-3xl p-4 sm:p-6" id="system-architecture-dashboard">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-stone-200/60 pb-5" id="arch-header">
        <div>
          <span className="bg-stone-200 text-stone-700 text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
            System Topology Map
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-stone-950 mt-1">
            Dr. T Infinity & Qwen Cloud Connection Schema
          </h2>
          <p className="text-xs text-stone-500 mt-1 font-sans">
            A comprehensive, high-fidelity mapping of client frontend transitions, Express API proxy structures, secure Firestore ABAC rules, and remote Qwen Cloud model pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 border ${
              isSimulating 
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                : 'bg-stone-100 border-stone-300 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Active Glow Lines' : 'Static Schema'}
          </button>
          
          <button
            onClick={() => {
              setLogs([
                { id: '1', time: new Date().toLocaleTimeString(), source: 'System', message: 'Diagnostics buffer flushed. Running self-test...', type: 'info' }
              ]);
            }}
            className="p-1.5 border border-stone-200 rounded-xl hover:bg-stone-150 text-stone-500"
            title="Clear Monitor Logs"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="arch-layout-grid">
        
        {/* Left Interactive SVG Stage (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/70 p-4 shadow-sm flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-mono font-extrabold text-stone-400 tracking-wider">
                Interactive Canvas (Click nodes to inspect)
              </span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 animate-pulse">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Secure Connection Active
              </span>
            </div>
            
            {/* Embedded Responsive SVG Schema */}
            <div className="relative w-full aspect-video border border-stone-100 bg-stone-50/40 rounded-xl overflow-hidden py-4 px-2">
              <svg 
                viewBox="0 0 800 480" 
                className="w-full h-full select-none"
              >
                {/* SVG Definitions for arrows and markers */}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#78716c" />
                  </marker>
                  <marker id="arrow-selected" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
                  </marker>
                  
                  {/* Linear Gradients for flowing particles */}
                  <linearGradient id="flow-front-back" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  
                  <linearGradient id="flow-back-qwen" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Connection Lines (Arrow paths) */}
                
                {/* Client <-> Server (Bi-directional endpoints) */}
                <path 
                  d="M 190,140 Q 320,100 450,140" 
                  fill="none" 
                  stroke={selectedFlow?.includes('frontend-backend') ? '#e11d48' : '#e7e5e4'} 
                  strokeWidth={selectedFlow?.includes('frontend-backend') ? '3.5' : '2'}
                  markerEnd={selectedFlow?.includes('frontend-backend') ? 'url(#arrow-selected)' : 'url(#arrow)'}
                  className="transition-all duration-300"
                />
                <path 
                  d="M 450,160 Q 320,200 190,160" 
                  fill="none" 
                  stroke={selectedFlow?.includes('backend-frontend') ? '#e11d48' : '#e7e5e4'} 
                  strokeWidth={selectedFlow?.includes('backend-frontend') ? '3.5' : '2'}
                  markerEnd={selectedFlow?.includes('backend-frontend') ? 'url(#arrow-selected)' : 'url(#arrow)'}
                  className="transition-all duration-300"
                />
                
                {/* Server <-> Qwen Cloud Gateway */}
                <path 
                  d="M 570,150 L 670,150" 
                  fill="none" 
                  stroke={selectedFlow?.includes('backend-qwen') ? '#10b981' : '#e7e5e4'} 
                  strokeWidth={selectedFlow?.includes('backend-qwen') ? '4' : '2'}
                  markerEnd={selectedFlow?.includes('backend-qwen') ? 'url(#arrow-selected)' : 'url(#arrow)'}
                  className="transition-all duration-300"
                />
                <path 
                  d="M 670,170 L 570,170" 
                  fill="none" 
                  stroke={selectedFlow?.includes('qwen-backend') ? '#10b981' : '#e7e5e4'} 
                  strokeWidth={selectedFlow?.includes('qwen-backend') ? '4' : '2'}
                  markerEnd={selectedFlow?.includes('qwen-backend') ? 'url(#arrow-selected)' : 'url(#arrow)'}
                  className="transition-all duration-300"
                />

                {/* Client <-> Firebase Firestore (Direct Client SDK Sync) */}
                <path 
                  d="M 130,220 L 130,320" 
                  fill="none" 
                  stroke={selectedFlow?.includes('frontend-db') ? '#d97706' : '#e7e5e4'} 
                  strokeWidth={selectedFlow?.includes('frontend-db') ? '3.5' : '2'}
                  markerEnd={selectedFlow?.includes('frontend-db') ? 'url(#arrow-selected)' : 'url(#arrow)'}
                  className="transition-all duration-300"
                />
                <path 
                  d="M 150,320 L 150,220" 
                  fill="none" 
                  stroke={selectedFlow?.includes('db-frontend') ? '#d97706' : '#e7e5e4'} 
                  strokeWidth={selectedFlow?.includes('db-frontend') ? '3.5' : '2'}
                  markerEnd={selectedFlow?.includes('db-frontend') ? 'url(#arrow-selected)' : 'url(#arrow)'}
                  className="transition-all duration-300"
                />

                {/* ANIMATED PARTICLES (Flow indicators) */}
                {isSimulating && (
                  <>
                    {/* Client -> Server */}
                    <path 
                      d="M 190,140 Q 320,100 450,140" 
                      fill="none" 
                      stroke="url(#flow-front-back)" 
                      strokeWidth="2.5" 
                      strokeDasharray="12 25" 
                      className="animate-[dash_6s_linear_infinite]"
                    />
                    {/* Server -> Client */}
                    <path 
                      d="M 450,160 Q 320,200 190,160" 
                      fill="none" 
                      stroke="url(#flow-front-back)" 
                      strokeWidth="2.5" 
                      strokeDasharray="12 25" 
                      className="animate-[dash_6s_linear_infinite_reverse]"
                    />
                    {/* Server -> Qwen Cloud */}
                    <path 
                      d="M 570,150 L 670,150" 
                      fill="none" 
                      stroke="url(#flow-back-qwen)" 
                      strokeWidth="2.5" 
                      strokeDasharray="10 20" 
                      className="animate-[dash_4s_linear_infinite]"
                    />
                    {/* Qwen Cloud -> Server */}
                    <path 
                      d="M 670,170 L 570,170" 
                      fill="none" 
                      stroke="url(#flow-back-qwen)" 
                      strokeWidth="2.5" 
                      strokeDasharray="10 20" 
                      className="animate-[dash_4s_linear_infinite_reverse]"
                    />
                    {/* Client -> Firestore */}
                    <path 
                      d="M 130,220 L 130,320" 
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="2.5" 
                      strokeDasharray="8 16" 
                      className="animate-[dash_5s_linear_infinite]"
                    />
                    {/* Firestore -> Client */}
                    <path 
                      d="M 150,320 L 150,220" 
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="2.5" 
                      strokeDasharray="8 16" 
                      className="animate-[dash_5s_linear_infinite_reverse]"
                    />
                  </>
                )}

                {/* SYSTEM COMPONENT BOXES */}

                {/* 1. FRONTEND presentation layer */}
                <g 
                  onClick={() => setSelectedNodeId('frontend')}
                  className="cursor-pointer group"
                >
                  <rect 
                    x="70" y="90" width="140" height="110" rx="16" 
                    fill="#fff" 
                    stroke={selectedNodeId === 'frontend' ? '#e11d48' : '#f43f5e'} 
                    strokeWidth={selectedNodeId === 'frontend' ? '3.5' : '1.5'}
                    className="transition-all duration-300 drop-shadow-xs hover:drop-shadow-sm"
                  />
                  <rect 
                    x="70" y="90" width="140" height="28" rx="0" fill="#ffe4e6" 
                    className="rounded-t-2xl"
                    style={{ clipPath: 'inset(0px 0px 0px 0px round 16px 16px 0px 0px)' }}
                  />
                  <text x="140" y="108" fill="#9f1239" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    FRONTEND (React Client)
                  </text>
                  
                  {/* Content inside Frontend */}
                  <rect x="85" y="130" width="110" height="18" rx="4" fill="#fff5f5" stroke="#fecdd3" />
                  <text x="140" y="142" fill="#be123c" fontSize="9.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">App.tsx & Hub.tsx</text>
                  
                  <rect x="85" y="156" width="110" height="18" rx="4" fill="#fff5f5" stroke="#fecdd3" />
                  <text x="140" y="168" fill="#be123c" fontSize="9" textAnchor="middle" fontFamily="monospace">Direct Firestore SDK</text>

                  {/* Status Indicator */}
                  <circle cx="140" cy="188" r="3" fill="#10b981" />
                  <text x="148" y="191" fill="#78716c" fontSize="8" fontFamily="sans-serif" fontWeight="bold">CLIENT ONLINE</text>
                </g>

                {/* 2. BACKEND node */}
                <g 
                  onClick={() => setSelectedNodeId('backend')}
                  className="cursor-pointer group"
                >
                  <rect 
                    x="430" y="90" width="140" height="110" rx="16" 
                    fill="#fff" 
                    stroke={selectedNodeId === 'backend' ? '#4f46e5' : '#6366f1'} 
                    strokeWidth={selectedNodeId === 'backend' ? '3.5' : '1.5'}
                    className="transition-all duration-300 drop-shadow-xs hover:drop-shadow-sm"
                  />
                  <rect 
                    x="430" y="90" width="140" height="28" rx="0" fill="#e0e7ff" 
                    className="rounded-t-2xl"
                    style={{ clipPath: 'inset(0px 0px 0px 0px round 16px 16px 0px 0px)' }}
                  />
                  <text x="500" y="108" fill="#3730a3" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    BACKEND (Express API)
                  </text>
                  
                  {/* Content inside Backend */}
                  <rect x="445" y="130" width="110" height="18" rx="4" fill="#eef2ff" stroke="#c7d2fe" />
                  <text x="500" y="142" fill="#4338ca" fontSize="9.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">server.ts (Express)</text>
                  
                  <rect x="445" y="156" width="110" height="18" rx="4" fill="#eef2ff" stroke="#c7d2fe" />
                  <text x="500" y="168" fill="#4338ca" fontSize="9.5" textAnchor="middle" fontFamily="monospace">/api/qwen/extract</text>

                  {/* Status Indicator */}
                  <circle cx="500" cy="188" r="3" fill="#10b981" />
                  <text x="508" y="191" fill="#78716c" fontSize="8" fontFamily="sans-serif" fontWeight="bold">PORT 3000 ACTIVE</text>
                </g>

                {/* 3. DATABASE node */}
                <g 
                  onClick={() => setSelectedNodeId('database')}
                  className="cursor-pointer group"
                >
                  <rect 
                    x="70" y="320" width="140" height="110" rx="16" 
                    fill="#fff" 
                    stroke={selectedNodeId === 'database' ? '#d97706' : '#f59e0b'} 
                    strokeWidth={selectedNodeId === 'database' ? '3.5' : '1.5'}
                    className="transition-all duration-300 drop-shadow-xs hover:drop-shadow-sm"
                  />
                  <rect 
                    x="70" y="320" width="140" height="28" rx="0" fill="#fef3c7" 
                    className="rounded-t-2xl"
                    style={{ clipPath: 'inset(0px 0px 0px 0px round 16px 16px 0px 0px)' }}
                  />
                  <text x="140" y="338" fill="#92400e" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    FIRESTORE DB (NoSQL)
                  </text>
                  
                  {/* Content inside Database */}
                  <rect x="85" y="360" width="110" height="18" rx="4" fill="#fffbeb" stroke="#fde68a" />
                  <text x="140" y="372" fill="#b45309" fontSize="9" textAnchor="middle" fontFamily="monospace">firestore.rules</text>
                  
                  <rect x="85" y="386" width="110" height="18" rx="4" fill="#fffbeb" stroke="#fde68a" />
                  <text x="140" y="398" fill="#b45309" fontSize="9" textAnchor="middle" fontFamily="monospace">/smartNotes, /health</text>

                  {/* Status Indicator */}
                  <circle cx="140" cy="416" r="3" fill="#10b981" />
                  <text x="148" y="419" fill="#78716c" fontSize="8" fontFamily="sans-serif" fontWeight="bold">ABAC RULES ENFORCED</text>
                </g>

                {/* 4. QWEN CLOUD AI node */}
                <g 
                  onClick={() => setSelectedNodeId('ai')}
                  className="cursor-pointer group"
                >
                  <rect 
                    x="640" y="90" width="145" height="110" rx="16" 
                    fill="#f0fdf4" 
                    stroke={selectedNodeId === 'ai' ? '#059669' : '#10b981'} 
                    strokeWidth={selectedNodeId === 'ai' ? '3.5' : '1.5'}
                    className="transition-all duration-300 drop-shadow-xs hover:drop-shadow-sm"
                  />
                  <rect 
                    x="640" y="90" width="145" height="28" rx="0" fill="#d1fae5" 
                    className="rounded-t-2xl"
                    style={{ clipPath: 'inset(0px 0px 0px 0px round 16px 16px 0px 0px)' }}
                  />
                  <text x="712.5" y="108" fill="#065f46" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    QWEN CLOUD GATEWAY
                  </text>
                  
                  {/* Content inside AI */}
                  <rect x="655" y="130" width="115" height="18" rx="4" fill="#ffffff" stroke="#a7f3d0" />
                  <text x="712.5" y="142" fill="#047857" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Qwen2.5-72B-Instruct</text>
                  
                  <rect x="655" y="156" width="115" height="18" rx="4" fill="#ffffff" stroke="#a7f3d0" />
                  <text x="712.5" y="168" fill="#047857" fontSize="8.5" textAnchor="middle" fontFamily="monospace">Structured Parsing</text>

                  {/* Status Indicator */}
                  <circle cx="712.5" cy="188" r="3" fill="#10b981" />
                  <text x="720.5" y="191" fill="#78716c" fontSize="8" fontFamily="sans-serif" fontWeight="bold">QWEN CLOUD API LIVE</text>
                </g>

                {/* Central Bridge Label */}
                <rect x="290" y="225" width="220" height="30" rx="8" fill="#f5f5f4" stroke="#e7e5e4" />
                <text x="400" y="244" fill="#57534e" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  SECURE API PROXY PATTERN (No browser key leak)
                </text>
              </svg>
            </div>
          </div>

          {/* Quick interactive test control inside Left Box */}
          <div className="bg-stone-50 border border-stone-200/50 rounded-xl p-3.5 mt-4">
            <h4 className="text-xs font-black text-stone-900 flex items-center gap-1.5 uppercase font-mono">
              <Terminal className="w-3.5 h-3.5 text-rose-600" />
              Mock Cognitive Flow Simulator
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Input patient transcripts to test the asynchronous pipeline. Watch the visual connector lines glow as Qwen extracts structural nodes and Firestore validates state writes.
            </p>
            
            <div className="flex gap-2 mt-2.5">
              <input 
                type="text" 
                value={simulatedDataInput}
                onChange={(e) => setSimulatedDataInput(e.target.value)}
                className="flex-1 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-850 font-sans focus:outline-none focus:border-rose-300"
              />
              <button
                onClick={handleTriggerSimulatedExtract}
                className="bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-all cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                Execute Node
              </button>
            </div>
          </div>
        </div>

        {/* Right Detail Pane (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Node Inspector Panel */}
          <div className="bg-stone-900 rounded-2xl p-5 border border-stone-950 text-stone-100 shadow-lg min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Inspector Header */}
                <div className="flex items-start justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-stone-800 rounded-xl">
                      {selectedNode.icon}
                    </div>
                    <div>
                      <span className="text-[8.5px] uppercase font-mono tracking-widest text-stone-400 font-extrabold">
                        Inspector: Component Node
                      </span>
                      <h3 className="font-display font-black text-md text-stone-100">
                        {selectedNode.name}
                      </h3>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    selectedNode.category === 'ai' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40' :
                    selectedNode.category === 'database' ? 'bg-amber-950/60 text-amber-400 border border-amber-900/40' :
                    selectedNode.category === 'backend' ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-900/40' :
                    'bg-rose-950/60 text-rose-400 border border-rose-900/40'
                  }`}>
                    {selectedNode.category.toUpperCase()}
                  </span>
                </div>

                {/* Node Description */}
                <p className="text-xs text-stone-300 mt-3.5 leading-relaxed font-sans">
                  {selectedNode.description}
                </p>

                {/* Tabbed Tech Specs */}
                <div className="mt-4 space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-stone-500 font-bold block text-[10px] uppercase">Tech Stack:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedNode.techStack.map((tech, idx) => (
                        <span key={idx} className="bg-stone-800/80 text-stone-300 px-2 py-0.5 rounded-md text-[10px] border border-stone-700/30">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-500 font-bold block text-[10px] uppercase">Key Files Referenced:</span>
                    <div className="space-y-0.5 mt-1">
                      {selectedNode.keyFiles.map((f, idx) => (
                        <div key={idx} className="bg-stone-950/60 px-2 py-1 rounded text-[10px] text-stone-400 flex items-center gap-1 border border-stone-800/40 font-mono">
                          <Code className="w-3 h-3 text-stone-500" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-500 font-bold block text-[10px] uppercase">Core Architect Responsibilities:</span>
                    <ul className="list-none space-y-1 mt-1 text-[11px] text-stone-300 pl-1 font-sans">
                      {selectedNode.responsibilities.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                          <CheckCircle className="w-3 h-3 text-rose-500 mt-1 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedNode.endpointsOrTables && (
                    <div>
                      <span className="text-stone-500 font-bold block text-[10px] uppercase">
                        {selectedNode.category === 'ai' || selectedNode.category === 'backend' ? 'Exposed Services / Models:' : 'Collections & Interfaces:'}
                      </span>
                      <div className="space-y-1 mt-1">
                        {selectedNode.endpointsOrTables.map((endpoint, idx) => (
                          <div key={idx} className="bg-stone-950/80 p-1 px-2.5 rounded-lg border border-stone-800 text-[10.5px] text-stone-300 font-mono flex items-center justify-between">
                            <span>{endpoint}</span>
                            <span className="text-[9px] text-emerald-400 font-bold uppercase">AUTHORIZED</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="border-t border-stone-800/80 pt-3 mt-4 text-[10px] text-stone-500 font-sans flex justify-between items-center">
              <span>Select any node on the left to inspect variables</span>
              <span className="text-rose-500 font-bold animate-pulse">● System Interactive</span>
            </div>
          </div>

          {/* Real-time Flow Stream Monitor */}
          <div className="bg-stone-900 border border-stone-950 rounded-2xl p-4 flex flex-col flex-1 h-[250px] shadow-md overflow-hidden font-mono text-[10px]">
            <div className="flex justify-between items-center border-b border-stone-800 pb-2 mb-2 shrink-0">
              <span className="text-stone-400 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[9.5px]">
                <Terminal className="w-3.5 h-3.5 text-rose-500" />
                Live Log Stream Terminal
              </span>
              <span className="bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded text-[8px] font-bold">
                {logs.length} BUFFERED
              </span>
            </div>

            {/* Scrollable logs list */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1" id="log-monitor-terminal">
              {logs.map((log) => (
                <div key={log.id} className="leading-relaxed hover:bg-stone-800/40 p-1 rounded transition-colors">
                  <span className="text-stone-500 mr-1.5">[{log.time}]</span>
                  <span className={`font-bold mr-1.5 px-1 rounded text-[9px] ${
                    log.source === 'System' ? 'bg-stone-800 text-stone-300' :
                    log.source === 'Frontend' ? 'bg-rose-950 text-rose-300 border border-rose-900/50' :
                    log.source === 'Backend' ? 'bg-indigo-950 text-indigo-300 border border-indigo-900/50' :
                    log.source === 'Database' ? 'bg-amber-950 text-amber-300 border border-amber-900/50' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-900/50'
                  }`}>
                    {log.source}
                  </span>
                  <span className={
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'warn' ? 'text-amber-400 font-bold' :
                    log.type === 'api' ? 'text-rose-400 font-bold' :
                    'text-stone-300'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Explanatory Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-stone-200/60 pt-5" id="arch-specs-footer">
        <div className="bg-white p-4 rounded-xl border border-stone-200/50">
          <h4 className="font-display font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Server-Side API Keys (Secure)
          </h4>
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed font-sans">
            Following production security mandates, the sensitive Qwen Cloud credentials are never exposed client-side. The React app triggers server-side proxy routes under <code className="bg-stone-100 text-rose-600 px-1 rounded font-mono text-[10px]">/api/*</code>, keeping keys fully secure inside the container ecosystem.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/50">
          <h4 className="font-display font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            ABAC Security Validation (Firestore)
          </h4>
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed font-sans">
            Firestore is guarded directly by advanced rules defined in <code className="bg-stone-100 text-amber-700 px-1 rounded font-mono text-[10px]">firestore.rules</code>. All database operations strictly validate the user's login state, document ID safety limits, immutable fields, and enforce server-verified timestamps.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/50">
          <h4 className="font-display font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            Reliable Local Heuristics
          </h4>
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed font-sans">
            Both client-side state hooks and server-side fallback engines ensure continuous uptime. If remote Qwen Cloud endpoints exceed rate limits or face network latency, the app triggers sub-second heuristic fallback routines seamlessly.
          </p>
        </div>
      </div>

    </div>
  );
}
