// ============================================================================
// DR. T — HATBRIDGE: LIFE & WORK MISSION CONTROL
// "Many Hats. One Life. Nothing Important Lost."
// Codegeist 2026 | Isolated iPad-first continuous role-bridging workspace
// ============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  BookOpen,
  Calendar,
  Compass,
  FileCheck2,
  GitBranch,
  HelpCircle,
  Layers,
  Link2,
  Plus,
  Search,
  Settings,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, getFirebaseIdToken } from '../../services/firebase';
import {
  HatBridgeAtlassianIssue,
  HatBridgeAuditEvent,
  HatBridgeCommitmentStatus,
  HatBridgeConfluencePage,
  HatBridgeConflict,
  HatBridgeContextItem,
  HatBridgeDecision,
  HatBridgeHandoff,
  HatBridgePreferences,
  HatBridgeReentryBrief,
  HatBridgeRole,
  HatBridgeSectionId,
  HatBridgeStructuredAiResponse,
  HatBridgeTimeBlock,
  HatBridgeWorkspaceBundle,
} from '../../types/hatbridgeTypes';
import {
  buildSampleWorkflowDataset,
  HATBRIDGE_STARTER_PACKS,
  SAMPLE_ATLASSIAN_SANDBOX_ISSUES,
  SAMPLE_ATLASSIAN_SANDBOX_PAGES,
} from './data/hatbridgeStarters';
import {
  buildDeterministicReentryBrief,
  calculateDailyWorkload,
  computeHatBridgeAnalytics,
  detectCrossRoleConflicts,
} from './utils/hatbridgeEngine';
import {
  createEmptyWorkspace,
  HatBridgeStorageService,
} from './services/hatbridgeStorageService';
import { COLOR_STYLES, formatPrivacyLabel, renderHatIcon } from './HatBridgeIcon';
import { HatBridgeRolesSection } from './sections/HatBridgeRolesSection';
import {
  HatBridgeReentryBriefSection,
  HatBridgeTodaySection,
} from './sections/HatBridgeTodayAndBriefSections';
import {
  HatBridgeContextCaptureSection,
  HatBridgeDecisionMemorySection,
  HatBridgeHandoffsSection,
} from './sections/HatBridgeCaptureDecisionHandoffSections';
import {
  HatBridgeAiAssistantSection,
  HatBridgeSettingsPrivacySection,
  HatBridgeTimeProtectionSection,
  HatBridgeAtlassianSection,
} from './sections/HatBridgeWellbeingAtlassianAiSettingsSections';

export const HATBRIDGE_SECTIONS: Array<{
  id: HatBridgeSectionId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}> = [
  { id: 'my-hats', label: 'My Hats', shortLabel: 'Hats', icon: <Layers className="w-4 h-4" /> },
  { id: 'today-bridge', label: 'Today Bridge', shortLabel: 'Today', icon: <Calendar className="w-4 h-4" /> },
  { id: 'reentry-brief', label: 'Re-entry Brief', shortLabel: 'Resume', icon: <Compass className="w-4 h-4" /> },
  { id: 'context-capture', label: 'Context Capture', shortLabel: 'Capture', icon: <Plus className="w-4 h-4" /> },
  { id: 'decision-memory', label: 'Decision Memory', shortLabel: 'Decisions', icon: <FileCheck2 className="w-4 h-4" /> },
  { id: 'handoffs', label: 'Handoffs', shortLabel: 'Handoff', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'time-protection', label: 'Time Protection', shortLabel: 'Protect', icon: <Shield className="w-4 h-4" /> },
  { id: 'atlassian-workspace', label: 'Atlassian Workspace', shortLabel: 'Atlassian', icon: <Link2 className="w-4 h-4" /> },
  { id: 'ai-assistant', label: 'AI Assistant', shortLabel: 'AI', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'settings-privacy', label: 'Settings & Privacy', shortLabel: 'Privacy', icon: <Settings className="w-4 h-4" /> },
];

