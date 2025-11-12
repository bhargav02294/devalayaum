import express from "express";
import Product from "../models/Product.js";               // ✅ add this import
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// ✅ Home section list — MUST be before "/:id"
router.get("/home-list", async (req, res) => {
  try {
    const items = await Product.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(4);
    res.json(items);
  } catch (err) {
    console.error("home-list error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Public
router.get("/", getProducts);

// Single (keep AFTER /home-list)
router.get("/:id", getProductById);

// Admin
router.post("/", verifyAdmin, createProduct);
router.put("/:id", verifyAdmin, updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

export default router;
