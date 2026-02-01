import type { Duration } from "@upstash/ratelimit";

import { Ratelimit } from "@upstash/ratelimit";

import { config } from "../env-variable";
import { getRedisClient } from "../redis";

const { RATE_LIMIT_TOKENS, RATE_LIMIT_WINDOW } = config;
let _rateLimiter: Ratelimit | null = null;

export function getRateLimiter(): Ratelimit {
  if (!_rateLimiter) {
    _rateLimiter = new Ratelimit({
      redis: getRedisClient(),
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_TOKENS, RATE_LIMIT_WINDOW as Duration),
      analytics: true,
      prefix: "@upstash/ratelimit",
    });
  }

  return _rateLimiter;
}
