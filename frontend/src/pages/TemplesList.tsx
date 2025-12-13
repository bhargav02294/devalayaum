import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import i18n from "../i18n";
import { MapPin } from "lucide-react";

interface Temple {
  _id: string;
  name: Record<string, string>;
  location: Record<string, string>;
  about?: Record<string, string>;
  mainDeity?: Record<string, string>;
  images?: string[];
}

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
        }}
      />
    </div>
  );
}

export default function TemplesList() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_API_URL;
  const [lang, setLang] = useState(i18n.language);

  // LIVE LANGUAGE UPDATE
  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";

  useEffect(() => {
    axios
      .get<Temple[]>(`${backendURL}/api/temples`)
      .then((res) => setTemples(res.data))
      .catch((err) => console.error("Failed to load temples:", err))
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading)
    return (
      <p className="text-center mt-20 text-orange-700 text-xl font-semibold">
        {t({
          en: "Loading temples...",
          hi: "मंदिर लोड हो रहे हैं...",
          mr: "मंदिरे लोड होत आहेत..."
        })}
      </p>
    );

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
      <div className="max-w-7xl mx-auto px-5 md:px-10 mb-10 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 items-center">

        {/* LEFT TEXT */}
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#b34a00] font-[Marcellus] drop-shadow-md leading-tight">
            {t({
              en: "Devalayaum Temple Collection",
              hi: "देवलयम मंदिर संग्रह",
              mr: "देवलयम मंदिर संग्रह"
            })}
          </h1>

          <ul className="mt-4 space-y-2 text-gray-700 text-base md:text-xl font-[Poppins] leading-relaxed list-disc pl-5">
            <li>{t({ en: "Authentic history and sacred significance of every shrine.", hi: "हर मंदिर का प्रामाणिक इतिहास और पवित्र महत्व।", mr: "प्रत्येक मंदिराचा प्रामाणिक इतिहास आणि धार्मिक महत्त्व." })}</li>
            <li>{t({ en: "A spiritual guide to the temples that shape our devotion.", hi: "भक्ति को आकार देने वाले मंदिरों की आध्यात्मिक मार्गदर्शिका।", mr: "आपल्या भक्तीला आकार देणाऱ्या मंदिरांची आध्यात्मिक मार्गदर्शिका." })}</li>
            <li>{t({ en: "From Jyotirlingas to Shaktipeeths — explore the holy sites.", hi: "ज्योतिर्लिंग से शक्तिपीठ तक — पवित्र स्थानों की खोज करें।", mr: "ज्योतिर्लिंगापासून शक्तीपीठांपर्यंत — पवित्र स्थळे जाणून घ्या." })}</li>
            <li>{t({ en: "Explore real photos, legends, timings, and rituals of every temple.", hi: "हर मंदिर की वास्तविक तस्वीरें, कथाएँ, समय और पूजा-विधियाँ देखें।", mr: "प्रत्येक मंदिराचे फोटो, कथा, वेळापत्रक आणि पूजा-विधी पाहा." })}</li>
            <li>{t({ en: "Your digital journey to India’s sacred places begins here.", hi: "भारत के पवित्र स्थलों की आपकी डिजिटल यात्रा यहाँ से शुरू होती है।", mr: "भारताच्या पवित्र स्थळांची तुमची डिजिटल यात्रा इथून सुरू होते." })}</li>
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src="/temple.png"
            alt="Temple Artwork"
            className="w-52 md:w-80 lg:w-[420px] drop-shadow-xl"
          />
        </div>

      </div>

      <ScrollingBorder flipped />

      {/* TEMPLES GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-10">
        {temples.length === 0 ? (
          <p className="text-center text-gray-500 col-span-3">
            {t({
              en: "No temples found.",
              hi: "कोई मंदिर नहीं मिला।",
              mr: "मंदिरे आढळली नाहीत."
            })}
          </p>
        ) : (
          temples.map((temple) => {
            const name = t(temple.name);
            const location = t(temple.location);
            const about = t(temple.about)?.slice(0, 130);

            return (
              <Link
                to={`/temples/${temple._id}`}
                key={temple._id}
                className="block rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all bg-white"
              >
                <div className="w-full h-48 md:h-56 bg-gray-100 overflow-hidden rounded-t-2xl">
                  {temple.images?.[0] ? (
                    <img
                      src={temple.images[0]}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 italic">
                      {t({ en: "No Image", hi: "कोई चित्र नहीं", mr: "छायाचित्र नाही" })}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 font-[Playfair]">
                      {name}
                    </h2>

                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin size={17} className="mr-1" />
                      <span className="truncate max-w-[100px] md:max-w-[150px]">{location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed font-[Poppins]">
                    {about}...
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
