// ============================================================================
// LANTERN KEEPER — A PERSONAL AI THAT REMEMBERS WITH PERMISSION
// Upgraded Memory Lantern with Evidence-Backed Retrieval, Skills Engine,
// Permission Gate, Memory Inspector, and Three Hats Integration
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MemoryLanternItem, 
  GemmaProviderStatus, 
  LanternPrivacyLevel,
  NebiusProviderStatus,
  PermissionManifest,
  ActionAuditRecord
} from './types';
import { MemoryLanternService } from './services/memoryLanternService';
import { LanternCard } from './components/LanternCard';
import { CreateMemoryModal } from './components/CreateMemoryModal';
import { LanternStoriesModal } from './components/LanternStoriesModal';
import { TributeReaderModal } from './components/TributeReaderModal';
import { EvidenceQaPanel } from '../lanternkeeper/components/EvidenceQaPanel';
import { PersonalSkillsPanel } from '../lanternkeeper/components/PersonalSkillsPanel';
import { PermissionGateModal } from '../lanternkeeper/components/PermissionGateModal';
import { MemoryInspectorModal } from '../lanternkeeper/components/MemoryInspectorModal';
import { ThreeHatsModule } from '../threehats/ThreeHatsModule';
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
  HelpCircle,
  Compass,
  Layers,
  SearchCheck,
  Bot
} from 'lucide-react';

interface MemoryLanternModuleProps {
  setActiveTab?: (tab: any) => void;
  initialSubTab?: 'personal_ai' | 'skills' | 'garden' | 'three_hats' | 'timeline' | 'storybook' | 'privacy';
}

