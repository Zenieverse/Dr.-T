// ============================================================================
// CAREBRIDGE FORGE — CUSTOM UI ENTRYPOINT (@forge/bridge)
// Bundled into static/carebridge-ui/app.js via `npm run build:ui`
// Supports JSM Portal Request Detail Panel, Jira Issue Panel, Jira Global Page,
// Confluence Global Page, and Confluence Content Action.
// ============================================================================

import { invoke, router, view } from '@forge/bridge';

interface ForgeServiceDesk {
  id: string;
  projectKey: string;
  projectName: string;
  requestTypes: Array<{ id: string; name: string }>;
}

interface ForgeJsmRequest {
  issueKey: string;
  summary: string;
  status: string;
  createdDate: string;
  openUrl: string;
}

interface ForgeConfluencePage {
  id: string;
  title: string;
  spaceKey: string;
  excerpt: string;
  openUrl: string;
}

interface SnapshotPayload {
  accountId: string;
  currentRequest?: ForgeJsmRequest | null;
  currentPage?: ForgeConfluencePage | null;
  serviceDesks: ForgeServiceDesk[];
  recentRequests: ForgeJsmRequest[];
  recentPages: ForgeConfluencePage[];
}

interface BriefPayload {
  generatedAt: string;
  navigationContext: string;
  nonClinicalNotice: string;
  verifiedSourceInformation: Array<{ label: string; detail: string; openUrl?: string }>;
  userRecordedInformation: Array<{ taskId: string; description: string; status: string; priority: string; dueDate?: string }>;
  aiGeneratedSuggestionUnconfirmed: {
    label: string;
    suggestedNextStep: string;
    humanReviewed: boolean;
  };
  missingOrUnavailableContext: string[];
}

let statusNotice = '';

function sanitizeOpenTarget(url?: string): string | null {
  const val = (url || '').trim();
  if (!val) return null;
  if (val.startsWith('/') && !val.startsWith('//')) return val;
  if (/^https:\/\/[a-zA-Z0-9.-]+\.atlassian\.net(\/|$)/i.test(val)) return val;
  return null;
}

