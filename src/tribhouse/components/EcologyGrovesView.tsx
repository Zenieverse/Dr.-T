import React, { useState } from 'react';
import { 
  Trees, Globe, ShieldCheck, MapPin, CheckCircle2, 
  ExternalLink, Search, Camera, Sparkles, Filter, Leaf,
  X, Sprout, PlusCircle, BookOpen, Compass, Navigation
} from 'lucide-react';
import { MOCK_ECOLOGY_GROVES, MOCK_TREE_LEDGER } from '../data/mockGrovesAndTrees';
import { EcologyGrove, TreeRecord } from '../types';
import { VIETNAM_FOREST_GROVE_IMAGE, VIETNAM_FOREST_GROVE_FALLBACK } from '../../assets/vietnamGroveImage';

interface EcologyGrovesViewProps {
  onOpenTribWithContext: (topic: string, query?: string) => void;
}

export const EcologyGrovesView: React.FC<EcologyGrovesViewProps> = ({
  onOpenTribWithContext
}) => {
  const [grovesList, setGrovesList] = useState<EcologyGrove[]>(MOCK_ECOLOGY_GROVES);
  const [treesLedger, setTreesLedger] = useState<TreeRecord[]>(MOCK_TREE_LEDGER);
  const [inspectingGrove, setInspectingGrove] = useState<EcologyGrove | null>(null);
  const [inspectingTree, setInspectingTree] = useState<TreeRecord | null>(null);
  const [selectedGroveFilter, setSelectedGroveFilter] = useState<string>('all');
  const [treeSearch, setTreeSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'groves' | 'ledger'>('groves');
  const [plantSuccessMsg, setPlantSuccessMsg] = useState<string | null>(null);
  const [selectedSpeciesForPlanting, setSelectedSpeciesForPlanting] = useState<string>('');
  const [sponsorName, setSponsorName] = useState<string>('');

  const filteredTrees = treesLedger.filter(tree => {
    const matchesGroveFilter = selectedGroveFilter === 'all' || tree.groveId === selectedGroveFilter;
    const matchesSearch = 
      tree.treeId.toLowerCase().includes(treeSearch.toLowerCase()) ||
      tree.species.toLowerCase().includes(treeSearch.toLowerCase()) ||
      tree.groveName.toLowerCase().includes(treeSearch.toLowerCase()) ||
      tree.caretaker.toLowerCase().includes(treeSearch.toLowerCase());
    return matchesGroveFilter && matchesSearch;
  });

  const totalTrees = grovesList.reduce((acc, g) => acc + g.totalTrees, 0);
  const totalTarget = grovesList.reduce((acc, g) => acc + g.targetTrees, 0);

  const handlePlantSeedling = (grove: EcologyGrove) => {
    const speciesToPlant = selectedSpeciesForPlanting || grove.primarySpecies[0];
    const newTreeId = `TREE-VN-02026-${String(treesLedger.length + 101).padStart(3, '0')}`;
    const newRecord: TreeRecord = {
      treeId: newTreeId,
      projectId: `PROJ-${grove.id.toUpperCase().replace('_', '-')}-CANOPY`,
      groveId: grove.id,
      groveName: grove.name,
      species: speciesToPlant.split('(')[0].trim(),
      scientificName: speciesToPlant.includes('(') ? speciesToPlant.match(/\(([^)]+)\)/)?.[1] || speciesToPlant : speciesToPlant,
      nativeStatus: 'Endemic Native',
      location: {
        lat: grove.coordinates[0] + (Math.random() * 0.008 - 0.004),
        lng: grove.coordinates[1] + (Math.random() * 0.008 - 0.004),
        country: grove.country,
        region: grove.location.split('&')[0].trim(),
        landmark: `${grove.name} Restoration Quadrant #${Math.floor(Math.random() * 50) + 1}`
      },
      plantingDate: new Date().toISOString().slice(0, 10),
      status: 'GROWING',
      caretaker: sponsorName ? `${sponsorName} (Dedicated via Trib-House)` : 'Cúc Phương & Ba Vì Ranger Stewardship Guild',
      sourceOfFunding: `Reading Session & Trib-House 5% Earth Fund (${sponsorName ? `Dedicated by ${sponsorName}` : 'Collective Patron'})`,
      associatedBookTitle: grove.id === 'grove_vietnam' ? 'The Tale of Kiều (Truyện Kiều)' : 'The Living Forest Library',
      lastVerified: new Date().toISOString().slice(0, 10),
      verificationMethod: 'Drone Photogrammetry',
      ecologicalNotes: `Freshly planted ${speciesToPlant}. High mycorrhizal inoculation root substrate. Monitored by ranger photogrammetry array.`,
      co2KgOffsetEstimate: 26.0,
      photoUrl: grove.photoUrl
    };

    setTreesLedger(prev => [newRecord, ...prev]);
    setGrovesList(prev => prev.map(g => g.id === grove.id ? { ...g, totalTrees: g.totalTrees + 1 } : g));
    setPlantSuccessMsg(`Successfully dedicated ${speciesToPlant} to ${grove.name}! Assigned Ledger ID: ${newTreeId}`);
    setTimeout(() => setPlantSuccessMsg(null), 5000);
  };

  const handleOpenLedgerForGrove = (groveId: string) => {
    setSelectedGroveFilter(groveId);
    setActiveTab('ledger');
    setInspectingGrove(null);
  };

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
            Physical Groves ({grovesList.length})
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
            Verifiable TreeLedger ({treesLedger.length})
          </button>
        </div>
      </div>

      {/* Reforestation Progress Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-stone-900 to-stone-950 border border-emerald-900/50 text-stone-100 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Global Canopy Goal: 2026–2030</span>
            </div>
            <div className="text-2xl font-serif font-bold text-white mt-0.5">
              {totalTrees.toLocaleString()} / {totalTarget.toLocaleString()} Native Trees Planted & Verified
            </div>
          </div>
          <div className="text-xs text-stone-300">
            <span className="font-bold text-emerald-400">{((totalTrees / totalTarget) * 100).toFixed(1)}%</span> of 50,000-Tree Phase 1 Goal
          </div>
        </div>

        <div className="w-full h-3 bg-stone-800/80 rounded-full overflow-hidden border border-emerald-950">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-500"
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
            <span className="font-medium text-white">~492 Tonnes</span>
          </div>
          <div>
            <span className="text-stone-400 block">Active Stewards:</span>
            <span className="font-medium text-white">10,500+ Readers</span>
          </div>
        </div>
      </div>

      {plantSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{plantSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setActiveTab('ledger')}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Inspect in Ledger
          </button>
        </div>
      )}

      {activeTab === 'groves' ? (
        /* Groves View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grovesList.map(grove => (
            <div
              key={grove.id}
              className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div 
                  onClick={() => setInspectingGrove(grove)}
                  className="relative h-52 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden cursor-pointer"
                >
                  <img
                    src={grove.photoUrl}
                    alt={grove.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback gracefully to verified CDN rainforest imagery
                      (e.currentTarget as HTMLImageElement).src = VIETNAM_FOREST_GROVE_FALLBACK;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1 shadow">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{grove.country}</span>
                  </div>
                  
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold shadow">
                    Score: {grove.biodiversityScore}/100
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-mono text-[11px] opacity-90">
                      {grove.coordinates[0].toFixed(2)}°N, {grove.coordinates[1].toFixed(2)}°E
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-stone-900/80 text-[10px] font-medium backdrop-blur-sm text-emerald-300">
                      Click to inspect
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 
                      onClick={() => setInspectingGrove(grove)}
                      className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg hover:text-emerald-600 transition-colors cursor-pointer"
                    >
                      {grove.name}
                    </h3>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                      <Navigation className="w-3 h-3" />
                      <span>{grove.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {grove.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                    <div className="text-stone-500 dark:text-stone-400 font-semibold flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-500" />
                      <span>Key Native Hardwoods:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {grove.primarySpecies.map((sp, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs gap-2">
                  <div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
                      {grove.totalTrees.toLocaleString()} trees
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Target: {grove.targetTrees.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setInspectingGrove(grove)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-medium text-xs flex items-center gap-1 transition-colors"
                    >
                      <Sprout className="w-3.5 h-3.5" />
                      <span>Inspect & Plant</span>
                    </button>
                    <button
                      onClick={() => onOpenTribWithContext(grove.name, `Tell me about the ecological restoration and native species in ${grove.name}.`)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Ask Trib AI"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TreeLedger Audit Table */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={treeSearch}
                onChange={e => setTreeSearch(e.target.value)}
                placeholder="Search Tree ID, species, grove, caretaker..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Grove Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
              <button
                onClick={() => setSelectedGroveFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedGroveFilter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                All Groves
              </button>
              {grovesList.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroveFilter(g.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                    selectedGroveFilter === g.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  <span>{g.id === 'grove_vietnam' ? '🇻🇳' : '🌳'}</span>
                  <span>{g.name.split(' ')[0]} {g.name.split(' ')[1]}</span>
                </button>
              ))}
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
                  <th className="py-3.5 px-4">Funded By / Patron</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredTrees.map(tree => (
                  <tr 
                    key={tree.treeId} 
                    className="hover:bg-stone-50/70 dark:hover:bg-stone-850/70 cursor-pointer transition-colors"
                    onClick={() => setInspectingTree(tree)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {tree.treeId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900 dark:text-stone-100">{tree.species}</div>
                      <div className="italic text-[10px] text-stone-400">{tree.scientificName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium">{tree.groveName}</div>
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
                    <td className="py-3.5 px-4 text-stone-500 dark:text-stone-400 max-w-xs truncate">
                      {tree.sourceOfFunding}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[11px] text-emerald-600 font-semibold hover:underline">
                        View
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grove Detail & Seedling Dedication Modal */}
      {inspectingGrove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800 shadow-2xl">
            {/* Modal Image Header */}
            <div className="relative h-64 w-full bg-stone-900 overflow-hidden">
              <img
                src={inspectingGrove.photoUrl}
                alt={inspectingGrove.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = VIETNAM_FOREST_GROVE_FALLBACK;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
              
              <button
                onClick={() => setInspectingGrove(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{inspectingGrove.country} — {inspectingGrove.location}</span>
                </div>
                <h2 className="font-serif text-2xl font-bold">{inspectingGrove.name}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {inspectingGrove.description}
              </p>

              {/* Progress & Stats Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-100 dark:border-stone-800 text-center">
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Planted Trees</div>
                  <div className="text-lg font-bold text-emerald-600 font-serif">
                    {inspectingGrove.totalTrees.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Canopy Target</div>
                  <div className="text-lg font-bold text-stone-800 dark:text-stone-200 font-serif">
                    {inspectingGrove.targetTrees.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Biodiversity</div>
                  <div className="text-lg font-bold text-emerald-500 font-serif">
                    {inspectingGrove.biodiversityScore}/100
                  </div>
                </div>
              </div>

              {/* Native Species */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wide">
                  Native Tree Species Protected Here
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {inspectingGrove.primarySpecies.map((species, i) => (
                    <div 
                      key={i}
                      onClick={() => setSelectedSpeciesForPlanting(species)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        selectedSpeciesForPlanting === species
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-semibold text-emerald-800 dark:text-emerald-200'
                          : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{species}</span>
                      </div>
                      {selectedSpeciesForPlanting === species && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Partner & Theme */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 space-y-2 text-xs">
                <div>
                  <span className="text-stone-500 dark:text-stone-400 font-semibold block">Conservation Partner:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">{inspectingGrove.partnerOrganization}</span>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 font-semibold block">Living Library Linkage:</span>
                  <span className="font-medium text-emerald-800 dark:text-emerald-300">{inspectingGrove.associatedLibraryTheme}</span>
                </div>
              </div>

              {/* Plant a Seedling Action Box */}
              <div className="p-5 rounded-2xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <Sprout className="w-4 h-4" />
                  <span>Dedicate a Native Sapling into {inspectingGrove.name}</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Select a native tree above and add your dedication. Every tree is assigned a cryptographic TreeLedger record and verified with ranger GPS.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={sponsorName}
                    onChange={e => setSponsorName(e.target.value)}
                    placeholder="Dedication / Reader Name (e.g. In Honor of Slow Reading)"
                    className="flex-1 px-3 py-2 text-xs bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => handlePlantSeedling(inspectingGrove)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Plant Tree Now</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => handleOpenLedgerForGrove(inspectingGrove.id)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-xs hover:bg-stone-200 transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>View Trees in Ledger</span>
                </button>

                <button
                  onClick={() => {
                    onOpenTribWithContext(inspectingGrove.name, `Tell me about the ecological restoration, native species, and culture in ${inspectingGrove.name}.`);
                    setInspectingGrove(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Trib AI About Grove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tree Record Inspector Modal */}
      {inspectingTree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
            <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
              <img
                src={inspectingTree.photoUrl}
                alt={inspectingTree.species}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = VIETNAM_FOREST_GROVE_FALLBACK;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
              <button
                onClick={() => setInspectingTree(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="font-mono text-xs text-emerald-400 font-bold">{inspectingTree.treeId}</div>
                <div className="font-serif text-xl font-bold">{inspectingTree.species}</div>
                <div className="text-[11px] text-stone-300 italic">{inspectingTree.scientificName}</div>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-850">
                <div>
                  <span className="text-stone-400 block text-[10px]">Grove:</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{inspectingTree.groveName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">GPS Landmark:</span>
                  <span className="font-medium text-stone-700 dark:text-stone-300">{inspectingTree.location.landmark}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Coordinates:</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                    {inspectingTree.location.lat.toFixed(4)}°N, {inspectingTree.location.lng.toFixed(4)}°E
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Verification:</span>
                  <span className="font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {inspectingTree.verificationMethod}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] font-semibold">Ecological Field Notes:</span>
                <p className="text-stone-600 dark:text-stone-300 mt-0.5 leading-relaxed">
                  {inspectingTree.ecologicalNotes}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-stone-500">
                <span>Caretaker: <strong className="text-stone-800 dark:text-stone-200">{inspectingTree.caretaker}</strong></span>
                <span className="text-emerald-600 font-bold">~{inspectingTree.co2KgOffsetEstimate} kg CO2/yr</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

