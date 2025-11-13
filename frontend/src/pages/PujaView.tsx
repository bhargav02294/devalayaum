import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface Puja {
  _id: string;
  name: Record<string, string>;
  category: string;
  subCategory?: string;
  image?: string;
  images?: string[];
  videoUrl?: string;
  deityAssociated?: Record<string, string>;
  description?: Record<string, string>;
  whyPerform?: Record<string, string>;
  benefits?: Record<string, string>;
  procedure?: Record<string, string>;
  mantra?: Record<string, string>;
  duration?: string;
  materialsRequired?: Record<string, string>;
  availableAt?: Record<string, string>[];
  placesDescription?: Record<string, string>;
  packages?: {
    key: string;
    title: Record<string, string>;
    price?: number;
    discountPrice?: number;
    details?: Record<string, string>;
    benefits?: Record<string, string>;
  }[];
}

export default function PujaView() {
  const { id } = useParams<{ id: string }>();
  const [puja, setPuja] = useState<Puja | null>(null);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_API_URL; // ✅ FIXED
  const lang = i18n.language || "en";

  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  useEffect(() => {
    const fetchPuja = async () => {
      try {
        const res = await axios.get<Puja>(`${backendURL}/api/pujas/${id}`);
        setPuja(res.data);
      } catch (err) {
        console.error("Failed to fetch puja:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPuja();
  }, [id, backendURL]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading Puja...</p>;
  if (!puja)
    return <p className="text-center mt-10 text-gray-600">Puja not found.</p>;

  return (
    <div className="pt-24 pb-20 px-6 md:px-20 bg-gray-50 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Main Image */}
        <div className="md:w-1/2">
          <img
            src={puja.image || "/placeholder.jpg"}
            alt={t(puja.name)}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
          {/* Gallery */}
          {puja.images && puja.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {puja.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="h-28 w-full object-cover rounded-lg border"
                  alt={`Gallery ${i}`}
                />
              ))}
            </div>
          )}
          {/* Video */}
          {puja.videoUrl && (
            <a
              href={puja.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center mt-4 text-orange-600 font-semibold underline"
            >
              🎥 Watch Puja Video
            </a>
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-orange-700 mb-2">
            {t(puja.name)}
          </h1>
          <p className="text-gray-700 text-sm mb-2">
            Category: {puja.category}
            {puja.subCategory && ` > ${puja.subCategory}`}
          </p>

          {puja.deityAssociated && (
            <p className="text-gray-600 italic mb-3">
              Deity: {t(puja.deityAssociated)}
            </p>
          )}

          <p className="text-gray-700 mb-4 leading-relaxed text-justify">
            {t(puja.description)}
          </p>

          {/* Core Spiritual Details */}
          <div className="space-y-6">
            {puja.whyPerform && (
              <section>
                <h3 className="text-xl font-semibold text-orange-700 mb-1">
                  🙏 Why Perform
                </h3>
                <p className="text-gray-700">{t(puja.whyPerform)}</p>
              </section>
            )}

            {puja.benefits && (
              <section>
                <h3 className="text-xl font-semibold text-orange-700 mb-1">
                  🌸 Benefits
                </h3>
                <p className="text-gray-700">{t(puja.benefits)}</p>
              </section>
            )}

            {puja.procedure && (
              <section>
                <h3 className="text-xl font-semibold text-orange-700 mb-1">
                  🔱 Procedure
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {t(puja.procedure)}
                </p>
              </section>
            )}

            {puja.mantra && (
              <section>
                <h3 className="text-xl font-semibold text-orange-700 mb-1">
                  🕉️ Main Mantra
                </h3>
                <p className="text-gray-800 font-medium italic">
                  {t(puja.mantra)}
                </p>
              </section>
            )}

            {puja.materialsRequired && (
              <section>
                <h3 className="text-xl font-semibold text-orange-700 mb-1">
                  🪔 Materials Required
                </h3>
                <p className="text-gray-700">{t(puja.materialsRequired)}</p>
              </section>
            )}

            {puja.duration && (
              <section>
                <h3 className="text-xl font-semibold text-orange-700 mb-1">
                  ⏱️ Duration
                </h3>
                <p className="text-gray-700">{puja.duration}</p>
              </section>
            )}

            {puja.availableAt && puja.availableAt.length > 0 && (
              <section>
                <h3 className="text-xl font-semibold text-orange-700 mb-1">
                  🏯 Available At
                </h3>
                <ul className="list-disc ml-5 text-gray-700">
                  {puja.availableAt.map((loc, idx) => (
                    <li key={idx}>{t(loc)}</li>
                  ))}
                </ul>
              </section>
            )}

            {puja.placesDescription && (
              <section>
                <h3 className="text-xl font-semibold text-orange-700 mb-1">
                  📍 Place Details
                </h3>
                <p className="text-gray-700">{t(puja.placesDescription)}</p>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Packages Section */}
      {puja.packages && puja.packages.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-orange-700 mb-8">
            📦 Puja Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {puja.packages.map((pkg) => (
              <div
                key={pkg.key}
                className="bg-white rounded-2xl shadow-md border hover:shadow-xl transition p-5"
              >
                <h3 className="text-xl font-bold text-orange-700 mb-2">
                  {t(pkg.title) || pkg.key.toUpperCase()}
                </h3>
                <p className="text-gray-800 font-semibold text-lg">
                  ₹{pkg.discountPrice || pkg.price}
                  {pkg.discountPrice && (
                    <span className="text-sm line-through text-gray-500 ml-2">
                      ₹{pkg.price}
                    </span>
                  )}
                </p>
                {pkg.details && (
                  <p className="text-gray-700 mt-2 text-sm">{t(pkg.details)}</p>
                )}
                {pkg.benefits && (
                  <p className="text-gray-700 mt-2 text-sm italic">
                    {t(pkg.benefits)}
                  </p>
                )}

                {/* ✅ Book Now Link */}
                <Link
                  to={`/pujas/${puja._id}/book/${pkg.key}`}
                  className="mt-5 inline-block text-center bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 w-full"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
