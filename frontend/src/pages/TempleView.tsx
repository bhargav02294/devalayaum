// E:\devalayaum\frontend\src\pages\TempleView.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Complete type matching backend schema
interface Temple {
  _id: string;
  name: Record<string, string>;
  location: Record<string, string>;
  about?: Record<string, string>;
  images?: string[];

  // Religious Info
  mainDeity?: Record<string, string>;
  deityDescription?: Record<string, string>;
  significance?: Record<string, string>;
  history?: Record<string, string>;
  architecture?: Record<string, string>;
  builderOrTrust?: Record<string, string>;
  consecrationDate?: string;

  // Darshan & Aarti Info
  darshanTiming?: Record<string, string>;
  aartiTimings?: { morning?: string; shringar?: string; shayan?: string };
  specialPoojaInfo?: Record<string, string>;

  // Visitor Info
  dressCode?: Record<string, string>;
  entryRules?: Record<string, string>;
  prohibitedItems?: string[];
  lockerFacility?: boolean;

  // Travel Info
  howToReach?: Record<string, string>;
  nearestAirport?: Record<string, string>;
  nearestRailway?: Record<string, string>;
  roadConnectivity?: Record<string, string>;
  mapLocation?: { lat?: number; lng?: number };

  // Nearby Places
  nearbyPlaces?: {
    name: Record<string, string>;
    description: Record<string, string>;
  }[];

  // Meta
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function TempleView() {
  const { id } = useParams<{ id: string }>();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_API_URL; // ✅ FIXED
  const lang = i18n.language || "en";

  const getText = (field?: Record<string, string>) =>
    field?.[lang] || field?.en || "";

  useEffect(() => {
    if (!id) return;
    axios
      .get<Temple>(`${backendURL}/api/temples/${id}`)
      .then((res) => setTemple(res.data))
      .catch((err) => console.error("Error fetching temple:", err))
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  if (loading) return <p className="text-center mt-10">Loading temple details...</p>;
  if (!temple) return <p className="text-center mt-10 text-red-600">Temple not found</p>;

  return (
    <div className="pt-24 px-6 pb-20 max-w-6xl mx-auto">
      <Link
        to="/temples"
        className="text-orange-600 hover:underline inline-block mb-6"
      >
        ← Back to Temples
      </Link>

      <div className="bg-white shadow-xl rounded-2xl p-8">
        {/* 🛕 Title */}
        <h1 className="text-4xl font-bold text-orange-700 mb-4">
          {getText(temple.name)}
        </h1>
        {temple.published === false && (
          <span className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded">
            Unpublished
          </span>
        )}
        <p className="text-gray-700 mt-2 text-lg">
          📍 <strong>Location:</strong> {getText(temple.location)}
        </p>

        {/* 🖼️ Images */}
        {temple.images?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            {temple.images.map((img, i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-gray-50">
                <img
                  src={img}
                  alt={`Temple-${i}`}
                  className="w-full h-[420px] object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic my-4">No images available</p>
        )}

        {/* 🕉️ Basic Info */}
        <Section title="About" text={getText(temple.about)} />

        {/* 🙏 Religious Info */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">
            Religious & Historical Information
          </h2>
          <Field label="Main Deity" value={getText(temple.mainDeity)} />
          <Field label="Deity Description" value={getText(temple.deityDescription)} />
          <Field label="Significance" value={getText(temple.significance)} />
          <Field label="History" value={getText(temple.history)} />
          <Field label="Architecture" value={getText(temple.architecture)} />
          <Field label="Builder / Trust" value={getText(temple.builderOrTrust)} />
          <Field label="Consecration Date" value={temple.consecrationDate} />
        </div>

        {/* 🕉️ Darshan & Aarti Info */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">
            Darshan & Aarti Information
          </h2>
          <Field label="Darshan Timings" value={getText(temple.darshanTiming)} />
          {temple.aartiTimings && (
            <div className="text-gray-700 mb-2">
              <p>🌅 <strong>Morning Aarti:</strong> {temple.aartiTimings.morning || "-"}</p>
              <p>🌸 <strong>Shringar Aarti:</strong> {temple.aartiTimings.shringar || "-"}</p>
              <p>🌙 <strong>Shayan Aarti:</strong> {temple.aartiTimings.shayan || "-"}</p>
            </div>
          )}
          <Field label="Special Pooja Info" value={getText(temple.specialPoojaInfo)} />
        </div>

        {/* 👕 Visitor Info */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">Visitor Information</h2>
          <Field label="Dress Code" value={getText(temple.dressCode)} />
          <Field label="Entry Rules" value={getText(temple.entryRules)} />
          {temple.prohibitedItems?.length ? (
            <Field
              label="Prohibited Items"
              value={temple.prohibitedItems.join(", ")}
            />
          ) : null}
          <p className="text-gray-700 mb-2">
            🔐 <strong>Locker Facility:</strong>{" "}
            {temple.lockerFacility ? "✅ Available" : "❌ Not Available"}
          </p>
        </div>

        {/* 🚗 Travel & Map */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">Travel & Connectivity</h2>
          <Field label="How to Reach" value={getText(temple.howToReach)} />
          <Field label="Nearest Airport" value={getText(temple.nearestAirport)} />
          <Field label="Nearest Railway" value={getText(temple.nearestRailway)} />
          <Field label="Road Connectivity" value={getText(temple.roadConnectivity)} />

          {temple.mapLocation?.lat && temple.mapLocation?.lng && (
            <div className="mt-4">
              <iframe
                title="Temple Location"
                width="100%"
                height="400"
                src={`https://www.google.com/maps?q=${temple.mapLocation.lat},${temple.mapLocation.lng}&output=embed`}
                className="rounded-xl border shadow"
              ></iframe>
            </div>
          )}
        </div>

        {/* 🏞️ Nearby Places */}
        {temple.nearbyPlaces?.length ? (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-orange-700 mb-3">
              Nearby Places
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {temple.nearbyPlaces.map((place, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-orange-50 hover:bg-orange-100 transition-all"
                >
                  <p className="font-semibold text-orange-800 mb-1">
                    {getText(place.name)}
                  </p>
                  <p className="text-gray-700">{getText(place.description)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* 🌐 Meta Info */}
        <div className="mt-10 border-t pt-4">
          <h2 className="text-2xl font-semibold text-orange-700 mb-3">
            Meta Information
          </h2>
          <p className="text-gray-700 mb-1">
            <strong>Published:</strong> {temple.published ? "Yes" : "No"}
          </p>
          {temple.createdAt && (
            <p className="text-gray-700 mb-1">
              <strong>Created:</strong>{" "}
              {new Date(temple.createdAt).toLocaleString()}
            </p>
          )}
          {temple.updatedAt && (
            <p className="text-gray-700">
              <strong>Updated:</strong>{" "}
              {new Date(temple.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔸 Reusable Section
function Section({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-orange-700 mb-2">{title}</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
}

// 🔸 Reusable Field Display
function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <p className="text-gray-700 mb-2">
      <strong>{label}:</strong> {value}
    </p>
  );
}
