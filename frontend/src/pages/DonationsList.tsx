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

// 🔱 Scrolling Border Component
function ScrollingBorder({ flipVertical = false }: { flipVertical?: boolean }) {
  return (
    <div className="overflow-hidden py-1">
      <div
        className={`animate-border-left ${
          flipVertical ? "border-flip-vertical" : ""
        }`}
        style={{
          backgroundImage: "url('/temple-border.png')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "110px auto",
          height: "22px",
          width: "300%",
          opacity: 0.95,
        }}
      />
    </div>
  );
}

export default function DonationsList() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_API_URL;
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

  if (loading)
    return (
      <p className="text-center mt-20 text-orange-700 text-lg font-semibold">
        Loading Donations...
      </p>
    );

  if (donations.length === 0)
    return (
      <div className="pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-3xl font-bold mb-3 text-orange-700">
          No Donations Available
        </h2>
        <p>New donation campaigns will be added soon 🙏</p>
      </div>
    );

  return (
    <div
      className="pt-24 pb-20"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
      {/* 🔱 Top Border */}
      <ScrollingBorder />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto px-6 mb-6">
        <h1 className="text-5xl font-bold text-orange-800 tracking-wide font-[Playfair] drop-shadow-md">
          💰 Temple Donation Campaigns
        </h1>

        <div className="mt-4 text-lg text-gray-700 leading-relaxed font-[Poppins] space-y-2">
          <p>
            Donations offered to temples are a sacred act of devotion, helping
            preserve ancient heritage, support rituals, and serve devotees.
          </p>

          <ul className="text-left max-w-xl mx-auto list-disc list-inside text-gray-700 text-base mt-3">
            <li>🪔 Support temple maintenance & daily rituals</li>
            <li>🙏 Contribute to Annadanam & Seva programs</li>
            <li>✨ Help preserve holy traditions & festivals</li>
            <li>🌼 Gain blessings, peace & spiritual merit</li>
          </ul>
        </div>
      </div>

      {/* 🔱 Middle (Flipped) Border */}
      <ScrollingBorder flipVertical />

      {/* Donation Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {donations.map((d) => (
          <Link
            to={`/donations/${d._id}`}
            key={d._id}
            className="group rounded-2xl overflow-hidden"
          >
            {/* Image Box */}
            <div
              className="relative h-64 bg-white rounded-2xl shadow-lg 
              border border-yellow-300 transition-all duration-500
              group-hover:shadow-[0_0_30px_rgba(255,150,0,0.6)]
              group-hover:-translate-y-2"
            >
              <img
                src={d.thumbnail || "/placeholder.jpg"}
                alt={d.donationName?.[lang]}
                className="w-full h-full object-contain p-4 
                transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Details */}
            <div className="pt-4 px-2 text-center">
              <h3 className="text-2xl font-semibold text-orange-800 font-[Playfair]">
                {d.donationName?.[lang] || "Donation Campaign"}
              </h3>

              <p className="text-gray-600 mt-1">{d.templeName?.[lang]}</p>

              <p className="text-gray-700 text-sm mt-2 font-[Poppins] leading-relaxed">
                {d.shortDetails?.[lang]?.slice(0, 90)}...
              </p>

              {/* Price Badge */}
              <p className="mt-3 inline-block bg-orange-100 text-orange-800 font-bold px-4 py-1 rounded-full shadow">
                ₹{d.price}
              </p>

              <p className="mt-3 text-orange-600 font-medium hover:underline">
                View Details →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 🔱 Bottom Border */}
      <ScrollingBorder />
    </div>
  );
}
