// E:\devalayaum\backend\routes\aartiRoutes.js
import express from "express";
import {
  getAartis,
  getAartiById,
  createAarti,
  updateAarti,
  deleteAarti,
} from "../controllers/aartiController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import AartiItem from "../models/AartiItem.js";

const router = express.Router();


// ✅ HOME LIST API (latest 4 items)
router.get("/home-list", async (req, res) => {
  try {
    const items = await AartiItem.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(4);

    res.json(items);
  } catch (err) {
    console.error("Home-list Aarti error:", err);
    res.status(500).json({ message: "Failed to load aartis" });
  }
});




// Public
router.get("/", getAartis);
router.get("/:id", getAartiById);

// Admin
router.post("/", verifyAdmin, createAarti);
router.put("/:id", verifyAdmin, updateAarti);
router.delete("/:id", verifyAdmin, deleteAarti);

export default router;
