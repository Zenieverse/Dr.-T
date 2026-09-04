// =========================================================================
// LIVING FORESTS MASTER DASHBOARD: SOVEREIGN KNOWLEDGE INFRASTRUCTURE
// Integrated system for global libraries, mobile caravans, and tree stewardship
// =========================================================================

import React, { useState } from 'react';
import { 
  Globe2, 
  Trees, 
  BookOpen, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  FileText, 
  HeartHandshake, 
  Sparkles, 
  Filter,
  DollarSign,
  AlertTriangle,
  Award,
  Layers
} from 'lucide-react';
import { 
  LibraryProject, 
  CountryDossier, 
  MobileLibraryRoute, 
  TreeDedication,
  LivingForestsGlobalSummary 
} from './types';
import { 
  MOCK_GLOBAL_SUMMARY, 
  MOCK_COUNTRY_DOSSIERS, 
  MOCK_LIBRARY_PROJECTS, 
  MOCK_MOBILE_ROUTES, 
  MOCK_TREE_DEDICATIONS 
} from './data/mockLivingForests';
import { LivingForestsHero } from './components/LivingForestsHero';
import { LivingLibraryMap } from './components/LivingLibraryMap';
import { CountryForestsView } from './components/CountryForestsView';
import { ProjectDossierModal } from './components/ProjectDossierModal';
import { PlantLibraryModal } from './components/PlantLibraryModal';
import { GiveTreeModal } from './components/GiveTreeModal';
import { ProposeProjectModal } from './components/ProposeProjectModal';
import { TribAiMatcherModal } from './components/TribAiMatcherModal';
import { OneHundredYearCharterModal } from './components/OneHundredYearCharterModal';
import { ZenMinuteModal } from './components/ZenMinuteModal';

