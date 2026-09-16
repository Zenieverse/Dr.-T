import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, ArrowLeft, ArrowRight, X, ZoomIn, ZoomOut, 
  Sun, Moon, Coffee, ShieldCheck, Download, Leaf, Volume2, 
  Sparkles, CheckCircle2, Bookmark, Share2, Trees
} from 'lucide-react';
import { ZenBook, ZenChapter } from '../types';
import { tribStorage } from '../../services/tribStorageService';
import { ambientSound } from '../../services/ambientSoundService';

interface ZenReaderModalProps {
  book: ZenBook | null;
  isOpen: boolean;
  onClose: () => void;
  onTriggerScanAndDownload: (book: ZenBook) => void;
}

type ZenReaderTheme = 'ricepaper' | 'bamboo' | 'inkstone' | 'nightpine';

export const ZenReaderModal: React.FC<ZenReaderModalProps> = ({
  book,
  isOpen,
  onClose,
  onTriggerScanAndDownload
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(18);
  const [theme, setTheme] = useState<ZenReaderTheme>('ricepaper');
  const [readingMinutes, setReadingMinutes] = useState<number>(0);
  const [selectedQuote, setSelectedQuote] = useState<string>('');
  const [leafSaved, setLeafSaved] = useState<boolean>(false);
  const [showOriginalVerse, setShowOriginalVerse] = useState<boolean>(true);
  const [isChiming, setIsChiming] = useState<boolean>(false);

  useEffect(() => {
    setCurrentChapterIndex(0);
    setReadingMinutes(0);
  }, [book?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setReadingMinutes(prev => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const activeChapter: ZenChapter | undefined = book?.chapters[currentChapterIndex];

  const handlePlantReflectionLeaf = () => {
    if (!book) return;
    const contentToSave = selectedQuote.trim() || activeChapter?.content.slice(0, 180) || book.quote;

    tribStorage.addLeaf({
      title: `Zen Reflection on ${book.title}`,
      type: 'HIGHLIGHT',
      branchId: 'zen',
      content: contentToSave,
      bookTitle: book.title,
      isPublic: true
    });

    setLeafSaved(true);
    setTimeout(() => {
      setLeafSaved(false);
      setSelectedQuote('');
    }, 2500);
  };

  const handlePlayMindfulnessBell = () => {
    setIsChiming(true);
    ambientSound.ringTempleBell(432);
    setTimeout(() => {
      setIsChiming(false);
    }, 2000);
  };

  if (!isOpen || !book || !activeChapter) return null;

  const themeClasses: Record<ZenReaderTheme, { bg: string; text: string; cardBg: string; border: string }> = {
    ricepaper: {
      bg: 'bg-[#faf6ed]',
      text: 'text-[#383027]',
      cardBg: 'bg-[#f4eee1]',
      border: 'border-[#e4dcce]'
    },
    bamboo: {
      bg: 'bg-[#f3f7f4]',
      text: 'text-[#1c2e24]',
      cardBg: 'bg-[#e5eee7]',
      border: 'border-[#cedecf]'
    },
    inkstone: {
      bg: 'bg-[#18181b]',
      text: 'text-[#e4e4e7]',
      cardBg: 'bg-[#27272a]',
      border: 'border-[#3f3f46]'
    },
    nightpine: {
      bg: 'bg-[#0f1f18]',
      text: 'text-[#d7ebe1]',
      cardBg: 'bg-[#183126]',
      border: 'border-[#26483a]'
    }
  };

  const currentStyle = themeClasses[theme];

  return (
    <div 
      id="zen-reader-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-4xl h-[94vh] rounded-3xl border ${currentStyle.border} shadow-2xl flex flex-col overflow-hidden transition-colors duration-300 ${currentStyle.bg} ${currentStyle.text}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className={`px-5 py-3.5 border-b ${currentStyle.border} flex flex-wrap items-center justify-between gap-3 shrink-0 ${currentStyle.cardBg}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition"
              title="Close Zen Reader"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="font-serif font-bold text-sm tracking-tight flex items-center gap-2">
                <span>{book.title}</span>
                {book.originalTitle && (
                  <span className="text-xs opacity-75 hidden sm:inline">({book.originalTitle})</span>
                )}
              </div>
              <div className="text-[11px] opacity-75">
                {book.author} • {book.connectedLibraryName}
              </div>
            </div>
          </div>

          {/* Reading Controls */}
          <div className="flex items-center gap-2 text-xs">
            {/* Zen Bell trigger */}
            <button
              id="zen-bell-trigger-btn"
              onClick={handlePlayMindfulnessBell}
              className={`px-2.5 py-1.5 rounded-xl border ${currentStyle.border} flex items-center gap-1.5 transition ${isChiming ? 'scale-110 bg-amber-500/20 text-amber-600' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
              title="Sound Mindfulness Singing Bell"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Zen Bell</span>
            </button>

            {/* Font Size controls */}
            <div className={`flex items-center rounded-xl border ${currentStyle.border} overflow-hidden`}>
              <button
                onClick={() => setFontSize(prev => Math.max(15, prev - 1))}
                className="px-2 py-1.5 hover:bg-black/10 dark:hover:bg-white/10"
                title="Decrease Font Size"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px]">{fontSize}px</span>
              <button
                onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
                className="px-2 py-1.5 hover:bg-black/10 dark:hover:bg-white/10"
                title="Increase Font Size"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Theme switcher */}
            <div className={`flex items-center rounded-xl border ${currentStyle.border} p-0.5 gap-0.5`}>
              <button
                onClick={() => setTheme('ricepaper')}
                className={`w-6 h-6 rounded-lg text-[10px] font-bold ${theme === 'ricepaper' ? 'ring-2 ring-amber-600 bg-[#faf6ed] text-[#383027]' : 'opacity-60'}`}
                title="Rice Paper (Warm Washi)"
              >
                紙
              </button>
              <button
                onClick={() => setTheme('bamboo')}
                className={`w-6 h-6 rounded-lg text-[10px] font-bold ${theme === 'bamboo' ? 'ring-2 ring-emerald-600 bg-[#f3f7f4] text-[#1c2e24]' : 'opacity-60'}`}
                title="Bamboo Grove"
              >
                竹
              </button>
              <button
                onClick={() => setTheme('inkstone')}
                className={`w-6 h-6 rounded-lg text-[10px] font-bold ${theme === 'inkstone' ? 'ring-2 ring-slate-400 bg-[#18181b] text-white' : 'opacity-60'}`}
                title="Ink Stone Dark"
              >
                硯
              </button>
              <button
                onClick={() => setTheme('nightpine')}
                className={`w-6 h-6 rounded-lg text-[10px] font-bold ${theme === 'nightpine' ? 'ring-2 ring-emerald-400 bg-[#0f1f18] text-[#d7ebe1]' : 'opacity-60'}`}
                title="Night Pine Forest"
              >
                松
              </button>
            </div>

            {/* Direct Virus-Scan Download Trigger */}
            <button
              onClick={() => onTriggerScanAndDownload(book)}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
              title="Threat Scan & Download"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden md:inline">Scan & Download</span>
            </button>
          </div>
        </div>

        {/* Reader Chapter Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 md:px-20 py-8 space-y-6 scrollbar-thin">
          {/* Chapter Header */}
          <div className="text-center space-y-2 pb-6 border-b border-current/10">
            <div className="text-xs uppercase tracking-widest opacity-60 font-mono">
              Chapter {currentChapterIndex + 1} of {book.chapters.length} • {activeChapter.readTimeMinutes} min slow read
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight">
              {activeChapter.title}
            </h2>
            {activeChapter.subtitle && (
              <div className="font-serif italic text-sm opacity-80">
                {activeChapter.subtitle}
              </div>
            )}
          </div>

          {/* Original Verse / Calligraphy Card if available */}
          {activeChapter.originalVerse && (
            <div className={`p-4 rounded-2xl border ${currentStyle.border} ${currentStyle.cardBg} space-y-2`}>
              <div className="flex items-center justify-between text-xs opacity-70">
                <span className="font-mono text-[10px] uppercase tracking-wider">Original Canon / Kanbun Verse</span>
                <button
                  onClick={() => setShowOriginalVerse(!showOriginalVerse)}
                  className="hover:underline font-serif"
                >
                  {showOriginalVerse ? 'Hide' : 'Show Verse'}
                </button>
              </div>
              {showOriginalVerse && (
                <p className="font-serif text-center text-lg sm:text-xl tracking-widest leading-relaxed py-2 opacity-95">
                  {activeChapter.originalVerse}
                </p>
              )}
            </div>
          )}

          {/* Meditative Contemplation Prompt */}
          {activeChapter.meditationPrompt && (
            <div className="p-4 rounded-2xl bg-emerald-900/10 border border-emerald-700/20 text-xs flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-800 dark:text-emerald-300 font-semibold mb-0.5">
                  Mindfulness Breath Anchor
                </strong>
                <span className="opacity-90">{activeChapter.meditationPrompt}</span>
              </div>
            </div>
          )}

          {/* Text Content */}
          <div 
            className="font-serif leading-relaxed whitespace-pre-line tracking-normal space-y-4"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
          >
            {activeChapter.content}
          </div>

          {/* Reflection Leaf Quick Saver */}
          <div className={`mt-8 p-4 rounded-2xl border ${currentStyle.border} ${currentStyle.cardBg} flex flex-wrap items-center justify-between gap-3 text-xs`}>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Plant this insight into your Sovereign Trib-House Forest?</span>
            </div>
            <button
              id="zen-plant-leaf-btn"
              onClick={handlePlantReflectionLeaf}
              disabled={leafSaved}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95"
            >
              {leafSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Planted to Forest!</span>
                </>
              ) : (
                <>
                  <Trees className="w-3.5 h-3.5" />
                  <span>Plant Reflection Leaf</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Chapter Navigation */}
        <div className={`px-5 py-3 border-t ${currentStyle.border} flex items-center justify-between gap-4 shrink-0 ${currentStyle.cardBg} text-xs`}>
          <button
            onClick={() => setCurrentChapterIndex(prev => Math.max(0, prev - 1))}
            disabled={currentChapterIndex === 0}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-semibold transition ${
              currentChapterIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Koan / Chapter</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-[11px] opacity-75">
            <Clock className="w-3.5 h-3.5" />
            <span>Session: {readingMinutes} min</span>
          </div>

          <button
            onClick={() => setCurrentChapterIndex(prev => Math.min(book.chapters.length - 1, prev + 1))}
            disabled={currentChapterIndex === book.chapters.length - 1}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-semibold transition ${
              currentChapterIndex === book.chapters.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            <span>Next Koan / Chapter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
