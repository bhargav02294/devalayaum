// src/pages/TempleView.tsx
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
    <div className="mb-2">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  );
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-8 scroll-mt-[92px]">
      <h3 className="text-2xl font-semibold text-orange-700 mb-4">{title}</h3>
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

  const backendURL = import.meta.env.VITE_API_URL;
  const navRef = useRef<HTMLDivElement | null>(null);

  // NAVBAR OFFSET (approximate; matches your Navbar) — used for anchor scrolling
  const NAVBAR_OFFSET = 92; // 76px navbar + 16px safe gap

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

  useEffect(() => {
    // reset active image index when images change
    setActiveImage(0);
  }, [temple?.images]);

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

  // ensure images is a proper string[] and non-empty
// ensure images is a guaranteed non-empty string[]
const images: string[] =
  temple.images && temple.images.length > 0
    ? temple.images
    : ["/temple-placeholder.jpg"];

// clamp index safely
const safeIndex =
  Number.isFinite(activeImage)
    ? Math.min(Math.max(Math.floor(activeImage), 0), images.length - 1)
    : 0;

// runtime check + non-null assertion so TS won't complain
const mainImage: string = images.length > 0 ? images[safeIndex]! : "/temple-placeholder.jpg";


  const scrollTo = (id?: string) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY - NAVBAR_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="pt-20 pb-20" style={{ background: "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 20%, #ffffff 60%)" }}>
      <ScrollingBorder />

      <div className="max-w-6xl mx-auto px-6">
        {/* Top header: title */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-[Playfair] font-bold text-orange-800 leading-tight mb-3 flex items-center gap-3">
              <span className="inline-block bg-orange-50 p-2 rounded-full">
                <IconTemple />
              </span>
              <span>{getText(temple.name) || "Untitled Temple"}</span>
            </h1>

            <p className="text-gray-700 mb-3">
              <span className="inline-flex items-center gap-2 text-gray-600">
                <IconLocation /> <strong className="text-gray-800">Location:</strong>
              </span>{" "}
              <span className="ml-2">{getText(temple.location) || "Location not specified"}</span>
            </p>

            <div className="flex items-center gap-3 mt-3">
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
          {/* Gallery: show all images full-size stacked */}
          <div className="lg:col-span-2 space-y-6">
            {images.map((src, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden bg-white border shadow-sm">
                <img src={src} alt={`${getText(temple.name)}-${idx}`} className="w-full h-auto max-h-[900px] object-contain" />
              </div>
            ))}

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
        <div className="mt-8 bg-white border rounded-2xl p-6 shadow-sm">
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
