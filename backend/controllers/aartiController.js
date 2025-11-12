// E:\devalayaum\backend\controllers\aartiController.js
import mongoose from "mongoose";
import AartiItem from "../models/AartiItem.js";

const isValidObjectId = (v) => {
  try {
    return mongoose.Types.ObjectId.isValid(v);
  } catch {
    return false;
  }
};

// GET /api/aartis
// GET /api/aartis
export const getAartis = async (req, res) => {
  try {
    const { type, temple, published } = req.query;

    const filter = {};

    if (type) filter.type = type;

    if (temple && isValidObjectId(temple)) {
      filter.temple = temple;
    }

    if (published !== undefined) {
      filter.published = published === "true";
    }

    const items = await AartiItem.find(filter)
      .sort({ createdAt: -1 })
      .populate("temple", "name");

    res.status(200).json(items);
  } catch (err) {
    console.error("getAartis error:", err);
    res.status(500).json({ message: "Server error fetching aartis" });
  }
};


// GET /api/aartis/:id
export const getAartiById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const item = await AartiItem.findById(id).populate("temple", "name");
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.status(200).json(item);
  } catch (err) {
    console.error("getAartiById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/aartis  (admin)
export const createAarti = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.temple || !isValidObjectId(data.temple)) {
      delete data.temple;
    }

    const item = new AartiItem(data);
    await item.save();

    res.status(201).json(item);
  } catch (err) {
    console.error("Create Aarti Error:", err);
    res.status(500).json({ message: err.message || "Server error creating aarti" });
  }
};

// PUT /api/aartis/:id  (admin)
export const updateAarti = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const payload = { ...req.body };

    if (!payload.temple || !isValidObjectId(payload.temple)) {
      delete payload.temple;
    }

    const updated = await AartiItem.findByIdAndUpdate(id, payload, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("updateAarti error:", err);
    res.status(500).json({ message: "Server error updating aarti" });
  }
};


// DELETE /api/aartis/:id  (admin)
export const deleteAarti = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    await AartiItem.findByIdAndDelete(id);
    return res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    console.error("deleteAarti error:", err);
    return res.status(500).json({ message: "Server error deleting aarti" });
  }
};
