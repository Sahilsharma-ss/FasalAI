import { Router } from "express";
import { chat } from "../controllers/chatController.js";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", authRequired, asyncHandler(chat));

export default router;
