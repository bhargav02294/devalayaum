// src/pages/PujaView.tsx
// PROFESSIONAL PREMIUM PUJA VIEW PAGE — PERFECTLY MATCHED TO TEMPLE PAGE

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import i18n from "../i18n";

/* ----------------------------------------------------------
   Interfaces
---------------------------------------------------------- */
interface Puja {
  _id: string;
  name: Record<string, string>;
  category: string;
  subCategory?: string;

  image?: string;
  images?: string[];
  videoUrl?: string;

  description?: Record<string, string>;
  whyPerform?: Record<string, string>;
  benefits?: Record<string, string>;
  procedure?: Record<string, string>;
  mantra?: Record<string, string>;
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

type PujaPackage = NonNullable<Puja["packages"]>[number];

/* ----------------------------------------------------------
   Main Page
---------------------------------------------------------- */
export default function PujaView() {
  const { id } = useParams<{ id: string }>();
  const lang = i18n.language || "en";
  const backendURL = import.meta.env.VITE_API_URL;

  const [puja, setPuja] = useState<Puja | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPreview, setHoverPreview] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const t = (obj?: Record<string, string>) => obj?.[lang] || obj?.en || "";

  /* Load Merriweather */
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

  /* Fetch Puja */
  useEffect(() => {
    axios
      .get(`${backendURL}/api/pujas/${id}`)
      .then((res) => setPuja(res.data))
      .catch(() => setPuja(null))
      .finally(() => setLoading(false));
  }, [id, backendURL]);

  if (loading)
    return (
      <div className="pt-24 flex justify-center text-gray-500 text-lg">
        Loading Puja…
      </div>
    );

  if (!puja)
    return (
      <div className="pt-24 flex justify-center text-red-600 text-lg">
        Puja not found.
      </div>
    );

  /* Build Gallery */
  const gallery = [...(puja.images || [])];
  if (puja.image && !gallery.includes(puja.image)) gallery.unshift(puja.image);
  if (gallery.length === 0) gallery.push("/puja-placeholder.jpg");

  const mainImg = hoverPreview || gallery[activeIndex];
  const glow = "shadow-[0_4px_20px_rgba(255,153,51,0.18)]";

