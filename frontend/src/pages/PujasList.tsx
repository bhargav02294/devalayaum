import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface Puja {
  _id: string;
  name: Record<string, string>;
  category: string;
  image?: string;
  description?: Record<string, string>;
  published?: boolean;
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

export default function PujasList() {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  useEffect(() => {
    const loadPujas = async () => {
      try {
        const res = await axios.get<Puja[]>(`${backendURL}/api/pujas`);
        setPujas(res.data.filter((p) => p.published !== false));
      } catch (err) {
        console.error("Failed to load pujas:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPujas();
  }, [backendURL]);

  if (loading)
    return (
      <p className="text-center mt-20 text-orange-700 text-xl font-semibold">
        Loading Pujas...
      </p>
    );

  if (pujas.length === 0)
    return (
      <div className="pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-3xl font-bold mb-3 text-orange-700">
          No Pujas Found
        </h2>
        <p>New divine Pujas will be added soon. Stay tuned 🙏</p>
      </div>
    );

  return (
    <div
      className="pt-24 pb-20"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
      {/* 🔱 Border BEFORE Title */}
      <ScrollingBorder />

      {/* Title Section */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-6">
        <h1 className="text-5xl font-bold text-orange-800 tracking-wide font-[Playfair] drop-shadow-md">
          🕉️ Divine Pujas
        </h1>

        <div className="mt-4 text-lg text-gray-700 leading-relaxed font-[Poppins] space-y-2">
          <p>
            Pujas are sacred rituals performed to invoke blessings, remove
            obstacles, purify karma, and bring peace, prosperity, and
            spiritual upliftment.
          </p>

          <ul className="text-left max-w-xl mx-auto list-disc list-inside text-gray-700 text-base mt-3">
            <li>🙏 Strengthen your spiritual connection</li>
            <li>✨ Remove negative energies and obstacles</li>
            <li>🪔 Invite prosperity, harmony & divine grace</li>
            <li>🌼 Perform rituals dedicated to specific deities</li>
            <li>🔱 Enhance positivity and inner peace</li>
          </ul>
        </div>
      </div>

      {/* 🔱 Mirrored Border After Description */}
      <ScrollingBorder flipVertical />

      {/* Puja Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {pujas.map((p) => {
          const title = p.name?.[lang] || p.name?.en || "Untitled Puja";
          const desc =
            p.description?.[lang]?.slice(0, 120) ||
            p.description?.en?.slice(0, 120) ||
            "";

          return (
            <Link
              to={`/pujas/${p._id}`}
              key={p._id}
              className="group rounded-2xl overflow-hidden"
            >
              {/* Devotional Image Box */}
              <div
                className="relative h-64 bg-white rounded-2xl shadow-lg 
                border border-yellow-300 transition-all duration-500 
                group-hover:shadow-[0_0_30px_rgba(255,150,0,0.6)]
                group-hover:-translate-y-2"
              >
                <img
                  src={p.image || "/placeholder.jpg"}
                  alt={title}
                  className="w-full h-full object-contain p-4 
                  transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Text Section */}
              <div className="pt-4 px-2 text-center">
                <h2 className="text-2xl font-semibold text-orange-800 font-[Playfair]">
                  {title}
                </h2>

                <p className="text-gray-500 text-sm mt-1 capitalize">
                  {p.category}
                </p>

                <p className="text-gray-600 text-sm mt-2 font-[Poppins] leading-relaxed">
                  {desc}...
                </p>

                <p className="mt-3 text-orange-600 font-medium hover:underline">
                  Read More →
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Border */}
      <ScrollingBorder />
    </div>
  );
}
