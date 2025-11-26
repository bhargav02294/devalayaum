import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

// --- Groq Client ---
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ---------------------------
// TEMPLATE PARSER (FREE LLaMA)
// ---------------------------
router.post("/parse-temple", async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) {
      return res.status(400).json({ message: "Missing rawText" });
    }

    const prompt = `
Extract temple information STRICTLY in valid JSON format.

RETURN ONLY JSON.

{
 "name": {"en": ""}, 
 "location": {"en": ""},
 "about": {"en": ""},
 "mainDeity": {"en": ""},
 "deityDescription": {"en": ""},
 "significance": {"en": ""},
 "history": {"en": ""},
 "architecture": {"en": ""},
 "builderOrTrust": {"en": ""},
 "howToReach": {"en": ""},
 "nearestAirport": {"en": ""},
 "nearestRailway": {"en": ""},
 "roadConnectivity": {"en": ""}
}

Fill only fields present in the text. Leave missing ones as "".

TEXT:
${rawText}
`;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant", // FREE + FAST
      messages: [
        { role: "system", content: "Return ONLY valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    let content = completion.choices?.[0]?.message?.content || "";

    // Remove code blocks if present
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    let mapped = {};
    try {
      mapped = JSON.parse(content);
    } catch (err) {
      console.error("Groq JSON parse fail:", content);
      return res.status(500).json({
        message: "Groq returned invalid JSON",
        raw: content,
      });
    }

    return res.json({ mapped });
  } catch (err) {
    console.error("GROQ LLM ERROR:", err);
    return res.status(500).json({
      message: "LLM Failed",
      error: err.message,
    });
  }
});

export default router;
