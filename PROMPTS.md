# PROMPTS.md — AI Prompt Engineering Log

> **Project**: FasalAI — AI-Powered Crop Disease Detection and Farmer Advisory  
> **Intern**: Sahil Sharma (ID: 26100973)  
> **API Used**: Google Gemini API (`gemini-2.0-flash`)  
> **Feature Tested**: AI Disease Analysis (`POST /api/ai/analyze-disease`)

---

## System Prompt (Used Across All Variations)

```
You are FasalAI Disease Expert, a senior plant pathologist AI assistant.
When given a crop disease detection result, provide a comprehensive, farmer-friendly analysis.
Always respond in valid JSON with this exact structure:
{
  "diseaseExplanation": "...",
  "severity": "Low|Medium|High|Critical",
  "treatmentSteps": ["step1", "step2", ...],
  "organicAlternatives": ["alt1", "alt2", ...],
  "preventionTips": ["tip1", "tip2", ...],
  "whenToConsultExpert": "...",
  "estimatedRecoveryDays": "X-Y days",
  "additionalNotes": "..."
}
```

---

## Variation A: Minimal Instruction Prompt

### Prompt

```
The disease detected is Tomato - Late Blight with 92% confidence.
Give treatment advice.
```

### Example Output

```
Late blight is a serious fungal disease. Use fungicides like mancozeb.
Remove infected leaves. Avoid overwatering.
```

### Issues

- Response was plain text, not JSON — broke the frontend parser.
- Very generic advice with no structure.
- Missing organic alternatives, recovery timeline, and expert consultation guidance.
- No severity assessment.

---

## Variation B: Structured Output with Role-Play

### Prompt

```
You are an agricultural expert. A crop disease detection system has identified:
- Crop: Tomato
- Disease: Late Blight
- Confidence: 92.0%

Please provide treatment advice in the following JSON format:
{ "treatmentSteps": [...], "preventionTips": [...] }
```

### Example Output

```json
{
  "treatmentSteps": [
    "Remove and destroy all infected plant parts immediately",
    "Apply copper-based fungicide (Bordeaux mixture) at recommended dosage",
    "Spray Mancozeb 75% WP at 2.5g per litre of water every 7-10 days"
  ],
  "preventionTips": [
    "Use disease-resistant tomato varieties",
    "Maintain proper spacing between plants for air circulation",
    "Avoid overhead irrigation"
  ]
}
```

### Issues

- JSON was valid and parseable ✅
- But only included treatment and prevention — missing severity, organic options, recovery time, and expert guidance.
- Advice was technically accurate but assumed the farmer had access to commercial fungicides.
- No consideration for resource-constrained small-scale farmers.

---

## Variation C: Step-by-Step Chain-of-Thought with Farmer Persona ✅ (SELECTED)

### Prompt

```
A crop disease detection system has identified the following:
- Crop: Tomato
- Disease: Tomato - Late Blight
- Confidence: 92.0%

Provide a comprehensive, farmer-friendly analysis and treatment plan.
Consider that the farmer may have limited resources and access to agrochemicals.
Include both chemical and organic treatment options.
Respond ONLY with the JSON object, no markdown fences.
```

### Example Output

```json
{
  "diseaseExplanation": "Late blight is a fast-spreading fungal disease caused by Phytophthora infestans. It creates dark, water-soaked spots on leaves that quickly turn brown and can destroy the entire plant within days if untreated. It spreads fastest in cool, wet weather.",
  "severity": "High",
  "treatmentSteps": [
    "Immediately remove and burn all visibly infected leaves, stems, and fruit — do not compost them.",
    "Spray a copper-based fungicide (like Bordeaux mixture) covering both sides of leaves, every 5-7 days.",
    "If available, apply Mancozeb 75% WP at 2.5 grams per litre of water as a foliar spray.",
    "Reduce watering and avoid wetting the leaves — water only at the base of the plant.",
    "If more than 50% of the plant is affected, remove and destroy the entire plant to protect nearby crops."
  ],
  "organicAlternatives": [
    "Spray a baking soda solution (1 tablespoon baking soda + 1 litre water + few drops of liquid soap) on leaves.",
    "Apply neem oil spray (5ml neem oil per litre of water) as a preventive measure on unaffected plants.",
    "Mulch around the base to prevent soil-borne spores from splashing onto leaves during rain."
  ],
  "preventionTips": [
    "Always use certified disease-free seeds or seedlings from a trusted source.",
    "Plant resistant varieties like 'Mountain Magic' or locally recommended blight-resistant cultivars.",
    "Space plants at least 60 cm apart to allow good air circulation.",
    "Practice 3-year crop rotation — do not plant tomatoes, potatoes, or peppers in the same spot."
  ],
  "whenToConsultExpert": "If the disease spreads to more than 30% of your crop within a week despite treatment, or if you see symptoms on nearby potato or pepper crops, visit your local Krishi Vigyan Kendra (KVK) or agricultural extension office immediately.",
  "estimatedRecoveryDays": "14-21 days",
  "additionalNotes": "Late blight spreads very fast in rainy seasons. Check your field every morning for new spots. If your neighbour's crops are also affected, coordinate treatment together as spores travel through wind."
}
```

---

## Why Variation C Was Selected

Variation C was chosen as the best prompt for four key reasons. **First**, it produces complete, structured JSON that reliably parses on the frontend without fallback handling. **Second**, the instruction to "consider that the farmer may have limited resources" explicitly guides the model to include both chemical and organic alternatives, which is critical for FasalAI's target audience of small and marginal farmers who may not have access to commercial agrochemicals. **Third**, the chain-of-thought style prompt ("comprehensive, farmer-friendly analysis and treatment plan") encourages the model to provide detailed explanations rather than terse bullet points, which significantly improves the educational value of the output. **Fourth**, the explicit instruction to respond "ONLY with the JSON object, no markdown fences" eliminates the common issue of Gemini wrapping JSON in ```json code fences, which broke parsing in Variations A and early tests.

---

## Additional Notes

- **Model**: `gemini-2.0-flash` was chosen for its fast response time (~2-4 seconds) and generous free tier, which is ideal for a student project.
- **Temperature**: Default (not explicitly set). Gemini's default works well for factual agricultural content.
- **Fallback**: If JSON parsing fails, the raw text response is still shown to the user with a structured fallback object, ensuring the feature never breaks completely.
- **System Prompt**: The system prompt enforces the JSON schema and the "plant pathologist" persona, while the user prompt provides the specific disease context. This separation allows the same system prompt to work across all disease types.
