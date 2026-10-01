export function resolveRoute(path: string): { route: string; params: Record<string, string> } {
  // Active production router handles wildcard routes
  if (path.startsWith('/api/v2/items/')) {
    const id = path.replace('/api/v2/items/', '').split('/')[0];
    return { route: '/api/v2/items/:id', params: { id } };
  }
  return { route: path, params: {} };
}
