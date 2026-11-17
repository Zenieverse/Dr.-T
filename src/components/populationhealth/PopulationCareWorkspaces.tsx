import React, { useState } from 'react';
import {
  PopulationHealthDashboardPayload,
  PopulationWorkspaceId,
  CareNavigationStage,
  CareReferralItem,
} from '../../types/populationHealth';
import {
  BookOpen,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Globe,
  Navigation,
  Shield,
  Volume2,
} from 'lucide-react';

export interface CareWorkspacesProps {
  workspace: PopulationWorkspaceId;
  data: PopulationHealthDashboardPayload;
  appLanguage: 'en' | 'vi';
  onProgrammeAction: (
    programmeId: string,
    action: 'SEND_INVITE' | 'RECORD_COMPLETION' | 'TOGGLE_STATUS'
  ) => Promise<void>;
  onCreateReferral: (input: {
    participantId: string;
    destinationService: string;
    reasonSummary: string;
    priority: CareReferralItem['priority'];
    navigatorName: string;
  }) => Promise<void>;
  onAdvanceReferral: (
    referralId: string,
    payload: {
      stage?: CareNavigationStage;
      appointmentStatus?: CareReferralItem['appointmentStatus'];
      communicationNote?: string;
      channel?: 'SMS' | 'VOICE' | 'IN_CLINIC' | 'PORTAL';
      language?: 'en' | 'vi';
      escalated?: boolean;
    }
  ) => Promise<void>;
  onRunAiQuery: (query: string) => Promise<void>;
  onApproveAiSynthesis: (synthesisId: string, decision: 'APPROVED' | 'REJECTED') => Promise<void>;
  onGateEngagement: (templateId: string, action: 'APPROVE' | 'SEND') => Promise<void>;
  onUpdateKThreshold: (k: number) => Promise<void>;
  onEraseParticipant: (participantId: string) => Promise<void>;
  onTestGovernanceBoundary: () => Promise<void>;
}

const PIPELINE_STAGES: CareNavigationStage[] = [
  'SIGNAL_IDENTIFIED',
  'HUMAN_REVIEW',
  'SCREENING_ASSESSMENT',
  'REFERRAL_ISSUED',
  'FOLLOW_UP_IN_PROGRESS',
  'RESOLVED',
];

