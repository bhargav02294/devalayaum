import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface Aarti {
  _id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  image?: string;
  type: string;
}

export default function HomeAartis() {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const lang = i18n.language || "en";

  const [list, setList] = useState<Aarti[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${backendURL}/api/aartis/home-list`)
      .then((res) => setList(res.data))
      .catch((err) => console.error("Aarti Fetch Error:", err))
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  if (list.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">No Aartis available.</p>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-[#b35b00] drop-shadow-md">
          Aartis, Kathas & Mantras
        </h2>
        <p className="mt-3 text-gray-600 text-lg">
          Explore sacred verses for healing, devotion and peace
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
        {list.map((item) => {
          const title = item.title?.[lang] || item.title?.en || "Untitled";
          const desc =
            item.description?.[lang]?.slice(0, 120) ||
            item.description?.en?.slice(0, 120) ||
            "";

          const typeLabel =
            item.type === "aarti"
              ? "Aarti"
              : item.type === "katha"
              ? "Katha"
              : "Mantra";

          return (
            <Link
              key={item._id}
              to={`/aarti/${item._id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-[0_10px_30px_rgba(179,91,0,0.3)] hover:-translate-y-2 transition-all duration-500 relative"
            >
              {/* Type Badge */}
              <div className="absolute top-4 left-4 bg-[#b35b00] text-white text-xs px-3 py-1 rounded-full shadow-md z-10">
                {typeLabel}
              </div>

              {/* Thumbnail */}
              <div className="h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#8a4600] mb-2 leading-snug">
                  {title}
                </h3>

                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  {desc}...
                </p>

                <div className="text-[#b35b00] font-medium text-sm group-hover:underline">
                  Read More →
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center mt-16">
        <Link
          to="/aarti"
          className="relative inline-block group px-6 py-2 border border-[#b35b00] rounded-full text-[#b35b00] font-medium text-sm overflow-hidden transition-all duration-500 shadow-sm"
        >
          {/* sliding animation */}
          <span className="absolute left-0 top-0 h-full w-0 bg-[#b35b00] transition-all duration-700 group-hover:w-full"></span>

          <span className="relative z-10 group-hover:text-white transition duration-500">
            View All Aartis
          </span>
        </Link>
      </div>
    </section>
  );
}
