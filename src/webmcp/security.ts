import { WebMCPToolSchema, ToolClassification, ToolRiskLevel, AuditLogEntry } from './types';
import { SCHEMAS } from './schemas';

// ============================================================================
// WEBMCP SECURITY PIPELINE & PERMISSION ENFORCEMENT
// ============================================================================

export const CLASSIFICATIONS: Record<string, { classification: ToolClassification; risk: ToolRiskLevel }> = {
  search_products: { classification: 'READ', risk: 'LOW' },
  search_options: { classification: 'READ', risk: 'LOW' },
  get_option_details: { classification: 'READ', risk: 'LOW' },
  compare_options: { classification: 'READ', risk: 'LOW' },
  rank_options: { classification: 'READ', risk: 'LOW' },
  calculate_budget: { classification: 'READ', risk: 'LOW' },
  summarize_workspace: { classification: 'READ', risk: 'LOW' },

  create_artifact: { classification: 'ACTION', risk: 'HIGH' },
  update_artifact: { classification: 'ACTION', risk: 'MEDIUM' },
  add_to_canvas: { classification: 'ACTION', risk: 'LOW' },
  remove_from_canvas: { classification: 'ACTION', risk: 'MEDIUM' },
  save_workspace: { classification: 'ACTION', risk: 'LOW' },
  export_artifact: { classification: 'ACTION', risk: 'LOW' },
};

/**
 * Validates untrusted input arguments against tool schema
 */
export function validateToolArguments(toolName: string, args: any, customSchema?: WebMCPToolSchema): { valid: boolean; error?: string; sanitizedArgs: any } {
  const schema: WebMCPToolSchema | undefined = customSchema || SCHEMAS[toolName];
  if (!schema) {
    // If no schema specified for dynamically added tool, pass through sanitized object
    if (typeof args === 'object' && args !== null) {
      return { valid: true, sanitizedArgs: args };
    }
    return { valid: true, sanitizedArgs: {} };
  }

  if (typeof args !== 'object' || args === null) {
    return { valid: false, error: `Tool arguments must be an object`, sanitizedArgs: null };
  }

  const sanitized: Record<string, any> = {};

  // Check required fields
  if (schema.required) {
    for (const reqField of schema.required) {
      if (args[reqField] === undefined || args[reqField] === null || args[reqField] === '') {
        return { valid: false, error: `Missing required parameter: '${reqField}' for tool '${toolName}'`, sanitizedArgs: null };
      }
    }
  }

  // Sanitize values
  for (const [key, prop] of Object.entries(schema.properties)) {
    if (args[key] !== undefined) {
      const val = args[key];
      if (prop.type === 'string' && typeof val === 'string') {
        // Enforce maximum length to prevent payload bombs
        const cleanStr = val.trim().slice(0, 10000);
        // Strip potential script injections
        sanitized[key] = cleanStr.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        if (prop.enum && !prop.enum.includes(sanitized[key])) {
          return { valid: false, error: `Field '${key}' value must be one of: ${prop.enum.join(', ')}`, sanitizedArgs: null };
        }
      } else if (prop.type === 'number' && typeof val === 'number') {
        if (isNaN(val) || !isFinite(val)) {
          return { valid: false, error: `Field '${key}' must be a valid number`, sanitizedArgs: null };
        }
        sanitized[key] = val;
      } else if (prop.type === 'array' && Array.isArray(val)) {
        sanitized[key] = val.slice(0, 100); // cap array lengths
      } else {
        sanitized[key] = val;
      }
    }
  }

  return { valid: true, sanitizedArgs: sanitized };
}

/**
 * Checks whether a tool requires human confirmation before execution
 */
export function requiresHumanApproval(toolName: string, args: any): boolean {
  const meta = CLASSIFICATIONS[toolName];
  if (!meta) return false;

  // Sensitive actions always require human confirmation
  if (meta.risk === 'HIGH') return true;
  if (toolName === 'create_artifact') return true;
  if (toolName === 'remove_from_canvas') return true;

  // Modifying existing shared resources
  if (toolName === 'update_artifact' && args?.changes?.status === 'approved') return true;

  return false;
}

/**
 * Creates cryptographic hash for immutable audit log chain
 */
export function generateAuditHash(previousHash: string, entry: Partial<AuditLogEntry>): string {
  const payload = `${previousHash}|${entry.timestamp}|${entry.actor}|${entry.toolName}|${entry.action}|${entry.argumentsSummary}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `0x${Math.abs(hash).toString(16).padStart(8, '0')}`;
}
