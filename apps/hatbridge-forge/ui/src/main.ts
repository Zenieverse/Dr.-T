// ============================================================================
// HATBRIDGE FORGE — CUSTOM UI ENTRYPOINT (@forge/bridge)
// Bundled into static/hatbridge-ui/app.js via `npm run build:ui`
// Supports Jira Issue Panel, Jira Global Page, Confluence Global Page,
// and Confluence Content Action.
// ============================================================================

import { invoke, router, view } from '@forge/bridge';

interface ForgeCaptureItem {
  id: string;
  roleName: string;
  sourceKind: 'jira' | 'confluence';
  sourceId: string;
  title: string;
  summary: string;
  openUrl: string;
  capturedAt: string;
}

interface SnapshotPayload {
  accountId: string;
  currentIssue?: { key: string; summary: string; status: string; openUrl?: string } | null;
  currentPage?: { id: string; title: string; spaceKey: string; excerpt?: string; openUrl?: string } | null;
  recentIssues?: Array<{ key: string; summary: string; status: string; openUrl?: string }>;
  recentPages?: Array<{ id: string; title: string; spaceKey: string; openUrl?: string }>;
  vault?: {
    roleLinks?: Array<{ roleId: string; roleName: string; issueKeys: string[]; pageIds: string[] }>;
    captures?: ForgeCaptureItem[];
    decisions?: Array<{ id: string; roleName: string; title: string; reasoning: string; sourceRef: string; openUrl?: string; createdAt: string }>;
    handoffs?: Array<{ id: string; roleName: string; currentSituation: string; nextAction: string; createdAt: string }>;
  };
}

interface BriefPayload {
  roleName: string;
  groundingNote: string;
  observedFacts: string[];
  confirmedDecisions: Array<{ id: string; title: string; reasoning: string; sourceRef: string; openUrl?: string }>;
  inferredSuggestions: string[];
  captures: ForgeCaptureItem[];
  citations: Array<{ kind: string; id: string; label: string; openUrl?: string }>;
  questions: {
    whatWasWorkingOn: string;
    whyItMatters: string;
    lastCompleted: string;
    stillUnfinished: string;
    decisionsAlreadyMade: string;
    waitingOnWhom: string;
    whatCanSafelyWait: string;
    upcomingDeadlines: string;
    nextMeaningfulAction: string;
  };
}

let activeRoleName = 'Workplace Hat';
let activePrivacy: 'work_team' | 'work_restricted' = 'work_team';
let statusNotice = '';

function sanitizeOpenTarget(url?: string): string | null {
  const val = (url || '').trim();
  if (!val) return null;
  if (val.startsWith('/') && !val.startsWith('//')) return val;
  if (/^https:\/\/[a-zA-Z0-9.-]+\.atlassian\.net(\/|$)/i.test(val)) return val;
  return null;
}

async function openAtlassianTarget(url?: string): Promise<void> {
  const safe = sanitizeOpenTarget(url);
  if (!safe) return;
  await router.open(safe);
}

