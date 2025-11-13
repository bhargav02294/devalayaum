// E:\devalayaum\frontend\src\pages\AartisList.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import i18n from "../i18n";

interface AartiItem {
  _id: string;
  title: Record<string, string>;
  type: "aarti" | "katha" | "mantra";
  description?: Record<string, string>;
  image?: string;
}

export default function AartisList() {
  const [items, setItems] = useState<AartiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<"aarti" | "katha" | "mantra">("aarti");

  const backendURL = import.meta.env.VITE_API_URL; // ✅ FIXED
  const lang = i18n.language || "en";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<AartiItem[]>(`${backendURL}/api/aartis?published=true`);
        setItems(res.data);
      } catch (err) {
        console.error("Load aartis failed:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [backendURL]);

  const filteredItems = items.filter((it) => it.type === activeType);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="pt-24 px-6 pb-16 max-w-7xl mx-auto bg-gradient-to-b from-orange-50 via-white to-yellow-50 min-h-screen">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-8 text-orange-700 drop-shadow-sm">
        🕉️ Divine Aartis, Kathas & Mantras
      </h1>

      {/* Category Buttons */}
      <div className="flex justify-center mb-10 space-x-4">
        {(["aarti", "katha", "mantra"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-6 py-2 text-lg font-semibold rounded-full transition-all duration-300 shadow-md ${
              activeType === type
                ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white scale-105 shadow-lg"
                : "bg-white text-orange-700 border border-orange-300 hover:bg-orange-100"
            }`}
          >
            {type === "aarti" && "🪔 Aarti"}
            {type === "katha" && "📖 Katha"}
            {type === "mantra" && "🕉️ Mantra"}
          </button>
        ))}
      </div>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg italic">
          No {activeType}s available at the moment 🙏
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((it) => {
            const title = it.title?.[lang] || it.title?.en || "Untitled";
            const desc =
              it.description?.[lang]?.slice(0, 100) ||
              it.description?.en?.slice(0, 100) ||
              "";

            return (
              <Link
                key={it._id}
                to={`/aarti/${it._id}`}
                className="block bg-white border border-orange-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {it.image && (
                  <img
                    src={it.image}
                    alt={title}
                    className="w-full h-56 object-cover rounded-t-2xl"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-2xl font-semibold text-orange-700 mb-2 text-center">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-center capitalize mb-3 font-medium">
                    {it.type === "aarti" && "🪔 Aarti"}
                    {it.type === "katha" && "📖 Katha"}
                    {it.type === "mantra" && "🕉️ Mantra"}
                  </p>
                  <p className="text-gray-700 text-sm text-center leading-relaxed">
                    {desc}...
                  </p>
                  <div className="text-center mt-3">
                    <span className="inline-block mt-2 text-orange-600 font-medium hover:underline">
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Spiritual Footer Quote */}
      <div className="mt-16 text-center text-gray-700 italic text-sm">
        🌼 “Chanting brings the divine closer to your soul — let every word be your prayer.” 🌼
      </div>
    </div>
  );
}
