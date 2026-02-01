import type { SummaryRequest, SummaryResponse } from "@hoverexplain/validators";

import { generateCodeHash } from "@hoverexplain/utils";
import { summaryRequestSchema } from "@hoverexplain/validators";

import type { ExpRequest, ExpResponse } from "@/types";

import { getRateLimiter } from "@/config/rate-limiter";
import { getRedisClient } from "@/config/redis";
import { ApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";
import { onGetCodeSummary } from "@/services/gemini-api";

export class SummaryController {
  private static readonly CACHE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

  public static async codeSummary(
    req: ExpRequest<SummaryRequest>,
    res: ExpResponse<SummaryResponse>,
  ): Promise<void> {
    const data = summaryRequestSchema.parse(req.body);
    const startTime = Date.now();

    if (!data.code) {
      throw new ApiError("Code block is required and cannot be empty", 400);
    }

    try {
      const redis = getRedisClient();
      const codeHash = generateCodeHash(data.code);
      const cacheKey = `summary:${data.languageId}:${codeHash}`;

      const cachedSummary = await redis.get<string>(cacheKey);
      if (cachedSummary) {
        logger.info(`[Cache Hit] Serving summary for ${codeHash} in ${Date.now() - startTime}ms`);

        res.status(200).json({
          success: true,
          message: "Summary retrieved from cache",
          data: { summary: cachedSummary, cached: true, timestamp: Date.now() },
        });

        return;
      }

      logger.info(`[Cache Miss] Generating summary for ${codeHash}`);

      await SummaryController.rateLimiter(req, res);

      const summary = await onGetCodeSummary(data);

      await redis.set(cacheKey, summary, { ex: SummaryController.CACHE_TTL_SECONDS });

      logger.info(`[Summary Generated] Cached for ${codeHash} in ${Date.now() - startTime}ms`);

      res.status(200).json({
        success: true,
        message: "Summary generated successfully",
        data: { summary, cached: false, timestamp: Date.now() },
      });
    }
    catch (error) {
      logger.error(
        `Failed to process summary request in ${Date.now() - startTime}ms: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  private static async rateLimiter(req: ExpRequest, res: ExpResponse): Promise<void> {
    const identifier = req.auth?.userId;

    if (!identifier) {
      throw new ApiError("User not authenticated", 401);
    }

    const { success, limit, remaining, reset } = await getRateLimiter().limit(identifier);

    res.set("X-RateLimit-Limit", limit.toString());
    res.set("X-RateLimit-Remaining", remaining.toString());
    res.set("X-RateLimit-Reset", reset.toString());

    if (!success) {
      throw new ApiError("Your daily limit has been exceeded", 429);
    }
  }
}
