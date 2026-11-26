// ============================================================================
// DR. T — CAREBRIDGE DATA FIXTURES & EMPTY LIVE BASELINE
// IMPORTANT:
//   - Sample Preview Fixtures are clearly labeled `sample_fixture` and are ONLY
//     loaded when the user explicitly clicks "Load Sample Preview Fixtures".
//   - Never represent Sample Preview Fixtures as live JSM/Confluence responses.
// ============================================================================

import {
  CareBridgeAuditEntry,
  CareBridgeConfluencePage,
  CareBridgeConsentState,
  CareBridgeIntegrationState,
  CareBridgeJsmRequest,
  CareBridgeTask,
  CareBridgeWorkspaceBundle,
} from '../../../types/carebridgeTypes';

export function createEmptyConsents(userId: string): CareBridgeConsentState {
  const now = new Date().toISOString();
  return {
    userId,
    jsmMinimalSyncConsent: false,
    confluenceReadConsent: false,
    rovoAssistantConsent: false,
    geminiSynthesisConsent: false,
    wellnessReferenceOptIn: false,
    retentionPolicy: '90_days',
    updatedAt: now,
  };
}

export function createEmptyIntegrationState(userId: string): CareBridgeIntegrationState {
  return {
    userId,
    connectionMode: 'disconnected',
    siteUrl: '',
    jsmConnected: false,
    confluenceConnected: false,
    forgeAppInstalled: false,
    statusMessage: 'Not connected to Atlassian Jira Service Management or Confluence.',
    isSampleSandboxActive: false,
    updatedAt: new Date().toISOString(),
  };
}

export function createEmptyCareWorkspace(userId: string): CareBridgeWorkspaceBundle {
  const now = new Date().toISOString();
  return {
    navigationContextTitle: 'Non-Emergency Care Navigation',
    tasks: [],
    linkedRequests: [],
    knowledgePages: [],
    latestBrief: null,
    consents: createEmptyConsents(userId),
    integration: createEmptyIntegrationState(userId),
    auditLogs: [
      {
        id: 'cb-init-001',
        userId,
        timestamp: now,
        category: 'system',
        action: 'workspace_initialized',
        outcome: 'allowed',
        summary: 'Initialized CareBridge workspace in clean disconnected state (zero fabricated records).',
        actorUid: userId,
      },
    ],
  };
}

export function createSamplePreviewBundle(userId: string): CareBridgeWorkspaceBundle {
  const now = new Date().toISOString();
  const futureDue = new Date(Date.now() + 5 * 86_400_000).toISOString().slice(0, 10);
  const laterDue = new Date(Date.now() + 9 * 86_400_000).toISOString().slice(0, 10);

  const samplePages: CareBridgeConfluencePage[] = [
    {
      id: '900101',
      title: '[Sample Fixture] Post-Visit Cardiology Scheduling & Transportation Checklist',
      spaceKey: 'CAREOPS',
      spaceName: 'Care Navigation Playbooks (Sample Fixture)',
      excerpt:
        'Checklist for care coordinators: verify clinic phone extension, confirm insurance referral authorization status 48h prior, and arrange non-emergency transit if needed.',
      lastUpdated: now,
      author: 'Care Operations Sample Author',
      url: 'https://example.invalid/wiki/spaces/CAREOPS/pages/900101',
      dataOrigin: 'sample_fixture',
    },
    {
      id: '900102',
      title: '[Sample Fixture] Questions to Bring to Primary Care Follow-Up Visit',
      spaceKey: 'CAREOPS',
      spaceName: 'Care Navigation Playbooks (Sample Fixture)',
      excerpt:
        'Administrative visit-preparation guide: confirm home blood pressure log dates, updated pharmacy address, and preferred language interpreter support.',
      lastUpdated: now,
      author: 'Care Operations Sample Author',
      url: 'https://example.invalid/wiki/spaces/CAREOPS/pages/900102',
      dataOrigin: 'sample_fixture',
    },
  ];

  const sampleRequests: CareBridgeJsmRequest[] = [
    {
      issueId: '10401',
      issueKey: 'CARE-SAMPLE-101',
      serviceDeskId: '1',
      requestTypeId: '10',
      summary: '[Sample Fixture] Confirm outpatient follow-up slot window with scheduling desk',
      status: 'Waiting for support',
      createdDate: now,
      reporterName: 'Sample Coordinator',
      requestUrl: 'https://example.invalid/servicedesk/customer/portal/1/CARE-SAMPLE-101',
      dataOrigin: 'sample_fixture',
    },
  ];

  const sampleTasks: CareBridgeTask[] = [
    {
      id: 'cb-sample-task-1',
      userId,
      contextRef: 'Post-Visit Outpatient Scheduling',
      description: 'Confirm Tuesday morning transport voucher and clinic check-in window.',
      priority: 'soon',
      dueDate: futureDue,
      responsibleAssignee: 'Outpatient Navigation Team',
      status: 'scheduled',
      source: {
        kind: 'sample_fixture',
        label: 'Sample Fixture linked to CARE-SAMPLE-101',
        provenance: 'user_recorded',
        jsmRequestKey: 'CARE-SAMPLE-101',
        jsmRequestUrl: sampleRequests[0].requestUrl,
        jsmStatus: sampleRequests[0].status,
      },
      auditTrail: [
        {
          id: 'cb-aud-s1',
          timestamp: now,
          action: 'created',
          summary: 'Loaded sample preview follow-up task (explicitly labeled Sample Fixture).',
          actorLabel: userId,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cb-sample-task-2',
      userId,
      contextRef: 'Primary Care Visit Preparation',
      description: 'Bring printed home check-in log from Health Alert Mini and confirm pharmacy address.',
      priority: 'routine',
      dueDate: laterDue,
      responsibleAssignee: 'Patient / Family Caregiver',
      status: 'open',
      source: {
        kind: 'sample_fixture',
        label: 'Sample Fixture Confluence Checklist',
        provenance: 'user_recorded',
        confluencePageId: '900102',
        confluenceUrl: samplePages[1].url,
      },
      auditTrail: [
        {
          id: 'cb-aud-s2',
          timestamp: now,
          action: 'created',
          summary: 'Loaded sample preview preparation task.',
          actorLabel: userId,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const auditLogs: CareBridgeAuditEntry[] = [
    {
      id: 'cb-audit-sample-1',
      userId,
      timestamp: now,
      category: 'system',
      action: 'sample_fixture_loaded',
      outcome: 'allowed',
      summary: 'User activated Sample Preview Sandbox (clearly separated from live Atlassian JSM/Confluence).',
      actorUid: userId,
    },
  ];

  return {
    navigationContextTitle: 'Post-Visit Care Continuity (Sample Preview Sandbox)',
    tasks: sampleTasks,
    linkedRequests: sampleRequests,
    knowledgePages: samplePages,
    latestBrief: null,
    consents: {
      ...createEmptyConsents(userId),
      consentGrantedAt: undefined,
    },
    integration: {
      userId,
      connectionMode: 'sample_sandbox',
      siteUrl: '',
      jsmConnected: false,
      confluenceConnected: false,
      forgeAppInstalled: false,
      statusMessage: 'Sample Preview Sandbox active — local demonstration fixtures only, not live Atlassian API data.',
      isSampleSandboxActive: true,
      updatedAt: now,
    },
    auditLogs,
  };
}
