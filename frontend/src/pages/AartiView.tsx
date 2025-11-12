// E:\devalayaum\frontend\src\pages\AartiView.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface AartiItem {
  _id: string;
  title: Record<string, string>;
  type: "aarti" | "katha" | "mantra";
  description?: Record<string, string>;
  content?: Record<string, string>;
  meaning?: Record<string, string>;
  image?: string;
  temple?: { _id?: string; name?: Record<string, string> } | string | null;
}

export default function AartiView() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<AartiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const lang = i18n.language || "en";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<AartiItem>(`${backendURL}/api/aartis/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error("Failed to load Aarti:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, backendURL]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!item) return <p className="text-center mt-10 text-red-600">Item not found</p>;

  const getText = (field?: Record<string, string>) =>
    field?.[lang] || field?.en || "";

  return (
    <div className="pt-24 px-6 pb-16 max-w-5xl mx-auto">
      <Link to="/aartis" className="text-orange-600 hover:underline">
        ← Back to List
      </Link>

      <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
        {/* Title */}
        <h1 className="text-3xl font-bold text-orange-700 mb-2">
          {getText(item.title)}
        </h1>
        <p className="text-gray-600 capitalize mb-4">📜 {item.type}</p>

        {/* Image */}
        {item.image && (
          <img
            src={item.image}
            alt={getText(item.title)}
            className="w-full rounded-lg mb-6 object-contain"
          />
        )}

        {/* Description */}
        {item.description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {getText(item.description)}
            </p>
          </div>
        )}

        {/* Content */}
        {item.content && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">
              {item.type === "mantra" ? "Mantra Text" : "Main Content"}
            </h2>
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {getText(item.content)}
            </p>
          </div>
        )}

        {/* Meaning (only for Mantra) */}
        {item.type === "mantra" && item.meaning && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">Meaning</h2>
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {getText(item.meaning)}
            </p>
          </div>
        )}

        {/* Related Temple */}
        {typeof item.temple === "object" && item.temple?.name && (
          <p className="mt-6 text-gray-600">
            🛕 Related Temple:{" "}
            <Link
              to={`/temple/${item.temple._id}`}
              className="text-orange-600 hover:underline"
            >
              {getText(item.temple.name)}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
