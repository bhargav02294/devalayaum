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

  // 🔥 Auto re-render when language changes
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
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  if (list.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">No Aartis available.</p>
    );
  }

  // 🌍 Multi-language labels
  const text = {
    heading: {
      en: "Aartis, Kathas & Mantras",
      hi: "आरती, कथा और मंत्र",
      mr: "आरती, कथा आणि मंत्र",
      ta: "ஆரத்தி, கதை & மந்த்ரங்கள்",
      te: "ఆర్తులు, కథలు & మంత్రాలు",
      bn: "আরতি, কথা ও মন্ত্র",
    },
    subHeading: {
      en: "Explore sacred verses for healing, devotion and peace",
      hi: "चिकित्सा, भक्ति और शांति के लिए पवित्र श्लोकों का अन्वेषण करें",
      mr: "उपचार, भक्ती आणि शांततेसाठी पवित्र ओव्या शोधा",
      ta: "ஆரோக்கியம், பக்தி மற்றும் அமைதிக்கான தெய்வீக பாடல்கள்",
      te: "ఆరోగ్యం, భక్తి మరియు శాంతికోసం పవిత్ర శ్లోకాలు",
      bn: "আরোগ্য, ভক্তি ও শান্তির জন্য পবিত্র শ্লোক আবিষ্কার করুন",
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
      en: "View All Aartis",
      hi: "सभी आरती देखें",
      mr: "सर्व आरती पाहा",
      ta: "அனைத்து ஆரத்திகளையும் பார்க்கவும்",
      te: "అన్ని ఆర్తులను చూడండి",
      bn: "সব আরতি দেখুন",
    },
    type: {
      aarti: {
        en: "Aarti",
        hi: "आरती",
        mr: "आरती",
        ta: "ஆரத்தி",
        te: "ఆర్తి",
        bn: "আরতি",
      },
      katha: {
        en: "Katha",
        hi: "कथा",
        mr: "कथा",
        ta: "கதை",
        te: "కథ",
        bn: "কথা",
      },
      mantra: {
        en: "Mantra",
        hi: "मंत्र",
        mr: "मंत्र",
        ta: "மந்திரம்",
        te: "మంత్రం",
        bn: "মন্ত্র",
      },
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
        {list.slice(0, 3).map((item) => {
          const title = item.title?.[lang] || item.title?.en || "Untitled";
          const desc =
            item.description?.[lang]?.slice(0, 120) ||
            item.description?.en?.slice(0, 120) ||
            "";

          const typeLabel = t(text.type[item.type as "aarti" | "katha" | "mantra"]);

          return (
            <Link
              key={item._id}
              to={`/aarti/${item._id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-[0_10px_30px_rgba(179,91,0,0.3)] hover:-translate-y-2 transition-all duration-500 relative"
            >
              {/* Type Badge */}
              <div className="absolute top-4 left-4 bg-[#b35b00] text-white text-xs px-3 py-1 rounded-full shadow-md z-10">
                {typeLabel}
              </div>

              {/* Thumbnail */}
              <div className="h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#8a4600] mb-2 leading-snug">
                  {title}
                </h3>

                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  {desc}...
                </p>

                <div className="text-[#b35b00] font-medium text-sm group-hover:underline">
                  {t(text.readMore)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center mt-16">
        <Link
          to="/aarti"
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
