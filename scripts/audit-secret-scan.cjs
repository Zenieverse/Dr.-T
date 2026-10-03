const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === '.next' || file === 'dist' || file === 'build') continue;
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

console.log('=== SECRET SCAN ON hedera-provenance-kit ===');
const files = walk('hedera-provenance-kit');
let foundSecrets = false;

for (const f of files) {
  const base = path.basename(f);
  if (base === '.env' || base === '.env.local' || base === '.dev.env.json') {
    console.error('FAIL: Forbidden secret file found:', f);
    foundSecrets = true;
  }
  
  const content = fs.readFileSync(f, 'utf8');

  // Check for private key headers
  if (content.includes('BEGIN PRIVATE KEY') || content.includes('BEGIN RSA PRIVATE KEY') || content.includes('BEGIN EC PRIVATE KEY')) {
    console.error('FAIL: Private key PEM block found in:', f);
    foundSecrets = true;
  }

  // Check for hard-coded operator private key string assignment (excluding placeholders)
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/HEDERA_PRIVATE_KEY\s*=\s*[a-zA-Z0-9]{30,}/.test(line) && !line.includes('your_private_key_here') && !line.includes('example')) {
      console.error(`FAIL: Hardcoded HEDERA_PRIVATE_KEY in ${f}:${i + 1}`);
      foundSecrets = true;
    }
  }
}

if (!foundSecrets) {
  console.log(`✅ SCAN PASSED: Zero secrets found across all ${files.length} tracked files!`);
  process.exit(0);
} else {
  console.error('❌ SCAN FAILED: Potential secrets detected.');
  process.exit(1);
}
