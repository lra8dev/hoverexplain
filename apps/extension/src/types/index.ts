import type { SummaryRequest } from "@hoverdocs/validators";

export type ExtractionResult = Omit<SummaryRequest, "languageId">;
