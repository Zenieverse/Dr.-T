import fs from 'fs';
import { execSync } from 'child_process';

const width = 1200;
const height = 900;

// High-fidelity SVG recreation of the user's exact uploaded InCoatofWhite.png
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Background Base Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#55c0ab" />
      <stop offset="35%" stop-color="#64cbb8" />
      <stop offset="70%" stop-color="#46a996" />
      <stop offset="100%" stop-color="#2d8776" />
    </linearGradient>

    <!-- Surgical Lamp Glow (Bottom Left) -->
    <radialGradient id="lampGlow" cx="24%" cy="66%" r="35%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="25%" stop-color="#fffbeb" stop-opacity="0.75" />
      <stop offset="55%" stop-color="#a7f3d0" stop-opacity="0.45" />
      <stop offset="85%" stop-color="#55c0ab" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#55c0ab" stop-opacity="0" />
    </radialGradient>

    <!-- Upper Left Bokeh Light -->
    <radialGradient id="upperBokeh" cx="17%" cy="21%" r="12%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
      <stop offset="40%" stop-color="#fef9c3" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#64cbb8" stop-opacity="0" />
    </radialGradient>

    <!-- Right Doctor Scrub Silhouette Glow -->
    <radialGradient id="scrubGlow" cx="78%" cy="45%" r="42%">
      <stop offset="0%" stop-color="#147b6a" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#248f7d" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#46a996" stop-opacity="0" />
    </radialGradient>

    <!-- Center Soft Glow for Title -->
    <radialGradient id="titleBackGlow" cx="50%" cy="66%" r="45%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
      <stop offset="60%" stop-color="#e6fffa" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#55c0ab" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Soft Medical Bokeh Lights & Shapes -->
  <ellipse cx="280" cy="590" rx="270" ry="240" fill="url(#lampGlow)" />
  <circle cx="200" cy="190" r="95" fill="url(#upperBokeh)" />
  <circle cx="920" cy="410" r="320" fill="url(#scrubGlow)" />
  <ellipse cx="600" cy="590" rx="420" ry="180" fill="url(#titleBackGlow)" />

  <!-- Soft organic blur overlay curves for clinical ambiance -->
  <path d="M 680,220 Q 860,340 980,560 T 1160,880 L 1200,900 L 1200,200 Z" fill="#2d8c7c" opacity="0.18" />
  <path d="M 520,380 Q 720,490 850,710 T 960,900 L 1200,900 L 800,900 Z" fill="#1b6e60" opacity="0.14" />

  <!-- ========================================== -->
  <!-- TOP STANZA: BOLD BLACK SANS-SERIF -->
  <!-- ========================================== -->
  <g font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="47" fill="#000000" text-anchor="middle" letter-spacing="-0.5px">
    <text x="600" y="58">Always comes first in line</text>
    <text x="600" y="138">Melting cold hearts, Feeling dold minds</text>
    <text x="600" y="218">Fighting to last, last vibes</text>
    <text x="600" y="298">Soul sewn, bold up, fear gone, game on!</text>
  </g>

  <!-- ========================================== -->
  <!-- CENTER TITLE: VIBRANT ROYAL BLUE -->
  <!-- ========================================== -->
  <text x="600" y="605" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="94" fill="#1434d6" text-anchor="middle" letter-spacing="-1px">
    In Coat of White
  </text>

  <!-- BY ZEN: RIGHT-ALIGNED BELOW TITLE -->
  <text x="1090" y="688" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="42" fill="#000000" text-anchor="end">
    By ZEN
  </text>

  <!-- ========================================== -->
  <!-- BOTTOM FRENCH STANZA: BOLD BLACK SANS-SERIF -->
  <!-- ========================================== -->
  <g font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="44" fill="#000000" text-anchor="middle" letter-spacing="-0.3px">
    <text x="420" y="830">Salut, Cher Dr., Ça va?</text>
    <text x="420" y="900">Je prie: ‘Toujours, Tu vas bien!’</text>
  </g>
</svg>`;

fs.writeFileSync('./public/InCoatofWhite.svg', svgContent);
fs.writeFileSync('./src/assets/images/InCoatofWhite.svg', svgContent);
console.log('Saved InCoatofWhite.svg');

// Convert SVG to PNG using ImageMagick convert
try {
  execSync('convert -density 150 ./public/InCoatofWhite.svg ./public/InCoatofWhite.png');
  execSync('cp ./public/InCoatofWhite.png ./src/assets/images/InCoatofWhite.png');
  console.log('Converted InCoatofWhite.png successfully');
} catch (err) {
  console.error('Error converting PNG:', err);
}
