import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Database,
  Edit3,
  ExternalLink,
  History,
  Mic,
  MicOff,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  HatBridgeCaptureCategory,
  HatBridgeCommitmentStatus,
  HatBridgeContextItem,
  HatBridgeDecision,
  HatBridgeDecisionStatus,
  HatBridgeHandoff,
  HatBridgePrivacyLevel,
  HatBridgeRole,
  HatBridgeStructuredAiResponse,
} from '../../../types/hatbridgeTypes';
import { formatPrivacyLabel } from '../HatBridgeIcon';
import { answerDecisionMemoryQuestion, buildDraftHandoffFromRole } from '../utils/hatbridgeEngine';

// ============================================================================
// SECTION 4: CONTEXT CAPTURE (Rapid text + optional browser voice + optional fields)
// ============================================================================
interface CaptureSectionProps {
  roles: HatBridgeRole[];
  activeRoleId: string;
  contextItems: HatBridgeContextItem[];
  storageBackend: 'firestore_cloud' | 'browser_local';
  onAddCapture: (item: Omit<HatBridgeContextItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteCapture: (id: string) => void;
  onCreateJiraFromCapture?: (item: HatBridgeContextItem) => void;
  atlassianConnected: boolean;
}

export const HatBridgeContextCaptureSection: React.FC<CaptureSectionProps> = ({
  roles,
  activeRoleId,
  contextItems,
  storageBackend,
  onAddCapture,
  onDeleteCapture,
  onCreateJiraFromCapture,
  atlassianConnected,
}) => {
  const activeRoles = roles.filter((r) => !r.archived);
  const defaultRole = activeRoles.find((r) => r.id === activeRoleId) || activeRoles[0];

  const [roleId, setRoleId] = useState(defaultRole?.id || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<HatBridgeCaptureCategory>('task');
  const [commitmentStatus, setCommitmentStatus] = useState<HatBridgeCommitmentStatus>('important');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showOptional, setShowOptional] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [relatedProject, setRelatedProject] = useState('');
  const [jiraIssueKey, setJiraIssueKey] = useState('');
  const [confluencePageId, setConfluencePageId] = useState('');
  const [waitingOnPerson, setWaitingOnPerson] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<HatBridgePrivacyLevel>(defaultRole?.privacyLevel || 'work_team');
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const roleMap = new Map(roles.map((r) => [r.id, r]));

  const handleRoleChange = (nextRoleId: string) => {
    setRoleId(nextRoleId);
    const chosen = roles.find((r) => r.id === nextRoleId);
    if (chosen) setPrivacyLevel(chosen.privacyLevel);
  };

  const supportsVoice =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const toggleVoiceCapture = () => {
    if (!supportsVoice) {
      setVoiceMessage('Browser voice input (Web Speech API) is unavailable in this browser.');
      return;
    }
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);
    setVoiceMessage('Listening for quick voice note...');

    recognition.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || '';
      if (transcript) {
        if (!title.trim()) {
          setTitle(transcript.slice(0, 90));
        }
        setContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
      setIsListening(false);
      setVoiceMessage('Voice note captured into draft fields.');
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceMessage('Voice input stopped or microphone permission declined.');
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveRoleId = roleId || defaultRole?.id;
    if (!effectiveRoleId || (!title.trim() && !content.trim())) return;

    onAddCapture({
      roleId: effectiveRoleId,
      title: title.trim() || content.trim().slice(0, 72),
      content: content.trim() || title.trim(),
      category,
      commitmentStatus,
      priority,
      dueDate: dueDate || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      relatedProject: relatedProject.trim() || undefined,
      jiraIssueKey: jiraIssueKey.trim() || undefined,
      confluencePageId: confluencePageId.trim() || undefined,
      waitingOnPerson: waitingOnPerson.trim() || undefined,
      privacyLevel,
      storageLocation: storageBackend === 'firestore_cloud' ? 'firestore_user_vault' : 'browser_sandbox',
      capturedVia: voiceMessage?.includes('captured') ? 'voice' : 'text',
    });

    setTitle('');
    setContent('');
    setDueDate('');
    setStartTime('');
    setEndTime('');
    setRelatedProject('');
    setJiraIssueKey('');
    setConfluencePageId('');
    setWaitingOnPerson('');
    setVoiceMessage(null);
  };

  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return contextItems
      .filter((item) => {
        if (!q) return true;
        const rName = roleMap.get(item.roleId)?.name || '';
        return `${item.title} ${item.content} ${item.jiraIssueKey || ''} ${item.confluencePageId || ''} ${rName}`
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [contextItems, searchTerm, roles]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">Context Capture</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Capture a thought, follow-up, or meeting note in seconds before switching hats.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-600 flex items-center gap-2 shrink-0">
          <Database className="w-4 h-4 text-teal-700" />
          <span>
            Storage: {storageBackend === 'firestore_cloud' ? 'Owner-Isolated Firestore Vault' : 'Local Browser Vault (Sign in for Cloud Sync)'}
          </span>
        </div>
      </div>

      {/* Rapid Capture Form */}
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Hat *</span>
            <select
              required
              value={roleId || defaultRole?.id || ''}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
            >
              {activeRoles.length === 0 && <option value="">Create a hat first...</option>}
              {activeRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as HatBridgeCaptureCategory)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
            >
              <option value="task">Quick Task</option>
              <option value="decision">Decision Note</option>
              <option value="follow_up">Follow-up</option>
              <option value="meeting_note">Meeting Note</option>
              <option value="reminder">Personal Reminder</option>
              <option value="commitment">Scheduled Commitment</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Status</span>
            <select
              value={commitmentStatus}
              onChange={(e) => setCommitmentStatus(e.target.value as HatBridgeCommitmentStatus)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm"
            >
              <option value="urgent">Urgent</option>
              <option value="important">Important</option>
              <option value="scheduled">Scheduled</option>
              <option value="waiting">Waiting</option>
              <option value="deferred">Deferred</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short title (or leave blank to auto-derive from note)"
            className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleVoiceCapture}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                isListening
                  ? 'border-rose-300 bg-rose-50 text-rose-800'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
              title={supportsVoice ? 'Capture via browser speech recognition' : 'Voice capture unavailable in this browser'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? 'Listening...' : supportsVoice ? 'Voice Note' : 'Voice Unsupported'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowOptional((v) => !v)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              {showOptional ? 'Hide Details' : 'Optional Links & Timing'}
            </button>
          </div>
        </div>

        <textarea
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What happened, what remains open, or what did you just decide?"
          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
        />

        {voiceMessage && <p className="text-xs text-slate-600">{voiceMessage}</p>}

        {showOptional && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full min-h-[44px] px-2.5 rounded-xl border border-slate-300 bg-white text-xs"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600">Due Date</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full min-h-[44px] px-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600">Start Time</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full min-h-[44px] px-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600">End Time</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full min-h-[44px] px-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </label>
            <input
              type="text"
              value={relatedProject}
              onChange={(e) => setRelatedProject(e.target.value)}
              placeholder="Related Project"
              className="min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs"
            />
            <input
              type="text"
              value={jiraIssueKey}
              onChange={(e) => setJiraIssueKey(e.target.value)}
              placeholder="Jira Issue Key (e.g. HB-104)"
              className="min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs"
            />
            <input
              type="text"
              value={confluencePageId}
              onChange={(e) => setConfluencePageId(e.target.value)}
              placeholder="Confluence Page ID"
              className="min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs"
            />
            <input
              type="text"
              value={waitingOnPerson}
              onChange={(e) => setWaitingOnPerson(e.target.value)}
              placeholder="Waiting on person"
              className="min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold">Privacy:</span>
            <select
              value={privacyLevel}
              onChange={(e) => setPrivacyLevel(e.target.value as HatBridgePrivacyLevel)}
              className="min-h-[44px] px-2.5 rounded-xl border border-slate-300 bg-white text-xs"
            >
              <option value="work_team">Workplace Team</option>
              <option value="work_restricted">Restricted Workplace</option>
              <option value="private_personal">Private Personal Vault</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={activeRoles.length === 0 || (!title.trim() && !content.trim())}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Save Capture</span>
          </button>
        </div>
      </form>

      {/* Captured Items Feed with Storage Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">Saved Captures ({filteredItems.length})</h3>
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search captures..."
              className="w-full min-h-[44px] pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No captured items match your current filter.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  <p className="text-xs text-slate-600">{item.content}</p>
                  <div className="text-[11px] font-mono tabular-nums text-slate-500">
                    {roleMap.get(item.roleId)?.name || 'Unassigned'} · {item.category} · {formatPrivacyLabel(item.privacyLevel)} · Stored: {item.storageLocation === 'firestore_user_vault' ? 'Firestore Vault' : item.storageLocation === 'atlassian_linked' ? 'Atlassian Linked' : 'Browser Vault'}
                    {item.jiraIssueKey ? ` · Jira ${item.jiraIssueKey}` : ''}
                    {item.confluencePageId ? ` · Confluence ${item.confluencePageId}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {onCreateJiraFromCapture && item.privacyLevel !== 'private_personal' && atlassianConnected && !item.jiraIssueKey && (
                    <button
                      type="button"
                      onClick={() => onCreateJiraFromCapture(item)}
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      Create Jira Task
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteCapture(item.id)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                    title="Delete capture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SECTION 5: DECISION MEMORY (Structured records + Revisions + Grounded Q&A)
// ============================================================================
interface DecisionMemoryProps {
  roles: HatBridgeRole[];
  decisions: HatBridgeDecision[];
  allowPrivatePersonalInAi: boolean;
  onSaveDecision: (decision: Omit<HatBridgeDecision, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'revisions'>) => void;
  onUpdateDecision: (decision: HatBridgeDecision, revisionSummary: string) => void;
  onDeleteDecision: (id: string) => void;
}

export const HatBridgeDecisionMemorySection: React.FC<DecisionMemoryProps> = ({
  roles,
  decisions,
  allowPrivatePersonalInAi,
  onSaveDecision,
  onUpdateDecision,
  onDeleteDecision,
}) => {
  const activeRoles = roles.filter((r) => !r.archived);
  const roleMap = new Map(roles.map((r) => [r.id, r]));

  const [searchQuery, setSearchQuery] = useState('');
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaResult, setQaResult] = useState<HatBridgeStructuredAiResponse | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [title, setTitle] = useState('');
  const [decisionText, setDecisionText] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [roleId, setRoleId] = useState(activeRoles[0]?.id || '');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [source, setSource] = useState('');
  const [supportingDoc, setSupportingDoc] = useState('');
  const [confluencePageId, setConfluencePageId] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [status, setStatus] = useState<HatBridgeDecisionStatus>('confirmed');
  const [privacyLevel, setPrivacyLevel] = useState<HatBridgePrivacyLevel>('work_team');

  const filteredDecisions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return decisions
      .filter((d) => {
        if (!q) return true;
        return `${d.title} ${d.decision} ${d.reasoning} ${d.responsiblePerson} ${d.supportingDocument || ''} ${roleMap.get(d.roleId)?.name || ''}`
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => b.decisionDate.localeCompare(a.decisionDate));
  }, [decisions, searchQuery, roles]);

  const handleAsk = (questionOverride?: string) => {
    const q = (questionOverride ?? qaQuestion).trim();
    if (!q) return;
    setQaQuestion(q);
    const res = answerDecisionMemoryQuestion({
      question: q,
      decisions,
      roles,
      allowPrivatePersonal: allowPrivatePersonalInAi,
    });
    setQaResult(res);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveRoleId = roleId || activeRoles[0]?.id;
    if (!effectiveRoleId || !title.trim() || !decisionText.trim()) return;
    onSaveDecision({
      roleId: effectiveRoleId,
      title: title.trim(),
      decision: decisionText.trim(),
      reasoning: reasoning.trim() || 'Reasoning documented by workspace owner.',
      decisionDate: new Date().toISOString().slice(0, 10),
      responsiblePerson: responsiblePerson.trim() || 'Workspace Owner',
      source: source.trim() || 'Direct HatBridge Decision Entry',
      supportingDocument: supportingDoc.trim() || undefined,
      confluencePageId: confluencePageId.trim() || undefined,
      followUpDate: followUpDate || undefined,
      status,
      privacyLevel,
    });
    setTitle('');
    setDecisionText('');
    setReasoning('');
    setSource('');
    setSupportingDoc('');
    setConfluencePageId('');
    setFollowUpDate('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">Decision Memory</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Preserve what was decided, why it was chosen, who owns it, and which Confluence page supports it.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Record Decision'}</span>
        </button>
      </div>

      {/* Cited Decision Q&A Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Ask Decision Memory (Strictly Cited to Saved &amp; Connected Records)
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={qaQuestion}
            onChange={(e) => setQaQuestion(e.target.value)}
            placeholder='e.g. "Why did I choose Option B?" or "Which decision is still waiting for approval?"'
            className="flex-1 min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm"
          />
          <button
            type="button"
            onClick={() => handleAsk()}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
          >
            Search &amp; Cite
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            'Why did I choose this option?',
            'Which decision is still waiting for approval?',
            'Show me the latest decision related to budget',
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleAsk(preset)}
              className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {qaResult && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs">
            <div className="font-bold text-slate-900">Observed Facts &amp; Reasoning</div>
            <ul className="space-y-1 text-slate-700">
              {qaResult.observedFacts.map((f, idx) => (
                <li key={idx}>• {f}</li>
              ))}
            </ul>
            {qaResult.sourceReferences.length > 0 && (
              <div className="pt-1">
                <span className="font-semibold text-slate-700">Sources: </span>
                {qaResult.sourceReferences.map((s) => `${s.label} (${s.id || s.type})`).join(' · ')}
              </div>
            )}
            {qaResult.missingInformation.length > 0 && (
              <div className="text-amber-800 pt-1">
                <span className="font-semibold">Missing Evidence: </span>
                {qaResult.missingInformation.join(' ')}
              </div>
            )}
            <div className="text-teal-800 pt-1">
              <span className="font-semibold">Next Action: </span>
              {qaResult.proposedNextAction}
            </div>
          </div>
        )}
      </div>

      {/* Add Decision Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-slate-300 bg-white p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Decision Title *"
              className="md:col-span-2 min-h-[44px] px-3 rounded-xl border border-slate-300 text-sm"
            />
            <select
              value={roleId || activeRoles[0]?.id || ''}
              onChange={(e) => setRoleId(e.target.value)}
              className="min-h-[44px] px-3 rounded-xl border border-slate-300 bg-white text-sm"
            >
              {activeRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <textarea
            required
            rows={2}
            value={decisionText}
            onChange={(e) => setDecisionText(e.target.value)}
            placeholder="Decision statement *"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
          />
          <textarea
            rows={2}
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            placeholder="Why this option was chosen (tradeoffs, evidence, constraints)"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={responsiblePerson}
              onChange={(e) => setResponsiblePerson(e.target.value)}
              placeholder="Responsible person"
              className="min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs"
            />
            <input
              type="text"
              value={supportingDoc}
              onChange={(e) => setSupportingDoc(e.target.value)}
              placeholder="Supporting document / Confluence title"
              className="min-h-[44px] px-3 rounded-xl border border-slate-300 text-xs"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as HatBridgeDecisionStatus)}
              className="min-h-[44px] px-3 rounded-xl border border-slate-300 bg-white text-xs"
            >
              <option value="confirmed">Confirmed</option>
              <option value="waiting_approval">Waiting for Approval</option>
              <option value="proposed">Proposed</option>
            </select>
            <select
              value={privacyLevel}
              onChange={(e) => setPrivacyLevel(e.target.value as HatBridgePrivacyLevel)}
              className="min-h-[44px] px-3 rounded-xl border border-slate-300 bg-white text-xs"
            >
              <option value="work_team">Workplace Team</option>
              <option value="work_restricted">Restricted Workplace</option>
              <option value="private_personal">Private Personal</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
            >
              Save Decision Record
            </button>
          </div>
        </form>
      )}

      {/* Search Bar & Decision Cards */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter decisions by title, reasoning, role, or source..."
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm"
          />
        </div>

        {filteredDecisions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
            No saved decision records match your filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDecisions.map((d) => (
              <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{d.title}</h3>
                    <div className="text-xs font-mono tabular-nums text-slate-500 mt-0.5">
                      {roleMap.get(d.roleId)?.name || 'Unknown Role'} · {d.decisionDate} · Status: {d.status.replace('_', ' ').toUpperCase()} · {formatPrivacyLabel(d.privacyLevel)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {d.status !== 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => onUpdateDecision({ ...d, status: 'confirmed' }, 'Confirmed decision in Decision Memory')}
                        className="min-h-[44px] px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Confirmed</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteDecision(d.id)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                      title="Delete decision"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-900">{d.decision}</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700">Reasoning: </span>
                  {d.reasoning}
                </p>

                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Owner: {d.responsiblePerson}</span>
                  <span>Source: {d.source}</span>
                  {d.supportingDocument && <span>Doc: {d.supportingDocument}</span>}
                  {d.followUpDate && <span className="font-mono">Follow-up: {d.followUpDate}</span>}
                  <span className="inline-flex items-center gap-1">
                    <History className="w-3 h-3" />
                    Revisions: {d.revisions.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SECTION 6: HANDOFFS & ROLE TRANSITIONS (Finish -> Save -> Switch)
// ============================================================================
interface HandoffsProps {
  roles: HatBridgeRole[];
  activeRoleId: string;
  contextItems: HatBridgeContextItem[];
  decisions: HatBridgeDecision[];
  handoffs: HatBridgeHandoff[];
  onSaveHandoffAndSwitch: (
    handoff: Omit<HatBridgeHandoff, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
    switchToRoleId?: string
  ) => void;
  onDraftHandoffWithAi: (fromRoleId: string) => Promise<Partial<HatBridgeHandoff> | null>;
  aiConsentGranted: boolean;
  aiLoading: boolean;
}

export const HatBridgeHandoffsSection: React.FC<HandoffsProps> = ({
  roles,
  activeRoleId,
  contextItems,
  decisions,
  handoffs,
  onSaveHandoffAndSwitch,
  onDraftHandoffWithAi,
  aiConsentGranted,
  aiLoading,
}) => {
  const activeRoles = roles.filter((r) => !r.archived);
  const roleMap = new Map(roles.map((r) => [r.id, r]));

  const currentRole = activeRoles.find((r) => r.id === activeRoleId) || activeRoles[0];
  const [fromRoleId, setFromRoleId] = useState(currentRole?.id || '');
  const [toRoleId, setToRoleId] = useState(activeRoles.find((r) => r.id !== currentRole?.id)?.id || '');

  const initialDraft = useMemo(() => {
    const r = roles.find((item) => item.id === (fromRoleId || currentRole?.id));
    if (!r) return null;
    return buildDraftHandoffFromRole({
      userId: r.userId,
      fromRole: r,
      toRoleId,
      contextItems,
      decisions,
    });
  }, [fromRoleId, currentRole?.id, toRoleId, roles, contextItems, decisions]);

  const [situation, setSituation] = useState(initialDraft?.currentSituation || '');
  const [completedWork, setCompletedWork] = useState((initialDraft?.completedWork || []).join('\n'));
  const [remainingWork, setRemainingWork] = useState((initialDraft?.remainingWork || []).join('\n'));
  const [nextAction, setNextAction] = useState(initialDraft?.nextAction || '');
  const [dependencies, setDependencies] = useState((initialDraft?.dependencies || []).join('\n'));
  const [returnDate, setReturnDate] = useState(initialDraft?.suggestedReturnDate || '');
  const [aiDraftUsed, setAiDraftUsed] = useState(false);

  const loadFromContext = (targetFromId: string) => {
    setFromRoleId(targetFromId);
    const r = roles.find((item) => item.id === targetFromId);
    if (!r) return;
    const draft = buildDraftHandoffFromRole({
      userId: r.userId,
      fromRole: r,
      toRoleId,
      contextItems,
      decisions,
    });
    setSituation(draft.currentSituation);
    setCompletedWork(draft.completedWork.join('\n'));
    setRemainingWork(draft.remainingWork.join('\n'));
    setNextAction(draft.nextAction);
    setDependencies(draft.dependencies.join('\n'));
    setReturnDate(draft.suggestedReturnDate || '');
    setAiDraftUsed(false);
  };

  const handleAiPrefill = async () => {
    const fid = fromRoleId || currentRole?.id;
    if (!fid) return;
    const res = await onDraftHandoffWithAi(fid);
    if (res) {
      if (res.currentSituation) setSituation(res.currentSituation);
      if (res.nextAction) setNextAction(res.nextAction);
      if (Array.isArray(res.remainingWork) && res.remainingWork.length > 0) {
        setRemainingWork(res.remainingWork.join('\n'));
      }
      setAiDraftUsed(true);
    }
  };

  const submitHandoff = (shouldSwitch: boolean) => {
    const outgoingRole = roles.find((r) => r.id === (fromRoleId || currentRole?.id));
    if (!outgoingRole) return;
    const toList = (val: string) => val.split('\n').map((s) => s.trim()).filter(Boolean);

    onSaveHandoffAndSwitch(
      {
        fromRoleId: outgoingRole.id,
        toRoleId: toRoleId || undefined,
        currentSituation: situation.trim() || `Stepping away from ${outgoingRole.name}.`,
        completedWork: toList(completedWork),
        remainingWork: toList(remainingWork),
        importantDecisions: decisions
          .filter((d) => d.roleId === outgoingRole.id)
          .slice(0, 3)
          .map((d) => d.title),
        outstandingQuestions: [],
        dependencies: toList(dependencies),
        nextAction: nextAction.trim() || `Review ${outgoingRole.name} priorities when resuming.`,
        relevantLinks: initialDraft?.relevantLinks || [],
        suggestedReturnDate: returnDate || undefined,
        privacyLevel: outgoingRole.privacyLevel,
        aiDraftUsed,
        confirmedByUser: true,
      },
      shouldSwitch && toRoleId ? toRoleId : undefined
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">
          Handoffs — Finish Context → Save Handoff → Switch Role
        </h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Leave a lightweight, editable bookmark for your future self before stepping into another hat.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">1. Finishing Context (Outgoing Hat)</span>
            <select
              value={fromRoleId || currentRole?.id || ''}
              onChange={(e) => loadFromContext(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-slate-300 bg-white text-sm"
            >
              {activeRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">3. Target Hat to Switch Into (Optional)</span>
            <select
              value={toRoleId}
              onChange={(e) => setToRoleId(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-slate-300 bg-white text-sm"
            >
              <option value="">Stay in current view after saving</option>
              {activeRoles
                .filter((r) => r.id !== (fromRoleId || currentRole?.id))
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadFromContext(fromRoleId || currentRole?.id || '')}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            Auto-fill from Saved Captures
          </button>
          <button
            type="button"
            disabled={!aiConsentGranted || aiLoading}
            onClick={handleAiPrefill}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-45 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiLoading ? 'Drafting...' : 'AI Draft Handoff (Review Required)'}</span>
          </button>
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-semibold text-slate-700">Current Situation</span>
          <textarea
            rows={2}
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Remaining Work (one per line)</span>
            <textarea
              rows={3}
              value={remainingWork}
              onChange={(e) => setRemainingWork(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Completed / Dependencies (one per line)</span>
            <textarea
              rows={3}
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              placeholder="Who or what are you waiting on?"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="md:col-span-2 block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Next Action When Returning</span>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-slate-300 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-slate-700">Suggested Return Date</span>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-slate-300 text-sm"
            />
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => submitHandoff(false)}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer"
          >
            Save Handoff Only
          </button>
          <button
            type="button"
            disabled={!toRoleId}
            onClick={() => submitHandoff(true)}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-45 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Save Handoff &amp; Switch Role</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Saved Handoffs History */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Saved Handoffs ({handoffs.length})</h3>
        {handoffs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
            No saved role handoffs yet. Save one above before switching between hats.
          </div>
        ) : (
          <div className="space-y-3">
            {handoffs.map((h) => (
              <div key={h.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1.5">
                <div className="text-xs font-mono tabular-nums text-slate-500">
                  From {roleMap.get(h.fromRoleId)?.name || h.fromRoleId}
                  {h.toRoleId ? ` → ${roleMap.get(h.toRoleId)?.name || h.toRoleId}` : ''} · {h.createdAt.slice(0, 16).replace('T', ' ')}
                  {h.suggestedReturnDate ? ` · Return ${h.suggestedReturnDate}` : ''}
                </div>
                <div className="text-sm font-semibold text-slate-900">{h.currentSituation}</div>
                <div className="text-xs text-teal-800">
                  <span className="font-semibold">Next Action: </span>
                  {h.nextAction}
                </div>
                {h.relevantLinks.length > 0 && (
                  <div className="text-xs text-slate-500 flex flex-wrap gap-3 pt-1">
                    {h.relevantLinks.map((l, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1">
                        {l.label}
                        {l.url && <ExternalLink className="w-3 h-3" />}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
