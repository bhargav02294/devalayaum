// src/pages/PujaView.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

interface Puja {
  _id: string;
  name: Record<string, string>;
  category: string;
  subCategory?: string;
  image?: string;
  images?: string[];
  videoUrl?: string;
  deityAssociated?: Record<string, string>;
  description?: Record<string, string>;
  whyPerform?: Record<string, string>;
  benefits?: Record<string, string>;
  procedure?: Record<string, string>;
  mantra?: Record<string, string>;
  duration?: string;
  materialsRequired?: Record<string, string>;
  availableAt?: Record<string, string>[];
  placesDescription?: Record<string, string>;
  packages?: {
    key: string;
    title: Record<string, string>;
    price?: number;
    discountPrice?: number;
    details?: Record<string, string>;
    benefits?: Record<string, string>;
  }[];
}

const TABS = [
  "Overview",
  "Benefits",
  "Procedure",
  "Mantra",
  "Materials",
  "Availability",
  "Packages",
] as const;
type TabKey = (typeof TABS)[number];

// explicit package item type to avoid index type errors
type PackageItem = {
  key: string;
  title: Record<string, string>;
  price?: number;
  discountPrice?: number;
  details?: Record<string, string>;
  benefits?: Record<string, string>;
};

export default function PujaView() {
  const { id } = useParams<{ id: string }>();
  const [puja, setPuja] = useState<Puja | null>(null);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_API_URL;
  const lang = i18n.language || "en";

  // gallery & video state
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoverPreview, setHoverPreview] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>("Overview");
  const [videoOpen, setVideoOpen] = useState(false);

  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const fetch = async () => {
      try {
        const res = await axios.get<Puja>(`${backendURL}/api/pujas/${id}`);
        setPuja(res.data);
        setActiveIndex(0);
      } catch (err) {
        console.error("Failed to fetch puja:", err);
        setPuja(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, backendURL]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center">
        <p className="text-orange-700 text-lg font-semibold">Loading puja details…</p>
      </div>
    );
  }

  if (!puja) {
    return (
      <div className="pt-24 pb-20 max-w-3xl mx-auto px-6 text-center">
        <p className="text-red-600 font-semibold">Puja not found</p>
        <Link to="/pujas" className="inline-block mt-4 text-orange-600 hover:underline">
          ← Back to Pujas
        </Link>
      </div>
    );
  }

  // prepare gallery images (fallbacks)
  const gallery = (puja.images && puja.images.length ? puja.images.slice() : []);
  if (puja.image && gallery.indexOf(puja.image) === -1) gallery.unshift(puja.image);
  if (gallery.length === 0) gallery.push("/puja-placeholder.jpg");

  const displayed = hoverPreview ?? gallery[activeIndex];

  // helper for packages safe text (use explicit PackageItem)
  const packageTitle = (pkg: PackageItem) => t(pkg.title) || pkg.key.toUpperCase();

  // small utilities
  const glow = "shadow-[0_8px_30px_rgba(255,153,51,0.14)]";
  const cardBg = "bg-white";

  // normalize availableAt t() usage
  const renderAvailableAt = (loc?: Record<string, string>) => {
    if (!loc) return "";
    return t(loc);
  };

  return (
    <div className="pt-20 pb-24 bg-gradient-to-b from-[#fffaf3] via-[#fff7ee] to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Header: breadcrumbs + title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <nav className="text-sm text-gray-500 mb-2">
              <Link to="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/pujas" className="hover:underline">Pujas</Link>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-[Marcellus] text-orange-900 font-bold leading-tight">
              {t(puja.name)}
            </h1>
            <p className="text-gray-700 mt-2">
              <span className="font-medium">{puja.category}</span>
              {puja.subCategory ? <span className="text-gray-500"> • {puja.subCategory}</span> : null}
              {puja.duration ? <span className="ml-3 text-sm text-gray-500">• {puja.duration}</span> : null}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick book CTA */}
            <Link
              to={`/pujas/${puja._id}/book`}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Book Puja
            </Link>

            {/* Watch video quick open */}
            {puja.videoUrl && (
              <button
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-2 border border-orange-200 px-3 py-2 rounded-lg text-orange-700 hover:bg-orange-50"
              >
                ▶ Watch Video
              </button>
            )}
          </div>
        </div>

        {/* TOP GALLERY + RIGHT SUMMARY (desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery - full width top for option B */}
          <div className="lg:col-span-8">
            <div className={`rounded-2xl overflow-hidden ${glow} bg-white`}>
              <div className="relative bg-white flex items-center justify-center h-[520px]">
                {/* big image */}
                <img
                  src={displayed}
                  alt={t(puja.name)}
                  className="max-w-full max-h-full object-contain"
                />

                {/* video overlay icon on main image */}
                {puja.videoUrl && (
                  <button
                    aria-label="Open video"
                    onClick={() => setVideoOpen(true)}
                    className="absolute right-6 bottom-6 inline-flex items-center gap-2 bg-white/90 text-orange-700 px-3 py-2 rounded-full shadow"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M5 3v18l15-9L5 3z" fill="currentColor" /></svg>
                    <span className="text-sm font-medium">Play</span>
                  </button>
                )}
              </div>

              {/* thumbnails strip */}
              <div className="p-4 bg-gradient-to-r from-white to-[#fff8ec]">
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {gallery.map((g, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={idx}
                        onMouseEnter={() => setHoverPreview(g)}
                        onMouseLeave={() => setHoverPreview(null)}
                        onClick={() => { setActiveIndex(idx); setHoverPreview(null); }}
                        className={`flex-shrink-0 rounded-lg overflow-hidden transition-transform ${
                          isActive ? "scale-105 ring-2 ring-orange-200 shadow-lg" : "hover:scale-105"
                        }`}
                        style={{ width: isActive ? 160 : 120, height: isActive ? 100 : 72 }}
                        aria-label={`Thumbnail ${idx + 1}`}
                      >
                        <img src={g} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right summary column */}
          <aside className="lg:col-span-4">
            <div className={`rounded-2xl p-6 ${cardBg} ${glow}`}>
              <h3 className="text-xl font-semibold text-orange-700 mb-3">Quick Info</h3>
              {puja.deityAssociated && (
                <p className="text-gray-800 mb-2"><strong>Deity: </strong>{t(puja.deityAssociated)}</p>
              )}

              <p className="text-gray-700 mb-2 leading-relaxed">{t(puja.description)?.slice(0, 200) || ""}{t(puja.description) && t(puja.description).length > 200 ? "..." : ""}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-orange-50 text-center">
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-800">{puja.category}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 text-center">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium text-gray-800">{puja.duration || "Varies"}</p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <Link to={`/pujas/${puja._id}/book`} className="flex-1 inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg">
                  Book Now
                </Link>
                <a
                  href={`mailto:info@yourtemple.org?subject=Booking for ${encodeURIComponent(t(puja.name))}`}
                  className="inline-flex items-center justify-center gap-2 border rounded-lg px-3 py-2 text-orange-700 hover:bg-orange-50"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* small devotional note */}
            <div className="mt-6 rounded-xl p-4 bg-gradient-to-b from-[#fff8ec] to-white text-gray-700">
              <p className="text-sm italic">Offer this puja with devotion. For special requests you can contact the temple trust.</p>
            </div>
          </aside>
        </div>

        {/* TABS */}
        <div className="mt-10">
          <div className="flex gap-3 flex-wrap">
            {TABS.map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  tab === k ? "bg-orange-600 text-white shadow" : "bg-white border text-gray-700"
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {/* Overview */}
            {tab === "Overview" && (
              <div className="prose max-w-none text-gray-800">
                <h2 className="text-2xl font-[Playfair] text-orange-800 mb-3">Overview</h2>
                <p className="mb-4">{t(puja.description) || "No overview available."}</p>

                {puja.whyPerform && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-orange-700">Why Perform</h3>
                    <p className="text-gray-700">{t(puja.whyPerform)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Benefits */}
            {tab === "Benefits" && (
              <div className="text-gray-800">
                <h2 className="text-2xl font-[Playfair] text-orange-800 mb-3">Benefits</h2>
                <p>{t(puja.benefits) || "Benefits not specified."}</p>
              </div>
            )}

            {/* Procedure */}
            {tab === "Procedure" && (
              <div className="text-gray-800">
                <h2 className="text-2xl font-[Playfair] text-orange-800 mb-3">Procedure</h2>
                <div className="text-gray-700 whitespace-pre-line">{t(puja.procedure) || "Procedure details not available."}</div>
              </div>
            )}

            {/* Mantra */}
            {tab === "Mantra" && (
              <div className="text-gray-800">
                <h2 className="text-2xl font-[Playfair] text-orange-800 mb-3">Main Mantra</h2>
                <div className="text-gray-900 font-medium italic">{t(puja.mantra) || "No mantra provided."}</div>
              </div>
            )}

            {/* Materials */}
            {tab === "Materials" && (
              <div className="text-gray-800">
                <h2 className="text-2xl font-[Playfair] text-orange-800 mb-3">Materials Required</h2>
                <p>{t(puja.materialsRequired) || "Materials not specified."}</p>
              </div>
            )}

            {/* Availability */}
            {tab === "Availability" && (
              <div className="text-gray-800">
                <h2 className="text-2xl font-[Playfair] text-orange-800 mb-3">Available At</h2>
                {puja.availableAt && puja.availableAt.length > 0 ? (
                  <ul className="list-disc ml-5 text-gray-700">
                    {puja.availableAt.map((loc, i) => (
                      <li key={i}>{renderAvailableAt(loc)}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">Availability not specified.</p>
                )}

                {puja.placesDescription && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Place Details</h4>
                    <p className="text-gray-700">{t(puja.placesDescription)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Packages */}
            {tab === "Packages" && (
              <div>
                <h2 className="text-2xl font-[Playfair] text-orange-800 mb-6">Puja Packages</h2>
                {puja.packages && puja.packages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {puja.packages.map((pkg) => (
                      <div key={pkg.key} className={`rounded-2xl p-5 ${cardBg} ${glow}`}>
                        <h3 className="text-xl font-bold text-orange-700">{packageTitle(pkg as PackageItem)}</h3>
                        <div className="mt-2">
                          <p className="text-2xl font-semibold text-gray-900">
                            ₹{(pkg as PackageItem).discountPrice ?? (pkg as PackageItem).price ?? 0}
                            {(pkg as PackageItem).discountPrice && (pkg as PackageItem).price && (
                              <span className="text-sm line-through text-gray-500 ml-3">₹{(pkg as PackageItem).price}</span>
                            )}
                          </p>
                          {pkg.details && <p className="text-gray-700 mt-2">{t(pkg.details)}</p>}
                          {pkg.benefits && <p className="text-gray-700 mt-2 italic">{t(pkg.benefits)}</p>}
                        </div>

                        <Link
                          to={`/pujas/${puja._id}/book/${pkg.key}`}
                          className="mt-4 block text-center bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                        >
                          Book {packageTitle(pkg as PackageItem)}
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">No packages available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoOpen && puja.videoUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div className="max-w-4xl w-full bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-2">
              <button onClick={() => setVideoOpen(false)} className="text-gray-700 px-3 py-1">Close</button>
            </div>
            <div className="aspect-video">
              {puja.videoUrl.includes("youtube.com") || puja.videoUrl.includes("youtu.be") ? (
                <iframe
                  title="Puja Video"
                  src={puja.videoUrl.includes("embed") ? puja.videoUrl : puja.videoUrl.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video controls className="w-full h-full bg-black">
                  <source src={puja.videoUrl} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
