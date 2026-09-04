// =========================================================================
// TRIB AI MATCHER & SKILL EXCHANGE MODAL
// Matches donors, volunteers, translators, and builders with high-need libraries
// =========================================================================

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Trees, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  HeartHandshake,
  Compass,
  Wrench
} from 'lucide-react';
import { LibraryProject, SkillOpportunity } from '../types';
import { MOCK_SKILL_OPPORTUNITIES } from '../data/mockLivingForests';

interface TribAiMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: LibraryProject[];
  onSelectProject: (project: LibraryProject) => void;
  onOpenPlantModalForProject: (project: LibraryProject) => void;
}

export const TribAiMatcherModal: React.FC<TribAiMatcherModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onOpenPlantModalForProject,
}) => {
  const [roleMode, setRoleMode] = useState<'DONOR' | 'VOLUNTEER' | 'BOOK_PUBLISHER'>('DONOR');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['indigenous_languages']);
  const [skillCategory, setSkillCategory] = useState<string>('TRANSLATE');
  const [matchedResults, setMatchedResults] = useState<LibraryProject[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRunMatch = () => {
    // Intelligent matching logic
    let matches = [...projects];
    if (selectedInterests.includes('river_water')) {
      matches = matches.filter(p => p.id.includes('mekong') || p.id.includes('fiji'));
    } else if (selectedInterests.includes('mountains_andes')) {
      matches = matches.filter(p => p.id.includes('peru') || p.id.includes('morocco'));
    } else if (selectedInterests.includes('pastoral_nomad')) {
      matches = matches.filter(p => p.id.includes('kenya'));
    }
    
    if (matches.length === 0) {
      matches = projects.slice(0, 3);
    }

    setMatchedResults(matches);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="trib-ai-matcher-modal"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-stone-900 to-emerald-950 text-white p-6 sm:p-7 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trib Matcher & Skill Exchange</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white">
              Connect Your Passion to Sovereign Libraries
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-md">
              Find exactly where your books, translation skills, architectural expertise, or regenerative gift will create the greatest generational impact.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Select Role Mode */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              1. What would you like to contribute?
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'DONOR', label: 'Financial Gift / Endow', icon: '🌱' },
                { id: 'VOLUNTEER', label: 'Skills & Translation', icon: '🛠️' },
                { id: 'BOOK_PUBLISHER', label: 'Curated Books / Prints', icon: '📚' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setRoleMode(m.id as any);
                    setHasSearched(false);
                  }}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                    roleMode === m.id
                      ? 'bg-indigo-950 text-white border-indigo-950 shadow-md ring-2 ring-indigo-400/30'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  <div className="text-xl mb-1">{m.icon}</div>
                  <div>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Affinities / Skills */}
          {roleMode === 'DONOR' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                2. Which landscapes or causes move your heart?
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'indigenous_languages', label: 'Indigenous Language Stewardship' },
                  { id: 'river_water', label: 'Riverboat & Mangrove Waterways' },
                  { id: 'mountains_andes', label: 'High Andes & Mountain Slopes' },
                  { id: 'pastoral_nomad', label: 'Pastoralist & Semi-Arid Deserts' },
                  { id: 'post_disaster', label: 'Earthquake / Climate Rebuilding' },
                ].map((item) => {
                  const isChecked = selectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {roleMode === 'VOLUNTEER' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700">
                2. Select Your Specific Field of Craft
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'TRANSLATE', label: 'Translation & Audio', icon: '🗣️' },
                  { id: 'DESIGN', label: 'Biophilic Blueprints', icon: '📐' },
                  { id: 'TEACH', label: 'Curriculum & STEM', icon: '🧪' },
                  { id: 'BOTANY', label: 'Nursery Stewardship', icon: '🌿' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSkillCategory(s.id)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      skillCategory === s.id
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <div className="text-base">{s.icon}</div>
                    <div className="mt-0.5">{s.label}</div>
                  </button>
                ))}
              </div>

              {/* Verified Volunteer Opportunities List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-stone-800 block">Current Urgent Needs:</span>
                {MOCK_SKILL_OPPORTUNITIES.map((opp) => (
                  <div key={opp.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-stone-900 font-bold block">{opp.title}</strong>
                      <span className="text-[11px] text-emerald-800 font-semibold">{opp.projectName}</span>
                      <p className="text-stone-600 text-[11px] mt-0.5">{opp.description}</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-white text-stone-700 border border-stone-200 font-mono text-[10px] shrink-0">
                      {opp.commitmentHoursWeekly}h/week
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trigger Match Action */}
          <div className="pt-2">
            <button
              type="button"
              id="btn-run-trib-match"
              onClick={handleRunMatch}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-900 via-stone-900 to-emerald-900 hover:from-indigo-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Run Trib Intelligent Match</span>
            </button>
          </div>

          {/* Results Output */}
          {hasSearched && (
            <div className="space-y-3 pt-3 border-t border-stone-200 animate-in fade-in duration-300">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Top Aligned Sovereign Projects ({matchedResults.length} Found)
              </h4>

              <div className="space-y-2.5">
                {matchedResults.map((proj) => (
                  <div 
                    key={proj.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900">{proj.name}</span>
                        <span className="text-stone-500 font-medium">({proj.countryName})</span>
                      </div>
                      <p className="text-stone-600 text-[11px] max-w-xl">{proj.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectProject(proj);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs"
                      >
                        View Dossier
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenPlantModalForProject(proj);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1"
                      >
                        <span>🌱 Plant</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
