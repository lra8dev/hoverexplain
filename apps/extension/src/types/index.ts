import type { SummaryRequest } from "@hoverexplain/validators";

export type ExtractionResult = Omit<SummaryRequest, "languageId">;

export type AuthSecret = {
  token: string;
  expiresAt: number;
};
