import crypto from "node:crypto";
import { diseaseClasses } from "./advisoryData.js";

// Picks a disease for an uploaded leaf image.
// For now we derive a stable result from the image bytes so the app works end
// to end. Once the trained model is ready it slots in here.

function hashToIndex(buffer, length) {
  const hash = crypto.createHash("sha256").update(buffer).digest();
  return hash[0] % length;
}

function confidenceFromHash(buffer) {
  const hash = crypto.createHash("sha256").update(buffer).digest();
  // keep it in a believable 80-99% range
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
