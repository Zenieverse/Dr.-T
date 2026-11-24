import React, { useState } from 'react';
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Check,
  Edit3,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  HatBridgeColorToken,
  HatBridgePrivacyLevel,
  HatBridgeRole,
} from '../../../types/hatbridgeTypes';
import { HATBRIDGE_STARTER_PACKS } from '../data/hatbridgeStarters';
import { COLOR_STYLES, HATBRIDGE_ICON_OPTIONS, formatPrivacyLabel, renderHatIcon } from '../HatBridgeIcon';

interface Props {
  roles: HatBridgeRole[];
  activeRoleId: string;
  onSelectRole: (roleId: string) => void;
  onCreateRole: (draft: Omit<HatBridgeRole, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateRole: (role: HatBridgeRole) => void;
  onReorderRole: (roleId: string, direction: 'up' | 'down') => void;
  onToggleArchive: (roleId: string) => void;
  onAddStarterPack: (pack: 'clinical_academic' | 'general_professional') => void;
  onLoadSampleWorkflow: () => void;
  onOpenReentryBrief: (roleId: string) => void;
}

export const HatBridgeRolesSection: React.FC<Props> = ({
  roles,
  activeRoleId,
  onSelectRole,
  onCreateRole,
  onUpdateRole,
  onReorderRole,
  onToggleArchive,
  onAddStarterPack,
  onLoadSampleWorkflow,
  onOpenReentryBrief,
}) => {
  const [showArchived, setShowArchived] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIcon, setFormIcon] = useState<string>('Briefcase');
  const [formColor, setFormColor] = useState<HatBridgeColorToken>('teal');
  const [formPrivacy, setFormPrivacy] = useState<HatBridgePrivacyLevel>('work_team');
  const [formGoals, setFormGoals] = useState('');
  const [formPriorities, setFormPriorities] = useState('');
  const [formProjects, setFormProjects] = useState('');
  const [formContacts, setFormContacts] = useState('');
  const [formAiContext, setFormAiContext] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormIcon('Briefcase');
    setFormColor('teal');
    setFormPrivacy('work_team');
    setFormGoals('');
    setFormPriorities('');
    setFormProjects('');
    setFormContacts('');
    setFormAiContext('');
    setIsCreating(false);
    setEditingRoleId(null);
  };

  const startEdit = (role: HatBridgeRole) => {
    setEditingRoleId(role.id);
    setIsCreating(false);
    setFormName(role.name);
    setFormDescription(role.description);
    setFormIcon(role.icon);
    setFormColor(role.color);
    setFormPrivacy(role.privacyLevel);
    setFormGoals(role.goals.join('\n'));
    setFormPriorities(role.currentPriorities.join('\n'));
    setFormProjects(role.activeProjects.join(', '));
    setFormContacts(role.relevantContacts.map((c) => `${c.name}${c.relationOrRole ? ` (${c.relationOrRole})` : ''}`).join('\n'));
    setFormAiContext(role.preferredAiContext);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const splitLines = (v: string) =>
      v
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    const parsedContacts = splitLines(formContacts).map((line) => {
      const m = line.match(/^(.+?)\s*\((.+?)\)$/);
      return m ? { name: m[1].trim(), relationOrRole: m[2].trim() } : { name: line, relationOrRole: 'Contact' };
    });

    if (editingRoleId) {
      const existing = roles.find((r) => r.id === editingRoleId);
      if (existing) {
        onUpdateRole({
          ...existing,
          name: formName.trim(),
          description: formDescription.trim(),
          icon: formIcon,
          color: formColor,
          privacyLevel: formPrivacy,
          goals: splitLines(formGoals),
          currentPriorities: splitLines(formPriorities),
          activeProjects: formProjects.split(',').map((s) => s.trim()).filter(Boolean),
          relevantContacts: parsedContacts,
          preferredAiContext: formAiContext.trim(),
        });
      }
      resetForm();
      return;
    }

    onCreateRole({
      name: formName.trim(),
      description: formDescription.trim() || 'Custom life or work responsibility.',
      icon: formIcon,
      color: formColor,
      goals: splitLines(formGoals),
      currentPriorities: splitLines(formPriorities),
      relatedTasks: [],
      relatedDocuments: [],
      relevantContacts: parsedContacts,
      activeProjects: formProjects.split(',').map((s) => s.trim()).filter(Boolean),
      recentDecisions: [],
      unfinishedWork: [],
      preferredAiContext: formAiContext.trim() || 'Grounded context for this role only.',
      privacyLevel: formPrivacy,
      archived: false,
      sortOrder: roles.length,
    });
    resetForm();
  };

  const visibleRoles = roles
    .filter((r) => (showArchived ? r.archived : !r.archived))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">My Hats — Role Contexts</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Switch between professional and personal hats without losing where you left off. Previous role state remains preserved.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowArchived((v) => !v)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            {showArchived ? `Active Hats (${roles.filter((r) => !r.archived).length})` : `Archived (${roles.filter((r) => r.archived).length})`}
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsCreating(true);
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Custom Hat</span>
          </button>
        </div>
      </div>

      {/* Onboarding / Starter Selection */}
      {roles.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Start with the roles that match your life and work</h3>
            <p className="text-sm text-slate-600 mt-1">
              Adopt Dr. T&apos;s suggested clinical-academic hats, pick a general leadership pack, explore a sample workflow, or build your own hats from scratch.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => onAddStarterPack('clinical_academic')}
              className="min-h-[44px] text-left p-4 rounded-xl border border-slate-200 hover:border-teal-600 hover:bg-teal-50/40 transition cursor-pointer"
            >
              <div className="text-sm font-bold text-slate-900">Clinical & Academic Pack (10 Hats)</div>
              <p className="text-xs text-slate-600 mt-1">
                Hospital, Clinic, University / Dean, Family roles, Congress, Research, Learning &amp; Personal Wellbeing.
              </p>
            </button>
            <button
              type="button"
              onClick={() => onAddStarterPack('general_professional')}
              className="min-h-[44px] text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/40 transition cursor-pointer"
            >
              <div className="text-sm font-bold text-slate-900">General Executive &amp; Consulting Pack</div>
              <p className="text-xs text-slate-600 mt-1">
                Product &amp; Engineering Lead, Client Advisory, Operations &amp; Governance, Home Sanctuary.
              </p>
            </button>
            <button
              type="button"
              onClick={onLoadSampleWorkflow}
              className="min-h-[44px] text-left p-4 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="text-sm font-bold text-slate-900 inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Load Guided Sample Workflow</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Populates realistic Dean, Clinic, Hospital &amp; Family items, decisions, handoff &amp; schedule conflict (explicitly marked Sample).
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Role Form */}
      {(isCreating || editingRoleId) && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-300 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {editingRoleId ? 'Edit Hat Context' : 'Create Custom Hat'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="min-h-[44px] px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-700">Hat Name *</span>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Pediatric Clinic Lead or Family Caregiver"
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-700">Privacy Boundary</span>
              <select
                value={formPrivacy}
                onChange={(e) => setFormPrivacy(e.target.value as HatBridgePrivacyLevel)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="work_team">Workplace Team (Jira / Confluence eligible)</option>
                <option value="work_restricted">Restricted Workplace (local + explicit approval only)</option>
                <option value="private_personal">Private Personal Vault (never sent to Atlassian)</option>
              </select>
            </label>
          </div>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Description &amp; Scope</span>
            <input
              type="text"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Core responsibilities and boundaries for this hat"
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">Icon</span>
              <div className="flex flex-wrap gap-1.5">
                {HATBRIDGE_ICON_OPTIONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setFormIcon(ic)}
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border transition cursor-pointer ${
                      formIcon === ic
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                    title={ic}
                  >
                    {renderHatIcon(ic, 'w-4 h-4')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">Visual Accent</span>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(COLOR_STYLES) as HatBridgeColorToken[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormColor(c)}
                    className={`min-h-[44px] px-3 rounded-xl border text-xs font-semibold capitalize cursor-pointer ${
                      formColor === c
                        ? `${COLOR_STYLES[c].softBg} ${COLOR_STYLES[c].border} ${COLOR_STYLES[c].text} ring-2 ring-slate-900/20`
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-700">Current Priorities (one per line)</span>
              <textarea
                rows={3}
                value={formPriorities}
                onChange={(e) => setFormPriorities(e.target.value)}
                placeholder="Curriculum vote&#10;Lab staffing options"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-700">Goals &amp; Preferred AI Context (one goal per line)</span>
              <textarea
                rows={3}
                value={formGoals}
                onChange={(e) => setFormGoals(e.target.value)}
                placeholder="Preserve uninterrupted evening transition"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-700">Active Projects (comma separated)</span>
              <input
                type="text"
                value={formProjects}
                onChange={(e) => setFormProjects(e.target.value)}
                placeholder="Q3 Simulation Lab, Ward Checklist"
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-700">Key Contacts (one per line, Name (Role))</span>
              <input
                type="text"
                value={formContacts}
                onChange={(e) => setFormContacts(e.target.value)}
                placeholder="Prof. Elena Vance (Vice Dean)"
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </label>
          </div>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Preferred AI Context Instructions</span>
            <input
              type="text"
              value={formAiContext}
              onChange={(e) => setFormAiContext(e.target.value)}
              placeholder="Focus on operational coordination; keep private family notes out."
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingRoleId ? 'Save Hat Changes' : 'Create Hat'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Role Cards Grid (iPad 2-col, Desktop 2/3-col) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleRoles.map((role, idx) => {
          const isActive = role.id === activeRoleId;
          const style = COLOR_STYLES[role.color] || COLOR_STYLES.slate;

          return (
            <div
              key={role.id}
              className={`rounded-2xl border p-5 bg-white transition ${
                isActive ? 'border-slate-900 ring-1 ring-slate-900/15' : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${style.softBg} ${style.border} ${style.text}`}>
                    {renderHatIcon(role.icon, 'w-5 h-5')}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{role.name}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {formatPrivacyLabel(role.privacyLevel)}
                      {isActive ? ' · Currently Active' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onReorderRole(role.id, 'up')}
                    disabled={idx === 0}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onReorderRole(role.id, 'down')}
                    disabled={idx === visibleRoles.length - 1}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{role.description}</p>

              {/* Clean typographic metadata (no pill soup) */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div>
                  <span className="font-semibold text-slate-500">Priorities: </span>
                  {role.currentPriorities.length > 0 ? role.currentPriorities.join(' · ') : 'None logged yet'}
                </div>
                {role.activeProjects.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-500">Active Projects: </span>
                    {role.activeProjects.join(' · ')}
                  </div>
                )}
                {role.relevantContacts.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-500">Contacts: </span>
                    {role.relevantContacts.map((c) => c.name).join(', ')}
                  </div>
                )}
                <div className="text-slate-500">
                  <span className="font-semibold">AI Context Scope: </span>
                  {role.preferredAiContext || 'Default role context'}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {!role.archived && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectRole(role.id);
                        onOpenReentryBrief(role.id);
                      }}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-teal-700 text-white hover:bg-teal-800'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isActive ? 'Open Re-entry Brief' : 'Switch & Resume'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(role)}
                    className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleArchive(role.id)}
                  className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {role.archived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                  <span>{role.archived ? 'Restore' : 'Archive'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add individual suggested hats if some hats already exist */}
      {roles.length > 0 && roles.length < HATBRIDGE_STARTER_PACKS.length && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick-Add Starter Packs</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Append any missing hats without overwriting your existing custom roles.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onAddStarterPack('clinical_academic')}
                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                + Clinical / Academic Starters
              </button>
              <button
                type="button"
                onClick={() => onAddStarterPack('general_professional')}
                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                + Consulting / Executive Starters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
