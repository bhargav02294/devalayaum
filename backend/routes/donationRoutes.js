import express from "express";
import Donation from "../models/Donation.js";
import verifyAdmin from "../middleware/verifyAdmin.js"; // ✅ Corrected import path

const router = express.Router();


// ✅ Home-page listing — latest 4 published donations
router.get("/home-list", async (req, res) => {
  try {
    const donations = await Donation.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(4);

    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch donation list" });
  }
});




// ➕ Create
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Get all
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 Get single
router.get("/:id", async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: "Donation not found" });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
