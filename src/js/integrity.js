/* ===================================================================
   integrity.js — HMAC-based content integrity for exam downloads
   =================================================================== */

const HMAC_KEY = 'xK9$mP2vL7nQ4wR8';

/**
 * Compute a truncated HMAC-SHA256 hex digest (32 hex chars = 128 bits).
 * Uses SubtleCrypto in the browser.
 */
export async function hmacHash(content) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(HMAC_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(content));
  const full = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return full.slice(0, 32);
}
