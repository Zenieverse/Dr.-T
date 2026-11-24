// ============================================================================
// HATBRIDGE — COMPREHENSIVE VERIFICATION SUITE (PHASE 5)
// Run via: npm run test:hatbridge
// Covers:
//   - Dr. T navigation & existing-module preservation
//   - Deterministic Re-entry Brief grounding & missing-context honesty
//   - Cross-role conflict detection & daily workload calculation
//   - Decision Memory Q&A & privacy filtering
//   - Server-side Gemini consent & missing-key honesty
//   - Atlassian SSRF protection, private_personal isolation, confirmation gate
//   - Forge manifest, Forge resolver coreService, Rovo actions & permissions
//   - Firestore blueprint & owner-isolation rules checks
// ============================================================================

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import http from 'node:http';

import {
  answerDecisionMemoryQuestion,
  buildDeterministicReentryBrief,
  buildDraftHandoffFromRole,
  calculateDailyWorkload,
  computeHatBridgeAnalytics,
  detectCrossRoleConflicts,
  MISSING_CONTEXT_TEXT,
} from '../src/components/hatbridge/utils/hatbridgeEngine';
import {
  buildSampleWorkflowDataset,
  HATBRIDGE_PLAN_TIERS,
  HATBRIDGE_STARTER_PACKS,
} from '../src/components/hatbridge/data/hatbridgeStarters';
import {
  HATBRIDGE_GEMINI_MODEL,
  HatBridgeAiConsentError,
  HatBridgeAiUnavailableError,
  runHatBridgeGeminiReasoning,
} from '../src/server/hatbridgeAiService';
import {
  assertWorkplaceExportAllowed,
  AtlassianBoundaryError,
  createJiraIssueConfirmed,
  fetchJiraWorkspaceIssues,
  resolveAtlassianConnection,
  searchConfluenceWorkspacePages,
  validateAtlassianSiteUrl,
} from '../src/server/hatbridgeAtlassianService';
import { registerHatBridgeRoutes } from '../src/server/hatbridgeService';
import {
  buildGroundedForgeReentryBrief,
  captureJiraOrConfluenceContext,
  createJiraIssueFromForgeConfirmed,
  ForgeAdapters,
  ForgeConfluencePageSummary,
  ForgeJiraIssueSummary,
  linkJiraIssueToRole,
  removeCapturedContextItem,
  saveWorkplaceDecision,
  saveWorkplaceHandoff,
} from '../apps/hatbridge-forge/src/coreService';
import { ForgeBoundaryError } from '../apps/hatbridge-forge/src/privacyGuard';
import { dispatchRovoActionWithAdapters } from '../apps/hatbridge-forge/src/rovoCore';

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
  console.log('Running HatBridge Verification Suite...');

  // 1. Navigation & Preservation Checks
  await test('Dr. T navigation & preservation: types, Navbar, CommandPalette, App.tsx', () => {
    const typesSrc = fs.readFileSync(path.resolve('src/types.ts'), 'utf8');
    const navbarSrc = fs.readFileSync(path.resolve('src/components/layout/Navbar.tsx'), 'utf8');
    const cmdSrc = fs.readFileSync(path.resolve('src/components/layout/CommandPalette.tsx'), 'utf8');
    const appSrc = fs.readFileSync(path.resolve('src/App.tsx'), 'utf8');

    assert.match(typesSrc, /\| 'hatbridge'/);
    assert.match(typesSrc, /\| 'threehats'/);
    assert.match(typesSrc, /\| 'living-sound-garden'/);
    assert.match(navbarSrc, /id: 'hatbridge'/);
    assert.match(navbarSrc, /id: 'threehats'/);
    assert.match(navbarSrc, /id: 'population-health'/);
    assert.match(cmdSrc, /setActiveTab\('hatbridge'\)/);
    assert.match(appSrc, /HatBridgeModule/);
    assert.match(appSrc, /ThreeHatsModule/);
    assert.match(appSrc, /LivingSoundGardenModule/);
  });

  // 2. Starter packs & isolated sample workflow
  await test('Starter packs provide both clinical_academic and general_professional templates cleanly', () => {
    const clinical = HATBRIDGE_STARTER_PACKS.filter((p) => p.pack === 'clinical_academic');
    const general = HATBRIDGE_STARTER_PACKS.filter((p) => p.pack === 'general_professional');
    assert.ok(clinical.length >= 9, 'Expected rich clinical/academic hat templates');
    assert.ok(general.length >= 4, 'Expected general professional hat templates');
    assert.equal(HATBRIDGE_PLAN_TIERS.length, 3, 'Expected 3 subscription-ready tiers');
    const sample = buildSampleWorkflowDataset('user-123');
    assert.ok(sample.roles.length >= 4);
    assert.ok(sample.contextItems.some((i) => i.capturedVia === 'sample_workflow'));
  });

  // 3. Deterministic Re-entry Brief grounding + honest missing context
  await test('Re-entry Brief answers 8 questions from saved context and stays honest when context is missing', () => {
    const sample = buildSampleWorkflowDataset('user-123');
    const deanRole = sample.roles.find((r) => r.id === 'hb-role-university-dean')!;
    const brief = buildDeterministicReentryBrief({
      userId: 'user-123',
      role: deanRole,
      contextItems: sample.contextItems,
      decisions: sample.decisions,
      handoffs: sample.handoffs,
      timeBlocks: sample.timeBlocks,
    });

    assert.equal(brief.roleId, deanRole.id);
    assert.ok(brief.whatWasWorkingOn !== MISSING_CONTEXT_TEXT);
    assert.ok(
      brief.decisionsAlreadyMade.toLowerCase().includes('simulation') ||
        brief.decisionsAlreadyMade.toLowerCase().includes('option b')
    );
    assert.ok(brief.sourceReferences.length >= 1);

    const emptyRole = {
      ...deanRole,
      id: 'hb-role-empty',
      name: 'Empty Role',
      description: '',
      goals: [],
      currentPriorities: [],
      relatedTasks: [],
      relatedDocuments: [],
      relevantContacts: [],
      activeProjects: [],
      recentDecisions: [],
      unfinishedWork: [],
    };
    const emptyBrief = buildDeterministicReentryBrief({
      userId: 'user-123',
      role: emptyRole,
      contextItems: [],
      decisions: [],
      handoffs: [],
      timeBlocks: [],
    });
    assert.equal(emptyBrief.whatWasWorkingOn, MISSING_CONTEXT_TEXT);
    assert.equal(emptyBrief.decisionsAlreadyMade, MISSING_CONTEXT_TEXT);
    assert.equal(emptyBrief.nextMeaningfulAction, MISSING_CONTEXT_TEXT);
    assert.ok(emptyBrief.missingInformation.length >= 6);
  });

  // 4. Cross-role conflict detection & workload calculation
  await test('Cross-role conflict detection flags protected-time overlap without auto-rescheduling', () => {
    const sample = buildSampleWorkflowDataset('user-123');
    const beforeBlocks = JSON.stringify(sample.timeBlocks);
    const conflicts = detectCrossRoleConflicts({
      contextItems: sample.contextItems,
      timeBlocks: sample.timeBlocks,
      roles: sample.roles,
    });
    assert.ok(conflicts.length >= 1, 'Expected at least 1 overlap conflict with protected family dinner');
    assert.equal(conflicts[0].involvesProtectedTime, true);
    assert.equal(JSON.stringify(sample.timeBlocks), beforeBlocks, 'Must never mutate/auto-reschedule user time blocks');

    const workload = calculateDailyWorkload({
      date: sample.timeBlocks[0].date,
      contextItems: sample.contextItems,
      timeBlocks: sample.timeBlocks,
      sustainableDailyHours: 8,
    });
    assert.ok(workload.committedMinutes > 0);
    assert.ok(workload.protectedMinutes >= 120);
  });

  // 5. Decision Memory search, privacy boundaries, handoffs, & analytics opt-in
  await test('Decision Memory Q&A filters private_personal when disallowed and cites sources', () => {
    const sample = buildSampleWorkflowDataset('user-123');
    sample.decisions.push({
      id: 'hb-dec-private',
      userId: 'user-123',
      roleId: 'hb-role-mother',
      title: 'Private Pediatric Therapy Choice',
      decision: 'Approved private pediatric therapy schedule',
      reasoning: 'Private family decision regarding scheduling.',
      decisionDate: '2026-11-20',
      responsiblePerson: 'Dr. T',
      source: 'Private Family Note',
      status: 'confirmed',
      privacyLevel: 'private_personal',
      revisions: [{ timestamp: new Date().toISOString(), summary: 'Saved', editor: 'Owner' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const restrictedAns = answerDecisionMemoryQuestion({
      question: 'Why did we choose pediatric therapy?',
      decisions: sample.decisions,
      roles: sample.roles,
      allowPrivatePersonal: false,
    });
    assert.equal(restrictedAns.sourceReferences.length, 0);
    assert.ok(restrictedAns.missingInformation.length >= 1);

    const allowedAns = answerDecisionMemoryQuestion({
      question: 'simulation lab expansion',
      decisions: sample.decisions,
      roles: sample.roles,
      allowPrivatePersonal: false,
    });
    assert.ok(allowedAns.sourceReferences.length >= 1);
    assert.ok(allowedAns.observedFacts.some((f) => f.toLowerCase().includes('simulation')));

    const handoffDraft = buildDraftHandoffFromRole({
      userId: 'user-123',
      fromRole: sample.roles[0],
      contextItems: sample.contextItems,
      decisions: sample.decisions,
    });
    assert.ok(handoffDraft.currentSituation.length > 0);

    const analyticsOff = computeHatBridgeAnalytics({
      analyticsEnabled: false,
      briefs: [],
      handoffs: sample.handoffs,
      contextItems: sample.contextItems,
    });
    assert.equal(analyticsOff.analyticsOptedIn, false);
  });

  // 6. Gemini AI consent & missing-key honesty
  await test('Gemini AI service rejects unconsented calls and missing GEMINI_API_KEY honestly', async () => {
    const sample = buildSampleWorkflowDataset('user-123');
    await assert.rejects(
      () =>
        runHatBridgeGeminiReasoning(
          {
            mode: 'assistant_query',
            prompt: 'Summarize Dean priorities',
            aiConsentGranted: false,
            allowPrivatePersonal: false,
            roles: sample.roles,
            contextItems: sample.contextItems,
            decisions: sample.decisions,
            handoffs: sample.handoffs,
          },
          null
        ),
      HatBridgeAiConsentError
    );

    await assert.rejects(
      () =>
        runHatBridgeGeminiReasoning(
          {
            mode: 'assistant_query',
            prompt: 'Summarize Dean priorities',
            aiConsentGranted: true,
            allowPrivatePersonal: false,
            roles: sample.roles,
            contextItems: sample.contextItems,
            decisions: sample.decisions,
            handoffs: sample.handoffs,
          },
          null
        ),
      HatBridgeAiUnavailableError
    );

    assert.equal(HATBRIDGE_GEMINI_MODEL, 'gemini-4-hydrogen');

    const hangingFakeGemini = {
      models: {
        generateContent: () => new Promise(() => {}),
      },
    } as any;
    await assert.rejects(
      () =>
        runHatBridgeGeminiReasoning(
          {
            mode: 'reentry_brief',
            prompt: 'Test timeout',
            aiConsentGranted: true,
            allowPrivatePersonal: false,
            roles: sample.roles,
            contextItems: sample.contextItems,
            decisions: sample.decisions,
            handoffs: sample.handoffs,
          },
          hangingFakeGemini,
          { timeoutMs: 260 }
        ),
      (err: any) => err instanceof HatBridgeAiUnavailableError && /timed out/i.test(err.message)
    );
  });

  // 7. Atlassian SSRF, privacy boundary, confirmation gate, & mocked REST parsing
  await test('Atlassian service validates *.atlassian.net, blocks private_personal, and enforces confirmation', async () => {
    assert.equal(validateAtlassianSiteUrl('https://drt-team.atlassian.net/'), 'https://drt-team.atlassian.net');
    assert.throws(() => validateAtlassianSiteUrl('https://169.254.169.254/latest/meta-data'), AtlassianBoundaryError);
    assert.throws(() => validateAtlassianSiteUrl('http://evil.example.com'), AtlassianBoundaryError);

    assert.throws(() => assertWorkplaceExportAllowed('private_personal'), AtlassianBoundaryError);
    assert.doesNotThrow(() => assertWorkplaceExportAllowed('work_team'));

    const disconnectedCfg = resolveAtlassianConnection();
    assert.equal(disconnectedCfg.mode, 'disconnected');

    const oauthCfg = resolveAtlassianConnection({
      oauthBearerToken: 'test-token',
      oauthCloudId: '12345678-1234-1234-1234-1234567890ab',
      siteUrlHint: 'https://drt-team.atlassian.net',
    });

    await assert.rejects(
      () =>
        createJiraIssueConfirmed({
          config: oauthCfg,
          projectKey: 'HAT',
          summary: 'Need confirmation',
          description: 'Desc',
          privacyLevel: 'work_team',
          userConfirmed: false,
        }),
      AtlassianBoundaryError
    );

    await assert.rejects(
      () =>
        createJiraIssueConfirmed({
          config: oauthCfg,
          projectKey: 'HAT',
          summary: '   ',
          description: 'Desc',
          privacyLevel: 'work_team',
          userConfirmed: true,
        }),
      (err: any) => err instanceof AtlassianBoundaryError && err.code === 'INVALID_SUMMARY'
    );

    const mockFetch = (async (url: string) => {
      if (url.includes('/rest/api/3/search/jql')) {
        return new Response(
          JSON.stringify({
            issues: [
              {
                id: '1001',
                key: 'HAT-101',
                fields: {
                  summary: 'Review Q3 Clinical Curriculum',
                  status: { name: 'In Progress' },
                  project: { key: 'HAT', name: 'HatBridge' },
                  updated: '2026-11-20T12:00:00Z',
                },
              },
            ],
          }),
          { status: 200 }
        );
      }
      if (url.includes('/wiki/rest/api/content/search')) {
        return new Response(
          JSON.stringify({
            results: [
              {
                id: '987654',
                title: 'Dean Governance Decisions',
                space: { key: 'FAC', name: 'Faculty' },
                excerpt: 'Curriculum governance rationale',
                version: { when: '2026-11-19T09:00:00Z' },
                _links: { webui: '/spaces/FAC/pages/987654' },
              },
            ],
          }),
          { status: 200 }
        );
      }
      return new Response('{}', { status: 404 });
    }) as unknown as typeof fetch;

    const issues = await fetchJiraWorkspaceIssues({ config: oauthCfg, fetchImpl: mockFetch });
    assert.equal(issues.length, 1);
    assert.equal(issues[0].key, 'HAT-101');
    assert.equal(issues[0].dataOrigin, 'live_atlassian');

    const pages = await searchConfluenceWorkspacePages({
      config: oauthCfg,
      queryText: 'Governance',
      fetchImpl: mockFetch,
    });
    assert.equal(pages.length, 1);
    assert.equal(pages[0].id, '987654');
    assert.equal(pages[0].dataOrigin, 'live_atlassian');
  });

  // 8. Express API routes enforce consent & report honest status
  await test('Express routes /api/hatbridge/status and /api/hatbridge/ai/reason enforce consent', async () => {
    const app = express();
    app.use(express.json());
    registerHatBridgeRoutes(app, () => null);

    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const addr = server.address() as any;
    const base = `http://127.0.0.1:${addr.port}`;

    try {
      const statusRes = await fetch(`${base}/api/hatbridge/status`);
      assert.equal(statusRes.status, 200);
      const statusJson = await statusRes.json();
      assert.equal(statusJson.module, 'hatbridge');
      assert.equal(statusJson.atlassian.connected, false);
      assert.equal(typeof statusJson.aiAvailable, 'boolean');

      const aiRes = await fetch(`${base}/api/hatbridge/ai/reason`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiConsentGranted: false, prompt: 'test' }),
      });
      assert.equal(aiRes.status, 403);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  // 9. Forge manifest, coreService & Rovo actions preserve permissions & boundaries
  await test('Atlassian Forge manifest, resolver coreService & Rovo actions preserve boundaries', async () => {
    const manifestSrc = fs.readFileSync(path.resolve('apps/hatbridge-forge/manifest.yml'), 'utf8');
    assert.match(manifestSrc, /nodejs22\.x/);
    assert.match(manifestSrc, /jira:issuePanel/);
    assert.match(manifestSrc, /jira:globalPage/);
    assert.match(manifestSrc, /confluence:globalPage/);
    assert.match(manifestSrc, /confluence:contentAction/);
    assert.match(manifestSrc, /rovo:agent/);
    assert.match(manifestSrc, /storage:app/);
    assert.match(manifestSrc, /read:jira-work/);
    assert.match(manifestSrc, /write:jira-work/);
    assert.match(manifestSrc, /read:page:confluence/);

    const kvsStore = new Map<string, unknown>();
    const issueMap = new Map<string, ForgeJiraIssueSummary>([
      [
        'CLIN-42',
        {
          key: 'CLIN-42',
          summary: 'Finalize outpatient triage checklist',
          status: 'In Progress',
          projectKey: 'CLIN',
          updatedAt: '2026-11-23T10:00:00Z',
        },
      ],
    ]);
    const pageMap = new Map<string, ForgeConfluencePageSummary>([
      [
        '5501',
        {
          id: '5501',
          title: 'Outpatient Triage Architecture',
          spaceKey: 'MED',
          excerpt: 'Zero PHI documentation standard approved',
          updatedAt: '2026-11-22T15:00:00Z',
        },
      ],
    ]);

    const buildUserAdapters = (accountId: string, permittedIssues: string[]): ForgeAdapters => ({
      getUserAccountId: () => accountId,
      kvsGet: async <T>(key: string) => kvsStore.get(key) as T | undefined,
      kvsSet: async (key: string, val: unknown) => {
        kvsStore.set(key, val);
      },
      fetchJiraIssues: async () =>
        Array.from(issueMap.values()).filter((i) => permittedIssues.includes(i.key)),
      fetchJiraIssueByKey: async (key: string) =>
        permittedIssues.includes(key) ? issueMap.get(key) || null : null,
      createJiraIssue: async (p) => ({ id: '99', key: `${p.projectKey}-99` }),
      searchConfluencePages: async () => Array.from(pageMap.values()),
      fetchConfluencePageById: async (id: string) => pageMap.get(id) || null,
    });

    const userA = buildUserAdapters('acct-a', ['CLIN-42']);
    const userB = buildUserAdapters('acct-b', []); // No permission to CLIN-42!

    // Private personal rejection in Forge
    await assert.rejects(
      () =>
        saveWorkplaceDecision(userA, {
          roleName: 'Mother',
          title: 'Private family decision',
          reasoning: 'Private details',
          privacyLevel: 'private_personal',
        }),
      ForgeBoundaryError
    );

    // Confirmation enforcement in Forge
    await assert.rejects(
      () =>
        createJiraIssueFromForgeConfirmed(userA, {
          projectKey: 'CLIN',
          summary: 'Unconfirmed',
          description: 'Test',
          privacyLevel: 'work_team',
          confirmedByUser: false,
        }),
      ForgeBoundaryError
    );

    await linkJiraIssueToRole(userA, {
      roleId: 'role-clinic',
      roleName: 'Clinic Lead',
      issueKey: 'CLIN-42',
      privacyLevel: 'work_team',
    });
    await saveWorkplaceHandoff(userA, {
      roleName: 'Clinic Lead',
      currentSituation: 'Reviewing triage steps before evening family hat',
      nextAction: 'Approve checklist section 3 with Nursing Lead',
      waitingOn: 'Nursing Lead response',
      linkedIssueKey: 'CLIN-42',
      privacyLevel: 'work_team',
    });

    const rovoBriefA = await dispatchRovoActionWithAdapters(userA, {
      actionKey: 'get-reentry-brief',
      roleName: 'Clinic Lead',
    });
    const briefObjA = (rovoBriefA as any).brief;
    assert.ok(briefObjA.questions.whatWasWorkingOn.includes('Reviewing triage steps'));
    assert.ok(briefObjA.citations.some((c: any) => c.id === 'CLIN-42'));

    // Capture Jira issue & Confluence page into Clinic Lead hat, verify removal & privacy/ACL blocks
    await assert.rejects(
      () =>
        captureJiraOrConfluenceContext(userA, {
          sourceKind: 'jira',
          sourceId: 'CLIN-42',
          roleName: 'Mother',
          privacyLevel: 'private_personal',
        }),
      ForgeBoundaryError
    );

    await assert.rejects(
      () =>
        captureJiraOrConfluenceContext(userB, {
          sourceKind: 'jira',
          sourceId: 'CLIN-42',
          roleName: 'Clinic Lead',
          privacyLevel: 'work_team',
        }),
      ForgeBoundaryError
    );

    const jiraCap = await captureJiraOrConfluenceContext(userA, {
      sourceKind: 'jira',
      sourceId: 'CLIN-42',
      roleName: 'Clinic Lead',
      note: 'Captured from triage panel',
      privacyLevel: 'work_team',
    });
    assert.equal(jiraCap.capture.openUrl, '/browse/CLIN-42');

    const confCap = await captureJiraOrConfluenceContext(userA, {
      sourceKind: 'confluence',
      sourceId: '5501',
      roleName: 'Clinic Lead',
      privacyLevel: 'work_team',
    });
    assert.equal(confCap.capture.openUrl, '/wiki/pages/5501');

    await saveWorkplaceDecision(userA, {
      roleName: 'Clinic Lead',
      title: 'Zero PHI documentation standard approved',
      reasoning: 'Matches Confluence page 5501 architecture decision.',
      sourceRef: 'Confluence 5501',
      openUrl: '/wiki/pages/5501',
      privacyLevel: 'work_team',
    });

    // Verify all 4 Rovo actions cleanly separate confirmed decisions from inferred suggestions
    const briefAfterCap = await dispatchRovoActionWithAdapters(userA, {
      actionKey: 'get-reentry-brief',
      roleName: 'Clinic Lead',
    });
    assert.equal((briefAfterCap as any).capturesCount, 2);
    assert.equal((briefAfterCap as any).confirmedDecisions.length, 1);
    assert.ok(Array.isArray((briefAfterCap as any).inferredSuggestions));

    const searchRovoA = await dispatchRovoActionWithAdapters(userA, {
      actionKey: 'search-authorized-decisions',
      query: 'triage',
    });
    assert.equal((searchRovoA as any).authorizedJiraMatches.length, 1);
    assert.equal((searchRovoA as any).authorizedConfluenceMatches.length, 1);

    const searchRovoB = await dispatchRovoActionWithAdapters(userB, {
      actionKey: 'search-authorized-decisions',
      query: 'triage',
    });
    assert.equal((searchRovoB as any).observedDecisions.length, 0);
    assert.equal((searchRovoB as any).authorizedJiraMatches.length, 0);

    const handoffRovoA = await dispatchRovoActionWithAdapters(userA, {
      actionKey: 'prepare-role-handoff',
      roleName: 'Clinic Lead',
    });
    assert.equal((handoffRovoA as any).action, 'prepare-role-handoff');
    assert.ok(String((handoffRovoA as any).draftOnlyNotice).includes('confirm'));

    const nextRovoA = await dispatchRovoActionWithAdapters(userA, {
      actionKey: 'suggest-next-action',
      roleName: 'Clinic Lead',
    });
    assert.equal((nextRovoA as any).requiresUserApproval, true);
    assert.ok(Array.isArray((nextRovoA as any).inferredSuggestions));

    // Remove captured item cleans up Forge KVS vault
    const afterRemove = await removeCapturedContextItem(userA, jiraCap.capture.id);
    assert.equal(afterRemove.captures.length, 1);

    // Permission & vault isolation check: User B must NOT see User A's KVS vault or unauthorized Jira issue CLIN-42!
    const rovoBriefB = await buildGroundedForgeReentryBrief(userB, {
      roleName: 'Clinic Lead',
      issueKey: 'CLIN-42',
    });
    assert.equal(rovoBriefB.questions.whatWasWorkingOn, MISSING_CONTEXT_TEXT);
    assert.equal(rovoBriefB.citations.length, 0);
  });

  // 10. Forge manifest validator & handler symbol verification
  await test('Forge manifest validator script verifies modules, handlers, assets, and official scopes', () => {
    const out = execFileSync(process.execPath, [path.resolve('apps/hatbridge-forge/scripts/validate-manifest.mjs')], {
      encoding: 'utf8',
    });
    assert.match(out, /PASS: HatBridge Forge manifest\.yml verified/);
  });

  // 11. Web context bridge wiring & privacy log hygiene
  await test('Dr. T web bridge wires Jira/Confluence capture, separates facts vs suggestions, and omits raw PII in logs', () => {
    const atlassianUiSrc = fs.readFileSync(
      path.resolve('src/components/hatbridge/sections/HatBridgeWellbeingAtlassianAiSettingsSections.tsx'),
      'utf8'
    );
    const briefUiSrc = fs.readFileSync(
      path.resolve('src/components/hatbridge/sections/HatBridgeTodayAndBriefSections.tsx'),
      'utf8'
    );
    const moduleSrc = fs.readFileSync(path.resolve('src/components/hatbridge/HatBridgeModule.tsx'), 'utf8');
    const storageSrc = fs.readFileSync(path.resolve('src/components/hatbridge/services/hatbridgeStorageService.ts'), 'utf8');
    const serverSrc = fs.readFileSync(path.resolve('src/server/hatbridgeService.ts'), 'utf8');

    const forgeIndexSrc = fs.readFileSync(path.resolve('apps/hatbridge-forge/src/index.ts'), 'utf8');

    assert.match(atlassianUiSrc, /onCaptureIssueAsContext/);
    assert.match(atlassianUiSrc, /onCapturePageAsContext/);
    assert.match(atlassianUiSrc, /onRecordDecisionFromPage/);
    assert.match(atlassianUiSrc, /isSafeHttpUrl/);
    assert.match(moduleSrc, /onCaptureIssueAsContext=/);
    assert.match(moduleSrc, /onRecordDecisionFromPage=/);
    assert.match(briefUiSrc, /Verified Source Information:/);
    assert.match(briefUiSrc, /User-Recorded Information:/);
    assert.match(briefUiSrc, /AI-Generated Suggestion \(Unconfirmed\):/);
    assert.match(briefUiSrc, /Missing \/ Unavailable Context:/);
    assert.ok(!storageSrc.includes('email: auth.currentUser?.email'), 'Firestore error log must not include user email');
    assert.match(serverSrc, /sanitizeErrorText/);
    assert.match(forgeIndexSrc, /rawWebUi\.startsWith\('\/wiki\/'\)/);
  });

  // 12. Firestore blueprint & rules verification
  await test('Firestore blueprint & rules define all 9 hatbridge_* collections with strict ownership', () => {
    const bp = JSON.parse(fs.readFileSync(path.resolve('firebase-blueprint.json'), 'utf8'));
    const rules = fs.readFileSync(path.resolve('firestore.rules'), 'utf8');

    assert.ok(bp.entities.HatBridgeRole);
    assert.ok(bp.entities.HatBridgeContextItem);
    assert.ok(bp.entities.HatBridgeDecision);
    assert.ok(bp.entities.HatBridgeHandoff);
    assert.ok(bp.entities.HatBridgeReentryBrief);
    assert.ok(bp.entities.HatBridgeTimeBlock);
    assert.ok(bp.entities.HatBridgePreferences);
    assert.ok(bp.entities.HatBridgeIntegrationState);
    assert.ok(bp.entities.HatBridgeAuditEvent);

    assert.ok(!rules.includes('match /{document=**}'), 'Must not contain catch-all document rule');
    assert.match(rules, /match \/hatbridge_roles\/\{roleId\}/);
    assert.match(rules, /match \/hatbridge_audit_events\/\{eventId\}/);
  });

  console.log(`\nHatBridge Verification Suite Complete: ${passed}/${passed} checks passed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
