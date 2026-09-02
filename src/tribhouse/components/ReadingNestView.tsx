import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, Sparkles, Leaf, ArrowLeft, ArrowRight, 
  ZoomIn, ZoomOut, Moon, Sun, Coffee, Share2, CheckCircle2, 
  MessageSquare, Volume2, Bookmark, Trees
} from 'lucide-react';
import { Book, Chapter } from '../types';
import { MOCK_BOOKS } from '../data/mockBooks';
import { tribStorage } from '../services/tribStorageService';
import { ambientSound } from '../services/ambientSoundService';

interface ReadingNestViewProps {
  initialBook?: Book;
  onBackToLibrary: () => void;
  onOpenTribWithContext: (bookTitle: string, query?: string) => void;
}

type ReadingTheme = 'sepia' | 'light' | 'dark' | 'forest';

export const ReadingNestView: React.FC<ReadingNestViewProps> = ({
  initialBook,
  onBackToLibrary,
  onOpenTribWithContext
}) => {
  const [currentBook, setCurrentBook] = useState<Book>(initialBook || MOCK_BOOKS[0]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(18);
  const [theme, setTheme] = useState<ReadingTheme>('sepia');
  const [readingMinutes, setReadingMinutes] = useState<number>(0);
  const [selectedQuote, setSelectedQuote] = useState<string>('');
  const [leafSaved, setLeafSaved] = useState<boolean>(false);
  const [bilingualMode, setBilingualMode] = useState<boolean>(false);

  // Active reading timer
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingMinutes(prev => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const activeChapter: Chapter = currentBook.chapters[currentChapterIndex] || {
    id: 'default',
    title: 'Chapter 1: Foundational Readings',
    pageNumber: 1,
    readTimeMinutes: 5,
    content: currentBook.summary
  };

  const handlePlantLeaf = () => {
    if (!selectedQuote.trim()) return;
    tribStorage.addLeaf({
      title: `Reflection on ${currentBook.title}`,
      type: 'HIGHLIGHT',
      branchId: currentBook.branchId,
      content: selectedQuote,
      bookTitle: currentBook.title,
      isPublic: true
    });
    setLeafSaved(true);
    setTimeout(() => {
      setLeafSaved(false);
      setSelectedQuote('');
    }, 2000);
  };

  const handleFinishChapter = () => {
    tribStorage.recordReadingSession({
      bookId: currentBook.id,
      bookTitle: currentBook.title,
      pagesRead: 15,
      durationMinutes: Math.max(5, readingMinutes),
      notesCount: 1
    });
    if (currentChapterIndex < currentBook.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
    }
  };

  const themeStyles = {
    sepia: 'bg-[#fcf8f2] text-[#3d332a] dark:bg-[#2c2620] dark:text-[#ede4d8]',
    light: 'bg-white text-stone-900',
    dark: 'bg-stone-950 text-stone-200',
    forest: 'bg-[#13221b] text-[#d4ede0]'
  };

  return (
    <div id="reading-nest-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Navigation & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            id="back-to-library-btn"
            onClick={onBackToLibrary}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Canopy Library</span>
          </button>

          <div className="h-4 w-px bg-stone-200 dark:bg-stone-800" />

          <div>
            <h2 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm line-clamp-1">
              {currentBook.title}
            </h2>
            <div className="text-[11px] text-stone-500 flex items-center gap-1">
              <span>{currentBook.author}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {currentBook.provenance.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Reader Customizers */}
        <div className="flex items-center gap-2">
          {/* Slow Reading Timer Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Slow Reading: {readingMinutes}m</span>
          </div>

          {/* Font Size controls */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-stone-200 dark:border-stone-700">
            <button
              id="font-decrease-btn"
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="px-2 py-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700 rounded"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-[11px] px-1 text-stone-400">{fontSize}px</span>
            <button
              id="font-increase-btn"
              onClick={() => setFontSize(Math.min(26, fontSize + 2))}
              className="px-2 py-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700 rounded"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-stone-200 dark:border-stone-700">
            <button
              id="theme-sepia-btn"
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded ${theme === 'sepia' ? 'bg-amber-100 text-amber-900 shadow-sm' : 'text-stone-500'}`}
              title="Sepia Warm Canvas"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              id="theme-light-btn"
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded ${theme === 'light' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}
              title="Pure Day Light"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              id="theme-forest-btn"
              onClick={() => setTheme('forest')}
              className={`p-1.5 rounded ${theme === 'forest' ? 'bg-emerald-900 text-emerald-100 shadow-sm' : 'text-stone-500'}`}
              title="Biophilic Forest Twilight"
            >
              <Trees className="w-3.5 h-3.5" />
            </button>
            <button
              id="theme-dark-btn"
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded ${theme === 'dark' ? 'bg-stone-900 text-stone-100 shadow-sm' : 'text-stone-500'}`}
              title="Deep Night"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Ask Trib on this Page */}
          <button
            id="ask-trib-nest-btn"
            onClick={() => onOpenTribWithContext(currentBook.title, `Please summarize and explain key nuances in ${activeChapter.title} of ${currentBook.title}.`)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Trib</span>
          </button>
        </div>
      </div>

      {/* Main Reading Chamber Paper */}
      <div 
        className={`rounded-3xl shadow-lg border border-stone-200/80 dark:border-stone-800 p-8 sm:p-14 transition-colors duration-300 ${themeStyles[theme]}`}
      >
        {/* Chapter Header */}
        <div className="max-w-2xl mx-auto space-y-4 pb-8 border-b border-stone-300/40 dark:border-stone-700/40 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            {currentBook.title}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {activeChapter.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs text-stone-500 dark:text-stone-400">
            <span>Page {activeChapter.pageNumber}</span>
            <span>•</span>
            <span>~{activeChapter.readTimeMinutes} min slow read</span>
            <span>•</span>
            <span>{currentBook.language}</span>
          </div>
        </div>

        {/* Chapter Body with Highlightable Text */}
        <div 
          className="max-w-2xl mx-auto py-10 font-serif leading-relaxed space-y-6"
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
          onMouseUp={() => {
            const selection = window.getSelection()?.toString();
            if (selection && selection.trim().length > 10) {
              setSelectedQuote(selection.trim());
            }
          }}
        >
          {activeChapter.content.split('\n\n').map((paragraph: string, index: number) => (
            <p key={index} className="tracking-normal text-justify">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Plant Leaf / Highlight Drawer if user selected text */}
        {selectedQuote && (
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-emerald-300 dark:border-emerald-700 shadow-md space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Selected Passage to Plant in Personal Forest:</span>
              </span>
              <button
                onClick={() => setSelectedQuote('')}
                className="text-stone-400 hover:text-stone-600 text-xs"
              >
                Dismiss
              </button>
            </div>
            <p className="italic text-xs text-stone-700 dark:text-stone-300 border-l-2 border-emerald-500 pl-3">
              "{selectedQuote}"
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                id="plant-leaf-btn"
                onClick={handlePlantLeaf}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {leafSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Leaf Planted in Forest!</span>
                  </>
                ) : (
                  <>
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Save to Personal Forest (+5 T-Coins)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Chapter Navigation & Finish Action */}
        <div className="max-w-2xl mx-auto pt-8 border-t border-stone-300/40 dark:border-stone-700/40 flex items-center justify-between">
          <button
            id="prev-chapter-btn"
            disabled={currentChapterIndex === 0}
            onClick={() => setCurrentChapterIndex(prev => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-xl bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 text-xs font-medium flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Chapter</span>
          </button>

          <button
            id="finish-chapter-btn"
            onClick={handleFinishChapter}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {currentChapterIndex < currentBook.chapters.length - 1
                ? 'Complete & Next Chapter (+10 T-Coins)'
                : 'Complete Book & Record in Forest'}
            </span>
          </button>

          <button
            id="next-chapter-btn"
            disabled={currentChapterIndex >= currentBook.chapters.length - 1}
            onClick={() => setCurrentChapterIndex(prev => prev + 1)}
            className="px-4 py-2 rounded-xl bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 text-xs font-medium flex items-center gap-1.5"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
