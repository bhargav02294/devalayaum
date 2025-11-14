// E:\devalayaum\frontend\src\admin\pages\TempleDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import i18n from "../../i18n";
import extractMessage from "../../utils/extractMessage";
import type { Temple } from "../../types/Temple";

export default function TempleDetail() {
  const { id } = useParams<{ id: string }>();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n?.language || "en";

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        const res = await axios.get<Temple>(`${backendURL}/api/temples/${id}`);
        setTemple(res.data);
      } catch (err) {
        console.error("Temple fetch error:", extractMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchTemple();
  }, [id, backendURL]);

  if (loading) return <p className="text-center mt-10">Loading temple details...</p>;
  if (!temple) return <p className="text-center mt-10 text-red-600">Temple not found</p>;

  const display = (field: any) => field?.[lang as keyof typeof field] || field?.en || "-";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Link to="/admin/temples" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Temples
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{display(temple.name)}</h1>
      <p className="text-gray-600 mb-2">📍 {display(temple.location)}</p>
      {temple.mainDeity && (
        <p className="text-gray-700 mb-2">🕉️ <strong>Main Deity:</strong> {display(temple.mainDeity)}</p>
      )}

      {/* IMAGES */}
      {temple.images?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
          {temple.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Temple-${i}`}
              className="rounded-lg w-full h-56 object-cover border"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No images uploaded</p>
      )}

      {/* ABOUT */}
      <div className="border rounded-lg p-4 my-4 bg-white">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700 whitespace-pre-line">{display(temple.about)}</p>
      </div>

      {/* RELIGIOUS INFO */}
      <div className="border rounded-lg p-4 my-4 bg-white">
        <h2 className="text-xl font-semibold mb-3">Religious & Historical Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <p><strong>Deity Description:</strong> {display(temple.deityDescription)}</p>
          <p><strong>Significance:</strong> {display(temple.significance)}</p>
          <p><strong>History:</strong> {display(temple.history)}</p>
          <p><strong>Architecture:</strong> {display(temple.architecture)}</p>
          <p><strong>Builder / Trust:</strong> {display(temple.builderOrTrust)}</p>
          <p><strong>Consecration Date:</strong> {temple.consecrationDate || "-"}</p>
        </div>
      </div>

      {/* DARSHAN & AARTI */}
      <div className="border rounded-lg p-4 my-4 bg-white">
        <h2 className="text-xl font-semibold mb-3">Darshan & Aarti Information</h2>
        <p><strong>Darshan Timing:</strong> {display(temple.darshanTiming)}</p>
        <p><strong>Morning Aarti:</strong> {temple.aartiTimings?.morning || "-"}</p>
        <p><strong>Shringar Aarti:</strong> {temple.aartiTimings?.shringar || "-"}</p>
        <p><strong>Shayan Aarti:</strong> {temple.aartiTimings?.shayan || "-"}</p>
        <p><strong>Special Pooja Info:</strong> {display(temple.specialPoojaInfo)}</p>
      </div>

      {/* VISITOR INFO */}
      <div className="border rounded-lg p-4 my-4 bg-white">
        <h2 className="text-xl font-semibold mb-3">Visitor Information</h2>
        <p><strong>Dress Code:</strong> {display(temple.dressCode)}</p>
        <p><strong>Entry Rules:</strong> {display(temple.entryRules)}</p>
        <p><strong>Prohibited Items:</strong> {(temple.prohibitedItems || []).join(", ") || "-"}</p>
        <p>
          <strong>Locker Facility:</strong>{" "}
          {temple.lockerFacility ? "✅ Available" : "❌ Not Available"}
        </p>
      </div>

      {/* TRAVEL INFO */}
      <div className="border rounded-lg p-4 my-4 bg-white">
        <h2 className="text-xl font-semibold mb-3">Travel & Connectivity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <p><strong>How to Reach:</strong> {display(temple.howToReach)}</p>
          <p><strong>Nearest Airport:</strong> {display(temple.nearestAirport)}</p>
          <p><strong>Nearest Railway:</strong> {display(temple.nearestRailway)}</p>
          <p><strong>Road Connectivity:</strong> {display(temple.roadConnectivity)}</p>
        </div>
        {temple.mapLocation?.lat && temple.mapLocation?.lng && (
          <div className="mt-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${temple.mapLocation.lat},${temple.mapLocation.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              🌍 View on Google Maps
            </a>
          </div>
        )}
      </div>

      {/* NEARBY PLACES */}
      <div className="border rounded-lg p-4 my-4 bg-white">
        <h2 className="text-xl font-semibold mb-3">Nearby Places</h2>
        {temple.nearbyPlaces?.length ? (
          temple.nearbyPlaces.map((place, i) => (
            <div key={i} className="mb-3 border-b pb-2">
              <p className="font-semibold">{display(place.name)}</p>
              <p className="text-gray-600">{display(place.description)}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No nearby places listed.</p>
        )}
      </div>

      {/* META INFO */}
      <div className="border rounded-lg p-4 my-4 bg-white">
        <h2 className="text-xl font-semibold mb-3">Meta Information</h2>
        <p><strong>Published:</strong> {temple.published ? "Yes" : "No"}</p>
        <p><strong>Created:</strong> {new Date(temple.createdAt!).toLocaleString()}</p>
        <p><strong>Updated:</strong> {new Date(temple.updatedAt!).toLocaleString()}</p>
      </div>
    </div>
  );
}
