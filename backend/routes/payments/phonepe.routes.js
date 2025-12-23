import express from "express";
import axios from "axios";
import DonationRecord from "../../models/DonationRecord.js";

const router = express.Router();

/* ================= ENV ================= */
const AUTH_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";
const PAY_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";
const STATUS_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order";

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || "1";

const FRONTEND_REDIRECT = `${process.env.FRONTEND_ORIGIN}/order-success`;

/* =====================================================
   1. GET ACCESS TOKEN
===================================================== */
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

/* =====================================================
   2. CREATE PAYMENT — PG_CHECKOUT (FINAL)
===================================================== */
router.post("/create-phonepe-payment", async (req, res) => {
  try {
    const { donationId, amount } = req.body;

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

    return res.json({
      success: true,
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      merchantOrderId,
    });

  } catch (err) {
    console.error("PHONEPE PAYMENT ERROR:", err.response?.data || err);
    return res.status(500).json({
      success: false,
      error: err.response?.data,
    });
  }
});

export default router;
