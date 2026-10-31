import React, { useState, useEffect, useMemo } from 'react';
import { 
  HatType, 
  ThreeHatsRole, 
  ThreeHatsCommitment, 
  ThreeHatsWeeklyReflection, 
  THREE_HATS_DEFINITIONS,
  ThreeHatsCompanionResponse,
  RoleStatus,
  RoleImportance,
  RoleEnergy,
  CommitmentPriority,
  CommitmentStatus,
  HatPerspectiveScores
} from './types';
import { DEFAULT_ROLES_LIBRARY } from './data/rolesLibrary';
import { ThreeHatsService } from './services/threeHatsService';
import { auth } from '../../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  Compass, 
  Briefcase, 
  Heart, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Save, 
  Trash2, 
  BookHeart,
  ChevronRight,
  ShieldCheck,
  Check,
  Flame,
  Calendar,
  Layers,
  HelpCircle,
  Download,
  FileText,
  RotateCcw,
  Edit2,
  X,
  ExternalLink,
  Sliders
} from 'lucide-react';

interface ThreeHatsModuleProps {
  setActiveTab?: (tab: any) => void;
  onSaveToLanternKeeper?: (title: string, story: string, category: string) => Promise<void>;
}

export const ThreeHatsModule: React.FC<ThreeHatsModuleProps> = ({
  setActiveTab,
  onSaveToLanternKeeper
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'explore' | 'role_map' | 'commitments' | 'weekly_ritual' | 'companion'>('overview');
  
  // Roles state
  const [userRoles, setUserRoles] = useState<ThreeHatsRole[]>(() => {
    return DEFAULT_ROLES_LIBRARY.slice(0, 6).map((template, idx) => ({
      ...template,
      id: `role-init-${idx}`,
      userId: 'demo-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  });

  // Commitments state
  const [commitments, setCommitments] = useState<ThreeHatsCommitment[]>([
    {
      id: 'comm-1',
      userId: 'demo-user',
      roleId: 'role-init-0',
      roleName: 'Team Member / Colleague',
      hatId: 'professional',
      title: 'Complete architecture review with team',
      targetDate: '2026-11-05',
      estimatedHours: 4,
      priority: 'high',
      status: 'in_progress',
      personalValue: 'Craftsmanship & Clarity',
      nextAction: 'Prepare clean diagrams for Wednesday sync',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'comm-2',
      userId: 'demo-user',
      roleId: 'role-init-2',
      roleName: 'Caretaker of Personal Wellbeing',
      hatId: 'personal',
      title: 'Protect 8-hour sleep window on weeknights',
      targetDate: 'Daily',
      estimatedHours: 8,
      priority: 'high',
      status: 'in_progress',
      personalValue: 'Health & Sustainability',
      nextAction: 'Leave phone outside bedroom at 10 PM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'comm-3',
      userId: 'demo-user',
      roleId: 'role-init-4',
      roleName: 'Memory Keeper & Tradition Preserver',
      hatId: 'personal',
      title: 'Record lemon verbena tea recipe in Lantern Keeper',
      targetDate: '2026-11-02',
      estimatedHours: 2,
      priority: 'medium',
      status: 'completed',
      personalValue: 'Remembrance & Family Heritage',
      nextAction: 'Share with family members at dinner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  // Balance Perspectives (1-5 scale)
  const [perspectives, setPerspectives] = useState<Record<HatType, HatPerspectiveScores>>({
    professional: { importance: 4, attention: 4, satisfaction: 4 },
    personal: { importance: 5, attention: 3, satisfaction: 3 },
    social: { importance: 4, attention: 2, satisfaction: 3 }
  });

  // Weekly Ritual State
  const [ritualStep, setRitualStep] = useState(1);
  const [ritualData, setRitualData] = useState({
    step1_meaningful: 'Had an unhurried Sunday afternoon tea with family, preserving Elena lemon verbena tradition.',
    step2_attentionReview: 'Professional commitments received full attention. Personal rest was slightly squeezed mid-week.',
    step3_conflictsNoticed: 'Late-night coding sprint competed with my planned 8-hour sleep window on Thursday.',
    step4_appreciations: 'Grateful for completing the open-source personal AI prototype with zero regressions.',
    step5_realisticAdjustment: 'Set a firm hard-stop at 9:30 PM for screen time on weeknights.',
    step6_committedActions: ['Protect 8-hour sleep', 'Host 30-min mentoring call', 'Enjoy evening walk']
  });
  const [ritualSaved, setRitualSaved] = useState(false);

  // Companion AI state
  const [companionInsight, setCompanionInsight] = useState<ThreeHatsCompanionResponse | null>(null);
  const [isCompanionLoading, setIsCompanionLoading] = useState(false);
  const [companionPrompt, setCompanionPrompt] = useState('');
  const [savedToLanternSuccess, setSavedToLanternSuccess] = useState(false);

  // Search & Filters in Explore Roles
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [filterHat, setFilterHat] = useState<HatType | 'all'>('all');

  // Filter in Commitments
  const [commitmentFilterHat, setCommitmentFilterHat] = useState<HatType | 'all'>('all');
  const [commitmentFilterStatus, setCommitmentFilterStatus] = useState<CommitmentStatus | 'all'>('all');

  // Custom role modal
  const [isCustomRoleOpen, setIsCustomRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleHats, setNewRoleHats] = useState<HatType[]>(['personal']);
  const [newRoleCategory, setNewRoleCategory] = useState('Personal development');
  const [newRoleImportance, setNewRoleImportance] = useState<RoleImportance>('high');
  const [newRoleEnergy, setNewRoleEnergy] = useState<RoleEnergy>('energizing');
  const [newRoleDemand, setNewRoleDemand] = useState('3-5 hrs/wk');
  const [newRoleValues, setNewRoleValues] = useState('Intentionality, Presence');
  const [newRoleCommitment, setNewRoleCommitment] = useState('');

  // Editing existing role modal
  const [editingRole, setEditingRole] = useState<ThreeHatsRole | null>(null);

  // Commitment creation modal
  const [isNewCommitmentOpen, setIsNewCommitmentOpen] = useState(false);
  const [newCommTitle, setNewCommTitle] = useState('');
  const [newCommRoleId, setNewCommRoleId] = useState('');
  const [newCommHatId, setNewCommHatId] = useState<HatType>('professional');
  const [newCommPriority, setNewCommPriority] = useState<CommitmentPriority>('high');
  const [newCommTargetDate, setNewCommTargetDate] = useState('This week');
  const [newCommEstimatedHours, setNewCommEstimatedHours] = useState(2);
  const [newCommValue, setNewCommValue] = useState('Clarity & Balance');
  const [newCommNextAction, setNewCommNextAction] = useState('');

  // Editing commitment modal
  const [editingCommitment, setEditingCommitment] = useState<ThreeHatsCommitment | null>(null);

  // Notification / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth listener & Data Loader
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      const uid = user ? user.uid : 'demo-user';
      try {
        const loadedRoles = await ThreeHatsService.loadRoles(uid);
        if (loadedRoles && loadedRoles.length > 0) {
          setUserRoles(loadedRoles);
        }
        const loadedComm = await ThreeHatsService.loadCommitments(uid);
        if (loadedComm && loadedComm.length > 0) {
          setCommitments(loadedComm);
        }
      } catch (err) {
        console.warn('Error hydrating Three Hats state:', err);
      }
    });
    return () => unsub();
  }, []);

  // Sync roles when changed
  useEffect(() => {
    const uid = currentUser ? currentUser.uid : 'demo-user';
    ThreeHatsService.saveRoles(userRoles, uid);
  }, [userRoles, currentUser]);

  // Sync commitments when changed
  useEffect(() => {
    const uid = currentUser ? currentUser.uid : 'demo-user';
    ThreeHatsService.saveCommitments(commitments, uid);
  }, [commitments, currentUser]);

  // Filtered library for Explore view
  const filteredLibrary = useMemo(() => {
    return DEFAULT_ROLES_LIBRARY.filter(template => {
      const matchesSearch = !roleSearchQuery || 
        template.name.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(roleSearchQuery.toLowerCase());

      const matchesHat = filterHat === 'all' || template.hatIds.includes(filterHat);
      return matchesSearch && matchesHat;
    });
  }, [roleSearchQuery, filterHat]);

  // Check if role is currently in user's role map
  const isRoleAdded = (name: string) => {
    return userRoles.some(r => r.name.toLowerCase() === name.toLowerCase());
  };

  const handleToggleLibraryRole = (template: typeof DEFAULT_ROLES_LIBRARY[0]) => {
    if (isRoleAdded(template.name)) {
      const target = userRoles.find(r => r.name.toLowerCase() === template.name.toLowerCase());
      if (target) {
        handleDeleteRole(target.id);
      }
    } else {
      const newRole: ThreeHatsRole = {
        ...template,
        id: `role-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        userId: currentUser?.uid || 'demo-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUserRoles(prev => [...prev, newRole]);
      showToast(`Added "${template.name}" to your Role Map.`);
    }
  };

  const handleAddCustomRole = () => {
    if (!newRoleName.trim()) return;
    const customRole: ThreeHatsRole = {
      id: `custom-role-${Date.now()}`,
      userId: currentUser?.uid || 'demo-user',
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || 'Custom user role',
      category: newRoleCategory,
      hatIds: newRoleHats.length > 0 ? newRoleHats : ['personal'],
      status: 'current',
      importance: newRoleImportance,
      energyLevel: newRoleEnergy,
      timeDemand: newRoleDemand,
      values: newRoleValues.split(',').map(v => v.trim()).filter(Boolean),
      commitments: newRoleCommitment.trim() ? [newRoleCommitment.trim()] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUserRoles(prev => [...prev, customRole]);
    setNewRoleName('');
    setNewRoleDesc('');
    setNewRoleCommitment('');
    setIsCustomRoleOpen(false);
    showToast(`Created custom role "${customRole.name}".`);
  };

  const handleUpdateRole = () => {
    if (!editingRole || !editingRole.name.trim()) return;
    setUserRoles(prev => prev.map(r => r.id === editingRole.id ? { ...editingRole, updatedAt: new Date().toISOString() } : r));
    setEditingRole(null);
    showToast(`Updated role "${editingRole.name}".`);
  };

  const handleDeleteRole = (roleId: string) => {
    const roleToDelete = userRoles.find(r => r.id === roleId);
    setUserRoles(prev => prev.filter(r => r.id !== roleId));
    // Also remove associated commitments
    setCommitments(prev => prev.filter(c => c.roleId !== roleId));
    const uid = currentUser ? currentUser.uid : 'demo-user';
    ThreeHatsService.deleteRole(roleId, uid);
    if (roleToDelete) {
      showToast(`Removed "${roleToDelete.name}" from your Role Map.`);
    }
  };

  // Commitments actions
  const handleAddCommitment = () => {
    if (!newCommTitle.trim()) return;
    const parentRole = userRoles.find(r => r.id === newCommRoleId) || userRoles[0];
    const newCommitment: ThreeHatsCommitment = {
      id: `comm-${Date.now()}`,
      userId: currentUser?.uid || 'demo-user',
      roleId: parentRole ? parentRole.id : 'custom',
      roleName: parentRole ? parentRole.name : 'Personal Practice',
      hatId: newCommHatId,
      title: newCommTitle.trim(),
      priority: newCommPriority,
      status: 'in_progress',
      targetDate: newCommTargetDate.trim() || 'Ongoing',
      estimatedHours: newCommEstimatedHours,
      personalValue: newCommValue.trim() || 'Intentional Living',
      nextAction: newCommNextAction.trim() || 'Take first small step',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCommitments(prev => [newCommitment, ...prev]);
    setNewCommTitle('');
    setNewCommNextAction('');
    setIsNewCommitmentOpen(false);
    showToast(`Added commitment: "${newCommitment.title}"`);
  };

  const handleUpdateCommitment = () => {
    if (!editingCommitment || !editingCommitment.title.trim()) return;
    setCommitments(prev => prev.map(c => c.id === editingCommitment.id ? { ...editingCommitment, updatedAt: new Date().toISOString() } : c));
    setEditingCommitment(null);
    showToast('Commitment updated.');
  };

  const handleDeleteCommitment = (commId: string) => {
    setCommitments(prev => prev.filter(c => c.id !== commId));
    const uid = currentUser ? currentUser.uid : 'demo-user';
    ThreeHatsService.deleteCommitment(commId, uid);
    showToast('Commitment deleted.');
  };

  // Reset to starter roles
  const handleResetToStarters = () => {
    if (window.confirm('Reset role map to the 6 curated starter roles? Any custom roles will be replaced.')) {
      const starters = DEFAULT_ROLES_LIBRARY.slice(0, 6).map((template, idx) => ({
        ...template,
        id: `role-init-${Date.now()}-${idx}`,
        userId: currentUser?.uid || 'demo-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      setUserRoles(starters);
      showToast('Reset to curated starter roles.');
    }
  };

  // Export data
  const handleExportJSON = () => {
    const jsonStr = ThreeHatsService.exportDataToJSON({
      roles: userRoles,
      commitments,
      perspectives,
      latestReflection: ritualData
    });
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `three-hats-role-map-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported JSON role map.');
  };

  const handleExportMarkdown = () => {
    const mdStr = ThreeHatsService.exportDataToMarkdown({
      roles: userRoles,
      commitments,
      perspectives,
      latestReflection: ritualData
    });
    const blob = new Blob([mdStr], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `three-hats-balance-journal-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported Markdown balance journal.');
  };

  // Run Three Hats Companion AI Reflection
  const handleRunCompanionReflection = async () => {
    setIsCompanionLoading(true);
    try {
      const response = await fetch('/api/three-hats/companion-reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roles: userRoles,
          commitments,
          recentReflection: ritualData,
          userQuery: companionPrompt || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate reflection');
      }

      const data = await response.json();
      setCompanionInsight({
        success: true,
        observation: data.insight.observation,
        citedUserInputs: data.insight.citedUserInputs,
        competingRolesNotice: data.insight.competingRolesNotice,
        gentleOptions: data.insight.gentleOptions,
        suggestedAdjustment: data.insight.suggestedAdjustment,
        permissionRequiredToSaveMemory: true,
        provider: 'NVIDIA Nemotron via Nebius / Deterministic Heuristic Engine',
        timestamp: new Date().toISOString()
      });
      showToast('Reflection generated.');
    } catch (err) {
      console.error(err);
      showToast('Notice: Using deterministic reflection engine.');
    } finally {
      setIsCompanionLoading(false);
    }
  };

  // Adopt gentle option as commitment
  const handleAdoptOptionAsCommitment = (optionText: string) => {
    setNewCommTitle(optionText);
    setNewCommNextAction(optionText);
    setIsNewCommitmentOpen(true);
    setCurrentView('commitments');
    showToast('Pre-filled new commitment from AI reflection.');
  };

  // Adopt adjustment into ritual
  const handleAdoptAdjustmentIntoRitual = (adj: string) => {
    setRitualData(prev => ({
      ...prev,
      step5_realisticAdjustment: adj
    }));
    setRitualStep(5);
    setCurrentView('weekly_ritual');
    showToast('Adopted suggestion into Step 5 of your Weekly Ritual.');
  };

  // Save Role Reflection to Lantern Keeper
  const handleSaveToLanternKeeper = async () => {
    const title = `Three Hats Weekly Reflection: ${new Date().toLocaleDateString()}`;
    const narrative = 
      `### Three Hats Weekly Ritual\n\n` +
      `* **What felt meaningful:** ${ritualData.step1_meaningful}\n` +
      `* **Attention review:** ${ritualData.step2_attentionReview}\n` +
      `* **Noticed conflicts:** ${ritualData.step3_conflictsNoticed}\n` +
      `* **Appreciations:** ${ritualData.step4_appreciations}\n` +
      `* **Realistic adjustment:** ${ritualData.step5_realisticAdjustment}\n\n` +
      `### Committed Actions for Next Week:\n` +
      ritualData.step6_committedActions.map(a => `* ${a}`).join('\n') +
      `\n\n*Saved with explicit permission from Three Hats Role-Mapping.*`;

    if (onSaveToLanternKeeper) {
      await onSaveToLanternKeeper(title, narrative, 'Three Hats Reflection');
    }
    setSavedToLanternSuccess(true);
    showToast('Saved reflection to Lantern Keeper memory sanctuary!');
    setTimeout(() => setSavedToLanternSuccess(false), 4000);
  };

  // Filtered commitments list
  const filteredCommitments = useMemo(() => {
    return commitments.filter(c => {
      const matchHat = commitmentFilterHat === 'all' || c.hatId === commitmentFilterHat;
      const matchStatus = commitmentFilterStatus === 'all' || c.status === commitmentFilterStatus;
      return matchHat && matchStatus;
    });
  }, [commitments, commitmentFilterHat, commitmentFilterStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-violet-500/50 text-slate-100 text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Philosophy */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-violet-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
                <Compass className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
                Dr. T Life-Balance Commons
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-950 text-violet-300 border border-violet-700/60">
                Three Hats Core
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                {currentUser ? `User: ${currentUser.email || currentUser.uid.slice(0, 8)}` : 'Guest / Demo Mode'}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Three Hats — Professional, Personal & Social
            </h1>
            
            <p className="text-sm font-medium text-amber-200/90 italic">
              “One person. Three hats. Many roles. One life to balance.”
            </p>

            <div className="pt-1 text-xs text-slate-300 max-w-3xl leading-relaxed">
              Recognize the hats you wear and the roles you occupy without rigid stereotypes. 
              Reflect with your personal AI on your stated commitments, balance your energy with self-compassion, 
              and store lasting life lessons directly into Lantern Keeper.
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-violet-500/30 text-center shadow-inner">
              <div className="text-xs text-slate-400 font-medium">Core Identity Statement</div>
              <div className="text-sm font-bold text-slate-100 mt-1 max-w-xs">
                “I am more than any single role I play.”
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportMarkdown}
                title="Export Life Balance Journal as Markdown"
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Export .MD</span>
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                title="Export Role Map & Commitments as JSON"
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export .JSON</span>
              </button>

              {setActiveTab && (
                <button
                  type="button"
                  onClick={() => setActiveTab('memorylantern')}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 transition-colors"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Lantern Keeper</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'overview', label: 'Overview', icon: <Compass className="w-4 h-4" /> },
          { id: 'explore', label: 'Explore Roles', icon: <Search className="w-4 h-4" /> },
          { id: 'role_map', label: `My Role Map (${userRoles.length})`, icon: <Layers className="w-4 h-4" /> },
          { id: 'commitments', label: `Commitments (${commitments.length})`, icon: <CheckCircle2 className="w-4 h-4" /> },
          { id: 'weekly_ritual', label: 'Weekly Ritual', icon: <Calendar className="w-4 h-4" /> },
          { id: 'companion', label: 'Three Hats Companion', icon: <Sparkles className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCurrentView(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              currentView === tab.id
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* VIEW 1: OVERVIEW SCREEN */}
      {currentView === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['professional', 'personal', 'social'] as HatType[]).map(hatId => {
              const def = THREE_HATS_DEFINITIONS[hatId];
              const hatRoles = userRoles.filter(r => r.hatIds.includes(hatId));
              const hatCommitments = commitments.filter(c => c.hatId === hatId);
              const p = perspectives[hatId];

              return (
                <div 
                  key={hatId}
                  className={`bg-slate-900/90 border ${def.borderColor} rounded-3xl p-6 flex flex-col justify-between shadow-lg space-y-6 relative overflow-hidden`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${def.badgeBg}`}>
                        {def.title.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {hatRoles.length} Role(s)
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className={`text-lg font-bold ${def.accentColor}`}>
                        {def.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {def.theme}
                      </p>
                    </div>

                    {/* Roles preview */}
                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Active Roles:
                      </div>
                      {hatRoles.length === 0 ? (
                        <div className="text-xs text-slate-500 italic">No roles assigned to this hat yet.</div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {hatRoles.map(r => (
                            <span key={r.id} className="text-xs px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
                              {r.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Commitments count */}
                    <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80">
                      <span>Active Commitments:</span>
                      <span className="font-semibold text-slate-200">{hatCommitments.length}</span>
                    </div>

                    {/* Interactive 3 Perspectives Indicator */}
                    <div className="space-y-3 pt-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                          <Sliders className="w-3 h-3 text-violet-400" />
                          <span>Balance Perspectives (1-5):</span>
                        </span>
                        <span className="text-[10px] text-slate-500">Tap to adjust</span>
                      </div>

                      {/* Importance */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Importance:</span>
                          <span className="font-mono text-slate-200 font-bold">{p.importance} / 5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={p.importance}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPerspectives(prev => ({
                              ...prev,
                              [hatId]: { ...prev[hatId], importance: val }
                            }));
                          }}
                          className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>

                      {/* Attention */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Recorded Attention:</span>
                          <span className="font-mono text-slate-200 font-bold">{p.attention} / 5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={p.attention}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPerspectives(prev => ({
                              ...prev,
                              [hatId]: { ...prev[hatId], attention: val }
                            }));
                          }}
                          className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>

                      {/* Satisfaction */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Satisfaction:</span>
                          <span className="font-mono text-slate-200 font-bold">{p.satisfaction} / 5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={p.satisfaction}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPerspectives(prev => ({
                              ...prev,
                              [hatId]: { ...prev[hatId], satisfaction: val }
                            }));
                          }}
                          className="w-full accent-violet-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setFilterHat(hatId); setCurrentView('explore'); }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 mt-4"
                  >
                    <span>Manage {def.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Action Footer */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span>Ready for this week's 5-minute Three Hats Ritual?</span>
              </h4>
              <p className="text-xs text-slate-400">
                Reflect on what felt meaningful, notice competing priorities, and choose realistic adjustments.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetToStarters}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Roles</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('weekly_ritual')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Begin Guided Reflection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: EXPLORE ROLES LIBRARY */}
      {currentView === 'explore' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={roleSearchQuery}
                onChange={(e) => setRoleSearchQuery(e.target.value)}
                placeholder="Search roles by name, craft, or category..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-violet-500"
              />
            </div>

            {/* Hat filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['all', 'professional', 'personal', 'social'] as const).map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setFilterHat(h)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    filterHat === h
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {h === 'all' ? 'All Hats' : h}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsCustomRoleOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors ml-2 shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Role</span>
              </button>
            </div>
          </div>

          {/* Role Cards Grid */}
          {filteredLibrary.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl space-y-3">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">No roles match your search</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for broader keywords, or create a brand-new custom role tailored to your life.
              </p>
              <button
                type="button"
                onClick={() => setIsCustomRoleOpen(true)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Custom Role</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLibrary.map((template, idx) => {
                const added = isRoleAdded(template.name);
                return (
                  <div 
                    key={idx}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                      added 
                        ? 'bg-violet-950/20 border-violet-500/50 shadow-sm' 
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {template.hatIds.map(h => (
                            <span 
                              key={h}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                h === 'professional' ? 'bg-sky-950 text-sky-300 border border-sky-800' :
                                h === 'personal' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                                'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500">{template.category}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-100">
                        {template.name}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {template.description}
                      </p>

                      <div className="text-[11px] text-slate-400 pt-1">
                        <strong>Core Values:</strong> {template.values.join(', ')}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleLibraryRole(template)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        added
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60 hover:bg-rose-900/80'
                          : 'bg-violet-600 hover:bg-violet-500 text-white'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>In My Role Map (Remove)</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to My Role Map</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: MY ROLE MAP */}
      {currentView === 'role_map' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                My Interactive Role Map ({userRoles.length} Roles)
              </h3>
              <p className="text-xs text-slate-400">
                Adjust importance, energy capacity, and time demands for each role you occupy.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCustomRoleOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Role</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('explore')}
                className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Explore Library</span>
              </button>
            </div>
          </div>

          {userRoles.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl space-y-4">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-200">Your Role Map is Empty</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Add roles from the curated library or build your own to begin balancing your Professional, Personal, and Social hats.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetToStarters}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Load Starter Roles
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomRoleOpen(true)}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
                >
                  Create Custom Role
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRoles.map(role => (
                <div 
                  key={role.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {role.hatIds.map(h => (
                            <span 
                              key={h} 
                              className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                                h === 'professional' ? 'bg-sky-950 text-sky-300 border border-sky-800' :
                                h === 'personal' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                                'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                        <h4 className="text-sm font-bold text-slate-100">{role.name}</h4>
                        <div className="text-[10px] text-slate-400">{role.category}</div>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize ${
                        role.status === 'current' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        role.status === 'occasional' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        role.status === 'aspirational' ? 'bg-sky-950 text-sky-300 border border-sky-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {role.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {role.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-500">Importance</div>
                        <div className="font-semibold text-slate-200 capitalize">{role.importance}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Energy</div>
                        <div className="font-semibold text-slate-200 capitalize">{role.energyLevel || 'neutral'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Demand</div>
                        <div className="font-semibold text-slate-200">{role.timeDemand || 'Flexible'}</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1">
                      <strong>Stated Commitment:</strong>
                      <div className="text-slate-300 italic text-[11px]">
                        "{role.commitments[0] || 'No commitment registered yet'}"
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        setNewCommRoleId(role.id);
                        setNewCommHatId(role.hatIds[0]);
                        setIsNewCommitmentOpen(true);
                      }}
                      className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Commitment</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingRole(role)}
                        title="Edit role"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteRole(role.id)}
                        title="Delete role"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: COMMITMENTS PLANNER */}
      {currentView === 'commitments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Commitment Planner & Weekly Distribution ({commitments.length})
              </h3>
              <p className="text-xs text-slate-400">
                Realistic next actions across your hats. More commitments does not equate to a better life.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (userRoles.length > 0) {
                    setNewCommRoleId(userRoles[0].id);
                    setNewCommHatId(userRoles[0].hatIds[0]);
                  }
                  setIsNewCommitmentOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Commitment</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 text-[11px] font-semibold uppercase">Hat:</span>
            {(['all', 'professional', 'personal', 'social'] as const).map(h => (
              <button
                key={h}
                type="button"
                onClick={() => setCommitmentFilterHat(h)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  commitmentFilterHat === h ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {h}
              </button>
            ))}

            <span className="text-slate-500 text-[11px] font-semibold uppercase ml-2">Status:</span>
            {(['all', 'in_progress', 'completed', 'planned'] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setCommitmentFilterStatus(s)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  commitmentFilterStatus === s ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          {filteredCommitments.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl space-y-3">
              <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">No commitments found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a role and set a clear, gentle next action that reflects your values.
              </p>
              <button
                type="button"
                onClick={() => setIsNewCommitmentOpen(true)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Your First Commitment</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCommitments.map(comm => (
                <div 
                  key={comm.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                        comm.hatId === 'professional' ? 'bg-sky-950 text-sky-300 border border-sky-800' :
                        comm.hatId === 'personal' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {comm.hatId}
                      </span>
                      <span className="text-xs font-semibold text-violet-300">
                        {comm.roleName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        comm.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        comm.status === 'in_progress' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {comm.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {comm.estimatedHours} hrs • {comm.targetDate || 'Ongoing'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100">{comm.title}</h4>
                    <p className="text-xs text-slate-400">
                      <strong>Next Action:</strong> {comm.nextAction} • <em className="text-slate-300">Value: {comm.personalValue}</em>
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCommitments(prev => prev.map(c => 
                          c.id === comm.id 
                            ? { ...c, status: c.status === 'completed' ? 'in_progress' : 'completed', updatedAt: new Date().toISOString() } 
                            : c
                        ));
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        comm.status === 'completed'
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {comm.status === 'completed' ? 'Mark In Progress' : 'Mark Completed'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingCommitment(comm)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      title="Edit commitment"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCommitment(comm.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete commitment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 5: WEEKLY THREE HATS RITUAL (6 STEPS) */}
      {currentView === 'weekly_ritual' && (
        <div className="bg-slate-900/90 border border-violet-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs uppercase font-mono text-violet-400 font-bold">
                5-Minute Guided Reflection
              </span>
              <h3 className="text-lg font-bold text-slate-100">
                Weekly Three Hats Ritual (Step {ritualStep} of 6)
              </h3>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRitualStep(s)}
                  className={`w-7 h-2 rounded-full transition-all ${s <= ritualStep ? 'bg-violet-500' : 'bg-slate-800'}`}
                  title={`Jump to Step ${s}`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Recognize */}
          {ritualStep === 1 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-200">
                Step 1 — Recognize: What felt meaningful this week?
              </label>
              <p className="text-xs text-slate-400">
                Notice moments of connection, deep craft, quiet rest, or shared purpose across any of your hats.
              </p>
              <textarea
                value={ritualData.step1_meaningful}
                onChange={(e) => setRitualData({ ...ritualData, step1_meaningful: e.target.value })}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-slate-100 outline-none focus:border-violet-500 leading-relaxed"
              />
            </div>
          )}

          {/* Step 2: Review */}
          {ritualStep === 2 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-200">
                Step 2 — Review: Which roles received the attention you intended to give them?
              </label>
              <p className="text-xs text-slate-400">
                Be honest without shame. Review your Professional, Personal, and Social commitments.
              </p>
              <textarea
                value={ritualData.step2_attentionReview}
                onChange={(e) => setRitualData({ ...ritualData, step2_attentionReview: e.target.value })}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-slate-100 outline-none focus:border-violet-500 leading-relaxed"
              />
            </div>
          )}

          {/* Step 3: Notice */}
          {ritualStep === 3 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-200">
                Step 3 — Notice: Where did you experience a conflict between roles, time, energy, or expectations?
              </label>
              <p className="text-xs text-slate-400">
                Identify where work demands squeezed rest, or social expectations felt heavy.
              </p>
              <textarea
                value={ritualData.step3_conflictsNoticed}
                onChange={(e) => setRitualData({ ...ritualData, step3_conflictsNoticed: e.target.value })}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-slate-100 outline-none focus:border-violet-500 leading-relaxed"
              />
            </div>
          )}

          {/* Step 4: Appreciate */}
          {ritualStep === 4 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-200">
                Step 4 — Appreciate: What went well, including something small?
              </label>
              <p className="text-xs text-slate-400">
                Celebrate small victories, steady routines, or moments of grace.
              </p>
              <textarea
                value={ritualData.step4_appreciations}
                onChange={(e) => setRitualData({ ...ritualData, step4_appreciations: e.target.value })}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-slate-100 outline-none focus:border-violet-500 leading-relaxed"
              />
            </div>
          )}

          {/* Step 5: Choose */}
          {ritualStep === 5 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-200">
                Step 5 — Choose: What is one realistic adjustment for next week?
              </label>
              <p className="text-xs text-slate-400">
                Keep it bounded and achievable. Not an entire life makeover—just one intentional pivot.
              </p>
              <textarea
                value={ritualData.step5_realisticAdjustment}
                onChange={(e) => setRitualData({ ...ritualData, step5_realisticAdjustment: e.target.value })}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-slate-100 outline-none focus:border-violet-500 leading-relaxed"
              />
            </div>
          )}

          {/* Step 6: Commit */}
          {ritualStep === 6 && (
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-200">
                Step 6 — Commit: Select up to three next actions for the coming week:
              </label>
              <div className="space-y-2">
                {ritualData.step6_committedActions.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={action}
                      onChange={(e) => {
                        const newActions = [...ritualData.step6_committedActions];
                        newActions[idx] = e.target.value;
                        setRitualData({ ...ritualData, step6_committedActions: newActions });
                      }}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
                    />
                  </div>
                ))}
              </div>

              {/* Save to Lantern Keeper Integration */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  You can permanently save this reflection as a private memory in <strong>Lantern Keeper</strong>.
                </div>
                <button
                  type="button"
                  onClick={handleSaveToLanternKeeper}
                  disabled={savedToLanternSuccess}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
                >
                  <Flame className="w-3.5 h-3.5 text-slate-950" />
                  <span>{savedToLanternSuccess ? 'Saved to Lantern Keeper!' : 'Save Reflection as Memory'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Wizard Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={ritualStep === 1}
              onClick={() => setRitualStep(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-30"
            >
              Previous
            </button>

            {ritualStep < 6 ? (
              <button
                type="button"
                onClick={() => setRitualStep(prev => Math.min(6, prev + 1))}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { 
                  setRitualSaved(true); 
                  const uid = currentUser ? currentUser.uid : 'demo-user';
                  ThreeHatsService.saveWeeklyReflection({
                    id: `reflection-${Date.now()}`,
                    userId: uid,
                    weekStartDate: new Date().toISOString().slice(0, 10),
                    ...ritualData,
                    perspectives,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  }, uid);
                  showToast('Completed Weekly Ritual! Reflection saved.');
                  setCurrentView('overview'); 
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Finish & Save Ritual</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW 6: THREE HATS COMPANION AI */}
      {currentView === 'companion' && (
        <div className="bg-slate-900/90 border border-violet-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-slate-100">
                Three Hats Companion AI
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synthesizes reflections strictly from your explicitly mapped roles, values, and commitments. 
              Never diagnoses mental health, never issues moral judgments, and respects your chosen life balance.
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              value={companionPrompt}
              onChange={(e) => setCompanionPrompt(e.target.value)}
              placeholder="Ask a reflection question (e.g. 'Are my current commitments realistic across my 3 hats?', 'Which role might be competing for my energy?')..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs text-slate-100 outline-none focus:border-violet-500 leading-relaxed"
            />
            
            <button
              type="button"
              disabled={isCompanionLoading}
              onClick={handleRunCompanionReflection}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              {isCompanionLoading ? (
                <span>Reflecting...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Grounded Reflection</span>
                </>
              )}
            </button>
          </div>

          {/* AI Observation Card */}
          {companionInsight && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-violet-500/40 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Grounded Reflection Insight</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {companionInsight.provider}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {companionInsight.observation}
              </p>

              {companionInsight.competingRolesNotice && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 text-xs text-amber-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{companionInsight.competingRolesNotice}</span>
                </div>
              )}

              {/* Cited User Inputs */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-300">
                  Strictly Cited User Inputs (No Hallucinations):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {companionInsight.citedUserInputs.map((input, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      ✓ {input}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gentle Options - Editable & Adoptable */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-300">
                  Gentle Options for Consideration (Tap to adopt):
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {companionInsight.gentleOptions.map((opt, idx) => (
                    <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 gap-2">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span>{opt}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAdoptOptionAsCommitment(opt)}
                        className="px-2.5 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600 text-violet-200 hover:text-white text-[11px] font-semibold transition-colors shrink-0"
                      >
                        Adopt as Commitment
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested Adjustment - Adoptable */}
              {companionInsight.suggestedAdjustment && (
                <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-700/40 space-y-2">
                  <div className="text-[11px] font-semibold text-violet-300">Suggested Adjustment:</div>
                  <div className="text-xs text-slate-200">{companionInsight.suggestedAdjustment}</div>
                  <button
                    type="button"
                    onClick={() => handleAdoptAdjustmentIntoRitual(companionInsight.suggestedAdjustment!)}
                    className="px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold inline-flex items-center gap-1"
                  >
                    <span>Adopt into Weekly Ritual</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Permission Gate to save to memory */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Permission required before persistent memory storage</span>
                </span>
                <button
                  type="button"
                  onClick={handleSaveToLanternKeeper}
                  disabled={savedToLanternSuccess}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1 disabled:opacity-50"
                >
                  <Flame className="w-3.5 h-3.5 text-slate-950" />
                  <span>{savedToLanternSuccess ? 'Saved to Memory!' : 'Save Reflection to Lantern Keeper'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD CUSTOM ROLE */}
      {isCustomRoleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 space-y-4 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-violet-400" />
                <span>Create Custom Role</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsCustomRoleOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Role Name *</label>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="e.g. Volunteer Gardener, Open-Source Contributor, Family Story Keeper"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Category</label>
              <input
                type="text"
                value={newRoleCategory}
                onChange={(e) => setNewRoleCategory(e.target.value)}
                placeholder="e.g. Learning and growth, Self and wellbeing, Relationships"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Assign to Hat(s) (Multi-Hat Supported) *</label>
              <div className="flex gap-2">
                {(['professional', 'personal', 'social'] as HatType[]).map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      setNewRoleHats(prev => 
                        prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      newRoleHats.includes(h)
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Importance</label>
                <select
                  value={newRoleImportance}
                  onChange={(e) => setNewRoleImportance(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100"
                >
                  <option value="core">Core</option>
                  <option value="high">High</option>
                  <option value="moderate">Moderate</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Energy Level</label>
                <select
                  value={newRoleEnergy}
                  onChange={(e) => setNewRoleEnergy(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100"
                >
                  <option value="energizing">Energizing</option>
                  <option value="neutral">Neutral</option>
                  <option value="draining">Draining</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Time Demand</label>
                <input
                  type="text"
                  value={newRoleDemand}
                  onChange={(e) => setNewRoleDemand(e.target.value)}
                  placeholder="e.g. 2 hrs/wk"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Description</label>
              <textarea
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                placeholder="What does this role mean to you?"
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Values (comma-separated)</label>
              <input
                type="text"
                value={newRoleValues}
                onChange={(e) => setNewRoleValues(e.target.value)}
                placeholder="e.g. Care, Craft, Community"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Initial Commitment (Optional)</label>
              <input
                type="text"
                value={newRoleCommitment}
                onChange={(e) => setNewRoleCommitment(e.target.value)}
                placeholder="e.g. Spend 1 hour every Sunday morning in the garden"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCustomRoleOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomRole}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ROLE */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 space-y-4 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-violet-400" />
                <span>Edit Role: {editingRole.name}</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setEditingRole(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Role Name</label>
              <input
                type="text"
                value={editingRole.name}
                onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Assign to Hat(s)</label>
              <div className="flex gap-2">
                {(['professional', 'personal', 'social'] as HatType[]).map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      const currentHats = editingRole.hatIds;
                      const updated = currentHats.includes(h)
                        ? (currentHats.length > 1 ? currentHats.filter(x => x !== h) : currentHats)
                        : [...currentHats, h];
                      setEditingRole({ ...editingRole, hatIds: updated });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      editingRole.hatIds.includes(h)
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Status</label>
                <select
                  value={editingRole.status}
                  onChange={(e) => setEditingRole({ ...editingRole, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100"
                >
                  <option value="current">Current</option>
                  <option value="occasional">Occasional</option>
                  <option value="aspirational">Aspirational</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Importance</label>
                <select
                  value={editingRole.importance}
                  onChange={(e) => setEditingRole({ ...editingRole, importance: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100"
                >
                  <option value="core">Core</option>
                  <option value="high">High</option>
                  <option value="moderate">Moderate</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Energy</label>
                <select
                  value={editingRole.energyLevel || 'neutral'}
                  onChange={(e) => setEditingRole({ ...editingRole, energyLevel: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100"
                >
                  <option value="energizing">Energizing</option>
                  <option value="neutral">Neutral</option>
                  <option value="draining">Draining</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Description</label>
              <textarea
                value={editingRole.description}
                onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  handleDeleteRole(editingRole.id);
                  setEditingRole(null);
                }}
                className="px-3 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 font-semibold"
              >
                Delete Role
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateRole}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD COMMITMENT */}
      {isNewCommitmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>New Role Commitment</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsNewCommitmentOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Commitment Title *</label>
              <input
                type="text"
                value={newCommTitle}
                onChange={(e) => setNewCommTitle(e.target.value)}
                placeholder="e.g. Protect 8-hour sleep window, Ship feature review"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Associated Role</label>
                <select
                  value={newCommRoleId}
                  onChange={(e) => {
                    const rId = e.target.value;
                    setNewCommRoleId(rId);
                    const found = userRoles.find(r => r.id === rId);
                    if (found && found.hatIds.length > 0) {
                      setNewCommHatId(found.hatIds[0]);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100"
                >
                  {userRoles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Hat</label>
                <select
                  value={newCommHatId}
                  onChange={(e) => setNewCommHatId(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100 capitalize"
                >
                  <option value="professional">Professional</option>
                  <option value="personal">Personal</option>
                  <option value="social">Social</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Priority</label>
                <select
                  value={newCommPriority}
                  onChange={(e) => setNewCommPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100 capitalize"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Target Date</label>
                <input
                  type="text"
                  value={newCommTargetDate}
                  onChange={(e) => setNewCommTargetDate(e.target.value)}
                  placeholder="e.g. This week, Daily"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Est. Hours</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={newCommEstimatedHours}
                  onChange={(e) => setNewCommEstimatedHours(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Personal Value Expressed</label>
              <input
                type="text"
                value={newCommValue}
                onChange={(e) => setNewCommValue(e.target.value)}
                placeholder="e.g. Health, Reliability, Belonging"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Concrete Next Action</label>
              <textarea
                value={newCommNextAction}
                onChange={(e) => setNewCommNextAction(e.target.value)}
                placeholder="What is the very first small step?"
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewCommitmentOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCommitment}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
              >
                Add Commitment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT COMMITMENT */}
      {editingCommitment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-violet-400" />
                <span>Edit Commitment</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setEditingCommitment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Title</label>
              <input
                type="text"
                value={editingCommitment.title}
                onChange={(e) => setEditingCommitment({ ...editingCommitment, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Status</label>
                <select
                  value={editingCommitment.status}
                  onChange={(e) => setEditingCommitment({ ...editingCommitment, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100 capitalize"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="planned">Planned</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Priority</label>
                <select
                  value={editingCommitment.priority}
                  onChange={(e) => setEditingCommitment({ ...editingCommitment, priority: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100 capitalize"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Next Action</label>
              <textarea
                value={editingCommitment.nextAction}
                onChange={(e) => setEditingCommitment({ ...editingCommitment, nextAction: e.target.value })}
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  handleDeleteCommitment(editingCommitment.id);
                  setEditingCommitment(null);
                }}
                className="px-3 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 font-semibold"
              >
                Delete
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCommitment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateCommitment}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
