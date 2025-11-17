// E:\devalayaum\frontend\src\pages\AartisList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  published?: boolean;
}

// Decorative border
const ScrollingBorder = ({ flipped = false }: { flipped?: boolean }) => (
  <div className="overflow-hidden py-1">
    <div
      className="animate-border-left"
      style={{
        backgroundImage: flipped
          ? "url('/temple-border-flip.png?rev=4')"
          : "url('/temple-border.png?rev=4')",
        backgroundRepeat: "repeat-x",
        backgroundSize: "330px auto",
        height: "60px",
        width: "300%",
        opacity: 1,
      }}
    />
  </div>
);

const AartisList = () => {
  const [items, setItems] = useState<AartiItem[]>([]);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  useEffect(() => {
    axios
      .get(`${backendURL}/api/aartis?published=true`)
      .then((res) => setItems(res.data || []))
      .catch((err) => {
        console.error("Failed to load aartis:", err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center">
        <p className="text-orange-700 text-lg font-semibold">
          Loading aartis, kathas & mantras…
        </p>
      </div>
    );
  }

  return (
    <div
      className="pt-24 pb-20"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 70%)",
      }}
    >
      <ScrollingBorder />

      {/* Header — 60% text / 40% image */}
      <div className="max-w-7xl mx-auto px-10 mb-10 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 items-center mt-6">
        <div>
          <h1
            className="text-5xl font-bold font-[Marcellus] text-[#b34a00] drop-shadow-md leading-tight"
            style={{ marginTop: 0, paddingTop: 0 }}
          >
            Sacred Aartis, Divine Kathas & Powerful Mantras
          </h1>

          <ul
            className="mt-4 space-y-3 text-gray-700 text-xl font-[Poppins] leading-relaxed list-disc pl-5"
            style={{ color: "#5a4636" }}
          >
            <li>Experience sacred hymns that awaken devotion and inner peace.</li>
            <li>Immerse in kathas that reveal spiritual wisdom.</li>
            <li>Chant mantras that purify the mind and energize the soul.</li>
            <li>Perfect for daily prayer, meditation, and devotion.</li>
          </ul>
        </div>

        <div
          className="flex justify-center lg:justify-end"
          style={{ marginTop: 0, paddingTop: 0 }}
        >
          <img
            src="/aarti.png"
            alt="Aarti Decorative Artwork"
            className="w-[300px] md:w-[380px] lg:w-[480px] drop-shadow-xl"
          />
        </div>
      </div>

      <ScrollingBorder flipped />

      {/* Items grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {items.length === 0 ? (
          <div className="col-span-full text-center text-gray-600 py-12">
            <h3 className="text-2xl font-semibold text-orange-700">
              No aartis available
            </h3>
            <p className="mt-2">New items will be added soon. 🙏</p>
          </div>
        ) : (
          items.map((it) => {
            const title = it.title?.[lang] || it.title?.en || "Untitled";
            const desc = it.description?.[lang] || it.description?.en || "";
            const image = it.image || "/placeholder.jpg";

            const badge =
              it.type === "aarti"
                ? "🪔 Aarti"
                : it.type === "katha"
                ? "📖 Katha"
                : "🕉️ Mantra";

            return (
              <Link
                key={it._id}
                to={`/aarti/${it._id}`}
                className="block rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
              >
                <div className="border rounded-2xl bg-white shadow-sm hover:shadow-md">
                  <div className="w-full h-56 bg-gray-100 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold font-[Playfair] text-gray-900">
                        {title}
                      </h2>
                      <span className="text-sm px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-medium">
                        {badge}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed font-[Poppins]">
                      {desc.length > 140 ? desc.slice(0, 140) + "..." : desc}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <ScrollingBorder />
      </div>

      <p className="text-center mt-8 text-gray-700 italic text-sm">
        🌼 “Chant with devotion — each verse carries divine vibrations.” 🌼
      </p>
    </div>
  );
};

export default AartisList;
