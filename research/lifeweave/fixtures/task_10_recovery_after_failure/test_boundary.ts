import { handleIncomingRequest } from './request_boundary';

// Valid
const res1 = handleIncomingRequest({ count: 5 });
if (res1.status !== 200 || res1.count !== 5) process.exit(1);

// Invalid input returns 400 validation error, not 500
const res2 = handleIncomingRequest({ count: -10 });
if (res2.status !== 400) {
  console.error(`FAIL: Expected status 400 for negative count, got ${res2.status}`);
  process.exit(1);
}

const res3 = handleIncomingRequest({ count: 'not-a-number' });
if (res3.status !== 400) {
  console.error(`FAIL: Expected status 400 for NaN count, got ${res3.status}`);
  process.exit(1);
}

console.log('PASS: handleIncomingRequest properly catches validation errors and emits 400');
process.exit(0);
