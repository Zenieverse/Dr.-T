// Ambient declarations matching @forge/api, @forge/kvs, @forge/resolver, and @forge/bridge
// so TypeScript validation works cleanly both before and after Forge CLI bundling.

declare module '@forge/api' {
  export interface ForgeResponse {
    ok: boolean;
    status: number;
    json: () => Promise<any>;
    text: () => Promise<string>;
  }

  export interface ForgeRouteTag {
    (strings: TemplateStringsArray, ...values: unknown[]): string;
  }

  export const route: ForgeRouteTag;

  export interface ForgeRequester {
    requestJira: (path: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<ForgeResponse>;
    requestConfluence: (path: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<ForgeResponse>;
  }

  const api: {
    asUser: () => ForgeRequester;
    asApp: () => ForgeRequester;
  };

  export default api;
}

declare module '@forge/kvs' {
  export const kvs: {
    get: <T = any>(key: string) => Promise<T | undefined>;
    set: (key: string, value: unknown) => Promise<void>;
    delete: (key: string) => Promise<void>;
  };
}

declare module '@forge/resolver' {
  export interface ResolverRequest {
    payload: Record<string, any>;
    context: {
      accountId?: string;
      cloudId?: string;
      principal?: { accountId?: string };
      extension?: {
        issue?: { id?: string; key?: string };
        content?: { id?: string };
        space?: { key?: string };
        type?: string;
      };
    };
  }

  export default class Resolver {
    define(name: string, cb: (req: ResolverRequest) => Promise<any> | any): void;
    getDefinitions(): any;
  }
}

declare module '@forge/bridge' {
  export function invoke<T = any>(functionKey: string, payload?: Record<string, any>): Promise<T>;
  export const view: {
    getContext: () => Promise<Record<string, any>>;
  };
  export const router: {
    open: (url: string | Record<string, any>) => Promise<void>;
    navigate: (url: string | Record<string, any>) => Promise<void>;
  };
}
