// ============================================================================
// DR. T — CAREBRIDGE COMPREHENSIVE VERIFICATION SUITE (CODEGEIST 2026)
// Run via: npm run test:carebridge
// Covers:
//   - Dr. T integration & preservation of HatBridge + existing modules
//   - Distinct Forge app manifest (JSM portal panel, Confluence, Rovo 4 actions)
//   - Care Coordination CRUD, per-task audit trail, & non-diagnostic PHI blocking
//   - Server-side JSM REST APIs, consent gates, confirmation gate, & URL fidelity
//   - Confluence permission-aware results & source vs. AI separation
//   - Rovo 4 action handlers + unverified AI banner + missing info disclosure
//   - 4-bucket Care Re-entry Brief separation (Sample fixtures != Live sources)
//   - Gemini consent & PII scrubbing + server Express smoke tests
//   - Firestore blueprint & owner-isolated immutable audit rules checks
// ============================================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import http from 'node:http';

import {
  buildCareReentryBrief,
  buildLocalGroundedRovoOutput,
  checkCareBridgeDataMinimization,
  createCareTaskRecord,
  linkJsmRequestToCareTask,
  updateCareTaskStatus,
} from '../src/components/carebridge/utils/carebridgeEngine';
import {
  createEmptyCareWorkspace,
  createSamplePreviewBundle,
} from '../src/components/carebridge/data/carebridgeStarters';
import {
  CAREBRIDGE_GEMINI_MODEL,
  CareBridgeAiConsentError,
  CareBridgeAiUnavailableError,
  runCareBridgeAiAssist,
  scrubIdentifiableDetailsForExternalAi,
} from '../src/server/carebridgeAiService';
import {
  CareBridgeBoundaryError,
  createJsmFollowUpRequestConfirmed,
  fetchJsmRequestByKey,
  fetchJsmServiceDesks,
  minimizePayloadForJsm,
  resolveCareBridgeAtlassianConnection,
  safeAtlassianFetch,
  sanitizeCareBridgeErrorText,
  searchConfluenceCareKnowledge,
  validateCareBridgeSiteUrl,
  verifyCareBridgeAtlassianConnection,
} from '../src/server/carebridgeAtlassianService';
import { registerCareBridgeRoutes } from '../src/server/carebridgeService';
import {
  CAREBRIDGE_FOLLOWUP_POLICY_VERSION,
  CareBridgeFollowupStore,
} from '../src/server/carebridgeFollowupStore';
import { scanAndRedactCareBridgePhi } from '../src/utils/carebridgePhiGuard';
import {
  buildCareReentryBriefInForge,
  CareBridgeForgeAdapters,
  createJsmFollowUpConfirmedInForge,
  recordCareTaskInForge,
} from '../apps/carebridge-forge/src/coreService';
import { CareBridgeForgeError } from '../apps/carebridge-forge/src/privacyGuard';
import { dispatchCareRovoAction } from '../apps/carebridge-forge/src/rovoCore';

let passed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    passed += 1;
    console.log(`  PASS: ${name}`);
  } catch (err) {
    console.error(`  FAIL: ${name}`);
    throw err;
  }
}

