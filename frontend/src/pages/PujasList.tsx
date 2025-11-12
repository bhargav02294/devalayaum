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
}

export default function PujasList() {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const lang = i18n.language || "en";

  useEffect(() => {
    const loadPujas = async () => {
      try {
        const res = await axios.get<Puja[]>(`${backendURL}/api/pujas`);
        setPujas(res.data.filter((p) => p.published !== false)); // only published
      } catch (err) {
        console.error("Failed to load pujas:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPujas();
  }, [backendURL]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading Pujas...</p>;

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
    <div className="pt-24 pb-16 px-6 md:px-20 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-orange-700 mb-12">
        🕉️ Divine Pujas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
              className="bg-white rounded-2xl border shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              <img
                src={p.image || "/placeholder.jpg"}
                alt={title}
                className="h-56 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-orange-700 mb-1">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm capitalize mb-2">
                  {p.category}
                </p>
                <p className="text-gray-700 text-sm">{desc}...</p>
                <p className="mt-3 text-orange-600 font-medium hover:underline">
                  Read More →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
