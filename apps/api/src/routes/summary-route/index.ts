import { Router } from "express";

import { SummaryController } from "@/controllers/summary-controller";
import { asyncHandler } from "@/middlewares/async-handler";

export const summaryRouter: Router = Router();

summaryRouter.post("/summary", asyncHandler(SummaryController.codeSummary));
