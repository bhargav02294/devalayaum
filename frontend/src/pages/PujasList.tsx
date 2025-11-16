// Updated PujasList page with professional unified design + MapPin usage
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Inline MapPin Icon — No dependency required
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
          backgroundSize: "330px auto",
          height: "50px",
          width: "300%",
          opacity: 1,
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
    const load = async () => {
      try {
        const res = await axios.get<Puja[]>(`${backendURL}/api/pujas`);
        setPujas(res.data.filter((p) => p.published !== false));
      } catch (err) {
        console.error("Failed to load pujas:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [backendURL]);

  if (loading)
    return (
      <p className="text-center mt-16 text-orange-700 text-xl font-semibold">
        Loading pujas...
      </p>
    );

  if (pujas.length === 0)
    return (
      <div className="pt-20 pb-16 text-center text-gray-600">
        <h2 className="text-3xl font-bold mb-3 text-orange-700">No Pujas Found</h2>
        <p>New divine pujas will be added soon. Stay tuned 🙏</p>
      </div>
    );

  return (
    <div
      className="pt-16 pb-20"
      style={{
        background: "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
      <ScrollingBorder />

      {/* Title Block with reduced gap */}
      <div className="max-w-7xl mx-auto px-10 mt-2 mb-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-orange-800 tracking-wide font-[Playfair] drop-shadow-md text-left">
            Spiritual & Devotional Products
          </h1>

          <ul className="mt-4 space-y-2 text-gray-700 text-lg md:text-xl font-[Poppins] leading-relaxed list-disc pl-5">
            <li>Essential items for daily worship and meditation.</li>
            <li>Malas, rudraksha, and gemstones for inner strength.</li>
            <li>Yantras, rings, and blessed accessories for protection.</li>
            <li>Divine idols and puja essentials for your sacred space.</li>
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src="/puja.png"
            alt="Puja Decorative Artwork"
            className="w-[340px] md:w-[440px] lg:w-[520px] xl:w-[560px] drop-shadow-xl"
          />
        </div>
      </div>

      <ScrollingBorder flipped />

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {pujas.map((p) => {
          const title = p.name?.[lang] || p.name?.en;
          const desc = p.description?.[lang] || p.description?.en || "";

          return (
            <Link
              key={p._id}
              to={`/pujas/${p._id}`}
              className="block rounded-2xl overflow-hidden"
            >
              <div className="border rounded-2xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="w-full h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={p.image || "/placeholder.jpg"}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900 text-left font-[Playfair]">
                    {title}
                  </h2>

                  {/* Category Row with MapPin */}
                  <div className="flex items-center text-gray-600 text-sm text-left">
                    <MapPin size={18} className="mr-2" />
                    <span className="capitalize">{p.category}</span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed text-left font-[Poppins]">
                    {desc.slice(0, 140)}...
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
