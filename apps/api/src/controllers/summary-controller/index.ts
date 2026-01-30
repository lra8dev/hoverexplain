import type { SummaryRequest, SummaryResponse } from "@hoverlens/validators";

import { generateCodeHash } from "@hoverlens/utils";
import { summaryRequestSchema } from "@hoverlens/validators";

import type { ExpRequest, ExpResponse } from "@/types";

import { getRedisClient } from "@/config/redis";
import { ApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";
import { onGetCodeSummary } from "@/services/gemini-api";

export class SummaryController {
  public static async generateSummary(
    req: ExpRequest<SummaryRequest>,
    res: ExpResponse<SummaryResponse>,
  ): Promise<void> {
    const data = summaryRequestSchema.parse(req.body);

    if (!data.code) {
      throw new ApiError("Code block is required", 400);
    }

    try {
      const redis = getRedisClient();
      const codeHash = generateCodeHash(data.code);
      const cacheKey = `summary:${data.languageId}:${codeHash}`;

      const cachedSummary = await redis.get<string>(cacheKey);

      if (cachedSummary) {
        logger.info(`[Cache Hit] Serving summary for ${codeHash}`);

        res.status(200).json({
          success: true,
          message: "Summary retrieved from cache",
          data: { summary: cachedSummary, cached: true, timestamp: Date.now() },
        });

        return;
      }

      logger.info(`[Cache Miss] Fetching AI summary for ${codeHash}`);

      const summary = await onGetCodeSummary(data);

      await redis.set(cacheKey, summary, { ex: 60 * 60 * 24 * 7 }); // Cache for 7 days

      res.status(200).json({
        success: true,
        message: "Summary generated successfully",
        data: { summary, cached: false, timestamp: Date.now() },
      });
    }
    catch (error) {
      logger.error(`Failed to process summary request: ${(error as Error).message}`);
      throw error;
    }
  }
}
