import { Router } from "express";
import { register, login, me, githubAuth } from "../controllers/authController.js";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/github", asyncHandler(githubAuth));
router.get("/me", authRequired, asyncHandler(me));

export default router;

