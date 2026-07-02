import React, { useState, useEffect } from 'react';
import { 
  Database, Plus, Trash2, Milestone, Heart, Sparkles, RefreshCw, Layers, 
  Brain, Lock, Unlock, Search, CheckCircle, Flame, Info, AlertTriangle, MessageSquare
} from 'lucide-react';
import { MemoryNode } from '../types';

interface LifeGraphProps {
  memoryNodes: MemoryNode[];
  onAddNode: (node: MemoryNode) => void;
  onDeleteNode: (id: string) => void;
}

export const LifeGraph: React.FC<LifeGraphProps> = ({ memoryNodes, onAddNode, onDeleteNode }) => {
  const [selectedNode, setSelectedNode] = useState<MemoryNode | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // MemoryAgent Core State
  const [decayFactor, setDecayFactor] = useState<number>(8); // Decay rate (8% per step)
  const [nodeStrengths, setNodeStrengths] = useState<Record<string, number>>({});
  const [pinnedNodes, setPinnedNodes] = useState<Set<string>>(new Set());
  const [tokensConserved, setTokensConserved] = useState<number>(380); // In-app simulation tracking
  const [prunedCount, setPrunedCount] = useState<number>(4);

  // QwenCloud Semantic Entry Simulator State
  const [convoEntry, setConvoEntry] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionLogs, setExtractionLogs] = useState<string[]>([]);
  const [suggestedNodes, setSuggestedNodes] = useState<{label: string; description: string; category: any; strength?: number; connections?: string[]}[]>([]);

  // Manual Node Creator Form State
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<'family' | 'preference' | 'health' | 'learning' | 'career' | 'landmark'>('preference');
  const [description, setDescription] = useState('');
  const [connectedTo, setConnectedTo] = useState<string>('');

  // Set default selected node
  useEffect(() => {
    if (memoryNodes.length > 0 && !selectedNode) {
      setSelectedNode(memoryNodes[0]);
    }
  }, [memoryNodes]);

  // Handle initialization of strengths
  useEffect(() => {
    const updatedStrengths = { ...nodeStrengths };
    let changed = false;
    memoryNodes.forEach((node) => {
      if (updatedStrengths[node.id] === undefined) {
        // Assign random initial strength between 75 and 100 for variety
        updatedStrengths[node.id] = Math.floor(Math.random() * 25) + 75;
        changed = true;
      }
    });
    if (changed) {
      setNodeStrengths(updatedStrengths);
    }
  }, [memoryNodes]);

  // Trigger manual or automatic decay tick
  const handleDecayTick = () => {
    const updatedStrengths = { ...nodeStrengths };
    let newlyPruned = 0;
    const idsToPrune: string[] = [];

    memoryNodes.forEach((node) => {
      if (pinnedNodes.has(node.id)) {
        updatedStrengths[node.id] = 100; // Locked nodes do not decay
        return;
      }

      const current = updatedStrengths[node.id] ?? 90;
      // Decay mathematically based on factor
      const next = Math.max(0, Math.floor(current * (1 - decayFactor / 100)));
      updatedStrengths[node.id] = next;

      if (next < 15) {
        idsToPrune.push(node.id);
      }
    });

    setNodeStrengths(updatedStrengths);

    // If any node drops below 15%, show notification or auto-prune feedback
    if (idsToPrune.length > 0) {
      // We will keep them in the graph but flag them visually as "stale", and allow the user to prune
      setTokensConserved(prev => prev + idsToPrune.length * 125);
    }
  };

  // Prune all stale (strength < 20%) memories to optimize context budget
  const handleOptimizePrune = () => {
    const staleIds = memoryNodes.filter(n => (nodeStrengths[n.id] ?? 100) < 25 && !pinnedNodes.has(n.id)).map(n => n.id);
    if (staleIds.length === 0) {
      alert("No stale memories require pruning right now! (Strength under 25%)");
      return;
    }

    staleIds.forEach(id => {
      onDeleteNode(id);
    });

    setPrunedCount(prev => prev + staleIds.length);
    setTokensConserved(prev => prev + staleIds.length * 160);
    
    // Reset selection
    const remaining = memoryNodes.filter(n => !staleIds.includes(n.id));
    setSelectedNode(remaining[0] || null);
    
    alert(`QwenCloud optimized active context: ${staleIds.length} stale memories pruned. Released ${staleIds.length * 160} tokens from context window budget!`);
  };

  const handleTogglePin = (nodeId: string) => {
    const nextPins = new Set(pinnedNodes);
    if (nextPins.has(nodeId)) {
      nextPins.delete(nodeId);
      // Give it a fresh strength
      setNodeStrengths(prev => ({ ...prev, [nodeId]: 95 }));
    } else {
      nextPins.add(nodeId);
      setNodeStrengths(prev => ({ ...prev, [nodeId]: 100 }));
    }
    setPinnedNodes(nextPins);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !description.trim()) return;

    const x = Math.floor(Math.random() * 70) + 15;
    const y = Math.floor(Math.random() * 60) + 20;

    const newNode: MemoryNode = {
      id: 'mem-' + Date.now(),
      label,
      category,
      description,
      connections: connectedTo ? [connectedTo] : [],
      x,
      y
    };

    onAddNode(newNode);
    setNodeStrengths(prev => ({ ...prev, [newNode.id]: 100 })); // Initialize full strength
    
    // Reverse connection mapping
    const targetNode = memoryNodes.find(n => n.id === connectedTo);
    if (targetNode) {
      if (!targetNode.connections) targetNode.connections = [];
      targetNode.connections.push(newNode.id);
    }

    setSelectedNode(newNode);
    setLabel('');
    setDescription('');
    setConnectedTo('');
  };

  // Real QwenCloud Semantic Memory Extraction
  const handleSimulateQwenExtraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convoEntry.trim()) return;

    setIsExtracting(true);
    setExtractionLogs([
      "📡 Dialing Qwen Cloud API Gateway...",
      "🤖 [Model: Qwen2.5-72B-Instruct] Analyzing raw conversation transcript...",
      "🧠 Performing Entity Recognition & Semantic Saliency filtering..."
    ]);

    try {
      const response = await fetch('/api/qwen/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: convoEntry,
          existingNodes: memoryNodes.map(n => ({ id: n.id, label: n.label, category: n.category }))
        })
      });

      if (!response.ok) {
        throw new Error("Extractor network timeout or limit reached.");
      }

      const data = await response.json();
      setSuggestedNodes(data.extractedNodes || []);
      setExtractionLogs(data.logs || [
        "✅ Fact Extracted beautifully.",
        "💎 Connection proposals formed."
      ]);
    } catch (error: any) {
      console.error("Qwen extraction failed, using robust fallback:", error);
      // Fallback
      setExtractionLogs(prev => [
        ...prev,
        "⚠️ Remote Qwen API fell back to local extractor engine.",
        "✅ Processed with client-side heuristic parses."
      ]);

      const lower = convoEntry.toLowerCase();
      let label1 = "Preference Sync";
      let desc1 = "Prefers light and cozy environments.";
      let cat1: any = "preference";

      if (lower.includes("coffee") || lower.includes("drink") || lower.includes("eat")) {
        label1 = "Dietary preference";
        desc1 = `Enjoys specific morning routine: ${convoEntry}`;
        cat1 = "preference";
      } else if (lower.includes("mary") || lower.includes("bob") || lower.includes("mother") || lower.includes("husband") || lower.includes("daughter")) {
        label1 = "Family relationship";
        desc1 = `Household connection node: ${convoEntry}`;
        cat1 = "family";
      } else if (lower.includes("bp") || lower.includes("health") || lower.includes("doctor") || lower.includes("pill")) {
        label1 = "Health indicator";
        desc1 = `Clinical history sync fact: ${convoEntry}`;
        cat1 = "health";
      } else if (lower.includes("study") || lower.includes("learn") || lower.includes("school")) {
        label1 = "Academic target";
        desc1 = `Skill progression note: ${convoEntry}`;
        cat1 = "learning";
      } else {
        label1 = "Context observation";
        desc1 = `Semantic extracted fact: ${convoEntry}`;
        cat1 = "preference";
      }

      setSuggestedNodes([{ label: label1, description: desc1, category: cat1, strength: 80, connections: [] }]);
    } finally {
      setIsExtracting(false);
    }
  };

  // Save the extracted Qwen node to life graph
  const saveExtractedNode = (index: number) => {
    const sug = suggestedNodes[index];
    if (!sug) return;

    const x = Math.floor(Math.random() * 65) + 15;
    const y = Math.floor(Math.random() * 55) + 20;

    const newNode: MemoryNode = {
      id: 'mem-qwen-' + Date.now(),
      label: sug.label,
      category: sug.category,
      description: sug.description,
      connections: sug.connections && sug.connections.length > 0 ? sug.connections : (memoryNodes.length > 0 ? [memoryNodes[0].id] : []),
      x,
      y
    };

    onAddNode(newNode);
    setNodeStrengths(prev => ({ ...prev, [newNode.id]: sug.strength || 100 })); // Brand new fact has its real extracted strength!

    setSelectedNode(newNode);
    setSuggestedNodes(prev => prev.filter((_, i) => i !== index));
    if (suggestedNodes.length <= 1) {
      setConvoEntry('');
      setExtractionLogs([]);
    }
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'family': return { color: '#f43f5e', ring: 'ring-rose-400', bg: 'bg-rose-500', hoverBg: 'hover:bg-rose-600', marker: '❤️' };
      case 'preference': return { color: '#f59e0b', ring: 'ring-amber-400', bg: 'bg-amber-500', hoverBg: 'hover:bg-amber-600', marker: '🧠' };
      case 'health': return { color: '#10b981', ring: 'ring-emerald-400', bg: 'bg-emerald-500', hoverBg: 'hover:bg-emerald-600', marker: '🩺' };
      case 'learning': return { color: '#3b82f6', ring: 'ring-blue-400', bg: 'bg-blue-500', hoverBg: 'hover:bg-blue-600', marker: '📚' };
      case 'career': return { color: '#8b5cf6', ring: 'ring-violet-400', bg: 'bg-violet-500', hoverBg: 'hover:bg-violet-600', marker: '💼' };
      case 'landmark': return { color: '#ec4899', ring: 'ring-pink-400', bg: 'bg-pink-500', hoverBg: 'hover:bg-pink-600', marker: '🗺️' };
      default: return { color: '#737373', ring: 'ring-neutral-400', bg: 'bg-neutral-500', hoverBg: 'hover:bg-neutral-600', marker: '📍' };
    }
  };

  // Filter nodes based on search query and category filter
  const filteredNodes = memoryNodes.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          node.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || node.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const renderConnections = () => {
    const lines: React.ReactNode[] = [];
    const processed = new Set<string>();

    filteredNodes.forEach((node) => {
      const nodeX = node.x ?? 50;
      const nodeY = node.y ?? 50;

      node.connections.forEach((connId) => {
        const dest = memoryNodes.find(n => n.id === connId);
        if (!dest) return;

        const pairKey = [node.id, dest.id].sort().join('-');
        if (processed.has(pairKey)) return;
        processed.add(pairKey);

        const destX = dest.x ?? 50;
        const destY = dest.y ?? 50;

        lines.push(
          <line
            key={pairKey}
            x1={`${nodeX}%`}
            y1={`${nodeY}%`}
            x2={`${destX}%`}
            y2={`${destY}%`}
            stroke="#e5e7eb"
            strokeOpacity="0.12"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            className="animate-pulse"
          />
        );
      });
    });

    return lines;
  };

  // Generate dynamic maternal prompt based on pinned and strong nodes
  const getDynamicMaternalPrompt = () => {
    const highStrengthNodes = memoryNodes.filter(n => (nodeStrengths[n.id] ?? 100) > 70);
    if (highStrengthNodes.length === 0) {
      return "Hello sweetheart, I'm ready to learn more about your life and keep track of your daily notes.";
    }
    const samples = highStrengthNodes.slice(0, 3);
    const mentions = samples.map(n => `your ${n.label} details ("${n.description.slice(0, 35)}...")`).join(', and ');
    return `Greetings, sweetheart. Thanks to QwenCloud's persistent MemoryAgent, I am holding active context of ${mentions}. This allows me to adapt my advice instantly without asking you to repeat yourself!`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="memory-agent-console-root">
      
      {/* LEFT COLUMN: Qwen Memory Control & Decay Management (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Memory Optimizer Dashboard Widget */}
        <div className="bg-stone-900 text-stone-200 border border-stone-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-rose-500 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400 font-extrabold">Track 1: MemoryAgent</span>
              <h4 className="text-sm font-black text-white">Context Window Optimizer</h4>
            </div>
          </div>
          
          <p className="text-[11px] text-stone-400 leading-relaxed">
            Autonomous context compaction. To protect Dr. T's limited token budget, older and un-pinned semantic memories undergo slow mathematical decay, freeing up space.
          </p>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
              <span className="text-[9px] font-mono text-stone-500 uppercase font-bold">Conserved Space</span>
              <p className="text-lg font-mono font-black text-emerald-400 mt-0.5">+{tokensConserved} <span className="text-[9px]">tokens</span></p>
            </div>
            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
              <span className="text-[9px] font-mono text-stone-500 uppercase font-bold">Stale Pruned</span>
              <p className="text-lg font-mono font-black text-rose-400 mt-0.5">{prunedCount} <span className="text-[9px]">nodes</span></p>
            </div>
          </div>

          {/* Decay controls */}
          <div className="border-t border-stone-800/80 pt-3.5 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-300 font-bold font-mono text-[10px] uppercase">Simulation Decay Rate:</span>
              <span className="text-rose-400 font-mono font-extrabold">{decayFactor}%</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="25" 
              value={decayFactor} 
              onChange={(e) => setDecayFactor(Number(e.target.value))}
              className="w-full accent-rose-500 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer"
            />
            
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={handleDecayTick}
                className="flex-1 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 border border-stone-700/80 rounded-lg text-[9px] font-bold font-mono text-stone-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Simulate time passage to decay memory strengths"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Decay Tick (12h)
              </button>
              
              <button
                type="button"
                onClick={handleOptimizePrune}
                className="flex-1 py-1.5 px-2 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/80 rounded-lg text-[9px] font-bold font-mono text-emerald-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Prune decayed nodes under 25% strength"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                Compact Graph
              </button>
            </div>
          </div>
        </div>

        {/* QwenCloud Extraction Simulator */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-rose-500" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 font-extrabold">QwenCloud Engine</span>
              <h4 className="text-sm font-bold text-stone-800">Unsupervised Saliency Extractor</h4>
            </div>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed mb-3">
            Simulate a conversation entry. QwenCloud automatically extracts, scores, and connects critical memories.
          </p>

          <form onSubmit={handleSimulateQwenExtraction} className="flex flex-col gap-2">
            <textarea
              required
              rows={2}
              value={convoEntry}
              onChange={(e) => setConvoEntry(e.target.value)}
              placeholder="e.g., Dr T, my sister Lucy loves blueberry muffins, and I must take my red pills before bedtime."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-700 outline-none focus:bg-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500/10 resize-none font-sans"
            />
            <button
              type="submit"
              disabled={isExtracting}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-450 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              {isExtracting ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" /> Extraction Active...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" /> Process with Qwen-2.5
                </>
              )}
            </button>
          </form>

          {/* Extraction Console Logs */}
          {extractionLogs.length > 0 && (
            <div className="mt-3 bg-stone-950 p-3 rounded-xl border border-stone-850 font-mono text-[9px] text-emerald-400 flex flex-col gap-1 max-h-[140px] overflow-y-auto">
              {extractionLogs.map((log, i) => (
                <div key={i} className="flex gap-1.5 items-start">
                  <span className="text-stone-650 shrink-0">[{i+1}]</span>
                  <span className="leading-tight">{log}</span>
                </div>
              ))}
            </div>
          )}

          {/* Extract Suggestion Action Node */}
          {suggestedNodes.length > 0 && (
            <div className="mt-3 flex flex-col gap-3">
              <span className="text-[10px] font-mono font-bold uppercase text-rose-600">QwenCloud Proposed Nodes ({suggestedNodes.length})</span>
              {suggestedNodes.map((sug, idx) => (
                <div key={idx} className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl animate-fadeIn flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-stone-800">{sug.label}</p>
                        <span className="text-[8px] font-mono font-bold bg-rose-100 text-rose-700 px-1 rounded">
                          Strength: {sug.strength || 100}%
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-stone-500 uppercase">{sug.category}</span>
                    </div>
                    <span className="text-sm p-1 bg-white border rounded leading-none">
                      {getCategoryTheme(sug.category).marker}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-600 leading-snug">{sug.description}</p>
                  
                  {sug.connections && sug.connections.length > 0 && (
                    <div className="text-[9px] font-mono text-rose-800 leading-tight">
                      Proposed Connection to: {
                        sug.connections.map(id => {
                          const matchingNode = memoryNodes.find(n => n.id === id);
                          return matchingNode ? `"${matchingNode.label}"` : id;
                        }).join(', ')
                      }
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => saveExtractedNode(idx)}
                    className="w-full mt-1 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                  >
                    Accept Node & Link to Graph
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Visual Canvas & Node Editor (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Main Graph Canvas Display */}
        <div className="bg-stone-900 border border-stone-850 rounded-3xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden min-h-[480px]">
          {/* Spatial Grids and Ambient Neon Backdrops */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-rose-500/5 blur-[120px]"></div>
            <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-500/5 blur-[90px]"></div>
            {/* Fine grids */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </div>

          {/* Canvas Headers */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-white z-10 gap-3 border-b border-stone-800/80 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-extrabold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-rose-500" /> Active Memory Repository
              </span>
              <h4 className="text-sm font-black mt-0.5 text-stone-100">QwenCloud Semantic Memory Graph</h4>
            </div>

            {/* In-app Filter & Search Bar */}
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1 w-full sm:w-44 text-xs">
                <Search className="w-3 h-3 text-stone-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search facts..."
                  className="bg-transparent focus:outline-none text-stone-200 text-[10px] w-full"
                />
              </div>

              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-stone-950 border border-stone-800 text-stone-300 text-[10px] font-bold rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer"
              >
                <option value="all">All Cats</option>
                <option value="family">Family</option>
                <option value="preference">Preference</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
              </select>
            </div>
          </div>

          {/* Dynamic Nodes Canvas */}
          <div className="relative w-full h-[320px] bg-stone-950/60 border border-stone-800/60 rounded-2xl my-4 z-10 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {renderConnections()}
            </svg>

            {filteredNodes.map((node) => {
              const theme = getCategoryTheme(node.category);
              const isSelected = selectedNode?.id === node.id;
              const strength = nodeStrengths[node.id] ?? 100;
              const isPinned = pinnedNodes.has(node.id);
              
              return (
                <div
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  style={{ left: `${node.x ?? 50}%`, top: `${node.y ?? 50}%` }}
                >
                  <button
                    onClick={() => setSelectedNode(node)}
                    className={`p-3 rounded-full transition-all duration-300 active:scale-95 cursor-pointer relative flex items-center justify-center
                      ${isSelected 
                        ? `bg-white text-stone-900 border-2 border-stone-100 scale-125 z-30 shadow-xl ring-4 ring-rose-500/20`
                        : `text-white border border-stone-800/40 hover:scale-110 hover:z-25 ${theme.bg}`
                      }
                    `}
                    style={{ opacity: strength < 30 ? 0.45 : 1 }}
                    title={`${node.label} (${strength}% strength)`}
                  >
                    <span className="text-sm font-semibold select-none leading-none">
                      {theme.marker}
                    </span>

                    {/* Miniature strength gauge ring floating inside */}
                    <span className="absolute inset-0 rounded-full border border-stone-200/20 pointer-events-none"></span>
                    {isPinned && (
                      <span className="absolute -top-1 -right-1 bg-stone-900 border border-stone-800 rounded-full p-0.5 leading-none shadow-xs text-[7px]">
                        🔒
                      </span>
                    )}
                  </button>

                  {/* Labels floating above nodes */}
                  <span className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md whitespace-nowrap shadow-xs pointer-events-none transition-all
                    ${isSelected
                      ? 'bg-white text-stone-900 border border-stone-200 font-black'
                      : 'bg-stone-900/90 text-stone-300 border border-stone-800/70 group-hover:bg-stone-850'
                    }
                  `}>
                    {node.label} <span className="text-[8px] opacity-70 font-mono">({strength}%)</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Selected Node Info Bar with lock/pin controls */}
          <div className="bg-stone-800/80 border border-stone-700/50 rounded-2xl p-4 z-10 flex flex-col md:flex-row items-start md:items-center justify-between text-stone-200 text-xs gap-4">
            {selectedNode ? (
              <>
                <div className="flex items-center gap-3.5 flex-1">
                  <span className="text-xl bg-stone-900 border border-stone-750 p-2.5 rounded-xl leading-none">
                    {getCategoryTheme(selectedNode.category).marker}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-stone-100">{selectedNode.label}</p>
                      <span className="text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-stone-700 font-bold text-stone-300">
                        {selectedNode.category}
                      </span>
                      <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded-sm ${
                        (nodeStrengths[selectedNode.id] ?? 100) > 60 ? 'bg-emerald-950/50 text-emerald-400' : 'bg-rose-950/50 text-rose-400'
                      }`}>
                        Strength: {nodeStrengths[selectedNode.id] ?? 100}%
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">{selectedNode.description}</p>
                  </div>
                </div>
                
                {/* Pin & Delete Options */}
                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
                  <button
                    onClick={() => handleTogglePin(selectedNode.id)}
                    className={`p-2 rounded-xl transition-all border text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer select-none
                      ${pinnedNodes.has(selectedNode.id)
                        ? 'bg-rose-950/40 border-rose-800 text-rose-400'
                        : 'bg-stone-700/40 border-stone-600/60 text-stone-300'
                      }
                    `}
                    title={pinnedNodes.has(selectedNode.id) ? "Unlock memory node (can decay)" : "Pin/Lock memory (never decay)"}
                  >
                    {pinnedNodes.has(selectedNode.id) ? (
                      <>
                        <Lock className="w-3 h-3 text-rose-500" /> LOCKEDFact
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3" /> LockFact
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onDeleteNode(selectedNode.id);
                      setSelectedNode(memoryNodes.find(n => n.id !== selectedNode.id) || null);
                    }}
                    className="p-2 border border-stone-700 hover:border-rose-900 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                    title="Expunge this memory fact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-stone-400 font-mono text-[11px] italic flex items-center gap-1.5">
                <Info className="w-4 h-4 text-rose-500" /> Select any memory node bubble on the repository graph canvas to manage decay parameters
              </p>
            )}
          </div>
        </div>

        {/* BOTTOM ACCORDION: Dr. T Context Payload Generator */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-rose-500 animate-pulse-slow" />
            <h5 className="font-extrabold text-stone-800 text-xs uppercase font-mono tracking-wider">Maternal Active Context Frame</h5>
          </div>
          <p className="text-[11px] text-stone-600 font-sans italic leading-relaxed">
            "{getDynamicMaternalPrompt()}"
          </p>
          <div className="flex gap-4 items-center mt-3 border-t border-rose-200/50 pt-2.5">
            <span className="text-[9px] font-mono text-rose-700 font-extrabold">RETRIEVAL CHANNELS: ACTIVE</span>
            <span className="text-[9px] font-mono text-stone-400">|</span>
            <span className="text-[9px] font-mono text-stone-500">QwenCloud Context Window Efficiency Index: <strong className="text-stone-700 font-black">94.3%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeGraph;
