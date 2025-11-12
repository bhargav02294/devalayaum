import express from "express";
import verifyAdmin from "../middleware/verifyAdmin.js";
import Puja from "../models/Puja.js";

const router = express.Router();

// ✅ FIRST add home-list route (to avoid conflict with /:id)
router.get("/home-list", async (req, res) => {
  try {
    const pujas = await Puja.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(4);

    res.json(pujas);
  } catch (err) {
    console.error("Home Pujas Error:", err);
    res.status(500).json({ message: "Failed to fetch pujas for home" });
  }
});

// ✅ Get all pujas
router.get("/", async (req, res) => {
  try {
    const pujas = await Puja.find().sort({ createdAt: -1 });
    res.json(pujas);
  } catch (err) {
    console.error("Get Pujas Error:", err);
    res.status(500).json({ message: "Failed to fetch pujas" });
  }
});

// ✅ Get puja by ID
router.get("/:id", async (req, res) => {
  try {
    const puja = await Puja.findById(req.params.id).populate("availableAt");
    if (!puja) return res.status(404).json({ message: "Puja not found" });
    res.json(puja);
  } catch (err) {
    console.error("Get Puja Error:", err);
    res.status(500).json({ message: "Failed to fetch puja" });
  }
});

// ✅ Create puja (admin)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const puja = new Puja(req.body);
    await puja.save();
    res.status(201).json(puja);
  } catch (err) {
    console.error("Create Puja Error:", err);
    res.status(400).json({ message: err.message || "Failed to create puja" });
  }
});

// ✅ Update puja
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const puja = await Puja.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!puja) return res.status(404).json({ message: "Puja not found" });
    res.json(puja);
  } catch (err) {
    console.error("Update Puja Error:", err);
    res.status(400).json({ message: err.message || "Failed to update puja" });
  }
});

// ✅ Delete puja
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const puja = await Puja.findByIdAndDelete(req.params.id);
    if (!puja) return res.status(404).json({ message: "Puja not found" });
    res.json({ message: "Puja deleted successfully" });
  } catch (err) {
    console.error("Delete Puja Error:", err);
    res.status(500).json({ message: "Failed to delete puja" });
  }
});

export default router;
