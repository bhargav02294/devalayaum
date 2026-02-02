// src/components/HomePujas.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import i18n from "../i18n";

interface Puja {
  _id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  price?: number;
  images?: string[];
}

export default function HomePujas() {
  const backendURL = import.meta.env.VITE_API_URL;

  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(i18n.language || "en");

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

  if (loading) {
    return (
      <p className="text-center text-gray-600 py-10">
        Loading authentic Hindu puja services…
      </p>
    );
  }

  if (pujas.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No Hindu pujas available at the moment.
      </p>
    );
  }

  const text = {
    heading: {
      en: "Book Popular Hindu Pujas Online",
      hi: "लोकप्रिय हिंदू पूजा ऑनलाइन बुक करें",
      mr: "लोकप्रिय हिंदू पूजा ऑनलाइन बुक करा",
      ta: "பிரபல இந்து பூஜைகளை ஆன்லைனில் பதிவு செய்யுங்கள்",
      te: "ప్రసిద్ధ హిందూ పూజలను ఆన్‌లైన్‌లో బుక్ చేయండి",
      bn: "জনপ্রিয় হিন্দু পূজা অনলাইনে বুক করুন",
    },
    subHeading: {
      en: "Experience authentic Vedic pujas performed with devotion by experienced Hindu priests for peace, prosperity and spiritual wellbeing.",
      hi: "अनुभवी पुजारियों द्वारा भक्ति से की गई प्रामाणिक वैदिक पूजा का अनुभव करें।",
      mr: "अनुभवी पुजार्‍यांकडून भक्तीपूर्वक केल्या जाणाऱ्या वैदिक पूजांचा अनुभव घ्या.",
      ta: "அனுபவமுள்ள பூசாரிகளால் பக்தியுடன் நடத்தப்படும் வைதிக பூஜைகளை அனுபவிக்கவும்.",
      te: "అనుభవజ్ఞులైన పూజారులచే భక్తితో నిర్వహించే వైదిక పూజలను అనుభవించండి.",
      bn: "অভিজ্ঞ পুরোহিতদের দ্বারা ভক্তিভরে সম্পাদিত বৈদিক পূজার অভিজ্ঞতা নিন।",
    },
    bookNow: {
      en: "Book Puja Now",
      hi: "अभी पूजा बुक करें",
      mr: "आत्ताच पूजा बुक करा",
      ta: "இப்போது பூஜை பதிவு செய்யவும்",
      te: "ఇప్పుడే పూజ బుక్ చేయండి",
      bn: "এখনই পূজা বুক করুন",
    },
    viewAll: {
      en: "View All Online Pujas",
      hi: "सभी पूजा देखें",
      mr: "सर्व पूजा पहा",
      ta: "அனைத்து பூஜைகளையும் பார்க்க",
      te: "అన్ని పూజలను చూడండి",
      bn: "সব পূজা দেখুন",
    },
  };

  const t = (obj: Record<string, string>) => obj[lang] ?? obj.en;

  return (
    <section
      className="py-20 bg-gradient-to-b from-white to-orange-50"
      aria-label="Online Hindu puja booking and Vedic ritual services"
    >
      <header className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-[#b35b00] drop-shadow-md">
          {t(text.heading)}
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-3xl mx-auto">
          {t(text.subHeading)}
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        {pujas.slice(0, 3).map((puja) => {
          const name = puja.name?.[lang] || puja.name?.en || "Puja";
          const desc =
            puja.description?.[lang]?.substring(0, 120) ||
            puja.description?.en?.substring(0, 120) ||
            "";

          return (
            <article key={puja._id}>
              <div
                className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100
                           hover:shadow-[0_10px_30px_rgba(179,91,0,0.3)]
                           transition-all duration-500"
              >
                <div className="relative h-72 overflow-hidden">
                  {puja.images?.[0] ? (
                    <img
                      src={puja.images[0]}
                      alt={`${name} online Hindu puja service performed by priests`}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-72 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>

                  <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold drop-shadow-lg">
                    {name}
                  </h3>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 text-base leading-relaxed mb-6">
                    {desc}…
                  </p>

                  <Link
                    to={`/pujas/${puja._id}`}
                    title={`Book ${name} puja online with Vedic rituals`}
                    aria-label={`Book ${name} puja online`}
                    className="block w-full text-center bg-[#b35b00] hover:bg-[#8f4500]
                               text-white py-2 rounded-lg text-base shadow-md transition"
                  >
                    {t(text.bookNow)}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="text-center mt-14">
        <Link
          to="/pujas"
          title="Browse all available Hindu pujas online"
          aria-label="View all pujas"
          className="inline-block px-8 py-3 border border-[#b35b00] rounded-full
                     text-[#b35b00] font-semibold text-sm
                     transition-all duration-500
                     hover:bg-[#b35b00] hover:text-white shadow-sm"
        >
          {t(text.viewAll)}
        </Link>
      </div>
    </section>
  );
}