  /* Smooth Scroll */
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
  };

  return (
    <div
      className="pt-20 pb-20"
      style={{ background: "linear-gradient(to bottom, #fff7e3, #fffdf8, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* -------------------------------------- */}
        {/* MAIN PUJA TITLE - EXACT TEMPLE STYLE */}
        {/* -------------------------------------- */}
        <h1 className="mt-8 text-2xl lg:text-3xl font-[Marcellus] text-orange-700 font-bold">
          {t(puja.name)}
        </h1>

        <p
          className="text-gray-700 mt-2"
          style={{ fontFamily: "'Merriweather', serif" }}
        >
          {puja.category} {puja.subCategory ? `› ${puja.subCategory}` : ""}
        </p>

        {/* -------------------------------------- */}
        {/* IMAGE SECTION */}
        {/* -------------------------------------- */}
        <div className="flex justify-center mt-8 mb-14">
          <div className={`rounded-3xl overflow-hidden bg-white p-4 w-full max-w-3xl ${glow}`}>
            <div className="h-[240px] md:h-[300px] lg:h-[340px] flex justify-center items-center bg-gradient-to-b from-white via-[#fff4dd] to-white rounded-xl relative">
              <img src={mainImg} className="max-w-full max-h-full object-contain" />

              {puja.videoUrl && (
                <button
                  onClick={() => setVideoOpen(true)}
                  className="absolute bottom-3 right-3 px-4 py-2 text-sm rounded-full bg-white/90 text-orange-700 shadow hover:bg-white"
                  style={{ fontFamily: "'Merriweather', serif" }}
                >
                  ▶ Play Video
                </button>
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="p-4 flex gap-4 overflow-x-auto bg-[#fffaf5] rounded-xl mt-4 justify-center">
              {gallery.map((src, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setHoverPreview(src)}
                  onMouseLeave={() => setHoverPreview(null)}
                  onClick={() => setActiveIndex(idx)}
                  className={`rounded-xl overflow-hidden transition-all ${
                    idx === activeIndex ? "ring-2 ring-orange-300 scale-105 shadow" : "hover:scale-105"
                  }`}
                  style={{ width: 100, height: 70 }}
                >
                  <img src={src} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* -------------------------------------- */}
        {/* QUICK NAV BUTTONS */}
        {/* -------------------------------------- */}
        <div className="flex flex-wrap gap-2 mb-10 justify-start">
          {[
            ["overview", "Overview"],
            ["benefits", "Benefits"],
            ["procedure", "Procedure"],
            ["mantra", "Main Mantra"],
            ["materials", "Materials Required"],
            ["availability", "Availability"],
            ["packages", "Puja Packages"],
          ].map(([target, label]) => (
            <button
              key={target}
              onClick={() => scrollTo(target)}
              className={`rounded-full px-4 py-1.5 text-sm bg-white shadow hover:bg-orange-50 text-gray-700 transition ${glow}`}
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* -------------------------------------- */}
        {/* SECTIONS (MATCH TEMPLE PAGE EXACTLY) */}
        {/* -------------------------------------- */}

        <Section id="overview" title="Overview">
          <p>{t(puja.description)}</p>
          {puja.whyPerform && (
            <p className="mt-3">
              <span className="text-lg font-semibold text-orange-700">Why Perform:</span> {t(puja.whyPerform)}
            </p>
          )}
        </Section>

        <Section id="benefits" title="Benefits">
          <p>{t(puja.benefits)}</p>
        </Section>

        <Section id="procedure" title="Procedure">
          <p className="whitespace-pre-line">{t(puja.procedure)}</p>
        </Section>

        <Section id="mantra" title="Main Mantra">
          <p className="italic">{t(puja.mantra)}</p>
        </Section>

        <Section id="materials" title="Materials Required">
          <p>{t(puja.materialsRequired)}</p>
        </Section>

        <Section id="availability" title="Availability">
          {puja.availableAt?.length ? (
            <ul className="list-disc ml-6">
              {puja.availableAt.map((a, i) => (
                <li key={i}>{t(a)}</li>
              ))}
            </ul>
          ) : (
            <p>Not specified.</p>
          )}

          {puja.placesDescription && <p className="mt-2">{t(puja.placesDescription)}</p>}
        </Section>

        <Section id="packages" title="Puja Packages">
          {puja.packages?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {puja.packages.map((pkg) => (
                <PujaPackageCard key={pkg.key} pkg={pkg} pujaId={puja._id} />
              ))}
            </div>
          ) : (
            <p>No packages available.</p>
          )}
        </Section>

      </div>

      {videoOpen && puja.videoUrl && (
        <VideoPopup url={puja.videoUrl} onClose={() => setVideoOpen(false)} />
      )}
    </div>
  );
}

/* ----------------------------------------------------------
   Section = EXACT Temple Section Style
---------------------------------------------------------- */
interface SectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mt-12">
      <h2
        className="text-2xl text-orange-800 font-semibold mb-4"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        {title}
      </h2>

      <div
        className="text-gray-700 leading-relaxed"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        {children}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------
   Package Card — Fonts & Colors matched perfectly
---------------------------------------------------------- */
interface PujaPackageCardProps {
  pkg: PujaPackage;
  pujaId: string;
}

function PujaPackageCard({ pkg, pujaId }: PujaPackageCardProps) {
  const tx = (o?: Record<string, string>) => o?.[i18n.language] || o?.en || "";

  return (
    <div className={`p-6 rounded-2xl bg-white ${"shadow-[0_4px_20px_rgba(255,153,51,0.18)]"}`}>
      <h3
        className="text-lg font-semibold text-orange-700 mb-1"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        {tx(pkg.title)}
      </h3>

      <p className="text-2xl font-bold text-gray-800 mt-1">
        ₹{pkg.discountPrice || pkg.price}
        {pkg.discountPrice && pkg.price && (
          <span className="ml-2 text-sm text-gray-500 line-through">₹{pkg.price}</span>
        )}
      </p>

      {pkg.details && <p className="mt-2 text-gray-700">{tx(pkg.details)}</p>}
      {pkg.benefits && <p className="mt-2 text-gray-700 italic">{tx(pkg.benefits)}</p>}

      <Link
        to={`/pujas/${pujaId}/book/${pkg.key}`}
        className="mt-5 block text-center bg-orange-700 text-white py-2 rounded-lg hover:bg-orange-800"
        style={{ fontFamily: "'Merriweather', serif" }}
      >
        Book Now
      </Link>
    </div>
  );
}

/* ----------------------------------------------------------
   Video Popup — Clean
---------------------------------------------------------- */
interface VideoPopupProps {
  url: string;
  onClose: () => void;
}

function VideoPopup({ url, onClose }: VideoPopupProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-3">
          <button onClick={onClose}>✕</button>
        </div>

        <div className="aspect-video">
          {url.includes("youtube") ? (
            <iframe
              className="w-full h-full"
              src={url.replace("watch?v=", "embed/")}
              allowFullScreen
            />
          ) : (
            <video src={url} controls className="w-full h-full" />
          )}
        </div>
      </div>
    </div>
  );
}
