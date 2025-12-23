import express from "express";
import DonationRecord from "../../models/DonationRecord.js";

const router = express.Router();

router.get("/donors", async (req, res) => {
  try {
    const donors = await DonationRecord.find({ verified: true })
      .sort({ createdAt: -1 })
      .select("fullName amount templeName donationName createdAt");

    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch donors" });
  }
});

export default router;
