import React, { useState, useMemo } from 'react';
import { LivingCodeMapData, CodeMapNode, CodeMapEdge, NodeType } from '../types/lifeweaveTypes';
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  FileCode, 
  Cpu, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Code2, 
  Boxes, 
  Network
} from 'lucide-react';

interface LivingCodeMapProps {
  codeMapData: LivingCodeMapData;
  selectedNodeId?: string;
  onSelectNode: (node: CodeMapNode) => void;
}

export const LivingCodeMap: React.FC<LivingCodeMapProps> = ({
  codeMapData,
  selectedNodeId,
  onSelectNode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeInspectorNode, setActiveInspectorNode] = useState<CodeMapNode | null>(
    codeMapData.nodes.find(n => n.id === selectedNodeId) || codeMapData.nodes[0]
  );

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return codeMapData.nodes.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.symbol && node.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedTypeFilter === 'ALL' || node.type === selectedTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [codeMapData.nodes, searchQuery, selectedTypeFilter]);

  const handleNodeClick = (node: CodeMapNode) => {
    setActiveInspectorNode(node);
    onSelectNode(node);
  };

  const getNodeColor = (node: CodeMapNode) => {
    if (node.isClinicalOrSafetyCritical) return 'border-rose-500 bg-rose-950/40 text-rose-200 ring-2 ring-rose-500/40';
    switch (node.type) {
      case 'FILE': return 'border-cyan-500 bg-cyan-950/40 text-cyan-200';
      case 'SERVICE': return 'border-purple-500 bg-purple-950/40 text-purple-200';
      case 'MODULE': return 'border-amber-500 bg-amber-950/40 text-amber-200';
      case 'FUNCTION': return 'border-teal-500 bg-teal-950/40 text-teal-200';
      case 'TEST': return 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
      default: return 'border-slate-500 bg-slate-900/60 text-slate-200';
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>Living Code Map</span>
            <span>•</span>
            <span>Repository Topology & Semantic Graph</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            Interactive Code Relationships & Risk Boundary
          </h3>
        </div>

        {/* Filter & Zoom Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search file, symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-cyan-500 w-44"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-hidden"
          >
            <option value="ALL">All Types ({codeMapData.nodes.length})</option>
            <option value="FILE">Files</option>
            <option value="SERVICE">Services</option>
            <option value="MODULE">Modules</option>
            <option value="FUNCTION">Functions</option>
            <option value="TEST">Tests</option>
          </select>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 p-0.5 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.5))}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Area & Node Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAPH CANVAS (2 Columns on large) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/70 border border-slate-800 p-4 min-h-[440px] flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Nodes Grid Display */}
          <div 
            className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
          >
            {filteredNodes.map(node => {
              const isSelected = activeInspectorNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                    getNodeColor(node)
                  } ${isSelected ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20' : 'hover:scale-[1.02]'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs text-white">{node.name}</span>
                        {node.isClinicalOrSafetyCritical && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/30 text-rose-300 border border-rose-500/50 flex items-center space-x-0.5">
                            <ShieldAlert className="w-2.5 h-2.5" />
                            <span>CLINICAL</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                        {node.path}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-slate-300 uppercase">
                      {node.type}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-tight line-clamp-2">
                    {node.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] font-mono text-slate-400">
                    <span>Symbol: {node.symbol || 'N/A'}</span>
                    <span className="text-cyan-300 font-bold">{node.referencesCount || 0} refs</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Edges Visual Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>File</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Service</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Module</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Clinical/Safety</span>
              </span>
            </div>
            <span>{filteredNodes.length} nodes displayed</span>
          </div>

        </div>

        {/* NODE INSPECTOR PANE (1 Column) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
              Node Inspector
            </span>
            {activeInspectorNode?.isClinicalOrSafetyCritical ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Safety Critical
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                Standard Component
              </span>
            )}
          </div>

          {activeInspectorNode ? (
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-extrabold text-sm text-white">{activeInspectorNode.name}</div>
                <div className="text-[11px] font-mono text-cyan-400">{activeInspectorNode.path}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-snug">
                {activeInspectorNode.description}
              </div>

              {/* Callers & Callees */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Callers ({activeInspectorNode.callers?.length || 0}):
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeInspectorNode.callers && activeInspectorNode.callers.length > 0 ? (
                    activeInspectorNode.callers.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-[10px] italic">No direct callers</span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Callees & Outgoing Calls:
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeInspectorNode.callees && activeInspectorNode.callees.length > 0 ? (
                    activeInspectorNode.callees.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-[10px] italic">No callees recorded</span>
                  )}
                </div>
              </div>

              {/* Associated Tests */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Associated Unit & Integration Tests:
                </div>
                <div className="space-y-1">
                  {activeInspectorNode.associatedTests?.map((t, i) => (
                    <div key={i} className="p-1.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="truncate">{t}</span>
                    </div>
                  )) || <span className="text-slate-500 text-[10px] italic">No direct test file mapped</span>}
                </div>
              </div>

              {/* Clinical Safety Warning if Applicable */}
              {activeInspectorNode.isClinicalOrSafetyCritical && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-[11px] space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-rose-100">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Safety Boundary Active</span>
                  </div>
                  <p className="leading-snug">
                    Autonomous modification is disabled for this module. Any proposed patch requires explicit human review and attending developer ratification.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs italic">
              Select a node in the graph to inspect relationships
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
