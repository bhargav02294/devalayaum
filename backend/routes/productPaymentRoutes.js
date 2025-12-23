import express from "express";
import axios from "axios";
import Product from "../models/Product.js";
import ProductOrder from "../models/ProductOrder.js";
import ProductPayment from "../models/ProductPayment.js";

const router = express.Router();

/* ================= PHONEPE CONFIG ================= */
const AUTH_URL = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const PAY_URL = "https://api.phonepe.com/apis/pg/checkout/v2/pay";
const STATUS_URL = "https://api.phonepe.com/apis/pg/checkout/v2/order";

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || "1";

/* ================= ACCESS TOKEN ================= */
async function getAccessToken() {
  const formData = new URLSearchParams();
  formData.append("client_id", CLIENT_ID);
  formData.append("client_secret", CLIENT_SECRET);
  formData.append("client_version", CLIENT_VERSION);
  formData.append("grant_type", "client_credentials");

  const res = await axios.post(AUTH_URL, formData.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data.access_token;
}

/* =================================================
   CREATE PRODUCT PAYMENT
================================================= */
router.post("/create-order", async (req, res) => {
  try {
    const { productId, userId } = req.body;

    if (!productId || !userId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const amount = product.discountPrice || product.price;
    const merchantOrderId = `PO-${Date.now()}`;

    await ProductOrder.create({
      orderId: merchantOrderId,
      userId,
      productId,
      amount,
    });

    await ProductPayment.create({
      orderId: merchantOrderId,
      userId,
      productId,
      amount,
    });

    const accessToken = await getAccessToken();

    const payload = {
      merchantOrderId,
      amount: amount * 100,
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl: `${process.env.FRONTEND_ORIGIN}/order-success?orderId=${merchantOrderId}`,
        },
      },
    };

    const response = await axios.post(PAY_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${accessToken}`,
      },
    });

    return res.json({
      redirectUrl: response.data.redirectUrl,
      orderId: merchantOrderId,
    });
  } catch (err) {
    console.error("PRODUCT PAYMENT ERROR:", err.response?.data || err);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

/* =================================================
   VERIFY PRODUCT PAYMENT
================================================= */
router.get("/verify", async (req, res) => {
  try {
    const { orderId } = req.query;
    if (!orderId) return res.status(400).json({ error: "Missing orderId" });

    const accessToken = await getAccessToken();

    const statusRes = await axios.get(
      `${STATUS_URL}/${orderId}/status`,
      { headers: { Authorization: `O-Bearer ${accessToken}` } }
    );

    if (statusRes.data.state !== "COMPLETED") {
      return res.json({ success: false });
    }

    const payment = await ProductPayment.findOne({ orderId });
    if (!payment || payment.status === "paid") {
      return res.json({ success: true });
    }

    payment.status = "paid";
    payment.phonepePaymentId = statusRes.data.orderId;
    payment.rawResponse = statusRes.data;
    await payment.save();

    await ProductOrder.findOneAndUpdate(
      { orderId },
      { status: "PAID" }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("VERIFY ERROR:", err.response?.data || err);
    res.status(500).json({ error: "Verification failed" });
  }
});

export default router;
