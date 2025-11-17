// E:\devalayaum\frontend\src\pages\AartisList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// DATA STRUCTURE (correct for your backend)
interface AartiItem {
  _id: string;
  title: Record<string, string>;
  type: "aarti" | "katha" | "mantra";
  description?: Record<string, string>;
  image?: string;
  published?: boolean;
}

// Decorative Border Component
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
          backgroundSize: "330px auto",
          height: "60px",
          width: "300%",
        }}
      />
    </div>
  );
}

export default function AartisList() {
  const [items, setItems] = useState<AartiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "aarti" | "katha" | "mantra">("all");

  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  // LOAD ALL AARTIS
  useEffect(() => {
    axios
      .get(`${backendURL}/api/aartis`)
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [backendURL]);

  const filteredItems =
    filter === "all" ? items : items.filter((it) => it.type === filter);

  if (loading) {
    return (
      <div className="pt-24 pb-20 text-center text-orange-700 text-lg font-semibold">
        Loading Aartis, Kathas & Mantras…
      </div>
    );
  }

  return (
    <div
      className="pt-24 pb-20"
      style={{
        background: "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
      <ScrollingBorder />

      {/* HEADER — SAME DESIGN AS DONATION PAGE */}
      <div className="max-w-7xl mx-auto px-10 mb-10 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 items-center">

        {/* LEFT TITLE BLOCK */}
        <div>
          <h1
            className="text-5xl font-bold font-[Marcellus] drop-shadow-md leading-tight"
            style={{ color: "#b34a00", marginTop: "0px", paddingTop: "0px" }}
          >
            Aartis of the Eternal Gods & Goddesses
          </h1>

          <ul
            className="space-y-2 text-lg md:text-xl font-[Poppins] leading-relaxed list-disc pl-5"
            style={{ marginTop: "15px", color: "#5a4636" }}
          >
            <li>Chants that purify the mind and awaken devotion.</li>
            <li>Feel the divine presence in every sacred verse.</li>
            <li>Aartis that bring peace, strength, and positivity.</li>
            <li>Let your heart glow with the rhythm of devotion.</li>
            <li>Sacred melodies to connect you with the Divine.</li>
            <li>Begin and end your day with God’s blessings.</li>
          </ul>
        </div>

        {/* RIGHT IMAGE BLOCK */}
        <div
          className="flex justify-center lg:justify-end"
          style={{ marginTop: "0px", paddingTop: "0px" }}
        >
          <img
            src="/aarti.png"
            alt="Aarti Artwork"
            className="w-[300px] md:w-[420px] lg:w-[540px] drop-shadow-xl"
          />
        </div>
      </div>

      {/* BORDER BELOW TITLE (no gap) */}
      <ScrollingBorder flipped />

      {/* FILTER BUTTONS — STYLED TO MATCH THEME */}
      <div className="max-w-7xl mx-auto px-10 mt-8 mb-6 flex flex-wrap gap-4 justify-center">
        {[
          { key: "all", label: "All" },
          { key: "aarti", label: "Aartis" },
          { key: "katha", label: "Kathas" },
          { key: "mantra", label: "Mantras" },
        ].map((b) => (
          <button
            key={b.key}
            onClick={() => setFilter(b.key as "all" | "aarti" | "katha" | "mantra")}
            className={`px-6 py-2 rounded-full font-[Poppins] text-lg transition-all border 
              ${
                filter === b.key
                  ? "bg-orange-600 text-white border-orange-700 shadow-lg scale-105"
                  : "bg-white text-orange-700 border-orange-500 hover:bg-orange-100"
              }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* CARD GRID */}
      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-600 pt-10">
            <h3 className="text-2xl font-semibold text-orange-700">No items found</h3>
            <p>Try another category.</p>
          </div>
        ) : (
          filteredItems.map((it) => {
            const title = it.title?.[lang] || it.title?.en || "Untitled";
            const desc = it.description?.[lang] || it.description?.en || "";
            const img = it.image || "/placeholder.jpg";

            return (
              <Link
                to={`/aarti/${it._id}`}
                key={it._id}
                className="block rounded-2xl overflow-hidden border bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"
              >
                <div className="w-full h-56 bg-gray-100 overflow-hidden">
                  <img src={img} alt={title} className="w-full h-full object-cover" />
                </div>

                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold font-[Playfair] text-gray-900">{title}</h2>

                  <span className="text-sm text-orange-700 font-medium">
                    {it.type.toUpperCase()}
                  </span>

                  <p className="text-sm text-gray-700 font-[Poppins] leading-relaxed">
                    {desc.length > 130 ? desc.slice(0, 130) + "..." : desc}
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
