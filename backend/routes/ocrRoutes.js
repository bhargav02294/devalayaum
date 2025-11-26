import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";
import mammoth from "mammoth"; // For .docx
import pdf from "pdf-parse";   // For .pdf
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// OCR endpoint
router.post("/temple", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    let rawText = "";

    // FILE TYPE DETECT
    const ext = req.file.originalname.toLowerCase();

    if (ext.endsWith(".png") || ext.endsWith(".jpg") || ext.endsWith(".jpeg")) {
      // IMAGE OCR
      const result = await Tesseract.recognize(filePath, "eng");
      rawText = result.data.text;
    }

    else if (ext.endsWith(".pdf")) {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      rawText = pdfData.text;
    }

    else if (ext.endsWith(".docx")) {
      const doc = await mammoth.extractRawText({ path: filePath });
      rawText = doc.value;
    }

    else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    fs.unlinkSync(filePath);

    res.json({ rawText });

  } catch (err) {
    console.error("OCR ERROR:", err);
    res.status(500).json({ message: "OCR Failed", error: err.message });
  }
});

export default router;
