import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../../i18n";

interface Donation {
  _id: string;
  thumbnail?: string;
  templeName: Record<string, string>;
  donationName: Record<string, string>;
  shortDetails?: Record<string, string>;
  published?: boolean;
  createdAt?: string;
}

export default function Donations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/donations`);
        setDonations(res.data);
      } catch (err: unknown) {
        console.error("Failed to load donations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [backendURL]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donation?")) return;

    try {
      const token = localStorage.getItem("ADMIN_TOKEN");
      await axios.delete(`${backendURL}/api/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonations((prev) => prev.filter((d) => d._id !== id));
      alert("✅ Donation deleted successfully!");
    } catch (err: unknown) {
      console.error("Delete failed:", err);
      alert("❌ Failed to delete donation.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading Donations...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-700">💰 All Donations</h2>
        <Link
          to="/admin/donations/new"
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          ➕ Add Donation
        </Link>
      </div>

      {donations.length === 0 ? (
        <p className="text-gray-600">No donations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((d) => {
            const title =
              d.donationName?.[lang] || d.donationName?.en || "Untitled Donation";
            const temple =
              d.templeName?.[lang] || d.templeName?.en || "Unknown Temple";
            const short = d.shortDetails?.[lang] || d.shortDetails?.en || "";

            return (
              <div
                key={d._id}
                className="bg-white rounded-lg shadow-md border hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={d.thumbnail || "/placeholder.jpg"}
                  alt={title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-orange-700">{title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{temple}</p>
                  <p className="text-gray-700 text-sm mb-2 line-clamp-2">{short}</p>

                  <div className="flex justify-between mt-3">
                    <Link
                      to={`/admin/donations/edit/${d._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      ✏️ Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(d._id)}
                      className="text-red-600 hover:underline"
                    >
                      🗑️ Delete
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
