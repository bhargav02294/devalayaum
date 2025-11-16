// Updated DonationsList page with unified professional design + MapPin usage
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Inline MapPin Icon — No dependency required
function MapPin({ size = 18, className = "" }: { size?: number; className?: string }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 10.5C18.5 15 12 21 12 21s-6.5-6-6.5-10.5A6.5 6.5 0 1 1 18.5 10.5z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

interface Donation {
  _id: string;
  thumbnail: string;
  templeName: Record<string, string>;
  donationName: Record<string, string>;
  shortDetails?: Record<string, string>;
  price: number;
}

function ScrollingBorder({ flipped = false }: { flipped?: boolean }) {
  return (
    <div className="overflow-hidden py-1">
      <div
        className="animate-border-left"
        style={{
          backgroundImage: flipped ? "url('/temple-border-flip.png?rev=4')" : "url('/temple-border.png?rev=4')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "330px auto",
          height: "60px",
          width: "300%",
          opacity: 1,
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
    const load = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/donations`);
        setDonations(res.data);
      } catch (err) {
        console.error("Failed to load donations:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [backendURL]);

  if (loading)
    return <p className="text-center mt-20 text-orange-700 text-lg font-semibold">Loading Donations...</p>;

  if (donations.length === 0)
    return (
      <div className="pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-3xl font-bold mb-3 text-orange-700">No Donations Available</h2>
        <p>New donation campaigns will be added soon 🙏</p>
      </div>
    );

  return (
    <div className="pt-24 pb-20" style={{ background: "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)" }}>
      <ScrollingBorder />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-10 mt-10 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl font-bold text-orange-800 tracking-wide font-[Playfair] drop-shadow-md text-left">Sacred Temple Donations & Divine Chadhava Offerings</h1>

          <ul className="mt-6 space-y-4 text-gray-700 text-xl font-[Poppins] leading-relaxed list-disc pl-5">
            <li>Support the daily worship, rituals, and preservation of sacred temples.</li>
            <li>Offer Chadhava to deities as a gesture of devotion, gratitude, and surrender.</li>
            <li>Contribute to Annadanam, Seva, and essential community service programs.</li>
            <li>Help maintain temple festivals, spiritual activities, and ancient traditions.</li>
            <li>Participate in a divine act that brings blessings, peace, and spiritual upliftment.</li>
          </ul>

        </div>

        <div className="flex justify-center lg:justify-end">
          <img src="/donation.png" alt="Donation Artwork" className="w-80 lg:w-[420px] drop-shadow-xl" />
        </div>
      </div>

      <ScrollingBorder flipped />

      {/* Donation Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {donations.map((d) => {
          const title = d.donationName?.[lang] || "Donation Campaign";
          const temple = d.templeName?.[lang] || "";
          const details = d.shortDetails?.[lang] || "";

          return (
            <Link key={d._id} to={`/donations/${d._id}`} className="block rounded-2xl overflow-hidden">
              <div className="border rounded-2xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                {/* Image */}
                <div className="w-full h-56 bg-gray-100 overflow-hidden">
                  <img src={d.thumbnail || "/placeholder.jpg"} alt={title} className="w-full h-full object-contain p-4" />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900 text-left font-[Playfair]">{title}</h2>

                  {/* Temple Row with MapPin */}
                  <div className="flex items-center text-gray-600 text-sm text-left">
                    <MapPin size={18} className="mr-2" />
                    <span className="truncate max-w-[160px]">{temple}</span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed text-left font-[Poppins]">{details.slice(0, 120)}...</p>

                  {/* Price */}
                  <p className="inline-block bg-orange-100 text-orange-800 font-bold px-4 py-1 rounded-full shadow text-left">₹{d.price}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
