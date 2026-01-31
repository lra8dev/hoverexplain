import type { SummaryRequest } from "@hoverexplain/validators";

export type ExtractionResult = Omit<SummaryRequest, "languageId">;
