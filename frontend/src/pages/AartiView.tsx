// src/pages/AartiView.tsx
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

  const glow = "shadow-[0_10px_30px_rgba(255,140,60,0.22)]";

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
      <p className="text-center mt-20 text-orange-700 text-lg font-medium">
        Loading…
      </p>
    );

  if (!item)
    return (
      <p className="text-center mt-20 text-red-600 text-lg">Item not found</p>
    );

  return (
    <div className="pt-24 pb-20 px-6 bg-gradient-to-b from-[#fff7e6] via-white to-white min-h-screen">
      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <Link to="/aartis" className="text-orange-700 hover:underline">
          ← Back to Aartis
        </Link>

        {/* HEADER SECTION */}
        <div className="mt-6 text-center">
          <h1 className="text-4xl font-[Marcellus] text-orange-900 font-bold">
            {getText(item.title)}
          </h1>

          <p className="text-gray-600 mt-1 text-sm tracking-wide capitalize">
            📜 {item.type}
          </p>
        </div>

        {/* IMAGE (Small + Glow + No Border) */}
        {item.image && (
          <div className="flex justify-center mt-8">
            <div className={`rounded-3xl overflow-hidden ${glow} bg-white p-3`}>
              <img
                src={item.image}
                alt={getText(item.title)}
                className="w-64 h-64 object-cover rounded-2xl"
              />
            </div>
          </div>
        )}

        {/* CONTENT SECTIONS */}
        <div className="mt-12 space-y-10">

          {/* DESCRIPTION */}
          {item.description && (
            <section>
              <h2 className="text-2xl font-[Merriweather] text-orange-800 mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {getText(item.description)}
              </p>
            </section>
          )}

          {/* MAIN CONTENT (Aarti/Katha/Mantra text) */}
          {item.content && (
            <section>
              <h2 className="text-2xl font-[Merriweather] text-orange-800 mb-3">
                {item.type === "mantra"
                  ? "Mantra"
                  : item.type === "katha"
                  ? "Katha Content"
                  : "Aarti Text"}
              </h2>

              <p className="text-gray-900 leading-relaxed whitespace-pre-line text-lg">
                {getText(item.content)}
              </p>
            </section>
          )}

          {/* MEANING (Only for Mantra) */}
          {item.type === "mantra" && item.meaning && (
            <section>
              <h2 className="text-2xl font-[Merriweather] text-orange-800 mb-3">
                Meaning
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {getText(item.meaning)}
              </p>
            </section>
          )}

          {/* RELATED TEMPLE */}
          {typeof item.temple === "object" && item.temple?.name && (
            <section>
              <h2 className="text-2xl font-[Merriweather] text-orange-800 mb-2">
                Related Temple
              </h2>

              <Link
                to={`/temple/${item.temple._id}`}
                className="text-orange-700 underline hover:text-orange-900 text-lg"
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
