import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const candidates = [
  path.join(__dirname, 'dist', 'server.cjs'),
  path.join(__dirname, 'server.cjs'),
  path.join(process.cwd(), 'dist', 'server.cjs'),
  path.join(process.cwd(), 'server.cjs')
];

let loaded = false;
for (const cand of candidates) {
  if (fs.existsSync(cand)) {
    require(cand);
    loaded = true;
    break;
  }
}

if (!loaded) {
  console.error('Failed to locate server.cjs bundle');
  process.exit(1);
}
