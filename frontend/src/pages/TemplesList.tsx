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
  const backendURL = import.meta.env.VITE_API_URL;
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

      {/* 🌸 Divine Header Section */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold text-orange-700 tracking-wide drop-shadow-md">
          🛕 भारत के पवित्र मंदिर
        </h1>

        <p className="max-w-3xl mx-auto mt-4 text-gray-700 text-lg leading-relaxed">
          भारत की दिव्यता को दर्शाने वाले प्रसिद्ध और ऐतिहासिक मंदिरों का संग्रह। 
          हर मंदिर अपनी संस्कृति, इतिहास, वास्तुकला और आध्यात्मिक महत्व को समेटे हुए है।
        </p>

        {/* Spiritual Decorative Divider */}
        <div className="mt-6 relative">
          <div className="w-44 mx-auto h-1 bg-gradient-to-r from-orange-300 via-orange-600 to-orange-300 rounded-full shadow-lg"></div>
          <div className="mt-1 text-2xl text-orange-600">ॐ</div>
        </div>
      </div>

      {/* 🌺 Temple Cards */}
      {temples.length === 0 ? (
        <p className="text-center text-gray-500">No temples found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
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
                className="
                  group 
                  rounded-3xl
                  bg-gradient-to-b from-orange-50 to-white
                  border border-orange-200 
                  shadow-md hover:shadow-2xl
                  transition-all duration-300
                  overflow-hidden
                  relative
                "
              >

                {/* 📿 Spiritual Border Top */}
                <div className="absolute top-0 left-0 w-full h-3 bg-[url('/decorative-border-top.png')] bg-repeat-x opacity-80"></div>

                {/* Temple Image */}
                <div className="overflow-hidden h-64 bg-gray-100">
                  <img
                    src={temple.images?.[0] || "/placeholder.jpg"}
                    alt={name}
                    className="
                      w-full h-full object-contain 
                      transition-transform duration-700 
                      group-hover:scale-110
                    "
                  />
                </div>

                {/* Temple info */}
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold text-orange-700 mb-1 tracking-wide">
                    {name}
                  </h2>

                  <p className="text-gray-700 text-sm mb-3">📍 {location}</p>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {about}...
                  </p>

                  <button
                    className="
                      mt-4 bg-orange-600 text-white px-4 py-1.5 rounded-full 
                      shadow hover:bg-orange-700 transition
                    "
                  >
                    View Details →
                  </button>
                </div>

                {/* 📿 Spiritual Border Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-3 bg-[url('/decorative-border-bottom.png')] bg-repeat-x opacity-80"></div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
