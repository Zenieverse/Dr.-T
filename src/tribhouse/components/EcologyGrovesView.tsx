import React, { useState } from 'react';
import { 
  Trees, Globe, ShieldCheck, MapPin, CheckCircle2, 
  ExternalLink, Search, Camera, Sparkles, Filter, Leaf
} from 'lucide-react';
import { MOCK_ECOLOGY_GROVES, MOCK_TREE_LEDGER } from '../data/mockGrovesAndTrees';
import { EcologyGrove, TreeRecord } from '../types';

interface EcologyGrovesViewProps {
  onOpenTribWithContext: (topic: string, query?: string) => void;
}

export const EcologyGrovesView: React.FC<EcologyGrovesViewProps> = ({
  onOpenTribWithContext
}) => {
  const [selectedGrove, setSelectedGrove] = useState<EcologyGrove>(MOCK_ECOLOGY_GROVES[0]);
  const [treeSearch, setTreeSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'groves' | 'ledger'>('groves');

  const filteredTrees = MOCK_TREE_LEDGER.filter(tree => {
    return (
      tree.treeId.toLowerCase().includes(treeSearch.toLowerCase()) ||
      tree.species.toLowerCase().includes(treeSearch.toLowerCase()) ||
      tree.groveName.toLowerCase().includes(treeSearch.toLowerCase()) ||
      tree.caretaker.toLowerCase().includes(treeSearch.toLowerCase())
    );
  });

  const totalTrees = MOCK_ECOLOGY_GROVES.reduce((acc, g) => acc + g.totalTrees, 0);
  const totalTarget = MOCK_ECOLOGY_GROVES.reduce((acc, g) => acc + g.targetTrees, 0);

  return (
    <div id="ecology-groves-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <Trees className="w-4 h-4" />
            <span>Verifiable Biophilic Regeneration</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Physical Groves & TreeLedger Protocol
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Every slow reading session and commons transaction directs 5% into native old-growth reforestation verified by drone photogrammetry and park rangers
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-850 rounded-xl p-1 border border-stone-200 dark:border-stone-800">
          <button
            id="tab-groves-btn"
            onClick={() => setActiveTab('groves')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'groves'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Physical Groves ({MOCK_ECOLOGY_GROVES.length})
          </button>
          <button
            id="tab-ledger-btn"
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'ledger'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Verifiable TreeLedger
          </button>
        </div>
      </div>

      {/* Reforestation Progress Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-stone-900 to-stone-950 border border-emerald-900/50 text-stone-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
              Global Canopy Goal: 2026–2030
            </div>
            <div className="text-2xl font-serif font-bold text-white mt-0.5">
              {totalTrees.toLocaleString()} / {totalTarget.toLocaleString()} Native Trees Planted & Verified
            </div>
          </div>
          <div className="text-xs text-stone-300">
            <span className="font-bold text-emerald-400">{Math.round((totalTrees / totalTarget) * 100)}%</span> of 50,000-Tree Phase 1 Goal
          </div>
        </div>

        <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${(totalTrees / totalTarget) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-stone-800 text-stone-300">
          <div>
            <span className="text-stone-400 block">Verification:</span>
            <span className="font-medium text-emerald-400">Drone + Ranger GPS</span>
          </div>
          <div>
            <span className="text-stone-400 block">Biodiversity Avg:</span>
            <span className="font-medium text-white">91.6 / 100</span>
          </div>
          <div>
            <span className="text-stone-400 block">Est. CO2 Sequestered:</span>
            <span className="font-medium text-white">~485 Tonnes</span>
          </div>
          <div>
            <span className="text-stone-400 block">Active Stewards:</span>
            <span className="font-medium text-white">10,500+ Readers</span>
          </div>
        </div>
      </div>

      {activeTab === 'groves' ? (
        /* Groves View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ECOLOGY_GROVES.map(grove => (
            <div
              key={grove.id}
              className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                  <img
                    src={grove.photoUrl}
                    alt={grove.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{grove.country}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold">
                    Score: {grove.biodiversityScore}/100
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg">
                      {grove.name}
                    </h3>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      {grove.location}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {grove.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                    <div className="text-stone-500 font-semibold">Primary Native Hardwoods:</div>
                    <div className="flex flex-wrap gap-1">
                      {grove.primarySpecies.map((sp, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                        >
                          {sp.split('(')[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {grove.totalTrees.toLocaleString()} trees planted
                  </span>
                  <button
                    onClick={() => onOpenTribWithContext(grove.name, `Tell me about the ecological restoration and native species in ${grove.name}.`)}
                    className="text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-emerald-600 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>Inquire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TreeLedger Audit Table */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={treeSearch}
                onChange={e => setTreeSearch(e.target.value)}
                placeholder="Search Tree ID, species, grove..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
              <thead className="bg-stone-50 dark:bg-stone-850 text-stone-500 border-b border-stone-200 dark:border-stone-800 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Tree ID</th>
                  <th className="py-3.5 px-4">Native Species</th>
                  <th className="py-3.5 px-4">Grove & Landmark</th>
                  <th className="py-3.5 px-4">GPS Coordinates</th>
                  <th className="py-3.5 px-4">Status & Verification</th>
                  <th className="py-3.5 px-4">Funded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredTrees.map(tree => (
                  <tr key={tree.treeId} className="hover:bg-stone-50/50 dark:hover:bg-stone-850/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {tree.treeId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900 dark:text-stone-100">{tree.species}</div>
                      <div className="italic text-[10px] text-stone-400">{tree.scientificName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{tree.groveName}</div>
                      <div className="text-[10px] text-stone-400">{tree.location.landmark}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {tree.location.lat.toFixed(4)}° N, {tree.location.lng.toFixed(4)}° E
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        {tree.verificationMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {tree.sourceOfFunding}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
