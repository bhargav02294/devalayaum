import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import i18n from "../i18n";
import { MapPin } from "lucide-react";

interface Temple {
  _id: string;
  name: Record<string, string>;
  location: Record<string, string>;
  about?: Record<string, string>;
  mainDeity?: Record<string, string>;
  images?: string[];
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
          height: "60px",
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
      <ScrollingBorder />

      <div className="max-w-7xl mx-auto px-10 mt-10 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl font-bold text-orange-800 tracking-wide font-[Playfair] drop-shadow-md text-left">Sacred Temples of India – Abodes of Divine Energy </h1>

          <ul className="mt-6 space-y-4 text-gray-700 text-xl font-[Poppins] leading-relaxed list-disc pl-5">
            <li>Experience ancient temples where divine energies have been worshipped for thousands of years.</li>
            <li>Each temple echoes timeless traditions, sacred rituals, and spiritual wisdom.</li>
            <li>Pilgrimage sites that uplift the soul, strengthen faith, and connect devotees with the divine.</li>
            <li>Marvel at magnificent architecture built with devotion, precision, and spiritual intent.</li>
            <li>Every visit brings peace, blessings, and a deeper connection to one’s spiritual journey.</li>
          </ul>

        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src="/temple.png"
            alt="Temple Decorative Artwork"
            className="w-80 lg:w-[420px] drop-shadow-xl"
          />
        </div>
      </div>

      <ScrollingBorder flipped />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {temples.length === 0 ? (
          <p className="text-center text-gray-500 col-span-3">No temples found.</p>
        ) : (
          temples.map((temple) => {
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
                className="block rounded-2xl overflow-hidden"
              >
                <div
                  className="border rounded-2xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="w-full h-56 bg-gray-100 overflow-hidden">
                    {temple.images?.[0] ? (
                      <img
                        src={temple.images[0]}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 italic">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 text-left font-[Playfair]">
                        {name}
                      </h2>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin size={18} className="mr-1" />
                        <span className="truncate max-w-[110px] text-left">
                          {location}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed text-left font-[Poppins]">
                      {about}...
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
