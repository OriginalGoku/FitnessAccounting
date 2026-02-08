type RateLimitBucket = {
  hits: number[];
  blockedUntil: number;
};

export type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
  blockMs?: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, RateLimitBucket>();
let lastSweepAt = 0;

function sweepBuckets(now: number) {
  if (now - lastSweepAt < 60_000) {
    return;
  }

  const retentionMs = 60 * 60 * 1000;

  for (const [key, bucket] of buckets.entries()) {
    bucket.hits = bucket.hits.filter((hitAt) => now - hitAt < retentionMs);

    if (bucket.blockedUntil <= now && bucket.hits.length === 0) {
      buckets.delete(key);
    } else {
      buckets.set(key, bucket);
    }
  }

  lastSweepAt = now;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  sweepBuckets(now);

  const bucket = buckets.get(key) ?? { hits: [], blockedUntil: 0 };

  if (bucket.blockedUntil > now) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((bucket.blockedUntil - now) / 1000),
    );

    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetAt: bucket.blockedUntil,
      retryAfterSeconds,
    };
  }

  bucket.hits = bucket.hits.filter((hitAt) => now - hitAt < config.windowMs);

  if (bucket.hits.length >= config.maxRequests) {
    const oldestHitAt = bucket.hits[0] ?? now;
    const resetAt = oldestHitAt + config.windowMs;
    const retryAfterMs = Math.max(1_000, resetAt - now);

    if (config.blockMs && config.blockMs > 0) {
      bucket.blockedUntil = now + config.blockMs;
      buckets.set(key, bucket);
      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetAt: bucket.blockedUntil,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((bucket.blockedUntil - now) / 1000),
        ),
      };
    }

    buckets.set(key, bucket);
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);

  const remaining = Math.max(0, config.maxRequests - bucket.hits.length);
  const resetAt =
    bucket.hits.length > 0
      ? (bucket.hits[0] ?? now) + config.windowMs
      : now + config.windowMs;

  return {
    allowed: true,
    limit: config.maxRequests,
    remaining,
    resetAt,
    retryAfterSeconds: 0,
  };
}

export function rateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)),
  };

  if (!result.allowed) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }

  return headers;
}
