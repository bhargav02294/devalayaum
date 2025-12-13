// E:\devalayaum\backend\routes\paymentRoutes.js
import express from "express";
import DonationRecord from "../models/DonationRecord.js";

const router = express.Router();

/* ---------------------------------------------
   PaymentRoutes = ONLY for listing donors
   (PhonePe donor payment handled in phonepe.routes.js)
---------------------------------------------- */

// 🧡 Public: Get all verified donors
router.get("/donors", async (req, res) => {
  try {
    const donors = await DonationRecord.find({ verified: true })
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(donors);
  } catch (err) {
    console.error("Fetch donors error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
