import React, { useState } from 'react';
import { 
  Network, Search, Filter, Sparkles, BookOpen, Layers, 
  ExternalLink, ZoomIn, ZoomOut, RefreshCw, Compass, ArrowRight
} from 'lucide-react';
import { MOCK_GRAPH_NODES, MOCK_GRAPH_EDGES } from '../data/mockKnowledgeGraph';
import { KnowledgeNode, KnowledgeEdge, KnowledgeBranchId } from '../types';
import { KNOWLEDGE_BRANCHES } from '../data/branchesData';

interface KnowledgeGraphExplorerProps {
  onOpenTribWithContext: (contextTopic: string, query?: string) => void;
  onOpenBookFromNode?: (bookTitle: string) => void;
}

export const KnowledgeGraphExplorer: React.FC<KnowledgeGraphExplorerProps> = ({
  onOpenTribWithContext,
  onOpenBookFromNode
}) => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(MOCK_GRAPH_NODES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<KnowledgeBranchId | 'ALL'>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const filteredNodes = MOCK_GRAPH_NODES.filter(node => {
    const matchesSearch = 
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedBranch !== 'ALL' && node.branchId !== selectedBranch) return false;
    return true;
  });

  const connectedEdges = MOCK_GRAPH_EDGES.filter(
    e => selectedNode && (e.source === selectedNode.id || e.target === selectedNode.id)
  );

  const getConnectedNode = (edge: KnowledgeEdge, currentId: string): KnowledgeNode | undefined => {
    const otherId = edge.source === currentId ? edge.target : edge.source;
    return MOCK_GRAPH_NODES.find(n => n.id === otherId);
  };

  const getBranchColor = (branchId: KnowledgeBranchId) => {
    const branch = KNOWLEDGE_BRANCHES.find(b => b.id === branchId);
    if (!branch) return '#10b981';
    switch (branchId) {
      case 'earth': return '#059669';
      case 'agriculture': return '#16a34a';
      case 'literature': return '#d97706';
      case 'zen': return '#0d9488';
      case 'work': return '#4f46e5';
      case 'science': return '#2563eb';
      case 'future': return '#7c3aed';
      default: return '#10b981';
    }
  };

  return (
    <div id="knowledge-graph-explorer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <Network className="w-4 h-4" />
            <span>Living Conceptual Topology</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Knowledge Graph & Interconnected Ideas
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Visualizing relationships between mycorrhizal networks, classical poetry, commons governance, and deep-time ethics
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="graph-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search ideas, authors, species..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Main Graph Grid with SVG Canvas & Node Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Graph View (2 Cols on lg) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm p-4 relative overflow-hidden flex flex-col min-h-[540px]">
          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-stone-100/90 dark:bg-stone-800/90 backdrop-blur-sm p-1 rounded-xl border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
              title="Reset Zoom"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG Map */}
          <div className="flex-1 w-full h-full flex items-center justify-center overflow-auto">
            <svg
              id="trib-knowledge-svg-canvas"
              viewBox="0 0 880 620"
              className="w-full h-full max-h-[580px] transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Grid Background */}
              <defs>
                <pattern id="graphGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-stone-200/60 dark:text-stone-800/60" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#graphGrid)" />

              {/* Render Edges */}
              {MOCK_GRAPH_EDGES.map(edge => {
                const sourceNode = MOCK_GRAPH_NODES.find(n => n.id === edge.source);
                const targetNode = MOCK_GRAPH_NODES.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isConnectedToSelected = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);

                return (
                  <g key={edge.id}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isConnectedToSelected ? '#10b981' : '#cbd5e1'}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1.2}
                      strokeDasharray={edge.relation === 'questions' ? '4 4' : 'none'}
                      className="dark:stroke-stone-700 transition-all duration-300"
                    />
                  </g>
                );
              })}

              {/* Render Nodes */}
              {filteredNodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const nodeColor = getBranchColor(node.branchId);

                return (
                  <g
                    key={node.id}
                    id={`graph-node-${node.id}`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNode(node)}
                    transform={`translate(${node.x}, ${node.y})`}
                  >
                    {/* Node Outer Glow if selected */}
                    {isSelected && (
                      <circle
                        r="24"
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="3"
                        strokeOpacity="0.4"
                        className="animate-pulse"
                      />
                    )}

                    {/* Node Main Circle */}
                    <circle
                      r={isSelected ? "18" : "14"}
                      fill={nodeColor}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-all duration-200 group-hover:scale-110 shadow-md"
                    />

                    {/* Node Label */}
                    <text
                      y="28"
                      textAnchor="middle"
                      className={`text-[11px] font-sans font-semibold fill-stone-800 dark:fill-stone-200 select-none ${
                        isSelected ? 'font-bold underline' : ''
                      }`}
                    >
                      {node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label}
                    </text>

                    {/* Type Tag */}
                    <text
                      y="-20"
                      textAnchor="middle"
                      className="text-[9px] fill-stone-400 select-none"
                    >
                      {node.type}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Node Detail Inspector Drawer */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm p-6 flex flex-col justify-between space-y-6">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {selectedNode.type}
                  </span>
                  <span className="text-[11px] text-stone-400">{selectedNode.era}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                  {selectedNode.label}
                </h3>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-0.5">
                    Core Conceptual Model:
                  </span>
                  <p>{selectedNode.description}</p>
                </div>

                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-0.5">
                    Significance & Impact:
                  </span>
                  <p>{selectedNode.significance}</p>
                </div>

                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-0.5">
                    Provenance:
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                    {selectedNode.provenance.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Connected Relationships list */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Connected Branches ({connectedEdges.length}):</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {connectedEdges.map(edge => {
                    const otherNode = getConnectedNode(edge, selectedNode.id);
                    if (!otherNode) return null;
                    return (
                      <div
                        key={edge.id}
                        onClick={() => setSelectedNode(otherNode)}
                        className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-stone-200 dark:border-stone-700 cursor-pointer text-xs transition-colors"
                      >
                        <div className="flex items-center justify-between font-medium text-stone-800 dark:text-stone-200">
                          <span>{otherNode.label}</span>
                          <span className="text-[10px] text-stone-400 uppercase">{edge.relation.replace('_', ' ')}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                          {edge.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-stone-400 text-xs">
              Click any node on the knowledge graph to inspect its primary relationships
            </div>
          )}

          {/* Action Footer */}
          {selectedNode && (
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <button
                id="ask-trib-graph-node-btn"
                onClick={() => onOpenTribWithContext(selectedNode.label, `Please synthesize the relationship between ${selectedNode.label} and other disciplines.`)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Trib to Bridge this Node</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
