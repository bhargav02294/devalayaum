// src/pages/TempleView.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

/* ----------------------------------------------------
   Interfaces
---------------------------------------------------- */
interface Temple {
  _id: string;
  name: Record<string, string>;
  location: Record<string, string>;
  about?: Record<string, string>;
  images?: string[];

  mainDeity?: Record<string, string>;
  deityDescription?: Record<string, string>;
  significance?: Record<string, string>;
  history?: Record<string, string>;
  architecture?: Record<string, string>;
  builderOrTrust?: Record<string, string>;
  consecrationDate?: string;

  darshanTiming?: Record<string, string>;
  aartiTimings?: { morning?: string; shringar?: string; shayan?: string };
  specialPoojaInfo?: Record<string, string>;

  dressCode?: Record<string, string>;
  entryRules?: Record<string, string>;
  prohibitedItems?: string[];
  lockerFacility?: boolean;

  howToReach?: Record<string, string>;
  nearestAirport?: Record<string, string>;
  nearestRailway?: Record<string, string>;
  roadConnectivity?: Record<string, string>;

  nearbyPlaces?: {
    name: Record<string, string>;
    description: Record<string, string>;
  }[];

  published?: boolean;
  updatedAt?: string;
}

/* Icons */
function IconClock({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconLocation({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" stroke="currentColor" strokeWidth="1.25" />
      <path d="M18.5 10.5C18.5 15 12 21 12 21s-6.5-6-6.5-10.5A6.5 6.5 0 1 1 18.5 10.5z" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

/* Multilanguage helper */
const useLang = () => {
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";
  return { lang, t };
};

/* LabelValue */
function LabelValue({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="mb-6">
      <p className="text-lg font-semibold text-orange-700 mb-1">{label}</p>
      <p className="text-gray-800" style={{ fontFamily: "'Merriweather', serif", lineHeight: 1.7 }}>
        {value}
      </p>
    </div>
  );
}

/* Section Wrapper */
function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-12">
      <h3
        className="text-2xl text-orange-800 font-semibold mb-4"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        {title}
      </h3>
      <div className="text-gray-700 leading-relaxed" style={{ fontFamily: "'Merriweather', serif" }}>
        {children}
      </div>
    </section>
  );
}

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */
export default function TempleView() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();

  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [hoverImage, setHoverImage] = useState<string | null>(null);

  const backendURL = import.meta.env.VITE_API_URL;

  // load font
  useEffect(() => {
    const href =
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap";
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  // load temple
  useEffect(() => {
    if (!id) return;
    axios
      .get<Temple>(`${backendURL}/api/temples/${id}`)
      .then((res) => setTemple(res.data))
      .catch(() => setTemple(null))
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex justify-center text-orange-700 text-lg font-semibold">
        {t({
          en: "Loading temple details…",
          hi: "मंदिर विवरण लोड हो रहा है…",
          mr: "मंदिराची माहिती लोड होत आहे…"
        })}
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="pt-24 pb-20 text-center">
        <p className="text-red-600 font-semibold">
          {t({ en: "Temple not found", hi: "मंदिर नहीं मिला", mr: "मंदिर सापडले नाही" })}
        </p>
        <Link to="/temples" className="text-orange-700 hover:underline mt-4 inline-block">
          ← {t({ en: "Back to Temples", hi: "मंदिरों पर वापस जाएँ", mr: "मंदिरांकडे परत जा" })}
        </Link>
      </div>
    );
  }

  const images = temple.images?.length ? temple.images : ["/temple-placeholder.jpg"];
  const displayImage = hoverImage ?? images[activeImage];

  const prohibitedItemsStr =
    temple.prohibitedItems?.length ? temple.prohibitedItems.join(", ") : undefined;

  const glow = "shadow-[0_4px_20px_rgba(255,153,51,0.18)]";

  /* ----------------------------------------------------
     PAGE UI
  ---------------------------------------------------- */
  return (
    <div
      className="pt-20 pb-20"
      style={{ background: "linear-gradient(to bottom, #fff7e3, #fffdf8, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2">

            {/* TITLE */}
            <h1 className="mt-4 text-2xl lg:text-3xl font-[Marcellus] text-orange-700 font-bold">
              {t(temple.name)}
            </h1>

            {/* LOCATION */}
            <p className="text-gray-700 mt-3 flex items-center gap-2">
              <IconLocation />
              <span className="font-medium text-gray-800">
                {t(temple.location)}
              </span>
            </p>

            {/* MAIN IMAGE GALLERY */}
            <div className={`mt-8 rounded-3xl overflow-hidden bg-white p-4 ${glow}`}>
              <div className="relative h-[260px] md:h-[320px] lg:h-[360px] flex items-center justify-center bg-gradient-to-b from-white via-[#fff4dd] to-white">

                <img
                  src={displayImage}
                  alt="temple"
                  className="max-w-full max-h-full object-contain drop-shadow-[0_4px_20px_rgba(255,153,51,0.25)]"
                />
              </div>

              {/* THUMBNAILS */}
              <div className="p-4 flex gap-4 overflow-x-auto bg-gradient-to-r from-white to-[#fff8ec]">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setHoverImage(src)}
                    onMouseLeave={() => setHoverImage(null)}
                    onClick={() => setActiveImage(idx)}
                    className={`rounded-xl overflow-hidden transition-all ${
                      idx === activeImage
                        ? "ring-2 ring-orange-300 scale-105 shadow-[0_4px_15px_rgba(255,153,51,0.35)]"
                        : "hover:scale-105"
                    }`}
                    style={{ width: idx === activeImage ? 170 : 120, height: idx === activeImage ? 110 : 75 }}
                  >
                    <img src={src} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION: ABOUT */}
            <Section id="about" title={t({ en: "About the Temple", hi: "मंदिर के बारे में", mr: "मंदिराबद्दल माहिती" })}>
              {t(temple.about)}
            </Section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-7 lg:mt-[140px]">
            <div className={`bg-white rounded-2xl p-6 ${glow}`}>
              <h3
                className="text-2xl text-orange-800 font-semibold mb-4"
                style={{ fontFamily: "'Merriweather', serif" }}
              >
                {t({ en: "Darshan & Aarti", hi: "दर्शन और आरती", mr: "दर्शन आणि आरती" })}
              </h3>

              <LabelValue
                label={t({ en: "Darshan Timings", hi: "दर्शन समय", mr: "दर्शनाची वेळ" })}
                value={t(temple.darshanTiming)}
              />

              {temple.aartiTimings && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-1">
                    {t({ en: "Aarti Timings", hi: "आरती समय", mr: "आरतीची वेळ" })}
                  </p>

                  <div className="space-y-1 text-gray-800">
                    <div className="flex items-center gap-2">
                      <IconClock /> <strong>{t({ en: "Morning:", hi: "सुबह:", mr: "सकाळी:" })}</strong>{" "}
                      {temple.aartiTimings.morning || "-"}
                    </div>

                    <div className="flex items-center gap-2">
                      <IconClock /> <strong>{t({ en: "Shringar:", hi: "श्रृंगार:", mr: "श्रृंगार:" })}</strong>{" "}
                      {temple.aartiTimings.shringar || "-"}
                    </div>

                    <div className="flex items-center gap-2">
                      <IconClock /> <strong>{t({ en: "Shayan:", hi: "शयन:", mr: "शयन:" })}</strong>{" "}
                      {temple.aartiTimings.shayan || "-"}
                    </div>
                  </div>
                </div>
              )}

              <LabelValue
                label={t({ en: "Special Pooja Info", hi: "विशेष पूजा जानकारी", mr: "विशेष पूजा माहिती" })}
                value={t(temple.specialPoojaInfo)}
              />
            </div>
          </div>
        </div>

        {/* RELIGION & HISTORY */}
        <Section
          id="religion"
          title={t({ en: "Religious & Historical Information", hi: "धार्मिक और ऐतिहासिक जानकारी", mr: "धार्मिक आणि ऐतिहासिक माहिती" })}
        >
          <LabelValue label={t({ en: "Main Deity", hi: "मुख्य देवता", mr: "मुख्य देवता" })} value={t(temple.mainDeity)} />
          <LabelValue label={t({ en: "Deity Description", hi: "देवता विवरण", mr: "देवतांचे वर्णन" })} value={t(temple.deityDescription)} />
          <LabelValue label={t({ en: "Significance", hi: "महत्व", mr: "महत्त्व" })} value={t(temple.significance)} />
          <LabelValue label={t({ en: "History", hi: "इतिहास", mr: "इतिहास" })} value={t(temple.history)} />
          <LabelValue label={t({ en: "Architecture", hi: "वास्तुकला", mr: "वास्तुकला" })} value={t(temple.architecture)} />
          <LabelValue label={t({ en: "Builder / Trust", hi: "निर्माता / ट्रस्ट", mr: "निर्माता / ट्रस्ट" })} value={t(temple.builderOrTrust)} />
          <LabelValue label={t({ en: "Consecration Date", hi: "प्रतिष्ठा तिथि", mr: "प्राणप्रतिष्ठा तारीख" })} value={temple.consecrationDate} />
        </Section>

        {/* VISITOR INFO */}
        <Section
          id="visitor"
          title={t({ en: "Visitor Information", hi: "यात्री जानकारी", mr: "भेट देणाऱ्यांसाठी माहिती" })}
        >
          <LabelValue label={t({ en: "Dress Code", hi: "ड्रेस कोड", mr: "ड्रेस कोड" })} value={t(temple.dressCode)} />
          <LabelValue label={t({ en: "Entry Rules", hi: "प्रवेश नियम", mr: "प्रवेश नियम" })} value={t(temple.entryRules)} />
          {prohibitedItemsStr && (
            <LabelValue
              label={t({ en: "Prohibited Items", hi: "निषिद्ध वस्तुएँ", mr: "बंदी घातलेल्या वस्तू" })}
              value={prohibitedItemsStr}
            />
          )}
          <LabelValue
            label={t({ en: "Locker Facility", hi: "लॉकर सुविधा", mr: "लॉकर सुविधा" })}
            value={
              temple.lockerFacility
                ? t({ en: "Available", hi: "उपलब्ध", mr: "उपलब्ध" })
                : t({ en: "Not Available", hi: "उपलब्ध नहीं", mr: "उपलब्ध नाही" })
            }
          />
        </Section>

        {/* TRAVEL */}
        <Section
          id="travel"
          title={t({ en: "Travel & Connectivity", hi: "यात्रा और संपर्क", mr: "प्रवास आणि संपर्क" })}
        >
          <LabelValue label={t({ en: "How to Reach", hi: "कैसे पहुंचे", mr: "कसे पोहोचावे" })} value={t(temple.howToReach)} />
          <LabelValue label={t({ en: "Nearest Airport", hi: "निकटतम हवाई अड्डा", mr: "जवळचे विमानतळ" })} value={t(temple.nearestAirport)} />
          <LabelValue label={t({ en: "Nearest Railway Station", hi: "निकटतम रेलवे स्टेशन", mr: "जवळचे रेल्वे स्टेशन" })} value={t(temple.nearestRailway)} />
          <LabelValue label={t({ en: "Road Connectivity", hi: "सड़क संपर्क", mr: "रस्ते संपर्क" })} value={t(temple.roadConnectivity)} />
        </Section>

        {/* NEARBY PLACES */}
        {temple.nearbyPlaces?.length ? (
          <Section
            id="nearby"
            title={t({ en: "Nearby Places", hi: "पास के स्थान", mr: "जवळची ठिकाणे" })}
          >
            <div className="space-y-3">
              {temple.nearbyPlaces.map((p, i) => (
                <div
                  key={i}
                  className="p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition"
                >
                  <p className="font-medium text-gray-900" style={{ fontFamily: "'Merriweather', serif" }}>
                    {t(p.name)}
                  </p>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: "'Merriweather', serif" }}>
                    {t(p.description)}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </div>
  );
}