export const PopulationCareWorkspaces: React.FC<CareWorkspacesProps> = ({
  workspace,
  data,
  appLanguage,
  onProgrammeAction,
  onCreateReferral,
  onAdvanceReferral,
  onRunAiQuery,
  onApproveAiSynthesis,
  onGateEngagement,
  onUpdateKThreshold,
  onEraseParticipant,
  onTestGovernanceBoundary,
}) => {
  const consented = data.participants.filter((p) => p.consentStatus === 'ACTIVE');
  const [refParticipantId, setRefParticipantId] = useState(consented[0]?.id || '');
  const [refService, setRefService] = useState('District Community Screening Clinic');
  const [refReason, setRefReason] = useState('Follow-up repeat screening & counselling');
  const [refPriority, setRefPriority] = useState<CareReferralItem['priority']>('EXPEDITED');
  const [commDrafts, setCommDrafts] = useState<Record<string, string>>({});

  const [aiQuery, setAiQuery] = useState(
    'Which consented cohorts show overdue follow-ups or blood health bottlenecks across districts, and what operational steps are safest to prioritise first?'
  );
  const [aiRunning, setAiRunning] = useState(false);

  const [engagementLang, setEngagementLang] = useState<'en' | 'vi'>(appLanguage);
  const [kDraft, setKDraft] = useState(String(data.filtersApplied.kThreshold));

  const canManageProgrammes = data.roleContext.permissions.includes('MANAGE_PROGRAMMES');
  const canManageReferrals = data.roleContext.permissions.includes('MANAGE_REFERRALS');
  const canRunAi = data.roleContext.permissions.includes('RUN_AI_ASSISTANT');
  const canApproveAi = data.roleContext.permissions.includes('APPROVE_AI_SYNTHESIS');
  const canSendEngagement = data.roleContext.permissions.includes('APPROVE_AND_SEND_ENGAGEMENT');
  const canManageGov = data.roleContext.permissions.includes('MANAGE_GOVERNANCE');
  const canEraseParticipant = data.roleContext.permissions.includes('ERASE_PARTICIPANT');

  const speakMessage = (text: string, lang: 'en' | 'vi') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
    window.speechSynthesis.speak(utter);
  };

  if (workspace === 'programmes') {
    return (
      <div className="space-y-4">
        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-teal-700" />
            Screening & Prevention Programmes
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tracks operational programme uptake separately from downstream clinical laboratory outcomes.
          </p>

          <div className="divide-y divide-slate-100 mt-4">
            {data.programmes.map((prog) => (
              <div key={prog.id} className="py-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{prog.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {prog.focusArea} · {prog.cohort} · {prog.region} · {prog.dataOrigin} ·{' '}
                      <span className="font-mono font-medium text-slate-700">{prog.status}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Eligibility: {prog.eligibilityCriteria}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={!canManageProgrammes}
                      onClick={() => onProgrammeAction(prog.id, 'SEND_INVITE')}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap"
                    >
                      +1 Invite & Consent
                    </button>
                    <button
                      type="button"
                      disabled={!canManageProgrammes}
                      onClick={() => onProgrammeAction(prog.id, 'RECORD_COMPLETION')}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 whitespace-nowrap"
                    >
                      Record Completion
                    </button>
                    <button
                      type="button"
                      disabled={!canManageProgrammes}
                      onClick={() => onProgrammeAction(prog.id, 'TOGGLE_STATUS')}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap"
                    >
                      {prog.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-500">Invited</span>
                    <div className="font-mono tabular-nums font-semibold text-slate-900">
                      {prog.invitedCount}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Consented</span>
                    <div className="font-mono tabular-nums font-semibold text-slate-900">
                      {prog.consentedCount}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Screened</span>
                    <div className="font-mono tabular-nums font-semibold text-slate-900">
                      {prog.screenedCount}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Completed</span>
                    <div className="font-mono tabular-nums font-semibold text-teal-700">
                      {prog.completedCount}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Overdue</span>
                    <div className="font-mono tabular-nums font-semibold text-amber-700">
                      {prog.overdueCount}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Operational Completion</span>
                    <div className="font-mono tabular-nums font-semibold text-slate-900">
                      {prog.operationalCompletionRatePct}%
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  Clinical outcome note: {prog.clinicalOutcomeNote}
                </div>
              </div>
            ))}
            {data.programmes.length === 0 && (
              <p className="py-6 text-sm text-slate-500">
                No screening programmes active yet. Click &quot;Load Demo Cohorts&quot; above to restore sample Blood Health, Cardiometabolic, and Maternal Health programmes.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (workspace === 'navigation') {
    const activeParticipantId = refParticipantId || consented[0]?.id || '';
    return (
      <div className="space-y-6">
        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-teal-700" />
            Create Coordinated Care Referral
          </h3>
          <form
            className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!activeParticipantId) return;
              await onCreateReferral({
                participantId: activeParticipantId,
                destinationService: refService,
                reasonSummary: refReason,
                priority: refPriority,
                navigatorName: 'Care Navigator Linh',
              });
            }}
          >
            <select
              disabled={!canManageReferrals}
              value={activeParticipantId}
              onChange={(e) => setRefParticipantId(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white"
            >
              {consented.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayAlias} ({p.cohort})
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              disabled={!canManageReferrals}
              value={refService}
              onChange={(e) => setRefService(e.target.value)}
              placeholder="Destination clinic or service"
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900"
            />
            <input
              type="text"
              required
              disabled={!canManageReferrals}
              value={refReason}
              onChange={(e) => setRefReason(e.target.value)}
              placeholder="Referral summary (no PII)"
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900"
            />
            <div className="flex gap-2">
              <select
                disabled={!canManageReferrals}
                value={refPriority}
                onChange={(e) => setRefPriority(e.target.value as CareReferralItem['priority'])}
                className="px-2.5 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white"
              >
                <option value="STANDARD">Standard</option>
                <option value="EXPEDITED">Expedited</option>
                <option value="PRIORITY">Priority</option>
              </select>
              <button
                type="submit"
                disabled={!canManageReferrals || !activeParticipantId}
                className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 whitespace-nowrap"
              >
                Create Referral
              </button>
            </div>
          </form>
        </div>

        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
            6-Stage Care Navigation Queue ({data.referrals.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {data.referrals.map((ref) => {
              const stageIdx = PIPELINE_STAGES.indexOf(ref.stage);
              const nextStage =
                stageIdx >= 0 && stageIdx < PIPELINE_STAGES.length - 1
                  ? PIPELINE_STAGES[stageIdx + 1]
                  : null;
              return (
                <div key={ref.id} className="py-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-semibold text-slate-900">
                        {ref.participantAlias}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        {ref.cohort} · {ref.region} → {ref.destinationService}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-700">
                      {ref.stage} · {ref.appointmentStatus} · Wait {ref.overdueDays}d
                      {ref.escalated ? ' · ESCALATED' : ''}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{ref.reasonSummary}</p>

                  {ref.communications.length > 0 && (
                    <div className="text-xs text-slate-500 space-y-0.5">
                      {ref.communications.slice(-2).map((c) => (
                        <div key={c.id}>
                          [{c.language.toUpperCase()} · {c.channel}] {c.summary}
                        </div>
                      ))}
                    </div>
                  )}

                  {canManageReferrals && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {nextStage && (
                        <button
                          type="button"
                          onClick={() =>
                            onAdvanceReferral(ref.id, {
                              stage: nextStage,
                              appointmentStatus:
                                nextStage === 'RESOLVED' ? 'COMPLETED' : 'SCHEDULED',
                            })
                          }
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-700 text-white hover:bg-teal-800 whitespace-nowrap"
                        >
                          Advance to {nextStage}
                        </button>
                      )}
                      {!ref.escalated && ref.stage !== 'RESOLVED' && (
                        <button
                          type="button"
                          onClick={() => onAdvanceReferral(ref.id, { escalated: true })}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 whitespace-nowrap"
                        >
                          Escalate Delay
                        </button>
                      )}
                      <input
                        type="text"
                        value={commDrafts[ref.id] || ''}
                        onChange={(e) =>
                          setCommDrafts((d) => ({ ...d, [ref.id]: e.target.value }))
                        }
                        placeholder={`Log outreach note (${engagementLang.toUpperCase()})...`}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-900 min-w-[200px]"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const txt = commDrafts[ref.id]?.trim();
                          if (!txt) return;
                          await onAdvanceReferral(ref.id, {
                            communicationNote: txt,
                            channel: 'SMS',
                            language: engagementLang,
                          });
                          setCommDrafts((d) => ({ ...d, [ref.id]: '' }));
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                      >
                        Log Outreach
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {data.referrals.length === 0 && (
              <p className="py-6 text-sm text-slate-500">
                No referrals queued. Register or consent a participant first, then create a care navigation pathway above.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (workspace === 'ai_assistant') {
    return (
      <div className="space-y-6">
        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Bot className="w-4 h-4 text-teal-700" />
            AI Population Health Research Assistant (De-Identified Server Proxy)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Strictly separates observed cohort statistics from AI synthesis, includes real clinical
            guideline references, and enforces mandatory human approval before any clinical use.
          </p>
          <form
            className="mt-4 flex flex-col sm:flex-row gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setAiRunning(true);
              try {
                await onRunAiQuery(aiQuery);
              } finally {
                setAiRunning(false);
              }
            }}
          >
            <input
              type="text"
              required
              disabled={!canRunAi || aiRunning}
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ask a de-identified population health analysis question..."
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900"
            />
            <button
              type="submit"
              disabled={!canRunAi || aiRunning}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 whitespace-nowrap"
            >
              {aiRunning ? 'Synthesising...' : 'Run De-Identified Synthesis'}
            </button>
          </form>
        </div>

        {data.aiSyntheses.map((syn) => (
          <div key={syn.id} className="border border-slate-200 rounded-xl bg-white p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="text-sm font-semibold text-slate-900">{syn.query}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Provider: {syn.providerUsed} ·{' '}
                  {syn.isAiGenerated && !syn.fallbackEngaged
                    ? 'Live Gemini (AI-Generated)'
                    : 'Deterministic Evidence Fallback (Not AI-Generated)'}{' '}
                  · Gate:{' '}
                  <span
                    className={
                      syn.humanApprovalStatus === 'APPROVED'
                        ? 'text-emerald-700 font-semibold'
                        : syn.humanApprovalStatus === 'REJECTED'
                          ? 'text-red-700 font-semibold'
                          : 'text-amber-700 font-semibold'
                    }
                  >
                    {syn.humanApprovalStatus}
                  </span>
                </div>
              </div>
              {canApproveAi && syn.humanApprovalStatus === 'PENDING_HUMAN_REVIEW' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onApproveAiSynthesis(syn.id, 'APPROVED')}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 whitespace-nowrap"
                  >
                    Approve Synthesis
                  </button>
                  <button
                    type="button"
                    onClick={() => onApproveAiSynthesis(syn.id, 'REJECTED')}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-700 hover:bg-red-50 whitespace-nowrap"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-700">1. Observed Cohort Data (Deterministic)</div>
              <p className="text-sm text-slate-800 mt-1">{syn.observationalSummary}</p>
            </div>

            <div>
              <div className="text-xs font-semibold text-teal-800">2. AI Synthesis & Operational Prioritisation</div>
              <p className="text-sm text-slate-700 mt-1">{syn.aiSynthesis}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-700">
                {syn.prioritisedActions.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <div>
                <span className="font-semibold text-slate-800">Uncertainty & Scope Limits: </span>
                {syn.uncertaintyNotes}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Cited References:
                </span>
                {syn.citations.map((cit) => (
                  <span key={cit.id}>
                    {cit.title} ({cit.source}, {cit.year})
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (workspace === 'engagement') {
    return (
      <div className="space-y-6">
        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-700" />
                Multilingual Community Engagement (English / Tiếng Việt)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Plain-language screening guidance with voice readout preview and mandatory clinician
                approval prior to dispatch.
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setEngagementLang('en')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  engagementLang === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setEngagementLang('vi')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  engagementLang === 'vi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Tiếng Việt
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {data.engagementTemplates.map((tpl) => {
              const text = engagementLang === 'vi' ? tpl.messageVi : tpl.messageEn;
              const voice = engagementLang === 'vi' ? tpl.voicePromptVi : tpl.voicePromptEn;
              return (
                <div key={tpl.id} className="py-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{tpl.title}</div>
                      <div className="text-xs text-slate-500">
                        {tpl.cohort} · {tpl.channel} · {tpl.readingLevelNote} · Gate:{' '}
                        <span className="font-mono font-semibold text-slate-800">{tpl.status}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => speakMessage(voice, engagementLang)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                        Voice Readout ({engagementLang.toUpperCase()})
                      </button>
                      {canSendEngagement && tpl.status !== 'APPROVED_TO_SEND' && tpl.status !== 'SENT' && (
                        <button
                          type="button"
                          onClick={() => onGateEngagement(tpl.id, 'APPROVE')}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-700 text-white hover:bg-teal-800 whitespace-nowrap"
                        >
                          Approve Message
                        </button>
                      )}
                      {canSendEngagement && tpl.status === 'APPROVED_TO_SEND' && (
                        <button
                          type="button"
                          onClick={() => onGateEngagement(tpl.id, 'SEND')}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 flex items-center gap-1 whitespace-nowrap"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dispatch Batch
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (workspace === 'impact') {
    return (
      <div className="space-y-4">
        {data.kpis.suppressedForPrivacy && (
          <div className="border border-amber-200 rounded-xl bg-amber-50 p-4 text-xs text-amber-900">
            Filtered cohort slice is below k={data.kAnonymitySummary.kThreshold}. Subgroup outcome figures are masked to uphold k-anonymity.
          </div>
        )}
        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900 pb-1">
            Impact, Uptake & Outcomes Evaluation
          </h3>
          <p className="text-xs text-slate-500 pb-4 border-b border-slate-100">
            Operational metrics (coverage, queue completion) are separated explicitly from longitudinal
            clinical outcome proxies, alongside provenance, data completeness, and limitations.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2.5 pr-3 font-medium">Metric & Domain</th>
                  <th className="py-2.5 px-3 font-medium">Classification & Origin</th>
                  <th className="py-2.5 px-3 font-medium text-right">Baseline</th>
                  <th className="py-2.5 px-3 font-medium text-right">Mid-Period</th>
                  <th className="py-2.5 px-3 font-medium text-right">Current</th>
                  <th className="py-2.5 px-3 font-medium text-right">Change</th>
                  <th className="py-2.5 pl-3 font-medium text-right">Completeness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.impactMetrics.map((m) => (
                  <tr key={m.id}>
                    <td className="py-3 pr-3">
                      <div className="font-medium text-slate-900">{m.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {m.domain} · {m.limitationNote}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-xs font-mono">
                      <div
                        className={
                          m.metricType === 'OPERATIONAL' ? 'text-teal-700' : 'text-amber-700'
                        }
                      >
                        {m.metricType}
                      </div>
                      <div className="text-[11px] text-slate-500">{m.sourceProvenance}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                      {m.baselineValue} {m.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                      {m.reportingPeriodValue} {m.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                      {m.currentValue} {m.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-700">
                      {m.deltaLabel}
                    </td>
                    <td className="py-3 pl-3 text-right font-mono tabular-nums text-slate-600">
                      {m.dataCompletenessPct}%
                    </td>
                  </tr>
                ))}
                {data.impactMetrics.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-sm text-slate-500">
                      No consented cohort metrics to display yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // governance workspace
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-slate-200 rounded-xl bg-white p-5 space-y-3">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-700" />
            k-Anonymity & Data Minimisation Controls
          </h3>
          <p className="text-xs text-slate-500">
            Subgroup cells below threshold k are automatically suppressed in KPIs, charts, and
            exports. Platform Admin (verified Firebase admin session only) can configure k (3–20).
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-slate-700">Minimum subgroup cell size k:</label>
            <input
              type="number"
              min={3}
              max={20}
              disabled={!canManageGov}
              value={kDraft}
              onChange={(e) => setKDraft(e.target.value)}
              className="w-20 px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg font-mono text-slate-900 disabled:bg-slate-50"
            />
            <button
              type="button"
              disabled={!canManageGov}
              onClick={() => onUpdateKThreshold(Number(kDraft) || 5)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 whitespace-nowrap"
            >
              Apply Policy
            </button>
            {!canManageGov && (
              <button
                type="button"
                onClick={() => onTestGovernanceBoundary()}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 whitespace-nowrap"
              >
                Verify Server 403 Boundary
              </button>
            )}
          </div>
          <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
            <div>
              Auth mode:{' '}
              <span className="font-mono font-semibold text-slate-900">
                {data.roleContext.authMode}
              </span>{' '}
              · Active role:{' '}
              <span className="font-mono font-semibold text-slate-900">
                {data.roleContext.currentRole}
              </span>{' '}
              (verified max: <span className="font-mono">{data.roleContext.verifiedMaxRole}</span>)
            </div>
            <div>
              Active permissions:{' '}
              <span className="font-mono text-slate-700">
                {data.roleContext.permissions.join(', ')}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl bg-white p-5 space-y-3">
          <h3 className="text-base font-semibold text-slate-900">
            Persistence, PDPL Compliance & Retention Policy
          </h3>
          <div className="text-xs space-y-1.5 text-slate-700">
            <div>
              <span className="font-semibold">Storage Mode: </span>
              <span className="font-mono text-teal-800">{data.persistenceStatus.mode}</span> · Durable
              across restarts:{' '}
              <span className="font-mono font-semibold">
                {data.persistenceStatus.durableAcrossRestarts ? 'YES' : 'NO (Ephemeral/Fallback)'}
              </span>
            </div>
            <p className="text-slate-600">{data.persistenceStatus.limitationNote}</p>
            <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded p-2">
              <strong>IAM / Ops Note:</strong> {data.persistenceStatus.requiredAction}
            </p>
            <div>
              <span className="font-semibold">Retention Window: </span>
              <span className="font-mono">{data.complianceMetadata.retentionPolicyDays} days</span> ·{' '}
              {data.complianceMetadata.legalFrameworks[0]}
            </div>
            <p className="text-[11px] text-slate-500">
              {data.complianceMetadata.legalReviewNotice}
            </p>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white p-5">
        <h3 className="text-base font-semibold text-slate-900">
          Active Consent Ledger ({data.consents.length})
        </h3>
        <div className="divide-y divide-slate-100 mt-2 max-h-56 overflow-y-auto">
          {data.consents.slice(0, 12).map((c) => (
            <div key={c.id} className="py-2 flex items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-mono text-slate-800">{c.participantId}</span>
                <span className="text-slate-500 ml-2">
                  {c.scopes.join(', ') || 'None (revoked)'}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`font-mono font-semibold ${
                    c.status === 'ACTIVE' ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {c.status}
                </span>
                {canEraseParticipant && (
                  <button
                    type="button"
                    onClick={() => onEraseParticipant(c.participantId)}
                    className="px-2 py-0.5 text-[11px] rounded border border-red-200 text-red-700 hover:bg-red-50"
                  >
                    Erase (PDPL)
                  </button>
                )}
              </div>
            </div>
          ))}
          {data.consents.length === 0 && (
            <p className="py-4 text-xs text-slate-500">No consent records in active state.</p>
          )}
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white p-5">
        <h3 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
          Immutable Governance Audit Log ({data.auditLogs.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-3 font-medium">Timestamp</th>
                <th className="py-2 px-3 font-medium">Role</th>
                <th className="py-2 px-3 font-medium">Action</th>
                <th className="py-2 px-3 font-medium">Outcome</th>
                <th className="py-2 pl-3 font-medium">Governance Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.auditLogs.slice(0, 20).map((log) => (
                <tr key={log.id}>
                  <td className="py-2 pr-3 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-800">{log.actorRole}</td>
                  <td className="py-2 px-3 font-mono text-slate-800">{log.action}</td>
                  <td className="py-2 px-3 font-mono font-semibold">
                    <span className={log.outcome === 'ALLOWED' ? 'text-emerald-700' : 'text-red-700'}>
                      {log.outcome}
                    </span>
                  </td>
                  <td className="py-2 pl-3 text-slate-600">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
