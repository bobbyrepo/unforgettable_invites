/**
 * Whitelist of authorized hosts allowed to run Unforgettable Invites.
 * Used by the Edge security layer to prevent unlicensed cloning or scraping.
 */
export const AUTHORIZED_HOSTS = [
  'unforgettableinvites.com',
  'www.unforgettableinvites.com',
  'unforgettabletales.com',
  'www.unforgettabletales.com',
  'localhost:3000',
  'localhost:5050',
  '127.0.0.1:3000',
  '127.0.0.1:5050',
  'cat-exam-platform.vercel.app',
];

export const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'templates',
  'assets',
  'favicon.ico',
  'portal',
  'studio',
  '_next',
  'login',
  'dashboard',
  'catalog',
  'unauthorized',
]);
