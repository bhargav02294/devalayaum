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

// 🔱 Scrolling Border Component
function ScrollingBorder({ flipVertical = false }: { flipVertical?: boolean }) {
  return (
    <div className="overflow-hidden py-1">
      <div
        className={`animate-border-left ${
          flipVertical ? "border-flip-vertical" : ""
        }`}
        style={{
          backgroundImage: "url('/temple-border.png')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "110px auto",
          height: "22px",
          width: "300%",
          opacity: 0.95,
        }}
      />
    </div>
  );
}

export default function AartisList() {
  const [items, setItems] = useState<AartiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<"aarti" | "katha" | "mantra">(
    "aarti"
  );

  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<AartiItem[]>(
          `${backendURL}/api/aartis?published=true`
        );
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

  if (loading)
    return (
      <p className="text-center mt-20 text-orange-700 font-semibold text-xl">
        Loading...
      </p>
    );

  return (
    <div
      className="pt-24 pb-20"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 70%)",
      }}
    >
      {/* 🔱 Top Border */}
      <ScrollingBorder />

      {/* Title Section */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-6">
        <h1 className="text-5xl font-bold text-orange-800 tracking-wide font-[Playfair] drop-shadow-md">
          🕉️ Divine Aartis, Kathas & Mantras
        </h1>

        <p className="mt-4 text-lg text-gray-700 leading-relaxed font-[Poppins]">
          Explore sacred Aartis, divine Kathas, and spiritual Mantras —
          timeless verses that bring peace, devotion, and deep connection with
          the divine energies.
        </p>
      </div>

      {/* 🔱 Flipped Border */}
      <ScrollingBorder flipVertical />

      {/* Category Buttons */}
      <div className="flex justify-center mt-6 mb-10 space-x-5">
        {(["aarti", "katha", "mantra"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-7 py-2.5 text-lg font-semibold rounded-full transition-all duration-300 
              shadow-md border border-orange-300
              ${
                activeType === type
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-xl scale-110"
                  : "bg-white text-orange-700 hover:bg-orange-100"
              }`}
          >
            {type === "aarti" && "🪔 Aarti"}
            {type === "katha" && "📖 Katha"}
            {type === "mantra" && "🕉️ Mantra"}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg italic">
          No {activeType}s available at the moment 🙏
        </p>
      ) : (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
                className="group rounded-2xl overflow-hidden bg-white
                  border border-yellow-300 shadow-lg hover:shadow-[0_0_30px_rgba(255,150,0,0.6)]
                  transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="h-60 bg-white flex items-center justify-center">
                  <img
                    src={it.image || "/placeholder.jpg"}
                    alt={title}
                    className="w-full h-full object-contain p-4 
                      transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Details */}
                <div className="p-5 text-center">
                  <h3 className="text-2xl font-semibold text-orange-800 font-[Playfair]">
                    {title}
                  </h3>

                  <p className="text-gray-600 text-sm mt-1 font-medium capitalize">
                    {it.type === "aarti" && "🪔 Sacred Aarti"}
                    {it.type === "katha" && "📖 Divine Katha"}
                    {it.type === "mantra" && "🕉️ Spiritual Mantra"}
                  </p>

                  <p className="text-gray-700 text-sm mt-3 leading-relaxed font-[Poppins]">
                    {desc}...
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* 🔱 Bottom Border */}
      <div className="mt-16">
        <ScrollingBorder />
      </div>

      {/* Footer Quote */}
      <p className="text-center mt-10 text-gray-700 italic text-sm">
        🌼 “Chant with devotion — for every verse carries divine vibration.” 🌼
      </p>
    </div>
  );
}
