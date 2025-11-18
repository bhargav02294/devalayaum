// src/pages/TempleView.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

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



/* Helpers */
const useLang = () => {
  const lang = i18n.language || "en";
  const getText = (f?: Record<string, string>) => f?.[lang] || f?.en || "";
  return { lang, getText };
};

/**
 * LabelValue updated:
 * - label styled as requested (text-lg, font-semibold, orange)
 * - value uses Merriweather inline style to ensure font loads
 */
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

/**
 * Section component that enforces Merriweather on its heading and body.
 * We use inline style for fontFamily to guarantee the font is applied
 * (since Tailwind config may not include Merriweather).
 */
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

/* MAIN COMPONENT */
export default function TempleView() {
  const { id } = useParams<{ id: string }>();
  const { getText } = useLang();

  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [hoverImage, setHoverImage] = useState<string | null>(null);

  const backendURL = import.meta.env.VITE_API_URL;

  // Inject Merriweather font link into head once
  useEffect(() => {
    const href = "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap";
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get<Temple>(`${backendURL}/api/temples/${id}`)
      .then(res => setTemple(res.data))
      .catch(() => setTemple(null))
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex justify-center text-orange-700 text-lg font-semibold">
        Loading temple details…
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="pt-24 pb-20 text-center">
        <p className="text-red-600 font-semibold">Temple not found</p>
        <Link to="/temples" className="text-orange-700 hover:underline mt-4 inline-block">
          ← Back to Temples
        </Link>
      </div>
    );
  }

  const images = temple.images?.length ? temple.images : ["/temple-placeholder.jpg"];
  const displayImage = hoverImage ?? images[activeImage];

  const prohibitedItemsStr =
    Array.isArray(temple.prohibitedItems) && temple.prohibitedItems.length
      ? temple.prohibitedItems.join(", ")
      : undefined;

  const glow = "shadow-[0_4px_20px_rgba(255,153,51,0.18)]";

  return (
    <div
      className="pt-20 pb-20"
      style={{ background: "linear-gradient(to bottom, #fff7e3, #fffdf8, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            

            {/* Gallery */}
            <div className={`mt-8 rounded-3xl overflow-hidden bg-white ${glow}`}>
              <div className="relative h-[520px] flex items-center justify-center bg-gradient-to-b from-white via-[#fff4dd] to-white">
                <img
                  src={displayImage}
                  alt="temple"
                  className="max-w-full max-h-full object-contain drop-shadow-[0_4px_20px_rgba(255,153,51,0.25)]"
                />
              </div>


              

              <div className="p-4 flex gap-4 overflow-x-auto bg-gradient-to-r from-white to-[#fff8ec]">
                {images.map((src, idx) => {
                  const active = idx === activeImage;
                  return (
                    <button
                      key={idx}
                      onMouseEnter={() => setHoverImage(src)}
                      onMouseLeave={() => setHoverImage(null)}
                      onClick={() => setActiveImage(idx)}
                      className={`
                        rounded-xl overflow-hidden transition-all 
                        ${active ? "ring-2 ring-orange-300 scale-105 shadow-[0_4px_15px_rgba(255,153,51,0.35)]" : "hover:scale-105"}
                      `}
                      style={{ width: active ? 170 : 120, height: active ? 110 : 75 }}
                    >
                      <img src={src} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: Darshan card */}
          <div className="space-y-7 lg:mt-[140px]">
            <div className={`bg-white rounded-2xl p-6 ${glow}`}>
<h3
  className="text-2xl text-orange-800 font-semibold mb-4"
  style={{ fontFamily: "'Merriweather', serif" }}
>
  Darshan & Aarti
</h3>

              <LabelValue label="Darshan Timings" value={getText(temple.darshanTiming)} />

              {temple.aartiTimings && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-1">Aarti Timings</p>

                  <div className="space-y-1 text-gray-800">
                    <div className="flex items-center gap-2">
                      <IconClock /> <strong>Morning:</strong> {temple.aartiTimings.morning || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock /> <strong>Shringar:</strong> {temple.aartiTimings.shringar || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock /> <strong>Shayan:</strong> {temple.aartiTimings.shayan || "-"}
                    </div>
                  </div>
                </div>
              )}

              <LabelValue label="Special Pooja Info" value={getText(temple.specialPoojaInfo)} />
            </div>
          </div>
        </div>


<h1 className="mt-4 text-4xl lg:text-5xl font-[Marcellus] text-orange-800 font-bold">
              {getText(temple.name)}
            </h1>

            <p className="text-gray-700 mt-3 flex items-center gap-2">
              <IconLocation />
              <span className="font-medium text-gray-800">{getText(temple.location)}</span>
            </p>
            
        {/* Full-width sections */}
        <Section id="about" title="About the Temple">
          {getText(temple.about)}
        </Section>

        <Section id="religion" title="Religious & Historical Information">
          <LabelValue label="Main Deity" value={getText(temple.mainDeity)} />
          <LabelValue label="Deity Description" value={getText(temple.deityDescription)} />
          <LabelValue label="Significance" value={getText(temple.significance)} />
          <LabelValue label="History" value={getText(temple.history)} />
          <LabelValue label="Architecture" value={getText(temple.architecture)} />
          <LabelValue label="Builder / Trust" value={getText(temple.builderOrTrust)} />
          <LabelValue label="Consecration Date" value={temple.consecrationDate || ""} />
        </Section>

        {/* Visitor Information (simple text section using Merriweather) */}
        <Section id="visitor" title="Visitor Information">
          <LabelValue label="Dress Code" value={getText(temple.dressCode)} />
          <LabelValue label="Entry Rules" value={getText(temple.entryRules)} />
          {prohibitedItemsStr && <LabelValue label="Prohibited Items" value={prohibitedItemsStr} />}
          <LabelValue label="Locker Facility" value={temple.lockerFacility ? "Available" : "Not Available"} />
        </Section>

        <Section id="travel" title="Travel & Connectivity">
          <LabelValue label="How to Reach" value={getText(temple.howToReach)} />
          <LabelValue label="Nearest Airport" value={getText(temple.nearestAirport)} />
          <LabelValue label="Nearest Railway" value={getText(temple.nearestRailway)} />
          <LabelValue label="Road Connectivity" value={getText(temple.roadConnectivity)} />
        </Section>

        {temple.nearbyPlaces?.length ? (
          <Section id="nearby" title="Nearby Places">
            <div className="space-y-3">
              {temple.nearbyPlaces.map((p, i) => (
                <div key={i} className="p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition">
                  <p className="font-medium text-gray-900" style={{ fontFamily: "'Merriweather', serif" }}>
                    {getText(p.name)}
                  </p>
                  <p className="text-gray-700 text-sm" style={{ fontFamily: "'Merriweather', serif" }}>
                    {getText(p.description)}
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
