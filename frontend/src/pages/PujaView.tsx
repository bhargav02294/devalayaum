// src/pages/PujaView.tsx
// PREMIUM PUJA VIEWER — Professional Devotional Theme (Final)
// Buttons use a professional sans font (title remains Marcellus)

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

// FIX TYPE ERROR
type PujaPackage = NonNullable<Puja["packages"]>[number];

export default function PujaView() {
  const { id } = useParams<{ id: string }>();
  const lang = i18n.language || "en";
  const backendURL = import.meta.env.VITE_API_URL;

  const [puja, setPuja] = useState<Puja | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPreview, setHoverPreview] = useState<string | null>(null);

  const [videoOpen, setVideoOpen] = useState(false);

  const t = (o?: Record<string, string>) => o?.[lang] || o?.en || "";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/pujas/${id}`);
        setPuja(res.data);
      } catch (e) {
        console.error(e);
        setPuja(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, backendURL]);

  if (loading) {
    return (
      <div className="pt-24 flex justify-center text-lg text-gray-500">
        Loading Puja…
      </div>
    );
  }

  if (!puja) {
    return (
      <div className="pt-24 flex justify-center text-lg text-red-600">
        Puja not found.
      </div>
    );
  }

  const gallery = [...(puja.images || [])];
  if (puja.image && !gallery.includes(puja.image)) gallery.unshift(puja.image);
  if (gallery.length === 0) gallery.push("/puja-placeholder.jpg");

  const mainImg = hoverPreview || gallery[activeIndex];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
  };

  const packageTitle = (pkg: PujaPackage) => t(pkg.title) || pkg.key.toUpperCase();

  const glow = "shadow-[0_10px_30px_rgba(140,85,40,0.15)]"; // golden soft glow

  return (
    <div className="pt-20 pb-20 bg-gradient-to-b from-[#fff8ec] via-[#fffdf9] to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        <h1 className="mt-6 text-4xl lg:text-5xl font-[Marcellus] text-orange-900 font-bold flex items-center gap-4">
          {t(puja.name)}
        </h1>

        <p className="text-gray-700 mb-6">
          {puja.category} {puja.subCategory ? `› ${puja.subCategory}` : ""}
        </p>

        {/* QUICK VIEW BUTTONS — use professional sans font (do NOT change title font) */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => scrollTo("overview")}
            className="px-4 py-2 rounded-full bg-white border text-gray-700 hover:bg-[#ffefe0] font-sans font-medium"
          >
            Overview
          </button>
          <button
            onClick={() => scrollTo("benefits")}
            className="px-4 py-2 rounded-full bg-white border text-gray-700 hover:bg-[#ffefe0] font-sans font-medium"
          >
            Benefits
          </button>
          <button
            onClick={() => scrollTo("procedure")}
            className="px-4 py-2 rounded-full bg-white border text-gray-700 hover:bg-[#ffefe0] font-sans font-medium"
          >
            Procedure
          </button>
          <button
            onClick={() => scrollTo("mantra")}
            className="px-4 py-2 rounded-full bg-white border text-gray-700 hover:bg-[#ffefe0] font-sans font-medium"
          >
            Mantra
          </button>
          <button
            onClick={() => scrollTo("materials")}
            className="px-4 py-2 rounded-full bg-white border text-gray-700 hover:bg-[#ffefe0] font-sans font-medium"
          >
            Materials
          </button>
          <button
            onClick={() => scrollTo("availability")}
            className="px-4 py-2 rounded-full bg-white border text-gray-700 hover:bg-[#ffefe0] font-sans font-medium"
          >
            Availability
          </button>
          <button
            onClick={() => scrollTo("packages")}
            className="px-4 py-2 rounded-full bg-white border text-gray-700 hover:bg-[#ffefe0] font-sans font-medium"
          >
            Packages
          </button>
        </div>

        {/* GALLERY */}
        <div className={`rounded-3xl overflow-hidden bg-white ${glow}`}>
          <div className="h-[520px] flex justify-center items-center bg-gradient-to-b from-white to-[#fff3e2] relative">
            <img src={mainImg} className="max-w-full max-h-full object-contain" />

            {puja.videoUrl && (
              <button
                onClick={() => setVideoOpen(true)}
                className="absolute bottom-5 right-5 bg-white/90 text-[#8a3c0f] px-4 py-2 rounded-full shadow font-sans font-medium"
              >
                ▶ Play Video
              </button>
            )}
          </div>

          <div className="p-4 flex gap-4 overflow-x-auto bg-[#fffaf5]">
            {gallery.map((src, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setHoverPreview(src)}
                onMouseLeave={() => setHoverPreview(null)}
                onClick={() => setActiveIndex(idx)}
                className={`overflow-hidden rounded-xl transition-all ${idx === activeIndex ? "ring-2 ring-[#d9a06a] scale-105" : "hover:scale-105"}`}
                style={{ width: 130, height: 90 }}
              >
                <img src={src} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        {/* OVERVIEW */}
        <div id="overview" className="mt-12">
          <h2 className="text-3xl font-[Marcellus] text-[#6b2f0f] mb-3">Overview</h2>
          <p className="text-gray-700 leading-relaxed">{t(puja.description)}</p>

          {puja.whyPerform && (
            <p className="mt-4 text-gray-700"><strong>Why Perform:</strong> {t(puja.whyPerform)}</p>
          )}
        </div>

        {/* BENEFITS */}
        <div id="benefits" className="mt-12">
          <h2 className="text-3xl font-[Marcellus] text-[#6b2f0f] mb-3">Benefits</h2>
          <p className="text-gray-700">{t(puja.benefits)}</p>
        </div>

        {/* PROCEDURE */}
        <div id="procedure" className="mt-12">
          <h2 className="text-3xl font-[Marcellus] text-[#6b2f0f] mb-3">Procedure</h2>
          <p className="text-gray-700 whitespace-pre-line">{t(puja.procedure)}</p>
        </div>

        {/* MANTRA */}
        <div id="mantra" className="mt-12">
          <h2 className="text-3xl font-[Marcellus] text-[#6b2f0f] mb-3">Main Mantra</h2>
          <p className="text-gray-900 font-medium italic">{t(puja.mantra)}</p>
        </div>

        {/* MATERIALS */}
        <div id="materials" className="mt-12">
          <h2 className="text-3xl font-[Marcellus] text-[#6b2f0f] mb-3">Materials Required</h2>
          <p className="text-gray-700">{t(puja.materialsRequired)}</p>
        </div>

        {/* AVAILABILITY */}
        <div id="availability" className="mt-12">
          <h2 className="text-3xl font-[Marcellus] text-[#6b2f0f] mb-3">Availability</h2>
          {puja.availableAt?.length ? (
            <ul className="list-disc ml-6 text-gray-700">
              {puja.availableAt.map((a, i) => (
                <li key={i}>{t(a)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">Not specified.</p>
          )}

          {puja.placesDescription && (
            <p className="mt-3 text-gray-700">{t(puja.placesDescription)}</p>
          )}
        </div>

        {/* PACKAGES */}
        <div id="packages" className="mt-16">
          <h2 className="text-3xl font-[Marcellus] text-[#6b2f0f] mb-6">Puja Packages</h2>

          {puja.packages?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {puja.packages.map((pkg) => (
                <div key={pkg.key} className={`p-6 rounded-2xl bg-white ${glow}`}>
                  <h3 className="text-xl font-bold text-[#8a3c0f]">{packageTitle(pkg)}</h3>

                  <p className="text-2xl font-semibold text-gray-900 mt-2">
                    ₹{pkg.discountPrice || pkg.price}
                    {pkg.discountPrice && pkg.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{pkg.price}</span>
                    )}
                  </p>

                  {pkg.details && <p className="mt-2 text-gray-700">{t(pkg.details)}</p>}
                  {pkg.benefits && <p className="mt-2 text-gray-700 italic">{t(pkg.benefits)}</p>}

                  <Link to={`/pujas/${puja._id}/book/${pkg.key}`} className="mt-6 block text-center bg-[#8a3c0f] text-white px-4 py-2 rounded-lg hover:bg-[#5e290d] font-sans font-medium">
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">No packages available.</p>
          )}
        </div>
      </div>

      {/* VIDEO MODAL */}
      {videoOpen && puja.videoUrl && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50" onClick={() => setVideoOpen(false)}>
          <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-3">
              <button onClick={() => setVideoOpen(false)}>✕</button>
            </div>

            <div className="aspect-video">
              {(puja.videoUrl.includes("youtube") || puja.videoUrl.includes("youtu.be")) ? (
                <iframe className="w-full h-full" src={puja.videoUrl.replace("watch?v=", "embed/")} allowFullScreen />
              ) : (
                <video src={puja.videoUrl} controls className="w-full h-full bg-black" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
