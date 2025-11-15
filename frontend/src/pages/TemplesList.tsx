import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import i18n from "../i18n";

interface Temple {
  _id: string;
  name: Record<string, string>;
  location: Record<string, string>;
  about?: Record<string, string>;
  mainDeity?: Record<string, string>;
  images?: string[];
}

// 🔱 Border Component
// 🔱 Border Component
function ScrollingBorder({ flipVertical = false }: { flipVertical?: boolean }) {
  return (
    <div className="overflow-hidden py-1">
      <div
        className={`animate-border-left ${flipVertical ? "border-flip-vertical" : ""}`}
        style={{
          backgroundImage: "url('/temple-border.png')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "330px auto",   // 3X BIGGER
          height: "60px",                 // 3X HEIGHT
          width: "300%",
          opacity: 1,
        }}
      />
    </div>
  );
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
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
     {/* TOP border (normal) */}
<ScrollingBorder />


      {/* Title Section */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-6">
        <h1 className="text-5xl font-bold text-orange-800 tracking-wide font-[Playfair] drop-shadow-md">
          🛕 Sacred Temples of India
        </h1>

        <p className="mt-4 text-lg text-gray-700 leading-relaxed font-[Poppins]">
          India, the land of timeless spirituality, is home to sacred temples
          that resonate with divine energy and ancient heritage...
        </p>
      </div>

      {/* AFTER DESCRIPTION (FLIPPED) */}
<ScrollingBorder flipVertical />

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
                <div
                  className="relative h-72 bg-white rounded-2xl shadow-lg 
                  border border-yellow-300 transition-all duration-500 
                  group-hover:shadow-[0_0_30px_rgba(255,150,0,0.6)] 
                  group-hover:-translate-y-2"
                >
                  {temple.images?.[0] ? (
                    <img
                      src={temple.images[0]}
                      alt={name}
                      className="w-full h-full object-contain p-4 
                      transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 italic">
                      No Image
                    </div>
                  )}
                </div>

                <div className="pt-4 px-2 text-center">
                  <h2 className="text-2xl font-semibold text-orange-800 font-[Playfair]">
                    {name}
                  </h2>
                  <p className="text-gray-700 text-sm mt-1">{location}</p>
                  <p className="text-gray-600 text-sm mt-2 font-[Poppins] leading-relaxed">
                    {about}...
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
