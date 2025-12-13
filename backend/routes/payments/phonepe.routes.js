// E:\devalayaum\backend\routes\payments\phonepe.routes.js

import express from "express";
import crypto from "crypto";
import axios from "axios";

const router = express.Router();

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL;

const CALLBACK_URL =
  process.env.BACKEND_URL + "/api/payments/phonepe/callback";

// ---------------- CREATE PAYMENT ----------------
router.post("/create-phonepe-payment", async (req, res) => {
  try {
    const { donationId, fullName, mobile, amount } = req.body;

    const transactionId = "TXN" + Date.now();

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: mobile,
      amount: Number(amount) * 100,
      redirectUrl: CALLBACK_URL,
      callbackUrl: CALLBACK_URL,
      mobileNumber: mobile,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

    const toHash = base64Payload + "/pg/v1/pay" + SALT_KEY;
    const sha = crypto.createHash("sha256").update(toHash).digest("hex");
    const xVerify = `${sha}###${SALT_INDEX}`;

    const response = await axios.post(
      `${PHONEPE_BASE_URL}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": MERCHANT_ID,
        },
      }
    );

    return res.json({
      success: true,
      transactionId,
      url: response.data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    console.log("PhonePe Error:", error?.response?.data || error);
    res.status(500).json({ error: error?.response?.data || error.message });
  }
});

// ---------------- CALLBACK & VERIFY ----------------
router.post("/phonepe/callback", async (req, res) => {
  try {
    const { merchantTransactionId } = req.body;

    const toHash =
      `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY;

    const sha = crypto.createHash("sha256").update(toHash).digest("hex");
    const xVerify = `${sha}###${SALT_INDEX}`;

    const statusRes = await axios.get(
      `${PHONEPE_BASE_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
      {
        headers: {
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": MERCHANT_ID,
        },
      }
    );

    if (statusRes.data.code === "PAYMENT_SUCCESS") {
      console.log("Donation successful:", merchantTransactionId);
      // TODO: Save donor in DB
    }

    return res.json({ message: "OK" });
  } catch (err) {
    console.log("Callback Error:", err);
    return res.status(500).json({ error: "Callback error" });
  }
});

// ⭐ THIS IS THE IMPORTANT LINE FOR ESM
export default router;
