// E:\devalayaum\backend\controllers\llmTempleParser.js
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

/**
 * LLM parser for converting OCR text → temple form structure
 */

export const parseTempleLLM = async (req, res) => {
  try {
    const { rawText } = req.body;

    if (!rawText || rawText.trim().length < 10) {
      return res.status(400).json({ msg: "Raw text missing or too small" });
    }

    // PROMPT FOR TEMPLE EXTRACTION
    const prompt = `
You are an expert data extractor for Indian temple information.
Extract as much meaningful structured data as possible from the text below.

TEXT:
${rawText}

Return STRICTLY in the following JSON format:

{
  "name": { "en": "", "hi": "", "mr": "", "ta": "", "te": "", "bn": "" },
  "location": { ... },
  "about": { ... },
  "mainDeity": { ... },
  "deityDescription": { ... },
  "significance": { ... },
  "history": { ... },
  "architecture": { ... },
  "builderOrTrust": { ... },
  "consecrationDate": "",

  "darshanTiming": { ... },
  "aartiTimings": { "morning": "", "shringar": "", "shayan": "" },
  "specialPoojaInfo": { ... },

  "dressCode": { ... },
  "entryRules": { ... },
  "prohibitedItems": "",
  "lockerFacility": false,

  "howToReach": { ... },
  "nearestAirport": { ... },
  "nearestRailway": { ... },
  "roadConnectivity": { ... },
  "mapLat": "",
  "mapLng": "",

  "nearbyPlaces": [
      { "name": { ... }, "description": { ... } }
  ]
}

Fill all languages using BEST effort translation.
If some fields not present, leave empty but keep the structure.
    `;

    // CALL OPENAI / GROQ / GEMINI / ANY API YOU USE
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // or whichever model you're using
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    let jsonOutput = response.data.choices[0].message.content;

    // FIX: if model returns ```json ... ```
    jsonOutput = jsonOutput.replace(/```json|```/g, "").trim();

    const result = JSON.parse(jsonOutput);
    res.json({ mapped: result, rawText });

  } catch (err) {
    console.error("LLM PARSER ERROR:", err);
    res.status(500).json({ msg: "LLM parsing failed", error: err.message });
  }
};
