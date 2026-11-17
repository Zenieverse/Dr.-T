import React, { useState } from 'react';
import {
  PopulationHealthDashboardPayload,
  PopulationWorkspaceId,
  DemoFocusTrack,
  PopulationParticipant,
  PopulationRiskSignal,
  SignalMetricType,
  SignalSourceSystem,
  PopulationAlert,
} from '../../types/populationHealth';
import { NavTab } from '../../types';
import { PopulationTrendsChart } from './PopulationTrendsChart';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Download,
  FilePlus2,
  HeartPulse,
  PhoneCall,
  Search,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

export interface CoreWorkspacesProps {
  workspace: PopulationWorkspaceId;
  data: PopulationHealthDashboardPayload;
  onNavigateWorkspace: (ws: PopulationWorkspaceId) => void;
  onNavigatePlatformTab?: (tab: NavTab) => void;
  onRegisterParticipant: (input: {
    displayAlias: string;
    age: number;
    gender: PopulationParticipant['gender'];
    cohort: DemoFocusTrack;
    region: string;
    preferredLanguage: PopulationParticipant['preferredLanguage'];
    consentGiven: boolean;
    notes: string;
  }) => Promise<void>;
  onUpdateConsent: (participantId: string, status: 'ACTIVE' | 'REVOKED') => Promise<void>;
  onIngestObservation: (input: {
    participantId: string;
    sourceSystem: SignalSourceSystem;
    metricType: SignalMetricType;
    valueDisplay: string;
    numericValue?: number;
    secondaryNumericValue?: number;
    unit?: string;
    provenanceNote?: string;
  }) => Promise<void>;
  onBridgeHealthAlert: (participantId: string) => Promise<void>;
  onBridgePresage: (participantId: string, cameraConsentVerified: boolean) => Promise<void>;
  onReviewRiskSignal: (signalId: string, status: PopulationRiskSignal['status']) => Promise<void>;
  onUpdateAlert: (
    alertId: string,
    payload: { status: PopulationAlert['status']; assignedReviewer?: string; note?: string }
  ) => Promise<void>;
  onToggleAlertRule: (ruleId: string, enabled: boolean) => Promise<void>;
  onDownloadReport: (format: 'csv' | 'json') => Promise<void>;
}

const riskTierTextClass = (tier: string) => {
  if (tier === 'PRIORITY_FOLLOWUP' || tier === 'HIGH' || tier === 'URGENT_REVIEW') {
    return 'text-red-700 font-semibold';
  }
  if (tier === 'ELEVATED' || tier === 'MODERATE' || tier === 'WATCH') {
    return 'text-amber-700 font-semibold';
  }
  return 'text-emerald-700 font-medium';
};

