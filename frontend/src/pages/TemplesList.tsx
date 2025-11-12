// E:\devalayaum\frontend\src\pages\TemplesList.tsx
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

export default function TemplesList() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const lang = i18n.language || "en";

  useEffect(() => {
    axios
      .get<Temple[]>(`${backendURL}/api/temples`)
      .then((res) => setTemples(res.data))
      .catch((err) => console.error("Failed to load temples:", err))
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading) return <p className="text-center mt-10">Loading temples...</p>;

  return (
    <div className="pt-24 px-6 pb-20 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-orange-700 tracking-wide">
        🛕 Temples of India
      </h1>

      {temples.length === 0 ? (
        <p className="text-center text-gray-500">No temples found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {temples.map((temple) => {
            const name = temple.name?.[lang] || temple.name?.en || "Untitled";
            const location = temple.location?.[lang] || temple.location?.en || "";
            const about =
              temple.about?.[lang]?.slice(0, 140) ||
              temple.about?.en?.slice(0, 140) ||
              "";

            return (
              <Link
                to={`/temples/${temple._id}`}
                key={temple._id}
                className="group bg-white border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300"
              >
                {temple.images?.[0] ? (
                  <img
                    src={temple.images[0]}
                    alt={name}
                    className="w-full h-64 object-contain bg-gray-50 transition-all duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500 italic">
                    No Image
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-2xl font-semibold text-orange-700 mb-1">
                    {name}
                  </h2>
                  <p className="text-gray-700 mb-2 text-sm">📍 {location}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{about}...</p>
                  <p className="text-orange-600 mt-3 font-medium hover:underline">
                    View Details →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
