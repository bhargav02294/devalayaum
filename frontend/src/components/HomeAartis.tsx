// src/components/HomeAartis.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface Aarti {
  _id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  image?: string;
  type: string;
}

export default function HomeAartis() {
  const backendURL = import.meta.env.VITE_API_URL;

  const [lang, setLang] = useState(i18n.language || "en");
  const [list, setList] = useState<Aarti[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = () => setLang(i18n.language);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  useEffect(() => {
    axios
      .get(`${backendURL}/api/aartis/home-list`)
      .then((res) => setList(res.data))
      .catch((err) => console.error("Aarti Fetch Error:", err))
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading devotional Aartis, Kathas and Mantras…
      </p>
    );
  }

  if (list.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No Hindu Aartis, Kathas or Mantras available.
      </p>
    );
  }

  const text = {
    heading: {
      en: "Hindu Aartis, Kathas & Mantras",
      hi: "हिंदू आरती, कथा और मंत्र",
      mr: "हिंदू आरती, कथा आणि मंत्र",
      ta: "இந்து ஆரத்தி, கதை & மந்திரங்கள்",
      te: "హిందూ ఆర్తులు, కథలు & మంత్రాలు",
      bn: "হিন্দু আরতি, কথা ও মন্ত্র",
    },
    subHeading: {
      en: "Read, listen and experience sacred Hindu prayers, devotional aartis, spiritual kathas and powerful mantras for peace, devotion and inner healing.",
      hi: "भक्ति, शांति और आध्यात्मिक उपचार के लिए पवित्र आरती, कथा और मंत्र पढ़ें और अनुभव करें।",
      mr: "भक्ती, शांतता आणि आध्यात्मिक उपचारासाठी पवित्र आरती, कथा आणि मंत्र वाचा आणि अनुभवा.",
      ta: "பக்தி, அமைதி மற்றும் ஆன்மீக குணமடைவதற்கான புனித ஆரத்தி, கதைகள் மற்றும் மந்திரங்கள்.",
      te: "భక్తి, శాంతి మరియు ఆధ్యాత్మిక స్వస్థత కోసం పవిత్ర ఆర్తులు, కథలు మరియు మంత్రాలు.",
      bn: "ভক্তি, শান্তি ও আধ্যাত্মিক আরোগ্যের জন্য পবিত্র আরতি, কথা ও মন্ত্র।",
    },
    readMore: {
      en: "Read More →",
      hi: "और पढ़ें →",
      mr: "अधिक वाचा →",
      ta: "மேலும் படிக்க →",
      te: "మరింత చదవండి →",
      bn: "আরও পড়ুন →",
    },
    viewAll: {
      en: "View All Hindu Aartis & Mantras",
      hi: "सभी आरती और मंत्र देखें",
      mr: "सर्व आरती आणि मंत्र पहा",
      ta: "அனைத்து ஆரத்தி & மந்திரங்களைப் பார்க்கவும்",
      te: "అన్ని ఆర్తులు & మంత్రాలను చూడండి",
      bn: "সব আরতি ও মন্ত্র দেখুন",
    },
    type: {
      aarti: { en: "Aarti", hi: "आरती", mr: "आरती", ta: "ஆரத்தி", te: "ఆర్తి", bn: "আরতি" },
      katha: { en: "Katha", hi: "कथा", mr: "कथा", ta: "கதை", te: "కథ", bn: "কথা" },
      mantra: { en: "Mantra", hi: "मंत्र", mr: "मंत्र", ta: "மந்திரம்", te: "మంత్రం", bn: "মন্ত্র" },
    },
  };

  const t = (obj: Record<string, string>) => obj[lang] ?? obj.en;

  return (
    <section
      className="py-20 bg-gradient-to-b from-orange-50 to-white"
      aria-label="Hindu devotional Aartis, spiritual Kathas and sacred Mantras"
    >
      {/* SECTION HEADER */}
      <header className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-[#b35b00] drop-shadow-md">
          {t(text.heading)}
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-3xl mx-auto">
          {t(text.subHeading)}
        </p>
      </header>

      {/* CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
        {list.slice(0, 3).map((item) => {
          const title = item.title?.[lang] || item.title?.en || "Untitled";
          const desc =
            item.description?.[lang]?.slice(0, 120) ||
            item.description?.en?.slice(0, 120) ||
            "";

          const typeLabel =
            t(text.type[item.type as "aarti" | "katha" | "mantra"]);

          return (
            <article key={item._id}>
              <Link
                to={`/aarti/${item._id}`}
                title={`${title} ${typeLabel} – Read full Hindu devotional content`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100
                           hover:shadow-[0_10px_30px_rgba(179,91,0,0.3)]
                           hover:-translate-y-2 transition-all duration-500 relative block"
                aria-label={`${typeLabel}: ${title} – Hindu devotional prayer`}
              >
                <div className="absolute top-4 left-4 bg-[#b35b00] text-white text-xs px-3 py-1 rounded-full shadow-md z-10">
                  {typeLabel}
                </div>

                <div className="h-72 overflow-hidden">
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={`${title} ${typeLabel} Hindu devotional prayer image`}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                    loading="lazy"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#8a4600] mb-2 leading-snug">
                    {title}
                  </h3>

                  <p className="text-gray-700 text-sm leading-relaxed mb-6">
                    {desc}…
                  </p>

                  <div className="text-[#b35b00] font-medium text-sm group-hover:underline">
                    {t(text.readMore)}
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* VIEW ALL CTA */}
      <div className="text-center mt-16">
        <Link
          to="/aarti"
          title="Browse all Hindu Aartis, Kathas and Mantras"
          aria-label="View all Hindu Aartis Kathas and Mantras"
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
