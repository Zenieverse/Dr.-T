import { AuditEvent } from './event_types';

export class AuditEventEmitter {
  private events: AuditEvent[] = [];

  emitEvent(event: AuditEvent): void {
    const normalized: AuditEvent = {
      ...event,
      accountId: event.accountId || event.userId || 'anonymous',
      userId: event.userId || event.accountId
    };
    this.events.push(normalized);
  }

  getEvents(): AuditEvent[] {
    return this.events;
  }
}
