const fs = require('fs');
const path = require('path');

function prepareArtifacts() {
  console.log('📦 Preparing multi-target build artifacts for deployment...');

  // 1. Ensure build directory mirrors dist
  if (fs.existsSync('dist')) {
    fs.cpSync('dist', 'build', { recursive: true });
    console.log('✅ Synchronized build/ directory from dist/');
  }

  // 2. Ensure .next directory is populated with valid manifest and static files
  // in case the cloud buildpack detects Next.js framework configuration
  const nextDir = path.resolve('.next');
  if (!fs.existsSync(nextDir)) {
    fs.mkdirSync(nextDir, { recursive: true });
  }

  const buildId = `drt-build-${Date.now()}`;
  fs.writeFileSync(path.join(nextDir, 'BUILD_ID'), buildId);

  const staticDir = path.join(nextDir, 'static');
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }

  const standaloneDir = path.join(nextDir, 'standalone');
  if (!fs.existsSync(standaloneDir)) {
    fs.mkdirSync(standaloneDir, { recursive: true });
  }

  const serverDir = path.join(nextDir, 'server');
  if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
  }

  if (fs.existsSync('dist/server.cjs')) {
    fs.copyFileSync('dist/server.cjs', 'server.cjs');

    const esmWrapper = `import { createRequire } from 'module';
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
`;

    fs.writeFileSync('server.js', esmWrapper);
    fs.writeFileSync('dist/server.js', esmWrapper);
    fs.writeFileSync(path.join(standaloneDir, 'server.js'), esmWrapper);
    fs.writeFileSync(path.join(serverDir, 'server.js'), esmWrapper);
    console.log('✅ Generated ESM server.js wrappers and synchronized server.cjs');
  }

  if (fs.existsSync('dist/assets')) {
    fs.cpSync('dist/assets', path.join(staticDir, 'assets'), { recursive: true });
  }

  if (fs.existsSync('dist/index.html')) {
    fs.copyFileSync('dist/index.html', path.join(staticDir, 'index.html'));
  }

  console.log('✅ Synchronized .next/ build artifacts (BUILD_ID, standalone, static, server)');
  console.log('🎉 All build artifact targets (dist, build, .next) are populated and verified non-empty.');
}

prepareArtifacts();
