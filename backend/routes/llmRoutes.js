import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/parse-temple", async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) return res.status(400).json({ message: "Missing rawText" });

    const prompt = `
Extract temple information from this text.
Return ONLY valid JSON structure with these fields:

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

Fill only fields found in the text. Missing fields should remain empty.
TEXT:
${rawText}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "Extract structured data." },
                 { role: "user", content: prompt }]
    });

    let mapped;
    try {
      mapped = JSON.parse(completion.choices[0].message.content);
    } catch {
      mapped = {};
    }

    res.json({ mapped });

  } catch (err) {
    console.error("LLM ERROR:", err);
    res.status(500).json({ message: "LLM Failed", error: err.message });
  }
});

export default router;

