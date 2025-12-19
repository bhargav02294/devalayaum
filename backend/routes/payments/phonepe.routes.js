import express from "express";
import axios from "axios";
import DonationRecord from "../../models/DonationRecord.js";

const router = express.Router();

// ================= ENV =================
const AUTH_URL =
  "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

const PAY_URL = process.env.PHONEPE_PAY_URL; 
// https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay

const STATUS_URL = process.env.PHONEPE_STATUS_URL;
// https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || "1";

const CALLBACK_URL =
  process.env.BACKEND_URL + "/api/payments/phonepe/callback";

// =====================================================
// 1. GET ACCESS TOKEN (PHONEPE V2 – SANDBOX)
// =====================================================
async function getAccessToken() {
  const formData = new URLSearchParams();
  formData.append("client_id", CLIENT_ID);
  formData.append("client_secret", CLIENT_SECRET);
  formData.append("client_version", CLIENT_VERSION);
  formData.append("grant_type", "client_credentials");

  console.log("========== PHONEPE AUTH REQUEST ==========");
  console.log("AUTH URL:", AUTH_URL);
  console.log("CLIENT ID:", CLIENT_ID);
  console.log("=========================================");

  const res = await axios.post(AUTH_URL, formData.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  console.log("PHONEPE AUTH SUCCESS");

  return res.data.access_token;
}

// =====================================================
// 2. CREATE PAYMENT (V2 CHECKOUT)
// =====================================================
router.post("/create-phonepe-payment", async (req, res) => {
  try {
    const { donationId, fullName, mobile, amount } = req.body;

    console.log("========== PHONEPE CREATE PAYMENT ==========");
    console.log("Donation ID:", donationId);
    console.log("Amount (paise):", Number(amount) * 100);
    console.log("Mobile:", mobile.replace(/\d(?=\d{4})/g, "*"));

    const accessToken = await getAccessToken();

    const merchantOrderId = "ORD" + Date.now();
    console.log("Merchant Order ID:", merchantOrderId);

    const payload = {
      merchantOrderId,
      merchantUserId: mobile,
      amount: Number(amount) * 100,
      redirectUrl: CALLBACK_URL,
      callbackUrl: CALLBACK_URL,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    console.log("PAY URL:", PAY_URL);
    console.log("REQUEST PAYLOAD:", payload);

    const response = await axios.post(PAY_URL, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("PHONEPE PAY RESPONSE:", response.data);
    console.log("==========================================");

    return res.json({
      success: true,
      redirectUrl:
        response.data.data.instrumentResponse.redirectInfo.url,
      merchantOrderId,
    });
  } catch (err) {
    console.error(
      "PHONEPE PAYMENT ERROR:",
      err.response?.data || err
    );
    return res.status(500).json({
      success: false,
      error: err.response?.data || "Payment Error",
    });
  }
});

// =====================================================
// 3. CALLBACK + STATUS CHECK
// =====================================================
router.post("/phonepe/callback", async (req, res) => {
  try {
    const { merchantOrderId } = req.body;

    console.log("========== PHONEPE CALLBACK ==========");
    console.log("Merchant Order ID:", merchantOrderId);

    const accessToken = await getAccessToken();

    const statusRes = await axios.get(
      `${STATUS_URL}/${merchantOrderId}/status`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("STATUS RESPONSE:", statusRes.data);

    if (statusRes.data.code === "PAYMENT_SUCCESS") {
      await DonationRecord.create({
        fullName: "Anonymous",
        mobile: "",
        amount: statusRes.data.data.amount / 100,
        donationName: "Donation",
        templeName: "Temple",
        paymentId: merchantOrderId,
        verified: true,
      });
    }

    return res.json({ message: "OK" });
  } catch (err) {
    console.error("CALLBACK ERROR:", err.response?.data || err);
    return res.status(500).json({ error: "Callback Error" });
  }
});

export default router;
