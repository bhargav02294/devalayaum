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

  // 🔥 Re-render immediately when language changes
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

  if (loading)
    return (
      <p className="text-center text-gray-600 py-10">
        Loading donation causes...
      </p>
    );

  if (donations.length === 0)
    return (
      <p className="text-center text-gray-500 py-10">
        No donation campaigns available.
      </p>
    );

  // 🌍 Multilanguage labels
  const text = {
    heading: {
      en: "Support Sacred Causes",
      hi: "पवित्र कार्यों का समर्थन करें",
      mr: "पवित्र कार्यांना समर्थन द्या",
      ta: "புனித காரணிகளை ஆதரிக்கவும்",
      te: "పవిత్ర కార్యక్రమాలను మద్దతుపరచండి",
      bn: "পবিত্র কার্যসমূহকে সমর্থন করুন",
    },
    subHeading: {
      en: "Contribute to divine temple initiatives and spiritual welfare",
      hi: "दिव्य मंदिर पहल और आध्यात्मिक कल्याण में योगदान दें",
      mr: "दैवी मंदिर उपक्रम आणि आध्यात्मिक कल्याणासाठी योगदान द्या",
      ta: "தெய்வீக கோவில் முயற்சிகளுக்கும் ஆன்மீக நலத்திற்கும் பங்களிக்கவும்",
      te: "దైవాలయ కార్యక్రమాలకు మరియు ఆధ్యాత్మిక సంక్షేమానికి సహకరించండి",
      bn: "দেবালয় উদ্যোগ ও আধ্যাত্মিক কল্যাণে অবদান রাখুন",
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
      en: "Donate Now",
      hi: "अभी दान करें",
      mr: "आता दान करा",
      ta: "இப்போது நன்கொடையளிக்கவும்",
      te: "ఇప్పుడే దానం చేయండి",
      bn: "এখনই দান করুন",
    },
    viewAll: {
      en: "View All Donations",
      hi: "सभी दान देखें",
      mr: "सर्व दान पहा",
      ta: "அனைத்து நன்கொடைகளையும் பார்க்கவும்",
      te: "అన్ని దానాలను చూడండి",
      bn: "সব দান দেখুন",
    },
  };

  const t = (obj: Record<string, string>) => obj[lang] ?? obj["en"];

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-[#b35b00] drop-shadow-md">
          {t(text.heading)}
        </h2>
        <p className="mt-3 text-gray-600 text-lg">{t(text.subHeading)}</p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
        {donations.slice(0, 3).map((d) => {
          const donationTitle =
            d.donationName?.[lang] || d.donationName?.en || "";
          const temple = d.templeName?.[lang] || d.templeName?.en || "";
          const short =
            d.shortDetails?.[lang]?.slice(0, 120) ||
            d.shortDetails?.en?.slice(0, 120) ||
            "";

          return (
            <div
              key={d._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-[0_10px_40px_rgba(179,91,0,0.35)] hover:-translate-y-2 transition-all duration-500"
            >
              {/* Thumbnail */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={d.thumbnail}
                  alt={donationTitle}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                />

                <div className="absolute top-4 left-4 bg-[#006b3c] text-white text-xs px-3 py-1 rounded-full shadow-md tracking-wide">
                  {t(text.verified)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-[#b35b00] font-semibold text-sm mb-1">
                  {temple}
                </p>

                <h3 className="text-xl font-bold text-[#8a4600] mb-2 leading-snug">
                  {donationTitle}
                </h3>

                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  {short}...
                </p>

                <Link
                  to={`/donations/${d._id}`}
                  className="block text-center w-full bg-[#b35b00] hover:bg-[#8a4600] text-white font-medium py-2 rounded-lg shadow-md transition duration-300"
                >
                  {t(text.donateNow)}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center mt-16">
        <Link
          to="/donations"
          className="relative inline-block group px-6 py-2 border border-[#b35b00] rounded-full text-[#b35b00] font-medium text-sm overflow-hidden transition-all duration-500 shadow-sm"
        >
          <span className="absolute left-0 top-0 h-full w-0 bg-[#b35b00] transition-all duration-700 group-hover:w-full"></span>

          <span className="relative z-10 group-hover:text-white transition duration-500">
            {t(text.viewAll)}
          </span>
        </Link>
      </div>
    </section>
  );
}
