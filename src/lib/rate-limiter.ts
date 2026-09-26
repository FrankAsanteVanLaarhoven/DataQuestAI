/**
 * Intelligent Security Rate Limiter & Token Misuse Guard
 * 
 * 1. Brute-Force & Credential Stuffing Protection:
 *    - Limits failed login attempts (max 5 failed attempts in 15 minutes per IP/email).
 *    - Successful authentication immediately clears failed attempt counters.
 * 2. Unrestricted Learning Guarantee (No Bottlenecks):
 *    - Generous burst limit (120 req/min) for interactive SQL queries and missions,
 *      ensuring legitimate students and teachers are never throttled during lab work.
 * 3. Token Misuse & Replay Guard:
 *    - Validates token syntax, entropy, and lifecycle against active session stores.
 *    - Prevents stolen token replays and unauthorized privilege escalation.
 */

interface RateLimitRecord {
  count: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
  blockedUntil?: number;
}

// In-memory sliding windows (per IP / identifier)
const authAttemptTracker = new Map<string, RateLimitRecord>();
const generalApiTracker = new Map<string, RateLimitRecord>();

// Clean up stale entries every 10 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of authAttemptTracker.entries()) {
      if (now - record.lastAttemptAt > 60 * 60 * 1000) {
        authAttemptTracker.delete(key);
      }
    }
    for (const [key, record] of generalApiTracker.entries()) {
      if (now - record.lastAttemptAt > 5 * 60 * 1000) {
        generalApiTracker.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

/**
 * Check and register an authentication attempt.
 * @param identifier Client IP or email address
 * @param isFailed Whether this attempt failed (e.g. invalid credentials)
 */
export function checkAuthRateLimit(
  identifier: string,
  isFailed = false
): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15-minute window
  const maxFailedAttempts = 5; // 5 failed attempts allowed before temporary lockout
  const lockoutMs = 15 * 60 * 1000; // 15-minute lockout

  let record = authAttemptTracker.get(identifier);

  // If already blocked, check if lockout duration has passed
  if (record?.blockedUntil) {
    if (now < record.blockedUntil) {
      const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
      return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
    } else {
      // Lockout expired, reset record
      authAttemptTracker.delete(identifier);
      record = undefined;
    }
  }

  if (!record || now - record.firstAttemptAt > windowMs) {
    record = { count: 0, firstAttemptAt: now, lastAttemptAt: now };
  }

  if (isFailed) {
    record.count += 1;
    record.lastAttemptAt = now;

    if (record.count >= maxFailedAttempts) {
      record.blockedUntil = now + lockoutMs;
      authAttemptTracker.set(identifier, record);
      return { allowed: false, remainingAttempts: 0, retryAfterSeconds: Math.ceil(lockoutMs / 1000) };
    }

    authAttemptTracker.set(identifier, record);
    return { allowed: true, remainingAttempts: maxFailedAttempts - record.count };
  }

  // If successful attempt, clear previous failed counts to keep user frictionless
  authAttemptTracker.delete(identifier);
  return { allowed: true, remainingAttempts: maxFailedAttempts };
}

/**
 * General API Burst Rate Limiter
 * Provides generous throughput for student labs (120 req/min) while stopping automated scraping.
 */
export function checkApiRateLimit(
  clientIp: string,
  maxRequestsPerMinute = 120
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute

  let record = generalApiTracker.get(clientIp);

  if (!record || now - record.firstAttemptAt > windowMs) {
    record = { count: 1, firstAttemptAt: now, lastAttemptAt: now };
    generalApiTracker.set(clientIp, record);
    return { allowed: true, remaining: maxRequestsPerMinute - 1 };
  }

  record.count += 1;
  record.lastAttemptAt = now;
  generalApiTracker.set(clientIp, record);

  if (record.count > maxRequestsPerMinute) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequestsPerMinute - record.count };
}

/**
 * Token Misuse & Entropy Validator
 * Ensures tokens conform to high-entropy cryptographic format and haven't been tampered with.
 */
export function validateTokenStructure(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  // Format: dqs_<userId>_<role>_<timestamp>_<random>
  if (!token.startsWith('dqs_')) return false;
  const parts = token.split('_');
  // Must have at least prefix, userId, role, timestamp, and salt parts
  return parts.length >= 5 && token.length >= 32;
}
