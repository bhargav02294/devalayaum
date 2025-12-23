import express from "express";
import axios from "axios";
import PujaBooking from "../models/PujaBooking.js";
import PujaPayment from "../models/PujaPayment.js";

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
   CREATE PUJA PAYMENT
================================================= */
router.post("/create", async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ error: "bookingId required" });

    const booking = await PujaBooking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.payment?.paid) {
      return res.status(400).json({ error: "Payment already completed" });
    }

    const amount =
      booking.pujaSnapshot.packageDiscountPrice ||
      booking.pujaSnapshot.packagePrice;

    const merchantOrderId = `PB-${Date.now()}`;

    await PujaPayment.create({
      bookingId: booking._id,
      userId: booking.user,
      orderId: merchantOrderId,
      amount,
    });

    const accessToken = await getAccessToken();

    const payload = {
      merchantOrderId,
      amount: amount * 100,
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl: `${process.env.FRONTEND_ORIGIN}/puja-success?bookingId=${booking._id}&orderId=${merchantOrderId}`,
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
    console.error("PUJA PAYMENT ERROR:", err.response?.data || err);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

/* =================================================
   VERIFY PUJA PAYMENT
================================================= */
router.get("/verify", async (req, res) => {
  try {
    const { orderId, bookingId } = req.query;
    if (!orderId || !bookingId) {
      return res.status(400).json({ error: "Missing params" });
    }

    const accessToken = await getAccessToken();

    const statusRes = await axios.get(
      `${STATUS_URL}/${orderId}/status`,
      { headers: { Authorization: `O-Bearer ${accessToken}` } }
    );

    if (statusRes.data.state !== "COMPLETED") {
      return res.json({ success: false });
    }

    const payment = await PujaPayment.findOne({ orderId });
    if (!payment || payment.status === "paid") {
      return res.json({ success: true });
    }

    payment.status = "paid";
    payment.phonepePaymentId = statusRes.data.orderId;
    payment.rawResponse = statusRes.data;
    await payment.save();

    await PujaBooking.findByIdAndUpdate(bookingId, {
      status: "confirmed",
      "payment.paid": true,
      "payment.method": "phonepe",
      "payment.txnId": payment.phonepePaymentId,
      "payment.amountPaid": payment.amount,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("PUJA VERIFY ERROR:", err.response?.data || err);
    res.status(500).json({ error: "Verification failed" });
  }
});

export default router;
