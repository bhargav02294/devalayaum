// src/pages/DonationsList.tsx
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
  thumbnail?: string;
  templeName?: Record<string, string>;
  donationName?: Record<string, string>;
  shortDetails?: Record<string, string>;
  price?: number;
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
        const res = await axios.get<Donation[]>(`${backendURL}/api/donations`);
        setDonations(res.data || []);
      } catch (err) {
        console.error("Failed to load donations:", err);
        setDonations([]);
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
  <div
  className="pt-24 pb-20"
  style={{
    background:
      "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
  }}
>
  <ScrollingBorder />

  {/* Header */}
  <div
    className="max-w-7xl mx-auto px-10 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
    style={{ marginTop: "0px", paddingTop: "0px" }}
  >
    {/* LEFT - 60% */}
    <div className="w-full lg:w-[60%]">
      <h1
        className="text-5xl font-[Marcellus] font-bold drop-shadow-sm leading-tight"
        style={{
          color: "#b34a00", // Devotional warm saffron color
          marginTop: "0px",
          paddingTop: "0px",
        }}
      >
        Blessings Begin Here — with a small act of faith that reaches the
        feet of the Divine.
      </h1>

      <ul
        className="space-y-2 text-lg md:text-xl font-[Poppins] leading-relaxed list-disc pl-5"
        style={{
          marginTop: "12px",
          color: "#5a4636", // Spiritual soft brown tone
        }}
      >
        <li>Your offering becomes a prayer in the mandir.</li>
        <li>Give with love, receive divine grace.</li>
        <li>Every small devotion creates countless blessings.</li>
        <li>Your faith reaches God through our seva.</li>
        <li>A pure intention is enough to earn punya.</li>
        <li>What you give from the heart returns as peace.</li>
        <li>Your devotion lights someone else’s life.</li>
        <li>Blessings flow where kindness begins.</li>
      </ul>
    </div>

    {/* RIGHT - 40% */}
    <div
      className="flex justify-center lg:justify-end w-full lg:w-[40%]"
      style={{ marginTop: "0px", paddingTop: "0px" }}
    >
      <img
        src="/donation.png"
        alt="Donation Artwork"
        className="w-[340px] md:w-[460px] lg:w-[540px] drop-shadow-xl"
      />
    </div>
  </div>


      {/* Mirrored border right after the title block (no extra gap) */}
      <ScrollingBorder flipped />

      {/* Cards grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {donations.map((d) => {
          const title = d.donationName?.[lang] || d.donationName?.en || "Donation Campaign";
          const temple = d.templeName?.[lang] || d.templeName?.en || "";
          const details = d.shortDetails?.[lang] || d.shortDetails?.en || "";

          return (
            <Link key={d._id} to={`/donations/${d._id}`} className="block rounded-2xl overflow-hidden">
              <div className="border rounded-2xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                {/* Image */}
                <div className="w-full h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={d.thumbnail || "/placeholder.jpg"}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900 text-left font-[Playfair]">{title}</h2>

                  <div className="flex items-center text-gray-600 text-sm text-left">
                    <MapPin size={18} className="mr-2" />
                    <span className="truncate max-w-[160px]">{temple}</span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed text-left font-[Poppins]">
                    {details.slice(0, 120)}...
                  </p>

                  <div className="mt-2">
                    <span className="inline-block bg-orange-100 text-orange-800 font-bold px-3 py-1 rounded-full shadow">
                      {d.price ? `₹${d.price}` : "₹—"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
