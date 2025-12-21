import express from "express";
import axios from "axios";
import DonationRecord from "../../models/DonationRecord.js";

const router = express.Router();

/* ================= ENV ================= */

const AUTH_URL =
  "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

const PAY_URL =
  "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";

const STATUS_URL =
  "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order";

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || "1";

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;

const CALLBACK_URL =
  process.env.BACKEND_URL + "/api/payments/phonepe/callback";

/* =====================================================
   1. GET ACCESS TOKEN (SANDBOX – V2)
===================================================== */
async function getAccessToken() {
  console.log("========== PHONEPE AUTH REQUEST ==========");
  console.log("AUTH URL:", AUTH_URL);
  console.log("CLIENT ID:", CLIENT_ID);
  console.log("=========================================");

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

  return res.data.access_token;
}

/* =====================================================
   2. CREATE PAYMENT (V2 CHECKOUT)
===================================================== */
router.post("/create-phonepe-payment", async (req, res) => {
  try {
    const { donationId, mobile, amount } = req.body;

    console.log("========== PHONEPE CREATE PAYMENT ==========");
    console.log("Donation ID:", donationId);
    console.log("Merchant ID:", MERCHANT_ID);
    console.log("Amount (paise):", Number(amount) * 100);
    console.log("Mobile:", mobile.replace(/\d(?=\d{4})/g, "*"));

    const accessToken = await getAccessToken();
    console.log("Access Token: RECEIVED");

    const merchantOrderId = "ORD" + Date.now();
    console.log("Merchant Order ID:", merchantOrderId);

    const payload = {
      merchantOrderId,
      merchantUserId: `USER_${mobile}`,   // safe format
      amount: Number(amount) * 100,
      redirectUrl: `${process.env.FRONTEND_ORIGIN}/order-success?orderId=${merchantOrderId}`,
      callbackUrl: `${process.env.BACKEND_URL}/api/payments/phonepe/callback`,
      paymentInstrument: { type: "PAY_PAGE" }
    };

    console.log("PAY URL:", PAY_URL);
    console.log("REQUEST PAYLOAD:", payload);

    const response = await axios.post(PAY_URL, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-MERCHANT-ID": MERCHANT_ID
      }
    });

    console.log("PHONEPE PAY RESPONSE:", response.data);
    console.log("==========================================");

    return res.json({
      success: true,
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      merchantOrderId
    });

  } catch (err) {
    console.error("PHONEPE PAYMENT ERROR:", err.response?.data || err);
    return res.status(500).json({
      success: false,
      error: err.response?.data
    });
  }
});


/* =====================================================
   3. CALLBACK + STATUS CHECK
===================================================== */
router.post("/phonepe/callback", async (req, res) => {
  try {
    console.log("========== PHONEPE CALLBACK ==========");
    console.log("RAW CALLBACK BODY:", req.body);

    const merchantOrderId =
      req.body?.merchantOrderId ||
      req.body?.data?.merchantOrderId;

    if (!merchantOrderId) {
      console.error("MerchantOrderId not found in callback");
      return res.status(400).json({ error: "Invalid callback" });
    }

    console.log("Merchant Order ID:", merchantOrderId);

    const accessToken = await getAccessToken();

    const statusRes = await axios.get(
      `${STATUS_URL}/${merchantOrderId}/status`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-MERCHANT-ID": MERCHANT_ID,
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
