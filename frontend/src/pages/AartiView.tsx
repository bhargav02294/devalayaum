// src/pages/AartiView.tsx — LIVE MULTILANGUAGE FIXED
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface AartiItem {
  _id: string;
  title: Record<string, string>;
  type: "aarti" | "katha" | "mantra";
  description?: Record<string, string>;
  content?: Record<string, string>;
  meaning?: Record<string, string>;
  image?: string;
  temple?: { _id?: string; name?: Record<string, string> } | string | null;
}

export default function AartiView() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<AartiItem | null>(null);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_API_URL;

  // LIVE LANGUAGE
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  const glow = "shadow-[0_6px_22px_rgba(255,145,60,0.22)]";

  // Load font
  useEffect(() => {
    const href =
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap";
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  // LOAD ITEM
  useEffect(() => {
    axios
      .get(`${backendURL}/api/aartis/${id}`)
      .then((res) => setItem(res.data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  if (loading)
    return <p className="text-center mt-24 text-orange-700 text-lg">Loading…</p>;

  if (!item)
    return (
      <p className="text-center mt-24 text-red-600 text-lg">
        {t({ en: "Item not found", hi: "आइटम नहीं मिला", mr: "वस्तू आढळली नाही" })}
      </p>
    );

  return (
    <div className="pt-24 pb-20 px-6 bg-gradient-to-b from-[#fff7e3] via-[#fffdf8] to-white min-h-screen">
      <div className="max-w-4xl mx-auto">

        <Link
          to="/aartis"
          className="text-orange-700 underline"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          ← {t({ en: "Back to Aartis", hi: "आरती पर वापस जाएँ", mr: "आरतीकडे परत जा" })}
        </Link>

        <div className="mt-6 text-center">
          <h1 className="text-3xl lg:text-4xl font-[Marcellus] text-orange-800 font-bold">
            {t(item.title)}
          </h1>

          <p
            className="text-gray-600 mt-1 text-sm"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            📜{" "}
            {t({
              en: item.type,
              hi: item.type === "aarti" ? "आरती" : item.type === "katha" ? "कथा" : "मंत्र",
              mr: item.type === "aarti" ? "आरती" : item.type === "katha" ? "कथा" : "मंत्र",
            })}
          </p>
        </div>

        {item.image && (
          <div className="flex justify-center mt-8">
            <div className={`rounded-3xl p-4 bg-white ${glow}`}>
              <img src={item.image} className="w-64 h-64 object-cover rounded-2xl" />
            </div>
          </div>
        )}

        <div className="mt-12 space-y-12">

          {item.description && (
            <section>
              <h2 className="text-[18px] font-semibold text-orange-600 mb-3">
                {t({ en: "Description", hi: "विवरण", mr: "वर्णन" })}
              </h2>
              <p className="text-gray-700">{t(item.description)}</p>
            </section>
          )}

          {item.content && (
            <section>
              <h2 className="text-[18px] font-semibold text-orange-600 mb-3">
                {t({
                  en:
                    item.type === "mantra"
                      ? "Mantra"
                      : item.type === "katha"
                      ? "Katha Content"
                      : "Aarti Text",
                  hi:
                    item.type === "mantra"
                      ? "मंत्र"
                      : item.type === "katha"
                      ? "कथा सामग्री"
                      : "आरती पाठ",
                  mr:
                    item.type === "mantra"
                      ? "मंत्र"
                      : item.type === "katha"
                      ? "कथा मजकूर"
                      : "आरती मजकूर",
                })}
              </h2>

              <p className="text-gray-900 whitespace-pre-line text-lg">
                {t(item.content)}
              </p>
            </section>
          )}

          {item.type === "mantra" && item.meaning && (
            <section>
              <h2 className="text-[18px] font-semibold text-orange-600 mb-3">
                {t({ en: "Meaning", hi: "अर्थ", mr: "अर्थ" })}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">{t(item.meaning)}</p>
            </section>
          )}

          {typeof item.temple === "object" && item.temple?.name && (
            <section>
              <h2 className="text-[18px] font-semibold text-orange-600 mb-2">
                {t({ en: "Related Temple", hi: "संबंधित मंदिर", mr: "संबंधित मंदिर" })}
              </h2>

              <Link
                to={`/temple/${item.temple._id}`}
                className="text-orange-700 underline text-lg"
              >
                🛕 {t(item.temple.name)}
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
