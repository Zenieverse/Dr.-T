import { extractBearerToken } from './token_extractor';

const cases = [
  { header: 'Bearer token123', expected: 'token123' },
  { header: 'bearer token456', expected: 'token456' },
  { header: 'BEARER secret-key', expected: 'secret-key' },
  { header: 'Basic dXNlcjpwYXNz', expected: null },
  { header: undefined, expected: null }
];

for (const c of cases) {
  const result = extractBearerToken(c.header);
  if (result !== c.expected) {
    console.error(`FAIL: For '${c.header}', expected '${c.expected}', got '${result}'`);
    process.exit(1);
  }
}

console.log('PASS: extractBearerToken correctly parses case-insensitive Bearer headers');
process.exit(0);
