const SYSTEM_PROMPT =
  "You are FasalAI, a friendly agriculture advisor for small and marginal farmers. " +
  "Answer crop, soil, pest, and farming questions in clear, simple language. " +
  "Keep responses short, practical, and easy to act on.";

const MODEL = "gemini-2.0-flash";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export async function askAdvisor(question) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return (
      "The advisory assistant is not configured yet. " +
      "Set GEMINI_API_KEY in the backend environment to enable AI answers."
    );
  }

  const url = `${BASE_URL}/models/${MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: question }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(JSON.stringify(errData));
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
}
