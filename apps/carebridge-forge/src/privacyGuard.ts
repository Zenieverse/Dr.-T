// ============================================================================
// CAREBRIDGE FORGE — PRIVACY, DATA MINIMIZATION & CLINICAL SAFETY GUARD
// Enforces:
//   - Strict data minimization before writing to Jira Service Management
//   - Non-diagnostic administrative boundaries
//   - Explicit user confirmation before JSM writes
//   - Strict Atlassian key / ID / URL / search query sanitization
// ============================================================================

export class CareBridgeForgeError extends Error {
  public readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'CareBridgeForgeError';
    this.code = code;
  }
}

const SENSITIVE_PHI_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/, reason: 'Social Security Number pattern detected' },
  { pattern: /\b(?:mrn|medical record number)\s*[:#-]?\s*[a-z0-9-]{3,}/i, reason: 'Medical Record Number (MRN) detected' },
  { pattern: /\b(?:dob|date of birth|born on)\s*[:#-]?\s*\d{1,4}[/-]\d{1,2}[/-]\d{1,4}/i, reason: 'Date of Birth (DOB) identifier detected' },
  { pattern: /\b(?:icd-?10|hba1c|egfr|biopsy|pathology result|prescription dose|mg\/dl)\b/i, reason: 'Detailed lab or diagnostic biomarker value detected' },
];

const DIAGNOSTIC_CLAIM_PATTERNS = [
  /\byou have\b.*\b(disease|cancer|diabetes|infection|syndrome)\b/i,
  /\bprescribe\b|\bdosage\b|\bstart taking\b|\bstop taking\b/i,
];

export function validateIssueKey(raw: string): string {
  const key = (raw || '').trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9]{1,9}-\d{1,8}$/.test(key)) {
    throw new CareBridgeForgeError(
      'INVALID_ISSUE_KEY',
      'Issue or JSM request key must match standard Atlassian project key format (e.g. CARE-42).'
    );
  }
  return key;
}

export function validateNumericId(raw: string, label = 'ID'): string {
  const id = (raw || '').trim();
  if (!/^\d{1,20}$/.test(id)) {
    throw new CareBridgeForgeError('INVALID_NUMERIC_ID', `${label} must be a numeric identifier.`);
  }
  return id;
}

export function sanitizeSearchQuery(raw: string): string {
  return (raw || '').replace(/["\\;{}[\]]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
}

export function sanitizeAtlassianOpenUrl(raw?: string): string | undefined {
  const val = (raw || '').trim();
  if (!val) return undefined;
  if (val.startsWith('/') && !val.startsWith('//')) return val;
  if (/^https:\/\/[a-zA-Z0-9.-]+\.atlassian\.net(\/|$)/i.test(val)) return val;
  return undefined;
}

export function assertMinimizedFollowUpText(text: string, fieldLabel = 'Text'): string {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    throw new CareBridgeForgeError('EMPTY_FIELD', `${fieldLabel} is required.`);
  }
  for (const rule of SENSITIVE_PHI_PATTERNS) {
    if (rule.pattern.test(trimmed)) {
      throw new CareBridgeForgeError(
        'DATA_MINIMIZATION_BLOCKED',
        `${fieldLabel} blocked by CareBridge data minimization: ${rule.reason}. Use non-sensitive administrative wording instead.`
      );
    }
  }
  for (const diag of DIAGNOSTIC_CLAIM_PATTERNS) {
    if (diag.test(trimmed)) {
      throw new CareBridgeForgeError(
        'NON_DIAGNOSTIC_POLICY_BLOCKED',
        `${fieldLabel} cannot contain medical diagnoses or medication instructions.`
      );
    }
  }
  return trimmed.slice(0, 400);
}

export function assertUserConfirmedWrite(confirmed: boolean | undefined, actionLabel: string): void {
  if (!confirmed) {
    throw new CareBridgeForgeError(
      'USER_CONFIRMATION_REQUIRED',
      `Explicit user confirmation is required before ${actionLabel}.`
    );
  }
}
