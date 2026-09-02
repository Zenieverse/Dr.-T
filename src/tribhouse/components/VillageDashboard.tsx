import React, { useState } from 'react';
import { 
  Trees, BookOpen, Network, UserCheck, ShieldCheck, Hourglass, 
  Users, GraduationCap, Mic, UserPlus, ShoppingBag, Sparkles, 
  Search, ArrowRight, Heart, Leaf, Globe, CheckCircle2, Compass
} from 'lucide-react';
import { KNOWLEDGE_BRANCHES } from '../data/branchesData';
import { MOCK_ECOLOGY_GROVES } from '../data/mockGrovesAndTrees';
import { TribRoomId } from '../types';
import { tribStorage } from '../services/tribStorageService';

interface VillageDashboardProps {
  onNavigateView?: (view: any) => void;
  onSelectRoom?: (roomId: any, extraContext?: any) => void;
  onOpenTribLibrarian?: (mode?: any, query?: string) => void;
  onOpenBookInNest?: (book: any) => void;
  onOpenLibrarianModal?: (context?: string, initialQuery?: string) => void;
  onNavigateBranch?: (branchId: any) => void;
}

export const VillageDashboard: React.FC<VillageDashboardProps> = ({
  onNavigateView,
  onSelectRoom,
  onOpenTribLibrarian,
  onOpenBookInNest,
  onOpenLibrarianModal,
  onNavigateBranch
}) => {
  const handleNav = (roomKey: string) => {
    if (onNavigateView) {
      if (roomKey === 'library') onNavigateView('canopy');
      else if (roomKey === 'campus' || roomKey === 'campus_architecture') onNavigateView('campus');
      else if (roomKey === 'reading_nest') onNavigateView('reading');
      else if (roomKey === 'personal_forest') onNavigateView('forest');
      else if (roomKey === 'century_branch') onNavigateView('century');
      else if (roomKey === 'community_forest') onNavigateView('community');
      else if (roomKey === 'learning_paths') onNavigateView('paths');
      else if (roomKey === 'mentorship') onNavigateView('mentorship');
      else if (roomKey === 'commons_market') onNavigateView('market');
      else onNavigateView(roomKey);
    } else if (onSelectRoom) {
      onSelectRoom(roomKey as any);
    }
  };

  const handleAskTrib = (mode?: string, query?: string) => {
    if (onOpenLibrarianModal) {
      onOpenLibrarianModal(mode, query);
    } else if (onOpenTribLibrarian) {
      onOpenTribLibrarian(mode, query);
    }
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [reflectionText, setReflectionText] = useState<string>('');
  const [reflectionSaved, setReflectionSaved] = useState<boolean>(false);

  const personalForest = tribStorage.getPersonalForest();

  const totalTrees = MOCK_ECOLOGY_GROVES.reduce((acc, g) => acc + g.totalTrees, 0);

  const categories = [
    { key: 'ALL', label: 'All 18 Branches' },
    { key: 'ECOLOGY', label: 'Ecology & Living Soil' },
    { key: 'HUMANITIES', label: 'Humanities & Classics' },
    { key: 'SCIENCES', label: 'Sciences & Systems' },
    { key: 'CONTEMPLATION', label: 'Contemplation & Zen' },
    { key: 'COMMONS', label: 'Commons & Craft' },
    { key: 'FUTURE', label: '100-Year Horizon' },
  ];

  const filteredBranches = KNOWLEDGE_BRANCHES.filter(branch => {
    const sub = branch.subtitle || branch.tagline || '';
    const tree = branch.associatedTreeSpecies || '';
    const matchesSearch = 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'ECOLOGY') return ['earth', 'agriculture', 'seedlings'].includes(branch.id);
    if (selectedCategory === 'HUMANITIES') return ['literature', 'arts', 'history', 'languages'].includes(branch.id);
    if (selectedCategory === 'SCIENCES') return ['science', 'tech', 'mind', 'health'].includes(branch.id);
    if (selectedCategory === 'CONTEMPLATION') return ['zen', 'music', 'indigenous'].includes(branch.id);
    if (selectedCategory === 'COMMONS') return ['work', 'family', 'skills'].includes(branch.id);
    if (selectedCategory === 'FUTURE') return ['future'].includes(branch.id);
    return true;
  });

  const roomsList: { id: string; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    { id: 'campus', title: 'Living Campus 3D', subtitle: '12 treehouse pavilions, 20 master architectural perspectives & 100-yr blueprints', icon: <Compass className="w-5 h-5" />, color: 'bg-emerald-600' },
    { id: 'library', title: 'Canopy Library', subtitle: '1,480+ curated books across 18 living branches', icon: <BookOpen className="w-5 h-5" />, color: 'bg-amber-600' },
    { id: 'reading_nest', title: 'Reading Nest', subtitle: 'Distraction-free slow reading with ambient soundscapes', icon: <Leaf className="w-5 h-5" />, color: 'bg-emerald-600' },
    { id: 'graph', title: 'Knowledge Graph', subtitle: 'Living topological network of ideas and primary citations', icon: <Network className="w-5 h-5" />, color: 'bg-indigo-600' },
    { id: 'personal_forest', title: 'Personal Forest', subtitle: 'Sovereign shelf, reading memory, leaves & Trib Passport', icon: <UserCheck className="w-5 h-5" />, color: 'bg-teal-600' },
    { id: 'groves', title: 'TreeLedger & Groves', subtitle: 'Verifiable physical forests funded by collective reading', icon: <Trees className="w-5 h-5" />, color: 'bg-green-600' },
    { id: 'century_branch', title: '100-Year Century Branch', subtitle: 'Letters to 2126 and deep-time stewardship archives', icon: <Hourglass className="w-5 h-5" />, color: 'bg-purple-600' },
    { id: 'community_forest', title: 'Community Voice Forest', subtitle: 'Oral histories, indigenous recipes, and vernacular craft guides', icon: <Users className="w-5 h-5" />, color: 'bg-rose-600' },
    { id: 'learning_paths', title: 'Learning Journeys', subtitle: 'Curated 7-to-30 day paths on living soil and Socratic thought', icon: <GraduationCap className="w-5 h-5" />, color: 'bg-blue-600' },
    { id: 'story_circle', title: 'Story Circle & Voice', subtitle: 'Elder audio recordings and traditional acoustic oral lore', icon: <Mic className="w-5 h-5" />, color: 'bg-amber-700' },
    { id: 'mentorship', title: 'Intergenerational Bridge', subtitle: 'Elder-youth dialogues and master apprenticeships', icon: <UserPlus className="w-5 h-5" />, color: 'bg-cyan-700' },
    { id: 'marketplace', title: 'Commons Market & 5-Pool', subtitle: 'Transparent regenerative economy (60/20/10/5/5)', icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-emerald-700' },
    { id: 'ai_steward', title: 'Trib Knowledge Steward', subtitle: 'AI Librarian with 6 modes and multi-level explanations', icon: <Sparkles className="w-5 h-5" />, color: 'bg-violet-600' },
  ];

  const handleSaveDailyReflection = () => {
    if (!reflectionText.trim()) return;
    tribStorage.addReflection(
      'Daily Flourishing: What insight did you encounter today that nourishes your care for the living world?',
      reflectionText,
      'earth',
      'Reflective & Grounded'
    );
    setReflectionSaved(true);
    setTimeout(() => {
      setReflectionSaved(false);
      setReflectionText('');
    }, 2500);
  };

  return (
    <div id="tribhouse-village-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero / Motto Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-stone-900 to-stone-950 text-white p-8 md:p-12 shadow-xl border border-emerald-800/40 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
            <Trees className="w-3.5 h-3.5" />
            <span>TRIB-HOUSE • THE LIVING TREEHOUSE COMMONS</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-100 leading-tight">
            Mind feeds mind. People feed knowledge. Trees feed life.
          </h1>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-sans">
            A sanctuary for intergenerational knowledge, slow deep reading, multi-branch inquiry, and physical ecological regeneration. By All. For All.
          </p>

          {/* Quick Actions in Hero */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              id="hero-explore-campus-btn"
              onClick={() => handleNav('campus')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/25"
            >
              <Compass className="w-4 h-4 text-stone-950" />
              <span>Explore 3D Campus Masterplan</span>
            </button>

            <button
              id="hero-explore-library-btn"
              onClick={() => handleNav('library')}
              className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-sm flex items-center gap-2 transition-all border border-stone-700"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Enter Canopy Library</span>
            </button>

            <button
              id="hero-ask-trib-btn"
              onClick={() => handleAskTrib('FIND')}
              className="px-5 py-3 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium text-sm flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ask Trib AI Steward</span>
            </button>

            <button
              id="hero-view-groves-btn"
              onClick={() => handleNav('groves')}
              className="px-5 py-3 rounded-xl bg-stone-800/50 hover:bg-stone-700/50 text-stone-300 border border-stone-800 font-medium text-sm flex items-center gap-2 transition-all"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Inspect Verifiable Groves</span>
            </button>
          </div>
        </div>

        {/* Real-time Telemetry strip */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-stone-300">
          <div>
            <div className="text-2xl font-serif font-bold text-emerald-400">{totalTrees.toLocaleString()}+</div>
            <div className="text-xs text-stone-400 flex items-center gap-1">
              <Trees className="w-3 h-3 text-emerald-500" /> Native Trees Verified
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-amber-300">18 Branches</div>
            <div className="text-xs text-stone-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-amber-400" /> Living Taxonomy
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-cyan-300">384 Letters</div>
            <div className="text-xs text-stone-400 flex items-center gap-1">
              <Hourglass className="w-3 h-3 text-cyan-400" /> Sealed to 2126
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-emerald-300">5-Pool Commons</div>
            <div className="text-xs text-stone-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Transparent Economy
            </div>
          </div>
        </div>
      </div>

      {/* Daily Reflection & Sovereign Flourishing Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Daily Flourishing & Memory Seed</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            What insight did you encounter today that nourishes your care for the living world?
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Recorded in your sovereign Personal Forest. Earns 8 T-Coin dividends for collective ecological stewardship.
          </p>
        </div>

        <div className="w-full md:w-auto flex-1 max-w-md flex items-center gap-2">
          <input
            id="daily-reflection-input"
            type="text"
            value={reflectionText}
            onChange={e => setReflectionText(e.target.value)}
            placeholder="Plant a thought seed today..."
            className="flex-1 px-4 py-2.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            id="save-daily-reflection-btn"
            onClick={handleSaveDailyReflection}
            disabled={!reflectionText.trim() || reflectionSaved}
            className={`px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              reflectionSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 hover:bg-emerald-700'
            }`}
          >
            {reflectionSaved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Seed Planted!</span>
              </>
            ) : (
              <>
                <Leaf className="w-3.5 h-3.5" />
                <span>Plant Leaf</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The 12 Canopy Rooms Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              The 12 Canopy Chambers
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Explore interconnected spaces designed for reading, inquiry, memory, and ecological stewardship
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roomsList.map(room => (
            <button
              key={room.id}
              id={`village-room-card-${room.id}`}
              onClick={() => handleNav(room.id)}
              className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl ${room.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                  {room.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {room.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-2">
                    {room.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                <span>Enter Chamber</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* The 18 Living Knowledge Branches Section */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Trees className="w-6 h-6 text-emerald-600" />
              <span>The 18 Living Knowledge Branches</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Each branch represents a living domain paired with native tree species and community stewards
            </p>
          </div>

          {/* Search within branches */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="branch-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search branches, trees, topics..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              id={`branch-category-${cat.key.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBranches.map(branch => (
            <div
              key={branch.id}
              id={`branch-card-${branch.id}`}
              className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-5 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/50 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{branch.icon}</span>
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">
                        {branch.name}
                      </h3>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        {branch.subtitle || branch.tagline}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                    {branch.bookCount} Books
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                  {branch.description}
                </p>

                {/* Sub-topics chips */}
                {branch.subtopics && branch.subtopics.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {branch.subtopics.slice(0, 3).map((sub: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300"
                      >
                        {sub}
                      </span>
                    ))}
                    {branch.subtopics.length > 3 && (
                      <span className="text-[10px] text-stone-400 self-center">
                        +{branch.subtopics.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="text-stone-400">Tree:</span> <span className="font-medium text-stone-700 dark:text-stone-300">{(branch.associatedTreeSpecies || 'Ancestral Native').split('(')[0]}</span>
                </div>

                <button
                  id={`explore-branch-btn-${branch.id}`}
                  onClick={() => {
                    if (onNavigateBranch) onNavigateBranch(branch.id);
                    else handleNav('library');
                  }}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
