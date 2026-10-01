import { AuditEventEmitter } from './event_emitter';

const emitter = new AuditEventEmitter();

// Emit with legacy userId
emitter.emitEvent({
  userId: 'usr_123',
  accountId: '',
  action: 'login',
  timestamp: Date.now()
});

// Emit with modern accountId
emitter.emitEvent({
  accountId: 'acc_456',
  action: 'update_settings',
  timestamp: Date.now()
});

const events = emitter.getEvents();
if (events.length !== 2) process.exit(1);
if (events[0].accountId !== 'usr_123') process.exit(1);
if (events[1].userId !== 'acc_456') process.exit(1);

console.log('PASS: AuditEventEmitter preserves bidirectional backward compatibility');
process.exit(0);
