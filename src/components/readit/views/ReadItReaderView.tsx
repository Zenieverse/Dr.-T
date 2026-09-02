import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  Sparkles, 
  HelpCircle, 
  Languages, 
  Search, 
  Table, 
  Shield, 
  Stethoscope,
  Maximize2,
  FileText,
  Bookmark,
  Layers,
  Columns,
  Lock
} from 'lucide-react';
import { NormalizedDocument, DocumentPage } from '../../../types/readit';
import { AskDrTChatPanel } from '../components/AskDrTChatPanel';
import { MedicalModeCard } from '../components/MedicalModeCard';
import { ReadAloudPlayerBar } from '../components/ReadAloudPlayerBar';
import { DocumentSummaryModal } from '../components/DocumentSummaryModal';
import { DocumentExplainModal } from '../components/DocumentExplainModal';
import { DocumentTranslateModal } from '../components/DocumentTranslateModal';
import { DocumentSearchDrawer } from '../components/DocumentSearchDrawer';
import { ExtractedTablesModal } from '../components/ExtractedTablesModal';
import { SecurityAuditModal } from '../components/SecurityAuditModal';
import { ReadAloudService } from '../../../engine/readit/tts/readAloudService';

interface ReadItReaderViewProps {
  document: NormalizedDocument;
  onBackToLibrary: () => void;
  onDeleteDocument: (id: string) => void;
}

