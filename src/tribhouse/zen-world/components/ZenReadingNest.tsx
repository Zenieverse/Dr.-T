import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, 
  Sun, Moon, Coffee, ShieldCheck, Download, Leaf, Volume2, 
  Sparkles, CheckCircle2, Bookmark, Share2, Trees, Music,
  ChevronDown, Layers, Compass, ExternalLink, RefreshCw
} from 'lucide-react';
import { ZenBook, ZenChapter } from '../types';
import { tribStorage } from '../../services/tribStorageService';
import { ambientSound, SoundscapeType } from '../../services/ambientSoundService';

interface ZenReadingNestProps {
  currentBook: ZenBook;
  allBooks: ZenBook[];
  onSelectBook: (book: ZenBook) => void;
  onBackToVault: () => void;
  onTriggerScanAndDownload: (book: ZenBook) => void;
  onAskTrib?: (context: string, initialQuery?: string) => void;
}

export type ZenNestTheme = 'ricepaper' | 'bamboo' | 'inkstone' | 'nightpine' | 'sepia' | 'light';

export const ZenReadingNest: React.FC<ZenReadingNestProps> = ({
  currentBook,
  allBooks,
  onSelectBook,
  onBackToVault,
  onTriggerScanAndDownload,
  onAskTrib
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [theme, setTheme] = useState<ZenNestTheme>('ricepaper');
  const [readingMinutes, setReadingMinutes] = useState<number>(0);
  const [selectedQuote, setSelectedQuote] = useState<string>('');
  const [leafSaved, setLeafSaved] = useState<boolean>(false);
  const [showOriginalVerse, setShowOriginalVerse] = useState<boolean>(true);
  const [isChiming, setIsChiming] = useState<boolean>(false);
  const [isBookPickerOpen, setIsBookPickerOpen] = useState<boolean>(false);
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState<boolean>(false);
  
  // Ambient Soundbar state
  const [soundPlaying, setSoundPlaying] = useState<boolean>(false);
  const [currentSoundscape, setCurrentSoundscape] = useState<SoundscapeType>('temple');

  // Reset chapter index on book change
  useEffect(() => {
    setCurrentChapterIndex(0);
    setReadingMinutes(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentBook.id]);

  // Reading duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingMinutes(prev => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Ambient sound subscription
  useEffect(() => {
    const unsub = ambientSound.subscribe((playing, scape) => {
      setSoundPlaying(playing);
      setCurrentSoundscape(scape);
    });
    return () => unsub();
  }, []);

  const activeChapter: ZenChapter | undefined = currentBook.chapters[currentChapterIndex] || currentBook.chapters[0];

  const handlePlantReflectionLeaf = () => {
    const contentToSave = selectedQuote.trim() || activeChapter?.content.slice(0, 180) || currentBook.quote;

    tribStorage.addLeaf({
      title: `Zen Reflection on ${currentBook.title}`,
      type: 'HIGHLIGHT',
      branchId: 'zen',
      content: contentToSave,
      bookTitle: currentBook.title,
      isPublic: true
    });

    setLeafSaved(true);
    setTimeout(() => {
      setLeafSaved(false);
      setSelectedQuote('');
    }, 2500);
  };

  const handleFinishChapter = () => {
    tribStorage.recordReadingSession({
      bookId: currentBook.id,
      bookTitle: currentBook.title,
      pagesRead: 12,
      durationMinutes: Math.max(5, readingMinutes),
      notesCount: 1
    });

    if (currentChapterIndex < currentBook.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePlayMindfulnessBell = () => {
    setIsChiming(true);
    ambientSound.ringTempleBell(432);
    setTimeout(() => {
      setIsChiming(false);
    }, 2000);
  };

  const themeClasses: Record<ZenNestTheme, { bg: string; text: string; cardBg: string; border: string; accent: string }> = {
    ricepaper: {
      bg: 'bg-[#faf6ed]',
      text: 'text-[#383027]',
      cardBg: 'bg-[#f4eee1]',
      border: 'border-[#e5dcce]',
      accent: 'text-amber-800'
    },
    bamboo: {
      bg: 'bg-[#f3f7f4]',
      text: 'text-[#1c2e24]',
      cardBg: 'bg-[#e5eee7]',
      border: 'border-[#cedecf]',
      accent: 'text-emerald-800'
    },
    inkstone: {
      bg: 'bg-[#18181b]',
      text: 'text-[#e4e4e7]',
      cardBg: 'bg-[#27272a]',
      border: 'border-[#3f3f46]',
      accent: 'text-stone-300'
    },
    nightpine: {
      bg: 'bg-[#0f1f18]',
      text: 'text-[#d4ede0]',
      cardBg: 'bg-[#172c23]',
      border: 'border-[#234335]',
      accent: 'text-emerald-400'
    },
    sepia: {
      bg: 'bg-[#fcf8f2]',
      text: 'text-[#3d332a]',
      cardBg: 'bg-[#f5ecdf]',
      border: 'border-[#e8dac8]',
      accent: 'text-amber-900'
    },
    light: {
      bg: 'bg-white',
      text: 'text-stone-900',
      cardBg: 'bg-stone-50',
      border: 'border-stone-200',
      accent: 'text-emerald-700'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div id="zen-reading-nest" className="space-y-6 animate-fadeIn pb-12">
      {/* Top Sanctuary Control Bar */}
      <div className="sticky top-28 z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl border border-stone-200 dark:border-stone-800 p-3 sm:p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Vault & Current Book Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="nest-back-to-vault-btn"
              onClick={onBackToVault}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-stone-800 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Zen World Manuscript Vault"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Vault</span>
            </button>

            <div className="h-5 w-px bg-stone-300 dark:bg-stone-700 hidden sm:block" />

            {/* Quick Switch Book Dropdown */}
            <div className="relative">
              <button
                id="nest-switch-book-btn"
                onClick={() => setIsBookPickerOpen(!isBookPickerOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition text-left"
              >
                <img 
                  src={currentBook.coverImage} 
                  alt={currentBook.title}
                  referrerPolicy="no-referrer"
                  className="w-5 h-7 object-cover rounded shadow-2xs shrink-0" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="max-w-[140px] sm:max-w-[220px]">
                  <p className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
                    {currentBook.title}
                  </p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                    {currentBook.author} • {currentBook.connectedLibraryName}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>

              {/* Book Switcher Menu */}
              {isBookPickerOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl z-50 p-2 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Switch Zen Manuscript ({allBooks.length})
                  </div>
                  {allBooks.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onSelectBook(b);
                        setIsBookPickerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition ${
                        b.id === currentBook.id 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500/30'
                          : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <img 
                        src={b.coverImage} 
                        alt={b.title} 
                        referrerPolicy="no-referrer"
                        className="w-7 h-10 object-cover rounded shrink-0 shadow-2xs" 
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-serif font-semibold truncate">{b.title}</p>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">{b.author}</p>
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {b.connectedLibraryName}
                        </span>
                      </div>
                      {b.id === currentBook.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Timer, Temple Bell, Font, Themes & Ask AI */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mindful Slow Reading Timer */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800/60"
              title="Time spent in contemplative presence"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>Slow Reading: {readingMinutes}m</span>
            </div>

            {/* Mindfulness Singing Bowl Button */}
            <button
              id="nest-singing-bowl-btn"
              onClick={handlePlayMindfulnessBell}
              className={`p-2 rounded-xl border border-amber-300/60 dark:border-amber-700/60 bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition active:scale-95 flex items-center gap-1.5 text-xs font-semibold ${
                isChiming ? 'ring-2 ring-amber-400 scale-105' : ''
              }`}
              title="Sound 432 Hz Singing Bowl Chime"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden md:inline">{isChiming ? 'Resonating...' : 'Singing Bowl'}</span>
            </button>

            {/* Ambient Soundscape Controller */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-stone-200 dark:border-stone-700 text-xs">
              <button
                onClick={() => ambientSound.togglePlay()}
                className={`p-1.5 rounded-lg transition ${
                  soundPlaying ? 'bg-emerald-600 text-white' : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title={soundPlaying ? 'Pause Ambient Sound' : 'Play Zen Soundscape'}
              >
                <Music className="w-3.5 h-3.5" />
              </button>
              <select
                value={currentSoundscape}
                onChange={e => ambientSound.setSoundscape(e.target.value as SoundscapeType)}
                className="bg-transparent text-[11px] text-stone-700 dark:text-stone-300 pl-1 pr-2 py-0.5 focus:outline-hidden cursor-pointer"
                title="Select biophilic soundscape"
              >
                <option value="temple">Temple Tiles</option>
                <option value="rain">Zen Rain</option>
                <option value="forest">Pine Forest</option>
                <option value="stream">Mountain Stream</option>
                <option value="silence">Silence</option>
              </select>
            </div>

            {/* Font Size & Family Controls */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-stone-200 dark:border-stone-700">
              <button
                id="nest-font-decrease"
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                className="px-2 py-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700 rounded-lg transition"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="text-[11px] font-mono px-1.5 text-stone-500 dark:text-stone-400">{fontSize}</span>
              <button
                id="nest-font-increase"
                onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                className="px-2 py-1 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700 rounded-lg transition"
                title="Increase font size"
              >
                A+
              </button>
              <button
                onClick={() => setFontFamily(prev => prev === 'serif' ? 'sans' : 'serif')}
                className="ml-1 px-1.5 py-0.5 text-[10px] uppercase font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 border-l border-stone-300 dark:border-stone-700"
                title="Toggle Serif/Sans font"
              >
                {fontFamily}
              </button>
            </div>

            {/* Themes Switcher */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setTheme('ricepaper')}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
                  theme === 'ricepaper' ? 'bg-[#faf6ed] text-[#383027] shadow-xs ring-1 ring-amber-300' : 'text-stone-500'
                }`}
                title="Washi Rice Paper Theme"
              >
                Washi
              </button>
              <button
                onClick={() => setTheme('bamboo')}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
                  theme === 'bamboo' ? 'bg-[#f3f7f4] text-[#1c2e24] shadow-xs ring-1 ring-emerald-300' : 'text-stone-500'
                }`}
                title="Bamboo Grove Theme"
              >
                Bamboo
              </button>
              <button
                onClick={() => setTheme('inkstone')}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
                  theme === 'inkstone' ? 'bg-[#18181b] text-[#e4e4e7] shadow-xs ring-1 ring-stone-600' : 'text-stone-500'
                }`}
                title="Sumi-e Inkstone Dark"
              >
                Ink
              </button>
              <button
                onClick={() => setTheme('nightpine')}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
                  theme === 'nightpine' ? 'bg-[#0f1f18] text-[#d4ede0] shadow-xs ring-1 ring-emerald-700' : 'text-stone-500'
                }`}
                title="Night Pine Forest"
              >
                Pine
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`p-1.5 rounded-lg transition ${
                  theme === 'sepia' ? 'bg-[#f5ecdf] text-[#3d332a] shadow-xs ring-1 ring-amber-400' : 'text-stone-500'
                }`}
                title="Contemplative Sepia"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Threat Scan & Clean Download Trigger */}
            <button
              id="nest-scan-download-btn"
              onClick={() => onTriggerScanAndDownload(currentBook)}
              className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800/60 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
              title="Verify virus-free status & download"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">Clean Download</span>
            </button>

            {/* Ask Trib on this Manuscript */}
            {onAskTrib && (
              <button
                id="nest-ask-trib-btn"
                onClick={() => onAskTrib(
                  `Zen World Reading Nest: ${currentBook.title}`,
                  `Please interpret the contemplative meaning of ${activeChapter.title} from ${currentBook.title} (${currentBook.lineage}). How can this koan/teaching be applied to daily mindfulness?`
                )}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Trib</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Reading Chamber Sanctuary */}
      <div 
        className={`rounded-3xl border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} shadow-xl p-6 sm:p-12 md:p-16 transition-colors duration-300`}
      >
        {/* Manuscript Sanctuary Header */}
        <div className="max-w-3xl mx-auto pb-10 border-b border-stone-300/40 dark:border-stone-700/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-500/20 flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentBook.connectedLibraryName}</span>
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-500 dark:text-stone-400 font-serif">
                {currentBook.lineage}
              </span>
            </div>

            {/* Original Script/Verse Toggle */}
            {activeChapter.originalVerse && (
              <button
                onClick={() => setShowOriginalVerse(!showOriginalVerse)}
                className="px-3 py-1 rounded-xl text-xs font-medium bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 transition flex items-center gap-1.5"
              >
                <span>{showOriginalVerse ? 'Hide Calligraphy' : 'Show Original Classical Verse'}</span>
              </button>
            )}
          </div>

          <div className="text-center space-y-2 pt-2">
            {currentBook.kanjiScript && (
              <div className="font-serif text-3xl sm:text-4xl text-stone-400 dark:text-stone-500 tracking-widest opacity-80 select-none">
                {currentBook.kanjiScript}
              </div>
            )}
            
            <h1 className={`text-2xl sm:text-4xl font-bold tracking-tight leading-tight ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}>
              {currentBook.title}
            </h1>

            {currentBook.originalTitle && (
              <p className="text-sm italic text-stone-500 dark:text-stone-400">
                {currentBook.originalTitle} • Authored by {currentBook.author} ({currentBook.year})
              </p>
            )}

            <div className="inline-flex items-center gap-2 pt-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-mono bg-stone-200/60 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border border-stone-300/40 dark:border-stone-700/40">
                Chapter {currentChapterIndex + 1} of {currentBook.chapters.length}
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                ~{activeChapter.readTimeMinutes} min slow reading
              </span>
            </div>
          </div>
        </div>

        {/* Chapter Subtitle & Original Classical Verse Callout */}
        <div className="max-w-3xl mx-auto pt-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wide">
              {activeChapter.title}
            </h2>
            {activeChapter.subtitle && (
              <p className="text-xs sm:text-sm italic text-stone-500 dark:text-stone-400 font-serif">
                {activeChapter.subtitle}
              </p>
            )}
          </div>

          {/* Original Classical Characters & Calligraphy Box */}
          {showOriginalVerse && activeChapter.originalVerse && (
            <div className={`p-6 sm:p-8 rounded-2xl ${currentTheme.cardBg} border ${currentTheme.border} relative overflow-hidden transition-colors`}>
              <div className="absolute right-4 bottom-2 text-stone-300 dark:text-stone-700 text-6xl font-serif opacity-20 pointer-events-none select-none">
                {currentBook.kanjiScript ? currentBook.kanjiScript.slice(0, 1) : '道'}
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-emerald-800 dark:text-emerald-300 font-bold">
                  <span>Classical Verse & Source Root</span>
                  <span className="text-stone-400 lowercase">{currentBook.originalLanguage}</span>
                </div>
                <div className="font-serif text-lg sm:text-xl text-stone-800 dark:text-stone-100 leading-loose tracking-wider whitespace-pre-line border-l-2 border-emerald-600 pl-4 py-1">
                  {activeChapter.originalVerse}
                </div>
              </div>
            </div>
          )}

          {/* Core Manuscript Text Body with Selection to Plant Leaf */}
          <div 
            className={`py-6 leading-relaxed space-y-6 ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
            onMouseUp={() => {
              const selection = window.getSelection()?.toString();
              if (selection && selection.trim().length > 10) {
                setSelectedQuote(selection.trim());
              }
            }}
          >
            {activeChapter.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="tracking-normal text-justify leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Floating Plant Reflection Leaf Action if text is highlighted */}
          {selectedQuote && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-emerald-400 dark:border-emerald-600 shadow-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Highlight & Plant in Personal Forest:</span>
                </div>
                <button
                  onClick={() => setSelectedQuote('')}
                  className="text-stone-400 hover:text-stone-600 text-xs px-2 py-0.5 rounded"
                >
                  Dismiss
                </button>
              </div>

              <blockquote className="text-xs sm:text-sm italic text-stone-700 dark:text-stone-300 border-l-2 border-emerald-500 pl-3 py-1 font-serif">
                "{selectedQuote}"
              </blockquote>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  id="nest-plant-leaf-btn"
                  onClick={handlePlantReflectionLeaf}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
                >
                  {leafSaved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Leaf Planted in Sovereign Forest! (+5 T-Coins)</span>
                    </>
                  ) : (
                    <>
                      <Leaf className="w-4 h-4" />
                      <span>Plant Leaf in Forest (+5 T-Coins)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Meditation & Contemplation Prompt Box */}
          {activeChapter.meditationPrompt && (
            <div className={`p-5 sm:p-6 rounded-2xl ${currentTheme.cardBg} border ${currentTheme.border} space-y-2`}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Mindful Contemplation Prompt</span>
              </div>
              <p className="text-sm italic text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
                "{activeChapter.meditationPrompt}"
              </p>
            </div>
          )}

          {/* Chapter Navigation & Progression Footer */}
          <div className="pt-8 border-t border-stone-300/40 dark:border-stone-700/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              id="nest-prev-chapter-btn"
              disabled={currentChapterIndex === 0}
              onClick={() => {
                setCurrentChapterIndex(prev => Math.max(0, prev - 1));
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Chapter</span>
            </button>

            {/* Complete Chapter / Record Session */}
            <button
              id="nest-complete-chapter-btn"
              onClick={handleFinishChapter}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {currentChapterIndex < currentBook.chapters.length - 1
                  ? 'Complete & Next Chapter (+10 T-Coins)'
                  : 'Complete Manuscript & Record (+10 T-Coins)'}
              </span>
            </button>

            <button
              id="nest-next-chapter-btn"
              disabled={currentChapterIndex >= currentBook.chapters.length - 1}
              onClick={() => {
                setCurrentChapterIndex(prev => prev + 1);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <span>Next Chapter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Chapter Quick Jump Drawer */}
          <div className="pt-4 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-stone-400 mr-1">Jump to:</span>
            {currentBook.chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setCurrentChapterIndex(idx);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition ${
                  idx === currentChapterIndex 
                    ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                    : 'bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
                title={ch.title}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
