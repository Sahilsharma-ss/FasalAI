import { Router } from "express";
import { analyzeDiseaseAI, summariseText } from "../controllers/aiController.js";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authRequired);

// POST /api/ai/analyze-disease
router.post("/analyze-disease", asyncHandler(analyzeDiseaseAI));

// POST /api/ai/summarise
router.post("/summarise", asyncHandler(summariseText));

export default router;
