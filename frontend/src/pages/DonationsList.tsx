// DonationsList.tsx — Fully multilingual (EN/HI/MR) + optimized design
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

// Inline MapPin Icon
function MapPin({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M18.5 10.5C18.5 15 12 21 12 21s-6.5-6-6.5-10.5A6.5 6.5 0 1 1 18.5 10.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
      />
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
          backgroundImage: flipped
            ? "url('/temple-border-flip.png?rev=4')"
            : "url('/temple-border.png?rev=4')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "260px auto",
          height: "45px",
          width: "300%",
        }}
      />
    </div>
  );
}

export default function DonationsList() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_API_URL;

  const lang = (i18n.language || "en") as "en" | "hi" | "mr";
  const t = (obj: Record<string, string>) => obj[lang] ?? obj.en;

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get<Donation[]>(`${backendURL}/api/donations`);
        setDonations(res.data || []);
      } catch {
        setDonations([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backendURL]);

  if (loading)
    return (
      <p className="text-center mt-20 text-orange-700 text-lg font-semibold">
        {t({
          en: "Loading...",
          hi: "लोड हो रहा है...",
          mr: "लोड होत आहे...",
        })}
      </p>
    );

  if (donations.length === 0)
    return (
      <div className="pt-20 md:pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-orange-700">
          {t({
            en: "No Donations Available",
            hi: "कोई दान उपलब्ध नहीं",
            mr: "दान उपलब्ध नाही",
          })}
        </h2>
        <p className="text-sm md:text-base">
          {t({
            en: "New campaigns will be added soon 🙏",
            hi: "नया अभियान जल्द ही जोड़ा जाएगा 🙏",
            mr: "नवीन मोहिमा लवकरच जोडल्या जातील 🙏",
          })}
        </p>
      </div>
    );

  return (
    <div
      className="pt-20 md:pt-24 pb-16"
      style={{
        background: "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)",
      }}
    >
      {/* TOP BORDER */}
      <ScrollingBorder />

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 mb-10 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 items-center">
        {/* LEFT */}
        <div>
          <h1
            className="text-3xl md:text-5xl font-bold font-[Marcellus] drop-shadow-md leading-tight"
            style={{ color: "#b34a00" }}
          >
            {t({
              en: "Blessings Begin Here — a small act of faith reaching the Divine.",
              hi: "आशीर्वाद यहीं से शुरू होते हैं — आस्था का एक छोटा सा कदम भगवान तक पहुँचता है।",
              mr: "आशीर्वाद इथून सुरू होतात — श्रद्धेचा एक छोटा प्रयत्न देवापर्यंत पोहोचतो.",
            })}
          </h1>

          <ul className="mt-4 space-y-2 text-gray-700 text-base md:text-xl font-[Poppins] leading-relaxed list-disc pl-5">
            <li>
              {t({
                en: "Your offering becomes a prayer in the mandir.",
                hi: "आपका चढ़ावा मंदिर में एक प्रार्थना बन जाता है।",
                mr: "आपले चढावे मंदिरात एक प्रार्थना बनते.",
              })}
            </li>
            <li>
              {t({
                en: "Give with love, receive divine grace.",
                hi: "प्रेम से दें, दिव्य कृपा प्राप्त करें।",
                mr: "प्रेमाने द्या आणि दैवी कृपा मिळवा.",
              })}
            </li>
            <li>
              {t({
                en: "Every small offering creates countless blessings.",
                hi: "हर छोटा चढ़ावा अनगिनत आशीर्वाद लाता है।",
                mr: "प्रत्येक छोटा चढावा असंख्य आशीर्वाद देतो.",
              })}
            </li>
            <li>
              {t({
                en: "Your faith reaches God through seva.",
                hi: "आपकी श्रद्धा सेवा के माध्यम से भगवान तक पहुँचती है।",
                mr: "आपला विश्वास सेवेच्या माध्यमातून देवापर्यंत पोहोचतो.",
              })}
            </li>
            <li>
              {t({
                en: "A pure intention itself creates punya.",
                hi: "शुद्ध भावना ही पुण्य का कारण बनती है।",
                mr: "शुद्ध भावनांमुळेच पुण्य निर्माण होते.",
              })}
            </li>
            <li>
              {t({
                en: "What you give from the heart returns as peace.",
                hi: "दिल से दिया हुआ दान शांति बनकर वापस आता है।",
                mr: "मनापासून दिलेले दान शांततेच्या रूपात परत येते.",
              })}
            </li>
          </ul>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center lg:justify-end">
          <img src="/donation.png" alt="Donation Artwork" className="w-56 md:w-80 lg:w-[420px] drop-shadow-xl" />
        </div>
      </div>

      {/* BOTTOM BORDER */}
      <ScrollingBorder flipped />

      {/* DONATION CARDS GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-6">
        {donations.map((d) => {
          const title = d.donationName?.[lang] || d.donationName?.en || "";
          const temple = d.templeName?.[lang] || d.templeName?.en || "";
          const details = d.shortDetails?.[lang] || d.shortDetails?.en || "";

          return (
            <Link
              key={d._id}
              to={`/donations/${d._id}`}
              className="block rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              {/* IMAGE */}
              <div className="w-full h-48 md:h-56 bg-gray-100 overflow-hidden rounded-t-2xl">
                <img src={d.thumbnail || "/placeholder.jpg"} className="w-full h-full object-cover" />
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 font-[Playfair]">{title}</h2>

                {/* Temple Row */}
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin size={17} className="mr-1" />
                  <span className="truncate max-w-[150px]">{temple}</span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">{details.slice(0, 120)}...</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
