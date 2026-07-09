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

    if (err.message?.includes("429") || err.message?.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({
        message: "The AI advisor is temporarily busy. Please wait a minute and try again.",
      });
    }

    res.status(500).json({
      message: "Something went wrong with the AI advisor. Please try again later.",
    });
  }
}
