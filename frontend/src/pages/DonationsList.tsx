// DonationsList.tsx — FULL LIVE MULTILANGUAGE + ORIGINAL WORKING LOGIC
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

/* -------------------------------------------
   INLINE ICON
-------------------------------------------- */
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

/* -------------------------------------------
   INTERFACE
-------------------------------------------- */
interface Donation {
  _id: string;
  thumbnail?: string;
  templeName?: Record<string, string>;
  donationName?: Record<string, string>;
  shortDetails?: Record<string, string>;
  price?: number;
}

/* -------------------------------------------
   BORDER COMPONENT
-------------------------------------------- */
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

/* -------------------------------------------
   MAIN PAGE
-------------------------------------------- */
export default function DonationsList() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_API_URL;

  /* LIVE LANGUAGE SUPPORT */
  const [lang, setLang] = useState(i18n.language);
  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  /* LOAD DONATIONS */
  useEffect(() => {
    axios
      .get(`${backendURL}/api/donations`)
      .then((res) => setDonations(res.data || []))
      .catch(() => setDonations([]))
      .finally(() => setLoading(false));
  }, [backendURL]);

  if (loading)
    return (
      <p className="text-center mt-20 text-orange-700 text-lg font-semibold">
        {t({ en: "Loading donations...", hi: "दान लोड हो रहा है...", mr: "दान माहिती लोड होत आहे..." })}
      </p>
    );

  if (donations.length === 0)
    return (
      <div className="pt-20 md:pt-24 pb-16 text-center text-gray-600">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-orange-700">
          {t({ en: "No donations available", hi: "कोई दान उपलब्ध नहीं", mr: "दान उपलब्ध नाही" })}
        </h2>
        <p className="text-sm md:text-base">
          {t({ en: "New campaigns will be added soon.", hi: "नई मुहिम जल्द ही जोड़ी जाएगी।", mr: "नवीन मोहिमा लवकरच जोडल्या जातील." })}
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
      <ScrollingBorder />

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 mb-10 grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 items-center">
        <div>
          <h1
            className="text-3xl md:text-5xl font-bold font-[Marcellus] leading-tight drop-shadow-md"
            style={{ color: "#b34a00" }}
          >
            {t({
              en: "Blessings Begin Here — every offering reaches the divine.",
              hi: "आशीर्वाद की शुरुआत यहीं से — आपका हर चढ़ावा भगवान तक पहुँचता है।",
              mr: "आशीर्वादाची सुरुवात इथून — तुमचे प्रत्येक अर्पण देवापर्यंत पोहोचते.",
            })}
          </h1>

          <ul className="mt-4 space-y-2 md:space-y-3 text-gray-700 text-base md:text-xl list-disc pl-5 font-[Poppins]">
            <li>{t({ en: "Your offering becomes a prayer.", hi: "आपका चढ़ावा एक प्रार्थना बन जाता है।", mr: "तुमचे अर्पण प्रार्थना होते." })}</li>
            <li>{t({ en: "Give with faith, receive peace.", hi: "श्रद्धा से दो, शांति से पाओ।", mr: "श्रद्धेने द्या, शांतिने घ्या." })}</li>
            <li>{t({ en: "Every seva creates blessings.", hi: "हर सेवा आशीर्वाद लाती है।", mr: "प्रत्येक सेवा आशीर्वाद देते." })}</li>
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img src="/donation.png" className="w-56 md:w-80 lg:w-[420px] drop-shadow-xl" />
        </div>
      </div>

      <ScrollingBorder flipped />

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-6">
        {donations.map((d) => {
          const title = t(d.donationName);
          const temple = t(d.templeName);
          const details = t(d.shortDetails);

          return (
            <Link
              key={d._id}
              to={`/donations/${d._id}`}
              className="block rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="w-full h-48 md:h-56 bg-gray-100 rounded-t-2xl overflow-hidden">
                <img
                  src={d.thumbnail || "/placeholder.jpg"}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 font-[Playfair]">{title}</h2>

                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin size={17} className="mr-1" />
                  <span className="truncate max-w-[150px]">{temple}</span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed font-[Poppins]">
                  {details.slice(0, 120)}...
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
