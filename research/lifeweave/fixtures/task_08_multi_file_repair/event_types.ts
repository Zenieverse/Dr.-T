export interface AuditEvent {
  accountId: string;
  userId?: string; // Backwards compatible alias
  action: string;
  timestamp: number;
}
