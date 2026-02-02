// src/components/HomeTemples.tsx
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

  useEffect(() => {
    const handler = () => setLang(i18n.language);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  const text = {
    heading: {
      en: "Sacred Hindu Temples of India",
      hi: "भारत के पवित्र हिंदू मंदिर",
      mr: "भारताची पवित्र हिंदू मंदिरे",
      ta: "இந்தியாவின் புனித இந்து கோயில்கள்",
      te: "భారతదేశంలోని పవిత్ర హిందూ ఆలయాలు",
      bn: "ভারতের পবিত্র হিন্দু মন্দিরসমূহ",
    },
    subheading: {
      en: "Explore ancient Hindu temples, sacred pilgrimage sites and spiritual heritage destinations across India.",
      hi: "भारत भर के प्राचीन हिंदू मंदिरों और पवित्र तीर्थ स्थलों की खोज करें।",
      mr: "भारतभरातील प्राचीन हिंदू मंदिरे आणि पवित्र तीर्थस्थळे पाहा.",
      ta: "இந்தியா முழுவதிலுள்ள புனித இந்து கோயில்கள் மற்றும் யாத்திரை தலங்களை ஆராயுங்கள்.",
      te: "భారతదేశంలోని పవిత్ర హిందూ ఆలయాలు మరియు యాత్రా స్థలాలను అన్వేషించండి.",
      bn: "ভারতজুড়ে পবিত্র হিন্দু মন্দির ও তীর্থস্থান অন্বেষণ করুন।",
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
      en: "View Temple Details →",
      hi: "मंदिर विवरण देखें →",
      mr: "मंदिर तपशील पाहा →",
      ta: "கோவில் விவரங்களைப் பார்வையிடுக →",
      te: "ఆలయ వివరాలు చూడండి →",
      bn: "মন্দিরের বিস্তারিত দেখুন →",
    },
    viewAll: {
      en: "View All Hindu Temples",
      hi: "सभी हिंदू मंदिर देखें",
      mr: "सर्व हिंदू मंदिरे पहा",
      ta: "அனைத்து இந்து கோயில்களையும் காண்க",
      te: "అన్ని హిందూ ఆలయాలను చూడండి",
      bn: "সব হিন্দু মন্দির দেখুন",
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
      <div className="text-center py-20 text-xl font-medium text-gray-600">
        Loading sacred Hindu temples of India…
      </div>
    );
  }

  return (
    <section
      className="py-24 bg-gradient-to-b from-[#fff7ee] to-[#ffffff]"
      aria-label="Famous and sacred Hindu temples across India"
    >
      <header className="text-center mb-16">
        <h2 className="text-5xl font-bold text-[#b35b00] tracking-wide">
          {tt(text.heading)}
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          {tt(text.subheading)}
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
        {temples.slice(0, 3).map((temple) => {
          const templeName = t(temple.name);
          const templeLocation = t(temple.location);

          return (
            <article
              key={temple._id}
              onClick={() => navigate(`/temples/${temple._id}`)}
              className="cursor-pointer rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl
                         border border-[#e8d7c0] transition transform hover:-translate-y-2
                         hover:scale-[1.02] duration-300"
              aria-label={`Explore ${templeName} temple in ${templeLocation}`}
            >
              <div className="relative w-full h-72 overflow-hidden">
                <img
                  src={temple.images?.[0] || "/placeholder.jpg"}
                  alt={`${templeName} Hindu temple located in ${templeLocation}`}
                  className="w-full h-full object-cover transition duration-700 ease-in-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#bf6000] mb-2 leading-snug">
                  {templeName}
                </h3>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {templeLocation || "Sacred temple location in India"}
                </p>

                <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between text-sm">
                  <span className="text-[#b35b00] font-medium tracking-wide">
                    {tt(text.templeLabel)}
                  </span>

                  <span className="text-gray-500 hover:text-[#b35b00] transition">
                    {tt(text.details)}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="text-center mt-16">
        <button
          onClick={() => navigate("/temples")}
          className="px-8 py-3 text-[#b35b00] font-semibold text-base
                     border border-[#b35b00] rounded-full
                     transition-all duration-500 ease-out
                     hover:text-white hover:bg-[#b35b00]"
          aria-label="Browse all sacred Hindu temples in India"
        >
          {tt(text.viewAll)}
        </button>
      </div>
    </section>
  );
}
