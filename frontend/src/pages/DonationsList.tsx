import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface Donation {
  _id: string;
  thumbnail: string;
  templeName: Record<string, string>;
  donationName: Record<string, string>;
  shortDetails?: Record<string, string>;
  price: number;
}

export default function DonationsList() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const lang = i18n.language || "en";

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/donations`);
        setDonations(res.data);
      } catch (err) {
        console.error("Failed to load donations:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDonations();
  }, [backendURL]);

  if (loading) return <p className="text-center mt-10">Loading Donations...</p>;

  if (donations.length === 0)
    return (
      <div className="pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-3xl font-bold mb-3">No Donations Available</h2>
        <p>New donation campaigns will be added soon 🙏</p>
      </div>
    );

  return (
    <div className="pt-24 pb-16 px-6 md:px-20 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-orange-700 mb-12">
        💰 Temple Donation Campaigns
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {donations.map((d) => (
          <Link
            to={`/donations/${d._id}`}
            key={d._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition border"
          >
            <img
              src={d.thumbnail || "/placeholder.jpg"}
              alt={d.donationName?.[lang]}
              className="h-56 w-full object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-orange-700 mb-1">
                {d.donationName?.[lang] || "Unnamed Donation"}
              </h3>
              <p className="text-gray-600 mb-1">{d.templeName?.[lang]}</p>
              <p className="text-gray-700 text-sm mb-2">
                {d.shortDetails?.[lang]?.slice(0, 80)}...
              </p>
              <p className="text-orange-700 font-bold">₹{d.price}</p>
              <p className="mt-2 text-orange-600 font-medium hover:underline">
                View Details →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
