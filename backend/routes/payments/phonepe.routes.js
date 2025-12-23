import express from "express";
import axios from "axios";
import DonationRecord from "../../models/DonationRecord.js";

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
    const { donationId, amount } = req.body;

    if (!donationId || !amount) {
      return res.status(400).json({
        success: false,
        error: "Invalid request payload",
      });
    }

    const accessToken = await getAccessToken();

    const merchantOrderId = `MO-${Date.now()}`;

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

    const response = await axios.post(PAY_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${accessToken}`,
      },
    });

    const phonepeData = response.data;

    if (phonepeData?.redirectUrl && phonepeData?.orderId) {
      return res.json({
        success: true,
        redirectUrl: phonepeData.redirectUrl,
        merchantOrderId,
        phonepeOrderId: phonepeData.orderId,
        state: phonepeData.state,
      });
    }

    return res.status(400).json({
      success: false,
      error: phonepeData,
    });

  } catch (err) {
    console.error(
      "PHONEPE PAYMENT ERROR:",
      err.response?.data || err.message
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
   3. CALLBACK (USED LATER FOR WEBHOOK)
===================================================== */
router.post("/phonepe/callback", async (req, res) => {
  console.log("PHONEPE CALLBACK RECEIVED");
  console.log(req.body);
  return res.json({ message: "OK" });
});

export default router;
