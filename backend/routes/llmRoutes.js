import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/parse-temple", async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) {
      return res.status(400).json({ message: "Missing rawText" });
    }

    const prompt = `
Extract temple information STRICTLY in valid JSON.

RETURN ONLY JSON. NO explanations. NO text outside JSON.

Use exactly this structure:

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

Fill only fields found in text. Missing fields keep "".

TEXT:
${rawText}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return ONLY valid JSON. No extra text." },
        { role: "user", content: prompt }
      ]
    });

    let content = completion.choices[0].message.content || "";

    // REMOVE code fences if they appear
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    let mapped = {};
    try {
      mapped = JSON.parse(content);
    } catch (err) {
      console.error("JSON parse failed:", content);
      return res.status(500).json({
        message: "LLM returned invalid JSON",
        raw: content
      });
    }

    res.json({ mapped });

  } catch (err) {
    console.error("LLM ROUTE ERROR:", err);
    res.status(500).json({ message: "LLM Failed", error: err.message });
  }
});

export default router;