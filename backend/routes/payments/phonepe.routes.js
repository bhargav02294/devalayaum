import express from "express";
import axios from "axios";
import DonationRecord from "../../models/DonationRecord.js";

const router = express.Router();

// ENV
const AUTH_URL = process.env.PHONEPE_AUTH_URL;
const PAY_URL = process.env.PHONEPE_PAY_URL;
const STATUS_URL = process.env.PHONEPE_STATUS_URL;

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION;

const CALLBACK_URL = process.env.BACKEND_URL + "/api/payments/phonepe/callback";

/* ---------------------------------------------------------
   1. Get Access Token (V2)
--------------------------------------------------------- */
async function getAccessToken() {
  const res = await axios.post(
    AUTH_URL,
    {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      clientVersion: CLIENT_VERSION
    },
    {
      headers: { "Content-Type": "application/json; charset=UTF-8" }
    }
  );

  return res.data.accessToken;
}

/* ---------------------------------------------------------
   2. Create Payment
--------------------------------------------------------- */
router.post("/create-phonepe-payment", async (req, res) => {
  try {
    const { donationId, fullName, mobile, amount } = req.body;

    const accessToken = await getAccessToken();

    const merchantOrderId = "ORD" + Date.now();

    const payload = {
      merchantOrderId,
      merchantUserId: mobile,
      amount: Number(amount) * 100,
      redirectUrl: CALLBACK_URL,
      callbackUrl: CALLBACK_URL,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const response = await axios.post(PAY_URL, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8"
      }
    });

    return res.json({
      success: true,
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      merchantOrderId,
      fullName,
      mobile,
      donationId
    });

  } catch (err) {
    console.error("PHONEPE PAYMENT ERROR:", err.response?.data || err);
    return res.status(500).json({
      success: false,
      error: err.response?.data || "Payment Error"
    });
  }
});

/* ---------------------------------------------------------
   3. Callback Handler + Save Donation
--------------------------------------------------------- */
router.post("/phonepe/callback", async (req, res) => {
  try {
    const { merchantOrderId } = req.body;

    const accessToken = await getAccessToken();

    const statusRes = await axios.get(
      `${STATUS_URL}/${merchantOrderId}/status`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const status = statusRes.data.code;

    if (status === "PAYMENT_SUCCESS") {
      await DonationRecord.create({
        fullName: "Anonymous",
        mobile: "",
        amount: statusRes.data.data.amount / 100,
        donationName: "Donation",
        templeName: "Temple",
        paymentId: merchantOrderId,
        verified: true
      });
    }

    return res.json({ message: "OK", status });

  } catch (err) {
    console.log("CALLBACK ERROR:", err.response?.data || err);
    return res.status(500).json({ error: "Callback Error" });
  }
});

export default router;
