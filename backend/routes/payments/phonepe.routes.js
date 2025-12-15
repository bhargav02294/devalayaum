// E:\devalayaum\backend\routes\payments\phonepe.routes.js

import express from "express";
import axios from "axios";
import DonationRecord from "../../models/DonationRecord.js";

const router = express.Router();

// ENV VARIABLES (Render)
const AUTH_URL = process.env.PHONEPE_AUTH_URL;
const PAY_URL = process.env.PHONEPE_PAY_URL;
const STATUS_URL = process.env.PHONEPE_STATUS_URL;

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION;

const CALLBACK_URL =
  process.env.BACKEND_URL + "/api/payments/phonepe/callback";

// -----------------------------------------------------------
// 1. GET OAUTH ACCESS TOKEN
// -----------------------------------------------------------
async function getAccessToken() {
  const res = await axios.post(
    AUTH_URL,
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      client_version: CLIENT_VERSION,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return res.data.access_token;
}

// -----------------------------------------------------------
// 2. CREATE PAYMENT (V2 FLOW)
// -----------------------------------------------------------
router.post("/create-phonepe-payment", async (req, res) => {
  try {
    const { donationId, fullName, mobile, amount } = req.body;

    const accessToken = await getAccessToken();

    const merchantOrderId = "ORD" + Date.now();

    const payload = {
      merchantOrderId,
      merchantUserId: mobile,
      amount: Number(amount) * 100,
      callbackUrl: CALLBACK_URL,
      redirectUrl: CALLBACK_URL,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const response = await axios.post(PAY_URL, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return res.json({
      success: true,
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      merchantOrderId,
    });
  } catch (err) {
    console.error("PHONEPE PAYMENT ERROR:", err.response?.data || err);
    return res.status(500).json({
      success: false,
      error: err.response?.data || "Payment Error",
    });
  }
});

// -----------------------------------------------------------
// 3. CALLBACK HANDLER + STATUS CHECK
// -----------------------------------------------------------
router.post("/phonepe/callback", async (req, res) => {
  const { merchantOrderId } = req.body;

  try {
    const accessToken = await getAccessToken();

    const statusRes = await axios.get(`${STATUS_URL}/${merchantOrderId}/status`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const status = statusRes.data.code;

    if (status === "PAYMENT_SUCCESS") {
      await DonationRecord.create({
        fullName: req.body.fullName || "Anonymous",
        mobile: req.body.mobile || "",
        amount: req.body.amount || 0,
        donationName: req.body.donationName || "",
        templeName: req.body.templeName || "",
        paymentId: merchantOrderId,
        verified: true,
      });
    }

    return res.json({ message: "Callback processed", status });
  } catch (err) {
    console.log("CALLBACK ERROR:", err.response?.data || err);
    return res.status(500).json({ error: "Callback Error" });
  }
});

export default router;
