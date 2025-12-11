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

  if (loading)
    return (
      <p className="text-center mt-28 text-orange-700 text-xl font-semibold">
        Loading ..
      </p>
    );

  return (
    <section
      className="pt-24 pb-20 px-5 md:px-6 min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 25%, #ffffff 75%)",
      }}
    >

      {/* PAGE TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold font-[Marcellus] text-orange-700 mb-8 text-center">
        🙏 Our Donors
      </h1>

      {/* DONORS CONTAINER */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-5 md:p-8 border border-orange-100">

        {donors.length === 0 ? (
          <p className="text-center text-gray-600 text-lg font-[Poppins]">
            No done yet. Be the first to contribute! 🕉️
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">

            {donors.map((d) => (
              <li
                key={d._id}
                className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
              >
                {/* LEFT SECTION */}
                <div>
                  <p className="font-semibold text-gray-800 text-lg font-[Poppins]">
                    {d.fullName}
                  </p>
                  <p className="text-sm text-gray-600 font-[Poppins]">
                    {d.templeName}
                  </p>
                  <p className="text-sm italic text-gray-500 font-[Poppins]">
                    {d.donationName}
                  </p>
                </div>

                {/* AMOUNT */}
                <p className="text-xl font-bold text-orange-700 font-[Marcellus]">
                  ₹{d.amount}
                </p>
              </li>
            ))}

          </ul>
        )}
      </div>
    </section>
  );
}
