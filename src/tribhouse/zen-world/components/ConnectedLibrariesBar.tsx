import React, { useState } from 'react';
import { 
  Network, ShieldCheck, RefreshCw, CheckCircle2, Server, 
  ExternalLink, Globe, Wifi, Activity, Lock, Cpu
} from 'lucide-react';
import { ConnectedLibrary } from '../types';
import { federatedMesh } from '../services/federatedMeshService';

interface ConnectedLibrariesBarProps {
  libraries: ConnectedLibrary[];
  selectedLibraryId: string | 'ALL';
  onSelectLibrary: (id: string | 'ALL') => void;
  onOpenMeshModal?: () => void;
}

export const ConnectedLibrariesBar: React.FC<ConnectedLibrariesBarProps> = ({
  libraries,
  selectedLibraryId,
  onSelectLibrary,
  onOpenMeshModal
}) => {
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [selectedDetailsLibrary, setSelectedDetailsLibrary] = useState<ConnectedLibrary | null>(null);

  const handlePingAll = async () => {
    setIsPinging(true);
    await federatedMesh.pingAllNodes();
    setTimeout(() => {
      setIsPinging(false);
    }, 400);
  };

  const totalManuscripts = libraries.reduce((acc, lib) => acc + lib.collectionCount, 0);

  return (
    <div id="zen-connected-libraries-bar" className="bg-stone-900 text-stone-100 rounded-3xl p-5 border border-stone-800 shadow-lg space-y-4">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/30">
            <Network className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-stone-100 tracking-tight">
                Federated Connected Libraries Network
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {libraries.length} Nodes Synced
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Inter-institutional peer mesh connecting temple archives, monastic repositories & university mind science institutes.
            </p>
          </div>
        </div>

        {/* Global Network Health Stats */}
        <div className="flex items-center gap-2.5 flex-wrap text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-stone-300">
            <Server className="w-3.5 h-3.5 text-teal-400" />
            <span><strong className="text-white font-mono">{totalManuscripts.toLocaleString()}</strong> Texts</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-stone-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>TLS 1.3 / OPDS 2.0</span>
          </div>
          <button
            id="zen-ping-mesh-btn"
            onClick={handlePingAll}
            disabled={isPinging}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition"
            title="Ping Federated Nodes"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? 'Pinging Mesh...' : 'Sync & Ping'}</span>
          </button>

          {onOpenMeshModal && (
            <button
              id="zen-open-mesh-explorer-btn"
              onClick={onOpenMeshModal}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition active:scale-95"
            >
              <Network className="w-3.5 h-3.5 text-emerald-100" />
              <span>Mesh Topology</span>
            </button>
          )}
        </div>
      </div>

      {/* Library Nodes Row / Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {/* ALL Option */}
        <button
          onClick={() => onSelectLibrary('ALL')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${
            selectedLibraryId === 'ALL'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/50'
              : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700/60'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>All Connected Libraries</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-900/60 text-stone-300">
            {libraries.length}
          </span>
        </button>

        {/* Individual Connected Nodes */}
        {libraries.map(lib => {
          const isSelected = selectedLibraryId === lib.id;
          return (
            <div key={lib.id} className="relative group shrink-0">
              <button
                id={`zen-lib-node-${lib.id}`}
                onClick={() => onSelectLibrary(lib.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-medium shrink-0 flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/50 font-bold'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700/60'
                }`}
              >
                <span>{lib.flag}</span>
                <span className="truncate max-w-[150px] sm:max-w-[180px]">{lib.name}</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <Wifi className="w-2.5 h-2.5" />
                  {lib.latencyMs}ms
                </span>
              </button>

              {/* Quick Info Pill */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDetailsLibrary(lib);
                }}
                className="absolute -top-1.5 -right-1 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center text-[9px] font-bold shadow-xs hover:scale-110"
                title="View Node Security & Protocols"
              >
                i
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Node Details Drawer/Card (if inspected) */}
      {selectedDetailsLibrary && (
        <div className="mt-3 p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{selectedDetailsLibrary.flag}</span>
              <h4 className="font-bold text-white text-sm">
                {selectedDetailsLibrary.name}
              </h4>
              {selectedDetailsLibrary.nativeScript && (
                <span className="text-stone-400 text-xs font-serif">
                  ({selectedDetailsLibrary.nativeScript})
                </span>
              )}
            </div>
            <button
              onClick={() => setSelectedDetailsLibrary(null)}
              className="text-stone-400 hover:text-white text-xs px-2 py-0.5 rounded bg-stone-800"
            >
              ✕ Close
            </button>
          </div>

          <p className="text-stone-300 leading-relaxed">
            {selectedDetailsLibrary.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-800/80 font-mono text-[11px]">
            <div>
              <span className="text-stone-500 block text-[9px] uppercase tracking-wider">Protocol</span>
              <span className="text-teal-400">{selectedDetailsLibrary.protocol}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[9px] uppercase tracking-wider">Location</span>
              <span className="text-stone-300">{selectedDetailsLibrary.location}, {selectedDetailsLibrary.country}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[9px] uppercase tracking-wider">Trust Score</span>
              <span className="text-emerald-400 font-bold">{selectedDetailsLibrary.trustScore}% Verified</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[9px] uppercase tracking-wider">Digest Fingerprint</span>
              <span className="text-amber-400 truncate block">{selectedDetailsLibrary.shaCertificateFingerprint}</span>
            </div>
          </div>

          {onOpenMeshModal && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  onOpenMeshModal();
                }}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-emerald-800/60"
              >
                <Network className="w-3 h-3" />
                <span>Open in Federated Mesh Topology →</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
