import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    crop: { type: String, default: "Unknown" },
    disease: { type: String, required: true },
    confidence: { type: Number, required: true },
    healthy: { type: Boolean, default: false },
    advisory: {
      summary: String,
      treatment: [String],
      prevention: [String],
    },
  },
  { timestamps: true }
);

export const Detection = mongoose.model("Detection", detectionSchema);