async function renderHatBridgeForgeUi() {
  const root = document.getElementById('hatbridge-forge-root');
  if (!root) return;

  root.innerHTML = '<div class="hb-card">Loading HatBridge workplace continuity context...</div>';

  try {
    const context = await view.getContext();
    const issueKey = (context as any)?.extension?.issue?.key;
    const pageId = (context as any)?.extension?.content?.id;

    const snapshot = (await invoke('getWorkspaceSnapshot', {
      issueKey,
      pageId,
    })) as SnapshotPayload;

    const knownRoles = Array.from(
      new Set(
        [
          activeRoleName,
          ...(snapshot.vault?.roleLinks || []).map((r) => r.roleName),
          'University Dean',
          'Clinic Lead',
          'Principal Architect',
        ].filter(Boolean)
      )
    );
    if (snapshot.vault?.roleLinks?.[0]?.roleName && activeRoleName === 'Workplace Hat') {
      activeRoleName = snapshot.vault.roleLinks[0].roleName;
    }

    const brief = (await invoke('getReentryBrief', {
      issueKey,
      roleName: activeRoleName,
    })) as BriefPayload;

    const captures = snapshot.vault?.captures || [];

    root.innerHTML = `
      <div class="hb-shell">
        <header class="hb-header">
          <div>
            <div class="hb-eyebrow">Dr. T — HatBridge Forge</div>
            <h1 class="hb-title">Many Hats. One Life. Nothing Important Lost.</h1>
          </div>
          <div class="hb-meta">
            <span class="hb-account">Account: ${escapeHtml(snapshot.accountId)}</span>
          </div>
        </header>

        ${
          statusNotice
            ? `<div class="hb-card hb-notice" role="status">${escapeHtml(statusNotice)}</div>`
            : ''
        }

        <section class="hb-card">
          <h2>Active Workplace Hat</h2>
          <div class="hb-row">
            <input id="hb-role-input" class="hb-input" list="hb-role-list" value="${escapeHtml(activeRoleName)}" placeholder="Select or type Hat name..." />
            <datalist id="hb-role-list">
              ${knownRoles.map((r) => `<option value="${escapeHtml(r)}"></option>`).join('')}
            </datalist>
            <select id="hb-privacy-select" class="hb-select" aria-label="Workplace Privacy Scope">
              <option value="work_team" ${activePrivacy === 'work_team' ? 'selected' : ''}>Work Team</option>
              <option value="work_restricted" ${activePrivacy === 'work_restricted' ? 'selected' : ''}>Work Restricted</option>
            </select>
            <button id="hb-switch-role-btn" type="button" class="hb-btn hb-btn-secondary">Load Re-entry Brief</button>
          </div>
        </section>

        ${
          snapshot.currentIssue
            ? `<section class="hb-card">
                <div class="hb-card-head">
                  <h2>Current Jira Issue: ${escapeHtml(snapshot.currentIssue.key)}</h2>
                  <div class="hb-actions">
                    <button id="hb-capture-current-issue" type="button" class="hb-btn hb-btn-primary">Capture to Hat</button>
                    <button type="button" class="hb-btn hb-btn-link" data-open-url="${escapeHtml(snapshot.currentIssue.openUrl || `/browse/${snapshot.currentIssue.key}`)}">Open Issue</button>
                  </div>
                </div>
                <p class="hb-text">${escapeHtml(snapshot.currentIssue.summary)} · <strong>${escapeHtml(snapshot.currentIssue.status)}</strong></p>
              </section>`
            : ''
        }

        ${
          snapshot.currentPage
            ? `<section class="hb-card">
                <div class="hb-card-head">
                  <h2>Current Confluence Page</h2>
                  <div class="hb-actions">
                    <button id="hb-capture-current-page" type="button" class="hb-btn hb-btn-primary">Capture to Hat</button>
                    <button type="button" class="hb-btn hb-btn-link" data-open-url="${escapeHtml(snapshot.currentPage.openUrl || `/wiki/pages/${snapshot.currentPage.id}`)}">Open Page</button>
                  </div>
                </div>
                <p class="hb-text">${escapeHtml(snapshot.currentPage.title)} (Space: ${escapeHtml(snapshot.currentPage.spaceKey)})</p>
              </section>`
            : ''
        }

        <section class="hb-card">
          <h2>Re-entry Brief — ${escapeHtml(brief.roleName)}</h2>
          <p class="hb-muted">${escapeHtml(brief.groundingNote)}</p>
          <dl class="hb-brief-grid">
            <div><dt>Active Hat</dt><dd>${escapeHtml(brief.roleName)}</dd></div>
            <div><dt>Last Activity / Working On</dt><dd>${escapeHtml(brief.questions.whatWasWorkingOn)}</dd></div>
            <div><dt>Confirmed Decisions</dt><dd>${escapeHtml(brief.questions.decisionsAlreadyMade)}</dd></div>
            <div><dt>Unfinished Commitments</dt><dd>${escapeHtml(brief.questions.stillUnfinished)}</dd></div>
            <div><dt>Waiting On</dt><dd>${escapeHtml(brief.questions.waitingOnWhom)}</dd></div>
            <div><dt>What Can Safely Wait</dt><dd>${escapeHtml(brief.questions.whatCanSafelyWait)}</dd></div>
            <div><dt>Next Actionable Step</dt><dd>${escapeHtml(brief.questions.nextMeaningfulAction)}</dd></div>
            <div><dt>Deadlines (Grounded Only)</dt><dd>${escapeHtml(brief.questions.upcomingDeadlines)}</dd></div>
          </dl>

          ${
            brief.inferredSuggestions.length > 0
              ? `<div class="hb-subblock">
                  <h3>AI / Heuristic Suggestions (Inferred — Requires Your Review)</h3>
                  <ul class="hb-list">
                    ${brief.inferredSuggestions.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
                  </ul>
                </div>`
              : ''
          }

          ${
            brief.citations.length > 0
              ? `<div class="hb-subblock">
                  <h3>Linked Jira &amp; Confluence References</h3>
                  <ul class="hb-list">
                    ${brief.citations
                      .map((c) => {
                        const safeUrl = sanitizeOpenTarget(c.openUrl);
                        return `<li>[${escapeHtml(c.kind)}] ${escapeHtml(c.label)}${
                          safeUrl
                            ? ` <button type="button" class="hb-inline-open" data-open-url="${escapeHtml(safeUrl)}">Open Source</button>`
                            : ''
                        }</li>`;
                      })
                      .join('')}
                  </ul>
                </div>`
              : ''
          }
        </section>

        <section class="hb-grid-two">
          <form id="hb-decision-form" class="hb-card hb-form">
            <h2>Record Decision with Source Reference</h2>
            <input id="hb-dec-title" class="hb-input" required placeholder="Decision title (e.g. Approved triage protocol)" />
            <input id="hb-dec-source" class="hb-input" value="${escapeHtml(
              snapshot.currentIssue
                ? `Jira ${snapshot.currentIssue.key}`
                : snapshot.currentPage
                  ? `Confluence ${snapshot.currentPage.id}: ${snapshot.currentPage.title}`
                  : 'Atlassian Workspace'
            )}" placeholder="Source reference (Jira key or Confluence page)" />
            <textarea id="hb-dec-reason" class="hb-textarea" rows="2" required placeholder="Why this was decided..."></textarea>
            <button type="submit" class="hb-btn hb-btn-primary">Save Grounded Decision</button>
          </form>

          <form id="hb-handoff-form" class="hb-card hb-form">
            <h2>Create Personal Handoff</h2>
            <input id="hb-ho-situation" class="hb-input" required placeholder="Where am I stopping in this hat?" />
            <input id="hb-ho-next" class="hb-input" required placeholder="Exact next step when returning..." />
            <input id="hb-ho-waiting" class="hb-input" placeholder="Waiting on someone? (optional)" />
            <button type="submit" class="hb-btn hb-btn-secondary">Save Handoff Snapshot</button>
          </form>
        </section>

        ${
          captures.length > 0
            ? `<section class="hb-card">
                <h2>Captured Atlassian Context Items (${captures.length})</h2>
                <ul class="hb-capture-list">
                  ${captures
                    .slice(0, 8)
                    .map(
                      (c) => `<li class="hb-capture-row">
                        <div>
                          <strong>[${escapeHtml(c.sourceKind.toUpperCase())}] ${escapeHtml(c.title)}</strong>
                          <div class="hb-muted">Hat: ${escapeHtml(c.roleName)} · ${escapeHtml(c.summary)}</div>
                        </div>
                        <div class="hb-actions">
                          <button type="button" class="hb-btn hb-btn-link" data-open-url="${escapeHtml(c.openUrl)}">Open</button>
                          <button type="button" class="hb-btn hb-btn-danger" data-remove-capture="${escapeHtml(c.id)}">Remove</button>
                        </div>
                      </li>`
                    )
                    .join('')}
                </ul>
              </section>`
            : ''
        }

        ${
          !snapshot.currentIssue && !snapshot.currentPage && ((snapshot.recentIssues || []).length > 0 || (snapshot.recentPages || []).length > 0)
            ? `<section class="hb-grid-two">
                <div class="hb-card">
                  <h2>Recent Authorized Jira Issues</h2>
                  <ul class="hb-capture-list">
                    ${(snapshot.recentIssues || [])
                      .slice(0, 5)
                      .map(
                        (iss) => `<li class="hb-capture-row">
                          <span><strong>${escapeHtml(iss.key)}</strong> — ${escapeHtml(iss.summary)}</span>
                          <div class="hb-actions">
                            <button type="button" class="hb-btn hb-btn-primary" data-capture-kind="jira" data-capture-id="${escapeHtml(iss.key)}">Capture</button>
                            <button type="button" class="hb-btn hb-btn-link" data-open-url="${escapeHtml(iss.openUrl || `/browse/${iss.key}`)}">Open</button>
                          </div>
                        </li>`
                      )
                      .join('')}
                  </ul>
                </div>
                <div class="hb-card">
                  <h2>Recent Authorized Confluence Pages</h2>
                  <ul class="hb-capture-list">
                    ${(snapshot.recentPages || [])
                      .slice(0, 5)
                      .map(
                        (pg) => `<li class="hb-capture-row">
                          <span><strong>${escapeHtml(pg.title)}</strong> (${escapeHtml(pg.spaceKey)})</span>
                          <div class="hb-actions">
                            <button type="button" class="hb-btn hb-btn-primary" data-capture-kind="confluence" data-capture-id="${escapeHtml(pg.id)}">Capture</button>
                            <button type="button" class="hb-btn hb-btn-link" data-open-url="${escapeHtml(pg.openUrl || `/wiki/pages/${pg.id}`)}">Open</button>
                          </div>
                        </li>`
                      )
                      .join('')}
                  </ul>
                </div>
              </section>`
            : ''
        }

        <form id="hb-jira-create-form" class="hb-card hb-form">
          <h2>Create Jira Issue (Explicit Confirmation Required)</h2>
          <div class="hb-row">
            <input id="hb-jira-project" class="hb-input" placeholder="Project key (e.g. HB)" required />
            <input id="hb-jira-summary" class="hb-input" placeholder="Issue summary (non-PHI workplace task)" required />
          </div>
          <label class="hb-checkbox">
            <input id="hb-jira-confirm" type="checkbox" />
            <span>I confirm this workplace task contains zero private personal/patient data and approve creating a Jira issue.</span>
          </label>
          <button type="submit" class="hb-btn hb-btn-secondary">Confirm &amp; Create Jira Issue</button>
        </form>

        <section class="hb-card">
          <h2>Privacy &amp; Workplace Boundary</h2>
          <p class="hb-muted">
            Personal and family hats stay strictly outside Jira, Confluence, and Rovo. All reads and writes execute via Forge <code>asUser()</code> under your permissions.
          </p>
        </section>
      </div>
    `;

    wireForgeUiHandlers(root, snapshot);
  } catch (err: any) {
    root.innerHTML = `
      <div class="hb-card hb-error">
        <h2>Atlassian Forge Bridge Unavailable</h2>
        <p>${escapeHtml(err?.message || 'Open inside Jira or Confluence after forge register, deploy, and install.')}</p>
      </div>
    `;
  }
}

function wireForgeUiHandlers(root: HTMLElement, snapshot: SnapshotPayload) {
  const roleInput = root.querySelector<HTMLInputElement>('#hb-role-input');
  const privacySelect = root.querySelector<HTMLSelectElement>('#hb-privacy-select');
  const readRoleState = () => {
    activeRoleName = (roleInput?.value || '').trim() || 'Workplace Hat';
    activePrivacy = privacySelect?.value === 'work_restricted' ? 'work_restricted' : 'work_team';
  };

  root.querySelector('#hb-switch-role-btn')?.addEventListener('click', () => {
    readRoleState();
    statusNotice = `Loaded brief for "${activeRoleName}".`;
    void renderHatBridgeForgeUi();
  });

  root.querySelector('#hb-capture-current-issue')?.addEventListener('click', async () => {
    if (!snapshot.currentIssue) return;
    readRoleState();
    try {
      await invoke('captureContextItem', {
        sourceKind: 'jira',
        sourceId: snapshot.currentIssue.key,
        roleName: activeRoleName,
        privacyLevel: activePrivacy,
      });
      statusNotice = `Captured Jira ${snapshot.currentIssue.key} into "${activeRoleName}".`;
    } catch (err: any) {
      statusNotice = err?.message || 'Unable to capture Jira issue.';
    }
    await renderHatBridgeForgeUi();
  });

  root.querySelector('#hb-capture-current-page')?.addEventListener('click', async () => {
    if (!snapshot.currentPage) return;
    readRoleState();
    try {
      await invoke('captureContextItem', {
        sourceKind: 'confluence',
        sourceId: snapshot.currentPage.id,
        roleName: activeRoleName,
        privacyLevel: activePrivacy,
      });
      statusNotice = `Captured Confluence "${snapshot.currentPage.title}" into "${activeRoleName}".`;
    } catch (err: any) {
      statusNotice = err?.message || 'Unable to capture Confluence page.';
    }
    await renderHatBridgeForgeUi();
  });

  root.querySelectorAll<HTMLButtonElement>('[data-capture-kind]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      readRoleState();
      const sourceKind = btn.dataset.captureKind as 'jira' | 'confluence';
      const sourceId = btn.dataset.captureId || '';
      try {
        await invoke('captureContextItem', {
          sourceKind,
          sourceId,
          roleName: activeRoleName,
          privacyLevel: activePrivacy,
        });
        statusNotice = `Captured ${sourceKind.toUpperCase()} ${sourceId} into "${activeRoleName}".`;
      } catch (err: any) {
        statusNotice = err?.message || 'Unable to capture Atlassian item.';
      }
      await renderHatBridgeForgeUi();
    });
  });

  root.querySelectorAll<HTMLButtonElement>('[data-remove-capture]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const captureId = btn.dataset.removeCapture || '';
      try {
        await invoke('removeCapturedItem', { captureId });
        statusNotice = 'Removed saved context item from Forge vault.';
      } catch (err: any) {
        statusNotice = err?.message || 'Unable to remove context item.';
      }
      await renderHatBridgeForgeUi();
    });
  });

  root.querySelectorAll<HTMLButtonElement>('[data-open-url]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await openAtlassianTarget(btn.dataset.openUrl);
      } catch (err: any) {
        statusNotice = err?.message || 'Unable to open Atlassian target URL.';
        await renderHatBridgeForgeUi();
      }
    });
  });

  root.querySelector<HTMLFormElement>('#hb-decision-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    readRoleState();
    const title = root.querySelector<HTMLInputElement>('#hb-dec-title')?.value || '';
    const sourceRef = root.querySelector<HTMLInputElement>('#hb-dec-source')?.value || '';
    const reasoning = root.querySelector<HTMLTextAreaElement>('#hb-dec-reason')?.value || '';
    const openUrl =
      snapshot.currentIssue?.openUrl ||
      snapshot.currentPage?.openUrl ||
      undefined;
    try {
      await invoke('saveDecision', {
        roleName: activeRoleName,
        title,
        reasoning,
        sourceRef,
        openUrl,
        privacyLevel: activePrivacy,
      });
      statusNotice = `Recorded decision "${title}" with source "${sourceRef}".`;
    } catch (err: any) {
      statusNotice = err?.message || 'Unable to record decision.';
    }
    await renderHatBridgeForgeUi();
  });

  root.querySelector<HTMLFormElement>('#hb-handoff-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    readRoleState();
    const currentSituation = root.querySelector<HTMLInputElement>('#hb-ho-situation')?.value || '';
    const nextAction = root.querySelector<HTMLInputElement>('#hb-ho-next')?.value || '';
    const waitingOn = root.querySelector<HTMLInputElement>('#hb-ho-waiting')?.value || '';
    try {
      await invoke('saveHandoff', {
        roleName: activeRoleName,
        currentSituation,
        nextAction,
        waitingOn,
        linkedIssueKey: snapshot.currentIssue?.key,
        privacyLevel: activePrivacy,
      });
      statusNotice = `Saved handoff snapshot for "${activeRoleName}".`;
    } catch (err: any) {
      statusNotice = err?.message || 'Unable to save handoff snapshot.';
    }
    await renderHatBridgeForgeUi();
  });

  root.querySelector<HTMLFormElement>('#hb-jira-create-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    readRoleState();
    const projectKey = root.querySelector<HTMLInputElement>('#hb-jira-project')?.value || '';
    const summary = root.querySelector<HTMLInputElement>('#hb-jira-summary')?.value || '';
    const confirmedByUser = Boolean(root.querySelector<HTMLInputElement>('#hb-jira-confirm')?.checked);
    try {
      const created = (await invoke('createJiraIssueConfirmed', {
        projectKey,
        summary,
        description: `Created from HatBridge Forge under "${activeRoleName}".`,
        privacyLevel: activePrivacy,
        confirmedByUser,
      })) as { key: string };
      statusNotice = `Created Jira issue ${created.key}.`;
    } catch (err: any) {
      statusNotice = err?.message || 'Confirmation required before creating Jira issue.';
    }
    await renderHatBridgeForgeUi();
  });
}

function escapeHtml(input: string): string {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

void renderHatBridgeForgeUi();
