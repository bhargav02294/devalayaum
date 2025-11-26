// E:\devalayaum\backend\controllers\ocrController.js
import Tesseract from "tesseract.js";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

// 📌 Convert DOCX → text
async function convertDOCX(filePath) {
  const { value } = await mammoth.extractRawText({ path: filePath });
  return value || "";
}

// 📌 Convert PDF → Image(s)
function convertPDFtoImages(pdfPath, outputDir) {
  return new Promise((resolve, reject) => {
    exec(
      `pdftoppm "${pdfPath}" "${outputDir}/page" -png`,
      (err) => (err ? reject(err) : resolve())
    );
  });
}

// 📌 OCR any image
async function ocrImage(imagePath, lang = "eng") {
  const { data } = await Tesseract.recognize(imagePath, lang);
  return data.text;
}

// 📌 MAIN FUNCTION
export const extractTempleData = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const uploadedPath = req.file.path;
    let rawText = "";

    // CASE 1: DOCX
    if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      rawText = await convertDOCX(uploadedPath);
    }

    // CASE 2: PDF
    else if (req.file.mimetype === "application/pdf") {
      const outputDir = "uploads/pdf_images";
      fs.mkdirSync(outputDir, { recursive: true });

      await convertPDFtoImages(uploadedPath, outputDir);

      const files = fs.readdirSync(outputDir).filter(f => f.endsWith(".png"));

      for (const img of files) {
        rawText += await ocrImage(path.join(outputDir, img));
      }
    }

    // CASE 3: IMAGES
    else {
      rawText = await ocrImage(uploadedPath);
    }

    if (!rawText.trim())
      return res.status(500).json({ msg: "OCR failed or empty text" });

    // 🔥 STEP: This will later call LLM parser
    res.json({
      rawText,
      mapped: {}, // LLM output will fill here
    });

  } catch (e) {
    console.error("OCR Error:", e);
    res.status(500).json({ msg: "OCR failed", error: e.message });
  }
};
