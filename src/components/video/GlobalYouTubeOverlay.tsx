import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Play, 
  X, 
  Maximize2, 
  Minimize2, 
  Minus, 
  ExternalLink, 
  Tv, 
  Volume2,
  AlertCircle
} from 'lucide-react';
import { 
  DEFAULT_FEATURED_VIDEO, 
  buildYouTubeEmbedUrl, 
  getYouTubeWatchUrl,
  validateYouTubeId,
  FeaturedVideoConfig 
} from './youtubeUtils';

export type VideoDisplayMode = 'floating' | 'focus' | 'minimized';

export interface GlobalYouTubeOverlayProps {
  isOpen: boolean;
  mode?: VideoDisplayMode;
  onClose: () => void;
  onModeChange?: (mode: VideoDisplayMode) => void;
  videoConfig?: Partial<FeaturedVideoConfig>;
}

export const GlobalYouTubeOverlay: React.FC<GlobalYouTubeOverlayProps> = ({
  isOpen,
  mode = 'floating',
  onClose,
  onModeChange,
  videoConfig
}) => {
  const [currentMode, setCurrentMode] = useState<VideoDisplayMode>(mode);
  const [hasEmbedError, setHasEmbedError] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external mode changes
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  // Client-side portal mounting check
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleModeSwitch = (newMode: VideoDisplayMode) => {
    setCurrentMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Keyboard navigation: Escape key handles modal dismissal or mode degradation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (currentMode === 'focus') {
          // Degrade to floating rather than abrupt shutdown
          handleModeSwitch('floating');
        } else {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentMode]);

  if (!isOpen || !mounted) {
    return null;
  }

  const activeConfig: FeaturedVideoConfig = {
    ...DEFAULT_FEATURED_VIDEO,
    ...videoConfig
  };

  const validId = validateYouTubeId(activeConfig.id);
  const embedUrl = validId ? buildYouTubeEmbedUrl(validId, false) : '';
  const watchUrl = validId ? getYouTubeWatchUrl(validId) : activeConfig.watchUrl;

  // ----------------------------------------------------
  // MODE 1: Minimized Dock Pill (Bottom-Right Floating Chip)
  // ----------------------------------------------------
  if (currentMode === 'minimized') {
    const minimizedContent = (
      <div 
        ref={containerRef}
        role="region"
        aria-label="Minimized Featured Video"
        className="fixed bottom-5 right-5 z-[70] flex items-center space-x-3 bg-slate-900/95 hover:bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-2xl border border-rose-500/50 backdrop-blur-md transition-all duration-200 transform hover:scale-105 select-none"
      >
        <button
          onClick={() => handleModeSwitch('floating')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-100 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 rounded-lg px-1 py-0.5"
          title="Restore Featured Video Player"
          aria-label="Restore Featured Video Player"
        >
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-xs animate-pulse">
            <Play className="w-3 h-3 fill-white text-white ml-0.5" />
          </div>
          <span className="truncate max-w-[160px] sm:max-w-[200px] font-medium text-slate-200">
            {activeConfig.title}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
            Active
          </span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleModeSwitch('focus')}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            title="Expand to Focus Mode"
            aria-label="Expand to Focus Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            title="Close Video"
            aria-label="Close Video"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );

    return createPortal(minimizedContent, document.body);
  }

  // ----------------------------------------------------
  // MODE 2: Focus / Theater Mode Modal (Centered with Backdrop)
  // ----------------------------------------------------
  if (currentMode === 'focus') {
    const focusContent = (
      <div 
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Featured Video Theater"
        className="fixed inset-0 z-[80] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      >
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col max-h-[92vh]">
          {/* Theater Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center space-x-3 truncate mr-3">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center shrink-0 shadow-sm">
                <Tv className="w-4 h-4 text-white" />
              </div>
              <div className="truncate">
                <h3 className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
                  <span>{activeConfig.title}</span>
                  <span className="text-xs text-slate-400 font-normal hidden sm:inline">— {activeConfig.verifiedTitle}</span>
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  Creator: {activeConfig.author} • Video ID: <code className="font-mono text-rose-400">{activeConfig.id}</code>
                </p>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={() => handleModeSwitch('floating')}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                title="Switch to Floating Window Mode"
                aria-label="Switch to Floating Window Mode"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleModeSwitch('minimized')}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                title="Minimize to Corner Bar"
                aria-label="Minimize to Corner Bar"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                title="Close Video (Esc)"
                aria-label="Close Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Theater Player Body: 16:9 Aspect Ratio */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
            {embedUrl && !hasEmbedError ? (
              <iframe
                src={embedUrl}
                title={activeConfig.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onError={() => setHasEmbedError(true)}
              />
            ) : (
              <div className="p-6 text-center text-slate-300 flex flex-col items-center max-w-md">
                <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
                <p className="text-sm font-semibold mb-2">Embed Direct Playback Notice</p>
                <p className="text-xs text-slate-400 mb-4">
                  If the embedded player cannot load due to browser security policies or YouTube embedding restrictions, you can watch it directly on YouTube.
                </p>
                <a
                  href={watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Video in YouTube</span>
                </a>
              </div>
            )}
          </div>

          {/* Theater Footer */}
          <div className="px-4 sm:px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Official YouTube Embed (youtube-nocookie.com privacy standard)</span>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-rose-400 hover:text-rose-300 font-medium transition"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );

    return createPortal(focusContent, document.body);
  }

  // ----------------------------------------------------
  // MODE 3: Floating Picture-in-Picture Card (Default Mode)
  // ----------------------------------------------------
  const floatingContent = (
    <div 
      ref={containerRef}
      role="dialog"
      aria-modal="false"
      aria-label="Featured Video Floating Player"
      className="fixed bottom-5 right-5 z-[70] w-96 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-6 duration-200 select-none"
    >
      {/* Floating Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2 truncate mr-2">
          <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center shrink-0">
            <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
          </div>
          <span className="text-xs font-bold text-white truncate">
            {activeConfig.title}
          </span>
        </div>

        {/* Floating Controls */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => handleModeSwitch('focus')}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            title="Expand to Theater View"
            aria-label="Expand to Theater View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleModeSwitch('minimized')}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            title="Minimize to Bar"
            aria-label="Minimize to Bar"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            title="Close Video"
            aria-label="Close Video"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating 16:9 Responsive Player */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {embedUrl && !hasEmbedError ? (
          <iframe
            src={embedUrl}
            title={activeConfig.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onError={() => setHasEmbedError(true)}
          />
        ) : (
          <div className="p-4 text-center text-slate-300 flex flex-col items-center">
            <p className="text-xs font-semibold mb-2">Embed Direct Link</p>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-[11px] font-bold"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Floating Footer Bar */}
      <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate pr-2">ID: <code className="font-mono text-rose-400">{activeConfig.id}</code></span>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-rose-400 hover:text-rose-300 font-medium shrink-0"
        >
          <span>YouTube</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );

  return createPortal(floatingContent, document.body);
};
