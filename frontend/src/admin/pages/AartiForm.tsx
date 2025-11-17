// src/pages/AartisList.tsx
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

/** --------------------------
 * Inline MapPin Icon (clean)
 * ---------------------------*/
function MapPin({ size = 18, className = "" }: { size?: number; className?: string }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      role="img"
    >
      <path
        d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 10.5C18.5 15 12 21 12 21s-6.5-6-6.5-10.5A6.5 6.5 0 1 1 18.5 10.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** --------------------------
 * Types
 * ---------------------------*/
interface Aarti {
  _id: string;
  title?: Record<string, string>;
  description?: Record<string, string>;
  content?: Record<string, string>;
  meaning?: Record<string, string>;
  image?: string;
  type: "aarti" | "katha" | "mantra";
  published?: boolean;
}

/** --------------------------
 * Scrolling border (shared)
 * ---------------------------*/
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
          opacity: 1,
        }}
      />
    </div>
  );
}

/** --------------------------
 * Safe language utilities
 * ---------------------------*/
function getLang(): string {
  try {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("i18nextLng") || localStorage.getItem("lang")) : null;
    if (saved) return saved.split("-")[0];
  } catch {
    // ignore localStorage errors
  }

  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language.split("-")[0];
  }

  return "en";
}

function getText(field?: Record<string, string>, lang?: string) {
  if (!field) return "";
  const l = lang || "en";
  return field[l] || field.en || Object.values(field)[0] || "";
}

/** --------------------------
 * Page Component
 * ---------------------------*/
export default function AartisList() {
  const [aartis, setAartis] = useState<Aarti[]>([]);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_API_URL;
  const lang = getLang();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await axios.get<Aarti[]>(`${backendURL}/api/aartis`);
        if (!mounted) return;
        setAartis(res.data.filter((a) => a.published !== false));
      } catch (e) {
        console.error("Failed to load aartis:", e);
        if (mounted) setAartis([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [backendURL]);

  if (loading) {
    return <p className="text-center mt-20 text-orange-700 text-xl font-semibold">Loading aartis...</p>;
  }

  if (aartis.length === 0) {
    return (
      <div className="pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-3xl font-bold mb-3 text-orange-700">No Aartis Found</h2>
        <p>New divine aartis will be added soon 🙏</p>
      </div>
    );
  }

  return (
    <div
      className="pt-24 pb-20"
      style={{ background: "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)" }}
    >
      <ScrollingBorder />

      {/* Header 60% / 40% */}
      <div className="max-w-7xl mx-auto px-10 mb-10 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 items-center">
        <div>
          <h1
            className="text-5xl font-bold font-[Marcellus] drop-shadow-md leading-tight"
            style={{ color: "#b34a00", marginTop: 0, paddingTop: 0 }}
          >
            Aartis of the Eternal Gods & Goddesses
          </h1>

          <ul
            className="space-y-3 text-xl font-[Poppins] leading-relaxed list-disc pl-5"
            style={{ marginTop: 12, color: "#5a4636" }}
          >
            <li>Chants that purify the mind and awaken devotion.</li>
            <li>Feel the divine presence in every sacred verse.</li>
            <li>Aartis that bring peace, strength, and positivity.</li>
            <li>Let your heart glow with the rhythm of devotion.</li>
            <li>Sacred melodies to connect you with the Divine.</li>
            <li>Begin and end your day with God’s blessings.</li>
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end" style={{ marginTop: 0, paddingTop: 0 }}>
          <img src="/aarti.png" alt="Aarti Artwork" className="w-80 md:w-[360px] lg:w-[480px] drop-shadow-xl" />
        </div>
      </div>

      <ScrollingBorder flipped />

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
        {aartis.map((a) => {
          const title = getText(a.title, lang) || "Untitled";
          const description = getText(a.description, lang);

          return (
            <Link key={a._id} to={`/aartis/${a._id}`} className="block rounded-2xl overflow-hidden">
              <div className="border rounded-2xl bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
                <div className="w-full h-56 bg-gray-100 overflow-hidden">
                  <img src={a.image || "/placeholder.jpg"} alt={title} className="w-full h-full object-cover" />
                </div>

                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900 font-[Playfair]">{title}</h2>

                  <p className="text-sm text-gray-700 font-[Poppins] leading-relaxed">
                    {description ? `${description.slice(0, 120)}...` : "Click to read more"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
