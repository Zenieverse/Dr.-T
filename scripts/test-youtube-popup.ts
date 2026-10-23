/**
 * Dr. T — Global YouTube Overlay & Player Lifecycle Test Suite
 * Validates YouTube ID sanitization, privacy-preserving URL generation,
 * single global root mounting, portal stacking contexts, keyboard controls,
 * and clean player teardown.
 */

import fs from 'fs';
import path from 'path';
import { 
  validateYouTubeId, 
  buildYouTubeEmbedUrl, 
  getYouTubeWatchUrl, 
  DEFAULT_FEATURED_VIDEO 
} from '../src/components/video/youtubeUtils';

interface AssertionResult {
  name: string;
  passed: boolean;
  details?: string;
}

const testResults: AssertionResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    testResults.push({ name, passed: true, details });
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    testResults.push({ name, passed: false, details: details || 'Assertion failed' });
    console.error(`  ❌ [FAIL] ${name} — ${details || 'Assertion failed'}`);
  }
}

console.log('\n======================================================');
console.log('🎬 DR. T — GLOBAL YOUTUBE POP-UP VERIFICATION SUITE');
console.log('======================================================\n');

// ----------------------------------------------------
// Test Group 1: Exact Baseline Video Configuration
// ----------------------------------------------------
console.log('Test Group 1: Exact Baseline Featured Video Verification');

assert(DEFAULT_FEATURED_VIDEO.id === 'jQOC2qYPIvY', 
  'Default featured video ID is exactly "jQOC2qYPIvY"');

assert(DEFAULT_FEATURED_VIDEO.watchUrl.includes('jQOC2qYPIvY'), 
  'Default watch URL targets "jQOC2qYPIvY"');

assert(DEFAULT_FEATURED_VIDEO.embedBaseUrl === 'https://www.youtube-nocookie.com/embed', 
  'Embed URL uses official privacy-enhanced youtube-nocookie.com domain');

assert(DEFAULT_FEATURED_VIDEO.title === 'Featured Video', 
  'Default display title is "Featured Video"');

assert(DEFAULT_FEATURED_VIDEO.verifiedTitle === '20 October 2026', 
  'Verified video title is "20 October 2026"');

assert(DEFAULT_FEATURED_VIDEO.author === 'Zen Zen', 
  'Verified video creator is "Zen Zen"');

// ----------------------------------------------------
// Test Group 2: ID Validation & Injection Prevention
// ----------------------------------------------------
console.log('\nTest Group 2: YouTube ID Sanitization & Injection Prevention');

assert(validateYouTubeId('jQOC2qYPIvY') === 'jQOC2qYPIvY', 
  'Valid 11-char alphanumeric ID "jQOC2qYPIvY" accepted');

assert(validateYouTubeId('3xsvHoYfZGs') === '3xsvHoYfZGs', 
  'Valid alternate 11-char ID accepted');

assert(validateYouTubeId('') === null, 
  'Empty video ID rejected');

assert(validateYouTubeId('jQOC2qYPIvY<script>') === null, 
  'XSS script injection in ID rejected');

assert(validateYouTubeId('jQOC2qYPIvY;rm -rf') === null, 
  'Command injection string in ID rejected');

assert(validateYouTubeId('short_id') === null, 
  'ID shorter than 11 characters rejected');

assert(validateYouTubeId('too_long_video_id_12345') === null, 
  'ID longer than 11 characters rejected');

assert(validateYouTubeId('https://www.youtube.com/watch?v=jQOC2qYPIvY') === null, 
  'Full URL passed as ID safely rejected (only clean 11-char IDs allowed)');

// ----------------------------------------------------
// Test Group 3: Privacy-Preserving URL Construction
// ----------------------------------------------------
console.log('\nTest Group 3: Privacy-Preserving Embed URL Construction');

const embedUrl = buildYouTubeEmbedUrl('jQOC2qYPIvY');
assert(embedUrl.startsWith('https://www.youtube-nocookie.com/embed/jQOC2qYPIvY?'), 
  'Embed URL points strictly to youtube-nocookie.com/embed/jQOC2qYPIvY');

assert(embedUrl.includes('enablejsapi=1'), 
  'Embed URL enables JS API for controlled playback');

assert(embedUrl.includes('rel=0'), 
  'Embed URL sets rel=0 to suppress unrelated third-party videos');

assert(embedUrl.includes('modestbranding=1'), 
  'Embed URL enables modest branding for clean clinical aesthetic');

