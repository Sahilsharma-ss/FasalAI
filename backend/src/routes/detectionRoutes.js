import { Router } from "express";
import multer from "multer";
import {
  detect,
  history,
  stats,
} from "../controllers/detectionController.js";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

const router = Router();

router.use(authRequired);
router.post("/detect", upload.single("image"), asyncHandler(detect));
router.get("/history", asyncHandler(history));
router.get("/stats", asyncHandler(stats));

export default router;
