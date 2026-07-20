import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    })
  );
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "FasalAI API" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/detections", detectionRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/ai", aiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
