import type { SummaryRequest } from "@hoverdocs/validators";

import { ApiError as GenAiError, GoogleGenAI } from "@google/genai";

import { systemInstruction } from "@/constants";
import { ApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";
import { AiPrompt } from "@/utils";

export async function onGetCodeSummary(data: SummaryRequest): Promise<string> {
  const prompt = AiPrompt(data);

  try {
    const { models } = new GoogleGenAI({});
    const { text } = await models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
        maxOutputTokens: 200,
        temperature: 0.4,
        systemInstruction,
      },
    });

    if (!text?.trim()) {
      throw new Error("No summary generated");
    }

    return text.trim();
  }
  catch (err) {
    logger.error(`Gemini API error: ${(err as Error).message}`);

    if (err instanceof GenAiError) {
      if (err.status === 429) {
        throw new ApiError("Rate limit exceeded when generating summary", err.status);
      }
      if (err.status === 503) {
        throw new ApiError("Service unavailable", err.status);
      }
    }

    throw new Error("Failed to generate AI summary");
  }
}
