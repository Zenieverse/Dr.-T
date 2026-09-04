// =========================================================================
// COUNTRY-BY-COUNTRY SYSTEM & VIRTUAL FORESTS
// Structured global registry with dignified, non-extractive country profiles
// =========================================================================

import React, { useState } from 'react';
import { 
  Globe2, 
  Trees, 
  BookOpen, 
  Users, 
  CloudSun, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  HeartHandshake,
  Compass
} from 'lucide-react';
import { CountryDossier, LibraryProject } from '../types';

interface CountryForestsViewProps {
  countries: CountryDossier[];
  projects: LibraryProject[];
  onSelectProject: (project: LibraryProject) => void;
  onPlantForCountry: (country: CountryDossier) => void;
}

export const CountryForestsView: React.FC<CountryForestsViewProps> = ({
  countries,
  projects,
  onSelectProject,
  onPlantForCountry,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(countries[0]?.countryCode || 'VN');

  const selectedCountry = countries.find(c => c.countryCode === selectedCountryCode) || countries[0];
  const countryProjects = projects.filter(p => p.geographicEntity.isoCode === selectedCountryCode || p.countryName.toLowerCase().includes(selectedCountry.countryName.toLowerCase()));

  return (
    <div id="country-forests-registry" className="space-y-6">
      {/* Top Selector Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-stone-900 font-display flex items-center gap-2">
              <span>{selectedCountry.flagEmoji}</span>
              <span>Global Country & Territory Registry</span>
            </h2>
            <p className="text-xs text-stone-500">
              Explore national library access indices, local language ecosystems, partner networks & virtual forests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlantForCountry(selectedCountry)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-transform active:scale-95"
            >
              <span>🌱</span>
              <span>Grow a Library in {selectedCountry.countryName}</span>
            </button>
          </div>
        </div>

        {/* Country Selector Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {countries.map((c) => {
            const isSelected = c.countryCode === selectedCountryCode;
            return (
              <button
                key={c.countryCode}
                id={`tab-country-${c.countryCode}`}
                onClick={() => setSelectedCountryCode(c.countryCode)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                <span className="text-base">{c.flagEmoji}</span>
                <span>{c.countryName}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-emerald-950 text-emerald-300' : 'bg-stone-200 text-stone-600'}`}>
                  {c.activeProjectsCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Country Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Dossier Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {selectedCountry.region}
                </span>
                <h3 className="text-2xl font-black text-stone-900 font-display mt-0.5">
                  {selectedCountry.countryName}
                </h3>
              </div>
              <span className="text-4xl">{selectedCountry.flagEmoji}</span>
            </div>

            {/* Respectful Metrics Summary */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 font-medium">Library Access Index</span>
                <span className="font-bold text-stone-900 flex items-center gap-1">
                  <span className="text-amber-700">{selectedCountry.accessIndexAvg}/100</span>
                  <span className="text-[10px] text-stone-400 font-normal">(Planning Priority)</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 font-medium">Learners Nourished</span>
                <span className="font-bold text-emerald-800">
                  {selectedCountry.learnersNourishedCount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 font-medium">Native Trees Sustained</span>
                <span className="font-bold text-teal-800">
                  {selectedCountry.treesPlantedCount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 font-medium">Mobile Library Fleets</span>
                <span className="font-bold text-stone-800">
                  {selectedCountry.mobileUnitsActiveCount} units active
                </span>
              </div>
            </div>

            {/* Language Ecosystem */}
            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
              <span className="font-bold text-stone-800 block">Languages Stewarded:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCountry.dominantLanguages.map(l => (
                  <span key={l} className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 font-medium text-[11px]">
                    {l}
                  </span>
                ))}
                {selectedCountry.underservedLanguages.map(l => (
                  <span key={l} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-medium text-[11px]">
                    🗣 {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Climate & Resilience */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <CloudSun className="w-3.5 h-3.5 text-amber-700" />
                <span>Climate Context:</span>
              </span>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {selectedCountry.climateSummary}
              </p>
            </div>

            {/* Local Partners */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Partner Ecosystem:</span>
              </span>
              <ul className="list-disc list-inside text-stone-600 text-[11px] space-y-1">
                {selectedCountry.partnerEcosystem.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: The Virtual Country Forest Visualizer & Project Nodes */}
        <div className="lg:col-span-8 space-y-6">
          {/* Virtual Country Forest Canopy */}
          <div className="bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-950 rounded-3xl p-6 text-white border border-emerald-800/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Trees className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-lg font-bold text-white font-display">
                    {selectedCountry.countryName} Living Forest Canopy
                  </h4>
                  <p className="text-xs text-emerald-300">
                    Each tree in this canopy represents a living community library, mobile fleet, or ecological research house.
                  </p>
                </div>
              </div>
            </div>

            {/* Stylized Visual Trees Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {countryProjects.map((proj) => (
                <div 
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className="p-4 rounded-2xl bg-stone-900/80 border border-emerald-500/30 hover:border-emerald-400/80 hover:bg-stone-800/90 transition-all cursor-pointer group space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                        {proj.projectType === 'LIBRARY_GARDEN' ? '🌳' : proj.projectType === 'MOBILE_LIBRARY' ? '⛵' : '🏡'}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                          {proj.name}
                        </h5>
                        <span className="text-[11px] text-stone-400">
                          {proj.communityName} • {proj.lifecycle}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-300 transition-transform group-hover:translate-x-1" />
                  </div>

                  <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">
                    {proj.tagline}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/80 text-[10px] font-mono">
                    <span className="text-emerald-400">
                      📖 {proj.booksInCollectionCount} Books
                    </span>
                    <span className="text-teal-300">
                      🌱 {proj.ecologicalComponent?.plantedCount || 0} Native Trees
                    </span>
                    <span className="text-amber-300">
                      👥 {proj.peopleServedCount} Learners
                    </span>
                  </div>
                </div>
              ))}

              {countryProjects.length === 0 && (
                <div className="col-span-2 p-8 text-center text-stone-400 text-xs border border-dashed border-stone-800 rounded-2xl">
                  No active projects registered in this country yet. Local community proposals are warmly invited!
                </div>
              )}
            </div>

            {/* Highlight Story Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200 flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5 font-bold">Country Milestone Note:</strong>
                <span>{selectedCountry.highlightStory}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