export const MemoryLanternModule: React.FC<MemoryLanternModuleProps> = ({
  setActiveTab: setPlatformTab,
  initialSubTab
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [memories, setMemories] = useState<MemoryLanternItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'personal_ai' | 'skills' | 'garden' | 'three_hats' | 'timeline' | 'storybook' | 'privacy'>(
    initialSubTab || 'personal_ai'
  );
  
  // Selection for Storytelling / Skills
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStoriesModalOpen, setIsStoriesModalOpen] = useState(false);
  const [isTributeModalOpen, setIsTributeModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryLanternItem | null>(null);
  const [readingMemory, setReadingMemory] = useState<MemoryLanternItem | null>(null);

  // Permission Gate State
  const [isPermissionGateOpen, setIsPermissionGateOpen] = useState(false);
  const [activeManifest, setActiveManifest] = useState<PermissionManifest | null>(null);
  const [pendingApprovalAction, setPendingApprovalAction] = useState<(() => void) | null>(null);

  // Memory Inspector State
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [inspectedMemoryId, setInspectedMemoryId] = useState<string | null>(null);

  // Audit trail state
  const [auditRecords, setAuditRecords] = useState<ActionAuditRecord[]>([]);

  // Provider status state (Nebius Token Factory & NVIDIA Nemotron)
  const [nebiusStatus, setNebiusStatus] = useState<NebiusProviderStatus>({
    status: 'NOT_CONFIGURED',
    providerType: 'none',
    modelId: 'nvidia/llama-3.1-nemotron-70b-instruct',
    endpointUrl: 'https://api.tokenfactory.nebius.com/v1/chat/completions',
    message: 'Checking Nebius Token Factory status...',
    isLocal: false,
    checkedAt: new Date().toISOString(),
    supportedModels: ['nvidia/llama-3.1-nemotron-70b-instruct', 'nvidia/nemotron-mini-4b-instruct'],
    reproductionCommand: 'export NEBIUS_API_KEY="your-token-factory-key"',
    hasApiKey: false
  });

  const [gemmaStatus, setGemmaStatus] = useState<GemmaProviderStatus>({
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
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Listen for Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load Memories on Mount / User Change
  useEffect(() => {
    loadAllMemories();
    checkProviderStatus();
    loadAuditRecords();
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

  const checkProviderStatus = async () => {
    try {
      const res = await fetch('/api/lantern-keeper/provider-status');
      if (res.ok) {
        const data = await res.json();
        setNebiusStatus(data);
      }
    } catch {
      // Fallback status
    }
    try {
      const gStatus = await MemoryLanternService.fetchProviderStatus();
      setGemmaStatus(gStatus);
    } catch {
      // ignore
    }
  };

  const loadAuditRecords = async () => {
    try {
      const res = await fetch('/api/lantern-keeper/audit-records');
      if (res.ok) {
        const data = await res.json();
        setAuditRecords(data.records || []);
      }
    } catch {
      // ignore
    }
  };

  // Actions & Permission Handlers
  const handleRequestActionApproval = (manifest: PermissionManifest, onApproved: () => void) => {
    setActiveManifest(manifest);
    setPendingApprovalAction(() => onApproved);
    setIsPermissionGateOpen(true);
  };

  const handleApproveAction = async () => {
    if (!activeManifest) return;
    try {
      await fetch('/api/lantern-keeper/action-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: activeManifest.actionType,
          toolName: activeManifest.toolName,
          status: 'APPROVED',
          userId: currentUser?.uid || 'anonymous-user',
          memoryCount: activeManifest.requiredMemoryIds.length,
          summary: `Approved execution of ${activeManifest.toolName}.`
        })
      });
      loadAuditRecords();
    } catch (err) {
      console.error(err);
    }

    setIsPermissionGateOpen(false);
    if (pendingApprovalAction) {
      pendingApprovalAction();
      setPendingApprovalAction(null);
    }
  };

  const handleDenyAction = async () => {
    if (activeManifest) {
      try {
        await fetch('/api/lantern-keeper/action-gate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actionType: activeManifest.actionType,
            toolName: activeManifest.toolName,
            status: 'DENIED',
            userId: currentUser?.uid || 'anonymous-user',
            memoryCount: activeManifest.requiredMemoryIds.length,
            summary: `Denied execution of ${activeManifest.toolName}.`
          })
        });
        loadAuditRecords();
      } catch (err) {
        console.error(err);
      }
    }
    setIsPermissionGateOpen(false);
    setPendingApprovalAction(null);
    showToast('Consequential action canceled by user.');
  };

  const handleSaveMemory = async (item: MemoryLanternItem) => {
    await MemoryLanternService.saveMemory(item, currentUser?.uid);
    await loadAllMemories();
    showToast(`🏮 Lantern "${item.title}" preserved in sanctuary.`);
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

  const handleRevokeAccess = (id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, revokedAt: new Date().toISOString() } : m));
    showToast('Permission revoked: Memory is excluded from AI retrieval.');
  };

  const handleRestoreAccess = (id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, revokedAt: null } : m));
    showToast('Permission restored: Memory is accessible in AI retrieval.');
  };

  const handleClearSampleData = async () => {
    if (window.confirm('Remove all fictional sample memories from your sanctuary?')) {
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

  // Save reflection from Three Hats into Lantern Keeper
  const handleSaveThreeHatsReflection = async (title: string, story: string, category: string) => {
    const newMemory: MemoryLanternItem = {
      id: `three-hats-mem-${Date.now()}`,
      userId: currentUser?.uid || 'demo-user',
      title,
      category: 'Wisdom',
      story,
      meaningfulDetails: [
        { type: 'saying_or_proverb', label: 'Reflection Insight', value: 'I am more than any single role I play.' }
      ],
      tags: ['Three Hats', 'Life Balance', 'Personal AI'],
      privacyLevel: 'PRIVATE',
      lanternColor: 'violet',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await handleSaveMemory(newMemory);
  };

  // Export all memories
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
    a.download = `lantern-keeper-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported complete memory archive.');
  };

  const handleExportAllMarkdown = () => {
    const fullDoc = memories.map(m => MemoryLanternService.exportToMarkdown(m)).join('\n\n---\n\n');
    const blob = new Blob([fullDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lantern-keeper-storybook-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported Markdown Storybook.');
  };

  const inspectedMemory = useMemo(() => {
    if (!inspectedMemoryId) return null;
    return memories.find(m => m.id === inspectedMemoryId) || null;
  }, [inspectedMemoryId, memories]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-200 text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Title & Tagline */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-violet-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Personal AI • Lantern Keeper
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono">
                  NVIDIA Nemotron & Nebius Token Factory
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[11px]">
                  {currentUser ? `Signed in as ${currentUser.email}` : 'Guest Sanctuary (Local Sandbox)'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-violet-600 text-slate-950 shadow-lg shadow-amber-500/20">
                  <Flame className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white flex items-center gap-2">
                    Lantern Keeper
                    <span className="text-amber-400 text-lg font-sans font-light italic">— A Personal AI That Remembers With Permission</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                    Evidence-backed memory retrieval, reusable personal skills, and permission-controlled role balance across your Three Hats.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
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
                <span>Story Keeper</span>
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
                  <span className="font-semibold text-slate-200">Personal AI Inference Engine:</span>
                  <span className="font-mono text-amber-300">{nebiusStatus.modelId}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-mono ${
                    nebiusStatus.status === 'READY' 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                  }`}>
                    {nebiusStatus.status === 'READY' 
                      ? '● Live Nebius Token Factory' 
                      : '○ Standby (Deterministic Engine Active)'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-xl">
                  {nebiusStatus.message}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={checkProviderStatus}
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

      {/* Main Subtabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto">
            {[
              { id: 'personal_ai', label: 'Personal AI & Q&A', icon: Bot },
              { id: 'skills', label: 'Personal Skills', icon: Sparkles },
              { id: 'garden', label: 'Memory Sanctuary', icon: Flame, count: memories.length },
              { id: 'three_hats', label: 'Three Hats', icon: Compass },
              { id: 'timeline', label: 'Timeline', icon: Calendar },
              { id: 'storybook', label: 'Storybooks', icon: BookOpen },
              { id: 'privacy', label: 'Permission Center', icon: ShieldCheck }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
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

          {/* Search bar (for garden & timeline) */}
          {(activeSubTab === 'garden' || activeSubTab === 'timeline') && (
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search memories, recipes, proverbs..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
              />
            </div>
          )}
        </div>

        {/* 1. PERSONAL AI EVIDENCE QA VIEW */}
        {activeSubTab === 'personal_ai' && (
          <EvidenceQaPanel
            memories={memories}
            providerStatus={nebiusStatus}
            onSelectMemoryForInspection={(id) => {
              setInspectedMemoryId(id);
              setIsInspectorOpen(true);
            }}
          />
        )}

        {/* 2. REUSABLE PERSONAL SKILLS VIEW */}
        {activeSubTab === 'skills' && (
          <PersonalSkillsPanel
            memories={memories}
            onOpenStoryModal={() => setIsStoriesModalOpen(true)}
            onOpenMemoryInspector={(id) => {
              setInspectedMemoryId(id || memories[0]?.id || null);
              setIsInspectorOpen(true);
            }}
            onRequestActionApproval={handleRequestActionApproval}
          />
        )}

        {/* 3. THREE HATS VIEW */}
        {activeSubTab === 'three_hats' && (
          <ThreeHatsModule 
            setActiveTab={setPlatformTab}
            onSaveToLanternKeeper={handleSaveThreeHatsReflection}
          />
        )}

        {/* 4. MEMORY SANCTUARY (GARDEN) VIEW */}
        {activeSubTab === 'garden' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {['ALL', 'Remembrance', 'Tradition', 'Milestone', 'Everyday Joy', 'Wisdom'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      activeCategory === cat
                        ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs">
                {selectedMemoryIds.length > 0 && (
                  <span className="text-amber-300 font-semibold">
                    {selectedMemoryIds.length} selected
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {selectedMemoryIds.length === filteredMemories.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>

            {filteredMemories.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800/80">
                <Flame className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">No Lanterns Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Light your first lantern to preserve family stories, traditions, and memories.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                >
                  Light a Lantern
                </button>
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
                      a.download = `${memory.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast(`Exported "${memory.title}" as Markdown.`);
                    }}
                    onShareText={() => {
                      const shareText = MemoryLanternService.exportShareableText(memory);
                      navigator.clipboard.writeText(shareText);
                      showToast('Copied sanitized shareable text to clipboard.');
                    }}
                    onInspect={() => {
                      setInspectedMemoryId(memory.id);
                      setIsInspectorOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. TIMELINE VIEW */}
        {activeSubTab === 'timeline' && (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-200">
              Chronicle Timeline ({timelineMemories.length} Memories)
            </h3>
            <div className="relative border-l-2 border-amber-500/30 ml-4 space-y-8 pl-6">
              {timelineMemories.map(m => (
                <div key={m.id} className="relative group">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-400" />
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        {m.dateOrPeriod || 'Circa Modern Era'}
                      </span>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {m.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{m.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.story}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. STORYBOOKS & TRIBUTES VIEW */}
        {activeSubTab === 'storybook' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-600/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-100">
                  Export Complete Lantern Storybook
                </h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  Download your entire sanctuary of family stories, traditions, and proverbs as a single beautifully formatted Markdown volume or JSON archive.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportAllMarkdown}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Markdown</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportAllJson}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                >
                  Export JSON
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. PERMISSION & AUDIT CENTER VIEW */}
        {activeSubTab === 'privacy' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Permission & Privacy Architecture</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                Lantern Keeper enforces strict user isolation in Firebase Firestore rules, client-side encryption bounds, 
                and permission gates. AI inference calls receive only the minimum necessary memory excerpts and are strictly forbidden from logging sensitive credentials.
              </p>
            </div>

            {/* Audit Trail Ledger */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Permission Action Audit Trail (Zero Sensitive Memory Content)
                </h4>
                <button
                  type="button"
                  onClick={loadAuditRecords}
                  className="text-xs text-amber-400 hover:text-amber-300"
                >
                  Refresh Audit
                </button>
              </div>

              {auditRecords.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-500">
                  No consequential actions recorded yet in this session.
                </div>
              ) : (
                <div className="space-y-2">
                  {auditRecords.map(rec => (
                    <div 
                      key={rec.id}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            rec.status === 'APPROVED' || rec.status === 'EXECUTED' 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {rec.status}
                          </span>
                          <span className="font-semibold text-slate-200">{rec.toolName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({rec.accessedMemoryCount} source memories)</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{rec.summary}</div>
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono shrink-0">
                        {new Date(rec.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Global Modals */}
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
        selectedMemoryIds={selectedMemoryIds}
        providerStatus={gemmaStatus}
        onSaveAsMemory={async (title: string, narrative: string) => {
          const newStoryItem: MemoryLanternItem = {
            id: `story-${Date.now()}`,
            userId: currentUser?.uid || 'demo-user',
            title,
            category: 'Tradition',
            story: narrative,
            meaningfulDetails: [],
            tags: ['AI Generated Story', 'Preserved Narrative'],
            privacyLevel: 'FAMILY_EXPORTABLE',
            lanternColor: 'warm_gold',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await handleSaveMemory(newStoryItem);
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

      <PermissionGateModal
        isOpen={isPermissionGateOpen}
        manifest={activeManifest}
        onApprove={handleApproveAction}
        onDeny={handleDenyAction}
      />

      <MemoryInspectorModal
        isOpen={isInspectorOpen}
        memory={inspectedMemory}
        onClose={() => {
          setIsInspectorOpen(false);
          setInspectedMemoryId(null);
        }}
        onRevokeAccess={handleRevokeAccess}
        onRestoreAccess={handleRestoreAccess}
        onDeletePermanently={handleDeleteMemory}
      />

    </div>
  );
};
