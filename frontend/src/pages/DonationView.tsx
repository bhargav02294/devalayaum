// E:\devalayaum\frontend\src\pages\DonationView.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Razorpay loader
const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// Minimal, safe types for Razorpay (no `any`)
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

  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [error, setError] = useState("");

  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/donations/${id}`);
        setDonation(res.data);
      } catch (err) {
        // safe logging for unknown errors
        if (err instanceof Error) console.error("Error fetching donation:", err.message);
        else console.error("Error fetching donation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [id, backendURL]);

  if (loading) return <p className="text-center mt-10">Loading Donation...</p>;
  if (!donation) return <p className="text-center mt-10">Donation not found.</p>;

  const suggestedAmounts = [51, 101, 501, 1001];
  const glow = "shadow-[0_10px_30px_rgba(140,85,40,0.15)] shadow-orange-200/40";

  const handleDonate = async () => {
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!mobile.trim()) {
      setError("Please enter your mobile/WhatsApp number");
      return;
    }
    if (!amount || Number(amount) < 1) {
      setError("Please enter a valid amount (minimum ₹1)");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Failed to load Razorpay. Check internet connection.");
      return;
    }

    try {
      const createRes = await axios.post(`${backendURL}/api/payments/create-order`, {
        donationId: donation._id,
        fullName,
        mobile,
        amount,
      });

      // safely extract expected properties
      const orderId = (createRes.data && (createRes.data as Record<string, unknown>).orderId) as string | undefined;
      const orderAmount = (createRes.data && (createRes.data as Record<string, unknown>).amount) as number | undefined;
      const currency = (createRes.data && (createRes.data as Record<string, unknown>).currency) as string | undefined;

      if (!orderId || !orderAmount || !currency) {
        setError("Payment initialization failed (invalid server response).");
        console.error("Invalid create-order response:", createRes.data);
        return;
      }

      // build options as a plain Record<string, unknown>
      const options: Record<string, unknown> = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency,
        name: "Devalayaum",
        description: `Donation: ${t(donation.donationName)}`,
        order_id: orderId,
        handler: (response: Record<string, unknown>) => {
          // narrow the handler response safely before using
          const rpOrderId = typeof response?.razorpay_order_id === "string" ? response.razorpay_order_id : undefined;
          const rpPaymentId = typeof response?.razorpay_payment_id === "string" ? response.razorpay_payment_id : undefined;
          const rpSignature = typeof response?.razorpay_signature === "string" ? response.razorpay_signature : undefined;

          if (!rpOrderId || !rpPaymentId || !rpSignature) {
            // something unexpected from Razorpay
            console.error("Unexpected Razorpay response:", response);
            alert("Payment processed but response was unexpected. Please contact support.");
            return;
          }

          // verify with backend
          (async () => {
            try {
              await axios.post(`${backendURL}/api/payments/verify`, {
                orderId: rpOrderId,
                paymentId: rpPaymentId,
                signature: rpSignature,
                fullName,
                mobile,
                amount,
                templeName: t(donation.templeName),
                donationName: t(donation.donationName),
              });

              alert("🙏 Thank you! Your donation was successful.");
              window.location.href = "/donors";
            } catch (verifyErr) {
              if (verifyErr instanceof Error) console.error("Verification failed:", verifyErr.message);
              else console.error("Verification failed:", verifyErr);
              alert("Payment succeeded but verification failed.");
            }
          })();
        },
        prefill: {
          name: fullName,
          contact: mobile,
        },
        theme: { color: "#b34a00" },
      };

      // instantiate Razorpay (window.Razorpay typed above) and open
      // using the runtime constructor signature we declared
      // TypeScript knows window.Razorpay exists because of our global declaration
      // (may still be undefined at runtime if the script failed; we checked earlier)
      // cast is safe here because the constructor expects Record<string, unknown>
      // (no use of `any` anywhere)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - runtime constructor from Razorpay script
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error during payment:", err.message);
      } else {
        console.error("Error during payment:", err);
      }
      setError("Payment initialization failed.");
    }
  };

  return (
    <div className="pt-24 pb-20 px-6 md:px-20 bg-gradient-to-b from-[#fff5dd] via-[#fffaf2] to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-[Marcellus] text-[#b34a00] font-bold leading-tight">
            {t(donation.donationName)}
          </h1>
          <p className="text-gray-700 text-lg mt-2 font-[Poppins]">
            <span className="font-semibold text-orange-900">{t(donation.templeName)}</span>
          </p>
          <p className="text-gray-600 mt-1">{t(donation.address)}</p>
          <p className="mt-4 text-gray-700 italic text-[17px]">{t(donation.shortDetails)}</p>
        </div>

        {/* Centered Image */}
        <div className="flex justify-center">
          <div className={`rounded-3xl bg-white overflow-hidden ${glow} p-4 max-w-3xl w-full`}>
            <img
              src={donation.thumbnail}
              alt={t(donation.donationName)}
              className="w-full h-[360px] object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Details */}
        <div className="mt-10 space-y-10 max-w-3xl mx-auto">
          <section>
            <h2 className="text-3xl font-[Merriweather] text-[#8a3c0f] mb-3">About This Donation</h2>
            <p className="text-gray-700 leading-relaxed">{t(donation.description)}</p>
          </section>

          <section>
            <h2 className="text-3xl font-[Merriweather] text-[#8a3c0f] mb-3">Temple Details</h2>
            <p className="text-gray-700 leading-relaxed">{t(donation.templeDetails)}</p>
          </section>

          <section>
            <h2 className="text-3xl font-[Merriweather] text-[#8a3c0f] mb-3">Benefits of Donating</h2>
            <p className="text-gray-700 leading-relaxed">{t(donation.benefits)}</p>
          </section>

          <section>
            <h2 className="text-3xl font-[Merriweather] text-[#8a3c0f] mb-3">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{t(donation.summary)}</p>
          </section>
        </div>

        {/* Donation Form at Bottom */}
        <div className={`mt-12 p-8 rounded-3xl bg-white ${glow} max-w-3xl mx-auto`}>
          <h3 className="text-2xl font-[Merriweather] text-[#8a3c0f] mb-6 text-center">Make a Donation</h3>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <input
            type="text"
            className="w-full border p-3 rounded-lg mb-4"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="text"
            className="w-full border p-3 rounded-lg mb-4"
            placeholder="Mobile / WhatsApp Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <div className="flex flex-wrap gap-3 mb-4 justify-center">
            {suggestedAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`px-5 py-2 rounded-full font-semibold border transition 
                  ${
                    amount === amt
                      ? "bg-[#b34a00] text-white border-[#b34a00]"
                      : "bg-white text-[#b34a00] border-[#b34a00] hover:bg-[#fff3e2]"
                  }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <input
            type="number"
            min={1}
            className="w-full border p-3 rounded-lg mb-6"
            placeholder="Enter custom amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <button
            onClick={handleDonate}
            className="w-full bg-[#b34a00] hover:bg-[#8a3c0f] text-white py-3 rounded-xl text-lg font-semibold transition"
          >
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
}
