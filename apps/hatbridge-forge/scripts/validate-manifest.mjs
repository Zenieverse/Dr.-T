// ============================================================================
// HATBRIDGE FORGE — LOCAL MANIFEST & HANDLER INTEGRITY VALIDATOR
// Verifies runtime, module wiring, exported Rovo action symbols, local icon
// & Custom UI asset files, and supported Atlassian Forge permission scopes.
// Run via: node apps/hatbridge-forge/scripts/validate-manifest.mjs
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const forgeRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(forgeRoot, 'manifest.yml');

const OFFICIAL_ALLOWED_SCOPES = new Set([
  'read:jira-work',
  'write:jira-work',
  'read:page:confluence',
  'read:confluence-content.summary',
  'read:confluence-space.summary',
  'storage:app',
]);

function fail(msg) {
  console.error(`MANIFEST VALIDATION ERROR: ${msg}`);
  process.exit(1);
}

const manifestText = fs.readFileSync(manifestPath, 'utf8');

if (!/runtime:\s*\n\s*name:\s*nodejs22\.x/.test(manifestText)) {
  fail('manifest.yml must declare supported Forge runtime nodejs22.x');
}

const functionBlockMatch = manifestText.match(/\n  function:\n([\s\S]*?)\nresources:/);
if (!functionBlockMatch) {
  fail('Could not locate modules.function block in manifest.yml');
}
const declaredFunctions = new Map();
for (const m of functionBlockMatch[1].matchAll(/- key:\s*([a-z0-9-]+)\s*\n\s*handler:\s*([a-zA-Z0-9_.-]+)/g)) {
  declaredFunctions.set(m[1], m[2]);
}
if (declaredFunctions.size < 5) {
  fail(`Expected at least 5 declared functions (resolver + 4 Rovo actions); found ${declaredFunctions.size}`);
}

// Verify each declared function handler file exists and exports the named symbol
for (const [fnKey, handlerSpec] of declaredFunctions.entries()) {
  const [moduleBase, exportName] = handlerSpec.split('.');
  const tsPath = path.join(forgeRoot, 'src', `${moduleBase}.ts`);
  if (!fs.existsSync(tsPath)) {
    fail(`Handler file missing for function "${fnKey}": ${tsPath}`);
  }
  const srcText = fs.readFileSync(tsPath, 'utf8');
  const exportRegex = new RegExp(`export\\s+(?:async\\s+function|const|function)\\s+${exportName}\\b`);
  if (!exportRegex.test(srcText)) {
    fail(`Handler "${handlerSpec}" referenced by function "${fnKey}" is not exported in src/${moduleBase}.ts`);
  }
}

// Verify all resolver & action function references resolve to declared function keys
for (const m of manifestText.matchAll(/\n[ \t]+function:[ \t]+([a-z0-9-]+)/g)) {
  const referencedKey = m[1];
  if (!declaredFunctions.has(referencedKey)) {
    fail(`Referenced function key "${referencedKey}" is missing from modules.function`);
  }
}

// Verify Rovo agent actions correspond to defined action modules
const actionBlockMatch = manifestText.match(/\n  action:\n([\s\S]*?)\n  function:/);
const declaredActions = new Set(
  Array.from((actionBlockMatch?.[1] || '').matchAll(/- key:\s*([a-z0-9-]+)/g)).map((m) => m[1])
);
const agentBlockMatch = manifestText.match(/\n  rovo:agent:\n([\s\S]*?)\n  action:/);
if (!agentBlockMatch) {
  fail('Missing rovo:agent module definition');
}
for (const m of agentBlockMatch[1].matchAll(/\n\s{8}- ([a-z0-9-]+)/g)) {
  if (!declaredActions.has(m[1])) {
    fail(`Rovo agent references undeclared action "${m[1]}"`);
  }
}

// Verify confluence:contentAction declares viewportSize
const contentActionMatch = manifestText.match(/\n  confluence:contentAction:\n([\s\S]*?)\n  rovo:agent:/);
if (!contentActionMatch || !/viewportSize:\s*(small|medium|large|xlarge|max)/.test(contentActionMatch[1])) {
  fail('confluence:contentAction must specify a valid viewportSize (e.g. medium)');
}

// Verify resources directories and referenced icon files exist on disk
const resourcesMatch = manifestText.match(/\nresources:\n([\s\S]*?)\napp:/);
if (!resourcesMatch) {
  fail('Missing resources block in manifest.yml');
}
const resourcePaths = new Map();
for (const m of resourcesMatch[1].matchAll(/- key:\s*([a-z0-9-]+)\s*\n\s*path:\s*([^\s]+)/g)) {
  const absDir = path.join(forgeRoot, m[2]);
  if (!fs.existsSync(absDir)) {
    fail(`Resource directory missing for "${m[1]}": ${m[2]}`);
  }
  resourcePaths.set(m[1], absDir);
}
if (!fs.existsSync(path.join(resourcePaths.get('hatbridge-ui') || '', 'index.html'))) {
  fail('Custom UI index.html missing inside hatbridge-ui resource path');
}
for (const m of manifestText.matchAll(/icon:\s*resource:([a-z0-9-]+);([^\s]+)/g)) {
  const dir = resourcePaths.get(m[1]);
  if (!dir || !fs.existsSync(path.join(dir, m[2]))) {
    fail(`Referenced icon asset missing: resource:${m[1]};${m[2]}`);
  }
}

// Verify scopes are strictly official Forge scopes
const scopesMatch = manifestText.match(/\npermissions:\s*\n\s*scopes:\n([\s\S]*)$/);
if (!scopesMatch) {
  fail('Missing permissions.scopes block');
}
const scopes = Array.from(scopesMatch[1].matchAll(/-\s*([^\s]+)/g)).map((m) => m[1]);
if (scopes.length === 0) {
  fail('No scopes declared in manifest.yml');
}
for (const scope of scopes) {
  if (!OFFICIAL_ALLOWED_SCOPES.has(scope)) {
    fail(`Unexpected or unverified scope "${scope}" in manifest.yml`);
  }
}

console.log(
  `PASS: HatBridge Forge manifest.yml verified (${declaredFunctions.size} functions, ${declaredActions.size} Rovo actions, ${scopes.length} official scopes, all local assets present).`
);
