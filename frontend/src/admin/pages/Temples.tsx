// E:\devalayaum\frontend\src\admin\pages\Temples.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../../i18n";
import extractMessage from "../../utils/extractMessage";
import type { Temple } from "../../types/Temple";

export default function Temples() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n?.language || "en";

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await axios.get<Temple[]>(`${backendURL}/api/temples`);
        setTemples(res.data);
      } catch (err) {
        console.error("Fetch temples error:", extractMessage(err));
        setTemples([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, [backendURL]);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this temple?")) return;
    try {
      const token = localStorage.getItem("ADMIN_TOKEN");
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      await axios.delete(`${backendURL}/api/temples/${id}`, { headers });
      setTemples((prev) => prev.filter((t) => t._id !== id));
      alert("Temple deleted successfully");
    } catch (err) {
      alert("Delete failed: " + extractMessage(err));
    }
  };

  if (loading) return <p className="text-center mt-10">Loading temples...</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Temple Management</h2>
        <Link
          to="/admin/temples/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          + Add Temple
        </Link>
      </div>

      {temples.length === 0 ? (
        <p className="text-gray-600 text-center">No temples found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {temples.map((temple) => {
            const displayName =
              temple.name?.[lang as keyof typeof temple.name] ||
              temple.name?.en ||
              "Untitled";
            const displayLocation =
              temple.location?.[lang as keyof typeof temple.location] ||
              temple.location?.en ||
              "";
            const deity =
              temple.mainDeity?.[lang as keyof typeof temple.mainDeity] ||
              temple.mainDeity?.en ||
              "";

            return (
              <div
                key={temple._id}
                className="border rounded-lg p-4 shadow-md hover:shadow-xl transition-all bg-white flex flex-col"
              >
                <img
                  src={temple.images?.[0] || "/placeholder.jpg"}
                  alt={displayName}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />

                <h3 className="text-xl font-semibold mb-1">{displayName}</h3>
                <p className="text-gray-600 mb-1">📍 {displayLocation}</p>
                {deity && (
                  <p className="text-gray-700 mb-2">
                    🕉️ <strong>Deity:</strong> {deity}
                  </p>
                )}

                {temple.architecture?.[lang as keyof typeof temple.architecture] && (
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Architecture:</strong>{" "}
                    {temple.architecture?.[lang as keyof typeof temple.architecture]}
                  </p>
                )}

                {temple.darshanTiming?.[lang as keyof typeof temple.darshanTiming] && (
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Darshan Timings:</strong>{" "}
                    {temple.darshanTiming?.[lang as keyof typeof temple.darshanTiming]}
                  </p>
                )}

                {temple.consecrationDate && (
                  <p className="text-sm text-gray-500 mb-2">
                    <strong>Consecrated:</strong> {temple.consecrationDate}
                  </p>
                )}

                <div className="flex justify-between mt-auto pt-4 border-t">
                  <Link
                    to={`/admin/temples/detail/${temple._id}`}
                    className="text-green-600 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    to={`/admin/temples/edit/${temple._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(temple._id)}
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