async function renderCareBridgeForgeUi() {
  const root = document.getElementById('carebridge-forge-root');
  if (!root) return;

  root.innerHTML = '<div class="cb-card">Loading CareBridge healthcare coordination workspace...</div>';

  try {
    const context = await view.getContext();
    const issueKey =
      (context as any)?.extension?.request?.key || (context as any)?.extension?.issue?.key;
    const pageId = (context as any)?.extension?.content?.id;

    const [snapshot, brief] = await Promise.all([
      invoke<SnapshotPayload>('getCareWorkspaceSnapshot', { issueKey, pageId }),
      invoke<BriefPayload>('getCareReentryBrief', { issueKey }),
    ]);

    const defaultDesk = snapshot.serviceDesks?.find((d) => d.id === '2') || snapshot.serviceDesks?.[0];
    const defaultType = defaultDesk?.requestTypes?.find((rt) => rt.id === '5') || defaultDesk?.requestTypes?.[0];

    root.innerHTML = `
      <div class="cb-shell">
        <header class="cb-header">
          <div>
            <div class="cb-eyebrow">Dr. T — CareBridge Forge</div>
            <h1 class="cb-title">Healthcare Care-Navigation &amp; Follow-Up Continuity</h1>
          </div>
          <div class="cb-account">Account: ${escapeHtml(snapshot.accountId)}</div>
        </header>

        <div class="cb-card cb-warning" role="note">
          ${escapeHtml(brief.nonClinicalNotice)}
        </div>

        ${
          statusNotice
            ? `<div class="cb-card cb-notice" role="status">${escapeHtml(statusNotice)}</div>`
            : ''
        }

        ${
          snapshot.currentRequest
            ? `<section class="cb-card">
                <div class="cb-card-head">
                  <h2>Current JSM Request: ${escapeHtml(snapshot.currentRequest.issueKey)}</h2>
                  <button type="button" class="cb-btn cb-btn-link" data-open-url="${escapeHtml(snapshot.currentRequest.openUrl)}">Open in JSM</button>
                </div>
                <p class="cb-text">${escapeHtml(snapshot.currentRequest.summary)} · <strong>${escapeHtml(snapshot.currentRequest.status)}</strong></p>
              </section>`
            : ''
        }

        ${
          snapshot.currentPage
            ? `<section class="cb-card">
                <div class="cb-card-head">
                  <h2>Current Confluence Knowledge Page</h2>
                  <div class="cb-actions">
                    <button id="cb-link-page-btn" type="button" class="cb-btn cb-btn-primary">Link Guidance to CareBridge</button>
                    <button type="button" class="cb-btn cb-btn-link" data-open-url="${escapeHtml(snapshot.currentPage.openUrl)}">Open Page</button>
                  </div>
                </div>
                <p class="cb-text">${escapeHtml(snapshot.currentPage.title)} (${escapeHtml(snapshot.currentPage.spaceKey)})</p>
              </section>`
            : ''
        }

        <section class="cb-card">
          <h2>Care Re-entry Brief (Strict 4-Bucket Provenance)</h2>
          <div class="cb-bucket-grid">
            <div class="cb-bucket">
              <div class="cb-bucket-label">1. Verified Source Information</div>
              <ul class="cb-list">
                ${
                  brief.verifiedSourceInformation.length > 0
                    ? brief.verifiedSourceInformation
                        .map(
                          (item) =>
                            `<li><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.detail)}${
                              sanitizeOpenTarget(item.openUrl)
                                ? ` <button type="button" class="cb-inline-open" data-open-url="${escapeHtml(item.openUrl || '')}">Source</button>`
                                : ''
                            }</li>`
                        )
                        .join('')
                    : '<li>None retrieved in current user scope.</li>'
                }
              </ul>
            </div>

            <div class="cb-bucket">
              <div class="cb-bucket-label">2. User-Recorded Information</div>
              <ul class="cb-list">
                ${
                  brief.userRecordedInformation.length > 0
                    ? brief.userRecordedInformation
                        .map(
                          (t) =>
                            `<li>[${escapeHtml(t.status)}] ${escapeHtml(t.description)}${
                              t.dueDate ? ` (Due ${escapeHtml(t.dueDate)})` : ''
                            }</li>`
                        )
                        .join('')
                    : '<li>No administrative follow-up tasks recorded yet.</li>'
                }
              </ul>
            </div>

            <div class="cb-bucket">
              <div class="cb-bucket-label">3. ${escapeHtml(brief.aiGeneratedSuggestionUnconfirmed.label)}</div>
              <p class="cb-text">${escapeHtml(brief.aiGeneratedSuggestionUnconfirmed.suggestedNextStep)}</p>
            </div>

            <div class="cb-bucket">
              <div class="cb-bucket-label">4. Missing or Unavailable Context</div>
              <ul class="cb-list">
                ${
                  brief.missingOrUnavailableContext.length > 0
                    ? brief.missingOrUnavailableContext.map((m) => `<li>${escapeHtml(m)}</li>`).join('')
                    : '<li>No missing gaps detected.</li>'
                }
              </ul>
            </div>
          </div>
        </section>

        <section class="cb-grid-two">
          <form id="cb-task-form" class="cb-card cb-form">
            <h2>Record Non-Emergency Follow-Up Task</h2>
            <input id="cb-task-context" class="cb-input" required value="${escapeHtml(brief.navigationContext)}" placeholder="Context reference (e.g. Post-Visit Scheduling)" />
            <textarea id="cb-task-desc" class="cb-textarea" rows="2" required placeholder="Administrative follow-up task (avoid SSN, MRN, DOB, diagnoses)"></textarea>
            <div class="cb-row">
              <select id="cb-task-priority" class="cb-select" aria-label="Task Priority">
                <option value="routine">Routine</option>
                <option value="soon">Soon</option>
                <option value="time_sensitive">Time-Sensitive</option>
              </select>
              <input id="cb-task-due" type="date" class="cb-input" aria-label="Due Date" />
            </div>
            <input id="cb-task-assignee" class="cb-input" value="Care Navigation Coordinator" placeholder="Responsible person or team" />
            <button type="submit" class="cb-btn cb-btn-primary">Save CareBridge Task</button>
          </form>

          <form id="cb-jsm-form" class="cb-card cb-form">
            <h2>Create Jira Service Management Follow-Up Request</h2>
            <div class="cb-row">
              <input id="cb-jsm-desk" class="cb-input" value="${escapeHtml(defaultDesk?.id || '2')}" placeholder="Service Desk ID" required />
              <input id="cb-jsm-type" class="cb-input" value="${escapeHtml(defaultType?.id || '5')}" placeholder="Request Type ID" required />
            </div>
            <input id="cb-jsm-summary" class="cb-input" required placeholder="Minimal follow-up summary (no sensitive medical IDs)" />
            <textarea id="cb-jsm-desc" class="cb-textarea" rows="2" required placeholder="Consented administrative request notes"></textarea>
            <label class="cb-checkbox">
              <input id="cb-jsm-confirm" type="checkbox" />
              <span>I confirm this JSM request uses minimal consented administrative wording and approve creating it.</span>
            </label>
            <button type="submit" class="cb-btn cb-btn-secondary">Confirm &amp; Create JSM Request</button>
          </form>
        </section>
      </div>
    `;

    wireCareBridgeHandlers(root, snapshot);
  } catch (err: any) {
    root.innerHTML = `
      <div class="cb-card cb-error">
        <h2>Atlassian Forge Bridge Unavailable</h2>
        <p>${escapeHtml(err?.message || 'Open inside Jira Service Management or Confluence after forge register, deploy, and install.')}</p>
      </div>
    `;
  }
}

