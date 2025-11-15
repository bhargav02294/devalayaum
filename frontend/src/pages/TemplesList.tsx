import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import i18n from "../i18n";

// Mandala Border Image URL (online)
const BORDER_URL =
  "data:image/jpeg;base64,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";

interface Temple {
  _id: string;
  name: Record<string, string>;
  location: Record<string, string>;
  about?: Record<string, string>;
  mainDeity?: Record<string, string>;
  images?: string[];
}

export default function TemplesList() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  useEffect(() => {
    axios
      .get<Temple[]>(`${backendURL}/api/temples`)
      .then((res) => setTemples(res.data))
      .catch((err) => console.error("Failed to load temples:", err))
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading)
    return (
      <p className="text-center mt-20 text-orange-700 text-xl font-semibold">
        Loading temples...
      </p>
    );

  return (
    <div
      className="pt-24 pb-20"
      style={{
        background: "linear-gradient(to bottom, #fef3c7 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
      {/* Decorative Top Border */}
      <div className="w-full flex justify-center mb-6">
        <img
          src={BORDER_URL}
          alt="Decorative Border"
          className="w-full max-w-4xl opacity-90"
        />
      </div>

      {/* TITLE SECTION */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-12">
        <h1 className="text-5xl font-bold text-orange-800 tracking-wide font-[Playfair] drop-shadow-sm">
          🛕 Sacred Temples of India
        </h1>

        <p className="mt-4 text-lg text-gray-700 leading-relaxed font-[Poppins]">
          India, the land of spirituality, is home to ancient temples where divine
          energy flows eternally. Explore the sacred spaces that preserve
          centuries of tradition, devotion, and cultural heritage.
        </p>
      </div>

      {/* Decorative Bottom Border */}
      <div className="w-full flex justify-center mb-12 -mt-4">
        <img
          src={BORDER_URL}
          alt="Decorative Border"
          className="w-full max-w-4xl opacity-90 rotate-180"
        />
      </div>

      {/* Temple Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {temples.length === 0 ? (
          <p className="text-center text-gray-500 col-span-3">
            No temples found.
          </p>
        ) : (
          temples.map((temple) => {
            const name = temple.name?.[lang] || temple.name?.en || "Untitled";
            const location =
              temple.location?.[lang] || temple.location?.en || "";
            const about =
              temple.about?.[lang]?.slice(0, 140) ||
              temple.about?.en?.slice(0, 140) ||
              "";

            return (
              <Link
                to={`/temples/${temple._id}`}
                key={temple._id}
                className="group rounded-2xl overflow-hidden"
              >
                {/* Image Box */}
                <div className="relative h-72 bg-white rounded-2xl shadow-lg 
                  border border-yellow-200 transition-all duration-500 
                  group-hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] 
                  group-hover:-translate-y-2">

                  {temple.images?.[0] ? (
                    <img
                      src={temple.images[0]}
                      alt={name}
                      className="w-full h-full object-contain p-4 
                      transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 italic">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="pt-4 px-2 text-center">
                  <h2 className="text-2xl font-semibold text-orange-800 font-[Playfair]">
                    {name}
                  </h2>

                  <p className="text-gray-700 text-sm mt-1">📍 {location}</p>

                  <p className="text-gray-600 text-sm mt-2 font-[Poppins] leading-relaxed">
                    {about}...
                  </p>

                  
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Decorative Final Border */}
      <div className="w-full flex justify-center mt-16">
        <img
          src={BORDER_URL}
          alt="https://images.pexels.com/photos/57901/pexels-photo-57901.jpeg"
          className="w-full max-w-4xl opacity-90"
        />
      </div>
    </div>
  );
}
