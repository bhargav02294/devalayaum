// E:\devalayaum\frontend\src\pages\DonationView.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Razorpay loader
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
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
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    contact?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
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

  const backendURL = import.meta.env.VITE_API_URL; // ✅ FIXED
  const lang = i18n.language || "en";

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/donations/${id}`);
        setDonation(res.data);
      } catch (err) {
        console.error("Error fetching donation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [id, backendURL]);

  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  if (loading) return <p className="text-center mt-10">Loading Donation...</p>;
  if (!donation) return <p className="text-center mt-10">Donation not found.</p>;

  const suggestedAmounts = [51, 101, 501, 1001];

  const handleDonate = async () => {
    setError("");

    if (!fullName.trim()) return setError("Please enter your full name");
    if (!mobile.trim()) return setError("Please enter your mobile/WhatsApp number");
    if (!amount || Number(amount) < 1)
      return setError("Please enter a valid amount (minimum ₹1)");

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

      const { orderId, amount: orderAmount, currency } = createRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency,
        name: "Devalayaum",
        description: `Donation: ${t(donation.donationName)}`,
        order_id: orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await axios.post(`${backendURL}/api/payments/verify`, {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              fullName,
              mobile,
              amount,
              templeName: t(donation.templeName),
              donationName: t(donation.donationName),
            });

            alert("🙏 Thank you! Your donation was successful.");
            window.location.href = "/donors";
          } catch (verifyErr) {
            console.error("Verification failed:", verifyErr);
            alert("Payment succeeded but verification failed.");
          }
        },
        prefill: {
          name: fullName,
          contact: mobile,
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error during payment:", err);
      setError("Payment initialization failed.");
    }
  };

  return (
    <div className="pt-24 pb-20 px-6 md:px-20 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src={donation.thumbnail}
            alt={t(donation.donationName)}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-orange-700 mb-2">
            {t(donation.donationName)}
          </h1>

          <p className="text-gray-700 mb-1">
            Temple: <span className="font-semibold">{t(donation.templeName)}</span>
          </p>

          <p className="text-gray-700 mb-3">Address: {t(donation.address)}</p>

          <p className="text-gray-600 italic mb-4">{t(donation.shortDetails)}</p>

          {/* Form */}
          <div className="mt-8 bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold text-orange-700 mb-4">
              Make a Donation
            </h3>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {/* Name */}
            <input
              type="text"
              className="w-full border p-2 rounded mb-3"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            {/* Mobile */}
            <input
              type="text"
              className="w-full border p-2 rounded mb-3"
              placeholder="Mobile / WhatsApp Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            {/* Suggestion buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`px-4 py-2 rounded-lg border font-semibold ${
                    amount === amt
                      ? "bg-orange-600 text-white border-orange-600"
                      : "bg-white text-gray-800 hover:bg-orange-50"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <input
              type="number"
              min={1}
              className="w-full border p-2 rounded mb-4"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <button
              onClick={handleDonate}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg w-full font-semibold"
            >
              Donate Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
