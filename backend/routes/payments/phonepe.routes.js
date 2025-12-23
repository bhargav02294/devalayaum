import express from "express";
import axios from "axios";
import DonationRecord from "../../models/DonationRecord.js";
import DonationPayment from "../../models/DonationPayment.js";
import Donation from "../../models/Donation.js";

const router = express.Router();

/* ================= PRODUCTION ENV ================= */
const AUTH_URL =
  "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";

const PAY_URL =
  "https://api.phonepe.com/apis/pg/checkout/v2/pay";

const STATUS_URL =
  "https://api.phonepe.com/apis/pg/checkout/v2/order";

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || "1";

const FRONTEND_REDIRECT =
  `${process.env.FRONTEND_ORIGIN}/order-success`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ PHONEPE PRODUCTION ENV VARIABLES MISSING");
}

/* =====================================================
   1. GET ACCESS TOKEN (PRODUCTION)
===================================================== */
async function getAccessToken() {
  const formData = new URLSearchParams();
  formData.append("client_id", CLIENT_ID);
  formData.append("client_secret", CLIENT_SECRET);
  formData.append("client_version", CLIENT_VERSION);
  formData.append("grant_type", "client_credentials");

  const res = await axios.post(AUTH_URL, formData.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!res.data?.access_token) {
    throw new Error("PhonePe access token not received");
  }

  return res.data.access_token;
}

/* =====================================================
   2. CREATE PAYMENT — LIVE PG_CHECKOUT
===================================================== */
router.post("/create-phonepe-payment", async (req, res) => {
  try {
    const { donationId, fullName, mobile, amount } = req.body;

    if (!donationId || !fullName || !amount) {
      return res.status(400).json({
        success: false,
        error: "Invalid request payload",
      });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, error: "Donation not found" });
    }

    const accessToken = await getAccessToken();
    const merchantOrderId = `MO-${Date.now()}`;

    // ✅ Create payment record (CREATED)
    await DonationPayment.create({
      donationId,
      fullName,
      mobile,
      amount,
      orderId: merchantOrderId,
      status: "created",
    });

    const payload = {
      merchantOrderId,
      amount: Number(amount) * 100,
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

    if (response.data?.redirectUrl) {
      return res.json({
        success: true,
        redirectUrl: response.data.redirectUrl,
        merchantOrderId,
      });
    }

    return res.status(400).json({ success: false });
  } catch (err) {
    console.error("PAYMENT ERROR:", err.response?.data || err);
    res.status(500).json({ success: false });
  }
});


/* =====================================================
   3. CALLBACK (USED LATER FOR WEBHOOK)
===================================================== */
router.post("/phonepe/callback", async (req, res) => {
  try {
    const { merchantOrderId, state, paymentId } = req.body;

    if (state !== "COMPLETED") {
      return res.json({ received: true });
    }

    const payment = await DonationPayment.findOne({ orderId: merchantOrderId });
    if (!payment) return res.json({ received: true });

    payment.status = "paid";
    payment.paymentId = paymentId;
    await payment.save();

    const donation = await Donation.findById(payment.donationId);

    // ✅ Save donor record (used by Donors page)
    await DonationRecord.create({
      fullName: payment.fullName,
      mobile: payment.mobile,
      amount: payment.amount,
      templeName: donation.templeName?.en || "",
      donationName: donation.donationName?.en || "",
      paymentId,
      verified: true,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("CALLBACK ERROR:", err);
    res.status(500).json({ error: "Callback failed" });
  }
});

export default router;
