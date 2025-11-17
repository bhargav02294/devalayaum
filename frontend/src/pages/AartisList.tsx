// E:\devalayaum\frontend\src\pages\AartisList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// AARTI ITEM STRUCTURE
interface AartiItem {
  _id: string;
  title: Record<string, string>;
  type: "aarti" | "katha" | "mantra";
  description?: Record<string, string>;
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
      }}
    />
  </div>
);

export default function AartisList() {
  const [items, setItems] = useState<AartiItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<"all" | "aarti" | "katha" | "mantra">(
    "all"
  );

  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  // FETCH ALL AARTI/KATHA/MANTRA
  useEffect(() => {
    axios
      .get(`${backendURL}/api/aartis`)
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [backendURL]);

  // FILTER TAKES EFFECT HERE
  const filteredItems =
    filter === "all"
      ? items
      : items.filter((it) => it.type === filter);

  if (loading) {
    return (
      <div className="pt-24 pb-20 text-center text-orange-700 font-semibold text-lg">
        Loading Aartis, Kathas & Mantras…
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

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-10 mb-10 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-center">
        <div>
          <h1
            className="text-5xl font-bold font-[Marcellus] text-[#b34a00] drop-shadow-md leading-tight"
            style={{ marginTop: 0 }}
          >Aartis of the Eternal Gods & Goddesses
          </h1>

          <p className="mt-4 text-xl text-[#5a4636] font-[Poppins] leading-relaxed">
            Explore divine hymns, spiritual stories, and powerful mantras that
            uplift your soul and bring peace, devotion & energy.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src="/aarti.png"
            alt="Aarti Artwork"
            className="w-[300px] md:w-[420px] lg:w-[480px] drop-shadow-xl"
          />
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="max-w-7xl mx-auto px-10 mb-8 flex flex-wrap gap-4 justify-center">
        {[
          { key: "all", label: "All" },
          { key: "aarti", label: "Aartis" },
          { key: "katha", label: "Kathas" },
          { key: "mantra", label: "Mantras" },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() =>
              setFilter(btn.key as "all" | "aarti" | "katha" | "mantra")
            }
            className={`px-6 py-2 rounded-full font-medium text-lg transition-all border 
              ${
                filter === btn.key
                  ? "bg-orange-600 text-white shadow-lg scale-105 border-orange-700"
                  : "bg-white text-orange-700 border-orange-500 hover:bg-orange-100"
              }
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <ScrollingBorder flipped />

      {/* LIST GRID */}
      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-600 pt-10">
            <h3 className="text-2xl font-semibold text-orange-700">
              No items found
            </h3>
            <p>Try selecting another category.</p>
          </div>
        ) : (
          filteredItems.map((it) => {
            const title = it.title?.[lang] || it.title?.en || "Untitled";
            const desc = it.description?.[lang] || it.description?.en || "";
            const image = it.image || "/placeholder.jpg";

            return (
              <Link
                to={`/aarti/${it._id}`}
                key={it._id}
                className="block rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-full h-56 bg-gray-200 overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h2 className="text-xl font-[Playfair] font-semibold text-gray-900">
                    {title}
                  </h2>

                  <span className="text-sm text-orange-700 font-medium">
                    {it.type.toUpperCase()}
                  </span>

                  <p className="text-sm text-gray-700 font-[Poppins]">
                    {desc.length > 130 ? desc.slice(0, 130) + "..." : desc}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <ScrollingBorder />

      <p className="text-center mt-8 text-gray-600 italic">
        ✨ “Devotion begins with one verse of love.” ✨
      </p>
    </div>
  );
}
