import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
const bundlePath = path.join(process.cwd(), 'dist', 'server.cjs');

if (fs.existsSync(bundlePath) && process.env.npm_lifecycle_event !== 'dev') {
  require(bundlePath);
} else {
  await import('./server.impl.ts');
}
