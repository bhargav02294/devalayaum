// src/pages/TempleView.tsx
// FULL UPDATED TempleView component — professional devotional design + premium gallery (Option A: object-contain)

import { useEffect, useState, useRef } from "react";
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
  mapLocation?: { lat?: number; lng?: number };

  nearbyPlaces?: {
    name: Record<string, string>;
    description: Record<string, string>;
  }[];

  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ---------------------- small inline icons (no dependency) ----------------------
function IconClock({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconLocation({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 10.5C18.5 15 12 21 12 21s-6.5-6-6.5-10.5A6.5 6.5 0 1 1 18.5 10.5z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconTemple({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 11h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 11v7h14v-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11V6l5-3 5 3v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------- Scrolling border (same sliding border used across site) ----------------------
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

// ---------------------- Helper for multilingual text ----------------------
const useLang = () => {
  const lang = i18n.language || "en";
  const getText = (field?: Record<string, string>) => field?.[lang] || field?.en || "";
  return { lang, getText };
};

// ---------------------- Reusable pieces ----------------------
function LabelValue({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="mb-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-800 font-medium leading-snug">{value}</p>
    </div>
  );
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-10">
      <h3 className="text-2xl font-[Playfair] font-semibold text-orange-800 mb-4">{title}</h3>
      <div className="prose max-w-none text-gray-700">{children}</div>
    </section>
  );
}

// ---------------------- Main component ----------------------
export default function TempleView() {
  const { id } = useParams<{ id: string }>();
  const { getText } = useLang();

  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [hoverImage, setHoverImage] = useState<string | null>(null);

  const backendURL = import.meta.env.VITE_API_URL;
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get<Temple>(`${backendURL}/api/temples/${id}`)
      .then((res) => setTemple(res.data))
      .catch((err) => {
        console.error("Error fetching temple:", err);
        setTemple(null);
      })
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  if (loading)
    return (
      <div className="pt-24 pb-20 flex items-center justify-center">
        <p className="text-orange-700 text-lg font-semibold">Loading temple details…</p>
      </div>
    );

  if (!temple)
    return (
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-6 text-center">
        <p className="text-red-600 font-semibold">Temple not found</p>
        <Link to="/temples" className="inline-block mt-4 text-orange-600 hover:underline">
          ← Back to Temples
        </Link>
      </div>
    );

  const images = temple.images && temple.images.length ? temple.images : ["/temple-placeholder.jpg"];
  const mainImage = images[activeImage] || images[0];
  const displayedImage = hoverImage ?? mainImage; // hover preview takes precedence

  const scrollTo = (id?: string) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pt-20 pb-20" style={{ background: "linear-gradient(to bottom, #fff6e1 0%, #fffdf7 30%, #ffffff 100%)" }}>
      <ScrollingBorder />

      <div className="max-w-6xl mx-auto px-6">
        {/* Top header: title + actions */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-[Playfair] font-bold text-orange-900 leading-tight mb-3 flex items-center gap-4">
              <span className="inline-block bg-orange-50 p-3 rounded-full shadow-inner border border-orange-100">
                <IconTemple />
              </span>
              <span>{getText(temple.name) || "Untitled Temple"}</span>
            </h1>

            <p className="text-gray-700 mb-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-gray-600">
                <IconLocation /> <strong className="text-gray-800">Location:</strong>
              </span>
              <span className="ml-1">{getText(temple.location) || "Location not specified"}</span>
            </p>

            <div className="flex items-center gap-4 mt-3">
              <Link to="/temples" className="text-sm text-orange-600 hover:underline">
                ← Back to Temples
              </Link>

              {temple.published === false && (
                <span className="ml-3 inline-block text-sm text-red-600 bg-red-50 px-3 py-1 rounded">Unpublished</span>
              )}
            </div>
          </div>

          {/* mini nav (sticky on large screens) */}
          <div className="w-full lg:w-[320px] sticky top-28 self-start" ref={navRef}>
            <div className="bg-white rounded-2xl p-4 shadow-sm border">
              <p className="text-sm text-gray-600 mb-2">Quick links</p>
              <nav className="flex flex-col gap-2">
                <button onClick={() => scrollTo("about")} className="text-left text-sm text-gray-700 hover:text-orange-700">About</button>
                <button onClick={() => scrollTo("religion")} className="text-left text-sm text-gray-700 hover:text-orange-700">Religious Info</button>
                <button onClick={() => scrollTo("darshan")} className="text-left text-sm text-gray-700 hover:text-orange-700">Darshan & Aarti</button>
                <button onClick={() => scrollTo("visitor")} className="text-left text-sm text-gray-700 hover:text-orange-700">Visitor Info</button>
                <button onClick={() => scrollTo("travel")} className="text-left text-sm text-gray-700 hover:text-orange-700">Travel</button>
                <button onClick={() => scrollTo("nearby")} className="text-left text-sm text-gray-700 hover:text-orange-700">Nearby</button>
              </nav>
            </div>

            {/* small meta */}
            <div className="mt-4 bg-orange-50 border rounded-lg p-3 text-sm">
              <p className="text-gray-700"><strong>Published:</strong> {temple.published ? "Yes" : "No"}</p>
              {temple.createdAt && <p className="text-gray-600 mt-1">Created: {new Date(temple.createdAt).toLocaleDateString()}</p>}
            </div>
          </div>
        </div>

        {/* Main content: gallery + core info */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gallery */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden bg-white border shadow-lg">
              {/* Main Image Container - Option A: fixed height, object-contain */}
              <div className="relative w-full h-[500px] bg-gradient-to-b from-white via-[#fff8ec] to-white flex items-center justify-center">
                {/* Decorative devotional glow behind image */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-11/12 h-4/5 rounded-2xl blur-[28px] opacity-30" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,178,64,0.18), rgba(255,240,220,0.02))' }} />
                </div>

                <img
                  src={displayedImage}
                  alt={getText(temple.name)}
                  loading="lazy"
                  className="relative z-10 max-w-full max-h-full object-contain transition-opacity duration-300 ease-in-out"
                  style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                />

                {/* small caption overlay */}
                <div className="absolute left-6 bottom-6 bg-white/70 backdrop-blur rounded-full px-3 py-1 text-sm text-gray-700 shadow-sm">
                  {activeImage + 1}/{images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="p-4 bg-white flex gap-4 overflow-x-auto items-center">
                {images.map((src, idx) => {
                  const isActive = idx === activeImage;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      onMouseEnter={() => setHoverImage(src)}
                      onMouseLeave={() => setHoverImage(null)}
                      aria-label={`Show image ${idx + 1}`}
                      className={`flex-shrink-0 rounded-xl overflow-hidden border transition-all duration-200 shadow-sm focus:outline-none ${
                        isActive ? 'border-orange-400 ring-2 ring-orange-200 scale-105' : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ width: isActive ? 180 : 120, height: isActive ? 120 : 72 }}
                    >
                      <img src={src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  );
                })}

                {/* show an elegant placeholder if only one image */}
                {images.length === 1 && (
                  <div className="ml-2 text-sm text-gray-500">Single image — add more to enable previews</div>
                )}
              </div>
            </div>

            {/* About */}
            <Section id="about" title="About the Temple">
              <p className="text-gray-700">{getText(temple.about) || "No description available for this temple."}</p>
            </Section>

            {/* Religious & historical info */}
            <Section id="religion" title="Religious & Historical Information">
              <LabelValue label="Main Deity" value={getText(temple.mainDeity) || undefined} />
              <LabelValue label="Deity Description" value={getText(temple.deityDescription) || undefined} />
              <LabelValue label="Significance" value={getText(temple.significance) || undefined} />
              <LabelValue label="History" value={getText(temple.history) || undefined} />
              <LabelValue label="Architecture" value={getText(temple.architecture) || undefined} />
              <LabelValue label="Builder / Trust" value={getText(temple.builderOrTrust) || undefined} />
              <LabelValue label="Consecration Date" value={temple.consecrationDate || undefined} />
            </Section>

            {/* darshan & aarti */}
            <Section id="darshan" title="Darshan & Aarti">
              <LabelValue label="Darshan Timings" value={getText(temple.darshanTiming) || undefined} />
              {temple.aartiTimings ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Aarti Timings</p>
                  <div className="text-gray-700 mt-1 space-y-1">
                    <div className="flex items-center gap-2"><IconClock /> <span><strong>Morning:</strong> {temple.aartiTimings.morning || "-"}</span></div>
                    <div className="flex items-center gap-2"><IconClock /> <span><strong>Shringar:</strong> {temple.aartiTimings.shringar || "-"}</span></div>
                    <div className="flex items-center gap-2"><IconClock /> <span><strong>Shayan:</strong> {temple.aartiTimings.shayan || "-"}</span></div>
                  </div>
                </div>
              ) : null}

              <LabelValue label="Special Pooja Info" value={getText(temple.specialPoojaInfo) || undefined} />
            </Section>
          </div>

          {/* Right column: visitor, travel, nearby condensed */}
          <aside className="space-y-6">
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <h4 className="text-lg font-semibold text-orange-700 mb-2">Visitor Information</h4>
              <LabelValue label="Dress Code" value={getText(temple.dressCode) || undefined} />
              <LabelValue label="Entry Rules" value={getText(temple.entryRules) || undefined} />
              {temple.prohibitedItems && temple.prohibitedItems.length > 0 && (
                <LabelValue label="Prohibited Items" value={temple.prohibitedItems.join(", ")} />
              )}
              <p className="text-gray-700"><strong>Locker Facility:</strong> {temple.lockerFacility ? "Available" : "Not Available"}</p>
            </div>

            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <h4 className="text-lg font-semibold text-orange-700 mb-2">Travel & Connectivity</h4>
              <LabelValue label="How to Reach" value={getText(temple.howToReach) || undefined} />
              <LabelValue label="Nearest Airport" value={getText(temple.nearestAirport) || undefined} />
              <LabelValue label="Nearest Railway" value={getText(temple.nearestRailway) || undefined} />
              <LabelValue label="Road Connectivity" value={getText(temple.roadConnectivity) || undefined} />
            </div>

            {temple.mapLocation?.lat && temple.mapLocation?.lng && (
              <div className="bg-white border rounded-2xl p-3 shadow-sm">
                <h4 className="text-lg font-semibold text-orange-700 mb-2">Map</h4>
                <iframe
                  title="Temple location"
                  className="w-full h-48 rounded-lg border"
                  src={`https://www.google.com/maps?q=${temple.mapLocation.lat},${temple.mapLocation.lng}&output=embed`}
                />
              </div>
            )}

            {/* Nearby */}
            {temple.nearbyPlaces && temple.nearbyPlaces.length > 0 && (
              <div className="bg-orange-50 border rounded-2xl p-4 shadow-sm">
                <h4 className="text-lg font-semibold text-orange-700 mb-2">Nearby Places</h4>
                <div className="space-y-2">
                  {temple.nearbyPlaces.map((p, idx) => (
                    <div key={idx} className="p-2 rounded-md hover:bg-orange-100 transition">
                      <p className="font-medium text-gray-800">{getText(p.name)}</p>
                      <p className="text-gray-600 text-sm">{getText(p.description)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Meta and actions */}
        <div className="mt-10 bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-gray-700"><strong>Published:</strong> {temple.published ? "Yes" : "No"}</p>
              {temple.createdAt && <p className="text-gray-600 mt-1">Created: {new Date(temple.createdAt).toLocaleString()}</p>}
              {temple.updatedAt && <p className="text-gray-600">Updated: {new Date(temple.updatedAt).toLocaleString()}</p>}
            </div>

            <div className="flex items-center gap-3">
              <Link to={`/temples/${temple._id}/edit`} className="text-sm bg-white border px-4 py-2 rounded-lg hover:shadow-md">Edit</Link>
              <a href={`mailto:info@yourtemple.org?subject=Booking for ${encodeURIComponent(getText(temple.name))}`} className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:shadow-lg">Request Booking</a>
            </div>
          </div>
        </div>
      </div>

      <ScrollingBorder flipped />
    </div>
  );
}
