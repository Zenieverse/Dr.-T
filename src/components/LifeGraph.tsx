import React, { useState } from 'react';
import { Database, Plus, Trash2, Milestone, Heart, Target, MapPin, Award, Smile } from 'lucide-react';
import { MemoryNode } from '../types';

interface LifeGraphProps {
  memoryNodes: MemoryNode[];
  onAddNode: (node: MemoryNode) => void;
  onDeleteNode: (id: string) => void;
}

export const LifeGraph: React.FC<LifeGraphProps> = ({ memoryNodes, onAddNode, onDeleteNode }) => {
  const [selectedNode, setSelectedNode] = useState<MemoryNode | null>(memoryNodes[0] || null);

  // New Node Form State
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<'family' | 'preference' | 'health' | 'learning' | 'career' | 'landmark'>('preference');
  const [description, setDescription] = useState('');
  const [connectedTo, setConnectedTo] = useState<string>('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !description.trim()) return;

    // Generate semi-random x and y within a clean coordinate boundary (percentage 10-90)
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
    
    // Auto hook reverse connection
    const targetNode = memoryNodes.find(n => n.id === connectedTo);
    if (targetNode) {
      targetNode.connections.push(newNode.id);
    }

    setSelectedNode(newNode);
    setLabel('');
    setDescription('');
    setConnectedTo('');
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'family': return { color: '#ef4444', ring: 'ring-red-400', bg: 'bg-red-500', marker: '❤️' };
      case 'preference': return { color: '#f59e0b', ring: 'ring-amber-400', bg: 'bg-amber-500', marker: '🧠' };
      case 'health': return { color: '#10b981', ring: 'ring-emerald-400', bg: 'bg-emerald-500', marker: '🩺' };
      case 'learning': return { color: '#3b82f6', ring: 'ring-blue-400', bg: 'bg-blue-500', marker: '📚' };
      case 'career': return { color: '#8b5cf6', ring: 'ring-violet-400', bg: 'bg-violet-500', marker: '💼' };
      case 'landmark': return { color: '#ec4899', ring: 'ring-pink-400', bg: 'bg-pink-500', marker: '🗺️' };
      default: return { color: '#737373', ring: 'ring-neutral-400', bg: 'bg-neutral-500', marker: '📍' };
    }
  };

  // Connect rendering lines by coordinate maps
  const renderConnections = () => {
    const lines: React.ReactNode[] = [];
    const processed = new Set<string>();

    memoryNodes.forEach((node) => {
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
            stroke="#e5e5e5"
            strokeWidth="3"
            strokeDasharray="4 4"
            className="animate-pulse duration-1000"
          />
        );
      });
    });

    return lines;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="lifegraph-dashboard-panel">
      {/* Visual Canvas Panel */}
      <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-inner flex flex-col justify-between relative overflow-hidden min-h-[460px]">
        {/* Neon Backdrop Glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-rose-500/10 blur-[120px]"></div>
          <div className="absolute top-1/4 right-1/4 w-36 h-36 rounded-full bg-emerald-500/5 blur-[90px]"></div>
        </div>

        {/* Canvas Header */}
        <div className="flex items-center justify-between text-white z-10">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-rose-500" /> Active Life-Graph Repository
            </span>
            <h4 className="text-sm font-bold mt-1 text-stone-200">Interactive Semantic Memory Networks</h4>
          </div>
          <div className="flex gap-2 text-[10px] font-mono text-stone-400">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Fam</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pref</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Health</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Learn</span>
          </div>
        </div>

        {/* Dynamic Nodes Stage rendering SVG + Position markers */}
        <div className="relative w-full h-[320px] bg-stone-950/60 border border-stone-800/80 rounded-2xl my-4 z-10">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {renderConnections()}
          </svg>

          {/* Render markers as spatial buttons in HTML so they have tooltips & clean layout */}
          {memoryNodes.map((node) => {
            const theme = getCategoryTheme(node.category);
            const isSelected = selectedNode?.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-300 active:scale-90 cursor-pointer
                  ${isSelected 
                    ? `bg-white text-stone-900 border-[3px] scale-125 z-30 shadow-lg ${node.category === 'family' ? 'border-red-500 ring-4 ring-red-500/20' : node.category === 'health' ? 'border-emerald-500 ring-4 ring-emerald-500/20' : 'border-amber-500 ring-4 ring-amber-500/20'}`
                    : `text-white border border-stone-700/50 hover:scale-115 hover:z-25 ${theme.bg}`
                  }
                `}
                style={{ left: `${node.x ?? 50}%`, top: `${node.y ?? 50}%` }}
                title={`${node.label}: ${node.description}`}
              >
                <div className="text-sm font-semibold select-none leading-none">
                  {isSelected ? theme.marker : theme.marker}
                </div>
                {/* Labels floating above nodes */}
                <span className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap shadow-xs pointer-events-none
                  ${isSelected
                    ? 'bg-white text-stone-900 border border-stone-200'
                    : 'bg-stone-900/90 text-stone-300 border border-stone-800'
                  }
                `}>
                  {node.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Node Detail view */}
        <div className="bg-stone-800/90 border border-stone-700/50 rounded-xl p-3 z-10 flex items-center justify-between text-stone-200 text-xs">
          {selectedNode ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-xl bg-stone-900 p-2 rounded-lg border border-stone-700 leading-none">
                  {getCategoryTheme(selectedNode.category).marker}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-stone-100">{selectedNode.label}</p>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-stone-700 font-bold text-stone-300">
                      {selectedNode.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{selectedNode.description}</p>
                </div>
              </div>
              
              {/* Delete capability */}
              {memoryNodes.length > 5 && (
                <button
                  onClick={() => {
                    onDeleteNode(selectedNode.id);
                    setSelectedNode(memoryNodes.find(n => n.id !== selectedNode.id) || null);
                  }}
                  className="p-1 px-[7px] text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                  title="Expunge this memory sync node"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          ) : (
            <p className="text-stone-400 font-mono text-[11px] italic">Select any memory bubble node on the spatial repository map</p>
          )}
        </div>
      </div>

      {/* Editor & Add memory node Form */}
      <div className="bg-white/80 border border-stone-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-5">
        <div>
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-rose-550 flex items-center gap-1.5">
            <Milestone className="w-3.5 h-3.5" /> Teach Dr. T memory data
          </span>
          <h4 className="font-bold text-stone-800 text-sm mt-1">Append Personal Life Milestones</h4>
          <p className="text-[11px] text-stone-400 leading-relaxed mt-1">
            Build and weave Dr. T's custom context base about your personal goals, preferences, or household members.
          </p>
        </div>

        <form onSubmit={handleAdd} className="flex flex-col gap-3.5 flex-1">
          {/* Label name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-stone-500">Node Tag / Title</label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Daughter Mary, High BP, Coffee preference"
              className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-700 outline-none focus:border-rose-450 focus:ring-1 focus:ring-rose-450/10"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-stone-500">Core Subject Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs font-semibold text-stone-700 cursor-pointer"
            >
              <option value="preference">🧠 Preference / Habit</option>
              <option value="family">❤️ Family & Spouses</option>
              <option value="health">🩺 Health Check History</option>
              <option value="learning">📚 Learning Progress</option>
              <option value="career">💼 Career & Projects</option>
              <option value="landmark">🗺️ Major Life Milestone</option>
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-stone-500">Memory Content & Details</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Underlying details that Dr. T will instantly remember..."
              rows={3}
              className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs text-stone-700 outline-none focus:border-rose-450 focus:ring-1 focus:ring-rose-450/10 resize-none"
            />
          </div>

          {/* Connection selection */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-stone-500">Link Semantic Linkage</label>
            <select
              value={connectedTo}
              onChange={(e) => setConnectedTo(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs text-stone-700 cursor-pointer text-stone-500"
            >
              <option value="">No connection (Standalone core)</option>
              {memoryNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  Link directly with: {n.label} [{n.category}]
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] mt-auto"
          >
            <Plus className="w-4 h-4" /> Save node context
          </button>
        </form>
      </div>
    </div>
  );
};
export default LifeGraph;
