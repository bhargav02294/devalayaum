// AartisList.tsx — ORIGINAL WORKING LOGIC + LIVE MULTILANGUAGE + TYPE-SAFE FILTERS

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// DATA STRUCTURE
interface AartiItem {
  _id: string;
  title: Record<string, string>;
  type: "aarti" | "katha" | "mantra";
  description?: Record<string, string>;
  image?: string;
  published?: boolean;
}

// BORDER COMPONENT
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

export default function AartisList() {
  const [items, setItems] = useState<AartiItem[]>([]);
  const [loading, setLoading] = useState(true);

  // FILTER STATE (STRICT TYPE)
  type FilterType = "all" | "aarti" | "katha" | "mantra";
  const [filter, setFilter] = useState<FilterType>("all");

  const backendURL = import.meta.env.VITE_API_URL;

  // LIVE LANGUAGE STATE
  const [lang, setLang] = useState(i18n.language);
  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  // TRANSLATION FUNCTION
  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";

  // LOAD DATA
  useEffect(() => {
    axios
      .get(`${backendURL}/api/aartis`)
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [backendURL]);

  const filteredItems =
    filter === "all" ? items : items.filter((it) => it.type === filter);

  if (loading)
    return (
      <div className="pt-20 text-center text-orange-700 text-lg font-semibold">
        {t({
          en: "Loading Aartis, Kathas & Mantras…",
          hi: "लोड हो रहा है…",
          mr: "लोड होत आहे…",
        })}
      </div>
    );

  // FILTER OPTIONS (STRICTLY TYPED)
  const filterOptions: { key: FilterType; label: string }[] = [
    { key: "all", label: t({ en: "All", hi: "सभी", mr: "सर्व" }) },
    { key: "aarti", label: t({ en: "Aartis", hi: "आरती", mr: "आरत्या" }) },
    { key: "katha", label: t({ en: "Kathas", hi: "कथाएँ", mr: "कथा" }) },
    { key: "mantra", label: t({ en: "Mantras", hi: "मंत्र", mr: "मंत्र" }) },
  ];

  return (
    <div
      className="pt-20 md:pt-24 pb-20"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
      <ScrollingBorder />

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 mb-10 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 items-center">
        <div>
          <h1
            className="text-3xl md:text-5xl font-bold font-[Marcellus]"
            style={{ color: "#b34a00" }}
          >
            {t({
              en: "Aartis, Kathas & Mantras of the Eternal Gods",
              hi: "अनंत देवों की आरती, कथा और मंत्र",
              mr: "अनंत देवतांची आरती, कथा आणि मंत्र",
            })}
          </h1>

          <ul className="mt-4 text-gray-700 text-base md:text-xl list-disc pl-5 font-[Poppins] leading-relaxed space-y-2">
            <li>
              {t({
                en: "Chants that purify the mind.",
                hi: "मन को शुद्ध करने वाले मंत्र।",
                mr: "मन शुद्ध करणारे मंत्र.",
              })}
            </li>
            <li>
              {t({
                en: "Feel the divine presence.",
                hi: "दिव्य उपस्थिति का अनुभव करें।",
                mr: "दैवी उपस्थिती अनुभवा.",
              })}
            </li>
            <li>
              {t({
                en: "Aartis spreading peace.",
                hi: "शांति लाने वाली आरती।",
                mr: "शांती देणाऱ्या आरत्या.",
              })}
            </li>
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src="/aarti.png"
            className="w-56 md:w-80 lg:w-[420px] drop-shadow-xl"
          />
        </div>
      </div>

      <ScrollingBorder flipped />

      {/* FILTER BUTTONS */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 mt-8 mb-6 flex flex-wrap gap-4 justify-center">
        {filterOptions.map((b) => (
          <button
            key={b.key}
            onClick={() => setFilter(b.key)}
            className={`px-6 py-2 rounded-full border font-[Poppins]
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-8">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-600 pt-10">
            <h3 className="text-2xl font-semibold text-orange-700">
              {t({
                en: "No items found",
                hi: "कोई आइटम नहीं मिला",
                mr: "काही वस्तू आढळल्या नाहीत",
              })}
            </h3>
            <p>
              {t({
                en: "Please try another category.",
                hi: "कृपया दूसरी श्रेणी चुनें।",
                mr: "कृपया दुसरी श्रेणी वापरा.",
              })}
            </p>
          </div>
        ) : (
          filteredItems.map((it) => {
            const title = t(it.title);
            const desc = t(it.description);
            const img = it.image || "/placeholder.jpg";

            return (
              <Link
                to={`/aarti/${it._id}`}
                key={it._id}
                className="block rounded-2xl overflow-hidden bg-white border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-full h-48 md:h-56 bg-gray-100">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold font-[Playfair] text-gray-900">
                    {title}
                  </h2>

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
