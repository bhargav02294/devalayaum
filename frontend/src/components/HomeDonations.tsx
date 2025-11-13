import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import i18n from "../i18n";

interface Donation {
  _id: string;
  thumbnail: string;
  templeName: Record<string, string>;
  shortDetails: Record<string, string>;
  donationName: Record<string, string>;
  published: boolean;
}

export default function HomeDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

const backendURL = import.meta.env.VITE_API_URL; // ✅ FIXED
  const lang = i18n.language || "en";

  useEffect(() => {
    axios
      .get(`${backendURL}/api/donations/home-list`)
      .then((res) => setDonations(res.data))
      .catch((err) => console.error("Donation fetch error:", err))
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading) {
    return (
      <p className="text-center text-gray-600 py-10">
        Loading donation causes...
      </p>
    );
  }

  if (donations.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No donation campaigns available.
      </p>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-[#b35b00] drop-shadow-md">
          Support Sacred Causes
        </h2>
        <p className="mt-3 text-gray-600 text-lg">
          Contribute to divine temple initiatives and spiritual welfare
        </p>
      </div>

      {/* Cards - 3 centered */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
        {donations.map((d) => {
          const donationTitle = d.donationName?.[lang] || d.donationName?.en || "";
          const temple = d.templeName?.[lang] || d.templeName?.en || "";
          const short =
            d.shortDetails?.[lang]?.slice(0, 120) ||
            d.shortDetails?.en?.slice(0, 120) || "";

          return (
            <div
              key={d._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-100 hover:shadow-[0_10px_30px_rgba(179,91,0,0.3)] hover:-translate-y-2 transition-all duration-500"
            >
              {/* Thumbnail */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={d.thumbnail}
                  alt={donationTitle}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-[900ms]"
                />

                <div className="absolute top-4 left-4 bg-[#006b3c] text-white text-xs px-3 py-1 rounded-full shadow-md tracking-wide">
                  Verified Temple Trust
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Temple Name */}
                <p className="text-[#b35b00] font-semibold text-sm mb-1">
                  {temple}
                </p>

                {/* Donation Title */}
                <h3 className="text-xl font-bold text-[#8a4600] mb-2 leading-snug">
                  {donationTitle}
                </h3>

                {/* Short description */}
                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  {short}...
                </p>

                {/* Donate Button */}
                <Link
                  to={`/donations/${d._id}`}
                  className="block text-center w-full bg-[#b35b00] hover:bg-[#8a4600] text-white font-medium py-2 rounded-lg shadow-md transition duration-300"
                >
                  Donate Now
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Donations Button */}
      <div className="text-center mt-16">
        <Link
          to="/donations"
          className="relative inline-block group px-6 py-2 border border-[#b35b00] rounded-full text-[#b35b00] font-medium text-sm overflow-hidden transition-all duration-500 shadow-sm"
        >
          {/* sliding fill */}
          <span
            className="absolute left-0 top-0 h-full w-0 bg-[#b35b00] transition-all duration-700 group-hover:w-full"
          ></span>

          {/* text */}
          <span className="relative z-10 group-hover:text-white transition duration-500">
            View All Donations
          </span>
        </Link>
      </div>
    </section>
  );
}
