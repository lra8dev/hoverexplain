import type { NextFunction, Request, Response } from "express";

import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/config";
import { ApiError } from "@/lib/api-error";

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 d"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const identifier = req.auth.userId;

  if (!identifier) {
    throw new ApiError("User not authenticated", 401);
  }

  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  res.set("X-RateLimit-Limit", limit.toString());
  res.set("X-RateLimit-Remaining", remaining.toString());
  res.set("X-RateLimit-Reset", reset.toString());

  if (!success) {
    throw new ApiError("Your daily limit has been exceeded", 429);
  }

  next();
}
