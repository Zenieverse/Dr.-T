// ============================================================================
// HATBRIDGE FORGE — PRIVACY & CONFIRMATION BOUNDARY GUARD
// Enforces:
//   - private_personal content NEVER crosses into Jira, Confluence, or Rovo
//   - Explicit user confirmation required before any Jira write
//   - Input validation for Jira keys, project keys, page IDs, and JQL/CQL queries
// ============================================================================

export type ForgePrivacyLevel = 'private_personal' | 'work_team' | 'work_restricted';

export class ForgeBoundaryError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ForgeBoundaryError';
  }
}

export function assertWorkplaceExportAllowed(privacyLevel?: string): void {
  if (!privacyLevel || privacyLevel === 'private_personal') {
    throw new ForgeBoundaryError(
      'PRIVACY_BOUNDARY_VIOLATION',
      'Private personal data is restricted to the user personal vault and cannot be exported or stored inside shared Atlassian Forge contexts.'
    );
  }
  if (privacyLevel !== 'work_team' && privacyLevel !== 'work_restricted') {
    throw new ForgeBoundaryError('INVALID_PRIVACY_CLASSIFICATION', `Unsupported privacy classification: ${privacyLevel}`);
  }
}

export function assertUserConfirmedWrite(confirmedByUser: unknown, actionLabel: string): void {
  if (confirmedByUser !== true) {
    throw new ForgeBoundaryError(
      'USER_CONFIRMATION_REQUIRED',
      `Explicit user confirmation is required before ${actionLabel}.`
    );
  }
}

export function validateJiraIssueKey(raw: string): string {
  const clean = (raw || '').trim().toUpperCase();
  if (!/^[A-Z0-9_]{1,16}-\d{1,10}$/.test(clean)) {
    throw new ForgeBoundaryError('INVALID_ISSUE_KEY', `Invalid Jira issue key: "${raw}"`);
  }
  return clean;
}

export function validateJiraProjectKey(raw: string): string {
  const clean = (raw || '').trim().toUpperCase();
  if (!/^[A-Z0-9_]{1,16}$/.test(clean)) {
    throw new ForgeBoundaryError('INVALID_PROJECT_KEY', `Invalid Jira project key: "${raw}"`);
  }
  return clean;
}

export function validateConfluencePageId(raw: string): string {
  const clean = (raw || '').trim();
  if (!/^\d{1,20}$/.test(clean)) {
    throw new ForgeBoundaryError('INVALID_PAGE_ID', `Invalid Confluence page ID: "${raw}"`);
  }
  return clean;
}

export function sanitizeSearchQuery(raw: string): string {
  return (raw || '')
    .replace(/["\\;{}\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}