async function main() {
  console.log('Running CareBridge Verification Suite...');

  // 1. Navigation & HatBridge Preservation Checks
  await test('Dr. T preserves HatBridge & existing modules while wiring CareBridge cleanly', () => {
    const typesSrc = fs.readFileSync(path.resolve('src/types.ts'), 'utf8');
    const navbarSrc = fs.readFileSync(path.resolve('src/components/layout/Navbar.tsx'), 'utf8');
    const cmdSrc = fs.readFileSync(path.resolve('src/components/layout/CommandPalette.tsx'), 'utf8');
    const appSrc = fs.readFileSync(path.resolve('src/App.tsx'), 'utf8');

    assert.match(typesSrc, /\| 'carebridge'/);
    assert.match(typesSrc, /\| 'hatbridge'/);
    assert.match(typesSrc, /\| 'healthalert'/);
    assert.match(typesSrc, /\| 'presagesense'/);
    assert.match(navbarSrc, /id: 'carebridge'/);
    assert.match(navbarSrc, /id: 'hatbridge'/);
    assert.match(cmdSrc, /setActiveTab\('carebridge'\)/);
    assert.match(cmdSrc, /setActiveTab\('hatbridge'\)/);
    assert.match(appSrc, /CareBridgeModule/);
    assert.match(appSrc, /HatBridgeModule/);
  });

  // 2. Separate CareBridge Forge Manifest vs HatBridge
  await test('CareBridge Forge manifest uses distinct app identity, JSM portal panel, and 4 Rovo actions', () => {
    const cbManifest = fs.readFileSync(path.resolve('apps/carebridge-forge/manifest.yml'), 'utf8');
    const hbManifest = fs.readFileSync(path.resolve('apps/hatbridge-forge/manifest.yml'), 'utf8');

    assert.ok(cbManifest.includes('REPLACE_WITH_CAREBRIDGE_FORGE_REGISTER_APP_ID'));
    assert.ok(!cbManifest.includes('REPLACE_WITH_FORGE_REGISTER_APP_ID'));
    assert.ok(hbManifest.includes('REPLACE_WITH_FORGE_REGISTER_APP_ID'));
    assert.ok(cbManifest.includes('jiraServiceManagement:portalRequestDetailPanel:'));
    assert.ok(cbManifest.includes('read:servicedesk-request'));
    assert.ok(cbManifest.includes('write:servicedesk-request'));
    assert.ok(cbManifest.includes('summarize-care-context'));
    assert.ok(cbManifest.includes('retrieve-care-knowledge'));
    assert.ok(cbManifest.includes('summarize-followup-tasks'));
    assert.ok(cbManifest.includes('prepare-care-handoff'));
  });

  // 3. Care Coordination Task Lifecycle + Non-Diagnostic & PHI Guardrails
  await test('Care Coordination enforces PHI minimization & preserves immutable per-task audit trail', () => {
    const blocked = checkCareBridgeDataMinimization('Patient MRN: 99812 diagnosed with diabetes, HbA1c 8.2');
    assert.equal(blocked.safe, false);
    assert.ok(blocked.warnings.length >= 1);

    const safe = checkCareBridgeDataMinimization('Confirm Tuesday follow-up clinic appointment window.');
    assert.equal(safe.safe, true);

    const task = createCareTaskRecord('uid-patient-1', {
      contextRef: 'Post-Visit Outpatient Scheduling',
      description: 'Confirm transport voucher and check-in window.',
      priority: 'soon',
      dueDate: '2026-12-01',
      responsibleAssignee: 'Outpatient Navigation Desk',
    });
    assert.equal(task.status, 'open');
    assert.equal(task.auditTrail.length, 1);

    const updated = updateCareTaskStatus(task, 'scheduled', 'uid-patient-1');
    assert.equal(updated.status, 'scheduled');
    assert.equal(updated.auditTrail.length, 2);
  });

  // 4. 4-Bucket Re-entry Brief Strictly Separates Verified Sources from Sample Fixtures & Unconfirmed AI
  await test('Care Re-entry Brief separates 4 buckets cleanly without promoting Sample Fixtures to Verified', () => {
    const sample = createSamplePreviewBundle('uid-sample-1');
    const brief = buildCareReentryBrief(sample);

    assert.equal(brief.verifiedSourceInformation.length, 0, 'Sample fixtures must never impersonate live verified sources');
    assert.ok(brief.userRecordedInformation.length >= 2);
    assert.equal(brief.aiGeneratedSuggestionUnconfirmed.label, 'AI-Generated Suggestion — Unconfirmed');
    assert.equal(brief.aiGeneratedSuggestionUnconfirmed.humanReviewed, false);
    assert.ok(brief.missingOrUnavailableContext.some((m) => /not connected/i.test(m)));

    const liveWorkspace = createEmptyCareWorkspace('uid-live-1');
    liveWorkspace.integration.jsmConnected = true;
    liveWorkspace.integration.confluenceConnected = true;
    liveWorkspace.linkedRequests = [
      {
        issueId: '201',
        issueKey: 'CARE-44',
        serviceDeskId: '1',
        requestTypeId: '5',
        summary: 'Confirm clinic wheelchair pickup entrance',
        status: 'Waiting for support',
        createdDate: '2026-11-24T10:00:00Z',
        requestUrl: 'https://demo-clinic.atlassian.net/servicedesk/customer/portal/1/CARE-44',
        dataOrigin: 'live_jsm',
      },
    ];
    const liveBrief = buildCareReentryBrief(liveWorkspace);
    assert.equal(liveBrief.verifiedSourceInformation.length, 1);
    assert.match(liveBrief.verifiedSourceInformation[0].sourceLabel, /CARE-44/);
  });

  // 5. Server-side Atlassian JSM REST Client Guards (Consented & Confirmed Only)
  await test('JSM server adapter validates *.atlassian.net, blocks PHI, blocks unconfirmed writes, and parses live JSM JSON', async () => {
    assert.throws(() => validateCareBridgeSiteUrl('http://evil.local/jira'), CareBridgeBoundaryError);
    assert.equal(
      validateCareBridgeSiteUrl('https://clinic-care.atlassian.net/'),
      'https://clinic-care.atlassian.net'
    );

    assert.throws(
      () =>
        minimizePayloadForJsm({
          summary: 'Follow up for SSN 123-45-6789',
          minimalNote: 'Need lab report',
        }),
      CareBridgeBoundaryError
    );
    assert.throws(
      () =>
        minimizePayloadForJsm({
          summary: 'Follow up appointment',
          minimalNote: 'Medical record number 99812 needs portal link',
        }),
      CareBridgeBoundaryError
    );
    const syntheticSafe = minimizePayloadForJsm({
      summary: '[CAREBRIDGE TEST] Synthetic integration verification — no patient data',
      minimalNote:
        'This is a controlled CareBridge integration test using entirely synthetic information. It contains no real patient information, diagnosis, medical record number, contact details or clinical measurements.',
    });
    assert.ok(syntheticSafe.summary.includes('[CAREBRIDGE TEST]'));

    const mockConfig = resolveCareBridgeAtlassianConnection({
      oauthBearerToken: 'test-oauth-token',
      oauthCloudId: '11111111-2222-3333-4444-555555555555',
      siteUrlHint: 'https://care-demo.atlassian.net',
    });

    await assert.rejects(
      () =>
        createJsmFollowUpRequestConfirmed({
          config: mockConfig,
          serviceDeskId: '1',
          requestTypeId: '10',
          summary: 'Confirm referral scheduling',
          minimalNote: 'Administrative follow-up',
          jsmConsentGranted: false,
          userConfirmed: true,
        }),
      (err: any) => err instanceof CareBridgeBoundaryError && err.code === 'JSM_CONSENT_REQUIRED'
    );

    await assert.rejects(
      () =>
        createJsmFollowUpRequestConfirmed({
          config: mockConfig,
          serviceDeskId: '1',
          requestTypeId: '10',
          summary: 'Confirm referral scheduling',
          minimalNote: 'Administrative follow-up',
          jsmConsentGranted: true,
          userConfirmed: false,
        }),
      (err: any) => err instanceof CareBridgeBoundaryError && err.code === 'USER_CONFIRMATION_REQUIRED'
    );

    // Mock JSM Service Desk REST API responses (explicit test fixture)
    const mockFetch: typeof fetch = async (url, init) => {
      const target = String(url);
      if (target.includes('/rest/servicedeskapi/request') && init?.method === 'POST') {
        return new Response(
          JSON.stringify({
            issueId: '3055',
            issueKey: 'CARE-88',
            serviceDeskId: '1',
            requestTypeId: '10',
            currentStatus: { status: 'Waiting for support' },
            createdDate: { iso8601: '2026-11-24T12:00:00Z' },
            _links: { web: 'https://care-demo.atlassian.net/servicedesk/customer/portal/1/CARE-88' },
          }),
          { status: 201 }
        );
      }
      if (target.includes('/rest/servicedeskapi/request/CARE-88')) {
        return new Response(
          JSON.stringify({
            issueId: '3055',
            issueKey: 'CARE-88',
            serviceDeskId: '1',
            requestTypeId: '10',
            requestFieldValues: [{ fieldId: 'summary', value: 'Confirm scheduling window' }],
            currentStatus: { status: 'In Progress' },
            _links: { web: 'https://care-demo.atlassian.net/servicedesk/customer/portal/1/CARE-88' },
          }),
          { status: 200 }
        );
      }
      if (target.includes('/rest/servicedeskapi/servicedesk')) {
        return new Response(JSON.stringify({ values: [] }), { status: 403 });
      }
      return new Response('{}', { status: 404 });
    };

    const created = await createJsmFollowUpRequestConfirmed({
      config: mockConfig,
      serviceDeskId: '1',
      requestTypeId: '10',
      summary: 'Confirm scheduling window',
      minimalNote: 'Non-emergency administrative referral coordination.',
      jsmConsentGranted: true,
      userConfirmed: true,
      fetchImpl: mockFetch,
    });
    assert.equal(created.issueKey, 'CARE-88');
    assert.equal(created.dataOrigin, 'live_jsm');
    assert.match(created.requestUrl, /CARE-88/);

    const fetched = await fetchJsmRequestByKey({
      config: mockConfig,
      issueKey: 'CARE-88',
      fetchImpl: mockFetch,
    });
    assert.equal(fetched.status, 'In Progress');

    await assert.rejects(
      () => fetchJsmServiceDesks({ config: mockConfig, fetchImpl: mockFetch }),
      (err: any) => err instanceof CareBridgeBoundaryError && err.statusCode === 403
    );

    const t = createCareTaskRecord('uid-1', {
      contextRef: 'Scheduling',
      description: 'Track referral confirmation',
      priority: 'routine',
      responsibleAssignee: 'Coordinator',
    });
    const linked = linkJsmRequestToCareTask(t, created, 'uid-1');
    assert.equal(linked.source.jsmRequestKey, 'CARE-88');
    assert.equal(linked.source.provenance, 'verified_source');
  });

  // 6. Confluence Permission Error & Excerpt Retrieval
  await test('Confluence search enforces consent and surfaces permission errors cleanly', async () => {
    const config = resolveCareBridgeAtlassianConnection({
      oauthBearerToken: 'test-token',
      oauthCloudId: '11111111-2222-3333-4444-555555555555',
    });

    await assert.rejects(
      () => searchConfluenceCareKnowledge({ config, queryText: 'transport', confluenceReadConsent: false }),
      (err: any) => err instanceof CareBridgeBoundaryError && err.code === 'CONFLUENCE_CONSENT_REQUIRED'
    );

    const mockConfFetch: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          results: [
            {
              id: '5511',
              title: 'Post-Discharge Scheduling Guide',
              space: { key: 'CARE', name: 'Care Playbooks' },
              excerpt: '<p>Call scheduling extension 4010 before Friday.</p>',
              _links: { webui: '/spaces/CARE/pages/5511' },
            },
          ],
        }),
        { status: 200 }
      );

    const pages = await searchConfluenceCareKnowledge({
      config,
      queryText: 'scheduling',
      confluenceReadConsent: true,
      fetchImpl: mockConfFetch,
    });
    assert.equal(pages.length, 1);
    assert.equal(pages[0].dataOrigin, 'live_confluence');
    assert.ok(!pages[0].excerpt.includes('<p>'));
  });

  // 7. Server-side Gemini Consent, Missing-Key Honesty & PII Scrubbing
  await test('Gemini CareBridge service scrubs PII, enforces consent, and handles missing API key cleanly', async () => {
    assert.equal(CAREBRIDGE_GEMINI_MODEL, 'gemini-4-hydrogen');
    const scrubbed = scrubIdentifiableDetailsForExternalAi(
      'Email patient@example.org, SSN 123-45-6789, MRN: AB9912'
    );
    assert.ok(!scrubbed.includes('patient@example.org'));
    assert.ok(!scrubbed.includes('123-45-6789'));
    assert.ok(!scrubbed.includes('AB9912'));

    await assert.rejects(
      () =>
        runCareBridgeAiAssist(
          {
            actionType: 'summarize-care-context',
            prompt: 'Summarize follow-up tasks',
            geminiConsentGranted: false,
            navigationContext: 'Post-Visit',
            tasks: [],
            knowledgePages: [],
          },
          null
        ),
      CareBridgeAiConsentError
    );

    await assert.rejects(
      () =>
        runCareBridgeAiAssist(
          {
            actionType: 'summarize-care-context',
            prompt: 'Summarize follow-up tasks',
            geminiConsentGranted: true,
            rovoConsentGranted: true,
            navigationContext: 'Post-Visit',
            tasks: [],
            knowledgePages: [],
          },
          null
        ),
      (err: any) => err instanceof CareBridgeAiUnavailableError && err.code === 'GEMINI_KEY_MISSING'
    );
  });

  // 8. Forge Core Service + Rovo 4 Actions Unit Tests (In-Memory Adapter Fixture)
  await test('Forge coreService and all 4 Rovo action handlers preserve non-diagnostic & unverified rules', async () => {
    const store = new Map<string, any>();
    const adapters: CareBridgeForgeAdapters = {
      getUserAccountId: () => 'atlassian-acc-777',
      kvsGet: async (k) => store.get(k),
      kvsSet: async (k, v) => {
        store.set(k, v);
      },
      fetchJsmServiceDesks: async () => [{ id: '1', projectKey: 'CARE', projectName: 'Care Desk', requestTypes: [{ id: '10', name: 'Follow-up' }] }],
      fetchJsmRequests: async () => [
        {
          issueId: '99',
          issueKey: 'CARE-99',
          serviceDeskId: '1',
          requestTypeId: '10',
          summary: 'Confirm mobility voucher',
          status: 'Open',
          createdDate: '2026-11-24T00:00:00Z',
          openUrl: '/servicedesk/customer/portal/1/CARE-99',
        },
      ],
      fetchJsmRequestByKey: async () => null,
      createJsmRequest: async (input) => ({
        issueId: '100',
        issueKey: 'CARE-100',
        serviceDeskId: input.serviceDeskId,
        requestTypeId: input.requestTypeId,
        summary: input.summary,
        status: 'Waiting for support',
        createdDate: '2026-11-24T01:00:00Z',
        openUrl: '/servicedesk/customer/portal/1/CARE-100',
      }),
      searchConfluencePages: async () => [
        {
          id: '701',
          title: 'Pre-Visit Paperwork Guide',
          spaceKey: 'CARE',
          excerpt: 'Bring ID and updated contact sheet.',
          openUrl: '/wiki/spaces/CARE/pages/701',
          updatedAt: '2026-11-24T00:00:00Z',
        },
      ],
      fetchConfluencePageById: async () => null,
    };

    const task = await recordCareTaskInForge(adapters, {
      contextRef: 'Clinic Transit',
      description: 'Confirm clinic check-in window.',
      priority: 'soon',
      responsibleAssignee: 'Care Coordinator',
    });
    assert.ok(task.id.startsWith('cb-task-'));

    await assert.rejects(
      () =>
        createJsmFollowUpConfirmedInForge(adapters, {
          serviceDeskId: '1',
          requestTypeId: '10',
          summary: 'Confirm clinic ride',
          description: 'Need morning pickup slot.',
          confirmedByUser: false,
        }),
      CareBridgeForgeError
    );

    const createdJsm = await createJsmFollowUpConfirmedInForge(adapters, {
      serviceDeskId: '1',
      requestTypeId: '10',
      summary: 'Confirm clinic ride',
      description: 'Need morning pickup slot.',
      confirmedByUser: true,
      taskIdToLink: task.id,
    });
    assert.equal(createdJsm.issueKey, 'CARE-100');

    const brief = await buildCareReentryBriefInForge(adapters, {});
    assert.equal(brief.aiGeneratedSuggestionUnconfirmed.humanReviewed, false);
    assert.ok(brief.verifiedSourceInformation.length >= 2);

    const r1 = await dispatchCareRovoAction(adapters, { actionKey: 'summarize-care-context' });
    const r2 = await dispatchCareRovoAction(adapters, { actionKey: 'retrieve-care-knowledge', query: 'paperwork' });
    const r3 = await dispatchCareRovoAction(adapters, { actionKey: 'summarize-followup-tasks' });
    const r4 = await dispatchCareRovoAction(adapters, { actionKey: 'prepare-care-handoff' });

    assert.match(r1.unverifiedBanner, /Unverified/);
    assert.equal((r2 as any).verifiedSourcePages.length, 1);
    assert.equal((r3 as any).userRecordedTasks.length, 1);
    assert.ok((r4 as any).brief.aiGeneratedSuggestionUnconfirmed);
  });

  // 9. Local Grounded Rovo Fallback Test
  await test('Local Rovo helper formats unverified non-diagnostic response cleanly', () => {
    const sample = createSamplePreviewBundle('uid-local');
    const out = buildLocalGroundedRovoOutput(
      'summarize-followup-tasks',
      'What tasks are due?',
      sample.tasks,
      sample.knowledgePages,
      sample.linkedRequests
    );
    assert.match(out.unverifiedBanner, /Unverified/);
    assert.match(out.nonClinicalNotice, /not a clinician/i);
    assert.equal(out.verifiedSourceFacts.length, 0);
    assert.equal(out.userRecordedFacts.length, 2);
  });

  // 10. Express API Smoke Test (/api/carebridge/*)
  await test('Express CareBridge routes handle status, unconsented requests, and AI consent cleanly', async () => {
    const app = express();
    app.use(express.json());
    registerCareBridgeRoutes(app, () => null);

    const server = await new Promise<http.Server>((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    try {
      const addr = server.address() as { port: number };
      const base = `http://127.0.0.1:${addr.port}`;

      const statusRes = await fetch(`${base}/api/carebridge/status`);
      assert.equal(statusRes.status, 200);
      const statusJson = (await statusRes.json()) as any;
      assert.equal(statusJson.module, 'carebridge');
      assert.equal(statusJson.defaultSiteUrl, 'https://zenieverse.atlassian.net');
      assert.equal(statusJson.defaultServiceDeskId, '2');
      assert.equal(statusJson.defaultRequestTypeId, '5');
      assert.equal(typeof statusJson.atlassianConfigured, 'boolean');

      const aiBlockedRes = await fetch(`${base}/api/carebridge/ai/assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geminiConsentGranted: false, tasks: [], knowledgePages: [] }),
      });
      assert.equal(aiBlockedRes.status, 403);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  // 11. Firestore Blueprint & Rules Check
  await test('Firestore blueprint & rules declare owner-isolated carebridge_* collections and immutable audit logs', () => {
    const bp = fs.readFileSync(path.resolve('firebase-blueprint.json'), 'utf8');
    const rules = fs.readFileSync(path.resolve('firestore.rules'), 'utf8');

    for (const col of ['carebridge_tasks', 'carebridge_briefs', 'carebridge_consents', 'carebridge_integrations', 'carebridge_audit_logs']) {
      assert.ok(bp.includes(col), `Missing ${col} in firebase-blueprint.json`);
      assert.ok(rules.includes(col), `Missing ${col} in firestore.rules`);
    }
    assert.match(rules, /match \/carebridge_audit_logs\/\{logId\}[\s\S]*?allow update, delete: if false;/);
  });

  // 12. Read-Only Atlassian Connection Verification, Redirect/Host Locks & Zero Credential Exposure
  await test('Read-only Atlassian verifier checks Desk 2 (CareBridge2 / CR2), creatable Request Type 5, host/redirect lock, and all 4 states', async () => {
    assert.equal(validateCareBridgeSiteUrl('"https://zenieverse.atlassian.net/servicedesk/customer/portal/2"'), 'https://zenieverse.atlassian.net');
    assert.equal(validateCareBridgeSiteUrl('zenieverse.atlassian.net'), 'https://zenieverse.atlassian.net');
    assert.throws(() => validateCareBridgeSiteUrl('http://zenieverse.atlassian.net'), CareBridgeBoundaryError);
    assert.throws(() => validateCareBridgeSiteUrl('https://zenieverse.atlassian.com'), CareBridgeBoundaryError);

    // safeAtlassianFetch blocks unapproved hosts and HTTP 302 redirects
    await assert.rejects(
      () => safeAtlassianFetch('https://evil.example.com/rest/api/3/myself', { method: 'GET' }),
      (err: any) => err instanceof CareBridgeBoundaryError && err.code === 'UNAPPROVED_ATLASSIAN_HOST'
    );
    await assert.rejects(
      () =>
        safeAtlassianFetch(
          'https://zenieverse.atlassian.net/rest/api/3/myself',
          { method: 'GET' },
          async () => new Response(null, { status: 302, headers: { location: 'https://evil.example.com' } })
        ),
      (err: any) => err instanceof CareBridgeBoundaryError && err.code === 'UNAPPROVED_REDIRECT_BLOCKED'
    );

    const scrubbed = sanitizeCareBridgeErrorText('Authorization: Basic abc123= user doctor@clinic.org failed');
    assert.ok(!scrubbed.includes('abc123'));
    assert.ok(!scrubbed.includes('doctor@clinic.org'));

    const mockEnv = {
      ATLASSIAN_SITE_URL: process.env.ATLASSIAN_SITE_URL,
      ATLASSIAN_EMAIL: process.env.ATLASSIAN_EMAIL,
      ATLASSIAN_API_TOKEN: process.env.ATLASSIAN_API_TOKEN,
    };

    try {
      // State: Unavailable when missing or malformed site URL
      process.env.ATLASSIAN_SITE_URL = 'https://zenieverse.atlassian.com';
      process.env.ATLASSIAN_EMAIL = 'secret-admin@zenieverse.test';
      process.env.ATLASSIAN_API_TOKEN = 'SUPER_SECRET_API_TOKEN_999';
      const badSiteReport = await verifyCareBridgeAtlassianConnection();
      assert.equal(badSiteReport.status, 'Unavailable');
      assert.match(badSiteReport.safeError || '', /\.atlassian\.com/);
      assert.ok(!JSON.stringify(badSiteReport).includes('SUPER_SECRET_API_TOKEN_999'));

      process.env.ATLASSIAN_SITE_URL = 'https://zenieverse.atlassian.net';
      const conn = resolveCareBridgeAtlassianConnection();
      assert.equal(conn.mode, 'live_env');
      assert.ok(!JSON.stringify(conn.accountLabel || '').includes('secret-admin@zenieverse.test'));

      let sawPost = false;
      const connectedFetch: typeof fetch = async (url, init) => {
        if ((init?.method || 'GET').toUpperCase() !== 'GET') sawPost = true;
        const target = String(url);
        if (target.endsWith('/rest/api/3/myself')) {
          return new Response(JSON.stringify({ accountId: 'acc-1', accountType: 'atlassian', active: true, emailAddress: 'secret-admin@zenieverse.test' }), { status: 200 });
        }
        if (target.includes('/rest/servicedeskapi/servicedesk?limit=')) {
          return new Response(JSON.stringify({ values: [{ id: '2', projectKey: 'CR2', projectName: 'CareBridge2' }] }), { status: 200 });
        }
        if (target.endsWith('/rest/servicedeskapi/servicedesk/2')) {
          return new Response(JSON.stringify({ id: '2', projectKey: 'CR2', projectName: 'CareBridge2' }), { status: 200 });
        }
        if (target.includes('/rest/servicedeskapi/servicedesk/2/requesttype/5/field')) {
          return new Response(JSON.stringify({ canCreateRequest: true, requestTypeFields: [{ fieldId: 'summary', required: true }] }), { status: 200 });
        }
        if (target.includes('/rest/servicedeskapi/servicedesk/2/requesttype')) {
          return new Response(JSON.stringify({ values: [{ id: '5', name: 'Submit a request or incident' }] }), { status: 200 });
        }
        if (target.includes('/rest/api/3/mypermissions')) {
          return new Response(JSON.stringify({ permissions: { BROWSE_PROJECTS: { havePermission: true }, CREATE_ISSUES: { havePermission: true } } }), { status: 200 });
        }
        if (target.includes('/rest/servicedeskapi/request')) {
          return new Response(JSON.stringify({ values: [] }), { status: 200 });
        }
        return new Response('{}', { status: 404 });
      };

      // State: Connected
      const okReport = await verifyCareBridgeAtlassianConnection({ fetchImpl: connectedFetch });
      assert.equal(sawPost, false, 'Verification must NEVER send POST requests');
      assert.equal(okReport.status, 'Connected');
      assert.equal(okReport.allChecksPassed, true);
      assert.equal(okReport.actualProjectKey, 'CR2');
      assert.equal(okReport.actualServiceDeskName, 'CareBridge2');
      assert.equal(okReport.actualRequestTypeName, 'Submit a request or incident');
      assert.equal(okReport.requestTypeCreatable, true);
      assert.equal(okReport.accessibleServiceDeskCount, 1);
      const okSerialized = JSON.stringify(okReport);
      assert.ok(!okSerialized.includes('secret-admin@zenieverse.test'));
      assert.ok(!okSerialized.includes('SUPER_SECRET_API_TOKEN_999'));

      // Non-creatable request type is rejected cleanly
      const notCreatableReport = await verifyCareBridgeAtlassianConnection({
        fetchImpl: async (url, init) => {
          const target = String(url);
          if (target.includes('/rest/servicedeskapi/servicedesk/2/requesttype/5/field')) {
            return new Response(JSON.stringify({ canCreateRequest: false, requestTypeFields: [] }), { status: 200 });
          }
          return connectedFetch(url, init);
        },
      });
      assert.equal(notCreatableReport.allChecksPassed, false);
      assert.equal(notCreatableReport.requestTypeCreatable, false);

      // Mismatched projectName fails desk check
      const wrongNameReport = await verifyCareBridgeAtlassianConnection({
        fetchImpl: async (url, init) => {
          const target = String(url);
          if (target.endsWith('/rest/servicedeskapi/servicedesk/2')) {
            return new Response(JSON.stringify({ id: '2', projectKey: 'CR2', projectName: 'OtherProject' }), { status: 200 });
          }
          return connectedFetch(url, init);
        },
      });
      assert.equal(wrongNameReport.status, 'Unavailable');
      assert.equal(wrongNameReport.allChecksPassed, false);

      // State: Unauthorized
      const unauthReport = await verifyCareBridgeAtlassianConnection({
        fetchImpl: async () => new Response('{}', { status: 401 }),
      });
      assert.equal(unauthReport.status, 'Unauthorized');
      assert.equal(unauthReport.allChecksPassed, false);

      // State: Permission Denied
      const deniedReport = await verifyCareBridgeAtlassianConnection({
        fetchImpl: async (url) => {
          const t = String(url);
          if (t.endsWith('/rest/api/3/myself')) return new Response(JSON.stringify({ accountId: 'a1', active: true }), { status: 200 });
          if (t.includes('/rest/servicedeskapi/servicedesk?limit=')) return new Response(JSON.stringify({ values: [{ id: '2', projectKey: 'CR2', projectName: 'CareBridge2' }] }), { status: 200 });
          if (t.endsWith('/rest/servicedeskapi/servicedesk/2')) return new Response(JSON.stringify({ id: '2', projectKey: 'CR2', projectName: 'CareBridge2' }), { status: 200 });
          if (t.includes('/requesttype?limit=')) return new Response(JSON.stringify({ values: [{ id: '5', name: 'Submit a request or incident' }] }), { status: 200 });
          if (t.includes('/field')) return new Response(JSON.stringify({ canCreateRequest: true, requestTypeFields: [] }), { status: 200 });
          return new Response('{}', { status: 403 });
        },
      });
      assert.equal(deniedReport.status, 'Permission Denied');
    } finally {
      if (mockEnv.ATLASSIAN_SITE_URL === undefined) delete process.env.ATLASSIAN_SITE_URL;
      else process.env.ATLASSIAN_SITE_URL = mockEnv.ATLASSIAN_SITE_URL;
      if (mockEnv.ATLASSIAN_EMAIL === undefined) delete process.env.ATLASSIAN_EMAIL;
      else process.env.ATLASSIAN_EMAIL = mockEnv.ATLASSIAN_EMAIL;
      if (mockEnv.ATLASSIAN_API_TOKEN === undefined) delete process.env.ATLASSIAN_API_TOKEN;
      else process.env.ATLASSIAN_API_TOKEN = mockEnv.ATLASSIAN_API_TOKEN;
    }
  });

  // 13. Unified Client + Server PHI Detection & Redaction Across All Required Categories
  await test('Shared PHI guard detects and redacts SSN, MRN, DOB, contacts, diagnoses, labs, and measurements without false-blocking synthetic disclaimer', () => {
    const samples: Array<{ label: string; text: string; expectedCat: string }> = [
      { label: 'SSN', text: 'SSN 123-45-6789 on file', expectedCat: 'ssn' },
      { label: 'MRN labeled', text: 'Patient MRN: AB-90421 needs reschedule', expectedCat: 'mrn' },
      { label: 'MRN unlabeled compact', text: 'Chart ref MRN99412 pending', expectedCat: 'mrn' },
      { label: 'DOB', text: 'DOB: 04/19/1982 appointment', expectedCat: 'dob' },
      { label: 'Email & phone & address', text: 'Call (415) 555-0199 or mail 742 Evergreen Terrace, patient@clinic.org', expectedCat: 'contact_info' },
      { label: 'Diagnosis', text: 'Patient diagnosed with Type 2 Diabetes Mellitus E11.9', expectedCat: 'diagnosis' },
      { label: 'Lab result', text: 'HbA1c 7.9 and eGFR 52 mL/min', expectedCat: 'lab_result' },
      { label: 'Clinical measurement', text: 'BP 148/92 mmHg, SpO2 97%, HR 84 bpm', expectedCat: 'clinical_measurement' },
    ];

    for (const s of samples) {
      const scan = scanAndRedactCareBridgePhi(s.text);
      assert.equal(scan.safe, false, `Expected PHI block for ${s.label}`);
      assert.ok(scan.categories.includes(s.expectedCat as any), `Expected category ${s.expectedCat} for ${s.label}`);
      assert.ok(scan.redactedText.includes('[REDACTED_'), `Expected redacted placeholder for ${s.label}`);
      const clientCheck = checkCareBridgeDataMinimization(s.text);
      assert.equal(clientCheck.safe, false, `Client check must also block ${s.label}`);
    }

    const combined = 'MRN 77211 DOB 1980-05-12 HbA1c 8.1 BP 150/95 mmHg john@example.com';
    const combinedScan = scanAndRedactCareBridgePhi(combined);
    assert.equal(combinedScan.safe, false);
    assert.ok(!combinedScan.redactedText.includes('77211'));
    assert.ok(!combinedScan.redactedText.includes('1980-05-12'));
    assert.ok(!combinedScan.redactedText.includes('john@example.com'));

    const disclaimer =
      'This is a controlled CareBridge integration test. It contains no real patient information, diagnosis, medical record number, contact details or clinical measurements.';
    assert.equal(scanAndRedactCareBridgePhi(disclaimer).safe, true);
    assert.equal(checkCareBridgeDataMinimization(disclaimer).safe, true);
  });

  // 14. Timeouts, Safe GET-Only Retries, and Zero Automatic Retries on POST/PUT
  await test('safeAtlassianFetch enforces timeouts, retries transient 503 on GET once, and never retries POST writes', async () => {
    let getAttempts = 0;
    const retriedResp = await safeAtlassianFetch(
      'https://zenieverse.atlassian.net/rest/servicedeskapi/request/CR2-1',
      { method: 'GET' },
      async () => {
        getAttempts += 1;
        if (getAttempts === 1) return new Response('bad gateway', { status: 503 });
        return new Response(JSON.stringify({ issueKey: 'CR2-1', currentStatus: { status: 'To Do' } }), { status: 200 });
      },
      { maxGetRetries: 1, timeoutMs: 2000 }
    );
    assert.equal(retriedResp.status, 200);
    assert.equal(getAttempts, 2, 'Idempotent GET should retry once on 503');

    let postAttempts = 0;
    const postResp = await safeAtlassianFetch(
      'https://zenieverse.atlassian.net/rest/servicedeskapi/request/CR2-1/comment',
      { method: 'POST', body: '{}' },
      async () => {
        postAttempts += 1;
        return new Response('upstream busy', { status: 503 });
      },
      { maxGetRetries: 1, timeoutMs: 2000 }
    );
    assert.equal(postResp.status, 503);
    assert.equal(postAttempts, 1, 'State-changing POST must NEVER retry automatically');

    await assert.rejects(
      () =>
        safeAtlassianFetch(
          'https://zenieverse.atlassian.net/rest/servicedeskapi/request/CR2-1',
          { method: 'GET' },
          (_url, init) =>
            new Promise<Response>((_resolve, reject) => {
              init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
            }),
          { maxGetRetries: 0, timeoutMs: 100 }
        ),
      (err: any) => err instanceof CareBridgeBoundaryError && err.code === 'ATLASSIAN_TIMEOUT' && err.statusCode === 504
    );
  });

  // 15. Server-Enforced Consent, Auth, Ownership Isolation, Preview/Approval Gate, Idempotency & Sanitized Audit
  await test('Follow-up endpoints enforce auth, default-off/revocable/expiring consent, human approval, duplicate prevention, and privacy audit logs', async () => {
    const mockEnv = {
      ATLASSIAN_SITE_URL: process.env.ATLASSIAN_SITE_URL,
      ATLASSIAN_EMAIL: process.env.ATLASSIAN_EMAIL,
      ATLASSIAN_API_TOKEN: process.env.ATLASSIAN_API_TOKEN,
    };
    process.env.ATLASSIAN_SITE_URL = 'https://zenieverse.atlassian.net';
    process.env.ATLASSIAN_EMAIL = 'test-ops@zenieverse.test';
    process.env.ATLASSIAN_API_TOKEN = 'SECRET_TEST_TOKEN_ABC';

    let postCommentCalls = 0;
    const mockAtlassianFetch: typeof fetch = async (url, init) => {
      const target = String(url);
      const method = (init?.method || 'GET').toUpperCase();
      if (target.endsWith('/rest/servicedeskapi/request/CR2-1') && method === 'GET') {
        return new Response(
          JSON.stringify({
            issueId: '10001',
            issueKey: 'CR2-1',
            serviceDeskId: '2',
            requestTypeId: '5',
            requestFieldValues: [{ fieldId: 'summary', value: '[CAREBRIDGE TEST] Synthetic integration verification — no patient data' }],
            currentStatus: { status: 'In Progress' },
            createdDate: { iso8601: '2026-11-26T06:00:00Z' },
            _links: { web: 'https://zenieverse.atlassian.net/servicedesk/customer/portal/2/CR2-1' },
          }),
          { status: 200 }
        );
      }
      if (target.endsWith('/rest/servicedeskapi/request/CR2-404') && method === 'GET') {
        return new Response('{}', { status: 404 });
      }
      if (target.endsWith('/rest/api/3/issue/CR2-1/transitions') && method === 'GET') {
        return new Response(JSON.stringify({ transitions: [{ id: '21', name: 'In Progress' }] }), { status: 200 });
      }
      if (target.endsWith('/rest/servicedeskapi/request/CR2-1/comment') && method === 'POST') {
        postCommentCalls += 1;
        return new Response(JSON.stringify({ id: 'c-1', body: 'Administrative follow-up' }), { status: 201 });
      }
      return new Response('{}', { status: 404 });
    };

    const store = new CareBridgeFollowupStore();
    const app = express();
    app.use(express.json());
    registerCareBridgeRoutes(app, () => null, {
      store,
      fetchImpl: mockAtlassianFetch,
      authVerifier: async (token) => {
        if (token === 'token-user-1') return { sub: 'uid-user-1' };
        if (token === 'token-user-2') return { sub: 'uid-user-2' };
        throw new Error('Bad token');
      },
    });

    const server = await new Promise<http.Server>((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });

    try {
      const addr = server.address() as { port: number };
      const base = `http://127.0.0.1:${addr.port}`;

      // A. Unauthenticated requests strictly rejected (401)
      const unauthConsent = await fetch(`${base}/api/carebridge/consent/followup`);
      assert.equal(unauthConsent.status, 401);
      const unauthStatus = await fetch(`${base}/api/carebridge/followup/requests/CR2-1`);
      assert.equal(unauthStatus.status, 401);
      const unauthAudit = await fetch(`${base}/api/carebridge/followup/audit`);
      assert.equal(unauthAudit.status, 401);

      // B. Default consent is false and blocks follow-up lookup (403 Consent required)
      const defConsentRes = await fetch(`${base}/api/carebridge/consent/followup`, {
        headers: { Authorization: 'Bearer token-user-1' },
      });
      assert.equal(defConsentRes.status, 200);
      const defConsentJson = (await defConsentRes.json()) as any;
      assert.equal(defConsentJson.consent.granted, false);
      assert.equal(defConsentJson.policyVersion, CAREBRIDGE_FOLLOWUP_POLICY_VERSION);

      const blockedBeforeConsent = await fetch(`${base}/api/carebridge/followup/requests/CR2-1`, {
        headers: { Authorization: 'Bearer token-user-1' },
      });
      assert.equal(blockedBeforeConsent.status, 403);
      const blockedJson = (await blockedBeforeConsent.json()) as any;
      assert.equal(blockedJson.uiState, 'Consent required');

      // C. Grant explicit follow-up consent -> CR2-1 read-only status succeeds & compares against 'To Do' baseline
      const grantRes = await fetch(`${base}/api/carebridge/consent/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token-user-1' },
        body: JSON.stringify({ action: 'grant', ttlHours: 24 }),
      });
      assert.equal(grantRes.status, 200);
      const grantJson = (await grantRes.json()) as any;
      assert.equal(grantJson.consent.granted, true);
      assert.ok(grantJson.consent.grantedAt);
      assert.ok(grantJson.consent.expiresAt);

      const okStatusRes = await fetch(`${base}/api/carebridge/followup/requests/CR2-1`, {
        headers: { Authorization: 'Bearer token-user-1' },
      });
      assert.equal(okStatusRes.status, 200);
      const okStatus = (await okStatusRes.json()) as any;
      assert.equal(okStatus.uiState, 'Follow-up available');
      assert.equal(okStatus.requestKey, 'CR2-1');
      assert.equal(okStatus.lastVerifiedStatus, 'In Progress');
      assert.equal(okStatus.previousVerifiedStatus, 'To Do');
      assert.equal(okStatus.statusChanged, true);

      // D. 404 Request not found mapping
      const notFoundRes = await fetch(`${base}/api/carebridge/followup/requests/CR2-404`, {
        headers: { Authorization: 'Bearer token-user-1' },
      });
      assert.equal(notFoundRes.status, 404);
      const notFoundJson = (await notFoundRes.json()) as any;
      assert.equal(notFoundJson.uiState, 'Request not found');

      // E. Preview PHI guard blocks sensitive patient details
      const phiPreviewRes = await fetch(`${base}/api/carebridge/followup/actions/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token-user-1' },
        body: JSON.stringify({
          requestKey: 'CR2-1',
          actionType: 'comment',
          bodyText: 'Patient MRN 994412 DOB 02/14/1988 HbA1c 8.4%',
        }),
      });
      assert.equal(phiPreviewRes.status, 403);

      // F. Clean preview -> missing humanApproved rejected -> approved execution succeeds -> duplicate prevented
      const cleanPreviewRes = await fetch(`${base}/api/carebridge/followup/actions/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token-user-1' },
        body: JSON.stringify({
          requestKey: 'CR2-1',
          actionType: 'comment',
          bodyText: 'Requesting administrative schedule confirmation.',
        }),
      });
      assert.equal(cleanPreviewRes.status, 200);
      const previewObj = ((await cleanPreviewRes.json()) as any).preview;
      assert.ok(previewObj.previewId);

      // Unapproved execution must fail cleanly without calling Atlassian
      const unapprovedExec = await fetch(`${base}/api/carebridge/followup/actions/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token-user-1' },
        body: JSON.stringify({
          previewId: previewObj.previewId,
          requestKey: 'CR2-1',
          actionType: 'comment',
          bodyText: 'Requesting administrative schedule confirmation.',
          humanApproved: false,
        }),
      });
      assert.equal(unapprovedExec.status, 400);
      assert.equal(postCommentCalls, 0);

      // Cross-user execution with user 1's preview blocked cleanly (after user 2 grants own consent)
      await fetch(`${base}/api/carebridge/consent/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token-user-2' },
        body: JSON.stringify({ action: 'grant' }),
      });
      const crossUserExec = await fetch(`${base}/api/carebridge/followup/actions/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token-user-2' },
        body: JSON.stringify({
          previewId: previewObj.previewId,
          requestKey: 'CR2-1',
          actionType: 'comment',
          bodyText: 'Requesting administrative schedule confirmation.',
          humanApproved: true,
        }),
      });
      assert.equal(crossUserExec.status, 403);

      // Approved execution succeeds once
      const approvedExec = await fetch(`${base}/api/carebridge/followup/actions/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token-user-1' },
        body: JSON.stringify({
          previewId: previewObj.previewId,
          idempotencyKey: 'idem-key-1',
          requestKey: 'CR2-1',
          actionType: 'comment',
          bodyText: 'Requesting administrative schedule confirmation.',
          humanApproved: true,
        }),
      });
      assert.equal(approvedExec.status, 200);
      const execJson = ((await approvedExec.json()) as any).result;
      assert.equal(execJson.executed, true);
      assert.equal(execJson.duplicatePrevented, false);
      assert.equal(postCommentCalls, 1);

      // Duplicate submission prevented via idempotency key AND single-use preview guard
      const dupIdemRes = await fetch(`${base}/api/carebridge/followup/actions/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token-user-1' },
        body: JSON.stringify({
          previewId: previewObj.previewId,
          idempotencyKey: 'idem-key-1',
          requestKey: 'CR2-1',
          actionType: 'comment',
          bodyText: 'Requesting administrative schedule confirmation.',
          humanApproved: true,
        }),
      });
      assert.equal(dupIdemRes.status, 200);
      const dupJson = ((await dupIdemRes.json()) as any).result;
      assert.equal(dupJson.duplicatePrevented, true);
      assert.equal(postCommentCalls, 1, 'Atlassian comment endpoint must NOT be called twice');

      // G. AI follow-up draft returns clearly labeled human-review draft even without Gemini key
      const aiDraftRes = await fetch(`${base}/api/carebridge/followup/ai-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token-user-1' },
        body: JSON.stringify({
          requestKey: 'CR2-1',
          currentStatus: 'In Progress',
          summary: 'Scheduling follow-up',
          geminiConsentGranted: true,
        }),
      });
      assert.equal(aiDraftRes.status, 200);
      const aiDraft = ((await aiDraftRes.json()) as any).draft;
      assert.equal(aiDraft.isDraft, true);
      assert.equal(aiDraft.requiresHumanReview, true);
      assert.match(aiDraft.unverifiedBanner, /Requires Human Review/);

      // H. Cross-user audit access blocked (403); owner audit contains zero secrets/PHI
      const crossAuditRes = await fetch(`${base}/api/carebridge/followup/audit?userId=uid-user-1`, {
        headers: { Authorization: 'Bearer token-user-2' },
      });
      assert.equal(crossAuditRes.status, 403);

      const ownerAuditRes = await fetch(`${base}/api/carebridge/followup/audit`, {
        headers: { Authorization: 'Bearer token-user-1' },
      });
      assert.equal(ownerAuditRes.status, 200);
      const ownerAudit = (await ownerAuditRes.json()) as any;
      assert.ok(ownerAudit.events.length >= 6);
      const auditSerialized = JSON.stringify(ownerAudit.events);
      assert.ok(!auditSerialized.includes('SECRET_TEST_TOKEN_ABC'));
      assert.ok(!auditSerialized.includes('994412'));
      assert.ok(!auditSerialized.includes('02/14/1988'));

      // I. Withdraw consent immediately re-blocks follow-up endpoints
      const withdrawRes = await fetch(`${base}/api/carebridge/consent/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token-user-1' },
        body: JSON.stringify({ action: 'withdraw' }),
      });
      assert.equal(withdrawRes.status, 200);
      const afterWithdraw = await fetch(`${base}/api/carebridge/followup/requests/CR2-1`, {
        headers: { Authorization: 'Bearer token-user-1' },
      });
      assert.equal(afterWithdraw.status, 403);

      // J. Expired consent is rejected on follow-up check (no blanket permanent grant)
      store.grantConsent({
        userId: 'uid-expired',
        expiresAtOverride: '2020-01-01T00:00:00.000Z',
      });
      assert.throws(
        () => store.assertActiveFollowUpConsent('uid-expired', 'CR2-1'),
        (err: any) => err.code === 'FOLLOWUP_CONSENT_REQUIRED'
      );
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      if (mockEnv.ATLASSIAN_SITE_URL === undefined) delete process.env.ATLASSIAN_SITE_URL;
      else process.env.ATLASSIAN_SITE_URL = mockEnv.ATLASSIAN_SITE_URL;
      if (mockEnv.ATLASSIAN_EMAIL === undefined) delete process.env.ATLASSIAN_EMAIL;
      else process.env.ATLASSIAN_EMAIL = mockEnv.ATLASSIAN_EMAIL;
      if (mockEnv.ATLASSIAN_API_TOKEN === undefined) delete process.env.ATLASSIAN_API_TOKEN;
      else process.env.ATLASSIAN_API_TOKEN = mockEnv.ATLASSIAN_API_TOKEN;
    }
  });

  console.log(`\nALL CAREBRIDGE TESTS PASSED (${passed}/${passed}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
