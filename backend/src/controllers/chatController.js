import { askAdvisor } from "../services/geminiService.js";

export async function chat(req, res) {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "A question is required" });
  }

  const answer = await askAdvisor(message.trim());
  res.json({ answer });
}
