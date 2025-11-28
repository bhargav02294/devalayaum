import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import i18n from "../i18n";

interface Puja {
  _id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  price?: number;
  image?: string[];
}

export default function HomePujas() {
  const backendURL = import.meta.env.VITE_API_URL;

  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);

  const [lang, setLang] = useState(i18n.language || "en");

  // 🔥 Re-render instantly when language changes
  useEffect(() => {
    const handler = () => setLang(i18n.language);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  useEffect(() => {
    axios
      .get(`${backendURL}/api/pujas/home-list`)
      .then((res) => setPujas(res.data))
      .catch((err) => console.error("Failed to load pujas:", err))
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading)
    return <p className="text-center text-gray-600 py-10">Loading pujas...</p>;

  if (pujas.length === 0)
    return <p className="text-center text-gray-500 py-10">No Pujas Available</p>;

  // 🌍 Multilanguage text
  const text = {
    heading: {
      en: "Popular Pujas",
      hi: "लोकप्रिय पूजा",
      mr: "लोकप्रिय पूजा",
      ta: "பிரபல பூஜைகள்",
      te: "ప్రసిద్ధ పూజలు",
      bn: "জনপ্রিয় পূজা",
    },
    subHeading: {
      en: "Experience spiritually uplifting pujas performed with devotion",
      hi: "भक्ति के साथ की गई आध्यात्मिक रूप से ऊँची उठाने वाली पूजा",
      mr: "भक्तीपूर्वक केलेल्या आध्यात्मिक उन्नती करणाऱ्या पूजा",
      ta: "பக்தியுடன் நடத்தப்படும் ஆன்மீக உயர்வு தரும் பூஜைகள்",
      te: "భక్తితో నిర్వహించే ఆధ్యాత్మికంగా ఉన్నతమైన పూజలను అనుభవించండి",
      bn: "ভক্তিভরে সম্পাদিত আধ্যাত্মিকভাবে উজ্জীবিত পূজা",
    },
    bookNow: {
      en: "Book Now",
      hi: "अभी बुक करें",
      mr: "आत्ताच बुक करा",
      ta: "இப்போது பதிவு செய்யவும்",
      te: "ఇప్పుడే బుక్ చేయండి",
      bn: "এখনই বুক করুন",
    },
    viewAll: {
      en: "View All Pujas",
      hi: "सभी पूजा देखें",
      mr: "सर्व पूजा पहा",
      ta: "அனைத்து பூஜைகளையும் பார்க்க",
      te: "అన్ని పూజలను చూడండి",
      bn: "সব পূজা দেখুন",
    },
  };

  const t = (obj: Record<string, string>) => obj[lang] ?? obj["en"];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-orange-50">

      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-[#b35b00] drop-shadow-md">
          {t(text.heading)}
        </h2>
        <p className="mt-3 text-gray-600 text-lg">{t(text.subHeading)}</p>
      </div>

      {/* PUJA Cards (3 only) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        {pujas.slice(0, 3).map((puja) => {
          const name = puja.name?.[lang] || puja.name?.en || "";
          const desc =
            puja.description?.[lang]?.substring(0, 120) ||
            puja.description?.en?.substring(0, 120) ||
            "";

          return (
            <div
              key={puja._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-[0_10px_30px_rgba(179,91,0,0.3)] transition-all duration-500"
            >


              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                {puja.image?.[0] ? (
                  <img
                    src={puja.image[0]}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                  />
                ) : (
                  <div className="h-72 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}


                

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>

                {/* Puja Name */}
                <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold drop-shadow-lg">
                  {name}
                </h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  {desc}...
                </p>

                {/* Book Now */}
                <Link
                  to={`/pujas/${puja._id}`}
                  className="block w-full text-center bg-[#b35b00] hover:bg-[#8f4500] text-white py-2 rounded-lg text-base shadow-md transition"
                >
                  {t(text.bookNow)}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW ALL */}
      <div className="text-center mt-14">
        <Link
          to="/pujas"
          className="relative inline-block group px-5 py-2 border border-[#b35b00] rounded-full text-[#b35b00] font-semibold text-sm overflow-hidden transition-all duration-500"
        >
          <span className="absolute left-0 top-0 w-0 h-full bg-[#b35b00] transition-all duration-700 group-hover:w-full"></span>

          <span className="relative z-10 group-hover:text-white transition-all duration-500">
            {t(text.viewAll)}
          </span>
        </Link>
      </div>
    </section>
  );
}
