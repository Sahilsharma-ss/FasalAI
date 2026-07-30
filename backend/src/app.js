import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();

  // Trust reverse proxy headers when running behind Render/Vercel/NGINX
  app.set("trust proxy", 1);

  // Configure CORS allowing origins specified in CLIENT_ORIGIN (supports comma-separated list or wildcard)
  const configuredOrigins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim())
    : ["http://localhost:5173", "http://localhost:3000"];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (configuredOrigins.includes("*") || configuredOrigins.includes(origin)) {
          return callback(null, true);
        }
        // Also allow vercel preview deployments automatically if matching *.vercel.app
        if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS origin not allowed: ${origin}`));
      },
      credentials: true,
    })
  );

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "FasalAI API",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/detections", detectionRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/ai", aiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

