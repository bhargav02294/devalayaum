// src/pages/DonationView.tsx
// FINAL PREMIUM DONATION PAGE — Matching Temple Fonts & Darker Theme
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

/* ----------------------------------------------------------
   Load Razorpay Script
---------------------------------------------------------- */
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

/* Razorpay Types */
declare global {
  interface RazorpayInstance {
    open: () => void;
  }

  interface Window {
    Razorpay: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

/* ----------------------------------------------------------
   Types
---------------------------------------------------------- */
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

type CreateOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
};

type RazorpayHandlerResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type AnyRecord = Record<string, unknown>;

/* ----------------------------------------------------------
   Main Component
---------------------------------------------------------- */
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

  // Darker glow than puja page
  const glow = "shadow-[0_6px_25px_rgba(110,60,20,0.22)]";

  /* Load Merriweather font */
  useEffect(() => {
    const href =
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap";
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  /* Fetch Donation Data */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/donations/${id}`);
        setDonation(res.data);
      } catch {
        setDonation(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, backendURL]);

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!donation) return <div className="pt-24 text-center">Donation not found.</div>;

  const suggestedAmounts = [51, 101, 501, 1001];

  /* ----------------------------------------------------------
     Handle Payment (typed)
  ---------------------------------------------------------- */
  const handleDonate = async () => {
    setError("");

    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!mobile.trim()) return setError("Please enter your mobile number.");
    if (!amount || Number(amount) < 1) return setError("Please enter a valid donation amount.");

    const loaded = await loadRazorpayScript();
    if (!loaded) return setError("Failed to load Razorpay.");

    try {
      // Create order on server. Expect CreateOrderResponse
      const create = await axios.post<CreateOrderResponse>(`${backendURL}/api/payments/create-order`, {
        donationId: donation._id,
        fullName,
        mobile,
        amount,
      });

      const data = create.data;

      // Validate server response
      if (!data || !data.orderId || !data.amount || !data.currency) {
        return setError("Server returned invalid order data.");
      }

      const options: AnyRecord = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Devalayaum",
        description: `Donation: ${t(donation.donationName)}`,
        order_id: data.orderId,

        // typed handler
        handler: async (resp: RazorpayHandlerResponse) => {
          const rOrderId = resp.razorpay_order_id;
          const rPaymentId = resp.razorpay_payment_id;
          const rSignature = resp.razorpay_signature;

          // Verify payment on server
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
            alert("Payment succeeded but verification failed. Please contact support.");
          }
        },

        prefill: { name: fullName, contact: mobile },
        theme: { color: "#8a3c0f" },
      };

      // Open Razorpay
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - window.Razorpay constructor signature handled via global declaration above
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Try again.");
    }
  };

  /* ----------------------------------------------------------
     UI
  ---------------------------------------------------------- */
  return (
    <div
      className="pt-24 pb-20 min-h-screen"
      style={{ background: "linear-gradient(to bottom, #fff4d9, #fffaf2, #ffffff)" }}
    >
      {/* ---------------------------------- */}
      {/* PAGE HEADER */}
      {/* ---------------------------------- */}
      <div className="max-w-6xl mx-auto mb-10 px-4">
        <h1 className="text-2xl lg:text-3xl font-[Marcellus] text-orange-700 font-bold">
          {t(donation.donationName)}
        </h1>

        <p
          className="text-gray-800 text-lg mt-2"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          <span className="font-semibold text-orange-800">
            {t(donation.templeName)}
          </span>
        </p>

        <p
          className="text-gray-700 text-lg"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          {t(donation.address)}
        </p>

        <p
          className="mt-4 text-gray-800 italic text-xl"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          {t(donation.shortDetails)}
        </p>
      </div>

      {/* ---------------------------------- */}
      {/* IMAGE + DETAILS */}
      {/* ---------------------------------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
        {/* IMAGE */}
        <div className={`rounded-3xl bg-white overflow-hidden p-4 ${glow}`}>
          <img
            src={donation.thumbnail}
            alt={t(donation.donationName)}
            className="w-full h-[360px] object-cover rounded-2xl"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-8">
          <Section title="About This Donation">{t(donation.description)}</Section>
          <Section title="Temple Details">{t(donation.templeDetails)}</Section>
          <Section title="Benefits of Donating">{t(donation.benefits)}</Section>
          <Section title="Summary">{t(donation.summary)}</Section>
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* DONATION FORM */}
      {/* ---------------------------------- */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <div className={`md:w-1/2 p-8 rounded-3xl bg-white ${glow}`}>
          <h3
            className="text-2xl text-orange-800 font-semibold mb-6"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Make a Donation
          </h3>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="w-full border p-3 rounded-xl mb-4"
            style={{ fontFamily: "'Merriweather', serif" }}
          />

          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile / WhatsApp Number"
            className="w-full border p-3 rounded-xl mb-4"
            style={{ fontFamily: "'Merriweather', serif" }}
          />

          {/* SUGGESTED AMOUNTS */}
          <div className="flex flex-wrap gap-3 mb-4">
            {suggestedAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`px-5 py-2 rounded-full font-semibold border
                  ${
                    amount === amt
                      ? "bg-[#8a3c0f] text-white border-[#8a3c0f]"
                      : "bg-white text-[#8a3c0f] border-[#8a3c0f] hover:bg-[#fff1e8]"
                  }
                `}
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          {/* CUSTOM AMOUNT */}
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter custom amount"
            className="w-full border p-3 rounded-xl mb-6"
            style={{ fontFamily: "'Merriweather', serif" }}
          />

          {/* DONATE BUTTON */}
          <button
            onClick={handleDonate}
            className="w-full bg-[#8a3c0f] hover:bg-[#5e290d] text-white text-lg font-semibold py-3 rounded-xl"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------
   Section Component (Temple Style)
---------------------------------------------------------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-2xl text-orange-800 font-semibold mb-2"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        {title}
      </h2>

      <p className="text-gray-700 leading-relaxed" style={{ fontFamily: "'Merriweather', serif" }}>
        {children}
      </p>
    </section>
  );
}