export const LivingForestsDashboard: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'MAP' | 'COUNTRIES' | 'MOBILE' | 'TRANSPARENCY' | 'DEDICATIONS'>('MAP');
  const [projects, setProjects] = useState<LibraryProject[]>(MOCK_LIBRARY_PROJECTS);
  const [countries, setCountries] = useState<CountryDossier[]>(MOCK_COUNTRY_DOSSIERS);
  const [mobileRoutes, setMobileRoutes] = useState<MobileLibraryRoute[]>(MOCK_MOBILE_ROUTES);
  const [dedications, setDedications] = useState<TreeDedication[]>(MOCK_TREE_DEDICATIONS);
  const [summary, setSummary] = useState<LivingForestsGlobalSummary>(MOCK_GLOBAL_SUMMARY);

  // Modals state
  const [selectedProjectForDossier, setSelectedProjectForDossier] = useState<LibraryProject | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [targetProjectForPlant, setTargetProjectForPlant] = useState<LibraryProject | null>(null);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [targetProjectForTree, setTargetProjectForTree] = useState<LibraryProject | null>(null);
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [isAiMatcherOpen, setIsAiMatcherOpen] = useState(false);
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const [isZenOpen, setIsZenOpen] = useState(false);

  // Handlers
  const handleOpenDossier = (project: LibraryProject) => {
    setSelectedProjectForDossier(project);
    setIsDossierOpen(true);
  };

  const handleOpenPlantForProject = (project: LibraryProject) => {
    setTargetProjectForPlant(project);
    setIsDossierOpen(false);
    setIsPlantModalOpen(true);
  };

  const handleOpenGiveTreeForProject = (project: LibraryProject) => {
    setTargetProjectForTree(project);
    setIsDossierOpen(false);
    setIsTreeModalOpen(true);
  };

  const handlePlantForCountry = (country: CountryDossier) => {
    const proj = projects.find(p => p.countryName.toLowerCase().includes(country.countryName.toLowerCase())) || null;
    setTargetProjectForPlant(proj);
    setIsPlantModalOpen(true);
  };

  const handleContributionConfirmed = (data: {
    tierId: string;
    amountUsd: number;
    projectId: string;
    donorName: string;
    isAnonymous: boolean;
    dedicationNote: string;
  }) => {
    // Update global metrics
    setSummary(prev => ({
      ...prev,
      mindsNourishedCount: prev.mindsNourishedCount + Math.floor(data.amountUsd * 2.5),
      valueReturnedToCommonsUsd: prev.valueReturnedToCommonsUsd + data.amountUsd,
      booksCirculatedCount: prev.booksCirculatedCount + Math.floor(data.amountUsd / 5),
    }));

    // If directed to specific project, update raised funds
    if (data.projectId !== 'GLOBAL_COMMONS') {
      setProjects(prev => prev.map(p => {
        if (p.id === data.projectId) {
          return {
            ...p,
            funding: {
              ...p.funding,
              raisedUsd: p.funding.raisedUsd + data.amountUsd,
            },
          };
        }
        return p;
      }));
    }
  };

  const handleDedicationConfirmed = (newDed: Partial<TreeDedication>) => {
    const fullDed = newDed as TreeDedication;
    setDedications(prev => [fullDed, ...prev]);
    setSummary(prev => ({
      ...prev,
      nativeTreesGrownCount: prev.nativeTreesGrownCount + 1,
    }));
  };

  const handleProposalSubmitted = (newProp: any) => {
    // Add as a verified need project in the list
    const newProject: LibraryProject = {
      id: newProp.id,
      name: `${newProp.communityName} Community Reading House`,
      tagline: `Community-originated proposal in ${newProp.countryName}`,
      projectType: newProp.projectType,
      lifecycle: 'SEED',
      status: 'VERIFIED_NEED',
      verificationLevel: 'LEVEL_1_SELF_REPORTED',
      geographicEntity: {
        id: `geo-${Date.now()}`,
        name: newProp.communityName,
        type: 'community',
        coordinates: { lat: 15.0, lng: 10.0, isApproximate: true },
        regionName: newProp.regionName,
        category: 'rural',
      },
      countryName: newProp.countryName,
      communityName: newProp.communityName,
      languagesServed: newProp.localLanguages,
      communityProfile: {
        culturalHeritage: 'Traditional indigenous and local knowledge custodians.',
        existingStrengths: newProp.communityStrengths,
        communityAspirations: newProp.communityAspirations,
        photoUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
      },
      description: `Locally proposed educational and ecological project by ${newProp.leadContact}. Fully retains sovereign veto rights under the 100-Year Charter.`,
      peopleServedCount: 1200,
      booksInCollectionCount: 150,
      booksNeededCount: 1200,
      localPartner: {
        name: newProp.leadContact,
        type: 'INDIGENOUS_COUNCIL',
        leadContact: newProp.leadContact,
        verifiedSince: new Date().toISOString().split('T')[0],
        vetoRightsAcknowledged: true,
      },
      accessIndex: {
        score: 70,
        populationPerLibrary: 20000,
        avgTravelDistanceKm: 15,
        weeklyOpeningHoursAvg: 30,
        digitalAccessRatePct: 20,
        localLanguageAvailabilityScore: 9,
        childrenAccessRating: 'FAIR',
      },
      climateProfile: {
        primaryRisks: ['extreme_heat'],
        architecturalAdaptations: ['Local vernacular building materials', 'Natural cross ventilation'],
        waterproofStorage: true,
        solarBatteryBackup: true,
      },
      funding: {
        targetUsd: 15000,
        raisedUsd: 0,
        committedUsd: 0,
        spentUsd: 0,
        verifiedExpenditureUsd: 0,
        allocationPct: {
          infrastructure: 60,
          booksAndResources: 15,
          localOperations: 10,
          ecologicalProject: 5,
          monitoringVerification: 5,
          platformCommonsPool: 5,
        },
      },
      milestones: [
        { id: 'm1', index: 1, title: 'Assembly Approval & Site Demarcation', description: 'Village assembly consensus deed registration.', payoutPct: 20, status: 'PENDING' },
      ],
      evidenceVault: [],
      negativeDataLogs: [],
      sustainabilityScorecard: {
        localRevenuePct: 40,
        volunteerStewardCount: 10,
        yearsOperating: 0,
        localJobsRetained: 2,
      },
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects(prev => [newProject, ...prev]);
  };

  return (
    <div id="living-forests-container" className="space-y-6 pb-12">
      {/* 1. Master Hero Section */}
      <LivingForestsHero
        summary={summary}
        onOpenPlantModal={() => {
          setTargetProjectForPlant(null);
          setIsPlantModalOpen(true);
        }}
        onOpenTreeModal={() => {
          setTargetProjectForTree(null);
          setIsTreeModalOpen(true);
        }}
        onOpenProposeModal={() => setIsProposeModalOpen(true)}
        onOpenAiMatcherModal={() => setIsAiMatcherOpen(true)}
        onOpenCharterModal={() => setIsCharterOpen(true)}
        onOpenZenModal={() => setIsZenOpen(true)}
        onNavigateToMap={() => setActiveTab('MAP')}
        onNavigateToCountries={() => setActiveTab('COUNTRIES')}
      />

      {/* 2. Primary Navigation Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
        {[
          { id: 'MAP', label: '🌍 World Library Map', count: projects.length },
          { id: 'COUNTRIES', label: '🏛️ Country Registry & Virtual Canopies', count: countries.length },
          { id: 'MOBILE', label: '⛵ Mobile Fleets & Riverboats', count: mobileRoutes.length },
          { id: 'TRANSPARENCY', label: '⚖️ Radically Open Audits & Challenges', count: null },
          { id: 'DEDICATIONS', label: '🌳 Dedicated Tree Grove', count: dedications.length },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id.toLowerCase()}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center space-x-2 transition-all ${
              activeTab === tab.id
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-stone-800 text-emerald-300' : 'bg-stone-200 text-stone-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. Dynamic Tab Content */}
      {activeTab === 'MAP' && (
        <LivingLibraryMap
          projects={projects}
          onSelectProject={handleOpenDossier}
          onPlantForProject={handleOpenPlantForProject}
          onGiveTreeForProject={handleOpenGiveTreeForProject}
        />
      )}

      {activeTab === 'COUNTRIES' && (
        <CountryForestsView
          countries={countries}
          projects={projects}
          onSelectProject={handleOpenDossier}
          onPlantForCountry={handlePlantForCountry}
        />
      )}

      {activeTab === 'MOBILE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-stone-900 font-display flex items-center gap-2">
                  <span>⛵</span>
                  <span>Mobile Fleets, Riverboats & Desert Caravans</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Reaching isolated canal hamlets, pastoralist transhumance routes, and high Andean mountain passes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {mobileRoutes.map((route) => (
                <div key={route.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="p-2.5 rounded-xl bg-teal-100 text-teal-800 text-lg">
                      {route.vehicleType === 'RIVER_BOAT' ? '⛵' : route.vehicleType === 'CARGO_BICYCLE' ? '🚲' : '🐪'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {route.annualFuelEcoMode}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{route.unitName}</h4>
                    <span className="text-[11px] text-stone-500 block mt-0.5">Route: {route.activeRouteName}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-200 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase block font-semibold">Stops</span>
                      <strong className="text-stone-900">{route.stopsCount}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase block font-semibold">Villages</span>
                      <strong className="text-stone-900">{route.weeklyCommunitiesServed}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase block font-semibold">Books</span>
                      <strong className="text-emerald-700">{route.booksOnBoard}</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-600">
                    Operator: <strong className="text-stone-800">{route.operatorName}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'TRANSPARENCY' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-stone-900 font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Radically Open Financials & Candor Ledger</span>
              </h3>
              <p className="text-xs text-stone-500">
                Independent verification, unvarnished challenge disclosures, and complete expenditure breakdown.
              </p>
            </div>

            {/* The 100-Dollar Rule Card */}
            <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-emerald-300 font-display">
                  The Transparent $100 Rule
                </h4>
                <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
                  Every Cent Accounted
                </span>
              </div>
              <p className="text-xs text-stone-300">
                For every $100 gifted to the commons, funds are mechanically split via escrow milestones:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1 font-mono">
                <div className="p-2.5 rounded-xl bg-stone-800 border border-stone-700">
                  <span className="text-emerald-400 font-bold block">$60.00 (60%)</span>
                  <span className="text-[10px] text-stone-300">Physical Infrastructure & Timber Shelters</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-800 border border-stone-700">
                  <span className="text-teal-400 font-bold block">$15.00 (15%)</span>
                  <span className="text-[10px] text-stone-300">Bilingual Books & Solar Tablets</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-800 border border-stone-700">
                  <span className="text-stone-400 font-bold block">$10.00 (10%)</span>
                  <span className="text-[10px] text-stone-300">Librarian Stipends & Local Ops</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-800 border border-stone-700">
                  <span className="text-lime-400 font-bold block">$5.00 (5%)</span>
                  <span className="text-[10px] text-stone-300">Community Tree Nursery & Soil</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-800 border border-stone-700">
                  <span className="text-sky-400 font-bold block">$5.00 (5%)</span>
                  <span className="text-[10px] text-stone-300">Independent Audits & Verification</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-800 border border-stone-700">
                  <span className="text-purple-400 font-bold block">$5.00 (5%)</span>
                  <span className="text-[10px] text-stone-300">Endowment & Commons Pool</span>
                </div>
              </div>
            </div>

            {/* Negative Data Log Highlights */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Public "What Didn't Work" Register</span>
              </h4>
              <div className="space-y-3">
                {projects.flatMap(p => p.negativeDataLogs.map(l => ({ ...l, projectName: p.name }))).map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-amber-950 font-bold">{log.title}</strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                        {log.projectName}
                      </span>
                    </div>
                    <p className="text-stone-700 text-[11px] leading-relaxed">{log.description}</p>
                    <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-[11px] text-emerald-950">
                      <strong className="block text-emerald-800 mb-0.5">Adaptation Made:</strong>
                      <span>{log.lessonsLearned}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DEDICATIONS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-stone-900 font-display flex items-center gap-2">
                  <Trees className="w-5 h-5 text-emerald-600" />
                  <span>The Living Grove: Dedicated Trees</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Commemorative trees honoring elders, children, teachers, and favorite books across the world.
                </p>
              </div>

              <button
                onClick={() => {
                  setTargetProjectForTree(null);
                  setIsTreeModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-transform active:scale-95"
              >
                <span>🌳</span>
                <span>Dedicate a Tree ($25)</span>
              </button>
            </div>

            {/* Non-carbon credit note */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Living Biodiversity Pledge:</strong> All trees in this grove are native species cared for by local community schools. We do not sell or trade carbon credits or offsets.
              </span>
            </div>

            {/* Dedications Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dedications.map((ded) => (
                <div key={ded.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">🌿</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      {ded.survivalStatus}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <strong className="text-stone-900 font-bold block text-sm">{ded.species}</strong>
                    <span className="text-[11px] text-stone-500 block">Planted: {ded.plantedDate}</span>
                  </div>

                  <p className="p-3 rounded-xl bg-white border border-stone-200 italic text-stone-700 text-[11px] leading-relaxed">
                    "{ded.dedicationMessage}"
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-stone-500">
                    <span>By: <strong className="text-stone-700">{ded.donorName}</strong></span>
                    <span className="font-mono">{ded.coordinatesApprox}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Modals */}
      <ProjectDossierModal
        project={selectedProjectForDossier}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onPlantForProject={handleOpenPlantForProject}
        onGiveTreeForProject={handleOpenGiveTreeForProject}
      />

      <PlantLibraryModal
        isOpen={isPlantModalOpen}
        onClose={() => setIsPlantModalOpen(false)}
        projects={projects}
        initialProject={targetProjectForPlant}
        onConfirmContribution={handleContributionConfirmed}
      />

      <GiveTreeModal
        isOpen={isTreeModalOpen}
        onClose={() => setIsTreeModalOpen(false)}
        projects={projects}
        initialProject={targetProjectForTree}
        onConfirmDedication={handleDedicationConfirmed}
      />

      <ProposeProjectModal
        isOpen={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
        onProposalSubmitted={handleProposalSubmitted}
      />

      <TribAiMatcherModal
        isOpen={isAiMatcherOpen}
        onClose={() => setIsAiMatcherOpen(false)}
        projects={projects}
        onSelectProject={handleOpenDossier}
        onOpenPlantModalForProject={handleOpenPlantForProject}
      />

      <OneHundredYearCharterModal
        isOpen={isCharterOpen}
        onClose={() => setIsCharterOpen(false)}
      />

      <ZenMinuteModal
        isOpen={isZenOpen}
        onClose={() => setIsZenOpen(false)}
      />
    </div>
  );
};
