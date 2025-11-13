import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface Temple {
  _id: string;
  name: Record<string, string>;
  location: Record<string, string>;
  images: string[];
}

export default function HomeTemples() {
  const backendURL = import.meta.env.VITE_API_URL;  // ✅ FIXED
  const navigate = useNavigate();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const lang = i18n.language || "en";
  const trans = (obj: Record<string, string> | undefined) =>
    obj?.[lang] || obj?.en || "";

  useEffect(() => {
    axios
      .get(`${backendURL}/api/temples/home-list`)
      .then((res) => setTemples(res.data))
      .catch((err) => console.error("Temple fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl font-medium text-gray-600">
        Loading Temples...
      </div>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-[#fff7ee] to-[#ffffff]">
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-[#b35b00] tracking-wide">
          Sacred Temples
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Explore ancient temples known for their spiritual presence and heritage.
        </p>
      </div>

      {/* Cards Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
        {temples.map((temple) => (
          <div
            key={temple._id}
            onClick={() => navigate(`/temples/${temple._id}`)}
            className="cursor-pointer rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl border border-[#e8d7c0] transition transform hover:-translate-y-2 hover:scale-[1.02] duration-300"
          >
            {/* Image */}
            <div className="relative w-full h-72 overflow-hidden">
              <img
                src={temple.images?.[0] || "/placeholder.jpg"}
                alt={trans(temple.name)}
                className="w-full h-full object-cover transition duration-700 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-[#bf6000] mb-2 leading-snug">
                {trans(temple.name)}
              </h3>

              <p className="text-gray-700 text-sm leading-relaxed">
                {trans(temple.location) || "Location not available"}
              </p>

              {/* Divider */}
              <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between text-sm">
                <span className="text-[#b35b00] font-medium tracking-wide">
                  Temple
                </span>

                <span className="text-gray-500 hover:text-[#b35b00] transition">
                  View Details →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-16">
        <button
  onClick={() => navigate("/temples")}
  className="relative px-6 py-2 text-[#b35b00] font-semibold text-base border border-[#b35b00] rounded-full overflow-hidden
             transition-all duration-500 ease-out hover:text-white hover:bg-[#b35b00]/20"
>
  {/* Sliding background animation */}
  <span
    className="absolute left-0 bottom-0 h-full w-0 bg-[#b35b00]
               transition-all duration-700 ease-out
               group-hover:w-full rounded-full"
  ></span>

  {/* Text*/}
  <span className="relative z-10">
    View All Temples
  </span>

  {/* Underline Animation */}
  <span
    className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#b35b00]
               transition-all duration-700 ease-out group-hover:w-full"
  ></span>
</button>

      </div>
    </section>
  );
}
