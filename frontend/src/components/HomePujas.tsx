import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import i18n from "../i18n";

interface Puja {
  _id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  price?: number;
  images?: string[];
}


export default function HomePujas() {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_API_URL; // ✅ FIXED
  const lang = i18n.language || "en";
  useEffect(() => {
    axios
      .get(`${backendURL}/api/pujas/home-list`)
      .then((res) => setPujas(res.data))
      .catch((err) => console.error("Failed to load pujas:", err))
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading)
    return <p className="text-center text-gray-600 py-10">Loading pujas...</p>;

  if (pujas.length === 0)
    return <p className="text-center text-gray-500 py-10">No Pujas Available</p>;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-orange-50">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-[#b35b00] drop-shadow-md">
          Popular Pujas
        </h2>
        <p className="mt-3 text-gray-600 text-lg">
          Experience spiritually uplifting pujas performed with devotion
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        {pujas.map((puja) => {
          const name = puja.name?.[lang] || puja.name?.en || "";
          const desc =
            puja.description?.[lang]?.substring(0, 120) ||
            puja.description?.en?.substring(0, 120) ||
            "";

          return (
            <div
              key={puja._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(179,91,0,0.3)] transition-all duration-500 border border-orange-100"
            >
              {/* Image section */}
              <div className="relative h-72 overflow-hidden">
                {puja.images?.[0] ? (
                  <img
                    src={puja.images[0]}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                  />
                ) : (
                  <div className="h-72 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Subtle top gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>

                <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold drop-shadow-lg leading-tight">
                  {name}
                </h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  {desc}...
                </p>

                {/* Book Button */}
                <Link
                  to={`/pujas/${puja._id}`}
                  className="block w-full text-center bg-[#b35b00] hover:bg-[#8f4500] text-white text-base py-2 rounded-lg transition shadow-md"
                >
                  Book Now
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center mt-14">
        <Link
          to="/pujas"
          className="relative inline-block group px-5 py-2 border border-[#b35b00] rounded-full text-[#b35b00] font-semibold text-sm overflow-hidden transition-all duration-500"
        >
          {/* sliding background */}
          <span
            className="absolute left-0 top-0 w-0 h-full bg-[#b35b00] transition-all duration-700 group-hover:w-full"
          ></span>

          {/* text */}
          <span className="relative z-10 group-hover:text-white transition-all duration-500">
            View All Pujas
          </span>
        </Link>
      </div>
    </section>
  );
}
