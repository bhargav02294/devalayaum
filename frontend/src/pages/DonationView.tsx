// E:\devalayaum\frontend\src\pages\DonationView.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Load Razorpay script safely
const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// Razorpay types (NO ANY)
declare global {
  interface RazorpayInstance {
    open: () => void;
  }

  interface Window {
    Razorpay: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

interface Donation {
  _id: string;
  thumbnail: string;
  templeName: Record<string, string>;
  address: Record<string, string>;
  templeDetails: Record<string, string>;
  shortDetails: Record<string, string>;
  donationName: Record<string, string>;
  description: Record<string, string>;
  summary: Record<string, string>;
  benefits: Record<string, string>;
  price: number;
}

export default function DonationView() {
  const { id } = useParams<{ id: string }>();

  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [error, setError] = useState("");

  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";

  const glow = "shadow-[0_10px_30px_rgba(140,85,40,0.18)]";

  useEffect(() => {
    const loadDonation = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/donations/${id}`);
        setDonation(res.data);
      } catch (err) {
        console.error("Error loading donation:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDonation();
  }, [id, backendURL]);

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!donation) return <div className="pt-24 text-center">Donation not found.</div>;

  const suggestedAmounts = [51, 101, 501, 1001];

  // -------- HANDLE PAYMENT ----------
  const handleDonate = async () => {
    setError("");

    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!mobile.trim()) return setError("Please enter your mobile number.");
    if (!amount || Number(amount) < 1)
      return setError("Please enter a valid donation amount.");

    const loaded = await loadRazorpayScript();
    if (!loaded) return setError("Failed to load Razorpay");

    try {
      // CREATE ORDER
      const create = await axios.post(`${backendURL}/api/payments/create-order`, {
        donationId: donation._id,
        fullName,
        mobile,
        amount,
      });

      const data = create.data as Record<string, unknown>;

      const orderId = data.orderId as string;
      const orderAmount = data.amount as number;
      const currency = data.currency as string;

      if (!orderId || !orderAmount || !currency) {
        return setError("Server returned invalid order data.");
      }

      const options: Record<string, unknown> = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency,
        name: "Devalayaum",
        description: `Donation: ${t(donation.donationName)}`,
        order_id: orderId,

        handler: (resp: Record<string, unknown>) => {
          const rOrderId = resp["razorpay_order_id"];
          const rPaymentId = resp["razorpay_payment_id"];
          const rSignature = resp["razorpay_signature"];

          // VERIFY PAYMENT
          (async () => {
            try {
              await axios.post(`${backendURL}/api/payments/verify`, {
                orderId: rOrderId,
                paymentId: rPaymentId,
                signature: rSignature,
                fullName,
                mobile,
                amount,
                templeName: t(donation.templeName),
                donationName: t(donation.donationName),
              });

              alert("🙏 Thank you! Your donation was successful.");
              window.location.href = "/donors";
            } catch (err) {
              console.error("Verify Err:", err);
              alert("Payment success, but verification failed.");
            }
          })();
        },

        prefill: { name: fullName, contact: mobile },
        theme: { color: "#b34a00" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Try again.");
    }
  };

  // ------------------- UI -------------------
  return (
    <div className="pt-24 pb-20 bg-gradient-to-b from-[#fff4d9] via-[#fff9f1] to-white min-h-screen px-6">

      {/* ---------------- HEADER ---------------- */}
<div className="max-w-6xl mx-auto mb-10 px-2 md:px-0">
  <h1 className="text-4xl md:text-5xl font-[Marcellus] text-[#b34a00] font-bold text-left">
    {t(donation.donationName)}
  </h1>

  <p className="text-gray-700 text-lg mt-2 font-[Poppins] text-left">
    <span className="font-semibold text-orange-900">
      {t(donation.templeName)}
    </span>
  </p>

  <p className="text-gray-600 text-lg text-left">{t(donation.address)}</p>

  <p className="mt-4 text-gray-700 italic text-xl text-left">
    {t(donation.shortDetails)}
  </p>
</div>

{/* ---------------- IMAGE + DETAILS ---------------- */}
<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start px-2 md:px-0">

  {/* IMAGE LEFT */}
  <div className={`rounded-3xl bg-white overflow-hidden ${glow} p-4`}>
    <img
      src={donation.thumbnail}
      alt={t(donation.donationName)}
      className="w-full h-[380px] object-cover rounded-2xl"
    />
  </div>


        {/* DETAILS RIGHT */}
        <div className="space-y-8">

          <section>
            <h2 className="text-3xl font-[Merriweather] text-[#8a3c0f] mb-2">
              About This Donation
            </h2>
            <p className="text-gray-700 leading-relaxed">{t(donation.description)}</p>
          </section>

          <section>
            <h2 className="text-3xl font-[Merriweather] text-[#8a3c0f] mb-2">
              Temple Details
            </h2>
            <p className="text-gray-700 leading-relaxed">{t(donation.templeDetails)}</p>
          </section>

          <section>
            <h2 className="text-3xl font-[Merriweather] text-[#8a3c0f] mb-2">
              Benefits of Donating
            </h2>
            <p className="text-gray-700 leading-relaxed">{t(donation.benefits)}</p>
          </section>

          <section>
            <h2 className="text-3xl font-[Merriweather] text-[#8a3c0f] mb-2">
              Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{t(donation.summary)}</p>
          </section>
        </div>
      </div>

      {/* ----------------  DONATION FORM BOTTOM  ---------------- */}
      <div className={`max-w-3xl mx-auto mt-16 p-8 rounded-3xl bg-white ${glow}`}>

        <h3 className="text-3xl font-[Merriweather] text-[#b34a00] text-center mb-6">
          Make a Donation
        </h3>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="w-full border p-3 rounded-xl mb-4"
        />

        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile / WhatsApp Number"
          className="w-full border p-3 rounded-xl mb-4"
        />

        {/* Suggested Amounts */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {suggestedAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className={`px-5 py-2 rounded-full border font-semibold 
                ${amount === amt
                  ? "bg-[#b34a00] text-white border-[#b34a00]"
                  : "bg-white text-[#b34a00] border-[#b34a00] hover:bg-[#fff0e0]"
                }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter custom amount"
          className="w-full border p-3 rounded-xl mb-6"
        />

        <button
          onClick={handleDonate}
          className="w-full bg-[#b34a00] hover:bg-[#8a3c0f] text-white text-lg font-semibold py-3 rounded-xl"
        >
          Donate Now
        </button>
      </div>
    </div>
  );
}
