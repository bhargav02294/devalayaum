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

const FRONTEND_REDIRECT =
  `${process.env.FRONTEND_ORIGIN}/order-success`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ PHONEPE ENV VARIABLES MISSING");
}

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

  if (!res.data?.access_token) {
    throw new Error("PhonePe access token not received");
  }

  return res.data.access_token;
}

/* =====================================================
   2. CREATE PAYMENT — PG_CHECKOUT (LATEST)
===================================================== */
router.post("/create-phonepe-payment", async (req, res) => {
  try {
    const { donationId, amount } = req.body;

    if (!donationId || !amount) {
      return res.status(400).json({
        success: false,
        error: "Invalid request payload",
      });
    }

    console.log("========== PHONEPE CREATE PAYMENT ==========");
    console.log("Donation ID:", donationId);
    console.log("Amount (paise):", Number(amount) * 100);

    const accessToken = await getAccessToken();
    console.log("Access Token: RECEIVED");

    const merchantOrderId = `MO-${Date.now()}`;
    console.log("Merchant Order ID:", merchantOrderId);

    const payload = {
      merchantOrderId,
      amount: Number(amount) * 100,

      metaInfo: {
        udf1: donationId,
        udf2: "DONATION",
        udf3: "DEVALAYAUM",
        udf4: "",
        udf5: "",
      },

      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl: `${FRONTEND_REDIRECT}?orderId=${merchantOrderId}`,
        },
      },
    };

    console.log("PAY URL:", PAY_URL);
    console.log("REQUEST PAYLOAD:", JSON.stringify(payload, null, 2));

    const response = await axios.post(PAY_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${accessToken}`,
      },
    });

    const phonepeData = response.data;

    console.log("PHONEPE RAW RESPONSE:", phonepeData);
    console.log("==========================================");

    // ✅ SAFE SUCCESS HANDLING
    // ✅ PG_CHECKOUT SUCCESS HANDLING
if (phonepeData?.redirectUrl && phonepeData?.orderId) {
  return res.json({
    success: true,
    redirectUrl: phonepeData.redirectUrl,
    merchantOrderId,
    phonepeOrderId: phonepeData.orderId,
    state: phonepeData.state,
  });
}

// genuine failure
return res.status(400).json({
  success: false,
  error: phonepeData,
});


  } catch (err) {
    console.error(
      "PHONEPE PAYMENT ERROR:",
      err.response?.data || err.message || err
    );

    return res.status(500).json({
      success: false,
      error: err.response?.data || {
        message: "Internal Server Error",
      },
    });
  }
});

/* =====================================================
   3. OPTIONAL: CALLBACK / STATUS (NOT REQUIRED FOR REDIRECT FLOW)
===================================================== */
router.post("/phonepe/callback", async (req, res) => {
  try {
    console.log("========== PHONEPE CALLBACK ==========");
    console.log("CALLBACK BODY:", req.body);
    return res.json({ message: "OK" });
  } catch (err) {
    console.error("CALLBACK ERROR:", err);
    return res.status(500).json({ error: "Callback Error" });
  }
});

export default router;
