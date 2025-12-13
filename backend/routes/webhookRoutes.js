import express from "express";

const router = express.Router();

router.post("/phonepe", (req, res) => {
  console.log("Received PhonePe business webhook:", req.body);
  res.json({ status: "ok" });
});

export default router;
