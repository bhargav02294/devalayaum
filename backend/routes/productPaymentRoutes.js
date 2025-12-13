// E:\devalayaum\backend\routes\productPaymentRoutes.js
import express from "express";

const router = express.Router();

/* ---------------------------------------------------
   Razorpay removed completely
   Product payments via PhonePe not implemented yet
---------------------------------------------------- */

// Create temporary placeholder order (backend won't crash)
router.post("/create-order", (req, res) => {
  return res.status(400).json({
    error: "Product payments via PhonePe are not yet implemented.",
  });
});

// Verification placeholder
router.post("/verify", (req, res) => {
  return res.status(400).json({
    error: "Product payment verification not implemented.",
  });
});

export default router;
