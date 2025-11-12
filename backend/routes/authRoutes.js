// E:\devalayaum\backend\routes\authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js"; // keep your util

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// 🔹 Send OTP to user's email
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // string 6-digit
    const expiry = Date.now() + 10 * 60 * 1000; // 10 mins

    // create/update user and set otp + expiry + verified=false
    await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry: expiry, verified: false, email },
      { upsert: true, new: true }
    );

    // send email (your sendEmail util must be configured)
    await sendEmail(
      email,
      "🕉️ Devalayaum Email Verification",
      `<div style="font-family:sans-serif">
        <h2>🪔 Namaste from Devalayaum!</h2>
        <p>Your OTP is <b>${otp}</b></p>
        <p>It is valid for 10 minutes. Please do not share this code with anyone.</p>
      </div>`
    );

    res.json({ message: "OTP sent successfully to email" });
  } catch (err) {
    console.error("send-otp error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// 🔹 Verify OTP
// 🔹 Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Include user info in response
    res.json({
      message: "Email verified successfully",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});


// keep these? optional - I'll keep them but note: they use authMiddleware so will be reachable at /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-otp -otpExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
