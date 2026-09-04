import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Network, UserCheck, Trees, Hourglass, 
  Users, GraduationCap, UserPlus, ShoppingBag, Sparkles, Compass, Globe2
} from 'lucide-react';
import { TribHouseView, Book, KnowledgeBranchId } from './types';
import { VillageDashboard } from './components/VillageDashboard';
import { CampusArchitectureView } from './components/CampusArchitectureView';
import { CanopyLibraryView } from './components/CanopyLibraryView';
import { ReadingNestView } from './components/ReadingNestView';
import { KnowledgeGraphExplorer } from './components/KnowledgeGraphExplorer';
import { PersonalForestView } from './components/PersonalForestView';
import { EcologyGrovesView } from './components/EcologyGrovesView';
import { CenturyBranchView } from './components/CenturyBranchView';
import { CommunityForestView } from './components/CommunityForestView';
import { LearningPathsView } from './components/LearningPathsView';
import { MentorshipView } from './components/MentorshipView';
import { CommonsMarketView } from './components/CommonsMarketView';
import { LivingForestsDashboard } from './living-forests/LivingForestsDashboard';
import { TribLibrarianModal } from './components/TribLibrarianModal';
import { AmbientSoundBar } from './components/AmbientSoundBar';
import { MOCK_BOOKS } from './data/mockBooks';

