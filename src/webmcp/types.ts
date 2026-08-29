// ============================================================================
// WEBMCP STANDARD TYPES & INTERFACES FOR OPENWEBOS
// ============================================================================

export type ToolClassification = 'READ' | 'ACTION' | 'SENSITIVE';
export type ToolRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface WebMCPToolSchema {
  type: 'object';
  properties: Record<string, {
    type: string;
    description: string;
    enum?: string[];
    items?: Record<string, any>;
    optional?: boolean;
  }>;
  required?: string[];
}

export interface WebMCPToolDefinition {
  name: string;
  description: string;
  classification: ToolClassification;
  riskLevel: ToolRiskLevel;
  schema: WebMCPToolSchema;
  handler: (args: any, context?: any) => Promise<any> | any;
  lastExecuted?: string;
  executionCount?: number;
}

export type AgentRole = 'EXPLORER' | 'ANALYST' | 'PLANNER' | 'CRITIC' | 'CREATOR';

export type OrchestrationState = 
  | 'IDLE'
  | 'UNDERSTANDING'
  | 'DISCOVERING_TOOLS'
  | 'EXECUTING'
  | 'WAITING_FOR_APPROVAL'
  | 'CREATING'
  | 'REVIEWING'
  | 'COMPLETED'
  | 'ERROR';

export interface AgentActivityEvent {
  id: string;
  timestamp: string;
  timeLabel: string;
  actor: 'HUMAN' | 'AGENT' | 'WEBMCP_KERNEL';
  role?: AgentRole;
  toolName?: string;
  status: 'queued' | 'running' | 'success' | 'warning' | 'error';
  title: string;
  summary: string;
  payload?: any;
  result?: any;
  durationMs?: number;
}

export interface CanvasCard {
  id: string;
  title: string;
  type: 'plan' | 'document' | 'table' | 'summary' | 'option' | 'budget' | 'review';
  author: 'Human' | 'Agent' | 'WebMCP Tool';
  createdAt: string;
  status: 'draft' | 'approved' | 'rejected' | 'pinned';
  content: string;
  metadata?: Record<string, any>;
  tags?: string[];
  pinned?: boolean;
  comments?: Array<{ id: string; author: string; text: string; time: string }>;
}

export interface AgentProposal {
  id: string;
  title: string;
  description: string;
  reasoning: string[];
  toolAction?: string;
  suggestedChanges: any;
  costImpact?: number;
  sustainabilityImpact?: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: 'HUMAN' | 'AGENT' | 'WEBMCP_SYSTEM';
  action: string;
  toolName?: string;
  argumentsSummary: string;
  resultSummary: string;
  riskLevel: ToolRiskLevel;
  approvalStatus: 'APPROVED' | 'AUTO_ALLOWED' | 'REJECTED' | 'PENDING';
  hash: string;
}

export interface WebMCPOptionItem {
  id: string;
  name: string;
  category: 'experiences' | 'accommodations' | 'transport' | 'restaurants' | 'activities';
  price: number;
  rating: number;
  sustainabilityScore: number;
  description: string;
  location: string;
  tags: string[];
}

export interface WebMCPStatus {
  supported: boolean;
  registeredToolsCount: number;
  browser: string;
  version: string;
  connected: boolean;
  transport: 'native_webmcp' | 'simulated_fallback';
  lastPing: string;
}
