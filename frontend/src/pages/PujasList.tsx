// Updated PujasList page with professional mobile + desktop responsive design
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Inline MapPin Icon
function MapPin({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
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
      />
    </svg>
  );
}

interface Puja {
  _id: string;
  name: Record<string, string>;
  category: string;
  image?: string;
  description?: Record<string, string>;
  published?: boolean;
}

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
          backgroundSize: "260px auto", // MOBILE optimized
          height: "45px", // MOBILE optimized
          width: "300%",
        }}
      />
    </div>
  );
}

export default function PujasList() {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get<Puja[]>(`${backendURL}/api/pujas`);
        setPujas(res.data.filter((p) => p.published !== false));
      } catch (err) {
        console.error("Failed to load pujas:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backendURL]);

  if (loading)
    return (
      <p className="text-center mt-20 text-orange-700 text-xl font-semibold">
        Loading pujas...
      </p>
    );

  if (pujas.length === 0)
    return (
      <div className="pt-20 md:pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-orange-700">
          No Pujas Found
        </h2>
        <p className="text-sm md:text-base">
          New divine pujas will be added soon. Stay tuned 🙏
        </p>
      </div>
    );

  return (
    <div
      className="pt-20 md:pt-24 pb-16"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
      {/* Top border */}
      <ScrollingBorder />

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 mb-10 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 items-center">

        {/* LEFT TEXT */}
        <div>
          <h1 className="text-3xl md:text-5xl font-bold font-[Marcellus] text-[#b34a00] drop-shadow-md leading-tight">
             Divine Rituals to Bring Blessings Into Your Life
          </h1>

          <ul className="mt-4 space-y-2 md:space-y-3 text-gray-700 text-base md:text-xl font-[Poppins] leading-relaxed list-disc pl-5">
            <li>Perform sacred pujas with pure devotion and divine blessings.</li>
            <li>Bring peace, prosperity & protection into your home.</li>
            <li>Authentic Vedic pujas performed by trusted priests.</li>
            <li>Every puja begins with faith — and ends with blessings.</li>
            <li>Let divine rituals bring harmony to your life.</li>
            <li>Book your puja effortlessly and receive God’s grace.</li>
          </ul>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center lg:justify-end">
          <img
            src="/puja.png"
            alt="Puja Decorative Artwork"
            className="w-56 md:w-80 lg:w-[420px] drop-shadow-xl"
          />
        </div>
      </div>

      {/* Bottom border */}
      <ScrollingBorder flipped />

      {/* PUJA CARDS */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-10">

        {pujas.map((p) => {
          const title = p.name?.[lang] || p.name?.en || "Untitled Puja";
          const desc = p.description?.[lang] || p.description?.en || "";

          return (
            <Link
              key={p._id}
              to={`/pujas/${p._id}`}
              className="block rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              {/* IMAGE */}
              <div className="w-full h-48 md:h-56 bg-gray-100 overflow-hidden rounded-t-2xl">
                <img
                  src={p.image || "/placeholder.jpg"}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 text-left font-[Playfair]">
                  {title}
                </h2>

                {/* Category */}
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin size={17} className="mr-1" />
                  <span className="truncate max-w-[100px] md:max-w-[150px]">{p.category}</span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed font-[Poppins]">
                  {desc.slice(0, 130)}...
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
