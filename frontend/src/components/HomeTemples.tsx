import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface Temple {
  _id: string;
  name: Record<string, string>;
  location: Record<string, string>;
  images: string[];
}

export default function HomeTemples() {
  const backendURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(i18n.language || "en");

  // 🔥 realtime language update
  useEffect(() => {
    const handler = () => setLang(i18n.language);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const t = (obj: Record<string, string> | undefined) =>
    obj?.[lang] || obj?.en || "";

  // 🌍 Multilanguage for Titles
  const text = {
    heading: {
      en: "Sacred Temples",
      hi: "पवित्र मंदिर",
      mr: "पवित्र मंदिरे",
      ta: "புனித கோயில்கள்",
      te: "పవిత్ర ఆలయాలు",
      bn: "পবিত্র মন্দির",
    },
    subheading: {
      en: "Explore ancient temples known for their spiritual presence and heritage.",
      hi: "आध्यात्मिक उपस्थिति और विरासत के लिए प्रसिद्ध प्राचीन मंदिरों की खोज करें।",
      mr: "आध्यात्मिक उपस्थिती आणि वारशासाठी ओळखली जाणारी प्राचीन मंदिरे पाहा.",
      ta: "ஆன்மீகமும் வரலாறும் நிறைந்த தொன்மையான கோவில்களை ஆராயுங்கள்.",
      te: "ఆధ్యాత్మికత మరియు వారసత్వానికి ప్రసిద్ధమైన పురాతన ఆలయాలను అన్వేషించండి.",
      bn: "আধ্যাত্মিক শক্তি ও ঐতিহ্যের জন্য বিখ্যাত প্রাচীন মন্দিরগুলি অন্বেষণ করুন।",
    },
    templeLabel: {
      en: "Temple",
      hi: "मंदिर",
      mr: "मंदिर",
      ta: "கோவில்",
      te: "దేవాలయం",
      bn: "মন্দির",
    },
    details: {
      en: "View Details →",
      hi: "विवरण देखें →",
      mr: "तपशील पाहा →",
      ta: "விவரங்களைப் பார்வையிடுக →",
      te: "వివరాలు చూడండి →",
      bn: "বিস্তারিত দেখুন →",
    },
    viewAll: {
      en: "View All Temples",
      hi: "सभी मंदिर देखें",
      mr: "सर्व मंदिरे पहा",
      ta: "அனைத்து கோயில்களையும் காண்க",
      te: "అన్ని ఆలయాలను చూడండి",
      bn: "সব মন্দির দেখুন",
    },
  };

  const tt = (obj: Record<string, string>) => obj[lang] || obj.en;

  useEffect(() => {
    axios
      .get(`${backendURL}/api/temples/home-list`)
      .then((res) => setTemples(res.data))
      .catch((err) => console.error("Temple fetch error:", err))
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl font-medium text-gray-600">
        Loading Temples...
      </div>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-[#fff7ee] to-[#ffffff]">

      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-[#b35b00] tracking-wide">
          {tt(text.heading)}
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          {tt(text.subheading)}
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
        {temples.slice(0, 3).map((temple) => (
          <div
            key={temple._id}
            onClick={() => navigate(`/temples/${temple._id}`)}
            className="cursor-pointer rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl 
                       border border-[#e8d7c0] transition transform hover:-translate-y-2 
                       hover:scale-[1.02] duration-300"
          >
            {/* Image */}
            <div className="relative w-full h-72 overflow-hidden">
              <img
                src={temple.images?.[0] || "/placeholder.jpg"}
                alt={t(temple.name)}
                className="w-full h-full object-cover transition duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-[#bf6000] mb-2 leading-snug">
                {t(temple.name)}
              </h3>

              <p className="text-gray-700 text-sm leading-relaxed">
                {t(temple.location) || "Location not available"}
              </p>

              {/* Divider */}
              <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between text-sm">
                <span className="text-[#b35b00] font-medium tracking-wide">
                  {tt(text.templeLabel)}
                </span>

                <span className="text-gray-500 hover:text-[#b35b00] transition">
                  {tt(text.details)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-16">
        <button
          onClick={() => navigate("/temples")}
          className="relative px-6 py-2 text-[#b35b00] font-semibold text-base 
                     border border-[#b35b00] rounded-full overflow-hidden
                     transition-all duration-500 ease-out hover:text-white hover:bg-[#b35b00]/20"
        >
          <span
            className="absolute left-0 bottom-0 h-full w-0 bg-[#b35b00]
                       transition-all duration-700 ease-out
                       group-hover:w-full rounded-full"
          ></span>

          <span className="relative z-10">
            {tt(text.viewAll)}
          </span>
        </button>
      </div>
    </section>
  );
}
