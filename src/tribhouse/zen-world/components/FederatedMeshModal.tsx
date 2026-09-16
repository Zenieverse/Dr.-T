import React, { useState, useEffect } from 'react';
import { 
  Network, ShieldCheck, RefreshCw, X, Wifi, Server, 
  Globe, Lock, Activity, CheckCircle2, ArrowRight, 
  Send, Plus, Layers, Zap, Terminal, ExternalLink,
  Cpu, Database, Sparkles, AlertCircle, Share2
} from 'lucide-react';
import { 
  ConnectedLibrary, MeshGossipPacket, MeshTopologyLink, 
  MeshHealthMetrics 
} from '../types';
import { federatedMesh } from '../services/federatedMeshService';

interface FederatedMeshModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedNodeId?: string;
  onSelectLibraryInView?: (id: string) => void;
}

type MeshTab = 'TOPOLOGY' | 'NODES' | 'GOSSIP_STREAM' | 'ADD_NODE';

export const FederatedMeshModal: React.FC<FederatedMeshModalProps> = ({
  isOpen,
  onClose,
  initialSelectedNodeId,
  onSelectLibraryInView
}) => {
  const [activeTab, setActiveTab] = useState<MeshTab>('TOPOLOGY');
  const [nodes, setNodes] = useState<ConnectedLibrary[]>(federatedMesh.getNodes());
  const [metrics, setMetrics] = useState<MeshHealthMetrics>(federatedMesh.getHealthMetrics());
  const [gossipPackets, setGossipPackets] = useState<MeshGossipPacket[]>(federatedMesh.getGossipHistory());
  const [selectedNode, setSelectedNode] = useState<ConnectedLibrary | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<{ step: number; total: number; msg: string } | null>(null);

  // Form state for adding custom peer node
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeLocation, setNewNodeLocation] = useState('');
  const [newNodeCountry, setNewNodeCountry] = useState('');
  const [newNodeFlag, setNewNodeFlag] = useState('🏛️');
  const [newNodeProtocol, setNewNodeProtocol] = useState('OPDS 2.0 / P2P Mesh');
  const [newNodeEndpoint, setNewNodeEndpoint] = useState('https://archive.zen-federated.net/feed.json');
  const [newNodeCount, setNewNodeCount] = useState(350);
  const [newNodeDesc, setNewNodeDesc] = useState('');
  const [nodeAddSuccess, setNodeAddSuccess] = useState(false);

  useEffect(() => {
    const unsub = federatedMesh.subscribe(() => {
      setNodes(federatedMesh.getNodes());
      setMetrics(federatedMesh.getHealthMetrics());
      setGossipPackets(federatedMesh.getGossipHistory());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (initialSelectedNodeId) {
      const found = federatedMesh.getNodeById(initialSelectedNodeId);
      if (found) setSelectedNode(found);
    } else if (nodes.length > 0 && !selectedNode) {
      setSelectedNode(nodes[0]);
    }
  }, [initialSelectedNodeId, nodes]);

  if (!isOpen) return null;

  const handleTriggerPing = async () => {
    setIsPinging(true);
    await federatedMesh.pingAllNodes();
    setTimeout(() => {
      setIsPinging(false);
    }, 450);
  };

  const handleTriggerGossipSync = async () => {
    setIsSyncing(true);
    setSyncProgress({ step: 0, total: 5, msg: 'Broadcasting Merkle tree discovery...' });

    await federatedMesh.broadcastGossipSync((packet, step, total) => {
      setSyncProgress({
        step,
        total,
        msg: packet.message
      });
    });

    setTimeout(() => {
      setIsSyncing(false);
      setSyncProgress(null);
    }, 600);
  };

  const handleRegisterNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim() || !newNodeLocation.trim()) return;

    const created = federatedMesh.registerPeerNode({
      name: newNodeName,
      location: newNodeLocation,
      country: newNodeCountry || 'Sovereign Node',
      flag: newNodeFlag || '🏛️',
      protocol: newNodeProtocol,
      endpointUrl: newNodeEndpoint,
      collectionCount: Number(newNodeCount) || 100,
      description: newNodeDesc || 'Decentralized peer node integrated into the Zen World Federated Mesh.'
    });

    setNodeAddSuccess(true);
    setSelectedNode(created);
    setNewNodeName('');
    setNewNodeLocation('');
    setNewNodeDesc('');

    setTimeout(() => {
      setNodeAddSuccess(false);
      setActiveTab('NODES');
    }, 1800);
  };

  const links = federatedMesh.getTopologyLinks();

  return (
    <div 
      id="federated-mesh-modal-overlay"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div 
        id="federated-mesh-modal-dialog"
        className="bg-stone-900 border border-emerald-900/60 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col text-stone-100 shadow-2xl overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="p-5 sm:p-6 border-b border-stone-800 bg-stone-950/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
              <Network className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-white tracking-tight">
                  Zen World Federated Mesh
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  P2P Mesh Online
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-stone-800 text-stone-400 border border-stone-700">
                  Block #{metrics.currentBlockHeight}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Zero-trust decentralized topology connecting sovereign temple archives, monastic repositories & contemplative labs.
              </p>
            </div>
          </div>

          {/* Quick Actions & Close */}
          <div className="flex items-center gap-2">
            <button
              id="mesh-sync-broadcast-btn"
              onClick={handleTriggerGossipSync}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-950/40 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-200 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Gossip Syncing...' : 'Broadcast Gossip Sync'}</span>
            </button>

            <button
              id="mesh-ping-all-btn"
              onClick={handleTriggerPing}
              disabled={isPinging}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition"
              title="Measure Latency"
            >
              <Wifi className={`w-3.5 h-3.5 text-emerald-400 ${isPinging ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">Ping Latencies</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition"
              title="Close Explorer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Live Mesh Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 p-3 sm:px-6 bg-stone-950/40 border-b border-stone-800/80 text-xs font-mono">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-stone-900/60 border border-stone-800">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <span className="text-stone-500 text-[9px] block uppercase">Nodes</span>
              <span className="font-bold text-stone-200">{metrics.totalNodes} Connected</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-stone-900/60 border border-stone-800">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <div>
              <span className="text-stone-500 text-[9px] block uppercase">Avg Latency</span>
              <span className="font-bold text-teal-300">{metrics.avgLatencyMs} ms</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-stone-900/60 border border-stone-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <span className="text-stone-500 text-[9px] block uppercase">Trust Score</span>
              <span className="font-bold text-emerald-400">{metrics.zeroTrustScore}% Valid</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-stone-900/60 border border-stone-800">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <span className="text-stone-500 text-[9px] block uppercase">Indexed Scrolls</span>
              <span className="font-bold text-amber-300">{metrics.totalManuscriptsIndexed.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-stone-900/60 border border-stone-800">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <div>
              <span className="text-stone-500 text-[9px] block uppercase">Gossip Packets</span>
              <span className="font-bold text-indigo-300">{gossipPackets.length} logged</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-stone-900/60 border border-stone-800">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <div>
              <span className="text-stone-500 text-[9px] block uppercase">Encryption</span>
              <span className="font-bold text-stone-200">ChaCha20 / TLS 1.3</span>
            </div>
          </div>
        </div>

        {/* Sync Progress Banner (When active) */}
        {syncProgress && (
          <div className="px-6 py-2.5 bg-emerald-950/80 border-b border-emerald-800 flex items-center justify-between text-xs text-emerald-200 animate-fadeIn">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Step {syncProgress.step} of {syncProgress.total}: {syncProgress.msg}</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">
              {Math.round((syncProgress.step / syncProgress.total) * 100)}%
            </span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-stone-800 flex items-center gap-2 overflow-x-auto bg-stone-950/30">
          <button
            onClick={() => setActiveTab('TOPOLOGY')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'TOPOLOGY'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Interactive Mesh Topology</span>
          </button>

          <button
            onClick={() => setActiveTab('NODES')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'NODES'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Peer Node Directory ({nodes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('GOSSIP_STREAM')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'GOSSIP_STREAM'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Live Gossip Stream ({gossipPackets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ADD_NODE')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'ADD_NODE'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect New Peer Node</span>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: INTERACTIVE TOPOLOGY */}
          {activeTab === 'TOPOLOGY' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SVG Visualizer */}
                <div className="lg:col-span-2 bg-stone-950/80 rounded-3xl p-5 border border-stone-800 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[440px] overflow-hidden">
                  <div className="absolute top-3 left-3 flex items-center gap-2 text-[11px] font-mono text-stone-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Live Constellation Routing (Click Node to Inspect)</span>
                  </div>

                  {/* SVG Constellation Graph */}
                  <svg className="w-full h-full max-w-[480px] max-h-[440px] select-none" viewBox="-220 -220 440 440">
                    <defs>
                      <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>

                    {/* Orbit Ring Guides */}
                    <circle cx="0" cy="0" r="160" fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="0" cy="0" r="90" fill="none" stroke="#27272a" strokeWidth="0.75" strokeDasharray="2 4" />

                    {/* Central Sovereign Client Node */}
                    <circle cx="0" cy="0" r="46" fill="url(#centralGlow)" />
                    <circle cx="0" cy="0" r="28" fill="#18181b" stroke="#10b981" strokeWidth="2.5" />
                    <text x="0" y="-4" textAnchor="middle" fill="#ecfdf5" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                      Trib-House
                    </text>
                    <text x="0" y="9" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="monospace">
                      Local Client
                    </text>

                    {/* Render Links between Nodes */}
                    {nodes.map((node, i) => {
                      const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
                      const radius = 160;
                      const x = radius * Math.cos(angle);
                      const y = radius * Math.sin(angle);

                      const nextAngle = ((i + 1) / nodes.length) * 2 * Math.PI - Math.PI / 2;
                      const nextX = radius * Math.cos(nextAngle);
                      const nextY = radius * Math.sin(nextAngle);

                      const isSelected = selectedNode?.id === node.id;

                      return (
                        <g key={`links-${node.id}`}>
                          {/* Radial Link to Center */}
                          <line
                            x1="0"
                            y1="0"
                            x2={x}
                            y2={y}
                            stroke={isSelected ? '#34d399' : '#3f3f46'}
                            strokeWidth={isSelected ? '2' : '1'}
                            strokeDasharray={isSelected ? 'none' : '3 3'}
                            opacity={isSelected ? 1 : 0.6}
                          />

                          {/* Ring Link to Next Node */}
                          <line
                            x1={x}
                            y1={y}
                            x2={nextX}
                            y2={nextY}
                            stroke={isSelected ? '#10b981' : '#27272a'}
                            strokeWidth="1.2"
                          />
                        </g>
                      );
                    })}

                    {/* Render Outer Nodes */}
                    {nodes.map((node, i) => {
                      const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
                      const radius = 160;
                      const x = radius * Math.cos(angle);
                      const y = radius * Math.sin(angle);
                      const isSelected = selectedNode?.id === node.id;

                      return (
                        <g 
                          key={`node-circle-${node.id}`} 
                          className="cursor-pointer transition-transform hover:scale-110"
                          onClick={() => setSelectedNode(node)}
                        >
                          {isSelected && (
                            <circle cx={x} cy={y} r="34" fill="#059669" opacity="0.25" className="animate-pulse" />
                          )}
                          <circle
                            cx={x}
                            cy={y}
                            r="25"
                            fill={isSelected ? '#064e3b' : '#1c1917'}
                            stroke={isSelected ? '#34d399' : '#52525b'}
                            strokeWidth={isSelected ? '3' : '1.5'}
                          />
                          <text x={x} y={y - 3} textAnchor="middle" fontSize="14">
                            {node.flag}
                          </text>
                          <text 
                            x={x} 
                            y={y + 12} 
                            textAnchor="middle" 
                            fill={isSelected ? '#6ee7b7' : '#a1a1aa'} 
                            fontSize="8" 
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {node.latencyMs}ms
                          </text>

                          {/* Outer Label */}
                          <text
                            x={x * 1.3}
                            y={y * 1.3 + 4}
                            textAnchor={x > 20 ? 'start' : x < -20 ? 'end' : 'middle'}
                            fill={isSelected ? '#ffffff' : '#d4d4d8'}
                            fontSize="9"
                            fontWeight={isSelected ? 'bold' : 'normal'}
                            className="pointer-events-none"
                          >
                            {node.name.split(' ')[0]} {node.name.split(' ')[1] || ''}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <div className="absolute bottom-3 right-3 text-[10px] font-mono text-stone-500">
                    TLS 1.3 Mutually Authenticated Mesh
                  </div>
                </div>

                {/* Selected Node Detailed Inspector */}
                <div className="bg-stone-950/80 rounded-3xl p-5 border border-stone-800 flex flex-col justify-between space-y-4">
                  {selectedNode ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{selectedNode.flag}</span>
                          <div>
                            <h3 className="font-serif font-bold text-white text-base leading-tight">
                              {selectedNode.name}
                            </h3>
                            {selectedNode.nativeScript && (
                              <div className="text-stone-400 text-xs font-serif">
                                {selectedNode.nativeScript}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {selectedNode.status}
                        </span>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed">
                        {selectedNode.description}
                      </p>

                      <div className="space-y-2 pt-1 font-mono text-xs">
                        <div className="flex justify-between p-2 rounded-xl bg-stone-900 border border-stone-800">
                          <span className="text-stone-400">Location:</span>
                          <span className="text-stone-200">{selectedNode.location}, {selectedNode.country}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-xl bg-stone-900 border border-stone-800">
                          <span className="text-stone-400">Round-Trip Latency:</span>
                          <span className="text-emerald-400 font-bold">{selectedNode.latencyMs} ms</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-xl bg-stone-900 border border-stone-800">
                          <span className="text-stone-400">Indexed Texts:</span>
                          <span className="text-amber-400 font-bold">{selectedNode.collectionCount.toLocaleString()} works</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-xl bg-stone-900 border border-stone-800">
                          <span className="text-stone-400">Protocol:</span>
                          <span className="text-teal-400 truncate max-w-[150px]">{selectedNode.protocol}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                          <span className="text-stone-400 block text-[10px] uppercase">SHA-256 Public Fingerprint</span>
                          <span className="text-[10px] text-stone-300 break-all select-all font-mono">
                            {selectedNode.shaCertificateFingerprint}
                          </span>
                        </div>
                      </div>

                      {onSelectLibraryInView && (
                        <button
                          onClick={() => {
                            onSelectLibraryInView(selectedNode.id);
                            onClose();
                          }}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Filter Zen World Books by this Node</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-stone-500 text-xs">
                      Click any node in the constellation to view its peer telemetries.
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
                    <span>Mesh Consensus: PBFT-Lite</span>
                    <span>Zero-Day Shield: Active</span>
                  </div>
                </div>
              </div>

              {/* Node Strip below visualizer */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Quick Node Selector
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {nodes.map(node => (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 flex items-center gap-2 transition ${
                        selectedNode?.id === node.id
                          ? 'bg-emerald-600 text-white font-bold shadow-sm'
                          : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                      }`}
                    >
                      <span>{node.flag}</span>
                      <span className="truncate max-w-[130px]">{node.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400">{node.latencyMs}ms</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PEER NODE DIRECTORY */}
          {activeTab === 'NODES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-white text-base">
                    Connected Federated Nodes ({nodes.length})
                  </h3>
                  <p className="text-xs text-stone-400">
                    Cryptographically validated institutional repositories and monastic vaults.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('ADD_NODE')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Connect Node</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nodes.map(node => (
                  <div
                    key={node.id}
                    className="p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-600/70 transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{node.flag}</span>
                          <div>
                            <h4 className="font-bold text-white text-sm leading-tight">
                              {node.name}
                            </h4>
                            <span className="text-[11px] text-stone-400">
                              {node.location}, {node.country}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {node.latencyMs}ms
                        </span>
                      </div>

                      <p className="text-xs text-stone-400 line-clamp-2">
                        {node.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-900 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-stone-500">Protocol:</span>
                        <span className="text-teal-400 truncate max-w-[150px]">{node.protocol}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-stone-500">Collection:</span>
                        <span className="text-amber-400 font-bold">{node.collectionCount.toLocaleString()} works</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-stone-500">Trust Score:</span>
                        <span className="text-emerald-400">{node.trustScore}% Verified</span>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedNode(node);
                            setActiveTab('TOPOLOGY');
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
                        >
                          Inspect Topology
                        </button>
                        {onSelectLibraryInView && (
                          <button
                            onClick={() => {
                              onSelectLibraryInView(node.id);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold"
                          >
                            Filter Works
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE GOSSIP STREAM */}
          {activeTab === 'GOSSIP_STREAM' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-white text-base">
                    Live Peer Gossip Log
                  </h3>
                  <p className="text-xs text-stone-400">
                    Real-time broadcast stream of cryptographic handshakes, block consensus, and zero-day threat updates.
                  </p>
                </div>
                <button
                  onClick={handleTriggerGossipSync}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Broadcast Sync</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-black border border-stone-800 font-mono text-xs space-y-2.5 max-h-[480px] overflow-y-auto">
                {gossipPackets.map((pkt) => (
                  <div 
                    key={pkt.id} 
                    className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800/80 space-y-1 hover:border-emerald-700/50 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500">{pkt.timestamp}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          pkt.eventType === 'BLOCK_CONSENSUS' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          pkt.eventType === 'ZERO_DAY_THREAT_UPDATE' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          pkt.eventType === 'CATALOG_MANIFEST_SYNC' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                          pkt.eventType === 'NODE_JOIN' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                          'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {pkt.eventType}
                        </span>
                        <span className="text-stone-400 font-bold">
                          {pkt.sourceNodeName}
                        </span>
                        {pkt.targetNodeName && (
                          <>
                            <ArrowRight className="w-3 h-3 text-stone-600" />
                            <span className="text-stone-400">{pkt.targetNodeName}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400">
                        <span>Block #{pkt.blockHeight}</span>
                        <span>{pkt.bytesTransferred} bytes</span>
                        <span className="text-emerald-400">✓ Verified</span>
                      </div>
                    </div>
                    <div className="text-stone-200 text-xs pl-1">
                      {pkt.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONNECT NEW PEER NODE */}
          {activeTab === 'ADD_NODE' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="font-serif font-bold text-white text-lg">
                  Connect Custom Temple or University Node
                </h3>
                <p className="text-xs text-stone-400">
                  Register a decentralized OPDS 2.0, IPFS, or Z39.50 repository into the Sovereign Trib-House mesh.
                </p>
              </div>

              {nodeAddSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold">Peer Node Connected Successfully!</div>
                    <div>Generating cryptographic trust certificate and broadcasting to mesh peers...</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleRegisterNode} className="space-y-4 bg-stone-950 p-6 rounded-3xl border border-stone-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Node Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zen Hermitage Archive of Sapa"
                      value={newNodeName}
                      onChange={e => setNewNodeName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Location / City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fansipan Ridge, Lào Cai"
                      value={newNodeLocation}
                      onChange={e => setNewNodeLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Country & Emoji Flag</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Flag: 🇻🇳"
                        value={newNodeFlag}
                        onChange={e => setNewNodeFlag(e.target.value)}
                        className="w-20 px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white text-center"
                      />
                      <input
                        type="text"
                        placeholder="e.g. Vietnam"
                        value={newNodeCountry}
                        onChange={e => setNewNodeCountry(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Routing Protocol</label>
                    <select
                      value={newNodeProtocol}
                      onChange={e => setNewNodeProtocol(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
                    >
                      <option value="OPDS 2.0 / P2P Mesh">OPDS 2.0 / P2P Mesh</option>
                      <option value="IPFS / Decentralized WebDAV">IPFS / Decentralized WebDAV</option>
                      <option value="Z39.50 / TLS 1.3 Federated Search">Z39.50 / TLS 1.3 Federated Search</option>
                      <option value="Sovereign P2P Encrypted Mesh">Sovereign P2P Encrypted Mesh</option>
                      <option value="OAI-PMH Open Access">OAI-PMH Open Access</option>
                      <option value="Decentralized Cryptographic Vault">Decentralized Cryptographic Vault</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-stone-300">Manifest Endpoint URL</label>
                    <input
                      type="url"
                      placeholder="https://temple.zen-mesh.org/catalog.json"
                      value={newNodeEndpoint}
                      onChange={e => setNewNodeEndpoint(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-stone-300">Estimated Manuscript Volumes</label>
                    <input
                      type="number"
                      min={1}
                      max={50000}
                      value={newNodeCount}
                      onChange={e => setNewNodeCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-stone-300">Archive Description</label>
                    <textarea
                      rows={3}
                      placeholder="Lineage, traditional focus, or research corpus highlights..."
                      value={newNodeDesc}
                      onChange={e => setNewNodeDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('TOPOLOGY')}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md hover:from-emerald-500 hover:to-teal-500"
                  >
                    Join & Authenticate Peer Node
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 bg-stone-950 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted with Ed25519 signatures & ChaCha20-Poly1305 symmetric tunnels.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold transition"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
