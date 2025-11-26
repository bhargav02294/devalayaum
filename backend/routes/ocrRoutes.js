import express from "express";
import multer from "multer";
import pkg from "pdf-parse";        // ✔ correct import for ESM
import mammoth from "mammoth";
import Tesseract from "tesseract.js";

const pdfParse = pkg;               // ✔ assign function

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/temple", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let rawText = "";

    // ---------------- PDF ----------------
    if (req.file.mimetype === "application/pdf") {
      const result = await pdfParse(req.file.buffer);
      rawText = result.text;
    }

    // ---------------- DOCX ----------------
    else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const { value } = await mammoth.extractRawText({ buffer: req.file.buffer });
      rawText = value;
    }

    // ---------------- IMAGE (OCR) ----------------
    else if (req.file.mimetype.startsWith("image/")) {
      const result = await Tesseract.recognize(req.file.buffer, "eng");
      rawText = result.data.text;
    }

    else {
      return res.status(400).json({ message: "Unsupported file format" });
    }

    res.json({ rawText });

  } catch (err) {
    console.error("OCR error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