function wireCareBridgeHandlers(root: HTMLElement, snapshot: SnapshotPayload) {
  root.querySelectorAll<HTMLButtonElement>('[data-open-url]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = sanitizeOpenTarget(btn.dataset.openUrl);
      if (target) {
        await router.open(target);
      }
    });
  });

  root.querySelector('#cb-link-page-btn')?.addEventListener('click', async () => {
    if (!snapshot.currentPage) return;
    try {
      await invoke('linkConfluencePage', { pageId: snapshot.currentPage.id });
      statusNotice = `Linked Confluence guidance "${snapshot.currentPage.title}" to CareBridge.`;
    } catch (err: any) {
      statusNotice = err?.message || 'Unable to link Confluence page.';
    }
    await renderCareBridgeForgeUi();
  });

  root.querySelector<HTMLFormElement>('#cb-task-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const created = await invoke<{ id: string }>('recordCareTask', {
        contextRef: root.querySelector<HTMLInputElement>('#cb-task-context')?.value || '',
        description: root.querySelector<HTMLTextAreaElement>('#cb-task-desc')?.value || '',
        priority: root.querySelector<HTMLSelectElement>('#cb-task-priority')?.value || 'routine',
        dueDate: root.querySelector<HTMLInputElement>('#cb-task-due')?.value || undefined,
        responsibleAssignee: root.querySelector<HTMLInputElement>('#cb-task-assignee')?.value || '',
        jsmRequestKey: snapshot.currentRequest?.issueKey,
        confluencePageId: snapshot.currentPage?.id,
      });
      statusNotice = `Saved CareBridge follow-up task ${created.id}.`;
    } catch (err: any) {
      statusNotice = err?.message || 'Unable to save CareBridge task.';
    }
    await renderCareBridgeForgeUi();
  });

  root.querySelector<HTMLFormElement>('#cb-jsm-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const created = await invoke<ForgeJsmRequest>('createJsmFollowUpConfirmed', {
        serviceDeskId: root.querySelector<HTMLInputElement>('#cb-jsm-desk')?.value || '',
        requestTypeId: root.querySelector<HTMLInputElement>('#cb-jsm-type')?.value || '',
        summary: root.querySelector<HTMLInputElement>('#cb-jsm-summary')?.value || '',
        description: root.querySelector<HTMLTextAreaElement>('#cb-jsm-desc')?.value || '',
        confirmedByUser: Boolean(root.querySelector<HTMLInputElement>('#cb-jsm-confirm')?.checked),
      });
      statusNotice = `Created JSM follow-up request ${created.issueKey}.`;
    } catch (err: any) {
      statusNotice = err?.message || 'Confirmation and valid Service Desk / Request Type IDs are required.';
    }
    await renderCareBridgeForgeUi();
  });
}

function escapeHtml(input: string): string {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

void renderCareBridgeForgeUi();
