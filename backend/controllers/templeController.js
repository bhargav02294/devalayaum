// E:\devalayaum\backend\controllers\templeController.js
import Temple from "../models/Temple.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/temples
export const getTemples = async (req, res) => {
  try {
    const temples = await Temple.find().sort({ createdAt: -1 });
    res.json(temples);
  } catch (err) {
    console.error("getTemples error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/temples/:id
export const getTempleById = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ message: "Temple not found" });
    res.json(temple);
  } catch (err) {
    console.error("getTempleById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/temples (admin)
export const createTemple = async (req, res) => {
  try {
    // images already uploaded from frontend? (req.body.images expected array)
    const bodyImages = Array.isArray(req.body.images) ? req.body.images : [];

    // server-side uploaded files via multer (optional)
    let serverUploaded = [];
    if (req.files && req.files.length > 0) {
      serverUploaded = await Promise.all(
        req.files.map(async (f) => {
          const up = await cloudinary.uploader.upload(f.path, { folder: "temples" });
          try { fs.unlinkSync(f.path); } catch (e) {}
          return up.secure_url;
        })
      );
    }

    // Merge and limit to first 5
    const images = [...bodyImages, ...serverUploaded].filter(Boolean).slice(0, 5);

    const data = {
      ...req.body,
      images,
      // if temple created by admin and you have admin id in middleware
      createdBy: req.admin?.id || undefined,
    };

    const temple = new Temple(data);
    await temple.save();
    res.status(201).json(temple);
  } catch (err) {
    console.error("createTemple error:", err);
    res.status(500).json({ message: err?.message || "Server error while creating temple" });
  }
};

// PUT /api/temples/:id
export const updateTemple = async (req, res) => {
  try {
    const existing = await Temple.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Temple not found" });

    const bodyImages = Array.isArray(req.body.images) ? req.body.images : existing.images || [];

    let serverUploaded = [];
    if (req.files && req.files.length > 0) {
      serverUploaded = await Promise.all(
        req.files.map(async (f) => {
          const up = await cloudinary.uploader.upload(f.path, { folder: "temples" });
          try { fs.unlinkSync(f.path); } catch (e) {}
          return up.secure_url;
        })
      );
    }

    const mergedImages = [...bodyImages, ...serverUploaded].filter(Boolean).slice(0, 5);

    const updated = await Temple.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: mergedImages },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("updateTemple error:", err);
    res.status(500).json({ message: err?.message || "Server error while updating temple" });
  }
};

// DELETE /api/temples/:id
export const deleteTemple = async (req, res) => {
  try {
    await Temple.findByIdAndDelete(req.params.id);
    res.json({ message: "Temple deleted" });
  } catch (err) {
    console.error("deleteTemple error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
