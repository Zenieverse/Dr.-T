// ============================================================================
// HATBRIDGE FORGE — REAL ATLASSIAN BRIDGE ADAPTER & RESOLVER ENTRYPOINT
// Uses official @forge/api (asUser()), @forge/kvs, and @forge/resolver.
// Preserves user-level Jira & Confluence permissions on every call.
// ============================================================================

import api, { route } from '@forge/api';
import { kvs } from '@forge/kvs';
import Resolver, { ResolverRequest } from '@forge/resolver';
import {
  buildGroundedForgeReentryBrief,
  captureJiraOrConfluenceContext,
  createJiraIssueFromForgeConfirmed,
  ForgeAdapters,
  ForgeConfluencePageSummary,
  ForgeJiraIssueSummary,
  getWorkspaceSnapshot,
  linkConfluencePageToRole,
  linkJiraIssueToRole,
  removeCapturedContextItem,
  saveWorkplaceDecision,
  saveWorkplaceHandoff,
} from './coreService.js';
import { ForgeBoundaryError } from './privacyGuard.js';

export function buildLiveForgeAdapters(accountId: string): ForgeAdapters {
  if (!accountId || accountId === 'anonymous') {
    throw new ForgeBoundaryError(
      'AUTH_CONTEXT_REQUIRED',
      'Atlassian user authentication context is required before accessing HatBridge Forge.'
    );
  }
  return {
    getUserAccountId: () => accountId,
    kvsGet: <T>(key: string) => kvs.get<T>(key),
    kvsSet: (key: string, value: unknown) => kvs.set(key, value),
    fetchJiraIssues: async (jql: string): Promise<ForgeJiraIssueSummary[]> => {
      const resp = await api
        .asUser()
        .requestJira(route`/rest/api/3/search/jql?jql=${jql}&maxResults=10&fields=summary,status,project,assignee,updated`, {
          method: 'GET',
        });
      if (!resp.ok) return [];
      const data = await resp.json();
      return Array.isArray(data?.issues)
        ? data.issues.map((item: any) => ({
            key: item.key,
            summary: item.fields?.summary || 'Untitled issue',
            status: item.fields?.status?.name || 'Open',
            projectKey: item.fields?.project?.key || '',
            assignee: item.fields?.assignee?.displayName,
            openUrl: `/browse/${encodeURIComponent(String(item.key || ''))}`,
            updatedAt: item.fields?.updated || new Date().toISOString(),
          }))
        : [];
    },
    fetchJiraIssueByKey: async (issueKey: string): Promise<ForgeJiraIssueSummary | null> => {
      const resp = await api
        .asUser()
        .requestJira(route`/rest/api/3/issue/${issueKey}?fields=summary,status,project,assignee,updated`, {
          method: 'GET',
        });
      if (!resp.ok) return null;
      const item = await resp.json();
      const key = String(item.key || issueKey);
      return {
        key,
        summary: item.fields?.summary || 'Untitled issue',
        status: item.fields?.status?.name || 'Open',
        projectKey: item.fields?.project?.key || '',
        assignee: item.fields?.assignee?.displayName,
        openUrl: `/browse/${encodeURIComponent(key)}`,
        updatedAt: item.fields?.updated || new Date().toISOString(),
      };
    },
    createJiraIssue: async (payload): Promise<{ id: string; key: string }> => {
      const resp = await api.asUser().requestJira(route`/rest/api/3/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          fields: {
            project: { key: payload.projectKey },
            summary: payload.summary,
            issuetype: { name: payload.issueType || 'Task' },
            description: {
              type: 'doc',
              version: 1,
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: payload.description || 'Created from HatBridge Forge' }],
                },
              ],
            },
          },
        }),
      });
      if (!resp.ok) {
        throw new ForgeBoundaryError('JIRA_CREATE_FAILED', `Jira issue creation failed with HTTP ${resp.status}.`);
      }
      const created = await resp.json();
      return { id: created.id, key: created.key };
    },
    searchConfluencePages: async (query: string): Promise<ForgeConfluencePageSummary[]> => {
      const safeQuery = (query || '').replace(/["\\;{}[\]]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
      const cql = safeQuery
        ? `type=page AND text ~ "${safeQuery}" ORDER BY lastmodified DESC`
        : 'type=page ORDER BY lastmodified DESC';
      const resp = await api
        .asUser()
        .requestConfluence(route`/wiki/rest/api/content/search?cql=${cql}&limit=10&expand=space`, {
          method: 'GET',
        });
      if (!resp.ok) return [];
      const data = await resp.json();
      return Array.isArray(data?.results)
        ? data.results.map((pg: any) => {
            const id = String(pg.id);
            const rawWebUi = typeof pg?._links?.webui === 'string' ? pg._links.webui : '';
            const webui = rawWebUi.startsWith('/wiki/')
              ? rawWebUi
              : rawWebUi.startsWith('/')
                ? `/wiki${rawWebUi}`
                : `/wiki/pages/${encodeURIComponent(id)}`;
            return {
              id,
              title: pg.title || 'Untitled page',
              spaceKey: pg.space?.key || '',
              excerpt: pg.excerpt || '',
              openUrl: webui,
              updatedAt: pg.version?.when || new Date().toISOString(),
            };
          })
        : [];
    },
    fetchConfluencePageById: async (pageId: string): Promise<ForgeConfluencePageSummary | null> => {
      const resp = await api
        .asUser()
        .requestConfluence(route`/wiki/api/v2/pages/${pageId}?body-format=atlas_doc_format`, {
          method: 'GET',
        });
      if (!resp.ok) return null;
      const pg = await resp.json();
      const id = String(pg.id || pageId);
      const rawWebUi = typeof pg?._links?.webui === 'string' ? pg._links.webui : '';
      const webui = rawWebUi.startsWith('/wiki/')
        ? rawWebUi
        : rawWebUi.startsWith('/')
          ? `/wiki${rawWebUi}`
          : `/wiki/pages/${encodeURIComponent(id)}`;
      return {
        id,
        title: pg.title || 'Untitled page',
        spaceKey: String(pg.spaceId || ''),
        excerpt: pg.status || '',
        openUrl: webui,
        updatedAt: pg.version?.createdAt || new Date().toISOString(),
      };
    },
  };
}

const resolver = new Resolver();

function extractVerifiedAccountId(req: ResolverRequest): string {
  // Ownership is strictly derived from Atlassian Forge verified request context, never req.payload.
  return (req.context?.principal?.accountId || req.context?.accountId || '').trim();
}

function adaptersFromReq(req: ResolverRequest): ForgeAdapters {
  const accountId = extractVerifiedAccountId(req);
  return buildLiveForgeAdapters(accountId);
}

function sanitizeResolverCall<T>(fn: (req: ResolverRequest) => Promise<T>): (req: ResolverRequest) => Promise<T> {
  return async (req: ResolverRequest) => {
    try {
      return await fn(req);
    } catch (err) {
      if (err instanceof ForgeBoundaryError) {
        throw new Error(`${err.code}: ${err.message}`);
      }
      throw new Error('HATBRIDGE_FORGE_ERROR: Operation could not be completed in this workspace context.');
    }
  };
}

resolver.define(
  'getWorkspaceSnapshot',
  sanitizeResolverCall(async (req) => {
    const issueKey = req.payload?.issueKey || req.context?.extension?.issue?.key;
    const pageId = req.payload?.pageId || req.context?.extension?.content?.id;
    return getWorkspaceSnapshot(adaptersFromReq(req), { issueKey, pageId });
  })
);

resolver.define(
  'linkJiraIssueToRole',
  sanitizeResolverCall(async (req) => {
    return linkJiraIssueToRole(adaptersFromReq(req), {
      roleId: String(req.payload?.roleId || ''),
      roleName: String(req.payload?.roleName || ''),
      issueKey: String(req.payload?.issueKey || req.context?.extension?.issue?.key || ''),
      privacyLevel: req.payload?.privacyLevel,
    });
  })
);

resolver.define(
  'linkConfluencePageToRole',
  sanitizeResolverCall(async (req) => {
    return linkConfluencePageToRole(adaptersFromReq(req), {
      roleId: String(req.payload?.roleId || ''),
      roleName: String(req.payload?.roleName || ''),
      pageId: String(req.payload?.pageId || req.context?.extension?.content?.id || ''),
      privacyLevel: req.payload?.privacyLevel,
    });
  })
);

resolver.define(
  'captureContextItem',
  sanitizeResolverCall(async (req) => {
    const kind = req.payload?.sourceKind === 'confluence' ? 'confluence' : 'jira';
    const fallbackId =
      kind === 'jira' ? req.context?.extension?.issue?.key : req.context?.extension?.content?.id;
    return captureJiraOrConfluenceContext(adaptersFromReq(req), {
      sourceKind: kind,
      sourceId: String(req.payload?.sourceId || fallbackId || ''),
      roleId: req.payload?.roleId ? String(req.payload.roleId) : undefined,
      roleName: String(req.payload?.roleName || ''),
      note: req.payload?.note ? String(req.payload.note) : undefined,
      privacyLevel: req.payload?.privacyLevel,
    });
  })
);

resolver.define(
  'removeCapturedItem',
  sanitizeResolverCall(async (req) => {
    return removeCapturedContextItem(adaptersFromReq(req), String(req.payload?.captureId || ''));
  })
);

resolver.define(
  'saveHandoff',
  sanitizeResolverCall(async (req) => {
    return saveWorkplaceHandoff(adaptersFromReq(req), {
      roleName: String(req.payload?.roleName || ''),
      currentSituation: String(req.payload?.currentSituation || ''),
      nextAction: String(req.payload?.nextAction || ''),
      remainingWork: Array.isArray(req.payload?.remainingWork) ? req.payload.remainingWork : [],
      waitingOn: req.payload?.waitingOn,
      linkedIssueKey: req.payload?.linkedIssueKey,
      privacyLevel: req.payload?.privacyLevel,
    });
  })
);

resolver.define(
  'saveDecision',
  sanitizeResolverCall(async (req) => {
    return saveWorkplaceDecision(adaptersFromReq(req), {
      roleName: String(req.payload?.roleName || ''),
      title: String(req.payload?.title || ''),
      reasoning: String(req.payload?.reasoning || ''),
      sourceRef: req.payload?.sourceRef,
      openUrl: req.payload?.openUrl,
      privacyLevel: req.payload?.privacyLevel,
    });
  })
);

resolver.define(
  'getReentryBrief',
  sanitizeResolverCall(async (req) => {
    return buildGroundedForgeReentryBrief(adaptersFromReq(req), {
      roleName: req.payload?.roleName,
      issueKey: req.payload?.issueKey || req.context?.extension?.issue?.key,
    });
  })
);

resolver.define(
  'createJiraIssueConfirmed',
  sanitizeResolverCall(async (req) => {
    return createJiraIssueFromForgeConfirmed(adaptersFromReq(req), {
      projectKey: String(req.payload?.projectKey || ''),
      summary: String(req.payload?.summary || ''),
      description: String(req.payload?.description || ''),
      issueType: req.payload?.issueType,
      privacyLevel: req.payload?.privacyLevel,
      confirmedByUser: Boolean(req.payload?.confirmedByUser),
    });
  })
);

export const handler = resolver.getDefinitions();
