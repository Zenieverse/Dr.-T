import { computeBackoff } from './retry_policy';

// Normal exponential progression
if (computeBackoff(0, 100) !== 100) process.exit(1);
if (computeBackoff(1, 100) !== 200) process.exit(1);
if (computeBackoff(2, 100) !== 400) process.exit(1);

// Negative attempt clamp check
if (computeBackoff(-5, -50) !== 100) {
  console.error('FAIL: Negative backoff inputs did not clamp to positive minimum');
  process.exit(1);
}

console.log('PASS: computeBackoff strictly clamps backoff duration to positive range');
process.exit(0);