const fallbackWatch = getYouTubeWatchUrl('jQOC2qYPIvY');
assert(fallbackWatch.startsWith('https://youtu.be/jQOC2qYPIvY'), 
  'Fallback watch URL points to direct youtu.be link');

// ----------------------------------------------------
// Test Group 4: Single Root Mount & Shared Overlay Architecture
// ----------------------------------------------------
console.log('\nTest Group 4: Single Global Overlay Architecture (App.tsx & Navbar.tsx)');

const appPath = path.join(process.cwd(), 'src', 'App.tsx');
const appSource = fs.readFileSync(appPath, 'utf8');

assert(appSource.includes('import { GlobalYouTubeOverlay'), 
  'App.tsx imports GlobalYouTubeOverlay');

assert(appSource.includes('<GlobalYouTubeOverlay'), 
  'GlobalYouTubeOverlay is mounted in App.tsx');

// Verify mounted exactly once
const mountMatches = appSource.match(/<GlobalYouTubeOverlay/g);
assert(mountMatches !== null && mountMatches.length === 1, 
  'GlobalYouTubeOverlay is mounted exactly once at the application root level');

assert(appSource.includes("addEventListener('drt-open-featured-video'"), 
  'App.tsx registers global "drt-open-featured-video" event listener for cross-tab accessibility');

assert(appSource.includes('openFeaturedVideo='), 
  'App.tsx passes openFeaturedVideo prop to Navbar');

const navbarPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Navbar.tsx');
const navbarSource = fs.readFileSync(navbarPath, 'utf8');

assert(navbarSource.includes('Watch Featured Video') || navbarSource.includes('Featured Video'), 
  'Navbar renders visible "Featured Video" launcher button');

assert(navbarSource.includes('openFeaturedVideo'), 
  'Navbar binds to openFeaturedVideo prop');

// ----------------------------------------------------
// Test Group 5: Stacking Layer Strategy & Portal Implementation
// ----------------------------------------------------
console.log('\nTest Group 5: Portal Mounting & Stacking Layer Hierarchy');

const overlayPath = path.join(process.cwd(), 'src', 'components', 'video', 'GlobalYouTubeOverlay.tsx');
const overlaySource = fs.readFileSync(overlayPath, 'utf8');

assert(overlaySource.includes('createPortal('), 
  'GlobalYouTubeOverlay uses createPortal to attach to document.body');

assert(overlaySource.includes('document.body'), 
  'Portal mounts directly to document.body outside standard component stacking contexts');

assert(overlaySource.includes('z-[70]'), 
  'Floating mode and minimized dock use z-[70] layer (above standard z-50 dialogs)');

assert(overlaySource.includes('z-[80]'), 
  'Focus / Theater mode uses z-[80] layer (highest visual priority)');

assert(overlaySource.includes('currentMode === \'minimized\''), 
  'Supports minimized dock mode');

assert(overlaySource.includes('currentMode === \'focus\''), 
  'Supports focus / theater mode');

assert(overlaySource.includes('aspect-video'), 
  'Player uses responsive 16:9 aspect-video container');

// ----------------------------------------------------
// Test Group 6: Keyboard Controls & Clean Teardown
// ----------------------------------------------------
console.log('\nTest Group 6: Keyboard Accessibility & Clean Lifecycle Teardown');

assert(overlaySource.includes("e.key === 'Escape'"), 
  'Escape key listener wired for modal dismissal and mode degradation');

assert(overlaySource.includes('role="dialog"'), 
  'Dialog ARIA role assigned to player overlay');

assert(overlaySource.includes('allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"'), 
  'Iframe defines explicit sandboxed permissions policy');

assert(overlaySource.includes('referrerPolicy="strict-origin-when-cross-origin"'), 
  'Iframe defines strict-origin-when-cross-origin referrer policy to protect patient privacy');

assert(overlaySource.includes('if (!isOpen || !mounted) {\n    return null;\n  }'), 
  'Component completely unmounts iframe on close to guarantee zero background audio or resource leaks');

// ----------------------------------------------------
// Summary
// ----------------------------------------------------
console.log('\n======================================================');
const passedCount = testResults.filter(r => r.passed).length;
const totalCount = testResults.length;
console.log(`TOTAL YOUTUBE POP-UP TESTS: ${totalCount} | PASSED: ${passedCount} | FAILED: ${totalCount - passedCount}`);
console.log('======================================================\n');

if (passedCount === totalCount) {
  console.log('🎉 ALL GLOBAL YOUTUBE POP-UP VERIFICATION TESTS PASSED!\n');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED!\n');
  process.exit(1);
}
