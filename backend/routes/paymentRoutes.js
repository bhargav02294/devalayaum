// E:\devalayaum\backend\routes\paymentRoutes.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Donation from "../models/Donation.js";
import DonationPayment from "../models/DonationPayment.js";
import DonationRecord from "../models/DonationRecord.js";

const router = express.Router();

// init razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/create-order", async (req, res) => {
  try {
    const { donationId, fullName, mobile, amount } = req.body;
    if (!donationId || !fullName || !mobile || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // verify donation exists
    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `donation_rcpt_${Date.now()}`,
      notes: {
        donationId: donationId.toString(),
        fullName,
        mobile
      }
    };

    const order = await razorpay.orders.create(options);

    // save payment record in DB
    const paymentRecord = await DonationPayment.create({
      donationId,
      fullName,
      mobile,
      amount,
      currency: "INR",
      orderId: order.id
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("create-order error:", err);
    res.status(500).json({ message: "Could not create order" });
  }
});

// Verify payment
router.post("/verify", async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: "Missing payment verification fields" });
    }

    // validate signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const expectedSignature = hmac.digest("hex");

    if (expectedSignature !== signature) {
      // mark failure
      await DonationPayment.findOneAndUpdate({ orderId }, { status: "failed" });
      return res.status(400).json({ message: "Invalid signature" });
    }

    // After successful Razorpay signature verification ✅
await DonationRecord.create({
  fullName: req.body.fullName || "Anonymous",
  mobile: req.body.mobile || "",
  amount: req.body.amount,
  templeName: req.body.templeName || "Unknown Temple",
  donationName: req.body.donationName || "General Donation",
  paymentId: req.body.paymentId,
  verified: true,
});



    // signature valid → update payment record
    const paymentRecord = await DonationPayment.findOneAndUpdate(
      { orderId },
      { paymentId, signature, status: "paid" },
      { new: true }
    );


    
    // you might also update Donation model (e.g., increment count / mark one donor) if you like
    res.json({ message: "Payment verified", paymentRecord });
  } catch (err) {
    console.error("verify payment error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});


// 🧡 Public: Get all verified donors
router.get("/donors", async (req, res) => {
  try {
    const donors = await DonationRecord.find({ verified: true })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
