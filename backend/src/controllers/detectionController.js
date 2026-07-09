import { Detection } from "../models/Detection.js";
import { predictDisease } from "../services/diseaseService.js";

export async function detect(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "An image file is required" });
  }

  const prediction = predictDisease(req.file.buffer);

  const detection = await Detection.create({
    user: req.userId,
    crop: prediction.crop,
    disease: prediction.disease,
    confidence: prediction.confidence,
    healthy: prediction.healthy,
    advisory: prediction.advisory,
  });

  res.status(201).json({ detection });
}

export async function history(req, res) {
  const detections = await Detection.find({ user: req.userId })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ detections });
}

export async function stats(req, res) {
  const detections = await Detection.find({ user: req.userId });
  const total = detections.length;
  const healthy = detections.filter((d) => d.healthy).length;

  res.json({
    total,
    healthy,
    diseased: total - healthy,
    recent: detections
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5),
  });
}

export async function updateDetection(req, res) {
  const { id } = req.params;
  const { crop, disease, confidence, healthy, advisory } = req.body;

  const detection = await Detection.findOne({ _id: id, user: req.userId });
  if (!detection) {
    return res.status(404).json({ message: "Detection not found" });
  }

  if (crop !== undefined) detection.crop = crop;
  if (disease !== undefined) detection.disease = disease;
  if (confidence !== undefined) detection.confidence = confidence;
  if (healthy !== undefined) detection.healthy = healthy;
  if (advisory !== undefined) detection.advisory = advisory;

  await detection.save();
  res.json({ detection });
}

export async function deleteDetection(req, res) {
  const { id } = req.params;

  const detection = await Detection.findOneAndDelete({
    _id: id,
    user: req.userId,
  });

  if (!detection) {
    return res.status(404).json({ message: "Detection not found" });
  }

  res.json({ message: "Detection deleted successfully" });
}
