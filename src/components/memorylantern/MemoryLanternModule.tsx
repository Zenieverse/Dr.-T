import React, { useState, useEffect, useMemo } from 'react';
import { 
  MemoryLanternItem, 
  GemmaProviderStatus, 
  LanternPrivacyLevel 
} from './types';
import { MemoryLanternService } from './services/memoryLanternService';
import { LanternCard } from './components/LanternCard';
import { CreateMemoryModal } from './components/CreateMemoryModal';
import { LanternStoriesModal } from './components/LanternStoriesModal';
import { TributeReaderModal } from './components/TributeReaderModal';
import { auth } from '../../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  Flame, 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  Cpu, 
  Trash2, 
  Download, 
  RotateCcw, 
  Heart,
  Share2,
  Lock,
  Globe,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const MemoryLanternModule: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [memories, setMemories] = useState<MemoryLanternItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'garden' | 'timeline' | 'storybook' | 'privacy'>('garden');
  
  // Selection for Gemma Storytelling
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([]);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStoriesModalOpen, setIsStoriesModalOpen] = useState(false);
  const [isTributeModalOpen, setIsTributeModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryLanternItem | null>(null);
  const [readingMemory, setReadingMemory] = useState<MemoryLanternItem | null>(null);

  // Open-weight Gemma provider status
  const [providerStatus, setProviderStatus] = useState<GemmaProviderStatus>({
    status: 'NOT_CONFIGURED',
    providerType: 'none',
    modelId: 'gemma-2-9b-it',
    endpointUrl: 'none',
    message: 'Checking inference status...',
    isLocal: false,
    checkedAt: new Date().toISOString(),
    supportedModels: ['gemma2:2b', 'gemma2:9b', 'google/gemma-2-9b-it'],
    reproductionCommand: 'ollama run gemma2:2b'
  });

  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. Listen for Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. Load Memories on Mount / User Change
  useEffect(() => {
    loadAllMemories();
    checkGemmaProvider();
  }, [currentUser]);

  const loadAllMemories = async () => {
    setIsLoading(true);
    try {
      const data = await MemoryLanternService.loadMemories(currentUser?.uid);
      setMemories(data);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkGemmaProvider = async () => {
    const status = await MemoryLanternService.fetchProviderStatus();
    setProviderStatus(status);
  };

  // Actions
  const handleSaveMemory = async (item: MemoryLanternItem) => {
    await MemoryLanternService.saveMemory(item, currentUser?.uid);
    await loadAllMemories();
    showToast(`🏮 Lantern "${item.title}" placed in the garden.`);
  };

  const handleDeleteMemory = async (id: string) => {
    const target = memories.find(m => m.id === id);
    if (!target) return;
    if (window.confirm(`Permanently extinguish and remove "${target.title}"? This cannot be undone.`)) {
      await MemoryLanternService.deleteMemory(id, currentUser?.uid);
      setSelectedMemoryIds(prev => prev.filter(mId => mId !== id));
      await loadAllMemories();
      showToast(`Extinguished lantern "${target.title}".`);
    }
  };

  const handleClearSampleData = async () => {
    if (window.confirm('Remove all fictional sample memories from your garden?')) {
      await MemoryLanternService.clearSampleMemories(currentUser?.uid);
      await loadAllMemories();
      showToast('Sample memories cleared.');
    }
  };

  const handleRestoreSampleData = async () => {
    await MemoryLanternService.seedSampleMemories(currentUser?.uid);
    await loadAllMemories();
    showToast('Fictional sample lanterns restored.');
  };

  const handleToggleSelectMemory = (id: string) => {
    setSelectedMemoryIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMemoryIds.length === filteredMemories.length) {
      setSelectedMemoryIds([]);
    } else {
      setSelectedMemoryIds(filteredMemories.map(m => m.id));
    }
  };

  // Filter memories
  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      const matchesCategory = activeCategory === 'ALL' || m.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const titleMatch = m.title.toLowerCase().includes(q);
      const storyMatch = m.story.toLowerCase().includes(q);
      const peopleMatch = (m.peopleRemembered || []).some(p => p.toLowerCase().includes(q));
      const tagMatch = (m.tags || []).some(t => t.toLowerCase().includes(q));
      const periodMatch = m.dateOrPeriod ? m.dateOrPeriod.toLowerCase().includes(q) : false;
      const detailsMatch = (m.meaningfulDetails || []).some(d => 
        d.label.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)
      );

      return titleMatch || storyMatch || peopleMatch || tagMatch || periodMatch || detailsMatch;
    });
  }, [memories, searchQuery, activeCategory]);

  // Timeline-sorted memories
  const timelineMemories = useMemo(() => {
    return [...filteredMemories].sort((a, b) => {
      const dateA = a.dateOrPeriod || a.createdAt;
      const dateB = b.dateOrPeriod || b.createdAt;
      return dateA.localeCompare(dateB);
    });
  }, [filteredMemories]);

  // Export all memories as JSON
  const handleExportAllJson = () => {
    const sanitized = memories.map(m => ({
      title: m.title,
      category: m.category,
      dateOrPeriod: m.dateOrPeriod,
      peopleRemembered: m.peopleRemembered,
      story: m.story,
      meaningfulDetails: m.meaningfulDetails,
      tags: m.tags,
      privacyLevel: m.privacyLevel,
      preservedAt: m.createdAt
    }));
    const blob = new Blob([JSON.stringify(sanitized, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memory-lanterns-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported complete memory archive.');
  };

  // Export all memories as Markdown
  const handleExportAllMarkdown = () => {
    const fullDoc = memories.map(m => MemoryLanternService.exportToMarkdown(m)).join('\n\n---\n\n');
    const blob = new Blob([fullDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memory-lanterns-story-book-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported Markdown Storybook.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-200 text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Night Garden Header */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-rose-500/5 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Title & Tagline */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  DEV Hacktoberfest 2026 • Week 4
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-700/50 text-purple-300 text-[11px] font-mono">
                  Theme: Ghost in the Machine
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[11px]">
                  {currentUser ? `Signed in as ${currentUser.email}` : 'Guest Sanctuary (Local Sandbox)'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-slate-950 shadow-lg shadow-amber-500/20">
                  <Flame className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white flex items-center gap-2">
                    Memory Lantern
                    <span className="text-amber-400 text-lg font-sans font-light italic">— Stories That Stay</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                    A peaceful digital sanctuary for intergenerational remembrance, family traditions, and living stories powered by open-weight Gemma AI.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEditingMemory(null);
                  setIsCreateModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Light a Lantern</span>
              </button>

              <button
                type="button"
                onClick={() => setIsStoriesModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/90 border border-amber-500/40 text-amber-200 hover:bg-slate-700/80 hover:border-amber-400 transition-all flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Lantern Stories (Gemma AI)</span>
              </button>
            </div>

          </div>

          {/* Model Provider Status Strip */}
          <div className="mt-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/10 text-amber-400">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">Open AI Engine:</span>
                  <span className="font-mono text-amber-300">{providerStatus.modelId}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-mono ${
                    providerStatus.status === 'READY' 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                  }`}>
                    {providerStatus.status === 'READY' ? '● Live Open AI' : '○ Standby / Test Fixture Available'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-xl">
                  {providerStatus.message}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={checkGemmaProvider}
                title="Refresh Provider Connectivity"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors"
              >
                Check Provider
              </button>
              {memories.some(m => m.isSample) ? (
                <button
                  type="button"
                  onClick={handleClearSampleData}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-[11px] text-slate-400 transition-colors"
                >
                  Clear Samples
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRestoreSampleData}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-amber-300 transition-colors"
                >
                  Restore Samples
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Navigation Sub-Tabs & Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          
          {/* Subtabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            {[
              { id: 'garden', label: 'Lantern Garden', icon: Flame, count: memories.length },
              { id: 'timeline', label: 'Chronicle Timeline', icon: Calendar },
              { id: 'storybook', label: 'Storybook & Tributes', icon: BookOpen },
              { id: 'privacy', label: 'Sanctuary & Privacy', icon: ShieldCheck }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-xs' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search memories, people, recipes, sayings..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Category Pills (Visible in Garden & Timeline) */}
        {(activeTab === 'garden' || activeTab === 'timeline') && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'Remembrance', 'Tradition', 'Milestone', 'Everyday Joy', 'Wisdom'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    activeCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {cat === 'ALL' ? 'All Lanterns' : cat}
                </button>
              ))}
            </div>

            {/* Multi-select bar if any cards are selected */}
            {selectedMemoryIds.length > 0 && (
              <div className="flex items-center gap-2 text-xs bg-amber-950/40 border border-amber-500/40 px-3 py-1.5 rounded-xl text-amber-200">
                <span className="font-semibold">{selectedMemoryIds.length} selected</span>
                <button
                  onClick={() => setIsStoriesModalOpen(true)}
                  className="px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
                >
                  Compose Story
                </button>
                <button
                  onClick={() => setSelectedMemoryIds([])}
                  className="text-slate-400 hover:text-slate-200 underline text-[11px]"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 1: LANTERN GARDEN */}
        {activeTab === 'garden' && (
          <div>
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <Flame className="w-8 h-8 text-amber-400 animate-pulse mx-auto" />
                <p className="text-xs text-slate-400">Tending the lantern garden...</p>
              </div>
            ) : filteredMemories.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8 space-y-4 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-200">The Garden is Quiet</h3>
                  <p className="text-xs text-slate-400">
                    {searchQuery 
                      ? 'No memories match your search filter. Try clearing the search query.'
                      : 'Place your first memory into a glowing lantern or restore the sample memories to explore.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setEditingMemory(null);
                      setIsCreateModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
                  >
                    Light a Lantern
                  </button>
                  <button
                    onClick={handleRestoreSampleData}
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    Load Fictional Samples
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMemories.map(memory => (
                  <LanternCard
                    key={memory.id}
                    memory={memory}
                    isSelected={selectedMemoryIds.includes(memory.id)}
                    onSelect={() => handleToggleSelectMemory(memory.id)}
                    onEdit={() => {
                      setEditingMemory(memory);
                      setIsCreateModalOpen(true);
                    }}
                    onDelete={() => handleDeleteMemory(memory.id)}
                    onReadTribute={() => {
                      setReadingMemory(memory);
                      setIsTributeModalOpen(true);
                    }}
                    onExportMarkdown={() => {
                      const md = MemoryLanternService.exportToMarkdown(memory);
                      const blob = new Blob([md], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${memory.title.toLowerCase().replace(/\s+/g, '-')}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast(`Exported "${memory.title}" as Markdown.`);
                    }}
                    onShareText={() => {
                      const text = MemoryLanternService.exportShareableText(memory);
                      navigator.clipboard.writeText(text);
                      showToast('Copied sanitized shareable text to clipboard.');
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CHRONICLE TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="text-xs text-slate-400">
              Showing memories chronologically by time period or creation date.
            </div>

            <div className="relative border-l-2 border-amber-500/30 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
              {timelineMemories.map((m, idx) => (
                <div key={m.id} className="relative group">
                  {/* Glowing Node */}
                  <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-md shadow-amber-400/20 group-hover:scale-110 transition-transform">
                    <Flame className="w-3 h-3 text-amber-400" />
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 transition-colors space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-amber-300">
                        {m.dateOrPeriod || 'Time Period Unspecified'}
                      </span>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                        {m.category}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-100">{m.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.story}</p>

                    {m.meaningfulDetails?.length > 0 && (
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                        {m.meaningfulDetails.map((d, dIdx) => (
                          <div key={dIdx} className="italic text-slate-300">
                            • {d.label}: {d.value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: STORYBOOK & TRIBUTES */}
        {activeTab === 'storybook' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-100">Storybook & Family Archive</h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  Synthesize your preserved memories into chapters or read printable remembrances composed with Gemma open AI.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportAllMarkdown}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Full Markdown Storybook</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memories.map(m => (
                <div 
                  key={m.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="text-[11px] font-medium text-amber-400 uppercase tracking-wider mb-1">
                      {m.category} • {m.dateOrPeriod || 'Heritage'}
                    </div>
                    <h4 className="text-base font-semibold text-slate-100">{m.title}</h4>
                    <p className="text-xs text-slate-300 line-clamp-3 mt-1">{m.story}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-500">
                      {m.peopleRemembered?.length ? `Remembering: ${m.peopleRemembered.join(', ')}` : 'Personal Memory'}
                    </span>
                    <button
                      onClick={() => {
                        setReadingMemory(m);
                        setIsTributeModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-colors"
                    >
                      Read & Print Tribute
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: PRIVACY & SANCTUARY */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 max-w-3xl">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">Privacy & Data Sanctuary</h3>
                  <p className="text-xs text-slate-400">
                    How Memory Lantern handles your personal stories, attachments, and inference data.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                  <span className="font-semibold text-slate-100 block">Where are memories stored?</span>
                  <p>
                    {currentUser 
                      ? `Your memories are saved to your authenticated user account in Firebase Firestore (/memory_lantern_memories) scoped exclusively to your user ID (${currentUser.uid}). Cross-account access is strictly denied by Firestore security rules.`
                      : 'You are currently browsing as a guest. Your memories are stored strictly in your browser’s isolated localStorage sandbox. Nothing leaves your browser until you sign in.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                  <span className="font-semibold text-slate-100 block">Open AI & Inference Transparency</span>
                  <p>
                    Memory Lantern uses Google's open-weight <strong>Gemma</strong> model family (via local Ollama or hosted open-weight endpoints). We do not silently send data to proprietary black-box APIs, and no memory text is ever sent to an AI provider until you explicitly click "Generate Story".
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                  <span className="font-semibold text-slate-100 block">Zero Telemetry & Strict Safety Invariant</span>
                  <p>
                    No personal stories, deceased names, or voice transcripts are recorded in analytics. Furthermore, Gemma narrative models strictly adhere to an ethical safety policy: they never impersonate deceased loved ones, never claim supernatural communication, and preserve user-supplied facts without alteration.
                  </p>
                </div>
              </div>

              {/* Data Export & Deletion Actions */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-200 block">Your Data Ownership Controls</span>
                
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleExportAllJson}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Export Archive (JSON)</span>
                  </button>

                  <button
                    onClick={handleExportAllMarkdown}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center gap-2 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Export Storybook (Markdown)</span>
                  </button>

                  <button
                    onClick={async () => {
                      if (window.confirm('Delete ALL memories in your sanctuary? This action is permanent and cannot be undone.')) {
                        for (const m of memories) {
                          await MemoryLanternService.deleteMemory(m.id, currentUser?.uid);
                        }
                        await loadAllMemories();
                        showToast('All sanctuary memories permanently removed.');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs text-rose-300 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Permanently Delete All Memories</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <CreateMemoryModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingMemory(null);
        }}
        onSave={handleSaveMemory}
        initialMemory={editingMemory}
      />

      <LanternStoriesModal
        isOpen={isStoriesModalOpen}
        onClose={() => setIsStoriesModalOpen(false)}
        memories={memories}
        selectedMemoryIds={selectedMemoryIds.length > 0 ? selectedMemoryIds : memories.map(m => m.id)}
        providerStatus={providerStatus}
        onSaveAsMemory={async (title, content) => {
          const newLantern: MemoryLanternItem = {
            id: `story-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            userId: currentUser?.uid || 'guest_user',
            title,
            category: 'Remembrance',
            story: content,
            meaningfulDetails: [
              {
                type: 'other',
                label: 'AI-Assisted Narrative',
                value: `Generated using open-weight ${providerStatus.modelId} on ${new Date().toLocaleDateString()}`
              }
            ],
            tags: ['Lantern Story', 'Gemma AI', 'Heritage'],
            privacyLevel: 'FAMILY_EXPORTABLE',
            lanternColor: 'warm_gold',
            isSample: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await handleSaveMemory(newLantern);
          setIsStoriesModalOpen(false);
        }}
      />

      <TributeReaderModal
        isOpen={isTributeModalOpen}
        onClose={() => {
          setIsTributeModalOpen(false);
          setReadingMemory(null);
        }}
        memory={readingMemory}
      />

    </div>
  );
};
