// DonationView.tsx — FULL LIVE MULTILANGUAGE + MATCHED DESIGN + DEBUG LOGS (ESLINT SAFE)

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import i18n from "../i18n";

/* ---------------------------- INTERFACE ----------------------------- */
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

/* -------------------------------------------------------------------
   SECTION COMPONENT
-------------------------------------------------------------------- */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[18px] text-orange-700 font-semibold mb-2">
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

/* -------------------------------------------------------------------
   MAIN DONATION VIEW
-------------------------------------------------------------------- */
export default function DonationView() {
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_API_URL;

  /* LIVE LANGUAGE UPDATE */
  const [lang, setLang] = useState(i18n.language);
  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  /* USER INPUTS */
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [error, setError] = useState("");

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

  /* FETCH DONATION */
  useEffect(() => {
    axios
      .get(`${backendURL}/api/donations/${id}`)
      .then((res) => setDonation(res.data))
      .catch(() => setDonation(null))
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  if (loading)
    return (
      <div className="pt-24 text-center">
        {t({ en: "Loading…", hi: "लोड हो रहा है…", mr: "लोड होत आहे…" })}
      </div>
    );

  if (!donation)
    return (
      <div className="pt-24 text-center">
        {t({
          en: "Donation not found",
          hi: "दान नहीं मिला",
          mr: "दान सापडले नाही",
        })}
      </div>
    );

  const suggestedAmounts = [51, 101, 501, 1001];

  /* -------------------------------------------------------------------
       DONATION HANDLER (PHONEPE) — DEBUG ENABLED
  -------------------------------------------------------------------- */
  const handleDonate = async () => {
    setError("");

    if (!fullName.trim())
      return setError(
        t({
          en: "Please enter your full name.",
          hi: "कृपया पूरा नाम दर्ज करें।",
          mr: "कृपया पूर्ण नाव भरा.",
        })
      );

    if (!mobile.trim())
      return setError(
        t({
          en: "Please enter your mobile number.",
          hi: "कृपया मोबाइल नंबर दर्ज करें।",
          mr: "कृपया मोबाईल नंबर भरा.",
        })
      );

    if (!amount || Number(amount) < 1)
      return setError(
        t({
          en: "Enter a valid donation amount.",
          hi: "मान्य दान राशि दर्ज करें।",
          mr: "वैध देणगी रक्कम भरा.",
        })
      );

    try {
      console.log("========== DONATION PAYMENT START ==========");
      console.log("Backend URL:", backendURL);
      console.log("Donation ID:", donation._id);
      console.log(
        "Mobile (masked):",
        mobile.replace(/\d(?=\d{4})/g, "*")
      );
      console.log("Amount:", amount);

      const response = await axios.post(
        `${backendURL}/api/payments/create-phonepe-payment`,
        {
          donationId: donation._id,
          fullName,
          mobile,
          amount,
        }
      );

      console.log("Backend Response:", response.data);
      console.log("===========================================");

      if (response.data?.success && response.data?.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        setError(
          t({
            en: "Payment failed.",
            hi: "भुगतान असफल हुआ।",
            mr: "पेमेंट अयशस्वी झाले.",
          })
        );
      }
    } catch (err: unknown) {
      let message = "Unknown error";

      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ error?: string }>;
        message =
          axiosErr.response?.data?.error ||
          axiosErr.message ||
          "Axios error";
        console.error("Axios Error:", axiosErr.response?.data || axiosErr);
      } else if (err instanceof Error) {
        message = err.message;
        console.error("JS Error:", err);
      }

      setError(
        t({
          en: "Payment failed. Please try again.",
          hi: "भुगतान असफल। पुनः प्रयास करें।",
          mr: "पेमेंट अयशस्वी. पुन्हा प्रयत्न करा.",
        })
      );

      console.error("Final Error Message:", message);
    }
  };

 

  /* -------------------------------------------------------------------
       UI
  -------------------------------------------------------------------- */
  return (
    <div className="pt-24 pb-20 bg-gradient-to-b from-[#fff4d9] via-[#fff9f1] to-white min-h-screen px-6">
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

        <p
          className="text-gray-600 text-lg"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          {t(donation.address)}
        </p>

        <p
          className="mt-4 text-gray-700 italic text-xl"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          {t(donation.shortDetails)}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT SIDE */}
        <div className="space-y-10 lg:sticky lg:top-24 self-start">
          <div className={`rounded-3xl bg-white overflow-hidden p-4 ${glow}`}>
            <div className="h-[260px] md:h-[300px] lg:h-[330px] rounded-2xl overflow-hidden bg-[#fff6e9]">
              <img
                src={donation.thumbnail}
                alt={t(donation.donationName)}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className={`p-8 rounded-3xl bg-white ${glow}`}>
            <h3
              className="text-[20px] text-orange-700 font-semibold mb-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {t({ en: "Make Donation", hi: "दान करें", mr: "देणगी द्या" })}
            </h3>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t({
                en: "Full Name",
                hi: "पूरा नाम",
                mr: "पूर्ण नाव",
              })}
              className="w-full border p-3 rounded-xl mb-4"
            />

            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={t({
                en: "Mobile / WhatsApp Number",
                hi: "मोबाइल / व्हाट्सऐप नंबर",
                mr: "मोबाईल / व्हॉट्सअ‍ॅप नंबर",
              })}
              className="w-full border p-3 rounded-xl mb-4"
            />

            <div className="flex flex-wrap gap-3 mb-4">
              {suggestedAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`px-5 py-2 rounded-full border font-semibold ${
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
              placeholder={t({
                en: "Enter custom amount",
                hi: "राशि दर्ज करें",
                mr: "रक्कम भरा",
              })}
              className="w-full border p-3 rounded-xl mb-6"
            />

            <button
              onClick={handleDonate}
              className="w-full bg-orange-700 hover:bg-orange-800 text-white text-lg font-semibold py-3 rounded-xl"
            >
              {t({ en: "Donate Now", hi: "अभी दान करें", mr: "आत्ताच देणगी द्या" })}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-10">
          <Section title={t({ en: "About Chadhava", hi: "चढ़ावे के बारे में", mr: "चढाव्याबद्दल" })}>
            {t(donation.description)}
          </Section>

          <Section title={t({ en: "Temple Details", hi: "मंदिर विवरण", mr: "मंदिर माहिती" })}>
            {t(donation.templeDetails)}
          </Section>

          <Section title={t({ en: "Benefits", hi: "लाभ", mr: "फायदे" })}>
            {t(donation.benefits)}
          </Section>

          <Section title={t({ en: "Summary", hi: "सारांश", mr: "सारांश" })}>
            {t(donation.summary)}
          </Section>
        </div>
      </div>
    </div>
  );
}
