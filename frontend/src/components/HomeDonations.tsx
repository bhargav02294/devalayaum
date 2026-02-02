// src/components/HomeDonations.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import i18n from "../i18n";

interface Donation {
  _id: string;
  thumbnail: string;
  templeName: Record<string, string>;
  shortDetails: Record<string, string>;
  donationName: Record<string, string>;
  published: boolean;
}

export default function HomeDonations() {
  const backendURL = import.meta.env.VITE_API_URL;

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(i18n.language || "en");

  useEffect(() => {
    const handler = () => setLang(i18n.language);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  useEffect(() => {
    axios
      .get(`${backendURL}/api/donations/home-list`)
      .then((res) => setDonations(res.data))
      .catch((err) => console.error("Donation fetch error:", err))
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading) {
    return (
      <p className="text-center text-gray-600 py-10">
        Loading verified Hindu temple donation campaigns…
      </p>
    );
  }

  if (donations.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No active Hindu temple donation campaigns available.
      </p>
    );
  }

  const text = {
    heading: {
      en: "Donate to Sacred Temples & Spiritual Causes",
      hi: "पवित्र मंदिरों और आध्यात्मिक कार्यों के लिए दान करें",
      mr: "पवित्र मंदिरे आणि आध्यात्मिक कार्यांसाठी दान करा",
      ta: "புனித கோவில்கள் மற்றும் ஆன்மீக காரணிகளுக்கு நன்கொடை அளிக்கவும்",
      te: "పవిత్ర ఆలయాలు మరియు ఆధ్యాత్మిక కార్యక్రమాలకు దానం చేయండి",
      bn: "পবিত্র মন্দির ও আধ্যাত্মিক কার্যক্রমে দান করুন",
    },
    subHeading: {
      en: "Support verified Hindu temple trusts, rituals, annadanam and spiritual welfare services through secure online Chadhava and donations.",
      hi: "सत्यापित हिंदू मंदिर ट्रस्ट, पूजा, अन्नदान और आध्यात्मिक सेवा कार्यों के लिए सुरक्षित ऑनलाइन चढ़ावा दें।",
      mr: "प्रमाणित हिंदू मंदिर ट्रस्ट, पूजा, अन्नदान आणि आध्यात्मिक सेवा कार्यांसाठी सुरक्षित ऑनलाइन चढावा द्या.",
      ta: "சரிபார்க்கப்பட்ட இந்து கோவில் அறக்கட்டளைகள் மற்றும் ஆன்மீக சேவைகளுக்கு ஆதரவு அளிக்கவும்.",
      te: "నిర్ధారిత హిందూ ఆలయ ట్రస్టులు మరియు ఆధ్యాత్మిక సేవలకు మద్దతు ఇవ్వండి.",
      bn: "যাচাইকৃত হিন্দু মন্দির ট্রাস্ট ও আধ্যাত্মিক সেবায় সহায়তা করুন।",
    },
    verified: {
      en: "Verified Temple Trust",
      hi: "सत्यापित मंदिर ट्रस्ट",
      mr: "प्रमाणित मंदिर ट्रस्ट",
      ta: "சரிபார்க்கப்பட்ட கோவில் அறக்கட்டளை",
      te: "నిర్ధారిత దేవాలయ ట్రస్ట్",
      bn: "যাচাইকৃত মন্দির ট্রাস্ট",
    },
    donateNow: {
      en: "Proceed to Donate",
      hi: "दान के लिए आगे बढ़ें",
      mr: "दानासाठी पुढे जा",
      ta: "நன்கொடைக்கு தொடரவும்",
      te: "దానం కొనసాగించండి",
      bn: "দান করতে এগিয়ে যান",
    },
    viewAll: {
      en: "View All Temple Chadhava Donations",
      hi: "सभी चढ़ावा दान देखें",
      mr: "सर्व चढावा दान पहा",
      ta: "அனைத்து கோவில் நன்கொடைகளையும் பார்க்கவும்",
      te: "అన్ని చడావా దానాలను చూడండి",
      bn: "সব চড়াভা দান দেখুন",
    },
  };

  const t = (obj: Record<string, string>) => obj[lang] ?? obj.en;

  return (
    <section
      className="py-20 bg-gradient-to-b from-orange-50 to-white"
      aria-label="Online Hindu temple donations, Chadhava and spiritual support"
    >
      <header className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-[#b35b00] drop-shadow-md">
          {t(text.heading)}
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-3xl mx-auto">
          {t(text.subHeading)}
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
        {donations.slice(0, 3).map((d) => {
          const donationTitle =
            d.donationName?.[lang] || d.donationName?.en || "";
          const temple =
            d.templeName?.[lang] || d.templeName?.en || "";
          const short =
            d.shortDetails?.[lang]?.slice(0, 120) ||
            d.shortDetails?.en?.slice(0, 120) ||
            "";

          return (
            <article key={d._id}>
              <div
                className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100
                           hover:shadow-[0_10px_40px_rgba(179,91,0,0.35)]
                           hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={d.thumbnail}
                    alt={`${donationTitle} online temple donation for ${temple}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                    loading="lazy"
                  />

                  <div className="absolute top-4 left-4 bg-[#006b3c] text-white text-xs px-3 py-1 rounded-full shadow-md tracking-wide">
                    {t(text.verified)}
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-[#b35b00] font-semibold text-sm mb-1">
                    {temple}
                  </p>

                  <h3 className="text-xl font-bold text-[#8a4600] mb-2 leading-snug">
                    {donationTitle}
                  </h3>

                  <p className="text-gray-700 text-sm leading-relaxed mb-6">
                    {short}…
                  </p>

                  <Link
                    to={`/donations/${d._id}`}
                    title={`Donate online to ${donationTitle} at ${temple}`}
                    aria-label={`Donate to ${donationTitle} temple campaign`}
                    className="block text-center w-full bg-[#b35b00] hover:bg-[#8a4600]
                               text-white font-medium py-2 rounded-lg shadow-md transition duration-300"
                  >
                    {t(text.donateNow)}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="text-center mt-16">
        <Link
          to="/donations"
          title="Browse all online temple donation and Chadhava campaigns"
          aria-label="View all temple donation campaigns"
          className="inline-block px-8 py-3 border border-[#b35b00] rounded-full
                     text-[#b35b00] font-medium text-sm
                     transition-all duration-500
                     hover:bg-[#b35b00] hover:text-white shadow-sm"
        >
          {t(text.viewAll)}
        </Link>
      </div>
    </section>
  );
}
