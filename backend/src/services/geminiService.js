import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT =
  "You are FasalAI, a friendly agriculture advisor for small and marginal farmers. " +
  "Answer crop, soil, pest, and farming questions in clear, simple language. " +
  "Keep responses short, practical, and easy to act on.";

let client = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new GoogleGenerativeAI(apiKey);
  return client;
}

export async function askAdvisor(question) {
  const genAI = getClient();

  if (!genAI) {
    return (
      "The advisory assistant is not configured yet. " +
      "Set GEMINI_API_KEY in the backend environment to enable AI answers."
    );
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(question);
  return result.response.text();
}
