import path from 'node:path';

export const VIDEO_DIRECTORY = process.env.VIDEO_DIRECTORY || process.env.VIDEOS_DIR || path.join(process.cwd(), 'videos');

export const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; media-src 'self'; script-src 'none'; object-src 'none';",
};