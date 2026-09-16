import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Filter, ShieldCheck, Sparkles, Volume2, 
  Leaf, Trees, Globe, Download, Award, CheckCircle2, Heart,
  Network
} from 'lucide-react';
import { ZEN_BOOKS } from './data/zenBooksData';
import { ZenBook, ZenCategory, ConnectedLibrary } from './types';
import { ConnectedLibrariesBar } from './components/ConnectedLibrariesBar';
import { ZenBookCard } from './components/ZenBookCard';
import { ZenThreatScannerModal } from './components/ZenThreatScannerModal';
import { FederatedMeshModal } from './components/FederatedMeshModal';
import { ZenReadingNest } from './components/ZenReadingNest';
import { federatedMesh } from './services/federatedMeshService';
import { ambientSound } from '../services/ambientSoundService';

interface ZenWorldLibraryViewProps {
  onAskTrib?: (query: string) => void;
  initialMode?: 'vault' | 'nest';
  initialBookId?: string;
}

const CATEGORY_TABS: { id: ZenCategory; label: string; count?: number }[] = [
  { id: 'ALL', label: 'All Collections' },
  { id: 'FOUNDATIONAL_KOANS', label: 'Foundational Koans' },
  { id: 'MINDFUL_LIVING', label: 'Mindful Living' },
  { id: 'FOREST_POETRY', label: 'Forest Poetry' },
  { id: 'MIND_SCIENCES', label: 'Mind Sciences' },
  { id: 'DAO_HARMONY', label: 'Daoist Harmony' },
  { id: 'PALM_LEAF_SUTRAS', label: 'Palm-Leaf Sutras' },
];

