// E:\devalayaum\backend\routes\payments\phonepe.routes.js

import express from "express";
import crypto from "crypto";
import axios from "axios";
import DonationRecord from "../../models/DonationRecord.js";

const router = express.Router();

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL;

const CALLBACK_URL =
  process.env.BACKEND_URL + "/api/payments/phonepe/callback";

// ======================================================================
//                       CREATE PAYMENT (DEBUG LOGGING ENABLED)
// ======================================================================
router.post("/create-phonepe-payment", async (req, res) => {
  try {
    const { donationId, fullName, mobile, amount } = req.body;

    const transactionId = "TXN" + Date.now();

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: mobile,
      amount: Number(amount) * 100, // paise
      redirectUrl: CALLBACK_URL,
      callbackUrl: CALLBACK_URL,
      mobileNumber: mobile,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

    const stringToHash = base64Payload + "/pg/v1/pay" + SALT_KEY;
    const sha = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const xVerify = `${sha}###${SALT_INDEX}`;

    // ------------------------ DEBUG LOGS ------------------------
    console.log("=========================================");
    console.log("PHONEPE PAYMENT INITIATED");
    console.log("-----------------------------------------");
    console.log("RAW PAYLOAD:", payload);
    console.log("BASE64 PAYLOAD:", base64Payload);
    console.log("STRING TO HASH:", stringToHash);
    console.log("X-VERIFY:", xVerify);
    console.log("API URL:", `${PHONEPE_BASE_URL}/pg/v1/pay`);
    console.log("=========================================");

    // ------------------------ API CALL --------------------------
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

    // Debug log for PhonePe response
    console.log("PHONEPE RESPONSE:", response.data);

    return res.json({
      success: true,
      transactionId,
      url: response.data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    console.log("=========================================");
    console.log("PHONEPE ERROR RESPONSE:");
    console.log(error?.response?.data || error);
    console.log("=========================================");

    res.status(500).json({ error: error?.response?.data || error.message });
  }
});

// ======================================================================
//                      CALLBACK + PAYMENT STATUS VERIFY
// ======================================================================
router.post("/phonepe/callback", async (req, res) => {
  try {
    const { merchantTransactionId } = req.body;

    const stringToHash =
      `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY;

    const sha = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const xVerify = `${sha}###${SALT_INDEX}`;

    // Debug logs for callback verification
    console.log("=========================================");
    console.log("PHONEPE CALLBACK RECEIVED");
    console.log("TXN ID:", merchantTransactionId);
    console.log("STATUS CHECK HASH STRING:", stringToHash);
    console.log("X-VERIFY FOR STATUS:", xVerify);
    console.log("=========================================");

    const statusRes = await axios.get(
      `${PHONEPE_BASE_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
      {
        headers: {
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": MERCHANT_ID,
        },
      }
    );

    console.log("PHONEPE STATUS RESPONSE:", statusRes.data);

    if (statusRes.data.code === "PAYMENT_SUCCESS") {
      console.log("Donation successful:", merchantTransactionId);

      await DonationRecord.create({
        fullName: req.body.fullName || "Anonymous",
        mobile: req.body.mobile || "",
        amount: req.body.amount || 0,
        donationName: req.body.donationName || "",
        templeName: req.body.templeName || "",
        paymentId: merchantTransactionId,
        verified: true,
      });
    }

    return res.json({ message: "OK" });
  } catch (err) {
    console.log("=========================================");
    console.log("CALLBACK ERROR:", err?.response?.data || err);
    console.log("=========================================");
    return res.status(500).json({ error: "Callback error" });
  }
});

export default router;