export const PopulationCoreWorkspaces: React.FC<CoreWorkspacesProps> = ({
  workspace,
  data,
  onNavigateWorkspace,
  onNavigatePlatformTab,
  onRegisterParticipant,
  onUpdateConsent,
  onIngestObservation,
  onBridgeHealthAlert,
  onBridgePresage,
  onReviewRiskSignal,
  onUpdateAlert,
  onToggleAlertRule,
  onDownloadReport,
}) => {
  const [registrySearch, setRegistrySearch] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newAge, setNewAge] = useState('42');
  const [newGender, setNewGender] = useState<PopulationParticipant['gender']>('Female');
  const [newCohort, setNewCohort] = useState<DemoFocusTrack>('Blood Health');
  const [newRegion, setNewRegion] = useState('District 1 Clinic');
  const [newLang, setNewLang] = useState<PopulationParticipant['preferredLanguage']>('en');
  const [newNotes, setNewNotes] = useState('');

  const consentedParticipants = data.participants.filter((p) => p.consentStatus === 'ACTIVE');
  const [obsParticipantId, setObsParticipantId] = useState(consentedParticipants[0]?.id || '');
  const [obsSource, setObsSource] = useState<SignalSourceSystem>('COMMUNITY_SCREENING');
  const [obsMetric, setObsMetric] = useState<SignalMetricType>('blood_pressure');
  const [obsPrimaryVal, setObsPrimaryVal] = useState('146');
  const [obsSecondaryVal, setObsSecondaryVal] = useState('92');
  const [obsUnit, setObsUnit] = useState('mmHg');
  const [obsNote, setObsNote] = useState('Community blood pressure kiosk check-in');
  const [cameraConsentChecked, setCameraConsentChecked] = useState(false);

  const canManageParticipants = data.roleContext.permissions.includes('MANAGE_PARTICIPANTS');
  const canManageConsent = data.roleContext.permissions.includes('MANAGE_CONSENT');
  const canIngest = data.roleContext.permissions.includes('INGEST_SIGNALS');
  const canReviewAlerts = data.roleContext.permissions.includes('REVIEW_ALERTS');
  const canExport = data.roleContext.permissions.includes('EXPORT_REPORTS');
  const kpiSuppressed = Boolean(data.kpis.suppressedForPrivacy);

  if (workspace === 'overview') {
    return (
      <div className="space-y-6">
        {kpiSuppressed && (
          <div className="border border-amber-200 rounded-xl bg-amber-50 p-4 text-xs text-amber-900">
            <strong>Small-Subgroup k-Anonymity Suppression Active (k={data.kAnonymitySummary.kThreshold}):</strong>{' '}
            Your active filter slice contains fewer than {data.kAnonymitySummary.kThreshold} consented participants. Aggregate counts, percentages, and trend charts are masked to prevent re-identification.
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-slate-200 rounded-xl bg-white p-4">
            <div className="text-xs text-slate-500">Consented Population</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {kpiSuppressed ? `<${data.kAnonymitySummary.kThreshold}` : data.kpis.consentedParticipants}
              {!kpiSuppressed && (
                <span className="text-sm font-normal text-slate-400">
                  {' '}
                  / {data.kpis.totalParticipants}
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {kpiSuppressed
                ? 'Suppressed under k-rule'
                : `${data.kpis.revokedParticipants} consent-revoked excluded`}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl bg-white p-4">
            <div className="text-xs text-slate-500">Priority / Elevated Cohorts</div>
            <div className="mt-1 text-2xl font-bold text-amber-700 font-mono tabular-nums">
              {kpiSuppressed ? '—' : data.kpis.elevatedRiskCount}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {kpiSuppressed ? 'Suppressed under k-rule' : `${data.kpis.openAlertsCount} open alerts requiring review`}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl bg-white p-4">
            <div className="text-xs text-slate-500">Screening Completion</div>
            <div className="mt-1 text-2xl font-bold text-teal-700 font-mono tabular-nums">
              {kpiSuppressed ? '—' : `${data.kpis.screeningCompletionPct}%`}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {kpiSuppressed ? 'Suppressed under k-rule' : `${data.kpis.validSignalsPct}% signal quality verified`}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl bg-white p-4">
            <div className="text-xs text-slate-500">Active Care Navigation</div>
            <div className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {kpiSuppressed ? '—' : data.kpis.activeReferralsCount}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {kpiSuppressed ? 'Suppressed under k-rule' : `${data.kpis.overdueFollowUpsCount} overdue follow-ups (>7d)`}
            </div>
          </div>
        </div>

        <PopulationTrendsChart
          trends={data.trends}
          suppressedForPrivacy={data.trendsSuppressedForPrivacy}
          kThreshold={data.kAnonymitySummary.kThreshold}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-xl bg-white p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">
                Signal Sources & Data Provenance
              </h3>
              <button
                type="button"
                onClick={() => onNavigateWorkspace('intake')}
                className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 whitespace-nowrap"
              >
                Open Intake <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {data.connectors.map((c) => (
                <div key={c.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{c.details}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs font-mono font-semibold ${
                        c.connectionState === 'LIVE'
                          ? 'text-emerald-700'
                          : c.connectionState === 'IMPORTED'
                            ? 'text-teal-700'
                            : c.connectionState === 'SIMULATED'
                              ? 'text-amber-700'
                              : 'text-slate-500'
                      }`}
                    >
                      {c.connectionState}
                    </div>
                    <div className="text-xs text-slate-400 font-mono tabular-nums mt-0.5">
                      {c.recordsCount} records
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl bg-white p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">
                Open Early Warning & Triage Queue
              </h3>
              <button
                type="button"
                onClick={() => onNavigateWorkspace('alerts')}
                className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 whitespace-nowrap"
              >
                Review Alerts <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {data.alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="py-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className={riskTierTextClass(alert.severity)}>
                      {alert.severity} · {alert.category}
                    </span>
                    <span className="font-mono">{alert.status}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-900 mt-1">{alert.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{alert.summary}</div>
                </div>
              ))}
              {data.alerts.length === 0 && (
                <p className="py-6 text-sm text-slate-500">No active population alerts.</p>
              )}
            </div>

            {onNavigatePlatformTab && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onNavigatePlatformTab('healthalert')}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                  Launch Health Alert Mini
                </button>
                <button
                  type="button"
                  onClick={() => onNavigatePlatformTab('presagesense')}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  Open Presage SmartSpectra
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (workspace === 'registry') {
    const filtered = data.participants.filter((p) => {
      const q = registrySearch.trim().toLowerCase();
      if (!q) return true;
      return (
        p.displayAlias.toLowerCase().includes(q) ||
        p.syntheticCode.toLowerCase().includes(q) ||
        p.cohort.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q)
      );
    });

    return (
      <div className="space-y-6">
        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-teal-700" />
            Register Consented Community Participant
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Pseudonymous intake only — email addresses, phone numbers, and government IDs are
            automatically rejected at server validation.
          </p>

          <form
            className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await onRegisterParticipant({
                displayAlias: newAlias,
                age: Number(newAge) || 40,
                gender: newGender,
                cohort: newCohort,
                region: newRegion,
                preferredLanguage: newLang,
                consentGiven: true,
                notes: newNotes,
              });
              setNewAlias('');
              setNewNotes('');
            }}
          >
            <input
              type="text"
              required
              disabled={!canManageParticipants}
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value)}
              placeholder="Pseudonymous alias (e.g., Resident D1-19)"
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 disabled:bg-slate-50"
            />
            <input
              type="number"
              min={1}
              max={120}
              required
              disabled={!canManageParticipants}
              value={newAge}
              onChange={(e) => setNewAge(e.target.value)}
              placeholder="Age"
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 font-mono"
            />
            <select
              disabled={!canManageParticipants}
              value={newCohort}
              onChange={(e) => setNewCohort(e.target.value as DemoFocusTrack)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white"
            >
              <option value="Blood Health">Blood Health</option>
              <option value="Cardiometabolic Health">Cardiometabolic Health</option>
              <option value="Maternal Health">Maternal Health</option>
            </select>
            <select
              disabled={!canManageParticipants}
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white"
            >
              <option value="District 1 Clinic">District 1 Clinic</option>
              <option value="Urban Core Clinic">Urban Core Clinic</option>
              <option value="River Ward Outreach">River Ward Outreach</option>
              <option value="Rural Outreach South">Rural Outreach South</option>
            </select>
            <select
              disabled={!canManageParticipants}
              value={newGender}
              onChange={(e) => setNewGender(e.target.value as PopulationParticipant['gender'])}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Unspecified">Unspecified</option>
            </select>
            <select
              disabled={!canManageParticipants}
              value={newLang}
              onChange={(e) =>
                setNewLang(e.target.value as PopulationParticipant['preferredLanguage'])
              }
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white"
            >
              <option value="en">English (en)</option>
              <option value="vi">Tiếng Việt (vi)</option>
            </select>
            <input
              type="text"
              disabled={!canManageParticipants}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Non-PII screening context"
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900"
            />
            <button
              type="submit"
              disabled={!canManageParticipants}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 whitespace-nowrap"
            >
              Register Consented Member
            </button>
          </form>
        </div>

        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Community Cohort & Consent Registry ({filtered.length})
              </h3>
              {data.roleContext.piiRedacted && (
                <p className="text-xs text-amber-700 mt-0.5">
                  Role data-minimisation active: participant aliases & clinical notes are redacted
                  for {data.roleContext.currentRole}.
                </p>
              )}
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={registrySearch}
                onChange={(e) => setRegistrySearch(e.target.value)}
                placeholder="Filter by code, region, cohort..."
                className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2.5 pr-3 font-medium">Participant / Code</th>
                  <th className="py-2.5 px-3 font-medium">Cohort & Region</th>
                  <th className="py-2.5 px-3 font-medium">Provenance</th>
                  <th className="py-2.5 px-3 font-medium">Consent</th>
                  <th className="py-2.5 px-3 font-medium">Risk Tier</th>
                  <th className="py-2.5 px-3 font-medium text-right">Score</th>
                  <th className="py-2.5 pl-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 pr-3">
                      <div className="font-medium text-slate-900">{p.displayAlias}</div>
                      <div className="text-xs text-slate-500 font-mono">
                        {p.syntheticCode} · {p.ageBand} · {p.preferredLanguage.toUpperCase()}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-slate-800">{p.cohort}</div>
                      <div className="text-xs text-slate-500">{p.region}</div>
                    </td>
                    <td className="py-2.5 px-3 text-xs font-mono text-slate-600">{p.dataOrigin}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-xs font-semibold ${
                          p.consentStatus === 'ACTIVE' ? 'text-emerald-700' : 'text-red-700'
                        }`}
                      >
                        {p.consentStatus}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3 text-xs ${riskTierTextClass(p.riskTier)}`}>
                      {p.riskTier}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-900">
                      {p.consentStatus === 'ACTIVE' ? p.priorityScore : '—'}
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      {canManageConsent ? (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateConsent(
                              p.id,
                              p.consentStatus === 'ACTIVE' ? 'REVOKED' : 'ACTIVE'
                            )
                          }
                          className="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 text-slate-700 hover:bg-slate-100 whitespace-nowrap"
                        >
                          {p.consentStatus === 'ACTIVE' ? 'Revoke Consent' : 'Restore Consent'}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Read-only</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-sm text-slate-500">
                      No participants recorded. Register a consented community member above or click &quot;Load Demo Cohorts&quot;.
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

  if (workspace === 'intake') {
    const activeTargetId = obsParticipantId || consentedParticipants[0]?.id || '';
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-slate-200 rounded-xl bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <FilePlus2 className="w-4 h-4 text-teal-700" />
              Structured Community & Biometric Signal Intake
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Validates unit ranges, flags physiological outliers, checks staleness (&gt;30 days),
              and enforces active consent before storing any reading.
            </p>

            <form
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!activeTargetId) return;
                const pNum = Number(obsPrimaryVal);
                const sNum = obsMetric === 'blood_pressure' ? Number(obsSecondaryVal) : undefined;
                const display =
                  obsMetric === 'blood_pressure'
                    ? `${obsPrimaryVal}/${obsSecondaryVal} ${obsUnit}`
                    : `${obsPrimaryVal} ${obsUnit}`.trim();
                await onIngestObservation({
                  participantId: activeTargetId,
                  sourceSystem: obsSource,
                  metricType: obsMetric,
                  valueDisplay: display,
                  numericValue: Number.isFinite(pNum) ? pNum : undefined,
                  secondaryNumericValue: sNum,
                  unit: obsUnit,
                  provenanceNote: obsNote,
                });
              }}
            >
              <div>
                <label className="block text-xs text-slate-600 mb-1">Consented Participant</label>
                <select
                  value={activeTargetId}
                  onChange={(e) => setObsParticipantId(e.target.value)}
                  disabled={!canIngest}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white"
                >
                  {consentedParticipants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.displayAlias} ({p.cohort})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Source System</label>
                <select
                  value={obsSource}
                  onChange={(e) => setObsSource(e.target.value as SignalSourceSystem)}
                  disabled={!canIngest}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white"
                >
                  <option value="COMMUNITY_SCREENING">Community Screening Kiosk</option>
                  <option value="CLINICAL_IMPORT">Clinic Lab Import</option>
                  <option value="HEALTH_ALERT_MINI">Health Alert Mini</option>
                  <option value="PRESAGE_OPTICAL">Presage Optical</option>
                  <option value="WEARABLE_BRIDGE">Wearable Bridge</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Biomarker / Vital Metric</label>
                <select
                  value={obsMetric}
                  onChange={(e) => {
                    const m = e.target.value as SignalMetricType;
                    setObsMetric(m);
                    if (m === 'blood_pressure') setObsUnit('mmHg');
                    else if (m === 'haemoglobin') setObsUnit('g/dL');
                    else if (m === 'ferritin') setObsUnit('ng/mL');
                    else if (m === 'hba1c') setObsUnit('%');
                    else if (m === 'glucose') setObsUnit('mg/dL');
                    else if (m === 'egfr') setObsUnit('mL/min/1.73m²');
                    else if (m === 'spo2') setObsUnit('%');
                    else if (m === 'resting_hr') setObsUnit('bpm');
                  }}
                  disabled={!canIngest}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white"
                >
                  <option value="blood_pressure">Blood Pressure (Systolic / Diastolic)</option>
                  <option value="haemoglobin">Haemoglobin (g/dL)</option>
                  <option value="ferritin">Serum Ferritin (ng/mL)</option>
                  <option value="hba1c">HbA1c (%)</option>
                  <option value="glucose">Fasting Glucose (mg/dL)</option>
                  <option value="egfr">Kidney eGFR (mL/min/1.73m²)</option>
                  <option value="spo2">Oxygen Saturation SpO2 (%)</option>
                  <option value="resting_hr">Resting Heart Rate (bpm)</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    {obsMetric === 'blood_pressure' ? 'Systolic' : 'Value'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={obsPrimaryVal}
                    onChange={(e) => setObsPrimaryVal(e.target.value)}
                    disabled={!canIngest}
                    className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-lg font-mono text-slate-900"
                  />
                </div>
                {obsMetric === 'blood_pressure' && (
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Diastolic</label>
                    <input
                      type="number"
                      value={obsSecondaryVal}
                      onChange={(e) => setObsSecondaryVal(e.target.value)}
                      disabled={!canIngest}
                      className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-lg font-mono text-slate-900"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Unit</label>
                  <input
                    type="text"
                    value={obsUnit}
                    onChange={(e) => setObsUnit(e.target.value)}
                    disabled={!canIngest}
                    className="w-full px-2.5 py-2 text-sm border border-slate-200 rounded-lg font-mono text-slate-900"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 flex flex-wrap gap-3 items-center pt-1">
                <input
                  type="text"
                  value={obsNote}
                  onChange={(e) => setObsNote(e.target.value)}
                  disabled={!canIngest}
                  placeholder="Provenance note (no personal identifiers)"
                  className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900"
                />
                <button
                  type="submit"
                  disabled={!canIngest || !activeTargetId}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 whitespace-nowrap"
                >
                  Validate & Record Signal
                </button>
              </div>
            </form>
          </div>

          <div className="border border-slate-200 rounded-xl bg-white p-5 flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Dr. T Ecosystem Bridges
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Route consented signals directly from Dr. T’s triage heuristics and optical camera bridge.
              </p>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  disabled={!canIngest || !activeTargetId}
                  onClick={() => activeTargetId && onBridgeHealthAlert(activeTargetId)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 disabled:opacity-40 text-left"
                >
                  Run Health Alert Mini Bridge Intake →
                  <span className="block text-[11px] font-normal text-rose-700 mt-0.5">
                    Evaluates BP/ferritin/HbA1c via HealthAlertService heuristics (SIMULATED for synthetic/guest cohorts)
                  </span>
                </button>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <label className="flex items-start gap-2 text-[11px] text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cameraConsentChecked}
                      onChange={(e) => setCameraConsentChecked(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      Participant optical sensing consent confirmed (required before Presage camera intake; falls back to SIMULATED unless PRESAGE_API_KEY + live hardware active).
                    </span>
                  </label>
                  <button
                    type="button"
                    disabled={!canIngest || !activeTargetId || !cameraConsentChecked}
                    onClick={() =>
                      activeTargetId && onBridgePresage(activeTargetId, cameraConsentChecked)
                    }
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 disabled:opacity-40 text-left"
                  >
                    Import Presage SmartSpectra Optical Vitals →
                    <span className="block text-[11px] font-normal text-teal-700 mt-0.5">
                      Logs pulse, breathing rate & HRV with verified provenance state
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-[11px] text-amber-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                Emergency Red-Flag Boundary
              </div>
              <p>{data.emergencyGuidance.internalRedirectOnlyNotice}</p>
              <p className="font-mono font-medium">{data.emergencyGuidance.emergencyNumbers}</p>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900 pb-3 border-b border-slate-100">
            Recent Signal Observations ({data.observations.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2 pr-3 font-medium">Metric</th>
                  <th className="py-2 px-3 font-medium">Value</th>
                  <th className="py-2 px-3 font-medium">Source & Origin</th>
                  <th className="py-2 px-3 font-medium">Quality Flag</th>
                  <th className="py-2 pl-3 font-medium">Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.observations.slice(0, 15).map((obs) => (
                  <tr key={obs.id}>
                    <td className="py-2 pr-3 font-medium text-slate-900">{obs.metricLabel}</td>
                    <td className="py-2 px-3 font-mono tabular-nums text-slate-900">
                      {obs.valueDisplay}
                    </td>
                    <td className="py-2 px-3 text-xs text-slate-600">
                      {obs.sourceSystem} · <span className="font-mono">{obs.dataOrigin}</span>
                    </td>
                    <td className="py-2 px-3 text-xs font-mono">
                      <span
                        className={
                          obs.qualityFlag === 'VALID' ? 'text-emerald-700' : 'text-amber-700'
                        }
                      >
                        {obs.qualityFlag} ({obs.qualityScore})
                      </span>
                    </td>
                    <td className="py-2 pl-3 text-xs text-slate-500 font-mono">
                      {new Date(obs.recordedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {data.observations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-sm text-slate-500">
                      No signal observations recorded yet. Register a participant in Community Registry first or load demo cohorts.
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

  if (workspace === 'risk') {
    return (
      <div className="space-y-6">
        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Explainable Population Risk Signals (Non-Diagnostic)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Prioritises screening outreach & clinician review using transparent biomarker rules.
                Human clinical review is mandatory for all signals.
              </p>
            </div>
            <span className="text-xs font-mono text-teal-800 bg-teal-50 border border-teal-200 rounded px-2.5 py-1">
              Uniform Biomarker Cutoffs (No Demographic Multipliers; Parity != Clinical Fairness Proof)
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {data.riskSignals.map((sig) => (
              <div key={sig.id} className="py-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-slate-900">{sig.participantAlias}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-700">{sig.domain}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{sig.region}</span>
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {sig.dataOrigin || 'SIMULATED'}
                    </span>
                    <span className="text-xs font-mono text-amber-800 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                      {sig.status === 'OPEN' ? 'Clinician Review Required' : sig.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
                    <span className={riskTierTextClass(sig.riskTier)}>{sig.riskTier} RISK</span>
                    <span className="text-slate-700">Score {sig.priorityScore}/100</span>
                  </div>
                </div>
                <p className="text-sm text-slate-700">{sig.rationale}</p>
                <div className="text-xs text-slate-600">
                  <span className="font-medium text-slate-800">Observed Indicators: </span>
                  {sig.indicators.join(' · ')}
                  {sig.observedAt && (
                    <span className="text-slate-400 ml-2 font-mono">
                      (Observed {new Date(sig.observedAt).toLocaleDateString()})
                    </span>
                  )}
                </div>
                {sig.contributingObservations && sig.contributingObservations.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-600">
                    {sig.contributingObservations.map((o) => (
                      <span
                        key={o.id}
                        className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50"
                      >
                        {o.metricLabel}: {o.valueDisplay} [{o.qualityFlag} · {o.dataOrigin}]
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div>
                    <span className="font-medium">Uncertainty & Scope: </span>
                    {sig.uncertaintyNote} · {sig.guidelineRefs.join(' | ')} ·{' '}
                    <span className="text-slate-700 font-medium">{sig.nonDiagnosticNotice}</span>
                  </div>
                  {canReviewAlerts && sig.status === 'OPEN' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onReviewRiskSignal(sig.id, 'ACKNOWLEDGED')}
                        className="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                      >
                        Acknowledge Review
                      </button>
                      <button
                        type="button"
                        onClick={() => onReviewRiskSignal(sig.id, 'IN_NAVIGATION')}
                        className="px-2.5 py-1 text-xs font-medium rounded bg-teal-700 text-white hover:bg-teal-800 whitespace-nowrap"
                      >
                        Queue Navigation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {data.riskSignals.length === 0 && (
              <p className="py-6 text-sm text-slate-500">
                No active population risk signals. Record valid observations or load synthetic demo cohorts.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (workspace === 'trends') {
    return (
      <div className="space-y-6">
        <PopulationTrendsChart
          trends={data.trends}
          suppressedForPrivacy={data.trendsSuppressedForPrivacy}
          kThreshold={data.kAnonymitySummary.kThreshold}
        />

        <div className="border border-slate-200 rounded-xl bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Cohort × Region Matrix (k-Anonymity Threshold k={data.kAnonymitySummary.kThreshold})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Subgroup cells with fewer than {data.kAnonymitySummary.kThreshold} consented
                participants are automatically suppressed to prevent re-identification.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canExport}
                onClick={() => onDownloadReport('csv')}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button
                type="button"
                disabled={!canExport}
                onClick={() => onDownloadReport('json')}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2 pr-3 font-medium">Cohort · Region Subgroup</th>
                  <th className="py-2 px-3 font-medium text-right">Consented n</th>
                  <th className="py-2 px-3 font-medium text-right">Elevated Risk</th>
                  <th className="py-2 px-3 font-medium text-right">Screening Up-to-Date</th>
                  <th className="py-2 pl-3 font-medium text-right">Privacy Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.kAnonymitySummary.cells.map((cell) => (
                  <tr key={cell.key}>
                    <td className="py-2.5 pr-3 font-medium text-slate-900">{cell.label}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                      {cell.suppressed
                        ? `<${data.kAnonymitySummary.kThreshold} (suppressed)`
                        : cell.count}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                      {cell.suppressed ? '—' : cell.elevatedRiskCount}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                      {cell.suppressed ? '—' : `${cell.screeningCompletionPct}%`}
                    </td>
                    <td className="py-2.5 pl-3 text-right text-xs font-mono">
                      {cell.suppressed ? (
                        <span className="text-amber-700 font-semibold">SUPPRESSED (k-rule)</span>
                      ) : (
                        <span className="text-emerald-700">REPORTABLE</span>
                      )}
                    </td>
                  </tr>
                ))}
                {data.kAnonymitySummary.cells.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-sm text-slate-500">
                      No consented cohort cells match the active filter selection.
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

  // alerts workspace
  return (
    <div className="space-y-6">
      <div className="border border-slate-200 rounded-xl bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Early Warning & Escalation Queue
          </h3>
          <span className="text-[11px] font-mono text-rose-800 bg-rose-50 border border-rose-200 rounded px-2.5 py-1">
            Internal triage redirect only · Emergency: {data.emergencyGuidance.emergencyNumbers}
          </span>
        </div>
        <div className="divide-y divide-slate-100 mt-1">
          {data.alerts.map((alert) => (
            <div key={alert.id} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={riskTierTextClass(alert.severity)}>{alert.severity}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600">{alert.category}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-mono text-slate-700">Status: {alert.status}</span>
                </div>
                <div className="text-sm font-semibold text-slate-900">{alert.title}</div>
                <div className="text-xs text-slate-600">{alert.summary}</div>
                <div className="text-xs text-slate-500 font-mono">
                  Evidence: {alert.metricEvidence} · Reviewer: {alert.assignedReviewer || 'Unassigned'}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {canReviewAlerts && alert.status !== 'ACKNOWLEDGED' && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAlert(alert.id, {
                        status: 'ACKNOWLEDGED',
                        note: 'Reviewed by clinical triage staff.',
                      })
                    }
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                  >
                    Acknowledge
                  </button>
                )}
                {canReviewAlerts && alert.status !== 'ESCALATED' && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAlert(alert.id, {
                        status: 'ESCALATED',
                        assignedReviewer: 'Senior Community Physician',
                        note: 'Escalated for timely care navigation follow-up.',
                      })
                    }
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 whitespace-nowrap"
                  >
                    Escalate
                  </button>
                )}
                {canReviewAlerts && alert.status !== 'RESOLVED' && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAlert(alert.id, {
                        status: 'RESOLVED',
                        note: 'Closed following human clinician verification.',
                      })
                    }
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 whitespace-nowrap"
                  >
                    Resolve
                  </button>
                )}
                {alert.urgentClinicalRedirect && onNavigatePlatformTab && (
                  <button
                    type="button"
                    onClick={() => onNavigatePlatformTab('healthalert')}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 whitespace-nowrap"
                  >
                    Internal Triage Redirect (Health Alert) →
                  </button>
                )}
              </div>
            </div>
          ))}
          {data.alerts.length === 0 && (
            <p className="py-6 text-sm text-slate-500">
              No early warning alerts match the current workspace state.
            </p>
          )}
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white p-5">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          Configurable Monitoring Rules
        </h3>
        <div className="divide-y divide-slate-100">
          {data.alertRules.map((rule) => (
            <div key={rule.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-slate-900">{rule.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{rule.thresholdDescription}</div>
              </div>
              <button
                type="button"
                disabled={!canReviewAlerts}
                onClick={() => onToggleAlertRule(rule.id, !rule.enabled)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap disabled:opacity-40 ${
                  rule.enabled
                    ? 'bg-teal-50 border-teal-300 text-teal-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {rule.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
