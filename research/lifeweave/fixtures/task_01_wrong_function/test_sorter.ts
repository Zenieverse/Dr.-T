import { sortTags } from './sorter';

const input = ['v1.10', 'v1.2', 'v1.1', 'beta', 'alpha'];
const expected = ['alpha', 'beta', 'v1.1', 'v1.2', 'v1.10'];

const result = sortTags(input);
const passed = JSON.stringify(result) === JSON.stringify(expected);

if (!passed) {
  console.error(`FAIL: Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
  process.exit(1);
}

console.log('PASS: sortTags handles alphanumeric tags with natural number ordering');
process.exit(0);
