import crypto from "node:crypto";

/**
 * DubSync public-API key lifecycle.
 *
 * Storage model
 * -------------
 * Plaintext keys are shown to the user ONCE at creation time and never
 * persisted. The database stores only a SHA-256 hash plus a short
 * human-readable prefix (first ~12 chars) so users can identify which
 * key is which in the dashboard. Lost key → create a new one.
 *
 * Format
 * ------
 *   sk-dub-live_<40 random base64url chars>
 *
 * - `sk-dub-` is a Stripe-style prefix to make the purpose obvious in
 *   logs, alerts, and screenshots.
 * - `live_` distinguishes production keys from future test keys
 *   (`test_` reserved for a sandbox mode we may add later).
 * - 40 base64url chars = ~240 bits of entropy = brute-force infeasible.
 *
 * Hash algorithm
 * --------------
 * SHA-256 is the right choice for API keys even though it's "fast":
 *   - Keys carry enough entropy to resist brute-force on their own
 *     (unlike passwords which are low-entropy user input).
 *   - We need O(1) lookup per request — can't afford bcrypt's 50ms.
 *   - We still get cryptographic irreversibility.
 *
 * This is the same approach Stripe, GitHub, and Linear use.
 */

const KEY_PREFIX = "sk-dub-live_";
const RANDOM_BYTES = 30; // 30 bytes → 40 base64url chars

export type GeneratedKey = {
  /** Plaintext key — return to user ONCE, never log or persist. */
  plaintext: string;
  /** Visible prefix for dashboard identification. Safe to store/display. */
  prefix: string;
  /** SHA-256 hex — what goes into `api_keys.key_hash`. */
  hash: string;
};

/**
 * Generate a fresh API key. Returns the plaintext (to show to the user
 * exactly once) plus the prefix and hash (to persist).
 */
export function generateApiKey(): GeneratedKey {
  const random = crypto.randomBytes(RANDOM_BYTES).toString("base64url");
  const plaintext = `${KEY_PREFIX}${random}`;
  return {
    plaintext,
    // First 16 chars: "sk-dub-live_abcd" — enough to recognize a key
    // without leaking entropy.
    prefix: plaintext.slice(0, 16),
    hash: hashApiKey(plaintext),
  };
}

/**
 * Compute the hash of a plaintext API key. Used both at creation time
 * (to persist) and at request time (to look up `api_keys.key_hash`).
 */
export function hashApiKey(plaintext: string): string {
  return crypto.createHash("sha256").update(plaintext).digest("hex");
}

/**
 * Quick sanity check: does the incoming bearer token *look* like a
 * DubSync API key? Cheap pre-filter before a DB round trip.
 */
export function looksLikeApiKey(token: string): boolean {
  return token.startsWith(KEY_PREFIX) && token.length >= KEY_PREFIX.length + 30;
}