export const TribHouseContainer: React.FC = () => {
  const [activeView, setActiveView] = useState<TribHouseView>('village');
  const [selectedBookForReading, setSelectedBookForReading] = useState<Book | undefined>(undefined);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<KnowledgeBranchId | undefined>(undefined);

  // Listen for global custom events from command palette or internal links
  useEffect(() => {
    const handleCustomNav = (e: any) => {
      if (e.detail?.view) {
        setActiveView(e.detail.view);
        if (e.detail.book) setSelectedBookForReading(e.detail.book);
      }
    };
    const handleOpenLib = () => {
      setIsLibrarianOpen(true);
    };

    window.addEventListener('tribhouse-navigate', handleCustomNav);
    window.addEventListener('tribhouse-open-librarian', handleOpenLib);

    return () => {
      window.removeEventListener('tribhouse-navigate', handleCustomNav);
      window.removeEventListener('tribhouse-open-librarian', handleOpenLib);
    };
  }, []);

  // AI Librarian Modal state
  const [isLibrarianOpen, setIsLibrarianOpen] = useState<boolean>(false);
  const [librarianContext, setLibrarianContext] = useState<string | undefined>(undefined);
  const [librarianInitialQuery, setLibrarianInitialQuery] = useState<string | undefined>(undefined);

  const handleOpenLibrarian = (context?: string, initialQuery?: string) => {
    setLibrarianContext(context);
    setLibrarianInitialQuery(initialQuery);
    setIsLibrarianOpen(true);
  };

  const handleOpenReadingNest = (book: Book) => {
    setSelectedBookForReading(book);
    setActiveView('reading');
  };

  const handleNavigateBranch = (branchId: KnowledgeBranchId) => {
    setSelectedBranchFilter(branchId);
    setActiveView('canopy');
  };

  const navItems: { id: TribHouseView; label: string; icon: React.ReactNode }[] = [
    { id: 'living-forests', label: 'Living Forests & Map', icon: <Globe2 className="w-3.5 h-3.5" /> },
    { id: 'village', label: 'Village Hub', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'campus', label: 'Living Campus 3D', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'canopy', label: 'Canopy Library', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'reading', label: 'Reading Nest', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'graph', label: 'Knowledge Graph', icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'forest', label: 'Personal Forest', icon: <UserCheck className="w-3.5 h-3.5" /> },
    { id: 'groves', label: 'Physical Groves', icon: <Trees className="w-3.5 h-3.5" /> },
    { id: 'century', label: '100-Yr Branch', icon: <Hourglass className="w-3.5 h-3.5" /> },
    { id: 'community', label: 'Oral Heritage', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'paths', label: 'Study Paths', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'mentorship', label: 'Elder Bridge', icon: <UserPlus className="w-3.5 h-3.5" /> },
    { id: 'market', label: 'Marketplace', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
  ];

  return (
    <div id="tribhouse-root" className="min-h-screen bg-stone-50/80 text-stone-900 flex flex-col justify-between pb-24">
      {/* Sub-Navigation Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100/80 shadow-xs px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto py-2.5">
          <div className="flex items-center gap-1.5 shrink-0">
            {navItems.map(item => (
              <button
                key={item.id}
                id={`trib-nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 ring-1 ring-emerald-400/40'
                    : 'text-stone-700 hover:text-emerald-950 hover:bg-emerald-50/80 border border-transparent hover:border-emerald-200/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Trigger for Trib AI Steward */}
          <button
            id="trib-floating-ask-btn"
            onClick={() => handleOpenLibrarian()}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shrink-0 transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult Trib</span>
          </button>
        </div>
      </div>

      {/* Main View Render */}
      <main className="flex-1">
        {activeView === 'village' && (
          <VillageDashboard
            onNavigateView={setActiveView}
            onOpenBookInNest={handleOpenReadingNest}
            onOpenLibrarianModal={handleOpenLibrarian}
            onNavigateBranch={handleNavigateBranch}
          />
        )}

        {activeView === 'campus' && (
          <CampusArchitectureView
            onNavigateToView={setActiveView}
            onOpenTribLibrarian={handleOpenLibrarian}
          />
        )}

        {activeView === 'canopy' && (
          <CanopyLibraryView
            initialBranchId={selectedBranchFilter}
            onOpenInReadingNest={handleOpenReadingNest}
            onAskTribAboutBook={book => handleOpenLibrarian(book.title, `Please summarize key insights from ${book.title} by ${book.author}.`)}
          />
        )}

        {activeView === 'reading' && (
          <ReadingNestView
            initialBook={selectedBookForReading || MOCK_BOOKS[0]}
            onBackToLibrary={() => setActiveView('canopy')}
            onOpenTribWithContext={(topic, query) => handleOpenLibrarian(topic, query)}
          />
        )}

        {activeView === 'graph' && (
          <KnowledgeGraphExplorer
            onOpenTribWithContext={(topic, query) => handleOpenLibrarian(topic, query)}
            onOpenBookFromNode={title => {
              const b = MOCK_BOOKS.find(x => x.title.toLowerCase().includes(title.toLowerCase()));
              if (b) handleOpenReadingNest(b);
            }}
          />
        )}

        {activeView === 'forest' && (
          <PersonalForestView
            onOpenReadingNestWithBook={title => {
              const b = MOCK_BOOKS.find(x => x.title.toLowerCase().includes(title.toLowerCase()));
              if (b) handleOpenReadingNest(b);
            }}
            onAskTrib={query => handleOpenLibrarian(undefined, query)}
          />
        )}

        {activeView === 'groves' && (
          <EcologyGrovesView
            onOpenTribWithContext={(topic, query) => handleOpenLibrarian(topic, query)}
          />
        )}

        {activeView === 'century' && (
          <CenturyBranchView
            onAskTrib={query => handleOpenLibrarian('100-Year Century Branch', query)}
          />
        )}

        {activeView === 'community' && (
          <CommunityForestView
            onAskTrib={query => handleOpenLibrarian('Community Oral Lore', query)}
          />
        )}

        {activeView === 'paths' && (
          <LearningPathsView
            onAskTrib={query => handleOpenLibrarian('Curated Learning Paths', query)}
          />
        )}

        {activeView === 'mentorship' && (
          <MentorshipView
            onAskTrib={query => handleOpenLibrarian('Intergenerational Mentorship', query)}
          />
        )}

        {activeView === 'market' && (
          <CommonsMarketView />
        )}

        {activeView === 'living-forests' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <LivingForestsDashboard />
          </div>
        )}
      </main>

      {/* Persistent Biophilic Ambient Sound Bar */}
      <AmbientSoundBar />

      {/* Trib AI Knowledge Steward Modal */}
      <TribLibrarianModal
        isOpen={isLibrarianOpen}
        onClose={() => setIsLibrarianOpen(false)}
        initialContext={librarianContext}
        initialQuery={librarianInitialQuery}
      />
    </div>
  );
};
