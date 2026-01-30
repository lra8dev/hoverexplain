import type { SummaryRequest } from "@hoverlens/validators";

export type ExtractionResult = Omit<SummaryRequest, "languageId">;
