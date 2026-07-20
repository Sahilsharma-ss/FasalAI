import { analyzeDiseaseWithAI, summariseForFarmer } from "../services/geminiService.js";

/**
 * POST /api/ai/analyze-disease
 * Body: { crop, disease, confidence }
 * Returns a comprehensive AI-generated treatment plan.
 */
export async function analyzeDiseaseAI(req, res) {
  const { crop, disease, confidence } = req.body;

  if (!crop || !disease) {
    return res.status(400).json({
      message: "Both 'crop' and 'disease' fields are required.",
    });
  }

  const conf = typeof confidence === "number" ? confidence : 0.9;

  try {
    const analysis = await analyzeDiseaseWithAI({ crop, disease, confidence: conf });
    res.json({ analysis });
  } catch (err) {
    console.error("AI analyze-disease error:", err.message);

    const status = err.status || 500;
    const message =
      status === 429
        ? "The AI service is temporarily busy. Please wait a minute and try again."
        : status === 504
          ? "The AI request timed out. Please try again."
          : status === 503
            ? "AI service is not configured. Please contact the administrator."
            : "Something went wrong with the AI analysis. Please try again later.";

    res.status(status).json({ message });
  }
}

/**
 * POST /api/ai/summarise
 * Body: { text }
 * Returns a farmer-friendly summary with action items.
 */
export async function summariseText(req, res) {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({
      message: "The 'text' field is required and cannot be empty.",
    });
  }

  if (text.length > 10000) {
    return res.status(400).json({
      message: "Text is too long. Please limit to 10,000 characters.",
    });
  }

  try {
    const result = await summariseForFarmer(text.trim());
    res.json({ result });
  } catch (err) {
    console.error("AI summarise error:", err.message);

    const status = err.status || 500;
    const message =
      status === 429
        ? "The AI service is temporarily busy. Please wait a minute and try again."
        : status === 504
          ? "The AI request timed out. Please try again."
          : status === 503
            ? "AI service is not configured. Please contact the administrator."
            : "Something went wrong with the AI summariser. Please try again later.";

    res.status(status).json({ message });
  }
}
