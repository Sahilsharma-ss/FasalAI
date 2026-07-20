import { askAdvisor } from "../services/geminiService.js";

export async function chat(req, res) {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "A question is required" });
  }

  try {
    const answer = await askAdvisor(message.trim());
    res.json({ answer });
  } catch (err) {
    console.error("Chat error:", err.message);

    const status = err.status || 500;

    if (status === 429) {
      return res.status(429).json({
        message: "The AI advisor is temporarily busy. Please wait a minute and try again.",
      });
    }

    if (status === 504) {
      return res.status(504).json({
        message: "The AI request timed out. Please try again.",
      });
    }

    if (status === 503) {
      return res.status(503).json({
        message: "AI service is not configured. Please contact the administrator.",
      });
    }

    res.status(500).json({
      message: "Something went wrong with the AI advisor. Please try again later.",
    });
  }
}
