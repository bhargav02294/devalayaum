import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/temple", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let rawText = "";
    const mime = req.file.mimetype;

    // ---------------- PDF ----------------
    if (mime === "application/pdf") {
      const pdfParse = (await import("pdf-parse")).default || (await import("pdf-parse"));
      const result = await pdfParse(req.file.buffer);
      rawText = result.text;
    }

    // ---------------- DOCX ----------------
    else if (
      mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const { value } = await mammoth.extractRawText({ buffer: req.file.buffer });
      rawText = value;
    }

    // ---------------- IMAGE ----------------
    else if (mime.startsWith("image/")) {
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


