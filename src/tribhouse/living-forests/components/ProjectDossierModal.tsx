// =========================================================================
// PROJECT DOSSIER MODAL: COMPLETE PUBLIC EVIDENCE & STORY REPOSITORY
// Dignified, evidence-backed community library & ecological profile
// =========================================================================

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Trees, 
  BookOpen, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Users,
  Compass,
  Hourglass,
  Leaf
} from 'lucide-react';
import { LibraryProject } from '../types';

interface ProjectDossierModalProps {
  project: LibraryProject | null;
  isOpen: boolean;
  onClose: () => void;
  onPlantForProject: (project: LibraryProject) => void;
  onGiveTreeForProject: (project: LibraryProject) => void;
}

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({
  project,
  isOpen,
  onClose,
  onPlantForProject,
  onGiveTreeForProject,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'evidence' | 'negative' | 'future'>('overview');

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="project-dossier-modal"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white p-6 sm:p-8 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-stone-300 hover:text-white transition-colors"
            title="Close Dossier"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                {project.projectType.replace(/_/g, ' ')}
              </span>
              <span className="text-stone-300">
                {project.countryName} • {project.communityName}
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-mono">
                {project.verificationLevel.replace(/_/g, ' ')}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              {project.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 mt-6 border-b border-stone-800 pb-0 overflow-x-auto text-xs">
            {[
              { id: 'overview', label: '1. Community & Architecture' },
              { id: 'financials', label: '2. Escrow & Breakdown' },
              { id: 'evidence', label: '3. Evidence Vault' },
              { id: 'negative', label: '4. What Didn’t Work (Candid)' },
              { id: 'future', label: '5. Future Capsule & 100-Yr' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 font-bold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-emerald-300'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 text-xs sm:text-sm">
          {/* TAB 1: OVERVIEW & COMMUNITY */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Dignified Community Story */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <h3 className="text-base font-black text-stone-900 font-display flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Community Heritage & Aspirations</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-stone-200">
                    <strong className="text-emerald-700 block mb-1 uppercase text-[10px] tracking-wider">Ancestral & Cultural Heritage:</strong>
                    <p className="text-stone-600 leading-relaxed">{project.communityProfile.culturalHeritage}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200">
                    <strong className="text-teal-700 block mb-1 uppercase text-[10px] tracking-wider">Existing Local Strengths:</strong>
                    <p className="text-stone-600 leading-relaxed">{project.communityProfile.existingStrengths}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200">
                    <strong className="text-amber-700 block mb-1 uppercase text-[10px] tracking-wider">Community Aspirations:</strong>
                    <p className="text-stone-600 leading-relaxed">{project.communityProfile.communityAspirations}</p>
                  </div>
                </div>
              </div>

              {/* Full Description & Architecture */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">Design & Operations Overview</h4>
                <p className="text-stone-700 leading-relaxed text-xs sm:text-sm">
                  {project.description}
                </p>
              </div>

              {/* Climate Resilience & Architectural Adaptations */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5">
                <h4 className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span>Climate-Resilient Engineering Standards</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                    <strong className="text-stone-500 text-[10px] block uppercase">Primary Climate Risks</strong>
                    <span className="text-stone-800 font-bold capitalize mt-0.5 block">
                      {project.climateProfile.primaryRisks.join(', ').replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200 sm:col-span-2">
                    <strong className="text-stone-500 text-[10px] block uppercase">Architectural Adaptations</strong>
                    <ul className="list-disc list-inside text-stone-700 mt-0.5 space-y-0.5 text-[11px]">
                      {project.climateProfile.architecturalAdaptations.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Ecological Component Details */}
              {project.ecologicalComponent && (
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-teal-950 flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-teal-700" />
                      <span>Associated Living Landscape ({project.ecologicalComponent.type.replace(/_/g, ' ')})</span>
                    </h4>
                    <span className="text-[10px] bg-teal-950 text-teal-200 px-2 py-0.5 rounded font-mono">
                      Not Sold As Carbon Offsets
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Native species: <strong className="text-stone-800">{project.ecologicalComponent.primarySpecies.join(', ')}</strong>.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                    <div className="p-2 rounded bg-white border border-teal-200">
                      Planted: <strong>{project.ecologicalComponent.plantedCount}</strong>
                    </div>
                    <div className="p-2 rounded bg-white border border-teal-200">
                      Surviving: <strong>{project.ecologicalComponent.survivingCount} ({project.ecologicalComponent.survivalRatePct}%)</strong>
                    </div>
                    <div className="p-2 rounded bg-white border border-teal-200">
                      Nursery Jobs: <strong>{project.ecologicalComponent.nurseryLivelihoodsCreated} local workers</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FINANCIAL TRANSPARENCY & ESCROW */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Transparent Funding Breakdown</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    Raised: ${project.funding.raisedUsd.toLocaleString()} / Target: ${project.funding.targetUsd.toLocaleString()}
                  </span>
                </div>

                {/* The 100-Dollar Rule Representation */}
                <div className="space-y-2">
                  <span className="text-xs text-stone-500 font-semibold block">
                    Configurable Allocation per $100 Raised:
                  </span>
                  <div className="h-4 w-full rounded-full overflow-hidden flex text-[10px] font-bold text-white shadow-inner">
                    <div style={{ width: `${project.funding.allocationPct.infrastructure}%` }} className="bg-emerald-600 flex items-center justify-center" title="Infrastructure 60%">60%</div>
                    <div style={{ width: `${project.funding.allocationPct.booksAndResources}%` }} className="bg-teal-500 flex items-center justify-center" title="Books & Resources 15%">15%</div>
                    <div style={{ width: `${project.funding.allocationPct.localOperations}%` }} className="bg-stone-700 flex items-center justify-center" title="Local Ops 10%">10%</div>
                    <div style={{ width: `${project.funding.allocationPct.ecologicalProject}%` }} className="bg-lime-600 flex items-center justify-center" title="Ecology 5%">5%</div>
                    <div style={{ width: `${project.funding.allocationPct.monitoringVerification}%` }} className="bg-sky-600 flex items-center justify-center" title="Verification 5%">5%</div>
                    <div style={{ width: `${project.funding.allocationPct.platformCommonsPool}%` }} className="bg-purple-600 flex items-center justify-center" title="Commons 5%">5%</div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-stone-600 pt-1">
                    <div><span className="inline-block w-2.5 h-2.5 bg-emerald-600 rounded mr-1" /> $60 → Library Infrastructure</div>
                    <div><span className="inline-block w-2.5 h-2.5 bg-teal-500 rounded mr-1" /> $15 → Books / Educational</div>
                    <div><span className="inline-block w-2.5 h-2.5 bg-stone-700 rounded mr-1" /> $10 → Local Operations</div>
                    <div><span className="inline-block w-2.5 h-2.5 bg-lime-600 rounded mr-1" /> $5 → Ecological Project</div>
                    <div><span className="inline-block w-2.5 h-2.5 bg-sky-600 rounded mr-1" /> $5 → Independent Verification</div>
                    <div><span className="inline-block w-2.5 h-2.5 bg-purple-600 rounded mr-1" /> $5 → Commons Reinvestment</div>
                  </div>
                </div>
              </div>

              {/* Milestone Escrow Schedule */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">Escrow Milestone Payout Gates</h4>
                <div className="space-y-2">
                  {project.milestones.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl border border-stone-200 bg-white flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.status === 'RELEASED' ? 'bg-emerald-100 text-emerald-800' :
                            m.status === 'VERIFIED' ? 'bg-sky-100 text-sky-800' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {m.status}
                          </span>
                          <strong className="text-stone-900 font-semibold">
                            Milestone {m.index}: {m.title}
                          </strong>
                        </div>
                        <p className="text-stone-600 text-[11px]">{m.description}</p>
                      </div>
                      <span className="font-mono font-bold text-emerald-800 shrink-0">
                        {m.payoutPct}% Payout
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE VAULT */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <div>
                  <h3 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Evidence Vault & Audit Trails</span>
                  </h3>
                  <p className="text-stone-500 text-[11px]">
                    Every expenditure, satellite confirmation, and community assembly record is catalogued with cryptographic hashes.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {project.evidenceVault.map((ev) => (
                  <div key={ev.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <strong className="text-stone-900 block font-semibold">{ev.title}</strong>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500">
                        <span>{ev.date}</span>
                        <span>•</span>
                        <span>Verifier: {ev.verifierName}</span>
                        <span>•</span>
                        <span className="font-mono text-stone-400">{ev.fileHash}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-white text-stone-700 border border-stone-200 text-[10px] font-mono">
                      {ev.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WHAT DIDN'T WORK (CANDID TRANSPARENCY) */}
          {activeTab === 'negative' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-amber-900 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Transparent Challenge Disclosure: "What Didn't Work"</span>
                </div>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  Real international development encounters setbacks: monsoon floods, unseasonal frost, delivery delays, or sapling mortality. We report failures openly because true trust requires unvarnished truth.
                </p>
              </div>

              <div className="space-y-3">
                {project.negativeDataLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-stone-900 font-bold">{log.title}</strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                        {log.resolutionStatus}
                      </span>
                    </div>
                    <p className="text-stone-700 leading-relaxed text-[11px]">{log.description}</p>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[11px] text-emerald-950">
                      <strong className="block text-emerald-800 mb-0.5">Lesson Learned & Adaptation:</strong>
                      <span>{log.lessonsLearned}</span>
                    </div>
                  </div>
                ))}

                {project.negativeDataLogs.length === 0 && (
                  <div className="p-6 text-center text-stone-500 text-xs border border-dashed border-stone-200 rounded-2xl">
                    No major project incidents recorded to date. Regular telemetry continues.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: FUTURE CAPSULE & 100-YEAR HORIZON */}
          {activeTab === 'future' && (
            <div className="space-y-6">
              {project.futureCapsule ? (
                <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Hourglass className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-white font-display text-sm">
                        Sealed Future Capsule (Release Year: {project.futureCapsule.releaseYear})
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono bg-stone-800 px-2 py-0.5 rounded text-amber-300">
                      Sealed in {project.futureCapsule.sealedYear}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
                      <strong className="text-amber-400 block mb-1 text-[10px] uppercase">Founding Book for the Future:</strong>
                      <span className="text-white font-semibold">{project.futureCapsule.foundingBookTitle}</span>
                      <span className="text-stone-400 block text-[11px]">by {project.futureCapsule.foundingBookAuthor}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
                      <strong className="text-emerald-400 block mb-1 text-[10px] uppercase">Founding Tree Marker:</strong>
                      <span className="text-white font-semibold">{project.futureCapsule.foundingTreeSpecies}</span>
                      <span className="text-stone-400 block text-[11px]">Caretaker: {project.futureCapsule.caretakerName}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-800/50 border border-stone-700 text-xs italic text-stone-300">
                    "{project.futureCapsule.hopesForCenturySummary}"
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-stone-500 text-xs border border-dashed border-stone-200 rounded-2xl">
                  Future capsule sealing ceremony scheduled for grand opening assembly.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500">
            <span className="font-semibold text-stone-800">{project.communityName}</span> • Partner: {project.localPartner.name}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onGiveTreeForProject(project)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-emerald-800 font-bold text-xs border border-emerald-300 shadow-xs flex items-center space-x-1.5 transition-transform active:scale-95"
            >
              <span>🌳</span>
              <span>Give a Tree</span>
            </button>

            <button
              onClick={() => onPlantForProject(project)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center space-x-1.5 transition-transform active:scale-95"
            >
              <span>🌱</span>
              <span>Plant for this Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
