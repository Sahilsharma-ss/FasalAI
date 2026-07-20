// ── OpenRouter AI Service ──────────────────────────────────────────────
// Centralised helper that talks to the OpenRouter API (OpenAI-compatible).
// Every public function constructs a task-specific prompt, calls the
// model, and returns the parsed result.

const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.0-flash-001"; // OpenRouter model ID
const TIMEOUT_MS = 30_000; // 30-second hard timeout

// ── System prompts ─────────────────────────────────────────────────────

const ADVISOR_SYSTEM_PROMPT =
  "You are FasalAI, a friendly agriculture advisor for small and marginal farmers. " +
  "Answer crop, soil, pest, and farming questions in clear, simple language. " +
  "Keep responses short, practical, and easy to act on. " +
  "Use bullet points and bold text for key terms. " +
  "If the question is outside agriculture, politely redirect the user.";

const DISEASE_ANALYSIS_SYSTEM_PROMPT =
  "You are FasalAI Disease Expert, a senior plant pathologist AI assistant. " +
  "When given a crop disease detection result, provide a comprehensive, farmer-friendly analysis. " +
  "Always respond in valid JSON with this exact structure: " +
  '{ "diseaseExplanation": "...", "severity": "Low|Medium|High|Critical", ' +
  '"treatmentSteps": ["step1", "step2", ...], ' +
  '"organicAlternatives": ["alt1", "alt2", ...], ' +
  '"preventionTips": ["tip1", "tip2", ...], ' +
  '"whenToConsultExpert": "...", ' +
  '"estimatedRecoveryDays": "X-Y days", ' +
  '"additionalNotes": "..." }';

const SUMMARISER_SYSTEM_PROMPT =
  "You are FasalAI Summariser, an expert at converting complex agricultural text into " +
  "simple, actionable summaries for small-scale farmers with limited technical literacy. " +
  "Always respond in valid JSON with this exact structure: " +
  '{ "summary": "2-3 sentence plain-language summary", ' +
  '"keyActionItems": ["action1", "action2", ...], ' +
  '"importantNumbers": ["any dates, dosages, or quantities mentioned"], ' +
  '"simplifiedTerms": [{ "term": "technical word", "meaning": "simple explanation" }] }';

// ── Core OpenRouter caller ─────────────────────────────────────────────

async function callAI(systemPrompt, userMessage, retries = 1) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw Object.assign(
      new Error("OPENROUTER_API_KEY is not configured in the server environment."),
      { status: 503 }
    );
  }

  const body = JSON.stringify({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "FasalAI",
        },
        body,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.status === 429) {
        throw Object.assign(
          new Error("AI rate limit reached. Please wait a minute and try again."),
          { status: 429 }
        );
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const msg =
          errData?.error?.message || `OpenRouter API error (${response.status})`;

        // Retry on 5xx errors
        if (response.status >= 500 && attempt < retries) {
          console.warn(`OpenRouter 5xx error, retrying (attempt ${attempt + 1})...`);
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }

        throw Object.assign(new Error(msg), { status: response.status });
      }

      const data = await response.json();
      return (
        data.choices?.[0]?.message?.content || "No response from AI."
      );
    } catch (err) {
      clearTimeout(timer);

      if (err.name === "AbortError") {
        throw Object.assign(
          new Error("AI request timed out. Please try again."),
          { status: 504 }
        );
      }

      // Retry on network errors
      if (!err.status && attempt < retries) {
        console.warn(
          `Network error calling OpenRouter, retrying (attempt ${attempt + 1})...`
        );
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      throw err;
    }
  }
}

// ── Public functions ───────────────────────────────────────────────────

/**
 * General farming Q&A advisor (used by /api/chat).
 */
export async function askAdvisor(question) {
  return callAI(ADVISOR_SYSTEM_PROMPT, question);
}

/**
 * Comprehensive AI disease analysis (used by /api/ai/analyze-disease).
 * Returns a parsed JSON object with treatment plan.
 */
export async function analyzeDiseaseWithAI({ crop, disease, confidence }) {
  const prompt =
    `A crop disease detection system has identified the following:\n` +
    `- Crop: ${crop}\n` +
    `- Disease: ${disease}\n` +
    `- Confidence: ${(confidence * 100).toFixed(1)}%\n\n` +
    `Provide a comprehensive, farmer-friendly analysis and treatment plan. ` +
    `Consider that the farmer may have limited resources and access to agrochemicals. ` +
    `Include both chemical and organic treatment options. ` +
    `Respond ONLY with the JSON object, no markdown fences.`;

  const raw = await callAI(DISEASE_ANALYSIS_SYSTEM_PROMPT, prompt);

  // Strip markdown code fences if the model wraps them
  const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // If JSON parsing fails, return a structured fallback
    return {
      diseaseExplanation: raw,
      severity: "Unknown",
      treatmentSteps: [
        "Please consult a local agricultural officer for specific guidance.",
      ],
      organicAlternatives: [],
      preventionTips: [],
      whenToConsultExpert: "If symptoms persist or spread rapidly.",
      estimatedRecoveryDays: "Varies",
      additionalNotes:
        "AI response could not be fully structured. Raw response provided above.",
    };
  }
}

/**
 * Summarise agricultural text for farmers (used by /api/ai/summarise).
 * Returns a parsed JSON object with summary and action items.
 */
export async function summariseForFarmer(text) {
  const prompt =
    `Summarise the following agricultural text for a small-scale farmer who may not ` +
    `understand technical jargon. Extract key action items they should take. ` +
    `Respond ONLY with the JSON object, no markdown fences.\n\n` +
    `--- TEXT START ---\n${text}\n--- TEXT END ---`;

  const raw = await callAI(SUMMARISER_SYSTEM_PROMPT, prompt);

  const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      summary: raw,
      keyActionItems: [],
      importantNumbers: [],
      simplifiedTerms: [],
    };
  }
}
