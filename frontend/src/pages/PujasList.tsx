// src/pages/PujasList.tsx
// FULL MULTILANGUAGE + LIVE LANGUAGE SYNC + ESLINT-SAFE

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

/* ---------------------- ICON ---------------------- */
function MapPin({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 10.5C18.5 15 12 21 12 21s-6.5-6-6.5-10.5A6.5 6.5 0 1 1 18.5 10.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------- TYPES ---------------------- */
interface Puja {
  _id: string;
  name: Record<string, string>;
  category: string;
  image?: string;
  description?: Record<string, string>;
  published?: boolean;
}

/* ---------------------- BORDER ---------------------- */
function ScrollingBorder({ flipped = false }: { flipped?: boolean }) {
  return (
    <div className="overflow-hidden py-1">
      <div
        className="animate-border-left"
        style={{
          backgroundImage: flipped
            ? "url('/temple-border-flip.png?rev=4')"
            : "url('/temple-border.png?rev=4')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "260px auto",
          height: "45px",
          width: "300%",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------
   MAIN COMPONENT — FULL MULTILINGUAL
------------------------------------------------------ */
export default function PujasList() {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_API_URL;

  /* ---------- LIVE MULTILANGUAGE SUPPORT ---------- */
  const [lang, setLang] = useState(i18n.language);
  useEffect(() => {
    const h = (lng: string) => setLang(lng);
    i18n.on("languageChanged", h);
    return () => i18n.off("languageChanged", h);
  }, []);

  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";

  /* ---------- LOAD PUJAS ---------- */
  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get<Puja[]>(`${backendURL}/api/pujas`);
        setPujas(res.data.filter((p) => p.published !== false));
      } catch {
        setPujas([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backendURL]);

  /* ---------- LOADING STATE ---------- */
  if (loading)
    return (
      <p className="text-center mt-20 text-orange-700 text-xl font-semibold">
        {t({
          en: "Loading pujas...",
          hi: "पूजा लोड हो रही है...",
          mr: "पूजा लोड होत आहेत...",
        })}
      </p>
    );

  /* ---------- NO PUJAS ---------- */
  if (pujas.length === 0)
    return (
      <div className="pt-20 md:pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-orange-700">
          {t({ en: "No Pujas Found", hi: "कोई पूजा नहीं मिली", mr: "कोणतीही पूजा सापडली नाही" })}
        </h2>
        <p className="text-sm md:text-base">
          {t({
            en: "New divine pujas will be added soon. Stay tuned.",
            hi: "नई दिव्य पूजाएँ जल्द ही जोड़ी जाएँगी। बने रहें।",
            mr: "नवीन दिव्य पूजा लवकरच जोडल्या जातील. संपर्कात रहा.",
          })}{" "}
          🙏
        </p>
      </div>
    );

  /* ------------------------------------------------------
       UI RETURN — FULL MULTILINGUAL PAGE
  ------------------------------------------------------ */
  return (
    <div
      className="pt-20 md:pt-24 pb-16"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
      <ScrollingBorder />

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 mb-10 
      grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 items-center">

        {/* LEFT TEXT BLOCK */}
        <div>
          <h1
            className="text-3xl md:text-5xl font-bold font-[Marcellus] text-[#b34a00] drop-shadow-md leading-tight"
          >
            {t({
              en: "Divine Rituals to Bring Blessings Into Your Life",
              hi: "आपके जीवन में आशीर्वाद लाने वाले दिव्य अनुष्ठान",
              mr: "आपल्या जीवनात आशीर्वाद आणणारे दिव्य विधी",
            })}
          </h1>

          <ul className="mt-4 space-y-2 md:space-y-3 text-gray-700 
          text-base md:text-xl font-[Poppins] leading-relaxed list-disc pl-5">

            <li>
              {t({
                en: "Perform sacred pujas with pure devotion.",
                hi: "शुद्ध भक्ति के साथ पवित्र पूजा करें।",
                mr: "शुद्ध भक्तीने पवित्र पूजा करा.",
              })}
            </li>

            <li>
              {t({
                en: "Bring peace, prosperity and protection home.",
                hi: "घर में शांति, समृद्धि और सुरक्षा लाएँ।",
                mr: "घरात शांती, समृद्धी आणि संरक्षण आणा.",
              })}
            </li>

            <li>
              {t({
                en: "Authentic Vedic pujas performed by trusted priests.",
                hi: "विश्वसनीय पुरोहितों द्वारा की जाने वाली वैदिक पूजा।",
                mr: "विश्वासार्ह पुरोहितांकडून केल्या जाणाऱ्या वैदिक पूजा.",
              })}
            </li>

            <li>
              {t({
                en: "Every puja begins with faith — and ends with blessings.",
                hi: "हर पूजा विश्वास से शुरू होती है और आशीर्वाद पर समाप्त होती है।",
                mr: "प्रत्येक पूजा विश्वासाने सुरू होते आणि आशीर्वादाने संपते.",
              })}
            </li>

            <li>
              {t({
                en: "Book pujas easily and receive divine grace.",
                hi: "पूजा आसानी से बुक करें और दिव्य कृपा प्राप्त करें।",
                mr: "पूजा सहज बुक करा आणि दैवी कृपा मिळवा.",
              })}
            </li>

          </ul>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center lg:justify-end">
          <img
            src="/puja.png"
            alt="Puja Decorative Artwork"
            className="w-56 md:w-80 lg:w-[420px] drop-shadow-xl"
          />
        </div>

      </div>

      <ScrollingBorder flipped />

      {/* GRID OF PUJA CARDS */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
      gap-6 md:gap-10 mt-10">

        {pujas.map((p) => {
          const title = t(p.name);
          const desc = t(p.description);

          return (
            <Link
              key={p._id}
              to={`/pujas/${p._id}`}
              className="block rounded-2xl bg-white shadow-sm 
              hover:shadow-md hover:-translate-y-1 transition-all"
            >
              {/* IMAGE */}
              <div className="w-full h-48 md:h-56 bg-gray-100 
              overflow-hidden rounded-t-2xl">
                <img
                  src={p.image || "/placeholder.jpg"}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* TEXT INFO */}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 text-left font-[Playfair]">
                  {title}
                </h2>

                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin size={17} className="mr-1" />
                  <span className="truncate max-w-[120px] md:max-w-[150px]">
                    {p.category}
                  </span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed font-[Poppins]">
                  {desc.slice(0, 130)}...
                </p>
              </div>
            </Link>
          );
        })}

      </div>
    </div>
  );
}
