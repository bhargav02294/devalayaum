import express from "express";
import multer from "multer";
import {
  getTemples,
  getTempleById,
  createTemple,
  updateTemple,
  deleteTemple,
} from "../controllers/templeController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import Temple from "../models/Temple.js";   // ✅ FIXED MISSING IMPORT


const router = express.Router();

// ✅ Configure multer (temporary local uploads)
const upload = multer({ dest: "uploads/" });



// ✅ HOME LIST route FIXED
router.get("/home-list", async (req, res) => {
  try {
    const temples = await Temple.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(4);
    res.json(temples);
  } catch (err) {
    console.error("HOME LIST ERROR:", err);
    res.status(500).json({ message: "Failed to fetch temples" });
  }
});

router.get("/", getTemples);
router.get("/:id", getTempleById);

router.post("/", verifyAdmin, upload.array("images", 5), createTemple);
router.put("/:id", verifyAdmin, upload.array("images", 5), updateTemple);
router.delete("/:id", verifyAdmin, deleteTemple);

export default router;
