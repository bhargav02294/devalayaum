import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../../i18n";

interface Puja {
  _id: string;
  name: Record<string, string>;
  category: string;
  image?: string;
  packages?: { price?: number; discountPrice?: number }[];
}

export default function Pujas() {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);
const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchPujas = async () => {
      try {
        const res = await axios.get<Puja[]>(`${backendURL}/api/pujas`);
        setPujas(res.data);
      } catch (err) {
        console.error("Failed to load pujas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPujas();
  }, [backendURL]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this puja?")) return;
    try {
      const token = localStorage.getItem("ADMIN_TOKEN");
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      await axios.delete(`${backendURL}/api/pujas/${id}`, { headers });
      setPujas((prev) => prev.filter((p) => p._id !== id));
      alert("✅ Puja deleted successfully!");
    } catch (err) {
      alert("❌ Failed to delete puja.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading Pujas...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-700">🕉️ All Pujas</h2>
        <Link
          to="/admin/pujas/new"
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          ➕ Add Puja
        </Link>
      </div>

      {/* No pujas */}
      {pujas.length === 0 ? (
        <p className="text-gray-600">No pujas found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pujas.map((p) => {
            const title = p.name?.[lang] || p.name?.en || "Untitled";
            const price = p.packages?.[0]?.discountPrice || p.packages?.[0]?.price || 0;
            return (
              <div
                key={p._id}
                className="border rounded-lg shadow-sm bg-white hover:shadow-lg transition-all overflow-hidden"
              >
                <img
                  src={p.image || "/placeholder.jpg"}
                  alt={title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-orange-700">{title}</h3>
                  <p className="text-gray-600 mb-2">{p.category}</p>
                  {price > 0 && (
                    <p className="text-lg font-bold text-gray-800">₹{price}</p>
                  )}
                  <div className="mt-3 flex justify-between">
                    <Link
                      to={`/admin/pujas/edit/${p._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
