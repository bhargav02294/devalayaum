// src/pages/DonationView.tsx
// FINAL PROFESSIONAL DONATION PAGE — Sticky Left Column + Fixed Image + Temple Fonts

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Load Razorpay script (safe)
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

// Razorpay typings
declare global {
  interface RazorpayInstance {
    open: () => void;
  }

  interface Window {
    Razorpay: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

/* -------------------------------------------------------
   INTERFACES
------------------------------------------------------- */
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

/* -------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------- */
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

  /* Load Merriweather Font */
  useEffect(() => {
    const href =
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap";
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  /* Fetch Donation */
  useEffect(() => {
    axios
      .get(`${backendURL}/api/donations/${id}`)
      .then((res) => setDonation(res.data))
      .catch(() => setDonation(null))
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!donation) return <div className="pt-24 text-center"> not found.</div>;

  const suggestedAmounts = [51, 101, 501, 1001];

  /* -------------------------------------------------------
     HANDLE DONATION
  ------------------------------------------------------- */
  const handleDonate = async () => {
    setError("");

    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!mobile.trim()) return setError("Please enter your mobile number.");
    if (!amount || Number(amount) < 1)
      return setError("Please enter a valid donation amount.");

    const loaded = await loadRazorpayScript();
    if (!loaded) return setError("Failed to load payment gateway.");

    try {
      // Create Order
      const response = await axios.post(`${backendURL}/api/payments/create-order`, {
        donationId: donation._id,
        fullName,
        mobile,
        amount,
      });

      const data = response.data as {
        orderId: string;
        amount: number;
        currency: string;
      };

      if (!data.orderId || !data.amount || !data.currency) {
        return setError("Invalid server response for payment.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Devalayaum",
        description: `Donation: ${t(donation.donationName)}`,
        order_id: data.orderId,

        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await axios.post(`${backendURL}/api/payments/verify`, {
              orderId: resp.razorpay_order_id,
              paymentId: resp.razorpay_payment_id,
              signature: resp.razorpay_signature,
              fullName,
              mobile,
              amount,
              templeName: t(donation.templeName),
              donationName: t(donation.donationName),
            });

            alert("🙏 Thank you! Your donation was successful.");
            window.location.href = "/donors";
          } catch {
            alert("Payment succeeded but verification failed.");
          }
        },

        prefill: { name: fullName, contact: mobile },
        theme: { color: "#b34a00" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch {
      setError("Payment failed. Please try again.");
    }
  };

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */
  return (
    <div className="pt-24 pb-20 bg-gradient-to-b from-[#fff4d9] via-[#fff9f1] to-white min-h-screen px-6">

      {/* -------------------------------- HEADER -------------------------------- */}
      <div className="max-w-6xl mx-auto mb-12 px-2">
        <h1 className="mt-4 text-2xl lg:text-3xl font-[Marcellus] text-orange-700 font-bold">
          {t(donation.donationName)}
        </h1>

        <p
          className="text-gray-700 text-lg mt-2"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          <span className="font-semibold text-orange-800">
            {t(donation.templeName)}
          </span>
        </p>

        <p className="text-gray-600 text-lg" style={{ fontFamily: "'Merriweather', serif" }}>
          {t(donation.address)}
        </p>

        <p
          className="mt-4 text-gray-700 italic text-xl"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          {t(donation.shortDetails)}
        </p>
      </div>

      {/* ---------------------- MAIN GRID (Sticky Left + Scroll Right) ---------------------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ---------------------- LEFT COLUMN (STICKY) ---------------------- */}
        <div className="space-y-10 lg:sticky lg:top-24 self-start">

          {/* IMAGE FIXED HEIGHT */}
          <div className={`rounded-3xl bg-white overflow-hidden p-4 ${glow}`}>
            <div className="h-[260px] md:h-[300px] lg:h-[330px] rounded-2xl overflow-hidden bg-[#fff6e9] flex items-center justify-center">
              <img
                src={donation.thumbnail}
                alt={t(donation.donationName)}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* MAKE A DONATION BOX */}
          <div className={`p-8 rounded-3xl bg-white ${glow}`}>
            <h3
              className="text-[20px] text-orange-700 font-semibold mb-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
             Make Donation
            </h3>

            {error && <p className="text-red-600 mb-4">{error}</p>}

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
            <div className="flex flex-wrap gap-3 mb-4">
              {suggestedAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`px-5 py-2 rounded-full border font-semibold
                    ${
                      amount === amt
                        ? "bg-orange-700 text-white border-orange-700"
                        : "bg-white text-orange-700 border-orange-700 hover:bg-orange-50"
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
              className="w-full bg-orange-700 hover:bg-orange-800 text-white text-lg font-semibold py-3 rounded-xl"
            >
              Donate Now
            </button>
          </div>

        </div>

        {/* ---------------------- RIGHT COLUMN (DETAILS) ---------------------- */}
        <div className="space-y-10">

          <Section title="About Chadhava">
            {t(donation.description)}
          </Section>

          <Section title="Temple Details">
            {t(donation.templeDetails)}
          </Section>

          <Section title="Benefits ">
            {t(donation.benefits)}
          </Section>

          <Section title="Summary">
            {t(donation.summary)}
          </Section>

        </div>

      </div>
    </div>
  );
}

/* -------------------------------------------------------
   SECTION COMPONENT — SMALL + MERRIWEATHER
------------------------------------------------------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-[18px] text-orange-700 font-semibold mb-2"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        {title}
      </h2>

      <p
        className="text-gray-700 leading-relaxed"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        {children}
      </p>
    </section>
  );
}