export const HatBridgeModule: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => auth.currentUser);
  const effectiveUserId = currentUser?.uid || 'local-guest';

  const [section, setSection] = useState<HatBridgeSectionId>('today-bridge');
  const [bundle, setBundle] = useState<HatBridgeWorkspaceBundle>(() => createEmptyWorkspace(effectiveUserId));
  const [storageBackend, setStorageBackend] = useState<'firestore_cloud' | 'browser_local'>('browser_local');
  const [loading, setLoading] = useState(true);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Quick Capture modal state (accessible from anywhere in Mission Control)
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [qcTitle, setQcTitle] = useState('');
  const [qcNote, setQcNote] = useState('');
  const [qcRoleId, setQcRoleId] = useState('');

  // Help drawer state
  const [helpOpen, setHelpOpen] = useState(false);

  // Global HatBridge search query
  const [globalSearch, setGlobalSearch] = useState('');

  // Active Re-entry Brief & AI states
  const [briefRoleId, setBriefRoleId] = useState('');
  const [activeBrief, setActiveBrief] = useState<HatBridgeReentryBrief | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<HatBridgeStructuredAiResponse | null>(null);

  // Atlassian live vs demo sandbox data
  const [jiraIssues, setJiraIssues] = useState<HatBridgeAtlassianIssue[]>([]);
  const [confluencePages, setConfluencePages] = useState<HatBridgeConfluencePage[]>([]);
  const [checkingAtlassian, setCheckingAtlassian] = useState(false);

  // Listen to Firebase Auth state cleanly
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  // Load workspace on auth user change
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    HatBridgeStorageService.loadWorkspace(effectiveUserId)
      .then((res) => {
        if (!mounted) return;
        setBundle(res.bundle);
        setStorageBackend(res.storageBackend);
        const firstActive = res.bundle.roles.find((r) => !r.archived)?.id || '';
        const selected = res.bundle.activeRoleId || firstActive;
        setBriefRoleId(selected);
        setQcRoleId(selected);
        if (res.bundle.roles.length === 0) {
          setSection('my-hats');
        }
        if (res.bundle.integration.isDemoSandboxActive) {
          setJiraIssues(SAMPLE_ATLASSIAN_SANDBOX_ISSUES);
          setConfluencePages(SAMPLE_ATLASSIAN_SANDBOX_PAGES);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [effectiveUserId]);

  const activeRoles = useMemo(() => bundle.roles.filter((r) => !r.archived), [bundle.roles]);
  const currentRole = useMemo(
    () => bundle.roles.find((r) => r.id === bundle.activeRoleId) || activeRoles[0],
    [bundle.roles, bundle.activeRoleId, activeRoles]
  );

  const todayStr = new Date().toISOString().slice(0, 10);

  const conflicts = useMemo(
    () =>
      detectCrossRoleConflicts({
        contextItems: bundle.contextItems,
        timeBlocks: bundle.timeBlocks,
        roles: bundle.roles,
      }),
    [bundle.contextItems, bundle.timeBlocks, bundle.roles]
  );

  const workload = useMemo(
    () =>
      calculateDailyWorkload({
        date: todayStr,
        contextItems: bundle.contextItems,
        timeBlocks: bundle.timeBlocks,
        sustainableDailyHours: bundle.preferences.sustainableDailyHours,
      }),
    [todayStr, bundle.contextItems, bundle.timeBlocks, bundle.preferences.sustainableDailyHours]
  );

  const analyticsSnapshot = useMemo(
    () =>
      computeHatBridgeAnalytics({
        analyticsEnabled: bundle.preferences.analyticsEnabled,
        briefs: bundle.reentryBriefs,
        handoffs: bundle.handoffs,
        contextItems: bundle.contextItems,
        lastCheckInBurden: bundle.analytics.contextSwitchingBurdenCheckIn,
      }),
    [bundle]
  );

  const appendAudit = (
    nextBundle: HatBridgeWorkspaceBundle,
    action: HatBridgeAuditEvent['action'],
    entityType: string,
    entityId: string,
    privacyLevel: HatBridgeAuditEvent['privacyLevel'],
    detail: string
  ): HatBridgeWorkspaceBundle => {
    const ev: HatBridgeAuditEvent = {
      id: `hb-aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: effectiveUserId,
      action,
      entityType,
      entityId,
      privacyLevel,
      detail,
      timestamp: new Date().toISOString(),
    };
    const updated: HatBridgeWorkspaceBundle = {
      ...nextBundle,
      auditEvents: [ev, ...nextBundle.auditEvents].slice(0, 100),
    };
    void HatBridgeStorageService.appendAuditEvent(ev, updated);
    return updated;
  };

  // Update deterministic Re-entry Brief automatically when briefRoleId changes
  useEffect(() => {
    const role = bundle.roles.find((r) => r.id === (briefRoleId || currentRole?.id));
    if (!role) {
      setActiveBrief(null);
      return;
    }
    const existingSaved = bundle.reentryBriefs.find(
      (b) => b.roleId === role.id && b.status !== 'dismissed'
    );
    if (existingSaved) {
      setActiveBrief(existingSaved);
      return;
    }
    setActiveBrief(
      buildDeterministicReentryBrief({
        userId: effectiveUserId,
        role,
        contextItems: bundle.contextItems,
        decisions: bundle.decisions,
        handoffs: bundle.handoffs,
        timeBlocks: bundle.timeBlocks,
        jiraIssues,
        confluencePages,
      })
    );
  }, [briefRoleId, currentRole?.id, bundle.roles.length, bundle.contextItems.length, bundle.decisions.length, bundle.handoffs.length]);

  // Helper to call /api/hatbridge/ai/reason
  const callServerAi = async (mode: 'reentry_brief' | 'handoff_draft' | 'decision_qa' | 'daily_briefing' | 'assistant_query', prompt: string) => {
    setAiLoading(true);
    setAiNotice(null);
    try {
      const idToken = await getFirebaseIdToken();
      const resp = await fetch('/api/hatbridge/ai/reason', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          mode,
          prompt,
          aiConsentGranted: bundle.preferences.aiConsentGranted,
          allowPrivatePersonal: bundle.preferences.allowPrivatePersonalInAi,
          activeRole: currentRole,
          roles: bundle.roles,
          contextItems: bundle.contextItems,
          decisions: bundle.decisions,
          handoffs: bundle.handoffs,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        const msg = data?.error || `AI request returned HTTP ${resp.status}.`;
        setAiNotice(`${msg} Using deterministic context records instead.`);
        return null;
      }
      return data.result as HatBridgeStructuredAiResponse;
    } catch (err: any) {
      setAiNotice(err?.message || 'Unable to reach HatBridge AI service.');
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  // ============================================================================
  // ROLE MUTATIONS
  // ============================================================================
  const handleSelectRole = (roleId: string) => {
    const chosen = bundle.roles.find((r) => r.id === roleId);
    if (!chosen) return;
    let next: HatBridgeWorkspaceBundle = { ...bundle, activeRoleId: roleId };
    next = appendAudit(next, 'ROLE_SWITCHED', 'hatbridge_roles', roleId, chosen.privacyLevel, `Switched active hat to ${chosen.name} (previous context preserved)`);
    setBundle(next);
    setBriefRoleId(roleId);
    setQcRoleId(roleId);
    HatBridgeStorageService.saveLocalSnapshot(effectiveUserId, next);
  };

  const handleCreateRole = (draft: Omit<HatBridgeRole, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const role: HatBridgeRole = {
      ...draft,
      id: `hb-role-${Date.now()}`,
      userId: effectiveUserId,
      createdAt: now,
      updatedAt: now,
    };
    let next: HatBridgeWorkspaceBundle = {
      ...bundle,
      roles: [...bundle.roles, role],
      activeRoleId: bundle.activeRoleId || role.id,
    };
    next = appendAudit(next, 'ROLE_CREATED', 'hatbridge_roles', role.id, role.privacyLevel, `Created hat "${role.name}"`);
    setBundle(next);
    void HatBridgeStorageService.upsertEntity('hatbridge_roles', role, next);
  };

  const handleUpdateRole = (updatedRole: HatBridgeRole) => {
    const saved = { ...updatedRole, updatedAt: new Date().toISOString() };
    let next: HatBridgeWorkspaceBundle = {
      ...bundle,
      roles: bundle.roles.map((r) => (r.id === saved.id ? saved : r)),
    };
    next = appendAudit(next, 'ROLE_UPDATED', 'hatbridge_roles', saved.id, saved.privacyLevel, `Updated hat "${saved.name}"`);
    setBundle(next);
    void HatBridgeStorageService.upsertEntity('hatbridge_roles', saved, next);
  };

  const handleReorderRole = (roleId: string, dir: 'up' | 'down') => {
    const sorted = [...bundle.roles].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((r) => r.id === roleId);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    [sorted[idx], sorted[swapIdx]] = [sorted[swapIdx], sorted[idx]];
    const reindexed = sorted.map((r, i) => ({ ...r, sortOrder: i, updatedAt: new Date().toISOString() }));
    const next = { ...bundle, roles: reindexed };
    setBundle(next);
    reindexed.forEach((r) => void HatBridgeStorageService.upsertEntity('hatbridge_roles', r, next));
  };

  const handleToggleArchive = (roleId: string) => {
    const target = bundle.roles.find((r) => r.id === roleId);
    if (!target) return;
    const saved = { ...target, archived: !target.archived, updatedAt: new Date().toISOString() };
    let next: HatBridgeWorkspaceBundle = {
      ...bundle,
      roles: bundle.roles.map((r) => (r.id === roleId ? saved : r)),
    };
    next = appendAudit(next, 'ROLE_ARCHIVED', 'hatbridge_roles', roleId, saved.privacyLevel, `${saved.archived ? 'Archived' : 'Restored'} hat "${saved.name}"`);
    setBundle(next);
    void HatBridgeStorageService.upsertEntity('hatbridge_roles', saved, next);
  };

  const handleAddStarterPack = (pack: 'clinical_academic' | 'general_professional') => {
    const now = new Date().toISOString();
    const existingNames = new Set(bundle.roles.map((r) => r.name.toLowerCase()));
    const additions: HatBridgeRole[] = HATBRIDGE_STARTER_PACKS.filter(
      (p) => p.pack === pack && !existingNames.has(p.name.toLowerCase())
    ).map((tpl, idx) => ({
      id: `hb-role-${tpl.key}-${Date.now()}-${idx}`,
      userId: effectiveUserId,
      name: tpl.name,
      icon: tpl.icon,
      color: tpl.color,
      description: tpl.description,
      goals: tpl.goals,
      currentPriorities: tpl.currentPriorities,
      relatedTasks: [],
      relatedDocuments: [],
      relevantContacts: [],
      activeProjects: [],
      recentDecisions: [],
      unfinishedWork: [],
      preferredAiContext: tpl.preferredAiContext,
      privacyLevel: tpl.privacyLevel,
      archived: false,
      sortOrder: bundle.roles.length + idx,
      isStarterTemplate: true,
      createdAt: now,
      updatedAt: now,
    }));

    if (additions.length === 0) return;
    const next: HatBridgeWorkspaceBundle = {
      ...bundle,
      roles: [...bundle.roles, ...additions],
      activeRoleId: bundle.activeRoleId || additions[0].id,
      preferences: { ...bundle.preferences, onboardingCompleted: true, updatedAt: now },
    };
    setBundle(next);
    setBriefRoleId(next.activeRoleId);
    additions.forEach((r) => void HatBridgeStorageService.upsertEntity('hatbridge_roles', r, next));
    setStatusBanner(`Added ${additions.length} starter hat(s). Customize, rename, or archive any role freely.`);
  };

  const handleLoadSampleWorkflow = () => {
    const sample = buildSampleWorkflowDataset(effectiveUserId);
    const now = new Date().toISOString();
    const next: HatBridgeWorkspaceBundle = {
      ...bundle,
      roles: sample.roles,
      activeRoleId: 'hb-role-university-dean',
      contextItems: sample.contextItems,
      decisions: sample.decisions,
      handoffs: sample.handoffs,
      timeBlocks: sample.timeBlocks,
      reentryBriefs: [],
      preferences: { ...bundle.preferences, onboardingCompleted: true, updatedAt: now },
    };
    setBundle(next);
    setBriefRoleId('hb-role-university-dean');
    setQcRoleId('hb-role-university-dean');
    HatBridgeStorageService.saveLocalSnapshot(effectiveUserId, next);
    sample.roles.forEach((r) => void HatBridgeStorageService.upsertEntity('hatbridge_roles', r, next));
    sample.contextItems.forEach((c) => void HatBridgeStorageService.upsertEntity('hatbridge_context_items', c, next));
    sample.decisions.forEach((d) => void HatBridgeStorageService.upsertEntity('hatbridge_decisions', d, next));
    sample.handoffs.forEach((h) => void HatBridgeStorageService.upsertEntity('hatbridge_handoffs', h, next));
    sample.timeBlocks.forEach((t) => void HatBridgeStorageService.upsertEntity('hatbridge_time_blocks', t, next));
    setSection('today-bridge');
    setStatusBanner('Sample Workflow Loaded (Demo Context — includes Dean, Clinic, Hospital & Protected Family blocks plus 1 cross-role conflict).');
  };

  // ============================================================================
  // CONTEXT, BRIEF, DECISIONS, HANDOFFS & TIME BLOCK MUTATIONS
  // ============================================================================
  const handleAddCapture = (draft: Omit<HatBridgeContextItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const item: HatBridgeContextItem = {
      ...draft,
      id: `hb-ctx-${Date.now()}`,
      userId: effectiveUserId,
      createdAt: now,
      updatedAt: now,
    };
    let next: HatBridgeWorkspaceBundle = {
      ...bundle,
      contextItems: [item, ...bundle.contextItems],
    };
    next = appendAudit(next, 'CONTEXT_CAPTURED', 'hatbridge_context_items', item.id, item.privacyLevel, `Captured "${item.title}"`);
    setBundle(next);
    void HatBridgeStorageService.upsertEntity('hatbridge_context_items', item, next);
    setStatusBanner(`Saved "${item.title}" to ${item.storageLocation === 'firestore_user_vault' ? 'Owner Firestore Vault' : 'Local Browser Vault'}.`);
  };

  const handleDeleteCapture = (id: string) => {
    const next = { ...bundle, contextItems: bundle.contextItems.filter((c) => c.id !== id) };
    setBundle(next);
    void HatBridgeStorageService.removeEntity('hatbridge_context_items', id, effectiveUserId, next);
  };

  const handleUpdateItemStatus = (itemId: string, status: HatBridgeCommitmentStatus) => {
    const target = bundle.contextItems.find((c) => c.id === itemId);
    if (!target) return;
    const saved = { ...target, commitmentStatus: status, updatedAt: new Date().toISOString() };
    const next = {
      ...bundle,
      contextItems: bundle.contextItems.map((c) => (c.id === itemId ? saved : c)),
    };
    setBundle(next);
    void HatBridgeStorageService.upsertEntity('hatbridge_context_items', saved, next);
  };

  const handleApplyConflictResolution = (conflict: HatBridgeConflict) => {
    const targetId = conflict.recommendedActionType === 'defer_item_b' ? conflict.itemBId : conflict.itemAId;
    const target = bundle.contextItems.find((c) => c.id === targetId);
    if (!target) return;
    const saved: HatBridgeContextItem = {
      ...target,
      commitmentStatus: 'deferred',
      updatedAt: new Date().toISOString(),
    };
    let next: HatBridgeWorkspaceBundle = {
      ...bundle,
      contextItems: bundle.contextItems.map((c) => (c.id === targetId ? saved : c)),
    };
    next = appendAudit(next, 'CONFLICT_RESOLUTION_APPLIED', 'hatbridge_context_items', targetId, saved.privacyLevel, `User approved deferring "${saved.title}" to resolve conflict`);
    setBundle(next);
    void HatBridgeStorageService.upsertEntity('hatbridge_context_items', saved, next);
    setStatusBanner(`Approved resolution: deferred "${saved.title}".`);
  };

  const handleGenerateBrief = async (roleId: string, useGemini: boolean) => {
    const role = bundle.roles.find((r) => r.id === roleId);
    if (!role) return;

    const baseBrief = buildDeterministicReentryBrief({
      userId: effectiveUserId,
      role,
      contextItems: bundle.contextItems,
      decisions: bundle.decisions,
      handoffs: bundle.handoffs,
      timeBlocks: bundle.timeBlocks,
      jiraIssues,
      confluencePages,
    });

    if (!useGemini) {
      setActiveBrief(baseBrief);
      return;
    }

    const aiRes = await callServerAi(
      'reentry_brief',
      `Generate a concise grounded Re-entry Brief for the "${role.name}" hat. Strictly cite supplied facts, decisions, waiting items, and next action. Never invent information.`
    );
    if (aiRes) {
      const enhanced: HatBridgeReentryBrief = {
        ...baseBrief,
        whatWasWorkingOn: aiRes.observedFacts[0] || baseBrief.whatWasWorkingOn,
        decisionsAlreadyMade:
          aiRes.userConfirmedDecisions.length > 0
            ? aiRes.userConfirmedDecisions.join(' | ')
            : baseBrief.decisionsAlreadyMade,
        nextMeaningfulAction: aiRes.proposedNextAction || baseBrief.nextMeaningfulAction,
        observedFacts: aiRes.observedFacts,
        sourceReferences: aiRes.sourceReferences.map((s) => ({
          label: s.label,
          kind: s.type,
          id: s.id || s.label,
          url: s.url,
        })),
        aiSuggestions: aiRes.aiSuggestions,
        missingInformation: aiRes.missingInformation,
        generatedBy: 'gemini',
      };
      let next = { ...bundle, reentryBriefs: [enhanced, ...bundle.reentryBriefs.filter((b) => b.id !== enhanced.id)] };
      next = appendAudit(next, 'REENTRY_BRIEF_GENERATED', 'hatbridge_reentry_briefs', enhanced.id, role.privacyLevel, `Generated Gemini Re-entry Brief for ${role.name}`);
      setBundle(next);
      setActiveBrief(enhanced);
      void HatBridgeStorageService.upsertEntity('hatbridge_reentry_briefs', enhanced, next);
    }
  };

  const handleSaveBrief = (brief: HatBridgeReentryBrief) => {
    const next = {
      ...bundle,
      reentryBriefs: [brief, ...bundle.reentryBriefs.filter((b) => b.id !== brief.id)],
    };
    setBundle(next);
    setActiveBrief(brief);
    void HatBridgeStorageService.upsertEntity('hatbridge_reentry_briefs', brief, next);
  };

  const handleConfirmBrief = (briefId: string, rating?: 1 | 2 | 3 | 4 | 5) => {
    if (!activeBrief) return;
    const confirmed: HatBridgeReentryBrief = {
      ...activeBrief,
      status: 'confirmed',
      usefulnessRating: rating,
      updatedAt: new Date().toISOString(),
    };
    let next: HatBridgeWorkspaceBundle = {
      ...bundle,
      reentryBriefs: [confirmed, ...bundle.reentryBriefs.filter((b) => b.id !== briefId)],
    };
    next = appendAudit(next, 'REENTRY_BRIEF_CONFIRMED', 'hatbridge_reentry_briefs', confirmed.id, confirmed.privacyLevel, `Confirmed Re-entry Brief for ${confirmed.roleName}`);
    setBundle(next);
    setActiveBrief(confirmed);
    void HatBridgeStorageService.upsertEntity('hatbridge_reentry_briefs', confirmed, next);
    setStatusBanner(`Re-entry Brief confirmed for ${confirmed.roleName}.`);
  };

  const handleDismissBrief = (briefId: string) => {
    if (!activeBrief) return;
    const dismissed: HatBridgeReentryBrief = { ...activeBrief, status: 'dismissed', updatedAt: new Date().toISOString() };
    const next = {
      ...bundle,
      reentryBriefs: [dismissed, ...bundle.reentryBriefs.filter((b) => b.id !== briefId)],
    };
    setBundle(next);
    setActiveBrief(null);
    void HatBridgeStorageService.upsertEntity('hatbridge_reentry_briefs', dismissed, next);
  };

  const handleSaveDecision = (draft: Omit<HatBridgeDecision, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'revisions'>) => {
    const now = new Date().toISOString();
    const record: HatBridgeDecision = {
      ...draft,
      id: `hb-dec-${Date.now()}`,
      userId: effectiveUserId,
      revisions: [{ timestamp: now, summary: 'Decision recorded', editor: currentUser?.email || 'Owner' }],
      createdAt: now,
      updatedAt: now,
    };
    let next: HatBridgeWorkspaceBundle = { ...bundle, decisions: [record, ...bundle.decisions] };
    next = appendAudit(next, 'DECISION_RECORDED', 'hatbridge_decisions', record.id, record.privacyLevel, `Recorded decision "${record.title}"`);
    setBundle(next);
    void HatBridgeStorageService.upsertEntity('hatbridge_decisions', record, next);
  };

  const handleUpdateDecision = (updated: HatBridgeDecision, revisionSummary: string) => {
    const now = new Date().toISOString();
    const saved: HatBridgeDecision = {
      ...updated,
      revisions: [...updated.revisions, { timestamp: now, summary: revisionSummary, editor: currentUser?.email || 'Owner' }],
      updatedAt: now,
    };
    let next: HatBridgeWorkspaceBundle = {
      ...bundle,
      decisions: bundle.decisions.map((d) => (d.id === saved.id ? saved : d)),
    };
    next = appendAudit(next, 'DECISION_REVISED', 'hatbridge_decisions', saved.id, saved.privacyLevel, `Revised decision "${saved.title}": ${revisionSummary}`);
    setBundle(next);
    void HatBridgeStorageService.upsertEntity('hatbridge_decisions', saved, next);
  };

  const handleDeleteDecision = (id: string) => {
    const next = { ...bundle, decisions: bundle.decisions.filter((d) => d.id !== id) };
    setBundle(next);
    void HatBridgeStorageService.removeEntity('hatbridge_decisions', id, effectiveUserId, next);
  };

  const handleSaveHandoffAndSwitch = (
    draft: Omit<HatBridgeHandoff, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
    switchToRoleId?: string
  ) => {
    const now = new Date().toISOString();
    const handoff: HatBridgeHandoff = {
      ...draft,
      id: `hb-ho-${Date.now()}`,
      userId: effectiveUserId,
      createdAt: now,
      updatedAt: now,
    };
    let next: HatBridgeWorkspaceBundle = {
      ...bundle,
      handoffs: [handoff, ...bundle.handoffs],
      activeRoleId: switchToRoleId || bundle.activeRoleId,
    };
    next = appendAudit(next, 'HANDOFF_SAVED', 'hatbridge_handoffs', handoff.id, handoff.privacyLevel, `Saved handoff from ${handoff.fromRoleId}`);
    setBundle(next);
    void HatBridgeStorageService.upsertEntity('hatbridge_handoffs', handoff, next);

    if (switchToRoleId) {
      setBriefRoleId(switchToRoleId);
      setSection('reentry-brief');
      const targetName = bundle.roles.find((r) => r.id === switchToRoleId)?.name || 'target hat';
      setStatusBanner(`Handoff saved cleanly. Switched into ${targetName} with Re-entry Brief ready.`);
    } else {
      setStatusBanner('Role handoff saved. You can switch hats anytime without losing context.');
    }
  };

  const handleAddTimeBlock = (draft: Omit<HatBridgeTimeBlock, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const block: HatBridgeTimeBlock = {
      ...draft,
      id: `hb-tb-${Date.now()}`,
      userId: effectiveUserId,
      createdAt: now,
      updatedAt: now,
    };
    let next: HatBridgeWorkspaceBundle = { ...bundle, timeBlocks: [block, ...bundle.timeBlocks] };
    next = appendAudit(next, 'TIME_PROTECTION_UPDATED', 'hatbridge_time_blocks', block.id, 'private_personal', `Protected ${block.category} window "${block.title}"`);
    setBundle(next);
    void HatBridgeStorageService.upsertEntity('hatbridge_time_blocks', block, next);
  };

  const handleDeleteTimeBlock = (id: string) => {
    const next = { ...bundle, timeBlocks: bundle.timeBlocks.filter((b) => b.id !== id) };
    setBundle(next);
    void HatBridgeStorageService.removeEntity('hatbridge_time_blocks', id, effectiveUserId, next);
  };

  const handleUpdatePreferences = (patch: Partial<HatBridgePreferences>) => {
    const nextPrefs: HatBridgePreferences = {
      ...bundle.preferences,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    let next: HatBridgeWorkspaceBundle = { ...bundle, preferences: nextPrefs };
    if (typeof patch.aiConsentGranted === 'boolean') {
      next = appendAudit(
        next,
        'AI_CONSENT_UPDATED',
        'hatbridge_preferences',
        effectiveUserId,
        'private_personal',
        `AI consent set to ${patch.aiConsentGranted}`
      );
    }
    setBundle(next);
    void HatBridgeStorageService.savePreferences(nextPrefs, next);
  };

  // ============================================================================
  // ATLASSIAN WORKSPACE ACTIONS
  // ============================================================================
  const handleRefreshLiveAtlassian = async () => {
    setCheckingAtlassian(true);
    try {
      const idToken = await getFirebaseIdToken();
      const statusRes = await fetch('/api/hatbridge/status', {
        headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
      });
      const statusData = await statusRes.json();

      if (statusData?.atlassian?.connected) {
        const [jiraRes, confRes] = await Promise.all([
          fetch('/api/hatbridge/atlassian/jira/issues', {
            headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
          }),
          fetch('/api/hatbridge/atlassian/confluence/pages', {
            headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
          }),
        ]);
        const jData = await jiraRes.json();
        const cData = await confRes.json();
        setJiraIssues(Array.isArray(jData.issues) ? jData.issues : []);
        setConfluencePages(Array.isArray(cData.pages) ? cData.pages : []);
        const nextInteg = {
          ...bundle.integration,
          connectionMode: 'live_atlassian_configured' as const,
          siteUrl: statusData.atlassian.siteUrl || '',
          jiraConnected: true,
          confluenceConnected: true,
          accountLabel: statusData.atlassian.accountLabel || undefined,
          isDemoSandboxActive: false,
          lastCheckedAt: new Date().toISOString(),
          statusMessage: 'Connected cleanly to live Atlassian Cloud REST APIs.',
          updatedAt: new Date().toISOString(),
        };
        const next = { ...bundle, integration: nextInteg };
        setBundle(next);
        void HatBridgeStorageService.saveIntegration(nextInteg, next);
      } else {
        setJiraIssues([]);
        setConfluencePages([]);
        const nextInteg = {
          ...bundle.integration,
          connectionMode: 'disconnected' as const,
          jiraConnected: false,
          confluenceConnected: false,
          isDemoSandboxActive: false,
          lastCheckedAt: new Date().toISOString(),
          statusMessage:
            'No live Atlassian credentials detected on the server. Install apps/hatbridge-forge inside your Atlassian Cloud site or open the Demo Atlassian Sandbox.',
          updatedAt: new Date().toISOString(),
        };
        const next = { ...bundle, integration: nextInteg };
        setBundle(next);
        void HatBridgeStorageService.saveIntegration(nextInteg, next);
      }
    } catch (err: any) {
      setStatusBanner(err?.message || 'Unable to check Atlassian connectivity.');
    } finally {
      setCheckingAtlassian(false);
    }
  };

  const handleToggleAtlassianSandbox = (enabled: boolean) => {
    const now = new Date().toISOString();
    if (enabled) {
      setJiraIssues(SAMPLE_ATLASSIAN_SANDBOX_ISSUES);
      setConfluencePages(SAMPLE_ATLASSIAN_SANDBOX_PAGES);
      const nextInteg = {
        ...bundle.integration,
        connectionMode: 'sample_sandbox' as const,
        isDemoSandboxActive: true,
        jiraConnected: false,
        confluenceConnected: false,
        statusMessage: 'Demo Atlassian Sandbox active. Showing isolated sample issues & pages—never displayed as live.',
        updatedAt: now,
      };
      const next = { ...bundle, integration: nextInteg };
      setBundle(next);
      void HatBridgeStorageService.saveIntegration(nextInteg, next);
    } else {
      setJiraIssues([]);
      setConfluencePages([]);
      const nextInteg = {
        ...bundle.integration,
        connectionMode: 'disconnected' as const,
        isDemoSandboxActive: false,
        statusMessage: 'Demo sandbox closed. Live Atlassian connection is currently disconnected.',
        updatedAt: now,
      };
      const next = { ...bundle, integration: nextInteg };
      setBundle(next);
      void HatBridgeStorageService.saveIntegration(nextInteg, next);
    }
  };

  const handleCreateJiraConfirmed = async (payload: { projectKey: string; summary: string; description: string }) => {
    const idToken = await getFirebaseIdToken();
    const res = await fetch('/api/hatbridge/atlassian/jira/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify({
        ...payload,
        privacyLevel: 'work_team',
        userConfirmed: true,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatusBanner(data?.error || 'Jira issue creation failed.');
      return;
    }
    let next = appendAudit(bundle, 'ATLASSIAN_ISSUE_CREATED', 'jira_issue', data.issue.key, 'work_team', `Created Jira issue ${data.issue.key}`);
    setBundle(next);
    setStatusBanner(`Created live Jira issue ${data.issue.key}.`);
    await handleRefreshLiveAtlassian();
  };

  // Global cross-entity search results
  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return null;
    return {
      roles: bundle.roles.filter((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)),
      items: bundle.contextItems.filter((i) => i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q)),
      decisions: bundle.decisions.filter((d) => d.title.toLowerCase().includes(q) || d.reasoning.toLowerCase().includes(q)),
    };
  }, [globalSearch, bundle]);

  const activeStyle = currentRole ? COLOR_STYLES[currentRole.color] || COLOR_STYLES.slate : COLOR_STYLES.slate;

  return (
    <div className="min-h-[82vh] bg-slate-50/70 rounded-3xl border border-slate-200/90 overflow-hidden">
      {/* Top Mission Control Strip (iPad-first, sticky friendly) */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Identity & Active Hat Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-teal-800 font-bold">
                Dr. T — HatBridge
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 font-display leading-tight">
                Life &amp; Work Mission Control
              </h1>
            </div>

            {activeRoles.length > 0 && currentRole && (
              <div className="flex items-center gap-2 pl-0 sm:pl-3 sm:border-l border-slate-200">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center border ${activeStyle.softBg} ${activeStyle.border} ${activeStyle.text}`}>
                  {renderHatIcon(currentRole.icon, 'w-4 h-4')}
                </span>
                <select
                  aria-label="Active Hat Switcher"
                  value={currentRole.id}
                  onChange={(e) => handleSelectRole(e.target.value)}
                  className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900"
                >
                  {activeRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      Wearing: {r.name}
                    </option>
                  ))}
                </select>
                <span className="hidden xl:inline text-xs text-slate-500">
                  {formatPrivacyLabel(currentRole.privacyLevel)}
                </span>
              </div>
            )}
          </div>

          {/* Search, Quick Capture, Handoff Switch, Help */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-none sm:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search hats, notes, decisions..."
                className="w-full min-h-[44px] pl-8 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <button
              type="button"
              onClick={() => setQuickCaptureOpen(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Capture</span>
            </button>

            <button
              type="button"
              onClick={() => setSection('handoffs')}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Finish &amp; Switch</span>
            </button>

            <button
              type="button"
              onClick={() => setHelpOpen((v) => !v)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer"
              title="HatBridge Help & Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status or Help Banners */}
      {statusBanner && (
        <div className="bg-teal-50 border-b border-teal-200 px-6 py-2.5 flex items-center justify-between gap-3 text-xs text-teal-900">
          <span>{statusBanner}</span>
          <button type="button" onClick={() => setStatusBanner(null)} className="text-teal-800 hover:text-teal-950 font-semibold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {helpOpen && (
        <div className="bg-white border-b border-slate-200 px-6 py-4 text-xs text-slate-700 space-y-1.5">
          <div className="flex items-center justify-between font-bold text-slate-900">
            <span className="inline-flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-teal-700" /> Quick Guide — Many Hats. One Life. Nothing Important Lost.</span>
            <button type="button" onClick={() => setHelpOpen(false)} className="text-slate-500 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
          <p>1. Set up your roles in <strong>My Hats</strong>. Mark family/rest roles as <strong>Private Personal</strong>.</p>
          <p>2. Before stepping away, save a 1-line note in <strong>Context Capture</strong> or complete a quick transition in <strong>Handoffs</strong>.</p>
          <p>3. When returning to any role, open <strong>Re-entry Brief</strong> to answer all 8 resume questions strictly from real records.</p>
        </div>
      )}

      {/* Global Search Drawer */}
      {searchResults && (
        <div className="bg-white border-b border-slate-200 px-6 py-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">Search Results for &ldquo;{globalSearch}&rdquo;</span>
            <button type="button" onClick={() => setGlobalSearch('')} className="text-slate-500 hover:text-slate-900 cursor-pointer">
              Clear
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <div className="font-semibold text-slate-500 mb-1">Hats ({searchResults.roles.length})</div>
              {searchResults.roles.map((r) => (
                <button key={r.id} type="button" onClick={() => { handleSelectRole(r.id); setSection('reentry-brief'); setGlobalSearch(''); }} className="block text-left text-teal-800 hover:underline py-0.5 cursor-pointer">
                  {r.name}
                </button>
              ))}
            </div>
            <div>
              <div className="font-semibold text-slate-500 mb-1">Captures ({searchResults.items.length})</div>
              {searchResults.items.slice(0, 5).map((i) => (
                <button key={i.id} type="button" onClick={() => { setSection('context-capture'); setGlobalSearch(''); }} className="block text-left text-slate-800 hover:underline py-0.5 cursor-pointer">
                  {i.title}
                </button>
              ))}
            </div>
            <div>
              <div className="font-semibold text-slate-500 mb-1">Decisions ({searchResults.decisions.length})</div>
              {searchResults.decisions.slice(0, 5).map((d) => (
                <button key={d.id} type="button" onClick={() => { setSection('decision-memory'); setGlobalSearch(''); }} className="block text-left text-slate-800 hover:underline py-0.5 cursor-pointer">
                  {d.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Horizontal Tab Rail (< md) */}
      <nav className="md:hidden flex overflow-x-auto gap-1.5 px-3 py-2 bg-white border-b border-slate-200">
        {HATBRIDGE_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 cursor-pointer ${
              section === s.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {s.icon}
            <span>{s.shortLabel}</span>
          </button>
        ))}
      </nav>

      {/* Main iPad & Desktop Layout: Left Sidebar (248px) + Content Canvas */}
      <div className="flex">
        <aside className="hidden md:flex md:flex-col w-60 lg:w-64 shrink-0 border-r border-slate-200 bg-white p-3 space-y-1">
          {HATBRIDGE_SECTIONS.map((s) => {
            const active = section === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={`min-h-[44px] w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {s.icon}
                  <span>{s.label}</span>
                </span>
                {s.id === 'today-bridge' && conflicts.length > 0 && (
                  <span className={`font-mono text-[11px] ${active ? 'text-amber-300' : 'text-amber-700'}`}>
                    {conflicts.length}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading HatBridge continuity workspace...
            </div>
          ) : (
            <>
              {section === 'my-hats' && (
                <HatBridgeRolesSection
                  roles={bundle.roles}
                  activeRoleId={bundle.activeRoleId}
                  onSelectRole={handleSelectRole}
                  onCreateRole={handleCreateRole}
                  onUpdateRole={handleUpdateRole}
                  onReorderRole={handleReorderRole}
                  onToggleArchive={handleToggleArchive}
                  onAddStarterPack={handleAddStarterPack}
                  onLoadSampleWorkflow={handleLoadSampleWorkflow}
                  onOpenReentryBrief={(roleId) => {
                    setBriefRoleId(roleId);
                    setSection('reentry-brief');
                  }}
                />
              )}

              {section === 'today-bridge' && (
                <HatBridgeTodaySection
                  roles={bundle.roles}
                  contextItems={bundle.contextItems}
                  timeBlocks={bundle.timeBlocks}
                  conflicts={conflicts}
                  workload={workload}
                  onUpdateItemStatus={handleUpdateItemStatus}
                  onApplyConflictResolution={handleApplyConflictResolution}
                  onSelectRoleBrief={(rId) => {
                    setBriefRoleId(rId);
                    setSection('reentry-brief');
                  }}
                  onQuickCaptureClick={() => setQuickCaptureOpen(true)}
                />
              )}

              {section === 'reentry-brief' && (
                <HatBridgeReentryBriefSection
                  roles={bundle.roles}
                  selectedRoleId={briefRoleId || currentRole?.id || ''}
                  onChangeRole={setBriefRoleId}
                  brief={activeBrief}
                  onGenerateBrief={handleGenerateBrief}
                  onSaveBrief={handleSaveBrief}
                  onConfirmBrief={handleConfirmBrief}
                  onDismissBrief={handleDismissBrief}
                  onConvertActionToTask={(rId, actionText) => {
                    const roleObj = bundle.roles.find((r) => r.id === rId);
                    handleAddCapture({
                      roleId: rId,
                      title: actionText.slice(0, 90),
                      content: `Converted from Re-entry Brief next action: ${actionText}`,
                      category: 'task',
                      commitmentStatus: 'important',
                      priority: 'high',
                      privacyLevel: roleObj?.privacyLevel || 'work_team',
                      storageLocation: storageBackend === 'firestore_cloud' ? 'firestore_user_vault' : 'browser_sandbox',
                      capturedVia: 'quick_capture',
                    });
                  }}
                  onAskAiForClarification={(prompt) => {
                    setSection('ai-assistant');
                    if (bundle.preferences.aiConsentGranted) {
                      void callServerAi('assistant_query', prompt).then((r) => {
                        if (r) setAiResponse(r);
                      });
                    }
                  }}
                  aiLoading={aiLoading}
                  aiConsentGranted={bundle.preferences.aiConsentGranted}
                  aiNotice={aiNotice}
                />
              )}

              {section === 'context-capture' && (
                <HatBridgeContextCaptureSection
                  roles={bundle.roles}
                  activeRoleId={bundle.activeRoleId}
                  contextItems={bundle.contextItems}
                  storageBackend={storageBackend}
                  onAddCapture={handleAddCapture}
                  onDeleteCapture={handleDeleteCapture}
                  atlassianConnected={bundle.integration.jiraConnected}
                  onCreateJiraFromCapture={(item) => {
                    setSection('atlassian-workspace');
                    setStatusBanner(`Ready to promote "${item.title}" to Jira — review and confirm in Atlassian Workspace.`);
                  }}
                />
              )}

              {section === 'decision-memory' && (
                <HatBridgeDecisionMemorySection
                  roles={bundle.roles}
                  decisions={bundle.decisions}
                  allowPrivatePersonalInAi={bundle.preferences.allowPrivatePersonalInAi}
                  onSaveDecision={handleSaveDecision}
                  onUpdateDecision={handleUpdateDecision}
                  onDeleteDecision={handleDeleteDecision}
                />
              )}

              {section === 'handoffs' && (
                <HatBridgeHandoffsSection
                  roles={bundle.roles}
                  activeRoleId={bundle.activeRoleId}
                  contextItems={bundle.contextItems}
                  decisions={bundle.decisions}
                  handoffs={bundle.handoffs}
                  onSaveHandoffAndSwitch={handleSaveHandoffAndSwitch}
                  onDraftHandoffWithAi={async (fromRoleId) => {
                    const rName = bundle.roles.find((r) => r.id === fromRoleId)?.name || 'this hat';
                    const aiRes = await callServerAi(
                      'handoff_draft',
                      `Draft a concise context handoff for leaving "${rName}" based strictly on saved tasks and decisions.`
                    );
                    if (!aiRes) return null;
                    return {
                      currentSituation: aiRes.observedFacts[0],
                      nextAction: aiRes.proposedNextAction,
                      remainingWork: aiRes.aiSuggestions,
                    };
                  }}
                  aiConsentGranted={bundle.preferences.aiConsentGranted}
                  aiLoading={aiLoading}
                />
              )}

              {section === 'time-protection' && (
                <HatBridgeTimeProtectionSection
                  timeBlocks={bundle.timeBlocks}
                  workload={workload}
                  sustainableDailyHours={bundle.preferences.sustainableDailyHours}
                  onAddTimeBlock={handleAddTimeBlock}
                  onDeleteTimeBlock={handleDeleteTimeBlock}
                  onUpdateSustainableHours={(hours) => handleUpdatePreferences({ sustainableDailyHours: hours })}
                />
              )}

              {section === 'atlassian-workspace' && (
                <HatBridgeAtlassianSection
                  integration={bundle.integration}
                  roles={bundle.roles}
                  issues={jiraIssues}
                  pages={confluencePages}
                  isChecking={checkingAtlassian}
                  onRefreshLive={handleRefreshLiveAtlassian}
                  onToggleSandbox={handleToggleAtlassianSandbox}
                  onLinkIssueToRole={(issueKey, targetRoleId) => {
                    const matchedIssue = jiraIssues.find((iss) => iss.key === issueKey);
                    setJiraIssues((prev) =>
                      prev.map((iss) => (iss.key === issueKey ? { ...iss, linkedRoleId: targetRoleId } : iss))
                    );
                    if (matchedIssue) {
                      const targetRole = bundle.roles.find((r) => r.id === targetRoleId);
                      if (targetRole) {
                        const taskRef = `${matchedIssue.key}: ${matchedIssue.summary}`;
                        const nextTasks = targetRole.relatedTasks.includes(taskRef)
                          ? targetRole.relatedTasks
                          : [...targetRole.relatedTasks, taskRef];
                        handleUpdateRole({ ...targetRole, relatedTasks: nextTasks });
                      }
                    }
                  }}
                  onLinkPageToRole={(pageId, targetRoleId) => {
                    const matchedPage = confluencePages.find((pg) => pg.id === pageId);
                    setConfluencePages((prev) =>
                      prev.map((pg) => (pg.id === pageId ? { ...pg, linkedRoleId: targetRoleId } : pg))
                    );
                    if (matchedPage) {
                      const targetRole = bundle.roles.find((r) => r.id === targetRoleId);
                      if (targetRole) {
                        const alreadyLinked = targetRole.relatedDocuments.some(
                          (d) => d.refId === matchedPage.id || d.title === matchedPage.title
                        );
                        if (!alreadyLinked) {
                          const nextDocs = [
                            ...targetRole.relatedDocuments,
                            {
                              title: matchedPage.title,
                              source: 'Confluence' as const,
                              url: matchedPage.url,
                              refId: matchedPage.id,
                            },
                          ];
                          handleUpdateRole({ ...targetRole, relatedDocuments: nextDocs });
                        }
                      }
                    }
                  }}
                  onCaptureIssueAsContext={(issue, targetRoleId) => {
                    const targetRole = bundle.roles.find((r) => r.id === targetRoleId);
                    if (!targetRole) return;
                    if (targetRole.privacyLevel === 'private_personal') {
                      setStatusBanner('Privacy Boundary: Private personal/family hats cannot mix directly with shared Jira workspace captures. Select a Workplace Hat.');
                      return;
                    }
                    const safeUrl = /^https?:\/\//i.test(issue.url || '') ? issue.url : undefined;
                    handleAddCapture({
                      roleId: targetRole.id,
                      title: `${issue.key}: ${issue.summary}`,
                      content: `Captured from Jira (${issue.status}${issue.dueDate ? `, due ${issue.dueDate}` : ''}).`,
                      category: 'task',
                      commitmentStatus: issue.isOverdue || issue.isBlocked ? 'urgent' : 'important',
                      priority: issue.isOverdue ? 'high' : 'medium',
                      dueDate: issue.dueDate,
                      relatedProject: issue.projectName,
                      jiraIssueKey: issue.key,
                      jiraIssueUrl: safeUrl,
                      privacyLevel: targetRole.privacyLevel,
                      storageLocation: 'atlassian_linked',
                      sourceReference: `Jira ${issue.key}`,
                      capturedVia: 'atlassian_sync',
                    });
                    setJiraIssues((prev) =>
                      prev.map((iss) => (iss.key === issue.key ? { ...iss, linkedRoleId: targetRole.id } : iss))
                    );
                  }}
                  onCapturePageAsContext={(page, targetRoleId) => {
                    const targetRole = bundle.roles.find((r) => r.id === targetRoleId);
                    if (!targetRole) return;
                    if (targetRole.privacyLevel === 'private_personal') {
                      setStatusBanner('Privacy Boundary: Private personal/family hats cannot mix directly with shared Confluence pages. Select a Workplace Hat.');
                      return;
                    }
                    const safeUrl = /^https?:\/\//i.test(page.url || '') ? page.url : undefined;
                    handleAddCapture({
                      roleId: targetRole.id,
                      title: page.title,
                      content: page.excerpt || `Confluence Space ${page.spaceKey}`,
                      category: page.isMeetingNote ? 'meeting_note' : 'reminder',
                      commitmentStatus: 'important',
                      priority: 'medium',
                      confluencePageId: page.id,
                      confluencePageUrl: safeUrl,
                      privacyLevel: targetRole.privacyLevel,
                      storageLocation: 'atlassian_linked',
                      sourceReference: `Confluence ${page.spaceKey} (${page.id})`,
                      capturedVia: 'atlassian_sync',
                    });
                    setConfluencePages((prev) =>
                      prev.map((pg) => (pg.id === page.id ? { ...pg, linkedRoleId: targetRole.id } : pg))
                    );
                  }}
                  onRecordDecisionFromPage={(page, targetRoleId) => {
                    const targetRole = bundle.roles.find((r) => r.id === targetRoleId);
                    if (!targetRole) return;
                    if (targetRole.privacyLevel === 'private_personal') {
                      setStatusBanner('Privacy Boundary: Select a Workplace Hat to link a shared Confluence decision.');
                      return;
                    }
                    const safeUrl = /^https?:\/\//i.test(page.url || '') ? page.url : undefined;
                    handleSaveDecision({
                      roleId: targetRole.id,
                      title: page.title,
                      decision: `Decision captured from Confluence page "${page.title}".`,
                      reasoning: page.excerpt || `Linked from Confluence space ${page.spaceKey}.`,
                      decisionDate: page.lastUpdated.slice(0, 10) || new Date().toISOString().slice(0, 10),
                      responsiblePerson: page.author || 'Workspace Team',
                      source: `Confluence (${page.spaceKey})`,
                      supportingDocument: page.title,
                      supportingUrl: safeUrl,
                      confluencePageId: page.id,
                      status: 'confirmed',
                      privacyLevel: targetRole.privacyLevel,
                    });
                    setConfluencePages((prev) =>
                      prev.map((pg) => (pg.id === page.id ? { ...pg, linkedRoleId: targetRole.id } : pg))
                    );
                    setStatusBanner(`Recorded Decision Memory entry sourced from Confluence "${page.title}".`);
                  }}
                  onCreateJiraIssueConfirmed={handleCreateJiraConfirmed}
                />
              )}

              {section === 'ai-assistant' && (
                <HatBridgeAiAssistantSection
                  roles={bundle.roles}
                  activeRoleId={bundle.activeRoleId}
                  preferences={bundle.preferences}
                  aiLoading={aiLoading}
                  lastResponse={aiResponse}
                  onGrantAiConsent={(granted) => handleUpdatePreferences({ aiConsentGranted: granted })}
                  onRunPrompt={async (prompt) => {
                    const res = await callServerAi('assistant_query', prompt);
                    if (res) {
                      setAiResponse(res);
                      const next = appendAudit(
                        bundle,
                        'AI_QUERY_EXECUTED',
                        'hatbridge_ai',
                        currentRole?.id || 'workspace',
                        currentRole?.privacyLevel || 'work_team',
                        `Executed grounded Gemini query (${prompt.slice(0, 60)})`
                      );
                      setBundle(next);
                    } else if (aiNotice) {
                      setAiResponse({
                        observedFacts: [],
                        sourceReferences: [],
                        userConfirmedDecisions: [],
                        aiSuggestions: ['Verify GEMINI_API_KEY configuration on the server or use Re-entry Brief / Decision Memory local search.'],
                        missingInformation: ['Server-side Gemini response unavailable.'],
                        proposedNextAction: 'Use "Rebuild from Records" in Re-entry Brief for deterministic zero-API continuity.',
                        generatedBy: 'error',
                        errorMessage: aiNotice,
                      });
                    }
                  }}
                />
              )}

              {section === 'settings-privacy' && (
                <HatBridgeSettingsPrivacySection
                  preferences={bundle.preferences}
                  analytics={analyticsSnapshot}
                  auditEvents={bundle.auditEvents}
                  authDisplayLabel={currentUser?.email || currentUser?.displayName || 'Guest (Browser Sandbox)'}
                  storageBackend={storageBackend}
                  onUpdatePreferences={handleUpdatePreferences}
                  onExportJson={() => {
                    const jsonStr = HatBridgeStorageService.exportWorkspaceJson(bundle);
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `hatbridge-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    setBundle(appendAudit(bundle, 'DATA_EXPORTED', 'workspace', effectiveUserId, 'private_personal', 'Exported complete HatBridge JSON backup'));
                  }}
                  onDeleteAllData={() => {
                    void HatBridgeStorageService.deleteAllUserHatBridgeData(effectiveUserId).then(() => {
                      setBundle(createEmptyWorkspace(effectiveUserId));
                      setJiraIssues([]);
                      setConfluencePages([]);
                      setActiveBrief(null);
                      setSection('my-hats');
                      setStatusBanner('All HatBridge records have been permanently deleted from your vault.');
                    });
                  }}
                  onRecordBurdenCheckIn={(score) => {
                    setBundle((prev) => {
                      const updated = {
                        ...prev,
                        analytics: { ...prev.analytics, contextSwitchingBurdenCheckIn: score },
                      };
                      HatBridgeStorageService.saveLocalSnapshot(effectiveUserId, updated);
                      return updated;
                    });
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Quick Capture Modal */}
      {quickCaptureOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const targetRoleId = qcRoleId || currentRole?.id || activeRoles[0]?.id;
              if (!targetRoleId || (!qcTitle.trim() && !qcNote.trim())) return;
              const targetRole = bundle.roles.find((r) => r.id === targetRoleId);
              handleAddCapture({
                roleId: targetRoleId,
                title: qcTitle.trim() || qcNote.trim().slice(0, 72),
                content: qcNote.trim() || qcTitle.trim(),
                category: 'task',
                commitmentStatus: 'important',
                priority: 'medium',
                privacyLevel: targetRole?.privacyLevel || 'work_team',
                storageLocation: storageBackend === 'firestore_cloud' ? 'firestore_user_vault' : 'browser_sandbox',
                capturedVia: 'quick_capture',
              });
              setQcTitle('');
              setQcNote('');
              setQuickCaptureOpen(false);
            }}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Quick Context Capture</h3>
              <button
                type="button"
                onClick={() => setQuickCaptureOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <select
              value={qcRoleId || currentRole?.id || ''}
              onChange={(e) => setQcRoleId(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-slate-300 bg-white text-sm"
            >
              {activeRoles.length === 0 && <option value="">Create a hat in My Hats first...</option>}
              {activeRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({formatPrivacyLabel(r.privacyLevel)})
                </option>
              ))}
            </select>

            <input
              type="text"
              autoFocus
              value={qcTitle}
              onChange={(e) => setQcTitle(e.target.value)}
              placeholder="Thought, next step, or follow-up title..."
              className="w-full min-h-[44px] px-3 rounded-xl border border-slate-300 text-sm"
            />

            <textarea
              rows={3}
              value={qcNote}
              onChange={(e) => setQcNote(e.target.value)}
              placeholder="Optional context, decision detail, or who is waiting..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuickCaptureOpen(false)}
                className="min-h-[44px] px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={activeRoles.length === 0 || (!qcTitle.trim() && !qcNote.trim())}
                className="min-h-[44px] px-5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-45 text-white text-xs font-semibold cursor-pointer"
              >
                Save &amp; Keep Context
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
