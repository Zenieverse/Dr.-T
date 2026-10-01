import { compareVersions } from './version_parser';

if (compareVersions('1.2.3', '1.2.3') !== 0) process.exit(1);
if (compareVersions('1.10.0', '1.9.0') <= 0) process.exit(1);
if (compareVersions('2.0.0-rc1', '1.9.9') <= 0) process.exit(1);

console.log('PASS: compareVersions correctly normalizes and compares version strings');
process.exit(0);
