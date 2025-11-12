// E:\devalayaum\frontend\src\pages\Donors.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface Donor {
  _id: string;
  fullName: string;
  amount: number;
  templeName: string;
  donationName: string;
  createdAt: string;
}

export default function Donors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/payments/donors`);
        setDonors(res.data);
      } catch (err) {
        console.error("Failed to fetch donors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, [backendURL]);

  if (loading) return <p className="text-center mt-20">Loading Donors...</p>;

  return (
    <div className="pt-24 pb-20 px-6 bg-gradient-to-br from-orange-50 to-yellow-100 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-700 mb-8 text-center">🙏 Our Devoted Donors</h1>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        {donors.length === 0 ? (
          <p className="text-center text-gray-600">No donations yet. Be the first to contribute!</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {donors.map((d) => (
              <li key={d._id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{d.fullName}</p>
                  <p className="text-sm text-gray-600">{d.templeName}</p>
                  <p className="text-sm italic text-gray-500">{d.donationName}</p>
                </div>
                <p className="text-lg font-bold text-orange-700">₹{d.amount}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
