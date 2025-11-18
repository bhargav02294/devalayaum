// src/pages/AartiView.tsx
// PREMIUM AARTI / MANTRA / KATHA VIEW PAGE — MATCHED WITH TEMPLE + PUJA THEME

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
  const lang = i18n.language || "en";

  const getText = (field?: Record<string, string>) =>
    field?.[lang] || field?.en || "";

  const glow = "shadow-[0_6px_22px_rgba(255,145,60,0.22)]";

  // Load Merriweather dynamically
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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<AartiItem>(`${backendURL}/api/aartis/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error("Failed to load Aarti:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, backendURL]);

  if (loading)
    return (
      <p className="text-center mt-24 text-orange-700 text-lg font-semibold">
        Loading…
      </p>
    );

  if (!item)
    return (
      <p className="text-center mt-24 text-red-600 text-lg">Item not found</p>
    );

  return (
    <div className="pt-24 pb-20 px-6 bg-gradient-to-b from-[#fff7e3] via-[#fffdf8] to-white min-h-screen">
      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <Link
          to="/aartis"
          className="text-orange-700 hover:text-orange-900 underline"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          ← Back to Aartis
        </Link>

        {/* HEADER SECTION */}
        <div className="mt-6 text-center">
          <h1 className="text-3xl lg:text-4xl font-[Marcellus] text-orange-800 font-bold">
            {getText(item.title)}
          </h1>

          <p
            className="text-gray-600 mt-1 text-sm capitalize tracking-wide"
            style={{ fontFamily: "'Merriweather', serif" }}
          >
            📜 {item.type}
          </p>
        </div>

        {/* IMAGE */}
        {item.image && (
          <div className="flex justify-center mt-8">
            <div className={`rounded-3xl overflow-hidden bg-white p-4 ${glow}`}>
              <img
                src={item.image}
                alt={getText(item.title)}
                className="w-64 h-64 object-cover rounded-2xl"
              />
            </div>
          </div>
        )}

        {/* CONTENT BOX */}
        <div className="mt-12 space-y-12">

          {/* DESCRIPTION */}
          {item.description && (
            <section>
              <h2
                className="text-[18px] font-semibold text-orange-600 mb-3"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Description
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                {getText(item.description)}
              </p>
            </section>
          )}

          {/* MAIN CONTENT */}
          {item.content && (
            <section>
              <h2
                className="text-[18px] font-semibold text-orange-600 mb-3"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                {item.type === "mantra"
                  ? "Mantra"
                  : item.type === "katha"
                  ? "Katha Content"
                  : "Aarti Text"}
              </h2>

              <p
                className="text-gray-900 leading-relaxed whitespace-pre-line text-lg"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                {getText(item.content)}
              </p>
            </section>
          )}

          {/* MEANING */}
          {item.type === "mantra" && item.meaning && (
            <section>
              <h2
                className="text-[18px] font-semibold text-orange-600 mb-3"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Meaning
              </h2>
              <p
                className="text-gray-700 leading-relaxed whitespace-pre-line"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                {getText(item.meaning)}
              </p>
            </section>
          )}

          {/* RELATED TEMPLE */}
          {typeof item.temple === "object" && item.temple?.name && (
            <section>
              <h2
                className="text-[18px] font-semibold text-orange-600 mb-2"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                Related Temple
              </h2>

              <Link
                to={`/temple/${item.temple._id}`}
                className="text-orange-700 underline hover:text-orange-900 text-lg"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                🛕 {getText(item.temple.name)}
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
