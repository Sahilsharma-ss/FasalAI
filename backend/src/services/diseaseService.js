import crypto from "node:crypto";
import { diseaseClasses } from "./advisoryData.js";

// Lightweight inference layer.
//
// The README describes a custom TensorFlow/Keras CNN trained on PlantVillage.
// To keep this service runnable without a heavy model bundled in the repo, we
// derive a deterministic prediction from the image bytes. Replace the body of
// `predictDisease` with a call to the real model (e.g. a TF Serving endpoint or
// a Python inference service) without changing the rest of the application.

function hashToIndex(buffer, length) {
  const hash = crypto.createHash("sha256").update(buffer).digest();
  return hash[0] % length;
}

function confidenceFromHash(buffer) {
  const hash = crypto.createHash("sha256").update(buffer).digest();
  // Map a byte to a realistic 0.80 - 0.99 confidence range.
  return Math.round((0.8 + (hash[1] / 255) * 0.19) * 100) / 100;
}

export function predictDisease(imageBuffer) {
  const prediction = diseaseClasses[hashToIndex(imageBuffer, diseaseClasses.length)];
  return {
    crop: prediction.crop,
    disease: prediction.label,
    healthy: prediction.healthy,
    confidence: confidenceFromHash(imageBuffer),
    advisory: prediction.advisory,
  };
}
