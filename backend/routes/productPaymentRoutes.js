// E:\devalayaum\backend\routes\productPaymentRoutes.js
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔹 Create new Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { productId, amount, userId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `prod_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save pending order in DB
    await Order.create({
      user: user._id,
      product: product._id,
      amount,
      orderId: order.id,
      status: "pending",
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// 🔹 Verify payment
router.post("/verify", async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const order = await Order.findOne({ orderId });
    if (order) {
      order.paymentId = paymentId;
      order.status = "paid";
      await order.save();
    }

    res.json({ message: "Payment verified successfully" });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

export default router;