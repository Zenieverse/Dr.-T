// ============================================================================
// CAREBRIDGE FORGE — ATLASSIAN BRIDGE & RESOLVER ENTRYPOINT
// Uses official @forge/api (asUser()), @forge/kvs, and @forge/resolver.
// Supports JSM Portal Request Detail Panel, Jira Issue Panel, Jira Global Page,
// Confluence Global Page, and Confluence Content Action.
// ============================================================================

import api, { route } from '@forge/api';
import { kvs } from '@forge/kvs';
import Resolver, { ResolverRequest } from '@forge/resolver';
import {
  buildCareReentryBriefInForge,
  CareBridgeForgeAdapters,
  createJsmFollowUpConfirmedInForge,
  ForgeConfluencePageSummary,
  ForgeJsmRequestSummary,
  ForgeJsmServiceDeskSummary,
  getCareWorkspaceSnapshot,
  linkConfluencePageInForge,
  recordCareTaskInForge,
} from './coreService.js';
import { CareBridgeForgeError, sanitizeSearchQuery } from './privacyGuard.js';

export function buildCareBridgeForgeAdapters(accountId: string): CareBridgeForgeAdapters {
  if (!accountId || accountId === 'anonymous') {
    throw new CareBridgeForgeError(
      'AUTH_CONTEXT_REQUIRED',
      'Atlassian user authentication context is required before accessing CareBridge Forge.'
    );
  }

  return {
    getUserAccountId: () => accountId,
    kvsGet: <T>(key: string) => kvs.get<T>(key),
    kvsSet: (key: string, value: unknown) => kvs.set(key, value),

    fetchJsmServiceDesks: async (): Promise<ForgeJsmServiceDeskSummary[]> => {
      const resp = await api
        .asUser()
        .requestJira(route`/rest/servicedeskapi/servicedesk?limit=15`, { method: 'GET' });
      if (!resp.ok) return [];
      const data = await resp.json();
      const values = Array.isArray(data?.values) ? data.values : [];
      const desks: ForgeJsmServiceDeskSummary[] = [];
      for (const sd of values.slice(0, 6)) {
        const deskId = String(sd.id || '');
        if (!deskId) continue;
        const rtResp = await api
          .asUser()
          .requestJira(route`/rest/servicedeskapi/servicedesk/${deskId}/requesttype?limit=15`, { method: 'GET' });
        const rtData = rtResp.ok ? await rtResp.json() : { values: [] };
        desks.push({
          id: deskId,
          projectKey: String(sd.projectKey || ''),
          projectName: String(sd.projectName || 'Service Desk'),
          requestTypes: Array.isArray(rtData?.values)
            ? rtData.values.map((rt: any) => ({
                id: String(rt.id || ''),
                name: String(rt.name || 'Follow-Up Request'),
              }))
            : [],
        });
      }
      return desks;
    },

    fetchJsmRequests: async (): Promise<ForgeJsmRequestSummary[]> => {
      const resp = await api
        .asUser()
        .requestJira(route`/rest/servicedeskapi/request?limit=12`, { method: 'GET' });
      if (!resp.ok) return [];
      const data = await resp.json();
      return Array.isArray(data?.values)
        ? data.values.map((req: any) => ({
            issueId: String(req.issueId || ''),
            issueKey: String(req.issueKey || ''),
            serviceDeskId: String(req.serviceDeskId || ''),
            requestTypeId: String(req.requestTypeId || ''),
            summary: String(
              req.requestFieldValues?.find((f: any) => f.fieldId === 'summary')?.value || 'Care coordination request'
            ),
            status: String(req.currentStatus?.status || 'Open'),
            createdDate: String(req.createdDate?.iso8601 || new Date().toISOString()),
            openUrl: String(req._links?.web || `/servicedesk/customer/portal/${encodeURIComponent(String(req.serviceDeskId || '1'))}/${encodeURIComponent(String(req.issueKey || ''))}`),
          }))
        : [];
    },

    fetchJsmRequestByKey: async (issueKey: string): Promise<ForgeJsmRequestSummary | null> => {
      const resp = await api
        .asUser()
        .requestJira(route`/rest/servicedeskapi/request/${issueKey}`, { method: 'GET' });
      if (!resp.ok) return null;
      const req = await resp.json();
      const key = String(req.issueKey || issueKey);
      return {
        issueId: String(req.issueId || ''),
        issueKey: key,
        serviceDeskId: String(req.serviceDeskId || ''),
        requestTypeId: String(req.requestTypeId || ''),
        summary: String(
          req.requestFieldValues?.find((f: any) => f.fieldId === 'summary')?.value || 'Care coordination request'
        ),
        status: String(req.currentStatus?.status || 'Open'),
        createdDate: String(req.createdDate?.iso8601 || new Date().toISOString()),
        openUrl: String(req._links?.web || `/browse/${encodeURIComponent(key)}`),
      };
    },

    createJsmRequest: async (payload): Promise<ForgeJsmRequestSummary> => {
      const resp = await api.asUser().requestJira(route`/rest/servicedeskapi/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          serviceDeskId: payload.serviceDeskId,
          requestTypeId: payload.requestTypeId,
          requestFieldValues: {
            summary: payload.summary,
            description: payload.description,
          },
        }),
      });
      if (!resp.ok) {
        throw new CareBridgeForgeError('JSM_CREATE_FAILED', `JSM follow-up request failed with HTTP ${resp.status}.`);
      }
      const req = await resp.json();
      const key = String(req.issueKey || '');
      return {
        issueId: String(req.issueId || ''),
        issueKey: key,
        serviceDeskId: String(req.serviceDeskId || payload.serviceDeskId),
        requestTypeId: String(req.requestTypeId || payload.requestTypeId),
        summary: payload.summary,
        status: String(req.currentStatus?.status || 'Waiting for support'),
        createdDate: String(req.createdDate?.iso8601 || new Date().toISOString()),
        openUrl: String(req._links?.web || `/servicedesk/customer/portal/${encodeURIComponent(payload.serviceDeskId)}/${encodeURIComponent(key)}`),
      };
    },

    searchConfluencePages: async (query: string): Promise<ForgeConfluencePageSummary[]> => {
      const safe = sanitizeSearchQuery(query);
      const cql = safe ? `type=page AND text ~ "${safe}" ORDER BY lastmodified DESC` : 'type=page ORDER BY lastmodified DESC';
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
            const openUrl = rawWebUi.startsWith('/wiki/')
              ? rawWebUi
              : rawWebUi.startsWith('/')
                ? `/wiki${rawWebUi}`
                : `/wiki/pages/${encodeURIComponent(id)}`;
            return {
              id,
              title: pg.title || 'Untitled care page',
              spaceKey: pg.space?.key || '',
              excerpt: String(pg.excerpt || '').replace(/<[^>]+>/g, ''),
              openUrl,
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
      const openUrl = rawWebUi.startsWith('/wiki/')
        ? rawWebUi
        : rawWebUi.startsWith('/')
          ? `/wiki${rawWebUi}`
          : `/wiki/pages/${encodeURIComponent(id)}`;
      return {
        id,
        title: pg.title || 'Untitled care page',
        spaceKey: String(pg.spaceId || ''),
        excerpt: pg.status || '',
        openUrl,
        updatedAt: pg.version?.createdAt || new Date().toISOString(),
      };
    },
  };
}

const resolver = new Resolver();

function extractVerifiedAccountId(req: ResolverRequest): string {
  return (req.context?.principal?.accountId || req.context?.accountId || '').trim();
}

function adaptersFromReq(req: ResolverRequest): CareBridgeForgeAdapters {
  return buildCareBridgeForgeAdapters(extractVerifiedAccountId(req));
}

function sanitizeResolverCall<T>(fn: (req: ResolverRequest) => Promise<T>): (req: ResolverRequest) => Promise<T> {
  return async (req: ResolverRequest) => {
    try {
      return await fn(req);
    } catch (err) {
      if (err instanceof CareBridgeForgeError) {
        throw new Error(`${err.code}: ${err.message}`);
      }
      throw new Error('CAREBRIDGE_FORGE_ERROR: Operation could not be completed in this Atlassian context.');
    }
  };
}

resolver.define(
  'getCareWorkspaceSnapshot',
  sanitizeResolverCall(async (req) => {
    const issueKey = req.payload?.issueKey || req.context?.extension?.request?.key || req.context?.extension?.issue?.key;
    const pageId = req.payload?.pageId || req.context?.extension?.content?.id;
    return getCareWorkspaceSnapshot(adaptersFromReq(req), { issueKey, pageId });
  })
);

resolver.define(
  'recordCareTask',
  sanitizeResolverCall(async (req) => {
    return recordCareTaskInForge(adaptersFromReq(req), {
      contextRef: String(req.payload?.contextRef || ''),
      description: String(req.payload?.description || ''),
      priority: req.payload?.priority,
      dueDate: req.payload?.dueDate,
      responsibleAssignee: req.payload?.responsibleAssignee,
      jsmRequestKey: req.payload?.jsmRequestKey || req.context?.extension?.request?.key || req.context?.extension?.issue?.key,
      confluencePageId: req.payload?.confluencePageId || req.context?.extension?.content?.id,
    });
  })
);

resolver.define(
  'linkConfluencePage',
  sanitizeResolverCall(async (req) => {
    const pageId = String(req.payload?.pageId || req.context?.extension?.content?.id || '');
    return linkConfluencePageInForge(adaptersFromReq(req), pageId);
  })
);

resolver.define(
  'createJsmFollowUpConfirmed',
  sanitizeResolverCall(async (req) => {
    return createJsmFollowUpConfirmedInForge(adaptersFromReq(req), {
      serviceDeskId: String(req.payload?.serviceDeskId || ''),
      requestTypeId: String(req.payload?.requestTypeId || ''),
      summary: String(req.payload?.summary || ''),
      description: String(req.payload?.description || ''),
      confirmedByUser: Boolean(req.payload?.confirmedByUser),
      taskIdToLink: req.payload?.taskIdToLink ? String(req.payload.taskIdToLink) : undefined,
    });
  })
);

resolver.define(
  'getCareReentryBrief',
  sanitizeResolverCall(async (req) => {
    const issueKey = req.payload?.issueKey || req.context?.extension?.request?.key || req.context?.extension?.issue?.key;
    return buildCareReentryBriefInForge(adaptersFromReq(req), {
      issueKey,
      query: req.payload?.query ? String(req.payload.query) : undefined,
    });
  })
);

export const handler = resolver.getDefinitions();