export const ReadItReaderView: React.FC<ReadItReaderViewProps> = ({
  document,
  onBackToLibrary,
  onDeleteDocument,
}) => {
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showMedicalMode, setShowMedicalMode] = useState<boolean>(true);
  const [showLeftSidebar, setShowLeftSidebar] = useState<boolean>(true);
  const [showRightChat, setShowRightChat] = useState<boolean>(true);

  // Modals state
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);
  const [showTablesModal, setShowTablesModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  const currentPage: DocumentPage | undefined = document.pages.find(
    (p) => p.pageNumber === currentPageNum
  ) || document.pages[0];

  const fullDocText = document.pages.map((p) => p.text).join('\n\n--- NEXT PAGE ---\n\n');

  const handleJumpToPage = (num: number) => {
    if (num >= 1 && num <= document.pageCount) {
      setCurrentPageNum(num);
    }
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(175, Math.max(75, prev + delta)));
  };

  const handleQuickReadAloud = () => {
    if (currentPage) {
      ReadAloudService.getInstance().speakText(currentPage.text, {
        mode: 'page',
        currentPage: currentPageNum,
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 overflow-hidden select-none">
      
      {/* ==================================================================== */}
      {/* 1. TOP TOOLBAR */}
      {/* ==================================================================== */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20">
        
        {/* Left: Back & Document Metadata */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onBackToLibrary}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition text-xs font-bold shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Library</span>
          </button>

          <div className="min-w-0">
            <h2 className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
              {document.title}
            </h2>
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Lock className="w-2.5 h-2.5" /> Verified
              </span>
              <span>·</span>
              <span>{document.pageCount} Pages</span>
              {document.sourceUrl && (
                <>
                  <span>·</span>
                  <span className="text-teal-400 truncate max-w-[150px] sm:max-w-xs" title={document.sourceUrl}>
                    URL: {document.sourceUrl}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center: Page Controls & Zoom */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => handleJumpToPage(currentPageNum - 1)}
            disabled={currentPageNum <= 1}
            className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-slate-200 font-mono px-1">
            Page {currentPageNum} / {document.pageCount}
          </span>

          <button
            onClick={() => handleJumpToPage(currentPageNum + 1)}
            disabled={currentPageNum >= document.pageCount}
            className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1"></div>

          <button
            onClick={() => handleZoom(-15)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-mono text-slate-400 w-9 text-center">
            {zoomLevel}%
          </span>

          <button
            onClick={() => handleZoom(15)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Intelligence & Utility Actions */}
        <div className="flex items-center space-x-1.5 shrink-0">
          
          {/* Quick Voice Read */}
          <button
            onClick={handleQuickReadAloud}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-xs transition"
            title="Read Current Page Aloud"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Listen</span>
          </button>

          {/* Summarize */}
          <button
            onClick={() => setShowSummaryModal(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-800 transition"
            title="Executive Summary & Key Bullets"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Explain (Plain Language) */}
          <button
            onClick={() => setShowExplainModal(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-800 transition"
            title="Plain Language Explainer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Translate */}
          <button
            onClick={() => setShowTranslateModal(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-800 transition"
            title="Translate into Tiếng Việt, Español, etc."
          >
            <Languages className="w-4 h-4" />
          </button>

          {/* Search */}
          <button
            onClick={() => setShowSearchDrawer(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-800 transition"
            title="Search Full Text"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Extracted Tables */}
          {document.tables.length > 0 && (
            <button
              onClick={() => setShowTablesModal(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-800 transition"
              title="View Extracted Tables"
            >
              <Table className="w-4 h-4" />
            </button>
          )}

          {/* Medical Mode Toggle */}
          {document.medicalData?.isMedical && (
            <button
              onClick={() => setShowMedicalMode(!showMedicalMode)}
              className={`p-2 rounded-xl border transition ${
                showMedicalMode
                  ? 'bg-teal-600 text-white border-teal-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
              title="Toggle Medical Biomarker Mode"
            >
              <Stethoscope className="w-4 h-4" />
            </button>
          )}

          {/* Security Audit */}
          <button
            onClick={() => setShowAuditModal(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-800 transition"
            title="Cryptographic Security Audit"
          >
            <Shield className="w-4 h-4" />
          </button>

        </div>

      </header>

      {/* ==================================================================== */}
      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      {/* ==================================================================== */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Page Navigator */}
        {showLeftSidebar && (
          <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto p-3 space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Page Navigator ({document.pageCount})
            </div>

            <div className="space-y-2">
              {document.pages.map((p) => (
                <div
                  key={p.pageNumber}
                  onClick={() => setCurrentPageNum(p.pageNumber)}
                  className={`p-3 rounded-2xl border cursor-pointer transition text-xs ${
                    currentPageNum === p.pageNumber
                      ? 'bg-teal-950/60 border-teal-500/60 text-white shadow-xs'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>Page {p.pageNumber}</span>
                    <span className="text-[10px] font-mono text-slate-500">{p.wordCount} words</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {p.text.slice(0, 100)}...
                  </p>
                </div>
              ))}
            </div>

            {/* Document Sections List */}
            {document.sections.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Sections Index
                </div>
                <div className="space-y-1">
                  {document.sections.map((sec, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleJumpToPage(sec.pageNumber)}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] text-slate-400 hover:text-white hover:bg-slate-900 transition flex items-center justify-between"
                    >
                      <span className="truncate">{sec.title}</span>
                      <span className="text-[10px] font-mono text-slate-600">P.{sec.pageNumber}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* CENTER COLUMN: Document Stage */}
        <main className="flex-1 bg-slate-900 overflow-y-auto p-4 md:p-8 flex justify-center">
          <div
            className="w-full max-w-4xl space-y-6 transition-all duration-150"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Medical Mode Card Banner if available */}
            {showMedicalMode && document.medicalData?.isMedical && (
              <MedicalModeCard
                medicalData={document.medicalData}
                onJumpToPage={handleJumpToPage}
              />
            )}

            {/* Document Page Canvas Card */}
            {currentPage && (
              <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 min-h-[700px] flex flex-col justify-between select-text">
                
                {/* Page Content Body */}
                <div className="space-y-6">
                  
                  {/* Page Top Header */}
                  <div className="pb-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-slate-500">
                      {document.title}
                    </span>
                    <span className="font-mono font-bold text-slate-600">
                      PAGE {currentPage.pageNumber} OF {document.pageCount}
                    </span>
                  </div>

                  {/* Clean Formatted Text */}
                  <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
                    {currentPage.text}
                  </div>

                </div>

                {/* Page Bottom Footer */}
                <div className="pt-6 mt-12 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Dr. T ReadIt — Grounded Security Proof</span>
                  <span>SHA-256: {document.sha256.slice(0, 16)}</span>
                </div>

              </div>
            )}

          </div>
        </main>

        {/* RIGHT COLUMN: Ask Dr. T Assistant */}
        {showRightChat && (
          <aside className="w-80 lg:w-96 shrink-0 h-full">
            <AskDrTChatPanel
              document={document}
              onJumpToPage={handleJumpToPage}
              currentPageNumber={currentPageNum}
            />
          </aside>
        )}

      </div>

      {/* ==================================================================== */}
      {/* 3. BOTTOM FIXED TTS AUDIO PLAYER BAR */}
      {/* ==================================================================== */}
      <ReadAloudPlayerBar
        currentPageText={currentPage?.text || ''}
        fullDocText={fullDocText}
        documentTitle={document.title}
        currentPageNumber={currentPageNum}
        totalPageCount={document.pageCount}
      />

      {/* ==================================================================== */}
      {/* 4. MODALS & DRAWERS */}
      {/* ==================================================================== */}
      <DocumentSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        document={document}
      />

      <DocumentExplainModal
        isOpen={showExplainModal}
        onClose={() => setShowExplainModal(false)}
        excerpt={currentPage?.text || document.title}
        documentTitle={document.title}
      />

      <DocumentTranslateModal
        isOpen={showTranslateModal}
        onClose={() => setShowTranslateModal(false)}
        textToTranslate={currentPage?.text || document.title}
        documentTitle={document.title}
      />

      <DocumentSearchDrawer
        isOpen={showSearchDrawer}
        onClose={() => setShowSearchDrawer(false)}
        document={document}
        onJumpToPage={handleJumpToPage}
      />

      <ExtractedTablesModal
        isOpen={showTablesModal}
        onClose={() => setShowTablesModal(false)}
        tables={document.tables}
        documentTitle={document.title}
        onJumpToPage={handleJumpToPage}
      />

      <SecurityAuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        document={document}
        onDeleteDocument={onDeleteDocument}
      />

    </div>
  );
};
