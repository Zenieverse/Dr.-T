import React, { useState } from 'react';
import { 
  BookOpen, Search, Filter, Sparkles, Trees, CheckCircle2, 
  Clock, ArrowRight, ExternalLink, ShieldCheck, Tag, Info
} from 'lucide-react';
import { MOCK_BOOKS } from '../data/mockBooks';
import { KNOWLEDGE_BRANCHES } from '../data/branchesData';
import { Book, KnowledgeBranchId, ProvenanceBadge } from '../types';

interface CanopyLibraryViewProps {
  initialBranchId?: KnowledgeBranchId;
  onOpenInReadingNest: (book: Book) => void;
  onAskTribAboutBook: (book: Book) => void;
}

export const CanopyLibraryView: React.FC<CanopyLibraryViewProps> = ({
  initialBranchId,
  onOpenInReadingNest,
  onAskTribAboutBook
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<KnowledgeBranchId | 'ALL'>(initialBranchId || 'ALL');
  const [selectedProvenance, setSelectedProvenance] = useState<ProvenanceBadge | 'ALL'>('ALL');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = MOCK_BOOKS.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedBranch !== 'ALL' && book.branchId !== selectedBranch) return false;
    if (selectedProvenance !== 'ALL' && book.provenance !== selectedProvenance) return false;
    return true;
  });

  const getBranchInfo = (branchId: KnowledgeBranchId) => {
    return KNOWLEDGE_BRANCHES.find(b => b.id === branchId);
  };

  const renderProvenanceTag = (prov: ProvenanceBadge) => {
    switch (prov) {
      case 'PUBLIC_DOMAIN':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Public Domain
          </span>
        );
      case 'PEER_REVIEWED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Peer Reviewed
          </span>
        );
      case 'OPEN_ACCESS':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Open Access
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            Community Preserved
          </span>
        );
    }
  };

  return (
    <div id="canopy-library-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Living Treehouse Commons</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Canopy Library & Open Archives
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Curated works of enduring depth, validated provenance, bilingual classics, and ecological foundations
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="library-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search titles, authors, tags..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Branches Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          <button
            id="branch-filter-all"
            onClick={() => setSelectedBranch('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedBranch === 'ALL'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-850 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            All Branches ({MOCK_BOOKS.length})
          </button>
          {KNOWLEDGE_BRANCHES.map(b => (
            <button
              key={b.id}
              id={`branch-filter-${b.id}`}
              onClick={() => setSelectedBranch(b.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedBranch === b.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-850 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <span>{b.icon}</span>
              <span>{b.name}</span>
            </button>
          ))}
        </div>

        {/* Provenance Filter */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Provenance:
          </span>
          {(['ALL', 'PUBLIC_DOMAIN', 'PEER_REVIEWED', 'OPEN_ACCESS', 'COMMUNITY'] as const).map(prov => (
            <button
              key={prov}
              id={`prov-filter-${prov.toLowerCase()}`}
              onClick={() => setSelectedProvenance(prov)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedProvenance === prov
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              {prov === 'ALL' ? 'All Provenance' : prov.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => {
          const branch = getBranchInfo(book.branchId);
          return (
            <div
              key={book.id}
              id={`book-card-${book.id}`}
              className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Book Cover Image */}
                <div className="relative h-44 w-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2">
                    {renderProvenanceTag(book.provenance)}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-stone-900/80 backdrop-blur-sm text-stone-100 text-[10px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{book.readingTimeMinutes} min</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    <span>{branch?.icon}</span>
                    <span>{branch?.name}</span>
                    <span className="text-stone-300 dark:text-stone-700">•</span>
                    <span className="text-stone-500">{book.year}</span>
                  </div>

                  <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {book.title}
                  </h3>

                  <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    by {book.author}
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3">
                    {book.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {book.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-0 space-y-2">
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1">
                    <Trees className="w-3 h-3 text-emerald-600" />
                    <span>{book.associatedTreeSpecies?.split('(')[0] || 'Ancestral Native'}</span>
                  </span>
                  <span>{book.citationsCount} Citations</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    id={`open-reading-nest-btn-${book.id}`}
                    onClick={() => onOpenInReadingNest(book)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Slow Read</span>
                  </button>

                  <button
                    id={`ask-trib-book-btn-${book.id}`}
                    onClick={() => onAskTribAboutBook(book)}
                    className="w-full py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Ask Trib</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