export const ZenWorldLibraryView: React.FC<ZenWorldLibraryViewProps> = ({
  onAskTrib,
  initialMode = 'vault',
  initialBookId
}) => {
  const [viewMode, setViewMode] = useState<'vault' | 'nest'>(initialMode);
  const [libraries, setLibraries] = useState<ConnectedLibrary[]>(federatedMesh.getNodes());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ZenCategory>('ALL');
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | 'ALL'>('ALL');
  
  const initialBook = initialBookId 
    ? (ZEN_BOOKS.find(b => b.id === initialBookId) || ZEN_BOOKS[0])
    : ZEN_BOOKS[0];
  const [activeReadingBook, setActiveReadingBook] = useState<ZenBook | null>(initialBook);
  const [activeScanningBook, setActiveScanningBook] = useState<ZenBook | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isMeshModalOpen, setIsMeshModalOpen] = useState<boolean>(false);
  const [isChiming, setIsChiming] = useState<boolean>(false);

  useEffect(() => {
    const unsub = federatedMesh.subscribe(() => {
      setLibraries(federatedMesh.getNodes());
    });

    const handleOpenMesh = () => setIsMeshModalOpen(true);
    const handleOpenNest = (e: any) => {
      if (e.detail?.book) {
        setActiveReadingBook(e.detail.book);
      } else if (e.detail?.bookId) {
        const found = ZEN_BOOKS.find(b => b.id === e.detail.bookId);
        if (found) setActiveReadingBook(found);
      }
      setViewMode('nest');
    };

    window.addEventListener('zen-world-open-mesh', handleOpenMesh);
    window.addEventListener('zen-world-open-reading-nest', handleOpenNest);

    return () => {
      unsub();
      window.removeEventListener('zen-world-open-mesh', handleOpenMesh);
      window.removeEventListener('zen-world-open-reading-nest', handleOpenNest);
    };
  }, []);

  // Filter books
  const filteredBooks = ZEN_BOOKS.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.originalTitle && book.originalTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.lineage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedCategory !== 'ALL' && book.category !== selectedCategory) return false;
    if (selectedLibraryId !== 'ALL' && book.connectedLibraryId !== selectedLibraryId) return false;

    return true;
  });

  const handleOpenReader = (book: ZenBook) => {
    setActiveReadingBook(book);
    setViewMode('nest');
    window.scrollTo({ top: 140, behavior: 'smooth' });
  };

  const handleOpenScanner = (book: ZenBook) => {
    setActiveScanningBook(book);
    setIsScannerOpen(true);
  };

  const handlePlayBell = () => {
    setIsChiming(true);
    ambientSound.ringTempleBell(432);
    setTimeout(() => {
      setIsChiming(false);
    }, 2000);
  };

  return (
    <div id="zen-world-library-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Biophilic Zen Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white p-6 sm:p-10 border border-emerald-900/60 shadow-xl">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -top-16 w-80 h-80 bg-teal-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-2xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Trib-House Sanctuary</span>
              </span>
              <button
                id="hero-open-federated-mesh-btn"
                onClick={() => setIsMeshModalOpen(true)}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-stone-800 hover:bg-emerald-950 text-emerald-300 hover:text-emerald-200 border border-emerald-700/60 hover:border-emerald-500 flex items-center gap-1.5 transition active:scale-95 shadow-2xs group cursor-pointer"
                title="Inspect Federated Mesh Topology, P2P Nodes & Gossip Protocols"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse group-hover:scale-125 transition-transform"></span>
                <span>Federated Mesh</span>
                <span className="text-[9px] text-emerald-400 font-bold ml-0.5">({libraries.length} Nodes)</span>
              </button>
            </div>

            <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Zen World <span className="text-emerald-400 font-light italic font-serif">禪の世界</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              An online living sanctuary connecting federated temple vaults, monastic repositories, and university contemplative labs. Enjoy distraction-free online reading in the integrated Reading Nest, and verified threat-free downloads inspected through a 5-engine zero-day virus sandbox.
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-300">
              <button 
                onClick={() => setIsMeshModalOpen(true)}
                className="flex items-center gap-1.5 hover:text-emerald-300 transition text-left cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span><strong>{libraries.length}</strong> Connected Temple Archives</span>
              </button>
              <button
                onClick={() => {
                  if (!activeReadingBook) setActiveReadingBook(ZEN_BOOKS[0]);
                  setViewMode('nest');
                }}
                className="flex items-center gap-1.5 hover:text-emerald-300 transition text-left cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Integrated Zen Reading Nest</span>
              </button>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Multi-Engine Virus Quarantine</span>
              </div>
            </div>
          </div>

          {/* Right Action Box: Reading Nest, Mindfulness Singing Bowl & Mesh */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              id="hero-enter-reading-nest-btn"
              onClick={() => {
                if (!activeReadingBook) setActiveReadingBook(ZEN_BOOKS[0]);
                setViewMode('nest');
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2.5 shadow-md shadow-emerald-950/40 transition active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-emerald-200" />
              <span>Enter Reading Nest</span>
            </button>

            <button
              id="zen-mindfulness-bell-btn"
              onClick={handlePlayBell}
              className={`px-5 py-2.5 rounded-2xl border border-emerald-700/50 bg-stone-800/80 hover:bg-stone-800 text-stone-200 text-xs font-semibold flex items-center gap-2.5 shadow-md transition transform active:scale-95 ${
                isChiming ? 'ring-2 ring-emerald-400 text-emerald-300' : ''
              }`}
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>{isChiming ? 'Singing Bowl Resonating...' : 'Sound Zen Bell (Slow Breath)'}</span>
            </button>

            <button
              id="hero-launch-mesh-btn"
              onClick={() => setIsMeshModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-stone-800/90 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2.5 shadow-md transition active:scale-95"
            >
              <Network className="w-4 h-4 text-teal-400" />
              <span>Explore Federated Mesh</span>
            </button>

            {onAskTrib && (
              <button
                onClick={() => onAskTrib('Guide me to a Zen teaching on overcoming anxiety and finding presence.')}
                className="px-5 py-2.5 rounded-2xl bg-stone-800/90 hover:bg-stone-800 border border-stone-700/80 text-stone-300 text-xs font-semibold flex items-center gap-2 shadow-md transition active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Ask AI Steward</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shrink-0">
          <button
            id="zen-switch-vault-mode-btn"
            onClick={() => setViewMode('vault')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'vault'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs ring-1 ring-stone-900/5 dark:ring-stone-700'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Manuscript Vault</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
              {ZEN_BOOKS.length} Works
            </span>
          </button>

          <button
            id="zen-switch-nest-mode-btn"
            onClick={() => {
              if (!activeReadingBook) setActiveReadingBook(ZEN_BOOKS[0]);
              setViewMode('nest');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === 'nest'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-stone-500 hover:text-emerald-700 dark:hover:text-emerald-400'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Reading Nest</span>
            {activeReadingBook && (
              <span className={`text-[11px] truncate max-w-[140px] sm:max-w-[200px] font-normal hidden sm:inline ${
                viewMode === 'nest' ? 'text-emerald-100' : 'text-stone-400'
              }`}>
                • {activeReadingBook.title}
              </span>
            )}
          </button>
        </div>

        {viewMode === 'nest' && (
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setViewMode('vault')}
              className="text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold flex items-center gap-1 transition"
            >
              <span>← Browse All Vault Manuscripts</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Mode Render */}
      {viewMode === 'nest' && activeReadingBook ? (
        <ZenReadingNest
          currentBook={activeReadingBook}
          allBooks={ZEN_BOOKS}
          onSelectBook={b => setActiveReadingBook(b)}
          onBackToVault={() => setViewMode('vault')}
          onTriggerScanAndDownload={handleOpenScanner}
          onAskTrib={(ctx, q) => onAskTrib?.(q || ctx)}
        />
      ) : (
        <div className="space-y-8 animate-fadeIn">
          {/* Connected Libraries Network Bar */}
          <ConnectedLibrariesBar
            libraries={libraries}
            selectedLibraryId={selectedLibraryId}
            onSelectLibrary={setSelectedLibraryId}
            onOpenMeshModal={() => setIsMeshModalOpen(true)}
          />

          {/* Search & Categories Bar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="zen-search-input"
                  type="text"
                  placeholder="Search koans, sutras, authors, Japanese/Chinese verses..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Results Count & Reset Filter */}
              <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                <span>Showing <strong className="text-stone-800 dark:text-stone-200 font-mono">{filteredBooks.length}</strong> works</span>
                {(selectedCategory !== 'ALL' || selectedLibraryId !== 'ALL' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSelectedLibraryId('ALL');
                      setSearchQuery('');
                    }}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map(book => (
                <ZenBookCard
                  key={book.id}
                  book={book}
                  onReadOnline={handleOpenReader}
                  onTriggerScanAndDownload={handleOpenScanner}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
              <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="font-serif font-bold text-stone-800 dark:text-stone-200 text-lg">
                No Zen manuscripts match your search
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                Try adjusting your search keywords, switching categories, or viewing all connected libraries.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedLibraryId('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700"
              >
                Show All Manuscripts
              </button>
            </div>
          )}
        </div>
      )}

      {/* Threat & Virus Quarantine Scanner Modal */}
      <ZenThreatScannerModal
        book={activeScanningBook}
        isOpen={isScannerOpen}
        onClose={() => {
          setIsScannerOpen(false);
          setActiveScanningBook(null);
        }}
      />

      {/* Decentralized Federated Mesh Topology & Peer Inspector */}
      <FederatedMeshModal
        isOpen={isMeshModalOpen}
        onClose={() => setIsMeshModalOpen(false)}
        onSelectLibraryInView={(id) => {
          setSelectedLibraryId(id);
        }}
      />
    </div>
  );
};
