/**
 * Dr. T — Global YouTube Overlay Utilities & Video Configuration
 * Verified Baseline Video: jQOC2qYPIvY
 */

export interface FeaturedVideoConfig {
  id: string;
  title: string;
  verifiedTitle: string;
  author: string;
  watchUrl: string;
  embedBaseUrl: string;
}

export const DEFAULT_FEATURED_VIDEO: FeaturedVideoConfig = {
  id: 'jQOC2qYPIvY',
  title: 'Featured Video',
  verifiedTitle: '20 October 2026',
  author: 'Zen Zen',
  watchUrl: 'https://youtu.be/jQOC2qYPIvY?si=RLXsphnETfJTHf5_',
  embedBaseUrl: 'https://www.youtube-nocookie.com/embed'
};

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Validates a YouTube Video ID against standard 11-character base64url pattern.
 * Prevents arbitrary URL/script injection into iframe src.
 */
export function validateYouTubeId(id: string): string | null {
  if (!id || typeof id !== 'string') return null;
  const trimmed = id.trim();
  if (!YOUTUBE_ID_REGEX.test(trimmed)) return null;
  return trimmed;
}

/**
 * Constructs a secure, privacy-preserving official YouTube embed URL using youtube-nocookie.com.
 * Configured with user-initiated playback params and modestbranding.
 */
export function buildYouTubeEmbedUrl(videoId: string, autoplay = false): string {
  const validId = validateYouTubeId(videoId);
  if (!validId) return '';
  const params = new URLSearchParams({
    enablejsapi: '1',
    rel: '0',
    modestbranding: '1',
    origin: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    autoplay: autoplay ? '1' : '0'
  });
  return `${DEFAULT_FEATURED_VIDEO.embedBaseUrl}/${validId}?${params.toString()}`;
}

/**
 * Returns the direct fallback watch URL for opening in native YouTube when iframe embedding is blocked.
 */
export function getYouTubeWatchUrl(videoId: string): string {
  const validId = validateYouTubeId(videoId);
  if (!validId) return DEFAULT_FEATURED_VIDEO.watchUrl;
  return `https://youtu.be/${validId}?si=RLXsphnETfJTHf5_`;
}
