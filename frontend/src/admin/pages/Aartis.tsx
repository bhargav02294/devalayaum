// E:\devalayaum\frontend\src\admin\pages\Aartis.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../../i18n";
import extractMessage from "../../utils/extractMessage";

interface AartiItem {
  _id: string;
  title: Record<string, string>;
  type: "aarti" | "katha" | "mantra";
  description?: Record<string, string>;
  image?: string;
  published?: boolean;
}

export default function AartisAdmin() {
  const [items, setItems] = useState<AartiItem[]>([]);
  const [loading, setLoading] = useState(true);
const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchAartis = async () => {
      try {
        const res = await axios.get<AartiItem[]>(`${backendURL}/api/aartis`);
        setItems(res.data);
      } catch (err) {
        console.error("Fetch aartis failed:", extractMessage(err));
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAartis();
  }, [backendURL]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      const token = localStorage.getItem("ADMIN_TOKEN");
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      await axios.delete(`${backendURL}/api/aartis/${id}`, { headers });
      setItems((prev) => prev.filter((p) => p._id !== id));
      alert("✅ Deleted successfully!");
    } catch (err) {
      alert("❌ Delete failed: " + extractMessage(err));
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🕉️ Manage Aartis / Kathas / Mantras</h2>
        <Link
          to="/admin/aartis/add"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Add New
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-600">No items found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it) => {
            const title = it.title?.[lang] || it.title?.en || "Untitled";
            const desc =
              it.description?.[lang]?.slice(0, 100) ||
              it.description?.en?.slice(0, 100) ||
              "";
            return (
              <div
                key={it._id}
                className="border rounded-lg shadow-md hover:shadow-lg transition p-4 bg-white"
              >
                {it.image && (
                  <img
                    src={it.image}
                    alt={title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold text-orange-700">{title}</h3>
                <p className="text-gray-600 capitalize">{it.type}</p>
                <p className="mt-2 text-gray-700 text-sm">{desc}...</p>
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/admin/aartis/edit/${it._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(it._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
